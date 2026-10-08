/**
 * MEDICUBE CLINICAL DERMA 2.0 - JAVASCRIPT CONTROLLER
 * Handles: Ajax Cart (PKR Rs.), Live WYSIWYG Admin Customizer, Section/Block Reordering, Dynamic Product Creation
 */

(function () {
  'use strict';

  // Helper to resolve asset URLs (both local preview & Shopify CDN)
  function resolveAssetUrl(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }
    if (window.ShopifyAssets) {
      if (window.ShopifyAssets[url]) return window.ShopifyAssets[url];
      const cleanKey = url.replace(/^\/?assets\//, '');
      if (window.ShopifyAssets[cleanKey]) return window.ShopifyAssets[cleanKey];
      if (window.ShopifyAssets['assets/' + cleanKey]) return window.ShopifyAssets['assets/' + cleanKey];
    }
    return url;
  }

  // Default Products Catalog
  const DEFAULT_PRODUCTS = [
    {
      id: 'serum-001',
      title: 'EGF NAD+ Firming Serum',
      category: 'ampoules',
      price: 15900,
      comparePrice: 19900,
      badge: 'Best Formula',
      image: 'assets/hero_product.jpg',
      rating: '4.9 • 14.2k',
      desc: 'High-potency cellular actives: Pure NAD+ with bio-identical peptide EGF for structural pore lift.'
    },
    {
      id: 'cream-002',
      title: 'EGF NAD+ Cellular Firming Cream',
      category: 'creams',
      price: 12900,
      comparePrice: 16500,
      badge: 'Cellular Density',
      badgeClass: 'gold',
      image: 'assets/product_collagen.jpg',
      rating: '4.9 • 8.1k',
      desc: 'Deep crimson bio-matrix cream infused with pure NAD+ & lipid ceramides for 48hr structural bounce.'
    },
    {
      id: 'pad-003',
      title: 'EGF NAD+ Resurfacing Peeling Pad',
      category: 'creams',
      price: 8900,
      comparePrice: 11500,
      badge: 'Bio-Peeling',
      image: 'assets/product_pore_pad.jpg',
      rating: '4.8 • 19.4k',
      desc: '70 Embossed dual-action pads soaked in active red serum to smooth textured pores and activate cellular turnover.'
    },
    {
      id: 'eye-004',
      title: 'EGF NAD+ Eye & Neck Lift Concentrate',
      category: 'ampoules',
      price: 12500,
      comparePrice: 15900,
      badge: 'Contour Lift',
      image: 'assets/product_vita_c.jpg',
      rating: '4.9 • 6.7k',
      desc: 'Targeted precision peptide dropper targeting deep smile lines, crow\'s feet, and sagging neck contours.'
    }
  ];

  // Default Sections Configuration
  const DEFAULT_SECTIONS = [
    { id: 'hero-serum', title: 'Hero Showcase Banner', visible: true },
    { id: 'product-top-buy', title: 'Main Product Buy-Box', visible: true },
    { id: 'press-logos-section', title: 'Press Publications Bar', visible: true },
    { id: 'ingredient-breakdown', title: 'Bio-Mechanism Poster & Ingredients', visible: true },
    { id: 'clinical-results', title: '2-Week Ultrasound Biometrics', visible: true },
    { id: 'curated-products', title: 'Curated Products Best Sellers Grid', visible: true },
    { id: 'doctor-endorsement', title: 'Dr. Ji-Woo Song Endorsement', visible: true },
    { id: 'vip-club', title: 'VIP Club Lead Magnet', visible: true },
    { id: 'trust-badges-section', title: 'Clinical Trust Badges Bar', visible: true }
  ];

  // State
  const state = {
    cart: [
      {
        id: 'serum-001',
        title: 'EGF NAD+ Firming Serum',
        volume: '30ml (1.01 fl. oz.)',
        price: 15900,
        comparePrice: 19900,
        quantity: 1,
        image: 'assets/hero_product.jpg'
      }
    ],
    products: JSON.parse(localStorage.getItem('medicube_theme_products')) || DEFAULT_PRODUCTS,
    sections: JSON.parse(localStorage.getItem('medicube_theme_sections')) || DEFAULT_SECTIONS,
    content: JSON.parse(localStorage.getItem('medicube_theme_content')) || {},
    wishlist: new Set(),
    currency: 'Rs.'
  };

  // DOM Elements
  const header = document.querySelector('.site-header');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartTriggers = document.querySelectorAll('[data-action="open-cart"]');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartItemsContainer = document.getElementById('cartItemsList');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartCountBadge = document.querySelector('.cart-count-badge');
  const toastEl = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMessage');

  // Admin Elements
  const adminDrawer = document.getElementById('adminDrawer');
  const adminOverlay = document.getElementById('adminOverlay');

  // Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Format PKR
  function formatMoney(amount) {
    return 'Rs. ' + amount.toLocaleString('en-PK');
  }

  // Cart Drawer Open / Close
  function openCart() {
    renderCart();
    cartDrawer?.classList.add('active');
    cartOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer?.classList.remove('active');
    cartOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  cartTriggers.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  }));

  cartCloseBtn?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  // Show Toast Notification
  function showToast(message) {
    if (!toastEl || !toastMsg) return;
    toastMsg.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3500);
  }

  // Render Cart
  function renderCart() {
    if (!cartItemsContainer) return;

    if (state.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div style="text-align: center; padding: 48px 16px;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🧪</div>
          <h4 style="font-weight: 700; margin-bottom: 6px; color: #ffffff;">Your Cart is Empty</h4>
          <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 20px;">Add high-potency EGF NAD+ formulations to begin your skin transformation.</p>
          <button class="btn-primary" onclick="window.location.hash='#curated-products'; document.getElementById('cartCloseBtn').click();" style="padding: 12px 24px; font-size: 0.82rem;">Explore Best Sellers</button>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = 'Rs. 0';
      if (cartCountBadge) cartCountBadge.textContent = '0';
      return;
    }

    let subtotal = 0;
    let totalItems = 0;
    const fallbackUrl = resolveAssetUrl('hero_product.jpg') || 'assets/hero_product.jpg';

    cartItemsContainer.innerHTML = state.cart.map((item, index) => {
      subtotal += item.price * item.quantity;
      totalItems += item.quantity;
      const itemImg = resolveAssetUrl(item.image);

      return `
        <div class="cart-item" data-id="${item.id}">
          <img src="${itemImg}" alt="${item.title}" onerror="if(this.src!=='${fallbackUrl}'){this.src='${fallbackUrl}';}">
          <div class="cart-item-details">
            <h4>${item.title}</h4>
            <div style="font-size: 0.72rem; color: var(--color-text-muted);">${item.volume || 'Clinical High Concentration'}</div>
            <div class="price">${formatMoney(item.price * item.quantity)}</div>
            <div class="qty-control">
              <button type="button" class="qty-btn" onclick="window.MedicubeTheme.updateQty(${index}, -1)">-</button>
              <span class="qty-num">${item.quantity}</span>
              <button type="button" class="qty-btn" onclick="window.MedicubeTheme.updateQty(${index}, 1)">+</button>
            </div>
          </div>
          <button type="button" class="cart-item-remove" onclick="window.MedicubeTheme.removeItem(${index})" title="Remove item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      `;
    }).join('');

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatMoney(subtotal);
    if (cartCountBadge) cartCountBadge.textContent = totalItems.toString();
  }

  // Render Dynamic Products Grid
  function renderProductsGrid() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;

    // Check if custom products exist in localStorage
    const savedProducts = localStorage.getItem('medicube_theme_products');
    
    // If no custom products are saved in localStorage AND the grid already has server-rendered elements from Liquid, keep them!
    if (!savedProducts && grid.children.length > 0) {
      renderAdminProductList();
      return;
    }

    const fallbackUrl = resolveAssetUrl('hero_product.jpg') || 'assets/hero_product.jpg';

    grid.innerHTML = state.products.map(p => {
      const isWishlisted = state.wishlist.has(p.id);
      const imgUrl = resolveAssetUrl(p.image);
      const safeTitle = p.title.replace(/'/g, "\\'");
      return `
        <div class="product-card" data-category="${p.category || 'ampoules'}" id="product-${p.id}">
          <div class="product-image-box">
            ${p.badge ? `<span class="product-badge ${p.badgeClass || ''}">${p.badge}</span>` : ''}
            <button type="button" class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="window.MedicubeTheme.toggleWishlist(this, '${p.id}')" title="Add to Wishlist">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>
            <a href="#product-top-buy">
              <img src="${imgUrl}" alt="${p.title}" loading="lazy" onerror="if(this.src!=='${fallbackUrl}'){this.src='${fallbackUrl}';}">
            </a>
          </div>
          <div class="product-content">
            <div class="product-rating-row">
              <span>★★★★★</span>
              <span>(${p.rating || '4.9 • 5.0'})</span>
            </div>
            <h3 class="product-card-title"><a href="#product-top-buy">${p.title}</a></h3>
            <p class="product-card-desc">${p.desc}</p>
            <div class="product-card-footer">
              <div class="product-price-box">
                <span class="price-current">Rs. ${p.price.toLocaleString('en-PK')}</span>
                ${p.comparePrice ? `<span class="price-compare">Rs. ${p.comparePrice.toLocaleString('en-PK')}</span>` : ''}
              </div>
              <button type="button" class="quick-add-btn" onclick="window.MedicubeTheme.addToCart({ id: '${p.id}', title: '${safeTitle}', price: ${p.price}, image: '${p.image}' })" title="Quick Add">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    renderAdminProductList();
  }

  // Render Admin Product List inside Drawer
  function renderAdminProductList() {
    const listEl = document.getElementById('adminProductList');
    if (!listEl) return;
    const fallbackUrl = resolveAssetUrl('hero_product.jpg') || 'assets/hero_product.jpg';

    listEl.innerHTML = state.products.map((p) => {
      const imgUrl = resolveAssetUrl(p.image);
      return `
        <div class="admin-product-preview-row" data-id="${p.id}">
          <img src="${imgUrl}" alt="${p.title}" onerror="if(this.src!=='${fallbackUrl}'){this.src='${fallbackUrl}';}">
          <div class="admin-product-meta">
            <h5>${p.title}</h5>
            <span>Rs. ${p.price.toLocaleString('en-PK')} • ${p.category}</span>
          </div>
          <button type="button" class="admin-icon-btn" onclick="window.MedicubeAdmin.deleteProduct('${p.id}')" title="Delete Product" style="color: #ff453a;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      `;
    }).join('');
  }

  // Render Admin Sections List inside Drawer
  function renderAdminSectionsList() {
    const listEl = document.getElementById('adminSectionsList');
    if (!listEl) return;

    listEl.innerHTML = state.sections.map((sec, idx) => `
      <div class="admin-section-item" data-id="${sec.id}">
        <div class="admin-section-name">
          <input type="checkbox" ${sec.visible ? 'checked' : ''} onchange="window.MedicubeAdmin.toggleSectionVisibility('${sec.id}', this.checked)" style="accent-color: #ff2a4b; width: 16px; height: 16px;">
          <span>${sec.title}</span>
        </div>
        <div class="admin-section-actions">
          <button type="button" class="admin-icon-btn" onclick="window.MedicubeAdmin.moveSection('${sec.id}', -1)" title="Move Up" ${idx === 0 ? 'disabled style="opacity:0.3;"' : ''}>
            ↑
          </button>
          <button type="button" class="admin-icon-btn" onclick="window.MedicubeAdmin.moveSection('${sec.id}', 1)" title="Move Down" ${idx === state.sections.length - 1 ? 'disabled style="opacity:0.3;"' : ''}>
            ↓
          </button>
        </div>
      </div>
    `).join('');
  }

  // Apply Sections Order to DOM
  function applySectionsOrder() {
    const mainEl = document.getElementById('MainContent');
    if (!mainEl) return;

    state.sections.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (el) {
        if (!sec.visible) {
          el.style.display = 'none';
        } else {
          el.style.display = '';
        }
        mainEl.appendChild(el);
      }
    });
  }

  // Apply Captions to DOM
  function applySavedCaptions() {
    const c = state.content;
    if (!c) return;

    if (c.announcementText && document.getElementById('announcementText')) {
      document.getElementById('announcementText').textContent = c.announcementText;
    }
    if (c.heroTitle1 && document.getElementById('heroTitle1')) {
      document.getElementById('heroTitle1').textContent = c.heroTitle1;
    }
    if (c.heroTitleAccent && document.getElementById('heroTitleAccent')) {
      document.getElementById('heroTitleAccent').textContent = c.heroTitleAccent;
    }
    if (c.heroSubhead && document.getElementById('heroSubhead')) {
      document.getElementById('heroSubhead').textContent = c.heroSubhead;
    }
    if (c.heroDesc && document.getElementById('heroDesc')) {
      document.getElementById('heroDesc').textContent = c.heroDesc;
    }
    if (c.mainProductTitle && document.getElementById('mainProductTitle')) {
      document.getElementById('mainProductTitle').textContent = c.mainProductTitle;
    }
    if (c.mainProductPrice && document.getElementById('mainProductPrice')) {
      document.getElementById('mainProductPrice').textContent = 'Rs. ' + Number(c.mainProductPrice).toLocaleString('en-PK');
    }
    if (c.mainProductCompare && document.getElementById('mainProductCompare')) {
      document.getElementById('mainProductCompare').textContent = 'Rs. ' + Number(c.mainProductCompare).toLocaleString('en-PK');
    }
  }

  // Theme Public Methods
  window.MedicubeTheme = {
    addToCart: function (product) {
      const existing = state.cart.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.push({
          ...product,
          quantity: 1
        });
      }
      renderCart();
      openCart();
      showToast(`Added ${product.title} to clinical cart!`);
    },

    updateQty: function (index, delta) {
      if (!state.cart[index]) return;
      state.cart[index].quantity += delta;
      if (state.cart[index].quantity <= 0) {
        state.cart.splice(index, 1);
      }
      renderCart();
    },

    removeItem: function (index) {
      if (!state.cart[index]) return;
      const title = state.cart[index].title;
      state.cart.splice(index, 1);
      renderCart();
      showToast(`Removed ${title} from cart.`);
    },

    toggleWishlist: function (btn, productId) {
      if (state.wishlist.has(productId)) {
        state.wishlist.delete(productId);
        btn.classList.remove('active');
        showToast('Item removed from your clinical wishlist.');
      } else {
        state.wishlist.add(productId);
        btn.classList.add('active');
        showToast('❤️ Saved to your clinical wishlist!');
      }
    },

    filterCollection: function (category, btn) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cards = document.querySelectorAll('.product-card');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (category === 'all' || cat === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    },

    handleVIPSubscribe: function (event) {
      event.preventDefault();
      const form = event.target;
      const email = form.querySelector('input[type="email"]').value;
      if (!email) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'ACTIVATING...';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.innerHTML = `
          <div style="background: rgba(255, 42, 75, 0.15); padding: 20px; border-radius: 10px; border: 1px solid var(--color-border-bright); text-align: center;">
            <div style="font-size: 1.6rem; margin-bottom: 6px;">✨</div>
            <h4 style="color: #ffffff; font-weight: 800; margin-bottom: 6px;">VIP Membership Activated!</h4>
            <p style="font-size: 0.85rem; color: var(--color-text-body);">Welcome to Club Medicube VIP. Your 15% discount voucher code is <strong style="color: #ff526c;">DERMA15</strong> (sent to ${email}).</p>
          </div>
        `;
        showToast('🎉 VIP Membership code generated: DERMA15');
      }, 700);
    }
  };

  // Admin Control Panel Engine
  window.MedicubeAdmin = {
    openPanel: function () {
      adminDrawer?.classList.add('active');
      adminOverlay?.classList.add('active');
      document.body.style.overflow = 'hidden';
      renderAdminProductList();
      renderAdminSectionsList();
      this.populateFormFields();
    },

    closePanel: function () {
      adminDrawer?.classList.remove('active');
      adminOverlay?.classList.remove('active');
      document.body.style.overflow = '';
    },

    switchTab: function (tabId, btn) {
      document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const target = document.getElementById(tabId);
      if (target) target.classList.add('active');
    },

    populateFormFields: function () {
      const c = state.content;
      if (document.getElementById('inputAnnouncement')) {
        document.getElementById('inputAnnouncement').value = c.announcementText || '⚡ FLASH: 20% OFF FIRST CLINICAL REGIMEN WITH CODE DERMA20 • FREE EXPEDITED CLINICAL COLD-CHAIN DELIVERY ACROSS PAKISTAN';
      }
      if (document.getElementById('inputHeroTitle1')) {
        document.getElementById('inputHeroTitle1').value = c.heroTitle1 || 'FIRM. SMOOTH.';
      }
      if (document.getElementById('inputHeroAccent')) {
        document.getElementById('inputHeroAccent').value = c.heroTitleAccent || 'RENEW.';
      }
      if (document.getElementById('inputHeroSubhead')) {
        document.getElementById('inputHeroSubhead').value = c.heroSubhead || 'REVERSE STRUCTURAL PORE FATIGUE';
      }
      if (document.getElementById('inputHeroDesc')) {
        document.getElementById('inputHeroDesc').value = c.heroDesc || 'Bioengineered high-potency cellular actives: NAD+ and clinical-grade peptide EGF. Engineered to reverse structural pore fatigue, activate deep fibroblasts, and impart incandescent glass-skin fullness.';
      }
      if (document.getElementById('inputMainTitle')) {
        document.getElementById('inputMainTitle').value = c.mainProductTitle || 'EGF NAD+ Firming Serum';
      }
      if (document.getElementById('inputMainPrice')) {
        document.getElementById('inputMainPrice').value = c.mainProductPrice || 15900;
      }
      if (document.getElementById('inputMainCompare')) {
        document.getElementById('inputMainCompare').value = c.mainProductCompare || 19900;
      }
    },

    saveCaptions: function (event) {
      if (event) event.preventDefault();
      const updated = {
        announcementText: document.getElementById('inputAnnouncement')?.value,
        heroTitle1: document.getElementById('inputHeroTitle1')?.value,
        heroTitleAccent: document.getElementById('inputHeroAccent')?.value,
        heroSubhead: document.getElementById('inputHeroSubhead')?.value,
        heroDesc: document.getElementById('inputHeroDesc')?.value,
        mainProductTitle: document.getElementById('inputMainTitle')?.value,
        mainProductPrice: document.getElementById('inputMainPrice')?.value,
        mainProductCompare: document.getElementById('inputMainCompare')?.value
      };

      state.content = updated;
      localStorage.setItem('medicube_theme_content', JSON.stringify(updated));
      applySavedCaptions();
      showToast('✅ Captions & Headings updated live!');
    },

    addProduct: function (event) {
      if (event) event.preventDefault();
      const form = event.target;
      const title = form.querySelector('[name="product_title"]').value.trim();
      const price = Number(form.querySelector('[name="product_price"]').value);
      const comparePrice = Number(form.querySelector('[name="product_compare"]').value) || 0;
      const category = form.querySelector('[name="product_category"]').value;
      const badge = form.querySelector('[name="product_badge"]').value.trim();
      const image = form.querySelector('[name="product_image"]').value || 'assets/hero_product.jpg';
      const desc = form.querySelector('[name="product_desc"]').value.trim();

      if (!title || !price) {
        showToast('⚠️ Please enter a product title and price.');
        return;
      }

      const newProd = {
        id: 'prod-' + Date.now(),
        title,
        price,
        comparePrice,
        category,
        badge,
        image,
        rating: '5.0 • NEW',
        desc: desc || 'Clinical grade EGF NAD+ high-potency bio-formulation for cellular regeneration.'
      };

      state.products.push(newProd);
      localStorage.setItem('medicube_theme_products', JSON.stringify(state.products));
      renderProductsGrid();
      form.reset();
      showToast(`🎉 New Product "${title}" added to store!`);
    },

    deleteProduct: function (id) {
      const idx = state.products.findIndex(p => p.id === id);
      if (idx !== -1) {
        const title = state.products[idx].title;
        state.products.splice(idx, 1);
        localStorage.setItem('medicube_theme_products', JSON.stringify(state.products));
        renderProductsGrid();
        showToast(`🗑️ Product "${title}" removed.`);
      }
    },

    moveSection: function (sectionId, direction) {
      const idx = state.sections.findIndex(s => s.id === sectionId);
      if (idx === -1) return;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= state.sections.length) return;

      const [moved] = state.sections.splice(idx, 1);
      state.sections.splice(targetIdx, 0, moved);

      localStorage.setItem('medicube_theme_sections', JSON.stringify(state.sections));
      renderAdminSectionsList();
      applySectionsOrder();
      showToast(`🔄 Section order updated live!`);
    },

    toggleSectionVisibility: function (sectionId, isVisible) {
      const sec = state.sections.find(s => s.id === sectionId);
      if (sec) {
        sec.visible = isVisible;
        localStorage.setItem('medicube_theme_sections', JSON.stringify(state.sections));
        applySectionsOrder();
        showToast(`👁️ Section ${sec.title} ${isVisible ? 'shown' : 'hidden'}.`);
      }
    },

    resetDefaults: function () {
      if (confirm('Reset all theme texts, sections order, and product catalog to factory default?')) {
        localStorage.removeItem('medicube_theme_products');
        localStorage.removeItem('medicube_theme_sections');
        localStorage.removeItem('medicube_theme_content');

        state.products = [...DEFAULT_PRODUCTS];
        state.sections = [...DEFAULT_SECTIONS];
        state.content = {};

        renderProductsGrid();
        renderAdminSectionsList();
        applySectionsOrder();
        this.populateFormFields();
        location.reload();
      }
    }
  };

  // Initial render & DOM hydration
  document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    renderProductsGrid();
    applySectionsOrder();
    applySavedCaptions();
  });
})();
