/**
 * Admin Domain DTOs
 *
 * Data transfer objects for the admin domain.
 */

export type {
  CreateAdminAccountDto,
  UpdateAdminAccountDto,
  AdminAccountResponseDto,
  AdminAccountSummaryDto,
  AdminAccountListResponseDto,
} from './AdminAccount.dto';

export type {
  CreateAdminRoleDto,
  UpdateAdminRoleDto,
  AdminRoleResponseDto,
  AdminRoleSummaryDto,
  AdminRoleListResponseDto,
} from './AdminRole.dto';

export type {
  CreateAdminPermissionDto,
  UpdateAdminPermissionDto,
  AdminPermissionResponseDto,
  AdminPermissionSummaryDto,
  AdminPermissionListResponseDto,
} from './AdminPermission.dto';

export type {
  AdminOperationResponseDto,
  AdminLoginResponseDto,
  AdminStatisticsResponseDto,
  AdminBulkOperationDto,
  AdminBulkOperationResponseDto,
  AdminSearchRequestDto,
  AdminSearchResponseDto,
} from './AdminResponse.dto';