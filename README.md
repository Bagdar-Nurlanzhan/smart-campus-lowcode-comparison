# Smart Campus Room Availability Checker – code-based vs low-code (Practice #12)

One fictional room, one fixed booking, the same six acceptance criteria and the same eight test cases,
implemented twice. Fictional data only; nothing is booked or saved.

| Folder | Content |
|---|---|
| `docs/CONTRACT.md` | Shared requirement and acceptance-criteria sheet, decision order, messages, test inputs |
| `code-based/` | HTML + JavaScript (Vite). Rules in `src/availability.js` and `src/contract.js`, UI in `main.js`, tests in `tests/` |
| `low-code/SOURCE.md` | Power Apps canvas app: controls and all Power Fx formulas |
| `screens/` | Screenshots of both implementations and their test results |
| `evidence/` | Test output and the time log |

## Run the code-based version
```bash
cd code-based
npm install
npm test     # 12 tests: T1–T8 plus 4 extra checks
npm run dev
```

## Export
`low-code/export/` holds the exported app (`.msapp`), its YAML source (`App.pa.yaml`, `Screen1.pa.yaml`) and the App checker result.

## Live demo (code-based)
https://bagdar-nurlanzhan.github.io/smart-campus-lowcode-comparison/
