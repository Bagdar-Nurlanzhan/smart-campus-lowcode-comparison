// The eight common test cases of docs/CONTRACT.md (T1–T8) plus input-validation checks (AC6).
import { describe, it, expect } from 'vitest'
import { evaluate, ROOM } from '../src/contract.js'

const run = (startText, durationText, blocked = false) => evaluate({ startText, durationText, blocked })

const CASES = [
  ['T1 valid free interval', '12:00', '60', false, true, 'OK'],
  ['T2 overlap', '10:30', '60', false, false, 'OVERLAP'],
  ['T3 blocked room', '12:00', '60', true, false, 'BLOCKED'],
  ['T4 duration 0', '12:00', '0', false, false, 'INVALID_DURATION'],
  ['T5 duration 121', '12:00', '121', false, false, 'INVALID_DURATION'],
  ['T6 past start', '08:00', '60', false, false, 'PAST_START'],
  ['T7 adjacent interval', '11:00', '60', false, true, 'OK'],
]

describe('common contract', () => {
  for (const [name, start, duration, blocked, available, reasonCode] of CASES) {
    it(name, () => {
      expect(run(start, duration, blocked)).toMatchObject({ available, reasonCode })
    })
  }
  it('T8 booking data unchanged after all checks', () => {
    for (const [, start, duration, blocked] of CASES) run(start, duration, blocked)
    expect(ROOM.bookings).toEqual([[600, 660]])
    expect(Object.isFrozen(ROOM.bookings)).toBe(true)
  })
})

describe('extra checks (not part of the 8)', () => {
  it('AC6: invalid input gives INVALID_INPUT', () => {
    for (const [s, d] of [['', ''], ['25:00', '60'], ['12:00', 'abc'], ['<img src=x>', '60'], ['12:00', '1.5']]) {
      expect(run(s, d).reasonCode).toBe('INVALID_INPUT')
    }
  })
  it('AC2 boundary: exactly 120 minutes is available', () => {
    expect(run('12:00', '120').reasonCode).toBe('OK')
  })
  it('end after 24:00 is OUT_OF_DAY', () => {
    expect(run('23:30', '60').reasonCode).toBe('OUT_OF_DAY')
  })
  it('start equal to the current time is PAST_START', () => {
    expect(run('09:00', '30').reasonCode).toBe('PAST_START')
  })
})
