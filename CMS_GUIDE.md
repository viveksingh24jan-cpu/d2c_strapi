# 🥝 Kiwi CMS: The Definitive Master Manual (0-100% Mastery)

This document is the "Grand Encyclopedia" of the Kiwi CMS. It explores every single field, why it exists, and how the data flows from the CMS into the website.

---

## 🏛️ 1. SINGLE TYPES (Site Brain)
There is only one of these in the entire system. They control site-wide rules.

### **1.1 GlobalConfig (`api::global-config`)**
*   **Purpose:** The "One-Stop-Shop" for branding and compliance.
*   **Fields:**
    *   `siteName` (String): Title in the browser tab.
    *   `siteDescription` (Text): Metadata for Google Search.
    *   `headerLogo` / `footerLogo` (Media): Images for the top and bottom of the site.
    *   `irdaiRegNumber` (String): Mandatory license number shown in the footer.
    *   `registeredAddress` (Text): Official office address.
    *   `privacyPage` / `termsPage` (Relation): Links to the official Legal Pages.
    *   `announcementBanner` (Component): A thin bar for site-wide alerts.
    *   `trustMetrics` (Component): List of global stats (e.g., "99% Claims Ratio").

---

## 🏪 2. COLLECTIONS (Data Warehouses)
These store groups of similar data.

### **2.1 Core Content**
*   **Dynamic Landing Pages (`api::page`):** The master for all site URLs.
    *   `template` (Enum): Pick `home`, `about`, `legal`, `tool-hub`.
    *   `blocks` (Dynamic Zone): Stacks of LEGO bricks.
    *   `metadata` (Component): Page settings like `isMandatory`.
*   **Article (`api::article`):** The Blog/Knowledge Hub.
    *   `cover` (Media): Featured image.
    *   `categories` (Relation): Links to the Category Warehouse.
    *   `authorName` (String) & `readTime` (Integer).
*   **Category (`api::category`):** Folders for the Blog.
    *   `name` / `slug` / `description`.

### **2.2 Products & Sales**
*   **InsuranceProduct (`api::insurance-product`):** Core marketing data.
    *   `startingPrice` (Decimal): The "From" price.
    *   `ctaUrl` (String): Deep-link to the checkout page.
    *   `badge` (String): e.g., "Best Seller".
*   **StandardProduct (`api::standard-product`):** IRDAI mandatory listings.
    *   `productType` (Enum): `arogya-sanjeevani`, `saral-suraksha-bima`, etc.
    *   `eligibility` (Blocks): Bullet points on who can buy.
*   **Testimonial (`api::testimonial`):** Customer reviews.
    *   `customerName` (String) & `testimonialContent` (Blocks).

### **2.3 Technical & Tools**
*   **Tool (`api::tool`):** Calculators like "Premium Calc".
    *   `url` (String): Link to the actual calculator logic.
    *   `badge` (Enum): `New`, `Popular`, `Free`.
*   **ToolCategory (`api::tool-category`):** Groups for calculators.
*   **Redirect (`api::redirect`):** SEO Traffic Signs.
    *   `fromPath` (String) -> `toPath` (String). Type: `permanent` (301) or `temporary` (302).

### **2.4 Corporate & Finance**
*   **AnnualReport (`api::annual-report`):** Public PDFs.
    *   `reportType` (Enum): `annual-report`, `esg-report`, `stewardship`.
*   **FinancialYear / Quarter (`api::financial-year/quarter`):**
    *   `isActive` (Boolean): Marks the current year.
    *   `documents` (Component): List of Disclosure documents.
*   **LeadershipProfile (`api::leadership-profile`):** The "Bosses".
    *   `category` (Enum): `Board` or `KMP`.
*   **JobListing (`api::job-listing`):** Careers.
    *   `jobType` (Enum): `full-time`, `contract`, `pos-agent`.
*   **Branch (`api::branch`):** Office Map.
    *   `branchType` (Enum): `head-office`, `regional`, `branch`.
*   **OmbudsmanOffice (`api::ombudsman-office`):** Govt. Complaint offices.

---

## 🧱 3. COMPONENTS (The LEGO Bricks)
These are the fields you fill in when building a page.

### **3.1 The "Paint Bucket" (shared.styling)**
*   **BackgroundColor:** `white`, `light-gray`, `brand-primary`.
*   **Spacing:** `paddingTop` / `paddingBottom` (None to XLarge).
*   **ContainerType:** `narrow`, `normal`, `wide`, `full-width`.

### **3.2 Layout Bricks**
*   **Hero:** `title`, `subtitle`, `badge`, `image`, `ctaText`, `ctaUrl`.
*   **Section Reference:** Links to a **Shared Section** entry to reuse content.
*   **Media Slider:** `files` (Multiple images) + `styling`.

### **3.3 Sales & Trust Bricks**
*   **Product CTA:** Relation to `InsuranceProduct`. Automatically grabs price and CTA link.
*   **Stats:** List of `label` and `value`.
*   **Award:** `title`, `year`, `issuer`, `logo`.
*   **PromoCard:** `title`, `description`, `promoImage`, `ctaText`.
*   **Comparison Table:** JSON-based grid for manual data entry.
*   **Dynamic Comparison:** Links to multiple `InsuranceProducts` to compare them.

### **3.4 Info & Logic Bricks**
*   **Rich Text Block:** A Markdown editor for long stories.
*   **FAQ Item:** `question` (String) and `answer` (Blocks).
*   **Process Step:** `stepNumber`, `title`, `description`, `icon`.
*   **Alert:** `variant` (`info`, `warning`, `error`, `success`) + `message`.
*   **Modal:** `triggerLabel` (Button text) + `content` (Pop-up body).
*   **Lottie:** `lottieUrl` (Link to animation) + `autoplay/loop` settings.
*   **Page Metadata:** `isMandatory` (Compliance flag), `redirectionPath` (Auto-redirect).

---

## 🧶 4. LINKING LOGIC (The Connections)

1.  **Page -> Product:** A `Page` uses a `Product CTA` brick -> Points to `InsuranceProduct` (Warehouse) -> Grabs Price.
2.  **Article -> Category:** An `Article` points to a `Category` (Warehouse) -> Shows category badge on the blog post.
3.  **Bootstrap -> GlobalConfig:** The site starts -> Calls `/api/bootstrap` -> Grabs `GlobalConfig` -> Finds `Privacy Page` (Relation) -> Draws the footer link.
4.  **Financials:** `FinancialQuarter` points to a `FinancialYear` -> "Q1" knows it belongs to "2024-25".

---

## 🧑‍💻 5. ARCHITECT'S FINAL ADVICE (For the Developer)

*   **Endpoint 1:** `GET /api/bootstrap` (Initialization - One fetch).
*   **Endpoint 2:** `GET /api/pages?filters[slug]=slug` (Page load).
*   **Logic:** Always check `__component` inside the `blocks` array. Map it to your React components.
*   **Styling:** Use the `styling` object inside each block to set CSS margins and backgrounds.

**This is the 100% complete Master Guide to the Kiwi CMS City.**
