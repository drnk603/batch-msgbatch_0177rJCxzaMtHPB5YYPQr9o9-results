(function() {
    'use strict';

    window.__app = window.__app || {};

    function debounce(func, wait) {
        var timeout;
        return function executedFunction() {
            var later = function() {
                clearTimeout(timeout);
                func.apply(this, arguments);
            }.bind(this);
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        var inThrottle;
        return function() {
            var args = arguments;
            var context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() { inThrottle = false; }, limit);
            }
        };
    }

    function getHeaderHeight() {
        var header = document.querySelector('.l-header');
        return header ? header.offsetHeight : 80;
    }

    function initBurgerMenu() {
        if (window.__app.burgerInit) return;
        window.__app.burgerInit = true;

        var toggle = document.querySelector('.navbar-toggler, .c-nav__toggle');
        var nav = document.querySelector('.navbar-collapse, #navbarNav');
        var body = document.body;

        if (!toggle || !nav) return;

        function closeMenu() {
            nav.classList.remove('show');
            nav.style.height = '0';
            toggle.setAttribute('aria-expanded', 'false');
            body.classList.remove('u-no-scroll');
        }

        function openMenu() {
            nav.classList.add('show');
            nav.style.height = 'calc(100vh - var(--nav-h) - var(--space-md) * 2)';
            toggle.setAttribute('aria-expanded', 'true');
            body.classList.add('u-no-scroll');
        }

        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            if (nav.classList.contains('show')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('show')) {
                closeMenu();
            }
        });

        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('show')) {
                closeMenu();
            }
        });

        var navLinks = nav.querySelectorAll('.nav-link, .c-nav__link');
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', function() {
                closeMenu();
            });
        }

        var resizeHandler = debounce(function() {
            if (window.innerWidth >= 1024) {
                closeMenu();
            }
        }, 250);

        window.addEventListener('resize', resizeHandler, { passive: true });
    }

    function initScrollEffects() {
        if (window.__app.scrollEffectsInit) return;
        window.__app.scrollEffectsInit = true;

        var observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        var animatedElements = document.querySelectorAll('.card, .c-card, img, .hero-content, .benefit-item, .award-item');
        for (var i = 0; i < animatedElements.length; i++) {
            var el = animatedElements[i];
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            observer.observe(el);
        }
    }

    function initImages() {
        if (window.__app.imagesInit) return;
        window.__app.imagesInit = true;

        var images = document.querySelectorAll('img');
        
        for (var i = 0; i < images.length; i++) {
            var img = images[i];
            
            if (!img.hasAttribute('loading') && !img.classList.contains('c-logo__img')) {
                img.setAttribute('loading', 'lazy');
            }
            
            if (!img.classList.contains('img-fluid')) {
                img.classList.add('img-fluid');
            }
        }

        var videos = document.querySelectorAll('video');
        for (var j = 0; j < videos.length; j++) {
            if (!videos[j].hasAttribute('loading')) {
                videos[j].setAttribute('loading', 'lazy');
            }
        }
    }

    function initMicroInteractions() {
        if (window.__app.microInit) return;
        window.__app.microInit = true;

        var buttons = document.querySelectorAll('.btn, .c-button, .card, .c-card');
        
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            buttons[i].addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });

            buttons[i].addEventListener('mousedown', function(e) {
                var ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.6)';
                ripple.style.width = '20px';
                ripple.style.height = '20px';
                ripple.style.left = (e.offsetX - 10) + 'px';
                ripple.style.top = (e.offsetY - 10) + 'px';
                ripple.style.pointerEvents = 'none';
                ripple.style.animation = 'ripple 0.6s ease-out';
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(function() {
                    ripple.remove();
                }, 600);
            });
        }

        var style = document.createElement('style');
        style.textContent = '@keyframes ripple { to { transform: scale(4); opacity: 0; } }';
        document.head.appendChild(style);
    }

    function initForms() {
        if (window.__app.formsInit) return;
        window.__app.formsInit = true;

        var forms = document.querySelectorAll('.c-form, form');
        
        var validators = {
            firstName: {
                pattern: /^[a-zA-ZÀ-ÿs-']{2,50}$/,
                message: 'Bitte geben Sie einen gültigen Vornamen ein (2-50 Zeichen, nur Buchstaben)'
            },
            lastName: {
                pattern: /^[a-zA-ZÀ-ÿs-']{2,50}$/,
                message: 'Bitte geben Sie einen gültigen Nachnamen ein (2-50 Zeichen, nur Buchstaben)'
            },
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
            },
            phone: {
                pattern: /^[\d\s+\-()]{10,20}$/,
                message: 'Bitte geben Sie eine gültige Telefonnummer ein (10-20 Zeichen)'
            },
            message: {
                minLength: 10,
                message: 'Die Nachricht muss mindestens 10 Zeichen lang sein'
            }
        };

        function validateField(field) {
            var fieldName = field.name || field.id;
            var value = field.value.trim();
            var validator = validators[fieldName];
            
            var errorEl = field.parentElement.querySelector('.invalid-feedback, .c-form__error');
            if (!errorEl) {
                errorEl = document.createElement('div');
                errorEl.className = 'invalid-feedback';
                field.parentElement.appendChild(errorEl);
            }

            if (field.hasAttribute('required') && !value) {
                field.classList.add('is-invalid');
                errorEl.textContent = 'Dieses Feld ist erforderlich';
                return false;
            }

            if (validator && value) {
                if (validator.pattern && !validator.pattern.test(value)) {
                    field.classList.add('is-invalid');
                    errorEl.textContent = validator.message;
                    return false;
                }
                
                if (validator.minLength && value.length < validator.minLength) {
                    field.classList.add('is-invalid');
                    errorEl.textContent = validator.message;
                    return false;
                }
            }

            field.classList.remove('is-invalid');
            errorEl.textContent = '';
            return true;
        }

        for (var i = 0; i < forms.length; i++) {
            var form = forms[i];
            
            var inputs = form.querySelectorAll('input, textarea, select');
            for (var j = 0; j < inputs.length; j++) {
                inputs[j].addEventListener('blur', function() {
                    validateField(this);
                });

                inputs[j].addEventListener('input', function() {
                    if (this.classList.contains('is-invalid')) {
                        validateField(this);
                    }
                });
            }

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();

                var allFields = this.querySelectorAll('input, textarea, select');
                var isValid = true;

                for (var k = 0; k < allFields.length; k++) {
                    if (!validateField(allFields[k])) {
                        isValid = false;
                    }
                }

                var privacyCheckbox = this.querySelector('input[name="privacyConsent"], input[name="privacy"], input[id="privacyConsent"], input[id="privacy"]');
                if (privacyCheckbox && !privacyCheckbox.checked) {
                    isValid = false;
                    var errorEl = privacyCheckbox.parentElement.querySelector('.invalid-feedback');
                    if (!errorEl) {
                        errorEl = document.createElement('div');
                        errorEl.className = 'invalid-feedback';
                        errorEl.style.display = 'block';
                        privacyCheckbox.parentElement.appendChild(errorEl);
                    }
                    errorEl.textContent = 'Sie müssen die Datenschutzerklärung akzeptieren';
                }

                if (!isValid) {
                    var firstInvalid = this.querySelector('.is-invalid');
                    if (firstInvalid) {
                        firstInvalid.focus();
                        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    return;
                }

                var submitButton = this.querySelector('button[type="submit"]');
                var originalText = submitButton ? submitButton.innerHTML : '';
                
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Wird gesendet...';
                    submitButton.style.opacity = '0.7';
                }

                setTimeout(function() {
                    window.location.href = 'thank_you.html';
                }, 800);
            });
        }
    }

    function initSmoothScroll() {
        if (window.__app.smoothScrollInit) return;
        window.__app.smoothScrollInit = true;

        document.addEventListener('click', function(e) {
            var link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            var href = link.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var offset = getHeaderHeight();
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        });
    }

    function initScrollSpy() {
        if (window.__app.scrollSpyInit) return;
        window.__app.scrollSpyInit = true;

        var sections = document.querySelectorAll('[id]');
        var navLinks = document.querySelectorAll('.nav-link[href^="#"], .c-nav__link[href^="#"]');

        if (sections.length === 0 || navLinks.length === 0) return;

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var id = entry.target.getAttribute('id');
                    
                    for (var i = 0; i < navLinks.length; i++) {
                        navLinks[i].classList.remove('active');
                        navLinks[i].removeAttribute('aria-current');
                    }
                    
                    var activeLink = document.querySelector('.nav-link[href="#' + id + '"], .c-nav__link[href="#' + id + '"]');
                    if (activeLink) {
                        activeLink.classList.add('active');
                        activeLink.setAttribute('aria-current', 'page');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -60% 0px'
        });

        for (var i = 0; i < sections.length; i++) {
            observer.observe(sections[i]);
        }
    }

    function initCountUp() {
        if (window.__app.countUpInit) return;
        window.__app.countUpInit = true;

        var counters = document.querySelectorAll('[data-count]');
        
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    
                    var target = parseInt(entry.target.getAttribute('data-count'));
                    var duration = 2000;
                    var start = 0;
                    var increment = target / (duration / 16);
                    var current = start;
                    
                    var timer = setInterval(function() {
                        current += increment;
                        if (current >= target) {
                            entry.target.textContent = target;
                            clearInterval(timer);
                        } else {
                            entry.target.textContent = Math.floor(current);
                        }
                    }, 16);
                }
            });
        }, { threshold: 0.5 });

        for (var i = 0; i < counters.length; i++) {
            observer.observe(counters[i]);
        }
    }

    function initScrollToTop() {
        if (window.__app.scrollToTopInit) return;
        window.__app.scrollToTopInit = true;

        var scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '↑';
        scrollBtn.setAttribute('aria-label', 'Nach oben scrollen');
        scrollBtn.style.cssText = 'position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; border-radius: 50%; background: var(--color-primary); color: white; border: none; font-size: 24px; cursor: pointer; opacity: 0; transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.2);';
        document.body.appendChild(scrollBtn);

        window.addEventListener('scroll', throttle(function() {
            if (window.pageYOffset > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.transform = 'scale(1)';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.transform = 'scale(0.8)';
            }
        }, 100));

        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        scrollBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });

        scrollBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    function initPrivacyModal() {
        if (window.__app.privacyModalInit) return;
        window.__app.privacyModalInit = true;

        var privacyLinks = document.querySelectorAll('a[href*="privacy"]');
        
        for (var i = 0; i < privacyLinks.length; i++) {
            privacyLinks[i].addEventListener('click', function(e) {
                var href = this.getAttribute('href');
                if (href && href.includes('#')) {
                    return;
                }
            });
        }
    }

    function initParallax() {
        if (window.__app.parallaxInit) return;
        window.__app.parallaxInit = true;

        var heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            window.addEventListener('scroll', throttle(function() {
                var scrolled = window.pageYOffset;
                var rate = scrolled * 0.5;
                heroSection.style.transform = 'translate3d(0, ' + rate + 'px, 0)';
            }, 10));
        }
    }

    function initCardHoverEffects() {
        if (window.__app.cardHoverInit) return;
        window.__app.cardHoverInit = true;

        var cards = document.querySelectorAll('.card, .c-card');
        
        for (var i = 0; i < cards.length; i++) {
            cards[i].addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease-in-out';
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 12px 24px rgba(44, 95, 45, 0.2)';
            });
            
            cards[i].addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = 'var(--shadow-sm)';
            });
        }
    }

    window.__app.init = function() {
        initBurgerMenu();
        initScrollEffects();
        initImages();
        initMicroInteractions();
        initForms();
        initSmoothScroll();
        initScrollSpy();
        initCountUp();
        initScrollToTop();
        initPrivacyModal();
        initParallax();
        initCardHoverEffects();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.__app.init);
    } else {
        window.__app.init();
    }

})();