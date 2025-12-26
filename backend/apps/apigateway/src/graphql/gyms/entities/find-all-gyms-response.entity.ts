import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Gyms } from './gyms.entity';

@ObjectType()
export class FindAllGymsResponse {
  @Field(() => Gyms)
  data: Gyms;

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}


