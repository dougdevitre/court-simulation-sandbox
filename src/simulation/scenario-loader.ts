/**
 * @fileoverview ScenarioLoader — Load Hearing Types
 *
 * Loads and validates courtroom scenarios from the scenario library.
 * Scenarios define case types, participants, phases, and context
 * for AI actors to operate within.
 *
 * @module @justice-os/court-sandbox/simulation/scenario-loader
 */

import type { Scenario } from '../types';

/** Supported scenario category types */
export type ScenarioCategory =
  | 'family'
  | 'civil'
  | 'small-claims'
  | 'housing'
  | 'criminal'
  | 'traffic';

/** Options for customizing a loaded scenario */
export interface ScenarioOptions {
  /** Jurisdiction code (e.g., 'MO', 'IL') */
  jurisdiction?: string;
  /** Override the default difficulty-related context */
  difficultyContext?: Record<string, unknown>;
  /** Additional facts to inject into the scenario */
  additionalFacts?: string[];
  /** Any domain-specific parameters (e.g., childrenCount) */
  [key: string]: unknown;
}

/** Validation result returned by {@link ScenarioLoader.validate} */
export interface ScenarioValidationResult {
  /** Whether the scenario passed validation */
  valid: boolean;
  /** Validation error messages, empty when valid */
  errors: string[];
}

/**
 * ScenarioLoader provides static methods for loading pre-built
 * and custom courtroom hearing scenarios.
 *
 * @example
 * ```typescript
 * const scenario = await ScenarioLoader.load('custody-hearing', {
 *   jurisdiction: 'MO',
 *   childrenCount: 2,
 * });
 * ```
 */
export class ScenarioLoader {
  /** In-memory registry of custom scenarios */
  private static customScenarios: Map<string, Scenario> = new Map();

  /**
   * Load a scenario by its identifier with optional customization.
   *
   * @param scenarioId - The scenario identifier (e.g., 'custody-hearing')
   * @param options - Optional customization parameters
   * @returns The loaded and configured scenario
   * @throws {Error} If the scenario ID is not found
   */
  static async load(
    scenarioId: string,
    options?: ScenarioOptions,
  ): Promise<Scenario> {
    // Check custom registry first
    const custom = ScenarioLoader.customScenarios.get(scenarioId);
    if (custom) {
      return ScenarioLoader.applyOptions(custom, options);
    }

    // TODO: Load built-in scenario from scenario library JSON / DB
    // TODO: Apply customization options (jurisdiction overrides, facts)
    // TODO: Validate scenario structure before returning
    throw new Error('Not implemented');
  }

  /**
   * List all available scenario identifiers.
   *
   * @returns Array of available scenario IDs with built-in and custom entries
   */
  static async list(): Promise<string[]> {
    const builtIn: string[] = [
      'custody-hearing',
      'eviction-hearing',
      'small-claims',
      'order-of-protection',
      'traffic-violation',
      'debt-collection',
    ];
    const custom = Array.from(ScenarioLoader.customScenarios.keys());
    return [...builtIn, ...custom];
  }

  /**
   * Validate a scenario definition for structural correctness.
   *
   * @param scenario - The scenario object to validate
   * @returns Validation result with any error messages
   */
  static validate(scenario: Scenario): ScenarioValidationResult {
    const errors: string[] = [];

    if (!scenario.id) errors.push('Scenario must have an id');
    if (!scenario.name) errors.push('Scenario must have a name');
    if (!scenario.caseType) errors.push('Scenario must have a caseType');
    if (!scenario.jurisdiction) errors.push('Scenario must have a jurisdiction');
    if (!scenario.participants || scenario.participants.length === 0) {
      errors.push('Scenario must have at least one participant');
    }
    if (!scenario.phases || scenario.phases.length === 0) {
      errors.push('Scenario must have at least one phase');
    }

    const hasJudge = scenario.participants?.some((p) => p.role === 'judge');
    if (!hasJudge) {
      errors.push('Scenario must include a participant with the judge role');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Get scenarios filtered by case-type category.
   *
   * @param category - The scenario category to filter by
   * @returns Matching scenario IDs
   */
  static async getByType(category: ScenarioCategory): Promise<string[]> {
    const all = await ScenarioLoader.list();
    // TODO: Filter by category metadata from scenario definitions
    throw new Error('Not implemented');
  }

  /**
   * Return a list of recommended scenarios based on the user's
   * experience level and past simulation history.
   *
   * @param userId - The user requesting recommendations
   * @param limit - Maximum number of recommendations (default 3)
   * @returns Recommended scenario IDs ordered by relevance
   */
  static async getRecommended(
    userId: string,
    limit: number = 3,
  ): Promise<string[]> {
    // TODO: Query user's simulation history
    // TODO: Recommend scenarios they haven't tried or scored low on
    throw new Error('Not implemented');
  }

  /**
   * Register a custom scenario definition for use in simulations.
   *
   * @param scenario - The custom scenario to register
   * @throws {Error} If the scenario fails validation
   */
  static async register(scenario: Scenario): Promise<void> {
    const validation = ScenarioLoader.validate(scenario);
    if (!validation.valid) {
      throw new Error(
        `Invalid scenario: ${validation.errors.join('; ')}`,
      );
    }
    ScenarioLoader.customScenarios.set(scenario.id, scenario);
  }

  /**
   * Apply customization options to a loaded scenario.
   *
   * @param scenario - The base scenario
   * @param options - Customization parameters
   * @returns A new scenario with applied options
   */
  private static applyOptions(
    scenario: Scenario,
    options?: ScenarioOptions,
  ): Scenario {
    if (!options) return { ...scenario };
    return {
      ...scenario,
      jurisdiction: options.jurisdiction ?? scenario.jurisdiction,
      context: { ...scenario.context, ...options.difficultyContext },
    };
  }
}
