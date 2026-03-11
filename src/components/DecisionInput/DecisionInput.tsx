import { type ChangeEvent } from 'react'
import styles from './DecisionInput.module.css'

interface DecisionInputProps {
  value: string
  onChange: (value: string) => void
}

export function DecisionInput({ value, onChange }: DecisionInputProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value)
  }

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="decision-input">
        <span className={styles.labelIndex}>01</span>
        Strategic Decision
      </label>
      <div className={styles.inputWrapper}>
        <span className={styles.prompt}>›</span>
        <input
          id="decision-input"
          className={styles.input}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="e.g. Increase ad budget, Enter new market, Launch product line…"
          maxLength={120}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <p className={styles.hint}>
        Define the strategic move you want to model. Be specific for better results.
      </p>
    </div>
  )
}
