// 3) UI display only. All decisions come from src/contract.js.
import './style.css'
import { evaluate, ROOM } from './src/contract.js'
import { formatRange, toHHMM } from './src/availability.js'

document.querySelector('#app').innerHTML = `
  <main class="page">
    <header class="header">
      <h1>Smart Campus Room Availability Checker</h1>
      <p class="subtitle">Code-based version. Fictional data; nothing is booked or saved.</p>
    </header>
    <section class="card status-card">
      <h2>Room ${ROOM.name}</h2>
      <div class="status-grid">
        <div class="status-item"><span class="status-label">Current time</span><span class="status-value">${toHHMM(ROOM.currentTime)}</span></div>
        <div class="status-item"><span class="status-label">Existing bookings</span><span class="status-value" id="bookings">${ROOM.bookings.map(formatRange).join(', ')}</span></div>
      </div>
      <label class="block-toggle"><input type="checkbox" id="blocked" /> <span>Room is blocked</span></label>
    </section>
    <section class="card form-card">
      <h2>Check a time</h2>
      <form id="form" novalidate>
        <div class="field-row">
          <div class="field"><label for="start">Start time (HH:MM)</label><input id="start" type="text" inputmode="numeric" placeholder="12:00" maxlength="5" /></div>
          <div class="field"><label for="duration">Duration (minutes)</label><input id="duration" type="text" inputmode="numeric" placeholder="60" maxlength="4" /></div>
        </div>
        <button type="submit" id="check-btn">Check availability</button>
      </form>
      <div id="result" class="result result--hidden" role="status" aria-live="polite">
        <span class="result-badge" id="badge"></span><span class="result-text"><span id="message"></span> <small id="code"></small></span>
      </div>
    </section>
  </main>`

const $ = (s) => document.querySelector(s)
$('#form').addEventListener('submit', (event) => {
  event.preventDefault()
  const r = evaluate({ startText: $('#start').value, durationText: $('#duration').value, blocked: $('#blocked').checked })
  const box = $('#result')
  box.classList.remove('result--hidden')
  box.classList.toggle('result--available', r.available)
  box.classList.toggle('result--unavailable', !r.available)
  // textContent only: user input can never be interpreted as HTML
  $('#badge').textContent = r.available ? 'Available' : 'Unavailable'
  $('#message').textContent = r.message
  $('#code').textContent = `[${r.reasonCode}]`
})
