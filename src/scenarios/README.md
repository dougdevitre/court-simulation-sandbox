# Custom Scenarios

This directory contains courtroom scenario definitions. Each scenario defines the case type, participants, phases, and context for a simulation.

## Creating a Custom Scenario

1. Create a new `.json` file in this directory
2. Follow the `Scenario` interface from `src/types/index.ts`
3. Register the scenario using `ScenarioLoader.register()`

## Scenario Structure

```json
{
  "id": "my-custom-scenario",
  "name": "Custom Small Claims Hearing",
  "caseType": "small-claims",
  "jurisdiction": "MO",
  "description": "A dispute over a security deposit...",
  "participants": [
    { "id": "judge", "name": "Judge Williams", "role": "judge", "isAI": true },
    { "id": "user", "name": "Plaintiff", "role": "petitioner", "isAI": false },
    { "id": "defendant", "name": "Landlord", "role": "respondent", "isAI": true }
  ],
  "phases": ["opening", "petitioner-testimony", "respondent-testimony", "closing", "ruling"],
  "context": {
    "amount": 1500,
    "disputeType": "security-deposit"
  }
}
```

## Built-in Scenarios

- `custody-hearing` — Child custody modification hearing
- `eviction-defense` — Tenant eviction defense hearing
- `small-claims` — Small claims court dispute
- `protective-order` — Protective/restraining order hearing
- `traffic-court` — Traffic violation hearing
