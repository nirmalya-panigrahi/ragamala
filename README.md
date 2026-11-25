# Astha prahar

![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest_%2B_RTL-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![Deploy](https://img.shields.io/badge/Deploy-GitHub_Pages-222222?style=flat-square&logo=github)

**Astha prahar** is an interactive 24-hour Hindustani classical raga clock and Ragamala miniature gallery. Inspired by the intimate lighting of a classical *baithak* recital, the stage shifts its warm radial illumination dynamically across dawn, morning, midday, afternoon, dusk, early night, midnight, and pre-dawn prahars while pairing each three-hour window with its corresponding raga profile, museum Ragamala folio, and transparent archival audio reference.

## Features

- **Live 24-Hour Prahar Dial**: Circular SVG clock segmented into all eight three-hour prahars (`04:00–07:00` through `01:00–04:00`), including clean overnight wrap-around (`22:00–01:00`), live local clock hand, keyboard-accessible segment selection, `Previous` / `Next` controls, and `Jump to Now`.
- **Dynamic Baithak Stage Atmosphere**: Subtle radial spotlight shifting from rose-gold dawn and warm brass midday to deep amber dusk and cool indigo-gold midnight.
- **Ragamala Miniature Framing**: Framed folio cards with double hairline gold borders, school/origin provenance, museum credit and license lines, and resilient `onError` fallbacks linking directly to Wikimedia Commons.
- **Transparent Archival Audio**: Renders native `<audio controls>` whenever `direct_audio_url` is present, and an explicit `"Direct stream not attached yet"` state with archival notes and verified external source links whenever `direct_audio_url` is `null`.
- **All 8 Prahars & Seasonal Ragas**: Compact 8-card overview grid plus a dedicated *Ritu Ragas* section for Monsoon (`Megh Malhar`) and Spring (`Basant`).

## Architecture

```mermaid
flowchart TD
    JSON["public/assets/aistudio/details_3be763b5.json"] --> Hook["usePraharData Hook"]
    Hook --> Parser["parsePraharDataset Validator"]
    Clock["useLiveClock Hook"] --> TimeUtils["timeUtils (Overnight & Dial Geometry)"]
    Parser --> App["App Stage Orchestrator"]
    TimeUtils --> App
    App --> Theme["themeUtils (Prahar Spotlight)"]
    App --> Dial["PraharDial (24h SVG Clock)"]
    App --> Stage["ActivePraharStage"]
    Stage --> Frame["RagamalaFrame (+ onError Commons Fallback)"]
    Stage --> Audio["AudioSection (Stream or Null-Safe Reference)"]
    App --> Grid["PraharGrid (8-Slot Overview)"]
    App --> Seasonal["SeasonalRagasSection (Ritu Ragas)"]
```

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server on port 3000:
   ```bash
   npm run dev
   ```
3. Run typechecking and automated tests:
   ```bash
   npm run lint
   npm test
   ```
4. Build for production:
   ```bash
   npm run build
   ```
