/**
 * Academy DTOs Index
 *
 * Exports all academy domain DTOs.
 */

export type { CreateAcademyDto } from './CreateAcademy.dto';
export { CREATE_ACADEMY_VALIDATION } from './CreateAcademy.dto';

export type { ResearchNodeDto, ResearchNodeSummaryDto, ResearchNodeDetailDto } from './ResearchNode.dto';

export type { ResearchProgressDto, ResearchProgressSummaryDto, ActiveResearchDto } from './ResearchProgress.dto';

export type {
  AcademyResponseDto,
  AcademySummaryDto,
  AcademyDetailDto,
  AcademyStatisticsResponseDto,
} from './AcademyResponse.dto';