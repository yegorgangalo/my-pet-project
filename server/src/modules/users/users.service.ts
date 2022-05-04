import { ROLES, CACHE_KEY, ENV } from '@mandruy/common/const';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/modules/roles/roles.service';
import { HttpCacheService } from 'src/modules/http-cache/http-cache.service';
import { FilesService } from '../files/files.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private roleService: RolesService,
    private httpCacheService: HttpCacheService,
    private filesService: FilesService,
    private configService: ConfigService,
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

  async activate(activateAccountKey: string) {
    const user = await this.userModel.findOne({ activateAccountKey });
    if (!user) {
      throw Error('Activation link is not correct');
    }
    user.isActivated = true;
    await user.save();
    this.httpCacheService.clearCache(CACHE_KEY.GET_USERS);
  }

  async uploadAvatar(userId: ObjectId, file: Express.Multer.File) {
    const user = await this.userModel.findById(userId);
    const fileName = await this.filesService.createFile(file);
    user.avatar = fileName;
    await user.save();
    this.httpCacheService.clearCache(CACHE_KEY.GET_USERS);
    const fileURL = this.configService.get(ENV.SERVER_URL) + '/' + fileName;
    return fileURL;
  }
}
