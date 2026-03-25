/**
 * @fileoverview PerformanceScorer — Scoring Rubric
 *
 * Calculates overall and category-specific performance scores
 * for completed simulation sessions using a weighted rubric.
 *
 * @module @justice-os/court-sandbox/feedback/scorer
 */

import type { Turn, TurnFeedback, PerformanceScore } from '../types';

/**
 * PerformanceScorer aggregates per-turn feedback into a
 * final performance report with category breakdown.
 */
export class PerformanceScorer {
  /**
   * Calculate the final performance score from all turn feedback.
   *
   * @param turns - All turns from the session
   * @param feedbacks - Feedback for each user turn
   * @returns Aggregated performance score with breakdown
   */
  calculate(turns: Turn[], feedbacks: TurnFeedback[]): PerformanceScore {
    // TODO: Aggregate scores with category weights
    // TODO: Generate improvement recommendations
    throw new Error('Not implemented');
  }
}
