/**
 * @fileoverview ScoreCard — Performance Display
 *
 * React component that displays the user's performance scores
 * during and after a courtroom simulation, with category breakdowns
 * and improvement recommendations.
 *
 * @module @justice-os/court-sandbox/components/ScoreCard
 */

import React from 'react';
import type { PerformanceScore } from '../types';

/** Props for the ScoreCard component */
export interface ScoreCardProps {
  /** Performance score data to display */
  score: PerformanceScore;
  /** Whether to show the full report or a compact summary */
  variant?: 'compact' | 'full';
}

/**
 * ScoreCard visualizes the user's simulation performance
 * with scores, progress bars, and improvement suggestions.
 */
export const ScoreCard: React.FC<ScoreCardProps> = ({ score, variant = 'full' }) => {
  // TODO: Render overall score with circular progress
  // TODO: Show category breakdown bars
  // TODO: Display outcome prediction percentages
  // TODO: List improvement recommendations
  return null;
};

export default ScoreCard;
