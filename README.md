# 🌍 EcoScan

EcoScan is a full-stack sustainability analysis platform that evaluates products based on environmental impact.

## 🚀 Features
- Carbon Footprint Calculation
- Water & Energy Analysis
- Transport Emissions
- Recycling Score
- SDG Impact Mapping
- Overall Sustainability Index

## 🧱 Tech Stack
- Backend: Spring Boot (Java)
- Frontend: React (Vite)
- Database: PostgreSQL

## 🔗 API Example
POST /api/products/analyze

## 📁 Frontend "where to add" map

- `ecoscan_frontend/src/api/productApi.jsx`
  - `analyzeProduct(product)`
  - `fetchProductHistory(limit)`
  - `fetchProductReportById(id)`
- `ecoscan_frontend/src/hooks/useProductAnalyzer.js`
  - form validation + typed payload conversion + analyzer/history state
- `ecoscan_frontend/src/pages/HomePage.jsx`
- `ecoscan_frontend/src/pages/AnalyzerPage.jsx`
- `ecoscan_frontend/src/pages/AboutPage.jsx`
- `ecoscan_frontend/src/components/layout/Navbar.jsx`
- `ecoscan_frontend/src/components/layout/PageContainer.jsx`
- `ecoscan_frontend/src/components/analyzer/ProductForm.jsx`
- `ecoscan_frontend/src/components/analyzer/ResultsPanel.jsx`
- `ecoscan_frontend/src/components/analyzer/ReportHistory.jsx`
- `ecoscan_frontend/src/components/analyzer/ImpactChart.jsx`
- `ecoscan_frontend/src/utils/exportReport.js`
- Routing entry points:
  - `ecoscan_frontend/src/main.jsx`
  - `ecoscan_frontend/src/App.jsx`

## 🗃️ DB-backed history endpoints

- `POST /ecoscan/api/products/analyze`
- `GET /ecoscan/api/products/history?limit=30`
- `GET /ecoscan/api/products/{productId}/report`

## 📊 Future Enhancements
- Product Comparison
- Dashboard Visualization
- React Native Mobile App
