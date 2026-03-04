# 🥝 Kiwi Insurance D2C CMS: The Ultimate "Day 0" Architecture

## 1. Project Vision
This is an enterprise-grade, high-conversion Headless CMS built on **Strapi v4**. It is designed specifically for the **Indian Insurance Market**, handling the complex matrix of vehicle segments (4W, 2W, CV), policy types (Comprehensive, TP, OD), and multi-year tenures (1+1, 1+3, 1+5).

## 2. Core Philosophy: "Atomic D2C"
The system is built on four pillars:
*   **Agility**: PMs can change UI, buttons, and SEO without code.
*   **Scalability**: Adding a new LOB (e.g., Marine) or a new tenure takes minutes.
*   **Consistency**: A single "Master Registry" ensures "Zero Dep" means the same thing everywhere.
*   **SEO Autonomy**: Every single page has rankable URLs and advanced metadata control.

## 3. The 4-Step D2C User Journey (Data Hierarchy)
1.  **LOB (Root)**: The high-level entry (e.g., `Motor`).
2.  **Product (Vehicle Master)**: The vehicle you own (e.g., `4W`, `2W`). This drives the **Homepage Cards**.
3.  **Plan (Policy Template)**: The specific duration (e.g., `Comprehensive 1+3`). This drives the **Quote/Selection Page**.
4.  **Coverage (Keyword Registry)**: The technical features (e.g., `VOLDED_FLAG`). This drives the **Feature Lists & Comparison Grids**.

## 4. Technical Tech Stack
*   **Backend**: Strapi (Node.js)
*   **Database**: PostgreSQL / SQLite
*   **API**: REST with deep `populate` logic.
*   **Architecture**: Inheritance-based "Shadowing" model.

---

## 5. Quick Start for GPT / Developers
If you are using this as a knowledge base for an AI, the most important files are:
*   `CMS_GUIDE.md`: For "How to use" questions.
*   `HANDOVER.md`: For "How it works" questions.
*   `src/api/*/schema.json`: For database structure questions.
