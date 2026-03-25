/**
 * @fileoverview Small Claims Court Simulation Example
 *
 * Demonstrates a small claims court dispute where the user
 * is suing for recovery of a security deposit. Includes
 * presenting evidence, responding to the defendant, and
 * receiving performance feedback.
 *
 * @example
 * ```bash
 * npx ts-node examples/small-claims-sim.ts
 * ```
 */

import {
  Courtroom,
  ScenarioLoader,
  RealtimeCoach,
  PerformanceScorer,
} from '@justice-os/court-sandbox';
import type {
  SimulationSession,
  Scenario,
  PerformanceScore,
} from '@justice-os/court-sandbox';

async function runSmallClaimsSimulation(): Promise<void> {
  // 1. Load the small claims scenario
  const scenario: Scenario = await ScenarioLoader.load('small-claims', {
    jurisdiction: 'MO',
    claimAmount: 3500,
    claimType: 'security-deposit',
    defendantType: 'landlord',
  });

  console.log(`Loaded scenario: ${scenario.name}`);
  console.log(`Case type: ${scenario.caseType}`);
  console.log(`Jurisdiction: ${scenario.jurisdiction}`);
  console.log(`Participants: ${scenario.participants.map((p) => p.role).join(', ')}`);

  // 2. Create the courtroom with intermediate settings
  const courtroom = new Courtroom({
    scenario,
    difficulty: 'intermediate',
    feedbackLevel: 'moderate',
    enableCoaching: true,
    judgeDemeanor: 'neutral',
  });

  // 3. Start the simulation session
  const session: SimulationSession = await courtroom.startSession();
  console.log(`\nSession started: ${session.id}`);
  console.log('---');

  // 4. Judge opens the hearing
  const opening = await session.nextTurn();
  console.log(`\nJudge: ${opening.dialogue}`);

  // 5. User introduces themselves and states the claim
  const intro = await session.submitResponse({
    text: 'Good morning, Your Honor. My name is Alex Rivera. I am the plaintiff in this matter. I am seeking the return of my $3,500 security deposit from my former landlord, who has failed to return it within the 30-day period required by Missouri law, RSMo Section 535.300.',
    participantId: 'user',
  });

  console.log(`\nEtiquette: ${intro.etiquetteScore}/10`);
  console.log(`Argument: ${intro.argumentScore}/10`);
  console.log(`Tip: ${intro.tip}`);

  // 6. Defendant/landlord responds
  const defenseResponse = await session.nextTurn();
  console.log(`\nDefendant: ${defenseResponse.dialogue}`);

  // 7. User presents evidence
  const evidence = await session.submitResponse({
    text: 'Your Honor, I would like to present three pieces of evidence. First, my signed lease agreement showing the $3,500 deposit. Second, photographs taken at move-in and move-out documenting the condition of the apartment. Third, my certified letter requesting the deposit return, sent 45 days ago with no response.',
    participantId: 'user',
  });

  console.log(`\nArgument Score: ${evidence.argumentScore}/10`);
  console.log(`Procedure Score: ${evidence.procedureScore}/10`);
  console.log(`Tip: ${evidence.tip}`);

  // 8. Judge asks a follow-up question
  const judgeFollowUp = await session.nextTurn();
  console.log(`\nJudge: ${judgeFollowUp.dialogue}`);

  // 9. User responds to the question
  const response = await session.submitResponse({
    text: 'Yes, Your Honor. The apartment was returned in the same condition as when I moved in, aside from normal wear and tear. I have the photographs to demonstrate this. The landlord provided no itemized list of deductions as required by statute.',
    participantId: 'user',
  });

  console.log(`\nClarity: ${response.clarityScore}/10`);
  console.log(`Tip: ${response.tip}`);

  // 10. End the session and view results
  const report: PerformanceScore = await session.endSession();

  console.log('\n=== Performance Report ===');
  console.log(`Overall Score: ${report.overallScore}/100`);
  console.log(`Etiquette: ${report.breakdown.etiquette}/25`);
  console.log(`Arguments: ${report.breakdown.arguments}/25`);
  console.log(`Procedure: ${report.breakdown.procedure}/25`);
  console.log(`Clarity: ${report.breakdown.clarity}/25`);

  console.log('\nKey Improvements:');
  report.improvements.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item}`);
  });
}

runSmallClaimsSimulation().catch(console.error);
