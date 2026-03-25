# Data Model — Court Simulation Sandbox

Entity-relationship diagram for the Court Simulation Sandbox persistence layer.

```mermaid
erDiagram
    SimulationSession {
        string id PK
        string scenarioId FK
        string userId
        string currentPhase
        string status "active | paused | completed"
        datetime startedAt
        datetime endedAt
    }

    Scenario {
        string id PK
        string name
        string caseType
        string jurisdiction
        string description
        json context
        json phases
    }

    Participant {
        string id PK
        string sessionId FK
        string name
        string role "judge | petitioner | respondent | ..."
        boolean isAI
        json personality
    }

    Turn {
        string id PK
        string sessionId FK
        string participantId FK
        string role
        string dialogue
        datetime timestamp
        json feedback
    }

    PerformanceReport {
        string id PK
        string sessionId FK
        int overallScore
        int etiquette
        int arguments
        int procedure
        int clarity
        json outcomePrediction
        json improvements
    }

    SimulationSession ||--o{ Participant : "has"
    SimulationSession ||--o{ Turn : "contains"
    SimulationSession ||--|| Scenario : "uses"
    SimulationSession ||--o| PerformanceReport : "produces"
    Turn }o--|| Participant : "spoken by"
```

## Entity Descriptions

| Entity | Purpose |
|--------|---------|
| **SimulationSession** | Root record for a single courtroom practice run |
| **Scenario** | Pre-built or custom hearing template with facts, participants, and phases |
| **Participant** | A human or AI actor within a session (judge, petitioner, counsel, etc.) |
| **Turn** | A single dialogue exchange in the session transcript |
| **PerformanceReport** | Aggregated scores and improvement recommendations for a completed session |
