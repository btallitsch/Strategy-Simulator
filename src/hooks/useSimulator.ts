import { useCallback, useReducer } from 'react'
import type { Variable, SimulatorState, VariableImpact } from '@/types'
import { runSimulation } from '@/logic/scenarioEngine'
import {
  addVariable,
  removeVariable,
  updateVariableValue,
  updateVariableImpact,
  updateVariableWeight,
  DEFAULT_VARIABLES,
} from '@/logic/variableUtils'

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_DECISION'; payload: string }
  | { type: 'ADD_VARIABLE'; payload: string }
  | { type: 'REMOVE_VARIABLE'; payload: string }
  | { type: 'UPDATE_VALUE'; payload: { id: string; value: number } }
  | { type: 'UPDATE_IMPACT'; payload: { id: string; impact: VariableImpact } }
  | { type: 'UPDATE_WEIGHT'; payload: { id: string; weight: number } }
  | { type: 'SIMULATE_START' }
  | { type: 'SIMULATE_SUCCESS'; payload: SimulatorState['result'] }
  | { type: 'SIMULATE_ERROR'; payload: string }
  | { type: 'RESET' }

// ─── Reducer ─────────────────────────────────────────────────────────────────

const initialState: SimulatorState = {
  decision: 'Increase ad budget',
  variables: DEFAULT_VARIABLES,
  result: null,
  isLoading: false,
  error: null,
}

function reducer(state: SimulatorState, action: Action): SimulatorState {
  switch (action.type) {
    case 'SET_DECISION':
      return { ...state, decision: action.payload, result: null }

    case 'ADD_VARIABLE':
      return { ...state, variables: addVariable(state.variables, action.payload) }

    case 'REMOVE_VARIABLE':
      return { ...state, variables: removeVariable(state.variables, action.payload), result: null }

    case 'UPDATE_VALUE':
      return {
        ...state,
        variables: updateVariableValue(state.variables, action.payload.id, action.payload.value),
        result: null,
      }

    case 'UPDATE_IMPACT':
      return {
        ...state,
        variables: updateVariableImpact(state.variables, action.payload.id, action.payload.impact),
        result: null,
      }

    case 'UPDATE_WEIGHT':
      return {
        ...state,
        variables: updateVariableWeight(state.variables, action.payload.id, action.payload.weight),
        result: null,
      }

    case 'SIMULATE_START':
      return { ...state, isLoading: true, error: null }

    case 'SIMULATE_SUCCESS':
      return { ...state, isLoading: false, result: action.payload }

    case 'SIMULATE_ERROR':
      return { ...state, isLoading: false, error: action.payload }

    case 'RESET':
      return { ...initialState, variables: DEFAULT_VARIABLES.map(v => ({ ...v })) }

    default:
      return state
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSimulator() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setDecision = useCallback((decision: string) => {
    dispatch({ type: 'SET_DECISION', payload: decision })
  }, [])

  const addVar = useCallback((name: string) => {
    dispatch({ type: 'ADD_VARIABLE', payload: name })
  }, [])

  const removeVar = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_VARIABLE', payload: id })
  }, [])

  const updateValue = useCallback((id: string, value: number) => {
    dispatch({ type: 'UPDATE_VALUE', payload: { id, value } })
  }, [])

  const updateImpact = useCallback((id: string, impact: VariableImpact) => {
    dispatch({ type: 'UPDATE_IMPACT', payload: { id, impact } })
  }, [])

  const updateWeight = useCallback((id: string, weight: number) => {
    dispatch({ type: 'UPDATE_WEIGHT', payload: { id, weight } })
  }, [])

  const simulate = useCallback(async () => {
    if (!state.decision.trim()) {
      dispatch({ type: 'SIMULATE_ERROR', payload: 'Please enter a strategic decision first.' })
      return
    }
    if (state.variables.length === 0) {
      dispatch({ type: 'SIMULATE_ERROR', payload: 'Add at least one variable to simulate.' })
      return
    }

    dispatch({ type: 'SIMULATE_START' })

    // Small async delay to give the UI a chance to show loading state
    await new Promise(r => setTimeout(r, 900))

    try {
      const result = runSimulation(state.decision, state.variables)
      dispatch({ type: 'SIMULATE_SUCCESS', payload: result })
    } catch (err) {
      dispatch({
        type: 'SIMULATE_ERROR',
        payload: err instanceof Error ? err.message : 'Simulation failed.',
      })
    }
  }, [state.decision, state.variables])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return {
    state,
    setDecision,
    addVar,
    removeVar,
    updateValue,
    updateImpact,
    updateWeight,
    simulate,
    reset,
  }
}

export type UseSimulatorReturn = ReturnType<typeof useSimulator>
