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

/**
 * TurnManager determines and enforces the speaking order
 * in a courtroom simulation session.
 */
export class TurnManager {
  private participants: Participant[] = [];
  private turnQueue: string[] = [];
  private currentIndex: number = 0;

  /**
   * Initialize the turn order based on scenario participants and phases.
   *
   * @param participants - All participants in the session
   * @param phases - The hearing phases to sequence
   */
  initialize(participants: Participant[], phases: string[]): void {
    this.participants = participants;
    // TODO: Build turn queue based on phases and procedural rules
  }

  /**
   * Get the next participant whose turn it is to speak.
   *
   * @returns The participant who should speak next
   */
  getNextSpeaker(): Participant {
    // TODO: Advance turn queue and return next speaker
    throw new Error('Not implemented');
  }

  /**
   * Handle an interruption (e.g., objection) that changes turn order.
   *
   * @param interrupter - The participant interrupting
   * @param reason - The reason for interruption
   */
  handleInterruption(interrupter: Participant, reason: string): void {
    // TODO: Insert interruption turn and manage resumption
  }

  /**
   * Check if the current phase is complete.
   *
   * @returns Whether all turns in the current phase are done
   */
  isPhaseComplete(): boolean {
    // TODO: Check phase completion criteria
    return false;
  }
}
