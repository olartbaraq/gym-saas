import { ObjectType, Field, ID } from '@nestjs/graphql';
import { SocialMedia } from './social-media.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  lastName: string;

  @Field()
  firstName: string;

  @Field()
  dateOfBirth: string;

  @Field()
  email: string;

  @Field()
  location: string;

  @Field()
  address: string;

  @Field()
  provider: string;

  @Field({ nullable: true })
  password?: string;

  @Field()
  role: string;

  @Field()
  isActive: boolean;

  @Field()
  isSubscribed: boolean;

  @Field()
  isDeleted: boolean;

  @Field(() => SocialMedia, { nullable: true })
  socialMedia?: SocialMedia;

  @Field()
  gymId: string;

  @Field()
  gymLocationId: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}


