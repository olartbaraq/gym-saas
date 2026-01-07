import {
  CreateGymDto,
  UpdateGymDto,
  Gym,
  FindAllGymsDto,
  FindAllGymsResponse,
  Message,
} from '@app/common';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Gym as GymEntity } from './entities/gym.entity';

@Injectable()
export class GymsService {
  private readonly logger = new Logger(GymsService.name);

  constructor(
    @Inject('GYM_REPOSITORY')
    private readonly gymRepository: Repository<GymEntity>,
  ) {}

  private toGymDto(gym: GymEntity): Gym {
    return {
      id: gym.id,
      name: gym.name,
      slug: gym.slug,
      config: gym.config || undefined,
      createdAt: gym.createdAt.toISOString(),
      updatedAt: gym.updatedAt.toISOString(),
    };
  }

  async create(createGymDto: CreateGymDto): Promise<Gym> {
    try {
      const gym = this.gymRepository.create(createGymDto);
      const savedGym = await this.gymRepository.save(gym);

      this.logger.log('Gym created', {
        tag: 'Gym Service',
        data: savedGym,
      });

      return this.toGymDto(savedGym);
    } catch (error) {
      this.logger.error('Error creating gym', {
        tag: 'Gym Service',
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async findAll(query: FindAllGymsDto): Promise<FindAllGymsResponse> {
    try {
      const page = query?.page || 1;
      const limit = query?.limit || 50;
      const offset = query?.offset || (page - 1) * limit;

      const queryBuilder = this.gymRepository.createQueryBuilder('gym');

      // Apply filter conditions (AND logic)
      if (query?.filter?.name) {
        queryBuilder.andWhere('gym.name ILIKE :name', {
          name: `%${query.filter.name}%`,
        });
      }

      // Apply search conditions (OR logic across multiple fields)
      if (query?.search) {
        queryBuilder.andWhere(
          '(gym.name ILIKE :search OR gym.slug ILIKE :search)',
          { search: `%${query.search}%` },
        );
      }

      // Get total count
      const total = await queryBuilder.getCount();

      // Apply pagination and ordering
      const gyms = await queryBuilder
        .orderBy('gym.createdAt', 'DESC')
        .addOrderBy('gym.updatedAt', 'DESC')
        .skip(offset)
        .take(limit)
        .getMany();

      this.logger.log('Gyms found', {
        tag: 'Gym Service',
        total,
        data: { gyms },
        page,
        limit,
      });

      return {
        data: { gyms: gyms.map((gym) => this.toGymDto(gym)) },
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Error finding gyms', {
        tag: 'Gym Service',
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async findOne(id: string): Promise<Gym> {
    try {
      const gym = await this.gymRepository.findOne({ where: { id } });

      if (!gym) {
        throw new NotFoundException('Gym not found');
      }

      this.logger.log('Gym found', {
        tag: 'Gym Service',
        data: gym,
        gymId: gym.id,
      });

      return this.toGymDto(gym);
    } catch (error) {
      this.logger.error('Error finding gym', {
        tag: 'Gym Service',
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async update(id: string, updateGymDto: UpdateGymDto): Promise<Gym> {
    try {
      const gym = await this.gymRepository.findOne({ where: { id } });

      if (!gym) {
        throw new NotFoundException('Gym not found');
      }

      // Update only provided fields
      if (updateGymDto.name !== undefined) {
        gym.name = updateGymDto.name;
      }
      if (updateGymDto.slug !== undefined) {
        gym.slug = updateGymDto.slug;
      }
      if (updateGymDto.config !== undefined) {
        gym.config = updateGymDto.config;
      }

      const updatedGym = await this.gymRepository.save(gym);

      this.logger.log('Gym updated', {
        tag: 'Gym Service',
        data: updatedGym,
        gymId: id,
      });

      return this.toGymDto(updatedGym);
    } catch (error) {
      this.logger.error('Error updating gym', {
        tag: 'Gym Service',
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async remove(id: string): Promise<Message> {
    try {
      const gym = await this.gymRepository.findOne({ where: { id } });

      if (!gym) {
        throw new NotFoundException('Gym not found');
      }

      // Soft delete using TypeORM's soft delete
      await this.gymRepository.softRemove(gym);

      this.logger.log('Gym soft deleted', {
        tag: 'Gym Service',
        data: gym,
        gymId: gym.id,
      });

      return { message: 'Gym soft deleted' };
    } catch (error) {
      this.logger.error('Error soft deleting gym', {
        tag: 'Gym Service',
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
