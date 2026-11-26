// Shared contract layer (docs/CONTRACT.md): validation + reason codes on top of the
// UNCHANGED rule engine in availability.js. Pure: no DOM, never mutates data.
import { checkAvailability, TIME_RE, toMinutes, toHHMM, formatRange } from './availability.js'

export const ROOM = Object.freeze({
  name: 'A-204',
  currentTime: 540, // 09:00
  bookings: Object.freeze([Object.freeze([600, 660])]), // 10:00–11:00
})

// 1) Input validation only.
export function parseRequest(startText, durationText) {
  const start = String(startText ?? '').trim()
  const duration = String(durationText ?? '').trim()
  if (!TIME_RE.test(start) || !/^-?\d+$/.test(duration)) return { ok: false }
  return { ok: true, start: toMinutes(start), duration: Number(duration) }
}

// Which rule rejected the request (same order as checkAvailability).
function rejectionCode(start, end, blocked, room) {
  if (blocked) return 'BLOCKED'
  if (end <= start) return 'INVALID_DURATION'
  if (end > 1440) return 'OUT_OF_DAY'
  if (start <= room.currentTime) return 'PAST_START'
  if (end - start > 120) return 'INVALID_DURATION'
  return 'OVERLAP'
}

function message(code, { start, end, room }) {
  switch (code) {
    case 'OK': return `Available: room ${room.name} is free from ${toHHMM(start)} to ${toHHMM(end)}.`
    case 'INVALID_INPUT': return 'Enter a start time as HH:MM and a duration in whole minutes.'
    case 'BLOCKED': return `Room ${room.name} is blocked and cannot be used.`
    case 'INVALID_DURATION': return 'Duration must be between 1 and 120 minutes.'
    case 'OUT_OF_DAY': return 'The booking must end by 24:00.'
    case 'PAST_START': return `Start time must be later than the current time (${toHHMM(room.currentTime)}).`
    default: {
      const hit = room.bookings.find(([s, e]) => start < e && end > s)
      return `Overlaps an existing booking (${formatRange(hit)}).`
    }
  }
}

// 2) Availability calculation: returns { available, reasonCode, message }.
export function evaluate({ startText, durationText, blocked }, room = ROOM) {
  const req = parseRequest(startText, durationText)
  if (!req.ok) return { available: false, reasonCode: 'INVALID_INPUT', message: message('INVALID_INPUT', { room }) }
  const start = req.start
  const end = start + req.duration
  const { available } = checkAvailability(start, end, blocked, room.currentTime, room.bookings, room.name)
  const reasonCode = available ? 'OK' : rejectionCode(start, end, blocked, room)
  return { available, reasonCode, message: message(reasonCode, { start, end, room }) }
}
