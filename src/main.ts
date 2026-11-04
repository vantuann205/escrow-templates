import './style.css'
import { bindEstimateControls } from './estimate-controller'
import type { ShelterScene } from './shelter-scene'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header">
    <div class="page-frame header-inner">
      <a class="brand" href="#top" aria-label="DAO Shelter Check home">
        <span class="brand-mark" aria-hidden="true"></span>
        <span>DAO Shelter Check</span>
      </a>
      <nav class="main-nav" aria-label="Main navigation">
        <a href="#estimate">Estimate</a>
        <a href="#withdrawal">How it works</a>
        <a href="#method">Assumptions</a>
        <a class="button button-small" href="#estimate">Model my CKB</a>
      </nav>
    </div>
  </header>

  <main id="main-content">
    <section class="hero" id="top" aria-labelledby="hero-title">
      <div class="page-frame hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">Nervos DAO / CKB holders</p>
          <h1 id="hero-title">See what DAO compensation can offset.</h1>
          <p class="hero-intro">
            Estimate secondary-issuance compensation on your CKB balance before a first DAO deposit.
          </p>
          <div class="hero-actions">
            <a class="button" href="#estimate">Check my CKB</a>
            <a class="text-link" href="#coverage">Understand the trade-off <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <figure class="hero-visual">
          <div class="scene-stage" id="scene-stage">
            <canvas id="shelter-scene" aria-hidden="true"></canvas>
            <p class="scene-fallback" id="scene-fallback" hidden>
              3D preview is unavailable in this browser. The estimate still works.
            </p>
            <div class="scene-readout">
              <span>Modeled balance</span>
              <strong id="scene-balance">100,000 CKB</strong>
            </div>
          </div>
          <figcaption>Conceptual cell visualization. Not a one-to-one token count.</figcaption>
        </figure>
      </div>
    </section>

    <section class="estimate-section section-space" id="estimate" aria-labelledby="estimate-title">
      <div class="page-frame">
        <div class="section-heading">
          <h2 id="estimate-title">Start with your balance.</h2>
          <p>Change the assumptions and see how the estimate moves.</p>
        </div>

        <div class="estimate-layout">
          <form class="estimate-controls" id="estimate-form">
            <div class="field">
              <label for="balance-input">CKB balance</label>
              <div class="amount-input">
                <input
                  id="balance-input"
                  name="balance"
                  type="number"
                  min="0"
                  max="1000000000000"
                  step="1"
                  inputmode="decimal"
                  value="100000"
                  aria-describedby="balance-hint"
                />
                <span>CKB</span>
              </div>
              <p class="field-hint" id="balance-hint">Enter the amount you could deposit.</p>
              <p class="field-error" id="balance-error" hidden>Enter a valid CKB amount between 0 and 1,000,000,000,000.</p>
              <p class="deposit-status" id="deposit-status" role="status">
                At 100,000 CKB, 99,898 CKB is eligible before transaction fees.
              </p>
            </div>

            <fieldset class="preset-field">
              <legend>Quick amounts</legend>
              <div class="preset-list">
                <button class="preset-button" type="button" data-preset="10000" aria-pressed="false">10k</button>
                <button class="preset-button is-active" type="button" data-preset="100000" aria-pressed="true">100k</button>
                <button class="preset-button" type="button" data-preset="1000000" aria-pressed="false">1m</button>
              </div>
            </fieldset>

            <div class="field range-field">
              <div class="range-heading">
                <label for="rate-input">Illustrative annual rate</label>
                <output id="rate-output" for="rate-input">2.0%</output>
              </div>
              <input id="rate-input" name="rate" type="range" min="0" max="5" step="0.1" value="2" />
              <p class="field-hint">A scenario input, not a live or guaranteed DAO rate.</p>
            </div>

            <div class="field range-field">
              <div class="range-heading">
                <label for="months-input">Time in DAO</label>
                <output id="months-output" for="months-input">12 months</output>
              </div>
              <input id="months-input" name="months" type="range" min="1" max="60" step="1" value="12" />
              <p class="field-hint">The minimum lock is 180 epochs from deposit.</p>
            </div>
          </form>

          <aside class="estimate-result" aria-labelledby="result-title">
            <p class="result-kicker" id="result-title">Illustrative compensation</p>
            <p class="result-number" aria-live="polite">
              <output id="compensation-output">1,998</output>
              <span>CKB</span>
            </p>
            <p class="result-period" id="result-period">over 12 months at a 2.0% scenario rate</p>
            <dl class="result-breakdown">
              <div>
                <dt>Eligible capacity</dt>
                <dd><output id="eligible-output">99,898</output> CKB</dd>
              </div>
              <div>
                <dt>Occupied capacity</dt>
                <dd>102 CKB</dd>
              </div>
            </dl>
            <p class="result-note">
              Occupied capacity is still part of your deposit. It is not included in this compensation estimate.
            </p>
          </aside>
        </div>
      </div>
    </section>

    <section class="coverage-section section-space" id="coverage" aria-labelledby="coverage-title">
      <div class="page-frame">
        <div class="section-heading">
          <h2 id="coverage-title">A useful offset, with clear limits.</h2>
          <p>The Nervos DAO addresses one source of CKB dilution, not every risk of holding an asset.</p>
        </div>
        <div class="coverage-columns">
          <article class="coverage-item coverage-included">
            <span class="coverage-mark" aria-hidden="true">+</span>
            <div>
              <h3>Secondary issuance</h3>
              <p>DAO compensation is designed to offset the dilution effect of secondary issuance on eligible deposited capacity.</p>
            </div>
          </article>
          <article class="coverage-item coverage-excluded">
            <span class="coverage-mark" aria-hidden="true">−</span>
            <div>
              <h3>Primary issuance and market price</h3>
              <p>The DAO does not compensate for primary issuance or a change in CKB's fiat price.</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="withdrawal-section section-space" id="withdrawal" aria-labelledby="withdrawal-title">
      <div class="page-frame withdrawal-layout">
        <div class="section-heading">
          <h2 id="withdrawal-title">Know the exit before you deposit.</h2>
          <p>Depositing is one transaction. Withdrawing uses two phases.</p>
        </div>
        <ol class="withdrawal-flow">
          <li>
            <span class="flow-index" aria-hidden="true">01</span>
            <div>
              <h3>Deposit</h3>
              <p>Move CKB into a Nervos DAO deposit cell.</p>
            </div>
          </li>
          <li>
            <span class="flow-index" aria-hidden="true">02</span>
            <div>
              <h3>Reach maturity</h3>
              <p>The minimum lock is 180 epochs from the deposit epoch, about 30 days at a typical epoch length.</p>
            </div>
          </li>
          <li>
            <span class="flow-index" aria-hidden="true">03</span>
            <div>
              <h3>Complete withdrawal</h3>
              <p>Start phase one, then submit phase two after the minimum lock is satisfied.</p>
            </div>
          </li>
        </ol>
        <details class="flow-detail">
          <summary>Why are there two withdrawal phases?</summary>
          <p>The first transaction records the withdrawal request and its compensation period. The second returns the capacity after the original deposit has matured.</p>
        </details>
      </div>
    </section>

    <section class="method-section section-space" id="method" aria-labelledby="method-title">
      <div class="page-frame method-layout">
        <div class="section-heading">
          <p class="eyebrow">Model notes</p>
          <h2 id="method-title">The live protocol uses accumulated rates.</h2>
          <p>This prototype uses editable assumptions so the estimate stays inspectable.</p>
        </div>
        <div class="method-content">
          <div class="formula-block">
            <span>Protocol relationship</span>
            <code>compensation = (capacity - occupied capacity) x (ARwithdraw / ARdeposit - 1)</code>
          </div>
          <div class="formula-block formula-demo">
            <span>This demo's preview</span>
            <code>eligible capacity x ((1 + scenario rate) ^ time - 1)</code>
          </div>
          <p class="method-copy">
            The demo assumes 102 CKB of occupied capacity for a standard deposit cell. Real occupied capacity depends on the cell's scripts and data.
          </p>
          <details class="source-detail">
            <summary>Sources and limits</summary>
            <p>
              No wallet, RPC, live rate, transaction fee, or on-chain deposit is connected. The rate control is only a scenario input. Actual compensation is determined by DAO accumulated-rate values on-chain.
            </p>
            <ul class="source-list">
              <li><a href="https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md" target="_blank" rel="noopener noreferrer">Nervos DAO RFC #23</a></li>
              <li><a href="https://docs.nervos.org/docs/basics/concepts/economics/" target="_blank" rel="noopener noreferrer">Nervos economics and DAO overview</a></li>
              <li><a href="https://docs.nervos.org/docs/script/dao/" target="_blank" rel="noopener noreferrer">DAO script and cell model</a></li>
            </ul>
          </details>
        </div>
      </div>
    </section>

    <section class="checklist-section section-space" id="first-deposit" aria-labelledby="checklist-title">
      <div class="page-frame checklist-layout">
        <div>
          <h2 id="checklist-title">Before your first deposit.</h2>
          <p>Review the balance, the lock, and what the DAO does not cover.</p>
        </div>
        <ol class="checklist">
          <li>Leave enough CKB for occupied capacity and transaction fees.</li>
          <li>Only deposit funds you can leave locked through the minimum period.</li>
          <li>Use a wallet you trust and verify the transaction details before signing.</li>
        </ol>
        <a class="button" href="#estimate">Review my estimate <span aria-hidden="true">→</span></a>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="page-frame footer-inner">
      <a class="brand" href="#top">
        <span class="brand-mark" aria-hidden="true"></span>
        <span>DAO Shelter Check</span>
      </a>
      <p>Illustrative tool only. Verify current network details before signing a transaction.</p>
    </div>
  </footer>
`

const sceneStage = document.querySelector<HTMLElement>('#scene-stage')!
const sceneCanvas = document.querySelector<HTMLCanvasElement>('#shelter-scene')!
const sceneFallback = document.querySelector<HTMLElement>('#scene-fallback')!
let modeledBalanceCkb = 100_000
let shelterScene: ShelterScene | null = null

bindEstimateControls((balanceCkb) => {
  modeledBalanceCkb = balanceCkb
  shelterScene?.updateBalance(balanceCkb)
})

void import('./shelter-scene')
  .then(({ mountShelterScene }) => {
    shelterScene = mountShelterScene(sceneStage, sceneCanvas, modeledBalanceCkb)
  })
  .catch(() => {
    sceneCanvas.hidden = true
    sceneFallback.hidden = false
  })
