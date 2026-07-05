/**
 * Error Handling DTOs
 *
 * Exports all DTOs for the error-handling domain.
 */

export type {
  CreateSystemErrorDto,
  UpdateSystemErrorStatusDto,
  SystemErrorResponseDto,
} from './SystemError.dto';

export type {
  CreateErrorCategoryDto,
  UpdateErrorCategoryDto,
  ErrorCategoryResponseDto,
} from './ErrorCategory.dto';

export type {
  CreateErrorContextDto,
  ErrorContextResponseDto,
} from './ErrorContext.dto';

export type {
  ErrorResponseDto,
  ValidationErrorResponseDto,
  ErrorListResponseDto,
} from './ErrorResponse.dto';
