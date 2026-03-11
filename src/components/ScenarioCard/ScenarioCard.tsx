import type { ScenarioOutcome } from '@/types'
import styles from './ScenarioCard.module.css'

interface ScenarioCardProps {
  outcome: ScenarioOutcome
  index: number
}

const ICONS = { best: '▲', expected: '●', worst: '▼' }

export function ScenarioCard({ outcome, index }: ScenarioCardProps) {
  const sign = outcome.delta >= 0 ? '+' : ''
  const isPositive = outcome.delta > 0
  const isNegative = outcome.delta < 0

  return (
    <div
      className={`${styles.card} ${styles[`card_${outcome.type}`]}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={styles.cardHeader}>
        <span className={`${styles.icon} ${styles[`icon_${outcome.type}`]}`}>
          {ICONS[outcome.type]}
        </span>
        <span className={styles.label}>{outcome.label}</span>
        <span className={`${styles.confidence}`}>
          {outcome.confidence}% confidence
        </span>
      </div>

      <div className={styles.delta}>
        <span
          className={`${styles.deltaValue} ${isPositive ? styles.deltaPositive : isNegative ? styles.deltaNegative : styles.deltaNeutral}`}
        >
          {sign}{outcome.delta}%
        </span>
        <span className={styles.deltaLabel}>projected change</span>
      </div>

      {/* Bar */}
      <div className={styles.barTrack}>
        <div
          className={`${styles.barFill} ${styles[`bar_${outcome.type}`]}`}
          style={{ width: `${Math.min(100, Math.abs(outcome.delta) * 1.4 + 10)}%` }}
        />
      </div>

      <p className={styles.description}>{outcome.description}</p>

      {outcome.drivers.length > 0 && (
        <div className={styles.drivers}>
          <span className={styles.driversLabel}>Key drivers:</span>
          <div className={styles.driverTags}>
            {outcome.drivers.map(d => (
              <span key={d} className={styles.tag}>{d}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
