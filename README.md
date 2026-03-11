# Strategy Simulator

A lightweight platform to model strategic decisions and explore possible outcomes before acting.

## Features

- **Decision Modelling** — define a strategic move and simulate its outcomes
- **Variable Controls** — add key variables with adjustable strength, impact direction (positive/negative/neutral), and weight
- **Scenario Generation** — best case, expected case, and worst case projections with confidence scores and key drivers
- **Live Adjustment** — tweak variables after simulation to see how outcomes shift

## Tech Stack

- React 18 + TypeScript
- Vite
- CSS Modules (no external UI library)

## Architecture

```
src/
├── types/          # Shared TypeScript interfaces
├── logic/          # Pure functions (scenario engine, variable utils)
├── hooks/          # Custom React hooks (useSimulator with useReducer)
├── components/     # UI components (each in its own folder with CSS module)
│   ├── DecisionInput/
│   ├── VariableControls/
│   ├── ScenarioCard/
│   └── SimulatorLayout/
└── styles/         # Global CSS and design tokens
```

### Design Principles

- **Logic is pure**: `src/logic/` contains zero React — fully testable functions
- **State lives in one hook**: `useSimulator` manages all simulator state via `useReducer`
- **Components are dumb presenters**: they receive props and emit events — no internal business logic
- **CSS Modules**: scoped styles per component, global tokens via CSS variables

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```
