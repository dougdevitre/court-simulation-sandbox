/**
 * @fileoverview TurnManager — Who Speaks When
 *
 * Manages the order of turns in a courtroom simulation,
 * enforcing procedural rules about who speaks when and
 * handling interruptions like objections.
 *
 * @module @justice-os/court-sandbox/simulation/turn-manager
 */

import type { Participant, ParticipantRole, Turn } from '../types';

/** Describes the current state of the turn queue */
export interface TurnState {
  /** The participant whose turn it currently is */
  currentSpeaker: Participant;
  /** Index within the turn queue */
  turnIndex: number;
  /** Current hearing phase */
  phase: string;
  /** Total turns taken so far */
  totalTurns: number;
}

/**
 * TurnManager determines and enforces the speaking order
 * in a courtroom simulation session.
 *
 * @example
 * ```typescript
 * const tm = new TurnManager();
 * tm.initialize(participants, ['opening', 'examination', 'closing']);
 * const speaker = tm.nextTurn();
 * ```
 */
export class TurnManager {
  /** Registered participants */
  private participants: Participant[] = [];
  /** Ordered queue of participant IDs */
  private turnQueue: string[] = [];
  /** Current position in the turn queue */
  private currentIndex: number = 0;
  /** Hearing phases */
  private phases: string[] = [];
  /** Current phase index */
  private phaseIndex: number = 0;
  /** Accumulated transcript */
  private transcript: Turn[] = [];

  /**
   * Initialize the turn order based on scenario participants and phases.
   *
   * @param participants - All participants in the session
   * @param phases - The hearing phases to sequence
   */
  initialize(participants: Participant[], phases: string[]): void {
    this.participants = participants;
    this.phases = phases;
    this.phaseIndex = 0;
    this.currentIndex = 0;

    // Build default turn queue: judge first, then petitioner, respondent, etc.
    const roleOrder: ParticipantRole[] = [
      'judge',
      'petitioner',
      'respondent',
      'opposing_counsel',
      'witness',
      'clerk',
    ];

    this.turnQueue = [...participants]
      .sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role))
      .map((p) => p.id);
  }

  /**
   * Advance to the next turn and return the participant who should speak.
   *
   * @returns The participant who should speak next
   * @throws {Error} If no participants have been initialized
   */
  nextTurn(): Participant {
    if (this.turnQueue.length === 0) {
      throw new Error('TurnManager not initialized. Call initialize() first.');
    }
    const speakerId = this.turnQueue[this.currentIndex % this.turnQueue.length];
    this.currentIndex++;
    const participant = this.participants.find((p) => p.id === speakerId);
    if (!participant) {
      throw new Error(`Participant ${speakerId} not found`);
    }
    return participant;
  }

  /**
   * Get the participant whose turn it currently is without advancing.
   *
   * @returns The current speaker
   */
  getCurrentSpeaker(): Participant {
    if (this.turnQueue.length === 0) {
      throw new Error('TurnManager not initialized.');
    }
    const speakerId = this.turnQueue[this.currentIndex % this.turnQueue.length];
    const participant = this.participants.find((p) => p.id === speakerId);
    if (!participant) {
      throw new Error(`Participant ${speakerId} not found`);
    }
    return participant;
  }

  /**
   * Override the turn order with a custom sequence of participant IDs.
   *
   * @param order - Array of participant IDs in desired turn order
   * @throws {Error} If any ID does not match a registered participant
   */
  setOrder(order: string[]): void {
    for (const id of order) {
      if (!this.participants.find((p) => p.id === id)) {
        throw new Error(`Unknown participant ID: ${id}`);
      }
    }
    this.turnQueue = order;
    this.currentIndex = 0;
  }

  /**
   * Check whether all phases of the hearing are complete.
   *
   * @returns True when there are no remaining phases
   */
  isComplete(): boolean {
    return this.phaseIndex >= this.phases.length;
  }

  /**
   * Get the full transcript of turns recorded so far.
   *
   * @returns Array of all recorded turns
   */
  getTranscript(): Turn[] {
    return [...this.transcript];
  }

  /**
   * Record a completed turn in the transcript.
   *
   * @param turn - The turn to record
   */
  recordTurn(turn: Turn): void {
    this.transcript.push(turn);
  }

  /**
   * Handle an interruption (e.g., objection) that changes turn order.
   *
   * @param interrupter - The participant interrupting
   * @param reason - The reason for interruption
   */
  handleInterruption(interrupter: Participant, reason: string): void {
    // Insert the interrupter at the current position
    this.turnQueue.splice(this.currentIndex, 0, interrupter.id);
    // Judge always responds to objections
    const judgeId = this.participants.find((p) => p.role === 'judge')?.id;
    if (judgeId) {
      this.turnQueue.splice(this.currentIndex + 1, 0, judgeId);
    }
  }

  /**
   * Advance to the next hearing phase.
   *
   * @returns The name of the new phase, or null if complete
   */
  advancePhase(): string | null {
    this.phaseIndex++;
    if (this.phaseIndex >= this.phases.length) return null;
    this.currentIndex = 0;
    return this.phases[this.phaseIndex];
  }

  /**
   * Check if the current phase is complete.
   *
   * @returns Whether all turns in the current phase are done
   */
  isPhaseComplete(): boolean {
    // A phase is considered complete after each participant has spoken once
    return this.currentIndex >= this.turnQueue.length;
  }
}
