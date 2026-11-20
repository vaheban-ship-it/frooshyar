// ==========================================
// people.js - مشتریان، تأمین‌کنندگان و دفتر حساب مخاطبین
// ==========================================

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

  function escapeJsArg(str) {
    return String(str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
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
    
    var text = '🛍️ **' + (db.settings.title || (isEn ? 'Frooshyar' : 'فروش‌یار')) + '**\n';
    text += isEn ? '📋 **Ledger Statement**\n' : '📋 **صورت‌حساب دفتر حساب**\n';
    text += '━━━━━━ • ✿ • ━━━━━━\n';
    text += (isEn ? '📅 **Date:** ' : '📅 **تاریخ گزارش:** ') + getTodayDateStr() + '\n';
    text += (isCust ? (isEn ? '👤 **Customer:** ' : '👤 **مشتری:** ') : (isEn ? '🏭 **Supplier:** ' : '🏭 **تأمین‌کننده:** ')) + name + '\n';
    text += '━━━━━━ • ✿ • ━━━━━━\n\n';
    
    var unitStr = dict['unit_currency'] || (isEn ? 'Toman' : 'تومان');
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

  function renderLedgerPaymentChips() {
    var container = document.getElementById('ledger-payment-chips-container');
    var detailsContainer = document.getElementById('ledger-payment-details-container');
    if (!container || !detailsContainer) return;
    const isEn = (currentLang === 'en');

    var types = db.settings.paymentTypes || [];
    if (types.length === 0) {
      container.innerHTML = '<span style="font-size:0.75rem; color:#888;">' + (isEn ? 'No payment type defined.' : 'نوعی تعریف نشده است.') + '</span>';
      detailsContainer.style.display = 'none';
      return;
    }

    if (!selectedLedgerPaymentTypeId || !types.some(t => t.id === selectedLedgerPaymentTypeId)) {
      selectedLedgerPaymentTypeId = types[0].id;
    }

    var chipsHtml = '';
    types.forEach(pt => {
      var isActive = (pt.id === selectedLedgerPaymentTypeId);
      chipsHtml += '<span class="category-chip ' + (isActive ? 'active' : '') + '" onclick="selectLedgerPaymentType(\'' + pt.id + '\')">' +
        '<i class="fas ' + (isActive ? 'fa-check-circle' : 'fa-circle') + '"></i> ' + (pt.name || (isEn ? 'Untitled' : 'بدون عنوان')) +
      '</span>';
    });
    container.innerHTML = chipsHtml;

    renderLedgerPaymentDetailsBox();
  }

  function selectLedgerPaymentType(ptId) {
    saveCurrentLedgerPaymentFieldsToState();
    selectedLedgerPaymentTypeId = ptId;
    renderLedgerPaymentChips();
  }

  function saveCurrentLedgerPaymentFieldsToState() {
    var detailsContainer = document.getElementById('ledger-payment-details-container');
    if (!detailsContainer || !selectedLedgerPaymentTypeId) return;
    var inputs = detailsContainer.querySelectorAll('.ledger-pt-detail-inp');
    if (inputs.length > 0) {
      if (!currentLedgerPaymentDetails[selectedLedgerPaymentTypeId]) {
        currentLedgerPaymentDetails[selectedLedgerPaymentTypeId] = {};
      }
      inputs.forEach(inp => {
        var fId = inp.getAttribute('data-field-id');
        currentLedgerPaymentDetails[selectedLedgerPaymentTypeId][fId] = inp.value;
      });
    }
  }

  function renderLedgerPaymentDetailsBox() {
    var detailsContainer = document.getElementById('ledger-payment-details-container');
    if (!detailsContainer) return;
    const isEn = (currentLang === 'en');

    var types = db.settings.paymentTypes || [];
    var activePt = types.find(t => t.id === selectedLedgerPaymentTypeId);

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
          : 'روش دریافت/پرداخت <b>«' + activePt.name + '»</b> نیاز به کادر جزئیات اضافی ندارد.') +
      '</div>';
      return;
    }

    detailsContainer.style.display = 'block';
    var savedVals = currentLedgerPaymentDetails[activePt.id] || {};
    var html = '<div style="font-size:0.78rem; font-weight:bold; color:var(--primary); margin-bottom:8px;">' +
      '<i class="fas fa-edit"></i> ' + (isEn ? activePt.name + ' details:' : 'جزئیات ' + activePt.name + ':') +
    '</div>';

    fields.forEach(f => {
      var val = savedVals[f.id] || '';
      html += '<div class="form-group" style="margin-bottom:8px;">' +
        '<label class="form-label" style="font-size:0.76rem;">' + (f.label || '') + '</label>' +
        '<input type="text" class="form-input ledger-pt-detail-inp" data-field-id="' + f.id + '" value="' + val + '" placeholder="' + (f.placeholder || '') + '" oninput="saveCurrentLedgerPaymentFieldsToState()">' +
      '</div>';
    });

    detailsContainer.innerHTML = html;
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

    currentLedgerPaymentDetails = {};
    selectedLedgerPaymentTypeId = (db.settings.paymentTypes && db.settings.paymentTypes[0]) ? db.settings.paymentTypes[0].id : null;

    renderLedgerContentList();
    renderLedgerPaymentChips();
    openModal('modal-ledger');
  }

  function renderLedgerContentList() {
    const isEn = (currentLang === 'en');
    const dict = translations[currentLang] || translations.fa;
    var unitStr = dict['unit_currency'] || (isEn ? 'Toman' : 'تومان');
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
      var ptBadge = t.paymentTypeName ? ' <span class="badge badge-info">' + t.paymentTypeName + '</span>' : '';
      itemsList.push({
        type: 'trans',
        date: t.date,
        html: '<div class="list-row" style="background:#e8f5e9;"><div><b>'+(isEn?'Trans: ':'تراکنش: ')+t.desc+'</b>'+ptBadge+'<small style="display:block; color:var(--text-secondary);">'+t.date+'</small></div><div><b style="color:var(--success);">'+fmt(t.amount)+excessDesc+'</b><small style="display:block; color:var(--success);">'+(isEn?'Recorded':'ثبت‌شده')+'</small></div></div>'
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
    document.getElementById('ledger-summary-count').innerText = (isEn ? 'Transactions: ' : 'تعداد تراکنش‌ها: ') + fmt(count);

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

    saveCurrentLedgerPaymentFieldsToState();
    var activePt = (db.settings.paymentTypes || []).find(t => t.id === selectedLedgerPaymentTypeId);
    var paymentDetailsArr = [];
    if (activePt && activePt.fields) {
      var savedVals = currentLedgerPaymentDetails[activePt.id] || {};
      activePt.fields.forEach(f => {
        paymentDetailsArr.push({
          fieldId: f.id,
          label: f.label,
          value: savedVals[f.id] || ''
        });
      });
    }

    db.ledgerTransactions.push({
      id: Date.now(),
      partyName: name,
      partyType: type,
      amount: amount,
      excess: excess,
      desc: desc,
      paymentTypeId: activePt ? activePt.id : '',
      paymentTypeName: activePt ? activePt.name : '',
      paymentDetails: paymentDetailsArr,
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

  function renderCustomers() {
    const dict = translations[currentLang] || translations.fa;
    const isEn = (currentLang === 'en');
    var unitStr = dict['unit_currency'] || (isEn ? 'Toman' : 'تومان');
    var q = normalizeText(document.getElementById('search-customer')?document.getElementById('search-customer').value:''), html = '';
    (db.customers || []).filter(c => normalizeText(c.name).includes(q)).forEach(c => {
      var av = c.avatar ? '<img src="'+c.avatar+'" style="width:34px; height:34px; border-radius:50%; object-fit:cover; margin-left:8px;">' : '';
      var debtText = c.debt < 0 ? (isEn?'Creditor: ':'بستانکار: ') + fmt(Math.abs(c.debt)) + ' ' + unitStr : (isEn?'Debt: ':'بدهی: ') + fmt(c.debt) + ' ' + unitStr;
      html += '<div class="list-row"><div style="display:flex; align-items:center;">'+av+'<div><b>'+c.name+'</b><small style="display:block; color:var(--text-secondary);">'+debtText+'</small></div></div><div style="display:flex; gap:4px;"><button class="btn btn-warning btn-sm" onclick="openLedgerModal(\''+escapeJsArg(c.name)+'\', \'customer\')"><i class="fas fa-book"></i> '+(isEn?'Ledger':'دفتر')+'</button><button class="btn btn-primary btn-sm" onclick="editCustomer('+c.id+')"><i class="fas fa-edit"></i></button><button class="btn btn-danger btn-sm" onclick="db.customers=db.customers.filter(x=>x.id!='+c.id+'); saveDb();"><i class="fas fa-trash"></i></button></div></div>';
    });
    document.getElementById('customers-list').innerHTML = html || ('<div style="text-align:center; color:#888; padding:12px;">'+(dict['no_cust_found']||(isEn?'No customers found':'مشتری یافت نشد'))+'</div>');
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
    var unitStr = dict['unit_currency'] || (isEn ? 'Toman' : 'تومان');
    var q = normalizeText(document.getElementById('search-supplier')?document.getElementById('search-supplier').value:''), html = '';
    (db.suppliers || []).filter(s => normalizeText(s.name).includes(q)).forEach(s => {
      var av = s.avatar ? '<img src="'+s.avatar+'" style="width:34px; height:34px; border-radius:50%; object-fit:cover; margin-left:8px;">' : '';
      var debtText = s.debt < 0 ? (isEn?'Prepaid: ':'پیش‌پرداخت: ') + fmt(Math.abs(s.debt)) + ' ' + unitStr : (isEn?'Creditor: ':'طلبکار: ') + fmt(s.debt) + ' ' + unitStr;
      html += '<div class="list-row"><div style="display:flex; align-items:center;">'+av+'<div><b>'+s.name+'</b><small style="display:block; color:var(--text-secondary);">'+debtText+'</small></div></div><div style="display:flex; gap:4px;"><button class="btn btn-warning btn-sm" onclick="openLedgerModal(\''+escapeJsArg(s.name)+'\', \'supplier\')"><i class="fas fa-book"></i> '+(isEn?'Ledger':'دفتر')+'</button><button class="btn btn-primary btn-sm" onclick="editSupplier('+s.id+')"><i class="fas fa-edit"></i></button><button class="btn btn-danger btn-sm" onclick="db.suppliers=db.suppliers.filter(x=>x.id!='+s.id+'); saveDb();"><i class="fas fa-trash"></i></button></div></div>';
    });
    document.getElementById('suppliers-list').innerHTML = html || ('<div style="text-align:center; color:#888; padding:12px;">'+(dict['no_supp_found']||(isEn?'No suppliers found':'تأمین‌کننده‌ای یافت نشد'))+'</div>');
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
