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
if (solution == undefined) throw Error("Devcon1: shouldnt happen")

const signer = PrivateKey.random()
const sender = signer.toPublicKey()

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

  it("should update", async () => {
    const tx = await appChain.transaction(sender, async () => {
      zkApp.update(ISudoku.from(sudoku))
    })

    await tx.sign()
    await tx.send()
  })
})
