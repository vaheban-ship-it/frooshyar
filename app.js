  var FOROOSHYAR_VERSION = 'v1.7';

  function checkAppVersion() {
    try {
      var savedVer = localStorage.getItem('forooshyar_app_version');
      if (savedVer !== FOROOSHYAR_VERSION) {
        localStorage.setItem('forooshyar_app_version', FOROOSHYAR_VERSION);
        setTimeout(function() {
          const isEn = (currentLang === 'en');
          alert(isEn ? '✨ Forooshyar updated to version ' + FOROOSHYAR_VERSION + ' successfully.' : '✨ نسخه جدید سیستم فروش‌یار (نسخه ' + FOROOSHYAR_VERSION + ') با اتصال کامل سامانه پویای دریافت و پرداخت به بخش خرید بارگذاری شد.');
        }, 600);
      }
    } catch(e) {}
  }

  function normalizeText(str) {
    if (!str) return '';
    return str.toString().replace(/ك/g, 'ک').replace(/ي/g, 'ی').toLowerCase().trim();
  }

  var GregorianHelper = {
    monthLength: function(gy, gm) { return new Date(gy, gm, 0).getDate(); }
  };

  var JalaaliHelper = {
    toJalaali: function(gy, gm, gd) {
      var g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
      var jy = (gy <= 1600) ? 0 : 979;
      gy -= (gy <= 1600) ? 621 : 1600;
      var gy2 = (gm > 2) ? (gy + 1) : gy;
      var days = (365 * gy) + parseInt((gy2 + 3) / 4) - parseInt((gy2 + 99) / 100) + parseInt((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
      jy += 33 * parseInt(days / 12053);
      days %= 12053;
      jy += 4 * parseInt(days / 1461);
      days %= 1461;
      if (days > 365) { jy += parseInt((days - 1) / 365); days = (days - 1) % 365; }
      var jm = (days < 186) ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
      var jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
      return { jy: jy, jm: jm, jd: jd };
    },
    monthLength: function(jy, jm) {
      if (jm <= 6) return 31;
      if (jm <= 11) return 30;
      var res = jy % 33;
      var isLeap = (res===1||res===5||res===9||res===13||res===17||res===22||res===26||res===30);
      return isLeap ? 30 : 29;
    }
  };

  const SOCIAL_NETWORKS = [
    { type: 'telegram', name: 'تلگرام', icon: 'fab fa-telegram' },
    { type: 'instagram', name: 'اینستاگرام', icon: 'fab fa-instagram' },
    { type: 'whatsapp', name: 'واتساپ', icon: 'fab fa-whatsapp' },
    { type: 'eitaa', name: 'ایتا', icon: 'fas fa-comments' },
    { type: 'rubika', name: 'روبیکا', icon: 'fas fa-paper-plane' },
    { type: 'bale', name: 'بله', icon: 'fas fa-comment-dots' },
    { type: 'soroush', name: 'سروش', icon: 'fas fa-comment-alt' },
    { type: 'igap', name: 'آیگپ', icon: 'fas fa-comment' },
    { type: 'aparat', name: 'آپارات', icon: 'fas fa-play-circle' },
    { type: 'website', name: 'وب‌سایت رسمی', icon: 'fas fa-globe' },
    { type: 'linkedin', name: 'لینکدین', icon: 'fab fa-linkedin' },
    { type: 'youtube', name: 'یوتیوب', icon: 'fab fa-youtube' },
    { type: 'twitter', name: 'ایکس (توییتر)', icon: 'fab fa-x-twitter' },
    { type: 'threads', name: 'تردز', icon: 'fab fa-threads' },
    { type: 'facebook', name: 'فیس‌بوک', icon: 'fab fa-facebook' },
    { type: 'pinterest', name: 'پینترست', icon: 'fab fa-pinterest' },
    { type: 'other', name: 'سایر / لینک', icon: 'fas fa-link' }
  ];

  function getSocialInfo(type) {
    return SOCIAL_NETWORKS.find(s => s.type === type) || { type: 'other', name: 'سایر', icon: 'fas fa-link' };
  }

  function getTodayJalaali() {
    var todayG = new Date();
    return JalaaliHelper.toJalaali(todayG.getFullYear(), todayG.getMonth() + 1, todayG.getDate());
  }

  function toPersianDigits(str) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(str).replace(/[0-9]/g, function (w) {
      return persianDigits[w];
    });
  }

  function getShamsiYYMMDD() {
    try {
      var j = getTodayJalaali();
      var yy = String(j.jy).slice(-2);
      var mm = pad2(j.jm);
      var dd = pad2(j.jd);
      return yy + mm + dd;
    } catch(e) {
      return "050817";
    }
  }

  function getGregorianYYMMDD() {
    var now = new Date();
    var yy = String(now.getFullYear()).slice(-2);
    var mm = pad2(now.getMonth() + 1);
    var dd = pad2(now.getDate());
    return yy + mm + dd;
  }

  function generate15DigitCode(serialNum, lang) {
    var now = new Date();
    var datePart = (lang === 'fa') ? getShamsiYYMMDD() : getGregorianYYMMDD();
    
    var hh = pad2(now.getHours());
    var mm = pad2(now.getMinutes());
    var ss = pad2(now.getSeconds());
    var timePart = hh + mm + ss;

    var serialNumFinal = Math.min(Math.max(Number(serialNum) || 1, 1), 999);
    var serialPart = String(serialNumFinal).padStart(3, '0');
    
    var rawCode = datePart + timePart + serialPart;
    if (lang === 'fa') {
      return toPersianDigits(rawCode);
    }
    return rawCode;
  }

  const translations = {
    fa: {
      subtitle: "سیستم جامع حسابداری فروشگاهی (نسخه " + FOROOSHYAR_VERSION + ")",
      ai_assistant: "دستیار هوش مصنوعی",
      contact_us: "تماس با ما",
      help: "راهنما",
      language: "زبان",
      sale_invoice: "فاکتور فروش",
      purchase_invoice: "فاکتور خرید",
      new_product: "کالا جدید",
      expenses: "هزینه‌ها",
      calendar: "تقویم",
      total_sales: "فروش کل (محاسبه‌شده)",
      total_profit: "سود کل",
      stock_items: "موجودی اقلام انبار",
      total_expenses: "مجموع هزینه‌ها",
      quick_access: "دسترسی سریع",
      manage_expenses: "ثبت و مدیریت هزینه‌ها",
      reports: "گزارشات جامع",
      debtor_customers: "مشتریان بدهکار",
      creditor_suppliers: "تأمین‌کنندگان بستانکار",
      debtors_list: "لیست مشتریان بدهکار",
      creditors_list: "لیست تأمین‌کنندگان بستانکار",
      global_profit_title: "اعمال سود درصدی کلی بر تمام کالاها",
      global_profit_toggle: "فعال‌سازی محاسبه سود درصدی انبار",
      calc_stock: "محاسبه انبار",
      manage_products: "مدیریت کالاها",
      stock_kardex: "موجودی انبار و کاردکس",
      sales_invoices: "فاکتورهای فروش",
      new_invoice: "فاکتور جدید",
      purchase_invoices: "فاکتورهای خرید",
      new_purchase_invoice: "فاکتور خرید جدید",
      customers: "مشتریان",
      suppliers: "تأمین‌کنندگان",
      pick_contacts: "انتخاب مخاطبین",
      btn_new: "جدید",
      store_settings: "تنظیمات عمومی فروشگاه",
      store_name: "نام فروشگاه / عنوان",
      invoice_subtitle: "زیرعنوان فاکتور",
      default_language: "زبان پیش‌فرض برنامه",
      store_logo: "لوگوی فروشگاه",
      manage_payment_types: "مدیریت انواع دریافت و پرداخت",
      payment_types_help: "در این بخش می‌توانید انواع پرداخت (نقدی، چک، کارت‌خوان، کارت‌به‌کارت و...) و کادرهای جزئیات اختصاصی هرکدام را مدیریت کنید.",
      add_payment_type: "افزودن نوع دریافت/پرداخت جدید",
      manage_addresses: "مدیریت آدرس‌های فروشگاه",
      addr_help: "با انتخاب چک‌باکس، آدرس انتخاب‌شده در فاکتورها درج خواهد شد.",
      add_address: "افزودن آدرس جدید",
      manage_phones: "مدیریت شماره‌های تماس",
      phone_help: "با انتخاب چک‌باکس، این شماره تماس در فاکتورها درج خواهد شد.",
      add_phone_new: "افزودن شماره تماس جدید",
      manage_socials: "ارتباط با فروشنده",
      social_help: "شبکه اجتماعی یا راه ارتباطی مورد نظر را انتخاب کرده و آدرس آن را وارد کنید.",
      add_social: "افزودن شبکه اجتماعی جدید",
      manage_banks: "مدیریت حساب‌های بانکی",
      bank_help: "با انتخاب چک‌باکس، حساب بانکی و شماره شبا در فاکتورها درج می‌شود.",
      add_bank: "افزودن حساب بانکی جدید",
      manage_crypto: "مدیریت آدرس‌های رمزارز (Crypto)",
      crypto_help: "با انتخاب چک‌باکس، آدرس کیف‌پول رمزارز در فاکتورها درج خواهد شد.",
      add_crypto: "افزودن آدرس رمزارز جدید",
      save_all_settings: "ذخیره تمام تنظیمات",
      backup_restore: "پشتیبان‌گیری و بازیابی",
      export_backup: "ذخیره فایل پشتیبان (Backup)",
      select_backup: "انتخاب فایل پشتیبان (JSON)",
      choose_file: "انتخاب فایل",
      reset_app: "بازنشانی کامل اطلاعات برنامه",
      select_period: "تعیین بازه زمانی جهت گزارش‌گیری",
      period_today: "امروز",
      period_7days: "۷ روز اخیر",
      period_30days: "۳۰ روز اخیر",
      period_all: "کل دوره‌ها (همه‌زمان)",
      financial_chart_title: "نمودار مقایسه‌ای مالی",
      back_to_home: "بازگشت به صفحه اصلی",
      contact_creator: "تماس با سازنده نرم‌افزار",
      creator_desc: "طراح، معمار نرم‌افزار و توسعه‌دهنده سیستم جامع فروش‌یار",
      back: "بازگشت",
      ai_assistant_title: "دستیار هوشمند فروش‌یا‌ر (AI)",
      ledger_account: "دفتر حساب: ",
      ledger_total_bal: "مجموع مانده حساب:",
      amount_received: "مبلغ دریافتی نقدی / کارت (تومان)",
      excess_amount: "مازاد دریافت (تومان)",
      trans_desc: "شرح تراکنش",
      trans_default_note: "تسویه حساب / دریافت وجه",
      ph_amount: "مثلا ۵۰۰,۰۰۰",
      ph_excess: "مثلا ۱۰۰,۰۰۰",
      ph_exp_title: "شرح / عنوان هزینه (مثلاً: کرایه مغازه)...",
      ph_exp_cat: "دسته‌بندی (انتخاب از لیست زیر یا تایپ جدید)...",
      ph_exp_amount: "مبلغ هزینه (تومان)...",
      ph_pur_name: "نام کالا *",
      ph_pur_cat: "دسته‌بندی کالا (انتخاب از لیست زیر یا تایپ جدید)...",
      ph_pur_qty: "تعداد",
      ph_pur_price: "خرید واحد (تومان)",
      ph_sale_qty: "تعداد",
      ph_sale_price: "قیمت واحد (تومان)",
      ph_prod_name: "نام کالا *",
      ph_prod_barcode: "کد کالا / بارکد",
      ph_prod_qty: "موجودی انبار",
      ph_prod_buy: "قیمت خرید",
      ph_prod_price: "قیمت فروش",
      save_in_ledger: "ثبت در دفتر حساب",
      all_transactions: "همه تراکنش‌ها",
      recent_3: "۳ حساب اخیر",
      recent_7: "۷ حساب اخیر",
      send_text: "ارسال متنی",
      send_image: "ارسال تصویری (۶ قلم)",
      print: "چاپ",
      help_guide_title: "راهنمای جامع فروش‌یار",
      help_item_1_title: "۱. مدیریت کالاها و انبار",
      help_item_1_desc: "محصولات را همراه با قیمت خرید، فروش، موجودی و دسته‌بندی ثبت کنید.",
      help_item_2_title: "۲. صدور فاکتور فروش",
      help_item_2_desc: "فاکتور فروش صادر کرده و مبالغ و تخفیف‌ها را مدیریت کنید.",
      help_item_3_title: "۳. ثبت فاکتورهای خرید",
      help_item_3_desc: "خرید اقلام از تأمین‌کنندگان را ثبت نموده و موجودی انبار را شارژ کنید.",
      help_item_4_title: "۴. مدیریت مشتریان و دفتر حساب",
      help_item_4_desc: "مفاصا حساب، مانده بدهی مشتریان و تأمین‌کنندگان را پیگیری کنید.",
      help_item_5_title: "۵. ثبت هزینه‌ها و گزارشات",
      help_item_5_desc: "هزینه‌های جاری فروشگاه را ثبت کرده و سود و زیان دقیق را مشاهده کنید.",
      got_it: "متوجه شدم",
      expense_management: "مدیریت کامل هزینه‌ها",
      add_new_expense: "ثبت هزینه جدید",
      expense_title: "شرح / عنوان هزینه *",
      amount: "مبلغ *",
      category: "دسته‌بندی",
      save_expense: "ثبت هزینه",
      edit_add_product: "افزودن / ویرایش کالا",
      product_name: "نام کالا *",
      product_barcode: "کد کالا / بارکد",
      stock_qty: "موجودی انبار",
      buy_price: "قیمت خرید",
      auto_calc_margin: "محاسبه خودکار قیمت فروش با درصد سود",
      profit_margin: "درصد سود (٪)",
      sell_price: "قیمت فروش",
      save_product: "ذخیره کالا",
      customer_file: "پرونده مشتری",
      contact_avatar: "تصویر مخاطب",
      customer_name: "نام و نام خانوادگی مشتری",
      phone_numbers: "شماره‌های تماس",
      add_phone: "افزودن شماره",
      full_address: "آدرس کامل",
      save_file: "ذخیره پرونده",
      supplier_file: "پرونده تأمین‌کننده",
      supplier_name: "نام شرکت / تأمین‌کننده",
      issue_sale_invoice: "صدور فاکتور فروش",
      clear_form: "پاکسازی",
      select_customer: "انتخاب مشتری",
      invoice_date: "تاریخ فاکتور",
      add_product_item: "افزودن قلم کالا",
      select_product: "انتخاب کالا",
      quantity: "تعداد",
      unit_price: "قیمت واحد",
      add_to_list: "افزودن به لیست",
      registered_items: "اقلام ثبت‌شده در فاکتور",
      lbl_invoice_subtotal: "مبلغ فاکتور",
      lbl_discount: "تخفیف",
      lbl_receivable: "مبلغ قابل دریافت",
      lbl_payable: "مبلغ قابل پرداخت",
      lbl_received: "دریافتی",
      lbl_paid: "پرداختی",
      lbl_remaining: "مانده حساب",
      lbl_excess_received: "مازاد دریافت",
      lbl_excess_paid: "مازاد پرداخت",
      save_and_issue: "ذخیره و صدور",
      record_purchase_invoice: "ثبت فاکتور خرید",
      supplier: "تأمین‌کننده",
      purchase_date: "تاریخ فاکتور خرید",
      add_pur_product_item: "افزودن قلم کالا خرید",
      buy_unit_price: "قیمت خرید واحد",
      add_to_pur_list: "افزودن به لیست خرید",
      registered_pur_items: "اقلام ثبت‌شده در فاکتور خرید",
      record_purchase: "ثبت خرید",
      invoice_preview: "پیش‌نمایش فاکتور رسمی",
      daily_calendar_report: "تقویم گزارش‌گیری روزانه",
      prev_month: "ماه قبل",
      next_month: "ماه بعد",
      day_sat: "ش", day_sun: "ی", day_mon: "د", day_tue: "س", day_wed: "چ", day_thu: "پ", day_fri: "ج",
      daily_report: "گزارش روز",
      select_language: "انتخاب زبان / Language",
      nav_home: "خانه", nav_products: "کالاها", nav_stock: "انبار", nav_sales: "فروش", nav_purchases: "خرید", nav_customers: "مشتریان", nav_suppliers: "تأمین", nav_more: "تنظیمات",
      search_product_ph: "جستجوی نام کالا...",
      search_stock_ph: "جستجو در انبار...",
      search_sale_ph: "جستجوی فاکتور فروش...",
      search_purchase_ph: "جستجوی فاکتور خرید...",
      search_customer_ph: "جستجوی مشتری...",
      search_supplier_ph: "جستجوی تأمین‌کننده...",
      search_expense_ph: "جستجو در هزینه‌ها...",
      cat_general: "عمومی",
      cat_rent: "اجاره",
      cat_utilities: "قبوض",
      cat_salaries: "حقوق",
      all_categories: "همه دسته‌بندی‌ها",
      choose_file: "انتخاب فایل",
      file_not_selected: "فایلی انتخاب نشده است",
      record_payment_title: "ثبت تسویه / دریافت وجه",
      no_debtor_cust: "مشتری بدهکاری وجود ندارد",
      no_creditor_supp: "تأمین‌کننده بستانکاری وجود ندارد",
      no_items_found: "آیتمی اضافه نشده است",
      no_prod_found: "کالایی یافت نشد",
      no_expense_found: "هزینه‌ای ثبت نشده است",
      no_sale_found: "فاکتور فروشی ثبت نشده است",
      no_pur_found: "فاکتور خریدی ثبت نشده است",
      no_cust_found: "مشتری یافت نشد",
      no_supp_found: "تأمین‌کننده‌ای یافت نشد",
      str_invoice_no: "فاکتور #",
      str_purchase_no: "خرید #",
      str_settled: "تسویه",
      str_debtor: "بدهکار",
      str_creditor: "طلبکار",
      unit_currency: "تومان",
      unit_qty: "عدد",
      alert_unsettled_cust: "⚠️ پیام سیستم:\nمشتری «{custName}» دارای مازاد دریافتی تسویه‌نشده است.\n\n👉 اقدام لازم:\n۱. به بخش «مشتریان» بروید.\n۲. روی دکمه «دفتر» در کنار نام مخاطب کلیک کنید.\n۳. مبلغ مازاد را در دفتر حساب ثبت نمایید.",
      alert_unsettled_supp: "⚠️ پیام سیستم:\nتأمین‌کننده «{suppName}» دارای مازاد پرداختی تسویه‌نشده است.\n\n👉 اقدام لازم:\n۱. به بخش «تأمین» بروید.\n۲. روی دکمه «دفتر» در کنار نام مخاطب کلیک کنید.\n۳. مبلغ مازاد را در دفتر حساب ثبت نمایید."
    },
    en: {
      subtitle: "Comprehensive Store Accounting System (v" + FOROOSHYAR_VERSION + ")",
      ai_assistant: "AI Assistant",
      contact_us: "Contact Us",
      help: "Help",
      language: "Language",
      sale_invoice: "Sales Invoice",
      purchase_invoice: "Purchase Invoice",
      new_product: "New Product",
      expenses: "Expenses",
      calendar: "Calendar",
      total_sales: "Total Sales",
      total_profit: "Total Profit",
      stock_items: "Stock Items",
      total_expenses: "Total Expenses",
      quick_access: "Quick Access",
      manage_expenses: "Manage Expenses",
      reports: "Reports",
      debtor_customers: "Debtor Customers",
      creditor_suppliers: "Creditor Suppliers",
      debtors_list: "Debtors List",
      creditors_list: "Creditors List",
      global_profit_title: "Apply Global Profit Margin",
      global_profit_toggle: "Enable Global Profit Margin",
      calc_stock: "Calculate Stock",
      manage_products: "Products Management",
      stock_kardex: "Stock & Inventory",
      sales_invoices: "Sales Invoices",
      new_invoice: "New Invoice",
      purchase_invoices: "Purchase Invoices",
      new_purchase_invoice: "New Purchase Invoice",
      customers: "Customers",
      suppliers: "Suppliers",
      pick_contacts: "Pick Contacts",
      btn_new: "New",
      store_settings: "General Store Settings",
      store_name: "Store Name / Title",
      invoice_subtitle: "Invoice Subtitle",
      default_language: "Default Language",
      store_logo: "Store Logo",
      manage_payment_types: "Manage Payment & Receipt Types",
      payment_types_help: "Manage payment/receipt types (Cash, Cheque, POS, Card Transfer, etc.) and custom detail fields for each.",
      add_payment_type: "Add New Payment/Receipt Type",
      manage_addresses: "Manage Store Addresses",
      addr_help: "Selected addresses will be included in invoices.",
      add_address: "Add New Address",
      manage_phones: "Manage Phone Numbers",
      phone_help: "Selected phone numbers will be included in invoices.",
      add_phone_new: "Add New Phone Number",
      manage_socials: "Seller Contact Options",
      social_help: "Select social network/contact option and enter details.",
      add_social: "Add New Social Network",
      manage_banks: "Manage Bank Accounts",
      bank_help: "Selected bank accounts and IBAN will be included in invoices.",
      add_bank: "Add New Bank Account",
      manage_crypto: "Manage Crypto Addresses",
      crypto_help: "Selected wallet addresses will be included in invoices.",
      add_crypto: "Add New Crypto Address",
      save_all_settings: "Save All Settings",
      backup_restore: "Backup & Restore",
      export_backup: "Export Backup File",
      select_backup: "Select Backup File (JSON)",
      choose_file: "Choose File",
      reset_app: "Reset Application Data",
      select_period: "Select Time Period for Report",
      period_today: "Today",
      period_7days: "Last 7 Days",
      period_30days: "Last 30 Days",
      period_all: "All Time",
      financial_chart_title: "Financial Comparison Chart",
      back_to_home: "Back to Home",
      contact_creator: "Contact Developer",
      creator_desc: "Architect & Lead Developer of Forooshyar System",
      back: "Back",
      ai_assistant_title: "Forooshyar Smart AI Assistant",
      ledger_account: "Ledger Account: ",
      ledger_total_bal: "Total Balance:",
      amount_received: "Amount Received (Cash/Card)",
      excess_amount: "Excess Received Amount",
      trans_desc: "Transaction Note",
      trans_default_note: "Account Settlement / Receipt",
      ph_amount: "e.g. 500,000",
      ph_excess: "e.g. 100,000",
      ph_exp_title: "Description / Title (e.g. Shop Rent)...",
      ph_exp_cat: "Category (Select below or type new)...",
      ph_exp_amount: "Expense Amount (Tomans)...",
      ph_pur_name: "Product Name *",
      ph_pur_cat: "Category (Select below or type new)...",
      ph_pur_qty: "Quantity",
      ph_pur_price: "Unit Buy Price (Tomans)",
      ph_sale_qty: "Quantity",
      ph_sale_price: "Unit Price (Tomans)",
      ph_prod_name: "Product Name *",
      ph_prod_barcode: "Barcode / Code",
      ph_prod_qty: "Stock Quantity",
      ph_prod_buy: "Cost Price",
      ph_prod_price: "Selling Price",
      save_in_ledger: "Save to Ledger",
      all_transactions: "All Transactions",
      recent_3: "Recent 3 Transactions",
      recent_7: "Recent 7 Transactions",
      send_text: "Send Text",
      send_image: "Send Image (6 Items)",
      print: "Print",
      help_guide_title: "Forooshyar User Guide",
      help_item_1_title: "1. Inventory & Products",
      help_item_1_desc: "Register products with cost, selling price, quantity, and category.",
      help_item_2_title: "2. Sales Invoices",
      help_item_2_desc: "Issue sales invoices, manage discounts and remaining balances.",
      help_item_3_title: "3. Purchase Invoices",
      help_item_3_desc: "Record purchases from suppliers and auto-restock inventory.",
      help_item_4_title: "4. Customers & Ledger",
      help_item_4_desc: "Track and settle remaining balances for customers and suppliers.",
      help_item_5_title: "5. Expenses & Reports",
      help_item_5_desc: "Record store expenses and view accurate profit/loss reports.",
      got_it: "Got It",
      expense_management: "Expense Management",
      add_new_expense: "Add New Expense",
      expense_title: "Expense Title / Description *",
      amount: "Amount *",
      category: "Category",
      save_expense: "Save Expense",
      edit_add_product: "Add / Edit Product",
      product_name: "Product Name *",
      product_barcode: "Barcode / Code",
      stock_qty: "Stock Quantity",
      buy_price: "Cost Price",
      auto_calc_margin: "Auto-calculate sell price with profit margin",
      profit_margin: "Profit Margin (%)",
      sell_price: "Selling Price",
      save_product: "Save Product",
      customer_file: "Customer File",
      contact_avatar: "Contact Avatar",
      customer_name: "Customer Full Name",
      phone_numbers: "Phone Numbers",
      add_phone: "Add Phone",
      full_address: "Full Address",
      save_file: "Save File",
      supplier_file: "Supplier File",
      supplier_name: "Company / Supplier Name",
      issue_sale_invoice: "Issue Sales Invoice",
      clear_form: "Clear",
      select_customer: "Select Customer",
      invoice_date: "Invoice Date",
      add_product_item: "Add Item",
      select_product: "Select Product",
      quantity: "Quantity",
      unit_price: "Unit Price",
      add_to_list: "Add to List",
      registered_items: "Items in Invoice",
      lbl_invoice_subtotal: "Invoice Total",
      lbl_discount: "Discount",
      lbl_receivable: "Receivable Amount",
      lbl_payable: "Payable Amount",
      lbl_received: "Amount Received",
      lbl_paid: "Amount Paid",
      lbl_remaining: "Remaining Balance",
      lbl_excess_received: "Excess Received",
      lbl_excess_paid: "Excess Paid",
      save_and_issue: "Save & Issue",
      record_purchase_invoice: "Record Purchase Invoice",
      supplier: "Supplier",
      purchase_date: "Purchase Date",
      add_pur_product_item: "Add Purchase Item",
      buy_unit_price: "Unit Purchase Price",
      add_to_pur_list: "Add to Purchase List",
      registered_pur_items: "Items in Purchase Invoice",
      record_purchase: "Record Purchase",
      invoice_preview: "Invoice Preview",
      daily_calendar_report: "Daily Calendar Report",
      prev_month: "Prev Month",
      next_month: "Next Month",
      day_sat: "Sat", day_sun: "Sun", day_mon: "Mon", day_tue: "Tue", day_wed: "Wed", day_thu: "Thu", day_fri: "Fri",
      daily_report: "Daily Report",
      select_language: "Select Language",
      nav_home: "Home", nav_products: "Products", nav_stock: "Stock", nav_sales: "Sales", nav_purchases: "Purchases", nav_customers: "Customers", nav_suppliers: "Suppliers", nav_more: "Settings",
      search_product_ph: "Search product name...",
      search_stock_ph: "Search inventory...",
      search_sale_ph: "Search sales invoice...",
      search_purchase_ph: "Search purchase invoice...",
      search_customer_ph: "Search customer...",
      search_supplier_ph: "Search supplier...",
      search_expense_ph: "Search expenses...",
      cat_general: "General",
      cat_rent: "Rent",
      cat_utilities: "Utilities",
      cat_salaries: "Salaries",
      all_categories: "All Categories",
      choose_file: "Choose File",
      file_not_selected: "No file selected",
      record_payment_title: "Record Payment / Settlement",
      no_debtor_cust: "No debtor customers found",
      no_creditor_supp: "No creditor suppliers found",
      no_items_found: "No items added yet",
      no_prod_found: "No products found",
      no_expense_found: "No expenses recorded",
      no_sale_found: "No sales invoices found",
      no_pur_found: "No purchase invoices found",
      no_cust_found: "No customers found",
      no_supp_found: "No suppliers found",
      str_invoice_no: "Invoice #",
      str_purchase_no: "Purchase #",
      str_settled: "Settled",
      str_debtor: "Debtor",
      str_creditor: "Creditor",
      unit_currency: "Tomans",
      unit_qty: "Pcs",
      alert_unsettled_cust: "⚠️ System Message:\nThe customer «{custName}» has an unsettled excess received.\n\n👉 Required Action:\n1. Go to the 'Customers' section.\n2. Click the 'Ledger' button next to the contact name.\n3. Record the excess amount in the ledger.",
      alert_unsettled_supp: "⚠️ System Message:\nThe supplier «{suppName}» has an unsettled excess payment.\n\n👉 Required Action:\n1. Go to the 'Suppliers' section.\n2. Click the 'Ledger' button next to the contact name.\n3. Record the excess amount in the ledger."
    }
  };

  var currentLang = localStorage.getItem('forooshyar_lang') || 'fa';

  function applyLanguage() {
    try {
      document.documentElement.lang = currentLang;
      document.documentElement.dir = (currentLang === 'en') ? 'ltr' : 'rtl';
      
      var btnInd = document.getElementById('current-lang-btn');
      if(btnInd) btnInd.innerText = currentLang.toUpperCase();
      
      document.querySelectorAll('.lang-option').forEach(el => el.classList.remove('active'));
      var activeOpt = document.getElementById('lang-opt-' + currentLang);
      if(activeOpt) activeOpt.classList.add('active');

      var activeCfgOpt = document.getElementById('cfg-lang-' + currentLang);
      if(activeCfgOpt) activeCfgOpt.classList.add('active');

      const dict = translations[currentLang] || translations.fa;
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) { el.innerText = dict[key]; }
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) { el.placeholder = dict[key]; }
      });

      var placeholderMap = {
        'exp-new-title': 'ph_exp_title',
        'exp-new-cat': 'ph_exp_cat',
        'exp-new-amount': 'ph_exp_amount',
        'pur-input-name': 'ph_pur_name',
        'pur-input-category': 'ph_pur_cat',
        'pur-input-qty': 'ph_pur_qty',
        'pur-input-price': 'ph_pur_price',
        'sale-input-qty': 'ph_sale_qty',
        'sale-input-price': 'ph_sale_price',
        'prod-name': 'ph_prod_name',
        'prod-barcode': 'ph_prod_barcode',
        'prod-qty': 'ph_prod_qty',
        'prod-buy-price': 'ph_prod_buy',
        'prod-price': 'ph_prod_price'
      };
      Object.keys(placeholderMap).forEach(id => {
        var el = document.getElementById(id);
        var key = placeholderMap[id];
        if (el && dict[key]) {
          el.placeholder = dict[key];
        }
      });

      var chooseFileText = dict['choose_file'] || 'Choose File';
      if(document.getElementById('logo-file-label')) document.getElementById('logo-file-label').innerText = chooseFileText;
      if(document.getElementById('restore-file-label')) document.getElementById('restore-file-label').innerText = chooseFileText;
      if(document.getElementById('cust-file-label')) document.getElementById('cust-file-label').innerText = chooseFileText;
      if(document.getElementById('supp-file-label')) document.getElementById('supp-file-label').innerText = chooseFileText;

      localStorage.setItem('forooshyar_lang', currentLang);
    } catch(e) {}
  }

  function setLanguage(lang) { 
    currentLang = lang; 
    applyLanguage(); 
    closeModal('modal-lang'); 
    renderAll();
  }

  // --- ساختار پویای انواع دریافت و پرداخت پیش‌فرض ---
  var defaultPaymentTypes = [
    {
      id: 'cash',
      name: 'نقد',
      isDefault: true,
      fields: []
    },
    {
      id: 'cheque',
      name: 'چک',
      isDefault: true,
      fields: [
        { id: 'ch_num', label: 'شماره چک', placeholder: 'مثلاً: ۱۲۳۴۵۶' },
        { id: 'ch_issuer', label: 'نام صادرکننده / صاحب حساب', placeholder: 'نام صادرکننده چک...' },
        { id: 'ch_date', label: 'تاریخ سررسید', placeholder: 'مثلاً: ۱۴۰۵/۰۲/۱۵' },
        { id: 'ch_bank', label: 'نام بانک و شعبه', placeholder: 'نام بانک و شعبه صادرکننده...' }
      ]
    },
    {
      id: 'pos',
      name: 'کارت‌خوان (پوز)',
      isDefault: true,
      fields: [
        { id: 'pos_ref', label: 'شماره تراکنش / کد رهگیری', placeholder: 'مثلاً: ۹۸۷۶۵۴' },
        { id: 'pos_bank', label: 'دستگاه کارت‌خوان / بانک', placeholder: 'مثلاً: کارت‌خوان سامان...' }
      ]
    },
    {
      id: 'card_transfer',
      name: 'کارت‌به‌کارت',
      isDefault: true,
      fields: [
        { id: 'card_ref', label: 'کد رهگیری / شماره پیگیری', placeholder: 'مثلاً: ۱۲۳۹۸۷' },
        { id: 'card_dest', label: 'حساب / کارت مقصد', placeholder: 'نام بانک یا شماره کارت مقصد...' }
      ]
    }
  ];

  var defaultDb = {
    settings: { 
      title: "فروش‌یار", 
      subtitle: "سیستم جامع حسابداری فروشگاهی", 
      logo: "",
      paymentTypes: defaultPaymentTypes,
      standaloneAddresses: [{ id: 1, enabled: true, text: "" }],
      phones: [{ id: 1, enabled: true, number: "" }],
      socials: [{ id: 1, enabled: true, type: "telegram", name: "تلگرام", link: "" }],
      banks: [{ id: 1, enabled: true, bankName: "", cardNumber: "", iban: "" }],
      cryptos: [{ id: 1, enabled: true, coinName: "", walletAddress: "" }]
    },
    products: [],
    sales: [],
    purchases: [],
    expenses: [],
    customers: [],
    suppliers: [],
    ledgerTransactions: [],
    customExpenseCategories: [],
    deletedExpenseCategories: [],
    customProductCategories: [],
    deletedProductCategories: []
  };

  var db = defaultDb;
  try {
    var raw = localStorage.getItem('forooshyar_db_v17');
    if (raw) { var parsed = JSON.parse(raw); if (parsed) db = parsed; }
  } catch(e) { db = defaultDb; }

  if(!db.products) db.products = [];
  if(!db.sales) db.sales = [];
  if(!db.purchases) db.purchases = [];
  if(!db.expenses) db.expenses = [];
  if(!db.customers) db.customers = [];
  if(!db.suppliers) db.suppliers = [];
  if(!db.ledgerTransactions) db.ledgerTransactions = [];
  if(!db.customExpenseCategories) db.customExpenseCategories = [];
  if(!db.deletedExpenseCategories) db.deletedExpenseCategories = [];
  if(!db.customProductCategories) db.customProductCategories = [];
  if(!db.deletedProductCategories) db.deletedProductCategories = [];
  if(!db.settings) db.settings = defaultDb.settings;
  if(!db.settings.paymentTypes || db.settings.paymentTypes.length === 0) db.settings.paymentTypes = defaultPaymentTypes;
  if(!db.settings.standaloneAddresses) db.settings.standaloneAddresses = defaultDb.settings.standaloneAddresses || [];
  if(!db.settings.phones) db.settings.phones = defaultDb.settings.phones || [];
  if(!db.settings.socials) db.settings.socials = defaultDb.settings.socials || [];
  if(!db.settings.banks) db.settings.banks = defaultDb.settings.banks || [];
  if(!db.settings.cryptos) db.settings.cryptos = defaultDb.settings.cryptos || [];

  var activeSaleItems = [];
  var activePurItems = [];
  var selectedSalePaymentTypeId = null;
  var currentSalePaymentDetails = {};
  var selectedPurPaymentTypeId = null;
  var currentPurPaymentDetails = {};
  var currentPreviewInvoice = null;
  var currentPreviewType = 'sale';
  var selectedCalDateStr = '';
  var tempCustAvatar = '';
  var tempSuppAvatar = '';
  var currentCalJalaali = { jYear: 1405, jMonth: 1 };
  var currentCalGregorian = { gYear: 2026, gMonth: 10 };
  var monthNamesList = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
  var monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  try {
    var todayG = new Date();
    var todayJ = JalaaliHelper.toJalaali(todayG.getFullYear(), todayG.getMonth() + 1, todayG.getDate());
    currentCalJalaali.jYear = todayJ.jy;
    currentCalJalaali.jMonth = todayJ.jm;
    currentCalGregorian.gYear = todayG.getFullYear();
    currentCalGregorian.gMonth = todayG.getMonth() + 1;
  } catch(e) {}

  function printElement(elementId) { window.print(); }

  function handleLogoFileChange(e) {
    var file = e.target.files[0];
    var labelEl = document.getElementById('logo-file-label');
    if (file) {
      if(labelEl) labelEl.innerText = file.name;
      uploadLogo(e);
    }
  }

  function handleRestoreFileChange(e) {
    var file = e.target.files[0];
    var labelEl = document.getElementById('restore-file-label');
    var statusEl = document.getElementById('restore-file-status');
    if (file) {
      if(labelEl) labelEl.innerText = file.name;
      if(statusEl) {
        statusEl.innerHTML = '<i class="fas fa-check-circle text-success"></i> فایل پشتیبان با موفقیت بارگذاری شد.';
        statusEl.style.color = 'var(--success)';
      }
      importBackup(e);
    } else {
      const dict = translations[currentLang] || translations.fa;
      if(labelEl) labelEl.innerText = dict['choose_file'] || 'Choose File';
      if(statusEl) statusEl.innerText = '';
    }
  }

  function handleCustAvatarFileChange(e) {
    var file = e.target.files[0];
    var labelEl = document.getElementById('cust-file-label');
    if (file) {
      if(labelEl) labelEl.innerText = file.name;
      uploadCustomerAvatar(e);
    }
  }

  function handleSuppAvatarFileChange(e) {
    var file = e.target.files[0];
    var labelEl = document.getElementById('supp-file-label');
    if (file) {
      if(labelEl) labelEl.innerText = file.name;
      uploadSupplierAvatar(e);
    }
  }

  function generateInvoiceFooterDetails() {
    var html = '';
    var divider = '<div class="invoice-divider">━━━━━━ • ✿ • ━━━━━━</div>';
    var hasContent = false;
    const isEn = (currentLang === 'en');

    var enabledBanks = (db.settings.banks || []).filter(b => b.enabled && (b.bankName || b.cardNumber || b.iban));
    if(enabledBanks.length > 0) {
      hasContent = true;
      html += divider + '<div class="invoice-section-title">' + (isEn ? 'Bank Accounts:' : 'حساب‌های بانکی:') + '</div>';
      enabledBanks.forEach(b => {
        var cardPart = b.cardNumber ? (isEn ? 'Card: ' : 'کارت: ') + b.cardNumber : '';
        var ibanPart = b.iban ? (isEn ? ' | IBAN: ' : ' | شبا: ') + b.iban : '';
        html += '<div style="margin-bottom: 2px;">' + (b.bankName ? b.bankName + ': ' : '') + cardPart + (ibanPart ? '<br><span style="font-family:monospace; font-size:0.72rem;">' + b.iban + '</span>' : '') + '</div>';
      });
    }

    var enabledPhones = (db.settings.phones || []).filter(p => p.enabled && p.number && p.number.trim() !== '');
    if(enabledPhones.length > 0) {
      hasContent = true;
      html += divider + '<div class="invoice-section-title">' + (isEn ? 'Contact Phones:' : 'شماره‌های تماس:') + '</div>';
      enabledPhones.forEach(p => { html += '<div>📞 ' + p.number + '</div>'; });
    }

    var enabledAddrs = (db.settings.standaloneAddresses || []).filter(a => a.enabled && a.text && a.text.trim() !== '');
    if(enabledAddrs.length > 0) {
      hasContent = true;
      html += divider + '<div class="invoice-section-title">' + (isEn ? 'Address:' : 'آدرس:') + '</div>';
      enabledAddrs.forEach(a => { html += '<div>📍 ' + a.text + '</div>'; });
    }

    var enabledSocials = (db.settings.socials || []).filter(s => s.enabled && (s.link || s.name));
    if(enabledSocials.length > 0) {
      hasContent = true;
      html += divider + '<div class="invoice-section-title">' + (isEn ? 'Seller Links:' : 'ارتباط با فروشنده:') + '</div>';
      html += '<div class="invoice-link-row">';
      enabledSocials.forEach(s => {
        var sInfo = getSocialInfo(s.type);
        var displayName = s.name || sInfo.name;
        if (s.link && s.link.trim() !== '') {
          html += '<a href="' + s.link + '" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: bold; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;"><i class="' + sInfo.icon + '"></i> ' + displayName + '</a>';
        } else {
          html += '<span style="font-weight: bold; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;"><i class="' + sInfo.icon + '"></i> ' + displayName + '</span>';
        }
      });
      html += '</div>';
    }

    var enabledCryptos = (db.settings.cryptos || []).filter(c => c.enabled && c.walletAddress && c.walletAddress.trim() !== '');
    if(enabledCryptos.length > 0) {
      hasContent = true;
      html += divider + '<div class="invoice-section-title">' + (isEn ? 'Crypto Wallets:' : 'آدرس‌های رمزارز:') + '</div>';
      enabledCryptos.forEach(c => { html += '<div style="word-break:break-all;">' + (c.coinName ? c.coinName + ': ' : '') + c.walletAddress + '</div>'; });
    }

    if(!hasContent) return '';
    return '<div class="invoice-footer-section">' + html + '</div>';
  }

  function generateInvoiceTextDetails(obj, type) {
    var text = '';
    var divider = '\n━━━━━━ • ✿ • ━━━━━━\n';
    const isEn = (currentLang === 'en');

    var enabledBanks = (db.settings.banks || []).filter(b => b.enabled && (b.bankName || b.cardNumber || b.iban));
    if(enabledBanks.length > 0) {
      text += divider + (isEn ? '💳 **Bank Accounts:**\n' : '💳 **حساب‌های بانکی:**\n');
      enabledBanks.forEach(b => {
        text += (b.bankName ? b.bankName + ': ' : '') + (b.cardNumber ? (isEn?'Card: ':'کارت: ') + '`' + b.cardNumber + '`' : '') + (b.iban ? (isEn?' | IBAN: ':' | شبا: ') + '`' + b.iban + '`' : '') + '\n';
      });
    }

    var enabledPhones = (db.settings.phones || []).filter(p => p.enabled && p.number && p.number.trim() !== '');
    if(enabledPhones.length > 0) {
      text += divider + (isEn ? '📞 **Contact Phones:**\n' : '📞 **شماره‌های تماس:**\n');
      enabledPhones.forEach(p => { text += p.number + '\n'; });
    }

    var enabledAddrs = (db.settings.standaloneAddresses || []).filter(a => a.enabled && a.text && a.text.trim() !== '');
    if(enabledAddrs.length > 0) {
      text += divider + (isEn ? '📍 **Address:**\n' : '📍 **آدرس:**\n');
      enabledAddrs.forEach(a => { text += a.text + '\n'; });
    }

    var enabledSocials = (db.settings.socials || []).filter(s => s.enabled && (s.link || s.name));
    if(enabledSocials.length > 0) {
      text += divider + (isEn ? '🛍️ **Seller Links:**\n' : '🛍️ **ارتباط با فروشنده:**\n');
      var socItems = enabledSocials.map(s => {
        var sInfo = getSocialInfo(s.type);
        var name = s.name || sInfo.name;
        var link = s.link ? s.link.trim() : '';
        if (link !== '') {
          if (!link.startsWith('http') && !link.startsWith('mailto:')) {
            if (s.type === 'telegram') link = 'https://t.me/' + link.replace('@', '');
            else if (s.type === 'eitaa') link = 'https://eitaa.com/' + link.replace('@', '');
            else if (s.type === 'instagram') link = 'https://instagram.com/' + link.replace('@', '');
            else link = 'https://' + link;
          }
          return name + '(' + link + ')';
        } else { return name; }
      });
      text += socItems.join(' • ') + '\n';
    }

    var enabledCryptos = (db.settings.cryptos || []).filter(c => c.enabled && c.walletAddress && c.walletAddress.trim() !== '');
    if(enabledCryptos.length > 0) {
      text += divider + (isEn ? '🪙 **Crypto Wallets:**\n' : '🪙 **آدرس‌های رمزارز:**\n');
      enabledCryptos.forEach(c => { text += (c.coinName ? c.coinName + ': ' : '') + '`' + c.walletAddress + '`\n'; });
    }

    text += divider;
    text += isEn ? '🛠️ **Support:** Telegram(https://telegram.com/t.me/pvmyan) • Email(vaheban@gmail.com)\n' : '🛠️ **ارتباط با پشتیبانی برنامه:** تلگرام(https://t.me/pvmyan) • ایتا(https://eitaa.com/Alin100) • جمیل(vaheban@gmail.com)\n';
    return text;
  }

  function shareLedgerAsText() {
    var name = document.getElementById('ledger-party-name').value;
    var type = document.getElementById('ledger-party-type').value;
    var isCust = (type === 'customer');
    const isEn = (currentLang === 'en');
    const dict = translations[currentLang] || translations.fa;
    
    recalculateAllBalances();
    var partyObj = isCust ? db.customers.find(x => x.name === name) : db.suppliers.find(x => x.name === name);
    var currentBalance = partyObj ? partyObj.debt : 0;
    
    var text = '🛍️ **' + (db.settings.title || 'فروش‌یار') + '**\n';
    text += isEn ? '📋 **Ledger Statement**\n' : '📋 **صورت‌حساب دفتر حساب**\n';
    text += '━━━━━━ • ✿ • ━━━━━━\n';
    text += (isEn ? '📅 **Date:** ' : '📅 **تاریخ گزارش:** ') + getTodayDateStr() + '\n';
    text += (isCust ? (isEn ? '👤 **Customer:** ' : '👤 **مشتری:** ') : (isEn ? '🏭 **Supplier:** ' : '🏭 **تأمین‌کننده:** ')) + name + '\n';
    text += '━━━━━━ • ✿ • ━━━━━━\n\n';
    
    var unitStr = dict['unit_currency'] || 'تومان';
    if (isCust) {
      text += (isEn ? '💰 **Account Status:** \n' : '💰 **وضعیت مانده حساب:** \n') + (currentBalance > 0 ? '🔸 ' + fmt(currentBalance) + ' ' + unitStr + (isEn ? ' (Debtor)' : ' (بدهکار)') : (currentBalance < 0 ? '🔸 ' + fmt(Math.abs(currentBalance)) + ' ' + unitStr + (isEn ? ' (Creditor)' : ' (بستانکار)') : (isEn ? '✨ Settled' : '✨ تسویه کامل'))) + '\n';
    } else {
      text += (isEn ? '💰 **Account Status:** \n' : '💰 **وضعیت مانده حساب:** \n') + (currentBalance > 0 ? '🔸 ' + fmt(currentBalance) + ' ' + unitStr + (isEn ? ' (Creditor)' : ' (طلبکار)') : (currentBalance < 0 ? '🔸 ' + fmt(Math.abs(currentBalance)) + ' ' + unitStr + (isEn ? ' (Prepaid)' : ' (پیش‌پرداخت)') : (isEn ? '✨ Settled' : '✨ تسویه کامل'))) + '\n';
    }
    
    text += generateInvoiceTextDetails(null, null);

    if (navigator.share) {
      navigator.share({ text: text });
    } else {
      navigator.clipboard.writeText(text);
      alert(isEn ? 'Ledger statement copied to clipboard!' : 'صورت‌حساب دفتر حساب به‌صورت متنی کپی شد!');
    }
  }

  function shareLedgerAsImage() {
    const isEn = (currentLang === 'en');
    var itemsCount = document.querySelectorAll('#ledger-content .list-row').length;
    if (itemsCount > 6) {
      alert(isEn ? '⚠️ System Limit:\nImage export is limited to 6 items. Please use text export or filter items.' : '⚠️ محدودیت سیستم:\nارسال تصویری به ( ۶ ) قلم محدود شده است. لطفاً از فاکتور متنی استفاده کنید یا از فیلتر، تعداد را محدود نمایید.');
      return;
    }
    var area = document.getElementById('ledger-printable-area');
    if (!area) return;
    
    var elementsToHide = area.querySelectorAll('.hide-on-capture');
    elementsToHide.forEach(el => el.style.display = 'none');
    
    html2canvas(area, { scale: 2, backgroundColor: '#ffffff' }).then(canvas => {
      elementsToHide.forEach(el => el.style.display = '');
      canvas.toBlob(blob => {
        var file = new File([blob], "ledger_statement.png", { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file] });
        } else {
          var a = document.createElement('a');
          a.download = 'ledger_statement.png';
          a.href = canvas.toDataURL();
          a.click();
        }
      });
    });
  }

  function saveDb() {
    try { localStorage.setItem('forooshyar_db_v17', JSON.stringify(db)); } catch(e) {}
    renderAll();
  }

  function fmt(n) { return Number(n || 0).toLocaleString(currentLang === 'en' ? 'en-US' : 'fa-IR'); }
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function initDateDropdowns(yearId, monthId, dayId, defaultVal) {
    try {
      var ySelect = document.getElementById(yearId);
      var mSelect = document.getElementById(monthId);
      var dSelect = document.getElementById(dayId);
      if(!ySelect || !mSelect || !dSelect) return;
      
      if(currentLang === 'en') {
        var currentY = defaultVal ? (defaultVal.gy || 2026) : 2026;
        var currentM = defaultVal ? (defaultVal.gm || 10) : 10;
        var currentD = defaultVal ? (defaultVal.gd || 8) : 8;
        var yHtml = ''; for(var y = 2024; y <= 2035; y++) { yHtml += '<option value="'+y+'" '+(y === currentY ? 'selected':'')+'>'+y+'</option>'; } ySelect.innerHTML = yHtml;
        var mHtml = ''; for(var m = 1; m <= 12; m++) { mHtml += '<option value="'+pad2(m)+'" '+(m === currentM ? 'selected':'')+'>'+monthNamesEn[m-1]+'</option>'; } mSelect.innerHTML = mHtml;
        var dHtml = ''; for(var d = 1; d <= 31; d++) { dHtml += '<option value="'+pad2(d)+'" '+(d === currentD ? 'selected':'')+'>'+d+'</option>'; } dSelect.innerHTML = dHtml;
      } else {
        var currentY = defaultVal ? (defaultVal.jy || 1405) : 1405;
        var currentM = defaultVal ? (defaultVal.jm || 1) : 1;
        var currentD = defaultVal ? (defaultVal.jd || 1) : 1;
        var yHtml = ''; for(var y = 1400; y <= 1415; y++) { yHtml += '<option value="'+y+'" '+(y === currentY ? 'selected':'')+'>'+y+'</option>'; } ySelect.innerHTML = yHtml;
        var mHtml = ''; for(var m = 1; m <= 12; m++) { mHtml += '<option value="'+pad2(m)+'" '+(m === currentM ? 'selected':'')+'>'+monthNamesList[m-1]+'</option>'; } mSelect.innerHTML = mHtml;
        var dHtml = ''; for(var d = 1; d <= 31; d++) { dHtml += '<option value="'+pad2(d)+'" '+(d === currentD ? 'selected':'')+'>'+d+'</option>'; } dSelect.innerHTML = dHtml;
      }
    } catch(e) {}
  }

  function getDateFromDropdowns(yearId, monthId, dayId) {
    return document.getElementById(yearId).value + '/' + document.getElementById(monthId).value + '/' + document.getElementById(dayId).value;
  }

  function setDropdownsFromDateStr(yearId, monthId, dayId, dateStr) {
    try {
      if(!dateStr) return;
      var parts = dateStr.split('/');
      if(parts.length === 3) {
        document.getElementById(yearId).value = parts[0];
        document.getElementById(monthId).value = pad2(parseInt(parts[1]));
        document.getElementById(dayId).value = pad2(parseInt(parts[2]));
      }
    } catch(e) {}
  }

  function showSection(id, el) {
    try {
      document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
      var sec = document.getElementById(id);
      if(sec) sec.classList.add('active');
      if(el && el.classList.contains('nav-item')) {
        document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
        el.classList.add('active');
      }
      renderAll();
    } catch(err) {}
  }

  function openModal(id) { 
    var m = document.getElementById(id);
    if(m) { m.style.display = 'flex'; m.classList.add('active'); }
    if(id === 'modal-calendar') renderCalendarGrid();
    if(id === 'modal-ai') renderAIAnalysis();
    if(id === 'modal-creator') renderCreatorSocials();
  }
  function closeModal(id) { 
    var m = document.getElementById(id);
    if(m) { m.style.display = 'none'; m.classList.remove('active'); }
  }
  function toggleHomeSection(id) {
    var el = document.getElementById(id);
    if(el) { el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none'; }
  }
  function getTodayDateStr() {
    var todayG = new Date();
    if(currentLang === 'en') {
      return todayG.getFullYear() + '/' + pad2(todayG.getMonth() + 1) + '/' + pad2(todayG.getDate());
    } else {
      var j = JalaaliHelper.toJalaali(todayG.getFullYear(), todayG.getMonth() + 1, todayG.getDate());
      return j.jy + '/' + pad2(j.jm) + '/' + pad2(j.jd);
    }
  }

  async function pickContact(targetType) {
    const isEn = (currentLang === 'en');
    try {
      if ('contacts' in navigator && 'select' in navigator.contacts) {
        const contacts = await navigator.contacts.select(['name', 'tel'], { multiple: true });
        if (contacts && contacts.length > 0) {
          contacts.forEach(c => {
            const name = (c.name && c.name.length > 0) ? c.name[0] : (isEn ? 'New Contact' : 'مخاطب جدید');
            const phone = (c.tel && c.tel.length > 0) ? c.tel[0].replace(/\s+/g, '') : '';
            if (targetType === 'customer') {
              if(!db.customers.some(x => x.name === name)) {
                db.customers.push({ id: Date.now() + Math.random(), name: name, address: '', phones: [{ label: isEn ? 'Mobile' : 'همراه', number: phone }], avatar: '', debt: 0 });
              }
            } else {
              if(!db.suppliers.some(x => x.name === name)) {
                db.suppliers.push({ id: Date.now() + Math.random(), name: name, address: '', phones: [{ label: isEn ? 'Office' : 'دفتر', number: phone }], avatar: '', debt: 0 });
              }
            }
          });
          saveDb();
          alert(isEn ? 'Contacts added successfully.' : 'مخاطبین با موفقیت انتخاب و اضافه شدند.');
        }
      } else {
        var manualName = prompt(isEn ? 'Enter contact name:' : 'نام مخاطب مورد نظر را وارد کنید:');
        if(manualName) {
          if (targetType === 'customer') {
            db.customers.push({ id: Date.now(), name: manualName, address: '', phones: [{ label: isEn ? 'Mobile' : 'همراه', number: '' }], avatar: '', debt: 0 });
          } else {
            db.suppliers.push({ id: Date.now(), name: manualName, address: '', phones: [{ label: isEn ? 'Office' : 'دفتر', number: '' }], avatar: '', debt: 0 });
          }
          saveDb();
          alert(isEn ? 'Contact saved.' : 'مخاطب ثبت شد.');
        }
      }
    } catch (err) { alert(isEn ? 'Error accessing contacts.' : 'خطا در دسترسی به مخاطبین دستگاه.'); }
  }

  function toggleGlobalProfitInput() { 
    document.getElementById('global-profit-panel').style.display = document.getElementById('global-profit-switch').checked ? 'block' : 'none'; 
  }

  function applyGlobalProfitMargin() {
    const isEn = (currentLang === 'en');
    var pct = Number(document.getElementById('global-profit-percent').value);
    if (isNaN(pct) || pct <= 0) return alert(isEn ? 'Invalid profit margin percentage' : 'درصد سود نامعتبر است');
    if (confirm(isEn ? 'Apply ' + pct + '% margin to all stock items?' : 'اعمال سود ' + pct + '٪ بر روی تمام کالاهای انبار؟')) {
      (db.products || []).forEach(p => { if (p.buyPrice > 0) { p.price = Math.round(p.buyPrice + (p.buyPrice * (pct / 100))); p.profitMargin = pct; } });
      saveDb(); alert(isEn ? 'Updated successfully.' : 'بروزرسانی شد.');
    }
  }

  function recalculateAllBalances() {
    var customerSalesMap = {};
    (db.sales || []).forEach(s => {
      if (!s.customer) return;
      if (!customerSalesMap[s.customer]) customerSalesMap[s.customer] = 0;
      var sub = Number(s.subtotal || s.total || 0);
      var rec = Number(s.received || 0);
      customerSalesMap[s.customer] += (sub - rec);
    });

    var customerTransMap = {};
    (db.ledgerTransactions || []).filter(t => t.partyType === 'customer').forEach(t => {
      if (!t.partyName) return;
      if (!customerTransMap[t.partyName]) customerTransMap[t.partyName] = 0;
      customerTransMap[t.partyName] += Number(t.amount || 0);
    });

    (db.customers || []).forEach(c => {
      var totalNetInvoices = customerSalesMap[c.name] || 0;
      var totalTransPaid = customerTransMap[c.name] || 0;
      c.debt = totalNetInvoices - totalTransPaid;
    });

    var supplierPurchasesMap = {};
    (db.purchases || []).forEach(p => {
      if (!p.supplier) return;
      if (!supplierPurchasesMap[p.supplier]) supplierPurchasesMap[p.supplier] = 0;
      var sub = Number(p.subtotal || p.total || 0);
      var paid = Number(p.paid || 0);
      supplierPurchasesMap[p.supplier] += (sub - paid);
    });

    var supplierTransMap = {};
    (db.ledgerTransactions || []).filter(t => t.partyType === 'supplier').forEach(t => {
      if (!t.partyName) return;
      if (!supplierTransMap[t.partyName]) supplierTransMap[t.partyName] = 0;
      supplierTransMap[t.partyName] += Number(t.amount || 0);
    });

    (db.suppliers || []).forEach(s => {
      var totalNetPurchases = supplierPurchasesMap[s.name] || 0;
      var totalTransPaid = supplierTransMap[s.name] || 0;
      s.debt = totalNetPurchases - totalTransPaid;
    });
  }

  function renderAll() {
    try {
      recalculateAllBalances();
      applyLanguage();
      const dict = translations[currentLang] || translations.fa;
      
      if(document.getElementById('header-title')) document.getElementById('header-title').innerHTML = '<i class="fas fa-shopping-bag"></i> ' + (db.settings.title || (currentLang === 'en' ? 'Forooshyar' : 'فروش‌یار'));
      if(document.getElementById('header-subtitle')) document.getElementById('header-subtitle').innerText = db.settings.subtitle || dict.subtitle;
      if(document.getElementById('cfg-title')) document.getElementById('cfg-title').value = db.settings.title || '';
      if(document.getElementById('cfg-subtitle')) document.getElementById('cfg-subtitle').value = db.settings.subtitle || '';

      var img = document.getElementById('header-logo');
      if(db.settings.logo && img) { img.src = db.settings.logo; img.style.display = 'inline-block'; }
      else if(img) { img.style.display = 'none'; }

      var period = document.getElementById('report-period') ? document.getElementById('report-period').value : 'all';
      var filteredSales = db.sales || [], filteredExpenses = db.expenses || [];
      if(period === 'today') {
        var todayStr = getTodayDateStr();
        filteredSales = (db.sales || []).filter(s => s.date === todayStr);
        filteredExpenses = (db.expenses || []).filter(e => e.date === todayStr);
      }

      var totSales = filteredSales.reduce((a,b) => a + Number(b.subtotal||b.total||b.price||0), 0);
      var totProfit = filteredSales.reduce((a,b) => a + Number(b.profit||0), 0);
      var totExpense = filteredExpenses.reduce((a,b) => a + Number(b.amount||0), 0);
      var totStock = (db.products || []).reduce((a,b) => a + Number(b.qty||0), 0);

      var unit = ' ' + (dict['unit_currency'] || 'تومان');
      var unitQty = ' ' + (dict['unit_qty'] || 'عدد');

      if(document.getElementById('dash-sales')) document.getElementById('dash-sales').innerText = fmt(totSales) + unit;
      if(document.getElementById('dash-profit')) document.getElementById('dash-profit').innerText = fmt(totProfit) + unit;
      if(document.getElementById('dash-expense')) document.getElementById('dash-expense').innerText = fmt(totExpense) + unit;
      if(document.getElementById('dash-stock')) document.getElementById('dash-stock').innerText = fmt(totStock) + unitQty;

      renderDashDebtorsAndCreditors();
      renderProducts();
      renderStock();
      renderSales();
      renderPurchases();
      renderCustomers();
      renderSuppliers();
      renderReports();
      renderSettingsAccounts();
      populateSelects();
    } catch(err) {}
  }

  function populateSelects() {
    try {
      const isEn = (currentLang === 'en');
      var custSelect = document.getElementById('sale-customer');
      if(custSelect) {
        var val = custSelect.value;
        custSelect.innerHTML = (db.customers || []).map(c => '<option value="'+c.name+'">'+c.name+' ('+fmt(c.debt||0)+' '+(isEn?'rem.':'مانده')+')</option>').join('');
        if(val) custSelect.value = val;
      }

      var suppSelect = document.getElementById('pur-supplier');
      if(suppSelect) {
        var valS = suppSelect.value;
        suppSelect.innerHTML = (db.suppliers || []).map(s => '<option value="'+s.name+'">'+s.name+' ('+fmt(s.debt||0)+' '+(isEn?'rem.':'مانده')+')</option>').join('');
        if(valS) suppSelect.value = valS;
      }

      var prodSelect = document.getElementById('sale-input-prod');
      if(prodSelect) {
        prodSelect.innerHTML = (db.products || []).map(p => '<option value="'+p.id+'">'+p.name+' (کد: '+p.barcode+') ('+(isEn?'Stock:':'موجودی:')+' '+p.qty+')</option>').join('');
        onSaleInputProdChange();
      }

      var cats = [...new Set((db.products || []).map(p => p.category).filter(Boolean))];
      var catOpt = '<option value="">' + (isEn ? 'All Categories' : 'همه دسته‌بندی‌ها') + '</option>' + cats.map(c => '<option value="'+c+'">'+c+'</option>').join('');
      if(document.getElementById('filter-product-cat')) document.getElementById('filter-product-cat').innerHTML = catOpt;
      if(document.getElementById('filter-stock-cat')) document.getElementById('filter-stock-cat').innerHTML = catOpt;
    } catch(e) {}
  }

  function syncSettingsFromDOM() {
    var addrDivs = document.querySelectorAll('#store-addresses-standalone-list > div');
    if (addrDivs.length > 0) {
      db.settings.standaloneAddresses = [];
      addrDivs.forEach(row => {
        var en = row.querySelector('.store-standalone-addr-en') ? row.querySelector('.store-standalone-addr-en').checked : true;
        var txt = row.querySelector('.store-standalone-addr-text') ? row.querySelector('.store-standalone-addr-text').value : '';
        db.settings.standaloneAddresses.push({ id: Date.now() + Math.random(), enabled: en, text: txt });
      });
    }

    var phoneDivs = document.querySelectorAll('#store-phones-list .input-row-group');
    if (phoneDivs.length > 0) {
      db.settings.phones = [];
      phoneDivs.forEach(row => {
        var en = row.querySelector('.store-phone-en') ? row.querySelector('.store-phone-en').checked : true;
        var num = row.querySelector('.store-phone-num-inp') ? row.querySelector('.store-phone-num-inp').value : '';
        db.settings.phones.push({ id: Date.now() + Math.random(), enabled: en, number: num });
      });
    }

    var socDivs = document.querySelectorAll('#store-socials-list .input-row-group');
    if (socDivs.length > 0) {
      db.settings.socials = [];
      socDivs.forEach(row => {
        var en = row.querySelector('.store-soc-en') ? row.querySelector('.store-soc-en').checked : true;
        var sType = row.querySelector('.store-soc-type-select') ? row.querySelector('.store-soc-type-select').value : 'telegram';
        var sName = row.querySelector('.store-soc-name-inp') ? row.querySelector('.store-soc-name-inp').value : '';
        var sLink = row.querySelector('.store-soc-link-inp') ? row.querySelector('.store-soc-link-inp').value : '';
        db.settings.socials.push({ id: Date.now() + Math.random(), enabled: en, type: sType, name: sName, link: sLink });
      });
    }

    var bankDivs = document.querySelectorAll('#bank-accounts-list > div');
    if (bankDivs.length > 0) {
      db.settings.banks = [];
      bankDivs.forEach(row => {
        var en = row.querySelector('.bank-en') ? row.querySelector('.bank-en').checked : true;
        var bName = row.querySelector('.bank-name-inp') ? row.querySelector('.bank-name-inp').value : '';
        var bCard = row.querySelector('.bank-card-inp') ? row.querySelector('.bank-card-inp').value : '';
        var bIban = row.querySelector('.bank-iban-inp') ? row.querySelector('.bank-iban-inp').value : '';
        db.settings.banks.push({ id: Date.now() + Math.random(), enabled: en, bankName: bName, cardNumber: bCard, iban: bIban });
      });
    }

    var cryptoDivs = document.querySelectorAll('#crypto-addresses-list > div');
    if (cryptoDivs.length > 0) {
      db.settings.cryptos = [];
      cryptoDivs.forEach(row => {
        var en = row.querySelector('.crypto-en') ? row.querySelector('.crypto-en').checked : true;
        var cName = row.querySelector('.crypto-name-inp') ? row.querySelector('.crypto-name-inp').value : '';
        var cAddr = row.querySelector('.crypto-address-inp') ? row.querySelector('.crypto-address-inp').value : '';
        db.settings.cryptos.push({ id: Date.now() + Math.random(), enabled: en, coinName: cName, walletAddress: cAddr });
      });
    }

    // همگام‌سازی امن سامانه پویای مدیریت انواع پرداخت و دریافت (بدون چک‌باکس)
    var ptDivs = document.querySelectorAll('#payment-types-settings-list > div');
    if (ptDivs.length > 0 && db.settings.paymentTypes) {
      db.settings.paymentTypes.forEach((pt) => {
        var card = document.getElementById('pt-card-' + pt.id);
        if (card) {
          var nameInp = card.querySelector('.pt-name-input');
          if (nameInp) pt.name = nameInp.value;

          var fieldRows = card.querySelectorAll('.pt-field-row');
          pt.fields = [];
          fieldRows.forEach(fRow => {
            var lbl = fRow.querySelector('.pt-field-lbl').value;
            var ph = fRow.querySelector('.pt-field-ph').value;
            if (lbl && lbl.trim() !== '') {
              pt.fields.push({
                id: fRow.getAttribute('data-field-id') || ('f_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)),
                label: lbl,
                placeholder: ph
              });
            }
          });
        }
      });
    }
  }

  function renderPaymentTypesSettings() {
    try {
      const isEn = (currentLang === 'en');
      var listElem = document.getElementById('payment-types-settings-list');
      if (!listElem) return;

      var html = '';
      (db.settings.paymentTypes || []).forEach((pt, ptIndex) => {
        var fieldsHtml = '';
        (pt.fields || []).forEach((f, fIndex) => {
          fieldsHtml += '<div class="input-row-group pt-field-row" data-field-id="' + (f.id || '') + '" style="margin-top:6px;">' +
            '<input type="text" class="form-input pt-field-lbl" value="' + (f.label || '') + '" placeholder="' + (isEn ? 'Field Label (e.g. Cheque No)' : 'عنوان کادر (مثلاً: شماره چک)') + '" style="flex:1.2; font-size:0.8rem;">' +
            '<input type="text" class="form-input pt-field-ph" value="' + (f.placeholder || '') + '" placeholder="' + (isEn ? 'Placeholder text' : 'متن راهنما درون کادر...') + '" style="flex:1.8; font-size:0.8rem;">' +
            '<button class="btn btn-danger btn-sm" type="button" onclick="removePaymentTypeField(\'' + pt.id + '\', ' + fIndex + ')"><i class="fas fa-times"></i></button>' +
          '</div>';
        });

        var deleteBtnHtml = pt.isDefault ? '' : '<button class="btn btn-danger btn-sm" type="button" onclick="deletePaymentType(\'' + pt.id + '\')" style="margin-right:8px;"><i class="fas fa-trash"></i> ' + (isEn ? 'Delete Type' : 'حذف نوع') + '</button>';

        html += '<div id="pt-card-' + pt.id + '" style="background:#ffffff; border:1.5px solid var(--border); padding:12px; border-radius:14px; margin-bottom:10px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
            '<div style="display:flex; align-items:center; gap:8px; flex:1;">' +
              '<input type="text" class="form-input pt-name-input" value="' + (pt.name || '') + '" ' + (pt.isDefault ? 'readonly style="background:#f5f5f5; font-weight:bold;"' : 'style="font-weight:bold;"') + ' placeholder="' + (isEn ? 'Type Name' : 'عنوان نوع دریافت/پرداخت') + '">' +
            '</div>' +
            deleteBtnHtml +
          '</div>' +

          '<div style="background:#fafafa; border:1px solid #eee; padding:8px; border-radius:10px; margin-top:8px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; font-size:0.78rem; font-weight:bold; color:var(--text-secondary); margin-bottom:4px;">' +
              '<span><i class="fas fa-list-ul"></i> ' + (isEn ? 'Custom Detail Fields:' : 'کادرهای جزئیات اختصاصی این نوع:') + '</span>' +
              '<button class="btn btn-outline btn-sm" type="button" onclick="addPaymentTypeField(\'' + pt.id + '\')" style="padding:2px 8px; font-size:0.72rem;"><i class="fas fa-plus"></i> ' + (isEn ? 'Add Field' : 'افزودن کادر جزئیات') + '</button>' +
            '</div>' +
            '<div class="pt-fields-container">' + (fieldsHtml || '<div style="font-size:0.75rem; color:#999; padding:4px;">' + (isEn ? 'No detail fields (simple amount only)' : 'بدون کادر جزئیات (فقط ثبت مبلغ)') + '</div>') + '</div>' +
          '</div>' +
        '</div>';
      });

      listElem.innerHTML = html;
    } catch(e) {}
  }

  function addNewPaymentType() {
    syncSettingsFromDOM();
    const isEn = (currentLang === 'en');
    var newId = 'custom_pt_' + Date.now();
    db.settings.paymentTypes.push({
      id: newId,
      name: isEn ? 'New Payment Type' : 'نوع جدید دریافت/پرداخت',
      isDefault: false,
      fields: []
    });
    renderPaymentTypesSettings();
    renderSalePaymentChips();
    renderPurPaymentChips();
  }

  function deletePaymentType(ptId) {
    syncSettingsFromDOM();
    const isEn = (currentLang === 'en');
    if (confirm(isEn ? 'Delete this payment type?' : 'آیا این نوع دریافت/پرداخت حذف شود؟')) {
      db.settings.paymentTypes = db.settings.paymentTypes.filter(p => p.id !== ptId);
      if (selectedSalePaymentTypeId === ptId) {
        selectedSalePaymentTypeId = (db.settings.paymentTypes[0] ? db.settings.paymentTypes[0].id : null);
      }
      if (selectedPurPaymentTypeId === ptId) {
        selectedPurPaymentTypeId = (db.settings.paymentTypes[0] ? db.settings.paymentTypes[0].id : null);
      }
      renderPaymentTypesSettings();
      renderSalePaymentChips();
      renderPurPaymentChips();
    }
  }

  function addPaymentTypeField(ptId) {
    syncSettingsFromDOM();
    var pt = db.settings.paymentTypes.find(p => p.id === ptId);
    if (pt) {
      if (!pt.fields) pt.fields = [];
      pt.fields.push({
        id: 'f_' + Date.now(),
        label: '',
        placeholder: ''
      });
      renderPaymentTypesSettings();
      renderSalePaymentChips();
      renderPurPaymentChips();
    }
  }

  function removePaymentTypeField(ptId, fieldIndex) {
    syncSettingsFromDOM();
    var pt = db.settings.paymentTypes.find(p => p.id === ptId);
    if (pt && pt.fields && pt.fields[fieldIndex]) {
      pt.fields.splice(fieldIndex, 1);
      renderPaymentTypesSettings();
      renderSalePaymentChips();
      renderPurPaymentChips();
    }
  }

  // --- منطق سامانه اسکرول افقی چیپس‌ها و کادرهای جزئیات در فرم فروش ---
  function renderSalePaymentChips() {
    var container = document.getElementById('sale-payment-chips-container');
    var detailsContainer = document.getElementById('sale-payment-details-container');
    if (!container || !detailsContainer) return;

    var types = db.settings.paymentTypes || [];
    if (types.length === 0) {
      container.innerHTML = '<span style="font-size:0.75rem; color:#888;">نوعی تعریف نشده است.</span>';
      detailsContainer.style.display = 'none';
      return;
    }

    if (!selectedSalePaymentTypeId || !types.some(t => t.id === selectedSalePaymentTypeId)) {
      selectedSalePaymentTypeId = types[0].id;
    }

    var chipsHtml = '';
    types.forEach(pt => {
      var isActive = (pt.id === selectedSalePaymentTypeId);
      chipsHtml += '<span class="category-chip ' + (isActive ? 'active' : '') + '" onclick="selectSalePaymentType(\'' + pt.id + '\')">' +
        '<i class="fas ' + (isActive ? 'fa-check-circle' : 'fa-circle') + '"></i> ' + (pt.name || 'بدون عنوان') +
      '</span>';
    });
    container.innerHTML = chipsHtml;

    renderSalePaymentDetailsBox();
  }

  function selectSalePaymentType(ptId) {
    saveCurrentPaymentFieldsToState();
    selectedSalePaymentTypeId = ptId;
    renderSalePaymentChips();
  }

  function saveCurrentPaymentFieldsToState() {
    var detailsContainer = document.getElementById('sale-payment-details-container');
    if (!detailsContainer || !selectedSalePaymentTypeId) return;
    var inputs = detailsContainer.querySelectorAll('.sale-pt-detail-inp');
    if (inputs.length > 0) {
      if (!currentSalePaymentDetails[selectedSalePaymentTypeId]) {
        currentSalePaymentDetails[selectedSalePaymentTypeId] = {};
      }
      inputs.forEach(inp => {
        var fId = inp.getAttribute('data-field-id');
        currentSalePaymentDetails[selectedSalePaymentTypeId][fId] = inp.value;
      });
    }
  }

  function renderSalePaymentDetailsBox() {
    var detailsContainer = document.getElementById('sale-payment-details-container');
    if (!detailsContainer) return;

    var types = db.settings.paymentTypes || [];
    var activePt = types.find(t => t.id === selectedSalePaymentTypeId);

    if (!activePt) {
      detailsContainer.style.display = 'none';
      return;
    }

    var fields = activePt.fields || [];
    if (fields.length === 0) {
      detailsContainer.style.display = 'block';
      detailsContainer.innerHTML = '<div style="font-size:0.78rem; color:var(--text-secondary); text-align:center; padding:4px;">' +
        '<i class="fas fa-info-circle text-primary"></i> نوع پرداخت <b>«' + activePt.name + '»</b> نیاز به کادر جزئیات اضافی ندارد.' +
      '</div>';
      return;
    }

    detailsContainer.style.display = 'block';
    var savedVals = currentSalePaymentDetails[activePt.id] || {};
    var html = '<div style="font-size:0.78rem; font-weight:bold; color:var(--primary); margin-bottom:8px;">' +
      '<i class="fas fa-edit"></i> جزئیات ' + activePt.name + ':' +
    '</div>';

    fields.forEach(f => {
      var val = savedVals[f.id] || '';
      html += '<div class="form-group" style="margin-bottom:8px;">' +
        '<label class="form-label" style="font-size:0.76rem;">' + (f.label || '') + '</label>' +
        '<input type="text" class="form-input sale-pt-detail-inp" data-field-id="' + f.id + '" value="' + val + '" placeholder="' + (f.placeholder || '') + '" oninput="saveCurrentPaymentFieldsToState()">' +
      '</div>';
    });

    detailsContainer.innerHTML = html;
  }

  // --- منطق سامانه اسکرول افقی چیپس‌ها و کادرهای جزئیات در فرم خرید ---
  function renderPurPaymentChips() {
    var container = document.getElementById('pur-payment-chips-container');
    var detailsContainer = document.getElementById('pur-payment-details-container');
    if (!container || !detailsContainer) return;

    var types = db.settings.paymentTypes || [];
    if (types.length === 0) {
      container.innerHTML = '<span style="font-size:0.75rem; color:#888;">نوعی تعریف نشده است.</span>';
      detailsContainer.style.display = 'none';
      return;
    }

    if (!selectedPurPaymentTypeId || !types.some(t => t.id === selectedPurPaymentTypeId)) {
      selectedPurPaymentTypeId = types[0].id;
    }

    var chipsHtml = '';
    types.forEach(pt => {
      var isActive = (pt.id === selectedPurPaymentTypeId);
      chipsHtml += '<span class="category-chip ' + (isActive ? 'active' : '') + '" onclick="selectPurPaymentType(\'' + pt.id + '\')">' +
        '<i class="fas ' + (isActive ? 'fa-check-circle' : 'fa-circle') + '"></i> ' + (pt.name || 'بدون عنوان') +
      '</span>';
    });
    container.innerHTML = chipsHtml;

    renderPurPaymentDetailsBox();
  }

  function selectPurPaymentType(ptId) {
    saveCurrentPurPaymentFieldsToState();
    selectedPurPaymentTypeId = ptId;
    renderPurPaymentChips();
  }

  function saveCurrentPurPaymentFieldsToState() {
    var detailsContainer = document.getElementById('pur-payment-details-container');
    if (!detailsContainer || !selectedPurPaymentTypeId) return;
    var inputs = detailsContainer.querySelectorAll('.pur-pt-detail-inp');
    if (inputs.length > 0) {
      if (!currentPurPaymentDetails[selectedPurPaymentTypeId]) {
        currentPurPaymentDetails[selectedPurPaymentTypeId] = {};
      }
      inputs.forEach(inp => {
        var fId = inp.getAttribute('data-field-id');
        currentPurPaymentDetails[selectedPurPaymentTypeId][fId] = inp.value;
      });
    }
  }

  function renderPurPaymentDetailsBox() {
    var detailsContainer = document.getElementById('pur-payment-details-container');
    if (!detailsContainer) return;

    var types = db.settings.paymentTypes || [];
    var activePt = types.find(t => t.id === selectedPurPaymentTypeId);

    if (!activePt) {
      detailsContainer.style.display = 'none';
      return;
    }

    var fields = activePt.fields || [];
    if (fields.length === 0) {
      detailsContainer.style.display = 'block';
      detailsContainer.innerHTML = '<div style="font-size:0.78rem; color:var(--text-secondary); text-align:center; padding:4px;">' +
        '<i class="fas fa-info-circle text-danger"></i> روش پرداخت <b>«' + activePt.name + '»</b> نیاز به کادر جزئیات اضافی ندارد.' +
      '</div>';
      return;
    }

    detailsContainer.style.display = 'block';
    var savedVals = currentPurPaymentDetails[activePt.id] || {};
    var html = '<div style="font-size:0.78rem; font-weight:bold; color:var(--danger); margin-bottom:8px;">' +
      '<i class="fas fa-edit"></i> جزئیات پرداخت ' + activePt.name + ':' +
    '</div>';

    fields.forEach(f => {
      var val = savedVals[f.id] || '';
      html += '<div class="form-group" style="margin-bottom:8px;">' +
        '<label class="form-label" style="font-size:0.76rem;">' + (f.label || '') + '</label>' +
        '<input type="text" class="form-input pur-pt-detail-inp" data-field-id="' + f.id + '" value="' + val + '" placeholder="' + (f.placeholder || '') + '" oninput="saveCurrentPurPaymentFieldsToState()">' +
      '</div>';
    });

    detailsContainer.innerHTML = html;
  }

  function renderSettingsAccounts() {
    try {
      const isEn = (currentLang === 'en');

      renderPaymentTypesSettings();

      var addrList = document.getElementById('store-addresses-standalone-list');
      if(addrList) {
        addrList.innerHTML = (db.settings.standaloneAddresses || []).map((a, i) => 
          '<div style="background:#f8f9fa; border:1px solid #e0e0e0; padding:10px; border-radius:12px; margin-bottom:8px;">' +
            '<div class="input-row-group">' +
              '<label class="checkbox-item"><input type="checkbox" class="store-standalone-addr-en" '+(a.enabled?'checked':'')+'> '+(isEn?'Include':'درج در فاکتور')+'</label>' +
              '<button class="btn btn-danger btn-sm" type="button" onclick="syncSettingsFromDOM(); db.settings.standaloneAddresses.splice('+i+',1); renderSettingsAccounts();" style="margin-right:auto;"><i class="fas fa-trash"></i></button>' +
            '</div>' +
            '<div class="form-group" style="margin:6px 0 0;">' +
              '<textarea class="form-textarea store-standalone-addr-text" placeholder="'+(isEn?'Enter address...':'آدرس را وارد کنید...')+'" style="min-height:50px;">'+(a.text||'')+'</textarea>' +
            '</div>' +
          '</div>'
        ).join('');
      }

      var phoneList = document.getElementById('store-phones-list');
      if(phoneList) {
        phoneList.innerHTML = (db.settings.phones || []).map((p, i) => 
          '<div class="input-row-group">' +
            '<input type="text" class="form-input store-phone-num-inp" value="'+(p.number||'')+'" placeholder="'+(isEn?'Phone Number':'شماره تماس')+'" style="flex:1;">' +
            '<label class="checkbox-item"><input type="checkbox" class="store-phone-en" '+(p.enabled?'checked':'')+'> '+(isEn?'Include':'درج')+'</label>' +
            '<button class="btn btn-danger btn-sm" type="button" onclick="syncSettingsFromDOM(); db.settings.phones.splice('+i+',1); renderSettingsAccounts();"><i class="fas fa-trash"></i></button>' +
          '</div>'
        ).join('');
      }

      var socList = document.getElementById('store-socials-list');
      if(socList) {
        socList.innerHTML = (db.settings.socials || []).map((s, i) => {
          var optionsHtml = SOCIAL_NETWORKS.map(net => 
            '<option value="' + net.type + '" ' + ((s.type || 'telegram') === net.type ? 'selected' : '') + '>' + net.name + '</option>'
          ).join('');

          return '<div class="input-row-group" style="flex-wrap:wrap; background:#f8f9fa; padding:8px; border-radius:10px; border:1px solid #e0e0e0; margin-bottom:8px;">' +
            '<select class="form-select store-soc-type-select" style="flex:1.2; font-weight:bold;" onchange="onSocialTypeChange(this)">' + optionsHtml + '</select>' +
            '<input type="text" class="form-input store-soc-name-inp" value="'+(s.name||'')+'" placeholder="'+(isEn?'Label':'عنوان')+'" style="flex:1;">' +
            '<input type="text" class="form-input store-soc-link-inp" value="'+(s.link||'')+'" placeholder="'+(isEn?'Link/ID':'لینک یا آیدی')+'" style="flex:2.5;">' +
            '<label class="checkbox-item"><input type="checkbox" class="store-soc-en" '+(s.enabled?'checked':'')+'> '+(isEn?'Include':'درج')+'</label>' +
            '<button class="btn btn-danger btn-sm" type="button" onclick="syncSettingsFromDOM(); db.settings.socials.splice('+i+',1); renderSettingsAccounts();"><i class="fas fa-trash"></i></button>' +
          '</div>';
        }).join('');
      }

      var bList = document.getElementById('bank-accounts-list');
      if(bList) {
        bList.innerHTML = (db.settings.banks || []).map((b, i) => 
          '<div style="background:#f8f9fa; border:1px solid #e0e0e0; padding:10px; border-radius:12px; margin-bottom:8px;">' +
            '<div class="input-row-group">' +
              '<label class="checkbox-item"><input type="checkbox" class="bank-en" '+(b.enabled?'checked':'')+'> '+(isEn?'Include':'درج فاکتور')+'</label>' +
              '<input type="text" class="form-input bank-name-inp" value="'+(b.bankName||'')+'" placeholder="'+(isEn?'Bank Name':'نام بانک')+'" style="flex:1;">' +
              '<button class="btn btn-danger btn-sm" type="button" onclick="syncSettingsFromDOM(); db.settings.banks.splice('+i+',1); renderSettingsAccounts();"><i class="fas fa-trash"></i></button>' +
            '</div>' +
            '<div class="form-group" style="margin:6px 0 0;">' +
              '<input type="text" class="form-input bank-card-inp" value="'+(b.cardNumber||'')+'" placeholder="'+(isEn?'Card Number':'شماره کارت بانکی')+'" style="margin-bottom:6px;">' +
              '<input type="text" class="form-input bank-iban-inp" value="'+(b.iban||'')+'" placeholder="'+(isEn?'IBAN':'شماره شبا')+'" style="font-family:monospace;">' +
            '</div>' +
          '</div>'
        ).join('');
      }

      var cList = document.getElementById('crypto-addresses-list');
      if(cList) {
        cList.innerHTML = (db.settings.cryptos || []).map((c, i) => 
          '<div style="background:#f8f9fa; border:1px solid #e0e0e0; padding:10px; border-radius:12px; margin-bottom:8px;">' +
            '<div class="input-row-group">' +
              '<label class="checkbox-item"><input type="checkbox" class="crypto-en" '+(c.enabled?'checked':'')+'> '+(isEn?'Include':'درج فاکتور')+'</label>' +
              '<input type="text" class="form-input crypto-name-inp" value="'+(c.coinName||'')+'" placeholder="'+(isEn?'Crypto Name':'نام رمزارز')+'" style="flex:1;">' +
              '<button class="btn btn-danger btn-sm" type="button" onclick="syncSettingsFromDOM(); db.settings.cryptos.splice('+i+',1); renderSettingsAccounts();"><i class="fas fa-trash"></i></button>' +
            '</div>' +
            '<div class="form-group" style="margin:6px 0 0;">' +
              '<textarea class="form-textarea crypto-address-inp" placeholder="'+(isEn?'Wallet address...':'آدرس رمزارز...')+'" style="min-height:50px; font-family:monospace;">'+(c.walletAddress||'')+'</textarea>' +
            '</div>' +
          '</div>'
        ).join('');
      }
    } catch(e) {}
  }

  function onSocialTypeChange(selectElem) {
    var type = selectElem.value;
    var row = selectElem.closest('.input-row-group');
    if(row) {
      var nameInp = row.querySelector('.store-soc-name-inp');
      var sInfo = getSocialInfo(type);
      if(nameInp && !nameInp.value) { nameInp.value = sInfo.name; }
    }
  }

  function addStoreStandaloneAddressRow() { syncSettingsFromDOM(); db.settings.standaloneAddresses.push({ id: Date.now(), enabled: true, text: "" }); renderSettingsAccounts(); }
  function addStorePhoneRow() { syncSettingsFromDOM(); db.settings.phones.push({ id: Date.now(), enabled: true, number: "" }); renderSettingsAccounts(); }
  function addStoreSocialRow() { syncSettingsFromDOM(); db.settings.socials.push({ id: Date.now(), enabled: true, type: "telegram", name: "تلگرام", link: "" }); renderSettingsAccounts(); }
  function addBankInputRow() { syncSettingsFromDOM(); db.settings.banks.push({ id: Date.now(), enabled: true, bankName: "", cardNumber: "", iban: "" }); renderSettingsAccounts(); }
  function addCryptoAddressRow() { syncSettingsFromDOM(); db.settings.cryptos.push({ id: Date.now(), enabled: true, coinName: "", walletAddress: "" }); renderSettingsAccounts(); }

  function renderCreatorSocials() {
    try {
      const isEn = (currentLang === 'en');
      var nameEl = document.getElementById('creator-name-display');
      if(nameEl) {
        nameEl.innerText = isEn ? 'Ali Nasiri Soumeh Olia' : 'علی نصیری صومعه علیا';
      }

      var container = document.getElementById('creator-social-links-container');
      if(!container) return;
      
      var creatorLinks = [
        { name: isEn ? 'Telegram Support' : 'پشتیبانی تلگرام', icon: 'fab fa-telegram', link: 'https://t.me/pvmyan' },
        { name: isEn ? 'Eitaa Support' : 'ایتا (گزارش باگ و سفارش)', icon: 'fas fa-comments', link: 'https://eitaa.com/Alin100' },
        { name: isEn ? 'Send Email' : 'ارسال ایمیل', icon: 'fas fa-envelope', link: 'mailto:vaheban@gmail.com' }
      ];

      var html = '';
      creatorLinks.forEach(s => {
        html += '<a href="' + s.link + '" target="_blank" class="social-card-item" style="font-size: 0.85rem; background: var(--primary); padding: 10px 14px; border-radius: 12px; color: white; display: flex; justify-content: space-between; align-items: center; text-decoration: none; margin-bottom: 8px;">' +
          '<div style="display:flex; align-items:center; gap:8px;"><i class="' + s.icon + '"></i> <span>' + s.name + '</span></div>' +
          '<span style="font-size: 0.78rem; direction: ltr;">' + s.link.replace('mailto:', '') + '</span>' +
        '</a>';
      });
      container.innerHTML = html;
    } catch(e) {}
  }

  function renderProducts() {
    const dict = translations[currentLang] || translations.fa;
    const isEn = (currentLang === 'en');
    var q = normalizeText(document.getElementById('search-product') ? document.getElementById('search-product').value : '');
    var cat = document.getElementById('filter-product-cat') ? document.getElementById('filter-product-cat').value : '';
    var html = '';
    (db.products || []).filter(p => (normalizeText(p.name).includes(q) || (p.barcode && normalizeText(p.barcode).includes(q))) && (!cat || p.category === cat)).forEach(p => {
      html += '<div class="list-row"><div><b>'+p.name+'</b> '+(p.category?'<span class="badge badge-info">'+p.category+'</span>':'')+'<small style="display:block; color:var(--text-secondary);">کد کالا: '+p.barcode+' | '+(isEn?'Buy: ':'خرید: ')+fmt(p.buyPrice)+' | '+(isEn?'Sell: ':'فروش: ')+fmt(p.price)+'</small></div><div style="display:flex; align-items:center; gap:6px;"><span>'+(isEn?'Stock: ':'موجودی: ')+'<b>'+p.qty+'</b></span><button class="btn btn-primary btn-sm" onclick="editProduct('+p.id+')"><i class="fas fa-edit"></i></button><button class="btn btn-danger btn-sm" onclick="deleteProduct('+p.id+')"><i class="fas fa-trash"></i></button></div></div>';
    });
    document.getElementById('products-list').innerHTML = html || ('<div style="text-align:center; color:#888; padding:12px;">'+(dict['no_prod_found']||'کالایی یافت نشد')+'</div>');
  }

  function renderStock() {
    const dict = translations[currentLang] || translations.fa;
    const isEn = (currentLang === 'en');
    var q = normalizeText(document.getElementById('search-stock') ? document.getElementById('search-stock').value : '');
    var cat = document.getElementById('filter-stock-cat') ? document.getElementById('filter-stock-cat').value : '';
    var html = '', idx = 1;
    (db.products || []).filter(p => (normalizeText(p.name).includes(q) || (p.barcode && normalizeText(p.barcode).includes(q))) && (!cat || p.category === cat)).forEach(p => {
      html += '<div class="list-row"><span><b>'+(idx++)+'. '+p.name+'</b> <small style="color:var(--text-secondary);">(کد: '+p.barcode+')</small></span><span style="color:'+(p.qty>5?'var(--success)':'var(--danger)')+'; font-weight:700;">'+(isEn?'Stock: ':'موجودی: ')+p.qty+'</span></div>';
    });
    document.getElementById('stock-list').innerHTML = html || ('<div style="text-align:center; color:#888; padding:12px;">'+(dict['no_prod_found']||'آیتمی وجود ندارد')+'</div>');
  }

  const DEFAULT_PRODUCT_CATEGORIES = ['پوشاک زنانه', 'پوشاک مردانه', 'کفش', 'لوازم جانبی', 'سایر'];

  function renderPurCategoryChips() {
    var container = document.getElementById('pur-product-category-chips');
    if(!container) return;
    var prodCats = (db.products || []).map(p => p.category).filter(Boolean);
    var activeItemCats = (typeof activePurItems !== 'undefined') ? activePurItems.map(i => i.category).filter(Boolean) : [];
    var customCats = db.customProductCategories || [];
    var deletedCats = db.deletedProductCategories || [];
    
    var allCats = [...new Set([...DEFAULT_PRODUCT_CATEGORIES, ...prodCats, ...activeItemCats, ...customCats])].filter(cat => !deletedCats.includes(cat));
    
    if(allCats.length === 0) {
      container.innerHTML = '<span style="font-size:0.72rem; color:var(--text-secondary); padding:2px 4px;">هنوز دسته‌بندی‌ای ثبت نشده است.</span>';
      return;
    }
    var html = '';
    allCats.forEach(c => {
      html += '<span class="category-chip" onclick="selectPurCategoryChip(\''+c.replace(/'/g, "\\'")+'\')">' +
                '<i class="fas fa-tag"></i> ' + c + 
                '<i class="fas fa-times delete-chip" title="حذف این دسته" onclick="event.stopPropagation(); deleteProductCategoryChip(\''+c.replace(/'/g, "\\'")+'\')"></i>' +
              '</span>';
    });
    container.innerHTML = html;
  }

  function renderProductCategoryChips() {
    var container = document.getElementById('product-category-chips');
    if(!container) return;
    var prodCats = (db.products || []).map(p => p.category).filter(Boolean);
    var customCats = db.customProductCategories || [];
    var deletedCats = db.deletedProductCategories || [];
    
    var allCats = [...new Set([...DEFAULT_PRODUCT_CATEGORIES, ...prodCats, ...customCats])].filter(cat => !deletedCats.includes(cat));
    
    if(allCats.length === 0) {
      container.innerHTML = '<span style="font-size:0.75rem; color:var(--text-secondary);">هنوز دسته‌بندی‌ای افزوده نشده است.</span>';
      return;
    }
    var html = '';
    allCats.forEach(c => {
      html += '<span class="category-chip" onclick="selectCategoryChip(\''+c.replace(/'/g, "\\'")+'\')">' +
                '<i class="fas fa-tag"></i> ' + c + 
                '<i class="fas fa-times delete-chip" title="حذف این دسته" onclick="event.stopPropagation(); deleteProductCategoryChip(\''+c.replace(/'/g, "\\'")+'\')"></i>' +
              '</span>';
    });
    container.innerHTML = html;
  }

  function selectPurCategoryChip(catName) {
    var input = document.getElementById('pur-input-category');
    if(input) { input.value = catName; }
  }

  function selectCategoryChip(catName) {
    var input = document.getElementById('prod-category');
    if(input) { input.value = catName; }
  }

  function deleteProductCategoryChip(catName) {
    const isEn = (currentLang === 'en');
    if(confirm(isEn ? 'Delete category "' + catName + '"?' : 'آیا می‌خواهید دسته‌بندی «' + catName + '» حذف شود؟')) {
      (db.products || []).forEach(p => {
        if(p.category === catName) { p.category = ''; }
      });
      if(typeof activePurItems !== 'undefined') {
        activePurItems.forEach(i => { if(i.category === catName) i.category = ''; });
      }
      if(db.customProductCategories) {
        db.customProductCategories = db.customProductCategories.filter(c => c !== catName);
      }
      if(!db.deletedProductCategories) db.deletedProductCategories = [];
      if(!db.deletedProductCategories.includes(catName)) {
        db.deletedProductCategories.push(catName);
      }
      
      var pInput = document.getElementById('prod-category');
      if(pInput && pInput.value === catName) pInput.value = '';
      var purInput = document.getElementById('pur-input-category');
      if(purInput && purInput.value === catName) purInput.value = '';

      saveDb();
      renderProductCategoryChips();
      renderPurCategoryChips();
      populateSelects();
    }
  }

  function saveProduct() {
    const isEn = (currentLang === 'en');
    var id = document.getElementById('prod-edit-id').value;
    var name = document.getElementById('prod-name').value.trim();
    if(!name) return alert(isEn ? 'Product name is required' : 'نام کالا الزامی است');
    
    var barcode = document.getElementById('prod-barcode').value.trim();
    if(!barcode) {
      barcode = generate15DigitCode(1, currentLang);
    }
    
    var category = document.getElementById('prod-category').value.trim();
    if(category) {
      if(!db.customProductCategories) db.customProductCategories = [];
      if(!db.customProductCategories.includes(category) && !DEFAULT_PRODUCT_CATEGORIES.includes(category)) {
        db.customProductCategories.push(category);
      }
      if(db.deletedProductCategories && db.deletedProductCategories.includes(category)) {
        db.deletedProductCategories = db.deletedProductCategories.filter(c => c !== category);
      }
    }

    var pObj = {
      id: id ? Number(id) : Date.now(),
      name: name,
      barcode: barcode,
      category: category,
      qty: Number(document.getElementById('prod-qty').value) || 0,
      buyPrice: Number(document.getElementById('prod-buy-price').value) || 0,
      price: Number(document.getElementById('prod-price').value) || 0
    };
    if(id) { db.products = db.products.map(p => p.id == id ? pObj : p); } 
    else { db.products.push(pObj); }
    saveDb(); closeModal('modal-product');
  }

  function addCustPhoneRow(lbl, num) {
    const isEn = (currentLang === 'en');
    var div = document.createElement('div'); div.className = 'input-row-group';
    div.innerHTML = '<input type="text" class="form-input cust-phone-lbl" value="'+(lbl||(isEn?'Mobile':'همراه'))+'" placeholder="" style="flex:1;"><input type="text" class="form-input cust-phone-num" value="'+(num||'')+'" placeholder="" style="flex:2;"><button class="btn btn-danger btn-sm" type="button" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>';
    document.getElementById('cust-phones-list').appendChild(div);
  }
  function addSuppPhoneRow(lbl, num) {
    const isEn = (currentLang === 'en');
    var div = document.createElement('div'); div.className = 'input-row-group';
    div.innerHTML = '<input type="text" class="form-input supp-phone-lbl" value="'+(lbl||(isEn?'Office':'دفتر'))+'" placeholder="" style="flex:1;"><input type="text" class="form-input supp-phone-num" value="'+(num||'')+'" placeholder="" style="flex:2;"><button class="btn btn-danger btn-sm" type="button" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>';
    document.getElementById('supp-phones-list').appendChild(div);
  }

  function saveCustomerModal() {
    const isEn = (currentLang === 'en');
    var id = document.getElementById('cust-edit-id').value;
    var name = document.getElementById('cust-name').value.trim();
    if(!name) return alert(isEn ? 'Customer name is required' : 'نام مشتری الزامی است');
    var phones = [];
    document.querySelectorAll('#cust-phones-list .input-row-group').forEach(r => {
      var num = r.querySelector('.cust-phone-num').value.trim();
      if(num) phones.push({ label: r.querySelector('.cust-phone-lbl').value, number: num });
    });
    var cObj = {
      id: id ? Number(id) : Date.now(),
      name: name,
      address: document.getElementById('cust-address').value,
      phones: phones,
      avatar: tempCustAvatar || '',
      debt: 0
    };
    if(id) {
      var old = db.customers.find(x => x.id == id);
      if(old) cObj.debt = old.debt || 0;
      db.customers = db.customers.map(c => c.id == id ? cObj : c);
    } else { db.customers.push(cObj); }
    saveDb(); closeModal('modal-customer');
  }

  function saveSupplierModal() {
    const isEn = (currentLang === 'en');
    var id = document.getElementById('supp-edit-id').value;
    var name = document.getElementById('supp-name').value.trim();
    if(!name) return alert(isEn ? 'Supplier name is required' : 'نام تأمین‌کننده الزامی است');
    var phones = [];
    document.querySelectorAll('#supp-phones-list .input-row-group').forEach(r => {
      var num = r.querySelector('.supp-phone-num').value.trim();
      if(num) phones.push({ label: r.querySelector('.supp-phone-lbl').value, number: num });
    });
    var sObj = {
      id: id ? Number(id) : Date.now(),
      name: name,
      address: document.getElementById('supp-address').value,
      phones: phones,
      avatar: tempSuppAvatar || '',
      debt: 0
    };
    if(id) {
      var old = db.suppliers.find(x => x.id == id);
      if(old) sObj.debt = old.debt || 0;
      db.suppliers = db.suppliers.map(s => s.id == id ? sObj : s);
    } else { db.suppliers.push(sObj); }
    saveDb(); closeModal('modal-supplier');
  }

  function shareInvoiceAsText() {
    if(!currentPreviewInvoice) return;
    const isEn = (currentLang === 'en');
    const dict = translations[currentLang] || translations.fa;
    var obj = currentPreviewInvoice;
    var isSale = (currentPreviewType === 'sale');
    var invoiceTitle = isSale ? (isEn ? 'Sales Invoice' : 'فاکتور فروش') : (isEn ? 'Purchase Invoice' : 'فاکتور خرید');
    var partyTitle = isSale ? (isEn ? 'Customer:' : 'مشتری:') : (isEn ? 'Supplier:' : 'تأمین‌کننده:');
    var partyName = isSale ? obj.customer : obj.supplier;
    var subtotalAmount = Number(obj.subtotal || obj.total || 0);
    var unitStr = dict['unit_currency'] || 'تومان';

    var text = '🛒 **' + (db.settings.title || 'فروش‌یار') + '**\n';
    text += '📄 **' + invoiceTitle + '**\n';
    text += '━━━━━━ • ✿ • ━━━━━━\n';
    text += (isEn ? '📅 **Date:** ' : '📅 **تاریخ:** ') + obj.date + '\n';
    text += (isEn ? '🔢 **Invoice #:** ' : '🔢 **شماره فاکتور:** #') + String(obj.id).slice(-6) + '\n';
    text += '👤 **' + partyTitle + '** ' + partyName + '\n';
    text += '━━━━━━ • ✿ • ━━━━━━\n\n';
    text += (isEn ? '📦 **Items List:**\n' : '📦 **لیست اقلام:**\n');
    
    if(obj.items) {
      obj.items.forEach(it => {
        var rowTotal = it.qty * it.unitPrice;
        text += it.name + ' (کد: ' + (it.barcode || '-') + ') (' + it.qty + ' ' + (dict['unit_qty']||'عدد') + ' × ' + fmt(it.unitPrice) + ') = ' + fmt(rowTotal) + ' ' + unitStr + '\n';
      });
    }

    text += '\n━━━━━━ • ✿ • ━━━━━━\n';
    text += (isEn ? '💳 **Subtotal:** ' : '💳 **مبلغ فاکتور:** ') + fmt(subtotalAmount) + ' ' + unitStr + '\n';
    if(obj.discount && Number(obj.discount) > 0) {
      text += (isEn ? '🏷️ **Discount:** ' : '🏷️ **تخفیف:** ') + fmt(obj.discount) + ' ' + unitStr + '\n';
    }

    var paidVal = isSale ? Number(obj.received || 0) : Number(obj.paid || 0);
    var remVal = Number(obj.remaining || 0);
    var excessVal = Number(obj.excess || 0);

    text += '💵 ' + (isSale ? (isEn ? 'Received: ' : 'مبلغ دریافتی: ') : (isEn ? 'Paid: ' : 'مبلغ پرداختی: ')) + fmt(paidVal) + ' ' + unitStr + '\n';
    if (obj.paymentTypeName) {
      text += '💳 ' + (isEn ? 'Payment Method: ' : 'روش دریافت/پرداخت: ') + obj.paymentTypeName + '\n';
      if (obj.paymentDetails && obj.paymentDetails.length > 0) {
        obj.paymentDetails.forEach(d => {
          if (d.value) text += '   • ' + d.label + ': ' + d.value + '\n';
        });
      }
    }
    text += '🔸 ' + (isEn ? 'Remaining: ' : 'مانده حساب: ') + fmt(remVal) + ' ' + unitStr + '\n';
    if (excessVal > 0) {
      text += (isSale ? (isEn ? '✨ Excess Received: ' : '✨ مازاد دریافت: ') : (isEn ? '✨ Excess Paid: ' : '✨ مازاد پرداخت: ')) + fmt(excessVal) + ' ' + unitStr + '\n';
    }

    text += generateInvoiceTextDetails(obj, currentPreviewType);

    if(navigator.share) {
      navigator.share({ text: text });
    } else {
      navigator.clipboard.writeText(text);
      alert(isEn ? 'Invoice copied to clipboard!' : 'متن فاکتور کپی شد!');
    }
  }

  function showInvoicePreview(obj, type) {
    currentPreviewInvoice = obj; currentPreviewType = type; var area = document.getElementById('invoice-print-area'); if(!area) return;
    const isEn = (currentLang === 'en');
    const dict = translations[currentLang] || translations.fa;
    var unitStr = dict['unit_currency'] || 'تومان';
    var isSale = (type === 'sale'), partyLabel = isSale ? (isEn ? 'Customer' : 'مشتری') : (isEn ? 'Supplier' : 'تأمین‌کننده'), partyName = isSale ? obj.customer : obj.supplier;
    var invoiceTitle = isSale ? (isEn ? 'Sales Invoice' : 'فاکتور فروش') : (isEn ? 'Purchase Invoice' : 'فاکتور خرید');
    var itemsHtml = '';
    var invoiceAmount = Number(obj.subtotal || obj.total || 0);
    var divider = '<div class="invoice-divider">━━━━━━ • ✿ • ━━━━━━</div>';
    
    if(obj.items) {
      obj.items.forEach((it, i) => {
        var rowTotal = it.qty * it.unitPrice;
        itemsHtml += '<div class="invoice-row" style="flex-direction:column; gap:2px;">' +
          '<div style="display:flex; justify-content:space-between; width:100%;"><span><b>'+(i+1)+'. '+it.name+'</b> <small style="color:var(--text-secondary); font-family:monospace;">('+it.barcode+')</small></span><span><b>'+fmt(rowTotal)+' '+unitStr+'</b></span></div>' +
          '<div style="font-size:0.75rem; color:var(--text-secondary);">'+(isEn?'Qty: ':'تعداد: ')+'<b>'+it.qty+'</b> | '+(isEn?'Unit: ':'فی: ')+fmt(it.unitPrice)+' '+unitStr+'</div>' +
        '</div>';
      });
    }

    var discountHtml = (obj.discount && Number(obj.discount) > 0) ? '<div class="invoice-row"><span>'+(isEn?'Discount:':'تخفیف:')+'</span><span>'+fmt(obj.discount)+' '+unitStr+'</span></div>' : '';

    var logoHtml = db.settings.logo ? '<img src="'+db.settings.logo+'" alt="لوگو">' : '';
    var footerDetails = generateInvoiceFooterDetails();

    var paidVal = isSale ? Number(obj.received || 0) : Number(obj.paid || 0);
    var remVal = Number(obj.remaining || 0);
    var excessVal = Number(obj.excess || 0);

    var payMethodHtml = '';
    if (obj.paymentTypeName) {
      payMethodHtml += '<div class="invoice-row"><span>' + (isEn ? 'Payment Method:' : 'روش دریافت/پرداخت:') + '</span><span><b>' + obj.paymentTypeName + '</b></span></div>';
      if (obj.paymentDetails && obj.paymentDetails.length > 0) {
        obj.paymentDetails.forEach(d => {
          if (d.value) {
            payMethodHtml += '<div class="invoice-row" style="font-size:0.76rem; color:var(--text-secondary);"><span>' + d.label + ':</span><span>' + d.value + '</span></div>';
          }
        });
      }
    }

    var paymentDetailsHtml = '<div style="font-size:0.86rem; text-align:inherit;">' +
      '<div class="invoice-row" style="font-weight:bold; font-size:0.95rem;"><span>'+(isEn?'Total:':'مبلغ فاکتور:')+'</span><span style="color:var(--primary);">'+fmt(invoiceAmount)+' '+unitStr+'</span></div>' +
      discountHtml +
      '<div class="invoice-row"><span>' + (isSale ? (isEn?'Received Amount:':'مبلغ دریافتی: ') : (isEn?'Paid Amount:':'مبلغ پرداختی: ')) + '</span><span><b>' + fmt(paidVal) + ' ' + unitStr + '</b></span></div>' +
      payMethodHtml +
      '<div class="invoice-row"><span>'+(isEn?'Remaining Balance:':'مانده حساب:')+'</span><span><b>' + fmt(remVal) + ' ' + unitStr + '</b></span></div>' +
      (excessVal > 0 ? '<div class="invoice-row" style="color:var(--warning);"><span>' + (isSale ? (isEn?'Excess Received:':'مازاد دریافت:') : (isEn?'Excess Paid:':'مازاد پرداخت:')) + '</span><span><b>' + fmt(excessVal) + ' ' + unitStr + '</b></span></div>' : '') +
    '</div>';

    var supportLinksHtml = '<div class="invoice-footer-section">' +
      divider +
      '<div class="invoice-section-title">'+(isEn?'App Support:':'ارتباط با پشتیبانی برنامه:')+'</div>' +
      '<div class="invoice-link-row">' +
        '<a href="https://t.me/pvmyan" target="_blank" style="color:var(--primary); text-decoration:none; font-weight:bold; font-size:0.8rem; display:inline-flex; align-items:center; gap:4px;"><i class="fab fa-telegram"></i> Telegram</a>' +
        '<a href="https://eitaa.com/Alin100" target="_blank" style="color:var(--primary); text-decoration:none; font-weight:bold; font-size:0.8rem; display:inline-flex; align-items:center; gap:4px;"><i class="fas fa-comments"></i> Eitaa</a>' +
        '<a href="mailto:vaheban@gmail.com" target="_blank" style="color:var(--primary); text-decoration:none; font-weight:bold; font-size:0.8rem; display:inline-flex; align-items:center; gap:4px;"><i class="fas fa-envelope"></i> Email</a>' +
      '</div>' +
    '</div>';

    area.innerHTML = '<div class="invoice-header">' +
        logoHtml +
        '<h3 style="margin:2px 0; font-size:1.1rem;">'+(db.settings.title||'فروش‌یار')+'</h3>' +
        '<div style="font-size:0.9rem; font-weight:bold; color:var(--primary);">'+invoiceTitle+'</div>' +
      '</div>' +
      divider +
      '<div class="invoice-row"><span>'+(isEn?'Date: ':'تاریخ: ')+'<b>'+obj.date+'</b></span></div>' +
      '<div class="invoice-row"><span>'+(isEn?'Invoice #: ':'شماره فاکتور: ')+'#'+String(obj.id).slice(-6)+'</span></div>' +
      '<div class="invoice-row"><span>'+partyLabel+': <b>'+partyName+'</b></span></div>' +
      divider +
      '<div style="margin:4px 0;">'+itemsHtml+'</div>' +
      divider +
      paymentDetailsHtml +
      footerDetails +
      supportLinksHtml;
    
    openModal('modal-invoice-preview');
  }

  function openLedgerModal(name, type) {
    const isEn = (currentLang === 'en');
    const dict = translations[currentLang] || translations.fa;
    var titlePrefix = dict['ledger_account'] || (isEn ? 'Ledger Account: ' : 'دفتر حساب: ');
    document.getElementById('ledger-modal-title').innerText = titlePrefix + name;
    document.getElementById('ledger-party-name').value = name;
    document.getElementById('ledger-party-type').value = type;

    var isCust = (type === 'customer');
    document.getElementById('ledger-total-label').innerText = isCust ? (isEn ? 'Customer Debt:' : 'بدهی مشتری:') : (isEn ? 'Creditor Balance:' : 'مانده بستانکار:');
    document.getElementById('ledger-trans-title').innerText = isCust ? (isEn ? 'Record Payment / Excess Received' : 'ثبت تسویه / دریافت وجه مازاد') : (isEn ? 'Record Payment / Excess Paid' : 'ثبت تسویه / پرداخت وجه مازاد');
    document.getElementById('ledger-amount-label').innerText = isCust ? (isEn ? 'Amount Received' : 'مبلغ دریافتی') : (isEn ? 'Amount Paid' : 'مبلغ پرداختی');
    document.getElementById('ledger-excess-label').innerText = isCust ? (isEn ? 'Excess Received' : 'مازاد دریافت') : (isEn ? 'Excess Paid' : 'مازاد پرداخت');
    document.getElementById('ledger-trans-desc').value = dict['trans_default_note'] || (isEn ? 'Account Settlement / Receipt' : 'تسویه حساب / دریافت وجه');

    renderLedgerContentList();
    openModal('modal-ledger');
  }

  function renderLedgerContentList() {
    const isEn = (currentLang === 'en');
    const dict = translations[currentLang] || translations.fa;
    var unitStr = dict['unit_currency'] || 'تومان';
    var name = document.getElementById('ledger-party-name').value;
    var type = document.getElementById('ledger-party-type').value;
    var isCust = (type === 'customer');

    var countFilter = document.getElementById('ledger-filter-count') ? document.getElementById('ledger-filter-count').value : 'all';
    var timeFilter = document.getElementById('ledger-filter-time') ? document.getElementById('ledger-filter-time').value : 'all';

    var totalUnsettledExcess = 0;
    var html = '', count = 0;
    var itemsList = [];

    if(isCust) {
      (db.sales || []).filter(s => s.customer === name && !s.excessSettled).forEach(s => {
        if (s.excess && Number(s.excess) > 0) { totalUnsettledExcess += Number(s.excess); }
      });

      var sales = (db.sales || []).filter(s => s.customer === name);
      sales.forEach(s => {
        var netSaleRem = Number(s.subtotal || s.total || 0) - Number(s.received || 0);
        var isSettled = netSaleRem <= 0;
        var excessText = (s.excess && s.excess > 0) ? ' | ' + (isEn ? 'Excess: ' : 'مازاد: ') + fmt(s.excess) + (s.excessSettled ? (isEn ? ' (Settled)' : ' (ثبت‌شده)') : '') : '';
        itemsList.push({
          type: 'sale',
          date: s.date,
          html: '<div class="list-row"><div><b>'+(isEn?'Invoice #':'فاکتور #')+String(s.id).slice(-6)+'</b><small style="display:block; color:var(--text-secondary);">'+s.date+excessText+'</small></div><div><b>'+fmt(s.subtotal)+'</b><small style="display:block; color:'+(isSettled?'var(--success)':'var(--danger)')+';">'+(isEn?'Rem: ':'مانده: ')+fmt(netSaleRem>0?netSaleRem:0)+'</small></div></div>'
        });
      });
    } else {
      (db.purchases || []).filter(p => p.supplier === name && !p.excessSettled).forEach(p => {
        if (p.excess && Number(p.excess) > 0) { totalUnsettledExcess += Number(p.excess); }
      });

      var purchases = (db.purchases || []).filter(p => p.supplier === name);
      purchases.forEach(p => {
        var netPurRem = Number(p.subtotal || p.total || 0) - Number(p.paid || 0);
        var isSettled = netPurRem <= 0;
        var excessText = (p.excess && p.excess > 0) ? ' | ' + (isEn ? 'Excess: ' : 'مازاد: ') + fmt(p.excess) + (p.excessSettled ? (isEn ? ' (Settled)' : ' (ثبت‌شده)') : '') : '';
        itemsList.push({
          type: 'purchase',
          date: p.date,
          html: '<div class="list-row"><div><b>'+(isEn?'Purchase #':'خرید #')+String(p.id).slice(-6)+'</b><small style="display:block; color:var(--text-secondary);">'+p.date+excessText+'</small></div><div><b>'+fmt(p.subtotal)+'</b><small style="display:block; color:'+(isSettled?'var(--success)':'var(--warning)')+';">'+(isEn?'Rem: ':'مانده: ')+fmt(netPurRem>0?netPurRem:0)+'</small></div></div>'
        });
      });
    }

    (db.ledgerTransactions || []).filter(t => t.partyName === name && t.partyType === type).forEach(t => {
      var excessDesc = (t.excess && t.excess > 0) ? ' + ' + (isEn ? 'Excess: ' : 'مازاد: ') + fmt(t.excess) : '';
      itemsList.push({
        type: 'trans',
        date: t.date,
        html: '<div class="list-row" style="background:#e8f5e9;"><div><b>'+(isEn?'Trans: ':'تراکنش: ')+t.desc+'</b><small style="display:block; color:var(--text-secondary);">'+t.date+'</small></div><div><b style="color:var(--success);">'+fmt(t.amount)+excessDesc+'</b><small style="display:block; color:var(--success);">'+(isEn?'Recorded':'ثبت‌شده')+'</small></div></div>'
      });
    });

    if (timeFilter === '7days' || timeFilter === '30days') {
      var todayStr = getTodayDateStr();
      itemsList = itemsList.filter(it => it.date === todayStr);
    }

    if (countFilter === '3') { itemsList = itemsList.slice(0, 3); } 
    else if (countFilter === '7') { itemsList = itemsList.slice(0, 7); }

    itemsList.forEach(it => { count++; html += it.html; });

    document.getElementById('ledger-trans-amount').value = '';
    var excessInp = document.getElementById('ledger-trans-excess');
    excessInp.value = totalUnsettledExcess > 0 ? totalUnsettledExcess : '';

    onLedgerExcessChange();

    recalculateAllBalances();
    var partyObj = isCust ? db.customers.find(x => x.name === name) : db.suppliers.find(x => x.name === name);
    var currentBalance = partyObj ? partyObj.debt : 0;

    document.getElementById('ledger-summary-total').innerText = fmt(currentBalance) + ' ' + unitStr;
    document.getElementById('ledger-summary-count').innerText = (isEn ? 'Transactions: ' : 'تعداد تراکنش‌ها: ') + count;

    var statusElem = document.getElementById('ledger-summary-status');
    if(statusElem) {
      if(currentBalance <= 0) {
        statusElem.innerText = currentBalance < 0 ? (isCust ? (isEn?'Status: Creditor':'وضعیت: بستانکار') : (isEn?'Status: Prepaid':'وضعیت: پیش‌پرداخت')) : (isEn?'Status: Settled':'وضعیت: تسویه کامل');
        statusElem.className = 'badge badge-success';
      } else {
        statusElem.innerText = isCust ? (isEn?'Status: Debtor':'وضعیت: بدهکار') : (isEn?'Status: Creditor':'وضعیت: طلبکار');
        statusElem.className = 'badge badge-danger';
      }
    }

    document.getElementById('ledger-content').innerHTML = html || ('<div style="text-align:center; color:#888; padding:12px;">'+(isEn?'No transactions found':'تراکنشی یافت نشد')+'</div>');
  }

  function onLedgerExcessChange() {
    var excessVal = Number(document.getElementById('ledger-trans-excess').value) || 0;
    var amountInp = document.getElementById('ledger-trans-amount');
    if (excessVal > 0) {
      amountInp.disabled = true;
      amountInp.style.backgroundColor = '#f5f5f5';
      amountInp.value = '';
    } else {
      amountInp.disabled = false;
      amountInp.style.backgroundColor = '#ffffff';
    }
  }

  function checkLedgerInputRule() {
    const isEn = (currentLang === 'en');
    var excessVal = Number(document.getElementById('ledger-trans-excess').value) || 0;
    if (excessVal > 0) {
      alert(isEn ? '⚠️ System Message:\nPlease save and settle the excess amount in the ledger first.' : '⚠️ پیام سیستم:\nلطفاً ابتدا مبلغ مازاد را در دفتر حساب ثبت و تسویه نمایید.');
      document.getElementById('ledger-trans-amount').value = '';
    }
  }

  function saveLedgerTransaction() {
    const isEn = (currentLang === 'en');
    const dict = translations[currentLang] || translations.fa;
    var name = document.getElementById('ledger-party-name').value;
    var type = document.getElementById('ledger-party-type').value;
    var amount = Number(document.getElementById('ledger-trans-amount').value) || 0;
    var excess = Number(document.getElementById('ledger-trans-excess').value) || 0;
    var desc = document.getElementById('ledger-trans-desc').value.trim() || dict['trans_default_note'] || (isEn ? 'Account Settlement' : 'تسویه حساب');

    if(amount <= 0 && excess <= 0) return alert(isEn ? 'Enter a valid amount' : 'مبلغ معتبری وارد کنید');

    db.ledgerTransactions.push({
      id: Date.now(),
      partyName: name,
      partyType: type,
      amount: amount,
      excess: excess,
      desc: desc,
      date: getTodayDateStr()
    });

    if(excess > 0) {
      if(type === 'customer') {
        (db.sales || []).filter(s => s.customer === name && !s.excessSettled).forEach(s => { s.excessSettled = true; });
      } else {
        (db.purchases || []).filter(p => p.supplier === name && !p.excessSettled).forEach(p => { p.excessSettled = true; });
      }
    }

    document.getElementById('ledger-trans-amount').value = '';
    document.getElementById('ledger-trans-excess').value = '';
    
    saveDb();
    openLedgerModal(name, type);
    alert(isEn ? 'Transaction recorded successfully.' : 'تراکنش با موفقیت ثبت شد.');
  }

  const DEFAULT_EXPENSE_CATEGORIES = ['اجاره مغازه', 'قبوض (آب/برق/گاز)', 'حقوق و دستمزد', 'لوازم بسته‌بندی', 'هزینه ارسال / پیک', 'سایر / متفرقه'];

  function renderExpenseCategoryChips() {
    var container = document.getElementById('expense-category-chips');
    if(!container) return;
    var savedCats = (db.expenses || []).map(e => e.category).filter(Boolean);
    var customCats = db.customExpenseCategories || [];
    var deletedCats = db.deletedExpenseCategories || [];
    
    var allCats = [...new Set([...DEFAULT_EXPENSE_CATEGORIES, ...savedCats, ...customCats])].filter(cat => !deletedCats.includes(cat));
    
    var html = '';
    if(allCats.length === 0) {
      container.innerHTML = '<span style="font-size:0.75rem; color:var(--text-secondary);">هنوز دسته‌بندی‌ای وجود ندارد.</span>';
      return;
    }
    allCats.forEach(cat => {
      html += '<span class="category-chip" onclick="selectExpenseCategoryChip(\''+cat.replace(/'/g, "\\'")+'\')">' +
                '<i class="fas fa-tag"></i> ' + cat + 
                '<i class="fas fa-times delete-chip" title="حذف این دسته" onclick="event.stopPropagation(); deleteExpenseCategoryChip(\''+cat.replace(/'/g, "\\'")+'\')"></i>' +
              '</span>';
    });
    container.innerHTML = html;
  }

  function selectExpenseCategoryChip(catName) {
    var input = document.getElementById('exp-new-cat');
    if(input) { input.value = catName; }
  }

  function deleteExpenseCategoryChip(catName) {
    const isEn = (currentLang === 'en');
    if(confirm(isEn ? 'Delete expense category "' + catName + '"?' : 'آیا می‌خواهید دسته‌بندی «' + catName + '» حذف شود؟')) {
      (db.expenses || []).forEach(e => {
        if(e.category === catName) {
          e.category = (currentLang === 'en' ? 'General' : 'عمومی');
        }
      });
      if(db.customExpenseCategories) {
        db.customExpenseCategories = db.customExpenseCategories.filter(c => c !== catName);
      }
      if(DEFAULT_EXPENSE_CATEGORIES.includes(catName)) {
        if(!db.deletedExpenseCategories) db.deletedExpenseCategories = [];
        if(!db.deletedExpenseCategories.includes(catName)) {
          db.deletedExpenseCategories.push(catName);
        }
      }
      var input = document.getElementById('exp-new-cat');
      if(input && input.value === catName) {
        input.value = '';
      }
      saveDb();
      renderExpenseCategoryChips();
      renderExpensesList();
    }
  }

  function openExpenseManagerModal() { 
    renderExpensesList(); 
    renderExpenseCategoryChips(); 
    openModal('modal-expense-manager'); 
  }

  function saveNewExpenseFromManager() {
    const isEn = (currentLang === 'en');
    var title = document.getElementById('exp-new-title').value.trim();
    var amount = Number(document.getElementById('exp-new-amount').value);
    var category = document.getElementById('exp-new-cat').value.trim() || (currentLang === 'en' ? 'General' : 'عمومی');
    if(!title || !amount) return alert(isEn ? 'Expense title and amount are required' : 'عنوان و مبلغ هزینه الزامی است');
    if(!db.expenses) db.expenses = [];
    db.expenses.unshift({ id: Date.now(), title: title, amount: amount, category: category, date: getTodayDateStr() });
    
    if(!db.customExpenseCategories) db.customExpenseCategories = [];
    if(!db.customExpenseCategories.includes(category) && !DEFAULT_EXPENSE_CATEGORIES.includes(category)) {
      db.customExpenseCategories.push(category);
    }
    
    if(db.deletedExpenseCategories && db.deletedExpenseCategories.includes(category)) {
      db.deletedExpenseCategories = db.deletedExpenseCategories.filter(c => c !== category);
    }

    document.getElementById('exp-new-title').value = ''; 
    document.getElementById('exp-new-amount').value = '';
    document.getElementById('exp-new-cat').value = '';
    saveDb(); 
    renderExpenseCategoryChips();
    renderExpensesList(); 
    alert(isEn ? 'Expense saved.' : 'هزینه با موفقیت ثبت شد.');
  }

  function renderExpensesList() {
    const dict = translations[currentLang] || translations.fa;
    var unitStr = dict['unit_currency'] || 'تومان';
    var q = normalizeText(document.getElementById('search-expense')?document.getElementById('search-expense').value:'');
    var html = '';
    (db.expenses || []).filter(e => normalizeText(e.title).includes(q) || normalizeText(e.category).includes(q)).forEach(e => {
      html += '<div class="list-row"><div><b>'+e.title+'</b><small style="display:block; color:var(--text-secondary);">'+e.category+' | '+e.date+'</small></div><div style="display:flex; gap:6px;"><b style="color:var(--danger);">'+fmt(e.amount)+' '+unitStr+'</b><button class="btn btn-danger btn-sm" onclick="db.expenses=db.expenses.filter(x=>x.id!='+e.id+'); saveDb(); renderExpensesList();"><i class="fas fa-trash"></i></button></div></div>';
    });
    document.getElementById('expenses-list').innerHTML = html || ('<div style="text-align:center; color:#888; padding:12px;">'+(dict['no_expense_found']||'هزینه‌ای ثبت نشده است')+'</div>');
  }

  function openPurchaseModal(editId) {
    populateSelects(); activePurItems = [];
    currentPurPaymentDetails = {};
    var todayG = new Date();
    if(editId) {
      var p = db.purchases.find(x => x.id === editId); if(!p) return;
      document.getElementById('pur-edit-id').value = p.id;
      document.getElementById('pur-supplier').value = p.supplier;
      setDropdownsFromDateStr('pur-year', 'pur-month', 'pur-day', p.date);
      document.getElementById('pur-discount').value = p.discount||'';
      document.getElementById('pur-paid').value = p.paid||'';
      activePurItems = JSON.parse(JSON.stringify(p.items||[]));
      if (p.paymentTypeId) {
        selectedPurPaymentTypeId = p.paymentTypeId;
        if (p.paymentDetails && Array.isArray(p.paymentDetails)) {
          currentPurPaymentDetails[p.paymentTypeId] = {};
          p.paymentDetails.forEach(d => {
            if (d.fieldId) currentPurPaymentDetails[p.paymentTypeId][d.fieldId] = d.value;
          });
        }
      } else {
        selectedPurPaymentTypeId = (db.settings.paymentTypes && db.settings.paymentTypes[0]) ? db.settings.paymentTypes[0].id : null;
      }
    } else { 
      clearPurForm(); 
      onPurSupplierChange(); 
      initDateDropdowns('pur-year', 'pur-month', 'pur-day', currentLang === 'en' ? { gy: todayG.getFullYear(), gm: todayG.getMonth() + 1, gd: todayG.getDate() } : getTodayJalaali());
    }
    renderPurCategoryChips();
    renderPurItemsList(); 
    renderPurPaymentChips();
    openModal('modal-purchase');
    if(!editId) checkSupplierUnsettledExcess();
  }

  function addPurItemFromInput() {
    const isEn = (currentLang === 'en');
    var n = document.getElementById('pur-input-name').value.trim();
    var cat = document.getElementById('pur-input-category') ? document.getElementById('pur-input-category').value.trim() : '';
    var q = Number(document.getElementById('pur-input-qty').value)||1;
    var pr = Number(document.getElementById('pur-input-price').value)||0;
    if(!n) return alert(isEn ? 'Product name is required' : 'نام کالا الزامی است');
    
    if(cat) {
      if(!db.customProductCategories) db.customProductCategories = [];
      if(!db.customProductCategories.includes(cat) && !DEFAULT_PRODUCT_CATEGORIES.includes(cat)) {
        db.customProductCategories.push(cat);
      }
      if(db.deletedProductCategories && db.deletedProductCategories.includes(cat)) {
        db.deletedProductCategories = db.deletedProductCategories.filter(c => c !== cat);
      }
    }

    var serialIdx = activePurItems.length + 1;
    if(serialIdx > 999) serialIdx = 999;
    var generatedCode = generate15DigitCode(serialIdx, currentLang);

    activePurItems.push({ name: n, category: cat, barcode: generatedCode, qty: q, unitPrice: pr });
    renderPurItemsList();
    renderPurCategoryChips();
    
    document.getElementById('pur-input-name').value = ''; 
    if(document.getElementById('pur-input-category')) document.getElementById('pur-input-category').value = '';
    document.getElementById('pur-input-qty').value = ''; 
    document.getElementById('pur-input-price').value = '';
  }

  function renderPurItemsList() {
    const dict = translations[currentLang] || translations.fa;
    var html = ''; 
    activePurItems.forEach((it, i) => html += '<div class="dynamic-item-card"><div><div class="dynamic-item-title">'+it.name+' <small style="color:var(--text-secondary); font-family:monospace;">(کد: '+it.barcode+')</small></div><div class="dynamic-item-sub">'+it.qty+' × '+fmt(it.unitPrice)+'</div></div><button class="btn btn-danger btn-sm" onclick="activePurItems.splice('+i+',1); renderPurItemsList(); renderPurCategoryChips();"><i class="fas fa-trash"></i></button></div>');
    document.getElementById('pur-items-list').innerHTML = html || ('<div style="text-align:center; color:#888; font-size:0.8rem; padding:6px;">'+(dict['no_items_found']||'آیتمی اضافه نشده است')+'</div>');
    calcPurTotals();
  }

  function clearPurForm() { 
    activePurItems=[]; 
    currentPurPaymentDetails = {};
    selectedPurPaymentTypeId = (db.settings.paymentTypes && db.settings.paymentTypes[0]) ? db.settings.paymentTypes[0].id : null;
    var todayG = new Date();
    initDateDropdowns('pur-year', 'pur-month', 'pur-day', currentLang === 'en' ? { gy: todayG.getFullYear(), gm: todayG.getMonth() + 1, gd: todayG.getDate() } : getTodayJalaali()); 
    document.getElementById('pur-discount').value=''; 
    document.getElementById('pur-paid').value=''; 
    document.getElementById('pur-input-qty').value=''; 
    if(document.getElementById('pur-input-name')) document.getElementById('pur-input-name').value='';
    if(document.getElementById('pur-input-category')) document.getElementById('pur-input-category').value='';
    renderPurItemsList(); 
    renderPurCategoryChips();
    renderPurPaymentChips();
  }

  function onPurSupplierChange() { checkSupplierUnsettledExcess(); }

  function calcPurTotals() {
    var sub = 0; activePurItems.forEach(it => sub += (it.qty * it.unitPrice));
    var disc = Number(document.getElementById('pur-discount').value)||0;
    var receivable = sub - disc; if(receivable < 0) receivable = 0;
    
    document.getElementById('pur-subtotal').value = sub;
    document.getElementById('pur-receivable').value = receivable;

    var paid = Number(document.getElementById('pur-paid').value)||0;
    var diff = paid - receivable;
    var excess = diff > 0 ? diff : 0;
    var remaining = diff < 0 ? Math.abs(diff) : 0;

    document.getElementById('pur-excess').value = excess;
    document.getElementById('pur-remaining').value = remaining;
  }

  function savePurchase() {
    const isEn = (currentLang === 'en');
    if(checkSupplierUnsettledExcess()) { return; }

    saveCurrentPurPaymentFieldsToState();

    var editId = document.getElementById('pur-edit-id').value;
    var supplier = document.getElementById('pur-supplier').value || (isEn ? 'General Supplier' : 'تأمین‌کننده عمومی');
    var date = getDateFromDropdowns('pur-year', 'pur-month', 'pur-day');
    var subtotal = Number(document.getElementById('pur-subtotal').value)||0;

    var paid = Number(document.getElementById('pur-paid').value)||0;
    var excess = Number(document.getElementById('pur-excess').value)||0;
    var remaining = Number(document.getElementById('pur-remaining').value)||0;

    if(activePurItems.length === 0) return alert(isEn ? 'Enter purchase items' : 'اقلام خرید را وارد کنید');

    if(!editId) {
      activePurItems.forEach((it, idx) => {
        var serialIndex = idx + 1;
        if(serialIndex > 999) serialIndex = 999;
        var code = it.barcode || generate15DigitCode(serialIndex, currentLang);
        db.products.push({ 
          id: Date.now() + Math.random(), 
          name: it.name, 
          category: it.category || '',
          barcode: code,
          qty: it.qty, 
          buyPrice: it.unitPrice, 
          price: Math.round(it.unitPrice * 1.3) 
        });
      });
    }

    var activePt = (db.settings.paymentTypes || []).find(t => t.id === selectedPurPaymentTypeId);
    var paymentDetailsArr = [];
    if (activePt && activePt.fields) {
      var savedVals = currentPurPaymentDetails[activePt.id] || {};
      activePt.fields.forEach(f => {
        paymentDetailsArr.push({
          fieldId: f.id,
          label: f.label,
          value: savedVals[f.id] || ''
        });
      });
    }

    var pObj = {
      id: editId ? Number(editId) : Date.now(),
      supplier: supplier,
      date: date,
      items: JSON.parse(JSON.stringify(activePurItems)),
      item: activePurItems.map(i => i.name+'×'+i.qty).join(', '),
      discount: Number(document.getElementById('pur-discount').value)||0,
      subtotal: subtotal,
      total: subtotal,
      paid: paid,
      paymentTypeId: activePt ? activePt.id : '',
      paymentTypeName: activePt ? activePt.name : '',
      paymentDetails: paymentDetailsArr,
      excess: excess,
      excessSettled: false,
      remaining: remaining
    };

    if(editId) { db.purchases = db.purchases.map(p => p.id == editId ? pObj : p); } 
    else { db.purchases.unshift(pObj); }
    saveDb(); closeModal('modal-purchase');
    if(!editId) showInvoicePreview(pObj, 'purchase');
  }

  function renderPurchases() {
    const dict = translations[currentLang] || translations.fa;
    const isEn = (currentLang === 'en');
    var unitStr = dict['unit_currency'] || 'تومان';
    var q = normalizeText(document.getElementById('search-purchase')?document.getElementById('search-purchase').value:''), html = '', list = db.purchases || [];
    list.filter(p => normalizeText(p.supplier).includes(q) || normalizeText(p.item).includes(q)).forEach((p, idx) => {
      var ptBadge = p.paymentTypeName ? ' <span class="badge badge-info">' + p.paymentTypeName + '</span>' : '';
      html += '<div class="list-row"><div><b>'+(dict['str_purchase_no']||'خرید #')+(list.length-idx)+'</b>'+ptBadge+'<small style="display:block; color:var(--text-secondary);">'+p.supplier+' | '+p.date+'</small></div><div style="display:flex; gap:4px;"><b style="color:var(--danger);">'+fmt(p.subtotal)+' '+unitStr+'</b><button class="btn btn-info btn-sm" onclick=\'showInvoicePreview('+JSON.stringify(p)+', "purchase")\'><i class="fas fa-eye"></i></button><button class="btn btn-primary btn-sm" onclick="openPurchaseModal('+p.id+')"><i class="fas fa-edit"></i></button><button class="btn btn-danger btn-sm" onclick="db.purchases=db.purchases.filter(x=>x.id!='+p.id+'); saveDb();"><i class="fas fa-trash"></i></button></div></div>';
    });
    document.getElementById('purchases-list').innerHTML = html || ('<div style="text-align:center; color:#888; padding:12px;">'+(dict['no_pur_found']||'فاکتور خریدی ثبت نشده است')+'</div>');
  }

  function renderAIAnalysis() {
    const isEn = (currentLang === 'en');
    const dict = translations[currentLang] || translations.fa;
    var unitStr = dict['unit_currency'] || 'تومان';

    var ts = (db.sales||[]).reduce((a,b)=>a+Number(b.subtotal||b.total||0),0);
    var tp = (db.sales||[]).reduce((a,b)=>a+Number(b.profit||0),0);
    var te = (db.expenses||[]).reduce((a,b)=>a+Number(b.amount||0),0);
    var netProfit = tp - te;

    var html = '<div class="card" style="margin:0; padding:12px; background:#f4f6f9;">' +
      '<div style="font-weight:bold; color:var(--primary); margin-bottom:8px;"><i class="fas fa-chart-line"></i> '+(isEn?'Smart Store Performance Analysis:':'تحلیل هوشمند عملکرد فروشگاه:')+'</div>' +
      '<div class="list-row"><span>'+(isEn?'Total Sales:':'فروش کل:')+'</span><b>'+fmt(ts)+' '+unitStr+'</b></div>' +
      '<div class="list-row"><span>'+(isEn?'Gross Profit:':'سود ناخالص:')+'</span><b style="color:var(--info);">'+fmt(tp)+' '+unitStr+'</b></div>' +
      '<div class="list-row"><span>'+(isEn?'Total Expenses:':'مجموع هزینه‌ها:')+'</span><b style="color:var(--danger);">'+fmt(te)+' '+unitStr+'</b></div>' +
      '<div class="list-row"><span>'+(isEn?'Net Profit:':'سود خالص نهایی:')+'</span><b style="color:'+(netProfit>=0?'var(--success)':'var(--danger)')+';">'+fmt(netProfit)+' '+unitStr+'</b></div>' +
      '<div style="margin-top:10px; font-size:0.8rem; color:#555; background:#fff; padding:8px; border-radius:8px; border:1px solid #e0e0e0;">' +
        '<b>💡 '+(isEn?'Smart Tip:':'پیشنهاد هوشمند:')+'</b> ' + (netProfit > 0 ? (isEn?'Positive store performance. Reinvest profits into popular items.':'عملکرد فروشگاه مثبت است. پیشنهاد می‌شود بخشی از سود را صرف تامین اقلام پرفروش نمایید.') : (isEn?'High expense ratio. Consider optimizing operational costs.':'میزان هزینه‌ها بالا است. توصیه می‌شود هزینه‌های جاری را بهینه‌سازی کنید.')) +
      '</div>' +
    '</div>';

    document.getElementById('ai-content-body').innerHTML = html;
  }

  function saveSettings() {
    const isEn = (currentLang === 'en');
    syncSettingsFromDOM();
    db.settings.title = document.getElementById('cfg-title').value || db.settings.title;
    db.settings.subtitle = document.getElementById('cfg-subtitle').value || db.settings.subtitle;
    saveDb(); 
    alert(isEn ? 'All settings saved successfully.' : 'تمام تنظیمات با موفقیت ذخیره شد.');
  }

  function openProductModal() {
    document.getElementById('prod-edit-id').value = ''; 
    document.getElementById('prod-name').value = '';
    document.getElementById('prod-barcode').value = generate15DigitCode(1, currentLang);
    document.getElementById('prod-category').value = '';
    document.getElementById('prod-qty').value = ''; 
    document.getElementById('prod-buy-price').value = '';
    document.getElementById('prod-price').value = ''; 
    renderProductCategoryChips();
    openModal('modal-product');
  }

  function editProduct(id) {
    var p = (db.products || []).find(x => x.id === id); if(!p) return;
    document.getElementById('prod-edit-id').value = p.id; 
    document.getElementById('prod-name').value = p.name;
    document.getElementById('prod-barcode').value = p.barcode || generate15DigitCode(1, currentLang);
    document.getElementById('prod-category').value = p.category||'';
    document.getElementById('prod-qty').value = p.qty; 
    document.getElementById('prod-buy-price').value = p.buyPrice||'';
    document.getElementById('prod-price').value = p.price||''; 
    renderProductCategoryChips();
    openModal('modal-product');
  }

  function deleteProduct(id) { 
    const isEn = (currentLang === 'en');
    if(confirm(isEn ? 'Delete item?' : 'حذف شود؟')) { db.products = db.products.filter(x => x.id !== id); saveDb(); } 
  }
  function toggleProdProfitInput() { document.getElementById('prod-margin-wrap').style.display = document.getElementById('prod-auto-profit-toggle').checked ? 'block' : 'none'; }
  function calcProdPriceFromMargin() {
    if(!document.getElementById('prod-auto-profit-toggle').checked) return;
    var b = Number(document.getElementById('prod-buy-price').value)||0, m = Number(document.getElementById('prod-profit-margin').value)||0;
    if(b>0 && m>0) document.getElementById('prod-price').value = Math.round(b + (b*(m/100)));
  }

  function renderDashDebtorsAndCreditors() {
    const dict = translations[currentLang] || translations.fa;
    const isEn = (currentLang === 'en');
    var unitStr = dict['unit_currency'] || 'تومان';

    var htmlD = ''; (db.customers || []).filter(c => c.debt > 0).forEach(c => htmlD += '<div class="list-row"><span><b>'+c.name+'</b></span><span style="color:var(--danger); font-weight:bold;">'+fmt(c.debt)+' '+unitStr+' '+(dict['str_debtor']||'بدهکار')+'</span></div>');
    document.getElementById('dash-debtors').innerHTML = htmlD || ('<div style="text-align:center; color:#888; padding:12px;">'+(dict['no_debtor_cust']||'مشتری بدهکاری وجود ندارد')+'</div>');
    
    var htmlC = ''; (db.suppliers || []).filter(s => s.debt > 0).forEach(s => htmlC += '<div class="list-row"><span><b>'+s.name+'</b></span><span style="color:var(--warning); font-weight:bold;">'+fmt(s.debt)+' '+unitStr+' '+(dict['str_creditor']||'طلبکار')+'</span></div>');
    document.getElementById('dash-creditors').innerHTML = htmlC || ('<div style="text-align:center; color:#888; padding:12px;">'+(dict['no_creditor_supp']||'تأمین‌کننده بستانکاری وجود ندارد')+'</div>');
  }

  function renderCustomers() {
    const dict = translations[currentLang] || translations.fa;
    const isEn = (currentLang === 'en');
    var unitStr = dict['unit_currency'] || 'تومان';
    var q = normalizeText(document.getElementById('search-customer')?document.getElementById('search-customer').value:''), html = '';
    (db.customers || []).filter(c => normalizeText(c.name).includes(q)).forEach(c => {
      var av = c.avatar ? '<img src="'+c.avatar+'" style="width:34px; height:34px; border-radius:50%; object-fit:cover; margin-left:8px;">' : '';
      var debtText = c.debt < 0 ? (isEn?'Creditor: ':'بستانکار: ') + fmt(Math.abs(c.debt)) + ' ' + unitStr : (isEn?'Debt: ':'بدهی: ') + fmt(c.debt) + ' ' + unitStr;
      html += '<div class="list-row"><div style="display:flex; align-items:center;">'+av+'<div><b>'+c.name+'</b><small style="display:block; color:var(--text-secondary);">'+debtText+'</small></div></div><div style="display:flex; gap:4px;"><button class="btn btn-warning btn-sm" onclick=\'openLedgerModal("'+c.name+'", "customer")\'><i class="fas fa-book"></i> '+(isEn?'Ledger':'دفتر')+'</button><button class="btn btn-primary btn-sm" onclick="editCustomer('+c.id+')"><i class="fas fa-edit"></i></button><button class="btn btn-danger btn-sm" onclick="db.customers=db.customers.filter(x=>x.id!='+c.id+'); saveDb();"><i class="fas fa-trash"></i></button></div></div>';
    });
    document.getElementById('customers-list').innerHTML = html || ('<div style="text-align:center; color:#888; padding:12px;">'+(dict['no_cust_found']||'مشتری یافت نشد')+'</div>');
  }
  function openCustomerModal() { 
    const isEn = (currentLang === 'en');
    tempCustAvatar=''; 
    document.getElementById('cust-edit-id').value=''; 
    document.getElementById('cust-name').value=''; 
    document.getElementById('cust-address').value=''; 
    document.getElementById('cust-avatar-preview').style.display='none'; 
    document.getElementById('cust-phones-list').innerHTML=''; 
    const dict = translations[currentLang] || translations.fa;
    if(document.getElementById('cust-file-label')) document.getElementById('cust-file-label').innerText = dict['choose_file'] || 'Choose File';
    addCustPhoneRow(isEn?'Mobile':'همراه',''); 
    openModal('modal-customer'); 
  }
  function editCustomer(id) {
    var c = db.customers.find(x => x.id === id); if(!c) return;
    document.getElementById('cust-edit-id').value = c.id; document.getElementById('cust-name').value = c.name;
    document.getElementById('cust-address').value = c.address||''; tempCustAvatar = c.avatar||'';
    var img = document.getElementById('cust-avatar-preview'); if(tempCustAvatar) { img.src = tempCustAvatar; img.style.display = 'inline-block'; } else img.style.display = 'none';
    const dict = translations[currentLang] || translations.fa;
    if(document.getElementById('cust-file-label')) document.getElementById('cust-file-label').innerText = dict['choose_file'] || 'Choose File';
    var list = document.getElementById('cust-phones-list'); list.innerHTML = ''; (c.phones||[]).forEach(p => addCustPhoneRow(p.label, p.number));
    openModal('modal-customer');
  }
  function uploadCustomerAvatar(e) { var f = e.target.files[0]; if(!f) return; var r = new FileReader(); r.onload = function(evt) { tempCustAvatar = evt.target.result; var img = document.getElementById('cust-avatar-preview'); img.src = tempCustAvatar; img.style.display = 'inline-block'; }; r.readAsDataURL(f); }

  function renderSuppliers() {
    const dict = translations[currentLang] || translations.fa;
    const isEn = (currentLang === 'en');
    var unitStr = dict['unit_currency'] || 'تومان';
    var q = normalizeText(document.getElementById('search-supplier')?document.getElementById('search-supplier').value:''), html = '';
    (db.suppliers || []).filter(s => normalizeText(s.name).includes(q)).forEach(s => {
      var av = s.avatar ? '<img src="'+s.avatar+'" style="width:34px; height:34px; border-radius:50%; object-fit:cover; margin-left:8px;">' : '';
      var debtText = s.debt < 0 ? (isEn?'Prepaid: ':'پیش‌پرداخت: ') + fmt(Math.abs(s.debt)) + ' ' + unitStr : (isEn?'Creditor: ':'طلبکار: ') + fmt(s.debt) + ' ' + unitStr;
      html += '<div class="list-row"><div style="display:flex; align-items:center;">'+av+'<div><b>'+s.name+'</b><small style="display:block; color:var(--text-secondary);">'+debtText+'</small></div></div><div style="display:flex; gap:4px;"><button class="btn btn-warning btn-sm" onclick=\'openLedgerModal("'+s.name+'", "supplier")\'><i class="fas fa-book"></i> '+(isEn?'Ledger':'دفتر')+'</button><button class="btn btn-primary btn-sm" onclick="editSupplier('+s.id+')"><i class="fas fa-edit"></i></button><button class="btn btn-danger btn-sm" onclick="db.suppliers=db.suppliers.filter(x=>x.id!='+s.id+'); saveDb();"><i class="fas fa-trash"></i></button></div></div>';
    });
    document.getElementById('suppliers-list').innerHTML = html || ('<div style="text-align:center; color:#888; padding:12px;">'+(dict['no_supp_found']||'تأمین‌کننده‌ای یافت نشد')+'</div>');
  }
  function openSupplierModal() { 
    const isEn = (currentLang === 'en');
    tempSuppAvatar=''; 
    document.getElementById('supp-edit-id').value=''; 
    document.getElementById('supp-name').value=''; 
    document.getElementById('supp-address').value=''; 
    document.getElementById('supp-avatar-preview').style.display='none'; 
    document.getElementById('supp-phones-list').innerHTML=''; 
    const dict = translations[currentLang] || translations.fa;
    if(document.getElementById('supp-file-label')) document.getElementById('supp-file-label').innerText = dict['choose_file'] || 'Choose File';
    addSuppPhoneRow(isEn?'Office':'دفتر',''); 
    openModal('modal-supplier'); 
  }
  function editSupplier(id) {
    var s = db.suppliers.find(x => x.id === id); if(!s) return;
    document.getElementById('supp-edit-id').value = s.id; document.getElementById('supp-name').value = s.name;
    document.getElementById('supp-address').value = s.address||''; tempSuppAvatar = s.avatar||'';
    var img = document.getElementById('supp-avatar-preview'); if(tempSuppAvatar) { img.src = tempSuppAvatar; img.style.display = 'inline-block'; } else img.style.display = 'none';
    const dict = translations[currentLang] || translations.fa;
    if(document.getElementById('supp-file-label')) document.getElementById('supp-file-label').innerText = dict['choose_file'] || 'Choose File';
    var list = document.getElementById('supp-phones-list'); list.innerHTML = ''; (s.phones||[]).forEach(p => addSuppPhoneRow(p.label, p.number));
    openModal('modal-supplier');
  }
  function uploadSupplierAvatar(e) { var f = e.target.files[0]; if(!f) return; var r = new FileReader(); r.onload = function(evt) { tempSuppAvatar = evt.target.result; var img = document.getElementById('supp-avatar-preview'); img.src = tempSuppAvatar; img.style.display = 'inline-block'; }; r.readAsDataURL(f); }

  function onSaleInputProdChange() {
    var pId = document.getElementById('sale-input-prod').value;
    var p = (db.products || []).find(x => x.id == pId);
    if(p) document.getElementById('sale-input-price').value = p.price;
  }
  function addSaleItemFromInput() {
    const isEn = (currentLang === 'en');
    var pId = document.getElementById('sale-input-prod').value;
    var q = Number(document.getElementById('sale-input-qty').value)||1;
    var pr = Number(document.getElementById('sale-input-price').value)||0;
    var p = (db.products || []).find(x => x.id == pId);
    if(!p) return alert(isEn ? 'Select a product' : 'کالا را انتخاب کنید');
    activeSaleItems.push({ productId: p.id, name: p.name, barcode: p.barcode, qty: q, unitPrice: pr, buyPrice: p.buyPrice||0 });
    renderSaleItemsList();
  }
  function renderSaleItemsList() {
    const dict = translations[currentLang] || translations.fa;
    var html = '';
    activeSaleItems.forEach((it, i) => html += '<div class="dynamic-item-card"><div><div class="dynamic-item-title">'+it.name+' <small style="color:var(--text-secondary); font-family:monospace;">('+it.barcode+')</small></div><div class="dynamic-item-sub">'+it.qty+' × '+fmt(it.unitPrice)+' = <b>'+fmt(it.qty*it.unitPrice)+'</b></div></div><button class="btn btn-danger btn-sm" onclick="activeSaleItems.splice('+i+',1); renderSaleItemsList();"><i class="fas fa-trash"></i></button></div>');
    document.getElementById('sale-items-list').innerHTML = html || ('<div style="text-align:center; color:#888; font-size:0.8rem; padding:6px;">'+(dict['no_items_found']||'آیتمی اضافه نشده است')+'</div>');
    calcSaleTotals();
  }
  function clearSaleForm() { 
    activeSaleItems=[]; 
    currentSalePaymentDetails = {};
    selectedSalePaymentTypeId = (db.settings.paymentTypes && db.settings.paymentTypes[0]) ? db.settings.paymentTypes[0].id : null;
    var todayG = new Date();
    initDateDropdowns('sale-year', 'sale-month', 'sale-day', currentLang === 'en' ? { gy: todayG.getFullYear(), gm: todayG.getMonth() + 1, gd: todayG.getDate() } : getTodayJalaali()); 
    document.getElementById('sale-discount').value=''; 
    document.getElementById('sale-received').value=''; 
    document.getElementById('sale-input-qty').value=''; 
    renderSaleItemsList(); 
    renderSalePaymentChips();
  }

  function checkCustomerUnsettledExcess() {
    const dict = translations[currentLang] || translations.fa;
    var custName = document.getElementById('sale-customer').value;
    if(!custName) return false;
    var hasUnsettled = (db.sales || []).some(s => s.customer === custName && s.excess > 0 && !s.excessSettled);
    if (hasUnsettled) {
      const isEn = (currentLang === 'en');
      var template = dict['alert_unsettled_cust'] || '⚠️ پیام سیستم:\nمشتری «{custName}» دارای مازاد دریافتی تسویه‌نشده است.';
      var alertMsg = template.replace('{custName}', custName);
      alert(alertMsg);
      return true;
    }
    return false;
  }

  function checkSupplierUnsettledExcess() {
    const dict = translations[currentLang] || translations.fa;
    var suppName = document.getElementById('pur-supplier').value;
    if(!suppName) return false;
    var hasUnsettled = (db.purchases || []).some(p => p.supplier === suppName && p.excess > 0 && !p.excessSettled);
    if (hasUnsettled) {
      const isEn = (currentLang === 'en');
      var template = dict['alert_unsettled_supp'] || '⚠️ پیام سیستم:\nتأمین‌کننده «{suppName}» دارای مازاد پرداختی تسویه‌نشده است.';
      var alertMsg = template.replace('{suppName}', suppName);
      alert(alertMsg);
      return true;
    }
    return false;
  }

  function onSaleCustomerChange() { checkCustomerUnsettledExcess(); }

  function calcSaleTotals() {
    var sub = 0, prof = 0;
    activeSaleItems.forEach(it => { sub += (it.qty * it.unitPrice); prof += (it.qty * (it.unitPrice - it.buyPrice)); });
    var disc = Number(document.getElementById('sale-discount').value)||0;
    var receivable = sub - disc; if(receivable < 0) receivable = 0;
    
    document.getElementById('sale-subtotal').value = sub;
    document.getElementById('sale-receivable').value = receivable;

    var rec = Number(document.getElementById('sale-received').value)||0;
    var diff = rec - receivable;
    var excess = diff > 0 ? diff : 0;
    var remaining = diff < 0 ? Math.abs(diff) : 0;

    document.getElementById('sale-excess').value = excess;
    document.getElementById('sale-remaining').value = remaining;
    document.getElementById('sale-profit').value = prof;
  }

  function openSaleModal(editId) {
    populateSelects(); activeSaleItems = [];
    currentSalePaymentDetails = {};
    var todayG = new Date();
    if(editId) {
      var s = db.sales.find(x => x.id === editId); if(!s) return;
      document.getElementById('sale-edit-id').value = s.id;
      document.getElementById('sale-customer').value = s.customer;
      setDropdownsFromDateStr('sale-year', 'sale-month', 'sale-day', s.date);
      document.getElementById('sale-discount').value = s.discount||'';
      document.getElementById('sale-received').value = s.received||'';
      activeSaleItems = JSON.parse(JSON.stringify(s.items||[]));
      if (s.paymentTypeId) {
        selectedSalePaymentTypeId = s.paymentTypeId;
        if (s.paymentDetails && Array.isArray(s.paymentDetails)) {
          currentSalePaymentDetails[s.paymentTypeId] = {};
          s.paymentDetails.forEach(d => {
            if (d.fieldId) currentSalePaymentDetails[s.paymentTypeId][d.fieldId] = d.value;
          });
        }
      } else {
        selectedSalePaymentTypeId = (db.settings.paymentTypes && db.settings.paymentTypes[0]) ? db.settings.paymentTypes[0].id : null;
      }
    } else { 
      clearSaleForm(); 
      initDateDropdowns('sale-year', 'sale-month', 'sale-day', currentLang === 'en' ? { gy: todayG.getFullYear(), gm: todayG.getMonth() + 1, gd: todayG.getDate() } : getTodayJalaali());
    }
    renderSaleItemsList(); 
    renderSalePaymentChips();
    openModal('modal-sale');
    if(!editId) checkCustomerUnsettledExcess();
  }

  function saveSale() {
    const isEn = (currentLang === 'en');
    if(checkCustomerUnsettledExcess()) { return; }

    saveCurrentPaymentFieldsToState();

    var editId = document.getElementById('sale-edit-id').value;
    var customer = document.getElementById('sale-customer').value || (isEn ? 'General Customer' : 'مشتری عمومی');
    var date = getDateFromDropdowns('sale-year', 'sale-month', 'sale-day');
    var subtotal = Number(document.getElementById('sale-subtotal').value)||0;

    var received = Number(document.getElementById('sale-received').value)||0;
    var excess = Number(document.getElementById('sale-excess').value)||0;
    var remaining = Number(document.getElementById('sale-remaining').value)||0;

    if(activeSaleItems.length === 0) return alert(isEn ? 'Add items to the invoice' : 'اقلامی به فاکتور اضافه کنید');

    if(!editId) { activeSaleItems.forEach(it => { var p = db.products.find(x => x.id == it.productId); if(p) p.qty -= it.qty; }); }

    var activePt = (db.settings.paymentTypes || []).find(t => t.id === selectedSalePaymentTypeId);
    var paymentDetailsArr = [];
    if (activePt && activePt.fields) {
      var savedVals = currentSalePaymentDetails[activePt.id] || {};
      activePt.fields.forEach(f => {
        paymentDetailsArr.push({
          fieldId: f.id,
          label: f.label,
          value: savedVals[f.id] || ''
        });
      });
    }

    var sObj = {
      id: editId ? Number(editId) : Date.now(),
      customer: customer,
      date: date,
      items: JSON.parse(JSON.stringify(activeSaleItems)),
      item: activeSaleItems.map(i => i.name+'×'+i.qty).join(', '),
      discount: Number(document.getElementById('sale-discount').value)||0,
      subtotal: subtotal,
      total: subtotal,
      received: received,
      paymentTypeId: activePt ? activePt.id : '',
      paymentTypeName: activePt ? activePt.name : '',
      paymentDetails: paymentDetailsArr,
      excess: excess,
      excessSettled: false,
      remaining: remaining,
      profit: Number(document.getElementById('sale-profit').value)||0
    };

    if(editId) { db.sales = db.sales.map(s => s.id == editId ? sObj : s); } 
    else { db.sales.unshift(sObj); }
    saveDb(); closeModal('modal-sale');
    if(!editId) showInvoicePreview(sObj, 'sale');
  }

  function renderSales() {
    const dict = translations[currentLang] || translations.fa;
    const isEn = (currentLang === 'en');
    var unitStr = dict['unit_currency'] || 'تومان';
    var q = normalizeText(document.getElementById('search-sale')?document.getElementById('search-sale').value:''), html = '', list = db.sales || [];
    list.filter(s => normalizeText(s.customer).includes(q) || normalizeText(s.item).includes(q)).forEach((s, idx) => {
      var settled = Number(s.remaining||0) <= 0;
      var ptBadge = s.paymentTypeName ? ' <span class="badge badge-info">' + s.paymentTypeName + '</span>' : '';
      html += '<div class="list-row"><div><b>'+(dict['str_invoice_no']||'فاکتور #')+(list.length-idx)+'</b> <span class="badge '+(settled?'badge-success':'badge-danger')+'">'+(settled?(dict['str_settled']||'تسویه'):(dict['str_debtor']||'بدهکار'))+'</span>'+ptBadge+'<small style="display:block; color:var(--text-secondary);">'+s.customer+' | '+s.date+'</small></div><div style="display:flex; gap:4px;"><b style="color:var(--success);">'+fmt(s.subtotal)+' '+unitStr+'</b><button class="btn btn-info btn-sm" onclick=\'showInvoicePreview('+JSON.stringify(s)+', "sale")\'><i class="fas fa-eye"></i></button><button class="btn btn-primary btn-sm" onclick="openSaleModal('+s.id+')"><i class="fas fa-edit"></i></button><button class="btn btn-danger btn-sm" onclick="db.sales=db.sales.filter(x=>x.id!='+s.id+'); saveDb();"><i class="fas fa-trash"></i></button></div></div>';
    });
    document.getElementById('sales-list').innerHTML = html || ('<div style="text-align:center; color:#888; padding:12px;">'+(dict['no_sale_found']||'فاکتور فروشی ثبت نشده است')+'</div>');
  }

  function shareInvoiceAsImage() {
    const isEn = (currentLang === 'en');
    if (currentPreviewInvoice && currentPreviewInvoice.items && currentPreviewInvoice.items.length > 6) {
      alert(isEn ? '⚠️ System Limit:\nImage export is limited to 6 items. Please use text export.' : '⚠️ محدودیت سیستم:\nارسال تصویری فاکتور به ( ۶ ) قلم محدود شده است. لطفاً از گزینه ارسال متنی استفاده کنید.');
      return;
    }
    var area = document.getElementById('invoice-print-area'); if(!area) return;
    html2canvas(area, { scale: 2, backgroundColor: '#ffffff' }).then(canvas => {
      canvas.toBlob(blob => {
        var file = new File([blob], "invoice.png", { type: "image/png" });
        if(navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file] });
        else { var a = document.createElement('a'); a.download = 'invoice.png'; a.href = canvas.toDataURL(); a.click(); }
      });
    });
  }

  function uploadLogo(e) { var f = e.target.files[0]; if(!f) return; var r = new FileReader(); r.onload = function(evt) { db.settings.logo = evt.target.result; saveDb(); }; r.readAsDataURL(f); }
  function exportBackup() { var a = document.createElement('a'); a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db)); a.download = "backup.json"; a.click(); }
  function importBackup(e) { 
    const isEn = (currentLang === 'en');
    var f = e.target.files[0]; if(!f) return; var r = new FileReader(); r.onload = function(evt) { try { db = JSON.parse(evt.target.result); saveDb(); location.reload(); } catch(e) { alert(isEn ? 'Invalid backup file' : 'فایل نامعتبر است'); } }; r.readAsText(f); 
  }
  function resetAppData() { 
    const isEn = (currentLang === 'en');
    if(confirm(isEn ? 'Reset all application data?' : 'بازنشانی کامل اطلاعات؟')) { localStorage.removeItem('forooshyar_db_v17'); location.reload(); } 
  }

  function renderReports() {
    const dict = translations[currentLang] || translations.fa;
    const isEn = (currentLang === 'en');
    var unitStr = dict['unit_currency'] || 'تومان';

    var ts = (db.sales||[]).reduce((a,b)=>a+Number(b.subtotal||b.total||0),0);
    var tp = (db.sales||[]).reduce((a,b)=>a+Number(b.profit||0),0);
    var te = (db.expenses||[]).reduce((a,b)=>a+Number(b.amount||0),0);

    document.getElementById('reports-detail').innerHTML = 
      '<div class="list-row"><span>'+(isEn?'Total Sales:':'فروش کل:')+'</span><b>'+fmt(ts)+' '+unitStr+'</b></div>' +
      '<div class="list-row"><span>'+(isEn?'Gross Profit:':'سود ناخالص:')+'</span><b style="color:var(--success);">'+fmt(tp)+' '+unitStr+'</b></div>' +
      '<div class="list-row"><span>'+(isEn?'Total Expenses:':'مجموع هزینه‌ها:')+'</span><b style="color:var(--danger);">'+fmt(te)+' '+unitStr+'</b></div>';

    var maxVal = Math.max(ts, tp, te, 1);
    var pSales = Math.min(100, Math.round((ts / maxVal) * 100));
    var pProfit = Math.min(100, Math.round((tp / maxVal) * 100));
    var pExp = Math.min(100, Math.round((te / maxVal) * 100));

    var chartHtml = 
      '<div class="chart-bar-wrap">' +
        '<div class="chart-label-row"><span>'+(isEn?'Total Sales':'فروش کل')+'</span><span>'+fmt(ts)+' '+unitStr+'</span></div>' +
        '<div class="chart-bar-bg"><div class="chart-bar-fill" style="width:'+pSales+'%; background:var(--success);"></div></div>' +
      '</div>' +
      '<div class="chart-bar-wrap">' +
        '<div class="chart-label-row"><span>'+(isEn?'Gross Profit':'سود ناخالص')+'</span><span>'+fmt(tp)+' '+unitStr+'</span></div>' +
        '<div class="chart-bar-bg"><div class="chart-bar-fill" style="width:'+pProfit+'%; background:var(--info);"></div></div>' +
      '</div>' +
      '<div class="chart-bar-wrap">' +
        '<div class="chart-label-row"><span>'+(isEn?'Expenses':'هزینه‌ها')+'</span><span>'+fmt(te)+' '+unitStr+'</span></div>' +
        '<div class="chart-bar-bg"><div class="chart-bar-fill" style="width:'+pExp+'%; background:var(--danger);"></div></div>' +
      '</div>';

    var chartElem = document.getElementById('financial-chart-view');
    if(chartElem) chartElem.innerHTML = chartHtml;
  }

  function renderCalendarGrid() {
    if(currentLang === 'en') {
      document.getElementById('cal-month-title').innerText = monthNamesEn[currentCalGregorian.gMonth - 1] + ' ' + currentCalGregorian.gYear;
      var daysHead = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      var headHtml = '';
      daysHead.forEach(d => headHtml += '<div class="calendar-day-head">'+d+'</div>');
      document.getElementById('calendar-week-heads').innerHTML = headHtml;

      var totalDays = GregorianHelper.monthLength(currentCalGregorian.gYear, currentCalGregorian.gMonth);
      var firstDayIndex = new Date(currentCalGregorian.gYear, currentCalGregorian.gMonth - 1, 1).getDay();
      var html = '';
      for(var i=0; i<firstDayIndex; i++) { html += '<div></div>'; }
      for(var d=1; d<=totalDays; d++) {
        html += '<div class="calendar-day" onclick="selectCalendarDay(\''+currentCalGregorian.gYear+'/'+pad2(currentCalGregorian.gMonth)+'/'+pad2(d)+'\')">'+d+'</div>';
      }
      document.getElementById('calendar-days-grid').innerHTML = html;
    } else {
      document.getElementById('cal-month-title').innerText = monthNamesList[currentCalJalaali.jMonth - 1] + ' ' + currentCalJalaali.jYear;
      var daysHeadFa = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
      var headHtml = '';
      daysHeadFa.forEach(d => headHtml += '<div class="calendar-day-head">'+d+'</div>');
      document.getElementById('calendar-week-heads').innerHTML = headHtml;

      var totalDays = JalaaliHelper.toJalaali ? JalaaliHelper.monthLength(currentCalJalaali.jYear, currentCalJalaali.jMonth) : 30;
      var html = '';
      for(var d=1; d<=totalDays; d++) {
        html += '<div class="calendar-day" onclick="selectCalendarDay(\''+currentCalJalaali.jYear+'/'+pad2(currentCalJalaali.jMonth)+'/'+pad2(d)+'\')">'+d+'</div>';
      }
      document.getElementById('calendar-days-grid').innerHTML = html;
    }
  }

  function changeCalMonth(dir) {
    if(currentLang === 'en') {
      currentCalGregorian.gMonth += dir;
      if(currentCalGregorian.gMonth > 12) { currentCalGregorian.gMonth = 1; currentCalGregorian.gYear++; }
      else if(currentCalGregorian.gMonth < 1) { currentCalGregorian.gMonth = 12; currentCalGregorian.gYear--; }
    } else {
      currentCalJalaali.jMonth += dir;
      if(currentCalJalaali.jMonth > 12) { currentCalJalaali.jMonth = 1; currentCalJalaali.jYear--; }
      else if(currentCalJalaali.jMonth < 1) { currentCalJalaali.jMonth = 12; currentCalJalaali.jYear--; }
    }
    renderCalendarGrid();
  }

  function selectCalendarDay(dateStr) {
    const isEn = (currentLang === 'en');
    const dict = translations[currentLang] || translations.fa;
    var unitStr = dict['unit_currency'] || 'تومان';
    selectedCalDateStr = dateStr;
    document.getElementById('cal-day-details').style.display = 'block';
    document.getElementById('cal-selected-date-title').innerText = (isEn ? 'Daily Report: ' : 'گزارش روز: ') + selectedCalDateStr;
    var html = '', ds = (db.sales||[]).filter(s => s.date === selectedCalDateStr);
    ds.forEach(s => html += '<details class="cal-accordion"><summary>'+(isEn?'Sale - ':'فروش - ')+s.customer+' ('+fmt(s.subtotal)+' '+unitStr+')</summary></details>');
    document.getElementById('cal-accordion-list').innerHTML = html || ('<div style="font-size:0.8rem; color:#888;">'+(isEn?'No invoices found':'فاکتوری یافت نشد.')+'</div>');
  }

window.addEventListener('DOMContentLoaded', function() {
    checkAppVersion();
    renderAll();
  });
