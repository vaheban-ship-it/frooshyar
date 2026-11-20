// ==========================================
// core.js - هسته اصلی، دیتابیس، تاریخ هجری شمسی/میلادی و زبان (FA / EN)
// ==========================================

  // تنظیمات پیش‌فرض انواع دریافت و پرداخت پویا (دوزبانه)
  const DEFAULT_PAYMENT_TYPES_FA = [
    { id: 'pt_cash', name: 'نقد', fields: [] },
    {
      id: 'pt_check',
      name: 'چک',
      fields: [
        { id: 'f_chk_num', label: 'شماره چک', placeholder: 'مثلاً: ۱۲۳۴۵۶' },
        { id: 'f_chk_owner', label: 'صاحب حساب', placeholder: 'نام صادرکننده چک...' },
        { id: 'f_chk_date', label: 'تاریخ سررسید', placeholder: 'مثلاً: ۱۴۰۵/۰۲/۱۵' },
        { id: 'f_chk_bank', label: 'بانک و شعبه', placeholder: 'بانک و شعبه صادرکننده' }
      ]
    },
    {
      id: 'pt_pos',
      name: 'کارت‌خوان (پوز)',
      fields: [
        { id: 'f_pos_trace', label: 'کد رهگیری', placeholder: 'مثلاً: ۹۸۷۶۵۴' },
        { id: 'f_pos_bank', label: 'بانک / دستگاه', placeholder: 'مثلاً: کارت‌خوان سامان' }
      ]
    },
    {
      id: 'pt_card',
      name: 'کارت‌به‌کارت',
      fields: [
        { id: 'f_card_ref', label: 'شماره پیگیری', placeholder: 'مثلاً: ۱۲۳۹۸۷' },
        { id: 'f_card_dest', label: 'کارت مقصد', placeholder: 'شماره شبا یا شماره کارت مقصد' }
      ]
    }
  ];

  const DEFAULT_PAYMENT_TYPES_EN = [
    { id: 'pt_cash', name: 'Cash', fields: [] },
    {
      id: 'pt_check',
      name: 'Check',
      fields: [
        { id: 'f_chk_num', label: 'Check Number', placeholder: 'e.g. 123456' },
        { id: 'f_chk_owner', label: 'Account Owner', placeholder: 'Check issuer name...' },
        { id: 'f_chk_date', label: 'Due Date', placeholder: 'e.g. 2026-05-10' },
        { id: 'f_chk_bank', label: 'Bank & Branch', placeholder: 'Issuing bank and branch' }
      ]
    },
    {
      id: 'pt_pos',
      name: 'POS Terminal',
      fields: [
        { id: 'f_pos_trace', label: 'Tracking Code', placeholder: 'e.g. 987654' },
        { id: 'f_pos_bank', label: 'Bank / Device', placeholder: 'e.g. POS Terminal' }
      ]
    },
    {
      id: 'pt_card',
      name: 'Card Transfer',
      fields: [
        { id: 'f_card_ref', label: 'Reference No.', placeholder: 'e.g. 123987' },
        { id: 'f_card_dest', label: 'Destination Card', placeholder: 'IBAN or destination card number' }
      ]
    }
  ];

  function getDefaultPaymentTypes() {
    return (currentLang === 'en') ? DEFAULT_PAYMENT_TYPES_EN : DEFAULT_PAYMENT_TYPES_FA;
  }

  var DEFAULT_PAYMENT_TYPES = DEFAULT_PAYMENT_TYPES_FA;

  let currentLang = localStorage.getItem('frooshyar_lang') || 'fa';

  const translations = {
    fa: {
      app_title: 'فروش‌یار - سیستم جامع حسابداری',
      app_brand_name: 'فروش‌یار',
      subtitle: 'سیستم جامع حسابداری فروشگاهی',
      logo_alt: 'لوگو',
      nav_more: 'بیشتر / تنظیمات',
      ai_assistant: 'دستیار هوش مصنوعی',
      contact_us: 'تماس با ما',
      help: 'راهنما',
      language: 'زبان',
      total_sales: 'فروش کل (محاسبه‌شده)',
      total_profit: 'سود کل',
      stock_items: 'موجودی اقلام انبار',
      total_expenses: 'مجموع هزینه‌ها',
      quick_access: 'دسترسی سریع',
      sale_invoice: 'فاکتور فروش',
      purchase_invoice: 'فاکتور خرید',
      manage_expenses: 'ثبت و مدیریت هزینه‌ها',
      reports: 'گزارشات جامع',
      debtor_customers: 'مشتریان بدهکار',
      creditor_suppliers: 'تأمین‌کنندگان بستانکار',
      debtors_list: 'لیست مشتریان بدهکار',
      creditors_list: 'لیست تأمین‌کنندگان بستانکار',
      global_profit_title: 'اعمال سود درصدی کلی بر تمام کالاها',
      global_profit_toggle: 'فعال‌سازی محاسبه سود درصدی انبار',
      ph_profit_percent: 'درصد سود (مثلاً ۲۰)',
      calc_stock: 'محاسبه انبار',
      manage_products: 'مدیریت کالاها',
      new_product: 'کالا جدید',
      search_product_ph: 'جستجوی نام یا بارکد کالا...',
      scan_barcode: 'اسکن بارکد',
      all_categories: 'همه دسته‌بندی‌ها',
      stock_kardex: 'موجودی انبار و کاردکس',
      search_stock_ph: 'جستجو در انبار...',
      sales_invoices: 'فاکتورهای فروش',
      new_invoice: 'فاکتور جدید',
      search_sale_ph: 'جستجوی فاکتور فروش...',
      purchase_invoices: 'فاکتورهای خرید',
      new_purchase_invoice: 'فاکتور خرید جدید',
      search_purchase_ph: 'جستجوی فاکتور خرید...',
      customers: 'مشتریان',
      pick_contacts: 'انتخاب مخاطبین',
      btn_new: 'جدید',
      search_customer_ph: 'جستجوی مشتری...',
      suppliers: 'تأمین‌کنندگان',
      search_supplier_ph: 'جستجوی تأمین‌کننده...',
      store_settings: 'تنظیمات عمومی فروشگاه',
      store_name: 'نام فروشگاه / عنوان',
      invoice_subtitle: 'زیرعنوان فاکتور',
      default_language: 'زبان پیش‌فرض برنامه / Default Language',
      store_logo: 'لوگوی فروشگاه',
      choose_file: 'انتخاب فایل',
      manage_payment_types: 'مدیریت انواع دریافت و پرداخت',
      payment_types_help: 'در این بخش می‌توانید انواع پرداخت (نقدی، چک، کارت‌خوان، کارت‌به‌کارت و...) و کادرهای جزئیات اختصاصی هرکدام را مدیریت کنید.',
      add_payment_type: 'افزودن نوع دریافت/پرداخت جدید',
      manage_banks: 'مدیریت حساب‌های بانکی',
      bank_help: 'با انتخاب چک‌باکس، حساب بانکی و شماره شبا در فاکتورها درج می‌شود.',
      add_bank: 'افزودن حساب بانکی جدید',
      manage_crypto: 'مدیریت آدرس‌های رمزارز (Crypto)',
      crypto_help: 'با انتخاب چک‌باکس، آدرس کیف‌پول رمزارز در فاکتورها درج خواهد شد.',
      add_crypto: 'افزودن آدرس رمزارز جدید',
      manage_phones: 'مدیریت شماره‌های تماس',
      phone_help: 'با انتخاب چک‌باکس، این شماره تماس در فاکتورها درج خواهد شد.',
      add_phone_new: 'افزودن شماره تماس جدید',
      manage_addresses: 'مدیریت آدرس‌های فروشگاه',
      addr_help: 'با انتخاب چک‌باکس، آدرس انتخاب‌شده در فاکتورها درج خواهد شد.',
      add_address: 'افزودن آدرس جدید',
      manage_socials: 'ارتباط با فروشنده',
      social_help: 'شبکه اجتماعی یا راه ارتباطی مورد نظر را انتخاب کرده و آدرس آن را وارد کنید.',
      add_social: 'افزودن شبکه اجتماعی جدید',
      save_all_settings: 'ذخیره تمام تنظیمات',
      backup_restore: 'پشتیبان‌گیری و بازیابی',
      export_backup: 'ذخیره فایل پشتیبان (Backup)',
      select_backup: 'انتخاب فایل پشتیبان (JSON)',
      reset_app: 'بازنشانی کامل اطلاعات برنامه',
      calendar: 'تقویم',
      send_text: 'ارسال متنی',
      select_period: 'تعیین بازه زمانی جهت گزارش‌گیری',
      period_today: 'امروز',
      period_7days: '۷ روز اخیر',
      period_30days: '۳۰ روز اخیر',
      period_all: 'کل دوره‌ها (همه‌زمان)',
      financial_chart_title: 'نمودار مقایسه‌ای مالی',
      top_selling_items: 'پرفروش‌ترین اقلام در این دوره',
      back_to_home: 'بازگشت به صفحه اصلی',
      contact_creator: 'تماس با سازنده نرم‌افزار',
      creator_name: 'علی نصیری صومعه علیا',
      creator_name_en: 'Ali Nasiri Someh Olia',
      creator_desc: 'طراح، معمار نرم‌افزار و توسعه‌دهنده سیستم جامع فروش‌یار',
      back: 'بازگشت',
      ai_assistant_title: 'دستیار هوشمند فروش‌یا‌ر (AI)',
      ledger_account: 'دفتر حساب مخاطب',
      ledger_total_bal: 'مجموع مانده حساب:',
      ledger_tx_count: 'تعداد تراکنش‌ها: ۰',
      ledger_status_settled: 'وضعیت: تسویه',
      record_payment_title: 'ثبت تسویه / دریافت وجه',
      amount_received: 'مبلغ دریافتی نقدی / کارت (تومان)',
      excess_amount: 'مازاد دریافت (تومان)',
      trans_desc: 'شرح تراکنش',
      payment_type_chips_label: 'نوع دریافت / پرداخت (انتخاب چیپس)',
      save_in_ledger: 'ثبت در دفتر حساب',
      all_transactions: 'همه تراکنش‌ها',
      recent_3: '۳ حساب اخیر',
      recent_7: '۷ حساب اخیر',
      send_image_6: 'ارسال تصویری (۶ قلم)',
      print: 'چاپ',
      help_guide_title: 'راهنمای جامع فروش‌یار',
      got_it: 'متوجه شدم',
      expense_management: 'مدیریت کامل هزینه‌ها',
      add_new_expense: 'ثبت هزینه جدید',
      voice_input: 'ورودی صوتی',
      paste_sms: 'الصاق پیامک',
      ph_exp_title: 'شرح / عنوان هزینه (مثلاً: کرایه مغازه)...',
      ph_exp_cat: 'دسته‌بندی (انتخاب از لیست زیر یا تایپ جدید)...',
      ph_exp_amount: 'مبلغ هزینه (تومان)...',
      save_expense: 'ثبت هزینه',
      search_expense_ph: 'جستجو در هزینه‌ها...',
      edit_add_product: 'افزودن / ویرایش کالا',
      product_name: 'نام کالا *',
      voice_input_product: 'ورودی صوتی نام کالا',
      import_excel_products: 'ورود دسته‌جمعی از فایل اکسل',
      system_15_code: 'کد سیستمی ۱۵ رقمی (تولید خودکار تاریخ و زمان)',
      factory_barcode_opt: 'بارکد کارخانه‌ای / شرکتی (اختیاری)',
      ph_factory_barcode: 'بارکد روی جعبه یا کالا را وارد یا اسکن کنید...',
      scan_factory_barcode: 'اسکن بارکد کارخانه‌ای',
      category: 'دسته‌بندی کالا',
      ph_category_select: 'نام دسته را وارد کنید یا از لیست زیر انتخاب کنید...',
      stock_qty: 'موجودی انبار',
      buy_price: 'قیمت خرید',
      auto_calc_margin: 'محاسبه خودکار قیمت فروش با درصد سود',
      profit_margin: 'درصد سود (٪)',
      sell_price: 'قیمت فروش',
      save_product: 'ذخیره کالا',
      customer_file: 'پرونده مشتری',
      contact_avatar: 'تصویر مخاطب',
      customer_name: 'نام و نام خانوادگی مشتری',
      phone_numbers: 'شماره‌های تماس',
      add_phone: 'افزودن شماره',
      full_address: 'آدرس کامل',
      save_file: 'ذخیره پرونده',
      supplier_file: 'پرونده تأمین‌کننده',
      supplier_name: 'نام شرکت / تأمین‌کننده',
      add_phone_supp: 'افزودن شماره',
      full_address_supp: 'آدرس دفتر / انبار',
      issue_sale_invoice: 'صدور فاکتور فروش',
      clear_form: 'پاکسازی',
      select_customer: 'انتخاب مشتری',
      invoice_date: 'تاریخ فاکتور',
      add_product_item: 'افزودن قلم کالا (با امکان اسکن بارکد فروش)',
      scan_or_search_barcode: 'اسکن یا جستجوی سریع بارکد / نام کالا',
      ph_sale_barcode_search: 'بارکد را اسکن کنید یا نام کالا را جستجو نمایید...',
      scan_sale_barcode: 'اسکن بارکد کالا برای فروش',
      select_product: 'انتخاب کالا از لیست',
      quantity: 'تعداد',
      unit_price: 'قیمت واحد',
      add_to_list: 'افزودن به لیست',
      registered_items: 'اقلام ثبت‌شده در فاکتور',
      lbl_invoice_subtotal: 'مبلغ فاکتور',
      lbl_discount: 'تخفیف',
      lbl_receivable: 'مبلغ قابل دریافت',
      lbl_received: 'دریافتی',
      lbl_remaining: 'مانده حساب',
      lbl_excess_received: 'مازاد دریافت',
      save_and_issue: 'ذخیره و صدور',
      record_purchase_invoice: 'ثبت فاکتور خرید',
      supplier: 'تأمین‌کننده',
      purchase_date: 'تاریخ فاکتور خرید',
      add_pur_product_item: 'افزودن قلم کالا خرید',
      ph_pur_name: 'نام کالا *',
      import_excel_pur: 'ورود دسته‌جمعی اقلام خرید از فایل اکسل',
      ph_pur_factory_barcode: 'بارکد کارخانه‌ای کالا (در صورت وجود)...',
      ph_pur_cat: 'دسته‌بندی کالا (انتخاب از لیست زیر یا تایپ جدید)...',
      ph_pur_qty: 'تعداد',
      ph_pur_price: 'قیمت خرید واحد (تومان)',
      add_to_pur_list: 'افزودن به لیست خرید',
      registered_pur_items: 'اقلام ثبت‌شده در فاکتور خرید',
      lbl_payable: 'مبلغ قابل پرداخت',
      lbl_paid: 'پرداختی',
      pur_payment_type_label: 'نوع پرداخت به تأمین‌کننده (انتخاب چیپس)',
      lbl_excess_paid: 'مازاد پرداخت',
      record_purchase: 'ثبت خرید',
      invoice_preview: 'پیش‌نمایش فاکتور رسمی',
      send_image: 'تصویری (۶ قلم)',
      daily_calendar_report: 'تقویم گزارش‌گیری روزانه',
      prev_month: 'ماه قبل',
      next_month: 'ماه بعد',
      daily_report: 'گزارش روز',
      select_language: 'انتخاب زبان / Language',
      barcode_scanner_title: 'اسکنر بارکد کالا',
      barcode_scanner_help: 'بارکد را جلوی دوربین گوشی قرار دهید تا به طور خودکار اسکن شود.',
      close_scanner: 'بستن اسکنر',
      nav_home: 'خانه',
      nav_products: 'کالاها',
      nav_stock: 'انبار',
      nav_sales: 'فروش',
      nav_purchases: 'خرید',
      nav_customers: 'مشتریان',
      nav_suppliers: 'تأمین',
      unit_currency: 'تومان',
      unit_qty: 'عدد',
      str_debtor: 'بدهکار',
      str_settled: 'تسویه',
      str_invoice_no: 'فاکتور #',
      str_purchase_no: 'خرید #',
      no_items_found: 'آیتمی اضافه نشده است',
      no_prod_found: 'کالایی یافت نشد',
      no_sale_found: 'فاکتور فروشی ثبت نشده است',
      no_pur_found: 'فاکتور خریدی ثبت نشده است',
      no_cust_found: 'مشتری یافت نشد',
      no_supp_found: 'تأمین‌کننده‌ای یافت نشد',
      trans_default_note: 'تسویه حساب / دریافت وجه',
      alert_unsettled_cust: '⚠️ پیام سیستم:\nمشتری «{custName}» دارای مازاد دریافتی تسویه‌نشده است.\nلطفاً ابتدا در بخش مشتریان وارد دفتر حساب شوید و مازاد را ثبت/تسویه نمایید، سپس فاکتور جدید صادر کنید.',
      alert_unsettled_supp: '⚠️ پیام سیستم:\nتأمین‌کننده «{suppName}» دارای مازاد پرداختی تسویه‌نشده است.\nلطفاً ابتدا در بخش تأمین‌کنندگان وارد دفتر حساب شوید و مازاد را ثبت/تسویه نمایید، سپس فاکتور خرید جدید ثبت کنید.'
    },
    en: {
      app_title: 'Frooshyar - Comprehensive Accounting System',
      app_brand_name: 'Frooshyar',
      subtitle: 'Comprehensive Store Accounting System',
      logo_alt: 'Logo',
      nav_more: 'More / Settings',
      ai_assistant: 'AI Assistant',
      contact_us: 'Contact Us',
      help: 'Help',
      language: 'Language',
      total_sales: 'Total Sales',
      total_profit: 'Total Profit',
      stock_items: 'Stock Items',
      total_expenses: 'Total Expenses',
      quick_access: 'Quick Access',
      sale_invoice: 'Sales Invoice',
      purchase_invoice: 'Purchase Invoice',
      manage_expenses: 'Manage Expenses',
      reports: 'Reports',
      debtor_customers: 'Debtor Customers',
      creditor_suppliers: 'Creditor Suppliers',
      debtors_list: 'Debtor Customers List',
      creditors_list: 'Creditor Suppliers List',
      global_profit_title: 'Apply Global Profit Margin to All Products',
      global_profit_toggle: 'Enable Global Profit Margin Calculation',
      ph_profit_percent: 'Profit % (e.g. 20)',
      calc_stock: 'Calculate Stock',
      manage_products: 'Manage Products',
      new_product: 'New Product',
      search_product_ph: 'Search product name or barcode...',
      scan_barcode: 'Scan Barcode',
      all_categories: 'All Categories',
      stock_kardex: 'Stock & Kardex',
      search_stock_ph: 'Search in stock...',
      sales_invoices: 'Sales Invoices',
      new_invoice: 'New Invoice',
      search_sale_ph: 'Search sales invoice...',
      purchase_invoices: 'Purchase Invoices',
      new_purchase_invoice: 'New Purchase Invoice',
      search_purchase_ph: 'Search purchase invoice...',
      customers: 'Customers',
      pick_contacts: 'Pick Contacts',
      btn_new: 'New',
      search_customer_ph: 'Search customer...',
      suppliers: 'Suppliers',
      search_supplier_ph: 'Search supplier...',
      store_settings: 'General Store Settings',
      store_name: 'Store Name / Title',
      invoice_subtitle: 'Invoice Subtitle',
      default_language: 'Default Language / زبان پیش‌فرض برنامه',
      store_logo: 'Store Logo',
      choose_file: 'Choose File',
      manage_payment_types: 'Manage Payment & Receipt Types',
      payment_types_help: 'Manage payment methods (Cash, Check, POS, Card Transfer, etc.) and custom detail fields here.',
      add_payment_type: 'Add New Payment/Receipt Type',
      manage_banks: 'Manage Bank Accounts',
      bank_help: 'Checked bank accounts and IBANs will be included in invoices.',
      add_bank: 'Add New Bank Account',
      manage_crypto: 'Manage Crypto Addresses',
      crypto_help: 'Checked crypto wallet addresses will be included in invoices.',
      add_crypto: 'Add New Crypto Address',
      manage_phones: 'Manage Contact Phones',
      phone_help: 'Checked phone numbers will be included in invoices.',
      add_phone_new: 'Add New Phone Number',
      manage_addresses: 'Manage Store Addresses',
      addr_help: 'Checked store addresses will be included in invoices.',
      add_address: 'Add New Address',
      manage_socials: 'Seller Social Links',
      social_help: 'Select a social network or contact link and enter its address.',
      add_social: 'Add New Social Link',
      save_all_settings: 'Save All Settings',
      backup_restore: 'Backup & Restore',
      export_backup: 'Export Backup File',
      select_backup: 'Select Backup File (JSON)',
      reset_app: 'Reset All App Data',
      calendar: 'Calendar',
      send_text: 'Send Text',
      select_period: 'Select Report Period',
      period_today: 'Today',
      period_7days: 'Last 7 Days',
      period_30days: 'Last 30 Days',
      period_all: 'All Time',
      financial_chart_title: 'Financial Comparison Chart',
      top_selling_items: 'Top Selling Items in Period',
      back_to_home: 'Back to Home',
      contact_creator: 'Contact Software Creator',
      creator_name: 'Ali Nasiri Someh Olia',
      creator_name_en: 'Ali Nasiri Someh Olia',
      creator_desc: 'Architect & Lead Developer of Frooshyar System',
      back: 'Back',
      ai_assistant_title: 'Frooshyar Smart AI Assistant',
      ledger_account: 'Contact Ledger Account',
      ledger_total_bal: 'Total Balance:',
      ledger_tx_count: 'Transactions: 0',
      ledger_status_settled: 'Status: Settled',
      record_payment_title: 'Record Settlement / Receipt',
      amount_received: 'Received Amount (Cash / Card)',
      excess_amount: 'Excess Amount',
      trans_desc: 'Transaction Description',
      payment_type_chips_label: 'Payment / Receipt Type (Select Chip)',
      save_in_ledger: 'Save to Ledger',
      all_transactions: 'All Transactions',
      recent_3: 'Recent 3',
      recent_7: 'Recent 7',
      send_image_6: 'Image (6 items)',
      print: 'Print',
      help_guide_title: 'Frooshyar Comprehensive Guide',
      got_it: 'Got it',
      expense_management: 'Expense Management',
      add_new_expense: 'Add New Expense',
      voice_input: 'Voice Input',
      paste_sms: 'Paste SMS',
      ph_exp_title: 'Expense description (e.g. Store Rent)...',
      ph_exp_cat: 'Category (Select below or type new)...',
      ph_exp_amount: 'Expense amount...',
      save_expense: 'Save Expense',
      search_expense_ph: 'Search expenses...',
      edit_add_product: 'Add / Edit Product',
      product_name: 'Product Name *',
      voice_input_product: 'Voice input for product name',
      import_excel_products: 'Bulk import from Excel',
      system_15_code: '15-Digit System Code (Auto Date & Time)',
      factory_barcode_opt: 'Factory / Company Barcode (Optional)',
      ph_factory_barcode: 'Enter or scan barcode on box or item...',
      scan_factory_barcode: 'Scan factory barcode',
      category: 'Category',
      ph_category_select: 'Type category or select from chips below...',
      stock_qty: 'Stock Quantity',
      buy_price: 'Cost Price',
      auto_calc_margin: 'Auto-calculate sell price by profit margin',
      profit_margin: 'Profit Margin (%)',
      sell_price: 'Sell Price',
      save_product: 'Save Product',
      customer_file: 'Customer File',
      contact_avatar: 'Contact Avatar',
      customer_name: 'Customer Full Name',
      phone_numbers: 'Phone Numbers',
      add_phone: 'Add Phone',
      full_address: 'Full Address',
      save_file: 'Save File',
      supplier_file: 'Supplier File',
      supplier_name: 'Company / Supplier Name',
      add_phone_supp: 'Add Phone',
      full_address_supp: 'Office / Warehouse Address',
      issue_sale_invoice: 'Issue Sales Invoice',
      clear_form: 'Clear',
      select_customer: 'Select Customer',
      invoice_date: 'Invoice Date',
      add_product_item: 'Add Item (Supports Sales Barcode Scan)',
      scan_or_search_barcode: 'Quick Scan or Search Barcode / Item Name',
      ph_sale_barcode_search: 'Scan barcode or search item name...',
      scan_sale_barcode: 'Scan item barcode for sale',
      select_product: 'Select Product from List',
      quantity: 'Quantity',
      unit_price: 'Unit Price',
      add_to_list: 'Add to List',
      registered_items: 'Items in Invoice',
      lbl_invoice_subtotal: 'Invoice Total',
      lbl_discount: 'Discount',
      lbl_receivable: 'Receivable Amount',
      lbl_received: 'Amount Received',
      lbl_remaining: 'Remaining Balance',
      lbl_excess_received: 'Excess Received',
      save_and_issue: 'Save & Issue',
      record_purchase_invoice: 'Record Purchase Invoice',
      supplier: 'Supplier',
      purchase_date: 'Purchase Date',
      add_pur_product_item: 'Add Purchase Item',
      ph_pur_name: 'Product Name *',
      import_excel_pur: 'Bulk import purchase items from Excel',
      ph_pur_factory_barcode: 'Factory barcode if available...',
      ph_pur_cat: 'Category (Select below or type new)...',
      ph_pur_qty: 'Quantity',
      ph_pur_price: 'Unit Buy Price',
      add_to_pur_list: 'Add to Purchase List',
      registered_pur_items: 'Items in Purchase Invoice',
      lbl_payable: 'Payable Amount',
      lbl_paid: 'Amount Paid',
      pur_payment_type_label: 'Supplier Payment Type (Select Chip)',
      lbl_excess_paid: 'Excess Paid',
      record_purchase: 'Record Purchase',
      invoice_preview: 'Official Invoice Preview',
      send_image: 'Image (6 items)',
      daily_calendar_report: 'Daily Report Calendar',
      prev_month: 'Prev Month',
      next_month: 'Next Month',
      daily_report: 'Daily Report',
      select_language: 'Select Language / انتخاب زبان',
      barcode_scanner_title: 'Barcode Scanner',
      barcode_scanner_help: 'Point camera at barcode to scan automatically.',
      close_scanner: 'Close Scanner',
      nav_home: 'Home',
      nav_products: 'Products',
      nav_stock: 'Stock',
      nav_sales: 'Sales',
      nav_purchases: 'Purchases',
      nav_customers: 'Customers',
      nav_suppliers: 'Suppliers',
      unit_currency: 'Toman',
      unit_qty: 'pcs',
      str_debtor: 'Debtor',
      str_settled: 'Settled',
      str_invoice_no: 'Invoice #',
      str_purchase_no: 'Purchase #',
      no_items_found: 'No items added yet',
      no_prod_found: 'No products found',
      no_sale_found: 'No sales invoices recorded',
      no_pur_found: 'No purchase invoices recorded',
      no_cust_found: 'No customers found',
      no_supp_found: 'No suppliers found',
      trans_default_note: 'Account Settlement / Receipt',
      alert_unsettled_cust: '⚠️ System Alert:\nCustomer "{custName}" has unsettled excess received.\nPlease open the customer ledger first and settle the excess before issuing a new invoice.',
      alert_unsettled_supp: '⚠️ System Alert:\nSupplier "{suppName}" has unsettled excess paid.\nPlease open the supplier ledger first and settle the excess before recording a new purchase invoice.'
    }
  };

  function syncDefaultStoreTextsForLanguage() {
    if (typeof db === 'undefined' || !db.settings) return;
    const isEn = (currentLang === 'en');
    const faDefaultTitle = translations.fa.app_brand_name;
    const enDefaultTitle = translations.en.app_brand_name;
    const faDefaultSub = translations.fa.subtitle;
    const enDefaultSub = translations.en.subtitle;

    if (!db.settings.title || db.settings.title === faDefaultTitle || db.settings.title === enDefaultTitle) {
      db.settings.title = isEn ? enDefaultTitle : faDefaultTitle;
    }
    if (!db.settings.subtitle || db.settings.subtitle === faDefaultSub || db.settings.subtitle === enDefaultSub) {
      db.settings.subtitle = isEn ? enDefaultSub : faDefaultSub;
    }

    var cfgTitle = document.getElementById('cfg-title');
    if (cfgTitle && (!cfgTitle.value || cfgTitle.value === faDefaultTitle || cfgTitle.value === enDefaultTitle)) {
      cfgTitle.value = db.settings.title;
    }
    var cfgSub = document.getElementById('cfg-subtitle');
    if (cfgSub && (!cfgSub.value || cfgSub.value === faDefaultSub || cfgSub.value === enDefaultSub)) {
      cfgSub.value = db.settings.subtitle;
    }
  }

  function applyTranslations() {
    const dict = translations[currentLang] || translations.fa;
    syncDefaultStoreTextsForLanguage();

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key]) el.setAttribute('title', dict[key]);
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      if (dict[key]) el.setAttribute('alt', dict[key]);
    });

    if (dict.app_title) document.title = dict.app_title;

    var hTitleEl = document.getElementById('header-title');
    if (hTitleEl) {
      var customTitle = (typeof db !== 'undefined' && db.settings && db.settings.title && db.settings.title.trim() !== '')
        ? db.settings.title.trim()
        : dict.app_brand_name;
      hTitleEl.innerHTML = '<i class="fas fa-shopping-bag"></i> <span>' + customTitle + '</span>';
    }
    var hSubEl = document.getElementById('header-subtitle');
    if (hSubEl) {
      var customSub = (typeof db !== 'undefined' && db.settings && db.settings.subtitle && db.settings.subtitle.trim() !== '')
        ? db.settings.subtitle.trim()
        : dict.subtitle;
      hSubEl.textContent = customSub;
    }

    var prodBarcodeInp = document.getElementById('prod-barcode');
    var prodEditId = document.getElementById('prod-edit-id');
    if (prodBarcodeInp && prodBarcodeInp.value && (!prodEditId || !prodEditId.value)) {
      prodBarcodeInp.value = generate15DigitCode(1, currentLang);
    }

    if (typeof renderCreatorModal === 'function') renderCreatorModal();
    if (typeof renderPaymentTypesSettings === 'function') renderPaymentTypesSettings();
    if (typeof renderSalePaymentChips === 'function') renderSalePaymentChips();
    if (typeof renderPurPaymentChips === 'function') renderPurPaymentChips();
    if (typeof renderLedgerPaymentChips === 'function') renderLedgerPaymentChips();
    if (typeof renderProductCategoryChips === 'function') renderProductCategoryChips();
    if (typeof renderPurCategoryChips === 'function') renderPurCategoryChips();
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('frooshyar_lang', lang);
    
    const htmlTag = document.documentElement;
    if (lang === 'en') {
      htmlTag.setAttribute('lang', 'en');
      htmlTag.setAttribute('dir', 'ltr');
    } else {
      htmlTag.setAttribute('lang', 'fa');
      htmlTag.setAttribute('dir', 'rtl');
    }
    
    var langBtn = document.getElementById('current-lang-btn');
    if(langBtn) langBtn.innerText = lang.toUpperCase();

    var optFa = document.getElementById('lang-opt-fa');
    var optEn = document.getElementById('lang-opt-en');
    if(optFa) optFa.classList.toggle('active', lang === 'fa');
    if(optEn) optEn.classList.toggle('active', lang === 'en');

    var cfgFa = document.getElementById('cfg-lang-fa');
    var cfgEn = document.getElementById('cfg-lang-en');
    if(cfgFa) cfgFa.classList.toggle('active', lang === 'fa');
    if(cfgEn) cfgEn.classList.toggle('active', lang === 'en');

    applyTranslations();

    if(typeof renderAll === 'function') renderAll();
    if(typeof populateSelects === 'function') populateSelects();
    if(typeof renderReports === 'function') renderReports();
    if(typeof renderHelpModal === 'function') renderHelpModal();
    if(typeof initCalendar === 'function') initCalendar();
  }

  function generate15DigitCode(serialIndex, lang) {
    if (!serialIndex || serialIndex < 1) serialIndex = 1;
    if (serialIndex > 999) serialIndex = 999;

    const useGregorian = (lang === 'en') || (typeof currentLang !== 'undefined' && currentLang === 'en');
    var now = new Date();
    var y, m, d;

    if (useGregorian) {
      y = String(now.getFullYear());
      m = String(now.getMonth() + 1).padStart(2, '0');
      d = String(now.getDate()).padStart(2, '0');
    } else {
      var j = gregorianToJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
      y = String(j.jy);
      m = String(j.jm).padStart(2, '0');
      d = String(j.jd).padStart(2, '0');
    }

    var hh = String(now.getHours()).padStart(2, '0');
    var mm = String(now.getMinutes()).padStart(2, '0');
    var ss = String(now.getSeconds()).padStart(2, '0');
    var sss = String(serialIndex).padStart(3, '0');

    return y + m + d + hh + mm + ss + sss;
  }

  function gregorianToJalaali(gy, gm, gd) {
    var g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var jy = (gy <= 1600) ? 0 : 979;
    gy -= (gy <= 1600) ? 621 : 1600;
    var gy2 = (gm > 2) ? (gy + 1) : gy;
    var days = (365 * gy) + (parseInt((gy2 + 3) / 4)) - (parseInt((gy2 + 99) / 100)) + (parseInt((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * (parseInt(days / 12053));
    days %= 12053;
    jy += 4 * (parseInt(days / 1461));
    days %= 1461;
    jy += parseInt((days - 1) / 365);
    if (days > 365) days = (days - 1) % 365;
    var jm = (days < 186) ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
    var jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return { jy: jy, jm: jm, jd: jd };
  }

  function getTodayJalaali() {
    var now = new Date();
    return gregorianToJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }

  function getTodayDateStr() {
    var now = new Date();
    if (currentLang === 'en') {
      var gy = now.getFullYear();
      var gm = String(now.getMonth() + 1).padStart(2, '0');
      var gd = String(now.getDate()).padStart(2, '0');
      return gy + '-' + gm + '-' + gd;
    }
    var j = getTodayJalaali();
    return j.jy + '/' + String(j.jm).padStart(2, '0') + '/' + String(j.jd).padStart(2, '0');
  }

  function initDateDropdowns(yearId, monthId, dayId, targetDate) {
    var ySel = document.getElementById(yearId), mSel = document.getElementById(monthId), dSel = document.getElementById(dayId);
    if(!ySel || !mSel || !dSel) return;
    const isEn = (currentLang === 'en');

    var yHtml = '';
    if (isEn) {
      var curY = new Date().getFullYear();
      for(var y = curY - 3; y <= curY + 2; y++) yHtml += '<option value="'+y+'">'+y+'</option>';
      ySel.innerHTML = yHtml;
      ySel.value = (targetDate && targetDate.gy) ? targetDate.gy : curY;

      var mHtml = '';
      var enMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      for(var m = 1; m <= 12; m++) {
        var val = String(m).padStart(2, '0');
        mHtml += '<option value="'+val+'">'+enMonths[m-1]+'</option>';
      }
      mSel.innerHTML = mHtml;
      mSel.value = (targetDate && targetDate.gm) ? String(targetDate.gm).padStart(2, '0') : String(new Date().getMonth() + 1).padStart(2, '0');

      var dHtml = '';
      for(var d = 1; d <= 31; d++) {
        var dVal = String(d).padStart(2, '0');
        dHtml += '<option value="'+dVal+'">'+d+'</option>';
      }
      dSel.innerHTML = dHtml;
      dSel.value = (targetDate && targetDate.gd) ? String(targetDate.gd).padStart(2, '0') : String(new Date().getDate()).padStart(2, '0');
    } else {
      for(var y = 1400; y <= 1410; y++) yHtml += '<option value="'+y+'">'+y+'</option>';
      ySel.innerHTML = yHtml;
      ySel.value = (targetDate && targetDate.jy) ? targetDate.jy : 1404;

      var mHtml = '';
      var faMonths = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
      for(var m = 1; m <= 12; m++) {
        var val = String(m).padStart(2, '0');
        mHtml += '<option value="'+val+'">'+faMonths[m-1]+'</option>';
      }
      mSel.innerHTML = mHtml;
      mSel.value = (targetDate && targetDate.jm) ? String(targetDate.jm).padStart(2, '0') : '01';

      var dHtml = '';
      for(var d = 1; d <= 31; d++) {
        var dVal = String(d).padStart(2, '0');
        dHtml += '<option value="'+dVal+'">'+d+'</option>';
      }
      dSel.innerHTML = dHtml;
      dSel.value = (targetDate && targetDate.jd) ? String(targetDate.jd).padStart(2, '0') : '01';
    }
  }

  function getDateFromDropdowns(yearId, monthId, dayId) {
    var y = document.getElementById(yearId).value;
    var m = document.getElementById(monthId).value;
    var d = document.getElementById(dayId).value;
    if (currentLang === 'en') {
      return y + '-' + m + '-' + d;
    }
    return y + '/' + m + '/' + d;
  }

  function setDropdownsFromDateStr(yearId, monthId, dayId, dateStr) {
    var todayG = new Date();
    var defaultJ = getTodayJalaali();
    if(!dateStr) {
      initDateDropdowns(yearId, monthId, dayId, currentLang === 'en' ? { gy: todayG.getFullYear(), gm: todayG.getMonth() + 1, gd: todayG.getDate() } : defaultJ);
      return;
    }
    var sep = dateStr.includes('-') ? '-' : '/';
    var parts = dateStr.split(sep);
    if(parts.length === 3) {
      initDateDropdowns(yearId, monthId, dayId, {
        jy: Number(parts[0]), jm: Number(parts[1]), jd: Number(parts[2]),
        gy: Number(parts[0]), gm: Number(parts[1]), gd: Number(parts[2])
      });
    } else {
      initDateDropdowns(yearId, monthId, dayId, currentLang === 'en' ? { gy: todayG.getFullYear(), gm: todayG.getMonth() + 1, gd: todayG.getDate() } : defaultJ);
    }
  }

  const STORAGE_KEY = 'frooshyar_db_v1';

  var db = {
    settings: {
      title: 'فروش‌یار',
      subtitle: 'سیستم جامع حسابداری فروشگاهی',
      logo: '',
      paymentTypes: JSON.parse(JSON.stringify(DEFAULT_PAYMENT_TYPES_FA)),
      banks: [],
      cryptos: [],
      phones: [],
      standaloneAddresses: [],
      socials: []
    },
    products: [],
    sales: [],
    purchases: [],
    expenses: [],
    customers: [],
    suppliers: [],
    ledgerTransactions: [],
    customProductCategories: [],
    deletedProductCategories: [],
    customExpenseCategories: [],
    deletedExpenseCategories: []
  };

  var activeSaleItems = [], activePurItems = [], currentPreviewInvoice = null, currentPreviewType = 'sale';
  var tempCustAvatar = '', tempSuppAvatar = '';
  var selectedSalePaymentTypeId = null;
  var currentSalePaymentDetails = {};
  var selectedPurPaymentTypeId = null;
  var currentPurPaymentDetails = {};
  var selectedLedgerPaymentTypeId = null;
  var currentLedgerPaymentDetails = {};

  function loadDb() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        var parsed = JSON.parse(saved);
        db = Object.assign(db, parsed);
      }
      if (!db.settings) db.settings = {};
      if (!Array.isArray(db.settings.paymentTypes) || db.settings.paymentTypes.length === 0) {
        db.settings.paymentTypes = JSON.parse(JSON.stringify(getDefaultPaymentTypes()));
      }
      if (!Array.isArray(db.settings.banks)) db.settings.banks = [];
      if (!Array.isArray(db.settings.cryptos)) db.settings.cryptos = [];
      if (!Array.isArray(db.settings.phones)) db.settings.phones = [];
      if (!Array.isArray(db.settings.standaloneAddresses)) db.settings.standaloneAddresses = [];
      if (!Array.isArray(db.settings.socials)) db.settings.socials = [];
      if (!Array.isArray(db.products)) db.products = [];
      if (!Array.isArray(db.sales)) db.sales = [];
      if (!Array.isArray(db.purchases)) db.purchases = [];
      if (!Array.isArray(db.expenses)) db.expenses = [];
      if (!Array.isArray(db.customers)) db.customers = [];
      if (!Array.isArray(db.suppliers)) db.suppliers = [];
      if (!Array.isArray(db.ledgerTransactions)) db.ledgerTransactions = [];
      if (!Array.isArray(db.customProductCategories)) db.customProductCategories = [];
      if (!Array.isArray(db.deletedProductCategories)) db.deletedProductCategories = [];
      if (!Array.isArray(db.customExpenseCategories)) db.customExpenseCategories = [];
      if (!Array.isArray(db.deletedExpenseCategories)) db.deletedExpenseCategories = [];
    } catch (e) { console.error(e); }
  }

  function saveDb() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      recalculateAllBalances();
      renderAll();
    } catch (e) { console.error(e); }
  }

  function recalculateAllBalances() {
    (db.customers || []).forEach(c => {
      var name = c.name;
      var totalSales = 0, totalReceived = 0, totalExcess = 0, totalLedgerPaid = 0;

      (db.sales || []).filter(s => s.customer === name).forEach(s => {
        totalSales += Number(s.subtotal || s.total || 0);
        totalReceived += Number(s.received || 0);
        if (s.excess && Number(s.excess) > 0 && !s.excessSettled) {
          totalExcess += Number(s.excess);
        }
      });

      (db.ledgerTransactions || []).filter(t => t.partyName === name && t.partyType === 'customer').forEach(t => {
        totalLedgerPaid += Number(t.amount || 0);
        if (t.excess && Number(t.excess) > 0) {
          totalExcess -= Number(t.excess);
        }
      });

      var netDebt = totalSales - totalReceived - totalLedgerPaid - totalExcess;
      c.debt = netDebt;
    });

    (db.suppliers || []).forEach(s => {
      var name = s.name;
      var totalPurchases = 0, totalPaid = 0, totalExcess = 0, totalLedgerPaid = 0;

      (db.purchases || []).filter(p => p.supplier === name).forEach(p => {
        totalPurchases += Number(p.subtotal || p.total || 0);
        totalPaid += Number(p.paid || 0);
        if (p.excess && Number(p.excess) > 0 && !p.excessSettled) {
          totalExcess += Number(p.excess);
        }
      });

      (db.ledgerTransactions || []).filter(t => t.partyName === name && t.partyType === 'supplier').forEach(t => {
        totalLedgerPaid += Number(t.amount || 0);
        if (t.excess && Number(t.excess) > 0) {
          totalExcess -= Number(t.excess);
        }
      });

      var netBalance = totalPurchases - totalPaid - totalLedgerPaid - totalExcess;
      s.debt = netBalance;
    });
  }

  function fmt(n) {
    if (n === undefined || n === null || isNaN(Number(n))) return '0';
    return Number(n).toLocaleString('en-US');
  }

  function normalizeText(str) {
    if(!str) return '';
    return String(str).trim().replace(/[ي]/g, 'ی').replace(/[ك]/g, 'ک').replace(/[\u064B-\u065F]/g, '').toLowerCase();
  }

  function openModal(id) {
    var m = document.getElementById(id);
    if(m) {
      m.style.display = 'flex';
      if(id === 'modal-ai') {
        if(typeof renderAiAssistant === 'function') renderAiAssistant();
      } else if(id === 'modal-help') {
        if(typeof renderHelpModal === 'function') renderHelpModal();
      } else if(id === 'modal-calendar') {
        if(typeof initCalendar === 'function') initCalendar();
      } else if(id === 'modal-creator') {
        if(typeof renderCreatorModal === 'function') renderCreatorModal();
      } else if(id === 'modal-expense-manager') {
        if(typeof renderExpenseCategoryChips === 'function') renderExpenseCategoryChips();
        if(typeof renderExpensesList === 'function') renderExpensesList();
      }
    }
  }

  function closeModal(id) {
    var m = document.getElementById(id);
    if(m) m.style.display = 'none';
  }

  function showSection(secId, navEl) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    var target = document.getElementById(secId);
    if(target) target.classList.add('active');
    if(navEl) {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      if(navEl.classList && navEl.classList.contains('nav-item')) navEl.classList.add('active');
    }
    if(secId === 'sec-reports' && typeof renderReports === 'function') renderReports();
    if(secId === 'sec-more' && typeof loadSettingsToUI === 'function') loadSettingsToUI();
  }

  function toggleHomeSection(wrapId) {
    var el = document.getElementById(wrapId);
    if(!el) return;
    el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none';
    if(el.style.display === 'block') renderDashboardLists();
  }

  function renderAll() {
    const dict = translations[currentLang] || translations.fa;
    const isEn = (currentLang === 'en');
    var unitStr = dict['unit_currency'] || (isEn ? 'Toman' : 'تومان');
    var qtyStr = dict['unit_qty'] || (isEn ? 'pcs' : 'عدد');

    var totSales = (db.sales || []).reduce((a,b) => a + Number(b.subtotal || b.total || 0), 0);
    var totProfit = (db.sales || []).reduce((a,b) => a + Number(b.profit || 0), 0);
    var totStock = (db.products || []).reduce((a,b) => a + Number(b.qty || 0), 0);
    var totExpense = (db.expenses || []).reduce((a,b) => a + Number(b.amount || 0), 0);

    if(document.getElementById('dash-sales')) document.getElementById('dash-sales').innerText = fmt(totSales) + ' ' + unitStr;
    if(document.getElementById('dash-profit')) document.getElementById('dash-profit').innerText = fmt(totProfit) + ' ' + unitStr;
    if(document.getElementById('dash-stock')) document.getElementById('dash-stock').innerText = fmt(totStock) + ' ' + qtyStr;
    if(document.getElementById('dash-expense')) document.getElementById('dash-expense').innerText = fmt(totExpense) + ' ' + unitStr;

    var hTitleEl = document.getElementById('header-title');
    if(hTitleEl) {
      var tVal = (db.settings && db.settings.title) ? db.settings.title : dict.app_brand_name;
      hTitleEl.innerHTML = '<i class="fas fa-shopping-bag"></i> <span>' + tVal + '</span>';
    }
    var hSubEl = document.getElementById('header-subtitle');
    if(hSubEl) {
      hSubEl.textContent = (db.settings && db.settings.subtitle) ? db.settings.subtitle : dict.subtitle;
    }

    var logoImg = document.getElementById('header-logo');
    if(logoImg) {
      if(db.settings && db.settings.logo) { logoImg.src = db.settings.logo; logoImg.style.display = 'block'; }
      else logoImg.style.display = 'none';
    }

    renderDashboardLists();
    if(typeof renderProducts === 'function') renderProducts();
    if(typeof renderStock === 'function') renderStock();
    if(typeof renderSales === 'function') renderSales();
    if(typeof renderPurchases === 'function') renderPurchases();
    if(typeof renderCustomers === 'function') renderCustomers();
    if(typeof renderSuppliers === 'function') renderSuppliers();
    if(typeof populateSelects === 'function') populateSelects();
  }

  function renderDashboardLists() {
    const dict = translations[currentLang] || translations.fa;
    const isEn = (currentLang === 'en');
    var unitStr = dict['unit_currency'] || (isEn ? 'Toman' : 'تومان');
    var debtors = (db.customers || []).filter(c => Number(c.debt || 0) > 0);
    var dHtml = '';
    debtors.forEach(c => {
      dHtml += '<div class="list-row"><span><b>'+c.name+'</b></span><span style="color:var(--danger); font-weight:700;">'+fmt(c.debt)+' '+unitStr+'</span></div>';
    });
    if(document.getElementById('dash-debtors')) document.getElementById('dash-debtors').innerHTML = dHtml || '<div style="text-align:center; color:#888; font-size:0.8rem; padding:10px;">'+(isEn?'No debtor customers found':'مشتری بدهکاری یافت نشد')+'</div>';

    var creditors = (db.suppliers || []).filter(s => Number(s.debt || 0) > 0);
    var cHtml = '';
    creditors.forEach(s => {
      cHtml += '<div class="list-row"><span><b>'+s.name+'</b></span><span style="color:var(--warning); font-weight:700;">'+fmt(s.debt)+' '+unitStr+'</span></div>';
    });
    if(document.getElementById('dash-creditors')) document.getElementById('dash-creditors').innerHTML = cHtml || '<div style="text-align:center; color:#888; font-size:0.8rem; padding:10px;">'+(isEn?'No creditor suppliers found':'تأمین‌کننده بستانکاری یافت نشد')+'</div>';
  }

  function populateSelects() {
    const isEn = (currentLang === 'en');
    var custSel = document.getElementById('sale-customer');
    if(custSel) {
      var cHtml = '<option value="'+(isEn?'General Customer':'مشتری عمومی')+'">'+(isEn?'General Customer':'مشتری عمومی')+'</option>';
      (db.customers || []).forEach(c => {
        var rem = Number(c.debt || 0);
        var lbl = c.name + (rem > 0 ? ' (' + fmt(rem) + (isEn?' rem.)':' مانده)') : '');
        cHtml += '<option value="'+c.name+'">'+lbl+'</option>';
      });
      custSel.innerHTML = cHtml;
    }

    var suppSel = document.getElementById('pur-supplier');
    if(suppSel) {
      var sHtml = '<option value="'+(isEn?'General Supplier':'تأمین‌کننده عمومی')+'">'+(isEn?'General Supplier':'تأمین‌کننده عمومی')+'</option>';
      (db.suppliers || []).forEach(s => {
        var rem = Number(s.debt || 0);
        var lbl = s.name + (rem > 0 ? ' (' + fmt(rem) + (isEn?' rem.)':' مانده)') : '');
        sHtml += '<option value="'+s.name+'">'+lbl+'</option>';
      });
      suppSel.innerHTML = sHtml;
    }

    var pSel = document.getElementById('sale-input-prod');
    if(pSel) {
      var pHtml = '';
      (db.products || []).forEach(p => {
        var codeLabel = isEn ? 'Code: ' : 'کد: ';
        pHtml += '<option value="'+p.id+'">'+p.name+' ('+codeLabel+p.barcode+' | '+(isEn?'Stock: ':'موجودی: ')+fmt(p.qty)+')</option>';
      });
      pSel.innerHTML = pHtml;
      if(typeof onSaleInputProdChange === 'function') onSaleInputProdChange();
    }

    var cats = new Set();
    if (typeof getDefaultProductCategories === 'function') {
      getDefaultProductCategories().forEach(c => cats.add(c));
    }
    (db.products || []).forEach(p => { if(p.category) cats.add(p.category); });
    if(db.customProductCategories) db.customProductCategories.forEach(c => cats.add(c));
    if(db.deletedProductCategories) db.deletedProductCategories.forEach(c => cats.delete(c));

    var allCatOpt = '<option value="">'+(isEn?'All Categories':'همه دسته‌بندی‌ها')+'</option>';
    cats.forEach(c => { allCatOpt += '<option value="'+c+'">'+c+'</option>'; });

    var fProdCat = document.getElementById('filter-product-cat');
    if(fProdCat) fProdCat.innerHTML = allCatOpt;

    var fStockCat = document.getElementById('filter-stock-cat');
    if(fStockCat) fStockCat.innerHTML = allCatOpt;
  }

  function printElement(elementId) {
    var el = document.getElementById(elementId);
    if(!el) return;
    const isEn = (currentLang === 'en');
    var win = window.open('', '_blank');
    win.document.write('<html><head><title>'+(isEn?'Print':'چاپ')+'</title><link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet"><style>body{font-family:"Vazirmatn",sans-serif; padding:15px; direction:'+(isEn?'ltr':'rtl')+';}</style></head><body>');
    win.document.write(el.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  }

  window.addEventListener('DOMContentLoaded', function() {
    loadDb();
    setLanguage(currentLang);
    recalculateAllBalances();
    renderAll();
  });
