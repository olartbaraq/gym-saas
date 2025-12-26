import {
  AUTH_PACKAGE_NAME,
  CreateUserDto,
  User,
  USERS_SERVICE_NAME,
  UsersServiceClient,
  handleGrpcError,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, catchError } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable()
export class UsersService implements OnModuleInit {
  private usersService: UsersServiceClient;

  @Inject(AUTH_PACKAGE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit() {
    this.usersService =
      this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await firstValueFrom(
        this.usersService.createUser(createUserDto).pipe(
          catchError((error) => {
            handleGrpcError(error);
            return throwError(() => error);
          }),
        ),
      );
    } catch (error) {
      handleGrpcError(error);
      throw null; // This will never execute, but satisfies TypeScript
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await firstValueFrom(
        this.usersService.findOneUserByEmail({ email }).pipe(
          catchError((error) => {
            handleGrpcError(error);
            return throwError(() => error);
          }),
        ),
      );
    } catch (error) {
      handleGrpcError(error);
      throw null; // This will never execute, but satisfies TypeScript
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      return await firstValueFrom(
        this.usersService.findOneUser({ id }).pipe(
          catchError((error) => {
            handleGrpcError(error);
            return throwError(() => error);
          }),
        ),
      );
    } catch (error) {
      handleGrpcError(error);
      throw null; // This will never execute, but satisfies TypeScript
    }
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
