/* ============================================================
   BLESSED APARTMENTS — Unified JavaScript
   ============================================================ */

(function () {
    'use strict';

    /* ---------- 1. MOBILE MENU TOGGLE ---------- */
    var navToggle = document.getElementById('nav-toggle');
    var mainNav = document.getElementById('main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function () {
            var isOpen = mainNav.classList.toggle('is-open');
            navToggle.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        mainNav.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                mainNav.classList.remove('is-open');
                navToggle.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------- 2. STICKY HEADER SHADOW ON SCROLL ---------- */
    var header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('is-scrolled', window.scrollY > 10);
        }, { passive: true });
    }

    /* ---------- 3. ACTIVE NAV LINK HIGHLIGHTING ---------- */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        var scrollY = window.pageYOffset;
        var current = '';

        sections.forEach(function (section) {
            var sectionTop = section.offsetTop - 140;
            var sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('is-active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('is-active');
            }
        });

        if (scrollY < 200) {
            navLinks.forEach(function (link) { link.classList.remove('is-active'); });
            var homeLink = document.querySelector('.nav-link[href="#home"]');
            if (homeLink) homeLink.classList.add('is-active');
        }
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    /* ---------- 4. HERO SLIDER ---------- */
    var slides = document.querySelectorAll('.hero .slide');
    var indicators = document.querySelectorAll('.hero .indicator');

    if (slides.length && indicators.length) {
        var slideDuration = 4000;
        var currentSlide = 0;
        var slideTimer = null;

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.add('done');

            currentSlide = index;

            slides[currentSlide].classList.add('active');

            indicators.forEach(function (ind, i) {
                ind.classList.remove('done');
                ind.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() {
            var nextIndex = (currentSlide + 1) % slides.length;
            goToSlide(nextIndex);
        }

        function startAutoplay() {
            clearInterval(slideTimer);
            slideTimer = setInterval(nextSlide, slideDuration);
        }

        indicators.forEach(function (ind, i) {
            ind.addEventListener('click', function () {
                goToSlide(i);
                startAutoplay();
            });
        });

        startAutoplay();
    }

    /* ---------- 5. SCROLL REVEAL ANIMATIONS ---------- */
    var revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length && 'IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else if (revealElements.length) {
        revealElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* ---------- 6. STATS & TESTIMONIAL FALLBACK ANIMATIONS ---------- */
    var animateElements = document.querySelectorAll('.stat-item, .testimonial-card, .location-card');

    if (animateElements.length && 'IntersectionObserver' in window) {
        animateElements.forEach(function (el) {
            if (el.classList.contains('reveal')) return;
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease-out';
        });

        var fallbackObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    fallbackObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        animateElements.forEach(function (el) {
            if (!el.classList.contains('reveal')) {
                fallbackObserver.observe(el);
            }
        });
    }

    /* ---------- 7. SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;

            var target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            var navHeight = 80;
            var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    /* ---------- 8. MOBILE ROOM CARD TOUCH INTERACTIONS ---------- */
    if (window.innerWidth <= 1024) {
        var roomCards = document.querySelectorAll('.room-row');

        roomCards.forEach(function (card) {
            var touchTimer;

            card.addEventListener('touchstart', function () {
                card.classList.add('mobile-active');
                clearTimeout(touchTimer);
                touchTimer = setTimeout(function () {
                    card.classList.remove('mobile-active');
                }, 800);
            }, { passive: true });
        });
    }

    /* ---------- 9. SEARCH FORM HANDLER ---------- */
    var searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function () {
            var inputs = document.querySelectorAll('.search-card-inner input, .search-card-inner select');
            var query = [];
            inputs.forEach(function (input) {
                if (input.value && input.value !== '') {
                    query.push(input.value);
                }
            });
            if (query.length) {
                var roomsSection = document.getElementById('rooms');
                if (roomsSection) {
                    roomsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }

})();
