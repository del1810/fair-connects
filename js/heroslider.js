// ===== HERO SLIDER =====
let currentSlide = 0;
let slideTimer;
let slides = [];
let dots = [];

async function loadHeroSlider() {
    try {
        const response = await fetch('data/heroslider.json');
        if (!response.ok) throw new Error('Failed to load hero slider data');
        const data = await response.json();

        const sliderContainer = document.querySelector('.hero-slider');
        const dotsContainer = document.querySelector('.slider-dots');

        if (!sliderContainer || !dotsContainer) return;

        let slidesHTML = '';
        let dotsHTML = '';
        let validIndex = 0;

        data.forEach((slide) => {
            // Check for main params
            if (!slide.image || !slide.title) {
                console.warn('Skipping hero slide due to missing main parameters (image or title)', slide);
                return;
            }

            const activeClass = validIndex === 0 ? 'active' : '';

            // Handle optional keys
            const badgeHTML = slide.badge && slide.badge.trim() !== '' ? `<div class="hero-badge">${slide.badge}</div>` : '';
            const taglineHTML = slide.tagline && slide.tagline.trim() !== '' ? `<div class="hero-tagline">${slide.tagline}</div>` : '';
            const descHTML = slide.description && slide.description.trim() !== '' ? `<p>${slide.description}</p>` : '';

            let buttonsHTML = '';
            if (slide.buttons && Array.isArray(slide.buttons) && slide.buttons.length > 0) {
                const btns = slide.buttons.map(btn => {
                    const actionAttr = btn.action ? `onclick="${btn.action}"` : '';
                    return `<a href="${btn.href || '#'}" class="${btn.class || 'btn-primary'}" ${actionAttr}>${btn.text}</a>`;
                }).join('\n              ');

                buttonsHTML = `<div class="hero-btns">\n${btns}\n</div>`;
            }

            slidesHTML += `<div class="slide ${activeClass}" style="background-image:url('${slide.image}')">
            <div class="slide-overlay"></div>
            <div class="slide-grid"></div>
            <div class="container slide-content">
                ${badgeHTML}
                ${taglineHTML}
                <h1>${slide.title}</h1>
                <div class="hero-divider"></div>
                ${descHTML}
                ${buttonsHTML}
            </div>
            </div>`;

            dotsHTML += `<button class="dot ${activeClass}" onclick="goToSlide(${validIndex})" aria-label="Slide ${validIndex + 1}"></button>\n`;
            validIndex++;
        });

        const statsElement = sliderContainer.querySelector('.hero-stats');
        if (statsElement) {
            statsElement.insertAdjacentHTML('beforebegin', slidesHTML);
        } else {
            sliderContainer.insertAdjacentHTML('afterbegin', slidesHTML);
        }

        dotsContainer.innerHTML = dotsHTML;

        // Re-select elements
        slides = document.querySelectorAll('.hero-slider .slide');
        dots = document.querySelectorAll('.slider-dots .dot');

        if (slides.length > 0) {
            startTimer();
        }

    } catch (error) {
        console.error('Error initializing hero slider:', error);
    }
}

function goToSlide(n) {
    if (!slides || slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = (n + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    // Re-trigger animation
    const content = slides[currentSlide].querySelector('.slide-content');
    if (content) {
        content.style.animation = 'none';
        content.offsetHeight;
        content.style.animation = '';
    }
    resetTimer();
}

function changeSlide(dir) { goToSlide(currentSlide + dir); }

function startTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => changeSlide(1), 5500);
}

function resetTimer() {
    startTimer();
}

// Keyboard nav
document.addEventListener('keydown', e => {
    if (!slides || slides.length === 0) return;
    if (e.key === 'ArrowLeft') changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
    // Preserving Escape logic
    if (e.key === 'Escape' && typeof closeLightbox === 'function') closeLightbox();
});

// Initialize on load
document.addEventListener('DOMContentLoaded', loadHeroSlider);
// Fallback if already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    loadHeroSlider();
}