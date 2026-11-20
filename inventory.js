// ==========================================
// inventory.js - مدیریت کالاها، انبار، دسته‌بندی و سود درصدی (با سیستم دوگانه بارکد)
// ==========================================

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

  function renderProducts() {
    const dict = translations[currentLang] || translations.fa;
    const isEn = (currentLang === 'en');
    var q = normalizeText(document.getElementById('search-product') ? document.getElementById('search-product').value : '');
    var cat = document.getElementById('filter-product-cat') ? document.getElementById('filter-product-cat').value : '';
    var sysCodeLbl = isEn ? 'System Code: ' : 'کد سیستمی: ';
    var facCodeLbl = isEn ? 'Factory Barcode: ' : 'بارکد شرکتی: ';
    var html = '';
    (db.products || []).filter(p => (
      normalizeText(p.name).includes(q) || 
      (p.barcode && normalizeText(p.barcode).includes(q)) || 
      (p.factoryBarcode && normalizeText(p.factoryBarcode).includes(q))
    ) && (!cat || p.category === cat)).forEach(p => {
      var factoryBadge = p.factoryBarcode ? ' | ' + facCodeLbl + p.factoryBarcode : '';
      html += '<div class="list-row"><div><b>'+p.name+'</b> '+(p.category?'<span class="badge badge-info">'+p.category+'</span>':'')+'<small style="display:block; color:var(--text-secondary);">'+sysCodeLbl+p.barcode+factoryBadge+' | '+(isEn?'Buy: ':'خرید: ')+fmt(p.buyPrice)+' | '+(isEn?'Sell: ':'فروش: ')+fmt(p.price)+'</small></div><div style="display:flex; align-items:center; gap:6px;"><span>'+(isEn?'Stock: ':'موجودی: ')+'<b>'+fmt(p.qty)+'</b></span><button class="btn btn-primary btn-sm" onclick="editProduct('+p.id+')"><i class="fas fa-edit"></i></button><button class="btn btn-danger btn-sm" onclick="deleteProduct('+p.id+')"><i class="fas fa-trash"></i></button></div></div>';
    });
    document.getElementById('products-list').innerHTML = html || ('<div style="text-align:center; color:#888; padding:12px;">'+(dict['no_prod_found']||(isEn?'No products found':'کالایی یافت نشد'))+'</div>');
  }

  function renderStock() {
    const dict = translations[currentLang] || translations.fa;
    const isEn = (currentLang === 'en');
    var q = normalizeText(document.getElementById('search-stock') ? document.getElementById('search-stock').value : '');
    var cat = document.getElementById('filter-stock-cat') ? document.getElementById('filter-stock-cat').value : '';
    var codeLbl = isEn ? 'Code: ' : 'کد: ';
    var html = '', idx = 1;
    (db.products || []).filter(p => (
      normalizeText(p.name).includes(q) || 
      (p.barcode && normalizeText(p.barcode).includes(q)) || 
      (p.factoryBarcode && normalizeText(p.factoryBarcode).includes(q))
    ) && (!cat || p.category === cat)).forEach(p => {
      var factoryBadge = p.factoryBarcode ? (isEn ? ' (Factory: ' : ' (شرکتی: ') + p.factoryBarcode + ')' : '';
      html += '<div class="list-row"><span><b>'+(idx++)+'. '+p.name+'</b> <small style="color:var(--text-secondary);">('+codeLbl+p.barcode+factoryBadge+')</small></span><span style="color:'+(p.qty>5?'var(--success)':'var(--danger)')+'; font-weight:700;">'+(isEn?'Stock: ':'موجودی: ')+fmt(p.qty)+'</span></div>';
    });
    document.getElementById('stock-list').innerHTML = html || ('<div style="text-align:center; color:#888; padding:12px;">'+(dict['no_prod_found']||(isEn?'No items in stock':'آیتمی وجود ندارد'))+'</div>');
  }

  const DEFAULT_PRODUCT_CATEGORIES_FA = ['پوشاک زنانه', 'پوشاک مردانه', 'کفش', 'لوازم جانبی', 'سایر'];
  const DEFAULT_PRODUCT_CATEGORIES_EN = ["Women's Apparel", "Men's Apparel", 'Footwear', 'Accessories', 'Other'];

  function getDefaultProductCategories() {
    return (typeof currentLang !== 'undefined' && currentLang === 'en')
      ? DEFAULT_PRODUCT_CATEGORIES_EN
      : DEFAULT_PRODUCT_CATEGORIES_FA;
  }

  // حفظ سازگاری با سایر ماژول‌ها
  var DEFAULT_PRODUCT_CATEGORIES = DEFAULT_PRODUCT_CATEGORIES_FA;

  function renderPurCategoryChips() {
    var container = document.getElementById('pur-product-category-chips');
    if(!container) return;
    const isEn = (currentLang === 'en');
    var defaultCats = getDefaultProductCategories();
    var prodCats = (db.products || []).map(p => p.category).filter(Boolean);
    var activeItemCats = (typeof activePurItems !== 'undefined') ? activePurItems.map(i => i.category).filter(Boolean) : [];
    var customCats = db.customProductCategories || [];
    var deletedCats = db.deletedProductCategories || [];
    
    var allCats = [...new Set([...defaultCats, ...prodCats, ...activeItemCats, ...customCats])].filter(cat => !deletedCats.includes(cat));
    
    if(allCats.length === 0) {
      container.innerHTML = '<span style="font-size:0.72rem; color:var(--text-secondary); padding:2px 4px;">' + (isEn ? 'No categories registered yet.' : 'هنوز دسته‌بندی‌ای ثبت نشده است.') + '</span>';
      return;
    }
    var html = '';
    var delTitle = isEn ? 'Delete category' : 'حذف این دسته';
    allCats.forEach(c => {
      html += '<span class="category-chip" onclick="selectPurCategoryChip(\''+c.replace(/'/g, "\\'")+'\')">' +
                '<i class="fas fa-tag"></i> ' + c + 
                '<i class="fas fa-times delete-chip" title="'+delTitle+'" onclick="event.stopPropagation(); deleteProductCategoryChip(\''+c.replace(/'/g, "\\'")+'\')"></i>' +
              '</span>';
    });
    container.innerHTML = html;
  }

  function renderProductCategoryChips() {
    var container = document.getElementById('product-category-chips');
    if(!container) return;
    const isEn = (currentLang === 'en');
    var defaultCats = getDefaultProductCategories();
    var prodCats = (db.products || []).map(p => p.category).filter(Boolean);
    var customCats = db.customProductCategories || [];
    var deletedCats = db.deletedProductCategories || [];
    
    var allCats = [...new Set([...defaultCats, ...prodCats, ...customCats])].filter(cat => !deletedCats.includes(cat));
    
    if(allCats.length === 0) {
      container.innerHTML = '<span style="font-size:0.75rem; color:var(--text-secondary);">' + (isEn ? 'No categories added yet.' : 'هنوز دسته‌بندی‌ای افزوده نشده است.') + '</span>';
      return;
    }
    var html = '';
    var delTitle = isEn ? 'Delete category' : 'حذف این دسته';
    allCats.forEach(c => {
      html += '<span class="category-chip" onclick="selectCategoryChip(\''+c.replace(/'/g, "\\'")+'\')">' +
                '<i class="fas fa-tag"></i> ' + c + 
                '<i class="fas fa-times delete-chip" title="'+delTitle+'" onclick="event.stopPropagation(); deleteProductCategoryChip(\''+c.replace(/'/g, "\\'")+'\')"></i>' +
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

  function importProductsFromExcel() {
    const isEn = (currentLang === 'en');
    var defaultCats = getDefaultProductCategories();
    
    const proceedWithExcel = () => {
      var fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.xlsx, .xls, .csv';

      fileInput.onchange = function(e) {
        var file = e.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function(event) {
          try {
            var data = new Uint8Array(event.target.result);
            var workbook = XLSX.read(data, { type: 'array' });
            var firstSheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[firstSheetName];
            var jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

            if (!jsonRows || jsonRows.length === 0) {
              alert(isEn ? 'The Excel file is empty.' : 'فایل اکسل خالی است یا ساختار آن معتبر نیست.');
              return;
            }

            var importedCount = 0;
            jsonRows.forEach(row => {
              var name = row['نام کالا'] || row['نام_کالا'] || row['name'] || row['Product'] || row[Object.keys(row)[0]] || '';
              var factoryBarcode = row['بارکد'] || row['factoryBarcode'] || row['barcode'] || '';
              var qty = Number(row['موجودی انبار'] || row['موجودی'] || row['تعداد'] || row['qty'] || row['Quantity'] || row[Object.keys(row)[1]] || 0);
              var buyPrice = Number(row['قیمت خرید'] || row['قیمت'] || row['buyPrice'] || row['Price'] || row[Object.keys(row)[2]] || 0);
              var category = row['دسته‌بندی'] || row['category'] || row['Category'] || '';

              if (name.toString().trim() !== '') {
                if (category) {
                  if (!db.customProductCategories) db.customProductCategories = [];
                  if (!db.customProductCategories.includes(category) && !defaultCats.includes(category) && !DEFAULT_PRODUCT_CATEGORIES_FA.includes(category)) {
                    db.customProductCategories.push(category);
                  }
                }
                var barcode = generate15DigitCode(1, currentLang);
                var pObj = {
                  id: Date.now() + Math.random(),
                  name: name.toString().trim(),
                  barcode: barcode,
                  factoryBarcode: factoryBarcode.toString().trim(),
                  category: category.toString().trim(),
                  qty: isNaN(qty) ? 0 : qty,
                  buyPrice: isNaN(buyPrice) ? 0 : buyPrice,
                  price: Math.round(buyPrice * 1.25)
                };
                if (!db.products) db.products = [];
                db.products.push(pObj);
                importedCount++;
              }
            });

            if (importedCount > 0) {
              saveDb();
              renderProducts();
              renderStock();
              alert((isEn ? 'Successfully imported ' : 'با موفقیت ') + importedCount + (isEn ? ' products!' : ' کالا از فایل اکسل به انبار اضافه شد!'));
              closeModal('modal-product');
            } else {
              alert(isEn ? 'No valid products found.' : 'هیچ کالای معتبری در فایل یافت نشد.');
            }
          } catch (err) {
            console.error(err);
            alert(isEn ? 'Error reading Excel file.' : 'خطا در خواندن فایل اکسل.');
          }
        };
        reader.readAsArrayBuffer(file);
      };
      fileInput.click();
    };

    if (typeof XLSX !== 'undefined') {
      proceedWithExcel();
    } else {
      var script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      script.onload = function() {
        proceedWithExcel();
      };
      script.onerror = function() {
        alert(isEn ? 'Failed to load Excel library.' : 'خطا در اتصال و بارگذاری کتابخانه اکسل.');
      };
      document.head.appendChild(script);
    }
  }

  function saveProduct() {
    const isEn = (currentLang === 'en');
    var defaultCats = getDefaultProductCategories();
    var id = document.getElementById('prod-edit-id').value;
    var name = document.getElementById('prod-name').value.trim();
    if(!name) return alert(isEn ? 'Product name is required' : 'نام کالا الزامی است');
    
    var barcode = document.getElementById('prod-barcode').value.trim();
    if(!barcode) {
      barcode = generate15DigitCode(1, currentLang);
    }

    var factoryBarcode = document.getElementById('prod-factory-barcode').value.trim();
    
    var category = document.getElementById('prod-category').value.trim();
    if(category) {
      if(!db.customProductCategories) db.customProductCategories = [];
      if(!db.customProductCategories.includes(category) && !defaultCats.includes(category) && !DEFAULT_PRODUCT_CATEGORIES_FA.includes(category)) {
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
      factoryBarcode: factoryBarcode,
      category: category,
      qty: Number(document.getElementById('prod-qty').value) || 0,
      buyPrice: Number(document.getElementById('prod-buy-price').value) || 0,
      price: Number(document.getElementById('prod-price').value) || 0
    };
    if(id) { db.products = db.products.map(p => p.id == id ? pObj : p); } 
    else { db.products.push(pObj); }
    saveDb(); closeModal('modal-product');
  }

  function openProductModal() {
    document.getElementById('prod-edit-id').value = ''; 
    document.getElementById('prod-name').value = '';
    document.getElementById('prod-barcode').value = generate15DigitCode(1, currentLang);
    document.getElementById('prod-factory-barcode').value = '';
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
    document.getElementById('prod-factory-barcode').value = p.factoryBarcode || '';
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
