/**
 * @fileoverview Court Simulation Sandbox — Practice Before the Real Thing
 *
 * Full courtroom simulation with AI-powered role-play, real-time feedback,
 * outcome prediction, and customizable scenarios for pro se litigants,
 * law students, and legal aid training programs.
 *
 * @packageDocumentation
 * @module @justice-os/court-sandbox
 */

export { Courtroom } from './simulation/courtroom';
export { ScenarioLoader } from './simulation/scenario-loader';
export { TurnManager } from './simulation/turn-manager';

export { JudgeAI } from './actors/judge-ai';
export { OpposingCounselAI } from './actors/opposing-counsel-ai';
export { BaseActor } from './actors/actor-base';

export { RealtimeCoach } from './feedback/coach';
export { PerformanceScorer } from './feedback/scorer';
export { OutcomePredictor } from './feedback/outcome-predictor';

export type {
  SimulationSession,
  Participant,
  ParticipantRole,
  Turn,
  Scenario,
  Objection,
  Ruling,
  PerformanceScore,
} from './types';
