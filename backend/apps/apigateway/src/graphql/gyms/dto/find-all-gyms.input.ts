import { InputType, Field, Int } from '@nestjs/graphql';
import { FilterGymsInput } from './filter-gyms.input';

@InputType()
export class FindAllGymsInput {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 50 })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;

  @Field({ nullable: true })
  search?: string;

  @Field(() => FilterGymsInput, { nullable: true })
  filter?: FilterGymsInput;
}


