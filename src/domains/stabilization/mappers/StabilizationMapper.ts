/**
 * Stabilization Mapper
 *
 * General mapping utilities for stabilization domain.
 * No database logic - pure transformation only.
 */

/**
 * General stabilization mapping utilities.
 */
export class StabilizationMapper {
  /**
   * Maps an array of module names to a health status count.
   * @param healthyModules List of healthy modules
   * @param warningModules List of warning modules
   * @param failedModules List of failed modules
   * @returns Object with counts
   */
  public static countByStatus(
    healthyModules: string[],
    warningModules: string[],
    failedModules: string[]
  ): { healthy: number; warning: number; failed: number; total: number } {
    const healthy = healthyModules?.length ?? 0;
    const warning = warningModules?.length ?? 0;
    const failed = failedModules?.length ?? 0;
    return {
      healthy,
      warning,
      failed,
      total: healthy + warning + failed,
    };
  }

  /**
   * Calculates health percentage from module counts.
   * @param healthyModules List of healthy modules
   * @param warningModules List of warning modules
   * @param failedModules List of failed modules
   * @returns Health percentage (0-100)
   */
  public static calculateHealthPercentage(
    healthyModules: string[],
    warningModules: string[],
    failedModules: string[]
  ): number {
    const counts = this.countByStatus(healthyModules, warningModules, failedModules);
    if (counts.total === 0) return 100;
    return (counts.healthy / counts.total) * 100;
  }
}
