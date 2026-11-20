/**
 * A Reusable Bag - Live Pricing Calculator & Bag Mockup Customizer
 */

const BagCalculator = {
  product: null,
  quantity: 500,
  printMethod: 'screen1', // 'screen1', 'screen2', 'fullColor'
  printSides: 1, // 1 or 2
  selectedColor: null,

  init(productId = 'hd-y2k-tote') {
    // Check URL param if on product-detail.html
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') || productId;

    this.product = PRODUCTS_DATA.find(p => p.id === id) || PRODUCTS_DATA[0];
    this.selectedColor = this.product.colors[0];

    this.renderProductHeader();
    this.renderSwatches();
    this.setupListeners();
    this.recalculate();
  },

  renderProductHeader() {
    const titleEl = document.getElementById('calc-product-title');
    const badgeEl = document.getElementById('calc-product-badge');
    const descEl = document.getElementById('calc-product-desc');
    const specsEl = document.getElementById('calc-product-specs');
    const heroImgEl = document.getElementById('calc-product-img');

    if (titleEl) titleEl.textContent = this.product.name;
    if (badgeEl) {
      badgeEl.textContent = this.product.badge;
      badgeEl.className = `badge badge-${this.product.badgeType}`;
    }
    if (descEl) descEl.textContent = this.product.description;

    if (heroImgEl) {
      heroImgEl.src = this.product.image;
      heroImgEl.alt = this.product.name;
    }

    if (specsEl) {
      specsEl.innerHTML = `
        <div class="summary-row"><span>Material</span><strong>${this.product.material}</strong></div>
        <div class="summary-row"><span>Dimensions</span><strong>${this.product.dimensions}</strong></div>
        <div class="summary-row"><span>Handles</span><strong>${this.product.handles}</strong></div>
        <div class="summary-row"><span>Imprint Dimensions</span><strong>${this.product.imprintArea}</strong></div>
        <div class="summary-row"><span>Case Pack</span><strong>${this.product.casePack} bags/box</strong></div>
        <div class="summary-row"><span>Standard Production</span><strong>${this.product.turnaround}</strong></div>
      `;
    }
  },

  renderSwatches() {
    const container = document.getElementById('swatch-container');
    const colorLabel = document.getElementById('selected-color-label');
    if (!container) return;

    container.innerHTML = '';
    this.product.colors.forEach((color, idx) => {
      const btn = document.createElement('button');
      btn.className = `swatch-btn ${idx === 0 ? 'active' : ''}`;
      btn.style.backgroundColor = color.hex;
      btn.title = color.name;
      btn.setAttribute('aria-label', color.name);

      btn.addEventListener('click', () => {
        container.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedColor = color;
        if (colorLabel) colorLabel.textContent = color.name;
        this.updateBagColor(color.hex);
      });

      container.appendChild(btn);
    });

    if (colorLabel) colorLabel.textContent = this.selectedColor.name;
    this.updateBagColor(this.selectedColor.hex);
  },

  updateBagColor(hex) {
    const mockupDisplay = document.getElementById('interactive-bag-svg-container');
    if (!mockupDisplay) return;

    // Apply color tint or SVG replacement
    const svgBody = mockupDisplay.querySelector('.bag-body');
    const svgHandles = mockupDisplay.querySelectorAll('.bag-handle');
    const svgGusset = mockupDisplay.querySelector('.bag-gusset');

    if (svgBody) {
      svgBody.setAttribute('fill', hex);
    }
    if (svgHandles) {
      svgHandles.forEach(h => h.setAttribute('stroke', this.adjustBrightness(hex, -25)));
    }
    if (svgGusset) {
      svgGusset.setAttribute('fill', this.adjustBrightness(hex, -40));
    }
  },

  adjustBrightness(hex, percent) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const num = parseInt(hex, 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00FF) + percent;
    let b = (num & 0x0000FF) + percent;
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return '#' + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  },

  setupListeners() {
    const slider = document.getElementById('calc-qty-slider');
    const input = document.getElementById('calc-qty-input');
    const pills = document.querySelectorAll('.qty-pill');

    if (slider && input) {
      slider.addEventListener('input', (e) => {
        this.quantity = parseInt(e.target.value) || 100;
        input.value = this.quantity;
        this.updateQtyPills();
        this.recalculate();
      });

      input.addEventListener('input', (e) => {
        let val = parseInt(e.target.value) || 100;
        if (val < 100) val = 100;
        this.quantity = val;
        slider.value = Math.min(val, 5000);
        this.updateQtyPills();
        this.recalculate();
      });
    }

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const qty = parseInt(pill.getAttribute('data-qty'));
        this.quantity = qty;
        if (slider) slider.value = Math.min(qty, 5000);
        if (input) input.value = qty;
        this.updateQtyPills();
        this.recalculate();
      });
    });

    // Imprint Option Cards
    const imprintCards = document.querySelectorAll('.imprint-option-card');
    imprintCards.forEach(card => {
      card.addEventListener('click', () => {
        imprintCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.printMethod = card.getAttribute('data-method');
        this.recalculate();
      });
    });

    // Print Sides Option
    const sidesCards = document.querySelectorAll('.sides-option-card');
    sidesCards.forEach(card => {
      card.addEventListener('click', () => {
        sidesCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.printSides = parseInt(card.getAttribute('data-sides')) || 1;
        this.recalculate();
      });
    });

    // Mockup custom text input
    const textInput = document.getElementById('mockup-custom-text');
    const previewText = document.getElementById('mockup-rendered-text');
    if (textInput && previewText) {
      textInput.addEventListener('input', (e) => {
        previewText.textContent = e.target.value.trim().toUpperCase() || 'YOUR LOGO';
      });
    }

    // Mockup logo upload simulator
    const logoFile = document.getElementById('mockup-logo-upload');
    const overlayImg = document.getElementById('mockup-rendered-logo');
    if (logoFile && overlayImg) {
      logoFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (re) => {
            overlayImg.src = re.target.result;
            overlayImg.style.display = 'block';
            if (previewText) previewText.style.display = 'none';
          };
          reader.readAsDataURL(file);
        }
      });
    }
  },

  updateQtyPills() {
    const pills = document.querySelectorAll('.qty-pill');
    pills.forEach(p => {
      const q = parseInt(p.getAttribute('data-qty'));
      if (q === this.quantity) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  },

  recalculate() {
    if (!this.product || !this.product.pricing) return;

    // Find applicable tier
    let unitRate = this.product.pricing[0][this.printMethod];
    for (let i = this.product.pricing.length - 1; i >= 0; i--) {
      if (this.quantity >= this.product.pricing[i].tier) {
        unitRate = this.product.pricing[i][this.printMethod];
        break;
      }
    }

    // Additional side imprint charge
    let sideMultiplier = 1.0;
    if (this.printSides === 2) {
      unitRate += (this.printMethod === 'fullColor' ? 0.75 : 0.35);
    }

    // Setup fee: FREE on 500+ units, else $45 standard
    const isFreeSetup = this.quantity >= 500;
    const setupFee = isFreeSetup ? 0 : 45.00;

    const subtotal = (unitRate * this.quantity);
    const total = subtotal + setupFee;

    // Case packs calculation
    const cases = Math.ceil(this.quantity / this.product.casePack);

    // Turnaround time
    const leadTime = this.printMethod === 'fullColor' ? '10 Business Days' : '5 Business Days';

    // DOM updates
    const unitPriceEl = document.getElementById('calc-unit-price');
    const subtotalEl = document.getElementById('calc-subtotal');
    const setupFeeEl = document.getElementById('calc-setup-fee');
    const totalEl = document.getElementById('calc-grand-total');
    const casesEl = document.getElementById('calc-cases-count');
    const turnaroundEl = document.getElementById('calc-turnaround');

    if (unitPriceEl) unitPriceEl.textContent = `$${unitRate.toFixed(2)}`;
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    if (setupFeeEl) {
      if (isFreeSetup) {
        setupFeeEl.innerHTML = `<span style="color:#86efac; font-weight:700;">FREE ($0)</span> <span style="font-size:0.75rem; color:#94a3b8; text-decoration:line-through;">$45.00</span>`;
      } else {
        setupFeeEl.textContent = `$${setupFee.toFixed(2)}`;
      }
    }

    if (totalEl) totalEl.textContent = `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (casesEl) casesEl.textContent = `${cases} case${cases > 1 ? 's' : ''} (${this.product.casePack}/case)`;
    if (turnaroundEl) turnaroundEl.textContent = leadTime;
  },

  addToQuoteRequest() {
    const params = new URLSearchParams({
      bag: this.product.id,
      qty: this.quantity,
      color: this.selectedColor.name,
      method: this.printMethod,
      sides: this.printSides
    });
    window.location.href = `quote.html?${params.toString()}`;
  }
};
