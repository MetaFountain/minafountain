import {
  AccountUpdate,
  assert,
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  UInt32,
} from "o1js"
import { Sudoku, ISudoku } from "../../../src/runtime/modules/sudoku"
import { cloneSudoku, generateSudoku, solveSudoku } from "./Sudoku-lib.js"

import { InMemorySigner } from "@proto-kit/sdk"
import { UInt64 } from "@proto-kit/library"
import { client as appChain } from "../../../src/environments/client.config"

type ZkApp = Sudoku

const salt = Field.random()
let number = 16

const sudoku = generateSudoku(0.5)
const solution = solveSudoku(sudoku)
console.log("sudoku: ", sudoku)
console.log("solution: " + solution)
if (solution == undefined) throw Error("Devcon1: shouldnt happen")

const signer = PrivateKey.random()
const sender = signer.toPublicKey()

console.log("sender: ", sender.toBase58())

describe("Sudoku", () => {
  let zkApp: Sudoku

  beforeAll(async () => {
    await appChain.start()

    const inMemorySigner = new InMemorySigner()

    appChain.registerValue({
      Signer: inMemorySigner,
    })

    const resolvedInMemorySigner = appChain.resolve("Signer") as InMemorySigner
    resolvedInMemorySigner.config = { signer }

    zkApp = appChain.runtime.resolve("Sudoku")
  })

  const checkStatus = async (tag = "status:") => {
    const solvedBy = await zkApp.results.get(ISudoku.from(sudoku).hash())

    if (solvedBy.isSome) {
      console.log(tag, "is Solved=", solvedBy.value.toBase58())
    }
  }

  it("submit wrong solution", async () => {
    const wrongSolution = await cloneSudoku(solution)
    wrongSolution[0][0] = (wrongSolution[0][0] % 9) + 1

    try {
      const tx = await appChain.transaction(sender, async () => {
        await zkApp.submitSolution(
          ISudoku.from(sudoku),
          ISudoku.from(wrongSolution)
        )
      })

      await tx.sign()
      await tx.send()
    } catch {
      console.log("failed as expected")
    }

    await checkStatus()
    let curRes = await zkApp.results.get(ISudoku.from(sudoku).hash())

    assert(!curRes.isSome, "failed as expected")
  })

  it("should submit correct solution", async () => {
    const tx = await appChain.transaction(sender, async () => {
      await zkApp.submitSolution(ISudoku.from(sudoku), ISudoku.from(solution))
    })

    await tx.sign()
    await tx.send()

    await checkStatus()

    const _sudoku = ISudoku.from(sudoku)

    const sudokuResult = await zkApp.results.get(_sudoku.hash())

    assert(sudokuResult.isSome, "Has result")

    const solvedBy = sudokuResult.value

    console.log("solved by: " + solvedBy.toBase58())

    // assert(sudokuResult, "the sudoku is solved")
    console.log("sender:", sender.toBase58())

    assert(solvedBy.equals(sender), "checked solver")
  })
})
