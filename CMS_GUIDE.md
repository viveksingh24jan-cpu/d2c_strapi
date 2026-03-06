# 🥝 Kiwi Insurance: D2C CMS User Manual (0.00 to 1.00)
## *The Definitive Guide for Product Managers*

This manual is for you if you have **ZERO** technical knowledge. It explains how to build complex, high-conversion insurance pages from the Strapi Admin UI.

---

## 1. The Core Hierarchy (The DNA)
Everything in your business flows from Top to Bottom. You MUST follow this order:

1.  **LOB (Root)**: The "Main Business." (e.g., **Motor**, **Health**).
2.  **Product (Vehicle Master)**: The "Homepage Hero." (e.g., **4 Wheeler Insurance**).
3.  **Plan (Policy/Tenure Template)**: The "Product Page Offering." (e.g., **Comprehensive 1+3**).
4.  **Master Coverage Registry**: The "Feature Library." (e.g., **Zero Depreciation**).

---

## 2. Advanced Page Builder Blocks

### **🏥 Tabs (Organized Content)**
Use **Tabs** to split long pages into readable sections (e.g., "Overview", "Inclusions", "Exclusions").
*   **Pro Tip**: Each Tab has its own "Dynamic Zone." You can put *anything* inside a tab—images, accordion lists, or even a Branch Locator.

### **📊 Data Charts (Visual Metrics)**
Use **Charts** to show performance or savings.
*   **Types**: Bar, Pie, Line, Radar.
*   **Data**: Enter your metrics in standard JSON format (e.g., `{"label": "2024", "value": 98}`).

### **🔔 Modals (Popups)**
Use **Modals** for exit-intent offers or lead-capture forms.
*   **Modal ID**: Give it a name (e.g., `callback-modal`). Your frontend developer will use this to trigger the popup.
*   **Trigger**: Set `triggerOnLoad` to true if you want it to appear as soon as the user arrives.

---

## 3. Visual Layouts & Bento Grids

### **Atomic Card Grid**
*   **Layout**: Choose `grid-3`, `masonry`, or the new `bento-grid`.
*   **Mixed Sizes**: In `Card Item`, use **colSpan** and **rowSpan** to make some cards larger than others (e.g., 2 columns wide).

### **Media Blocks**
*   **Support**: Now supports **Lottie Animations** (.json files), **Illustrations**, and **Infographics**.
*   **Ratio**: Set the aspect ratio (1:1, 16:9) to ensure perfect alignment across devices.

---

## 4. Automated Content: "The Magic Sync"
Some components **do not require you to pick items manually**:
*   **Branch Locator**: Set to "all" to show every office, or "ombudsman-office" for legal pages.
*   **Document Listing**: Select a category (e.g., "Financial"), and the CMS will automatically show the latest reports you uploaded to the Document Registry.
*   **Leadership Grid**: Pick "Board" or "KMP" to auto-generate the team list.

---

## 5. SEO & Site-Wide Config

### **UI Config (Global Controls)**
*   **Show Breadcrumbs**: A single toggle to turn on/off navigation paths at the top of the page.
*   **Theme Color**: Set a hex code (e.g., `#FF4500`) to brand specific pages or products.

### **Postman Collection**
Ask your dev team for the "Postman Collection" to see how the page looks in data form before it goes live!
