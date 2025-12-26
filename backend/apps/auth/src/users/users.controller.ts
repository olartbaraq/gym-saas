import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UsersServiceController,
  CreateUserDto,
  UpdateUserDto,
  UsersServiceControllerMethods,
  User,
  UserId,
  FindAllUsersDto,
  Users,
  Message,
  FindAllUsersResponse,
  FindOneUserByEmailDto,
} from '@app/common';

@Controller()
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController {
  constructor(private readonly usersService: UsersService) {}

  async createUser(createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  async findAllUsers(findAllUsersDto: FindAllUsersDto) {
    const { data, total, page, limit } =
      await this.usersService.findAll(findAllUsersDto);
    return { data, total, page, limit };
  }

  async findOneUser(user: UserId) {
    return await this.usersService.findOne(user.id);
  }

  async findOneUserByEmail(findOneUserByEmailDto: FindOneUserByEmailDto) {
    return await this.usersService.findOneByEmail(findOneUserByEmailDto.email);
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    return await this.usersService.update(updateUserDto.id, updateUserDto);
  }

  async removeUser(user: UserId) {
    return await this.usersService.remove(user.id);
  }
}
