/**
 * @fileoverview CourtroomView — Visual Courtroom Layout
 *
 * React component that renders the virtual courtroom environment,
 * showing participant positions, the judge's bench, and the
 * current state of the hearing.
 *
 * @module @justice-os/court-sandbox/components/CourtroomView
 */

import React from 'react';
import type { SimulationSession, Participant } from '../types';

/** Props for the CourtroomView component */
export interface CourtroomViewProps {
  /** The active simulation session */
  session: SimulationSession;
  /** Callback when user selects a participant to interact with */
  onParticipantSelect?: (participant: Participant) => void;
}

/**
 * CourtroomView renders the visual layout of the virtual courtroom,
 * including the judge's bench, witness stand, counsel tables,
 * and gallery seating.
 */
export const CourtroomView: React.FC<CourtroomViewProps> = ({
  session,
  onParticipantSelect,
}) => {
  // TODO: Render courtroom layout with participant positions
  // TODO: Highlight active speaker
  // TODO: Show current phase indicator
  return null;
};

export default CourtroomView;
