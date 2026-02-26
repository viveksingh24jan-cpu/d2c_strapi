# Project Comparison: Current vs. CTO Shared Structure

## Overview
This document compares the existing Kiwi General Insurance CMS structure with the structure shared by the CTO (`cto_combined`).

## 1. Page Architecture
| Feature | Current Project | CTO Version | Recommendation |
| :--- | :--- | :--- | :--- |
| **Model** | Unified `page` model. | Unified `page` model. | **Current + CTO**: Use unified model. |
| **Hero** | Separate `hero` field. | Hero as part of Dynamic Zone (`page-builder.hero-section`). | **CTO**: Hero in Dynamic Zone is more flexible for various landing pages. |
| **Blocks** | Dynamic Zone `blocks` using `shared` prefix. | Dynamic Zone `content` using `page-builder` prefix. | **CTO**: `page-builder` category is more descriptive and structurally sound. |
| **Templates** | `template` enumeration (home, legal, etc.). | No template enumeration. | **Current**: Templates allow for specific frontend logic/styles. |
| **Naming** | camelCase attributes (Strapi Standard). | snake_case attributes. | **Current**: camelCase is consistent with Strapi core and frontend conventions. |

## 2. Component Organization
| Feature | Current Project | CTO Version | Recommendation |
| :--- | :--- | :--- | :--- |
| **Categories** | `shared`, `disclosures`. | `shared`, `disclosures`, `page-builder`. | **CTO**: Adopt `page-builder` for UI components. |
| **Component Granularity** | Generic blocks (`shared.rich-text`, `shared.media`). | Specific UI blocks (`page-builder.stats-bar`, `page-builder.testimonial-grid`). | **CTO**: Specific blocks are better for non-technical editors. |

## 3. API & Data Models
| Feature | Current Project | CTO Version | Recommendation |
| :--- | :--- | :--- | :--- |
| **Financials** | Split into `annual-report`, `financial-quarter`, `financial-year`. | Unified `financial-disclosure`. | **CTO**: Unification is much cleaner and easier to manage. |
| **Blog** | `article`, `category`. | `article`, `category`, `author`. | **CTO**: Add `author` for better content ownership. |
| **Legal** | Unified into `page` with `legal` template. | Separate `legal-page` API. | **Current**: Keep unified in `page` for better CMS management. |
| **Global Config**| Comprehensive (Social, Apps, Trust Metrics). | Basic Branding. | **Current**: Current is much more "Best in Class" for a real site. |

## 4. Final Strategy
1.  **Adopt `page-builder` components**: Import all components from the CTO's `page-builder` category.
2.  **Refactor `page` model**:
    - Keep `template`, `metadata`, and `seo`.
    - Change `blocks` to `content`.
    - Include both CTO's `page-builder` and existing useful `shared` components in the Dynamic Zone.
3.  **Unify Financials**: Replace `annual-report`, `financial-quarter`, and `financial-year` with a single `financial-disclosure` API.
4.  **Enhance Blog**: Add `author` content type and link to `article`.
5.  **Maintain Naming Convention**: Keep camelCase for all attributes to ensure API consistency.
6.  **Maintain Global Config**: Retain the current comprehensive `global-config`.

## Action Plan
- [ ] Create `page-builder` components.
- [ ] Update `shared` and `disclosures` components from CTO versions where they are better.
- [ ] Implement `author` content type.
- [ ] Implement `financial-disclosure` content type.
- [ ] Update `article` to link to `author`.
- [ ] Update `page` model with new Dynamic Zone.
- [ ] Cleanup legacy financial APIs.
- [ ] Remove all temp files.
