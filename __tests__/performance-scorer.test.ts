/**
 * @fileoverview Tests for the PerformanceScorer
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PerformanceScorer } from '../src/feedback/scorer';
import type { TurnFeedback, Turn } from '../src/types';

/** Helper to build a mock TurnFeedback */
function buildFeedback(overrides?: Partial<TurnFeedback>): TurnFeedback {
  return {
    etiquetteScore: 7,
    argumentScore: 6,
    procedureScore: 8,
    clarityScore: 7,
    tip: 'Good job overall.',
    ...overrides,
  };
}

/** Helper to build a mock Turn */
function buildTurn(id: string): Turn {
  return {
    id,
    participantId: 'user',
    role: 'petitioner',
    dialogue: 'Test dialogue',
    timestamp: new Date(),
  };
}

describe('PerformanceScorer', () => {
  let scorer: PerformanceScorer;

  beforeEach(() => {
    scorer = new PerformanceScorer();
  });

  describe('scoreResponse', () => {
    it('should calculate a weighted score from a single feedback entry', () => {
      const feedback = buildFeedback({
        etiquetteScore: 10,
        argumentScore: 10,
        procedureScore: 10,
        clarityScore: 10,
      });
      const score = scorer.scoreResponse(feedback);
      expect(score).toBe(100);
    });

    it('should return 0 for all-zero scores', () => {
      const feedback = buildFeedback({
        etiquetteScore: 0,
        argumentScore: 0,
        procedureScore: 0,
        clarityScore: 0,
      });
      const score = scorer.scoreResponse(feedback);
      expect(score).toBe(0);
    });

    it('should weight categories equally by default', () => {
      const feedback = buildFeedback({
        etiquetteScore: 5,
        argumentScore: 5,
        procedureScore: 5,
        clarityScore: 5,
      });
      const score = scorer.scoreResponse(feedback);
      expect(score).toBe(50);
    });
  });

  describe('calculateTotal', () => {
    it('should average scores across multiple feedback entries', () => {
      const feedbacks = [
        buildFeedback({ etiquetteScore: 10, argumentScore: 10, procedureScore: 10, clarityScore: 10 }),
        buildFeedback({ etiquetteScore: 0, argumentScore: 0, procedureScore: 0, clarityScore: 0 }),
      ];
      const total = scorer.calculateTotal(feedbacks);
      expect(total).toBe(50);
    });

    it('should return 0 for empty feedback array', () => {
      expect(scorer.calculateTotal([])).toBe(0);
    });
  });

  describe('calculate', () => {
    it('should produce a complete PerformanceScore', () => {
      const turns = [buildTurn('t1'), buildTurn('t2')];
      const feedbacks = [buildFeedback(), buildFeedback()];
      const result = scorer.calculate(turns, feedbacks);

      expect(result).toHaveProperty('overallScore');
      expect(result).toHaveProperty('breakdown');
      expect(result).toHaveProperty('improvements');
      expect(result).toHaveProperty('transcript');
      expect(result.transcript).toHaveLength(2);
    });

    it('should return zero score for empty feedbacks', () => {
      const result = scorer.calculate([], []);
      expect(result.overallScore).toBe(0);
    });

    it('should include the full transcript in the report', () => {
      const turns = [buildTurn('t1')];
      const feedbacks = [buildFeedback()];
      const result = scorer.calculate(turns, feedbacks);
      expect(result.transcript).toEqual(turns);
    });

    it('should generate improvement recommendations for low scores', () => {
      const turns = [buildTurn('t1')];
      const feedbacks = [
        buildFeedback({
          etiquetteScore: 2,
          argumentScore: 2,
          procedureScore: 2,
          clarityScore: 2,
        }),
      ];
      const result = scorer.calculate(turns, feedbacks);
      expect(result.improvements.length).toBeGreaterThan(0);
    });
  });

  describe('getBreakdown', () => {
    it('should return per-category averages normalized to 0-25', () => {
      const feedbacks = [
        buildFeedback({ etiquetteScore: 10, argumentScore: 8, procedureScore: 6, clarityScore: 4 }),
      ];
      const breakdown = scorer.getBreakdown(feedbacks);
      expect(breakdown.etiquette).toBe(25);
      expect(breakdown.arguments).toBe(20);
      expect(breakdown.procedure).toBe(15);
      expect(breakdown.clarity).toBe(10);
    });
  });

  describe('custom weights', () => {
    it('should respect custom scoring weights', () => {
      const customScorer = new PerformanceScorer({
        etiquette: 40,
        arguments: 30,
        procedure: 20,
        clarity: 10,
      });

      const feedback = buildFeedback({
        etiquetteScore: 10,
        argumentScore: 0,
        procedureScore: 0,
        clarityScore: 0,
      });
      const score = customScorer.scoreResponse(feedback);
      expect(score).toBe(40);
    });
  });
});
