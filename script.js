/* ============================================= */
/*  Matthew Lam 牙醫診所 — script.js             */
/*  所有互動功能：導航、手風琴、輪播、表單等      */
/* ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ============ ELEMENTS ============
    const header      = document.getElementById('header');
    const hamburger   = document.getElementById('hamburger');
    const mobileMenu  = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileClose = document.getElementById('mobileClose');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navLinks    = document.querySelectorAll('.nav-link');
    const backToTop   = document.getElementById('backToTop');

    // ============ STICKY HEADER SHADOW ============
    const onScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        // Back to top button visibility
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        // Active nav link based on scroll position
        updateActiveNav();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ============ BACK TO TOP ============
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============ MOBILE MENU ============
    const openMobileMenu = () => {
        mobileMenu.classList.add('open');
        mobileOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };
    const closeMobileMenu = () => {
        mobileMenu.classList.remove('open');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (hamburger)   hamburger.addEventListener('click', openMobileMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // ============ ACTIVE NAV LINK ON SCROLL ============
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 120;
        let currentSection = 'home';

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentSection = section.getAttribute('id');
            }
        });

        // Desktop nav
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // ============ SMOOTH SCROLL FOR NAV LINKS ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 72;
                const targetPos = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============ ACCORDION (Services) ============
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(headerBtn => {
        headerBtn.addEventListener('click', () => {
            const item = headerBtn.parentElement;
            const isOpen = item.classList.contains('open');

            // Close all accordion items first
            document.querySelectorAll('.accordion-item').forEach(ai => {
                ai.classList.remove('open');
            });

            // Toggle the clicked one
            if (!isOpen) {
                item.classList.add('open');
                // Scroll into view with offset
                setTimeout(() => {
                    const headerHeight = header ? header.offsetHeight : 72;
                    const itemTop = item.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                    window.scrollTo({ top: itemTop, behavior: 'smooth' });
                }, 100);
            }
        });
    });

    // ============ CAROUSEL ============
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselPrev  = document.getElementById('carouselPrev');
    const carouselNext  = document.getElementById('carouselNext');
    const carouselDots  = document.getElementById('carouselDots');

    if (carouselTrack) {
        const slides = carouselTrack.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoplayTimer;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', '第 ' + (index + 1) + ' 張圖片');
            dot.addEventListener('click', () => goToSlide(index));
            carouselDots.appendChild(dot);
        });

        const dots = carouselDots.querySelectorAll('.carousel-dot');

        function goToSlide(index) {
            currentSlide = index;
            if (currentSlide < 0) currentSlide = totalSlides - 1;
            if (currentSlide >= totalSlides) currentSlide = 0;
            carouselTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }

        if (carouselNext) carouselNext.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
        if (carouselPrev) carouselPrev.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

        // Autoplay
        function startAutoplay() {
            autoplayTimer = setInterval(nextSlide, 4500);
        }
        function resetAutoplay() {
            clearInterval(autoplayTimer);
            startAutoplay();
        }
        startAutoplay();

        // Pause on hover
        carouselTrack.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
        carouselTrack.addEventListener('mouseleave', startAutoplay);

        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoplay();
            }
        }, { passive: true });
    }

    // ============ CONTACT FORM ============
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const charCount   = document.getElementById('charCount');
    const messageField = document.getElementById('cf-message');

    // Character count
    if (messageField && charCount) {
        messageField.addEventListener('input', () => {
            charCount.textContent = messageField.value.length;
        });
    }

    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation
            const name = document.getElementById('cf-name').value.trim();
            const phone = document.getElementById('cf-phone').value.trim();
            const category = document.getElementById('cf-category').value;
            const message = document.getElementById('cf-message').value.trim();

            if (!name || !phone || !category || !message) {
                alert('請填寫所有必填欄位。');
                return;
            }

            // Phone validation (HK format: 8 digits)
            const phoneRegex = /^[0-9]{8}$/;
            if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                alert('請輸入有效的 8 位電話號碼。');
                return;
            }

            // Simulate form submission
            // In production, replace with actual form handler (e.g., Formspree, Google Forms, etc.)
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';

            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // ============ SCROLL ANIMATIONS (Fade-in) ============
    // Add fade-in class to elements
    const animateElements = document.querySelectorAll(
        '.icon-card, .service-card, .testimonial-card, .contact-card, .value-card, .accordion-item, .doctor-card, .gallery-item'
    );
    animateElements.forEach(el => el.classList.add('fade-in'));

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // ============ KEYBOARD ACCESSIBILITY ============
    // Allow Enter/Space on accordion headers
    accordionHeaders.forEach(h => {
        h.setAttribute('role', 'button');
        h.setAttribute('tabindex', '0');
        h.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                h.click();
            }
        });
    });

    // ============ INITIAL STATE ============
    onScroll(); // Initialize header state

    console.log('✅ Matthew Lam 牙醫診所 — 網站已載入完成');
});
