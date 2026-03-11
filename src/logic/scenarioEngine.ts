import type { Variable, ScenarioOutcome, SimulationResult, VariableImpact } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}

/**
 * Compute a weighted score from variables for a given scenario multiplier.
 * multiplier: 1.0 = expected, 1.4 = optimistic, 0.6 = pessimistic
 */
function computeScore(variables: Variable[], multiplier: number): number {
  if (variables.length === 0) return 0

  const totalWeight = variables.reduce((sum, v) => sum + v.weight, 0)
  if (totalWeight === 0) return 0

  const rawScore = variables.reduce((sum, v) => {
    const direction = v.impact === 'negative' ? -1 : v.impact === 'neutral' ? 0.2 : 1
    const normalised = (v.value / 100) * direction
    return sum + normalised * (v.weight / totalWeight)
  }, 0)

  // Scale to a −60 … +60 range, then apply multiplier
  return Math.round(rawScore * 60 * multiplier)
}

/** Identify which variables had the most influence */
function findDrivers(variables: Variable[], impact: VariableImpact): string[] {
  return variables
    .filter(v => v.impact === impact && v.value > 50)
    .sort((a, b) => b.value * b.weight - a.value * a.weight)
    .slice(0, 3)
    .map(v => v.name)
}

/** Derive a human-readable outcome description */
function buildDescription(delta: number, decision: string, type: 'best' | 'expected' | 'worst'): string {
  const topic = decision.trim() || 'your strategy'

  if (type === 'best') {
    if (delta > 30) return `Strong execution of ${topic} unlocks significant upside across all key metrics.`
    if (delta > 10) return `Favourable conditions and solid execution yield measurable gains from ${topic}.`
    return `${topic} shows modest positive traction in an optimistic scenario.`
  }

  if (type === 'expected') {
    if (delta > 15) return `${topic} delivers above-average results under realistic conditions.`
    if (delta > 0)  return `${topic} generates incremental gains in the most probable scenario.`
    return `${topic} faces headwinds; breaking even is the likely outcome.`
  }

  // worst
  if (delta < -20) return `Compounding risks erode the benefits of ${topic}; significant losses are possible.`
  if (delta < 0)  return `Adverse conditions limit ${topic}, resulting in negative returns.`
  return `Even in a pessimistic scenario ${topic} manages to avoid deep losses.`
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Compute confidence based on variable consistency.
 * High variance across variable values = low confidence.
 */
export function computeConfidence(variables: Variable[]): number {
  if (variables.length === 0) return 50
  const values = variables.map(v => v.value)
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
  const stdDev = Math.sqrt(variance)
  // High stdDev → low confidence; cap at 0–95
  return Math.max(20, Math.min(95, Math.round(85 - stdDev * 0.6)))
}

/**
 * Main simulation function — pure, deterministic given inputs.
 */
export function runSimulation(decision: string, variables: Variable[]): SimulationResult {
  const bestDelta     = computeScore(variables, 1.5)
  const expectedDelta = computeScore(variables, 1.0)
  const worstDelta    = computeScore(variables, 0.5)

  const positiveDrivers = findDrivers(variables, 'positive')
  const negativeDrivers = findDrivers(variables, 'negative')
  const confidence      = computeConfidence(variables)

  const outcomes: ScenarioOutcome[] = [
    {
      type: 'best',
      label: 'Best Case',
      description: buildDescription(bestDelta, decision, 'best'),
      delta: bestDelta,
      confidence: Math.min(95, confidence + 10),
      drivers: positiveDrivers.length ? positiveDrivers : ['Favourable market conditions'],
    },
    {
      type: 'expected',
      label: 'Expected Case',
      description: buildDescription(expectedDelta, decision, 'expected'),
      delta: expectedDelta,
      confidence,
      drivers: [...positiveDrivers.slice(0, 1), ...negativeDrivers.slice(0, 1)].filter(Boolean),
    },
    {
      type: 'worst',
      label: 'Worst Case',
      description: buildDescription(worstDelta, decision, 'worst'),
      delta: worstDelta,
      confidence: Math.min(95, confidence + 5),
      drivers: negativeDrivers.length ? negativeDrivers : ['Unfavourable competitive response'],
    },
  ]

  return {
    id: generateId(),
    decision,
    variables: variables.map(v => ({ ...v })),
    outcomes,
    generatedAt: new Date(),
  }
}
