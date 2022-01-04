import { Eth2Deposit, DepositEvent } from "../generated/Eth2Deposit/Eth2Deposit"
import { Deposit } from "../generated/schema"

export function handleDepositEvent(event: DepositEvent): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = Deposit.load(event.transaction.hash.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new Deposit(event.transaction.hash.toHex())
    entity.from = event.transaction.from;
    entity.value = event.transaction.value;
    entity.timestamp = event.block.timestamp;
    entity.tx = event.transaction.hash;
    entity.count = 0;
  }else {
    entity.count += 1;
    entity.value = entity.value.plus(event.transaction.value);
  }

  // Entities can be written to the store with `.save()`
  entity.save()
}