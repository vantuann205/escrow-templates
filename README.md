# CKB DAO Shelter

A runnable prototype for CKB holders to inspect an illustrative Nervos DAO deposit scenario. It estimates compensation and outside-DAO share drift, explains occupied capacity, and presents the two-phase withdrawal path.

The landing page adapts the layout, motion, and selected visual assets from `agnilem/lapse-astro`. The copied and adapted material remains under its MIT license; see [LICENSE-LAPSE.txt](./LICENSE-LAPSE.txt) and [LICENSES-THIRD-PARTY.txt](./LICENSES-THIRD-PARTY.txt).

## Run locally

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

Run the model assertions and production build with:

```sh
npm test
npm run build
```

## Model limits

- The default 2.0% annual issuance scenario is editable input, not a live rate, DAO APY, or market return.
- The simplified model compounds that constant scenario over the selected duration. The live DAO uses accumulated-rate values recorded on-chain.
- Outside-DAO share drift is a modeled CKB-equivalent change in proportional supply share. It is not CKB removed from a wallet, a price forecast, or a guaranteed loss.
- The comparison covers secondary-issuance effects only. It excludes primary issuance, price changes, fees, and custom lock scripts.
- The 102 CKB occupied capacity is the standard deposit-cell assumption. Transaction fees are additional.
- 180 epochs is the protocol minimum from the deposit epoch. Calendar time varies with epoch length; withdrawal has a request phase and a completion phase.

No wallet, RPC endpoint, live rate, fee quote, transaction builder, or on-chain action is connected. The CKBxDAO particle field is a brand visual, not network activity.

## Protocol references

- [Nervos RFC 0023: DAO deposit and withdrawal](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md)
- [Nervos economics and DAO overview](https://docs.nervos.org/docs/basics/concepts/economics/)
- [Nervos DAO script and cell model](https://docs.nervos.org/docs/script/dao/)
