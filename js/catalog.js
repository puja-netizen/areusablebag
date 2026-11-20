/**
 * A Reusable Bag - Catalog Filter, Search, and Pagination Renderer
 * Built for 100% real WooCommerce catalog data
 */

const Catalog = {
  currentCategory: 'all',
  searchQuery: '',
  sortBy: 'featured',
  pageSize: 24,
  displayedCount: 24,

  init() {
    this.setupCategoryPills();
    this.setupFilters();
    this.render();
  },

  setupCategoryPills() {
    const container = document.getElementById('catalog-category-filters');
    if (!container || typeof PRODUCTS_DATA === 'undefined') return;

    // Collect all unique categories from products
    const catCounts = {};
    PRODUCTS_DATA.forEach(p => {
      (p.categories || []).forEach(cat => {
        catCounts[cat] = (catCounts[cat] || 0) + 1;
      });
    });

    // Sort categories by frequency
    const sortedCats = Object.keys(catCounts).sort((a, b) => catCounts[b] - catCounts[a]);

    // Build category buttons
    let html = `<button class="cat-filter-btn active" data-cat="all">All Bags (${PRODUCTS_DATA.length})</button>`;
    sortedCats.forEach(cat => {
      html += `<button class="cat-filter-btn" data-cat="${encodeURIComponent(cat)}">${cat} (${catCounts[cat]})</button>`;
    });

    container.innerHTML = html;

    // Check URL param
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam) {
      this.currentCategory = decodeURIComponent(catParam);
    }
  },

  setupFilters() {
    const searchInput = document.getElementById('catalog-search-input');
    const clearSearch = document.getElementById('clear-search-btn');
    const sortSelect = document.getElementById('catalog-sort-select');
    const container = document.getElementById('catalog-category-filters');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.displayedCount = this.pageSize;
        if (clearSearch) clearSearch.style.display = this.searchQuery ? 'block' : 'none';
        this.render();
      });
    }

    if (clearSearch && searchInput) {
      clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        this.searchQuery = '';
        this.displayedCount = this.pageSize;
        clearSearch.style.display = 'none';
        this.render();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.displayedCount = this.pageSize;
        this.render();
      });
    }

    if (container) {
      container.addEventListener('click', (e) => {
        const btn = e.target.closest('.cat-filter-btn');
        if (!btn) return;
        container.querySelectorAll('.cat-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const rawCat = btn.getAttribute('data-cat');
        this.currentCategory = rawCat === 'all' ? 'all' : decodeURIComponent(rawCat);
        this.displayedCount = this.pageSize;
        this.render();
      });
    }

    // Set initial active pill if category in URL
    if (this.currentCategory !== 'all' && container) {
      const matchPill = container.querySelector(`.cat-filter-btn[data-cat="${encodeURIComponent(this.currentCategory)}"]`);
      if (matchPill) {
        container.querySelectorAll('.cat-filter-btn').forEach(b => b.classList.remove('active'));
        matchPill.classList.add('active');
      }
    }
  },

  getFilteredProducts() {
    if (typeof PRODUCTS_DATA === 'undefined') return [];

    return PRODUCTS_DATA.filter(product => {
      // Category match
      if (this.currentCategory !== 'all') {
        const productCats = (product.categories || []).map(c => c.toLowerCase());
        const target = this.currentCategory.toLowerCase();
        const matchesCategory = productCats.some(c => c === target || c.includes(target) || target.includes(c));
        if (!matchesCategory) return false;
      }

      // Search match
      if (this.searchQuery) {
        const haystack = `${product.name} ${product.sku} ${(product.categories || []).join(' ')} ${product.shortDescription || ''}`.toLowerCase();
        if (!haystack.includes(this.searchQuery)) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.price !== null ? a.price : 999999;
      const priceB = b.price !== null ? b.price : 999999;

      if (this.sortBy === 'price-asc') return priceA - priceB;
      if (this.sortBy === 'price-desc') return priceB - priceA;
      if (this.sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0; // default order matches CSV
    });
  },

  render() {
    const grid = document.getElementById('catalog-product-grid');
    const countEl = document.getElementById('catalog-results-count');
    const emptyState = document.getElementById('catalog-empty-state');
    const loadMoreContainer = document.getElementById('catalog-pagination-wrap');

    if (!grid) return;

    const filtered = this.getFilteredProducts();

    if (countEl) {
      countEl.textContent = `Showing ${Math.min(this.displayedCount, filtered.length)} of ${filtered.length} products (${PRODUCTS_DATA.length} total in catalog)`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      if (loadMoreContainer) loadMoreContainer.innerHTML = '';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    const itemsToRender = filtered.slice(0, this.displayedCount);

    let html = '';
    itemsToRender.forEach(product => {
      const imgPath = product.image || (product.images && product.images[0]) || 'assets/logo.png';
      const categoryTag = (product.categories && product.categories.length) ? product.categories[0] : 'Wholesale Bag';
      
      const priceHtml = product.displayPrice 
        ? `<div class="price-val">${product.displayPrice} <span style="font-size:0.75rem; font-weight:500; color:var(--text-muted);">wholesale</span></div>`
        : `<div class="price-val"><a href="quote.html?product=${encodeURIComponent(product.slug)}" style="color:var(--primary); font-size:0.875rem; font-weight:700; text-decoration:underline;">Request a quote</a></div>`;

      const variantCount = product.variations ? product.variations.length : 0;
      const variantNotice = variantCount > 0 
        ? `<span style="font-size:0.75rem; color:var(--text-muted);">${variantCount} color options</span>`
        : `<span style="font-size:0.75rem; color:var(--text-muted);">Standard finish</span>`;

      html += `
        <div class="product-card">
          <div class="product-badge-wrap">
            <span class="badge badge-dark">SKU: ${product.sku}</span>
          </div>
          <a href="product-detail.html?slug=${product.slug}" class="product-img-wrap" aria-label="${product.name}">
            <img src="${imgPath}" alt="${product.name}" loading="lazy" onerror="this.onerror=null; this.src='assets/logo.png';">
          </a>
          <div class="product-content">
            <div class="product-category-tag">${categoryTag}</div>
            <h3 class="product-title">
              <a href="product-detail.html?slug=${product.slug}">${product.name}</a>
            </h3>

            <div style="margin: 0.5rem 0; display:flex; justify-content:space-between; align-items:center;">
              ${variantNotice}
              <span style="font-size:0.75rem; color:var(--primary); font-weight:600;">Direct Factory</span>
            </div>

            <div class="product-pricing-box">
              <div>
                <div class="price-unit">Wholesale Tier Rate</div>
                ${priceHtml}
              </div>
            </div>

            <div class="product-actions">
              <a href="product-detail.html?slug=${product.slug}" class="btn btn-primary btn-sm">View Details</a>
              <button class="btn btn-outline btn-sm" onclick="App.addSample('${product.slug}')">+ Free Sample</button>
            </div>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;

    // Load More pagination
    if (loadMoreContainer) {
      if (this.displayedCount < filtered.length) {
        const remaining = filtered.length - this.displayedCount;
        loadMoreContainer.innerHTML = `
          <button class="btn btn-outline" id="load-more-btn" style="padding:0.75rem 2rem; font-weight:700; font-size:0.95rem;">
            Load More Products (${remaining} remaining)
          </button>
        `;
        document.getElementById('load-more-btn').addEventListener('click', () => {
          this.displayedCount += this.pageSize;
          this.render();
        });
      } else {
        loadMoreContainer.innerHTML = `
          <div style="font-size:0.875rem; color:var(--text-muted); font-weight:600;">
            ✓ Showing all ${filtered.length} products
          </div>
        `;
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Catalog.init();
});
