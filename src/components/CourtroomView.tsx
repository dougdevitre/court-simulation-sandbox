/**
 * @fileoverview CourtroomView — Visual Courtroom Layout
 *
 * React component that renders the virtual courtroom environment,
 * showing participant positions, the judge's bench, and the
 * current state of the hearing.
 *
 * @module @justice-os/court-sandbox/components/CourtroomView
 */

import React, { useMemo, useCallback } from 'react';
import type { SimulationSession, Participant, ParticipantRole } from '../types';

/** Position coordinates for a courtroom seat */
export interface SeatPosition {
  /** Label for the seat (e.g., "Judge's Bench") */
  label: string;
  /** CSS grid row */
  row: number;
  /** CSS grid column */
  col: number;
}

/** Props for the CourtroomView component */
export interface CourtroomViewProps {
  /** The active simulation session */
  session: SimulationSession;
  /** Callback when user selects a participant to interact with */
  onParticipantSelect?: (participant: Participant) => void;
  /** Optional CSS class name for the root element */
  className?: string;
}

/** Default seat positions by role */
const SEAT_POSITIONS: Record<ParticipantRole, SeatPosition> = {
  judge: { label: "Judge's Bench", row: 1, col: 2 },
  clerk: { label: 'Court Clerk', row: 2, col: 1 },
  witness: { label: 'Witness Stand', row: 2, col: 3 },
  petitioner: { label: 'Petitioner Table', row: 3, col: 1 },
  respondent: { label: 'Respondent Table', row: 3, col: 3 },
  opposing_counsel: { label: 'Opposing Counsel', row: 3, col: 3 },
  bailiff: { label: 'Bailiff', row: 2, col: 2 },
};

/**
 * CourtroomView renders the visual layout of the virtual courtroom,
 * including the judge's bench, witness stand, counsel tables,
 * and gallery seating.
 */
export const CourtroomView: React.FC<CourtroomViewProps> = ({
  session,
  onParticipantSelect,
  className,
}) => {
  /** Determine which participant is currently speaking */
  const activeSpeaker = useMemo(() => {
    const lastTurn = session.turns[session.turns.length - 1];
    return lastTurn?.participantId ?? null;
  }, [session.turns]);

  /** Handle click on a participant seat */
  const handleSeatClick = useCallback(
    (participant: Participant) => {
      onParticipantSelect?.(participant);
    },
    [onParticipantSelect],
  );

  return React.createElement(
    'div',
    {
      className: `courtroom-view ${className ?? ''}`.trim(),
      'aria-label': 'Courtroom layout',
      role: 'region',
    },
    // Phase indicator
    React.createElement(
      'div',
      { className: 'courtroom-phase', 'aria-live': 'polite' },
      `Phase: ${session.currentPhase}`,
    ),
    // Participant seats
    ...session.participants.map((participant) => {
      const seat = SEAT_POSITIONS[participant.role];
      const isActive = participant.id === activeSpeaker;
      return React.createElement(
        'button',
        {
          key: participant.id,
          className: `courtroom-seat ${isActive ? 'courtroom-seat--active' : ''}`,
          style: { gridRow: seat.row, gridColumn: seat.col },
          onClick: () => handleSeatClick(participant),
          'aria-label': `${participant.name} - ${seat.label}${isActive ? ' (speaking)' : ''}`,
        },
        React.createElement('span', { className: 'seat-label' }, seat.label),
        React.createElement('span', { className: 'seat-name' }, participant.name),
      );
    }),
  );
};

export default CourtroomView;
