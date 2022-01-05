import { Eth2Deposit, DepositEvent } from "../generated/Eth2Deposit/Eth2Deposit"
import { Deposit, TotalCount } from "../generated/schema"
import { BigInt } from "@graphprotocol/graph-ts"

const countId = 'count'

export function handleDepositEvent(event: DepositEvent): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  event.address;
  let entity = Deposit.load(event.transaction.from.toHex())
  let totalCount = TotalCount.load(countId); 
  if (!totalCount){
    totalCount = new TotalCount(countId);
  }
  totalCount.count += 1;

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  const amount = BigInt.fromUnsignedBytes(event.params.amount)
  if (!entity) {
    entity = new Deposit(event.transaction.from.toHex())
    entity.amount = amount;
    entity.count = 0;
  }else {
    entity.count += 1;
    entity.amount = entity.amount.plus(amount);
  }
  entity.tx = event.transaction.hash;
  entity.timestamp = event.block.timestamp;
  entity.index = totalCount.count;

  // Entities can be written to the store with `.save()`
  totalCount.save()
  entity.save()
}