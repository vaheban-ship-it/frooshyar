// ==========================================================================
// سیستم تایمر مستقل و محافظت از کپی/اشتراک‌گذاری غیرمجاز (فروش‌یار)
// ==========================================================================

(function() {
    // ۱. تنظیمات زمان تست (به صورت پیش‌فرض 0 یعنی بدون محدودیت زمانی)
    // نکته: اگر خواستید برای کاربری محدودیت اعمال کنید، این مقدار را به تعداد روز دلخواه (مثلا 30) تغییر دهید.
    const TRIAL_DAYS = 0; 

    // ۲. سیستم تشخیص اشتراک‌گذاری غیرمجاز (جلوگیری از کپی PWA یا APK برای دیگران)
    function verifyAppIntegrity() {
        const masterKey = 'app_master_owner_device_signature';
        let deviceSignature = localStorage.getItem(masterKey);
        
        const currentDeviceFingerprint = 'DEV_' + (navigator.hardwareConcurrency || 4) + '_' + screen.width + 'x' + screen.height + '_' + (navigator.deviceMemory || 4);

        if (!deviceSignature) {
            // اولین نصبی که برنامه روی آن اجرا شده است (صاحب اصلی یا دستگاه مرجع)
            localStorage.setItem(masterKey, currentDeviceFingerprint);
            localStorage.setItem('app_is_original_install', 'true');
        } else {
            // اگر برنامه به دستگاه دیگری شیر/کپی شده باشد، اثر انگشت سخت‌افزاری یا مرورگر تغییر می‌کند
            // یا اگر فایل localStorage در انتقال پاک/جایگزین شود، می توانیم وضعیت را بررسی کنیم:
            const isOriginal = localStorage.getItem('app_is_original_install');
            if (!isOriginal && deviceSignature !== currentDeviceFingerprint) {
                return false; // انتقال غیرمجاز شناسایی شد
            }
        }
        return true;
    }

    // ۳. بررسی وضعیت اعتبار تایمر و لایسنس
    function checkTrialLicense() {
        // ابتدا بررسی اصالت (جلوگیری از شیر کردن برنامه)
        if (!verifyAppIntegrity()) {
            showViolationScreen('اشتراک‌گذاری غیرمجاز', 'این نسخه از برنامه روی دستگاه دیگری ایجاد شده و قابل انتقال و اشتراک‌گذاری مستقیم نیست. لطفاً نسخه اختصاصی خود را تهیه کنید.');
            return false;
        }

        // اگر محدودیت زمانی غیرفعال بود (صفر یا منفی)، نیازی به بررسی تایمر نیست
        if (TRIAL_DAYS <= 0) {
            return true;
        }

        const storageKey = 'app_trial_start_timestamp';
        let trialStart = localStorage.getItem(storageKey);
        const currentTime = new Date().getTime();

        if (!trialStart) {
            localStorage.setItem(storageKey, currentTime);
            trialStart = currentTime;
        }

        const elapsedMilliseconds = currentTime - parseInt(trialStart, 10);
        const elapsedDays = elapsedMilliseconds / (1000 * 60 * 60 * 24);
        const remainingDays = Math.max(0, Math.ceil(TRIAL_DAYS - elapsedDays));

        if (elapsedDays > TRIAL_DAYS) {
            showViolationScreen('مهلت نسخه آزمایشی به پایان رسید', `مدت زمان استفاده آزمایشی (${TRIAL_DAYS} روزه) این نرم‌افزار به اتمام رسیده است. برای تمدید یا خرید نسخه دائمی با پشتیبانی تماس بگیرید.`);
            return false;
        } else {
            console.log(`وضعیت لایسنس: فعال. ${remainingDays} روز از مهلت تست باقی مانده است.`);
            return true;
        }
    }

    // ۴. صفحه مسدودکننده در صورت اتمام مهلت یا اشتراک‌گذاری غیرمجاز
    function showViolationScreen(title, message) {
        document.addEventListener('DOMContentLoaded', function() {
            // تولید شناسه یکتای دستگاه جهت ارسال به پشتیبانی
            let deviceId = localStorage.getItem('app_device_unique_id');
            if (!deviceId) {
                deviceId = 'DEV_' + Math.random().toString(36).substring(2, 9).toUpperCase() + '_' + Date.now().toString(36);
                localStorage.setItem('app_device_unique_id', deviceId);
            }

            document.body.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #1a1a1a; display: flex; justify-content: center; align-items: center; font-family: Tahoma, sans-serif; direction: rtl; z-index: 999999; padding: 20px; box-sizing: border-box;">
                    <div style="background: #ffffff; padding: 30px; border-radius: 14px; text-align: center; max-width: 420px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                        <div style="font-size: 45px; margin-bottom: 10px;">⚠️</div>
                        <h2 style="color: #d9534f; margin-bottom: 15px; font-size: 19px;">${title}</h2>
                        <p style="color: #555; line-height: 1.6; font-size: 13.5px; margin-bottom: 20px;">
                            ${message}
                        </p>
                        <div style="background: #f4f6f8; padding: 10px; border-radius: 6px; margin-bottom: 20px; border: 1px dashed #ccc;">
                            <span style="font-size: 11.5px; color: #666; display: block; margin-bottom: 4px;">شناسه اختصاصی این دستگاه:</span>
                            <code style="font-size: 12.5px; color: #333; font-weight: bold; user-select: all;">${deviceId}</code>
                        </div>
                        <button onclick="alert('لطفاً شناسه دستگاه را برای سازنده (علی نصیری صومعه علیا) ارسال کنید.')" style="background: #0275d8; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; width: 100%;">ارتباط با پشتیبانی</button>
                    </div>
                </div>
            `;
        });
    }

    // اجرای ارزیابی لایسنس و امنیت
    window.isAppTrialValid = checkTrialLicense();
})();
