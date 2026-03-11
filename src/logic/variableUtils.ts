import type { Variable, VariableImpact } from '@/types'

export function createVariable(name: string, impact: VariableImpact = 'positive'): Variable {
  return {
    id: Math.random().toString(36).slice(2, 10),
    name,
    value: 50,
    weight: 1,
    impact,
  }
}

export function updateVariableValue(variables: Variable[], id: string, value: number): Variable[] {
  return variables.map(v => (v.id === id ? { ...v, value } : v))
}

export function updateVariableImpact(variables: Variable[], id: string, impact: VariableImpact): Variable[] {
  return variables.map(v => (v.id === id ? { ...v, impact } : v))
}

export function updateVariableWeight(variables: Variable[], id: string, weight: number): Variable[] {
  return variables.map(v => (v.id === id ? { ...v, weight } : v))
}

export function removeVariable(variables: Variable[], id: string): Variable[] {
  return variables.filter(v => v.id !== id)
}

export function addVariable(variables: Variable[], name: string): Variable[] {
  if (!name.trim()) return variables
  return [...variables, createVariable(name.trim())]
}

export const DEFAULT_VARIABLES: Variable[] = [
  { id: 'v1', name: 'Ad Performance',     value: 65, weight: 1.2, impact: 'positive' },
  { id: 'v2', name: 'Customer Demand',    value: 70, weight: 1.0, impact: 'positive' },
  { id: 'v3', name: 'Competition Response', value: 55, weight: 0.8, impact: 'negative' },
]

export const IMPACT_LABELS: Record<VariableImpact, string> = {
  positive: 'Positive',
  negative: 'Negative',
  neutral:  'Neutral',
}

export const IMPACT_COLORS: Record<VariableImpact, string> = {
  positive: 'var(--color-positive)',
  negative: 'var(--color-negative)',
  neutral:  'var(--color-neutral)',
}
