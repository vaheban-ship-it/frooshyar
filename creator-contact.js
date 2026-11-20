// ==========================================
// creator-contact.js - ماژول مستقل ارتباط با سازنده نرم‌افزار (فروش‌یار)
// طراح و مالک معنوی: علی نصیری صومعه علیا
// ==========================================

(function() {
  const CREATOR_INFO = {
    nameFa: 'علی نصیری صومعه علیا',
    nameEn: 'Ali Nasiri Someh Olia',
    roleFa: 'طراح، معمار نرم‌افزار و توسعه‌دهنده سیستم جامع فروش‌یار',
    roleEn: 'Architect & Lead Developer of Frooshyar System',
    socials: [
      {
        id: 'telegram',
        labelFa: 'تلگرام',
        labelEn: 'Telegram',
        handle: 'pvmyan',
        url: 'https://t.me/pvmyan',
        icon: 'fab fa-telegram',
        badgeIcon: 'fas fa-external-link-alt',
        bg: '#e3f2fd',
        border: '#90caf9',
        color: '#1565c0'
      },
      {
        id: 'instagram',
        labelFa: 'اینستاگرام',
        labelEn: 'Instagram',
        handle: 'ali__nasiri100',
        url: 'https://instagram.com/ali__nasiri100',
        icon: 'fab fa-instagram',
        badgeIcon: 'fas fa-external-link-alt',
        bg: '#fce4ec',
        border: '#f48fb1',
        color: '#c2185b'
      },
      {
        id: 'eitaa',
        labelFa: 'ایتا',
        labelEn: 'Eitaa',
        handle: 'Alin100',
        url: 'https://eitaa.com/Alin100',
        icon: 'fas fa-comment-dots',
        badgeIcon: 'fas fa-external-link-alt',
        bg: '#fff3e0',
        border: '#ffcc80',
        color: '#ef6c00'
      },
      {
        id: 'email',
        labelFa: 'جیمیل',
        labelEn: 'Gmail',
        handle: 'vaheban@gmail.com',
        url: 'mailto:vaheban@gmail.com',
        icon: 'fas fa-envelope',
        badgeIcon: 'fas fa-paper-plane',
        bg: '#f5f5f5',
        border: '#cfd8dc',
        color: '#37474f'
      }
    ],
    bioFa: 'بهره‌گیری از قابلیت‌های نرم‌افزاری، ضمن بالا بردن سرعت و دقت، موجب صرفه‌جویی در وقت و هزینه نیز می‌گردد.\nبه دلیل پیچیدگی و هزینه بالای نرم‌افزارهای حسابداری و نیز نیاز کسب‌وکارهای کوچک و متوسط (ثابت و سیار) به قابلیت‌های نرم‌افزاری، اینجانب علی نصیری بر آن شدم جهت رفع نیاز این اقشار عزیز، نرم‌افزاری که ضمن سادگی و در عین حال اصولی باشد را تولید و تقدیم نمایم.\nاز شما عزیزان انتظار دارم با نظرات، پیشنهادات و نیز گزارش خطاها و نواقص، در هرچه بهتر و غنی‌تر شدن نرم‌افزار «فروش‌یار» مرا یاری فرمایید.',
    bioEn: 'Leveraging software capabilities increases speed and accuracy while saving time and cost.\nGiven the complexity and high cost of accounting software—and the practical needs of small and medium businesses (both fixed and mobile)—I, Ali Nasiri, set out to build a simple yet structured accounting tool tailored for them.\nI warmly welcome your feedback, suggestions, and bug reports to help make Frooshyar even better and more complete.'
  };

  function renderCreatorModal() {
    const container = document.getElementById('creator-social-links-container');
    if (!container) return;

    const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en');

    const nameEl = document.getElementById('creator-name-display');
    if (nameEl) nameEl.textContent = isEn ? CREATOR_INFO.nameEn : CREATOR_INFO.nameFa;

    const descEl = document.querySelector('#modal-creator [data-i18n="creator_desc"]');
    if (descEl) descEl.textContent = isEn ? CREATOR_INFO.roleEn : CREATOR_INFO.roleFa;

    let html = '';
    CREATOR_INFO.socials.forEach(item => {
      const labelText = isEn ? item.labelEn : item.labelFa;
      html += `
        <a href="${item.url}" target="_blank" rel="noopener noreferrer"
           style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:${item.bg}; border:1px solid ${item.border}; border-radius:12px; text-decoration:none; color:${item.color}; font-weight:bold; font-size:0.84rem;">
          <span><i class="${item.icon}"></i> ${labelText} (${item.handle})</span>
          <i class="${item.badgeIcon}"></i>
        </a>
      `;
    });
    container.innerHTML = html;

    const bioBox = container.nextElementSibling;
    if (bioBox) {
      const bioText = isEn ? CREATOR_INFO.bioEn : CREATOR_INFO.bioFa;
      bioBox.innerHTML = bioText.split('\n').map(line => `<p style="margin:0 0 6px 0;">${line}</p>`).join('');
    }
  }

  window.renderCreatorModal = renderCreatorModal;

  document.addEventListener('DOMContentLoaded', function() {
    renderCreatorModal();
  });
})();
