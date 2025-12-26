import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Users } from './users.entity';

@ObjectType()
export class FindAllUsersResponse {
  @Field(() => Users)
  data: Users;

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}


