# 🥝 Kiwi Insurance: API Architecture & Handover

This document defines the high-performance REST API architecture of the Kiwi CMS. It is designed to be **Simple, Recursive, and Atomic**, minimizing frontend complexity while maximizing SEO value.

---

## 🏛️ 1. ARCHITECTURAL PILLARS

### **A. Recursive Enrichment Engine**
Standard Strapi APIs return only the "Config" for Dynamic Zone components. Our system uses a custom service layer (`enrichPageContent`) to **Recursive Hydrate** components at any depth (N-level).
*   **Input**: A Page layout with empty "Automated" blocks.
*   **Process**: The backend scans for blocks like `branch-locator` or `product-grid` and injects real data records.
*   **Output**: A single, fully-hydrated JSON. **No secondary waterfall requests are needed.**

### **B. Atomic SSOT (Single Source of Truth)**
Data registries (Branches, Products, Coverages) are decoupled from the UI.
*   **Registry**: Where data lives (e.g., "Mumbai HQ" branch).
*   **UI Block**: Where data is requested (e.g., a "Branch Locator" component set to "all").
*   **Sync**: Updating a branch address in the registry updates it across every page on the site instantly.

---

## 🔐 2. AUTHENTICATION & SECURITY

*   **Production**: Use a **Bearer Token** (API Token) for all requests.
*   **Header**: `Authorization: Bearer <your_token>`
*   **Local Development**: API routes for `Page`, `Article`, `Bootstrap`, and `Product` are typically set to **Public** for easier frontend integration.

---

## 🚀 3. CORE ENDPOINTS

### **1. Site Bootstrap**
*   **URL**: `GET /api/bootstrap`
*   **Role**: The "Single-Call Init". Fetches `GlobalConfig`, `Navigation Menus`, and `Homepage SEO`.
*   **Usage**: Call this once when the app starts.

### **2. Unified Page Engine**
*   **URL**: `GET /api/pages/:slugOrDocumentId`
*   **Role**: Fetches any page by its slug (e.g., `about-us`, `index`).
*   **Logic**: Automatically triggers the **Enrichment Engine**.

### **3. Insurance Product Matrix**
*   **URL**: `GET /api/insurance-products/:slug`
*   **Role**: Fetches product landing pages (Car, Bike, Health) with full coverage and plan details.

### **4. Keyword Lookup (Registry)**
*   **URL**: `GET /api/coverages?filters[identifier][$eq]=KEYWORD`
*   **Role**: Used by the frontend/quote engine to map technical flags (e.g., `VOLDED_FLAG`) to human-readable UI content (icons, headings).

---

## 🛠️ 4. DATA FORMATS

### **Dynamic Zones**
All page content is returned in the `content` (for Pages) or `pageBuilder` (for Products) array. Each object has a `__component` key identifying the UI block.

### **Rich Text**
Content blocks use **Strapi Blocks** format (JSON-based) for high-performance rendering on the frontend.

---

## 🧑‍💻 5. HANDOVER CHECKLIST FOR FRONTEND DEVS

1.  **Lottie Support**: `media-block` allows `.json` files. Use `lottie-react` or similar to render.
2.  **Bento Grid**: Check `colSpan` and `rowSpan` in `card-grid` items for responsive mixed-size layouts.
3.  **Breadcrumbs**: Check `uiConfig.showBreadcrumbs` to toggle page navigation paths.
4.  **Comparison Grid**: Use the `rows` and `columns` JSON arrays in `comparison-table` for product feature grids.

**For full request/response examples, refer to the Postman Collection in `/postman`.**
