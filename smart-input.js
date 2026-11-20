// ==========================================
// smart-input.js - ماژول ورودی هوشمند صوتی، پیامک و اسکنر زنده بارکد با دوربین
// ==========================================

let activeInputId = 'prod-name'; // پیش‌فرض روی نام کالا

document.addEventListener('click', function(event) {
    if (event.target && (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')) {
        if (event.target.id) {
            activeInputId = event.target.id;
        }
    }
});

document.addEventListener('focusin', function(event) {
    if (event.target && (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')) {
        if (event.target.id) {
            activeInputId = event.target.id;
        }
    }
});

// تابع ورودی صوتی هوشمند
function initVoiceInput(targetInputId, buttonElement) {
    const targetId = targetInputId || activeInputId || 'prod-name';
    const inputField = document.getElementById(targetId);

    if (!inputField) {
        alert("لطفاً ابتدا روی کادر مورد نظر کلیک کنید.");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("مرورگر شما از تشخیص گفتار پشتیبانی نمی‌کند.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fa-IR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
        if (buttonElement) buttonElement.classList.add('listening');
    };

    recognition.onresult = function(event) {
        const speechResult = event.results[0][0].transcript;
        inputField.value = speechResult;
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
        inputField.focus();
    };

    recognition.onerror = function(event) {
        console.error("خطای صوت:", event.error);
        if (buttonElement) buttonElement.classList.remove('listening');
        alert("خطا در دریافت صدا: " + event.error);
    };

    recognition.onend = function() {
        if (buttonElement) buttonElement.classList.remove('listening');
    };

    try {
        recognition.start();
    } catch (err) {
        console.error(err);
        if (buttonElement) buttonElement.classList.remove('listening');
    }
}

// تابع ورودی الصاق پیامک
async function pasteSmsExpenseText(titleInputId, amountInputId) {
    const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en');
    try {
        if (!navigator.clipboard || !navigator.clipboard.readText) {
            alert(isEn ? 'Clipboard access not supported.' : 'مرورگر شما از دسترسی مستقیم به کلیپ‌بورد پشتیبانی نمی‌کند.');
            return;
        }
        const text = await navigator.clipboard.readText();
        if (!text) {
            alert(isEn ? 'Clipboard is empty.' : 'متنی در حافظه موقت (کلیپ‌بورد) یافت نشد.');
            return;
        }
        
        const titleField = document.getElementById(titleInputId);
        const amountField = document.getElementById(amountInputId);
        
        if (titleField) {
            const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            let shortTitle = lines[0] || 'هزینه پیامکی';
            
            if (shortTitle.length > 35 || shortTitle.includes('http')) {
                shortTitle = 'قبض خدماتی';
            }
            
            titleField.value = shortTitle;
            titleField.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        const cleanedText = text.replace(/٬/g, ',').replace(/,/g, '');
        let targetAmount = null;
        let targetUnit = 'تومان';

        const payableMatch = cleanedText.match(/(?:قابل\s*پرداخت|مبلغ\s*قابل\s*پرداخت)[:\s]*([\d\.]+)\s*(ریال|تومان)/i);
        if (payableMatch) {
            targetAmount = parseFloat(payableMatch[1]);
            targetUnit = payableMatch[2];
        } else {
            const allMatches = [...cleanedText.matchAll(/([\d\.]+)\s*(ریال|تومان)/ig)];
            if (allMatches.length > 0) {
                const lastMatch = allMatches[allMatches.length - 1];
                targetAmount = parseFloat(lastMatch[1]);
                targetUnit = lastMatch[2];
            }
        }

        if (targetAmount !== null && amountField) {
            if (targetUnit.includes('ریال')) {
                amountField.value = targetAmount / 10; 
            } else {
                amountField.value = targetAmount;
            }
            amountField.dispatchEvent(new Event('input', { bubbles: true }));
        }

        alert(isEn ? 'SMS parsed successfully with payable amount.' : 'متن پیامک تحلیل شد و «مبلغ قابل پرداخت» به همراه عنوان درج گردید.');
    } catch (err) {
        console.error(err);
        alert(isEn ? 'Failed to read clipboard.' : 'خطا در خواندن کلیپ‌بورد.');
    }
}

// مدیریت اسکنر زنده بارکد با دوربین موبایل
let html5QrCodeScanner = null;

function initImageOrBarcodePicker(targetInputId, mode = 'barcode') {
    const targetId = targetInputId || activeInputId || 'prod-factory-barcode';

    if (mode === 'barcode') {
        openModal('modal-barcode-scanner');
        
        setTimeout(() => {
            if (!html5QrCodeScanner) {
                html5QrCodeScanner = new Html5Qrcode("interactive-reader");
            }
            
            const config = { fps: 10, qrbox: { width: 250, height: 150 } };
            
            html5QrCodeScanner.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    const inputField = document.getElementById(targetId);
                    if (inputField) {
                        inputField.value = decodedText;
                        inputField.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    closeBarcodeScannerModal();
                },
                (errorMessage) => {}
            ).catch(err => {
                console.error("خطا در دوربین:", err);
                alert("امکان دسترسی به دوربین وجود ندارد.");
                closeBarcodeScannerModal();
            });
        }, 300);
    }
}

function closeBarcodeScannerModal() {
    if (html5QrCodeScanner) {
        html5QrCodeScanner.stop().then(() => {
            html5QrCodeScanner.clear();
            html5QrCodeScanner = null;
        }).catch(err => {
            html5QrCodeScanner = null;
        });
    }
    closeModal('modal-barcode-scanner');
}
