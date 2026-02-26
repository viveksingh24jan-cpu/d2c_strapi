# 🥝 Kiwi CMS: The Definitive Master Manual (0-100% Mastery)

This document is the "Grand Encyclopedia" of the Kiwi CMS. It explores every single field, why it exists, and how the data flows from the CMS into the website.

---

## 🏛️ 1. SINGLE TYPES (Site Brain)
There is only one of these in the entire system. They control site-wide rules.

### **1.1 GlobalConfig (`api::global-config`)**
*   **Purpose:** The "One-Stop-Shop" for branding, regulatory compliance, and global navigation links.
*   **Key Fields:**
    *   `siteName` (String): The brand name (e.g., "Kiwi General Insurance").
    *   `irdaiRegNumber` (String): Mandatory license number (e.g., "190").
    *   `privacyPage` / `termsPage` (Relation): Direct links to the Legal Page warehouse.
    *   `stickyCta` (Component): A site-wide floating bar for urgent alerts or lead generation.
    *   `socialLinks` (Repeatable Component): Managed list of social handles with platform-specific icons.

---

## 🏪 2. COLLECTIONS (Data Warehouses)
These store groups of similar data used across the application.

### **2.1 Core Content & SEO**
*   **Dynamic Landing Pages (`api::page`):** The master model for every URL.
    *   `template` (Enum): Pick `home`, `about`, `legal`, `grievance`.
    *   `content` (Dynamic Zone): A stack of modular sections (Hero, Stats, Accordions, etc.).
    *   **Optimization:** Supports `shared.section-reference` to reuse blocks from the Shared Sections registry.
*   **Article (`api::article`):** Blog posts and educational guides.
    *   Linked to **Author** and **Category** warehouses.
*   **Redirect (`api::redirect`):** SEO traffic management. Maps `fromPath` to `toPath` with 301/302 status codes.

### **2.2 Insurance Product Registry**
*   **InsuranceProduct (`api::insurance-product`):** Marketing-heavy data.
    *   `startingPrice` (Decimal): Pulls automatically into page CTAs.
    *   `productDescription` (Blocks): Standardized rich-text overview.
*   **StandardProduct (`api::standard-product`):** IRDAI-mandated standard policies.
    *   Types: `arogya-sanjeevani`, `bharat-griha-raksha`, etc.

### **2.3 Corporate & Regulatory**
*   **Financial Disclosure (`api::financial-disclosure`):** Consolidated warehouse for Quarterly Results and Annual Reports.
*   **Infrastructure:**
    *   `api::branch`: Map-ready office locations (Head Office, Regional, Branch).
    *   `api::ombudsman-office`: Jurisdiction-based govt. complaint offices.
    *   `api::grievance-level`: Escalation matrix (Level 1 to 3).
*   **LeadershipProfile (`api::leadership-profile`):** Board of Directors and Key Managerial Personnel (KMP).

### **2.4 Technical & Misc**
*   **Tool (`api::tool`):** Calculators (e.g., "Premium Calculator") linked to a **Tool Category**.
*   **JobListing (`api::job-listing`):** HR portal data.
*   **Testimonial (`api::testimonial`):** Customer reviews verified for display.

---

## 🧱 3. COMPONENT LIBRARY (The LEGO System)

### **3.1 Layout & Content Bricks**
*   **Hero Section:** High-impact banner with layout options (`centered`, `left-right`).
*   **Text Block:** Scalable rich-text container with column support.
*   **Accordion:** Collapsible Q&A items for FAQs.
*   **Card Grid:** Responsive grid of `Card Items` with icons and badges.

### **3.2 Atomic Reuse (The Architect's Secret)**
*   **Shared Section Reference (`shared.section-reference`):**
    *   Instead of recreating a "Contact Us" block on every page, you create it once in the **Shared Sections** collection.
    *   Inside any page, you add this component and point it to that section.
    *   **Update once, reflect everywhere.**

### **3.3 Dynamic Logic Bricks**
*   **Insurance Product CTA (`page-builder.insurance-product-cta`):**
    *   Instead of typing the price manually, you select a **Product** from the relation.
    *   The frontend automatically pulls the latest `startingPrice` and `ctaUrl` from the Product Registry.

---

## 🧶 4. DATA FLOW & LINKING LOGIC

1.  **Registry Pattern:** Always create the "entity" (Product, Author, Category) in its Warehouse first.
2.  **Referential Integrity:** Use the **Product CTA** component on landing pages to ensure pricing is never "stale."
3.  **SEO Logic:** The `GlobalConfig` provides the default SEO, while the `Page` component can override it for specific URLs.
4.  **Nesting:** **Navigation Menu** supports unlimited hierarchy via self-relations (Parent -> Child).

---

## 🧑‍💻 5. DEVELOPER IMPLEMENTATION TIPS

*   **Initial Load:** Call `GET /api/global-config?populate=*` to get the "Site Brain."
*   **Page Rendering:** 
    *   `GET /api/pages?filters[slug]=home&populate[content][on][shared.section-reference][populate]=shared_section`
    *   This deep-populates the shared blocks in one request.
*   **Component Mapping:** Map `__component` names (e.g., `page-builder.hero-section`) directly to your React/Vue section components.

**The Kiwi CMS is designed for maximum scalability. Treat every block as a reusable asset.**
