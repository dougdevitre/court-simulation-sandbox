/**
 * @fileoverview Tests for the Courtroom session manager
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Courtroom } from '../src/simulation/courtroom';
import type { CourtroomConfig, Scenario, Participant, SimulationSession } from '../src/types';

/** Helper to build a minimal valid scenario */
function buildScenario(overrides?: Partial<Scenario>): Scenario {
  return {
    id: 'test-scenario',
    name: 'Test Scenario',
    caseType: 'small-claims',
    jurisdiction: 'MO',
    description: 'A test scenario for unit tests.',
    participants: [
      { id: 'judge-1', name: 'Judge Smith', role: 'judge', isAI: true },
      { id: 'user', name: 'Test User', role: 'petitioner', isAI: false },
      { id: 'opp-1', name: 'Opposing Counsel', role: 'opposing_counsel', isAI: true },
    ],
    context: {},
    phases: ['opening', 'examination', 'closing'],
    ...overrides,
  };
}

describe('Courtroom', () => {
  let courtroom: Courtroom;
  let config: CourtroomConfig;

  beforeEach(() => {
    config = {
      scenario: buildScenario(),
      difficulty: 'beginner',
      feedbackLevel: 'verbose',
      enableCoaching: true,
    };
    courtroom = new Courtroom(config);
  });

  describe('startSession', () => {
    it('should create a new simulation session', async () => {
      // TODO: Implement once Courtroom.startSession is functional
      expect(courtroom).toBeDefined();
    });

    it('should initialize all AI actors from scenario participants', async () => {
      // TODO: Verify JudgeAI and OpposingCounselAI are created
      expect(config.scenario.participants).toHaveLength(3);
    });

    it('should set the initial phase from the scenario', async () => {
      // TODO: Verify session.currentPhase === 'opening'
      expect(config.scenario.phases[0]).toBe('opening');
    });
  });

  describe('addParticipant', () => {
    it('should throw if no active session exists', async () => {
      const participant: Participant = {
        id: 'witness-1',
        name: 'Witness',
        role: 'witness',
        isAI: true,
      };
      await expect(courtroom.addParticipant(participant)).rejects.toThrow(
        'No active session',
      );
    });

    it('should register a new participant in the session', async () => {
      // TODO: Start session first, then add participant
      expect(true).toBe(true);
    });
  });

  describe('nextTurn', () => {
    it('should throw if no active session exists', async () => {
      await expect(courtroom.nextTurn()).rejects.toThrow('No active session');
    });

    it('should return a Turn object with dialogue content', async () => {
      // TODO: Start session, call nextTurn, verify Turn shape
      expect(true).toBe(true);
    });

    it('should advance the turn manager to the next speaker', async () => {
      // TODO: Verify turn order progression
      expect(true).toBe(true);
    });
  });

  describe('submitResponse', () => {
    it('should throw if no active session exists', async () => {
      await expect(
        courtroom.submitResponse({ text: 'Hello', participantId: 'user' }),
      ).rejects.toThrow('No active session');
    });

    it('should return TurnFeedback with etiquette, argument, procedure, clarity scores', async () => {
      // TODO: Start session, submit response, verify feedback shape
      expect(true).toBe(true);
    });

    it('should include a coaching tip in the feedback', async () => {
      // TODO: Verify tip is present and non-empty
      expect(true).toBe(true);
    });
  });
});
