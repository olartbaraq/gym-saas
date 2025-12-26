import { Injectable, ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import type { ValidationPipeOptions } from '@nestjs/common';

@Injectable()
export class GraphQLAwareValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super(options);
  }

  transform(value: any, metadata: ArgumentMetadata) {
    // Skip validation for GraphQL input types
    // GraphQL inputs use @InputType() decorator and have their own type validation
    if (metadata.metatype && this.isGraphQLInputType(metadata.metatype)) {
      return value;
    }

    // For REST endpoints, use standard validation
    return super.transform(value, metadata);
  }

  private isGraphQLInputType(metatype: any): boolean {
    if (!metatype || typeof metatype !== 'function') {
      return false;
    }

    // GraphQL input types are typically named with "Input" suffix
    // Examples: FindAllUsersInput, UpdateUserInput, FilterUsersInput, etc.
    const name = metatype.name || '';

    // Check if it's a GraphQL input type by name pattern
    if (name.endsWith('Input') || name.includes('Input')) {
      return true;
    }

    // Also check common GraphQL input patterns
    const graphQLInputPatterns = [
      'FindAll',
      'Update',
      'Filter',
      'SocialMedia',
      'GymConfig',
    ];

    return graphQLInputPatterns.some((pattern) => name.includes(pattern));
  }
}
