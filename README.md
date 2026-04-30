# 🌱 EcoScan – Smart Sustainability Analyzer

EcoScan is a full-stack web application that analyzes the **environmental impact of products** and helps users make **eco-friendly decisions**. It calculates carbon footprint, energy usage, water consumption, and sustainability scores while providing intelligent insights, comparisons, and recommendations.

---

## 🚀 Project Overview

EcoScan is designed as a **decision-support system** for sustainable product analysis. Users can input or scan product data, analyze environmental impact, track history, and improve their eco-footprint through **gamification and smart recommendations**.

---

## 🧠 Key Features

### 🌍 1. Product Sustainability Analysis

* Analyze products based on:

  * Carbon Footprint 🌫️
  * Energy Consumption ⚡
  * Water Usage 💧
  * Transport Impact 🚚
  * Recycling Efficiency ♻️
* Generates a **Sustainability Index Score**

---

### 📊 2. Data Visualization & Insights

* Interactive charts:

  * Impact Distribution Graphs
  * Historical Trend Analysis
* Compare multiple products side-by-side

---

### 📜 3. Report History & Export

* Stores user analysis history
* Export reports for academic or business use

---

### 🔐 4. Authentication System

* Secure login/signup
* User profile management

---

## 🎮 5. Gamification (User Engagement System)

EcoScan integrates gamification to encourage sustainable behavior:

### 🏆 Eco Points System

* Users earn points based on sustainability score:

  * High score → More points
  * Low score → Improvement suggestions

### 🎖️ Badges & Achievements

* 🌱 Beginner – First product analyzed
* ♻️ Eco Warrior – High recycling score
* 🚚 Smart Transport – Low transport emissions

### 📊 Leaderboard

* Users ranked based on Eco Points
* Encourages competition for sustainability

### 🎯 Challenges

* Daily/weekly eco goals:

  * Analyze eco-friendly products
  * Reduce carbon footprint

---

## 📷 6. Product Scanning (Smart Input System)

EcoScan supports advanced product input methods:

### 📦 Barcode Scanning

* Scan product barcode using camera
* Auto-fetch product details from database/API

### 🤖 Smart Suggestions

* Auto-fill:

  * Material type
  * Transport estimates
  * Energy usage

### 🧠 AI-Based Detection (Future Scope)

* Image recognition for:

  * Packaging type
  * Material classification

---

## 💡 7. Recommendation Engine

After analysis, EcoScan provides actionable insights:

* Suggest eco-friendly alternatives
* Optimize:

  * Materials
  * Transport methods
  * Packaging
* Example:

  > “Switch to recycled material to reduce carbon footprint by 30%”

---

## 🏗️ System Architecture

### 🔙 Backend (Spring Boot)

* Controllers → Handle API requests
* Services → Business logic (carbon, energy, water, etc.)
* Repositories → Database operations
* Entities → Data models

#### Core Services:

* CarbonCalculationService
* EnergyConsumptionService
* WaterFootprintService
* TransportImpactService
* RecyclingImpactService
* SustainabilityIndexService
* SDGImpactService

---

### 🎨 Frontend (React + Vite)

* Modular component-based architecture
* Custom hooks for logic separation
* Pages for routing

#### Key Components:

* Product Analyzer
* Impact Charts
* Comparison Dashboard
* Report History

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* JavaScript
* CSS

### Backend

* Java Spring Boot
* REST APIs

### Database

* PostgreSQL

### Tools & Libraries

* JWT Authentication
* Chart libraries for visualization
* Barcode scanning (planned integration)

---

## 📂 Project Structure

### Frontend

```
ecoscan_frontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
```

### Backend

```
ecoscan_backend/
├── controllers/
├── services/
├── repositories/
├── entities/
├── dtos/
```

---

## ⚙️ Installation & Setup

### 🔧 Backend Setup

```bash
cd ecoscan_backend
mvn clean install
mvn spring-boot:run
```

### 🎨 Frontend Setup

```bash
cd ecoscan_frontend
npm install
npm run dev
```

---

## 📈 Future Enhancements

* AI-powered product recognition
* Real-time carbon factor APIs
* Mobile app version
* Advanced analytics dashboard
* IoT integration for real-world tracking

---

## 🎯 Use Cases

* Students & Researchers
* Sustainable product designers
* Manufacturing companies
* Environmental analysts

---

## 👨‍💻 Author

**Shriniwas Mare**
Diploma in Computer Engineering
Government Polytechnic Pune

---

## 🌍 Vision

EcoScan aims to promote **sustainable living** by making environmental impact analysis **simple, interactive, and engaging**.

> “Scan. Analyze. Improve. Sustain.” 🌱

---
