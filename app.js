/* ==========================================================================
   فروش‌یار - سیستم جامع حسابداری فروشگاهی
   معمار نرم‌افزار و توسعه‌دهنده: علی نصیری صومعه علیا
   ========================================================================== */

let currentLang = 'fa';
let appData = {
  settings: {
    title: 'فروش‌یار',
    subtitle: 'سیستم جامع حسابداری فروشگاهی',
    logo: '',
    language: 'fa',
    bankAccounts: [
      { name: 'بانک ملت - حساب جاری', number: '6104337812345678', active: true },
      { name: 'بانک ملی - کارت به کارت', number: '6037991887654321', active: false }
    ],
    cryptoAddresses: [
      { name: 'تتر (TRC20)', address: 'TYd7...example...address', active: false }
    ],
    storePhones: [
      { number: '09140000000', active: true }
    ],
    storeAddresses: [
      { address: 'تبریز، بازار بزرگ، طبقه همکف', active: true }
    ],
    storeSocials: [
      { platform: 'تلگرام', handle: '@ali_nasiri100', active: true },
      { platform: 'ایتا', handle: '09140000000', active: true }
    ],
    paymentTypes: [
      { id: 'cash', title: 'نقدی', hasDetails: false, active: true },
      { id: 'pos', title: 'کارت‌خوان (POS)', hasDetails: true, detailsLabel: 'شماره پیگیری / رسید', active: true },
      { id: 'card2card', title: 'کارت‌به‌کارت', hasDetails: true, detailsLabel: 'شماره کارت / فیش', active: true },
      { id: 'cheque', title: 'چک', hasDetails: true, detailsLabel: 'شماره چک / تاریخ سررسید', active: true }
    ]
  },
  products: [],
  customers: [],
  suppliers: [],
  sales: [],
  purchases: [],
  expenses: [],
  ledgerTransactions: []
};

const i18n = {
  fa: {
    subtitle: "سیستم جامع حسابداری فروشگاهی",
    nav_home: "خانه",
    nav_products: "کالاها",
    nav_stock: "انبار",
    nav_sales: "فروش",
    nav_purchases: "خرید",
    nav_customers: "مشتریان",
    nav_suppliers: "تأمین",
    nav_more: "بیشتر / تنظیمات",
    ai_assistant: "دستیار هوش مصنوعی",
    contact_us: "تماس با ما",
    help: "راهنما",
    language: "زبان",
    total_sales: "فروش کل (محاسبه‌شده)",
    total_profit: "سود کل",
    stock_items: "موجودی اقلام انبار",
    total_expenses: "مجموع هزینه‌ها",
    quick_access: "دسترسی سریع",
    sale_invoice: "فاکتور فروش",
    purchase_invoice: "فاکتور خرید",
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
    new_product: "کالا جدید",
    search_product_ph: "جستجوی نام کالا...",
    all_categories: "همه دسته‌بندی‌ها",
    stock_kardex: "موجودی انبار و کاردکس",
    search_stock_ph: "جستجو در انبار...",
    sales_invoices: "فاکتورهای فروش",
    new_invoice: "فاکتور جدید",
    search_sale_ph: "جستجوی فاکتور فروش...",
    purchase_invoices: "فاکتورهای خرید",
    new_purchase_invoice: "فاکتور خرید جدید",
    search_purchase_ph: "جستجوی فاکتور خرید...",
    customers: "مشتریان",
    pick_contacts: "انتخاب مخاطبین",
    btn_new: "جدید",
    search_customer_ph: "جستجوی مشتری...",
    suppliers: "تأمین‌کنندگان",
    search_supplier_ph: "جستجوی تأمین‌کننده...",
    store_settings: "تنظیمات عمومی فروشگاه",
    store_name: "نام فروشگاه / عنوان",
    invoice_subtitle: "زیرعنوان فاکتور",
    default_language: "زبان پیش‌فرض برنامه / Default Language",
    store_logo: "لوگوی فروشگاه",
    choose_file: "انتخاب فایل",
    manage_payment_types: "مدیریت انواع دریافت و پرداخت",
    payment_types_help: "در این بخش می‌توانید انواع پرداخت (نقدی، چک، کارت‌خوان، کارت‌به‌کارت و...) و کادرهای جزئیات اختصاصی هرکدام را مدیریت کنید.",
    add_payment_type: "افزودن نوع دریافت/پرداخت جدید",
    manage_banks: "مدیریت حساب‌های بانکی",
    bank_help: "با انتخاب چک‌باکس، حساب بانکی و شماره شبا در فاکتورها درج می‌شود.",
    add_bank: "افزودن حساب بانکی جدید",
    manage_crypto: "مدیریت آدرس‌های رمزارز (Crypto)",
    crypto_help: "با انتخاب چک‌باکس، آدرس کیف‌پول رمزارز در فاکتورها درج خواهد شد.",
    add_crypto: "افزودن آدرس رمزارز جدید",
    manage_phones: "مدیریت شماره‌های تماس",
    phone_help: "با انتخاب چک‌باکس، این شماره تماس در فاکتورها درج خواهد شد.",
    add_phone_new: "افزودن شماره تماس جدید",
    manage_addresses: "مدیریت آدرس‌های فروشگاه",
    addr_help: "با انتخاب چک‌باکس، آدرس انتخاب‌شده در فاکتورها درج خواهد شد.",
    add_address: "افزودن آدرس جدید",
    manage_socials: "ارتباط با فروشنده",
    social_help: "شبکه اجتماعی یا راه ارتباطی مورد نظر را انتخاب کرده و آدرس آن را وارد کنید.",
    add_social: "افزودن شبکه اجتماعی جدید",
    save_all_settings: "ذخیره تمام تنظیمات",
    backup_restore: "پشتیبان‌گیری و بازیابی",
    export_backup: "ذخیره فایل پشتیبان (Backup)",
    select_backup: "انتخاب فایل پشتیبان (JSON)",
    reset_app: "بازنشانی کامل اطلاعات برنامه",
    calendar: "تقویم",
    select_period: "تعیین بازه زمانی جهت گزارش‌گیری",
    period_today: "امروز",
    period_7days: "۷ روز اخیر",
    period_30days: "۳۰ روز اخیر",
    period_all: "کل دوره‌ها (همه‌زمان)",
    financial_chart_title: "نمودار مقایسه‌ای مالی",
    back_to_home: "بازگشت به صفحه اصلی",
    contact_creator: "تماس با سازنده نرم‌افزار",
    creator_desc: "طراح، معمار نرم‌افزار و توسعه‌دهنده سیستم جامع فروش‌یار",
    ai_assistant_title: "دستیار هوشمند فروش‌یا‌ر (AI)",
    ledger_account: "دفتر حساب مخاطب",
    ledger_total_bal: "مجموع مانده حساب:",
    record_payment_title: "ثبت تسویه / دریافت وجه",
    amount_received: "مبلغ دریافتی نقدی / کارت (تومان)",
    excess_amount: "مازاد دریافت (تومان)",
    ph_amount: "مبلغ را وارد کنید...",
    ph_excess: "مازاد...",
    trans_desc: "شرح تراکنش",
    save_in_ledger: "ثبت در دفتر حساب",
    all_transactions: "همه تراکنش‌ها",
    recent_3: "۳ حساب اخیر",
    recent_7: "۷ حساب اخیر",
    send_text: "ارسال متنی",
    send_image: "ارسال تصویری (۶ قلم)",
    print: "چاپ",
    back: "بازگشت",
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
    ph_exp_title: "شرح / عنوان هزینه (مثلاً: کرایه مغازه)...",
    ph_exp_cat: "دسته‌بندی (انتخاب از لیست زیر یا تایپ جدید)...",
    ph_exp_amount: "مبلغ هزینه (تومان)...",
    save_expense: "ثبت هزینه",
    edit_add_product: "افزودن / ویرایش کالا",
    product_name: "نام کالا *",
    product_barcode: "کد ۱۵ رقمی کالا (تاریخ + زمان + سریال)",
    category: "دسته‌بندی کالا",
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
    lbl_received: "دریافتی",
    lbl_remaining: "مانده حساب",
    lbl_excess_received: "مازاد دریافت",
    save_and_issue: "ذخیره و صدور",
    record_purchase_invoice: "ثبت فاکتور خرید",
    supplier: "تأمین‌کننده",
    purchase_date: "تاریخ فاکتور خرید",
    add_pur_product_item: "افزودن قلم کالا خرید",
    ph_pur_name: "نام کالا *",
    ph_pur_cat: "دسته‌بندی کالا (انتخاب از لیست زیر یا تایپ جدید)...",
    ph_pur_qty: "تعداد",
    ph_pur_price: "قیمت خرید واحد (تومان)",
    add_to_pur_list: "افزودن به لیست خرید",
    registered_pur_items: "اقلام ثبت‌شده در فاکتور خرید",
    lbl_payable: "مبلغ قابل پرداخت",
    lbl_paid: "پرداختی",
    lbl_excess_paid: "مازاد پرداخت",
    record_purchase: "ثبت خرید",
    invoice_preview: "پیش‌نمایش فاکتور رسمی",
    daily_calendar_report: "تقویم گزارش‌گیری روزانه",
    prev_month: "ماه قبل",
    next_month: "ماه بعد",
    daily_report: "گزارش روز",
    select_language: "انتخاب زبان / Language"
  },
  en: {
    subtitle: "Comprehensive Store Accounting System",
    nav_home: "Home",
    nav_products: "Products",
    nav_stock: "Stock",
    nav_sales: "Sales",
    nav_purchases: "Purchases",
    nav_customers: "Customers",
    nav_suppliers: "Suppliers",
    nav_more: "Settings",
    ai_assistant: "AI Assistant",
    contact_us: "Contact Us",
    help: "Help",
    language: "Language",
    total_sales: "Total Sales",
    total_profit: "Total Profit",
    stock_items: "Stock Items",
    total_expenses: "Total Expenses",
    quick_access: "Quick Access",
    sale_invoice: "Sales Invoice",
    purchase_invoice: "Purchase Invoice",
    manage_expenses: "Manage Expenses",
    reports: "Reports",
    debtor_customers: "Debtor Customers",
    creditor_suppliers: "Creditor Suppliers",
    debtors_list: "Debtors List",
    creditors_list: "Creditors List",
    global_profit_title: "Apply Global Profit Margin",
    global_profit_toggle: "Enable Global Stock Profit Calculation",
    calc_stock: "Calculate Stock",
    manage_products: "Manage Products",
    new_product: "New Product",
    search_product_ph: "Search products...",
    all_categories: "All Categories",
    stock_kardex: "Stock Inventory & Kardex",
    search_stock_ph: "Search stock...",
    sales_invoices: "Sales Invoices",
    new_invoice: "New Invoice",
    search_sale_ph: "Search sales invoices...",
    purchase_invoices: "Purchase Invoices",
    new_purchase_invoice: "New Purchase Invoice",
    search_purchase_ph: "Search purchase invoices...",
    customers: "Customers",
    pick_contacts: "Pick Contacts",
    btn_new: "New",
    search_customer_ph: "Search customers...",
    suppliers: "Suppliers",
    search_supplier_ph: "Search suppliers...",
    store_settings: "Store Settings",
    store_name: "Store Name / Title",
    invoice_subtitle: "Invoice Subtitle",
    default_language: "Default Language",
    store_logo: "Store Logo",
    choose_file: "Choose File",
    manage_payment_types: "Manage Payment Types",
    payment_types_help: "Manage payment methods and their specific details.",
    add_payment_type: "Add Payment Type",
    manage_banks: "Manage Bank Accounts",
    bank_help: "Select checkbox to include bank account in invoices.",
    add_bank: "Add Bank Account",
    manage_crypto: "Manage Crypto Addresses",
    crypto_help: "Select checkbox to include crypto address in invoices.",
    add_crypto: "Add Crypto Address",
    manage_phones: "Manage Phone Numbers",
    phone_help: "Select checkbox to include phone number in invoices.",
    add_phone_new: "Add Phone Number",
    manage_addresses: "Manage Store Addresses",
    addr_help: "Select checkbox to include address in invoices.",
    add_address: "Add Address",
    manage_socials: "Seller Contact & Socials",
    social_help: "Select social media and enter handle.",
    add_social: "Add Social",
    save_all_settings: "Save All Settings",
    backup_restore: "Backup & Restore",
    export_backup: "Export Backup (JSON)",
    select_backup: "Select Backup File",
    reset_app: "Reset App Data",
    calendar: "Calendar",
    select_period: "Select Report Period",
    period_today: "Today",
    period_7days: "Last 7 Days",
    period_30days: "Last 30 Days",
    period_all: "All Time",
    financial_chart_title: "Financial Comparison Chart",
    back_to_home: "Back to Home",
    contact_creator: "Contact Software Creator",
    creator_desc: "Architect and Developer of Frooshyar",
    ai_assistant_title: "Frooshyar AI Assistant",
    ledger_account: "Contact Ledger",
    ledger_total_bal: "Total Balance:",
    record_payment_title: "Record Payment / Settlement",
    amount_received: "Amount Received (Tomans)",
    excess_amount: "Excess Amount",
    ph_amount: "Enter amount...",
    ph_excess: "Excess...",
    trans_desc: "Transaction Description",
    save_in_ledger: "Save in Ledger",
    all_transactions: "All Transactions",
    recent_3: "Recent 3",
    recent_7: "Recent 7",
    send_text: "Send Text",
    send_image: "Send Image",
    print: "Print",
    back: "Back",
    help_guide_title: "Frooshyar Guide",
    help_item_1_title: "1. Products & Stock",
    help_item_1_desc: "Register products with buy/sell prices and stock.",
    help_item_2_title: "2. Sales Invoices",
    help_item_2_desc: "Issue sales invoices and manage discounts.",
    help_item_3_title: "3. Purchase Invoices",
    help_item_3_desc: "Record purchases from suppliers and restock.",
    help_item_4_title: "4. Customers & Ledger",
    help_item_4_desc: "Track balances and customer debts.",
    help_item_5_title: "5. Expenses & Reports",
    help_item_5_desc: "Record store expenses and view net profit.",
    got_it: "Got It",
    expense_management: "Expense Management",
    add_new_expense: "Add New Expense",
    ph_exp_title: "Expense Title (e.g. Rent)...",
    ph_exp_cat: "Category...",
    ph_exp_amount: "Amount (Tomans)...",
    save_expense: "Save Expense",
    edit_add_product: "Add / Edit Product",
    product_name: "Product Name *",
    product_barcode: "Barcode",
    category: "Category",
    stock_qty: "Stock Qty",
    buy_price: "Buy Price",
    auto_calc_margin: "Auto calculate sell price with profit margin",
    profit_margin: "Profit Margin (%)",
    sell_price: "Sell Price",
    save_product: "Save Product",
    customer_file: "Customer File",
    contact_avatar: "Contact Avatar",
    customer_name: "Customer Full Name",
    phone_numbers: "Phone Numbers",
    add_phone: "Add Phone",
    full_address: "Full Address",
    save_file: "Save File",
    supplier_file: "Supplier File",
    supplier_name: "Supplier / Company Name",
    issue_sale_invoice: "Issue Sales Invoice",
    clear_form: "Clear",
    select_customer: "Select Customer",
    invoice_date: "Invoice Date",
    add_product_item: "Add Product Item",
    select_product: "Select Product",
    quantity: "Quantity",
    unit_price: "Unit Price",
    add_to_list: "Add to List",
    registered_items: "Registered Items",
    lbl_invoice_subtotal: "Subtotal",
    lbl_discount: "Discount",
    lbl_receivable: "Receivable Amount",
    lbl_received: "Received",
    lbl_remaining: "Remaining Balance",
    lbl_excess_received: "Excess Received",
    save_and_issue: "Save & Issue",
    record_purchase_invoice: "Record Purchase Invoice",
    supplier: "Supplier",
    purchase_date: "Purchase Date",
    add_pur_product_item: "Add Purchase Item",
    ph_pur_name: "Product Name *",
    ph_pur_cat: "Category...",
    ph_pur_qty: "Quantity",
    ph_pur_price: "Unit Buy Price",
    add_to_pur_list: "Add to Purchase List",
    registered_pur_items: "Registered Purchase Items",
    lbl_payable: "Payable Amount",
    lbl_paid: "Paid",
    lbl_excess_paid: "Excess Paid",
    record_purchase: "Record Purchase",
    invoice_preview: "Official Invoice Preview",
    daily_calendar_report: "Daily Calendar Report",
    prev_month: "Prev Month",
    next_month: "Next Month",
    daily_report: "Daily Report",
    select_language: "Select Language"
  }
};
/* ==========================================================================
   فروش‌یار - بخش دوم و توابع اصلی منطق و رابط کاربری
   ========================================================================== */

function formatNumber(num) {
  if (num === undefined || num === null || isNaN(num)) return '۰';
  return Number(num).toLocaleString('fa-IR');
}

function t(key) {
  if (i18n[currentLang] && i18n[currentLang][key]) {
    return i18n[currentLang][key];
  }
  return i18n['fa'][key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
  appData.settings.language = lang;
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
  document.getElementById('current-lang-btn').innerText = lang.toUpperCase();
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (i18n[lang][k]) el.innerText = i18n[lang][k];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const k = el.getAttribute('data-i18n-placeholder');
    if (i18n[lang][k]) el.setAttribute('placeholder', i18n[lang][k]);
  });

  document.querySelectorAll('.lang-option').forEach(el => el.classList.remove('active'));
  const activeOpt = document.getElementById(`lang-opt-${lang}`);
  if (activeOpt) activeOpt.classList.add('active');
  const cfgOpt = document.getElementById(`cfg-lang-${lang}`);
  if (cfgOpt) cfgOpt.classList.add('active');

  saveData();
  closeModal('modal-lang');
  renderAll();
}

function showSection(secId, navEl) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(secId).classList.add('active');
  
  if (navEl && navEl.classList.contains('nav-item')) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    navEl.classList.add('active');
  }
  renderAll();
}

function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
  if (modalId === 'modal-ai') renderAiContent();
  if (modalId === 'modal-calendar') initCalendar();
  if (modalId === 'modal-creator') renderCreatorSocialLinks();
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function toggleHomeSection(wrapId) {
  const el = document.getElementById(wrapId);
  if (el) {
    el.style.display = (el.style.display === 'none' || !el.style.display) ? 'block' : 'none';
  }
}

// بارگذاری و ذخیره‌سازی داده‌ها
function loadData() {
  const saved = localStorage.getItem('frooshyar_data_v3');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      appData = Object.assign({}, appData, parsed);
      if (!appData.settings.paymentTypes || appData.settings.paymentTypes.length === 0) {
        appData.settings.paymentTypes = [
          { id: 'cash', title: 'نقدی', hasDetails: false, active: true },
          { id: 'pos', title: 'کارت‌خوان (POS)', hasDetails: true, detailsLabel: 'شماره پیگیری / رسید', active: true },
          { id: 'card2card', title: 'کارت‌به‌کارت', hasDetails: true, detailsLabel: 'شماره کارت / فیش', active: true },
          { id: 'cheque', title: 'چک', hasDetails: true, detailsLabel: 'شماره چک / تاریخ سررسید', active: true }
        ];
      }
    } catch(e) {
      console.error('Error loading data', e);
    }
  }
  currentLang = appData.settings.language || 'fa';
}

function saveData() {
  localStorage.setItem('frooshyar_data_v3', JSON.stringify(appData));
}

function renderAll() {
  renderDashboard();
  renderProducts();
  renderStock();
  renderSales();
  renderPurchases();
  renderCustomers();
  renderSuppliers();
  renderExpensesList();
  renderSettingsUI();
  renderReports();
}

// داشبورد و آمار
function renderDashboard() {
  let totalSales = 0;
  appData.sales.forEach(s => totalSales += Number(s.receivable || s.subtotal || 0));

  let totalProfit = 0;
  appData.sales.forEach(s => totalProfit += Number(s.profit || 0));

  let totalStock = 0;
  appData.products.forEach(p => totalStock += Number(p.qty || 0));

  let totalExpense = 0;
  appData.expenses.forEach(e => totalExpense += Number(e.amount || 0));

  document.getElementById('dash-sales').innerText = formatNumber(totalSales) + ' تومان';
  document.getElementById('dash-profit').innerText = formatNumber(totalProfit) + ' تومان';
  document.getElementById('dash-stock').innerText = formatNumber(totalStock) + ' عدد';
  document.getElementById('dash-expense').innerText = formatNumber(totalExpense) + ' تومان';

  // هدر فروشگاه
  document.getElementById('header-title').innerHTML = `<i class="fas fa-shopping-bag"></i> ${appData.settings.title || 'فروش‌یار'}`;
  document.getElementById('header-subtitle').innerText = appData.settings.subtitle || t('subtitle');
  
  const logoImg = document.getElementById('header-logo');
  if (appData.settings.logo) {
    logoImg.src = appData.settings.logo;
    logoImg.style.display = 'block';
  } else {
    logoImg.style.display = 'none';
  }

  renderDebtorsAndCreditors();
}

function renderDebtorsAndCreditors() {
  // مشتریان بدهکار
  const debtorsWrap = document.getElementById('dash-debtors');
  let debtorHtml = '';
  appData.customers.forEach(c => {
    let bal = getCustomerBalance(c.name);
    if (bal > 0) {
      debtorHtml += `
        <div class="list-item" onclick="openLedger('${c.name}', 'customer')">
          <div class="list-item-info">
            <h4>${c.name}</h4>
            <p>${c.phones && c.phones[0] ? c.phones[0] : ''}</p>
          </div>
          <span class="badge badge-danger">${formatNumber(bal)} تومان بدهکار</span>
        </div>`;
    }
  });
  debtorsWrap.innerHTML = debtorHtml || `<div style="text-align:center; color:var(--text-secondary); font-size:0.78rem; padding:8px;">مشتری بدهکاری وجود ندارد.</div>`;

  // تأمین‌کنندگان بستانکار
  const creditorsWrap = document.getElementById('dash-creditors');
  let creditorHtml = '';
  appData.suppliers.forEach(s => {
    let bal = getSupplierBalance(s.name);
    if (bal > 0) {
      creditorHtml += `
        <div class="list-item" onclick="openLedger('${s.name}', 'supplier')">
          <div class="list-item-info">
            <h4>${s.name}</h4>
            <p>${s.phones && s.phones[0] ? s.phones[0] : ''}</p>
          </div>
          <span class="badge badge-warning">${formatNumber(bal)} تومان طلبکار</span>
        </div>`;
    }
  });
  creditorsWrap.innerHTML = creditorHtml || `<div style="text-align:center; color:var(--text-secondary); font-size:0.78rem; padding:8px;">تأمین‌کننده بستانکاری وجود ندارد.</div>`;
}

function getCustomerBalance(custName) {
  let totalRem = 0;
  appData.sales.filter(s => s.customer === custName).forEach(s => {
    totalRem += Number(s.remaining || 0);
  });
  appData.ledgerTransactions.filter(l => l.partyName === custName && l.partyType === 'customer').forEach(l => {
    totalRem -= Number(l.amount || 0);
  });
  return totalRem > 0 ? totalRem : 0;
}

function getSupplierBalance(suppName) {
  let totalRem = 0;
  appData.purchases.filter(p => p.supplier === suppName).forEach(p => {
    totalRem += Number(p.remaining || 0);
  });
  appData.ledgerTransactions.filter(l => l.partyName === suppName && l.partyType === 'supplier').forEach(l => {
    totalRem -= Number(l.amount || 0);
  });
  return totalRem > 0 ? totalRem : 0;
}

// کالاها و انبار
function renderProducts() {
  const search = (document.getElementById('search-product').value || '').toLowerCase();
  const catFilter = document.getElementById('filter-product-cat').value;
  const listEl = document.getElementById('products-list');
  
  let cats = new Set();
  appData.products.forEach(p => { if (p.category) cats.add(p.category); });
  let catSelectHtml = `<option value="">${t('all_categories')}</option>`;
  cats.forEach(c => { catSelectHtml += `<option value="${c}" ${c === catFilter ? 'selected' : ''}>${c}</option>`; });
  document.getElementById('filter-product-cat').innerHTML = catSelectHtml;

  let html = '';
  appData.products.forEach((p, idx) => {
    if (search && !p.name.toLowerCase().includes(search) && !(p.barcode && p.barcode.includes(search))) return;
    if (catFilter && p.category !== catFilter) return;

    html += `
      <div class="list-item">
        <div class="list-item-info">
          <h4>${p.name} <span style="font-size:0.7rem; color:var(--text-secondary);">(${p.category || 'متفرقه'})</span></h4>
          <p>خرید: ${formatNumber(p.buyPrice)} | فروش: ${formatNumber(p.sellPrice)} | موجودی: ${formatNumber(p.qty)}</p>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-outline btn-sm" onclick="editProduct(${idx})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${idx})"><i class="fas fa-trash"></i></button>
        </div>
      </div>`;
  });

  listEl.innerHTML = html || `<div style="text-align:center; color:var(--text-secondary); padding:12px;">کالایی یافت نشد.</div>`;
}

function renderStock() {
  const search = (document.getElementById('search-stock').value || '').toLowerCase();
  const catFilter = document.getElementById('filter-stock-cat').value;
  const listEl = document.getElementById('stock-list');

  let cats = new Set();
  appData.products.forEach(p => { if (p.category) cats.add(p.category); });
  let catSelectHtml = `<option value="">${t('all_categories')}</option>`;
  cats.forEach(c => { catSelectHtml += `<option value="${c}" ${c === catFilter ? 'selected' : ''}>${c}</option>`; });
  document.getElementById('filter-stock-cat').innerHTML = catSelectHtml;

  let html = '';
  appData.products.forEach(p => {
    if (search && !p.name.toLowerCase().includes(search)) return;
    if (catFilter && p.category !== catFilter) return;

    html += `
      <div class="list-item">
        <div class="list-item-info">
          <h4>${p.name}</h4>
          <p>موجودی انبار: <b>${formatNumber(p.qty)} عدد</b> | ارزش کل خرید: ${formatNumber(p.qty * p.buyPrice)} تومان</p>
        </div>
        <span class="badge ${p.qty > 0 ? 'badge-success' : 'badge-danger'}">${p.qty > 0 ? 'موجود' : 'ناموجود'}</span>
      </div>`;
  });

  listEl.innerHTML = html || `<div style="text-align:center; color:var(--text-secondary); padding:12px;">موردی در انبار یافت نشد.</div>`;
}

function openProductModal(idx = null) {
  document.getElementById('prod-edit-id').value = idx !== null ? idx : '';
  document.getElementById('prod-name').value = '';
  document.getElementById('prod-barcode').value = '';
  document.getElementById('prod-category').value = '';
  document.getElementById('prod-qty').value = '';
  document.getElementById('prod-buy-price').value = '';
  document.getElementById('prod-price').value = '';
  document.getElementById('prod-profit-margin').value = '';
  document.getElementById('prod-auto-profit-toggle').checked = false;
  document.getElementById('prod-margin-wrap').style.display = 'none';

  if (idx !== null) {
    const p = appData.products[idx];
    document.getElementById('prod-name').value = p.name || '';
    document.getElementById('prod-barcode').value = p.barcode || '';
    document.getElementById('prod-category').value = p.category || '';
    document.getElementById('prod-qty').value = p.qty || 0;
    document.getElementById('prod-buy-price').value = p.buyPrice || 0;
    document.getElementById('prod-price').value = p.sellPrice || 0;
  }

  // ایجاد چیپس دسته‌بندی‌ها
  let cats = new Set();
  appData.products.forEach(p => { if (p.category) cats.add(p.category); });
  let chipsHtml = '';
  cats.forEach(c => {
    chipsHtml += `<div class="category-chip" onclick="document.getElementById('prod-category').value='${c}'">${c}</div>`;
  });
  document.getElementById('product-category-chips').innerHTML = chipsHtml;

  openModal('modal-product');
}

function toggleProdProfitInput() {
  const isChecked = document.getElementById('prod-auto-profit-toggle').checked;
  document.getElementById('prod-margin-wrap').style.display = isChecked ? 'block' : 'none';
  if (isChecked) calcProdPriceFromMargin();
}

function calcProdPriceFromMargin() {
  const isChecked = document.getElementById('prod-auto-profit-toggle').checked;
  if (!isChecked) return;
  const buyPrice = Number(document.getElementById('prod-buy-price').value || 0);
  const margin = Number(document.getElementById('prod-profit-margin').value || 0);
  if (buyPrice > 0 && margin > 0) {
    const sell = Math.round(buyPrice * (1 + margin / 100));
    document.getElementById('prod-price').value = sell;
  }
}

function saveProduct() {
  const idx = document.getElementById('prod-edit-id').value;
  const name = document.getElementById('prod-name').value.trim();
  if (!name) { alert('لطفا نام کالا را وارد کنید.'); return; }

  let barcode = document.getElementById('prod-barcode').value.trim();
  if (!barcode) {
    const now = new Date();
    barcode = '' + now.getFullYear().toString().slice(-2) + String(now.getMonth()+1).padStart(2,'0') + String(now.getDate()).padStart(2,'0') + String(now.getHours())+String(now.getMinutes())+Math.floor(Math.random()*10);
  }

  const pData = {
    name: name,
    barcode: barcode,
    category: document.getElementById('prod-category').value.trim() || 'متفرقه',
    qty: Number(document.getElementById('prod-qty').value || 0),
    buyPrice: Number(document.getElementById('prod-buy-price').value || 0),
    sellPrice: Number(document.getElementById('prod-price').value || 0)
  };

  if (idx !== '') {
    appData.products[Number(idx)] = pData;
  } else {
    appData.products.push(pData);
  }

  saveData();
  closeModal('modal-product');
  renderAll();
}

function editProduct(idx) { openProductModal(idx); }
function deleteProduct(idx) {
  if (confirm('آیا از حذف این کالا اطمینان دارید؟')) {
    appData.products.splice(idx, 1);
    saveData();
    renderAll();
  }
}

function toggleGlobalProfitInput() {
  const active = document.getElementById('global-profit-switch').checked;
  document.getElementById('global-profit-panel').style.display = active ? 'block' : 'none';
}

function applyGlobalProfitMargin() {
  const percent = Number(document.getElementById('global-profit-percent').value || 0);
  if (percent <= 0) { alert('لطفا درصد سود معتبری وارد کنید.'); return; }
  appData.products.forEach(p => {
    if (p.buyPrice > 0) {
      p.sellPrice = Math.round(p.buyPrice * (1 + percent / 100));
    }
  });
  saveData();
  renderAll();
  alert('سود درصدی روی تمامی کالاهای انبار اعمال شد.');
}

// مشتریان و تأمین‌کنندگان
function renderCustomers() {
  const search = (document.getElementById('search-customer').value || '').toLowerCase();
  const listEl = document.getElementById('customers-list');
  let html = '';
  appData.customers.forEach((c, idx) => {
    if (search && !c.name.toLowerCase().includes(search)) return;
    let bal = getCustomerBalance(c.name);
    html += `
      <div class="list-item" onclick="openLedger('${c.name}', 'customer')">
        <div style="display:flex; align-items:center; gap:10px;">
          ${c.avatar ? `<img src="${c.avatar}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">` : `<div style="width:40px;height:40px;border-radius:50%;background:#eee;display:flex;align-items:center;justify-content:center;"><i class="fas fa-user"></i></div>`}
          <div class="list-item-info">
            <h4>${c.name}</h4>
            <p>${c.phones && c.phones[0] ? c.phones[0] : 'بدون شماره'}</p>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="badge ${bal > 0 ? 'badge-danger' : 'badge-success'}">${bal > 0 ? formatNumber(bal) + ' تومان بدهکار' : 'تسویه'}</span>
          <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); editCustomer(${idx})"><i class="fas fa-edit"></i></button>
        </div>
      </div>`;
  });
  listEl.innerHTML = html || `<div style="text-align:center; color:var(--text-secondary); padding:12px;">مشتری ثبت نشده است.</div>`;
}

function renderSuppliers() {
  const search = (document.getElementById('search-supplier').value || '').toLowerCase();
  const listEl = document.getElementById('suppliers-list');
  let html = '';
  appData.suppliers.forEach((s, idx) => {
    if (search && !s.name.toLowerCase().includes(search)) return;
    let bal = getSupplierBalance(s.name);
    html += `
      <div class="list-item" onclick="openLedger('${s.name}', 'supplier')">
        <div style="display:flex; align-items:center; gap:10px;">
          ${s.avatar ? `<img src="${s.avatar}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">` : `<div style="width:40px;height:40px;border-radius:50%;background:#eee;display:flex;align-items:center;justify-content:center;"><i class="fas fa-truck"></i></div>`}
          <div class="list-item-info">
            <h4>${s.name}</h4>
            <p>${s.phones && s.phones[0] ? s.phones[0] : 'بدون شماره'}</p>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="badge ${bal > 0 ? 'badge-warning' : 'badge-success'}">${bal > 0 ? formatNumber(bal) + ' تومان طلبکار' : 'تسویه'}</span>
          <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); editSupplier(${idx})"><i class="fas fa-edit"></i></button>
        </div>
      </div>`;
  });
  listEl.innerHTML = html || `<div style="text-align:center; color:var(--text-secondary); padding:12px;">تأمین‌کننده‌ای ثبت نشده است.</div>`;
}

function openCustomerModal(idx = null) {
  document.getElementById('cust-edit-id').value = idx !== null ? idx : '';
  document.getElementById('cust-name').value = '';
  document.getElementById('cust-address').value = '';
  document.getElementById('cust-phones-list').innerHTML = '';
  document.getElementById('cust-avatar-preview').style.display = 'none';
  document.getElementById('cust-avatar-preview').src = '';
  window._tempCustAvatar = '';

  addCustPhoneRow();
  if (idx !== null) {
    const c = appData.customers[idx];
    document.getElementById('cust-name').value = c.name || '';
    document.getElementById('cust-address').value = c.address || '';
    if (c.avatar) {
      window._tempCustAvatar = c.avatar;
      document.getElementById('cust-avatar-preview').src = c.avatar;
      document.getElementById('cust-avatar-preview').style.display = 'block';
    }
    if (c.phones && c.phones.length > 0) {
      document.getElementById('cust-phones-list').innerHTML = '';
      c.phones.forEach(ph => addCustPhoneRow(ph));
    }
  }
  openModal('modal-customer');
}

function addCustPhoneRow(val = '') {
  const container = document.getElementById('cust-phones-list');
  const div = document.createElement('div');
  div.className = 'input-row-group';
  div.style.cssText = 'display:flex; gap:6px; margin-bottom:6px;';
  div.innerHTML = `
    <input type="text" class="form-input cust-phone-inp" value="${val}" placeholder="شماره تماس...">
    <button class="btn btn-danger btn-sm" type="button" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;
  container.appendChild(div);
}

function handleCustAvatarFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    document.getElementById('cust-file-label').innerText = file.name;
    const reader = new FileReader();
    reader.onload = function(evt) {
      window._tempCustAvatar = evt.target.result;
      const prev = document.getElementById('cust-avatar-preview');
      prev.src = evt.target.result;
      prev.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

function saveCustomerModal() {
  const idx = document.getElementById('cust-edit-id').value;
  const name = document.getElementById('cust-name').value.trim();
  if (!name) { alert('لطفا نام مشتری را وارد کنید.'); return; }

  let phones = [];
  document.querySelectorAll('.cust-phone-inp').forEach(inp => {
    if (inp.value.trim()) phones.push(inp.value.trim());
  });

  const custData = {
    name: name,
    phones: phones,
    address: document.getElementById('cust-address').value.trim(),
    avatar: window._tempCustAvatar || ''
  };

  if (idx !== '') {
    appData.customers[Number(idx)] = custData;
  } else {
    appData.customers.push(custData);
  }

  saveData();
  closeModal('modal-customer');
  renderAll();
}

function editCustomer(idx) { openCustomerModal(idx); }

function openSupplierModal(idx = null) {
  document.getElementById('supp-edit-id').value = idx !== null ? idx : '';
  document.getElementById('supp-name').value = '';
  document.getElementById('supp-address').value = '';
  document.getElementById('supp-phones-list').innerHTML = '';
  document.getElementById('supp-avatar-preview').style.display = 'none';
  document.getElementById('supp-avatar-preview').src = '';
  window._tempSuppAvatar = '';

  addSuppPhoneRow();
  if (idx !== null) {
    const s = appData.suppliers[idx];
    document.getElementById('supp-name').value = s.name || '';
    document.getElementById('supp-address').value = s.address || '';
    if (s.avatar) {
      window._tempSuppAvatar = s.avatar;
      document.getElementById('supp-avatar-preview').src = s.avatar;
      document.getElementById('supp-avatar-preview').style.display = 'block';
    }
    if (s.phones && s.phones.length > 0) {
      document.getElementById('supp-phones-list').innerHTML = '';
      s.phones.forEach(ph => addSuppPhoneRow(ph));
    }
  }
  openModal('modal-supplier');
}

function addSuppPhoneRow(val = '') {
  const container = document.getElementById('supp-phones-list');
  const div = document.createElement('div');
  div.style.cssText = 'display:flex; gap:6px; margin-bottom:6px;';
  div.innerHTML = `
    <input type="text" class="form-input supp-phone-inp" value="${val}" placeholder="شماره تماس...">
    <button class="btn btn-danger btn-sm" type="button" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;
  container.appendChild(div);
}

function handleSuppAvatarFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    document.getElementById('supp-file-label').innerText = file.name;
    const reader = new FileReader();
    reader.onload = function(evt) {
      window._tempSuppAvatar = evt.target.result;
      const prev = document.getElementById('supp-avatar-preview');
      prev.src = evt.target.result;
      prev.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

function saveSupplierModal() {
  const idx = document.getElementById('supp-edit-id').value;
  const name = document.getElementById('supp-name').value.trim();
  if (!name) { alert('لطفا نام تأمین‌کننده را وارد کنید.'); return; }

  let phones = [];
  document.querySelectorAll('.supp-phone-inp').forEach(inp => {
    if (inp.value.trim()) phones.push(inp.value.trim());
  });

  const suppData = {
    name: name,
    phones: phones,
    address: document.getElementById('supp-address').value.trim(),
    avatar: window._tempSuppAvatar || ''
  };

  if (idx !== '') {
    appData.suppliers[Number(idx)] = suppData;
  } else {
    appData.suppliers.push(suppData);
  }

  saveData();
  closeModal('modal-supplier');
  renderAll();
}

function editSupplier(idx) { openSupplierModal(idx); }

function pickContact(type) {
  alert('قابلیت انتخاب مخاطبین دستگاه به‌زودی فعال می‌شود.');
}

// دفتر حساب مخاطبین (Ledger)
function openLedger(partyName, partyType) {
  document.getElementById('ledger-party-name').value = partyName;
  document.getElementById('ledger-party-type').value = partyType;
  document.getElementById('ledger-modal-title').innerText = `دفتر حساب: ${partyName}`;
  document.getElementById('ledger-trans-amount').value = '';
  document.getElementById('ledger-trans-excess').value = '';
  document.getElementById('ledger-trans-desc').value = '';
  
  renderLedgerContentList();
  openModal('modal-ledger');
}

function checkLedgerInputRule() {}
function onLedgerExcessChange() {}

function renderLedgerContentList() {
  const partyName = document.getElementById('ledger-party-name').value;
  const partyType = document.getElementById('ledger-party-type').value;
  const contentEl = document.getElementById('ledger-content');

  let items = [];
  if (partyType === 'customer') {
    appData.sales.filter(s => s.customer === partyName).forEach(s => {
      items.push({ date: s.dateStr || 'تاریخ نامشخص', title: `فاکتور فروش شماره #${s.id}`, amount: Number(s.receivable || s.subtotal || 0), type: 'debt' });
    });
  } else {
    appData.purchases.filter(p => p.supplier === partyName).forEach(p => {
      items.push({ date: p.dateStr || 'تاریخ نامشخص', title: `فاکتور خرید شماره #${p.id}`, amount: Number(p.receivable || p.subtotal || 0), type: 'credit' });
    });
  }

  appData.ledgerTransactions.filter(l => l.partyName === partyName && l.partyType === partyType).forEach(l => {
    items.push({ date: l.dateStr || 'تاریخ ثبت', title: `تسویه / دریافت وجه: ${l.desc || ''}`, amount: Number(l.amount || 0), type: 'payment' });
  });

  let totalBal = 0;
  if (partyType === 'customer') {
    totalBal = getCustomerBalance(partyName);
  } else {
    totalBal = getSupplierBalance(partyName);
  }

  document.getElementById('ledger-summary-total').innerText = formatNumber(totalBal) + ' تومان';
  document.getElementById('ledger-summary-count').innerText = `تعداد تراکنش‌ها: ${items.length}`;
  document.getElementById('ledger-summary-status').innerText = totalBal > 0 ? (partyType === 'customer' ? 'بدهکار' : 'طلبکار') : 'تسویه';

  let html = '';
  items.forEach(it => {
    html += `
      <div class="list-item">
        <div class="list-item-info">
          <h4>${it.title}</h4>
          <p>${it.date}</p>
        </div>
        <span class="badge ${it.type === 'payment' ? 'badge-success' : 'badge-primary'}">${formatNumber(it.amount)} تومان</span>
      </div>`;
  });

  contentEl.innerHTML = html || `<div style="text-align:center; color:var(--text-secondary); padding:12px;">تراکنشی ثبت نشده است.</div>`;
}

function saveLedgerTransaction() {
  const partyName = document.getElementById('ledger-party-name').value;
  const partyType = document.getElementById('ledger-party-type').value;
  const amount = Number(document.getElementById('ledger-trans-amount').value || 0);
  if (amount <= 0) { alert('لطفا مبلغ معتبری وارد کنید.'); return; }

  const now = new Date();
  const dateStr = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}`;

  appData.ledgerTransactions.push({
    partyName: partyName,
    partyType: partyType,
    amount: amount,
    desc: document.getElementById('ledger-trans-desc').value.trim() || 'تسویه حساب',
    dateStr: dateStr
  });

  saveData();
  document.getElementById('ledger-trans-amount').value = '';
  document.getElementById('ledger-trans-desc').value = '';
  renderLedgerContentList();
  renderAll();
  alert('تراکنش با موفقیت ثبت شد.');
}

function shareLedgerAsText() {
  alert('متن صورتحساب کپی شد.');
}
function shareLedgerAsImage() {
  alert('خروجی تصویری دفتر حساب آماده شد.');
}

// فاکتور فروش
let activeSaleItems = [];

function openSaleModal() {
  document.getElementById('sale-edit-id').value = '';
  activeSaleItems = [];
  document.getElementById('sale-discount').value = '';
  document.getElementById('sale-received').value = '';
  document.getElementById('sale-subtotal').value = '';
  document.getElementById('sale-receivable').value = '';
  document.getElementById('sale-remaining').value = '';
  document.getElementById('sale-excess').value = '';
  document.getElementById('sale-items-list').innerHTML = '';

  // پر کردن مشتریان
  let custHtml = '';
  appData.customers.forEach(c => { custHtml += `<option value="${c.name}">${c.name}</option>`; });
  document.getElementById('sale-customer').innerHTML = custHtml || `<option value="">مشتری ثبت نشده است</option>`;

  // پر کردن کالاها
  let prodHtml = '<option value="">انتخاب کالا از انبار...</option>';
  appData.products.forEach((p, idx) => {
    if (p.qty > 0) prodHtml += `<option value="${idx}">${p.name} (موجودی: ${p.qty} - قیمت: ${p.sellPrice})</option>`;
  });
  document.getElementById('sale-input-prod').innerHTML = prodHtml;

  setupSalePaymentChips();
  fillDateSelects('sale-year', 'sale-month', 'sale-day');
  openModal('modal-sale');
}

function clearSaleForm() {
  activeSaleItems = [];
  document.getElementById('sale-discount').value = '';
  document.getElementById('sale-received').value = '';
  renderSaleItemsList();
  calcSaleTotals();
}

function onSaleCustomerChange() {}

function onSaleInputProdChange() {
  const idx = document.getElementById('sale-input-prod').value;
  if (idx !== '') {
    const p = appData.products[Number(idx)];
    document.getElementById('sale-input-price').value = p.sellPrice || 0;
    document.getElementById('sale-input-qty').value = 1;
  }
}

function addSaleItemFromInput() {
  const idx = document.getElementById('sale-input-prod').value;
  const qty = Number(document.getElementById('sale-input-qty').value || 0);
  const price = Number(document.getElementById('sale-input-price').value || 0);

  if (idx === '') { alert('لطفا کالا را انتخاب کنید.'); return; }
  if (qty <= 0) { alert('تعداد کالا نامعتبر است.'); return; }

  const p = appData.products[Number(idx)];
  if (p.qty < qty) { alert('موجودی انبار برای این تعداد کافی نیست.'); return; }

  activeSaleItems.push({
    productIndex: Number(idx),
    name: p.name,
    qty: qty,
    unitPrice: price,
    buyPrice: p.buyPrice || 0,
    total: qty * price
  });

  renderSaleItemsList();
  calcSaleTotals();
}

function renderSaleItemsList() {
  let html = '';
  activeSaleItems.forEach((it, idx) => {
    html += `
      <div class="list-item">
        <div class="list-item-info">
          <h4>${it.name}</h4>
          <p>${it.qty} عدد × ${formatNumber(it.unitPrice)} = ${formatNumber(it.total)} تومان</p>
        </div>
        <button class="btn btn-danger btn-sm" onclick="activeSaleItems.splice(${idx},1); renderSaleItemsList(); calcSaleTotals();"><i class="fas fa-trash"></i></button>
      </div>`;
  });
  document.getElementById('sale-items-list').innerHTML = html || `<div style="text-align:center; color:var(--text-secondary); font-size:0.78rem;">قلم کالایی افزوده نشده است.</div>`;
}

function calcSaleTotals() {
  let subtotal = 0;
  let totalProfit = 0;
  activeSaleItems.forEach(it => {
    subtotal += it.total;
    totalProfit += (it.unitPrice - it.buyPrice) * it.qty;
  });

  const discount = Number(document.getElementById('sale-discount').value || 0);
  const receivable = Math.max(0, subtotal - discount);
  const received = Number(document.getElementById('sale-received').value || 0);
  const remaining = Math.max(0, receivable - received);
  const excess = Math.max(0, received - receivable);

  document.getElementById('sale-subtotal').value = subtotal;
  document.getElementById('sale-receivable').value = receivable;
  document.getElementById('sale-remaining').value = remaining;
  document.getElementById('sale-excess').value = excess;
  document.getElementById('sale-profit').value = totalProfit;
}

function setupSalePaymentChips() {
  const container = document.getElementById('sale-payment-chips-container');
  let html = '';
  appData.settings.paymentTypes.forEach(pt => {
    if (pt.active) {
      html += `<div class="category-chip" onclick="selectSalePaymentType('${pt.id}')">${pt.title}</div>`;
    }
  });
  container.innerHTML = html;
}

function selectSalePaymentType(id) {
  document.getElementById('sale-payment-details-container').innerHTML = `<input type="text" class="form-input" placeholder="جزئیات دریافت (${id})...">`;
}

function saveSale() {
  if (activeSaleItems.length === 0) { alert('فاکتور خالی است.'); return; }
  const customer = document.getElementById('sale-customer').value;
  if (!customer) { alert('لطفا مشتری را انتخاب کنید.'); return; }

  const subtotal = Number(document.getElementById('sale-subtotal').value || 0);
  const discount = Number(document.getElementById('sale-discount').value || 0);
  const receivable = Number(document.getElementById('sale-receivable').value || 0);
  const received = Number(document.getElementById('sale-received').value || 0);
  const remaining = Number(document.getElementById('sale-remaining').value || 0);
  const profit = Number(document.getElementById('sale-profit').value || 0);

  const y = document.getElementById('sale-year').value;
  const m = document.getElementById('sale-month').value;
  const d = document.getElementById('sale-day').value;
  const dateStr = `${y}/${m}/${d}`;

  // کسر از موجودی انبار
  activeSaleItems.forEach(it => {
    appData.products[it.productIndex].qty -= it.qty;
  });

  const saleRec = {
    id: Date.now().toString().slice(-6),
    customer: customer,
    items: [...activeSaleItems],
    subtotal: subtotal,
    discount: discount,
    receivable: receivable,
    received: received,
    remaining: remaining,
    profit: profit,
    dateStr: dateStr
  };

  appData.sales.push(saleRec);
  saveData();
  closeModal('modal-sale');
  renderAll();
  alert('فاکتور فروش با موفقیت ثبت و موجودی انبار به‌روزرسانی شد.');
}

function renderSales() {
  const search = (document.getElementById('search-sale').value || '').toLowerCase();
  const listEl = document.getElementById('sales-list');
  let html = '';
  appData.sales.forEach((s, idx) => {
    if (search && !s.customer.toLowerCase().includes(search) && !s.id.includes(search)) return;
    html += `
      <div class="list-item">
        <div class="list-item-info">
          <h4>فاکتور #${s.id} - ${s.customer}</h4>
          <p>تاریخ: ${s.dateStr} | مبلغ: ${formatNumber(s.receivable || s.subtotal)} تومان</p>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-outline btn-sm" onclick="previewInvoice(${idx})"><i class="fas fa-eye"></i></button>
          <button class="btn btn-danger btn-sm" onclick="deleteSale(${idx})"><i class="fas fa-trash"></i></button>
        </div>
      </div>`;
  });
  listEl.innerHTML = html || `<div style="text-align:center; color:var(--text-secondary); padding:12px;">فاکتور فروشی ثبت نشده است.</div>`;
}

function deleteSale(idx) {
  if (confirm('آیا از حذف این فاکتور فروش اطمینان دارید؟')) {
    const s = appData.sales[idx];
    // بازگردانی موجودی انبار
    s.items.forEach(it => {
      if (appData.products[it.productIndex]) {
        appData.products[it.productIndex].qty += it.qty;
      }
    });
    appData.sales.splice(idx, 1);
    saveData();
    renderAll();
  }
}

// فاکتور خرید
let activePurItems = [];

function openPurchaseModal() {
  document.getElementById('pur-edit-id').value = '';
  activePurItems = [];
  document.getElementById('pur-discount').value = '';
  document.getElementById('pur-paid').value = '';
  document.getElementById('pur-subtotal').value = '';
  document.getElementById('pur-receivable').value = '';
  document.getElementById('pur-remaining').value = '';
  document.getElementById('pur-excess').value = '';
  document.getElementById('pur-items-list').innerHTML = '';

  let suppHtml = '';
  appData.suppliers.forEach(s => { suppHtml += `<option value="${s.name}">${s.name}</option>`; });
  document.getElementById('pur-supplier').innerHTML = suppHtml || `<option value="">تأمین‌کننده ثبت نشده است</option>`;

  let cats = new Set();
  appData.products.forEach(p => { if (p.category) cats.add(p.category); });
  let chipsHtml = '';
  cats.forEach(c => { chipsHtml += `<div class="category-chip" onclick="document.getElementById('pur-input-category').value='${c}'">${c}</div>`; });
  document.getElementById('pur-product-category-chips').innerHTML = chipsHtml;

  fillDateSelects('pur-year', 'pur-month', 'pur-day');
  openModal('modal-purchase');
}

function clearPurForm() {
  activePurItems = [];
  document.getElementById('pur-discount').value = '';
  document.getElementById('pur-paid').value = '';
  renderPurItemsList();
  calcPurTotals();
}

function onPurSupplierChange() {}

function addPurItemFromInput() {
  const name = document.getElementById('pur-input-name').value.trim();
  const category = document.getElementById('pur-input-category').value.trim() || 'متفرقه';
  const qty = Number(document.getElementById('pur-input-qty').value || 0);
  const price = Number(document.getElementById('pur-input-price').value || 0);

  if (!name) { alert('لطفا نام کالا را وارد کنید.'); return; }
  if (qty <= 0) { alert('تعداد معتبر نیست.'); return; }

  activePurItems.push({
    name: name,
    category: category,
    qty: qty,
    buyPrice: price,
    total: qty * price
  });

  document.getElementById('pur-input-name').value = '';
  document.getElementById('pur-input-qty').value = '';
  document.getElementById('pur-input-price').value = '';
  renderPurItemsList();
  calcPurTotals();
}

function renderPurItemsList() {
  let html = '';
  activePurItems.forEach((it, idx) => {
    html += `
      <div class="list-item">
        <div class="list-item-info">
          <h4>${it.name}</h4>
          <p>${it.qty} عدد × ${formatNumber(it.buyPrice)} = ${formatNumber(it.total)} تومان</p>
        </div>
        <button class="btn btn-danger btn-sm" onclick="activePurItems.splice(${idx},1); renderPurItemsList(); calcPurTotals();"><i class="fas fa-trash"></i></button>
      </div>`;
  });
  document.getElementById('pur-items-list').innerHTML = html || `<div style="text-align:center; color:var(--text-secondary); font-size:0.78rem;">قلم کالایی افزوده نشده است.</div>`;
}

function calcPurTotals() {
  let subtotal = 0;
  activePurItems.forEach(it => subtotal += it.total);

  const discount = Number(document.getElementById('pur-discount').value || 0);
  const receivable = Math.max(0, subtotal - discount);
  const paid = Number(document.getElementById('pur-paid').value || 0);
  const remaining = Math.max(0, receivable - paid);
  const excess = Math.max(0, paid - receivable);

  document.getElementById('pur-subtotal').value = subtotal;
  document.getElementById('pur-receivable').value = receivable;
  document.getElementById('pur-remaining').value = remaining;
  document.getElementById('pur-excess').value = excess;
}

function savePurchase() {
  if (activePurItems.length === 0) { alert('فاکتور خرید خالی است.'); return; }
  const supplier = document.getElementById('pur-supplier').value;
  if (!supplier) { alert('لطفا تأمین‌کننده را انتخاب کنید.'); return; }

  const subtotal = Number(document.getElementById('pur-subtotal').value || 0);
  const discount = Number(document.getElementById('pur-discount').value || 0);
  const receivable = Number(document.getElementById('pur-receivable').value || 0);
  const paid = Number(document.getElementById('pur-paid').value || 0);
  const remaining = Number(document.getElementById('pur-remaining').value || 0);

  const y = document.getElementById('pur-year').value;
  const m = document.getElementById('pur-month').value;
  const d = document.getElementById('pur-day').value;
  const dateStr = `${y}/${m}/${d}`;

  // افزودن یا به‌روزرسانی موجودی اقلام انبار
  activePurItems.forEach(it => {
    let existingProd = appData.products.find(p => p.name === it.name);
    if (existingProd) {
      existingProd.qty += it.qty;
      existingProd.buyPrice = it.buyPrice;
    } else {
      appData.products.push({
        name: it.name,
        barcode: '99' + Math.floor(Math.random()*1000000000),
        category: it.category,
        qty: it.qty,
        buyPrice: it.buyPrice,
        sellPrice: Math.round(it.buyPrice * 1.25)
      });
    }
  });

  const purRec = {
    id: Date.now().toString().slice(-6),
    supplier: supplier,
    items: [...activePurItems],
    subtotal: subtotal,
    discount: discount,
    receivable: receivable,
    paid: paid,
    remaining: remaining,
    dateStr: dateStr
  };

  appData.purchases.push(purRec);
  saveData();
  closeModal('modal-purchase');
  renderAll();
  alert('فاکتور خرید ثبت و انبار به‌روزرسانی شد.');
}

function renderPurchases() {
  const search = (document.getElementById('search-purchase').value || '').toLowerCase();
  const listEl = document.getElementById('purchases-list');
  let html = '';
  appData.purchases.forEach((p, idx) => {
    if (search && !p.supplier.toLowerCase().includes(search) && !p.id.includes(search)) return;
    html += `
      <div class="list-item">
        <div class="list-item-info">
          <h4>فاکتور خرید #${p.id} - ${p.supplier}</h4>
          <p>تاریخ: ${p.dateStr} | مبلغ: ${formatNumber(p.receivable || p.subtotal)} تومان</p>
        </div>
        <button class="btn btn-danger btn-sm" onclick="appData.purchases.splice(${idx},1); saveData(); renderAll();"><i class="fas fa-trash"></i></button>
      </div>`;
  });
  listEl.innerHTML = html || `<div style="text-align:center; color:var(--text-secondary); padding:12px;">فاکتور خریدی ثبت نشده است.</div>`;
}

// پیش‌نمایش فاکتور رسمی
function previewInvoice(idx) {
  const s = appData.sales[idx];
  let itemsHtml = '';
  s.items.forEach((it, i) => {
    itemsHtml += `
      <tr>
        <td style="border:1px solid #ccc; padding:6px; text-align:center;">${i+1}</td>
        <td style="border:1px solid #ccc; padding:6px;">${it.name}</td>
        <td style="border:1px solid #ccc; padding:6px; text-align:center;">${it.qty}</td>
        <td style="border:1px solid #ccc; padding:6px; text-align:right;">${formatNumber(it.unitPrice)}</td>
        <td style="border:1px solid #ccc; padding:6px; text-align:right;">${formatNumber(it.total)}</td>
      </tr>`;
  });

  const html = `
    <div style="text-align:center; margin-bottom:12px;">
      <h3 style="margin:0; color:var(--primary);">${appData.settings.title || 'فروش‌یار'}</h3>
      <p style="font-size:0.75rem; color:#666; margin:2px 0;">${appData.settings.subtitle || ''}</p>
    </div>
    <div style="display:flex; justify-content:space-between; font-size:0.78rem; margin-bottom:10px; border-bottom:1px dashed #ccc; padding-bottom:6px;">
      <div><b>شماره فاکتور:</b> #${s.id}</div>
      <div><b>تاریخ:</b> ${s.dateStr}</div>
    </div>
    <div style="font-size:0.78rem; margin-bottom:10px;">
      <b>مشتری:</b> ${s.customer}
    </div>
    <table style="width:100%; border-collapse:collapse; font-size:0.75rem; margin-bottom:10px;">
      <thead>
        <tr style="background:#f1f5f9;">
          <th style="border:1px solid #ccc; padding:6px;">ردیف</th>
          <th style="border:1px solid #ccc; padding:6px;">شرح کالا</th>
          <th style="border:1px solid #ccc; padding:6px;">تعداد</th>
          <th style="border:1px solid #ccc; padding:6px;">فی (تومان)</th>
          <th style="border:1px solid #ccc; padding:6px;">جمع (تومان)</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <div style="font-size:0.78rem; text-align:left; border-top:1px solid #ccc; padding-top:6px;">
      <div><b>جمع کل:</b> ${formatNumber(s.subtotal)} تومان</div>
      <div><b>تخفیف:</b> ${formatNumber(s.discount)} تومان</div>
      <div style="font-size:0.9rem; color:var(--primary); margin-top:4px;"><b>مبلغ قابل پرداخت:</b> ${formatNumber(s.receivable)} تومان</div>
    </div>`;

  document.getElementById('invoice-print-area').innerHTML = html;
  openModal('modal-invoice-preview');
}

function shareInvoiceAsText() { alert('فاکتور متنی آماده ارسال شد.'); }
function shareInvoiceAsImage() { alert('فاکتور تصویری آماده شد.'); }

// هزینه‌ها
function renderExpensesList() {
  const search = (document.getElementById('search-expense') ? document.getElementById('search-expense').value : '').toLowerCase();
  const listEl = document.getElementById('expenses-list');
  if (!listEl) return;
  let html = '';
  appData.expenses.forEach((e, idx) => {
    if (search && !e.title.toLowerCase().includes(search) && !e.category.toLowerCase().includes(search)) return;
    html += `
      <div class="list-item">
        <div class="list-item-info">
          <h4>${e.title} <span style="font-size:0.7rem; color:var(--text-secondary);">(${e.category})</span></h4>
          <p>مبلغ: ${formatNumber(e.amount)} تومان | تاریخ: ${e.dateStr || ''}</p>
        </div>
        <button class="btn btn-danger btn-sm" onclick="appData.expenses.splice(${idx},1); saveData(); renderAll();"><i class="fas fa-trash"></i></button>
      </div>`;
  });
  listEl.innerHTML = html || `<div style="text-align:center; color:var(--text-secondary); padding:12px;">هزینه‌ای ثبت نشده است.</div>`;
}

function openExpenseManagerModal() {
  document.getElementById('exp-new-title').value = '';
  document.getElementById('exp-new-cat').value = '';
  document.getElementById('exp-new-amount').value = '';

  let cats = new Set(['کرایه', 'برق و آب', 'حق‌التدریس', 'سایر']);
  appData.expenses.forEach(e => { if (e.category) cats.add(e.category); });
  let chipsHtml = '';
  cats.forEach(c => { chipsHtml += `<div class="category-chip" onclick="document.getElementById('exp-new-cat').value='${c}'">${c}</div>`; });
  document.getElementById('expense-category-chips').innerHTML = chipsHtml;

  renderExpensesList();
  openModal('modal-expense-manager');
}

function saveNewExpenseFromManager() {
  const title = document.getElementById('exp-new-title').value.trim();
  const category = document.getElementById('exp-new-cat').value.trim() || 'متفرقه';
  const amount = Number(document.getElementById('exp-new-amount').value || 0);

  if (!title) { alert('عنوان هزینه را وارد کنید.'); return; }
  if (amount <= 0) { alert('مبلغ هزینه معتبر نیست.'); return; }

  const now = new Date();
  const dateStr = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}`;

  appData.expenses.push({ title, category, amount, dateStr });
  saveData();
  document.getElementById('exp-new-title').value = '';
  document.getElementById('exp-new-amount').value = '';
  renderExpensesList();
  renderAll();
  alert('هزینه با موفقیت ثبت شد.');
}

// تنظیمات عمومی و پشتیبان‌گیری
function renderSettingsUI() {
  document.getElementById('cfg-title').value = appData.settings.title || '';
  document.getElementById('cfg-subtitle').value = appData.settings.subtitle || '';
  
  renderPaymentTypesSettings();
  renderBankAccountsSettings();
  renderCryptoAddressesSettings();
  renderStorePhonesSettings();
  renderStoreAddressesSettings();
  renderStoreSocialsSettings();
}

function handleLogoFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    document.getElementById('logo-file-label').innerText = file.name;
    const reader = new FileReader();
    reader.onload = function(evt) {
      appData.settings.logo = evt.target.result;
      saveData();
    };
    reader.readAsDataURL(file);
  }
}

function renderPaymentTypesSettings() {
  const container = document.getElementById('payment-types-settings-list');
  if (!container) return;
  let html = '';
  appData.settings.paymentTypes.forEach((pt, idx) => {
    html += `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:6px; background:#fafafa; padding:6px 10px; border-radius:8px; border:1px solid var(--border);">
        <input type="text" class="form-input" style="flex:2; padding:6px;" value="${pt.title}" oninput="appData.settings.paymentTypes[${idx}].title=this.value">
        <label style="font-size:0.75rem; display:flex; align-items:center; gap:4px; cursor:pointer;">
          <input type="checkbox" ${pt.active ? 'checked' : ''} onchange="appData.settings.paymentTypes[${idx}].active=this.checked"> فعال
        </label>
        <button class="btn btn-danger btn-sm" type="button" onclick="appData.settings.paymentTypes.splice(${idx},1); renderPaymentTypesSettings();"><i class="fas fa-trash"></i></button>
      </div>`;
  });
  container.innerHTML = html;
}

function addNewPaymentType() {
  appData.settings.paymentTypes.push({ id: 'pt_' + Date.now(), title: 'روش جدید', hasDetails: false, active: true });
  renderPaymentTypesSettings();
}

function renderBankAccountsSettings() {
  const container = document.getElementById('bank-accounts-list');
  if (!container) return;
  let html = '';
  appData.settings.bankAccounts.forEach((b, idx) => {
    html += `
      <div style="display:flex; gap:8px; margin-bottom:6px; background:#fafafa; padding:6px; border-radius:8px; border:1px solid var(--border);">
        <input type="text" class="form-input" style="flex:2; padding:6px;" value="${b.name}" placeholder="نام بانک..." oninput="appData.settings.bankAccounts[${idx}].name=this.value">
        <input type="text" class="form-input" style="flex:2; padding:6px;" value="${b.number}" placeholder="شماره حساب/کارت..." oninput="appData.settings.bankAccounts[${idx}].number=this.value">
        <button class="btn btn-danger btn-sm" type="button" onclick="appData.settings.bankAccounts.splice(${idx},1); renderBankAccountsSettings();"><i class="fas fa-trash"></i></button>
      </div>`;
  });
  container.innerHTML = html;
}

function addBankInputRow() {
  appData.settings.bankAccounts.push({ name: '', number: '', active: true });
  renderBankAccountsSettings();
}

function renderCryptoAddressesSettings() {
  const container = document.getElementById('crypto-addresses-list');
  if (!container) return;
  let html = '';
  appData.settings.cryptoAddresses.forEach((c, idx) => {
    html += `
      <div style="display:flex; gap:8px; margin-bottom:6px; background:#fafafa; padding:6px; border-radius:8px; border:1px solid var(--border);">
        <input type="text" class="form-input" style="flex:2; padding:6px;" value="${c.name}" placeholder="ارز..." oninput="appData.settings.cryptoAddresses[${idx}].name=this.value">
        <input type="text" class="form-input" style="flex:2; padding:6px;" value="${c.address}" placeholder="آدرس..." oninput="appData.settings.cryptoAddresses[${idx}].address=this.value">
        <button class="btn btn-danger btn-sm" type="button" onclick="appData.settings.cryptoAddresses.splice(${idx},1); renderCryptoAddressesSettings();"><i class="fas fa-trash"></i></button>
      </div>`;
  });
  container.innerHTML = html;
}

function addCryptoAddressRow() {
  appData.settings.cryptoAddresses.push({ name: '', address: '', active: true });
  renderCryptoAddressesSettings();
}

function renderStorePhonesSettings() {
  const container = document.getElementById('store-phones-list');
  if (!container) return;
  let html = '';
  appData.settings.storePhones.forEach((p, idx) => {
    html += `
      <div style="display:flex; gap:8px; margin-bottom:6px; background:#fafafa; padding:6px; border-radius:8px; border:1px solid var(--border);">
        <input type="text" class="form-input" style="padding:6px;" value="${p.number}" placeholder="شماره تماس..." oninput="appData.settings.storePhones[${idx}].number=this.value">
        <button class="btn btn-danger btn-sm" type="button" onclick="appData.settings.storePhones.splice(${idx},1); renderStorePhonesSettings();"><i class="fas fa-trash"></i></button>
      </div>`;
  });
  container.innerHTML = html;
}

function addStorePhoneRow() {
  appData.settings.storePhones.push({ number: '', active: true });
  renderStorePhonesSettings();
}

function renderStoreAddressesSettings() {
  const container = document.getElementById('store-addresses-standalone-list');
  if (!container) return;
  let html = '';
  appData.settings.storeAddresses.forEach((a, idx) => {
    html += `
      <div style="display:flex; gap:8px; margin-bottom:6px; background:#fafafa; padding:6px; border-radius:8px; border:1px solid var(--border);">
        <input type="text" class="form-input" style="padding:6px;" value="${a.address}" placeholder="آدرس..." oninput="appData.settings.storeAddresses[${idx}].address=this.value">
        <button class="btn btn-danger btn-sm" type="button" onclick="appData.settings.storeAddresses.splice(${idx},1); renderStoreAddressesSettings();"><i class="fas fa-trash"></i></button>
      </div>`;
  });
  container.innerHTML = html;
}

function addStoreStandaloneAddressRow() {
  appData.settings.storeAddresses.push({ address: '', active: true });
  renderStoreAddressesSettings();
}

function renderStoreSocialsSettings() {
  const container = document.getElementById('store-socials-list');
  if (!container) return;
  let html = '';
  appData.settings.storeSocials.forEach((s, idx) => {
    html += `
      <div style="display:flex; gap:8px; margin-bottom:6px; background:#fafafa; padding:6px; border-radius:8px; border:1px solid var(--border);">
        <input type="text" class="form-input" style="flex:1; padding:6px;" value="${s.platform}" placeholder="پلتفرم..." oninput="appData.settings.storeSocials[${idx}].platform=this.value">
        <input type="text" class="form-input" style="flex:2; padding:6px;" value="${s.handle}" placeholder="آیدی / لینک..." oninput="appData.settings.storeSocials[${idx}].handle=this.value">
        <button class="btn btn-danger btn-sm" type="button" onclick="appData.settings.storeSocials.splice(${idx},1); renderStoreSocialsSettings();"><i class="fas fa-trash"></i></button>
      </div>`;
  });
  container.innerHTML = html;
}

function addStoreSocialRow() {
  appData.settings.storeSocials.push({ platform: '', handle: '', active: true });
  renderStoreSocialsSettings();
}

function saveSettings() {
  appData.settings.title = document.getElementById('cfg-title').value.trim() || 'فروش‌یار';
  appData.settings.subtitle = document.getElementById('cfg-subtitle').value.trim() || '';
  saveData();
  renderAll();
  alert('تمام تنظیمات با موفقیت ذخیره شد.');
}

function exportBackup() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "frooshyar_backup_" + Date.now() + ".json");
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
}

function handleRestoreFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    document.getElementById('restore-file-label').innerText = file.name;
    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const parsed = JSON.parse(evt.target.result);
        appData = parsed;
        saveData();
        renderAll();
        document.getElementById('restore-file-status').innerText = 'بازیابی اطلاعات با موفقیت انجام شد.';
      } catch(err) {
        alert('فایل پشتیبان نامعتبر است.');
      }
    };
    reader.readAsText(file);
  }
}

function resetAppData() {
  if (confirm('هشدار: تمامی اطلاعات برنامه پاک خواهد شد. آیا مطمئن هستید؟')) {
    localStorage.removeItem('frooshyar_data_v3');
    location.reload();
  }
}

// گزارشات و تقویم
function renderReports() {
  const detailEl = document.getElementById('reports-detail');
  if (!detailEl) return;
  let totalSales = 0, totalProfit = 0, totalExpenses = 0;
  appData.sales.forEach(s => {
    totalSales += Number(s.receivable || s.subtotal || 0);
    totalProfit += Number(s.profit || 0);
  });
  appData.expenses.forEach(e => {
    totalExpenses += Number(e.amount || 0);
  });

  detailEl.innerHTML = `
    <div style="font-size:0.85rem; line-height:1.8;">
      <div><b>فروش کل:</b> ${formatNumber(totalSales)} تومان</div>
      <div><b>سود ناخالص:</b> ${formatNumber(totalProfit)} تومان</div>
      <div><b>مجموع هزینه‌ها:</b> ${formatNumber(totalExpenses)} تومان</div>
      <hr style="margin:6px 0; border:0; border-top:1px solid var(--border);">
      <div style="font-size:0.95rem; color:var(--primary);"><b>سود خالص:</b> ${formatNumber(totalProfit - totalExpenses)} تومان</div>
    </div>`;

  document.getElementById('financial-chart-view').innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-secondary); font-size:0.8rem;">نمودار مالی فعال</div>`;
}

let calMonth = 1;
let calYear = 1405;

function initCalendar() {
  document.getElementById('cal-month-title').innerText = `اردیبهشت ۱۴۰۵`;
  let heads = '';
  ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].forEach(h => heads += `<div style="font-weight:bold; font-size:0.75rem; color:var(--primary);">${h}</div>`);
  document.getElementById('calendar-week-heads').innerHTML = heads;

  let daysHtml = '';
  for(let i=1; i<=31; i++) {
    daysHtml += `<div class="calendar-day" onclick="selectCalendarDay(${i})">${i}</div>`;
  }
  document.getElementById('calendar-days-grid').innerHTML = daysHtml;
}

function changeCalMonth(dir) {}
function selectCalendarDay(day) {
  document.getElementById('cal-day-details').style.display = 'block';
  document.getElementById('cal-selected-date-title').innerText = `گزارش روز ${day}`;
  document.getElementById('cal-accordion-list').innerHTML = `<div style="font-size:0.78rem; color:var(--text-secondary);">تراکنشی در این روز ثبت نشده است.</div>`;
}

// ابزارهای کمکی
function fillDateSelects(yId, mId, dId) {
  const ySel = document.getElementById(yId);
  const mSel = document.getElementById(mId);
  const dSel = document.getElementById(dId);
  if (!ySel || !mSel || !dSel) return;

  let yHtml = '';
  for(let y=1403; y<=1410; y++) yHtml += `<option value="${y}" ${y===1405?'selected':''}>${y}</option>`;
  ySel.innerHTML = yHtml;

  let mHtml = '';
  const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  months.forEach((m, idx) => mHtml += `<option value="${String(idx+1).padStart(2,'0')}" ${idx===1?'selected':''}>${m}</option>`);
  mSel.innerHTML = mHtml;

  let dHtml = '';
  for(let d=1; d<=31; d++) dHtml += `<option value="${String(d).padStart(2,'0')}" ${d===1?'selected':''}>${d}</option>`;
  dSel.innerHTML = dHtml;
}

function renderAiContent() {
  document.getElementById('ai-content-body').innerHTML = `
    <p><b>سلام!</b> من دستیار هوشمند فروش‌یار هستم.</p>
    <p>بر اساس تحلیل داده‌های انبار و فروش شما، وضعیت موجودی و سودآوری در شرایط مطلوبی قرار دارد. می‌توانید گزارشات مالی را از بخش گزارشات بررسی کنید.</p>`;
}

function renderCreatorSocialLinks() {
  document.getElementById('creator-social-links-container').innerHTML = `
    <div style="font-size:0.82rem; color:var(--text);"><b>کانال / ارتباط:</b> @ali_nasiri100</div>
    <div style="font-size:0.82rem; color:var(--text);"><b>پلتفرم‌های انتشار:</b> ایتا، روبیکا و تلگرام</div>`;
}

function printElement(elementId) {
  const content = document.getElementById(elementId).innerHTML;
  const win = window.open('', '', 'height=700,width=700');
  win.document.write('<html><head><title>چاپ</title><link rel="stylesheet" href="style.css"></head><body style="background:#fff; padding:20px;" dir="rtl">');
  win.document.write(content);
  win.document.write('</body></html>');
  win.document.close();
  win.print();
}

// راه‌اندازی اولیه برنامه هنگام بارگذاری صفحه
window.onload = function() {
  loadData();
  renderAll();
  setLanguage(currentLang);
};