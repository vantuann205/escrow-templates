# DAO Shelter Check

A runnable prototype for CKB holders to inspect an illustrative Nervos DAO deposit scenario. It compares modeled DAO compensation with an outside-DAO share-dilution equivalent, explains the standard cell's occupied capacity, and shows the two withdrawal phases.

## Run locally

Requires Node.js 22.6 or newer.

```sh
npm install
npm run dev
```

Run the estimate assertions and production build with:

```sh
npm test
npm run build
```

## What the estimate means

- The default 2.0% annual issuance scenario is a user-editable placeholder, not a live network rate, DAO APY, or market return.
- The simplified model compounds that scenario over the selected duration. The live DAO uses accumulated-rate values recorded on-chain.
- Outside-DAO share drift is a modeled CKB-equivalent change in proportional supply share. It is not CKB removed from a wallet, a price forecast, or a guaranteed loss.
- The comparison covers secondary-issuance effects only. It does not model primary issuance, CKB price changes, fees, or custom lock scripts.
- The 102 CKB occupied capacity is the standard deposit-cell assumption. Custom scripts or data can change a cell's occupied capacity. Transaction fees are additional.
- 180 epochs is the protocol minimum from the deposit epoch. A withdrawal first enters the withdrawing phase, then completes in a second transaction after the lock is satisfied.

No wallet, RPC endpoint, transaction builder, or on-chain action is connected. The estimate remains available if WebGL is unsupported; the 3D preview is conceptual and its cell count is not a token count.

## References

- [Nervos RFC #23: DAO deposit and withdrawal](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md)
- [Nervos economics and DAO overview](https://docs.nervos.org/docs/basics/concepts/economics/)
- [Nervos DAO script and cell model](https://docs.nervos.org/docs/script/dao/)

The Three.js preview is lazy-loaded. Its production chunk is larger than Vite's default warning threshold, so the main calculator bundle stays small while the 3D scene loads separately.
