# 🥝 Kiwi General Insurance - Day 0 Scalable CMS

This is a production-grade Strapi v5 Headless CMS architecture, trimmed to Day 0 primitives for maximum speed and infinite scalability.

## 🚀 Architectural Pillars

- **Structural Primitives:** Consistently using generic components (`Banner`, `Accordion`) to handle specialized use cases (`App Promo`, `Grievance Levels`) via Enums.
- **Unified Registries:** Single Source of Truth (SSOT) for Products, Testimonials, and Authors.
- **Atomic Reusability:** Implementation of the **Shared Section Reference** pattern for global block mirroring.
- **Master Data Saturation:** 100% realistic industry data for Motor, Health, and Home insurance sectors.

## 🛠️ Quick Start

### 1. Installation
```bash
npm install
```

### 2. Master Data Seed (Website Ready)
Populate the CMS with exhaustive industry data:
```bash
npm run seed:kiwi
```

### 3. Development
```bash
npm run dev
```

## 📚 Technical Handover

- **[CMS Master Guide](./CMS_GUIDE.md):** The definitive manual for every field and linking logic.
- **[Postman Collection](./postman/kiwi-insurance-api.postman_collection.json):** Architect-level API requests with deep population.
- **[Architecture Blueprint](./cms_architecture_file.md):** Deep analysis of why this structure wins against competitors.

---
*Optimized for Kiwi General Insurance Limited – Simple. Smart. Digital.*
