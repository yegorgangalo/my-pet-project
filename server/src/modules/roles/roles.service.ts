import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './roles.schema';
import { CreateRoleDto } from './create-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async getAll(): Promise<Role[]> {
    const roles = await this.roleModel.find({});
    return roles;
  }

  async getByValue(value: string): Promise<Role> {
    const role = await this.roleModel.findOne({ value });
    return role;
  }

  async create(dto: CreateRoleDto): Promise<Role> {
    const role = await this.roleModel.create({ ...dto });
    return role;
  }
}
