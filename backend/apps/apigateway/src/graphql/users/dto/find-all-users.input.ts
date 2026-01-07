import { InputType, Field, Int } from '@nestjs/graphql';
import { FilterUsersInput } from './filter-users.input';

@InputType()
export class FindAllUsersInput {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 50 })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;

  @Field({ nullable: true })
  search?: string;

  @Field(() => FilterUsersInput, { nullable: true })
  filter?: FilterUsersInput;
}


