// Each step in the backtracking animation
export type StepKind = 'place' | 'remove' | 'solution'

export interface Step {
  kind: StepKind
  board: number[]          // board[row] = col where queen sits, -1 if empty
  row: number
  col: number
  solutionCount: number
  backtrackCount: number
  placementCount: number
}

export interface Stats {
  solutions: number
  recursiveCalls: number
  placements: number
  backtracks: number
  executionTimeMs: number
  solutionBoards: number[][]  // each entry is a complete board (board[row] = col)
}
