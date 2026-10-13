import { useState, useEffect, useRef, useCallback } from 'react'
import { generateSteps } from './solver'
import type { Step, Stats } from './types'
import './App.css'

type PlayState = 'idle' | 'playing' | 'paused' | 'done'

// Which cells are attacked by currently placed queens
function getAttackedCells(board: number[], n: number): Set<string> {
  const attacked = new Set<string>()
  for (let r = 0; r < n; r++) {
    const c = board[r]
    if (c === -1) continue
    for (let tr = 0; tr < n; tr++) {
      for (let tc = 0; tc < n; tc++) {
        if (tr === r && tc === c) continue
        if (tr === r || tc === c) attacked.add(`${tr}-${tc}`)
        if (Math.abs(tr - r) === Math.abs(tc - c)) attacked.add(`${tr}-${tc}`)
      }
    }
  }
  return attacked
}

export default function App() {
  const [boardSizeInput, setBoardSizeInput] = useState('5')
  const [n, setN] = useState(5)
  const [steps, setSteps] = useState<Step[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [stepIndex, setStepIndex] = useState(-1)
  const [playState, setPlayState] = useState<PlayState>('idle')
  const [speed, setSpeed] = useState(300) // ms per step
  const [showSolutions, setShowSolutions] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stepsRef = useRef<Step[]>([])
  const stepIndexRef = useRef(-1)

  const currentBoard: number[] = stepIndex >= 0 && steps[stepIndex]
    ? steps[stepIndex].board
    : Array(n).fill(-1)

  const currentKind = steps[stepIndex]?.kind ?? 'place'
  const attackedCells = getAttackedCells(currentBoard, n)

  // Keep refs in sync
  useEffect(() => { stepsRef.current = steps }, [steps])
  useEffect(() => { stepIndexRef.current = stepIndex }, [stepIndex])

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const advance = useCallback(() => {
    const next = stepIndexRef.current + 1
    if (next >= stepsRef.current.length) {
      stopInterval()
      setPlayState('done')
      return
    }
    stepIndexRef.current = next
    setStepIndex(next)
  }, [stopInterval])

  const handleGenerate = useCallback(() => {
    stopInterval()
    const size = Math.max(1, Math.min(12, parseInt(boardSizeInput) || 5))
    setN(size)
    setBoardSizeInput(String(size))
    const { steps: s, stats: st } = generateSteps(size)
    setSteps(s)
    setStats(st)
    setStepIndex(-1)
    setPlayState('idle')
  }, [boardSizeInput, stopInterval])

  const handlePlay = useCallback(() => {
    if (playState === 'done') {
      setStepIndex(-1)
      stepIndexRef.current = -1
    }
    setPlayState('playing')
    intervalRef.current = setInterval(() => {
      const next = stepIndexRef.current + 1
      if (next >= stepsRef.current.length) {
        stopInterval()
        setPlayState('done')
        return
      }
      stepIndexRef.current = next
      setStepIndex(next)
    }, speed)
  }, [playState, speed, stopInterval])

  const handlePause = useCallback(() => {
    stopInterval()
    setPlayState('paused')
  }, [stopInterval])

  const handleReset = useCallback(() => {
    stopInterval()
    setStepIndex(-1)
    setPlayState('idle')
  }, [stopInterval])

  const handlePrev = useCallback(() => {
    stopInterval()
    setPlayState('paused')
    setStepIndex(i => Math.max(-1, i - 1))
  }, [stopInterval])

  const handleNext = useCallback(() => {
    stopInterval()
    setPlayState('paused')
    advance()
  }, [stopInterval, advance])

  // Cleanup on unmount
  useEffect(() => () => stopInterval(), [stopInterval])

  // Update speed without restarting
  useEffect(() => {
    if (playState === 'playing' && intervalRef.current) {
      stopInterval()
      intervalRef.current = setInterval(() => {
        const next = stepIndexRef.current + 1
        if (next >= stepsRef.current.length) {
          stopInterval()
          setPlayState('done')
          return
        }
        stepIndexRef.current = next
        setStepIndex(next)
      }, speed)
    }
  }, [speed]) // eslint-disable-line react-hooks/exhaustive-deps

  const currentStep = steps[stepIndex]
  const isSolutionStep = currentKind === 'solution'
  const totalSteps = steps.length

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>N-Queens Visualizer</h1>
        <p className="subtitle">Watch backtracking solve the N-Queens problem step by step</p>
      </header>

      <main className="main">
        {/* Controls */}
        <section className="controls-panel">
          <div className="input-row">
            <label htmlFor="board-size">Board Size</label>
            <input
              id="board-size"
              type="number"
              min={1}
              max={12}
              value={boardSizeInput}
              onChange={e => setBoardSizeInput(e.target.value)}
              className="size-input"
            />
            <button className="btn btn-primary" onClick={handleGenerate}>
              Set Board
            </button>
          </div>

          <div className="speed-row">
            <label htmlFor="speed-slider">Speed</label>
            <input
              id="speed-slider"
              type="range"
              min={50}
              max={1000}
              step={50}
              value={1050 - speed}
              onChange={e => setSpeed(1050 - Number(e.target.value))}
              className="speed-slider"
            />
            <span className="speed-label">{speed <= 100 ? 'Fast' : speed <= 400 ? 'Medium' : 'Slow'}</span>
          </div>

          <div className="playback-row">
            <button
              className="btn btn-icon"
              onClick={handlePrev}
              disabled={stepIndex <= -1 || steps.length === 0}
              title="Previous step"
            >
              ⏮
            </button>
            {playState === 'playing' ? (
              <button className="btn btn-primary" onClick={handlePause}>
                ⏸ Pause
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handlePlay}
                disabled={steps.length === 0}
              >
                {playState === 'done' ? '↩ Replay' : '▶ Play'}
              </button>
            )}
            <button
              className="btn btn-icon"
              onClick={handleNext}
              disabled={stepIndex >= totalSteps - 1 || steps.length === 0}
              title="Next step"
            >
              ⏭
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={steps.length === 0}
            >
              ↺ Reset
            </button>
          </div>

          {/* Progress */}
          {totalSteps > 0 && (
            <div className="progress-row">
              <span className="progress-label">
                Step {Math.max(0, stepIndex + 1)} / {totalSteps}
              </span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${totalSteps > 0 ? ((stepIndex + 1) / totalSteps) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}

          {/* Live counter */}
          {currentStep && (
            <div className="live-counters">
              <span className={`chip ${currentKind === 'place' || currentKind === 'solution' ? 'chip-green' : 'chip-red'}`}>
                {currentKind === 'solution' ? '✔ Solution found' : currentKind === 'place' ? '⬇ Placing' : '⬆ Backtracking'}
              </span>
              <span className="chip chip-gray">Solutions: {currentStep.solutionCount}</span>
              <span className="chip chip-gray">Backtracks: {currentStep.backtrackCount}</span>
            </div>
          )}
        </section>

        {/* Board */}
        <section className="board-section">
          <div
            className={`board ${isSolutionStep ? 'board-solution' : ''}`}
            style={{
              gridTemplateColumns: `repeat(${n}, 1fr)`,
              gridTemplateRows: `repeat(${n}, 1fr)`,
            }}
          >
            {Array.from({ length: n * n }, (_, i) => {
              const row = Math.floor(i / n)
              const col = i % n
              const hasQueen = currentBoard[row] === col
              const isLight = (row + col) % 2 === 0
              const isAttacked = !hasQueen && attackedCells.has(`${row}-${col}`)
              const isLastMove =
                currentStep && currentStep.row === row && currentStep.col === col

              let cellClass = `cell ${isLight ? 'cell-light' : 'cell-dark'}`
              if (hasQueen) cellClass += ' cell-queen'
              if (isAttacked) cellClass += ' cell-attacked'
              if (isLastMove && hasQueen) cellClass += ' cell-last-move'

              return (
                <div key={i} className={cellClass}>
                  {hasQueen && <span className="queen-icon">♛</span>}
                </div>
              )
            })}
          </div>
        </section>

        {/* Stats panel — shown when done */}
        {(playState === 'done' || playState === 'paused') && stats && (
          <section className="stats-panel">
            <h2>Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-value">{stats.solutions}</span>
                <span className="stat-label">Solutions Found</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{stats.recursiveCalls.toLocaleString()}</span>
                <span className="stat-label">Recursive Calls</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{stats.placements.toLocaleString()}</span>
                <span className="stat-label">Placements</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{stats.backtracks.toLocaleString()}</span>
                <span className="stat-label">Backtracks</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">
                  {stats.executionTimeMs < 1
                    ? `${(stats.executionTimeMs * 1000).toFixed(1)} µs`
                    : `${stats.executionTimeMs.toFixed(3)} ms`}
                </span>
                <span className="stat-label">Execution Time</span>
              </div>
            </div>

            {/* View Solutions button */}
            {playState === 'done' && (
              <button
                className={`btn btn-solutions ${showSolutions ? 'btn-solutions-active' : ''}`}
                onClick={() => setShowSolutions(s => !s)}
              >
                {showSolutions ? '▲ Hide Solutions' : `♛ View All ${stats.solutions} Solutions`}
              </button>
            )}
          </section>
        )}

        {/* Solutions gallery */}
        {showSolutions && stats && playState === 'done' && (
          <section className="solutions-panel">
            <h2>All Solutions ({stats.solutions})</h2>
            <div className="solutions-grid">
              {stats.solutionBoards.map((board, idx) => (
                <div key={idx} className="mini-board-wrapper">
                  <span className="mini-board-label">#{idx + 1}</span>
                  <div
                    className="mini-board"
                    style={{
                      gridTemplateColumns: `repeat(${n}, 1fr)`,
                      gridTemplateRows: `repeat(${n}, 1fr)`,
                    }}
                  >
                    {Array.from({ length: n * n }, (_, i) => {
                      const row = Math.floor(i / n)
                      const col = i % n
                      const hasQueen = board[row] === col
                      const isLight = (row + col) % 2 === 0
                      return (
                        <div
                          key={i}
                          className={`mini-cell ${isLight ? 'cell-light' : 'cell-dark'} ${hasQueen ? 'mini-cell-queen' : ''}`}
                        >
                          {hasQueen && <span className="mini-queen">♛</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
