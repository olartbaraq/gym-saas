import {
  AUTH_PACKAGE_NAME,
  FindAllUsersDto,
  FindAllUsersResponse,
  FindOneUserByEmailDto,
  UpdateUserDto,
  User,
  UserId,
  USERS_SERVICE_NAME,
  UsersServiceClient,
  handleGrpcError,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, catchError } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable()
export class UsersGraphQLService implements OnModuleInit {
  private usersService: UsersServiceClient;

  @Inject(AUTH_PACKAGE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit() {
    this.usersService =
      this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  async findAllUsers(
    input: FindAllUsersDto,
  ): Promise<FindAllUsersResponse> {
    try {
      return await firstValueFrom(
        this.usersService.findAllUsers(input).pipe(
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

  async findOneUser(id: string): Promise<User> {
    try {
      const userId: UserId = { id };
      return await firstValueFrom(
        this.usersService.findOneUser(userId).pipe(
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

  async findOneUserByEmail(email: string): Promise<User> {
    try {
      const dto: FindOneUserByEmailDto = { email };
      return await firstValueFrom(
        this.usersService.findOneUserByEmail(dto).pipe(
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

  async updateUser(input: UpdateUserDto): Promise<User> {
    try {
      return await firstValueFrom(
        this.usersService.updateUser(input).pipe(
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

  async removeUser(id: string) {
    try {
      const userId: UserId = { id };
      return await firstValueFrom(
        this.usersService.removeUser(userId).pipe(
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
}

