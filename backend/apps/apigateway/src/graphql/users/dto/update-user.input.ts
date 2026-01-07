import { InputType, Field, ID } from '@nestjs/graphql';
import { SocialMedia } from '../entities/social-media.entity';

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  location?: string;

  @Field(() => SocialMedia, { nullable: true })
  socialMedia?: SocialMedia;

  @Field({ nullable: true })
  gymId?: string;

  @Field({ nullable: true })
  gymLocationId?: string;

  @Field({ nullable: true })
  role?: string;
}


