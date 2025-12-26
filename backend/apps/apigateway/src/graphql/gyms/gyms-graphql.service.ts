import {
  FindAllGymsDto,
  FindAllGymsResponse,
  Gym,
  GymId,
  GYMS_PACKAGE_NAME,
  GYMS_SERVICE_NAME,
  GymsServiceClient,
  RemoveGymDto,
  UpdateGymDto,
  handleGrpcError,
  CreateGymDto,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, catchError } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable()
export class GymsGraphQLService implements OnModuleInit {
  private gymsService: GymsServiceClient;

  @Inject(GYMS_PACKAGE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit() {
    this.gymsService =
      this.client.getService<GymsServiceClient>(GYMS_SERVICE_NAME);
  }

  async findAllGyms(input: FindAllGymsDto): Promise<FindAllGymsResponse> {
    try {
      return await firstValueFrom(
        this.gymsService.findAllGyms(input).pipe(
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

  async findOneGym(id: string): Promise<Gym> {
    try {
      const gymId: GymId = { id };
      return await firstValueFrom(
        this.gymsService.findOneGym(gymId).pipe(
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

  async createGym(input: CreateGymDto): Promise<Gym> {
    try {
      return await firstValueFrom(
        this.gymsService.createGym(input).pipe(
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
  async updateGym(input: UpdateGymDto): Promise<Gym> {
    try {
      return await firstValueFrom(
        this.gymsService.updateGym(input).pipe(
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

  async removeGym(id: string) {
    try {
      const removeGymDto: RemoveGymDto = { id };
      return await firstValueFrom(
        this.gymsService.removeGym(removeGymDto).pipe(
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
