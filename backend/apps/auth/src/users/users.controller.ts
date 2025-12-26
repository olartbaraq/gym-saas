import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UsersServiceController,
  CreateUserDto,
  UpdateUserDto,
  UsersServiceControllerMethods,
  UserId,
  FindAllUsersDto,
  FindOneUserByEmailDto,
} from '@app/common';
import { handleError } from '@app/common';

@Controller()
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController {
  constructor(private readonly usersService: UsersService) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      handleError(error);
      throw null;
    }
  }

  async findAllUsers(findAllUsersDto: FindAllUsersDto) {
    try {
      const { data, total, page, limit } =
        await this.usersService.findAll(findAllUsersDto);
      return { data, total, page, limit };
    } catch (error) {
      handleError(error);
      throw null;
    }
  }

  async findOneUser(user: UserId) {
    try {
      return await this.usersService.findOne(user.id);
    } catch (error) {
      handleError(error);
      throw null;
    }
  }

  async findOneUserByEmail(findOneUserByEmailDto: FindOneUserByEmailDto) {
    try {
      return await this.usersService.findOneByEmail(
        findOneUserByEmailDto.email,
      );
    } catch (error) {
      handleError(error);
      throw null;
    }
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    try {
      return await this.usersService.update(updateUserDto.id, updateUserDto);
    } catch (error) {
      handleError(error);
      throw null;
    }
  }

  async removeUser(user: UserId) {
    try {
      return await this.usersService.remove(user.id);
    } catch (error) {
      handleError(error);
      throw null;
    }
  }
}
