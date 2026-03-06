# 🏗️ Kiwi General Insurance: CMS Architecture Blueprint

This document defines the high-performance, headless architecture of the Kiwi CMS. It is engineered for **N-Level Recursive Nesting** and automated data hydration.

---

## 🏛️ 1. ARCHITECTURAL FOUNDATION

The system is built on **Strapi v5** using a **Recursive Atomic Design** approach.

### **Core Principles:**
*   **Recursive Enrichment:** Standard Strapi APIs are extended to "Auto-Hydrate" nested registries (Branches, Leadership, Documents) at any depth.
*   **Atomic Reusability:** Every UI block is a reusable component. Nested dynamic zones (inside Tabs) allow for complex layouts without code.
*   **Hybrid Delivery:** Combines the flexibility of a Dynamic Zone with the "Source of Truth" reliability of a Registry.

---

## 🏬 2. COLLECTION TYPES (The Warehouses)

### **Tier A: Product & Marketing Engine**
*   **Insurance Products:** Master registry. Includes `enrichProductContent` for automated page building.
*   **Campaigns:** Time-limited seasonal promotions.
*   **Testimonials:** Verified social proof.

### **Tier B: Dynamic Content & SEO**
*   **Pages (Recursive Model):** The main engine. Supports `page-builder.tabs` with nested enrichment.
*   **Article:** Blog posts with standardized author/category hydration.

### **Tier C: Infrastructure & Regulatory**
*   **Branch:** Office locations with auto-hydration in `branch-locator`.
*   **Download Document:** PDF registry with automated categorisation in `document-listing`.
*   **Leadership Profile:** Profiles with auto-sorting in `leadership-grid`.

---

## 🧩 3. COMPONENT LIBRARY (Enhanced)

### **Category 1: Interactivity (New)**
*   `Tabs Content`: Recursive dynamic zone support for multi-layered navigation.
*   `Modals`: ID-driven overlay system for conversion triggers.
*   `Charts`: JSON-driven data visualization for Bar/Pie/Line.

### **Category 2: Conversion (Atomic)**
*   `CTA Section (Strip)`: High-conversion headline + button strip.
*   `Sticky CTA Bar`: Global or page-level sticky navigation for conversion.

---

## 🧶 4. RECURSIVE DATA FLOW

1.  **Page Fetch:** Frontend calls `/api/pages/index`.
2.  **Service Logic:** `enrichPageContent` scans the dynamic zone.
3.  **Nesting Dive:** It finds a `Tabs` component -> dives into each `Tab Item`.
4.  **Hydration:** Inside a Tab, it finds a `Branch Locator` -> Fetches all Branch records and attaches them to `data`.
5.  **Clean Output:** Client receives a single, fully-formed JSON with all nested data ready for rendering.

---

## 🧑‍💻 5. DEVELOPER IMPLEMENTATION TIPS

*   **Recursive Depth:** The enrichment engine is currently configured for N-level depth. Ensure `getCommonPopulation` is updated when adding new nested components.
*   **MIME Types:** `media-block` is updated to allow `.json` for Lottie support. Ensure the frontend uses a Lottie player library (e.g., `lottie-react`).
*   **Bento Grid:** Use `colSpan` (1-4) and `rowSpan` (1-4) in `card-item` to implement modern Bento-style layouts.

**The Kiwi CMS is designed for maximum scalability and zero-waterfall performance.**
