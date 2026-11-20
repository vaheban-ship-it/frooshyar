// ==========================================
// settings-reports.js - تنظیمات فروشگاه، تقویم روزانه، گزارشات و دستیار هوش مصنوعی
// ==========================================

  // نگاشت کلیدهای پیش‌فرض انواع پرداخت برای همگام‌سازی خودکار بین فارسی و انگلیسی
  const BUILTIN_PT_MAP = {
    pt_cash: {
      faName: 'نقد',
      enName: 'Cash',
      fields: {}
    },
    pt_check: {
      faName: 'چک',
      enName: 'Check',
      fields: {
        f_chk_num: { faLbl: 'شماره چک', enLbl: 'Check Number', faPh: 'مثلاً: ۱۲۳۴۵۶', enPh: 'e.g. 123456' },
        f_chk_owner: { faLbl: 'صاحب حساب', enLbl: 'Account Owner', faPh: 'نام صادرکننده چک...', enPh: 'Check issuer name...' },
        f_chk_date: { faLbl: 'تاریخ سررسید', enLbl: 'Due Date', faPh: 'مثلاً: ۱۴۰۵/۰۲/۱۵', enPh: 'e.g. 2026-05-10' },
        f_chk_bank: { faLbl: 'بانک و شعبه', enLbl: 'Bank & Branch', faPh: 'بانک و شعبه صادرکننده', enPh: 'Issuing bank and branch' }
      }
    },
    pt_pos: {
      faName: 'کارت‌خوان (پوز)',
      enName: 'POS Terminal',
      fields: {
        f_pos_trace: { faLbl: 'کد رهگیری', enLbl: 'Tracking Code', faPh: 'مثلاً: ۹۸۷۶۵۴', enPh: 'e.g. 987654' },
        f_pos_bank: { faLbl: 'بانک / دستگاه', enLbl: 'Bank / Device', faPh: 'مثلاً: کارت‌خوان سامان', enPh: 'e.g. POS Terminal' }
      }
    },
    pt_card: {
      faName: 'کارت‌به‌کارت',
      enName: 'Card Transfer',
      fields: {
        f_card_ref: { faLbl: 'شماره پیگیری', enLbl: 'Reference No.', faPh: 'مثلاً: ۱۲۳۹۸۷', enPh: 'e.g. 123987' },
        f_card_dest: { faLbl: 'کارت مقصد', enLbl: 'Destination Card', faPh: 'شماره شبا یا شماره کارت مقصد', enPh: 'IBAN or destination card number' }
      }
    }
  };

  function syncBuiltinPaymentTypesLanguage() {
    if (!db || !db.settings || !Array.isArray(db.settings.paymentTypes)) return;
    const isEn = (currentLang === 'en');

    db.settings.paymentTypes.forEach(pt => {
      const info = BUILTIN_PT_MAP[pt.id];
      if (!info) return;

      if (isEn && pt.name === info.faName) {
        pt.name = info.enName;
      } else if (!isEn && pt.name === info.enName) {
        pt.name = info.faName;
      }

      if (Array.isArray(pt.fields) && info.fields) {
        pt.fields.forEach(f => {
          const fInfo = info.fields[f.id];
          if (!fInfo) return;
          if (isEn) {
            if (f.label === fInfo.faLbl) f.label = fInfo.enLbl;
            if (f.placeholder === fInfo.faPh) f.placeholder = fInfo.enPh;
          } else {
            if (f.label === fInfo.enLbl) f.label = fInfo.faLbl;
            if (f.placeholder === fInfo.enPh) f.placeholder = fInfo.faPh;
          }
        });
      }
    });
  }

  function renderPaymentTypesSettings() {
    syncBuiltinPaymentTypesLanguage();
    var container = document.getElementById('payment-types-settings-list');
    if (!container) return;
    const isEn = (currentLang === 'en');

    var types = db.settings.paymentTypes || [];
    if (types.length === 0) {
      container.innerHTML = '<div style="text-align:center; color:#888; font-size:0.8rem; padding:10px;">' +
        (isEn ? 'No payment/receipt types defined yet.' : 'هنوز هیچ نوع دریافت یا پرداختی تعریف نشده است.') +
      '</div>';
      return;
    }

    var html = '';
    types.forEach((pt, tIdx) => {
      var fieldsHtml = '';
      var fields = pt.fields || [];
      if (fields.length === 0) {
        fieldsHtml = '<div style="font-size:0.75rem; color:var(--text-secondary); padding:4px 0;">' +
          (isEn ? 'No detail fields (simple amount only)' : 'بدون کادر جزئیات (فقط ثبت مبلغ ساده)') +
        '</div>';
      } else {
        fields.forEach((f, fIdx) => {
          fieldsHtml += '<div class="input-row-group" style="margin-bottom:6px;">' +
            '<input type="text" class="form-input pt-field-label" value="' + (f.label || '') + '" placeholder="' + (isEn ? 'Field label (e.g. Check No.)' : 'عنوان کادر (مثلاً: شماره چک)') + '" style="flex:1.2;" oninput="updatePaymentTypeField(' + tIdx + ', ' + fIdx + ', \'label\', this.value)">' +
            '<input type="text" class="form-input pt-field-ph" value="' + (f.placeholder || '') + '" placeholder="' + (isEn ? 'Example/Placeholder...' : 'نمونه / راهنمای داخل کادر...') + '" style="flex:1.2;" oninput="updatePaymentTypeField(' + tIdx + ', ' + fIdx + ', \'placeholder\', this.value)">' +
            '<button class="btn btn-danger btn-sm" type="button" onclick="removePaymentTypeField(' + tIdx + ', ' + fIdx + ')" title="' + (isEn ? 'Delete field' : 'حذف کادر') + '"><i class="fas fa-times"></i></button>' +
          '</div>';
        });
      }

      html += '<div class="card" style="margin: 0 0 12px 0; padding: 12px; background: #fafafa; border: 1.5px solid var(--border); border-radius: 14px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:10px;">' +
          '<input type="text" class="form-input pt-name-inp" value="' + (pt.name || '') + '" placeholder="' + (isEn ? 'Payment/Receipt Type Name...' : 'نام نوع دریافت/پرداخت...') + '" style="flex:1; font-weight:bold; color:var(--primary);" oninput="updatePaymentTypeName(' + tIdx + ', this.value)">' +
          '<button class="btn btn-danger btn-sm" type="button" onclick="removePaymentType(' + tIdx + ')" title="' + (isEn ? 'Delete type' : 'حذف این نوع') + '"><i class="fas fa-trash"></i></button>' +
        '</div>' +
        '<div style="font-size:0.78rem; font-weight:bold; color:var(--text-secondary); margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">' +
          '<span><i class="fas fa-list-ul"></i> ' + (isEn ? 'Custom Detail Fields:' : 'کادرهای جزئیات اختصاصی:') + '</span>' +
          '<button class="btn btn-outline btn-sm" type="button" onclick="addPaymentTypeField(' + tIdx + ')" style="padding:3px 8px; font-size:0.72rem;"><i class="fas fa-plus"></i> ' + (isEn ? 'Add Field' : 'افزودن کادر جزئیات') + '</button>' +
        '</div>' +
        '<div>' + fieldsHtml + '</div>' +
      '</div>';
    });

    container.innerHTML = html;
  }

  function addNewPaymentType() {
    if (!db.settings.paymentTypes) db.settings.paymentTypes = [];
    const isEn = (currentLang === 'en');
    var newId = 'pt_' + Date.now();
    db.settings.paymentTypes.push({
      id: newId,
      name: isEn ? 'New Payment Type' : 'نوع پرداخت جدید',
      fields: []
    });
    renderPaymentTypesSettings();
    if (typeof renderSalePaymentChips === 'function') renderSalePaymentChips();
    if (typeof renderPurPaymentChips === 'function') renderPurPaymentChips();
    if (typeof renderLedgerPaymentChips === 'function') renderLedgerPaymentChips();
  }

  function removePaymentType(tIdx) {
    const isEn = (currentLang === 'en');
    if (!confirm(isEn ? 'Delete this payment/receipt type?' : 'آیا از حذف این نوع دریافت/پرداخت مطمئن هستید؟')) return;
    db.settings.paymentTypes.splice(tIdx, 1);
    renderPaymentTypesSettings();
    if (typeof renderSalePaymentChips === 'function') renderSalePaymentChips();
    if (typeof renderPurPaymentChips === 'function') renderPurPaymentChips();
    if (typeof renderLedgerPaymentChips === 'function') renderLedgerPaymentChips();
  }

  function updatePaymentTypeName(tIdx, newName) {
    if (db.settings.paymentTypes[tIdx]) {
      db.settings.paymentTypes[tIdx].name = newName;
      if (typeof renderSalePaymentChips === 'function') renderSalePaymentChips();
      if (typeof renderPurPaymentChips === 'function') renderPurPaymentChips();
      if (typeof renderLedgerPaymentChips === 'function') renderLedgerPaymentChips();
    }
  }

  function addPaymentTypeField(tIdx) {
    if (!db.settings.paymentTypes[tIdx]) return;
    if (!db.settings.paymentTypes[tIdx].fields) db.settings.paymentTypes[tIdx].fields = [];
    const isEn = (currentLang === 'en');
    db.settings.paymentTypes[tIdx].fields.push({
      id: 'fld_' + Date.now() + '_' + Math.floor(Math.random()*100),
      label: isEn ? 'New Field' : 'عنوان کادر جدید',
      placeholder: isEn ? 'Value...' : 'مقدار...'
    });
    renderPaymentTypesSettings();
    if (typeof renderSalePaymentDetailsBox === 'function') renderSalePaymentDetailsBox();
    if (typeof renderPurPaymentDetailsBox === 'function') renderPurPaymentDetailsBox();
    if (typeof renderLedgerPaymentDetailsBox === 'function') renderLedgerPaymentDetailsBox();
  }

  function removePaymentTypeField(tIdx, fIdx) {
    if (!db.settings.paymentTypes[tIdx] || !db.settings.paymentTypes[tIdx].fields) return;
    db.settings.paymentTypes[tIdx].fields.splice(fIdx, 1);
    renderPaymentTypesSettings();
    if (typeof renderSalePaymentDetailsBox === 'function') renderSalePaymentDetailsBox();
    if (typeof renderPurPaymentDetailsBox === 'function') renderPurPaymentDetailsBox();
    if (typeof renderLedgerPaymentDetailsBox === 'function') renderLedgerPaymentDetailsBox();
  }

  function updatePaymentTypeField(tIdx, fIdx, prop, val) {
    if (!db.settings.paymentTypes[tIdx] || !db.settings.paymentTypes[tIdx].fields || !db.settings.paymentTypes[tIdx].fields[fIdx]) return;
    db.settings.paymentTypes[tIdx].fields[fIdx][prop] = val;
    if (typeof renderSalePaymentDetailsBox === 'function') renderSalePaymentDetailsBox();
    if (typeof renderPurPaymentDetailsBox === 'function') renderPurPaymentDetailsBox();
    if (typeof renderLedgerPaymentDetailsBox === 'function') renderLedgerPaymentDetailsBox();
  }

  var SOCIAL_TYPES = [
    { id: 'telegram', name: 'تلگرام', nameEn: 'Telegram', icon: 'fab fa-telegram', prefix: 'https://t.me/' },
    { id: 'eitaa', name: 'ایتا', nameEn: 'Eitaa', icon: 'fas fa-comments', prefix: 'https://eitaa.com/' },
    { id: 'instagram', name: 'اینستاگرام', nameEn: 'Instagram', icon: 'fab fa-instagram', prefix: 'https://instagram.com/' },
    { id: 'whatsapp', name: 'واتساپ', nameEn: 'WhatsApp', icon: 'fab fa-whatsapp', prefix: 'https://wa.me/' },
    { id: 'rubika', name: 'روبیکا', nameEn: 'Rubika', icon: 'fas fa-comment-alt', prefix: 'https://rubika.ir/' },
    { id: 'email', name: 'ایمیل', nameEn: 'Email', icon: 'fas fa-envelope', prefix: 'mailto:' },
    { id: 'website', name: 'سایت', nameEn: 'Website', icon: 'fas fa-globe', prefix: 'https://' }
  ];

  function getSocialInfo(typeId) {
    const isEn = (currentLang === 'en');
    const found = SOCIAL_TYPES.find(t => t.id === typeId) || SOCIAL_TYPES[0];
    return Object.assign({}, found, { name: isEn ? found.nameEn : found.name });
  }

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
    const isEn = (currentLang === 'en');
    if (file) {
      if(labelEl) labelEl.innerText = file.name;
      if(statusEl) statusEl.innerText = (isEn ? 'Selected file: ' : 'فایل انتخاب‌شده: ') + file.name;
      restoreBackup(e);
    } else {
      if(statusEl) statusEl.innerText = '';
    }
  }

  function loadSettingsToUI() {
    syncBuiltinPaymentTypesLanguage();
    const isEn = (currentLang === 'en');
    const dict = translations[currentLang] || translations.fa;
    document.getElementById('cfg-title').value = db.settings.title || '';
    document.getElementById('cfg-subtitle').value = db.settings.subtitle || '';
    if(document.getElementById('logo-file-label')) document.getElementById('logo-file-label').innerText = dict['choose_file'] || 'Choose File';

    var cfgFa = document.getElementById('cfg-lang-fa');
    var cfgEn = document.getElementById('cfg-lang-en');
    if(cfgFa) cfgFa.classList.toggle('active', currentLang === 'fa');
    if(cfgEn) cfgEn.classList.toggle('active', currentLang === 'en');

    renderPaymentTypesSettings();

    var bList = document.getElementById('bank-accounts-list'); bList.innerHTML = '';
    (db.settings.banks || []).forEach(b => addBankInputRow(b.bankName, b.cardNumber, b.iban, b.enabled));
    if(bList.children.length === 0) addBankInputRow('', '', '', false);

    var cList = document.getElementById('crypto-addresses-list'); cList.innerHTML = '';
    (db.settings.cryptos || []).forEach(c => addCryptoAddressRow(c.coinName, c.walletAddress, c.enabled));
    if(cList.children.length === 0) addCryptoAddressRow('', '', false);

    var pList = document.getElementById('store-phones-list'); pList.innerHTML = '';
    (db.settings.phones || []).forEach(p => addStorePhoneRow(p.number, p.enabled));
    if(pList.children.length === 0) addStorePhoneRow('', false);

    var aList = document.getElementById('store-addresses-standalone-list'); aList.innerHTML = '';
    (db.settings.standaloneAddresses || []).forEach(a => addStoreStandaloneAddressRow(a.text, a.enabled));
    if(aList.children.length === 0) addStoreStandaloneAddressRow('', false);

    var sList = document.getElementById('store-socials-list'); sList.innerHTML = '';
    (db.settings.socials || []).forEach(s => addStoreSocialRow(s.type, s.name, s.link, s.enabled));
    if(sList.children.length === 0) addStoreSocialRow('telegram', isEn ? 'Telegram' : 'تلگرام', '', false);
  }

  function addBankInputRow(bankName, cardNum, iban, enabled) {
    const isEn = (currentLang === 'en');
    var div = document.createElement('div'); div.className = 'bank-account-row';
    div.innerHTML = '<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">' +
        '<input type="checkbox" class="bank-enabled" style="width:18px; height:18px; accent-color:var(--primary);" '+(enabled?'checked':'')+'>' +
        '<span style="font-size:0.8rem; font-weight:bold; color:var(--primary);">'+(isEn?'Show in invoice':'نمایش در فاکتور')+'</span>' +
        '<button class="btn btn-danger btn-sm" type="button" style="margin-right:auto;" onclick="this.closest(\'.bank-account-row\').remove()"><i class="fas fa-trash"></i></button>' +
      '</div>' +
      '<div class="row-2" style="margin-bottom:6px;"><input type="text" class="form-input bank-name" value="'+(bankName||'')+'" placeholder="'+(isEn?'Bank name (e.g. Melli)':'نام بانک (مثلاً: ملت)')+'"><input type="text" class="form-input bank-card" value="'+(cardNum||'')+'" placeholder="'+(isEn?'16-digit card number':'شماره کارت ۱۶ رقمی')+'"></div>' +
      '<input type="text" class="form-input bank-iban" value="'+(iban||'')+'" placeholder="'+(isEn?'IBAN (e.g. IR...)':'شماره شبا (IR...)')+'">';
    document.getElementById('bank-accounts-list').appendChild(div);
  }

  function addCryptoAddressRow(coinName, address, enabled) {
    const isEn = (currentLang === 'en');
    var div = document.createElement('div'); div.className = 'bank-account-row';
    div.innerHTML = '<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">' +
        '<input type="checkbox" class="crypto-enabled" style="width:18px; height:18px; accent-color:var(--primary);" '+(enabled?'checked':'')+'>' +
        '<span style="font-size:0.8rem; font-weight:bold; color:var(--primary);">'+(isEn?'Show in invoice':'نمایش در فاکتور')+'</span>' +
        '<button class="btn btn-danger btn-sm" type="button" style="margin-right:auto;" onclick="this.closest(\'.bank-account-row\').remove()"><i class="fas fa-trash"></i></button>' +
      '</div>' +
      '<div class="row-2" style="margin-bottom:6px;"><input type="text" class="form-input crypto-coin" value="'+(coinName||'')+'" placeholder="'+(isEn?'Coin/Network (e.g. USDT TRC20)':'نام رمزارز / شبکه (مثلاً: USDT TRC20)')+'"></div>' +
      '<input type="text" class="form-input crypto-addr" value="'+(address||'')+'" placeholder="'+(isEn?'Wallet address (e.g. T...)':'آدرس کیف‌پول رمزارز (مثلاً: T...)')+'" style="font-family:monospace;">';
    document.getElementById('crypto-addresses-list').appendChild(div);
  }

  function addStorePhoneRow(num, enabled) {
    const isEn = (currentLang === 'en');
    var div = document.createElement('div'); div.className = 'input-row-group';
    div.innerHTML = '<input type="checkbox" class="phone-enabled" style="width:18px; height:18px; accent-color:var(--primary);" '+(enabled?'checked':'')+'>' +
      '<input type="text" class="form-input store-phone-num" value="'+(num||'')+'" placeholder="'+(isEn?'Phone number (e.g. 0912...)':'شماره تماس (مثلاً: ۰۹۱۲...)')+'" style="flex:2;">' +
      '<button class="btn btn-danger btn-sm" type="button" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>';
    document.getElementById('store-phones-list').appendChild(div);
  }

  function addStoreStandaloneAddressRow(addrText, enabled) {
    const isEn = (currentLang === 'en');
    var div = document.createElement('div'); div.className = 'bank-account-row';
    div.innerHTML = '<div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">' +
        '<input type="checkbox" class="standalone-addr-enabled" style="width:18px; height:18px; accent-color:var(--primary);" '+(enabled?'checked':'')+'>' +
        '<span style="font-size:0.8rem; font-weight:bold; color:var(--primary);">'+(isEn?'Show in invoice':'نمایش در فاکتور')+'</span>' +
        '<button class="btn btn-danger btn-sm" type="button" style="margin-right:auto;" onclick="this.closest(\'.bank-account-row\').remove()"><i class="fas fa-trash"></i></button>' +
      '</div>' +
      '<input type="text" class="form-input standalone-addr-text" value="'+(addrText||'')+'" placeholder="'+(isEn?'Full store address...':'آدرس کامل فروشگاه...')+'">';
    document.getElementById('store-addresses-standalone-list').appendChild(div);
  }

  function addStoreSocialRow(type, name, link, enabled) {
    const isEn = (currentLang === 'en');
    var div = document.createElement('div'); div.className = 'bank-account-row';
    var selHtml = '<select class="form-select social-type" style="flex:1; margin-bottom:6px;" onchange="onSocialTypeChange(this)">';
    SOCIAL_TYPES.forEach(t => {
      var tLbl = isEn ? t.nameEn : t.name;
      selHtml += '<option value="'+t.id+'" '+(type===t.id?'selected':'')+'>'+tLbl+'</option>';
    });
    selHtml += '</select>';
    var defaultName = name || (getSocialInfo(type || 'telegram').name);

    div.innerHTML = '<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">' +
        '<input type="checkbox" class="social-enabled" style="width:18px; height:18px; accent-color:var(--primary);" '+(enabled?'checked':'')+'>' +
        '<span style="font-size:0.8rem; font-weight:bold; color:var(--primary);">'+(isEn?'Show in invoice':'نمایش در فاکتور')+'</span>' +
        '<button class="btn btn-danger btn-sm" type="button" style="margin-right:auto;" onclick="this.closest(\'.bank-account-row\').remove()"><i class="fas fa-trash"></i></button>' +
      '</div>' +
      '<div class="row-2" style="margin-bottom:6px;">' + selHtml + '<input type="text" class="form-input social-name" value="'+defaultName+'" placeholder="'+(isEn?'Display title':'عنوان نمایشی')+'" style="flex:1.2;"></div>' +
      '<input type="text" class="form-input social-link" value="'+(link||'')+'" placeholder="'+(isEn?'ID or link (e.g. myshop)':'شناسه یا لینک (مثلاً: myshop)')+'">';
    document.getElementById('store-socials-list').appendChild(div);
  }

  function onSocialTypeChange(sel) {
    var row = sel.closest('.bank-account-row');
    var info = getSocialInfo(sel.value);
    var nameInp = row.querySelector('.social-name');
    if (nameInp) nameInp.value = info.name;
  }

  function uploadLogo(e) {
    var f = e.target.files[0]; if(!f) return;
    var r = new FileReader(); r.onload = function(evt) { db.settings.logo = evt.target.result; saveDb(); }; r.readAsDataURL(f);
  }

  function saveSettings() {
    const isEn = (currentLang === 'en');
    db.settings.title = document.getElementById('cfg-title').value;
    db.settings.subtitle = document.getElementById('cfg-subtitle').value;

    var ptCards = document.querySelectorAll('#payment-types-settings-list .card');
    var updatedTypes = [];
    ptCards.forEach((card, idx) => {
      var origPt = (db.settings.paymentTypes && db.settings.paymentTypes[idx]) ? db.settings.paymentTypes[idx] : { id: 'pt_' + Date.now() + '_' + idx, fields: [] };
      var ptNameInp = card.querySelector('.pt-name-inp');
      var ptName = ptNameInp ? ptNameInp.value.trim() : (isEn ? 'Payment Type' : 'نوع پرداخت');

      var fieldRows = card.querySelectorAll('.input-row-group');
      var ptFields = [];
      fieldRows.forEach((fRow, fIdx) => {
        var fLblInp = fRow.querySelector('.pt-field-label');
        var fPhInp = fRow.querySelector('.pt-field-ph');
        var origField = (origPt.fields && origPt.fields[fIdx]) ? origPt.fields[fIdx] : { id: 'fld_' + Date.now() + '_' + fIdx };
        if (fLblInp && fLblInp.value.trim() !== '') {
          ptFields.push({
            id: origField.id,
            label: fLblInp.value.trim(),
            placeholder: fPhInp ? fPhInp.value.trim() : ''
          });
        }
      });

      if (ptName !== '') {
        updatedTypes.push({
          id: origPt.id,
          name: ptName,
          fields: ptFields
        });
      }
    });
    if (updatedTypes.length > 0) {
      db.settings.paymentTypes = updatedTypes;
    }

    var banks = [];
    document.querySelectorAll('#bank-accounts-list .bank-account-row').forEach(r => {
      var bn = r.querySelector('.bank-name').value.trim(), bc = r.querySelector('.bank-card').value.trim(), bi = r.querySelector('.bank-iban').value.trim();
      var en = r.querySelector('.bank-enabled').checked;
      if(bn || bc || bi) banks.push({ bankName: bn, cardNumber: bc, iban: bi, enabled: en });
    });
    db.settings.banks = banks;

    var cryptos = [];
    document.querySelectorAll('#crypto-addresses-list .bank-account-row').forEach(r => {
      var coin = r.querySelector('.crypto-coin').value.trim(), addr = r.querySelector('.crypto-addr').value.trim();
      var en = r.querySelector('.crypto-enabled').checked;
      if(coin || addr) cryptos.push({ coinName: coin, walletAddress: addr, enabled: en });
    });
    db.settings.cryptos = cryptos;

    var phones = [];
    document.querySelectorAll('#store-phones-list .input-row-group').forEach(r => {
      var num = r.querySelector('.store-phone-num').value.trim(), en = r.querySelector('.phone-enabled').checked;
      if(num) phones.push({ number: num, enabled: en });
    });
    db.settings.phones = phones;

    var sAddrs = [];
    document.querySelectorAll('#store-addresses-standalone-list .bank-account-row').forEach(r => {
      var txt = r.querySelector('.standalone-addr-text').value.trim(), en = r.querySelector('.standalone-addr-enabled').checked;
      if(txt) sAddrs.push({ text: txt, enabled: en });
    });
    db.settings.standaloneAddresses = sAddrs;

    var socials = [];
    document.querySelectorAll('#store-socials-list .bank-account-row').forEach(r => {
      var sType = r.querySelector('.social-type').value;
      var sName = r.querySelector('.social-name').value.trim();
      var sLink = r.querySelector('.social-link').value.trim();
      var en = r.querySelector('.social-enabled').checked;
      if(sName || sLink) {
        var finalLink = sLink;
        var info = getSocialInfo(sType);
        if (sLink !== '' && !sLink.startsWith('http') && !sLink.startsWith('mailto:')) {
          finalLink = info.prefix + sLink.replace('@', '');
        }
        socials.push({ type: sType, name: sName || info.name, link: finalLink, enabled: en });
      }
    });
    db.settings.socials = socials;

    saveDb();
    if (typeof renderSalePaymentChips === 'function') renderSalePaymentChips();
    if (typeof renderPurPaymentChips === 'function') renderPurPaymentChips();
    if (typeof renderLedgerPaymentChips === 'function') renderLedgerPaymentChips();
    alert(isEn ? 'All settings saved successfully.' : 'تمام تنظیمات با موفقیت ذخیره شد.');
  }

  function exportBackup() {
    var dataStr = JSON.stringify(db, null, 2);
    var blob = new Blob([dataStr], {type: "application/json"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url; a.download = "frooshyar_backup_" + getTodayDateStr().replace(/[/-]/g,'') + ".json";
    a.click(); URL.revokeObjectURL(url);
  }

  function restoreBackup(e) {
    const isEn = (currentLang === 'en');
    var f = e.target.files[0]; if(!f) return;
    var r = new FileReader(); r.onload = function(evt) {
      try {
        var parsed = JSON.parse(evt.target.result);
        if(parsed) { 
          db = Object.assign(db, parsed); 
          if (!db.settings.paymentTypes || db.settings.paymentTypes.length === 0) {
            db.settings.paymentTypes = JSON.parse(JSON.stringify(getDefaultPaymentTypes()));
          }
          saveDb(); 
          loadSettingsToUI(); 
          alert(isEn ? 'Backup restored successfully.' : 'اطلاعات پشتیبان با موفقیت بازیابی شد.'); 
        }
      } catch(err) { alert(isEn ? 'Invalid backup file' : 'فایل پشتیبان نامعتبر است'); }
    }; r.readAsText(f);
  }

  function resetAppData() {
    const isEn = (currentLang === 'en');
    if(confirm(isEn ? 'Warning: All invoices, products, and customers will be deleted! Continue?' : 'هشدار: تمام فاکتورها، کالاها و مشتریان حذف خواهند شد! ادامه می‌دهید؟')) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  }

  var calYear, calMonth;
  function initCalendar() {
    const isEn = (currentLang === 'en');
    if (isEn) {
      var now = new Date();
      calYear = now.getFullYear();
      calMonth = now.getMonth() + 1;
    } else {
      var j = getTodayJalaali();
      calYear = j.jy;
      calMonth = j.jm;
    }
    renderCalendarGrid();
  }

  function changeCalMonth(delta) {
    calMonth += delta;
    if(calMonth > 12) { calMonth = 1; calYear++; }
    if(calMonth < 1) { calMonth = 12; calYear--; }
    renderCalendarGrid();
  }

  function renderCalendarGrid() {
    const isEn = (currentLang === 'en');
    var titleElem = document.getElementById('cal-month-title');
    if (isEn) {
      var enMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      if(titleElem) titleElem.innerText = enMonths[calMonth - 1] + ' ' + calYear;
      var heads = document.getElementById('calendar-week-heads');
      if(heads) heads.innerHTML = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(w => '<div class="calendar-day-head">'+w+'</div>').join('');
    } else {
      var faMonths = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
      if(titleElem) titleElem.innerText = faMonths[calMonth - 1] + ' ' + calYear;
      var heads = document.getElementById('calendar-week-heads');
      if(heads) heads.innerHTML = ['ش','ی','د','س','چ','پ','ج'].map(w => '<div class="calendar-day-head">'+w+'</div>').join('');
    }

    var daysInMonth = (calMonth <= 6 && !isEn) ? 31 : (calMonth < 12 && !isEn ? 30 : (isEn ? new Date(calYear, calMonth, 0).getDate() : 29));
    var grid = document.getElementById('calendar-days-grid');
    if(!grid) return;

    var html = '';
    for(var d = 1; d <= daysInMonth; d++) {
      var dStr = isEn
        ? calYear + '-' + String(calMonth).padStart(2,'0') + '-' + String(d).padStart(2,'0')
        : calYear + '/' + String(calMonth).padStart(2,'0') + '/' + String(d).padStart(2,'0');
      var hasActivity = (db.sales || []).some(s => s.date === dStr) || (db.purchases || []).some(p => p.date === dStr) || (db.expenses || []).some(e => e.date === dStr);
      html += '<div class="calendar-day '+(hasActivity?'has-activity':'')+'" onclick="selectCalendarDay(\''+dStr+'\', this)">'+d+'</div>';
    }
    grid.innerHTML = html;
  }

  function selectCalendarDay(dStr, elem) {
    const isEn = (currentLang === 'en');
    const dict = translations[currentLang] || translations.fa;
    var unitStr = dict['unit_currency'] || (isEn ? 'Toman' : 'تومان');
    document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
    if(elem) elem.classList.add('selected');

    var detailsDiv = document.getElementById('cal-day-details');
    detailsDiv.style.display = 'block';
    document.getElementById('cal-selected-date-title').innerText = (isEn ? 'Report for: ' : 'گزارش روز: ') + dStr;

    var daySales = (db.sales || []).filter(s => s.date === dStr);
    var dayPurchases = (db.purchases || []).filter(p => p.date === dStr);
    var dayExpenses = (db.expenses || []).filter(e => e.date === dStr);

    var sSum = daySales.reduce((a,b) => a + Number(b.subtotal || b.total || 0), 0);
    var pSum = dayPurchases.reduce((a,b) => a + Number(b.subtotal || b.total || 0), 0);
    var eSum = dayExpenses.reduce((a,b) => a + Number(b.amount || 0), 0);

    var accHtml = '';
    accHtml += '<div class="accordion-item"><div class="accordion-header" onclick="toggleAccordion(this)"><span><i class="fas fa-receipt text-success"></i> '+(isEn?'Sales Invoices':'فاکتورهای فروش')+' ('+daySales.length+')</span><b>'+fmt(sSum)+' '+unitStr+'</b></div><div class="accordion-body">' + (daySales.map(s => '<div>• '+s.customer+' ('+fmt(s.subtotal)+' '+unitStr+')</div>').join('') || (isEn?'No sales':'فروشی ثبت نشده')) + '</div></div>';
    accHtml += '<div class="accordion-item"><div class="accordion-header" onclick="toggleAccordion(this)"><span><i class="fas fa-shopping-bag text-danger"></i> '+(isEn?'Purchase Invoices':'فاکتورهای خرید')+' ('+dayPurchases.length+')</span><b>'+fmt(pSum)+' '+unitStr+'</b></div><div class="accordion-body">' + (dayPurchases.map(p => '<div>• '+p.supplier+' ('+fmt(p.subtotal)+' '+unitStr+')</div>').join('') || (isEn?'No purchases':'خریدی ثبت نشده')) + '</div></div>';
    accHtml += '<div class="accordion-item"><div class="accordion-header" onclick="toggleAccordion(this)"><span><i class="fas fa-wallet text-warning"></i> '+(isEn?'Expenses':'هزینه‌ها')+' ('+dayExpenses.length+')</span><b>'+fmt(eSum)+' '+unitStr+'</b></div><div class="accordion-body">' + (dayExpenses.map(e => '<div>• '+e.title+' ('+fmt(e.amount)+' '+unitStr+')</div>').join('') || (isEn?'No expenses':'هزینه‌ای ثبت نشده')) + '</div></div>';

    document.getElementById('cal-accordion-list').innerHTML = accHtml;
  }

  function toggleAccordion(headerEl) {
    var body = headerEl.nextElementSibling;
    if(!body) return;
    body.style.display = (body.style.display === 'block') ? 'none' : 'block';
  }

  function renderReports() {
    var period = document.getElementById('report-period') ? document.getElementById('report-period').value : 'all';
    const isEn = (currentLang === 'en');
    const dict = translations[currentLang] || translations.fa;
    var unitStr = dict['unit_currency'] || (isEn ? 'Toman' : 'تومان');
    var qtyStr = dict['unit_qty'] || (isEn ? 'pcs' : 'عدد');
    var todayStr = getTodayDateStr();

    var sales = db.sales || [], purchases = db.purchases || [], expenses = db.expenses || [];
    if(period === 'today') {
      sales = sales.filter(s => s.date === todayStr);
      purchases = purchases.filter(p => p.date === todayStr);
      expenses = expenses.filter(e => e.date === todayStr);
    }

    var sTotal = sales.reduce((a,b) => a + Number(b.subtotal || b.total || 0), 0);
    var pTotal = purchases.reduce((a,b) => a + Number(b.subtotal || b.total || 0), 0);
    var eTotal = expenses.reduce((a,b) => a + Number(b.amount || 0), 0);
    var grossProf = sales.reduce((a,b) => a + Number(b.profit || 0), 0);
    var netProf = grossProf - eTotal;

    var sumCardsHtml = '<div class="stat-box sales"><div class="value">'+fmt(sTotal)+' '+unitStr+'</div><div class="label">'+(isEn?'Period Sales':'فروش دوره')+'</div></div>' +
      '<div class="stat-box expense"><div class="value">'+fmt(pTotal)+' '+unitStr+'</div><div class="label">'+(isEn?'Period Purchases':'خرید دوره')+'</div></div>' +
      '<div class="stat-box profit"><div class="value">'+fmt(netProf)+' '+unitStr+'</div><div class="label">'+(isEn?'Net Profit (After Expenses)':'سود خالص (پس از هزینه)')+'</div></div>' +
      '<div class="stat-box stock"><div class="value">'+fmt(eTotal)+' '+unitStr+'</div><div class="label">'+(isEn?'Period Expenses':'هزینه‌های دوره')+'</div></div>';
    if(document.getElementById('reports-summary-cards')) document.getElementById('reports-summary-cards').innerHTML = sumCardsHtml;

    if(document.getElementById('reports-detail')) {
      document.getElementById('reports-detail').innerHTML = '<div class="list-row"><span>'+(isEn?'Sales Invoices Count:':'تعداد فاکتورهای فروش:')+'</span><b>'+sales.length+'</b></div>' +
        '<div class="list-row"><span>'+(isEn?'Purchase Invoices Count:':'تعداد فاکتورهای خرید:')+'</span><b>'+purchases.length+'</b></div>' +
        '<div class="list-row"><span>'+(isEn?'Gross Profit:':'سود ناخالص:')+'</span><b style="color:var(--success);">'+fmt(grossProf)+' '+unitStr+'</b></div>' +
        '<div class="list-row"><span>'+(isEn?'Total Expenses:':'مجموع هزینه‌ها:')+'</span><b style="color:var(--danger);">'+fmt(eTotal)+' '+unitStr+'</b></div>';
    }

    var maxVal = Math.max(sTotal, pTotal, eTotal, grossProf, 1);
    var chartHtml = '';
    var bars = [
      { label: isEn ? 'Sales' : 'فروش کل', val: sTotal, color: '#d81b60' },
      { label: isEn ? 'Purchases' : 'خرید کل', val: pTotal, color: '#e53935' },
      { label: isEn ? 'Expenses' : 'هزینه‌ها', val: eTotal, color: '#fb8c00' },
      { label: isEn ? 'Gross Profit' : 'سود ناخالص', val: grossProf, color: '#2e7d32' }
    ];
    bars.forEach(b => {
      var pct = Math.min(100, Math.round((b.val / maxVal) * 100));
      chartHtml += '<div class="chart-bar-wrap"><div class="chart-bar-label"><span>'+b.label+'</span><b>'+fmt(b.val)+' '+unitStr+'</b></div><div class="chart-bar-bg"><div class="chart-bar-fill" style="width:'+pct+'%; background:'+b.color+';">'+pct+'%</div></div></div>';
    });
    if(document.getElementById('financial-chart-view')) document.getElementById('financial-chart-view').innerHTML = chartHtml;

    var itemMap = {};
    sales.forEach(s => {
      (s.items || []).forEach(it => {
        if(!itemMap[it.name]) itemMap[it.name] = { name: it.name, qty: 0, amount: 0 };
        itemMap[it.name].qty += Number(it.qty || 0);
        itemMap[it.name].amount += Number(it.qty || 0) * Number(it.unitPrice || 0);
      });
    });
    var topItems = Object.values(itemMap).sort((a,b) => b.amount - a.amount);
    var topHtml = '';
    topItems.forEach((it, idx) => {
      topHtml += '<div class="list-row"><span><b>'+(idx+1)+'. '+it.name+'</b> <small style="color:var(--text-secondary);">('+fmt(it.qty)+' '+qtyStr+')</small></span><b style="color:var(--success);">'+fmt(it.amount)+' '+unitStr+'</b></div>';
    });
    if(document.getElementById('top-selling-products-view')) {
      document.getElementById('top-selling-products-view').innerHTML = topHtml || '<div style="text-align:center; color:#888; font-size:0.8rem; padding:10px;">'+(isEn?'No sales items recorded in this period':'آیتم فروخته‌شده‌ای در این بازه ثبت نشده است')+'</div>';
    }
  }

  function shareReportsAsText() {
    const isEn = (currentLang === 'en');
    const dict = translations[currentLang] || translations.fa;
    var unitStr = dict['unit_currency'] || (isEn ? 'Toman' : 'تومان');
    var totSales = (db.sales || []).reduce((a,b) => a + Number(b.subtotal || b.total || 0), 0);
    var totProfit = (db.sales || []).reduce((a,b) => a + Number(b.profit || 0), 0);
    var totExpense = (db.expenses || []).reduce((a,b) => a + Number(b.amount || 0), 0);
    var text = '📊 **' + (db.settings.title || (isEn ? 'Frooshyar' : 'فروش‌یار')) + '**\n' +
      (isEn ? '📈 **Financial Report**\n' : '📈 **گزارش مالی**\n') +
      '━━━━━━ • ✿ • ━━━━━━\n' +
      (isEn ? '💵 Total Sales: ' : '💵 فروش کل: ') + fmt(totSales) + ' ' + unitStr + '\n' +
      (isEn ? '💰 Gross Profit: ' : '💰 سود ناخالص: ') + fmt(totProfit) + ' ' + unitStr + '\n' +
      (isEn ? '💸 Total Expenses: ' : '💸 هزینه‌ها: ') + fmt(totExpense) + ' ' + unitStr + '\n' +
      (isEn ? '✨ Net Profit: ' : '✨ سود خالص: ') + fmt(totProfit - totExpense) + ' ' + unitStr;

    if(navigator.share) navigator.share({ text: text });
    else { navigator.clipboard.writeText(text); alert(isEn ? 'Report copied to clipboard!' : 'گزارش کپی شد!'); }
  }

  function renderAiAssistant() {
    var body = document.getElementById('ai-content-body');
    if(!body) return;
    const isEn = (currentLang === 'en');
    const dict = translations[currentLang] || translations.fa;
    var unitStr = dict['unit_currency'] || (isEn ? 'Toman' : 'تومان');
    var lowStock = (db.products || []).filter(p => Number(p.qty || 0) <= 5);
    var debtors = (db.customers || []).filter(c => Number(c.debt || 0) > 0);
    var totSales = (db.sales || []).reduce((a,b) => a + Number(b.subtotal || b.total || 0), 0);
    var totExpense = (db.expenses || []).reduce((a,b) => a + Number(b.amount || 0), 0);

    var html = '<div style="background:#f3e5f5; padding:10px; border-radius:10px; margin-bottom:10px;"><b><i class="fas fa-lightbulb text-warning"></i> '+(isEn?'Smart Store Analysis:':'تحلیل هوشمند فروشگاه:')+'</b><br>';
    if(lowStock.length > 0) {
      html += (isEn ? '• ⚠️ <b>' + lowStock.length + ' items</b> have low stock (5 or less): ' + lowStock.map(x=>x.name+' ('+x.qty+')').join(', ') + '<br>' : '• ⚠️ <b>' + lowStock.length + ' قلم کالا</b> موجودی رو به اتمام دارند (۵ عدد یا کمتر): ' + lowStock.map(x=>x.name+' ('+x.qty+')').join('، ') + '<br>');
    } else {
      html += isEn ? '• ✅ Stock levels are satisfactory.<br>' : '• ✅ موجودی کالاها در وضعیت مطلوب است.<br>';
    }
    if(debtors.length > 0) {
      var dSum = debtors.reduce((a,b) => a + Number(b.debt || 0), 0);
      html += isEn ? '• 💳 <b>' + debtors.length + ' customers</b> have open balances totaling <b>' + fmt(dSum) + ' ' + unitStr + '</b>.<br>' : '• 💳 <b>' + debtors.length + ' مشتری</b> بدهکار هستند. مجموع مطالبات: <b>' + fmt(dSum) + ' ' + unitStr + '</b>.<br>';
    }
    if(totSales > 0 && totExpense > totSales * 0.4) {
      html += isEn ? '• 💡 Expenses are high relative to sales; reviewing fixed costs is recommended.' : '• 💡 میزان هزینه‌ها نسبت به فروش بالا است؛ بازنگری در هزینه‌های جاری پیشنهاد می‌شود.';
    }
    html += '</div>';
    body.innerHTML = html;
  }
