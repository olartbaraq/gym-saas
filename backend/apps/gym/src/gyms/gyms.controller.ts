import { Controller } from '@nestjs/common';
import { GymsService } from './gyms.service';
import {
  CreateGymDto,
  UpdateGymDto,
  GymsServiceController,
  GymId,
  GymsServiceControllerMethods,
  FindAllGymsDto,
  RemoveGymDto,
  handleError,
} from '@app/common';

@Controller()
@GymsServiceControllerMethods()
export class GymsController implements GymsServiceController {
  constructor(private readonly gymsService: GymsService) {}

  async createGym(createGymDto: CreateGymDto) {
    try {
      return await this.gymsService.create(createGymDto);
    } catch (error) {
      handleError(error);
      throw null;
    }
  }

  async findAllGyms(findAllGymsDto: FindAllGymsDto) {
    try {
      return await this.gymsService.findAll(findAllGymsDto);
    } catch (error) {
      handleError(error);
      throw null;
    }
  }

  async findOneGym(gymId: GymId) {
    try {
      return await this.gymsService.findOne(gymId.id);
    } catch (error) {
      handleError(error);
      throw null;
    }
  }

  async updateGym(updateGymDto: UpdateGymDto) {
    try {
      return await this.gymsService.update(updateGymDto.id, updateGymDto);
    } catch (error) {
      handleError(error);
      throw null;
    }
  }

  async removeGym(removeGymDto: RemoveGymDto) {
    try {
      return await this.gymsService.remove(removeGymDto.id);
    } catch (error) {
      handleError(error);
      throw null;
    }
  }
}
