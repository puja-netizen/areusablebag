/**
 * layout.js - Dynamic Shared Header, Compact Navigation & Shared Footer
 * areusablebag.com
 * 
 * - Injects compact, red-and-black themed header into #header-placeholder
 * - Injects rich, consistent footer into #footer-placeholder
 * - Provides responsive mobile navigation (hamburger menu)
 * - Automatically sets active link based on current page URL
 */

(function () {
  'use strict';

  // Determine current active page
  const pathname = window.location.pathname.toLowerCase();
  const filename = pathname.substring(pathname.lastIndexOf('/') + 1) || 'index.html';

  function getActiveNav(file) {
    if (file === 'index.html' || file === '' || file === '/') return 'home';
    if (file === 'catalog.html' || file === 'product-detail.html') return 'products';
    if (file === 'pricing.html') return 'pricing';
    if (file === 'free-sample.html') return 'sample';
    if (file === 'quote.html') return 'quote';
    if (file === 'blog.html') return 'blog';
    if (file === 'contact.html') return 'contact';
    return '';
  }

  const activeNav = getActiveNav(filename);

  // Compact Header Template
  function createHeaderHTML() {
    const isAct = (key) => (activeNav === key ? ' active' : '');

    return `
    <!-- Compact Top Announcement Bar -->
    <aside class="compact-topbar" aria-label="Announcement">
      <div class="container compact-topbar-inner">
        <div class="topbar-msg">
          <span>🌱</span>
          <span>Factory Direct Reusable Bags • 100% Recyclable Polypropylene (#5)</span>
        </div>
        <div class="topbar-actions">
          <a href="tel:18005552247" class="topbar-link">📞 (800) 555-BAGS</a>
          <span class="topbar-sep">•</span>
          <a href="mailto:sales@areusablebag.com" class="topbar-link">✉️ sales@areusablebag.com</a>
        </div>
      </div>
    </aside>

    <!-- Compact Main Header -->
    <header class="site-header compact-header" role="banner">
      <div class="container header-inner">
        <!-- Brand Logo -->
        <a href="index.html" class="brand-logo" aria-label="A Reusable Bag Home">
          <img src="assets/logo.png" alt="A Reusable Bag" width="160" height="36" style="height:34px; width:auto; display:block;">
        </a>

        <!-- Desktop Navigation: Home included, in required sequence -->
        <nav class="desktop-nav" aria-label="Main Navigation">
          <ul class="nav-links">
            <li><a href="index.html" class="nav-link${isAct('home')}">Home</a></li>
            <li><a href="catalog.html" class="nav-link${isAct('products')}">Products</a></li>
            <li><a href="pricing.html" class="nav-link${isAct('pricing')}">Pricing</a></li>
            <li><a href="free-sample.html" class="nav-link${isAct('sample')}">Try Our Free Sample</a></li>
            <li><a href="quote.html" class="nav-link${isAct('quote')}">Get Your Custom Quote</a></li>
            <li><a href="blog.html" class="nav-link${isAct('blog')}">Blog</a></li>
            <li><a href="contact.html" class="nav-link${isAct('contact')}">Contact Us</a></li>
          </ul>
        </nav>

        <!-- Header Actions: Clean Quick Quote button & Mobile toggle (No samples 0 button) -->
        <div class="header-actions">
          <a href="quote.html" class="btn btn-primary btn-sm header-quote-btn">Quick Quote</a>

          <!-- Mobile Hamburger Toggle -->
          <button class="mobile-toggle" id="mobile-toggle-btn" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mobile-nav-drawer">
            <span class="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      <!-- Responsive Mobile Navigation Drawer -->
      <div class="mobile-nav-drawer hidden" id="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
        <div class="mobile-nav-inner">
          <ul class="mobile-nav-list">
            <li><a href="index.html" class="mobile-nav-link${isAct('home')}">Home</a></li>
            <li><a href="catalog.html" class="mobile-nav-link${isAct('products')}">Products</a></li>
            <li><a href="pricing.html" class="mobile-nav-link${isAct('pricing')}">Pricing</a></li>
            <li><a href="free-sample.html" class="mobile-nav-link${isAct('sample')}">Try Our Free Sample</a></li>
            <li><a href="quote.html" class="mobile-nav-link${isAct('quote')}">Get Your Custom Quote</a></li>
            <li><a href="blog.html" class="mobile-nav-link${isAct('blog')}">Blog</a></li>
            <li><a href="contact.html" class="mobile-nav-link${isAct('contact')}">Contact Us</a></li>
          </ul>

          <div class="mobile-nav-footer">
            <a href="quote.html" class="btn btn-primary" style="width:100%; text-align:center;">Request a Quote</a>
            <div class="mobile-contact-info">
              <div>📞 <a href="tel:18005552247">(800) 555-BAGS</a></div>
              <div>✉️ <a href="mailto:sales@areusablebag.com">sales@areusablebag.com</a></div>
            </div>
          </div>
        </div>
      </div>
    </header>
    `;
  }

  // Shared Footer Template
  function createFooterHTML() {
    return `
    <footer class="site-footer" role="contentinfo">
      <div class="container">
        <div class="footer-grid">
          <!-- Col 1: Brand & Contact -->
          <div class="footer-col brand-col">
            <a href="index.html" class="footer-logo-link" aria-label="A Reusable Bag Home">
              <img src="assets/logo.png" alt="A Reusable Bag" width="160" height="36" style="filter:brightness(0) invert(1); height:34px; width:auto; margin-bottom:1rem; display:block;">
            </a>
            <p class="footer-blurb">
              Factory direct custom printed reusable grocery totes, insulated thermal coolers, and RPET shopping carriers. 100% recyclable polypropylene (#5) engineered for supermarket durability.
            </p>
            <div class="footer-direct-contact">
              <div>📞 Toll-Free: <a href="tel:18005552247" style="color:#ffffff; font-weight:700;">(800) 555-BAGS</a></div>
              <div>✉️ Orders: <a href="mailto:sales@areusablebag.com" style="color:#ffffff;">sales@areusablebag.com</a></div>
              <div style="margin-top:0.35rem; color:#a3a3a3; font-size:0.75rem;">Fast 5-Day Rush Production Available</div>
            </div>
          </div>

          <!-- Col 2: Products & Categories -->
          <div class="footer-col">
            <h4 class="footer-title">Product Catalog</h4>
            <ul class="footer-links">
              <li><a href="catalog.html?category=TOTES">Grocery &amp; Shopping Totes</a></li>
              <li><a href="catalog.html?category=INSULATED">Insulated Cooler Bags</a></li>
              <li><a href="catalog.html?category=WINE">Wine Totes &amp; Bottle Carriers</a></li>
              <li><a href="catalog.html?category=P.E.T%20%26%20R-P.E.T%20Bags">RPET Recycled Bags</a></li>
              <li><a href="catalog.html?category=COTTON%2FJUTE">Cotton &amp; Jute Totes</a></li>
              <li><a href="catalog.html">View All Products (318 Bags)</a></li>
            </ul>
          </div>

          <!-- Col 3: Quick Navigation -->
          <div class="footer-col">
            <h4 class="footer-title">Wholesale &amp; Quotes</h4>
            <ul class="footer-links">
              <li><a href="index.html">Home</a></li>
              <li><a href="catalog.html">Products</a></li>
              <li><a href="pricing.html">Pricing Guide</a></li>
              <li><a href="free-sample.html">Free Sample</a></li>
              <li><a href="quote.html">Get Your Custom Quote</a></li>
              <li><a href="reviews.html">Client Reviews</a></li>
              <li><a href="blog.html">Industry Blog</a></li>
            </ul>
          </div>

          <!-- Col 4: Support & Legal -->
          <div class="footer-col">
            <h4 class="footer-title">Company &amp; Legal</h4>
            <ul class="footer-links">
              <li><a href="about.html">About Us &amp; Sustainability</a></li>
              <li><a href="custom-printing.html">Custom Printing Specs</a></li>
              <li><a href="contact.html">Contact Us</a></li>
              <li><a href="refund-returns.html">Refund and Returns Policy</a></li>
              <li><a href="privacy-policy.html">Privacy Policy</a></li>
              <li><a href="terms.html">Terms and Conditions</a></li>
            </ul>
          </div>
        </div>

        <!-- Footer Bottom Bar -->
        <div class="footer-bottom">
          <p>&copy; 2026 A Reusable Bag (areusablebag.com). All rights reserved. Wholesale Custom Reusable Bags.</p>
          <div class="footer-badges">
            <span>🌱 100% Recyclable Polypropylene (#5)</span>
            <span>•</span>
            <span>🇺🇸 Fast Nationwide Shipping</span>
          </div>
        </div>
      </div>
    </footer>
    `;
  }

  // Compact Header & Mobile Navigation Styles
  function injectLayoutStyles() {
    if (document.getElementById('layout-styles')) return;

    const style = document.createElement('style');
    style.id = 'layout-styles';
    style.textContent = `
      /* ========================================================
         COMPACT HEADER & RED-AND-BLACK BRANDING
         ======================================================== */
      :root {
        --header-height: 3.5rem;
      }

      /* Compact Top Bar */
      .compact-topbar {
        background-color: #000000;
        color: #e2e8f0;
        font-size: 0.75rem;
        padding: 0.35rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        letter-spacing: 0.2px;
      }
      .compact-topbar-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      .topbar-msg {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-weight: 500;
      }
      .topbar-actions {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
      }
      .topbar-link {
        color: #e2e8f0;
        text-decoration: none;
        transition: color 0.15s ease;
      }
      .topbar-link:hover {
        color: var(--primary, #e91900);
      }
      .topbar-sep {
        color: rgba(255, 255, 255, 0.3);
      }

      /* Compact Main Header */
      .compact-header {
        position: sticky;
        top: 0;
        z-index: 100;
        background-color: #ffffff;
        border-bottom: 2px solid var(--primary, #e91900);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }
      .compact-header .header-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: var(--header-height);
        gap: 1rem;
      }

      /* Brand Logo */
      .brand-logo {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        flex-shrink: 0;
      }
      .brand-logo img {
        height: 32px;
        width: auto;
        display: block;
      }

      /* Desktop Nav */
      .desktop-nav {
        display: flex;
        align-items: center;
        flex: 1;
        justify-content: center;
      }
      .desktop-nav .nav-links {
        display: flex;
        align-items: center;
        gap: 1.15rem;
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .desktop-nav .nav-link {
        font-size: 0.85rem;
        font-weight: 600;
        color: #171717;
        text-decoration: none;
        padding: 0.4rem 0.15rem;
        position: relative;
        transition: color 0.15s ease;
        white-space: nowrap;
      }
      .desktop-nav .nav-link:hover {
        color: var(--primary, #e91900);
      }
      .desktop-nav .nav-link.active {
        color: var(--primary, #e91900);
      }
      .desktop-nav .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--primary, #e91900);
        border-radius: 2px;
      }

      /* Header Actions */
      .header-actions {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        flex-shrink: 0;
      }
      .header-quote-btn {
        font-size: 0.8125rem;
        padding: 0.4rem 0.85rem;
      }

      /* Hamburger Menu Button */
      .mobile-toggle {
        display: none;
        background: transparent;
        border: 1px solid #e5e7eb;
        border-radius: var(--radius-sm, 6px);
        padding: 0.4rem;
        cursor: pointer;
        color: #171717;
        transition: all 0.15s ease;
        align-items: center;
        justify-content: center;
      }
      .mobile-toggle:hover {
        border-color: var(--primary, #e91900);
        color: var(--primary, #e91900);
      }
      .hamburger-icon {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 20px;
        height: 15px;
      }
      .hamburger-icon span {
        display: block;
        height: 2px;
        width: 100%;
        background-color: currentColor;
        border-radius: 2px;
        transition: all 0.2s ease;
      }
      .mobile-toggle.active .hamburger-icon span:nth-child(1) {
        transform: translateY(6.5px) rotate(45deg);
      }
      .mobile-toggle.active .hamburger-icon span:nth-child(2) {
        opacity: 0;
      }
      .mobile-toggle.active .hamburger-icon span:nth-child(3) {
        transform: translateY(-6.5px) rotate(-45deg);
      }

      /* Mobile Navigation Drawer */
      .mobile-nav-drawer {
        display: none;
        position: fixed;
        top: calc(var(--header-height) + 1.85rem);
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.45);
        z-index: 99;
        backdrop-filter: blur(2px);
      }
      .mobile-nav-drawer.active {
        display: block;
      }
      .mobile-nav-drawer.hidden {
        display: none !important;
      }
      .mobile-nav-inner {
        background-color: #ffffff;
        border-bottom: 3px solid var(--primary, #e91900);
        padding: 1.5rem 1.25rem;
        max-height: calc(100vh - 5rem);
        overflow-y: auto;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        animation: slideDownNav 0.2s ease;
      }
      @keyframes slideDownNav {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .mobile-nav-list {
        list-style: none;
        margin: 0 0 1.25rem 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .mobile-nav-link {
        display: block;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        font-weight: 600;
        color: #171717;
        text-decoration: none;
        border-radius: 6px;
        transition: all 0.15s ease;
      }
      .mobile-nav-link:hover, .mobile-nav-link.active {
        background-color: #000000;
        color: #ffffff;
        padding-left: 1.25rem;
      }
      .mobile-nav-footer {
        padding-top: 1rem;
        border-top: 1px solid #f3f4f6;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .mobile-contact-info {
        font-size: 0.8125rem;
        color: #6b7280;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .mobile-contact-info a {
        color: #171717;
        text-decoration: none;
        font-weight: 600;
      }

      /* Media Query for Mobile / Tablet */
      @media (max-width: 1024px) {
        .desktop-nav {
          display: none;
        }
        .mobile-toggle {
          display: inline-flex;
        }
      }
      @media (max-width: 600px) {
        .compact-topbar {
          display: none;
        }
        .mobile-nav-drawer {
          top: var(--header-height);
        }
      }

      /* Shared Footer Enhancements */
      .site-footer {
        background-color: #000000;
        color: #cbd5e1;
        padding: 3.5rem 0 1.75rem 0;
        border-top: 3px solid var(--primary, #e91900);
      }
      .site-footer .footer-title {
        color: #ffffff;
        font-size: 0.9375rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 1rem;
      }
      .site-footer .footer-links a {
        color: #94a3b8;
        font-size: 0.875rem;
        line-height: 1.6;
        text-decoration: none;
        transition: color 0.15s ease;
      }
      .site-footer .footer-links a:hover {
        color: #ffffff;
        padding-left: 2px;
      }
      .footer-blurb {
        font-size: 0.84rem;
        color: #94a3b8;
        line-height: 1.6;
        margin-bottom: 1.25rem;
      }
      .footer-direct-contact {
        font-size: 0.8125rem;
        color: #cbd5e1;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }
      .footer-badges {
        display: flex;
        gap: 0.65rem;
        align-items: center;
        flex-wrap: wrap;
        font-size: 0.8125rem;
        color: #94a3b8;
      }
    `;
    document.head.appendChild(style);
  }

  // Setup Mobile Menu interactions
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-toggle-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    if (!toggleBtn || !drawer) return;

    function openMenu() {
      drawer.classList.remove('hidden');
      drawer.classList.add('active');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      drawer.classList.remove('active');
      drawer.classList.add('hidden');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (drawer.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when clicking outside inner content
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) {
        closeMenu();
      }
    });

    // Close when clicking any nav link
    const mobileLinks = drawer.querySelectorAll('.mobile-nav-link, .btn');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // Inject Header and Footer into placeholders
  function renderLayout() {
    injectLayoutStyles();

    const headerPlaceholder = document.getElementById('header-placeholder') || document.querySelector('header-placeholder');
    if (headerPlaceholder) {
      headerPlaceholder.innerHTML = createHeaderHTML();
    }

    const footerPlaceholder = document.getElementById('footer-placeholder') || document.querySelector('footer-placeholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = createFooterHTML();
    }

    initMobileMenu();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderLayout);
  } else {
    renderLayout();
  }
})();
