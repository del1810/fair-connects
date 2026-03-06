// ===== LIGHTBOX =====
const lbImages = [];
function openLightbox(src, caption) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lb-img').src = src;
    document.getElementById('lb-caption').textContent = caption;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Build index
    lbImages.length = 0;
    document.querySelectorAll('.gallery-item').forEach(el => {
        lbImages.push({ src: el.getAttribute('onclick').match(/'([^']+)'/)[1], cap: el.getAttribute('onclick').match(/'([^']+)'/g)[1]?.replace(/'/g, '') || '' });
    });
}

function closeLightbox(e) {
    if (e && e.target !== document.getElementById('lightbox') && !e.target.classList.contains('lb-close')) return;
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
}

function lbNav(dir) {
    const img = document.getElementById('lb-img');
    const idx = lbImages.findIndex(i => i.src === img.src.split('?')[0] || img.src.includes(i.src.split('?')[0].split('/').pop()));
    const next = (idx + dir + lbImages.length) % lbImages.length;
    if (lbImages[next]) {
        document.getElementById('lb-img').src = lbImages[next].src;
        document.getElementById('lb-caption').textContent = lbImages[next].cap;
    }
}

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
    // document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // document.getElementById('page-' + pageId).classList.add('active');
    window.location.href = `${pageId}.html`;

    // document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
    // const navEl = document.getElementById('nav-' + pageId);
    // if (navEl) navEl.classList.add('active');
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    // closeMenu();
    // setTimeout(observeAnimations, 100);
}

// ===== MOBILE MENU =====
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    if (menu.classList.contains('open')) { closeMenu(); }
    else { menu.classList.add('open'); hamburger.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeMenu() {
    const menu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    if (menu) menu.classList.remove('open');
    if (hamburger) hamburger.classList.remove('open');
    document.body.style.overflow = '';
}

// ===== TABS =====
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// ===== FORM SUBMIT =====
function handleSubmit() {
    const btn = document.querySelector('.submit-btn');
    btn.innerHTML = '<i class="fas fa-check"></i> &nbsp;Message Sent! We\'ll be in touch soon.';
    btn.style.background = '#2d7a4f'; btn.style.color = '#fff';
    setTimeout(() => { btn.innerHTML = 'Send Message'; btn.style.background = ''; btn.style.color = ''; }, 4000);
}

// ===== SCROLL TO TOP =====
const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => { scrollBtn.classList.toggle('visible', window.scrollY > 300); });

// ===== SCROLL ANIMATIONS =====
function observeAnimations() {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: 0.1 });
    document.querySelectorAll('.fade-up:not(.visible)').forEach(el => obs.observe(el));
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    setNavigationLink();
    observeAnimations();
    document.querySelectorAll('.features-grid .feature-card, .services-grid .service-card').forEach((el, i) => { el.style.transitionDelay = (i * 0.08) + 's'; });
    document.addEventListener('click', e => {
        const menu = document.getElementById('navMenu');
        const hamburger = document.getElementById('hamburger');
        if (menu && menu.classList.contains('open') && !menu.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
    });
});

function setNavigationLink() {

    let currentPage = window.location.pathname.split("/").pop();

    if (!currentPage) {
        currentPage = "index.html";
    }

    let selectedPage = currentPage.split(".")[0];

    // special handling for home page
    if (selectedPage === "index") {
        selectedPage = "home";
    }

    let navLinks = document.querySelectorAll(".nav-menu a");

    navLinks.forEach(link => {
        link.classList.remove("active");

        if (link.id === "nav-" + selectedPage) {
            link.classList.add("active");
        }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMenu();
    setTimeout(observeAnimations, 100);
}