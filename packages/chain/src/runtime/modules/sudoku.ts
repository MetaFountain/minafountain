import {
  runtimeMethod,
  runtimeModule,
  RuntimeModule,
  state,
} from "@proto-kit/module"

import { State, assert } from "@proto-kit/protocol"
import { Balance, Balances as BaseBalances, TokenId } from "@proto-kit/library"
import { Field, Provable, Struct, Bool, Poseidon } from "o1js"

export class ISudoku extends Struct({
  value: Provable.Array(Provable.Array(Field, 9), 9),
}) {
  static from(value: number[][]) {
    return new ISudoku({ value: value.map((row) => row.map(Field)) })
  }

  hash() {
    return Poseidon.hash(this.value.flat())
  }
}

@runtimeModule()
export class Sudoku extends RuntimeModule<Record<any, never>> {
  @state() public sudokuHash = State.from<Field>(Field)
  @state() public isSolved = State.from<Bool>(Bool)

  public constructor() {
    super()
  }

  @runtimeMethod()
  public async update(sudokuInstance: ISudoku) {
    this.isSolved.set(Bool(false))
    this.sudokuHash.set(sudokuInstance.hash())
  }

  // @runtimeMethod()
  // public async submitSolution(
  //   sudokuInstance: ISudoku,
  //   solutionInstance: ISudoku
  // ) {
  //   let sudoku = sudokuInstance.value
  //   let solution = solutionInstance.value

  //   let range9 = Array.from({ length: 9 }, (_, i) => i)
  //   let oneTo9 = range9.map((i) => Field.from(i + 1))

  //   function assertHas1To9(array: Field[]) {
  //     oneTo9
  //       .map((k) => range9.map((i) => array[i].equals(k)).reduce(Bool.or))
  //       .reduce(Bool.and)
  //       .assertTrue("array contains the number 1...9")
  //   }

  //   //check all rows

  //   for (let i = 0; i < 9; i++) {
  //     let row = solution[i]
  //     assertHas1To9(row)
  //   }

  //   //check all clns

  //   for (let j = 0; j < 9; j++) {
  //     let cln = solution.map((row) => row[j])
  //     assertHas1To9(cln)
  //   }

  //   //check 3x3 squares

  //   for (let k = 0; k < 9; k++) {
  //     let [i0, j0] = divmod(k, 3)
  //     let square = range9.map((m) => {
  //       let [i1, j1] = divmod(m, 3)
  //       return solution[3 * i0 + i1][3 * j0 + j1]
  //     })

  //     assertHas1To9(square)
  //   }

  //   // check if solution extends initial sudoku
  //   for (let i = 0; i < 9; i++) {
  //     for (let j = 0; j < 9; j++) {
  //       let cell = sudoku[i][j]
  //       let solutionCell = solution[i][j]
  //       // either the sudoku has nothing in it  (indicated by a cell value of 0)
  //       // or it is equal to the solutioin

  //       Bool.or(cell.equals(0), cell.equals(solutionCell)).assertTrue(
  //         `solution cell (${i + 1}, ${j + 1}) matches original sudoku`
  //       )
  //     }
  //   }

  //   let sudokuHash = await this.sudokuHash.get()
  //   sudokuInstance
  //     .hash()
  //     .assertEquals(
  //       sudokuHash.value,
  //       "sudoku matches the one committed on-chain"
  //     )

  //   this.isSolved.set(Bool(true))

  //   function divmod(k: number, n: number) {
  //     let q = Math.floor(k / n)
  //     return [q, k - q * n]
  //   }
  // }
}
