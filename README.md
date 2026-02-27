# 🥝 Kiwi General Insurance Limited - Enterprise CMS

This is a production-ready Strapi v5 Headless CMS architecture tailored for the Indian D2C Insurance sector. It is designed for maximum scalability, SEO performance, and regulatory compliance (IRDAI).

## 🚀 Key Architectural Features

- **Unified Product Registry (SSOT):** A single source of truth for all insurance products (Car, Health, Home) with built-in support for IRDAI-mandated "Standard Products" (e.g., Arogya Sanjeevani) using `isStandard` flags and compliance fields.
- **Atomic Reusability:** Implementation of the **Shared Section Reference** pattern. Build high-conversion UI blocks once and reuse them across any page or article with a single click.
- **Advanced SEO & Discovery:** Every page and article includes deep SEO metadata, OpenGraph tags, and a `structuredData` JSON field for schema.org (JSON-LD) injection.
- **Enterprise Infrastructure:** 
  - **Geo-Aware Branches:** Integrated latitude/longitude for Google Maps.
  - **Compliance Hub:** Transparency reports, grievance escalation levels (1-3), and ombudsman office directories.
- **Modular Page Builder:** 20+ responsive components including Hero Sections, Accordions, Comparison Tables, Product CTAs, and Stats Bars.
- **Nested Navigation:** Support for 4-level deep hierarchical menus for complex site structures.

## 🛠️ Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and configure your database and secrets.

### 3. Maximum Volume Seed (Development)
Populate the CMS with realistic, industry-standard data:
```bash
npm run seed:kiwi
```

### 4. Development
```bash
npm run dev
```

## 📚 Documentation

- **[CMS Master Guide](./CMS_GUIDE.md):** The "Encyclopedia" of every field, component, and linking logic.
- **[Postman Collection](./postman/kiwi-insurance-api.postman_collection.json):** Architect-level API requests with deep population patterns.

## 🏛️ Project Structure

- `src/api`: 21+ Collection and Single types covering Corporate, Products, Content, and Infrastructure.
- `src/components`: 3 categories of LEGO-style bricks (Page Builder, Shared, Disclosures).
- `scripts`: Strategic seeding scripts for rapid environment setup.

---
*Built for Kiwi General Insurance Limited – Simple. Smart. Digital.*
