/**
 * @fileoverview Eviction Hearing Simulation — Tenant Defense
 *
 * Demonstrates an eviction defense simulation where the user
 * represents themselves as a tenant facing eviction. Features
 * an AI landlord counsel opponent, an AI judge, real-time
 * coaching on procedural defenses, and outcome prediction.
 *
 * @example
 * ```bash
 * npx ts-node examples/eviction-hearing-sim.ts
 * ```
 */

import {
  Courtroom,
  ScenarioLoader,
  OpposingCounselAI,
  RealtimeCoach,
  OutcomePredictor,
} from '@justice-os/court-sandbox';
import type {
  SimulationSession,
  Scenario,
  PerformanceScore,
} from '@justice-os/court-sandbox';

async function runEvictionDefenseSimulation(): Promise<void> {
  // 1. Load the eviction hearing scenario
  const scenario: Scenario = await ScenarioLoader.load('eviction-hearing', {
    jurisdiction: 'MO',
    evictionBasis: 'nonpayment',
    rentAmount: 1200,
    monthsBehind: 2,
    hasRepairIssues: true,
  });

  console.log(`Loaded scenario: ${scenario.name}`);
  console.log(`Case type: ${scenario.caseType}`);
  console.log(`Description: ${scenario.description}`);
  console.log();

  // 2. Create the courtroom -- beginner mode with maximum coaching
  const courtroom = new Courtroom({
    scenario,
    difficulty: 'beginner',
    feedbackLevel: 'verbose',
    enableCoaching: true,
    enableOutcomePrediction: true,
    judgeDemeanor: 'patient',
  });

  // 3. Start the simulation
  const session: SimulationSession = await courtroom.startSession();
  console.log(`Session started: ${session.id}`);
  console.log('---');

  // 4. Judge opens the hearing
  const opening = await session.nextTurn();
  console.log(`\nJudge: ${opening.dialogue}`);

  // 5. Landlord's counsel presents the case for eviction
  const landlordOpening = await session.nextTurn();
  console.log(`\nLandlord's Counsel: ${landlordOpening.dialogue}`);

  // 6. User (tenant) responds -- addressing the court
  const tenantResponse = await session.submitResponse({
    text: 'Your Honor, I appreciate the opportunity to respond. While I acknowledge that my rent payments have been late, I want to bring to the court\'s attention that the apartment has had serious habitability issues. The heating system has been broken for three months, and I have repeatedly notified my landlord in writing with no repairs being made.',
    participantId: 'user',
  });

  console.log(`\nEtiquette: ${tenantResponse.etiquetteScore}/10`);
  console.log(`Argument: ${tenantResponse.argumentScore}/10`);
  console.log(`Procedure: ${tenantResponse.procedureScore}/10`);
  console.log(`Tip: ${tenantResponse.tip}`);
  if (tenantResponse.suggestedAlternative) {
    console.log(`\nSuggested phrasing: "${tenantResponse.suggestedAlternative}"`);
  }

  // 7. Landlord's counsel objects
  const objection = await session.nextTurn();
  console.log(`\nLandlord's Counsel: ${objection.dialogue}`);

  // 8. Judge rules on the objection
  const ruling = await session.nextTurn();
  console.log(`\nJudge: ${ruling.dialogue}`);

  // 9. User presents evidence of repair requests
  const evidencePresentation = await session.submitResponse({
    text: 'Your Honor, I would like to submit into evidence three written repair requests I sent to the landlord via certified mail on January 15, February 10, and March 3. I also have photographs of the broken heating unit and a letter from the city housing inspector confirming the code violation.',
    participantId: 'user',
  });

  console.log(`\nArgument: ${evidencePresentation.argumentScore}/10`);
  console.log(`Clarity: ${evidencePresentation.clarityScore}/10`);
  console.log(`Tip: ${evidencePresentation.tip}`);

  // 10. End session and review performance
  const report: PerformanceScore = await session.endSession();

  console.log('\n=== Performance Report ===');
  console.log(`Overall Score: ${report.overallScore}/100`);
  console.log(`Etiquette: ${report.breakdown.etiquette}/25`);
  console.log(`Arguments: ${report.breakdown.arguments}/25`);
  console.log(`Procedure: ${report.breakdown.procedure}/25`);
  console.log(`Clarity: ${report.breakdown.clarity}/25`);

  console.log('\nOutcome Prediction:');
  console.log(`  Favorable: ${report.outcomePrediction.favorable}%`);
  console.log(`  Unfavorable: ${report.outcomePrediction.unfavorable}%`);
  console.log(`  Partial: ${report.outcomePrediction.partial}%`);

  console.log('\nKey Improvements:');
  report.improvements.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item}`);
  });
}

runEvictionDefenseSimulation().catch(console.error);
