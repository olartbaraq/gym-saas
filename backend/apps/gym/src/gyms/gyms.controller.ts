import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GymsService } from './gyms.service';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';

@Controller()
export class GymsController {
  constructor(private readonly gymsService: GymsService) {}

  @MessagePattern('createGym')
  create(@Payload() createGymDto: CreateGymDto) {
    return this.gymsService.create(createGymDto);
  }

  @MessagePattern('findAllGyms')
  findAll() {
    return this.gymsService.findAll();
  }

  @MessagePattern('findOneGym')
  findOne(@Payload() id: number) {
    return this.gymsService.findOne(id);
  }

  @MessagePattern('updateGym')
  update(@Payload() updateGymDto: UpdateGymDto) {
    return this.gymsService.update(updateGymDto.id, updateGymDto);
  }

  @MessagePattern('removeGym')
  remove(@Payload() id: number) {
    return this.gymsService.remove(id);
  }
}
