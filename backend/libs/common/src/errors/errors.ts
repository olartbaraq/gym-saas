import {
  HttpException,
  HttpStatus,
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

/**
 * Converts HTTP exceptions to gRPC exceptions for use in gRPC services
 * This function always throws and never returns
 */
export const handleError = (error: unknown): never => {
  if (error instanceof HttpException) {
    const status = error.getStatus();
    const message = error.message || 'An error occurred';

    // Map HTTP status codes to gRPC status codes
    let grpcCode: number;
    switch (status) {
      case 400:
        grpcCode = 3; // INVALID_ARGUMENT
        break;
      case 401:
        grpcCode = 16; // UNAUTHENTICATED
        break;
      case 403:
        grpcCode = 7; // PERMISSION_DENIED
        break;
      case 404:
        grpcCode = 5; // NOT_FOUND
        break;
      case 409:
        grpcCode = 6; // ALREADY_EXISTS
        break;
      case 422:
        grpcCode = 3; // INVALID_ARGUMENT
        break;
      default:
        grpcCode = 13; // INTERNAL
    }

    throw new RpcException({
      code: grpcCode,
      message,
      status,
    });
  }

  // For non-HTTP exceptions, wrap in RpcException
  const errorMessage =
    error instanceof Error ? error.message : 'Internal server error';
  throw new RpcException({
    code: 13, // INTERNAL
    message: errorMessage,
  });
};

/**
 * Maps gRPC status codes to HTTP status codes
 */
export const mapGrpcCodeToHttpStatus = (grpcCode?: number): HttpStatus => {
  // Map gRPC status codes to HTTP status codes
  switch (grpcCode) {
    case 3: // INVALID_ARGUMENT
      return HttpStatus.BAD_REQUEST;
    case 5: // NOT_FOUND
      return HttpStatus.NOT_FOUND;
    case 6: // ALREADY_EXISTS
      return HttpStatus.CONFLICT;
    case 7: // PERMISSION_DENIED
      return HttpStatus.FORBIDDEN;
    case 16: // UNAUTHENTICATED
      return HttpStatus.UNAUTHORIZED;
    default:
      return HttpStatus.INTERNAL_SERVER_ERROR;
  }
};

/**
 * Converts gRPC errors to HTTP exceptions for use in API gateway
 * This function always throws and never returns
 */
export const handleGrpcError = (error: any): never => {
  if (error instanceof RpcException) {
    const errorDetails = error.getError();

    // Extract error information - handle both string and object types
    let message = 'An error occurred';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (typeof errorDetails === 'object' && errorDetails !== null) {
      const details = errorDetails as {
        message?: string;
        status?: number;
        code?: number;
      };
      message = details.message || error.message || message;
      status =
        details.status || mapGrpcCodeToHttpStatus(details.code) || status;
    } else if (typeof errorDetails === 'string') {
      message = errorDetails;
    } else {
      message = error.message || message;
    }

    // Map to appropriate HTTP exception based on status
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        throw new BadRequestException(message);
      case HttpStatus.CONFLICT:
        throw new ConflictException(message);
      case HttpStatus.NOT_FOUND:
        throw new NotFoundException(message);
      case HttpStatus.UNAUTHORIZED:
        throw new UnauthorizedException(message);
      case HttpStatus.FORBIDDEN:
        throw new ForbiddenException(message);
      default:
        throw new HttpException(message, status);
    }
  }

  // Check if error has gRPC error properties (code, details, metadata)
  if (error?.code !== undefined && error?.message) {
    const grpcCode = error.code;
    const message = error.message || 'An error occurred';
    const status = mapGrpcCodeToHttpStatus(grpcCode);

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        throw new BadRequestException(message);
      case HttpStatus.CONFLICT:
        throw new ConflictException(message);
      case HttpStatus.NOT_FOUND:
        throw new NotFoundException(message);
      case HttpStatus.UNAUTHORIZED:
        throw new UnauthorizedException(message);
      case HttpStatus.FORBIDDEN:
        throw new ForbiddenException(message);
      default:
        throw new HttpException(message, status);
    }
  }

  // For non-RPC exceptions, throw generic HTTP exception
  const errorMessage = error?.message || 'Internal server error';
  throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
};
