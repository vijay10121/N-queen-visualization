import { useState, useEffect, useRef, useCallback } from 'react'
import { generateSteps } from './solver'
import { BOARD_THEMES, PAGE_THEMES } from './themes'
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
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)

  // Themes
  const [boardThemeId, setBoardThemeId] = useState(BOARD_THEMES[0].id)
  const [pageThemeId, setPageThemeId] = useState(PAGE_THEMES[0].id)

  const boardTheme = BOARD_THEMES.find(t => t.id === boardThemeId) || BOARD_THEMES[0]
  const pageTheme = PAGE_THEMES.find(t => t.id === pageThemeId) || PAGE_THEMES[0]

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
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Auto-generate on load
  useEffect(() => {
    const res = generateSteps(5)
    setSteps(res.steps)
    setStats(res.stats)
    setStepIndex(-1)
    setPlayState('idle')
  }, [])

  const handleGenerate = () => {
    stopInterval()
    const size = parseInt(boardSizeInput, 10)
    if (isNaN(size) || size < 1 || size > 12) {
      alert('Please enter a board size between 1 and 12')
      return
    }
    setN(size)
    const res = generateSteps(size)
    setSteps(res.steps)
    setStats(res.stats)
    setStepIndex(-1)
    setPlayState('idle')
    setShowSolutions(false)
  }

  const stepForward = useCallback(() => {
    const cur = stepIndexRef.current
    const total = stepsRef.current.length
    if (cur + 1 < total) {
      setStepIndex(cur + 1)
    } else {
      stopInterval()
      setPlayState('done')
    }
  }, [stopInterval])

  const handlePlay = () => {
    if (steps.length === 0) return
    if (playState === 'done') {
      setStepIndex(-1)
      stepIndexRef.current = -1
    }
    setPlayState('playing')
    stopInterval()
    intervalRef.current = setInterval(stepForward, speed)
  }

  const handlePause = () => {
    stopInterval()
    setPlayState('paused')
  }

  const handleReset = () => {
    stopInterval()
    setStepIndex(-1)
    setPlayState('idle')
    setShowSolutions(false)
  }

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(i => i + 1)
      if (stepIndex + 1 === steps.length - 1) {
        setPlayState('done')
      }
    }
  }

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(i => i - 1)
      setPlayState('paused')
    } else if (stepIndex === 0) {
      setStepIndex(-1)
      setPlayState('idle')
    }
  }

  // Update interval if speed changes while playing
  useEffect(() => {
    if (playState === 'playing') {
      stopInterval()
      intervalRef.current = setInterval(stepForward, speed)
    }
  }, [speed, playState, stepForward, stopInterval])

  // Cleanup on unmount
  useEffect(() => () => stopInterval(), [stopInterval])

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsThemeModalOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Count placed queens right now
  const placedCount = currentBoard.filter(c => c !== -1).length
  const currentStep = steps[stepIndex]
  const isSolutionStep = currentKind === 'solution'
  const totalSteps = steps.length

  // CSS variables for whole page
  const pageStyle = {
    '--bg-app': pageTheme.bgApp,
    '--bg-panel': pageTheme.bgPanel,
    '--bg-input': pageTheme.bgInput,
    '--text-primary': pageTheme.textPrimary,
    '--text-secondary': pageTheme.textSecondary,
    '--text-muted': pageTheme.textMuted,
    '--border-subtle': pageTheme.borderSubtle,
    '--border-strong': pageTheme.borderStrong,
    '--accent-primary': pageTheme.accentPrimary,
    '--accent-hover': pageTheme.accentHover,
    '--chip-green-bg': pageTheme.chipGreenBg,
    '--chip-green-text': pageTheme.chipGreenText,
    '--chip-red-bg': pageTheme.chipRedBg,
    '--chip-red-text': pageTheme.chipRedText,
    '--chip-neutral-bg': pageTheme.chipNeutralBg,
    '--chip-neutral-text': pageTheme.chipNeutralText,
    '--btn-sec-bg': pageTheme.btnSecondaryBg,
    '--btn-sec-hover': pageTheme.btnSecondaryHover,
    '--btn-sec-text': pageTheme.btnSecondaryText,
    '--shadow': pageTheme.shadow,
  } as React.CSSProperties

  // CSS variables for board
  const boardStyle = {
    gridTemplateColumns: `repeat(${n}, 1fr)`,
    gridTemplateRows: `repeat(${n}, 1fr)`,
    '--cell-light': boardTheme.lightSquare,
    '--cell-dark': boardTheme.darkSquare,
    '--cell-attacked-light': boardTheme.attackedLight,
    '--cell-attacked-dark': boardTheme.attackedDark,
    '--cell-queen-light': boardTheme.queenLight,
    '--cell-queen-dark': boardTheme.queenDark,
    '--cell-last-light': boardTheme.lastMoveLight,
    '--cell-last-dark': boardTheme.lastMoveDark,
    '--queen-color': boardTheme.queenColor,
    '--board-border': boardTheme.boardBorder,
  } as React.CSSProperties

  return (
    <div className="app" style={pageStyle}>
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-text">
            <h1>N-Queens Visualizer</h1>
            <p className="subtitle">Watch backtracking solve the N-Queens problem step by step</p>
          </div>
          <button
            className="theme-nav-btn"
            onClick={() => setIsThemeModalOpen(true)}
            title="Open Theme Settings"
          >
            🎨 Themes
          </button>
        </div>
      </header>

      <main className="main">
        {/* Controls */}
        <section className="controls-panel">
          {/* Board Size */}
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

          {/* Speed */}
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

          {/* Playback */}
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
                  style={{
                    width: `${((stepIndex + 1) / totalSteps) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Live counters */}
          {steps.length > 0 && (
            <div className="live-counters">
              <span className="chip chip-green">Queens on board: {placedCount} / {n}</span>
              {currentStep && (
                <span className={`chip ${currentKind === 'remove' ? 'chip-red' : 'chip-green'}`}>
                  {currentKind === 'place' && `Placed row ${currentStep.row + 1}, col ${currentStep.col + 1}`}
                  {currentKind === 'remove' && `Backtracked from row ${currentStep.row + 1}, col ${currentStep.col + 1}`}
                  {currentKind === 'solution' && `Solution #${currentStep.solutionCount} found!`}
                </span>
              )}
              {stats && (
                <span className="chip chip-gray">Solutions found: {stats.solutions}</span>
              )}
            </div>
          )}
        </section>

        {/* Board */}
        <section className="board-section">
          <div
            className={`board ${isSolutionStep ? 'board-solution' : ''}`}
            style={boardStyle}
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
                className={`btn-solutions ${showSolutions ? 'btn-solutions-active' : ''}`}
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
                      '--cell-light': boardTheme.lightSquare,
                      '--cell-dark': boardTheme.darkSquare,
                      '--cell-queen-light': boardTheme.queenLight,
                      '--cell-queen-dark': boardTheme.queenDark,
                      '--queen-color': boardTheme.queenColor,
                      '--board-border': boardTheme.boardBorder,
                    } as React.CSSProperties}
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

      {/* Theme Settings Modal */}
      {isThemeModalOpen && (
        <div className="modal-overlay" onClick={() => setIsThemeModalOpen(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Customize Appearance</h2>
              <button
                className="modal-close-btn"
                onClick={() => setIsThemeModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Page Theme */}
              <div className="modal-section">
                <h3>Page Theme</h3>
                <p className="modal-subtitle">Change background and app interface appearance</p>
                <div className="theme-grid">
                  {PAGE_THEMES.map(pt => (
                    <button
                      key={pt.id}
                      className={`theme-card ${pageThemeId === pt.id ? 'theme-card-active' : ''}`}
                      onClick={() => setPageThemeId(pt.id)}
                    >
                      <div
                        className="theme-card-preview"
                        style={{
                          background: pt.bgApp,
                          borderColor: pt.borderStrong,
                        }}
                      >
                        <div
                          className="theme-card-preview-inner"
                          style={{
                            background: pt.bgPanel,
                            color: pt.textPrimary,
                            borderColor: pt.accentPrimary,
                          }}
                        >
                          <span style={{ color: pt.accentPrimary, fontWeight: 700 }}>Aa</span>
                        </div>
                      </div>
                      <span className="theme-card-name">{pt.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Board Theme */}
              <div className="modal-section">
                <h3>Chessboard Theme</h3>
                <p className="modal-subtitle">Change colors of board squares and queens</p>
                <div className="theme-grid">
                  {BOARD_THEMES.map(bt => (
                    <button
                      key={bt.id}
                      className={`theme-card ${boardThemeId === bt.id ? 'theme-card-active' : ''}`}
                      onClick={() => setBoardThemeId(bt.id)}
                    >
                      <div
                        className="theme-card-preview"
                        style={{
                          background: `linear-gradient(135deg, ${bt.lightSquare} 50%, ${bt.darkSquare} 50%)`,
                          borderColor: bt.boardBorder,
                        }}
                      >
                        <div
                          className="theme-card-preview-inner"
                          style={{
                            background: bt.queenDark,
                            color: '#ffffff',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '12px',
                          }}
                        >
                          ♛
                        </div>
                      </div>
                      <span className="theme-card-name">{bt.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => setIsThemeModalOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
