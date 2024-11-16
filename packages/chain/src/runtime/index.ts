import { Balance, VanillaRuntimeModules } from "@proto-kit/library"
import { ModulesConfig } from "@proto-kit/common"

import { Balances } from "./modules/balances"
import { GuestBook } from "./modules/guestbook"
import { Sudoku } from "./modules/sudoku"
import { Sudoku as Sudoku0 } from "./modules/sudoku0"
import { FountainToken, Sudoku1 } from "./modules/sudoku1"

export const modules = VanillaRuntimeModules.with({
  Balances,
  GuestBook,
  Sudoku0,
  Sudoku,
  Sudoku1,
  FountainToken,
})

export const config: ModulesConfig<typeof modules> = {
  Balances: {
    totalSupply: Balance.from(10_000),
  },
  GuestBook: {},
  Sudoku: {},
  Sudoku0: {},
  FountainToken: {
    totalSupply: Balance.from(10_000_000_000_000),
  },
  Sudoku1: {
    totalSupply: Balance.from(10_000_000_000_000),
  },
}

export default {
  modules,
  config,
}
