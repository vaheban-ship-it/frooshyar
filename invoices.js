// ==========================================
// invoices.js - صدور و مدیریت فاکتورهای فروش و خرید (با پشتیبانی از اسکن بارکد دوگانه)
// ==========================================

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

    var enabledCryptos = (db.settings.cryptos || []).filter(c => c.enabled && c.walletAddress && c.walletAddress.trim() !== '');
    if(enabledCryptos.length > 0) {
      hasContent = true;
      html += divider + '<div class="invoice-section-title">' + (isEn ? 'Crypto Wallets:' : 'آدرس‌های رمزارز:') + '</div>';
      enabledCryptos.forEach(c => { html += '<div style="word-break:break-all;">' + (c.coinName ? c.coinName + ': ' : '') + c.walletAddress + '</div>'; });
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

    var enabledCryptos = (db.settings.cryptos || []).filter(c => c.enabled && c.walletAddress && c.walletAddress.trim() !== '');
    if(enabledCryptos.length > 0) {
      text += divider + (isEn ? '🪙 **Crypto Wallets:**\n' : '🪙 **آدرس‌های رمزارز:**\n');
      enabledCryptos.forEach(c => { text += (c.coinName ? c.coinName + ': ' : '') + '`' + c.walletAddress + '`\n'; });
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

    text += divider;
    text += isEn ? '🛠️ **Support:** Telegram(https://t.me/pvmyan) • Email(vaheban@gmail.com)\n' : '🛠️ **ارتباط با پشتیبانی برنامه:** تلگرام(https://t.me/pvmyan) • ایتا(https://eitaa.com/Alin100) • جمیل(vaheban@gmail.com)\n';
    return text;
  }

  function renderSalePaymentChips() {
    var container = document.getElementById('sale-payment-chips-container');
    var detailsContainer = document.getElementById('sale-payment-details-container');
    if (!container || !detailsContainer) return;
    const isEn = (currentLang === 'en');

    var types = db.settings.paymentTypes || [];
    if (types.length === 0) {
      container.innerHTML = '<span style="font-size:0.75rem; color:#888;">' + (isEn ? 'No payment type defined.' : 'نوعی تعریف نشده است.') + '</span>';
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
        '<i class="fas ' + (isActive ? 'fa-check-circle' : 'fa-circle') + '"></i> ' + (pt.name || (isEn ? 'Untitled' : 'بدون عنوان')) +
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
    const isEn = (currentLang === 'en');

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
        '<i class="fas fa-info-circle text-primary"></i> ' +
        (isEn
          ? 'Payment method <b>"' + activePt.name + '"</b> does not require extra detail fields.'
          : 'نوع پرداخت <b>«' + activePt.name + '»</b> نیاز به کادر جزئیات اضافی ندارد.') +
      '</div>';
      return;
    }

    detailsContainer.style.display = 'block';
    var savedVals = currentSalePaymentDetails[activePt.id] || {};
    var html = '<div style="font-size:0.78rem; font-weight:bold; color:var(--primary); margin-bottom:8px;">' +
      '<i class="fas fa-edit"></i> ' + (isEn ? activePt.name + ' details:' : 'جزئیات ' + activePt.name + ':') +
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

  function renderPurPaymentChips() {
    var container = document.getElementById('pur-payment-chips-container');
    var detailsContainer = document.getElementById('pur-payment-details-container');
    if (!container || !detailsContainer) return;
    const isEn = (currentLang === 'en');

    var types = db.settings.paymentTypes || [];
    if (types.length === 0) {
      container.innerHTML = '<span style="font-size:0.75rem; color:#888;">' + (isEn ? 'No payment type defined.' : 'نوعی تعریف نشده است.') + '</span>';
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
        '<i class="fas ' + (isActive ? 'fa-check-circle' : 'fa-circle') + '"></i> ' + (pt.name || (isEn ? 'Untitled' : 'بدون عنوان')) +
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
    const isEn = (currentLang === 'en');

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
        '<i class="fas fa-info-circle text-danger"></i> ' +
        (isEn
          ? 'Payment method <b>"' + activePt.name + '"</b> does not require extra detail fields.'
          : 'روش پرداخت <b>«' + activePt.name + '»</b> نیاز به کادر جزئیات اضافی ندارد.') +
      '</div>';
      return;
    }

    detailsContainer.style.display = 'block';
    var savedVals = currentPurPaymentDetails[activePt.id] || {};
    var html = '<div style="font-size:0.78rem; font-weight:bold; color:var(--danger); margin-bottom:8px;">' +
      '<i class="fas fa-edit"></i> ' + (isEn ? activePt.name + ' payment details:' : 'جزئیات پرداخت ' + activePt.name + ':') +
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
    var unitStr = dict['unit_currency'] || (isEn ? 'Toman' : 'تومان');
    var qtyUnitStr = dict['unit_qty'] || (isEn ? 'pcs' : 'عدد');
    var codeLbl = isEn ? 'Code: ' : 'کد: ';

    var text = '🛒 **' + (db.settings.title || (isEn ? 'Frooshyar' : 'فروش‌یار')) + '**\n';
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
        text += it.name + ' (' + codeLbl + (it.barcode || '-') + ') (' + it.qty + ' ' + qtyUnitStr + ' × ' + fmt(it.unitPrice) + ') = ' + fmt(rowTotal) + ' ' + unitStr + '\n';
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
    var unitStr = dict['unit_currency'] || (isEn ? 'Toman' : 'تومان');
    var isSale = (type === 'sale'), partyLabel = isSale ? (isEn ? 'Customer' : 'مشتری') : (isEn ? 'Supplier' : 'تأمین‌کننده'), partyName = isSale ? obj.customer : obj.supplier;
    var invoiceTitle = isSale ? (isEn ? 'Sales Invoice' : 'فاکتور فروش') : (isEn ? 'Purchase Invoice' : 'فاکتور خرید');
    var itemsHtml = '';
    var invoiceAmount = Number(obj.subtotal || obj.total || 0);
    var divider = '<div class="invoice-divider">━━━━━━ • ✿ • ━━━━━━</div>';
    
    if(obj.items) {
      obj.items.forEach((it, i) => {
        var rowTotal = it.qty * it.unitPrice;
        var fcBadge = it.factoryBarcode ? (isEn ? ' (Factory: ' : ' (شرکتی: ') + it.factoryBarcode + ')' : '';
        itemsHtml += '<div class="invoice-row" style="flex-direction:column; gap:2px;">' +
          '<div style="display:flex; justify-content:space-between; width:100%;"><span><b>'+(i+1)+'. '+it.name+'</b> <small style="color:var(--text-secondary); font-family:monospace;">('+it.barcode+fcBadge+')</small></span><span><b>'+fmt(rowTotal)+' '+unitStr+'</b></span></div>' +
          '<div style="font-size:0.75rem; color:var(--text-secondary);">'+(isEn?'Qty: ':'تعداد: ')+'<b>'+it.qty+'</b> | '+(isEn?'Unit: ':'فی: ')+fmt(it.unitPrice)+' '+unitStr+'</div>' +
        '</div>';
      });
    }

    var discountHtml = (obj.discount && Number(obj.discount) > 0) ? '<div class="invoice-row"><span>'+(isEn?'Discount:':'تخفیف:')+'</span><span>'+fmt(obj.discount)+' '+unitStr+'</span></div>' : '';

    var logoHtml = db.settings.logo ? '<img src="'+db.settings.logo+'" alt="'+(isEn?'Logo':'لوگو')+'">' : '';
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
        '<h3 style="margin:2px 0; font-size:1.1rem;">'+(db.settings.title||(isEn?'Frooshyar':'فروش‌یار'))+'</h3>' +
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

  function importPurItemsFromExcel() {
    const isEn = (currentLang === 'en');
    
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx, .xls, .csv';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    fileInput.onchange = function(e) {
      var file = e.target.files[0];
      if (!file) {
        document.body.removeChild(fileInput);
        return;
      }

      var reader = new FileReader();
      reader.onload = function(event) {
        try {
          var data = new Uint8Array(event.target.result);
          if (typeof XLSX === 'undefined') {
            alert(isEn ? 'Excel library is loading, please try again in a moment.' : 'کتابخانه اکسل در حال بارگذاری است، لطفاً چند لحظه دیگر دوباره تلاش کنید.');
            document.body.removeChild(fileInput);
            return;
          }

          var workbook = XLSX.read(data, { type: 'array' });
          var firstSheetName = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[firstSheetName];
          var jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

          if (!jsonRows || jsonRows.length === 0) {
            alert(isEn ? 'The Excel file is empty.' : 'فایل اکسل خالی است یا ساختار آن معتبر نیست.');
            document.body.removeChild(fileInput);
            return;
          }

          if (typeof activePurItems === 'undefined') activePurItems = [];
          var importedCount = 0;

          jsonRows.forEach(row => {
            var name = row['نام کالا'] || row['نام_کالا'] || row['name'] || row['Product'] || row[Object.keys(row)[0]] || '';
            var factoryBarcode = row['بارکد'] || row['factoryBarcode'] || row['barcode'] || '';
            var qty = Number(row['تعداد'] || row['موجودی انبار'] || row['موجودی'] || row['qty'] || row['Quantity'] || row[Object.keys(row)[1]] || 1);
            var buyPrice = Number(row['قیمت خرید'] || row['قیمت'] || row['buyPrice'] || row['Price'] || row[Object.keys(row)[2]] || 0);
            var category = row['دسته‌بندی'] || row['category'] || '';

            if (name.toString().trim() !== '') {
              if (category) {
                if (!db.customProductCategories) db.customProductCategories = [];
                if (!db.customProductCategories.includes(category) && !DEFAULT_PRODUCT_CATEGORIES.includes(category)) {
                  db.customProductCategories.push(category);
                }
              }
              var serialIdx = activePurItems.length + 1;
              if (serialIdx > 999) serialIdx = 999;
              var generatedCode = generate15DigitCode(serialIdx, currentLang);

              activePurItems.push({
                name: name.toString().trim(),
                category: category,
                barcode: generatedCode,
                factoryBarcode: factoryBarcode.toString().trim(),
                qty: isNaN(qty) || qty <= 0 ? 1 : qty,
                unitPrice: isNaN(buyPrice) ? 0 : buyPrice
              });
              importedCount++;
            }
          });

          if (importedCount > 0) {
            renderPurItemsList();
            renderPurCategoryChips();
            alert((isEn ? 'Successfully imported ' : 'با موفقیت ') + importedCount + (isEn ? ' items to purchase invoice!' : ' قلم کالا از اکسل به فاکتور خرید اضافه شد!'));
          } else {
            alert(isEn ? 'No valid items found.' : 'هیچ کالای معتبری در فایل یافت نشد.');
          }
        } catch (err) {
          console.error(err);
          alert(isEn ? 'Error reading Excel file.' : 'خطا در خواندن فایل اکسل.');
        } finally {
          document.body.removeChild(fileInput);
        }
      };
      reader.readAsArrayBuffer(file);
    };

    fileInput.click();
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
    var factoryBarcode = document.getElementById('pur-input-factory-barcode').value.trim();
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

    activePurItems.push({ name: n, category: cat, barcode: generatedCode, factoryBarcode: factoryBarcode, qty: q, unitPrice: pr });
    renderPurItemsList();
    renderPurCategoryChips();
    
    document.getElementById('pur-input-name').value = ''; 
    document.getElementById('pur-input-factory-barcode').value = '';
    if(document.getElementById('pur-input-category')) document.getElementById('pur-input-category').value = '';
    document.getElementById('pur-input-qty').value = ''; 
    document.getElementById('pur-input-price').value = '';
  }

  function renderPurItemsList() {
    const dict = translations[currentLang] || translations.fa;
    const isEn = (currentLang === 'en');
    var codeLbl = isEn ? 'Code: ' : 'کد: ';
    var html = ''; 
    activePurItems.forEach((it, i) => {
      var fcText = it.factoryBarcode ? (isEn ? ' (Factory: ' : ' (شرکتی: ') + it.factoryBarcode + ')' : '';
      html += '<div class="dynamic-item-card"><div><div class="dynamic-item-title">'+it.name+' <small style="color:var(--text-secondary); font-family:monospace;">('+codeLbl+it.barcode+fcText+')</small></div><div class="dynamic-item-sub">'+it.qty+' × '+fmt(it.unitPrice)+'</div></div><button class="btn btn-danger btn-sm" onclick="activePurItems.splice('+i+',1); renderPurItemsList(); renderPurCategoryChips();"><i class="fas fa-trash"></i></button></div>';
    });
    document.getElementById('pur-items-list').innerHTML = html || ('<div style="text-align:center; color:#888; font-size:0.8rem; padding:6px;">'+(dict['no_items_found']||(isEn?'No items added':'آیتمی اضافه نشده است'))+'</div>');
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
    if(document.getElementById('pur-input-factory-barcode')) document.getElementById('pur-input-factory-barcode').value='';
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
          factoryBarcode: it.factoryBarcode || '',
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
    var unitStr = dict['unit_currency'] || (isEn ? 'Toman' : 'تومان');
    var purNoPrefix = dict['str_purchase_no'] || (isEn ? 'Purchase #' : 'خرید #');
    var q = normalizeText(document.getElementById('search-purchase')?document.getElementById('search-purchase').value:''), html = '', list = db.purchases || [];
    list.filter(p => normalizeText(p.supplier).includes(q) || normalizeText(p.item).includes(q)).forEach((p, idx) => {
      var ptBadge = p.paymentTypeName ? ' <span class="badge badge-info">' + p.paymentTypeName + '</span>' : '';
      html += '<div class="list-row"><div><b>'+purNoPrefix+(list.length-idx)+'</b>'+ptBadge+'<small style="display:block; color:var(--text-secondary);">'+p.supplier+' | '+p.date+'</small></div><div style="display:flex; gap:4px;"><b style="color:var(--danger);">'+fmt(p.subtotal)+' '+unitStr+'</b><button class="btn btn-info btn-sm" onclick=\'showInvoicePreview('+JSON.stringify(p)+', "purchase")\'><i class="fas fa-eye"></i></button><button class="btn btn-primary btn-sm" onclick="openPurchaseModal('+p.id+')"><i class="fas fa-edit"></i></button><button class="btn btn-danger btn-sm" onclick="db.purchases=db.purchases.filter(x=>x.id!='+p.id+'); saveDb();"><i class="fas fa-trash"></i></button></div></div>';
    });
    document.getElementById('purchases-list').innerHTML = html || ('<div style="text-align:center; color:#888; padding:12px;">'+(dict['no_pur_found']||(isEn?'No purchase invoices recorded':'فاکتور خریدی ثبت نشده است'))+'</div>');
  }


  function onSaleInputProdChange() {
    var pId = document.getElementById('sale-input-prod').value;
    var p = (db.products || []).find(x => x.id == pId);
    if(p) document.getElementById('sale-input-price').value = p.price;
  }

  // جستجو و اسکن سریع در بخش فروش (تطبیق با کد سیستمی یا بارکد شرکتی)
  function onSaleQuickSearchInput(queryText) {
    if(!queryText || queryText.trim() === '') return;
    var qClean = normalizeText(queryText);
    var matchedProd = (db.products || []).find(p => 
      normalizeText(p.barcode) === qClean || 
      normalizeText(p.factoryBarcode) === qClean || 
      normalizeText(p.name).includes(qClean)
    );
    if(matchedProd) {
      var prodSelect = document.getElementById('sale-input-prod');
      if(prodSelect) {
        prodSelect.value = matchedProd.id;
        onSaleInputProdChange();
      }
    }
  }

  function addSaleItemFromInput() {
    const isEn = (currentLang === 'en');
    var pId = document.getElementById('sale-input-prod').value;
    var q = Number(document.getElementById('sale-input-qty').value)||1;
    var pr = Number(document.getElementById('sale-input-price').value)||0;
    var p = (db.products || []).find(x => x.id == pId);
    if(!p) return alert(isEn ? 'Select a product' : 'کالا را انتخاب کنید');
    activeSaleItems.push({ productId: p.id, name: p.name, barcode: p.barcode, factoryBarcode: p.factoryBarcode||'', qty: q, unitPrice: pr, buyPrice: p.buyPrice||0 });
    
    // پاکسازی فیلد اسکنر فروش پس از افزودن موفقیت‌آمیز
    var scannerInp = document.getElementById('sale-barcode-scanner-input');
    if(scannerInp) scannerInp.value = '';

    renderSaleItemsList();
  }

  function renderSaleItemsList() {
    const dict = translations[currentLang] || translations.fa;
    const isEn = (currentLang === 'en');
    var html = '';
    activeSaleItems.forEach((it, i) => {
      var fcText = it.factoryBarcode ? (isEn ? ' (Factory: ' : ' (شرکتی: ') + it.factoryBarcode + ')' : '';
      html += '<div class="dynamic-item-card"><div><div class="dynamic-item-title">'+it.name+' <small style="color:var(--text-secondary); font-family:monospace;">('+it.barcode+fcText+')</small></div><div class="dynamic-item-sub">'+it.qty+' × '+fmt(it.unitPrice)+' = <b>'+fmt(it.qty*it.unitPrice)+'</b></div></div><button class="btn btn-danger btn-sm" onclick="activeSaleItems.splice('+i+',1); renderSaleItemsList();"><i class="fas fa-trash"></i></button></div>';
    });
    document.getElementById('sale-items-list').innerHTML = html || ('<div style="text-align:center; color:#888; font-size:0.8rem; padding:6px;">'+(dict['no_items_found']||(isEn?'No items added':'آیتمی اضافه نشده است'))+'</div>');
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
    var scannerInp = document.getElementById('sale-barcode-scanner-input');
    if(scannerInp) scannerInp.value = '';
    renderSaleItemsList(); 
    renderSalePaymentChips();
  }

  function checkCustomerUnsettledExcess() {
    const dict = translations[currentLang] || translations.fa;
    var custName = document.getElementById('sale-customer').value;
    if(!custName) return false;
    var hasUnsettled = (db.sales || []).some(s => s.customer === custName && s.excess > 0 && !s.excessSettled);
    if (hasUnsettled) {
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
    var unitStr = dict['unit_currency'] || (isEn ? 'Toman' : 'تومان');
    var invNoPrefix = dict['str_invoice_no'] || (isEn ? 'Invoice #' : 'فاکتور #');
    var q = normalizeText(document.getElementById('search-sale')?document.getElementById('search-sale').value:''), html = '', list = db.sales || [];
    list.filter(s => normalizeText(s.customer).includes(q) || normalizeText(s.item).includes(q)).forEach((s, idx) => {
      var settled = Number(s.remaining||0) <= 0;
      var ptBadge = s.paymentTypeName ? ' <span class="badge badge-info">' + s.paymentTypeName + '</span>' : '';
      html += '<div class="list-row"><div><b>'+invNoPrefix+(list.length-idx)+'</b> <span class="badge '+(settled?'badge-success':'badge-danger')+'">'+(settled?(dict['str_settled']||(isEn?'Settled':'تسویه')):(dict['str_debtor']||(isEn?'Debtor':'بدهکار')))+'</span>'+ptBadge+'<small style="display:block; color:var(--text-secondary);">'+s.customer+' | '+s.date+'</small></div><div style="display:flex; gap:4px;"><b style="color:var(--success);">'+fmt(s.subtotal)+' '+unitStr+'</b><button class="btn btn-info btn-sm" onclick=\'showInvoicePreview('+JSON.stringify(s)+', "sale")\'><i class="fas fa-eye"></i></button><button class="btn btn-primary btn-sm" onclick="openSaleModal('+s.id+')"><i class="fas fa-edit"></i></button><button class="btn btn-danger btn-sm" onclick="db.sales=db.sales.filter(x=>x.id!='+s.id+'); saveDb();"><i class="fas fa-trash"></i></button></div></div>';
    });
    document.getElementById('sales-list').innerHTML = html || ('<div style="text-align:center; color:#888; padding:12px;">'+(dict['no_sale_found']||(isEn?'No sales invoices recorded':'فاکتور فروشی ثبت نشده است'))+'</div>');
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
