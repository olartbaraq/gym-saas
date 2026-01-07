import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GymConfig } from './gym-config.entity';

@ObjectType()
export class Gym {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field(() => GymConfig, { nullable: true })
  config?: GymConfig;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

