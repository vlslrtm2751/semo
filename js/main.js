'use strict';

/* =============================================
   HEADER — scroll shadow
   ============================================= */
const header      = document.getElementById('header');
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 8);
  scrollTopBtn.classList.toggle('show', y > 400);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =============================================
   SEARCH TOGGLE
   ============================================= */
const searchToggle = document.querySelector('.search-toggle');
const searchBar    = document.getElementById('searchBar');

searchToggle.addEventListener('click', () => {
  const open = searchBar.classList.toggle('open');
  searchToggle.setAttribute('aria-expanded', String(open));
  if (open) searchBar.querySelector('input').focus();
});

/* =============================================
   MOBILE MENU
   ============================================= */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const menuClose  = document.getElementById('menuClose');
const overlay    = document.getElementById('overlay');

function openMenu() {
  mobileMenu.classList.add('open');
  overlay.classList.add('show');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  overlay.classList.remove('show');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

/* Mobile accordion sub-menus */
document.querySelectorAll('.mobile-menu__toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const sub  = btn.nextElementSibling;
    const open = sub.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  });
});

/* =============================================
   HERO SLIDER
   ============================================= */
const sliderTrack = document.getElementById('sliderTrack');
const dots        = Array.from(document.querySelectorAll('.slider__dot'));
const prevBtn     = document.getElementById('sliderPrev');
const nextBtn     = document.getElementById('sliderNext');
const stopBtn     = document.getElementById('sliderStop');
const playBtn     = document.getElementById('sliderPlay');
const TOTAL       = dots.length;
let current       = 0;
let autoTimer     = null;

function goTo(idx) {
  current = ((idx % TOTAL) + TOTAL) % TOTAL;
  sliderTrack.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === current);
    d.setAttribute('aria-selected', String(i === current));
  });
}

function startAuto() {
  autoTimer = setInterval(() => goTo(current + 1), 4000);
}
function stopAuto() {
  clearInterval(autoTimer);
  autoTimer = null;
}

prevBtn.addEventListener('click', () => { goTo(current - 1); stopAuto(); stopBtn.hidden = true; playBtn.hidden = false; });
nextBtn.addEventListener('click', () => { goTo(current + 1); stopAuto(); stopBtn.hidden = true; playBtn.hidden = false; });
stopBtn.addEventListener('click', () => { stopAuto(); stopBtn.hidden = true; playBtn.hidden = false; });
playBtn.addEventListener('click', () => { startAuto(); playBtn.hidden = true; stopBtn.hidden = false; });
dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

startAuto();

/* Touch swipe */
let touchX = 0;
sliderTrack.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
sliderTrack.addEventListener('touchend',   e => {
  const diff = touchX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 48) goTo(diff > 0 ? current + 1 : current - 1);
}, { passive: true });

/* =============================================
   MERCHANDISE TABS
   ============================================= */
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    tabPanels.forEach(p => {
      p.classList.remove('active');
      p.hidden = true;
    });

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const panel = document.getElementById(`tab-${target}`);
    if (panel) { panel.classList.add('active'); panel.hidden = false; }
  });
});

/* =============================================
   WEEKLY BEST — hover preview
   ============================================= */
const weeklyItems   = document.querySelectorAll('.weekly-best__item');
const previewImg    = document.getElementById('weeklyPreviewImg');
const previewRank   = document.getElementById('weeklyPreviewRank');
const previewName   = document.getElementById('weeklyPreviewName');
const previewPrice  = document.getElementById('weeklyPreviewPrice');

const bestData = [
  { img: 'img/hoodie_big_01.jpg', name: '피플데님아노락-Top (2Color)',   price: '￦78,000', rank: '01' },
  { img: 'img/hoodie_big_02.jpg', name: '엠오엠 워싱-후드 (4Color)',     price: '￦41,000', rank: '02' },
  { img: 'img/hoodie_big_03.jpg', name: '파이핑스퀘어-니트 (4Color)',    price: '￦31,000', rank: '03' },
  { img: 'img/hoodie_big_04.jpg', name: '파이핑스퀘어-니트 (4Color)',    price: '￦31,000', rank: '04' },
  { img: 'img/hoodie_big_05.jpg', name: '키코하이넥JK (2Color)',          price: '￦89,000', rank: '05' },
  { img: 'img/hoodie_big_06.jpg', name: '통카라-MTM (4Color)',            price: '￦30,000', rank: '06' },
  { img: 'img/hoodie_big_07.jpg', name: '메이트톤톤-후드 (3Color)',       price: '￦45,000', rank: '07' },
  { img: 'img/hoodie_big_08.jpg', name: '버터플라이-MTM (3Color)',        price: '￦89,000', rank: '08' },
  { img: 'img/hoodie_big_09.jpg', name: '루즈컷팅-MTM (6Color)',          price: '￦46,000', rank: '09' },
  { img: 'img/hoodie_big_10.jpg', name: '루즈컷팅-Nb (5Color)',           price: '￦46,000', rank: '10' },
];

if (previewImg) {
  weeklyItems.forEach((item, i) => {
    item.addEventListener('mouseenter', () => {
      weeklyItems.forEach(it => it.classList.remove('active'));
      item.classList.add('active');
      const d = bestData[i];
      previewImg.src   = d.img;
      previewImg.alt   = d.name;
      if (previewRank)  previewRank.textContent  = d.rank;
      if (previewName)  previewName.textContent  = d.name;
      if (previewPrice) previewPrice.textContent = d.price;
    });
  });
}

/* =============================================
   SMOOTH SCROLL — banner GO button
   ============================================= */
document.querySelectorAll('.js-scroll-to').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const target = document.getElementById(el.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
