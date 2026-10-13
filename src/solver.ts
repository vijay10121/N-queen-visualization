import type { Step, Stats } from './types'

function isSafe(board: number[], row: number, col: number): boolean {
  for (let r = 0; r < row; r++) {
    const c = board[r]
    if (c === col) return false
    if (Math.abs(r - row) === Math.abs(c - col)) return false
  }
  return true
}

// Run the solver once just to collect steps
function runSolver(n: number): {
  steps: Step[]
  solutions: number
  recursiveCalls: number
  placements: number
  backtracks: number
  solutionBoards: number[][]
} {
  const steps: Step[] = []
  const solutionBoards: number[][] = []
  const board: number[] = Array(n).fill(-1)
  let solutions = 0, recursiveCalls = 0, placements = 0, backtracks = 0

  function solve(row: number): void {
    recursiveCalls++
    if (row === n) {
      solutions++
      solutionBoards.push([...board])
      steps.push({
        kind: 'solution',
        board: [...board],
        row: row - 1,
        col: board[row - 1],
        solutionCount: solutions,
        backtrackCount: backtracks,
        placementCount: placements,
      })
      return
    }
    for (let col = 0; col < n; col++) {
      if (isSafe(board, row, col)) {
        board[row] = col
        placements++
        steps.push({
          kind: 'place',
          board: [...board],
          row,
          col,
          solutionCount: solutions,
          backtrackCount: backtracks,
          placementCount: placements,
        })
        solve(row + 1)
        board[row] = -1
        backtracks++
        steps.push({
          kind: 'remove',
          board: [...board],
          row,
          col,
          solutionCount: solutions,
          backtrackCount: backtracks,
          placementCount: placements,
        })
      }
    }
  }

  solve(0)
  return { steps, solutions, recursiveCalls, placements, backtracks, solutionBoards }
}

// Timing-only solve (no step recording — much faster, gives accurate time)
function timeSolve(n: number): number {
  const board: number[] = Array(n).fill(-1)

  function solve(row: number): void {
    if (row === n) return
    for (let col = 0; col < n; col++) {
      if (isSafe(board, row, col)) {
        board[row] = col
        solve(row + 1)
        board[row] = -1
      }
    }
  }

  // Run 20 times and take the average for a stable measurement
  const RUNS = 20
  const start = performance.now()
  for (let i = 0; i < RUNS; i++) solve(0)
  return (performance.now() - start) / RUNS
}

export function generateSteps(n: number): { steps: Step[]; stats: Stats } {
  const { steps, solutions, recursiveCalls, placements, backtracks, solutionBoards } = runSolver(n)
  const executionTimeMs = timeSolve(n)

  return {
    steps,
    stats: { solutions, recursiveCalls, placements, backtracks, executionTimeMs, solutionBoards },
  }
}

