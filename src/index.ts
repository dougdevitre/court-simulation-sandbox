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

// --- Simulation Engine ---
export { Courtroom } from './simulation/courtroom';
export { ScenarioLoader } from './simulation/scenario-loader';
export { TurnManager } from './simulation/turn-manager';

// --- AI Actors ---
export { JudgeAI } from './actors/judge-ai';
export { OpposingCounselAI } from './actors/opposing-counsel-ai';
export { BaseActor } from './actors/actor-base';

// --- Feedback System ---
export { RealtimeCoach } from './feedback/coach';
export { PerformanceScorer } from './feedback/scorer';
export { OutcomePredictor } from './feedback/outcome-predictor';

// --- React Components ---
export { CourtroomView } from './components/CourtroomView';
export { DialogueBox } from './components/DialogueBox';
export { ScoreCard } from './components/ScoreCard';

// --- Types ---
export type {
  SimulationSession,
  Participant,
  ParticipantRole,
  Turn,
  TurnFeedback,
  Scenario,
  Objection,
  Ruling,
  PerformanceScore,
  CourtroomConfig,
  Difficulty,
  FeedbackLevel,
  JudgeDemeanor,
} from './types';
