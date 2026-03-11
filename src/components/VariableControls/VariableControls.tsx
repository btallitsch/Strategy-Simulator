import { useState, type KeyboardEvent } from 'react'
import type { Variable, VariableImpact } from '@/types'
import { IMPACT_LABELS } from '@/logic/variableUtils'
import styles from './VariableControls.module.css'

interface VariableControlsProps {
  variables: Variable[]
  onAdd: (name: string) => void
  onRemove: (id: string) => void
  onUpdateValue: (id: string, value: number) => void
  onUpdateImpact: (id: string, impact: VariableImpact) => void
  onUpdateWeight: (id: string, weight: number) => void
}

const IMPACTS: VariableImpact[] = ['positive', 'negative', 'neutral']
const WEIGHTS = [
  { label: 'Low', value: 0.5 },
  { label: 'Med', value: 1.0 },
  { label: 'High', value: 1.5 },
]

export function VariableControls({
  variables,
  onAdd,
  onRemove,
  onUpdateValue,
  onUpdateImpact,
  onUpdateWeight,
}: VariableControlsProps) {
  const [newVarName, setNewVarName] = useState('')

  function handleAdd() {
    if (newVarName.trim()) {
      onAdd(newVarName.trim())
      setNewVarName('')
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAdd()
  }

  function getWeightLabel(weight: number): string {
    const closest = WEIGHTS.reduce((prev, curr) =>
      Math.abs(curr.value - weight) < Math.abs(prev.value - weight) ? curr : prev
    )
    return closest.label
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.labelIndex}>02</span>
        <span className={styles.labelText}>Key Variables</span>
        <span className={styles.count}>{variables.length}</span>
      </div>

      <div className={styles.variableList}>
        {variables.length === 0 && (
          <p className={styles.empty}>Add variables to model the forces shaping your decision.</p>
        )}

        {variables.map(variable => (
          <div key={variable.id} className={styles.variableRow}>
            <div className={styles.varHeader}>
              <span className={`${styles.impactDot} ${styles[`dot_${variable.impact}`]}`} />
              <span className={styles.varName}>{variable.name}</span>
              <div className={styles.varActions}>
                {/* Impact Toggle */}
                <div className={styles.toggle}>
                  {IMPACTS.map(imp => (
                    <button
                      key={imp}
                      className={`${styles.toggleBtn} ${variable.impact === imp ? styles.toggleActive : ''} ${styles[`toggle_${imp}`]}`}
                      onClick={() => onUpdateImpact(variable.id, imp)}
                      title={IMPACT_LABELS[imp]}
                    >
                      {imp.charAt(0).toUpperCase()}
                    </button>
                  ))}
                </div>
                {/* Weight Toggle */}
                <div className={styles.toggle}>
                  {WEIGHTS.map(w => (
                    <button
                      key={w.label}
                      className={`${styles.toggleBtn} ${getWeightLabel(variable.weight) === w.label ? styles.weightActive : ''}`}
                      onClick={() => onUpdateWeight(variable.id, w.value)}
                      title={`Weight: ${w.label}`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => onRemove(variable.id)}
                  aria-label={`Remove ${variable.name}`}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Slider */}
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>Strength</span>
              <div className={styles.sliderTrack}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={variable.value}
                  onChange={e => onUpdateValue(variable.id, Number(e.target.value))}
                  className={`${styles.slider} ${styles[`slider_${variable.impact}`]}`}
                  aria-label={`${variable.name} strength`}
                />
                <div
                  className={styles.sliderFill}
                  style={{
                    width: `${variable.value}%`,
                  }}
                  data-impact={variable.impact}
                />
              </div>
              <span className={styles.sliderValue}>{variable.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Variable */}
      <div className={styles.addRow}>
        <input
          className={styles.addInput}
          type="text"
          placeholder="Add variable…"
          value={newVarName}
          onChange={e => setNewVarName(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={60}
        />
        <button
          className={styles.addBtn}
          onClick={handleAdd}
          disabled={!newVarName.trim()}
        >
          + Add
        </button>
      </div>
    </div>
  )
}
