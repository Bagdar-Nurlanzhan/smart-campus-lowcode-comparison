# Shared requirement sheet (used by BOTH implementations)

## User story
As a student, I want to enter a start time and a duration for one campus room so that I can see whether the room is
Available or Unavailable and understand why, without changing any booking.

## Acceptance criteria
- AC1: Start time must be in the future.
- AC2: Duration must be greater than zero and at most 120 minutes.
- AC3: Overlapping bookings are unavailable (touching endpoints do not overlap).
- AC4: A blocked room is unavailable.
- AC5: Display a clear decision without changing existing bookings.
- AC6: Invalid input receives understandable feedback.

## Fixed data (fictional)
Room A-204 · current time 09:00 · existing bookings: 10:00–11:00 · blocked flag: off by default.

## Inputs
| Name | Type |
|---|---|
| start time | text `HH:MM` (00:00–23:59) |
| duration | whole number of minutes |
| blocked | on / off |

## Outputs
`available` (true/false), `reasonCode`, visible `message`.

## Decision order and messages
| # | Condition | reasonCode | message |
|---|---|---|---|
| 1 | start is not HH:MM, or duration is not a whole number | INVALID_INPUT | Enter a start time as HH:MM and a duration in whole minutes. |
| 2 | room is blocked | BLOCKED | Room A-204 is blocked and cannot be used. |
| 3 | duration <= 0 | INVALID_DURATION | Duration must be between 1 and 120 minutes. |
| 4 | start + duration > 24:00 | OUT_OF_DAY | The booking must end by 24:00. |
| 5 | start <= current time | PAST_START | Start time must be later than the current time (09:00). |
| 6 | duration > 120 | INVALID_DURATION | Duration must be between 1 and 120 minutes. |
| 7 | start < booking end AND end > booking start | OVERLAP | Overlaps an existing booking (10:00–11:00). |
| 8 | otherwise | OK | Available: room A-204 is free from HH:MM to HH:MM. |

The order 2–7 is the order of the existing JavaScript rule engine from earlier practices; it was not changed.

## Common test inputs (prepared before implementation)
| ID | start | duration | blocked | expected available | expected reasonCode |
|---|---|---|---|---|---|
| T1 | 12:00 | 60 | off | true | OK |
| T2 | 10:30 | 60 | off | false | OVERLAP |
| T3 | 12:00 | 60 | on | false | BLOCKED |
| T4 | 12:00 | 0 | off | false | INVALID_DURATION |
| T5 | 12:00 | 121 | off | false | INVALID_DURATION |
| T6 | 08:00 | 60 | off | false | PAST_START |
| T7 | 11:00 | 60 | off | true | OK |
| T8 | after T1–T7 | – | – | bookings still exactly 10:00–11:00 | – |
