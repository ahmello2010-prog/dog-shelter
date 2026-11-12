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

  // فتح/إغلاق القائمة في الهواتف
  if (mobileMenuBtn && mobileMenu) {
    const toggleMobileMenu = () => {
      const isOpen = mobileMenu.classList.contains('hidden');
      if (isOpen) {
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
      }
    };

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    if (mobileMenuCloseBtn) {
      mobileMenuCloseBtn.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
      });
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
      });
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
