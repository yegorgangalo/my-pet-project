import { ROLES, CACHE_KEY } from 'src/common/const';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/modules/roles/roles.service';
import { HttpCacheService } from 'src/modules/http-cache/http-cache.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private roleService: RolesService,
    private httpCacheService: HttpCacheService,
  ) {}

  async getAll(): Promise<User[]> {
    const users = await this.userModel.find({}).populate('roles');
    return users;
  }

  async getOne(id: ObjectId): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .populate('comments')
      .populate('roles');
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const role = await this.roleService.getByValue(ROLES.TOURIST);
    const user = await this.userModel.create({
      ...dto,
      roles: [role._id],
    });
    this.httpCacheService.clearCache(CACHE_KEY.GET_USERS);
    const populatedUser = await user.populate('roles');
    return populatedUser;
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const user = await this.userModel.findByIdAndDelete(id);
    this.httpCacheService.clearCache(CACHE_KEY.GET_USERS);
    return user._id;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).populate('roles');
    return user;
  }

  async addRole({ userId, roleName }) {
    const role = await this.roleService.getByValue(roleName);
    const user = await this.userModel.findById(userId);
    if (!role || !user) {
      throw new HttpException(
        'Wrong role name or userId',
        HttpStatus.NOT_FOUND,
      );
    }

    const hasCurrentRole = user.roles.includes(role._id);
    if (hasCurrentRole) {
      throw new HttpException('User already has this role', HttpStatus.FOUND);
    }

    user.roles.push(role._id);
    const updatedUser = await user.save();
    return updatedUser;
  }

  async activate(activationLink: string) {
    const user = await this.userModel.findOne({ activationLink });
    if (!user) {
      throw Error('Activation link is not correct');
    }
    user.isActivated = true;
    await user.save();
    this.httpCacheService.clearCache(CACHE_KEY.GET_USERS);
  }
}
