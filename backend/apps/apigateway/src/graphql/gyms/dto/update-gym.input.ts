import { InputType, Field, ID } from '@nestjs/graphql';
import { GymConfig } from '../entities/gym-config.entity';

@InputType()
export class UpdateGymInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field(() => GymConfig, { nullable: true })
  config?: GymConfig;
}


