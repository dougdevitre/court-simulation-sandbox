/**
 * @fileoverview BaseActor — Shared AI Behavior
 *
 * Abstract base class for all AI courtroom participants.
 * Provides shared behavior for response generation, context
 * management, and personality configuration.
 *
 * @module @justice-os/court-sandbox/actors/actor-base
 */

import type { ParticipantRole, Turn } from '../types';

/** Personality traits that influence AI actor behavior */
export interface ActorPersonality {
  /** Formality level (0-1) */
  formality: number;
  /** Aggressiveness in arguments (0-1) */
  aggressiveness: number;
  /** Patience with inexperienced litigants (0-1) */
  patience: number;
  /** Detail orientation (0-1) */
  thoroughness: number;
}

/**
 * BaseActor is the abstract foundation for all AI courtroom participants.
 * Subclasses implement role-specific behavior while sharing common
 * dialogue generation and context management capabilities.
 */
export abstract class BaseActor {
  /** Unique identifier for this actor */
  readonly id: string;
  /** Courtroom role */
  readonly role: ParticipantRole;
  /** Personality configuration */
  protected personality: ActorPersonality;
  /** Conversation history for context */
  protected context: Turn[] = [];

  constructor(id: string, role: ParticipantRole, personality: ActorPersonality) {
    this.id = id;
    this.role = role;
    this.personality = personality;
  }

  /**
   * Generate a contextually appropriate response.
   *
   * @param prompt - The conversational prompt or context
   * @returns The generated dialogue turn
   */
  abstract generateResponse(prompt: string): Promise<Turn>;

  /**
   * Evaluate user input for quality and appropriateness.
   *
   * @param input - The user's dialogue text
   * @returns Evaluation scores and feedback
   */
  abstract evaluateInput(input: string): Promise<{ score: number; feedback: string }>;

  /**
   * Add a turn to the actor's context window.
   *
   * @param turn - The turn to add to context
   */
  addContext(turn: Turn): void {
    this.context.push(turn);
  }

  /**
   * Clear the actor's context history.
   */
  clearContext(): void {
    this.context = [];
  }
}
