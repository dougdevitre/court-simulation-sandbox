/**
 * @fileoverview DialogueBox — Conversation Interface
 *
 * React component providing the chat-style dialogue interface
 * where users read AI participant dialogue and submit their
 * own courtroom responses.
 *
 * @module @justice-os/court-sandbox/components/DialogueBox
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Turn, TurnFeedback, ParticipantRole } from '../types';

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
  /** Maximum character length for user responses */
  maxLength?: number;
  /** Placeholder text for the input area */
  placeholder?: string;
}

/** Role display labels for the dialogue bubbles */
const ROLE_LABELS: Record<ParticipantRole, string> = {
  judge: 'Judge',
  petitioner: 'Petitioner',
  respondent: 'Respondent',
  opposing_counsel: 'Opposing Counsel',
  witness: 'Witness',
  clerk: 'Clerk',
  bailiff: 'Bailiff',
};

/**
 * DialogueBox renders the courtroom dialogue and provides
 * an input area for user responses.
 */
export const DialogueBox: React.FC<DialogueBoxProps> = ({
  turns,
  onSubmit,
  isUserTurn,
  latestFeedback,
  maxLength = 2000,
  placeholder = 'Type your response to the court...',
}) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  /** Auto-scroll to bottom when new turns are added */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns.length]);

  /** Handle form submission */
  const handleSubmit = useCallback(() => {
    const trimmed = inputText.trim();
    if (trimmed.length === 0) return;
    onSubmit(trimmed);
    setInputText('');
  }, [inputText, onSubmit]);

  return React.createElement(
    'div',
    { className: 'dialogue-box', role: 'log', 'aria-label': 'Courtroom dialogue' },
    // Message list
    React.createElement(
      'div',
      { className: 'dialogue-messages', ref: scrollRef },
      ...turns.map((turn) =>
        React.createElement(
          'div',
          {
            key: turn.id,
            className: `dialogue-turn dialogue-turn--${turn.role}`,
          },
          React.createElement('span', { className: 'dialogue-role' }, ROLE_LABELS[turn.role] ?? turn.role),
          React.createElement('p', { className: 'dialogue-text' }, turn.dialogue),
          // Inline feedback for user turns
          turn.feedback
            ? React.createElement(
                'div',
                { className: 'dialogue-feedback', 'aria-label': 'Coaching feedback' },
                React.createElement('span', null, `Tip: ${turn.feedback.tip}`),
              )
            : null,
        ),
      ),
    ),
    // Coaching feedback banner
    latestFeedback
      ? React.createElement(
          'div',
          { className: 'dialogue-coaching', 'aria-live': 'polite' },
          `Coach: ${latestFeedback.tip}`,
        )
      : null,
    // Input area
    isUserTurn
      ? React.createElement(
          'div',
          { className: 'dialogue-input' },
          React.createElement('textarea', {
            value: inputText,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setInputText(e.target.value),
            maxLength,
            placeholder,
            'aria-label': 'Your response',
            rows: 3,
          }),
          React.createElement(
            'button',
            {
              onClick: handleSubmit,
              disabled: inputText.trim().length === 0,
              'aria-label': 'Submit response',
            },
            'Submit',
          ),
        )
      : React.createElement(
          'div',
          { className: 'dialogue-waiting', 'aria-live': 'polite' },
          'Waiting for the court...',
        ),
  );
};

export default DialogueBox;
