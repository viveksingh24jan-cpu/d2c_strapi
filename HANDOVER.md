# 🏁 Technical Specification: Kiwi Insurance D2C CMS (v1.0)
## *The Architect's Handover Doc*

This document is the **Source of Truth** for the system architecture, mapping, and database schema.

---

## 1. Technical Architecture
The system uses a **Shadowing & Fallback** pattern for high-performance content delivery.

1.  **Registry (Level 0)**: Master Coverage collection.
2.  **Product (Level 1)**: Vehicle master (e.g., `4W`).
3.  **Plan (Level 2)**: Policy variant (e.g., `Comprehensive`).

### **The "Identifier" Pattern**
Every entity has an `identifier` field (Unique String). This is used by the insurance pricing engine and the frontend for 1:1 mapping.

---

## 2. API Endpoints & Population

### **A. Homepage Product Cards**
*   **Query**: `GET /api/insurance-products?filters[uiConfig][isVisibleOnHomepage][$eq]=true&populate=cardIcon,uiConfig,cta`

### **B. Product Landing Page**
*   **Query**: `GET /api/insurance-products?filters[slug][$eq]=car-insurance&populate=keyBenefits,seo,pageBuilder,cta`

### **C. Plan Selection Page**
*   **Query**: `GET /api/insurance-plans?filters[insuranceProduct][identifier][$eq]=4W&populate=inclusions,addons,discounts,faqs,comparisonAttributes,seo`

---

## 3. Database Schema Mapping

| Collection | Role | Key Relationships |
| :--- | :--- | :--- |
| **LineOfBusiness** | LOB Hub | Has Many `InsuranceProducts`. |
| **InsuranceProduct**| Vehicle Master | Belongs to `LOB`. Has Many `InsurancePlans`. |
| **InsurancePlan** | Policy Master | Has Many `InsuranceProducts` (Matrix). Has Many `Coverages`. |
| **Coverage** | Keyword Master | Has Many `InsurancePlans` (Registry). |

---

## 4. Components Registry

### **`shared.seo` (Enterprise)**
Includes `metaRobots`, `canonicalURL`, and `structuredData` (JSON-LD).

### **`shared.cta` (Dynamic)**
Supports `variants` (Primary/Secondary) and `isVisible` toggles for atomic button management.

### **`product.plan-coverage` (Link Engine)**
This component links a Plan to a Master Coverage and provides **Override** fields:
*   `titleOverride`
*   `descriptionOverride`
*   `iconOverride`

---

## 5. Deployment & Maintenance
1.  **Strapi v4**: Uses standard REST endpoints.
2.  **Identifiers**: NEVER change an `identifier` in the CMS without updating the Price Engine code.
3.  **SEO Canonicalization**: Use the `canonicalURL` field to prevent duplicate content penalties across tenures.
