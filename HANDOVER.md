# 🏁 Technical Specification: Kiwi Insurance D2C CMS (v1.0)
## *The Architect's Handover Doc*

This document is the **Source of Truth** for the system architecture, recursive mapping, and database schema.

---

## 1. Technical Architecture: "The Enrichment Engine"
Unlike standard Strapi fetches, this system uses a custom **Recursive Enrichment Engine** in the backend (`src/api/*/services/*.ts`).

### **Recursive N-Level Nesting**
The `enrichPageContent` method automatically hydrates "Automated" components even if they are nested inside:
1.  **Tabs Content** (Dynamic Zone inside Tabs)
2.  **Shared Section References** (Blocks mirrored from global sections)
3.  **Hero/Banner Zones**

### **Automated Hydration Components**
*   **`branch-locator`**: Injects Branch registry records based on `filterType`.
*   **`leadership-grid`**: Injects Leadership profiles by `category`.
*   **`document-listing`**: Injects Disclosure documents by `category`.
*   **`product-grid`**: Injects Insurance Products visible on the homepage.

---

## 2. API Endpoints & Population

### **A. Optimized Page Fetch (Clean JSON)**
*   **Query**: `GET /api/pages/:idOrSlug`
*   **Population**: Automatically handles deep nesting of images, CTAs, and automated data. No complex query strings required on the frontend.

### **B. Product Landing Page**
*   **Query**: `GET /api/insurance-products/:slug`
*   **Enrichment**: Hydrates the `pageBuilder` dynamic zone with all registry data.

---

## 3. Database Schema Mapping

| Collection | Role | Key Relationships |
| :--- | :--- | :--- |
| **LineOfBusiness** | LOB Hub | Has Many `InsuranceProducts`. |
| **InsuranceProduct**| Vehicle Master | Belongs to `LOB`. Has Many `InsurancePlans`. |
| **InsurancePlan** | Policy Master | Has Many `InsuranceProducts` (Matrix). Has Many `Coverages`. |
| **Coverage** | Keyword Master | Has Many `InsurancePlans` (Registry). |
| **Page** | Unified URL | Dynamic Zone with recursive hydration. |

---

## 4. Components Registry (Advanced)

### **`page-builder.tabs` (Interactivity)**
Supports N-level nested Dynamic Zones inside each tab.

### **`page-builder.modals` (Conversion)**
Configurable exit-intent or time-delay popups via `modalId` and `triggerOnLoad`.

### **`page-builder.charts` (Data Viz)**
Supports Bar, Pie, Line, and Radar charts via standard JSON data payloads.

---

## 5. Postman Collection: Test Scenarios
The collection in `postman/` covers:
1.  **Hydrated Page Load**: Verifies that Branch/Document data is injected correctly.
2.  **Product Landing Matrix**: Testing LOB > Product > Plan population.
3.  **Search & Registry**: Testing direct lookup by technical keywords.

---

## 6. Developer Maintenance
1.  **Adding an Automated Block**: Update `enrichPageContent` in `src/api/page/services/page.ts`.
2.  **Schema Changes**: Ensure `getCommonPopulation` is updated to include new nested fields.
3.  **Performance**: The enrichment logic runs server-side to ensure the frontend receives a single, fast LCP-optimized JSON.
