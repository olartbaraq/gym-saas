import {
  AUTH_PACKAGE_NAME,
  CreateUserDto,
  User,
  USERS_SERVICE_NAME,
  UsersServiceClient,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService implements OnModuleInit {
  private usersService: UsersServiceClient;

  @Inject(AUTH_PACKAGE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit() {
    this.usersService =
      this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  create(createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  findOneByEmail(email: string): Promise<User> {
    return firstValueFrom(this.usersService.findOneUserByEmail({ email }));
  }

  findOne(id: string): Promise<User> {
    return firstValueFrom(this.usersService.findOneUser({ id }));
  }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;s
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
