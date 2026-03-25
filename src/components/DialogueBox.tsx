/**
 * @fileoverview DialogueBox — Conversation Interface
 *
 * React component providing the chat-style dialogue interface
 * where users read AI participant dialogue and submit their
 * own courtroom responses.
 *
 * @module @justice-os/court-sandbox/components/DialogueBox
 */

import React from 'react';
import type { Turn, TurnFeedback } from '../types';

/** Props for the DialogueBox component */
export interface DialogueBoxProps {
  /** Dialogue turns to display */
  turns: Turn[];
  /** Callback when the user submits a response */
  onSubmit: (text: string) => void;
  /** Whether it is currently the user's turn */
  isUserTurn: boolean;
  /** Latest coaching feedback to display */
  latestFeedback?: TurnFeedback;
}

/**
 * DialogueBox renders the courtroom dialogue and provides
 * an input area for user responses.
 */
export const DialogueBox: React.FC<DialogueBoxProps> = ({
  turns,
  onSubmit,
  isUserTurn,
  latestFeedback,
}) => {
  // TODO: Render conversation history with role indicators
  // TODO: Show coaching tips inline after user turns
  // TODO: Provide text input with submit button when user's turn
  return null;
};

export default DialogueBox;
