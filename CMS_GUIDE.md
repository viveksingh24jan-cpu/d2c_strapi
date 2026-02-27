# 🥝 Kiwi CMS: The Definitive Master Manual (0-100% Mastery)

This document is the "Grand Encyclopedia" of the Kiwi CMS. It explores every single field, why it exists, and how the data flows from the CMS into the website.

---

## 🏛️ 1. SINGLE TYPES (Site Brain)
There is only one of these in the entire system. They control site-wide rules.

### **1.1 GlobalConfig (`api::global-config`)**
*   **Purpose:** The "One-Stop-Shop" for branding, regulatory compliance (CIN), and global navigation links.
*   **Key Fields:**
    *   `siteName` (String): The brand name (e.g., "Kiwi General Insurance").
    *   `irdaiRegNumber` (String): Mandatory license number.
    *   `cinNumber` (String): Official Corporate Identification Number (`U65120KA2024PLC194560`).
    *   `privacyPage` / `termsPage` (Relation): Direct links to the Legal Page warehouse.
    *   `stickyCta` (Component): A site-wide floating bar for lead generation.

---

## 🏪 2. COLLECTIONS (Data Warehouses)

### **2.1 Marketing & Agility (The Sales Engine)**
*   **Campaigns (`api::campaign`):** Time-limited seasonal promotions (e.g., "Monsoon Safety Month").
*   **Partners (`api::partner`):** Registry of network hospitals, garages, and brand collaborators.
*   **InsuranceProduct (`api::insurance-product`):** The master product list. 
    *   Includes `isStandard` flag for IRDAI mandated plans.
    *   Compliance fields: `uinNumber`, `cisDocument`, `policyWording`.

### **2.2 Core Content & SEO**
*   **Dynamic Landing Pages (`api::page`):** The model for every site URL.
    *   Supports `shared.section-reference` for atomic reusability.
*   **Article (`api::article`):** Blog posts and guides. Linked to **Authors**.
*   **Redirect (`api::redirect`):** SEO management from old URLs to new ones.

### **2.3 Infrastructure & Compliance**
*   **Transparency Reports (`api::transparency-report`):** IRDAI public disclosures.
*   **Branch (`api::branch`):** Office map data including `latitude` and `longitude`.
*   **GrievanceLevel (`api::grievance-level`):** The 3-tier escalation matrix.
*   **OmbudsmanOffice (`api::ombudsman-office`):** Regional complaint offices.

### **2.4 People & Technical**
*   **LeadershipProfile (`api::leadership-profile`):** Board of Directors and KMP profiles with LinkedIn links.
*   **JobListing (`api::job-listing`):** Open positions in the career portal.
*   **Tool (`api::tool`):** Calculators linked to categories.

---

## 🧱 3. COMPONENT LIBRARY (LEGO Bricks)

### **3.1 Layout Bricks**
*   **Hero Section:** High-impact banners.
*   **Card Grid:** Responsive layout for product or feature cards.
*   **Text Block:** Rich text with multi-column support.

### **3.2 Trust & Compliance Bricks**
*   **Award Badge (`shared.award`):** Reuse recognitions like "Best Insurer 2025" anywhere.
*   **Disclosure Document:** For regulatory attachments.
*   **SEO:** Enhanced with `structuredData` (JSON-LD) for Google Rich Snippets.

### **3.3 Atomic Reuse**
*   **Shared Section Reference:** Add a globally-synced block (e.g., "Need Help?") into any page.

---

## 🧶 4. DATA FLOW & LINKING LOGIC

1.  **Registry Pattern:** Always create the "Product" or "Partner" in its registry first.
2.  **SSOT Pricing:** Page CTAs pull the `startingPrice` from the `InsuranceProduct` registry.
3.  **Geo-Mapping:** The `Branch` coordinates are used by the frontend to render Google Maps pins.
4.  **SEO Chain:** Global SEO flows from `GlobalConfig`, overridable by individual `Page` metadata.

---

## 🧑‍💻 5. DEVELOPER IMPLEMENTATION TIPS

*   **Master Query:** Use the Postman "Master Component Query" to see how to fetch all page blocks in one request.
*   **Population:** For branches, always request `latitude` and `longitude` fields for map rendering.
*   **Standard Products:** Filter the product registry by `isStandard=true` to build the "Standard Products" directory page.

**This guide is the blueprint for the Kiwi CMS City.**
