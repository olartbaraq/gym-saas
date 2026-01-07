import { ObjectType, Field } from '@nestjs/graphql';
import { Gym } from './gym.entity';

@ObjectType()
export class Gyms {
  @Field(() => [Gym])
  gyms: Gym[];
}


