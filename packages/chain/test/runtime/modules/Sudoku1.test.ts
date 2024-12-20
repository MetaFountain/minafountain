import {
  AccountUpdate,
  assert,
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  UInt32,
} from "o1js"
import { Sudoku1, ISudoku } from "../../../src/runtime/modules/sudoku1"
import { cloneSudoku, generateSudoku, solveSudoku } from "./Sudoku-lib.js"

import { InMemorySigner, TestingAppChain } from "@proto-kit/sdk"
import { UInt64 } from "@proto-kit/library"
import { client as appChain } from "../../../src/environments/client.config"

type ZkApp = Sudoku1

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
  let zkApp: Sudoku1

  beforeAll(async () => {
    await appChain.start()

    const inMemorySigner = new InMemorySigner()

    appChain.registerValue({
      Signer: inMemorySigner,
    })

    const resolvedInMemorySigner = appChain.resolve("Signer") as InMemorySigner
    resolvedInMemorySigner.config = { signer }

    zkApp = appChain.runtime.resolve("Sudoku1")
  })

  it("should update", async () => {
    const tx = await appChain.transaction(sender, async () => {
      zkApp.update(ISudoku.from(sudoku))
    })

    await tx.sign()
    await tx.send()

    checkStatus()
  })

  const checkStatus = async (tag = "status:") => {
    const sudokuHash = (await zkApp.sudokuHash.get()).value
    console.log("sudokuhash", sudokuHash.toString())
    const status = await zkApp.isSolved.get()
    console.log(tag, "is Solved=", status.value.toString())
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

    assert(
      !(await zkApp.isSolved.get()).value.toBoolean(),
      "failed as expected"
    )
  })

  it("should submit correct solution", async () => {
    const tx = await appChain.transaction(sender, async () => {
      await zkApp.submitSolution(ISudoku.from(sudoku), ISudoku.from(solution))
    })

    await tx.sign()
    await tx.send()

    await checkStatus()

    const isSolved = (await zkApp.isSolved.get()).value

    assert(isSolved.equals(true), "the sudoku is solved")

    const solvedBy = (await zkApp.solvedBy.get()).value

    console.log("solved by: " + solvedBy.toBase58())

    assert((await zkApp.isSolved.get()).value.toBoolean(), "submitted solution")

    // assert(solvedBy.equals(sender), "checked solver") //FIXME:

    const curBal = UInt64.fromValue((await zkApp.balances.get(sender)).value)
    console.log("curBalances", curBal.value)

    curBal.value.assertGreaterThan(0)
  })

  it("check balance now", async () => {
    const ft = appChain.runtime.resolve("FountainToken")
    const tx = await appChain.transaction(sender, async () => {
      await ft.mint(UInt64.from(100))
    })

    await tx.sign()
    await tx.send()

    const curBal = UInt64.fromValue((await zkApp.balances.get(sender)).value)
    console.log("curBalances", curBal.value)

    curBal.value.assertGreaterThan(0)
  })
})
