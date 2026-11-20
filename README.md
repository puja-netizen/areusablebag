# A Reusable Bag (areusablebag.com) - Modern Static Edition

Factory-direct wholesale website for **A Reusable Bag** (areusablebag.com), specializing in custom-printed reusable grocery totes, insulated thermal coolers, RPET recycled bags, and eco-friendly shopping carriers.

---

## 🎨 Branding & Color System

Extracted directly from the authentic logo (`assets/logo.png`):
- **Primary Red:** `#e91900`
- **Secondary Black:** `#000000`
- **Neutrals:** White (`#ffffff`) and neutral gray tints (`#f9fafb`, `#171717`, `#cbd5e1`)

---

## 🏗️ Architecture & Shared Layout

1. **Shared Header & Footer (`js/layout.js`)**:
   - The header and footer are declared once in `js/layout.js` and injected dynamically into `<div id="header-placeholder"></div>` and `<div id="footer-placeholder"></div>`.
   - **Compact Header:** Redesigned for a sleek, compact profile with the authentic brand logo, announcement topbar, and sample kit badge.
   - **Desktop Navigation Links (in strict order):**
     1. Products (`catalog.html`)
     2. Pricing (`pricing.html`)
     3. Try Our Free Sample (`free-sample.html`)
     4. Get Your Custom Quote (`quote.html`)
     5. Blog (`blog.html`)
     6. Contact Us (`contact.html`)
   - **Responsive Mobile Navigation:** Hamburger menu button with an animated toggle, sliding mobile navigation drawer, backdrop, keyboard `Escape` closing, and auto-closing on link selection.
   - **Active State Highlighting:** Automatically detects current page and highlights the active navigation item.

2. **100% Real WooCommerce Catalog (`convert_products.py`)**:
   - Generated directly from `wc-product-export-17-11-2026-1794918972885.csv`.
   - 318 authentic wholesale parent products (simple + variable).
   - Real downloaded product photography stored in `assets/products/`.
   - Re-runnable data pipeline outputs `products.json` and `js/products.js`.

---

## 🚀 How to Run Locally

Start a local HTTP server using Python:

```bash
# From the project root folder
python -m http.server 8080
```

Then open in your browser:
[http://localhost:8080](http://localhost:8080)

---

## 🔄 How to Regenerate Products from a New CSV Export

1. Export products from WooCommerce in CSV format.
2. Place the CSV file in the root directory (or update the filename in `convert_products.py`).
3. Run the conversion script:

```bash
python convert_products.py
```

This will:
- Parse all simple, variable, and variation rows.
- Link variations to parents by SKU.
- Download new product images to `assets/products/`.
- Regenerate `products.json` and `js/products.js`.
- Log any failed image downloads to `failed_image_downloads.txt`.

To verify site links and structure after regeneration:

```bash
python verify_site.py
```

---

## 📂 File Directory

```
areusablebag/
├── index.html              # Homepage with hero, 7 category tiles & trending products
├── catalog.html            # Complete 318-product catalog with search, filter & pagination
├── product-detail.html     # Real product details, variant selectors & pricing
├── pricing.html            # Wholesale tiered pricing guide & imprinting specs
├── free-sample.html        # Free physical sample kit request workflow
├── quote.html              # Custom quote (RFQ) generator with live calculator
├── blog.html               # Eco packaging industry articles & guides
├── reviews.html            # Verified buyer reviews & supermarket case studies
├── custom-printing.html    # Prepress specs: Screen Print vs Color Evolution
├── about.html              # Mission, PP #5 recyclability & factory direct details
├── contact.html            # Contact directory & interactive FAQ accordion
├── refund-returns.html     # Wholesale defect claims & return policies
├── privacy-policy.html     # Privacy policy & artwork protection
├── terms.html              # Wholesale ordering terms & production tolerances
├── css/
│   └── styles.css          # Design system (red/black variables, responsive layout)
├── js/
│   ├── layout.js           # Shared compact header, footer, & mobile nav
│   ├── products.js         # Real catalog dataset derived from WooCommerce CSV
│   ├── app.js              # State management, sample kit drawer, notifications
│   ├── catalog.js          # Catalog filtering, search, sorting & pagination
│   └── detail.js           # Product detail page renderer & variant handler
└── assets/
    ├── logo.png            # Authentic brand logo
    ├── favicon.png         # Site favicon
    └── products/           # Downloaded product photography
```
