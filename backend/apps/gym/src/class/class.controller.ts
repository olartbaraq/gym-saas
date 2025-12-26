import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller()
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @MessagePattern('createClass')
  create(@Payload() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  @MessagePattern('findAllClass')
  findAll() {
    return this.classService.findAll();
  }

  @MessagePattern('findOneClass')
  findOne(@Payload() id: number) {
    return this.classService.findOne(id);
  }

  @MessagePattern('updateClass')
  update(@Payload() updateClassDto: UpdateClassDto) {
    return this.classService.update(updateClassDto.id, updateClassDto);
  }

  @MessagePattern('removeClass')
  remove(@Payload() id: number) {
    return this.classService.remove(id);
  }
}
