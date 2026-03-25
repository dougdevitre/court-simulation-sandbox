/**
 * @fileoverview PerformanceScorer — Scoring Rubric
 *
 * Calculates overall and category-specific performance scores
 * for completed simulation sessions using a weighted rubric.
 *
 * @module @justice-os/court-sandbox/feedback/scorer
 */

import type { Turn, TurnFeedback, PerformanceScore } from '../types';

/** Weight distribution for scoring categories (must sum to 100) */
export interface ScoringWeights {
  /** Weight for courtroom etiquette (default 25) */
  etiquette: number;
  /** Weight for argument quality (default 25) */
  arguments: number;
  /** Weight for procedural compliance (default 25) */
  procedure: number;
  /** Weight for clarity of communication (default 25) */
  clarity: number;
}

/** Per-category average breakdown */
export interface CategoryBreakdown {
  etiquette: number;
  arguments: number;
  procedure: number;
  clarity: number;
}

/**
 * PerformanceScorer aggregates per-turn feedback into a
 * final performance report with category breakdown.
 *
 * @example
 * ```typescript
 * const scorer = new PerformanceScorer();
 * const report = scorer.calculate(turns, feedbacks);
 * console.log(`Overall: ${report.overallScore}/100`);
 * ```
 */
export class PerformanceScorer {
  /** Category weights */
  private weights: ScoringWeights;

  constructor(weights?: Partial<ScoringWeights>) {
    this.weights = {
      etiquette: weights?.etiquette ?? 25,
      arguments: weights?.arguments ?? 25,
      procedure: weights?.procedure ?? 25,
      clarity: weights?.clarity ?? 25,
    };
  }

  /**
   * Score a single user response turn.
   *
   * @param feedback - The feedback for the turn
   * @returns Weighted score for this turn (0-100)
   */
  scoreResponse(feedback: TurnFeedback): number {
    const maxPerCategory = 10;
    const etiquetteNorm = (feedback.etiquetteScore / maxPerCategory) * this.weights.etiquette;
    const argumentNorm = (feedback.argumentScore / maxPerCategory) * this.weights.arguments;
    const procedureNorm = (feedback.procedureScore / maxPerCategory) * this.weights.procedure;
    const clarityNorm = (feedback.clarityScore / maxPerCategory) * this.weights.clarity;

    return Math.round(etiquetteNorm + argumentNorm + procedureNorm + clarityNorm);
  }

  /**
   * Calculate the final performance score from all turn feedback.
   *
   * @param turns - All turns from the session
   * @param feedbacks - Feedback for each user turn
   * @returns Aggregated performance score with breakdown
   */
  calculate(turns: Turn[], feedbacks: TurnFeedback[]): PerformanceScore {
    if (feedbacks.length === 0) {
      return this.emptyScore(turns);
    }

    const breakdown = this.getBreakdown(feedbacks);
    const overallScore = this.calculateTotal(feedbacks);
    const improvements = this.generateImprovements(breakdown);

    return {
      overallScore,
      breakdown,
      outcomePrediction: { favorable: 0, unfavorable: 0, partial: 0 },
      improvements,
      transcript: turns,
    };
  }

  /**
   * Calculate the total weighted score across all feedback entries.
   *
   * @param feedbacks - Array of turn feedback
   * @returns Overall score 0-100
   */
  calculateTotal(feedbacks: TurnFeedback[]): number {
    if (feedbacks.length === 0) return 0;
    const total = feedbacks.reduce((sum, fb) => sum + this.scoreResponse(fb), 0);
    return Math.round(total / feedbacks.length);
  }

  /**
   * Get per-category average scores normalized to 0-25.
   *
   * @param feedbacks - Array of turn feedback
   * @returns Category breakdown
   */
  getBreakdown(feedbacks: TurnFeedback[]): CategoryBreakdown {
    if (feedbacks.length === 0) {
      return { etiquette: 0, arguments: 0, procedure: 0, clarity: 0 };
    }
    const n = feedbacks.length;
    const maxPerCategory = 10;

    return {
      etiquette: Math.round(
        feedbacks.reduce((s, f) => s + f.etiquetteScore, 0) / n / maxPerCategory * 25,
      ),
      arguments: Math.round(
        feedbacks.reduce((s, f) => s + f.argumentScore, 0) / n / maxPerCategory * 25,
      ),
      procedure: Math.round(
        feedbacks.reduce((s, f) => s + f.procedureScore, 0) / n / maxPerCategory * 25,
      ),
      clarity: Math.round(
        feedbacks.reduce((s, f) => s + f.clarityScore, 0) / n / maxPerCategory * 25,
      ),
    };
  }

  /**
   * Compare a score to the average for its scenario type.
   *
   * @param score - The user's overall score
   * @param scenarioType - The case type for benchmark lookup
   * @returns Percentile rank (0-100)
   */
  compareToAverage(score: number, scenarioType: string): number {
    // TODO: Retrieve historical average from database
    // TODO: Calculate percentile rank
    throw new Error('Not implemented');
  }

  /** Generate improvement suggestions from the breakdown */
  private generateImprovements(breakdown: CategoryBreakdown): string[] {
    const improvements: string[] = [];
    if (breakdown.etiquette < 15) {
      improvements.push('Address the judge as "Your Honor" and maintain a respectful tone.');
    }
    if (breakdown.arguments < 15) {
      improvements.push('Support your arguments with specific facts and evidence.');
    }
    if (breakdown.procedure < 15) {
      improvements.push('Follow the procedural order and wait for your turn to speak.');
    }
    if (breakdown.clarity < 15) {
      improvements.push('Keep your statements concise and clearly organized.');
    }
    return improvements;
  }

  /** Return a zero-score report */
  private emptyScore(turns: Turn[]): PerformanceScore {
    return {
      overallScore: 0,
      breakdown: { etiquette: 0, arguments: 0, procedure: 0, clarity: 0 },
      outcomePrediction: { favorable: 0, unfavorable: 0, partial: 0 },
      improvements: [],
      transcript: turns,
    };
  }
}
