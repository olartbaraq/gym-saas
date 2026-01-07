import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GymsGraphQLService } from './gyms-graphql.service';
import { Gym } from './entities/gym.entity';
import { FindAllGymsResponse } from './entities/find-all-gyms-response.entity';
import { Gyms } from './entities/gyms.entity';
import { Message } from '../common/entities/message.entity';
import { FindAllGymsInput } from './dto/find-all-gyms.input';
import { UpdateGymInput } from './dto/update-gym.input';
import { CreateGymInput } from './dto/create-gym.input';

import { CreateGymDto, FindAllGymsDto, UpdateGymDto } from '@app/common';

@Resolver(() => Gym)
export class GymsResolver {
  constructor(private readonly gymsGraphQLService: GymsGraphQLService) {}

  @Query(() => FindAllGymsResponse, { name: 'findAllGyms' })
  async findAllGyms(
    @Args('input', { nullable: true }) input?: FindAllGymsInput,
  ): Promise<FindAllGymsResponse> {
    const dto: FindAllGymsDto = {
      page: input?.page || 1,
      limit: input?.limit || 50,
      offset:
        input?.offset ||
        (input?.page ? (input.page - 1) * (input.limit || 50) : 0),
      search: input?.search,
      filter: input?.filter
        ? {
            name: input.filter.name,
          }
        : undefined,
    };

    const result = await this.gymsGraphQLService.findAllGyms(dto);

    // Transform gRPC response to GraphQL type
    return {
      data: {
        gyms: (result.data?.gyms || []) as Gym[],
      },
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Query(() => Gym, { name: 'findOneGym' })
  async findOneGym(@Args('id') id: string): Promise<Gym> {
    const result = await this.gymsGraphQLService.findOneGym(id);
    // Transform gRPC response to GraphQL type
    return result as Gym;
  }

  @Mutation(() => Gym, { name: 'updateGym' })
  async updateGym(@Args('input') input: UpdateGymInput): Promise<Gym> {
    const dto: UpdateGymDto = {
      id: input.id,
      name: input.name,
      slug: input.slug,
      config: input.config
        ? {
            logoUrl: input.config.logoUrl,
            email: input.config.email,
            phoneNumber: input.config.phoneNumber,
            websiteUrl: input.config.websiteUrl,
            policies: input.config.policies,
          }
        : undefined,
    };

    const result = await this.gymsGraphQLService.updateGym(dto);
    // Transform gRPC response to GraphQL type
    return result as Gym;
  }

  @Mutation(() => Gym, { name: 'createGym' })
  async createGym(@Args('input') input: CreateGymInput): Promise<Gym> {
    const dto: CreateGymDto = {
      name: input.name,
      slug: input.slug,
      config: input.config,
    };
    const result = await this.gymsGraphQLService.createGym(dto);
    return result as Gym;
  }

  @Mutation(() => Message, { name: 'removeGym' })
  async removeGym(@Args('id') id: string): Promise<Message> {
    const result = await this.gymsGraphQLService.removeGym(id);
    return { message: result.message };
  }
}
