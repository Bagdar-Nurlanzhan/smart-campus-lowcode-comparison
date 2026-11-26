// Pure booking-rule helpers and availability logic for the Smart Campus
// Room Availability Checker. No DOM or CSS side effects — safe to import
// from tests. See AGENTS.md for AC1–AC6.

// AC1: start time format 00:00–23:59 (24:00 is not a valid start)
export const TIME_RE = /^([01]?\d|2[0-3]):([0-5]\d)$/

// AC1: end time format 00:00–24:00 (end only). Anchored so every branch
// is bound by ^ and $ — the previous unanchored alternation let strings
// such as "1:00xyz" or "xyz24:00" pass validation.
export const END_TIME_RE = /^(([01]?\d|2[0-3]):[0-5]\d|24:00)$/

// Convert "HH:MM" into minutes after midnight.
export const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

// Convert minutes after midnight into zero-padded "HH:MM".
export const toHHMM = (mins) => {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// Format a [start, end] minute pair as "HH:MM–HH:MM".
export const formatRange = ([s, e]) => `${toHHMM(s)}–${toHHMM(e)}`

// Returns { available: boolean, reason: string|null }.
// Pure: never mutates `bookings` (AC5/AC6).
function checkAvailability(start, end, blocked, currentTime, bookings, roomName = '(unspecified)') {
  // AC3: blocked room is always rejected — reported first so every request
  // clearly explains the room is blocked.
  if (blocked) {
    return { available: false, reason: `Room ${roomName} is currently blocked and cannot be used.` }
  }
  // AC1: bounds and ordering
  if (!(0 <= start && start < end && end <= 1440)) {
    return { available: false, reason: 'Start must be earlier than end, and both within 00:00–24:00.' }
  }
  // AC1: start strictly later than current time
  if (!(start > currentTime)) {
    return { available: false, reason: `Start time must be strictly later than the current time (${toHHMM(currentTime)}).` }
  }
  // AC2: duration max 120 minutes
  const duration = end - start
  if (duration > 120) {
    return { available: false, reason: `Requested duration is ${duration} minutes, which exceeds the 120-minute maximum.` }
  }
  // AC4: overlap check (touching endpoints do NOT overlap)
  for (const [bs, be] of bookings) {
    if (start < be && end > bs) {
      return { available: false, reason: `Overlaps an existing booking (${formatRange([bs, be])}).` }
    }
  }
  return { available: true, reason: null }
}

export { checkAvailability }
