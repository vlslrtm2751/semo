'use strict';

/* 움직임 최소화 설정. 사용자가 도중에 바꿔도 반영되도록 라이브 쿼리로 둔다. */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const scrollBehavior = () => (reduceMotion.matches ? 'auto' : 'smooth');

/* =============================================
   HEADER — scroll shadow
   ============================================= */
const header       = document.getElementById('header');
const scrollTopBtn = document.getElementById('scrollTopBtn');

/* 스크롤 이벤트는 초당 수십 번 발생한다. 프레임당 한 번만 읽는다. */
let scrollQueued = false;
window.addEventListener('scroll', () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 8);
    scrollTopBtn.classList.toggle('show', y > 400);
    scrollQueued = false;
  });
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: scrollBehavior() });
});

/* =============================================
   SEARCH TOGGLE
   ============================================= */
const searchToggle = document.querySelector('.search-toggle');
const searchBar    = document.getElementById('searchBar');
const searchInput  = searchBar.querySelector('input');

function setSearch(open) {
  searchBar.classList.toggle('open', open);
  searchToggle.setAttribute('aria-expanded', String(open));
  if (open) searchInput.focus();
}

searchToggle.addEventListener('click', () => {
  setSearch(!searchBar.classList.contains('open'));
});

/* 검색창 안에서 Escape 를 누르면 닫고 포커스를 버튼으로 되돌린다. */
searchBar.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    setSearch(false);
    searchToggle.focus();
  }
});

/* =============================================
   MOBILE MENU
   ============================================= */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const menuClose  = document.getElementById('menuClose');
const overlay    = document.getElementById('overlay');

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
let lastFocused = null;

function menuIsOpen() {
  return mobileMenu.classList.contains('open');
}

function openMenu() {
  lastFocused = document.activeElement;
  mobileMenu.classList.add('open');
  overlay.classList.add('show');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
  mobileMenu.inert = false;
  document.body.style.overflow = 'hidden';
  menuClose.focus();
}

function closeMenu() {
  if (!menuIsOpen()) return;
  mobileMenu.classList.remove('open');
  overlay.classList.remove('show');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  /* 메뉴를 열기 전에 있던 자리로 포커스를 먼저 돌려준 뒤 비활성으로 만든다.
     순서가 바뀌면 inert 안에 갇힌 포커스가 갈 곳을 잃는다. */
  if (lastFocused) lastFocused.focus();
  mobileMenu.inert = true;
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

/* 메뉴가 열려 있는 동안 Tab 이 뒤쪽 콘텐츠로 새어나가지 않게 가둔다. */
mobileMenu.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeMenu(); return; }
  if (e.key !== 'Tab') return;

  const items = [...mobileMenu.querySelectorAll(FOCUSABLE)]
    .filter(el => el.offsetParent !== null);
  if (!items.length) return;

  const first = items[0];
  const last  = items[items.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
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
const slider      = document.getElementById('slider');
const sliderTrack = document.getElementById('sliderTrack');
const dots        = Array.from(document.querySelectorAll('.slider__dot'));
const prevBtn     = document.getElementById('sliderPrev');
const nextBtn     = document.getElementById('sliderNext');
const stopBtn     = document.getElementById('sliderStop');
const playBtn     = document.getElementById('sliderPlay');
const TOTAL       = dots.length;

let current   = 0;
let autoTimer = null;
/* 사용자가 명시적으로 멈춘 상태. 움직임 최소화 설정이면 처음부터 멈춰서 시작한다. */
let userPaused = reduceMotion.matches;
/* 마우스나 키보드 포커스가 슬라이더 안에 머무는 동안의 일시 정지.
   둘은 독립적이라 따로 센다. 하나만 쓰면 마우스를 올린 채 Tab 을 눌렀을 때
   포커스가 빠졌다는 이유로 마우스가 아직 위에 있는데도 다시 돌아간다. */
let hovering    = false;
let focusWithin = false;
const holding = () => hovering || focusWithin;

/* 캐러셀에서는 loading="lazy" 가 듣지 않는다. 슬라이드가 가로로 나란히 놓여
   브라우저가 전부 "화면 근처"로 판단해 즉시 받아버리기 때문이다.
   그래서 필요한 것만 직접 붙인다. */
const slideImgs = Array.from(sliderTrack.querySelectorAll('img'));

function loadSlide(i) {
  const img = slideImgs[i];
  if (img && img.dataset.src) {
    img.src = img.dataset.src;
    delete img.dataset.src;
  }
}

/* 지금 보이는 것과 양옆 한 장씩만 준비해 둔다. */
function primeSlides() {
  loadSlide(current);
  loadSlide((current + 1) % TOTAL);
  loadSlide((current - 1 + TOTAL) % TOTAL);
}

function goTo(idx) {
  current = ((idx % TOTAL) + TOTAL) % TOTAL;
  sliderTrack.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === current);
    d.setAttribute('aria-current', String(i === current));
  });
  primeSlides();
}

/* 타이머를 켜고 끄는 단 하나의 통로. 각 이벤트는 상태만 바꾸고 여기에 맡긴다. */
function syncAuto() {
  const shouldRun = !userPaused && !holding() && !document.hidden;
  if (shouldRun && !autoTimer) {
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  } else if (!shouldRun && autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
}

/* 자동으로 넘어가는 동안에는 낭독을 끄고, 멈춘 뒤에는 바뀐 슬라이드를 알린다. */
function setPaused(paused) {
  userPaused = paused;
  stopBtn.hidden = paused;
  playBtn.hidden = !paused;
  sliderTrack.setAttribute('aria-live', paused ? 'polite' : 'off');
  syncAuto();
}

prevBtn.addEventListener('click', () => { goTo(current - 1); setPaused(true); });
nextBtn.addEventListener('click', () => { goTo(current + 1); setPaused(true); });
stopBtn.addEventListener('click', () => setPaused(true));
playBtn.addEventListener('click', () => setPaused(false));
dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); setPaused(true); }));

/* 상품을 보려는 순간 슬라이드가 넘어가지 않도록 붙잡는다. */
slider.addEventListener('mouseenter', () => { hovering = true;  syncAuto(); });
slider.addEventListener('mouseleave', () => { hovering = false; syncAuto(); });

/* 재생/정지 버튼은 제외한다. 재생을 누른 직후 그 버튼에 포커스가 남는데,
   이것까지 일시정지로 치면 방금 누른 재생이 곧바로 무효가 된다. */
const holdsFocus = el => el instanceof Node
  && slider.contains(el)
  && !el.closest('.slider__controls');

slider.addEventListener('focusin', e => {
  if (!holdsFocus(e.target)) return;
  focusWithin = true;
  syncAuto();
});
slider.addEventListener('focusout', e => {
  /* 슬라이더 안에서 요소 사이를 옮겨 다니는 것은 빠져나간 게 아니다. */
  if (holdsFocus(e.relatedTarget)) return;
  focusWithin = false;
  syncAuto();
});

/* 보이지 않는 탭에서 타이머를 돌릴 이유가 없다. */
document.addEventListener('visibilitychange', syncAuto);

/* 좌우 화살표로도 넘길 수 있게 한다. */
slider.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  { goTo(current - 1); setPaused(true); }
  if (e.key === 'ArrowRight') { goTo(current + 1); setPaused(true); }
});

/* 설정을 도중에 바꾸면 따라간다. */
reduceMotion.addEventListener('change', () => setPaused(reduceMotion.matches));

/* 첫 화면에서는 다음 한 장만 미리 받는다. 이전 장은 뒤로 넘길 때 붙는다. */
loadSlide(1);
setPaused(userPaused);

/* Touch swipe */
let touchX = 0;
sliderTrack.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
sliderTrack.addEventListener('touchend', e => {
  const diff = touchX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 48) {
    goTo(diff > 0 ? current + 1 : current - 1);
    setPaused(true);
  }
}, { passive: true });

/* =============================================
   MERCHANDISE TABS
   ============================================= */
const tabBtns   = Array.from(document.querySelectorAll('.tab-btn'));
const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));

function selectTab(idx, moveFocus) {
  const btn = tabBtns[idx];
  if (!btn) return;

  tabBtns.forEach((b, i) => {
    const on = i === idx;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', String(on));
    /* 로빙 tabindex: 활성 탭 하나만 Tab 키 순서에 남긴다. */
    b.tabIndex = on ? 0 : -1;
  });

  tabPanels.forEach(p => {
    p.classList.remove('active');
    p.hidden = true;
  });

  const panel = document.getElementById(`tab-${btn.dataset.tab}`);
  if (panel) {
    panel.classList.add('active');
    panel.hidden = false;
  }

  if (moveFocus) btn.focus();
}

tabBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => selectTab(i, false));

  btn.addEventListener('keydown', e => {
    const keys = {
      ArrowRight: (i + 1) % tabBtns.length,
      ArrowLeft:  (i - 1 + tabBtns.length) % tabBtns.length,
      Home: 0,
      End: tabBtns.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    selectTab(keys[e.key], true);
  });
});

/* =============================================
   WEEKLY BEST — 목록에서 고른 상품을 오른쪽에 크게 보여준다
   ============================================= */
const weeklyItems  = Array.from(document.querySelectorAll('.weekly-best__item'));
const previewImg   = document.getElementById('weeklyPreviewImg');
const previewRank  = document.getElementById('weeklyPreviewRank');
const previewName  = document.getElementById('weeklyPreviewName');
const previewPrice = document.getElementById('weeklyPreviewPrice');
const previewLink  = document.getElementById('weeklyPreviewLink');

if (previewImg) {
  weeklyItems.forEach(item => {
    const link = item.querySelector('.weekly-best__link');
    if (!link) return;

    /* 목록 자체가 이미 상품명과 가격을 담고 있다. 별도 데이터를 두면 둘이 어긋난다. */
    const showPreview = () => {
      weeklyItems.forEach(it => it.classList.remove('active'));
      item.classList.add('active');

      const thumb = item.querySelector('.weekly-best__thumb');
      const rank  = item.querySelector('.weekly-best__rank');
      const name  = item.querySelector('.weekly-best__meta p');
      const price = item.querySelector('.weekly-best__meta span');

      /* 목록은 120px 썸네일을 쓴다. 크게 볼 원본 경로는 data-full 에 있다. */
      if (thumb) {
        previewImg.src = thumb.dataset.full || thumb.src;
        previewImg.alt = thumb.alt;
      }
      if (rank  && previewRank)  previewRank.textContent  = rank.textContent;
      if (name  && previewName)  previewName.textContent  = name.textContent;
      if (price && previewPrice) previewPrice.textContent = price.textContent;
      if (previewLink) previewLink.href = link.href;
    };

    /* 마우스는 hover 로, 키보드는 focus 로 같은 결과에 닿는다. */
    link.addEventListener('mouseenter', showPreview);
    link.addEventListener('focus', showPreview);
  });
}

/* =============================================
   SMOOTH SCROLL — banner GO button
   ============================================= */
document.querySelectorAll('.js-scroll-to').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const target = document.getElementById(el.dataset.target);
    if (!target) return;
    target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    /* 스크롤만 하면 키보드 사용자는 어디로 갔는지 알 수 없다. */
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});
