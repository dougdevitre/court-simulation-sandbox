/**
 * @fileoverview Type definitions for the Court Simulation Sandbox
 *
 * Defines all shared types, interfaces, and enums used across the
 * simulation engine, AI actors, feedback system, and UI components.
 *
 * @module @justice-os/court-sandbox/types
 */

/** Roles a participant can hold in a courtroom simulation */
export type ParticipantRole =
  | 'judge'
  | 'petitioner'
  | 'respondent'
  | 'opposing_counsel'
  | 'witness'
  | 'clerk'
  | 'bailiff';

/** Difficulty levels affecting AI behavior and feedback verbosity */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

/** How much coaching feedback to provide during the simulation */
export type FeedbackLevel = 'minimal' | 'moderate' | 'verbose';

/** Judge demeanor styles that affect interaction tone */
export type JudgeDemeanor = 'patient' | 'neutral' | 'strict' | 'inquisitive';

/** Participant in a simulation session */
export interface Participant {
  /** Unique identifier for the participant */
  id: string;
  /** Display name */
  name: string;
  /** Role in the courtroom */
  role: ParticipantRole;
  /** Whether this participant is controlled by AI */
  isAI: boolean;
  /** AI personality traits (only for AI participants) */
  personality?: Record<string, number>;
}

/** A single turn in the simulation dialogue */
export interface Turn {
  /** Unique turn identifier */
  id: string;
  /** ID of the participant who spoke */
  participantId: string;
  /** Role of the speaking participant */
  role: ParticipantRole;
  /** The dialogue text */
  dialogue: string;
  /** Timestamp of the turn */
  timestamp: Date;
  /** Coaching feedback (if applicable to user turns) */
  feedback?: TurnFeedback;
}

/** Feedback returned after a user submits a response */
export interface TurnFeedback {
  /** Score for courtroom etiquette (0-10) */
  etiquetteScore: number;
  /** Score for argument quality (0-10) */
  argumentScore: number;
  /** Score for procedural compliance (0-10) */
  procedureScore: number;
  /** Score for clarity of communication (0-10) */
  clarityScore: number;
  /** Coaching tip for improvement */
  tip: string;
  /** Suggested alternative phrasing */
  suggestedAlternative?: string;
}

/** A courtroom scenario definition */
export interface Scenario {
  /** Unique scenario identifier */
  id: string;
  /** Human-readable scenario name */
  name: string;
  /** Type of case (custody, eviction, small claims, etc.) */
  caseType: string;
  /** Jurisdiction code */
  jurisdiction: string;
  /** Description of the scenario facts */
  description: string;
  /** Participants in this scenario */
  participants: Participant[];
  /** Opening facts and context provided to AI actors */
  context: Record<string, unknown>;
  /** Expected sequence of phases (opening, examination, closing, etc.) */
  phases: string[];
}

/** An objection raised during the simulation */
export interface Objection {
  /** Unique objection identifier */
  id: string;
  /** ID of the participant raising the objection */
  raisedBy: string;
  /** Legal basis for the objection */
  basis: string;
  /** The turn being objected to */
  targetTurnId: string;
  /** Whether the objection was sustained or overruled */
  ruling?: 'sustained' | 'overruled';
  /** Judge's explanation for the ruling */
  explanation?: string;
}

/** A judicial ruling on a matter */
export interface Ruling {
  /** Unique ruling identifier */
  id: string;
  /** The matter being ruled on */
  matter: string;
  /** The ruling decision */
  decision: string;
  /** Judge's reasoning */
  reasoning: string;
  /** Related objection ID (if ruling on an objection) */
  objectionId?: string;
  /** Timestamp of the ruling */
  timestamp: Date;
}

/** Overall performance score for a completed simulation */
export interface PerformanceScore {
  /** Overall score (0-100) */
  overallScore: number;
  /** Breakdown by category (each 0-25) */
  breakdown: {
    etiquette: number;
    arguments: number;
    procedure: number;
    clarity: number;
  };
  /** Outcome prediction percentages */
  outcomePrediction: {
    favorable: number;
    unfavorable: number;
    partial: number;
  };
  /** Key areas for improvement */
  improvements: string[];
  /** Session transcript */
  transcript: Turn[];
}

/** Active simulation session */
export interface SimulationSession {
  /** Unique session identifier */
  id: string;
  /** The scenario being simulated */
  scenario: Scenario;
  /** Current phase of the hearing */
  currentPhase: string;
  /** All turns taken so far */
  turns: Turn[];
  /** Active participants */
  participants: Participant[];
  /** Session start time */
  startedAt: Date;
  /** Session status */
  status: 'active' | 'paused' | 'completed';

  /** Advance to the next AI participant's turn */
  nextTurn(): Promise<Turn>;
  /** Submit a user response and receive feedback */
  submitResponse(input: { text: string; participantId: string }): Promise<TurnFeedback>;
  /** End the session and get the performance report */
  endSession(): Promise<PerformanceScore>;
  /** Get the full transcript */
  getTranscript(): Turn[];
}

/** Configuration options for creating a Courtroom */
export interface CourtroomConfig {
  /** The scenario to simulate */
  scenario: Scenario;
  /** Difficulty level */
  difficulty: Difficulty;
  /** How much coaching feedback to provide */
  feedbackLevel: FeedbackLevel;
  /** Enable real-time coaching tips */
  enableCoaching?: boolean;
  /** Enable outcome prediction */
  enableOutcomePrediction?: boolean;
  /** Judge demeanor style */
  judgeDemeanor?: JudgeDemeanor;
}
