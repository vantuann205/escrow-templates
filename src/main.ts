import './style.css'
import { bindEstimateControls } from './estimate-controller'
import type { ShelterScene } from './shelter-scene'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header">
    <div class="page-frame header-inner">
      <a class="brand" href="#top" aria-label="CKB DAO Shelter home">
        <span class="brand-mark" aria-hidden="true"></span>
        <span>CKB DAO Shelter</span>
      </a>
      <nav class="main-nav" aria-label="Main navigation">
        <a href="#coverage">Coverage</a>
        <a href="#estimate">Model</a>
        <a href="#globe">CKB globe</a>
        <a href="#sources">Sources</a>
      </nav>
      <a class="button button-small header-cta" href="#first-deposit">Prepare a deposit</a>
    </div>
  </header>

  <main id="main-content">
    <section class="hero" id="top" aria-labelledby="hero-title">
      <div class="page-frame hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">Nervos DAO / CKB holder model</p>
          <h1 id="hero-title">
            <span>Understand CKB dilution</span>
            <span class="hero-title-secondary">before you lock.</span>
          </h1>
          <p class="hero-intro">
            Model secondary issuance, occupied capacity, and withdrawal timing before your first Nervos DAO deposit.
          </p>
          <div class="hero-actions">
            <a class="button" href="#estimate">Explore the model</a>
            <a class="button button-secondary" href="#withdrawal">Review the exit path</a>
          </div>
        </div>

        <div class="hero-demo">
          <div class="hero-demo-tabs" role="tablist" aria-label="DAO model topics">
            <button class="hero-demo-tab is-active" id="hero-tab-scenario" type="button" role="tab" aria-selected="true" aria-controls="hero-demo-panel" tabindex="0" data-preview-tab="scenario">Estimate</button>
            <button class="hero-demo-tab" id="hero-tab-coverage" type="button" role="tab" aria-selected="false" aria-controls="hero-demo-panel" tabindex="-1" data-preview-tab="coverage">Coverage</button>
            <button class="hero-demo-tab" id="hero-tab-exit" type="button" role="tab" aria-selected="false" aria-controls="hero-demo-panel" tabindex="-1" data-preview-tab="exit">Withdrawal</button>
          </div>
          <div class="hero-demo-panel" id="hero-demo-panel" role="tabpanel" tabindex="0" aria-labelledby="hero-tab-scenario">
            <div class="hero-demo-copy">
              <strong id="hero-demo-title">Estimate a holder scenario</strong>
              <p id="hero-demo-copy-text">Start with a balance. Adjust the scenario assumptions in the model below.</p>
            </div>
            <form class="hero-balance-form" id="hero-check-form">
              <label class="visually-hidden" for="hero-balance-input">CKB balance</label>
              <input id="hero-balance-input" name="balance" type="number" min="0" max="1000000000000" step="1" value="100000" required aria-label="CKB balance" />
              <span aria-hidden="true">CKB</span>
              <button type="submit" aria-label="Use this balance in the model">Estimate</button>
            </form>
          </div>
        </div>

        <ul class="hero-trust-strip" aria-label="Model details">
          <li>Scenario input, not live data</li>
          <li>Occupied capacity excluded</li>
          <li>180-epoch minimum lock</li>
          <li>Two-phase withdrawal</li>
        </ul>
      </div>
    </section>

    <section class="definition-section section-space" id="what-is-dao" aria-labelledby="definition-title">
      <div class="page-frame">
        <div class="section-heading section-heading-centered">
          <h2 id="definition-title">What is the Nervos DAO?</h2>
          <p>It lets CKB holders deposit eligible capacity and receive compensation for secondary issuance while funds remain locked.</p>
        </div>
        <div class="workflow-preview" aria-label="Nervos DAO deposit and withdrawal lifecycle" data-reveal>
          <div class="workflow-node workflow-holder">
            <span class="workflow-symbol" aria-hidden="true">CKB</span>
            <strong>Holder wallet</strong>
            <span>Choose a balance</span>
          </div>
          <span class="workflow-connector" aria-hidden="true"></span>
          <div class="workflow-node workflow-dao">
            <span class="workflow-symbol" aria-hidden="true">DAO</span>
            <strong>DAO deposit cell</strong>
            <span>Eligible capacity accrues compensation</span>
          </div>
          <span class="workflow-connector" aria-hidden="true"></span>
          <div class="workflow-node workflow-maturity">
            <span class="workflow-symbol" aria-hidden="true">180</span>
            <strong>Reach maturity</strong>
            <span>Wait at least 180 epochs</span>
          </div>
          <span class="workflow-connector" aria-hidden="true"></span>
          <div class="workflow-node workflow-exit">
            <span class="workflow-symbol" aria-hidden="true">2x</span>
            <strong>Withdraw in phases</strong>
            <span>Start, then complete withdrawal</span>
          </div>
        </div>
      </div>
    </section>

    <section class="fact-strip" aria-label="Nervos DAO model facts">
      <div class="page-frame fact-strip-inner">
        <div class="fact-strip-track">
          <ul class="fact-strip-group">
            <li><strong>Secondary issuance</strong><span>Compensation modelled</span></li>
            <li><strong>102 CKB</strong><span>Standard occupied capacity</span></li>
            <li><strong>180 epochs</strong><span>Minimum lock period</span></li>
            <li><strong>Two phases</strong><span>Withdrawal process</span></li>
          </ul>
          <ul class="fact-strip-group" aria-hidden="true">
            <li><strong>Secondary issuance</strong><span>Compensation modelled</span></li>
            <li><strong>102 CKB</strong><span>Standard occupied capacity</span></li>
            <li><strong>180 epochs</strong><span>Minimum lock period</span></li>
            <li><strong>Two phases</strong><span>Withdrawal process</span></li>
          </ul>
        </div>
      </div>
    </section>

    <section class="estimate-section section-space" id="estimate" aria-labelledby="estimate-title">
      <div class="page-frame">
        <div class="feature-heading" data-reveal>
          <div class="section-heading">
            <p class="eyebrow">Holder scenario</p>
            <h2 id="estimate-title">See how the assumptions change the estimate.</h2>
            <p>Use a balance, an illustrative issuance rate, and a time horizon to inspect the model.</p>
          </div>
          <ul class="feature-points">
            <li>
              <span class="feature-point-mark" aria-hidden="true">01</span>
              <div><strong>Start with eligible capacity</strong><p>Occupied capacity stays in the deposit cell but does not earn compensation.</p></div>
            </li>
            <li>
              <span class="feature-point-mark" aria-hidden="true">02</span>
              <div><strong>Choose a scenario rate</strong><p>This is an editable assumption, not a live network value or an APY.</p></div>
            </li>
            <li>
              <span class="feature-point-mark" aria-hidden="true">03</span>
              <div><strong>Compare time horizons</strong><p>Model between one and sixty months without connecting a wallet.</p></div>
            </li>
            <li>
              <span class="feature-point-mark" aria-hidden="true">04</span>
              <div><strong>Review both outputs</strong><p>Compare illustrative DAO compensation with outside-DAO share drift.</p></div>
            </li>
          </ul>
        </div>

        <div class="estimate-layout" data-reveal>
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
                <label for="rate-input">Annual issuance scenario</label>
                <output id="rate-output" for="rate-input">2.0%</output>
              </div>
              <input id="rate-input" name="rate" type="range" min="0" max="5" step="0.1" value="2" />
              <p class="field-hint">Demo-only supply-growth input. Not live data, APY, or a market return.</p>
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
              <div>
                <dt>Outside DAO share drift</dt>
                <dd><output id="outside-drift-output">1,960.78</output> CKB-equiv</dd>
              </div>
            </dl>
            <p class="result-note">
              Share drift is a modeled change in supply share, not CKB removed from your wallet. Occupied capacity remains part of a DAO deposit but does not earn compensation.
            </p>
          </aside>
        </div>
      </div>
    </section>

    <section class="coverage-section section-space" id="coverage" aria-labelledby="coverage-title">
      <div class="page-frame coverage-layout" data-reveal>
        <div class="section-heading">
          <h2 id="coverage-title">What the DAO can and cannot offset.</h2>
          <p>The estimate focuses on secondary issuance. It does not represent every risk of holding CKB.</p>
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
            <span class="coverage-mark" aria-hidden="true">-</span>
            <div>
              <h3>Primary issuance and market price</h3>
              <p>The DAO does not compensate for primary issuance or a change in CKB's fiat price.</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="method-section section-space" id="method" aria-labelledby="method-title">
      <div class="page-frame">
        <div class="method-intro">
          <div class="section-heading">
            <p class="eyebrow">Calculation notes</p>
            <h2 id="method-title">Inspect the model behind each number.</h2>
            <p>The live protocol uses accumulated rates. This prototype uses editable assumptions so the estimate stays inspectable.</p>
          </div>
        </div>
        <div class="method-console" data-reveal>
          <div class="method-tabs" role="tablist" aria-label="Calculation details">
            <button class="method-tab is-active" id="method-tab-compensation" type="button" role="tab" aria-selected="true" aria-controls="method-panel" tabindex="0" data-method-tab="compensation">Compensation</button>
            <button class="method-tab" id="method-tab-capacity" type="button" role="tab" aria-selected="false" aria-controls="method-panel" tabindex="-1" data-method-tab="capacity">Occupied capacity</button>
            <button class="method-tab" id="method-tab-share" type="button" role="tab" aria-selected="false" aria-controls="method-panel" tabindex="-1" data-method-tab="share">Share drift</button>
            <button class="method-tab" id="method-tab-protocol" type="button" role="tab" aria-selected="false" aria-controls="method-panel" tabindex="-1" data-method-tab="protocol">On-chain model</button>
          </div>
          <div class="method-panel" id="method-panel" role="tabpanel" tabindex="0" aria-labelledby="method-tab-compensation">
            <div class="method-panel-heading">
              <div>
                <span class="method-language">Scenario preview</span>
                <p id="method-copy">Estimated compensation uses eligible capacity and the selected scenario growth factor.</p>
              </div>
              <a href="#sources">View sources</a>
            </div>
            <div class="method-code-actions">
              <button class="copy-button" id="method-copy-button" type="button">Copy formula</button>
              <span class="copy-status" id="method-copy-status" role="status" aria-live="polite"></span>
            </div>
            <pre><code id="method-code">eligibleCapacity = max(0, balance - occupiedCapacity)
growthFactor = (1 + scenarioRate) ^ (months / 12)
compensation = eligibleCapacity * (growthFactor - 1)</code></pre>
          </div>
        </div>
      </div>
    </section>

    <section class="globe-section section-space" id="globe" aria-labelledby="globe-title">
      <div class="page-frame globe-layout" data-reveal>
        <div class="globe-copy">
          <h2 id="globe-title">A holder view of the CKB network.</h2>
          <p>The marker count responds to your balance. It is a concept visualization, not live chain data or a token count.</p>
          <p class="globe-note">Drag to rotate the model. The estimate remains available without WebGL.</p>
          <a class="text-link" href="#estimate">Return to the estimate <span aria-hidden="true">→</span></a>
        </div>
        <figure class="globe-visual">
          <div class="scene-stage" id="scene-stage">
            <canvas id="shelter-scene" aria-hidden="true"></canvas>
            <p class="scene-fallback" id="scene-fallback" hidden>
              The 3D preview is unavailable here. Your estimate still works above.
            </p>
            <div class="scene-readout">
              <span>Illustrative balance</span>
              <strong id="scene-balance">100,000 CKB</strong>
            </div>
          </div>
        </figure>
      </div>
    </section>

    <section class="onboarding-section section-space" id="first-deposit" aria-labelledby="onboarding-title">
      <div class="page-frame">
        <div class="section-heading section-heading-centered">
          <h2 id="onboarding-title">Get ready for a first DAO deposit.</h2>
          <p>Use the prototype to plan, then confirm current protocol details in your wallet and official documentation.</p>
        </div>
        <div class="onboarding-cards" data-reveal>
          <article class="onboarding-card">
            <span class="onboarding-symbol" aria-hidden="true">01</span>
            <h3>Review your balance</h3>
            <ol>
              <li>Keep capacity for the DAO cell and transaction fees.</li>
              <li>Check the estimated eligible amount.</li>
              <li>Compare a few time and rate assumptions.</li>
            </ol>
            <a class="button button-secondary" href="#estimate">Open the model</a>
          </article>
          <article class="onboarding-card onboarding-card-accent">
            <span class="onboarding-symbol" aria-hidden="true">02</span>
            <h3>Understand the lock</h3>
            <p>A Nervos DAO deposit has a minimum lock and a two-phase withdrawal. Review the sequence before signing.</p>
            <a class="button button-light" href="#withdrawal">Read the exit path</a>
          </article>
        </div>
      </div>
    </section>

    <section class="capabilities-section section-space" id="capabilities" aria-labelledby="capabilities-title">
      <div class="page-frame">
        <div class="capabilities-heading">
          <p class="eyebrow">Prototype coverage</p>
          <h2 id="capabilities-title">A clearer view of the holder workflow.</h2>
          <p>Explore the parts of a DAO decision this prototype can help make visible.</p>
        </div>
        <div class="capability-grid" data-reveal>
          <article class="capability-card">
            <span class="capability-icon" aria-hidden="true">%</span>
            <h3>Secondary issuance</h3>
            <p>Model an illustrative supply-growth scenario over a chosen time horizon.</p>
            <a href="#estimate">Explore the estimate <span aria-hidden="true">↗</span></a>
          </article>
          <article class="capability-card">
            <span class="capability-icon" aria-hidden="true">CKB</span>
            <h3>Eligible capacity</h3>
            <p>Separate the standard occupied capacity from the amount used in the estimate.</p>
            <a href="#coverage">Check what's included <span aria-hidden="true">↗</span></a>
          </article>
          <article class="capability-card">
            <span class="capability-icon" aria-hidden="true">180</span>
            <h3>Lock timing</h3>
            <p>Keep the minimum 180-epoch deposit lock in view when comparing scenarios.</p>
            <a href="#withdrawal">Review timing <span aria-hidden="true">↗</span></a>
          </article>
          <article class="capability-card">
            <span class="capability-icon" aria-hidden="true">2x</span>
            <h3>Two-phase exit</h3>
            <p>See why withdrawal is a sequence instead of a single instant action.</p>
            <a href="#withdrawal">See the phases <span aria-hidden="true">↗</span></a>
          </article>
          <article class="capability-card">
            <span class="capability-icon" aria-hidden="true">Δ</span>
            <h3>Share drift</h3>
            <p>Compare the scenario's outside-DAO supply-share change in CKB-equivalent terms.</p>
            <a href="#method">Inspect the formula <span aria-hidden="true">↗</span></a>
          </article>
          <article class="capability-card">
            <span class="capability-icon" aria-hidden="true">3D</span>
            <h3>CKB globe</h3>
            <p>Explore a balance-responsive visualization that does not claim to show live chain activity.</p>
            <a href="#globe">View the globe <span aria-hidden="true">↗</span></a>
          </article>
          <article class="capability-card">
            <span class="capability-icon" aria-hidden="true">Aa</span>
            <h3>Editable assumptions</h3>
            <p>Change balance, rate, and duration to see which assumptions drive the result.</p>
            <a href="#estimate">Change assumptions <span aria-hidden="true">↗</span></a>
          </article>
          <article class="capability-card">
            <span class="capability-icon" aria-hidden="true">DOC</span>
            <h3>Protocol references</h3>
            <p>Read the source material behind the deposit, withdrawal, and economics notes.</p>
            <a href="#sources">Open references <span aria-hidden="true">↗</span></a>
          </article>
          <article class="capability-card">
            <span class="capability-icon" aria-hidden="true">OFF</span>
            <h3>Offline by design</h3>
            <p>No wallet connection, RPC request, live rate, or on-chain transaction is involved.</p>
            <a href="#limits">Review limitations <span aria-hidden="true">↗</span></a>
          </article>
        </div>
      </div>
    </section>

    <section class="use-cases-section section-space" id="holder-scenarios" aria-labelledby="use-cases-title">
      <div class="page-frame">
        <div class="use-cases-heading">
          <div>
            <p class="eyebrow">Holder scenarios</p>
            <h2 id="use-cases-title">Start with the question you have.</h2>
            <p>Check the assumptions before treating an estimate as a deposit decision.</p>
          </div>
          <a class="text-link text-link-light" href="#sources">Read the protocol sources <span aria-hidden="true">→</span></a>
        </div>
        <div class="scenario-grid" data-reveal>
          <article class="scenario-card scenario-card-green">
            <span class="scenario-label">BALANCE</span>
            <h3>How much capacity is eligible?</h3>
            <p>Account for occupied capacity before comparing a deposit with holding outside the DAO.</p>
            <a href="#estimate">Check a balance <span aria-hidden="true">→</span></a>
          </article>
          <article class="scenario-card scenario-card-blue">
            <span class="scenario-label">TIME</span>
            <h3>How does a longer horizon change the estimate?</h3>
            <p>Adjust the duration and scenario rate to see how the illustrative outputs move.</p>
            <a href="#estimate">Compare scenarios <span aria-hidden="true">→</span></a>
          </article>
          <article class="scenario-card scenario-card-purple">
            <span class="scenario-label">WITHDRAWAL</span>
            <h3>When can I complete an exit?</h3>
            <p>Review the maturity condition and the two transactions used by the withdrawal flow.</p>
            <a href="#withdrawal">Review the sequence <span aria-hidden="true">→</span></a>
          </article>
          <article class="scenario-card scenario-card-forest">
            <span class="scenario-label">LIMITS</span>
            <h3>What is missing from this preview?</h3>
            <p>Separate protocol facts from the assumptions this prototype cannot verify live.</p>
            <a href="#limits">See the boundaries <span aria-hidden="true">→</span></a>
          </article>
        </div>

        <div class="resource-heading" id="sources">
          <div>
            <h2>Read the protocol references.</h2>
            <p>These links document the on-chain model. The estimate above remains a simplified scenario.</p>
          </div>
        </div>
        <div class="resource-grid" data-reveal>
          <a class="resource-card" href="https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md" target="_blank" rel="noopener noreferrer">
            <span>RFC 0023</span>
            <strong>DAO deposit and withdrawal</strong>
            <small>Protocol specification <span aria-hidden="true">↗</span></small>
          </a>
          <a class="resource-card" href="https://docs.nervos.org/docs/basics/concepts/economics/" target="_blank" rel="noopener noreferrer">
            <span>ECONOMICS</span>
            <strong>Nervos economics and DAO</strong>
            <small>Network concepts <span aria-hidden="true">↗</span></small>
          </a>
          <a class="resource-card" href="https://docs.nervos.org/docs/script/dao/" target="_blank" rel="noopener noreferrer">
            <span>DAO SCRIPT</span>
            <strong>Cells, scripts, and DAO rules</strong>
            <small>Developer documentation <span aria-hidden="true">↗</span></small>
          </a>
        </div>
      </div>
    </section>

    <section class="transparency-section section-space" id="limits" aria-labelledby="transparency-title">
      <div class="page-frame">
        <div class="section-heading section-heading-centered">
          <h2 id="transparency-title">What this prototype does and does not do.</h2>
          <p>It is a planning aid for a holder workflow, not a live protocol client.</p>
        </div>
        <div class="transparency-grid" data-reveal>
          <article>
            <span class="transparency-mark" aria-hidden="true">01</span>
            <h3>Scenario, not forecast</h3>
            <p>The default rate is a placeholder. The model assumes a constant annual rate and compounding.</p>
          </article>
          <article>
            <span class="transparency-mark" aria-hidden="true">02</span>
            <h3>No wallet connection</h3>
            <p>No wallet, RPC, live rate, fee quote, or on-chain deposit is connected.</p>
          </article>
          <article>
            <span class="transparency-mark" aria-hidden="true">03</span>
            <h3>Protocol values decide</h3>
            <p>Actual compensation is determined by DAO accumulated-rate values and each cell's capacity.</p>
          </article>
        </div>
        <p class="transparency-note">Verify current network details and transaction data in your wallet before signing.</p>
      </div>
    </section>

    <section class="withdrawal-section section-space" id="withdrawal" aria-labelledby="withdrawal-title">
      <div class="page-frame withdrawal-layout">
        <div class="section-heading">
          <h2 id="withdrawal-title">Know the exit before you deposit.</h2>
          <p>Depositing is one transaction. Withdrawing uses two phases.</p>
        </div>
        <ol class="withdrawal-flow" data-reveal>
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

    <section class="faq-section section-space" id="faq" aria-labelledby="faq-title">
      <div class="page-frame">
        <div class="faq-heading">
          <h2 id="faq-title">Common <span>questions</span></h2>
          <p>Key details for checking a first Nervos DAO scenario.</p>
        </div>
        <div class="faq-grid" data-reveal>
          <details><summary>Is this connected to the CKB network?</summary><p>No. The prototype does not use RPC, read live accumulated rates, or submit transactions.</p></details>
          <details><summary>Is the estimate an APY or a return?</summary><p>No. It is an illustrative compensation scenario based on the rate and duration you enter.</p></details>
          <details><summary>Does occupied capacity earn DAO compensation?</summary><p>No. The modeled standard deposit cell uses 102 CKB of occupied capacity, which is excluded from eligible capacity.</p></details>
          <details><summary>Does the DAO offset primary issuance?</summary><p>No. This model focuses on secondary issuance and does not compensate for primary issuance.</p></details>
          <details><summary>How long is the minimum lock?</summary><p>The minimum lock is 180 epochs from the deposit epoch. Epoch duration can vary.</p></details>
          <details><summary>Can I withdraw in one transaction?</summary><p>No. Nervos DAO withdrawal uses a request phase and a completion phase, subject to maturity rules.</p></details>
          <details><summary>Does the globe show live holders?</summary><p>No. Its marker count is a balance-responsive concept visualization, not live chain data or a token count.</p></details>
          <details><summary>Where can I verify the protocol details?</summary><p>Read RFC 0023 and the Nervos documentation linked in the protocol references section.</p></details>
        </div>
      </div>
    </section>

    <section class="closing-cta" aria-labelledby="closing-title">
      <div class="page-frame closing-cta-inner" data-reveal>
        <span class="brand-mark closing-mark" aria-hidden="true"></span>
        <h2 id="closing-title">Model your CKB DAO scenario.</h2>
        <p>Check the assumptions, the occupied capacity, and the exit path before you decide.</p>
        <a class="button button-light" href="#method">Check the model sources <span aria-hidden="true">→</span></a>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="page-frame footer-inner">
      <div class="footer-top">
        <a class="brand footer-brand" href="#top">
          <span class="brand-mark" aria-hidden="true"></span>
          <span>CKB DAO Shelter</span>
        </a>
        <p>Illustrative tool only. Verify current network details before signing a transaction.</p>
      </div>
      <div class="footer-columns">
        <div><strong>Explore</strong><a href="#estimate">Holder estimate</a><a href="#coverage">What is covered</a><a href="#globe">CKB globe</a><a href="#withdrawal">Withdrawal path</a></div>
        <div><strong>Understand</strong><a href="#what-is-dao">Nervos DAO</a><a href="#first-deposit">First deposit</a><a href="#holder-scenarios">Holder scenarios</a><a href="#faq">Common questions</a></div>
        <div><strong>Protocol sources</strong><a href="https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md" target="_blank" rel="noopener noreferrer">RFC 0023</a><a href="https://docs.nervos.org/docs/basics/concepts/economics/" target="_blank" rel="noopener noreferrer">Nervos economics</a><a href="https://docs.nervos.org/docs/script/dao/" target="_blank" rel="noopener noreferrer">DAO script</a></div>
        <div><strong>Prototype</strong><a href="#method">Model assumptions</a><a href="#limits">Limitations</a><a href="#sources">References</a></div>
      </div>
      <div class="footer-bottom"><span>CKB DAO Shelter</span><a href="#top">Back to top <span aria-hidden="true">↑</span></a></div>
    </div>
  </footer>
`

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
let revealObserver: IntersectionObserver | null = null

function bindSectionReveals() {
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return

  const revealTargets = document.querySelectorAll<HTMLElement>('[data-reveal]')
  if (!revealTargets.length) return

  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' })

  document.documentElement.classList.add('motion-ready')
  revealTargets.forEach((target) => revealObserver?.observe(target))
}

bindSectionReveals()

reducedMotion.addEventListener('change', (event) => {
  if (event.matches) {
    revealObserver?.disconnect()
    document.documentElement.classList.remove('motion-ready')
  } else {
    bindSectionReveals()
  }
})

const heroPreviewContent = {
  scenario: {
    title: 'Estimate a holder scenario',
    copy: 'Start with a balance. Adjust the scenario assumptions in the model below.',
  },
  coverage: {
    title: 'Secondary issuance only',
    copy: 'See eligible capacity after standard occupied capacity is accounted for.',
  },
  exit: {
    title: 'Know the two withdrawal phases',
    copy: 'A deposit reaches maturity first, then withdrawal is completed in a second transaction.',
  },
}

const heroTabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-preview-tab]'))
const heroPanel = document.querySelector<HTMLElement>('#hero-demo-panel')!
const heroPanelTitle = document.querySelector<HTMLElement>('#hero-demo-title')!
const heroPanelCopy = document.querySelector<HTMLElement>('#hero-demo-copy-text')!

function bindTabs(
  tabs: HTMLButtonElement[],
  select: (index: number) => void,
) {
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index))
    tab.addEventListener('keydown', (event) => {
      const nextIndex =
        event.key === 'ArrowRight'
          ? (index + 1) % tabs.length
          : event.key === 'ArrowLeft'
            ? (index - 1 + tabs.length) % tabs.length
            : event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? tabs.length - 1
                : -1

      if (nextIndex < 0) return
      event.preventDefault()
      tabs[nextIndex].focus()
      select(nextIndex)
    })
  })
}

function selectHeroTab(index: number) {
  const tab = heroTabs[index]
  const key = tab.dataset.previewTab as keyof typeof heroPreviewContent
  const content = heroPreviewContent[key]

  heroTabs.forEach((item, itemIndex) => {
    const selected = itemIndex === index
    item.classList.toggle('is-active', selected)
    item.setAttribute('aria-selected', String(selected))
    item.tabIndex = selected ? 0 : -1
  })
  heroPanel.setAttribute('aria-labelledby', tab.id)
  heroPanelTitle.textContent = content.title
  heroPanelCopy.textContent = content.copy
}

bindTabs(heroTabs, selectHeroTab)

const heroCheckForm = document.querySelector<HTMLFormElement>('#hero-check-form')!
const heroBalanceInput = document.querySelector<HTMLInputElement>('#hero-balance-input')!
const balanceInput = document.querySelector<HTMLInputElement>('#balance-input')!
heroCheckForm.addEventListener('submit', (event) => {
  event.preventDefault()
  balanceInput.value = heroBalanceInput.value
  balanceInput.dispatchEvent(new Event('input', { bubbles: true }))
  document.querySelector('#estimate')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
})

const methodContent = {
  compensation: {
    description: 'Estimated compensation uses eligible capacity and the selected scenario growth factor.',
    code: 'eligibleCapacity = max(0, balance - occupiedCapacity)\ngrowthFactor = (1 + scenarioRate) ^ (months / 12)\ncompensation = eligibleCapacity * (growthFactor - 1)',
  },
  capacity: {
    description: 'The prototype subtracts standard occupied capacity before applying the scenario growth factor.',
    code: 'occupiedCapacity = 102 CKB\neligibleCapacity = max(0, balance - occupiedCapacity)\ntransactionFees = not included',
  },
  share: {
    description: 'Outside-DAO share drift is shown as a modeled CKB-equivalent change, not as CKB removed from a wallet.',
    code: 'growthFactor = (1 + scenarioRate) ^ (months / 12)\noutsideDaoShareDrift = balance * (1 - 1 / growthFactor)',
  },
  protocol: {
    description: 'Nervos DAO compensation is calculated from accumulated-rate values recorded by the protocol.',
    code: 'compensation = (capacity - occupiedCapacity)\n  * (ARwithdraw / ARdeposit - 1)\n\nThis prototype does not read on-chain values.',
  },
}

const methodTabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-method-tab]'))
const methodPanel = document.querySelector<HTMLElement>('#method-panel')!
const methodCopy = document.querySelector<HTMLElement>('#method-copy')!
const methodCode = document.querySelector<HTMLElement>('#method-code')!

function selectMethodTab(index: number) {
  const tab = methodTabs[index]
  const key = tab.dataset.methodTab as keyof typeof methodContent
  const content = methodContent[key]

  methodTabs.forEach((item, itemIndex) => {
    const selected = itemIndex === index
    item.classList.toggle('is-active', selected)
    item.setAttribute('aria-selected', String(selected))
    item.tabIndex = selected ? 0 : -1
  })
  methodPanel.setAttribute('aria-labelledby', tab.id)
  methodCopy.textContent = content.description
  methodCode.textContent = content.code
}

bindTabs(methodTabs, selectMethodTab)

const methodCopyButton = document.querySelector<HTMLButtonElement>('#method-copy-button')!
const methodCopyStatus = document.querySelector<HTMLElement>('#method-copy-status')!
methodCopyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(methodCode.textContent ?? '')
    methodCopyStatus.textContent = 'Formula copied.'
  } catch {
    methodCopyStatus.textContent = 'Clipboard unavailable. Select the formula to copy it.'
  }
})

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
