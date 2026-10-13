document.addEventListener('DOMContentLoaded', () => {
  // Theme Management
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);

  const themeToggles = document.querySelectorAll('#theme-toggle, .theme-toggle-btn');
  themeToggles.forEach(themeToggle => {
    themeToggle.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      let newTheme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  });

  // RTL Management
  const currentDir = localStorage.getItem('dir') || 'ltr';
  document.documentElement.setAttribute('dir', currentDir);

  const rtlToggles = document.querySelectorAll('#rtl-toggle, .rtl-toggle-btn');
  rtlToggles.forEach(rtlToggle => {
    rtlToggle.addEventListener('click', () => {
      let dir = document.documentElement.getAttribute('dir');
      let newDir = dir === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('dir', newDir);
    });
  });

  // Sticky Header
  const header = document.querySelector('.navbar-custom');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }

  // Intersection Observer for Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // observer.unobserve(entry.target); // Keep observing if we want animations to replay, else uncomment
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-slide-left, .animate-slide-right, .animate-fade-in');
  animatedElements.forEach(el => observer.observe(el));

  // Form Validation (Contact Page)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      if (!contactForm.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      contactForm.classList.add('was-validated');
    }, false);
  }

  // ==========================================
  // Interactive Frame & Keepsake Customizer
  // ==========================================
  const frameBorder = document.getElementById('customFrameBorder');
  const frameMat = document.getElementById('customFrameMat');
  const framePriceDisplay = document.getElementById('customFramePrice');
  const nameplateName = document.getElementById('customNameplateName');
  const nameplateDate = document.getElementById('customNameplateDate');
  const previewNameText = document.getElementById('previewNameText');
  const previewDateText = document.getElementById('previewDateText');

  let currentFramePrice = 199;
  let currentSizeCost = 199;
  let currentGlassCost = 35; // UV museum glass included/addon

  // Wood Finish Swatches
  const finishSwatches = document.querySelectorAll('.finish-swatch-btn');
  finishSwatches.forEach(btn => {
    btn.addEventListener('click', () => {
      finishSwatches.forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      const borderColor = btn.getAttribute('data-border-color') || '#C8A575';
      const finishName = btn.getAttribute('data-finish-name') || 'Solid Oak';
      if (frameBorder) {
        frameBorder.style.borderColor = borderColor;
      }
      const label = document.getElementById('selectedFinishLabel');
      if (label) label.textContent = finishName;
    });
  });

  // Mat Swatches
  const matSwatches = document.querySelectorAll('.mat-swatch-btn');
  matSwatches.forEach(btn => {
    btn.addEventListener('click', () => {
      matSwatches.forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      const matColor = btn.getAttribute('data-mat-color') || '#FCFBFF';
      const matName = btn.getAttribute('data-mat-name') || 'Ivory Cream';
      if (frameMat) {
        frameMat.style.backgroundColor = matColor;
      }
      const label = document.getElementById('selectedMatLabel');
      if (label) label.textContent = matName;
    });
  });

  // Size Options
  const sizePills = document.querySelectorAll('.size-select-pill');
  sizePills.forEach(pill => {
    pill.addEventListener('click', () => {
      sizePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentSizeCost = parseInt(pill.getAttribute('data-price') || '199', 10);
      updateCustomFramePrice();
      const label = document.getElementById('selectedSizeLabel');
      if (label) label.textContent = pill.getAttribute('data-size-label');
    });
  });

  // Nameplate inputs
  if (nameplateName && previewNameText) {
    nameplateName.addEventListener('input', (e) => {
      previewNameText.textContent = e.target.value.trim() || 'Baby Name';
    });
  }
  if (nameplateDate && previewDateText) {
    nameplateDate.addEventListener('input', (e) => {
      previewDateText.textContent = e.target.value.trim() || 'Est. 2026';
    });
  }

  function updateCustomFramePrice() {
    const total = currentSizeCost + currentGlassCost;
    if (framePriceDisplay) {
      framePriceDisplay.textContent = `$${total}`;
    }
  }

  // Add customized frame to cart / order
  const addCustomFrameBtn = document.getElementById('btnSaveCustomFrame');
  if (addCustomFrameBtn) {
    addCustomFrameBtn.addEventListener('click', () => {
      const alertBox = document.getElementById('customFrameSuccessAlert');
      if (alertBox) {
        alertBox.classList.remove('d-none');
        setTimeout(() => {
          alertBox.classList.add('d-none');
        }, 5000);
      }
    });
  }

  // ==========================================
  // Instant Nursery Quote Calculator
  // ==========================================
  const quoteCheckboxes = document.querySelectorAll('.quote-item-check');
  const quoteAssemblyCheck = document.getElementById('quoteAssemblyCheck');
  const quoteSubtotalDisplay = document.getElementById('quoteSubtotalDisplay');
  const quoteDiscountDisplay = document.getElementById('quoteDiscountDisplay');
  const quoteTotalDisplay = document.getElementById('quoteTotalDisplay');
  const quoteForm = document.getElementById('nurseryQuoteForm');

  function calculateQuote() {
    let subtotal = 0;
    let selectedCount = 0;

    quoteCheckboxes.forEach(cb => {
      if (cb.checked) {
        subtotal += parseInt(cb.getAttribute('data-price') || '0', 10);
        selectedCount++;
      }
    });

    let discount = 0;
    // Bundle discount if 3+ items selected
    if (selectedCount >= 3) {
      discount = Math.round(subtotal * 0.15); // 15% bundle savings
    }

    let assemblyFee = 0;
    if (quoteAssemblyCheck && quoteAssemblyCheck.checked) {
      // Free assembly if subtotal > 1500
      assemblyFee = subtotal >= 1500 ? 0 : 199;
      const assemblyNote = document.getElementById('quoteAssemblyNote');
      if (assemblyNote) {
        assemblyNote.textContent = subtotal >= 1500 ? 'Complimentary on orders $1,500+' : '$199 White-Glove Service';
      }
    }

    const total = Math.max(0, subtotal - discount + assemblyFee);

    if (quoteSubtotalDisplay) quoteSubtotalDisplay.textContent = `$${subtotal.toLocaleString()}`;
    if (quoteDiscountDisplay) quoteDiscountDisplay.textContent = `-$${discount.toLocaleString()}`;
    if (quoteTotalDisplay) quoteTotalDisplay.textContent = `$${total.toLocaleString()}`;
  }

  quoteCheckboxes.forEach(cb => cb.addEventListener('change', calculateQuote));
  if (quoteAssemblyCheck) quoteAssemblyCheck.addEventListener('change', calculateQuote);

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const quoteSuccess = document.getElementById('quoteSuccessMessage');
      const quoteRef = document.getElementById('quoteReferenceCode');
      if (quoteRef) {
        quoteRef.textContent = `NST-${Math.floor(100000 + Math.random() * 900000)}`;
      }
      if (quoteSuccess) {
        quoteSuccess.classList.remove('d-none');
        quoteForm.classList.add('d-none');
      }
    });
  }

  // ==========================================
  // Product Page Category Filter
  // ==========================================
  const categoryPills = document.querySelectorAll('.category-filter-pill');
  const productCards = document.querySelectorAll('.filterable-product');

  if (categoryPills.length > 0) {
    categoryPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.getAttribute('data-filter') || 'all';

        productCards.forEach(card => {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = '';
            card.classList.add('animate-fade-in', 'visible');
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================
  // Home Page Product Filter & Quick View
  // ==========================================
  window.filterHomeProducts = function(category, btnElement) {
    const pills = document.querySelectorAll('.category-filter-pill');
    pills.forEach(p => p.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    const items = document.querySelectorAll('.home-product-item');
    items.forEach(item => {
      const cat = item.getAttribute('data-category');
      if (category === 'all' || cat === category) {
        item.style.display = '';
        item.classList.add('animate-fade-in');
      } else {
        item.style.display = 'none';
      }
    });
  };

  const productDatabase = {
    'aspen-crib': {
      title: 'The Aspen 4-in-1 Convertible Crib',
      category: 'Convertible Cribs',
      badge: 'Best Seller',
      image: 'images/category_cribs.jpg',
      price: '$699.00',
      installment: 'or $58/mo with 0% APR financing',
      ratingHtml: '<i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i> <span class="text-secondary small ms-1">(142 parent reviews)</span>',
      description: 'Handcrafted from solid Appalachian oak with non-toxic beeswax finish. Easily converts from an infant crib to a toddler bed, daybed, and full-size bed as your child grows.',
      specs: ['GREENGUARD Gold Certified for clean indoor air', '3 adjustable mattress spring height settings', 'Lead, phthalate, and BPA-free chew-safe finishes', '10-Year structural heirloom warranty included'],
      btnText: 'Order Aspen Crib',
      btnHref: 'contact.html?product=aspen-crib'
    },
    'cloud-glider': {
      title: 'Cloud Bouclé 360° Swivel Glider',
      category: 'Nursing Gliders & Recliners',
      badge: 'Parent Choice',
      image: 'https://images.pexels.com/photos/5217121/pexels-photo-5217121.jpeg',
      price: '$749.00',
      installment: 'or $62/mo with 0% APR financing',
      ratingHtml: '<i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i> <span class="text-secondary small ms-1">(98 parent reviews)</span>',
      description: 'Designed for effortless late-night feedings with whisper-quiet 360° steel swivel, gentle gliding, and stain-resistant Italian bouclé fabric with supportive lumbar pillow.',
      specs: ['Oeko-Tex Standard 100 certified upholstery', 'Solid beechwood internal frame', 'Stain-resistant and easily spot cleanable', 'Heavy-duty smooth steel bearing glide mechanism'],
      btnText: 'Order Cloud Glider',
      btnHref: 'contact.html?product=cloud-glider'
    },
    'aspen-dresser': {
      title: 'Aspen 6-Drawer Wide Dresser',
      category: 'Storage & Dressers',
      badge: 'Heirloom Build',
      image: 'https://images.pexels.com/photos/3933028/pexels-photo-3933028.jpeg',
      price: '$849.00',
      installment: 'or $71/mo with 0% APR financing',
      ratingHtml: '<i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i> <span class="text-secondary small ms-1">(86 parent reviews)</span>',
      description: 'Spacious solid oak nursery dresser featuring artisan English dovetail drawers, silent German soft-close runners, and anti-tip interlocking safety mechanisms.',
      specs: ['ASTM F2057 Anti-Tip Certified safety interlocking', 'Solid wood drawer boxes with dovetail joinery', 'Full extension soft-close undermount drawer slides', 'Compatible with Universal Changing Table Topper'],
      btnText: 'Order Aspen Dresser',
      btnHref: 'contact.html?product=aspen-dresser'
    },
    'changing-topper': {
      title: 'Universal Changing Table Topper',
      category: 'Changing Accessories',
      badge: 'Essential',
      image: 'https://images.pexels.com/photos/6849347/pexels-photo-6849347.jpeg',
      price: '$149.00',
      installment: 'In stock — Ships in 24 hours',
      ratingHtml: '<i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i> <span class="text-secondary small ms-1">(112 parent reviews)</span>',
      description: 'Easily converts any 6-drawer dresser into a comfortable, secure diaper changing station. Protective felt-lined base ensures zero scratches on dresser surface.',
      specs: ['Felt-lined bottom prevents scratches on dresser tops', 'Includes safety anchoring brackets and infant strap', 'Fits all standard 32" x 16" infant changing pads', 'Removable when baby outgrows diaper changes'],
      btnText: 'Order Changing Topper',
      btnHref: 'contact.html?product=changing-topper'
    },
    'botanical-frame': {
      title: 'Archival Botanical Keepsake Frame',
      category: 'Nursery Art & Keepsakes',
      badge: 'Custom Keepsake',
      image: 'images/nursery_framed_art.jpg',
      price: '$199.00',
      installment: 'Free custom engraving included',
      ratingHtml: '<i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i> <span class="text-secondary small ms-1">(74 parent reviews)</span>',
      description: 'Shatterproof museum-grade acrylic protection preserving baby birth announcements, ultrasound prints, and milestone memories. Finished with custom engraved solid brass plaque.',
      specs: ['99% UV-protective museum acrylic (zero glass shatter hazard)', 'Pure acid-free 100% cotton conservation matting', 'Laser-engraved solid brass nameplate personalized with birth metrics', 'Appalachian solid hardwood moulding with sealed back dust cover'],
      btnText: 'Customize This Frame',
      btnHref: '#frameCustomizerModal'
    },
    'oslo-suite': {
      title: 'The Complete Oslo Nursery Suite (3-Piece Room)',
      category: 'Complete Room Suite',
      badge: 'Save $350 Instantly',
      image: 'images/heritage_collection.jpg',
      price: '$2,147.00',
      installment: 'or $178/mo with 0% APR financing',
      ratingHtml: '<i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i> <span class="text-secondary small ms-1">(65 parent reviews)</span>',
      description: 'The ultimate nursery investment. Includes The Aspen 4-in-1 Crib, 6-Drawer Dresser, and Cloud Bouclé Glider. Comes with complimentary White-Glove In-Room Delivery & Assembly.',
      specs: ['All 3 core pieces matched in solid Appalachian oak finish', 'Complimentary White-Glove delivery & assembly ($199 value)', 'Free custom engraved keepsake nameplate frame included', '10-Year comprehensive heirloom structural warranty'],
      btnText: 'Order Complete Suite',
      btnHref: 'contact.html?product=oslo-suite'
    }
  };

  window.openQuickView = function(productId) {
    const p = productDatabase[productId];
    if (!p) return;

    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

    document.getElementById('qvTitle').textContent = p.title;
    document.getElementById('qvCategory').textContent = p.category;
    document.getElementById('qvBadge').textContent = p.badge;
    document.getElementById('qvImage').src = p.image;
    document.getElementById('qvImage').alt = p.title;
    document.getElementById('qvPrice').textContent = p.price;
    document.getElementById('qvInstallment').textContent = p.installment;
    document.getElementById('qvRating').innerHTML = p.ratingHtml;
    document.getElementById('qvDescription').textContent = p.description;

    const specsList = document.getElementById('qvSpecs');
    specsList.innerHTML = p.specs.map(s => `<li>${s}</li>`).join('');

    const shopBtn = document.getElementById('qvShopBtn');
    shopBtn.innerHTML = `<i class="bi bi-cart-plus me-1"></i> ${p.btnText}`;
    if (p.btnHref.startsWith('#')) {
      shopBtn.setAttribute('data-bs-toggle', 'modal');
      shopBtn.setAttribute('data-bs-target', p.btnHref);
      shopBtn.href = p.btnHref;
    } else {
      shopBtn.removeAttribute('data-bs-toggle');
      shopBtn.removeAttribute('data-bs-target');
      shopBtn.href = p.btnHref;
    }

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  };
});

