import { Field, PublicKey, Struct } from "o1js"
import { UInt64 } from "@proto-kit/library"
import {
  RuntimeModule,
  runtimeMethod,
  runtimeModule,
  state,
} from "@proto-kit/module"
import { StateMap, assert } from "@proto-kit/protocol"

export class CheckInId extends Field {}
export class CheckIn extends Struct({
  guest: PublicKey,
  createdAt: UInt64,
  rating: UInt64,
}) {}

@runtimeModule()
export class GuestBook extends RuntimeModule<Record<string, never>> {
  @state() public checkIns = StateMap.from(PublicKey, CheckIn)

  @runtimeMethod()
  public checkIn(rating: UInt64) {
    assert(rating.lessThanOrEqual(UInt64.from(5)), "Maximum rating can be 5")
    const guest = this.transaction.sender.value
    const createdAt = UInt64.from(this.network.block.height)
    const checkIn = new CheckIn({
      guest,
      createdAt,
      rating,
    })

    this.checkIns.set(checkIn.guest, checkIn)
  }
}
