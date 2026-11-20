/**
 * A Reusable Bag - Product Detail Page Controller
 * Renders authentic CSV product data, image gallery, variant selector, and pricing
 */

const ProductDetail = {
  product: null,
  selectedVariant: null,
  activeImageIndex: 0,

  init() {
    if (typeof PRODUCTS_DATA === 'undefined' || !PRODUCTS_DATA.length) {
      console.error('PRODUCTS_DATA not loaded');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    const id = urlParams.get('id');

    if (slug) {
      this.product = PRODUCTS_DATA.find(p => p.slug === slug);
    } else if (id) {
      this.product = PRODUCTS_DATA.find(p => p.id === id || p.sku === id);
    }

    // Fallback to first product if slug not found
    if (!this.product) {
      this.product = PRODUCTS_DATA[0];
    }

    if (this.product.variations && this.product.variations.length > 0) {
      this.selectedVariant = this.product.variations[0];
    }

    this.render();
  },

  render() {
    const p = this.product;
    if (!p) return;

    // Page title and meta
    document.title = `${p.name} | A Reusable Bag`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = `Buy custom printed ${p.name} (SKU: ${p.sku}) at factory direct wholesale prices. High quality eco-friendly reusable totes.`;
    }

    // Breadcrumbs
    const breadcrumbCat = document.getElementById('detail-breadcrumb-cat');
    const breadcrumbTitle = document.getElementById('detail-breadcrumb-title');
    const mainCategory = p.categories && p.categories.length ? p.categories[0] : 'Bags';
    if (breadcrumbCat) {
      breadcrumbCat.textContent = mainCategory;
      breadcrumbCat.href = `catalog.html?category=${encodeURIComponent(mainCategory)}`;
    }
    if (breadcrumbTitle) {
      breadcrumbTitle.textContent = p.name;
    }

    // Title and SKU
    const titleEl = document.getElementById('detail-product-title');
    if (titleEl) titleEl.textContent = p.name;

    const skuEl = document.getElementById('detail-product-sku');
    if (skuEl) skuEl.textContent = this.selectedVariant ? this.selectedVariant.sku || p.sku : p.sku;

    // Category badge
    const catEl = document.getElementById('detail-product-categories');
    if (catEl) {
      catEl.innerHTML = (p.categories || []).map(cat => 
        `<a href="catalog.html?category=${encodeURIComponent(cat)}" class="badge badge-dark" style="margin-right:0.35rem;">${cat}</a>`
      ).join('');
    }

    // Gallery Images
    this.renderGallery();

    // Pricing
    const priceBox = document.getElementById('detail-price-box');
    if (priceBox) {
      let currentPrice = p.displayPrice;
      if (this.selectedVariant && (this.selectedVariant.salePrice || this.selectedVariant.regularPrice)) {
        const val = this.selectedVariant.salePrice || this.selectedVariant.regularPrice;
        currentPrice = `$${parseFloat(val).toFixed(2)}`;
      }

      if (currentPrice) {
        priceBox.innerHTML = `
          <div style="font-size:0.8125rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.25rem;">
            Factory Wholesale Rate
          </div>
          <div style="font-size:2rem; font-weight:800; color:var(--primary); line-height:1.1;">
            ${currentPrice} <span style="font-size:0.875rem; font-weight:500; color:var(--text-muted);">wholesale base</span>
          </div>
          <div style="font-size:0.8125rem; color:var(--text-muted); margin-top:0.35rem;">
            Volume tier discounts available. Free physical sample kit on request.
          </div>
        `;
      } else {
        priceBox.innerHTML = `
          <div style="font-size:0.8125rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.25rem;">
            Wholesale Pricing
          </div>
          <div style="font-size:1.5rem; font-weight:800; color:var(--text-main); line-height:1.1;">
            Pricing Upon Request
          </div>
          <div style="font-size:0.8125rem; color:var(--text-muted); margin-top:0.35rem;">
            Contact us for instant volume pricing and custom printing estimates.
          </div>
        `;
      }
    }

    // Action links
    const quoteBtn = document.getElementById('detail-quote-btn');
    if (quoteBtn) {
      quoteBtn.href = `quote.html?product=${encodeURIComponent(p.slug)}`;
    }

    const sampleBtn = document.getElementById('detail-sample-btn');
    if (sampleBtn) {
      sampleBtn.onclick = () => {
        const colorName = this.selectedVariant ? this.getVariantColorName(this.selectedVariant) : null;
        App.addSample(p.slug, colorName);
      };
    }

    // Variant Selector
    this.renderVariants();

    // Descriptions & Specifications
    this.renderDescriptions();
  },

  renderGallery() {
    const mainImgEl = document.getElementById('detail-main-img');
    const thumbContainer = document.getElementById('detail-thumbnails');
    if (!mainImgEl) return;

    let images = (this.product.images && this.product.images.length) ? this.product.images : ['assets/logo.png'];
    
    // If variant has an image, put it upfront
    if (this.selectedVariant && this.selectedVariant.images && this.selectedVariant.images.length) {
      const vImg = this.selectedVariant.images[0];
      if (!images.includes(vImg)) {
        images = [vImg, ...images];
      } else {
        this.activeImageIndex = images.indexOf(vImg);
      }
    }

    if (this.activeImageIndex >= images.length) {
      this.activeImageIndex = 0;
    }

    mainImgEl.src = images[this.activeImageIndex];
    mainImgEl.alt = this.product.name;
    mainImgEl.onerror = () => { mainImgEl.src = 'assets/logo.png'; };

    if (thumbContainer) {
      if (images.length > 1) {
        thumbContainer.innerHTML = images.map((img, idx) => `
          <button class="gallery-thumb-btn ${idx === this.activeImageIndex ? 'active' : ''}" data-idx="${idx}" style="border: 2px solid ${idx === this.activeImageIndex ? 'var(--primary)' : 'var(--border)'}; border-radius: var(--radius-sm); padding: 4px; background:#fff; cursor:pointer; width:68px; height:68px; display:inline-flex; align-items:center; justify-content:center;">
            <img src="${img}" alt="${this.product.name} view ${idx+1}" style="max-height:100%; max-width:100%; object-fit:contain;" onerror="this.src='assets/logo.png'">
          </button>
        `).join('');

        thumbContainer.querySelectorAll('.gallery-thumb-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            this.activeImageIndex = parseInt(btn.getAttribute('data-idx'));
            this.renderGallery();
          });
        });
        thumbContainer.style.display = 'flex';
      } else {
        thumbContainer.innerHTML = '';
        thumbContainer.style.display = 'none';
      }
    }
  },

  getVariantColorName(variant) {
    if (!variant || !variant.attributes) return 'Default';
    for (const a of variant.attributes) {
      if (a.name.toLowerCase().includes('color') || a.name.toLowerCase().includes('bag')) {
        return a.value;
      }
    }
    return variant.attributes[0] ? variant.attributes[0].value : 'Default';
  },

  renderVariants() {
    const container = document.getElementById('detail-variants-container');
    if (!container) return;

    const variants = this.product.variations || [];
    if (variants.length === 0) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    const selectedColor = this.selectedVariant ? this.getVariantColorName(this.selectedVariant) : 'Default';

    let html = `
      <div style="margin-bottom:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
          <label style="font-size:0.875rem; font-weight:700;">
            Select Color / Option: <span style="color:var(--primary); font-weight:800;" id="detail-active-color-name">${selectedColor}</span>
          </label>
          <span style="font-size:0.75rem; color:var(--text-muted);">${variants.length} available</span>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:0.5rem;" id="detail-variant-buttons">
    `;

    variants.forEach(v => {
      const cName = this.getVariantColorName(v);
      const isSelected = this.selectedVariant && this.selectedVariant.id === v.id;
      html += `
        <button class="variant-pill-btn ${isSelected ? 'active' : ''}" data-vid="${v.id}" style="padding:0.4rem 0.85rem; border-radius:var(--radius-sm); border:1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}; background:${isSelected ? 'var(--primary-light)' : '#ffffff'}; color:${isSelected ? 'var(--primary)' : 'var(--text-main)'}; font-size:0.8125rem; font-weight:${isSelected ? '700' : '500'}; cursor:pointer;">
          ${cName}
        </button>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;

    container.querySelectorAll('.variant-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vid = btn.getAttribute('data-vid');
        this.selectedVariant = variants.find(v => v.id === vid) || variants[0];
        this.activeImageIndex = 0;
        this.render();
      });
    });
  },

  renderDescriptions() {
    const descContainer = document.getElementById('detail-description-container');
    if (!descContainer) return;

    let contentHtml = '';

    // If shortDescription has WooCommerce price chart / tabs HTML
    if (this.product.shortDescription) {
      contentHtml += `
        <div class="product-wc-specs" style="margin-bottom:2rem;">
          ${this.product.shortDescription}
        </div>
      `;
    }

    // Additional full description
    if (this.product.description && !this.product.description.includes('rq-popup-btn')) {
      contentHtml += `
        <div style="margin-top:1.5rem; line-height:1.7;">
          <h4 style="font-size:1.15rem; font-weight:700; margin-bottom:0.75rem;">Product Overview</h4>
          <div>${this.product.description}</div>
        </div>
      `;
    }

    if (!contentHtml.trim()) {
      contentHtml = `
        <p style="color:var(--text-muted);">
          High-performance reusable tote bag manufactured with durable materials for retail, supermarket grocery, and custom brand promotional merchandise. Custom printing available with screen print spot colors or full-color Color Evolution digital heat transfer.
        </p>
      `;
    }

    descContainer.innerHTML = contentHtml;

    // Unhide tabs content if hidden by style="display: none;" in WooCommerce export
    descContainer.querySelectorAll('.content-text').forEach(el => {
      el.style.display = 'block';
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ProductDetail.init();
});
