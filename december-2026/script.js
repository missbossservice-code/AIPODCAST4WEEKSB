'use strict';
const galleryToggle = document.querySelector('#gallery-toggle');
const cards = Array.from(document.querySelectorAll('.testimonial'));
galleryToggle.addEventListener('click', () => {
  const expanded = galleryToggle.getAttribute('aria-expanded') === 'true';
  cards.slice(6).forEach(card => { card.hidden = expanded; });
  galleryToggle.setAttribute('aria-expanded', String(!expanded));
  galleryToggle.textContent = expanded ? '看更多學員回饋 ＋' : '收起部分回饋 −';
});
const dialog = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxTitle = document.querySelector('#lightbox-title');
const lightboxCount = document.querySelector('#lightbox-count');
const images = Array.from(document.querySelectorAll('[data-lightbox]'));
let activeImage = 0;
function showImage(index) {
  activeImage = (index + images.length) % images.length;
  const button = images[activeImage];
  lightboxImage.src = button.dataset.lightbox;
  lightboxImage.alt = button.dataset.caption + '・原始截圖';
  lightboxTitle.textContent = button.dataset.caption;
  lightboxCount.textContent = `${activeImage + 1} / ${images.length}`;
  dialog.scrollTop = 0;
}
images.forEach((button, index) => button.addEventListener('click', () => {
  // The image remains directly accessible in browsers without native dialog support.
  if (typeof dialog.showModal !== 'function') {
    window.open(button.dataset.lightbox, '_blank', 'noopener');
    return;
  }
  showImage(index);
  dialog.showModal();
  document.body.classList.add('modal-open');
}));
document.querySelector('#lightbox-close').addEventListener('click', () => dialog.close());
document.querySelector('#lightbox-prev').addEventListener('click', () => showImage(activeImage - 1));
document.querySelector('#lightbox-next').addEventListener('click', () => showImage(activeImage + 1));
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); showImage(activeImage + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(activeImage - 1); }
});
// All offer boundaries use Taiwan time, independent of the visitor's timezone.
function updateOffer(now = Date.now()) {
  const earlyEnd = Date.parse('2026-12-01T00:00:00+08:00');
  const close = Date.parse('2026-12-05T00:00:00+08:00');
  if (now >= close) {
    document.querySelector('[data-price-label]').textContent = '本梯報名已截止';
    document.querySelector('[data-mobile-price]').textContent = '本梯報名已截止';
    document.querySelector('[data-offer]').textContent = '十二月班報名已截止，歡迎洽詢後續課程。';
    document.querySelectorAll('[data-payment]').forEach(link => {
      link.href = 'https://line.me/R/ti/p/@989pnlth';
      link.textContent = '洽詢下期課程 ↗';
    });
  } else if (now >= earlyEnd) {
    document.querySelector('[data-price-label]').textContent = '十二月班正式報名';
    document.querySelector('[data-price]').textContent = '9,800';
    document.querySelector('[data-mobile-price]').textContent = '正式價 NT$9,800';
    document.querySelector('[data-offer]').textContent = '正式價 NT$9,800｜12/04（五）23:59 截止報名';
  }
}
updateOffer();
