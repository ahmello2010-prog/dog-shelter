/**
 * النظام الرقمي لإدارة مأوى الكلاب الضالة بالقاهرة - Cairo Stray Dog Shelter
 * ملف الجافاسكريبت الرئيسي (Vanilla JavaScript Engine)
 * المرحلة الأولى: التفاعل مع شريط التنقل، السلايدر الانسيابي، عدادات الأرقام، والنوافذ المنبثقة
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroSlider();
  initStatsCounter();
  initModals();
  initDonationCards();
  initReportForm();
  initTrackingSystem();
  initOperationsMap();
});

/* ==========================================================================
   1. شريط التنقل العلوي وتفاعلات التمرير والقائمة المتجاوبة
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('main-navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // الاستماع لحركة التمرير في الصفحة
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // التحقق الأولي عند التحميل

  // فتح/إغلاق القائمة في الهواتف من الجهة اليسرى
  const mobileDrawer = document.getElementById('mobile-menu-drawer');

  const openMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('hidden');
    requestAnimationFrame(() => {
      if (mobileDrawer) {
        mobileDrawer.classList.remove('-translate-x-full');
        mobileDrawer.classList.add('translate-x-0');
      }
    });
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    if (!mobileMenu) return;
    if (mobileDrawer) {
      mobileDrawer.classList.remove('translate-x-0');
      mobileDrawer.classList.add('-translate-x-full');
    }
    setTimeout(() => {
      mobileMenu.classList.add('hidden');
    }, 280);
    document.body.style.overflow = '';
  };

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (mobileMenuCloseBtn) {
      mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // إغلاق عند النقر على الخلفية المعتمة
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        closeMobileMenu();
      }
    });

    // إغلاق بزر Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        closeMobileMenu();
      }
    });
  }
}

/* ==========================================================================
   2. سلايدر الخلفية في الهيرو (Smooth Crossfade Carousel)
   ========================================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 6000; // 6 ثوانٍ لكل شريحة

  const goToSlide = (index) => {
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) {
      dots[currentSlide].classList.remove('active');
      dots[currentSlide].classList.add('bg-white/50');
      dots[currentSlide].classList.remove('bg-lotus-500');
    }

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
      dots[currentSlide].classList.remove('bg-white/50');
      dots[currentSlide].classList.add('bg-lotus-500');
    }
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  const startAutoPlay = () => {
    stopAutoPlay();
    slideInterval = setInterval(nextSlide, slideDuration);
  };

  const stopAutoPlay = () => {
    if (slideInterval) clearInterval(slideInterval);
  };

  // أزرار التحكم
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  // نقاط المؤشرات
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      startAutoPlay();
    });
  });

  // إيقاف مؤقت عند التفاعل مع أزرار الهيرو
  const heroContainer = document.getElementById('hero');
  if (heroContainer) {
    heroContainer.addEventListener('mouseenter', stopAutoPlay);
    heroContainer.addEventListener('mouseleave', startAutoPlay);
  }

  // بدء التشغيل التلقائي
  startAutoPlay();
}

/* ==========================================================================
   3. عداد الإحصائيات والأرقام التفاعلي (Animated Count-Up)
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.num-counter');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000; // مدة العد 2 ثانية
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // دالة Ease Out الانسيابية
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        // تنسيق الرقم مع الفاصلة
        counter.textContent = `${prefix}${currentVal.toLocaleString('ar-EG')}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = `${prefix}${target.toLocaleString('ar-EG')}${suffix}`;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const statsSection = document.getElementById('stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(statsSection);
  } else {
    // تشغيل مباشر في حال عدم دعم IntersectionObserver
    animateCounters();
  }
}

/* ==========================================================================
   4. إدارة النوافذ المنبثقة التفاعلية (Modals Management)
   ========================================================================== */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloseBtns = document.querySelectorAll('[data-modal-close]');
  const allModals = document.querySelectorAll('.modal-overlay');

  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // تركيز بصري على أول حقل إدخال
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    // إذا لم تبق أي نوافذ مفتوحة، نعيد التمرير للجسم
    const anyOpen = Array.from(allModals).some(m => m.classList.contains('open'));
    if (!anyOpen) {
      document.body.style.overflow = '';
    }
  };

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      openModal(targetId);
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  // إغلاق عند النقر على الخلفية المعتمة
  allModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // إغلاق بزر Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModals.forEach(modal => {
        if (modal.classList.contains('open')) {
          closeModal(modal);
        }
      });
    }
  });

  // نموذج الدخول السريع للوحة الإدارة
  const adminDemoBtn = document.getElementById('admin-demo-login-btn');
  if (adminDemoBtn) {
    adminDemoBtn.addEventListener('click', () => {
      showToast('تم تسجيل الدخول كمسؤول للنظام بنجاح (وضع المعاينة)', 'success');
      const adminModal = document.getElementById('admin-modal');
      closeModal(adminModal);
    });
  }
}

/* ==========================================================================
   5. إدارة نموذج تقديم البلاغات السريعة
   ========================================================================== */
function initReportForm() {
  const form = document.getElementById('quick-report-form');
  const sampleDataBtn = document.getElementById('fill-sample-report-btn');

  if (sampleDataBtn && form) {
    sampleDataBtn.addEventListener('click', () => {
      const nameInput = form.querySelector('[name="reporter_name"]');
      const phoneInput = form.querySelector('[name="reporter_phone"]');
      const districtSelect = form.querySelector('[name="district"]');
      const locationInput = form.querySelector('[name="location_detail"]');
      const conditionSelect = form.querySelector('[name="dog_condition"]');
      const descInput = form.querySelector('[name="notes"]');

      if (nameInput) nameInput.value = 'أحمد محمود';
      if (phoneInput) phoneInput.value = '01098765432';
      if (districtSelect) districtSelect.value = 'المعادي';
      if (locationInput) locationInput.value = 'شارع النصر، تقاطع اللاسلكي أمام بنك مصر';
      if (conditionSelect) conditionSelect.value = 'إصابة أو عرج واضح يحتاج إسعافاً';
      if (descInput) descInput.value = 'كلب بلدي بني متوسط الحجم، يعرج في ساقه الخلفية ولطيف جداً ويحتاج فحصاً بيطرياً عاجلاً.';

      showToast('تمت تعبئة بيانات تجريبية واقعية للبلاغ', 'info');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin ml-2"></i> جاري حفظ وتوجيه البلاغ...';

      // محاكاة إرسال البلاغ وتوليد رمز مرجعي واقعي
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
        const ticketCode = `CAI-2026-${randomTicketNum}`;

        // إغلاق المودال الحالي وعرض نتيجة البلاغ
        const reportModal = document.getElementById('report-modal');
        if (reportModal) reportModal.classList.remove('open');
        document.body.style.overflow = '';

        // عرض رسالة التأكيد
        showTicketResultModal(ticketCode);
        form.reset();
      }, 1200);
    });
  }
}

function showTicketResultModal(ticketCode) {
  const resultModal = document.getElementById('ticket-result-modal');
  const codeSpan = document.getElementById('result-ticket-code');
  if (resultModal && codeSpan) {
    codeSpan.textContent = ticketCode;
    resultModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  } else {
    showToast(`تم استلام بلاغك بنجاح! رقم المتابعة الخاص بك: ${ticketCode}`, 'success');
  }
}

/* ==========================================================================
   6. نظام متابعة حالة البلاغات
   ========================================================================== */
function initTrackingSystem() {
  const form = document.getElementById('track-report-form');
  const trackingResultBox = document.getElementById('tracking-result-box');
  const sampleTickets = document.querySelectorAll('.sample-ticket-btn');

  sampleTickets.forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      const input = document.getElementById('track-ticket-input');
      if (input) {
        input.value = code;
        if (form) {
          form.dispatchEvent(new Event('submit'));
        }
      }
    });
  });

  if (form && trackingResultBox) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('track-ticket-input');
      const ticketCode = input ? input.value.trim().toUpperCase() : '';

      if (!ticketCode) {
        showToast('يرجى إدخال رقم البلاغ للبحث', 'warning');
        return;
      }

      // محاكاة استعلام البلاغ
      trackingResultBox.innerHTML = `
        <div class="py-8 text-center text-slate-500">
          <i class="fa-solid fa-circle-notch fa-spin text-2xl text-lotus-600 mb-2"></i>
          <p class="text-sm">جاري البحث في قاعدة بيانات البلاغات الميدانية...</p>
        </div>
      `;
      trackingResultBox.classList.remove('hidden');

      setTimeout(() => {
        renderTrackingResult(ticketCode, trackingResultBox);
      }, 800);
    });
  }
}

function renderTrackingResult(ticketCode, container) {
  // بيانات افتراضية واقعية حسب الكود
  const isEmergency = ticketCode.includes('8942');
  
  const statusSteps = [
    { title: 'استلام البلاغ وتأكيد الإحداثيات', time: 'منذ 3 ساعات', desc: 'تم استلام البلاغ من المواطن عبر المنظومة وتحديد الموقع بالقاهرة', done: true },
    { title: 'تحرك فرقة التدخل السريع', time: 'منذ ساعتين', desc: 'سيارة الإنقاذ الميدانية رقم 4 توجهت للموقع بقيادة المسعف البيطري', done: true },
    { title: 'الفحص الميداني وتقديم الإسعافات', time: 'منذ ساعة', desc: 'تمت تهدئة الحالة بأمان وفحص الإصابة وتضميدها في سيارة الإسعاف', done: isEmergency },
    { title: 'الوصول لمأوى شبرامنت والرعاية المستمرة', time: isEmergency ? 'جاري الآن' : 'في الانتظار', desc: 'نقل الحالة لمركز الحجر البيطري والتأهيل بالمأوى المركزي', done: false, active: isEmergency }
  ];

  let stepsHtml = statusSteps.map((step, idx) => `
    <div class="relative flex items-start gap-3 pb-5 ${idx === statusSteps.length - 1 ? '' : 'border-r-2 border-slate-200 mr-3 pr-4'}">
      <div class="absolute -right-3 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        step.done 
          ? 'bg-lotus-600 text-white shadow-sm' 
          : step.active 
            ? 'bg-lotus-100 text-lotus-700 ring-2 ring-lotus-500 animate-pulse' 
            : 'bg-slate-200 text-slate-500'
      }">
        ${step.done ? '<i class="fa-solid fa-check text-[10px]"></i>' : (idx + 1)}
      </div>
      <div class="flex-1 mr-4">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-slate-800">${step.title}</h4>
          <span class="text-xs text-slate-400">${step.time}</span>
        </div>
        <p class="text-xs text-slate-600 mt-1 leading-relaxed">${step.desc}</p>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 mt-4 text-right">
      <div class="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
        <div>
          <span class="text-xs text-slate-500">رقم البلاغ:</span>
          <span class="font-mono font-bold text-slate-900 ml-1">${ticketCode}</span>
        </div>
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
          isEmergency ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }">
          <i class="fa-solid fa-circle-dot text-[8px]"></i>
          ${isEmergency ? 'قيد المتابعة البيطرية' : 'تم استلام وتوجيه البلاغ'}
        </span>
      </div>
      
      <div class="pr-2">
        ${stepsHtml}
      </div>

      <div class="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>فريق الإنقاذ: <strong class="text-slate-700">وحدة التدخل رقم 04 - قطاع جنوب القاهرة</strong></span>
        <button onclick="navigator.clipboard && navigator.clipboard.writeText('${ticketCode}').then(() => showToast('تم نسخ رقم البلاغ', 'info'))" class="hover:text-lotus-700 transition-colors">
          <i class="fa-regular fa-copy ml-1"></i> نسخ الرمز
        </button>
      </div>
    </div>
  `;
}

/* ==========================================================================
   7. إدارة خيارات التبرع ونسخ أرقام الحسابات
   ========================================================================== */
function initDonationCards() {
  const copyBtns = document.querySelectorAll('[data-copy-target]');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy-target');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`تم نسخ: ${text}`, 'success');
        }).catch(() => {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    });
  });
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`تم نسخ: ${text}`, 'success');
  } catch (err) {
    showToast('تعذر النسخ التلقائي، يمكنك النسخ يدوياً', 'warning');
  }
  document.body.removeChild(textArea);
}

/* ==========================================================================
   8. نظام رسائل التنبيه العائمة (Toast Notifications)
   ========================================================================== */
function showToast(message, type = 'info') {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed bottom-5 left-5 z-[9999] max-w-md px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium transition-all duration-300 pointer-events-auto transform translate-y-20 opacity-0';
    document.body.appendChild(toast);
  }

  // ألوان وأيقونات التنبيه
  let typeClasses = 'bg-slate-900 text-white border border-slate-700';
  let iconHtml = '<i class="fa-solid fa-circle-info text-lotus-400 text-base"></i>';

  if (type === 'success') {
    typeClasses = 'bg-slate-900 text-white border border-emerald-500/40 shadow-emerald-950/20';
    iconHtml = '<i class="fa-solid fa-circle-check text-emerald-400 text-base"></i>';
  } else if (type === 'warning') {
    typeClasses = 'bg-slate-900 text-white border border-amber-500/40';
    iconHtml = '<i class="fa-solid fa-triangle-exclamation text-amber-400 text-base"></i>';
  } else if (type === 'error') {
    typeClasses = 'bg-slate-900 text-white border border-rose-500/40';
    iconHtml = '<i class="fa-solid fa-circle-xmark text-rose-400 text-base"></i>';
  }

  toast.className = `fixed bottom-5 left-5 z-[9999] max-w-md px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium transition-all duration-300 pointer-events-auto ${typeClasses}`;
  toast.innerHTML = `
    ${iconHtml}
    <span class="flex-1 text-right">${message}</span>
    <button onclick="this.parentElement.classList.add('translate-y-20', 'opacity-0')" class="text-slate-400 hover:text-white p-1">
      <i class="fa-solid fa-xmark text-xs"></i>
    </button>
  `;

  // إظهار التوست
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-20', 'opacity-0');
  });

  // إخفاء تلقائي بعد 4.5 ثوانٍ
  clearTimeout(toast.timeoutId);
  toast.timeoutId = setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 4500);
}

/* ==========================================================================
   9. خريطة العمليات الميدانية التفاعلية (Interactive Leaflet Map Engine)
   ========================================================================== */
function initOperationsMap() {
  const mapElement = document.getElementById('cairo-operations-map');
  const mapFrame = document.getElementById('operations-map-frame');
  const mapModal = document.getElementById('map-modal');
  const mapModalStage = document.getElementById('map-modal-stage');
  const openMapModalBtn = document.getElementById('open-map-modal');
  const closeMapModalBtn = document.getElementById('close-map-modal');
  const zonesContainer = document.getElementById('map-zones-container');
  const filterCountBadge = document.getElementById('filtered-count-badge');
  const recenterBtn = document.getElementById('map-recenter-btn');
  const searchInput = document.getElementById('map-search-input');
  const filterButtons = document.querySelectorAll('.map-filter-btn');

  if (!mapElement) return;

  // التأكد من توفر مكتبة Leaflet
  if (typeof L === 'undefined') {
    mapElement.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
        <i class="fa-solid fa-triangle-exclamation text-3xl text-amber-500 mb-2"></i>
        <p class="text-sm font-bold">جاري تحميل خريطة العمليات التفاعلية...</p>
        <p class="text-xs text-slate-400 mt-1">يرجى التأكد من الاتصال بالإنترنت لتحميل طبقات الخريطة عبر CDN.</p>
      </div>
    `;
    return;
  }

  // بيانات المواقع والبلاغات الحية بالقاهرة الكبرى والجيزة
  const cairoZones = [
    {
      id: 'zone-1',
      title: 'ملاذ شبرامنت وسقارة المركزي',
      category: 'shelter',
      categoryName: 'ملاذ رئيسي',
      district: 'شبرامنت - طريق سقارة السياحي',
      lat: 29.8650,
      lng: 31.2180,
      status: 'مفتوح للرعاية والتأهيل',
      statusType: 'success',
      team: 'إدارة العمليات المركزية',
      time: 'سعة 1200+ كلب',
      casesCount: '450 حالة مقيمة',
      ticketCode: null,
      description: 'المقر الرئيسي للمأوى بمساحة 15 فداناً، يضم الحظائر الرملية المفتوحة والعيادة الجراحية المركزية وملاعب التأهيل.',
      badgeClass: 'bg-slate-900 text-white',
      markerColor: '#0F172A',
      icon: 'fa-shield-dog',
      pulse: ''
    },
    {
      id: 'zone-2',
      title: 'إنقاذ عاجل: كلب مصاب بصدم سيارة',
      category: 'emergency',
      categoryName: 'بلاغ طوارئ',
      district: 'المعادي - شارع النصر / تقاطع دجلة',
      lat: 29.9602,
      lng: 31.2769,
      status: 'سيارة الإسعاف 02 بالموقع',
      statusType: 'danger',
      team: 'وحدة التدخل السريع رقم 02',
      time: 'منذ 18 دقيقة',
      casesCount: 'حالة حرجة',
      ticketCode: 'CAI-2026-8942',
      description: 'كلب بلدي يعاني من كسر بالساق الخلفية، تم توجيه المسعف وتقديم الإسعافات الأولية ونقله للعيادة.',
      badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200',
      markerColor: '#E11D48',
      icon: 'fa-truck-medical',
      pulse: 'pulse-emergency'
    },
    {
      id: 'zone-3',
      title: 'حملة التعقيم والتطعيم الوطني (TNR)',
      category: 'tnr',
      categoryName: 'حملة TNR',
      district: 'القاهرة الجديدة - التجمع الخامس (النرجس والياسمين)',
      lat: 30.0150,
      lng: 31.4350,
      status: 'حملة نشطة ومستمرة',
      statusType: 'lotus',
      team: 'فريق تعقيم قطاع شرق القاهرة',
      time: 'اليوم الثالث للحملة',
      casesCount: 'تم تعقيم 28 كلباً',
      ticketCode: 'TNR-2026-031',
      description: 'صيد إنساني وتعقيم جراحي مع التطعيم الرباعي وضد السعار ووضع علامة الأذن للمجموعة.',
      badgeClass: 'bg-lotus-50 text-lotus-800 border border-lotus-200',
      markerColor: '#D9829B',
      icon: 'fa-syringe',
      pulse: 'pulse-tnr'
    },
    {
      id: 'zone-4',
      title: 'إنقاذ جراء حديثة الولادة مع الأم',
      category: 'emergency',
      categoryName: 'بلاغ طوارئ',
      district: 'مدينة نصر - تقاطع مكرم عبيد',
      lat: 30.0610,
      lng: 31.3450,
      status: 'جاري تأمين الموقع ونقل الجراء',
      statusType: 'danger',
      team: 'فرقة الإنقاذ الميداني 05',
      time: 'منذ 35 دقيقة',
      casesCount: 'أم + 6 جراء',
      ticketCode: 'CAI-2026-9104',
      description: 'كلبة وضعت 6 جراء في ورشة مهجورة معرضة لمخاطر الطريق، يجري نقلهم لحضانة المأوى.',
      badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200',
      markerColor: '#E11D48',
      icon: 'fa-truck-medical',
      pulse: 'pulse-emergency'
    },
    {
      id: 'zone-5',
      title: 'العيادة البيطرية الميدانية المتنقلة',
      category: 'clinic',
      categoryName: 'عيادة متنقلة',
      district: 'الزمالك - محيط حديقة الأسماك وشارع حسن صبري',
      lat: 30.0570,
      lng: 31.2210,
      status: 'فحص وتطعيم دوري مجاني',
      statusType: 'teal',
      team: 'العيادة رقم 01 - د. مي عبد العزيز',
      time: 'متواجدة حتى 4:00 عصراً',
      casesCount: 'فحص 19 حالة اليوم',
      ticketCode: 'VET-2026-009',
      description: 'فحص الحالات الجلدية، تطعيمات السعار، وتوزيع دراي فود ومكملات لمربي الشوارع ومحبي الحيوانات.',
      badgeClass: 'bg-teal-50 text-teal-800 border border-teal-200',
      markerColor: '#0D9488',
      icon: 'fa-stethoscope',
      pulse: ''
    },
    {
      id: 'zone-6',
      title: 'ملاذ طريق مصر إسكندرية الصحراوي',
      category: 'shelter',
      categoryName: 'ملاذ فرعي',
      district: 'طريق مصر إسكندرية الصحراوي - الكيلو 52',
      lat: 30.0450,
      lng: 30.9500,
      status: 'ملاذ استشفاء ورعاية كبار السن',
      statusType: 'success',
      team: 'فريق رعاية غرب القاهرة',
      time: 'مفتوح طوال الأسبوع',
      casesCount: '320 كلب مقيم',
      ticketCode: null,
      description: 'مخصص للكلاب كبار السن وذوي الإعاقة الحركية، حظائر مظللة واسعة وبيئة رملية هادئة.',
      badgeClass: 'bg-slate-900 text-white',
      markerColor: '#0F172A',
      icon: 'fa-shield-dog',
      pulse: ''
    },
    {
      id: 'zone-7',
      title: 'حملة مسح وتطعيم السعار الميدانية',
      category: 'tnr',
      categoryName: 'حملة TNR',
      district: 'الشيخ زايد - الحي السابع والثامن',
      lat: 30.0380,
      lng: 30.9950,
      status: 'تطعيم وتوثيق إلكتروني',
      statusType: 'lotus',
      team: 'فريق الشيخ زايد وأكتوبر',
      time: 'منذ ساعتين',
      casesCount: '15 حالة محصنة',
      ticketCode: 'TNR-2026-032',
      description: 'تطعيم وقائي ضد السعار والديدان بالتعاون مع اتحاد شاغلي أحياء الشيخ زايد.',
      badgeClass: 'bg-lotus-50 text-lotus-800 border border-lotus-200',
      markerColor: '#D9829B',
      icon: 'fa-syringe',
      pulse: 'pulse-tnr'
    },
    {
      id: 'zone-8',
      title: 'إنقاذ كلب عالق بموقع إنشاءات',
      category: 'emergency',
      categoryName: 'بلاغ طوارئ',
      district: 'مصر الجديدة - ألماظة / النزهة',
      lat: 30.0880,
      lng: 31.3410,
      status: 'تم الإنقاذ بسلام',
      statusType: 'danger',
      team: 'وحدة التدخل السريع رقم 03',
      time: 'منذ 50 دقيقة',
      casesCount: 'حالة مستقرة',
      ticketCode: 'CAI-2026-7811',
      description: 'تم انتشال كلب سقط في حفرة إنشائية غير مسورة، الحالة مستقرة ومتحفظ عليه للفحص الطبي الشامل.',
      badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200',
      markerColor: '#E11D48',
      icon: 'fa-truck-medical',
      pulse: ''
    }
  ];

  // إحداثيات مركز القاهرة
  const cairoCenter = [30.015, 31.235];
  const defaultZoom = 11;

  // تهيئة خريطة Leaflet
  const map = L.map('cairo-operations-map', {
    center: cairoCenter,
    zoom: defaultZoom,
    zoomControl: true,
    scrollWheelZoom: false // منع التمرير غير المقصود
  });

  // تكبير الخريطة داخل نافذة مستقلة على الهاتف مع إعادة Leaflet إلى أبعاده الجديدة.
  if (mapFrame && mapModal && mapModalStage && openMapModalBtn && closeMapModalBtn) {
    const originalMapParent = mapFrame.parentElement;
    const mapPlaceholder = document.createComment('operations-map-frame');
    originalMapParent.insertBefore(mapPlaceholder, mapFrame);

    const closeMapModal = () => {
      if (mapModal.classList.contains('hidden')) return;
      originalMapParent.insertBefore(mapFrame, mapPlaceholder);
      mapModal.classList.add('hidden');
      mapModal.setAttribute('aria-hidden', 'true');
      mapFrame.classList.remove('map-frame-expanded');
      document.body.style.overflow = '';
      map.invalidateSize({ pan: false });
      openMapModalBtn.focus({ preventScroll: true });
    };

    openMapModalBtn.addEventListener('click', () => {
      mapModalStage.appendChild(mapFrame);
      mapFrame.classList.add('map-frame-expanded');
      mapModal.classList.remove('hidden');
      mapModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeMapModalBtn.focus({ preventScroll: true });
      requestAnimationFrame(() => map.invalidateSize({ pan: false }));
    });

    closeMapModalBtn.addEventListener('click', closeMapModal);
    mapModal.addEventListener('click', (event) => {
      if (event.target === mapModal) closeMapModal();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMapModal();
    });
  }

  // تمكين التمرير بالعجلة بعد التركيز
  map.on('focus', () => map.scrollWheelZoom.enable());
  map.on('blur', () => map.scrollWheelZoom.disable());

  // طبقة خريطة CartoDB Voyager الخفيفة والأنيقة مع أسماء الشوارع باللغة العربية
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // مجموعة الدبابيس (Markers Layer Group)
  const markersLayer = L.layerGroup().addTo(map);
  const markerMap = {}; // ربط معرّف المنطقة بالماركر المقابل

  // دالة إنشاء محتوى النافذة المنبثقة لكل موقع
  const createPopupContent = (zone) => {
    return `
      <div class="text-right p-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${zone.badgeClass}">
            <i class="fa-solid ${zone.icon} text-[10px]"></i>
            ${zone.categoryName}
          </span>
          <span class="text-[11px] text-slate-400 font-medium">${zone.time}</span>
        </div>
        
        <h4 class="text-sm font-extrabold text-charcoal-900 mb-1 leading-snug">${zone.title}</h4>
        <p class="text-xs text-slate-500 mb-2 flex items-center gap-1">
          <i class="fa-solid fa-location-dot text-lotus-600"></i>
          <span>${zone.district}</span>
        </p>

        <p class="text-xs text-slate-600 leading-relaxed mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          ${zone.description}
        </p>

        <div class="text-[11px] text-slate-500 space-y-1 mb-3">
          <div class="flex justify-between">
            <span>الفريق المسؤول:</span>
            <strong class="text-slate-800">${zone.team}</strong>
          </div>
          <div class="flex justify-between">
            <span>الحالة:</span>
            <strong class="text-slate-800">${zone.status}</strong>
          </div>
        </div>

        <div class="pt-2 border-t border-slate-100 flex items-center gap-2">
          ${zone.ticketCode ? `
            <button onclick="document.getElementById('track-ticket-input').value='${zone.ticketCode}'; document.getElementById('track-report-form').dispatchEvent(new Event('submit')); document.querySelector('[data-modal-target=track-modal]').click();" class="flex-1 py-1.5 px-3 bg-lotus-600 hover:bg-lotus-700 text-white rounded-lg text-xs font-bold transition-colors text-center">
              <i class="fa-solid fa-magnifying-glass ml-1"></i> تتبع البلاغ
            </button>
          ` : `
            <button onclick="document.querySelector('[data-modal-target=report-modal]').click();" class="flex-1 py-1.5 px-3 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-lg text-xs font-bold transition-colors text-center">
              <i class="fa-solid fa-truck-medical ml-1"></i> إرسال إسناد
            </button>
          `}
          <a href="tel:19875" class="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors" title="اتصال بالخط الساخن">
            <i class="fa-solid fa-phone"></i>
          </a>
        </div>
      </div>
    `;
  };

  // رسم الدبابيس وتحديث القائمة الجانبية
  let currentFilter = 'all';
  let currentSearch = '';

  const renderZones = (shouldFitBounds = false) => {
    markersLayer.clearLayers();
    if (zonesContainer) zonesContainer.innerHTML = '';

    const filtered = cairoZones.filter(zone => {
      const matchesFilter = (currentFilter === 'all') || (zone.category === currentFilter);
      const matchesSearch = !currentSearch || 
        zone.title.includes(currentSearch) || 
        zone.district.includes(currentSearch) || 
        zone.description.includes(currentSearch);
      return matchesFilter && matchesSearch;
    });

    if (filterCountBadge) {
      filterCountBadge.textContent = `${filtered.length} مواقع`;
    }

    if (filtered.length === 0 && zonesContainer) {
      zonesContainer.innerHTML = `
        <div class="p-8 text-center text-slate-400">
          <i class="fa-solid fa-map-pin text-2xl mb-2 text-slate-300"></i>
          <p class="text-xs">لا توجد عمليات تطابق معايير البحث الحالية.</p>
        </div>
      `;
      return;
    }

    const bounds = L.latLngBounds();

    filtered.forEach(zone => {
      // 1. إضافة الدبوس المخصص على الخريطة
      const customIcon = L.divIcon({
        className: 'custom-map-div-icon',
        html: `
          <div class="custom-pin-marker ${zone.pulse}" style="background-color: ${zone.markerColor};" title="${zone.title}">
            <i class="fa-solid ${zone.icon}"></i>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22]
      });

      const marker = L.marker([zone.lat, zone.lng], { icon: customIcon });
      marker.bindPopup(createPopupContent(zone), { maxWidth: 300 });

      marker.on('click', () => {
        highlightSidebarItem(zone.id);
      });

      markersLayer.addLayer(marker);
      markerMap[zone.id] = marker;
      bounds.extend([zone.lat, zone.lng]);

      // 2. إنشاء بطاقة الموقع في القائمة الجانبية
      if (zonesContainer) {
        const card = document.createElement('div');
        card.className = 'map-zone-item bg-white p-3.5 rounded-xl border border-slate-200 cursor-pointer shadow-sm';
        card.setAttribute('data-zone-id', zone.id);
        
        card.innerHTML = `
          <div class="flex items-start justify-between gap-2 mb-1.5">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${zone.badgeClass}">
              <i class="fa-solid ${zone.icon} text-[9px]"></i>
              ${zone.categoryName}
            </span>
            <span class="text-[10px] text-slate-400 font-medium">${zone.time}</span>
          </div>

          <h4 class="text-xs font-bold text-charcoal-900 hover:text-lotus-700 transition-colors leading-snug">
            ${zone.title}
          </h4>

          <p class="text-[11px] text-slate-500 mt-1 flex items-center gap-1 truncate">
            <i class="fa-solid fa-location-dot text-lotus-500 shrink-0"></i>
            <span>${zone.district}</span>
          </p>

          <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span class="text-slate-600 font-medium">${zone.team}</span>
            <span class="text-lotus-700 font-bold hover:underline flex items-center gap-1">
              <span>تحديد على الخريطة</span>
              <i class="fa-solid fa-arrow-left text-[9px]"></i>
            </span>
          </div>
        `;

        card.addEventListener('click', () => {
          focusOnZone(zone);
        });

        zonesContainer.appendChild(card);
      }
    });

    if (shouldFitBounds && filtered.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  };

  // التركيز على موقع معين عند النقر
  const focusOnZone = (zone) => {
    map.flyTo([zone.lat, zone.lng], 14, { duration: 1 });
    const marker = markerMap[zone.id];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 700);
    }
    highlightSidebarItem(zone.id);
  };

  // إبراز البطاقة النشطة في القائمة الجانبية والتمرير إليها
  const highlightSidebarItem = (zoneId) => {
    const allCards = document.querySelectorAll('.map-zone-item');
    allCards.forEach(c => c.classList.remove('active-item'));
    
    const targetCard = document.querySelector(`.map-zone-item[data-zone-id="${zoneId}"]`);
    if (targetCard) {
      targetCard.classList.add('active-item');
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // أزرار التصفية
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active', 'bg-lotus-600', 'text-white', 'shadow-sm');
        b.classList.add('bg-white', 'text-slate-700');
      });

      btn.classList.add('active', 'bg-lotus-600', 'text-white', 'shadow-sm');
      btn.classList.remove('bg-white', 'text-slate-700');

      currentFilter = btn.getAttribute('data-filter');
      renderZones(true);
    });
  });

  // حقل البحث اللحظي
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      renderZones(false);
    });
  }

  // زر إعادة ضبط العرض على القاهرة
  if (recenterBtn) {
    recenterBtn.addEventListener('click', () => {
      map.flyTo(cairoCenter, defaultZoom, { duration: 1 });
      showToast('تمت إعادة ضبط زاوية عرض الخريطة على القاهرة الكبرى', 'info');
    });
  }

  // العرض الأولي للمواقع
  renderZones(false);
}

