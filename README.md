# 🧬 ArkHelix
> A web-based breeding & mutation manager for **ARK: Survival Ascended**

ArkHelix is a full-stack web application designed to help breeders **track tames, mutations, lineages, and breeding plans** — with optional **automatic import from a dedicated ARK server**.

Built for serious breeders. No spreadsheets. No guessing.

---

## ✨ Features

- 📊 Track all tamed creatures (stats, mutations, lineage)
- 🧬 Automatic mutation & breeding calculations
- 🧠 Best-pair recommendations for target stats
- 🔄 Auto-import from ARK dedicated servers (plugin or save parsing)
- 📁 Tribe-based organization
- 📤 Export breeding plans (PDF / CSV)
- ⚡ Fast recalculations with caching

---

## 🏗 Architecture Overview

```mermaid
flowchart TB
  subgraph Client[Client]
    U[Player / Breeder] --> FE[Web App (Next.js)]
  end

  subgraph Backend[Backend]
    BE[API Server]
    AUTH[Auth]
    CALC[Breeding Engine]
    SYNC[Import / Sync Service]
  end

  subgraph Data[Data Layer]
    DB[(Postgres)]
    CACHE[(Redis)]
  end

  subgraph ArkServer[ARK Dedicated Server]
    GS[Game Server]
    PLUG[Plugin / Export]
    SAVE[(Save Files)]
  end

  FE --> BE
  BE --> AUTH
  BE --> CALC
  BE --> DB
  BE --> CACHE

  GS --> PLUG --> SYNC
  SAVE --> SYNC
  SYNC --> DB
  SYNC --> CACHE
```