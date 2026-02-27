# 🏗️ Kiwi General Insurance: CMS Architecture Blueprint

This document defines the high-performance, headless architecture of the Kiwi CMS. It is engineered for **Simple, Scalable, Fast, and Agile** content delivery, merging ACKO’s marketing conversion power with GoDigit’s regulatory depth.

---

## 🏛️ 1. ARCHITECTURAL FOUNDATION

The system is built on **Strapi v5** using a **Headless, Atomic Design** approach.

### **Core Principles:**
*   **SSOT (Single Source of Truth):** Data (like Product pricing or Author bios) is defined in a registry once and referenced everywhere.
*   **Atomic Reusability:** Every UI block is a reusable component. Global blocks are managed in `Shared Sections` and mirrored via `Section References`.
*   **SEO-First:** Metadata, JSON-LD Structured Data, and Geo-location are baked into the schema level.
*   **Headless Purity:** No pricing logic or calculators exist in the CMS; only the metadata required to render them on the frontend.

---

## 🏬 2. COLLECTION TYPES (The Warehouses)

The CMS manages **21 Collection Types**, organized into four strategic tiers:

### **Tier A: Product & Marketing Engine**
*   **Insurance Products:** The master registry for all plans (Car, Health, Home). Includes `isStandard` flag for IRDAI compliance and `startingPrice` for dynamic CTAs.
*   **Campaigns:** Time-limited seasonal promotions (e.g., "Monsoon Offer") with start/end dates.
*   **Partners:** Registry of network hospitals, garages, and brand collaborators.
*   **Testimonials:** Verified social proof linked to specific products.

### **Tier B: Dynamic Content & SEO**
*   **Pages (Unified Model):** The engine for every URL. Uses a massive Dynamic Zone to build layouts block-by-block.
*   **Article:** Blog posts and educational guides. Linked to **Authors** and **Categories**.
*   **Author:** Profile registry with standardized bios (blocks) and social links.
*   **Redirects:** 301/302 SEO management.

### **Tier C: Infrastructure & Regulatory**
*   **Transparency Reports:** IRDAI public disclosures and financial results.
*   **Branch:** Office locations with integrated **Latitude/Longitude** for map rendering.
*   **GrievanceLevel:** Standardized 3-tier escalation matrix.
*   **OmbudsmanOffice:** Regional government contact registry.

### **Tier D: HR & Support**
*   **Job Listing:** Career portal data.
*   **Tool:** Metadata for calculators (Premium, HLV, IDV).
*   **Download Document:** Registry for PDFs (Forms, CIS, Policy Wordings).

---

## 🧩 3. COMPONENT LIBRARY (The LEGO System)

### **Category 1: Page Builder (The Visuals)**
*   `Hero Section`: High-impact banners with layout controls.
*   `Insurance Product CTA`: Dynamic link component that pulls real-time data from the Product Registry.
*   `Comparison Table`: Feature comparison grid.
*   `Stats Bar`: Trust metrics (e.g., "99% Claims Ratio").
*   `Accordion`: FAQ and detail lists.

### **Category 2: Shared (The Logic)**
*   `Section Reference`: Allows a Page to render a global block from `Shared Sections`.
*   `SEO`: Deep metadata with `structuredData` for JSON-LD.
*   `Award`: Reusable trust badges from the Award Registry.

---

## 🧶 4. DATA FLOW & LINKING LOGIC

1.  **Creation Workflow:** Create the **Product** or **Partner** in the registry first.
2.  **Assembly:** Create a **Page** and add an `Insurance Product CTA` component. Select the Product via Relation.
3.  **Inheritance:** The frontend API automatically populates the `startingPrice` and `uinNumber`.
4.  **Global Update:** Changing a price in the Registry updates it across the entire site instantly.

---

## 🧑‍💻 5. DEVELOPER IMPLEMENTATION TIPS

*   **Initial Load:** Fetch `GlobalConfig` for site-wide brain data.
*   **Page Loading:** Use the **Master Component Query** (see Postman) to fetch all dynamic blocks in one request.
*   **Geo-SEO:** Use Branch `latitude/longitude` fields for rendering office maps.

**The Kiwi CMS is designed for maximum scalability. Treat every block as a reusable asset.**
