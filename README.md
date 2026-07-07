<div align="center">

# 🐸 Pepega GO

### *Catch · Battle · Evolve*

A mobile location-based game inspired by Pokémon GO, where you catch **Pepegas** in the real world, battle in Gyms, complete quests, and evolve your pets.

Built with **React 19 + Vite** · Runs directly in the browser · Installable as a **PWA**

---

[Quick Start](#-quick-start) · [How to Play](#-how-to-play) · [Features](#-key-features) · [Architecture](#-project-architecture)

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Pokedex — Pepega Types](#-pokedex--pepega-types)
- [Game Mechanics](#-game-mechanics)
- [How to Play](#-how-to-play)
- [Technologies](#-technologies)
- [Project Architecture](#-project-architecture)
- [Quick Start](#-quick-start)
- [Scripts](#-scripts)
- [APIs & External Services](#-apis--external-services)
- [License](#-license)

---

## 🎯 About the Project

**Pepega GO** is a fully functional mobile web game that utilizes your device's GPS and camera. You explore the real world, find and catch various Pepegas, spin Pepe-stops to gather resources, battle bosses in Gyms, and complete daily quests.

All data is stored locally in `localStorage` — no accounts or servers are required. It supports up to **5 profiles** on a single device with complete data isolation.

---

## 🚀 Key Features

### 🗺️ Interactive Map
- Real-world map powered by **Leaflet + OpenStreetMap**
- Automatic GPS coordinate detection and tracking
- Pepegas, Pepe-stops, and Gyms spawn around your location
- HUD with profile, level, XP bar, coins, and current weather

### 🎯 Catching System (AR Camera)
- Catch screen using your device's **live rear camera**
- Three types of balls: Pokeball, Greatball, Ultraball — each with different catch multipliers
- Ball throwing, shaking, and escaping animations
- Swipe up or click to throw
- Catch chance depends on the **Pepega type**, **CP**, and **ball type**

### 🔵 Pepe-stops
- **8 locations** randomly generated around you upon first launch
- Interaction radius: **50 meters**
- Cooldown: **3 minutes**
- Drops: Pokeballs, coins, materials (iron, chips, berries), and eggs (30% chance)

### ⚔️ Gyms (Arenas)
- **4 Gyms** featuring random bosses of different types
- Interaction radius: **80 meters**
- Cooldown: **24 hours**
- Two battle modes:
  - **Auto-battle** — select a Pepega, and the battle proceeds automatically with hit animations and HP bars
  - **AR Raid** — timed tap battle (30 sec), tap the boss through the camera!
- **Type System**: Water > Fire > Normal, Gold hits the hardest

### 🧬 Evolution
- Normal → Fire (25 candies) → Gold (50 candies)
- Cinematic evolution animation featuring phases: flash → transformation → appearance
- CP increases by **1.8x** upon evolution

### 🥚 Eggs and Incubator
- Egg distances available: **1 km**, **2 km**, and **5 km**
- Place an egg in the incubator and **walk in the real world**
- When the distance is covered, a random Pepega hatches with a **1.5x CP** bonus
- The incubator can be crafted in the **Workbench**

### 📜 Daily Quests
- **3 random quests** each day from the pool:
  - Catch N Pepegas
  - Catch a Fire Pepega
  - Spin N Pepe-stops
  - Walk N meters
  - Defeat a Gym
  - Evolve a Pepega
- Rewards: coins, balls
- Reset at **midnight**

### 🔨 Workbench (Crafting)
- Craft items from materials dropped by Pepe-stops:
  - 🔴 **Pokeball**: 3 berries
  - 🔵 **Greatball**: 2 berries + 1 iron
  - ⚫ **Ultraball**: 1 berry + 2 iron + 1 chip
  - 🥚 **Incubator**: 5 iron + 3 chips

### 🏪 Shop
- Buy balls using in-game coins:
  - Pokeball: 10 coins (×1.0)
  - Greatball: 50 coins (×1.5)
  - Ultraball: 150 coins (×2.0)

### ❤️ Buddy System
- Choose any Pepega as your "Buddy" — your companion
- For every **200 meters** walked, the Buddy finds **+1 candy** of its type
- Progress is displayed directly on the map

### 🏆 Leaderboard
- Your ranking among simulated opponents
- Sorted by level and total CP
- Displays the faction of each player

### ⚔️ Factions (Teams)
Unlocked at **level 5**. Your choice affects your profile color and team representation on the leaderboard:

| Faction | Emoji | Philosophy |
|---------|-------|------------|
| **Team GigaChad** | 🔴 | Power and strength. For true champions. |
| **Team Sadge** | 🔵 | Wisdom and tactics. For smart trainers. |
| **Team MonkaS** | 🟢 | Balance and nature. For true wanderers. |

### 🌦️ Dynamic Weather
Real-world weather affects Pepega spawns:

| Weather | Effect |
|---------|--------|
| ☀️ Clear | Fire ×1.5, Gold ×1.3 |
| 🌧 Rain | Water ×1.7 |
| ⛈ Thunderstorm | Elite spawns |
| ❄️ Snow | Reduced spawn rate |
| ☁️ Cloudy | No effect |

### 👤 Multi-Profile System
- Up to **5 profiles** on a single device
- Isolated data: inventory, progress, pokestops, gyms, quests
- Choose an avatar from 10 emojis (🐸🔥💧⭐👾🦊🐉🌊⚡🎮)
- Nickname length from 3 to 16 characters
- Displays last login time

### 🔊 Sound Effects
Immersive gameplay with audio cues:
- 🎯 Catch
- 💨 Escape
- 🏐 Ball throw
- 🏆 Victory
- ✨ Evolution
- 📜 Quest completion

---

## 📦 Pokedex — Pepega Types

| Sprite | Type | Spawn Chance | XP | Base Catch Rate | Evolution |
|--------|------|:-:|:-:|:-:|-----------|
| 🟢 | **Normal Pepega** | 60% | 100 | 80% | → Fire (25 🍬) |
| 🔵 | **Water Pepega** | 25% | 150 | 60% | — |
| 🔴 | **Fire Pepega** | 10% | 200 | 50% | → Gold (50 🍬) |
| 🟡 | **Gold Pepega** | 5% | 500 | 20% | — (Final form) |

> **CP (Combat Power)** is randomly generated and depends on the player's level. Each Pepega also gets a random weight and height.

---

## 🎮 How to Play

1. **Create a profile** — choose an avatar and enter a nickname
2. **Allow Geolocation** — the game will detect your location and generate the world around you
3. **Catch Pepegas** — tap on a Pepega on the map → select a ball → swipe up or click to throw
4. **Spin Pepe-stops** — approach within 50m and gather resources
5. **Battle in Gyms** — approach within 80m, select a fighter, and battle the boss
6. **Evolve** — collect candies and evolve your Pepegas
7. **Craft** — create balls and incubators using materials
8. **Complete Quests** — daily tasks provide bonus rewards
9. **Assign a Buddy** — choose a companion to find candies while walking
10. **Reach Level 5** — choose a faction and compete on the leaderboard!

---

## 🛠 Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19 | UI framework |
| **Vite** | 8 | Bundler and dev server |
| **Tailwind CSS** | 4 | Utility-first CSS framework |
| **Leaflet** | 1.9 | Interactive maps |
| **React-Leaflet** | 5 | React wrapper for Leaflet |
| **Lucide React** | 1.23 | Icons |
| **Oxlint** | 1.71 | Linter |
| **Vite Plugin PWA** | 1.3 | Progressive Web App integration |
| **Google Fonts** | — | **Outfit** font (300–900) |

---

## 📁 Project Architecture

```
PepegaGo/
├── public/                     # Static assets
│   ├── favicon.svg             # Application icon
│   ├── icons.svg               # SVG icon sprites
│   ├── pepega.png              # Normal Pepega
│   ├── pepega_water.png        # Water Pepega
│   ├── pepega_fire.png         # Fire Pepega
│   └── pepega_gold.png         # Gold Pepega
│
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Main component (746 lines)
│   │                             Contains all game logic, state, and navigation
│   ├── constants.js            # Pepega types, items, quests, and utilities
│   ├── index.css               # Global styles
│   ├── App.css                 # Application styles
│   │
│   ├── components/
│   │   ├── LoginScreen.jsx     # Login / Profile creation screen
│   │   ├── MapView.jsx         # Map with HUD, markers, and navigation
│   │   ├── CatchScreen.jsx     # Catch screen (AR Camera)
│   │   ├── PokestopScreen.jsx  # Pepe-stop screen
│   │   ├── GymScreen.jsx       # Gym screen (Auto-battle)
│   │   ├── RaidScreen.jsx      # AR Raid (Tap battle)
│   │   ├── Inventory.jsx       # Backpack (Pokedex, items, eggs, buddy)
│   │   ├── PepegaDetails.jsx   # Detailed Pepega card
│   │   ├── EvolutionScreen.jsx # Evolution animation
│   │   ├── Shop.jsx            # Ball shop
│   │   ├── Workshop.jsx        # Workbench (Crafting)
│   │   ├── QuestScreen.jsx     # Daily quests
│   │   ├── LeaderboardScreen.jsx # Leaderboard
│   │   ├── TeamSelect.jsx      # Faction selection
│   │   └── Toast.jsx           # Pop-up notifications
│   │
│   ├── utils/
│   │   └── sounds.js           # Sound effects (Web Audio API)
│   │
│   └── assets/
│       ├── hero.png
│       ├── react.svg
│       └── vite.svg
│
├── index.html                  # HTML entry point (Outfit font)
├── vite.config.js              # Vite configuration (React + Tailwind)
├── package.json                # Dependencies and scripts
└── .oxlintrc.json              # Linter configuration
```

### State Management

The application uses **React useState/useEffect** without external state managers. All state is centralized in `App.jsx`:

| State | Description |
|-------|-------------|
| `activeProfile` | Current user profile |
| `inventory` | Pepegas, balls, candies, eggs, incubator, materials |
| `profile` | Level, XP, coins, team, buddy |
| `pepegas` | Wild Pepegas on the map |
| `pokestops` | Array of Pepe-stops |
| `gyms` | Array of Gyms with bosses |
| `weather` | Current weather (from Open-Meteo API) |
| `questState` | Daily quests with progress tracking |

### Data Storage

All data is persisted via `localStorage` with profile isolation:

```
pepegaProfiles          → List of all profiles
pepega_{id}_inventory   → Inventory for a specific profile
pepega_{id}_profile     → Progress for a specific profile
pepega_{id}_pokestops   → Pokestops for a specific profile
pepega_{id}_gyms        → Gyms for a specific profile
pepega_{id}_quests      → Quests for a specific profile
```

---

## ⚡ Quick Start

### Requirements

- **Node.js** (v18+)
- **npm** or **yarn**
- Browser with **Geolocation API** and **Camera API** support

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/PepegaGo.git
cd PepegaGo

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

> ⚠️ **Important**: For GPS and camera to function correctly, the app must be served over **HTTPS** or accessed via `localhost`. If needed, use `vite --host` to access it from a mobile device on your local network.

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |
| `npm run lint` | Run linter via Oxlint |

---

## 🌐 APIs & External Services

| Service | Usage |
|---------|-------|
| [Open-Meteo](https://open-meteo.com/) | Get current weather by coordinates (free, no API key required) |
| [OpenStreetMap](https://www.openstreetmap.org/) | Map tiles via Leaflet |
| [Google Fonts](https://fonts.google.com/) | Outfit font |
| [leaflet-color-markers](https://github.com/pointhi/leaflet-color-markers) | Colored map markers |

---

## 📄 License

This project was created for educational and entertainment purposes by Nanda.

---

<div align="center">

**Made with 🐸 and ❤️**

*Pepega GO v0.1.0*

</div>
