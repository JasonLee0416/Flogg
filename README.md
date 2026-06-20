# Flogg — Receipt Workflow Prototype

> **Project status: experimental predecessor to
> [Routelo v2](https://github.com/JasonLee0416/Routelo.version_2).**

Flogg is a React Native prototype created to test whether delivery drivers
could turn paper flower-delivery receipts into searchable mobile records with
minimal manual entry.

It focused on the part the original
[Routelo prototype](https://github.com/JasonLee0416/Routelo) did not address:
capturing operational data before route planning begins.

## Problem Explored

Flower-delivery receipts contain useful information—destination, ordering
store, product details, and ribbon text—but that information is commonly
handled as paper or photographs. Flogg tested a mobile workflow for:

1. capturing one or multiple receipt images;
2. extracting structured fields with a multimodal API;
3. reviewing and editing the result;
4. storing the record locally for later search and history views.

## Implemented Prototype

- Camera capture with single and batch modes
- Image resizing before analysis
- GPT-4o and Gemini extraction adapters
- SQLite receipt persistence and CRUD operations
- Date-grouped receipt history
- Search across stored receipt fields
- Korean and English UI strings
- Dark mode and capture preferences

## Technical Structure

```text
flogg-github/
├─ src/screens/          capture, dashboard, history, detail, settings
├─ src/services/         multimodal extraction adapters
├─ src/database/         SQLite schema and CRUD
├─ src/context/          settings and database state
└─ src/i18n/             Korean and English strings
```

**Stack:** Expo SDK 52, React Native, JavaScript, Expo Camera, Expo SQLite,
React Navigation, AsyncStorage.

## What This Experiment Taught

Flogg validated the end-to-end interaction, but it also exposed architectural
problems that shaped Routelo v2:

- API keys must not be embedded in a distributed mobile client.
- A model response is not trustworthy enough to save without field review.
- Raw OCR evidence, normalized values, and unmatched text should be preserved
  separately.
- Confidence should be tracked per field, not only per document.
- Receipt capture becomes more valuable when connected to deadlines, route
  planning, and delivery completion.

## How It Evolved Into Routelo v2

| Flogg experiment | Routelo v2 direction |
|---|---|
| Cloud multimodal extraction | On-device-first OCR with selective fallback |
| Direct JSON field parsing | Schema, aliases, candidates, and confidence |
| Receipt history | Delivery operations dashboard |
| SQLite CRUD prototype | Local-first record architecture |
| Receipt capture only | OCR → review → delivery → route workflow |

See the current integrated project:
[Routelo v2](https://github.com/JasonLee0416/Routelo.version_2).

## Running the Historical Prototype

```bash
cd flogg-github
npm install
npm start
```

The extraction adapters require provider credentials. Do not place production
API keys in a client build; use this repository only as a prototype reference.

## License

[MIT](LICENSE)
