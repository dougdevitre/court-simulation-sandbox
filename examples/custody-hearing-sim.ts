/**
 * @fileoverview Custody Hearing Simulation Example
 *
 * Demonstrates how to set up and run a custody hearing simulation
 * with an AI judge, receive real-time coaching feedback, and view
 * outcome predictions based on performance.
 *
 * @example
 * ```bash
 * npx ts-node examples/custody-hearing-sim.ts
 * ```
 */

import {
  Courtroom,
  ScenarioLoader,
  JudgeAI,
  RealtimeCoach,
  OutcomePredictor,
} from '@justice-os/court-sandbox';
import type {
  SimulationSession,
  Scenario,
  PerformanceScore,
} from '@justice-os/court-sandbox';

async function runCustodyHearingSimulation(): Promise<void> {
  // 1. Load the custody hearing scenario
  const scenario: Scenario = await ScenarioLoader.load('custody-hearing', {
    jurisdiction: 'MO',
    childrenCount: 2,
    childrenAges: [5, 8],
    disputeType: 'modification',
  });

  console.log(`Loaded scenario: ${scenario.name}`);
  console.log(`Case type: ${scenario.caseType}`);
  console.log(`Participants: ${scenario.participants.map((p) => p.role).join(', ')}`);

  // 2. Create the courtroom with beginner-friendly settings
  const courtroom = new Courtroom({
    scenario,
    difficulty: 'beginner',
    feedbackLevel: 'verbose',
    enableCoaching: true,
    enableOutcomePrediction: true,
  });

  // 3. Start the simulation session
  const session: SimulationSession = await courtroom.startSession();
  console.log(`\nSession started: ${session.id}`);
  console.log('---');

  // 4. Judge opens the hearing
  const opening = await session.nextTurn();
  console.log(`\nJudge: ${opening.dialogue}`);

  // 5. User introduces themselves
  const intro = await session.submitResponse({
    text: 'Good morning, Your Honor. My name is Jane Smith. I am the petitioner in this custody modification case.',
    participantId: 'user',
  });

  console.log(`\nEtiquette: ${intro.etiquetteScore}/10`);
  console.log(`Tip: ${intro.tip}`);

  // 6. Judge asks about the modification request
  const judgeQuestion = await session.nextTurn();
  console.log(`\nJudge: ${judgeQuestion.dialogue}`);

  // 7. User presents their case
  const argument = await session.submitResponse({
    text: 'Your Honor, I am requesting a modification because circumstances have changed significantly. I now have a stable job with daytime hours, and the children have expressed a desire to spend more time with me.',
    participantId: 'user',
  });

  console.log(`\nArgument Score: ${argument.argumentScore}/10`);
  console.log(`Clarity Score: ${argument.clarityScore}/10`);
  console.log(`Tip: ${argument.tip}`);

  // 8. Opposing counsel responds
  const opposingArg = await session.nextTurn();
  console.log(`\nOpposing Counsel: ${opposingArg.dialogue}`);

  // 9. End the session and get the performance report
  const report = await session.endSession();

  console.log('\n=== Performance Report ===');
  console.log(`Overall Score: ${report.overallScore}/100`);
  console.log(`Etiquette: ${report.breakdown.etiquette}/25`);
  console.log(`Arguments: ${report.breakdown.arguments}/25`);
  console.log(`Procedure: ${report.breakdown.procedure}/25`);
  console.log(`Clarity: ${report.breakdown.clarity}/25`);

  console.log(`\nOutcome Prediction:`);
  console.log(`  Favorable: ${report.outcomePrediction.favorable}%`);
  console.log(`  Unfavorable: ${report.outcomePrediction.unfavorable}%`);
  console.log(`  Partial: ${report.outcomePrediction.partial}%`);

  console.log(`\nKey Improvements:`);
  report.improvements.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item}`);
  });
}

runCustodyHearingSimulation().catch(console.error);
