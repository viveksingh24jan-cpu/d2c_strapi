# 🥝 Kiwi Insurance: D2C CMS User Manual (0.00 to 1.00)
## *The Definitive Guide for Product Managers*

This manual is for you if you have **ZERO** technical knowledge. It explains how to drive the insurance engine from the Strapi Admin UI.

---

## 1. The Core Hierarchy (The DNA)
Everything in your business flows from Top to Bottom. You MUST follow this order:

1.  **LOB (Root)**: The "Main Business." (e.g., **Motor**, **Health**).
2.  **Product (Vehicle Master)**: The "Homepage Hero." (e.g., **4 Wheeler Insurance**, **2 Wheeler Insurance**).
3.  **Plan (Policy/Tenure Template)**: The "Product Page Offering." (e.g., **Comprehensive 1+3**, **TP-Only 3 Year**).
4.  **Master Coverage Registry**: The "Feature Library." (e.g., **Zero Depreciation**, **Voluntary Deductible**).

---

## 2. The "Master Keyword" Strategy
Every coverage you offer (like "Zero Dep") is identified by a technical **Keyword** (e.g., `ZERO_DEP_FLAG`). 
*   Your insurance price engine sends this keyword. 
*   The CMS looks up this keyword and shows the **Icon**, **Heading**, and **"i" Button Content** you configured.

---

## 3. Inheritance: The "Smart Fill" Pattern
To make your life easy, we use **Inheritance**. You can set a global default and only override it locally:

*   **Global Level (Master Registry)**: Set the icon and description for "Zero Dep" once.
*   **Product Level (Override)**: Want a different icon for *only* 2-wheeler Zero Dep? Change it here.
*   **Plan Level (Override)**: Want a different name for *only* the "Gold Plan" Zero Dep? Change it here.

**If you leave a field empty at the Plan or Product level, the CMS automatically "Falls Back" to the Master Registry default.**

---

## 4. Configuring UI Blocks

### **Advanced SEO (Every Page)**
*   **Meta Title/Description**: Google search results.
*   **Meta Robots**: Set to `index, follow` unless you want to hide a page from Google.
*   **Canonical URL**: Crucial for SEO! If "Plan A" and "Plan B" have the same content, point the canonical to one of them to avoid penalties.

### **Dynamic CTAs (Every Page)**
*   **Label Text**: The text on the button (e.g., "Secure My Car").
*   **Variant**: Primary (Main Color), Secondary (Outline), Ghost (Text only).
*   **Action URL**: The URL it goes to.

### **UI Config (Visibility)**
*   `isVisibleOnHomepage`: Toggle to hide/show a product card on the homepage.
*   `sortOrder`: Lower numbers come first in the list.

---

## 5. Adding a Coverage (Step-by-Step)
1.  **Go to `Master Coverage Registry`**.
2.  **Create New**: Name it "Engine Protection."
3.  **Add Keywords**: Input `["ENG_PROT_FLAG", "ENG_PROT_2024"]`.
4.  **Set UI**: Upload an icon, add a short "i" button tooltip, and a long explanation for the "Read More" modal.
5.  **Set Comparison**: In `comparisonGrid`, type "Engine" for the group and "Covered" for the display value.
6.  **Link to Plan**: Go to any `Insurance Plan`, add an `Addon` block, and pick "Engine Protection" from the dropdown. **Save.**

---

## 6. Pro PM Tips
*   **Use Slugs for URLs**: Slugs must be lowercase with dashes (e.g., `car-insurance`). No spaces!
*   **One Update = 100 Updates**: Changing the IRDAI registration in a `Regulatory Disclosure` updates every plan linked to it instantly.
*   **Rich Features**: Use icons for every feature to make the "Plan Selection" page look premium.
