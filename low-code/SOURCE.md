# Low-code implementation – Power Apps canvas app (phone layout)

App name: **Smart Campus Availability (low-code)**. Built by hand in Power Apps Studio (no data sources, no connectors,
not shared). The formulas below are the ones entered in the app. The studio UI language is Russian, so `;` separates
arguments and `;;` separates statements.

## Controls
| Control | Name | Setting |
|---|---|---|
| Label | Label1 | header; formula below; X 40, Y 40, 560×70 |
| Text input | TextInput1 | default empty, hint "Start HH:MM" |
| Text input | TextInput2 | default empty, hint "Duration minutes" |
| Check box | Checkbox1 | text "Room is blocked" |
| Button | Button1 | text "Check availability"; OnSelect below |
| Label | Label2 | result; formula below; X 60, Y 670, 560×360 |

## App.Formulas (read-only booking data)
```
nfBookings = Table({StartMin: 600; EndMin: 660});;
```

## Label1.Text
```
"Smart Campus A-204 (low-code). Time 09:00. Bookings: " & Concat(nfBookings; Text(RoundDown(StartMin / 60; 0); "00") & ":" & Text(Mod(StartMin; 60); "00") & "-" & Text(RoundDown(EndMin / 60; 0); "00") & ":" & Text(Mod(EndMin; 60); "00"))
```

## Button1.OnSelect (validation and availability rules)
```
Set(varStart; Trim(TextInput1.Text));; Set(varDurText; Trim(TextInput2.Text));; Set(varValid; IsMatch(varStart; "([01]?[0-9]|2[0-3]):[0-5][0-9]") && IsMatch(varDurText; "-?[0-9]+"));; Set(varS; If(varValid; Value(Left(varStart; Find(":"; varStart) - 1)) * 60 + Value(Right(varStart; 2)); 0));; Set(varD; If(varValid; Value(varDurText); 0));; Set(varE; varS + varD);; Set(varHit; First(Filter(nfBookings; varS < EndMin && varE > StartMin)));; Set(varCode; If(!varValid; "INVALID_INPUT"; Checkbox1.Value; "BLOCKED"; varD <= 0; "INVALID_DURATION"; varE > 1440; "OUT_OF_DAY"; varS <= 540; "PAST_START"; varD > 120; "INVALID_DURATION"; !IsBlank(varHit); "OVERLAP"; "OK"))
```

## Label2.Text (display only)
```
If(IsBlank(varCode); ""; If(varCode = "OK"; "Available"; "Unavailable") & Char(10) & Switch(varCode; "INVALID_INPUT"; "Enter a start time as HH:MM and a duration in whole minutes."; "BLOCKED"; "Room A-204 is blocked and cannot be used."; "INVALID_DURATION"; "Duration must be between 1 and 120 minutes."; "OUT_OF_DAY"; "The booking must end by 24:00."; "PAST_START"; "Start time must be later than the current time (09:00)."; "OVERLAP"; "Overlaps an existing booking (" & Text(RoundDown(varHit.StartMin / 60; 0); "00") & ":" & Text(Mod(varHit.StartMin; 60); "00") & "–" & Text(RoundDown(varHit.EndMin / 60; 0); "00") & ":" & Text(Mod(varHit.EndMin; 60); "00") & ")."; "Available: room A-204 is free from " & Text(RoundDown(varS / 60; 0); "00") & ":" & Text(Mod(varS; 60); "00") & " to " & Text(RoundDown(varE / 60; 0); "00") & ":" & Text(Mod(varE; 60); "00") & ".") & Char(10) & "[" & varCode & "]")
```

## Known gaps compared with the code-based version
- The two inputs have no accessible label (Power Apps App checker: 2 accessibility errors, 1 tip about the screen name).
- No maximum length is set on the inputs (the code-based version limits them to 5 and 4 characters); the format check still rejects invalid text.
- The header shows the booking with a plain hyphen.
- No automated tests: the eight cases were executed by hand in Power Apps preview.
