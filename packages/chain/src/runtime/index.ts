import { Balance, VanillaRuntimeModules } from "@proto-kit/library"
import { ModulesConfig } from "@proto-kit/common"

import { Balances } from "./modules/balances"
import { GuestBook } from "./modules/guestbook"
import { Sudoku } from "./modules/sudoku"
import { FountainToken, Sudoku1 } from "./modules/sudoku1"

export const modules = VanillaRuntimeModules.with({
  Balances,
  GuestBook,
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
