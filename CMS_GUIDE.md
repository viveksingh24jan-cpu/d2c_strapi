# 🥝 Kiwi CMS: The Ultimate Day 0 Master Manual

This document is the definitive guide for the **Kiwi General Insurance CMS**. It defines a "Day 0" architecture: trimmed for speed, but architected for infinite scale.

---

## 🏛️ 1. ARCHITECTURAL PILLARS

1.  **Unified Registries:** Data (Products, Authors, Testimonials) is defined in a master collection and referenced by components.
2.  **Structural Primitives:** We use generic components (like `Banner` or `Accordion`) to handle specific use cases (App Promo, Grievance Levels) using Enums.
3.  **Atomic Reuse:** Global blocks are managed in `Shared Sections` and inserted into pages using `Section References`.
4.  **SSOT Pricing:** Page pricing is dynamic. If you change a price in the `InsuranceProduct` registry, it updates across the entire website instantly.

---

## 🏬 2. COLLECTION REGISTRIES (The Warehouses)

### **2.1 Products & Marketing**
*   **Insurance Products (`api::insurance-product`):** Master list of all plans.
    *   `isStandard` (Flag): Identifies IRDAI mandated plans.
    *   `productType`: Enum for compliance classification.
*   **Testimonials (`api::testimonial`):** Verified reviews with a `category` filter (Motor, Health, etc.).
*   **Tools (`api::tool`):** Calculators and checkers with dynamic `cta` links.

### **2.2 Content & SEO**
*   **Pages (`api::page`):** The engine for every URL. Built using the Component Library.
*   **Articles (`api::article`):** Knowledge hub posts linked to **Authors** and **Categories**.
*   **Authors:** Profile registry with standardized bio blocks and social components.

### **2.3 Infrastructure & Compliance**
*   **Branches:** Office registry with integrated **Latitude/Longitude** for map rendering. Supports `head-office`, `regional`, and `ombudsman-office` types via Enum.
*   **Transparency Reports:** IRDAI public disclosures and financial results.

---

## 🧱 3. COMPONENT LIBRARY (The LEGO Bricks)

### **3.1 Visual Blocks**
*   **Hero Section:** High-impact banner for page tops.
*   **Accordion:** Used for FAQs, Grievance Escalations, and Step-by-step guides.
    *   *Upgrade:* Supports `icon`, `subtitle`, and `badge` per item.
*   **Banner:** Unified component for Announcements, Alerts, and App Promotions (via `app-promotion` Enum).
*   **Comparison Table:** Enterprise-grade grid for comparing policy features.

### **3.2 Dynamic Logic Blocks**
*   **Insurance Product CTA:** A "Smart Card" that fetches real-time data from the Product Registry.
*   **Testimonial Showcase:** Dynamic filter that pulls reviews by category (e.g., "Show all Motor reviews").
*   **Section Reference:** The bridge to global reusability. Insert any `Shared Section` here.

---

## 🧶 4. KNOWLEDGE TRANSFER: DATA FLOW

1.  **How to add a Grievance Section?**
    *   Create a `Page`. Add an `Accordion` component. Use the `title` for the Level (e.g., "Level 1") and `content` for the details.
2.  **How to promote the Mobile App?**
    *   Add a `Banner` component. Set `bannerType` to `app-promotion`. Attach the `appLinks` and `qrCode`.
3.  **How to update prices site-wide?**
    *   Go to **Content Manager** -> **Insurance Products**. Edit the `startingPrice`. Save & Publish. Every page using a `Product CTA` for that car/health plan will update immediately.

---

## 🧑‍💻 5. DEVELOPER API TIPS

*   **Deep Population:** To get a full page with its shared blocks, use:
    `GET /api/pages?filters[slug]=home&populate=content.product,content.shared_section`
*   **Geo-Maps:** Use `latitude` and `longitude` from the `Branch` collection to plot markers on the frontend map.

**Architect's Note:** This CMS is in a "Website Ready" state. Every block is optimized for maximum reuse and minimal code duplication.
