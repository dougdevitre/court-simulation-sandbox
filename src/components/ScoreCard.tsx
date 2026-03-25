/**
 * @fileoverview ScoreCard — Performance Display
 *
 * React component that displays the user's performance scores
 * during and after a courtroom simulation, with category breakdowns
 * and improvement recommendations.
 *
 * @module @justice-os/court-sandbox/components/ScoreCard
 */

import React, { useMemo } from 'react';
import type { PerformanceScore } from '../types';

/** Props for the ScoreCard component */
export interface ScoreCardProps {
  /** Performance score data to display */
  score: PerformanceScore;
  /** Whether to show the full report or a compact summary */
  variant?: 'compact' | 'full';
  /** Optional CSS class name */
  className?: string;
}

/** Grade label derived from a numeric score */
type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

/**
 * Derive a letter grade from a 0-100 numeric score.
 *
 * @param score - Numeric score
 * @returns Corresponding letter grade
 */
function toGrade(score: number): Grade {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * ScoreCard visualizes the user's simulation performance
 * with scores, progress bars, and improvement suggestions.
 *
 * @example
 * ```tsx
 * <ScoreCard score={report} variant="full" />
 * ```
 */
export const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  variant = 'full',
  className,
}) => {
  const grade = useMemo(() => toGrade(score.overallScore), [score.overallScore]);

  const categories = useMemo(
    () => [
      { label: 'Etiquette', value: score.breakdown.etiquette, max: 25 },
      { label: 'Arguments', value: score.breakdown.arguments, max: 25 },
      { label: 'Procedure', value: score.breakdown.procedure, max: 25 },
      { label: 'Clarity', value: score.breakdown.clarity, max: 25 },
    ],
    [score.breakdown],
  );

  return React.createElement(
    'div',
    {
      className: `score-card score-card--${variant} ${className ?? ''}`.trim(),
      'aria-label': 'Performance report',
      role: 'region',
    },
    // Overall score
    React.createElement(
      'div',
      { className: 'score-card__overall' },
      React.createElement('span', { className: 'score-card__grade' }, grade),
      React.createElement('span', { className: 'score-card__number' }, `${score.overallScore}/100`),
    ),
    // Category breakdown
    React.createElement(
      'div',
      { className: 'score-card__categories' },
      ...categories.map((cat) =>
        React.createElement(
          'div',
          { key: cat.label, className: 'score-card__category' },
          React.createElement('span', { className: 'score-card__cat-label' }, cat.label),
          React.createElement(
            'div',
            { className: 'score-card__bar', role: 'progressbar', 'aria-valuenow': cat.value, 'aria-valuemax': cat.max },
            React.createElement('div', {
              className: 'score-card__bar-fill',
              style: { width: `${(cat.value / cat.max) * 100}%` },
            }),
          ),
          React.createElement('span', { className: 'score-card__cat-value' }, `${cat.value}/${cat.max}`),
        ),
      ),
    ),
    // Outcome prediction (full variant only)
    variant === 'full'
      ? React.createElement(
          'div',
          { className: 'score-card__prediction' },
          React.createElement('h4', null, 'Outcome Prediction'),
          React.createElement('span', null, `Favorable: ${score.outcomePrediction.favorable}%`),
          React.createElement('span', null, `Unfavorable: ${score.outcomePrediction.unfavorable}%`),
          React.createElement('span', null, `Partial: ${score.outcomePrediction.partial}%`),
        )
      : null,
    // Improvements (full variant only)
    variant === 'full' && score.improvements.length > 0
      ? React.createElement(
          'div',
          { className: 'score-card__improvements' },
          React.createElement('h4', null, 'Areas for Improvement'),
          React.createElement(
            'ul',
            null,
            ...score.improvements.map((item, i) =>
              React.createElement('li', { key: i }, item),
            ),
          ),
        )
      : null,
  );
};

export default ScoreCard;
