import { ObjectType, Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@ObjectType()
@InputType('SocialMediaInput')
export class SocialMedia {
  @Field({ nullable: true })
  facebookUsername?: string;

  @Field({ nullable: true })
  twitterUri?: string;

  @Field({ nullable: true })
  instagramUri?: string;

  @Field({ nullable: true })
  tiktokUri?: string;
}


