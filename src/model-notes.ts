const content = {
  compensation: {
    description: 'The estimate starts with your balance, removes the 102 CKB cell requirement, then applies the selected rate over time.',
    code: 'CKB counted = max(0, balance - 102 CKB)\nGrowth over time = (1 + yearly rate / 100) ^ (months / 12)\nEstimated CKB increase = CKB counted * (growth - 1)',
  },
  capacity: {
    description: 'The standard estimate sets aside 102 CKB for the deposit cell. Transaction fees are extra.',
    code: 'Deposit cell requirement = 102 CKB\nCKB counted = max(0, balance - 102 CKB)\nTransaction fees = not included',
  },
  share: {
    description: 'This comparison estimates how a fixed balance could represent a different share of the growing supply outside DAO.',
    code: 'Growth over time = (1 + yearly rate / 100) ^ (months / 12)\nEstimated change = balance * (1 - 1 / growth)\nThis is not CKB removed from a wallet.',
  },
  protocol: {
    description: 'The real Nervos DAO uses rate values recorded on the network between deposit and withdrawal.',
    code: 'DAO increase = (CKB sent - occupied capacity)\n  * (withdrawal rate / deposit rate - 1)\n\nThis tool does not read network data.',
  },
  limits: {
    description: 'The example keeps one rate for the whole period. It does not include several real-world changes.',
    code: 'Yearly rate = editable assumption\nTime = 1 to 60 months\n\nLive network rate = not connected\nWallet = not connected',
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
