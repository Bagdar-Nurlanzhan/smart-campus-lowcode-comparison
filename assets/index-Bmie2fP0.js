(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=/^([01]?\d|2[0-3]):([0-5]\d)$/,t=e=>{let[t,n]=e.split(`:`).map(Number);return t*60+n},n=e=>{let t=Math.floor(e/60),n=e%60;return`${String(t).padStart(2,`0`)}:${String(n).padStart(2,`0`)}`},r=([e,t])=>`${n(e)}–${n(t)}`;function i(e,t,i,a,o,s=`(unspecified)`){if(i)return{available:!1,reason:`Room ${s} is currently blocked and cannot be used.`};if(!(0<=e&&e<t&&t<=1440))return{available:!1,reason:`Start must be earlier than end, and both within 00:00–24:00.`};if(!(e>a))return{available:!1,reason:`Start time must be strictly later than the current time (${n(a)}).`};let c=t-e;if(c>120)return{available:!1,reason:`Requested duration is ${c} minutes, which exceeds the 120-minute maximum.`};for(let[n,i]of o)if(e<i&&t>n)return{available:!1,reason:`Overlaps an existing booking (${r([n,i])}).`};return{available:!0,reason:null}}var a=Object.freeze({name:`A-204`,currentTime:540,bookings:Object.freeze([Object.freeze([600,660])])});function o(n,r){let i=String(n??``).trim(),a=String(r??``).trim();return!e.test(i)||!/^-?\d+$/.test(a)?{ok:!1}:{ok:!0,start:t(i),duration:Number(a)}}function s(e,t,n,r){return n?`BLOCKED`:t<=e?`INVALID_DURATION`:t>1440?`OUT_OF_DAY`:e<=r.currentTime?`PAST_START`:t-e>120?`INVALID_DURATION`:`OVERLAP`}function c(e,{start:t,end:i,room:a}){switch(e){case`OK`:return`Available: room ${a.name} is free from ${n(t)} to ${n(i)}.`;case`INVALID_INPUT`:return`Enter a start time as HH:MM and a duration in whole minutes.`;case`BLOCKED`:return`Room ${a.name} is blocked and cannot be used.`;case`INVALID_DURATION`:return`Duration must be between 1 and 120 minutes.`;case`OUT_OF_DAY`:return`The booking must end by 24:00.`;case`PAST_START`:return`Start time must be later than the current time (${n(a.currentTime)}).`;default:return`Overlaps an existing booking (${r(a.bookings.find(([e,n])=>t<n&&i>e))}).`}}function l({startText:e,durationText:t,blocked:n},r=a){let l=o(e,t);if(!l.ok)return{available:!1,reasonCode:`INVALID_INPUT`,message:c(`INVALID_INPUT`,{room:r})};let u=l.start,d=u+l.duration,{available:f}=i(u,d,n,r.currentTime,r.bookings,r.name),p=f?`OK`:s(u,d,n,r);return{available:f,reasonCode:p,message:c(p,{start:u,end:d,room:r})}}document.querySelector(`#app`).innerHTML=`
  <main class="page">
    <header class="header">
      <h1>Smart Campus Room Availability Checker</h1>
      <p class="subtitle">Code-based version. Fictional data; nothing is booked or saved.</p>
    </header>
    <section class="card status-card">
      <h2>Room ${a.name}</h2>
      <div class="status-grid">
        <div class="status-item"><span class="status-label">Current time</span><span class="status-value">${n(a.currentTime)}</span></div>
        <div class="status-item"><span class="status-label">Existing bookings</span><span class="status-value" id="bookings">${a.bookings.map(r).join(`, `)}</span></div>
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
  </main>`;var u=e=>document.querySelector(e);u(`#form`).addEventListener(`submit`,e=>{e.preventDefault();let t=l({startText:u(`#start`).value,durationText:u(`#duration`).value,blocked:u(`#blocked`).checked}),n=u(`#result`);n.classList.remove(`result--hidden`),n.classList.toggle(`result--available`,t.available),n.classList.toggle(`result--unavailable`,!t.available),u(`#badge`).textContent=t.available?`Available`:`Unavailable`,u(`#message`).textContent=t.message,u(`#code`).textContent=`[${t.reasonCode}]`});