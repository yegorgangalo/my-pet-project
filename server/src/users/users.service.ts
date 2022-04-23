import { ROLES } from '@mandruy/common/const/const';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private roleService: RolesService,
  ) {}

  async getAll(): Promise<User[]> {
    const users = await this.userModel.find({});
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
    const populatedUser = await user.populate('roles');
    return populatedUser;
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const user = await this.userModel.findByIdAndDelete(id);
    return user._id;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
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
  }
}
