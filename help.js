// فایل راهنمای جامع و دستیار هوشمند ماژولار فروش‌یار
// طراح و معمار نرم‌افزار: علی نصیری صومعه علیا

document.addEventListener("DOMContentLoaded", function() {
    loadHelpContent();
    renderAiAssistantContent();
});

function loadHelpContent() {
    const container = document.getElementById('help-cards-container');
    if (!container) return;

    const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en');
    const fmtNum = (typeof window.fmt === 'function')
        ? window.fmt
        : function(n) { return Number(n || 0).toLocaleString(isEn ? 'en-US' : 'fa-IR'); };

    container.style.maxHeight = "58vh";
    container.style.overflowY = "auto";
    container.style.paddingRight = "6px";
    container.style.paddingLeft = "6px";

    if (isEn) {
        container.innerHTML = `
          <div style="font-size: 0.81rem; color: var(--primary); margin-bottom: 12px; text-align: center; background: #fdf2f8; padding: 10px; border-radius: 10px; border: 1.5px dashed var(--primary); font-weight: bold;">
            🌟 To get the most out of "Frooshyar", follow these steps in order:
          </div>

          <div style="background: #ffffff; border: 1.5px solid #bbf7d0; border-right: 5px solid var(--success); border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: var(--success); font-weight: bold; font-size: 0.9rem;">
              <i class="fas fa-check-circle" style="font-size: 1.1rem;"></i> Store Identity & Backup
            </div>
            <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.6; margin: 0;">
              Enter your store name and subtitle under <b>"More / Settings"</b> so they appear on all invoices. You can also switch the app language right there.<br>
              💡 <b>Tip:</b> Save a <b>Backup</b> file to your device periodically to keep your store data safe.
            </p>
          </div>

          <div style="background: #ffffff; border: 1.5px solid #fbcfe8; border-right: 5px solid var(--primary); border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: var(--primary); font-weight: bold; font-size: 0.9rem;">
              <i class="fas fa-credit-card" style="font-size: 1.1rem;"></i> Cards, Wallets & Contact Info
            </div>
            <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.6; margin: 0;">
              In <b>"More / Settings"</b>, add your bank cards, IBANs, and check the ones you want printed on invoices. Configure payment methods (Cash, Check, POS), addresses, phone numbers, and Crypto wallet addresses here too.
            </p>
          </div>

          <div style="background: #ffffff; border: 1.5px solid #fde68a; border-right: 5px solid var(--warning); border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #d97706; font-weight: bold; font-size: 0.9rem;">
              <i class="fas fa-users" style="font-size: 1.1rem;"></i> Register Customers & Suppliers (Important!)
            </div>
            <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.6; margin: 0;">
              ⚠️ <b>Common Mistake:</b> Before issuing a sale or purchase invoice, make sure your customers or suppliers are registered in the <b>"Customers"</b> or <b>"Suppliers"</b> tabs.
            </p>
          </div>

          <div style="background: #ffffff; border: 1.5px solid #bae6fd; border-right: 5px solid #0284c7; border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #0284c7; font-weight: bold; font-size: 0.9rem;">
              <i class="fas fa-boxes" style="font-size: 1.1rem;"></i> Products & Inventory
            </div>
            <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.6; margin: 0;">
              Add your items with buy and sell prices in the <b>"Products"</b> tab. The app generates a 15-digit system code automatically, and you can also scan factory barcodes with your camera.
            </p>
          </div>

          <div style="background: #ffffff; border: 1.5px solid #fecaca; border-right: 5px solid var(--danger); border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: var(--danger); font-weight: bold; font-size: 0.9rem;">
              <i class="fas fa-receipt" style="font-size: 1.1rem;"></i> Sales & Purchase Invoices
            </div>
            <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.6; margin: 0;">
              In <b>"Sales"</b> or <b>"Purchases"</b>, create invoices, add line items, apply discounts, and select payment details so inventory and party balances update automatically.
            </p>
          </div>

          <div style="background: #ffffff; border: 1.5px solid #e5e7eb; border-right: 5px solid #6b7280; border-radius: 12px; padding: 12px; margin-bottom: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #4b5563; font-weight: bold; font-size: 0.9rem;">
              <i class="fas fa-wallet" style="font-size: 1.1rem;"></i> Expenses & Financial Reports
            </div>
            <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.6; margin: 0;">
              Record rent or daily expenses quickly via <b>Voice Input</b> or <b>Paste SMS</b>. Use Reports and the Calendar to track balances and net profit.
            </p>
          </div>

          <div style="font-size: 0.82rem; color: #1e293b; margin: 16px 0 10px 0; text-align: center; background: #f1f5f9; padding: 8px; border-radius: 8px; font-weight: bold; border: 1px solid #cbd5e1;">
            📚 Detailed Reference Notes
          </div>

          <div style="background: #ffffff; border: 1.5px solid #f5d0fe; border-right: 5px solid #a21caf; border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #a21caf; font-weight: bold; font-size: 0.88rem;">
              <i class="fas fa-sliders-h" style="font-size: 1.05rem;"></i> Dynamic Payment Types Manager
            </div>
            <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.65; margin: 0;">
              Under <b>"Manage Payment Types"</b>, you can customize settlement methods and define custom detail fields for each:<br>
              • <b>1. Methods:</b> Default types (Cash, Check, POS, Card-to-Card) are ready, and you can add new ones or remove unused ones.<br>
              • <b>2. Custom Detail Fields:</b> Use <b>"+ Add Detail Field"</b> under a method to specify extra fields during checkout (e.g., Check number & due date for Checks, or tracking code for Card transfers).<br>
              • <b>3. Two Columns:</b> Enter the <i>Field Label</i> on the right/first box and a <i>Hint/Example</i> on the left/second box; use <b>(×)</b> to remove a field.
            </p>
          </div>

          <div style="background: #ffffff; border: 1.5px solid #c7d2fe; border-right: 5px solid #4f46e5; border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #4f46e5; font-weight: bold; font-size: 0.88rem;">
              <i class="fas fa-clock" style="font-size: 1.05rem;"></i> 15-Digit System Product Code
            </div>
            <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.65; margin: 0;">
              Each 15-digit code encodes structured registration metadata:<br>
              • <b>First 6 digits:</b> Registration <b>date</b>.<br>
              • <b>Next 6 digits:</b> Registration <b>time</b> (hour, minute, second).<br>
              • <b>Last 3 digits:</b> Item <b>sequence/count</b> within that batch/invoice.<br>
              • <b>Benefit:</b> Gives every item—even handmade or barcode-free goods—a unique, traceable code.
            </p>
          </div>

          <div style="background: #ffffff; border: 1.5px solid #ddd6fe; border-right: 5px solid #7c3aed; border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #7c3aed; font-weight: bold; font-size: 0.88rem;">
              <i class="fas fa-barcode" style="font-size: 1.05rem;"></i> Factory Barcode vs. System Code
            </div>
            <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.65; margin: 0;">
              Standard retail barcodes identify manufacturer/product codes and include a check digit. Scanning factory barcodes with your camera speeds up lookup, while the 15-digit system code handles items without factory barcodes.
            </p>
          </div>

          <div style="background: #ffffff; border: 1.5px solid #a7f3d0; border-right: 5px solid #059669; border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #059669; font-weight: bold; font-size: 0.88rem;">
              <i class="fas fa-exchange-alt" style="font-size: 1.05rem;"></i> Excess Received & Excess Paid
            </div>
            <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.65; margin: 0;">
              • <b>Excess Received:</b> When a customer pays more than the invoice receivable amount, the extra amount is tracked as excess received so it is never lost.<br>
              • <b>Excess Paid:</b> When you pay a supplier more than the invoice payable amount, the extra amount is tracked as excess paid for future settlements.
            </p>
          </div>

          <div style="background: #ffffff; border: 1.5px solid #fed7aa; border-right: 5px solid #ea580c; border-radius: 12px; padding: 12px; margin-bottom: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #ea580c; font-weight: bold; font-size: 0.88rem;">
              <i class="fas fa-book-open" style="font-size: 1.05rem;"></i> Why Ledger Entries Matter
            </div>
            <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.65; margin: 0;">
              Recording partial payments, settlements, and excess amounts in the <b>Ledger</b> keeps every customer and supplier balance accurate and transparent at all times.
            </p>
          </div>
        `;
        return;
    }

    container.innerHTML = `
      <div style="font-size: 0.81rem; color: var(--primary); margin-bottom: 12px; text-align: center; background: #fdf2f8; padding: 10px; border-radius: 10px; border: 1.5px dashed var(--primary); font-weight: bold;">
        🌟 کاسب عزیز، برای اینکه «فروش‌یار» مثل ساعت برایت کار کند، این مراحل را به ترتیب طی کن:
      </div>

      <div style="background: #ffffff; border: 1.5px solid #bbf7d0; border-right: 5px solid var(--success); border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: var(--success); font-weight: bold; font-size: 0.9rem;">
          <i class="fas fa-check-circle" style="font-size: 1.1rem;"></i> هویت مغازه و پشتیبان‌گیری
        </div>
        <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.6; margin: 0;">
          اسم مغازه و شعارت رو در بخش <b>«بیشتر / تنظیمات»</b> وارد کن تا پایین تمام فاکتورها چاپ بشه. زبان برنامه رو هم همینجا انتخاب کن.<br>
          💡 <b>یادت نره:</b> هر چند وقت یک‌بار از همین بخش تنظیمات، یک <b>فایل پشتیبان (Backup)</b> توی گوشیت ذخیره کن تا خیالت از امنیت اطلاعاتت راحت باشه.
        </p>
      </div>

      <div style="background: #ffffff; border: 1.5px solid #fbcfe8; border-right: 5px solid var(--primary); border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: var(--primary); font-weight: bold; font-size: 0.9rem;">
          <i class="fas fa-credit-card" style="font-size: 1.1rem;"></i> ست کردن کارت‌ها و درگاه‌ها
        </div>
        <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.6; margin: 0;">
          باز هم در بخش <b>«بیشتر / تنظیمات»</b>، شماره کارت، شبا و حساب‌های بانکی‌تو وارد کن و تیک‌شون رو بزن تا خودکار زیر فاکتور مشتری بنشیند. روش‌های تسویه (نقدی، چک، کارت‌خوان)، آدرس‌ها، شماره‌های تماس و آدرس کیف‌پول رمزارز (Crypto) رو هم همینجا ردیف کن.
        </p>
      </div>

      <div style="background: #ffffff; border: 1.5px solid #fde68a; border-right: 5px solid var(--warning); border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #d97706; font-weight: bold; font-size: 0.9rem;">
          <i class="fas fa-users" style="font-size: 1.1rem;"></i> ثبت مشتریان و تأمین‌کنندگان (بسیار مهم!)
        </div>
        <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.6; margin: 0;">
          ⚠️ <b>اشتباه رایج:</b> حواست باشه! قبل از اینکه بخوای فاکتور فروش یا خرید بزنی، اول باید اسم و مشخصات مشتری یا تأمین‌کننده‌ات رو توی تب‌های <b>«مشتریان»</b> یا <b>«تأمین»</b> ثبت کرده باشی تا موقع فاکتور زدن معطل نشی.
        </p>
      </div>

      <div style="background: #ffffff; border: 1.5px solid #bae6fd; border-right: 5px solid #0284c7; border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #0284c7; font-weight: bold; font-size: 0.9rem;">
          <i class="fas fa-boxes" style="font-size: 1.1rem;"></i> بارگذاری کالاها و انبارداری
        </div>
        <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.6; margin: 0;">
          در تب <b>«کالاها»</b>، جنس‌هات رو با قیمت خرید و فروش وارد کن. برنامه خودش یک کد ۱۵ رقمی سیستمی میده، ولی اگر بارکد کارخانه‌ای هم روی جعبه هست، می‌تونی با دوربین گوشی اسکن کنی و راحت توی انبار داشته باشیش.
        </p>
      </div>

      <div style="background: #ffffff; border: 1.5px solid #fecaca; border-right: 5px solid var(--danger); border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: var(--danger); font-weight: bold; font-size: 0.9rem;">
          <i class="fas fa-receipt" style="font-size: 1.1rem;"></i> صدور فاکتورهای فروش و خرید
        </div>
        <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.6; margin: 0;">
          حالا در تب‌های <b>«فروش»</b> یا <b>«خرید»</b>، فاکتور رسمی صادر کن، اقلام رو اضافه کن، تخفیف بده و نحوه تسویه یا پرداخت رو مشخص کن تا انبار و حساب طرف مقابل خودکار به‌روز بشه.
        </p>
      </div>

      <div style="background: #ffffff; border: 1.5px solid #e5e7eb; border-right: 5px solid #6b7280; border-radius: 12px; padding: 12px; margin-bottom: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #4b5563; font-weight: bold; font-size: 0.9rem;">
          <i class="fas fa-wallet" style="font-size: 1.1rem;"></i> ثبت هزینه‌ها و گزارشات مالی
        </div>
        <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.6; margin: 0;">
          کرایه مغازه یا هزینه‌های روزمره رو می‌تونی با <b>ورودی صوتی یا الصاق پیامک</b> خیلی سریع ثبت کنی. از بخش گزارشات و تقویم هم می‌تونی مانده حساب‌ها و سود و زیان مغازه رو به راحتی زیر نظر داشته باشی.
        </p>
      </div>

      <div style="font-size: 0.82rem; color: #1e293b; margin: 16px 0 10px 0; text-align: center; background: #f1f5f9; padding: 8px; border-radius: 8px; font-weight: bold; border: 1px solid #cbd5e1;">
        📚 نکات تشریحی و دقیق برای درک کامل بخش‌ها
      </div>

      <div style="background: #ffffff; border: 1.5px solid #f5d0fe; border-right: 5px solid #a21caf; border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #a21caf; font-weight: bold; font-size: 0.88rem;">
          <i class="fas fa-sliders-h" style="font-size: 1.05rem;"></i> آموزش سامانه پویای مدیریت انواع دریافت و پرداخت
        </div>
        <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.65; margin: 0;">
          در بخش <b>«مدیریت انواع دریافت و پرداخت»</b> می‌توانی روش‌های تسویه مغازه را دقیقاً مطابق نیاز خودت بسازی و برای هرکدام فرم اطلاعات اختصاصی تعریف کنی:<br>
          • <b>۱. تعریف و مدیریت روش‌ها:</b> روش‌های پیش‌فرض (مثل نقد، چک، کارت‌خوان و کارت‌به‌کارت) از قبل آماده هستند و با دکمه <b>«+ افزودن نوع دریافت/پرداخت جدید»</b> می‌توانی روش‌های دلخواهت (مثل رمزارز، حواله پایا یا بن تخفیف) را اضافه یا روش‌های غیرضروری را حذف کنی.<br>
          • <b>۲. کادرهای جزئیات اختصاصی چیست؟</b> هر روش تسویه هنگام ثبت فاکتور یا سند، به اطلاعات خاصی نیاز دارد. با زدن دکمه <b>«+ افزودن کادر جزئیات»</b> زیر هر روش، تعیین می‌کنی موقع ثبت تراکنش چه فیلدهایی از کاربر پرسیده شود:<br>
          &nbsp;&nbsp;- <b>نقد:</b> نیازی به جزئیات اضافه ندارد و فقط مبلغ ثبت می‌شود.<br>
          &nbsp;&nbsp;- <b>چک:</b> کادرهایی مثل <i>شماره چک، نام صادرکننده، تاریخ سررسید و نام بانک/شعبه</i> تعریف می‌شود.<br>
          &nbsp;&nbsp;- <b>کارت‌خوان (پوز) و کارت‌به‌کارت:</b> کادرهایی مثل <i>شماره تراکنش/کد رهگیری و نام دستگاه یا بانک</i> قرار می‌گیرد.<br>
          • <b>۳. راهنمای پر کردن دو ستون در تنظیمات کادر:</b> برای هر کادر جدید که می‌سازی، دو جای خالی می‌بینی: در <b>کادر سمت راست</b> «عنوان فیلد» را بنویس (مثلاً: <i>کد رهگیری</i>) و در <b>کادر سمت چپ</b> یک «متن راهنما یا مثال» بنویس (مثلاً: <i>مثلاً: ۱۲۳۹۸۷</i>) تا موقع فاکتور زدن یادت بماند چه عددی وارد کنی. با دکمه قرمز <b>(×)</b> هم هر کادری را که نخواستی پاک می‌کنی.
        </p>
      </div>

      <div style="background: #ffffff; border: 1.5px solid #c7d2fe; border-right: 5px solid #4f46e5; border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #4f46e5; font-weight: bold; font-size: 0.88rem;">
          <i class="fas fa-clock" style="font-size: 1.05rem;"></i> ساختار دقیق کد کالا (۱۵ رقمی) و کاربرد عملی آن
        </div>
        <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.65; margin: 0;">
          این کد از ۱۵ رقم تشکیل شده و هر بخشش معنی مشخصی دارد:<br>
          • <b>۶ رقم اول:</b> نشان‌دهنده <b>تاریخ</b> ثبت است.<br>
          • <b>۶ رقم بعدی:</b> نشان‌دهنده <b>زمان</b> (ساعت، دقیقه و ثانیه) ثبت است.<br>
          • <b>۳ رقم آخر:</b> گویای <b>تعداد اقلام ثبت‌شده</b> در همان زمان/فاکتور است (تا اگر چند قلم در یک لحظه یا یک فاکتور ثبت شوند، هرکدام ترتیب و شمارنده خودش را داشته باشد).<br>
          • <b>فایده‌اش چیست؟</b> با یک نگاه به عدد می‌توانی بفهمی این کالا دقیقاً چه روزی و در چه ساعتی وارد سیستم شده و چندمین قلمِ ثبت‌شده در آن لحظه بوده است؛ مثلاً وقتی یک جنس را در دو تاریخ با دو قیمت خریدی، قاطی نمی‌کنی و برای اجناس دست‌ساز یا بدون بارکد هم یک کد یکتا و منظم داری.
        </p>
      </div>

      <div style="background: #ffffff; border: 1.5px solid #ddd6fe; border-right: 5px solid #7c3aed; border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #7c3aed; font-weight: bold; font-size: 0.88rem;">
          <i class="fas fa-barcode" style="font-size: 1.05rem;"></i> ساختار بارکد و تفاوتش با کد سیستمی
        </div>
        <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.65; margin: 0;">
          بارکد روی جعبه یا لیبل کالا از خطوط عمودی با ضخامت‌های متفاوت و یک رشته‌عدد تشکیل شده است. در بارکدهای استاندارد کالا (مثل بارکدهای ۱۳ رقمی)، بخش اول معمولاً به <b>کد کشور/تولیدکننده</b>، بخش وسط به <b>کد محصول</b> و رقم آخر به <b>رقم کنترلی (Check Digit)</b> اختصاص دارد تا اسکنر خطای خواندن را تشخیص دهد.<br>
          • <b>کاربردش در کار روزمره:</b> وقتی کالا بارکد کارخانه‌ای دارد، با اسکنر گوشی بدون تایپ دستی و بدون اشتباه بین مدل‌های مشابه، همان کالا را صدا می‌زنی یا ثبت می‌کنی. اگر هم کالا بارکد نداشته باشد، همان کد ۱۵ رقمیِ خودِ برنامه کارش را راه می‌اندازد.
        </p>
      </div>

      <div style="background: #ffffff; border: 1.5px solid #a7f3d0; border-right: 5px solid #059669; border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #059669; font-weight: bold; font-size: 0.88rem;">
          <i class="fas fa-exchange-alt" style="font-size: 1.05rem;"></i> مازاد دریافت و مازاد پرداخت یعنی چه و چطور کار می‌کند؟
        </div>
        <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.65; margin: 0;">
          • <b>مازاد دریافت:</b> فرض کن فاکتور مشتری ۸۰۰ هزار تومان است ولی مشتری ۱ میلیون تومان واریز می‌کند یا بابت حساب قبلی/گرد کردن وجه مبلغ بیشتری می‌دهد؛ این ۲۰۰ هزار تومان اضافه در <b>مازاد دریافت</b> ثبت می‌شود تا پول اضافی گم نشود.<br>
          • <b>مازاد پرداخت:</b> زمانی است که شما به تأمین‌کننده مبلغی بیشتر از بدهی یا مانده فاکتور پرداخت می‌کنید؛ این مبلغ اضافه در <b>مازاد پرداخت</b> می‌آید تا در خریدهای بعدی یا تسویه حساب‌ها دقیقاً مشخص باشد چقدر اضافه پرداخت کرده‌اید.
        </p>
      </div>

      <div style="background: #ffffff; border: 1.5px solid #fed7aa; border-right: 5px solid #ea580c; border-radius: 12px; padding: 12px; margin-bottom: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #ea580c; font-weight: bold; font-size: 0.88rem;">
          <i class="fas fa-book-open" style="font-size: 1.05rem;"></i> چرا ثبت تراکنش‌ها در دفتر حساب ضروری است؟
        </div>
        <p style="font-size: 0.8rem; color: #4b5563; line-height: 1.65; margin: 0;">
          بسیاری از خرید و فروش‌ها یا تسویه‌ها یک‌جا و نقدی تمام نمی‌شوند؛ مشتری بخشی را می‌دهد و بقیه می‌ماند، یا شما قسطی/مرحله‌ای به تأمین‌کننده پول می‌دهید. اگر هر دریافت، پرداخت یا مازاد را در <b>دفتر حساب</b> ثبت کنی:<br>
          • مانده واقعی هر مشتری و تأمین‌کننده همیشه جلوی چشمت است و جای بحث و فراموشی نمی‌ماند.<br>
          • در زمان تسویه حساب یا ارائه گزارش، همه‌چیز با سند و عدد دقیق در می‌آید و جلوی خطا و اختلاف حساب گرفته می‌شود.
        </p>
      </div>
    `;
}

// ==========================================
// دستیار هوشمند فروش‌یار (AI) - تحلیل و مشاوره سریع
// ==========================================

function renderAiAssistantContent() {
  const aiBody = document.getElementById('ai-content-body');
  if (!aiBody) return;

  const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en');
  const dict = (typeof translations !== 'undefined' && translations[currentLang]) ? translations[currentLang] : {};
  const unitStr = dict['unit_currency'] || (isEn ? 'Toman' : 'تومان');
  const qtyUnitStr = dict['unit_qty'] || (isEn ? 'pcs' : 'عدد');
  const personUnitStr = isEn ? 'people' : 'نفر';

  const safeDb = (typeof window.db !== 'undefined' && window.db) ? window.db : {};
  const formatNum = (typeof window.fmt === 'function')
    ? window.fmt
    : function(n) { return Number(n || 0).toLocaleString(isEn ? 'en-US' : 'fa-IR'); };

  const sales = Array.isArray(safeDb.sales) ? safeDb.sales : [];
  const purchases = Array.isArray(safeDb.purchases) ? safeDb.purchases : [];
  const expenses = Array.isArray(safeDb.expenses) ? safeDb.expenses : [];
  const products = Array.isArray(safeDb.products) ? safeDb.products : [];
  const customers = Array.isArray(safeDb.customers) ? safeDb.customers : [];

  let totalSales = 0, totalProfit = 0;
  sales.forEach(s => {
    totalSales += Number(s.subtotal || s.total || 0);
    totalProfit += Number(s.profit || 0);
  });

  let totalExpenses = 0;
  expenses.forEach(e => {
    totalExpenses += Number(e.amount || 0);
  });

  let totalStockQty = 0, lowStockCount = 0;
  products.forEach(p => {
    const qty = Number(p.qty || p.stock || 0);
    totalStockQty += qty;
    if (qty <= 3) lowStockCount++;
  });

  const netProfit = totalProfit - totalExpenses;

  let smartTip = '';
  if (isEn) {
    if (sales.length === 0 && products.length === 0) {
      smartTip = 'No products or invoices have been recorded yet. Start by adding customers and products so accurate sales and profit insights can be generated.';
    } else if (lowStockCount > 0) {
      smartTip = `${lowStockCount} item(s) in inventory are running low (3 or fewer units); consider creating a new purchase order to avoid stockouts.`;
    } else if (netProfit < 0) {
      smartTip = 'Recorded expenses exceed gross profit from sales; review operating expenses and monitor product profit margins.';
    } else {
      smartTip = 'Overall store performance looks healthy; save a Backup file periodically under Settings to protect your data.';
    }
  } else {
    if (sales.length === 0 && products.length === 0) {
      smartTip = 'هنوز کالا یا فاکتوری ثبت نشده است. برای شروع، ابتدا مشتری‌ها و کالاها را وارد کنید تا تحلیل دقیق فروش و سود برایتان ساخته شود.';
    } else if (lowStockCount > 0) {
      smartTip = `تعداد ${formatNum(lowStockCount)} قلم کالا در انبار رو به اتمام (کمتر یا مساوی ۳ عدد) هستند؛ پیشنهاد می‌کنم برای جلوگیری از کمبود موجودی، سفارش خرید جدید ثبت کنید.`;
    } else if (netProfit < 0) {
      smartTip = 'مجموع هزینه‌های ثبت‌شده از سود ناخالص فروش بیشتر شده است؛ هزینه‌های جاری را بررسی کنید و حاشیه سود کالاها را کنترل نمایید.';
    } else {
      smartTip = 'عملکرد کلی فروشگاه در وضعیت مطلوب است؛ برای حفظ امنیت اطلاعات، به‌صورت دوره‌ای از بخش تنظیمات فایل پشتیبان (Backup) تهیه کنید.';
    }
  }

  if (isEn) {
    aiBody.innerHTML = `
      <div style="background:#fdf2f8; border:1.5px dashed var(--primary); border-radius:12px; padding:10px; margin-bottom:12px; font-size:0.8rem; color:#831843; font-weight:bold; text-align:center;">
        ✨ Smart Store Status Analysis
      </div>

      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; margin-bottom:12px;">
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:8px; text-align:center;">
          <div style="font-size:0.72rem; color:#15803d;">Total Sales</div>
          <div style="font-size:0.88rem; font-weight:bold; color:#166534;">${formatNum(totalSales)} ${unitStr}</div>
        </div>
        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; padding:8px; text-align:center;">
          <div style="font-size:0.72rem; color:#1d4ed8;">Estimated Net Profit</div>
          <div style="font-size:0.88rem; font-weight:bold; color:${netProfit >= 0 ? '#1e40af' : '#b91c1c'};">${formatNum(netProfit)} ${unitStr}</div>
        </div>
        <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:8px; text-align:center;">
          <div style="font-size:0.72rem; color:#b45309;">Total Stock Qty</div>
          <div style="font-size:0.88rem; font-weight:bold; color:#92400e;">${formatNum(totalStockQty)} ${qtyUnitStr}</div>
        </div>
        <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:10px; padding:8px; text-align:center;">
          <div style="font-size:0.72rem; color:#b91c1c;">Customers Count</div>
          <div style="font-size:0.88rem; font-weight:bold; color:#991b1b;">${formatNum(customers.length)} ${personUnitStr}</div>
        </div>
      </div>

      <div style="background:#ffffff; border:1px solid #e2e8f0; border-right:4px solid var(--primary); border-radius:10px; padding:10px; margin-bottom:12px; font-size:0.8rem; color:#334155; line-height:1.65;">
        <b>💡 Smart Recommendation:</b><br>
        ${smartTip}
      </div>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px; font-size:0.78rem; color:#475569; line-height:1.6;">
        <b>📌 Helpful Shortcuts:</b><br>
        • In Expense entry, you can use <b>Voice Input</b> or <b>Paste SMS</b>.<br>
        • In Products and Sales, use the <b>Barcode Scanner</b> for faster entry.<br>
        • Recorded counts: <b>${formatNum(sales.length)}</b> sales, <b>${formatNum(purchases.length)}</b> purchases, and <b>${formatNum(expenses.length)}</b> expenses.
      </div>
    `;
    return;
  }

  aiBody.innerHTML = `
    <div style="background:#fdf2f8; border:1.5px dashed var(--primary); border-radius:12px; padding:10px; margin-bottom:12px; font-size:0.8rem; color:#831843; font-weight:bold; text-align:center;">
      ✨ تحلیل هوشمند وضعیت فعلی فروشگاه
    </div>

    <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; margin-bottom:12px;">
      <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:8px; text-align:center;">
        <div style="font-size:0.72rem; color:#15803d;">فروش کل</div>
        <div style="font-size:0.88rem; font-weight:bold; color:#166534;">${formatNum(totalSales)} ${unitStr}</div>
      </div>
      <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; padding:8px; text-align:center;">
        <div style="font-size:0.72rem; color:#1d4ed8;">سود خالص تخمینی</div>
        <div style="font-size:0.88rem; font-weight:bold; color:${netProfit >= 0 ? '#1e40af' : '#b91c1c'};">${formatNum(netProfit)} ${unitStr}</div>
      </div>
      <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:8px; text-align:center;">
        <div style="font-size:0.72rem; color:#b45309;">موجودی کل انبار</div>
        <div style="font-size:0.88rem; font-weight:bold; color:#92400e;">${formatNum(totalStockQty)} ${qtyUnitStr}</div>
      </div>
      <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:10px; padding:8px; text-align:center;">
        <div style="font-size:0.72rem; color:#b91c1c;">تعداد مشتریان</div>
        <div style="font-size:0.88rem; font-weight:bold; color:#991b1b;">${formatNum(customers.length)} ${personUnitStr}</div>
      </div>
    </div>

    <div style="background:#ffffff; border:1px solid #e2e8f0; border-right:4px solid var(--primary); border-radius:10px; padding:10px; margin-bottom:12px; font-size:0.8rem; color:#334155; line-height:1.65;">
      <b>💡 پیشنهاد هوشمند:</b><br>
      ${smartTip}
    </div>

    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px; font-size:0.78rem; color:#475569; line-height:1.6;">
      <b>📌 میانبرهای کاربردی:</b><br>
      • در ثبت هزینه می‌توانید از <b>ورودی صوتی</b> یا <b>الصاق پیامک</b> استفاده کنید.<br>
      • در ثبت کالا و فروش می‌توانید از <b>اسکنر بارکد</b> برای سرعت بیشتر بهره ببرید.<br>
      • آمار ثبت‌شده: <b>${formatNum(sales.length)}</b> فاکتور فروش، <b>${formatNum(purchases.length)}</b> فاکتور خرید و <b>${formatNum(expenses.length)}</b> هزینه.
    </div>
  `;
}

(function() {
  const origOpenModalAi = window.openModal;
  if (typeof origOpenModalAi === 'function' && !origOpenModalAi._wrappedForAi) {
    const wrappedAi = function(modalId) {
      origOpenModalAi.apply(this, arguments);
      if (modalId === 'modal-ai') {
        renderAiAssistantContent();
      } else if (modalId === 'modal-help') {
        loadHelpContent();
      }
    };
    wrappedAi._wrappedForAi = true;
    window.openModal = wrappedAi;
  }
})();

document.addEventListener('click', function(e) {
  if (e.target.closest('[onclick*="modal-ai"]')) {
    setTimeout(renderAiAssistantContent, 40);
  } else if (e.target.closest('[onclick*="modal-help"]')) {
    setTimeout(loadHelpContent, 40);
  }
});
