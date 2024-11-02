import { Balance, VanillaRuntimeModules } from "@proto-kit/library"
import { ModulesConfig } from "@proto-kit/common"

import { Balances } from "./modules/balances"
import { GuestBook } from "./modules/guestbook"
import { Sudoku } from "./modules/Sudoku"

export const modules = VanillaRuntimeModules.with({
  Balances,
  GuestBook,
  Sudoku,
})

export const config: ModulesConfig<typeof modules> = {
  Balances: {
    totalSupply: Balance.from(10_000),
  },
  GuestBook: {},
  Sudoku: {},
}

export default {
  modules,
  config,
}
