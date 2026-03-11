import type { UseSimulatorReturn } from '@/hooks/useSimulator'
import { DecisionInput } from '@/components/DecisionInput'
import { VariableControls } from '@/components/VariableControls'
import { ScenarioCard } from '@/components/ScenarioCard'
import styles from './SimulatorLayout.module.css'

interface SimulatorLayoutProps {
  simulator: UseSimulatorReturn
}

export function SimulatorLayout({ simulator }: SimulatorLayoutProps) {
  const { state, setDecision, addVar, removeVar, updateValue, updateImpact, updateWeight, simulate, reset } = simulator

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoSymbol}>◈</span>
            <span className={styles.logoText}>Strategy Simulator</span>
          </div>
          <div className={styles.headerMeta}>
            <span className={styles.metaTag}>SCENARIO MODELLING</span>
            <button className={styles.resetBtn} onClick={reset}>Reset</button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className={styles.main}>
        {/* Left panel: inputs */}
        <section className={styles.inputPanel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelLabel}>Configure Simulation</span>
          </div>

          <div className={styles.inputStack}>
            <DecisionInput value={state.decision} onChange={setDecision} />

            <div className={styles.divider} />

            <VariableControls
              variables={state.variables}
              onAdd={addVar}
              onRemove={removeVar}
              onUpdateValue={updateValue}
              onUpdateImpact={updateImpact}
              onUpdateWeight={updateWeight}
            />
          </div>

          {/* Error */}
          {state.error && (
            <div className={styles.errorBanner}>
              <span className={styles.errorIcon}>!</span>
              {state.error}
            </div>
          )}

          {/* Run button */}
          <button
            className={`${styles.runBtn} ${state.isLoading ? styles.runBtnLoading : ''}`}
            onClick={simulate}
            disabled={state.isLoading}
          >
            {state.isLoading ? (
              <>
                <span className={styles.spinner} />
                Simulating…
              </>
            ) : (
              <>
                <span className={styles.runIcon}>▶</span>
                Run Simulation
              </>
            )}
          </button>
        </section>

        {/* Right panel: results */}
        <section className={styles.resultsPanel}>
          {!state.result && !state.isLoading && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>◈</div>
              <p className={styles.emptyTitle}>No simulation yet</p>
              <p className={styles.emptySubtitle}>
                Configure your decision and variables, then run the simulation to explore scenario outcomes.
              </p>
            </div>
          )}

          {state.isLoading && (
            <div className={styles.loadingState}>
              <div className={styles.loadingPulse}>
                <div className={styles.loadingRing} />
                <div className={styles.loadingRing} />
                <div className={styles.loadingRing} />
              </div>
              <p className={styles.loadingText}>Modelling scenarios…</p>
            </div>
          )}

          {state.result && !state.isLoading && (
            <div className={styles.results}>
              <div className={styles.resultsHeader}>
                <span className={styles.panelLabel}>Scenario Outcomes</span>
                <span className={styles.resultsDecision}>"{state.result.decision}"</span>
              </div>

              <div className={styles.scenarioGrid}>
                {state.result.outcomes.map((outcome, i) => (
                  <ScenarioCard key={outcome.type} outcome={outcome} index={i} />
                ))}
              </div>

              <div className={styles.resultsFooter}>
                <span className={styles.footerMeta}>
                  Generated with {state.result.variables.length} variable{state.result.variables.length !== 1 ? 's' : ''}
                </span>
                <span className={styles.footerMeta}>
                  {state.result.generatedAt.toLocaleTimeString()}
                </span>
              </div>

              <p className={styles.adjustHint}>
                Adjust variable strengths or impact direction to explore how outcomes shift.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
