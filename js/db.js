/**
 * النظام الرقمي لإدارة مأوى الكلاب الضالة بالقاهرة - Cairo Stray Dog Shelter
 * وحدة إدارة وتخزين البيانات المحلية (LocalStorage Database Engine)
 * يدير البلاغات، الحالات، التبرعات، وطلبات المساعدة عبر كافة صفحات النظام
 */

const DB_KEYS = {
  REPORTS: 'shelter_reports',
  HELP_REQUESTS: 'shelter_help_requests',
  DONATIONS: 'shelter_donations',
  CAREERS: 'shelter_career_applications',
  ACTIVITIES: 'shelter_activities_news',
  AUTH: 'shelter_admin_session'
};

// الحالات السبع المعتمدة للبلاغات
const REPORT_STATUSES = [
  'جديد',
  'قيد المراجعة',
  'تم التواصل مع المبلغ',
  'تمت المعاينة',
  'تم تحويله لفريق الاستجابة',
  'تم التعامل مع الحالة',
  'تعذر التعامل مع البلاغ'
];

// ألوان وشارات الحالات
const STATUS_BADGES = {
  'جديد': {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    icon: 'fa-asterisk'
  },
  'قيد المراجعة': {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    icon: 'fa-clock'
  },
  'تم التواصل مع المبلغ': {
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
    icon: 'fa-phone'
  },
  'تمت المعاينة': {
    bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    dot: 'bg-cyan-500',
    icon: 'fa-magnifying-glass'
  },
  'تم تحويله لفريق الاستجابة': {
    bg: 'bg-lotus-50 text-lotus-800 border-lotus-200',
    dot: 'bg-lotus-500',
    icon: 'fa-truck-medical'
  },
  'تم التعامل مع الحالة': {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: 'fa-check'
  },
  'تعذر التعامل مع البلاغ': {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    icon: 'fa-ban'
  }
};

/**
 * تهيئة البيانات الافتراضية إذا كانت فارغة في LocalStorage
 */
function initDatabase() {
  // 1. تقارير البلاغات
  if (!localStorage.getItem(DB_KEYS.REPORTS)) {
    const initialReports = [
      {
        ticketCode: 'SH-1024',
        reporterName: 'أحمد محمود القاضي',
        reporterPhone: '01098765432',
        district: 'المعادي - شارع النصر / تقاطع دجلة',
        locationDetail: 'أمام بنك مصر بجوار ميدان دجلة',
        dogCondition: 'حادث صدم أو كسر',
        description: 'كلب بلدي بني متوسط الحجم، تعرض لصدمة سيارة ويعاني عرجاً واضحاً بالساق الخلفية اليسرى. هادئ ولا يبدي عدوانية، يحتاج نقلاً عاجلاً للمستشفى البيطري.',
        photo: 'assets/images/hero-1.jpg',
        status: 'تم تحويله لفريق الاستجابة',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        timeline: [
          {
            status: 'جديد',
            timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
            note: 'تم استلام البلاغ وتوثيق إحداثيات الحالة عبر البوابة الرقمية.',
            staffName: 'نظام الاستقبال الآلي'
          },
          {
            status: 'قيد المراجعة',
            timestamp: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(),
            note: 'تم تقييم البلاغ كأولوية قصوى نظراً لوجود اشتباه كسر.',
            staffName: 'د. طارق سامي (مشرف العمليات)'
          },
          {
            status: 'تم التواصل مع المبلغ',
            timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
            note: 'تم الاتصال بالمبلغ وتأكيد موقع الكلب وتثبيته في مكان آمن بالشارع.',
            staffName: 'أ/ منى عبد العزيز (غرفة العمليات)'
          },
          {
            status: 'تم تحويله لفريق الاستجابة',
            timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
            note: 'تحركت سيارة الإسعاف البيطري رقم 02 بقيادة المسعف البيطري علي إبراهيم للموقع.',
            staffName: 'وحدة التدخل السريع - قطاع جنوب القاهرة'
          }
        ]
      },
      {
        ticketCode: 'SH-1018',
        reporterName: 'سارة عبد الرحمن فوزي',
        reporterPhone: '01123456789',
        district: 'القاهرة الجديدة - التجمع الخامس (النرجس)',
        locationDetail: 'شارع التسعين الشمالي خلف مجمع البنوك بجوار الحديقة',
        dogCondition: 'طلب تطعيم وتعقيم (TNR)',
        description: 'مجموعة من 4 كلاب بلدية مسالمة جداً، ترعاها أسر الحي بالإطعام ولكنها تحتاج للتطعيم ضد السعار والتعقيم للحد من التكاثر.',
        photo: 'assets/images/hero-2.jpg',
        status: 'جديد',
        createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        timeline: [
          {
            status: 'جديد',
            timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
            note: 'تم تسجيل الطلب وإدراجه ضمن خطة حملة TNR لقطاع شرق القاهرة.',
            staffName: 'البوابة الرقمية للمواطنين'
          }
        ]
      },
      {
        ticketCode: 'SH-1012',
        reporterName: 'محمود حسن جاد',
        reporterPhone: '01234567890',
        district: 'شبرامنت - طريق سقارة السياحي',
        locationDetail: 'مدخل قرية العزيزية عند الكوبري',
        dogCondition: 'إصابة أو جرح ظاهر',
        description: 'كلب بلدي يعاني من جرح قطعي عميق بالرقبة بسبب سلك شائك، يحتاج لتنظيف وتضميد بيطري عاجل.',
        photo: 'assets/images/about-vet.jpg',
        status: 'تم التعامل مع الحالة',
        createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
        timeline: [
          {
            status: 'جديد',
            timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
            note: 'تم استلام البلاغ من المواطن هاتفياً وتوثيقه.',
            staffName: 'الخط الساخن 19875'
          },
          {
            status: 'تمت المعاينة',
            timestamp: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
            note: 'تمت معاينة الكلب ونقله لعيادة مأوى شبرامنت المركزية.',
            staffName: 'فريق شبرامنت الميداني'
          },
          {
            status: 'تم التعامل مع الحالة',
            timestamp: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
            note: 'تم تنظيف الجرح وخياطته طبياً، والكلب الآن في الحظيرة الاستشفائية رقم 4 تحت الملاحظة.',
            staffName: 'د. هبة رضوان (كبير الأطباء البيطريين)'
          }
        ]
      },
      {
        ticketCode: 'SH-1005',
        reporterName: 'نوران أحمد الشريف',
        reporterPhone: '01011223344',
        district: 'مدينة نصر - تقاطع مكرم عبيد',
        locationDetail: 'جوار محطة وقود توتال بشارع مكرم عبيد',
        dogCondition: 'كلبة مع جراء حديثة الولادة',
        description: 'كلبة وضعت 6 جراء صغيرة أسفل شجرة بجانب ورشة، والمنطقة تشهد حركة سيارات سريعة تشكل خطراً كبيراً عليهم.',
        photo: 'assets/images/hero-3.jpg',
        status: 'تمت المعاينة',
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        timeline: [
          {
            status: 'جديد',
            timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
            note: 'استلام بلاغ الجراء المعرضة للخطر.',
            staffName: 'البوابة الرقمية'
          },
          {
            status: 'تمت المعاينة',
            timestamp: new Date(Date.now() - 44 * 3600 * 1000).toISOString(),
            note: 'تمت زيارة الموقع وتوفير مأوى كرتوني مؤقت وطعام للأم وفحص الجراء للتأكد من سلامتهم.',
            staffName: 'فريق إنقاذ مدينة نصر'
          }
        ]
      }
    ];
    localStorage.setItem(DB_KEYS.REPORTS, JSON.stringify(initialReports));
  }

  // 2. طلبات المساعدة
  if (!localStorage.getItem(DB_KEYS.HELP_REQUESTS)) {
    const initialHelp = [
      {
        id: 'HLP-2001',
        helpType: 'رعاية بيطرية عاجلة',
        animalType: 'كلب بلدي محلي (أبيض وأسود)',
        urgency: 'عالية',
        district: 'الشيخ زايد - الحي الثامن',
        locationDetail: 'بجوار الحديقة المركزية ومول أركان',
        description: 'كلب يعاني من التهاب حاد في الأذن والجلد وفقدان شهية واضح منذ 3 أيام.',
        contactName: 'كريم عبد المجيد',
        contactPhone: '01001234567',
        status: 'قيد المراجعة',
        createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
      },
      {
        id: 'HLP-2002',
        helpType: 'تعقيم وتطعيم (TNR)',
        animalType: 'قطيع من 5 كلاب حراسة مسالمة',
        urgency: 'متوسطة',
        district: 'المنطقة الصناعية - طريق مصر إسكندرية الصحراوي',
        locationDetail: 'محيط مصانع الكيلو 28',
        description: 'الكلاب تحرس محيط المخازن والعمال يطعمونها يومياً، نطلب تطعيمها بلقاح السعار وتعقيم الإناث.',
        contactName: 'م. إبراهيم فؤاد',
        contactPhone: '01223456781',
        status: 'تمت الجدولة',
        createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
      },
      {
        id: 'HLP-2003',
        helpType: 'طلب تبني مسؤول',
        animalType: 'جراء بلدي مفطومة عمر شهرين',
        urgency: 'عادية',
        district: 'المعادي - دجلة',
        locationDetail: 'شارع 218',
        description: 'أرغب في تبني جروين منقذين وتربيتهما في حديقة المنزل بعد توقيع عقد التبني المسؤول.',
        contactName: 'داليا رمزي',
        contactPhone: '01119876543',
        status: 'مقبول ومحدد موعد',
        createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
      }
    ];
    localStorage.setItem(DB_KEYS.HELP_REQUESTS, JSON.stringify(initialHelp));
  }

  // 3. التبرعات
  if (!localStorage.getItem(DB_KEYS.DONATIONS)) {
    const initialDonations = [
      {
        id: 'DON-3001',
        type: 'مالي',
        amount: 1000,
        currency: 'EGP',
        donorName: 'فاعل خير من القاهرة',
        donorPhone: '010****5432',
        paymentMethod: 'إنستا باي (InstaPay)',
        purpose: 'رعاية وعلاج الحالات الجراحية الحرجة',
        status: 'مكتمل ومعتمد',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
      },
      {
        id: 'DON-3002',
        type: 'عيني',
        category: 'طعام جاف ومكملات (Dry Food)',
        quantity: '15 شيكارة 20 كجم',
        donorName: 'شركة النيل للخدمات البيطرية',
        donorPhone: '012****8899',
        address: 'مخازن المنطقة الصناعية بأكتوبر',
        purpose: 'تغذية حظائر مأوى شبرامنت وسقارة',
        status: 'تم الاستلام بالمأوى',
        createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString()
      },
      {
        id: 'DON-3003',
        type: 'خدمات',
        category: 'خدمات بيطرية وجراحية مجانية',
        providerName: 'عيادة كير فيت (د. هشام زكي)',
        providerPhone: '011****1234',
        details: 'تقديم 10 عمليات تعقيم شهرياً مجاناً للمأوى داخل العيادة بمصر الجديدة.',
        status: 'تم توقيع بروتوكول التعاون',
        createdAt: new Date(Date.now() - 50 * 3600 * 1000).toISOString()
      },
      {
        id: 'DON-3004',
        type: 'مالي',
        amount: 500,
        currency: 'EGP',
        donorName: 'مريم عادل الشريف',
        donorPhone: '010****9911',
        paymentMethod: 'فودافون كاش',
        purpose: 'أمصال وتطعيمات حملة سقارة',
        status: 'مكتمل ومعتمد',
        createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
      }
    ];
    localStorage.setItem(DB_KEYS.DONATIONS, JSON.stringify(initialDonations));
  }

  // 4. التطوع والوظائف
  if (!localStorage.getItem(DB_KEYS.CAREERS)) {
    const initialCareers = [
      {
        id: 'CAR-4001',
        type: 'تطوع',
        track: 'فريق الإنقاذ الميداني والتدخل السريع',
        name: 'يوسف كامل بدر',
        phone: '01065432198',
        email: 'youssef.kamel@example.com',
        district: 'الهرم وفيصل',
        availability: 'عطلات نهاية الأسبوع (الجمعة والسبت)',
        skills: 'خبرة في الإمساك الرحيم بالكلاب وقيادة سيارات الدفع الرباعي',
        status: 'تمت الموافقة',
        createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString()
      },
      {
        id: 'CAR-4002',
        type: 'وظيفة',
        position: 'طبيب بيطري مقيم (Resident Veterinarian)',
        name: 'د. سلمى عبد الحميد الشاذلي',
        phone: '01187654321',
        email: 'salma.shazly.vet@example.com',
        district: 'الدقي - الجيزة',
        experience: '3 سنوات في طب وجراحة الحيوانات الأليفة وعمليات التعقيم',
        status: 'قيد المقابلة الفنية',
        createdAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString()
      },
      {
        id: 'CAR-4003',
        type: 'تطوع',
        track: 'التصوير وصناعة المحتوى الرقمي للتبني',
        name: 'ندى أسامة فوزي',
        phone: '01233445566',
        email: 'nada.photos@example.com',
        district: 'المعادي',
        availability: 'يومان أسبوعياً',
        skills: 'تصوير فوتوغرافي احترافي وتصميم بوسترات التعريف بالكلاب المعدة للتبني',
        status: 'جديد',
        createdAt: new Date(Date.now() - 70 * 3600 * 1000).toISOString()
      }
    ];
    localStorage.setItem(DB_KEYS.CAREERS, JSON.stringify(initialCareers));
  }

  // 5. الأنشطة والأخبار
  if (!localStorage.getItem(DB_KEYS.ACTIVITIES)) {
    const initialActivities = [
      {
        id: 'ACT-5001',
        category: 'حملات التعقيم (TNR)',
        title: 'نجاح المرحلة الرابعة لحملة التعقيم والتطعيم الشاملة بمنطقة سقارة وشبرامنت',
        summary: 'تم تعقيم وتطعيم 85 كلباً وتزويدهم بالأطواق الصفراء المعقمة بالتعاون مع كليات الطب البيطري بالقاهرة.',
        date: '10 نوفمبر 2025',
        image: 'assets/images/hero-2.jpg',
        readTime: '4 دقائق قراءة',
        details: 'ضمن البرنامج الوطني الشامل للتعقيم والتطعيم وإعادة الإطلاق (TNR)، نفذت الفرق الميدانية لمأوى القاهرة مسحاً شاملاً لقرى العزيزية وشبرامنت ونطاق سقارة السياحي بمشاركة 12 طبيباً بيطرياً و25 متطوعاً. شملت الحملة الفحص الطبي الشامل، إعطاء لقاح السعار المعتمد، والتثقيف المجتمعي للأهالي حول التعايش السلمي.'
      },
      {
        id: 'ACT-5002',
        category: 'قصص إنقاذ ملهمة',
        title: 'قصة تعافي الكلب "صخر": من كسر حاد في الحوض بطريق الواحات إلى أسرة متبنية سعيدة',
        summary: 'بعد 6 أشهر من العلاج الطبيعي والرعاية في المأوى، وجد صخر بيته الدائم وسط احتفاء من الفريق.',
        date: '5 نوفمبر 2025',
        image: 'assets/images/hero-1.jpg',
        readTime: '3 دقائق قراءة',
        details: 'ورد بلاغ عاجل عن صخر وهو كلب بلدي عمره سنتان صدمته سيارة مسرعة بطريق الواحات. خضع لعملية جراحية دقيقة لتركيب شرائح وتثبيت عظام الحوض، تلتها أسابيع من التأهيل السلوكي والعلاج المائي في ملاذ شبرامنت حتى استعاد كامل قدرته على الجري، قبل أن تتبناه أسرة مصرية واعية.'
      },
      {
        id: 'ACT-5003',
        category: 'فعاليات التبني',
        title: 'يوم التبني المفتوح بمقر مأوى شبرامنت: إيجاد عائلات لـ 22 جرواً وكلباً منقذاً',
        summary: 'شهد اليوم المفتوح إقبالاً كبيراً من العائلات والشباب مع ورش توعية وتوزيع بطاقات الرعاية الأولية.',
        date: '28 أكتوبر 2025',
        image: 'assets/images/hero-3.jpg',
        readTime: '5 دقائق قراءة',
        details: 'استقبل المأوى أكثر من 180 زائراً من القاهرة والجيزة في يوم احتفالي مخصص لتعريف الجمهور بجمال ووفاء الكلاب البلدية المصرية. تم توقيع 22 عقد تبنٍ مسؤول بعد فحص شروط السلامة والتأكد من توافر بيئة أسرية محبة ومستدامة.'
      }
    ];
    localStorage.setItem(DB_KEYS.ACTIVITIES, JSON.stringify(initialActivities));
  }
}

// تشغيل التهيئة تلقائياً
initDatabase();

/**
 * استرجاع كافة البلاغات من LocalStorage
 */
function getAllReports() {
  try {
    const raw = localStorage.getItem(DB_KEYS.REPORTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading reports:', e);
    return [];
  }
}

/**
 * استرجاع بلاغ واحد عبر الكود المرجعي
 */
function getReportByCode(code) {
  if (!code) return null;
  const reports = getAllReports();
  const searchCode = code.trim().toUpperCase();
  return reports.find(r => r.ticketCode && r.ticketCode.toUpperCase() === searchCode) || null;
}

/**
 * حفظ بلاغ جديد وتوليد كود فريد
 */
function createNewReport(reportData) {
  const reports = getAllReports();
  
  let nextNum = 1025;
  if (reports.length > 0) {
    const numbers = reports.map(r => {
      const match = r.ticketCode ? r.ticketCode.match(/SH-(\d+)/) : null;
      return match ? parseInt(match[1], 10) : 1000;
    });
    nextNum = Math.max(...numbers) + 1;
  }
  const ticketCode = `SH-${nextNum}`;

  const newReport = {
    ticketCode,
    reporterName: reportData.reporterName || 'مواطن فاعل خير',
    reporterPhone: reportData.reporterPhone,
    district: reportData.district,
    locationDetail: reportData.locationDetail,
    dogCondition: reportData.dogCondition,
    description: reportData.description || '',
    photo: reportData.photo || null,
    status: 'جديد',
    createdAt: new Date().toISOString(),
    timeline: [
      {
        status: 'جديد',
        timestamp: new Date().toISOString(),
        note: 'تم استلام وتوثيق البلاغ في النظام الرقمي للمأوى بنجاح.',
        staffName: 'نظام الاستقبال الآلي'
      }
    ]
  };

  reports.unshift(newReport);
  localStorage.setItem(DB_KEYS.REPORTS, JSON.stringify(reports));
  return newReport;
}

/**
 * تحديث حالة بلاغ موجود وإضافة سجل في الخط الزمني (Timeline)
 */
function updateReportStatus(ticketCode, newStatus, note = '', staffName = 'مشرف العمليات') {
  const reports = getAllReports();
  const reportIndex = reports.findIndex(r => r.ticketCode && r.ticketCode.toUpperCase() === ticketCode.toUpperCase());
  
  if (reportIndex === -1) return false;

  reports[reportIndex].status = newStatus;
  if (!reports[reportIndex].timeline) {
    reports[reportIndex].timeline = [];
  }

  reports[reportIndex].timeline.push({
    status: newStatus,
    timestamp: new Date().toISOString(),
    note: note || `تم تحديث حالة البلاغ إلى: ${newStatus}`,
    staffName: staffName || 'إدارة المأوى'
  });

  localStorage.setItem(DB_KEYS.REPORTS, JSON.stringify(reports));
  return reports[reportIndex];
}

/**
 * حساب إحصائيات البلاغات الفعلية
 */
function getReportsStatistics() {
  const reports = getAllReports();
  return {
    total: reports.length,
    new: reports.filter(r => r.status === 'جديد').length,
    underReview: reports.filter(r => r.status === 'قيد المراجعة').length,
    inProgress: reports.filter(r => ['تم التواصل مع المبلغ', 'تمت المعاينة', 'تم تحويله لفريق الاستجابة'].includes(r.status)).length,
    resolved: reports.filter(r => r.status === 'تم التعامل مع الحالة').length,
    unreachable: reports.filter(r => r.status === 'تعذر التعامل مع البلاغ').length
  };
}

// طلبات المساعدة
function getAllHelpRequests() {
  try {
    const raw = localStorage.getItem(DB_KEYS.HELP_REQUESTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function createHelpRequest(data) {
  const requests = getAllHelpRequests();
  const nextId = `HLP-${2000 + requests.length + 1}`;
  const newReq = {
    id: nextId,
    helpType: data.helpType,
    animalType: data.animalType || 'كلب بلدي',
    urgency: data.urgency || 'متوسطة',
    district: data.district,
    locationDetail: data.locationDetail,
    description: data.description,
    contactName: data.contactName,
    contactPhone: data.contactPhone,
    photo: data.photo || null,
    status: 'قيد المراجعة',
    createdAt: new Date().toISOString()
  };
  requests.unshift(newReq);
  localStorage.setItem(DB_KEYS.HELP_REQUESTS, JSON.stringify(requests));
  return newReq;
}

function updateHelpRequestStatus(id, newStatus) {
  const requests = getAllHelpRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index !== -1) {
    requests[index].status = newStatus;
    localStorage.setItem(DB_KEYS.HELP_REQUESTS, JSON.stringify(requests));
    return true;
  }
  return false;
}

// التبرعات
function getAllDonations() {
  try {
    const raw = localStorage.getItem(DB_KEYS.DONATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function createDonation(data) {
  const donations = getAllDonations();
  const nextId = `DON-${3000 + donations.length + 1}`;
  const newDonation = {
    id: nextId,
    ...data,
    status: data.type === 'مالي' ? 'مكتمل ومعتمد' : 'جاري التنسيق للتسلم',
    createdAt: new Date().toISOString()
  };
  donations.unshift(newDonation);
  localStorage.setItem(DB_KEYS.DONATIONS, JSON.stringify(donations));
  return newDonation;
}

// التطوع والوظائف
function getAllCareers() {
  try {
    const raw = localStorage.getItem(DB_KEYS.CAREERS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function createCareerApplication(data) {
  const careers = getAllCareers();
  const nextId = `CAR-${4000 + careers.length + 1}`;
  const newApp = {
    id: nextId,
    ...data,
    status: 'جديد',
    createdAt: new Date().toISOString()
  };
  careers.unshift(newApp);
  localStorage.setItem(DB_KEYS.CAREERS, JSON.stringify(careers));
  return newApp;
}

function updateCareerStatus(id, newStatus) {
  const careers = getAllCareers();
  const index = careers.findIndex(c => c.id === id);
  if (index !== -1) {
    careers[index].status = newStatus;
    localStorage.setItem(DB_KEYS.CAREERS, JSON.stringify(careers));
    return true;
  }
  return false;
}

// الأنشطة والأخبار
function getAllActivities() {
  try {
    const raw = localStorage.getItem(DB_KEYS.ACTIVITIES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function createActivity(data) {
  const activities = getAllActivities();
  const nextId = `ACT-${5000 + activities.length + 1}`;
  const newAct = {
    id: nextId,
    ...data,
    date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
  };
  activities.unshift(newAct);
  localStorage.setItem(DB_KEYS.ACTIVITIES, JSON.stringify(activities));
  return newAct;
}

// الجلسة والمصادقة للإدارة
function getAdminSession() {
  return localStorage.getItem(DB_KEYS.AUTH) ? JSON.parse(localStorage.getItem(DB_KEYS.AUTH)) : null;
}

function loginAdmin(email, password) {
  if (email && password) {
    const session = {
      name: 'د. طارق سامي',
      email: email,
      role: 'مدير العمليات وغرفة الطوارئ',
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(DB_KEYS.AUTH, JSON.stringify(session));
    return session;
  }
  return null;
}

function logoutAdmin() {
  localStorage.removeItem(DB_KEYS.AUTH);
}

/**
 * تنسيق التاريخ والوقت بالعربية
 */
function formatArabicDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const now = new Date();
  const diffHours = (now - date) / (1000 * 3600);

  if (diffHours < 1) {
    const diffMinutes = Math.max(1, Math.floor((now - date) / (1000 * 60)));
    return `منذ ${diffMinutes} دقيقة`;
  }
  if (diffHours < 24) {
    return `منذ ${Math.floor(diffHours)} ساعة`;
  }
  if (diffHours < 48) {
    return 'أمس';
  }

  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// تصدير الأدوات للمتصفح
window.ShelterDB = {
  KEYS: DB_KEYS,
  STATUSES: REPORT_STATUSES,
  STATUS_BADGES,
  getAllReports,
  getReportByCode,
  createNewReport,
  updateReportStatus,
  getReportsStatistics,
  getAllHelpRequests,
  createHelpRequest,
  updateHelpRequestStatus,
  getAllDonations,
  createDonation,
  getAllCareers,
  createCareerApplication,
  updateCareerStatus,
  getAllActivities,
  createActivity,
  getAdminSession,
  loginAdmin,
  logoutAdmin,
  formatArabicDate
};
