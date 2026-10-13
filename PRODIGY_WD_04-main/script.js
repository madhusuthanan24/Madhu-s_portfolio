/**
 * ============================================================================
 * MADHUSUTHANAN P — PORTFOLIO INTERACTIONS & ANIMATIONS
 * Pure Vanilla JavaScript (ES6+) — Zero Framework Bloat
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------------------
    // 1. Accessibility & Motion Preference Detection
    // ------------------------------------------------------------------------
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    // ------------------------------------------------------------------------
    // 2. Dual-Ring Custom Cursor (Desktop Only)
    // ------------------------------------------------------------------------
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (!isTouchDevice && cursorDot && cursorRing && !prefersReducedMotion) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;
        let cursorVisible = false;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!cursorVisible) {
                cursorDot.style.opacity = '1';
                cursorRing.style.opacity = '1';
                cursorVisible = true;
            }

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        window.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
            cursorVisible = false;
        });

        // Smooth Lerp loop for the outer trailing ring
        function animateCursorRing() {
            // Lerp interpolation (0.16 smoothing factor)
            ringX += (mouseX - ringX) * 0.16;
            ringY += (mouseY - ringY) * 0.16;

            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            requestAnimationFrame(animateCursorRing);
        }
        requestAnimationFrame(animateCursorRing);

        // Hover expansions for interactive elements
        const interactiveSelectors = 'a, button, .project-card, .ps-card, .ps-stat-box, .skill-category-card, .about-card, .timeline-card, .cert-card, .contact-card-link, input, textarea';
        const interactiveElements = document.querySelectorAll(interactiveSelectors);

        interactiveElements.forEach((elem) => {
            elem.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            elem.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // ------------------------------------------------------------------------
    // 3. Header Scroll Effect & Scrollspy
    // ------------------------------------------------------------------------
    const header = document.getElementById('site-header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Header compression and glass effect
        if (header) {
            if (scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Active Section Scrollspy
        const headerOffset = 140;
        let currentSectionId = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - headerOffset;
            const sectionHeight = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ------------------------------------------------------------------------
    // 4. Mobile Navigation Drawer
    // ------------------------------------------------------------------------
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        function toggleMenu() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        }

        navToggle.addEventListener('click', toggleMenu);

        // Auto close menu when clicking any nav link
        navMenu.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    // ------------------------------------------------------------------------
    // 5. 3D Card Tilt & Cursor-Following Radial Glow
    // ------------------------------------------------------------------------
    const projectCards = document.querySelectorAll('.project-card');
    const tiltCards = document.querySelectorAll('.project-card, .ps-card');

    if (!isTouchDevice && !prefersReducedMotion) {
        tiltCards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Relative coordinates for radial glow
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                // Center offsets
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -7; // max 7 deg
                const rotateY = ((x - centerX) / centerX) * 7;  // max 7 deg

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    // ------------------------------------------------------------------------
    // 6. Project Category Filter
    // ------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            // Active tab state
            filterButtons.forEach((b) => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach((card) => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('filter-hide');
                    // Trigger fade in animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.classList.add('filter-hide');
                }
            });
        });
    });

    // ------------------------------------------------------------------------
    // 7. IntersectionObserver Scroll Reveal
    // ------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-init');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach((elem) => revealObserver.observe(elem));
    } else {
        // Fallback for older browsers
        revealElements.forEach((elem) => elem.classList.add('revealed'));
    }

    // ------------------------------------------------------------------------
    // 8. Interactive Resume Modal
    // ------------------------------------------------------------------------
    const resumeModal = document.getElementById('resume-modal');
    const openResumeBtns = [
        document.getElementById('nav-resume-btn'),
        document.getElementById('hero-resume-btn')
    ].filter(Boolean);
    const closeResumeBtn = document.getElementById('close-resume-btn');
    const printResumeBtn = document.getElementById('print-resume-btn');

    function openModal() {
        if (resumeModal) {
            resumeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            closeResumeBtn?.focus();
        }
    }

    function closeModal() {
        if (resumeModal) {
            resumeModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    openResumeBtns.forEach((btn) => btn.addEventListener('click', openModal));

    if (closeResumeBtn) {
        closeResumeBtn.addEventListener('click', closeModal);
    }

    if (resumeModal) {
        // Close on backdrop click
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                closeModal();
            }
        });

        // Close on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    if (printResumeBtn) {
        printResumeBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // ------------------------------------------------------------------------
    // 9. Interactive Contact Form & Toast Notification
    // ------------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const toastMsg = document.getElementById('toast-msg');

    if (contactForm && toastMsg) {
        contactForm.addEventListener('submit', (e) => {
            // For a static site without a backend, we provide immediate visual confirmation
            // and trigger the mailto client
            showToast('Message formatted! Opening your email client...');
        });
    }

    function showToast(text) {
        if (!toastMsg) return;
        if (text) {
            const span = toastMsg.querySelector('span');
            if (span) span.textContent = text;
        }
        toastMsg.classList.add('show');
        setTimeout(() => {
            toastMsg.classList.remove('show');
        }, 4500);
    }

    // ------------------------------------------------------------------------
    // 10. Smooth In-Page Anchor Navigation Offset
    // ------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });
});
