import { InputType, Field, ID } from '@nestjs/graphql';
import { GymConfig } from '../entities/gym-config.entity';

@InputType()
export class CreateGymInput {
  @Field()
  name: string;

  @Field()
  slug: string;

  @Field(() => GymConfig, { nullable: true })
  config?: GymConfig;
}
