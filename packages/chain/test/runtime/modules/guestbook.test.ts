import { InMemorySigner } from "@proto-kit/sdk"
import { UInt64 } from "@proto-kit/library"
import { client as appChain } from "../../../src/environments/client.config"
// import { client as appChain } from "@src/environments/client.config" //FIXME:
import { PrivateKey } from "o1js"
import { GuestBook } from "@src/runtime/modules/guestbook"

const signer = PrivateKey.random()
const sender = signer.toPublicKey()

describe("interaction", () => {
  let guestBook: GuestBook

  beforeAll(async () => {
    await appChain.start()

    const inMemorySigner = new InMemorySigner()

    appChain.registerValue({
      Signer: inMemorySigner,
    })

    const resolvedInMemorySigner = appChain.resolve("Signer") as InMemorySigner
    resolvedInMemorySigner.config = { signer }

    guestBook = appChain.runtime.resolve("GuestBook")
  })

  it("should interact with the app-chain", async () => {
    const rating = UInt64.from(3)
    const tx = await appChain.transaction(sender, async () => {
      guestBook.checkIn(rating)
    })

    await tx.sign()
    await tx.send()
  })
})
