export const STANDARD_DAO_OCCUPIED_CKB = 102
export const MAX_BALANCE_CKB = 1_000_000_000_000
export const MAX_SCENARIO_RATE_PERCENT = 5
export const MAX_SCENARIO_MONTHS = 60

export type DaoScenario = {
  balanceCkb: number
  annualRatePercent: number
  months: number
}

export type DaoEstimate = {
  eligibleCapacityCkb: number
  occupiedCapacityCkb: number
  estimatedCompensationCkb: number
  estimatedOutsideDaoShareDriftCkb: number
}

export function estimateDaoScenario(scenario: DaoScenario): DaoEstimate {
  const { balanceCkb, annualRatePercent, months } = scenario

  if (!Number.isFinite(balanceCkb) || balanceCkb < 0 || balanceCkb > MAX_BALANCE_CKB) {
    throw new RangeError('Balance must be within the supported CKB range.')
  }
  if (
    !Number.isFinite(annualRatePercent) ||
    annualRatePercent < 0 ||
    annualRatePercent > MAX_SCENARIO_RATE_PERCENT
  ) {
    throw new RangeError('Scenario rate must be between 0% and 5%.')
  }
  if (!Number.isInteger(months) || months < 1 || months > MAX_SCENARIO_MONTHS) {
    throw new RangeError('Scenario duration must be a whole number of months from 1 to 60.')
  }

  const eligibleCapacityCkb = Math.max(0, balanceCkb - STANDARD_DAO_OCCUPIED_CKB)
  const growthFactor = (1 + annualRatePercent / 100) ** (months / 12)

  return {
    eligibleCapacityCkb,
    occupiedCapacityCkb: STANDARD_DAO_OCCUPIED_CKB,
    estimatedCompensationCkb: eligibleCapacityCkb * (growthFactor - 1),
    estimatedOutsideDaoShareDriftCkb: balanceCkb * (1 - 1 / growthFactor),
  }
}
