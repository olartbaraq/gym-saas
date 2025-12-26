import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersGraphQLService } from './users-graphql.service';
import { User } from './entities/user.entity';
import { FindAllUsersResponse } from './entities/find-all-users-response.entity';
import { Users } from './entities/users.entity';
import { Message } from '../common/entities/message.entity';
import { FindAllUsersInput } from './dto/find-all-users.input';
import { UpdateUserInput } from './dto/update-user.input';
import {
  FindAllUsersDto,
  UpdateUserDto,
} from '@app/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersGraphQLService: UsersGraphQLService) {}

  @Query(() => FindAllUsersResponse, { name: 'findAllUsers' })
  async findAllUsers(
    @Args('input', { nullable: true }) input?: FindAllUsersInput,
  ): Promise<FindAllUsersResponse> {
    const dto: FindAllUsersDto = {
      page: input?.page || 1,
      limit: input?.limit || 50,
      offset: input?.offset || (input?.page ? (input.page - 1) * (input.limit || 50) : 0),
      search: input?.search,
      filter: input?.filter
        ? {
            location: input.filter.location,
            isActive: input.filter.isActive,
            isSubscribed: input.filter.isSubscribed,
            isDeleted: input.filter.isDeleted,
            role: input.filter.role,
          }
        : undefined,
    };

    const result = await this.usersGraphQLService.findAllUsers(dto);
    
    // Transform gRPC response to GraphQL type
    return {
      data: {
        users: result.data?.users || [],
      },
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Query(() => User, { name: 'findOneUser' })
  async findOneUser(@Args('id') id: string): Promise<User> {
    return await this.usersGraphQLService.findOneUser(id);
  }

  @Query(() => User, { name: 'findOneUserByEmail' })
  async findOneUserByEmail(@Args('email') email: string): Promise<User> {
    return await this.usersGraphQLService.findOneUserByEmail(email);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('input') input: UpdateUserInput,
  ): Promise<User> {
    const dto: UpdateUserDto = {
      id: input.id,
      address: input.address,
      location: input.location,
      socialMedia: input.socialMedia
        ? {
            facebookUsername: input.socialMedia.facebookUsername,
            twitterUri: input.socialMedia.twitterUri,
            instagramUri: input.socialMedia.instagramUri,
            tiktokUri: input.socialMedia.tiktokUri,
          }
        : undefined,
      gymId: input.gymId,
      gymLocationId: input.gymLocationId,
      role: input.role,
    };

    return await this.usersGraphQLService.updateUser(dto);
  }

  @Mutation(() => Message, { name: 'removeUser' })
  async removeUser(@Args('id') id: string): Promise<Message> {
    const result = await this.usersGraphQLService.removeUser(id);
    return { message: result.message };
  }
}

