import { useSimulator } from '@/hooks/useSimulator'
import { SimulatorLayout } from '@/components/SimulatorLayout'

export default function App() {
  const simulator = useSimulator()
  return <SimulatorLayout simulator={simulator} />
}
