// ===== DYNAMIC GALLERY DATA =====
let galleryData = [];

// ===== RENDER LOGIC =====
async function renderGallery() {
    const gridEl = document.getElementById('dynamic-gallery-grid');
    if (!gridEl) return;

    try {
        const response = await fetch('data/gallery.json');
        if (!response.ok) throw new Error('Failed to load gallery data');
        galleryData = await response.json();

        gridEl.innerHTML = '';

        galleryData.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'gallery-item';

            itemDiv.addEventListener('click', () => openLightbox(item.src, item.caption));

            itemDiv.innerHTML = `
                <img src="${item.src}" alt="${item.caption}" loading="lazy">
                <div class="gallery-overlay">
                    <i class="fas fa-expand"></i><span>${item.title}</span>
                </div>
            `;

            gridEl.appendChild(itemDiv);
        });
    } catch (error) {
        console.error("Error loading gallery:", error);
        gridEl.innerHTML = '<p style="color: white; text-align: center; padding: 2rem;">Unable to load gallery images at this time.</p>';
    }
}

// ===== LIGHTBOX =====
const lbImages = [];

// DYNAMIC LIGHTBOX LOGIC
function openLightbox(src, caption) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lb-img').src = src;
    document.getElementById('lb-caption').textContent = caption;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';

    lbImages.length = 0;
    const gridEl = document.getElementById('dynamic-gallery-grid');
    if (gridEl && galleryData.length > 0) {
        galleryData.forEach(item => {
            lbImages.push({ src: item.src, cap: item.caption });
        });
    } else {
        document.querySelectorAll('.gallery-item').forEach(el => {
            try {
                const onclickStr = el.getAttribute('onclick');
                if (onclickStr) {
                    lbImages.push({ src: onclickStr.match(/'([^']+)'/)[1], cap: onclickStr.match(/'([^']+)'/g)[1]?.replace(/'/g, '') || '' });
                }
            } catch (e) { }
        });
    }
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

    renderGallery(); // Initialize dynamic gallery
    renderFeatures(); // Initialize features grid if available
    renderSectors(); // Initialize dynamic sectors
    renderIndexSectors(); // Initialize index page sectors
    renderServices(); // Initialize services grid for both index and services pages
    renderExhibitions(); // Initialize dynamic exhibitions list if available
    renderIndexFeatures(); // Initialize dynamic features list if available

    document.querySelectorAll('.features-grid .feature-card').forEach((el, i) => { el.style.transitionDelay = (i * 0.08) + 's'; });
    document.addEventListener('click', e => {
        const menu = document.getElementById('navMenu');
        const hamburger = document.getElementById('hamburger');
        if (menu && menu.classList.contains('open') && !menu.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
    });
});

async function renderFeatures() {
    const gridEl = document.getElementById('about-features-grid');
    if (!gridEl) return;

    try {
        const response = await fetch('data/features.json');
        if (!response.ok) throw new Error('Failed to load features data');
        const features = await response.json();

        let htmlContent = '';
        features.forEach((feature) => {
            // Check for missing main params as requested
            if (!feature.title || !feature.description) {
                console.warn('Skipping feature due to missing title or description', feature);
                return;
            }

            const imageHTML = feature.image ? `<img src="${feature.image}" alt="${feature.title}">` : '';
            const iconHTML = feature.icon ? `<div class="feature-illus-icon"><i class="${feature.icon}"></i></div>` : '';

            // Handle optional illus wrapper if image or icon exists
            let illusWrapper = '';
            if (imageHTML || iconHTML) {
                illusWrapper = `<div class="feature-illus">${imageHTML}${iconHTML}</div>`;
            }

            htmlContent += `
                <div class="feature-card">
                    ${illusWrapper}
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
            `;
        });

        gridEl.innerHTML = htmlContent;

        // Setup animations on the newly created cards
        const newCards = gridEl.querySelectorAll('.feature-card');
        newCards.forEach((el, i) => { el.style.transitionDelay = (i * 0.08) + 's'; });

        // We might need to observe them if they have fade-up classes, but the current grid items don't have .fade-up on about.html
        // If we add fade-up class, we'd do observeAnimations() here, but the original ones didn't have it either.

    } catch (error) {
        console.error("Error loading features:", error);
    }
}

async function renderIndexFeatures() {
    const gridEl = document.getElementById('index-features-grid');
    if (!gridEl) return;

    try {
        const response = await fetch('data/whyfci.json');
        if (!response.ok) throw new Error('Failed to load Why FCI data');
        const features = await response.json();

        let htmlContent = '';
        features.forEach((feature) => {
            if (!feature.title || !feature.description) {
                console.warn('Skipping index feature due to missing title or description', feature);
                return;
            }

            const iconHTML = feature.icon ? `<div class="feature-icon">${feature.icon}</div>` : '';

            htmlContent += `
            <div class="feature-card fade-up">
              ${iconHTML}
              <h3>${feature.title}</h3>
              <p>${feature.description}</p>
            </div>`;
        });

        gridEl.innerHTML = htmlContent;

        // Setup animations
        const newCards = gridEl.querySelectorAll('.feature-card');
        newCards.forEach((el, i) => { el.style.transitionDelay = (i * 0.08) + 's'; });
        observeAnimations();

    } catch (error) {
        console.error("Error loading index features:", error);
    }
}

async function renderSectors() {
    const containerEl = document.getElementById('dynamic-sectors-container');
    if (!containerEl) return;

    try {
        const response = await fetch('data/sectors.json');
        if (!response.ok) throw new Error('Failed to load sectors data');
        const sectors = await response.json();

        let htmlContent = '';
        sectors.forEach((sector) => {
            // Check for missing main params
            if (!sector.titleMain || !sector.description) {
                console.warn('Skipping sector due to missing titleMain or description', sector);
                return;
            }

            // Optional HTML bits for left side image box
            const iconHTML = sector.icon ? `<div class="sector-row-icon"><i class="${sector.icon}"></i></div>` : '';
            const labelHTML = sector.label ? `<span class="sector-row-label">${sector.label}</span>` : '';
            const styleAttr = sector.image ? `style="background-image:url('${sector.image}')"` : '';

            // Handle optional inner title parts
            const spanHTML = sector.titleSpan ? `<span>${sector.titleSpan}</span>` : '';
            const suffixHTML = sector.titleSuffix ? ` ${sector.titleSuffix}` : '';

            // Handle optional tags
            let tagsHTML = '';
            if (sector.tags && Array.isArray(sector.tags) && sector.tags.length > 0) {
                const spans = sector.tags.map(tag => `<span>${tag}</span>`).join('');
                tagsHTML = `<div class="sector-tags">\n                                    ${spans}\n                                </div>`;
            }

            htmlContent += `
                        <div class="sector-row-card">
                            <div class="sector-row-img" ${styleAttr}>
                                ${iconHTML}
                                ${labelHTML}
                            </div>
                            <div class="sector-row-body">
                                <h3>${sector.titleMain} ${spanHTML}${suffixHTML}</h3>
                                <p>${sector.description}</p>
                                ${tagsHTML}
                            </div>
                        </div>
            `;
        });

        containerEl.innerHTML = htmlContent;

    } catch (error) {
        console.error("Error loading sectors:", error);
    }
}

async function renderIndexSectors() {
    const gridEl = document.getElementById('index-sectors-grid');
    if (!gridEl) return;

    try {
        const response = await fetch('data/sectors.json');
        if (!response.ok) throw new Error('Failed to load sectors data');
        const sectors = await response.json();

        let htmlContent = '';
        sectors.forEach((sector) => {
            // Check for missing main params - we require titleMain for index sectors
            if (!sector.titleMain) {
                console.warn('Skipping index sector due to missing titleMain', sector);
                return;
            }

            // Optional HTML elements
            const styleAttr = sector.image ? `style="background-image:url('${sector.image}')"` : '';
            const ariaLabel = `aria-label="${sector.titleMain} Exhibition"`;
            const iconHTML = sector.icon ? `<div class="sector-icon-wrap"><i class="${sector.icon}"></i></div>` : '';

            // Use indexDescription for description if available, fallback to description
            let descText = sector.indexDescription || sector.description || '';

            htmlContent += `
            <div class="sector-card fade-up">
              <div class="sector-img"
                ${styleAttr}
                role="img" ${ariaLabel}></div>
              <div class="sector-body">
                ${iconHTML}
                <h3>${sector.titleMain}</h3>
                <p>${descText}</p>
              </div>
            </div>`;
        });

        gridEl.innerHTML = htmlContent;

        // Re-run observeAnimations for new fade-up elements
        observeAnimations();

    } catch (error) {
        console.error("Error loading index sectors:", error);
    }
}

async function renderServices() {
    const servicesGrid = document.getElementById('services-page-grid');
    const indexServicesGrid = document.getElementById('index-services-grid');

    // Quick exit if neither grid is found on the current page
    if (!servicesGrid && !indexServicesGrid) return;

    try {
        const response = await fetch('data/services.json');
        if (!response.ok) throw new Error('Failed to load services data');
        const services = await response.json();

        let htmlContent = '';
        let indexHtmlContent = '';

        services.forEach((service) => {
            // Validation Check
            if (!service.title || !service.descriptionItems || service.descriptionItems.length === 0) {
                console.warn('Skipping service due to missing title or description list', service);
                return;
            }

            // Optional UI pieces
            const imageHTML = service.image ? `<img src="${service.image}" alt="${service.title}" loading="lazy">` : '';
            const iconOverlay = service.icon ? `<div class="service-illus-overlay"><i class="${service.icon}"></i></div>` : '';
            const iconSpan = service.icon ? `<span class="icon"><i class="${service.icon}"></i></span>` : '';

            // Build the List HTML
            const listItems = service.descriptionItems.map(item => `<li>${item}</li>`).join('');

            // Build the unified core interior of the card
            const cardInner = `
              <div class="service-illus">
                ${imageHTML}
                ${iconOverlay}
              </div>
              <div class="service-header">
                ${iconSpan}
                <h3>${service.title}</h3>
              </div>
              <div class="service-body">
                <ul>
                  ${listItems}
                </ul>
              </div>
            `;

            // Add the respective wrapper depending on if it's the index page or services page
            if (servicesGrid) {
                htmlContent += `<div class="service-card">${cardInner}</div>`;
            }
            if (indexServicesGrid) {
                indexHtmlContent += `<div class="service-card fade-up">${cardInner}</div>`;
            }
        });

        // Inject the built HTML dynamically based on which grids exist
        if (servicesGrid) {
            servicesGrid.innerHTML = htmlContent;
        }
        if (indexServicesGrid) {
            indexServicesGrid.innerHTML = indexHtmlContent;
            observeAnimations(); // trigger the new fade-ups class elements
        }

    } catch (error) {
        console.error("Error loading services:", error);
    }
}

async function renderExhibitions() {
    const gridEl = document.getElementById('dynamic-exhibitions-grid');
    if (!gridEl) return;

    try {
        const response = await fetch('data/exhibitions.json');
        if (!response.ok) throw new Error('Failed to load exhibitions data');
        const exhibitions = await response.json();

        let htmlContent = '';
        exhibitions.forEach((event) => {
            // Validation requirements
            if (!event.title || !event.description) {
                console.warn('Skipping exhibition due to missing title or description', event);
                return;
            }

            // Optional HTML bits
            const iconHTML = event.icon ? `<span class="ex-icon">${event.icon}</span>` : '';
            const sectorBadgeHTML = event.sectorBadge ? `<span class="ex-sector-badge">${event.sectorBadge}</span>` : '';
            const subtitleHTML = event.subtitle ? `<p>${event.subtitle}</p>` : '';

            const locationHTML = event.location ? `<span class="ex-meta-item">📍 <strong>${event.location}</strong></span>` : '';
            const statusHTML = event.status ? `<span class="ex-meta-item">📅 <strong>${event.status}</strong></span>` : '';
            const linkHTML = event.ctaLink ? `<a href="${event.ctaLink}" class="ex-cta" onclick="showPage('contact')">Enquire Now →</a>` : '';

            htmlContent += `
                        <div class="exhibition-card">
                            <div class="ex-header">
                                ${iconHTML}
                                ${sectorBadgeHTML}
                                <h3>${event.title}</h3>
                                ${subtitleHTML}
                            </div>
                            <div class="ex-body">
                                <div class="ex-meta">
                                    ${locationHTML}
                                    ${statusHTML}
                                </div>
                                <p class="ex-description">${event.description}</p>
                                ${linkHTML}
                            </div>
                        </div>
            `;
        });

        gridEl.innerHTML = htmlContent;
    } catch (error) {
        console.error('Error loading exhibitions:', error);
    }
}

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