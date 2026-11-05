const content = {
  compensation: {
    description: 'Estimated compensation uses eligible capacity and the selected scenario growth factor.',
    code: 'eligibleCapacity = max(0, balance - occupiedCapacity)\ngrowthFactor = (1 + scenarioRate) ^ (months / 12)\ncompensation = eligibleCapacity * (growthFactor - 1)',
  },
  capacity: {
    description: 'The standard scenario removes occupied capacity before applying the selected growth factor.',
    code: 'occupiedCapacity = 102 CKB\neligibleCapacity = max(0, balance - occupiedCapacity)\ntransactionFees = not included',
  },
  share: {
    description: 'Outside-DAO share drift is a modeled CKB-equivalent change, not CKB removed from a wallet.',
    code: 'growthFactor = (1 + scenarioRate) ^ (months / 12)\noutsideDaoShareDrift = balance * (1 - 1 / growthFactor)',
  },
  protocol: {
    description: 'The live Nervos DAO uses accumulated-rate values recorded by the protocol.',
    code: 'compensation = (capacity - occupiedCapacity)\n  * (ARwithdraw / ARdeposit - 1)\n\nThis prototype does not read on-chain values.',
  },
  limits: {
    description: 'The scenario assumes a constant annual rate and excludes fees, primary issuance, and market-price changes.',
    code: 'annualRate = userProvidedScenario\nmonths = 1..60\n\nliveRates = not connected\nwallet = not connected',
  },
}

export function bindModelNotes() {
  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-method-tab]'))
  const panel = document.querySelector<HTMLElement>('#method-panel')
  const description = document.querySelector<HTMLElement>('#method-copy')
  const formula = document.querySelector<HTMLElement>('#method-code')
  const copyButton = document.querySelector<HTMLButtonElement>('#method-copy-button')
  const copyStatus = document.querySelector<HTMLElement>('#method-copy-status')

  if (!panel || !description || !formula || !copyButton || !copyStatus || tabs.length === 0) return

  const select = (index: number) => {
    const tab = tabs[index]
    const content = contentFor(tab.dataset.methodTab)
    if (!content) return
    tabs.forEach((item, itemIndex) => {
      const selected = itemIndex === index
      item.classList.toggle('is-active', selected)
      item.setAttribute('aria-selected', String(selected))
      item.tabIndex = selected ? 0 : -1
    })
    panel.setAttribute('aria-labelledby', tab.id)
    description.textContent = content.description
    formula.textContent = content.code
    copyStatus.textContent = ''
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index))
    tab.addEventListener('keydown', (event) => {
      const nextIndex =
        event.key === 'ArrowRight' ? (index + 1) % tabs.length
          : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length
            : event.key === 'Home' ? 0
              : event.key === 'End' ? tabs.length - 1
                : -1
      if (nextIndex < 0) return
      event.preventDefault()
      tabs[nextIndex].focus()
      select(nextIndex)
    })
  })

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(formula.textContent ?? '')
      copyStatus.textContent = 'Formula copied.'
    } catch {
      copyStatus.textContent = 'Clipboard unavailable. Select the formula to copy it.'
    }
  })
}

function contentFor(key: string | undefined) {
  return key && key in content ? content[key as keyof typeof content] : null
}
