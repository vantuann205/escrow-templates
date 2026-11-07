import {
  estimateDaoScenario,
  MAX_BALANCE_CKB,
  STANDARD_DAO_OCCUPIED_CKB,
} from './dao-model'

const formatCkb = new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 })
const formatCompensation = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

export function bindEstimateControls() {
  const form = document.querySelector<HTMLFormElement>('#estimate-form')!
  const balanceInput = document.querySelector<HTMLInputElement>('#balance-input')!
  const balanceError = document.querySelector<HTMLElement>('#balance-error')!
  const depositStatus = document.querySelector<HTMLElement>('#deposit-status')!
  const rateInput = document.querySelector<HTMLInputElement>('#rate-input')!
  const rateOutput = document.querySelector<HTMLOutputElement>('#rate-output')!
  const monthsInput = document.querySelector<HTMLInputElement>('#months-input')!
  const monthsOutput = document.querySelector<HTMLOutputElement>('#months-output')!
  const compensationOutput = document.querySelector<HTMLOutputElement>('#compensation-output')!
  const eligibleOutput = document.querySelector<HTMLOutputElement>('#eligible-output')!
  const outsideDriftOutput = document.querySelector<HTMLOutputElement>('#outside-drift-output')!
  const resultPeriod = document.querySelector<HTMLElement>('#result-period')!
  const presets = document.querySelectorAll<HTMLButtonElement>('[data-preset]')

  const update = () => {
    const balanceCkb = balanceInput.valueAsNumber
    const annualRatePercent = Number(rateInput.value)
    const months = Number(monthsInput.value)
    const isValidBalance =
      balanceInput.value.trim() !== '' &&
      Number.isFinite(balanceCkb) &&
      balanceCkb >= 0 &&
      balanceCkb <= MAX_BALANCE_CKB

    rateOutput.textContent = `${annualRatePercent.toFixed(1)}%`
    monthsOutput.textContent = `${months} ${months === 1 ? 'month' : 'months'}`
    balanceInput.setAttribute('aria-invalid', String(!isValidBalance))
    balanceError.hidden = isValidBalance

    if (!isValidBalance) {
      compensationOutput.textContent = 'Unavailable'
      eligibleOutput.textContent = 'Unavailable'
      outsideDriftOutput.textContent = 'Unavailable'
      resultPeriod.textContent = 'Enter a valid balance to see this scenario.'
      depositStatus.dataset.state = 'low'
      depositStatus.textContent = `Enter a balance from 0 to ${formatCkb.format(MAX_BALANCE_CKB)} CKB.`
      presets.forEach((preset) => preset.setAttribute('aria-pressed', 'false'))
      return
    }

    const estimate = estimateDaoScenario({ balanceCkb, annualRatePercent, months })
    const canDepositStandardCell = balanceCkb >= STANDARD_DAO_OCCUPIED_CKB
    compensationOutput.textContent = canDepositStandardCell
      ? formatCompensation.format(estimate.estimatedCompensationCkb)
      : 'Not eligible'
    eligibleOutput.textContent = formatCkb.format(estimate.eligibleCapacityCkb)
    outsideDriftOutput.textContent = formatCompensation.format(
      estimate.estimatedOutsideDaoShareDriftCkb,
    )
    resultPeriod.textContent = canDepositStandardCell
      ? `Estimated increase over ${months} ${months === 1 ? 'month' : 'months'} at a ${annualRatePercent.toFixed(1)}% yearly rate assumption`
      : `A standard deposit cell needs at least ${STANDARD_DAO_OCCUPIED_CKB} CKB plus fees.`
    if (balanceCkb < STANDARD_DAO_OCCUPIED_CKB) {
      depositStatus.dataset.state = 'low'
      depositStatus.textContent = `A standard DAO deposit needs ${STANDARD_DAO_OCCUPIED_CKB} CKB for cell space. Network fees are extra.`
    } else if (balanceCkb === STANDARD_DAO_OCCUPIED_CKB) {
      depositStatus.dataset.state = 'occupied-only'
      depositStatus.textContent = `${STANDARD_DAO_OCCUPIED_CKB} CKB covers cell space, leaving no CKB for this estimate. Network fees are extra.`
    } else {
      depositStatus.dataset.state = 'ready'
      depositStatus.textContent = `${formatCkb.format(estimate.eligibleCapacityCkb)} CKB remains after cell space is set aside. Network fees are extra.`
    }

    presets.forEach((preset) => {
      preset.setAttribute('aria-pressed', String(Number(preset.dataset.preset) === balanceCkb))
    })
  }

  form.addEventListener('submit', (event) => event.preventDefault())
  balanceInput.addEventListener('input', update)
  rateInput.addEventListener('input', update)
  monthsInput.addEventListener('input', update)
  presets.forEach((preset) => {
    preset.addEventListener('click', () => {
      balanceInput.value = preset.dataset.preset ?? ''
      update()
      balanceInput.focus()
    })
  })

  update()
}
