# Medicube Clinical Derma 2.0 - Shopify Online Store Theme

A production-grade, conversion-optimized **Shopify Online Store 2.0 Theme** built for high-end clinical skincare, bioengineered beauty cosmetics, and luxury derma products (featuring the **Medicube EGF NAD+ Firming Serum** line).

---

## 🌟 Key Features

1. **Shopify Online Store 2.0 Architecture**:
   - JSON templates (`index.json`, `product.json`, `collection.json`, `cart.json`, `404.json`).
   - Reusable modular Liquid sections with interactive schemas.
   - Reusable snippets with clean parameters.

2. **High-Converting UX/UI Design**:
   - **Hero Section**: Bio-innovation clinical breakthrough with floating 3D bottle preview and social proof metrics.
   - **Press Bar**: Featured media recognition (Vogue, Allure, Harper's Bazaar, Elle Korea, Marie Claire).
   - **Ingredient Bio-Mechanism**: Detailed scientific breakdown of pure NAD+, bio-identical EGF, and 5-Peptide Collagen.
   - **2-Week Ultrasound Biometrics**: Clinical data proof display with Cutometer® rebound statistics and micro-drop dosage protocol guide.
   - **Curated Best Sellers**: Filterable collection tabs (`All Formulations`, `Ampoules Only`, `Collagen Matrix`) with quick-add Ajax functionality.
   - **Doctor / Expert Endorsement**: Dr. Ji-Woo Song, M.D., Ph.D. clinical quote and verified safety stamps (100% Bio-identical, 0% Fragrance, pH 5.5).
   - **VIP Club Lead Magnet**: Instant discount generation form with animated confirmation.
   - **Trust & Compliance Bar**: Dermatologist Tested, K-FDA Approved, Hypoallergenic Certified.

3. **Live WYSIWYG Admin Control Panel**:
   - **Live Caption & Content Editor**: Edit announcement bar, hero titles, subheadings, descriptions, and main product prices (`PKR Rs.`) in real-time.
   - **Dynamic Product Creator & Catalog**: Add new clinical products with custom title, price, category, badge, and image directly from the UI, with immediate rendering into the product grid and Ajax cart.
   - **Section & Block Reordering**: Reorder sections dynamically (`↑` / `↓`) and toggle visibility (`Show / Hide`) live.
   - **Local Storage Persistence**: All edits and custom products are saved automatically and persist across reloads.
   - **Factory Reset**: Revert back to original default settings with one click.

4. **Ajax Cart Engine & Slide-Out Drawer**:
   - Dynamic real-time cart updating in PKR (`Rs.`) without full page reload.
   - Free expedited cold-chain delivery banner across Pakistan.
   - Toast notification alerts on cart additions and wishlist toggles.

5. **SEO & Rich Snippets (Schema.org)**:
   - Full Google Rich Snippet JSON-LD integration (`Product`, `AggregateRating`, `Offer`, `Organization`).
   - OpenGraph & Twitter Card metadata for maximum click-through rates.

---

## 📁 Directory Structure

```
├── assets/
│   ├── theme.css                  # Master CSS stylesheet (Crimson & Rose Quartz aesthetic)
│   ├── theme.js                   # Ajax cart drawer, wishlist, and filter logic
│   ├── hero_product.jpg           # Luxury red serum bottle asset
│   ├── hero_model.jpg             # High-fashion luxury model visual
│   ├── ingredient_breakdown.jpg   # Scientific poster callout visual
│   ├── doctor_portrait.jpg        # Dr. Ji-Woo Song medical portrait
│   ├── product_collagen.jpg       # Triple Collagen Cream 4.0 visual
│   ├── product_pore_pad.jpg       # Zero Pore Pad 2.0 visual
│   └── product_vita_c.jpg         # Deep Vita C Pure Ampoule visual
├── config/
│   ├── settings_schema.json       # Shopify visual customizer schema
│   └── settings_data.json         # Preset configurations
├── layout/
│   └── theme.liquid               # Master Liquid layout wrapper
├── locales/
│   └── en.default.json            # English translations & copywriting
├── sections/
│   ├── announcement-bar.liquid
│   ├── header.liquid
│   ├── hero-banner.liquid
│   ├── press-logos.liquid
│   ├── ingredient-breakdown.liquid
│   ├── clinical-results.liquid
│   ├── featured-collection.liquid
│   ├── doctor-endorsement.liquid
│   ├── vip-club.liquid
│   ├── trust-badges.liquid
│   ├── footer.liquid
│   └── main-product.liquid
├── snippets/
│   ├── meta-tags.liquid           # SEO & JSON-LD Structured Data
│   ├── product-card.liquid
│   └── cart-drawer.liquid
├── templates/
│   ├── index.json
│   ├── product.json
│   ├── collection.json
│   ├── cart.json
│   └── 404.json
├── index.html                     # Instant Local Live Preview file
└── README.md
```

---

## 🚀 How to Install / Upload to Shopify

### Option A: Upload directly as a `.zip` file into Shopify Admin
1. Select all the theme folders (`assets`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates`).
2. Right click -> Compress to ZIP file (name it `medicube-shopify-theme.zip`).
3. Go to your **Shopify Admin** -> **Online Store** -> **Themes**.
4. In the **Theme library** section, click **Add theme** -> **Upload zip file**.
5. Upload `medicube-shopify-theme.zip` and click **Publish**.

### Option B: Push to GitHub & Connect with Shopify
1. Initialize git in this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Medicube Clinical Shopify Theme"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/medicube-shopify-theme.git
   git push -u origin main
   ```
2. In **Shopify Admin** -> **Themes** -> **Add theme** -> **Connect from GitHub**.
3. Select your repository and branch (`main`). Shopify will automatically sync any new commits!

---

## 🌐 Local Live Preview
You can directly double-click `index.html` or open it with any web browser to test all animations, slide-out cart drawers, dosage steps, and responsive layouts locally before uploading.
