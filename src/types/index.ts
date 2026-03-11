// ─── Variable ────────────────────────────────────────────────────────────────

export type VariableImpact = 'positive' | 'negative' | 'neutral'

export interface Variable {
  id: string
  name: string
  value: number        // 0–100 slider
  weight: number       // 0–1, how much this variable influences outcomes
  impact: VariableImpact
}

// ─── Scenario ────────────────────────────────────────────────────────────────

export type ScenarioType = 'best' | 'expected' | 'worst'

export interface ScenarioOutcome {
  type: ScenarioType
  label: string
  description: string
  delta: number        // percentage change, e.g. +40, -5
  confidence: number   // 0–100
  drivers: string[]    // which variables drove this outcome
}

// ─── Simulation ──────────────────────────────────────────────────────────────

export interface SimulationResult {
  id: string
  decision: string
  variables: Variable[]
  outcomes: ScenarioOutcome[]
  generatedAt: Date
}

// ─── App State ───────────────────────────────────────────────────────────────

export interface SimulatorState {
  decision: string
  variables: Variable[]
  result: SimulationResult | null
  isLoading: boolean
  error: string | null
}
