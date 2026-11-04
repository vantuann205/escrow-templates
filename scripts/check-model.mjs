import assert from 'node:assert/strict'
import { estimateDaoScenario } from '../src/dao-model.ts'
import { globeNodeCountForBalance } from '../src/shelter-scene.ts'

const baseScenario = {
  balanceCkb: 100_000,
  annualRatePercent: 2,
  months: 12,
}

const baseEstimate = estimateDaoScenario(baseScenario)
assert.equal(baseEstimate.eligibleCapacityCkb, 99_898)
assert.equal(baseEstimate.occupiedCapacityCkb, 102)
assert.ok(Math.abs(baseEstimate.estimatedCompensationCkb - 1_997.96) < 1e-9)
assert.ok(Math.abs(baseEstimate.estimatedOutsideDaoShareDriftCkb - 1_960.784313725) < 1e-6)

assert.equal(
  estimateDaoScenario({ ...baseScenario, balanceCkb: 102 }).eligibleCapacityCkb,
  0,
)
assert.equal(
  estimateDaoScenario({ ...baseScenario, balanceCkb: 20 }).estimatedCompensationCkb,
  0,
)
assert.equal(
  estimateDaoScenario({ ...baseScenario, annualRatePercent: 0 }).estimatedCompensationCkb,
  0,
)
assert.equal(
  estimateDaoScenario({ ...baseScenario, annualRatePercent: 0 }).estimatedOutsideDaoShareDriftCkb,
  0,
)
assert.equal(
  estimateDaoScenario({ ...baseScenario, balanceCkb: 101 }).estimatedCompensationCkb,
  0,
)
assert.ok(
  Math.abs(
    estimateDaoScenario({ ...baseScenario, months: 24 }).estimatedCompensationCkb -
      99_898 * (1.02 ** 2 - 1),
  ) < 1e-8,
)
assert.ok(
  Number.isFinite(
    estimateDaoScenario({
      balanceCkb: 1_000_000_000_000,
      annualRatePercent: 5,
      months: 60,
    }).estimatedCompensationCkb,
  ),
)
assert.throws(
  () => estimateDaoScenario({ ...baseScenario, balanceCkb: -1 }),
  RangeError,
)
assert.throws(
  () => estimateDaoScenario({ ...baseScenario, balanceCkb: 1_000_000_000_001 }),
  RangeError,
)
assert.throws(
  () => estimateDaoScenario({ ...baseScenario, annualRatePercent: 5.1 }),
  RangeError,
)
assert.throws(
  () => estimateDaoScenario({ ...baseScenario, annualRatePercent: Number.POSITIVE_INFINITY }),
  RangeError,
)
assert.throws(
  () => estimateDaoScenario({ ...baseScenario, months: 0 }),
  RangeError,
)
assert.throws(
  () => estimateDaoScenario({ ...baseScenario, months: 1.5 }),
  RangeError,
)

assert.equal(globeNodeCountForBalance(0), 0)
assert.equal(globeNodeCountForBalance(1), 3)
assert.equal(globeNodeCountForBalance(100_000), 20)
assert.equal(globeNodeCountForBalance(1_000_000_000_000), 48)
assert.ok(globeNodeCountForBalance(500_000) > globeNodeCountForBalance(10_000))

console.log('DAO estimate checks passed.')
