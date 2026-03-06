// ===== HERO SLIDER =====
let currentSlide = 0;
let slideTimer;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    // Re-trigger animation
    const content = slides[currentSlide].querySelector('.slide-content');
    if (content) { content.style.animation = 'none'; content.offsetHeight; content.style.animation = ''; }
    resetTimer();
}

function changeSlide(dir) { goToSlide(currentSlide + dir); }

function resetTimer() { clearInterval(slideTimer); slideTimer = setInterval(() => goToSlide(currentSlide + 1), 5500); }

// Auto-play
slideTimer = setInterval(() => goToSlide(currentSlide + 1), 5500);
// Keyboard nav
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
    if (e.key === 'Escape') closeLightbox();
});