document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // --- Smooth Scrolling & Active Link Highlighting ---
    const scrollLinks = document.querySelectorAll('.scroll-link');

    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - (header ? header.offsetHeight : 0); // Adjust for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                navLinks.forEach(nav => nav.classList.remove('active'));
                const correspondingNavLink = document.querySelector(`.nav-link[href="${targetId}"]`);
                if(correspondingNavLink) correspondingNavLink.classList.add('active');
            }
        });
    });

     // --- Active link highlighting on scroll ---
     const sections = document.querySelectorAll('section[id]');
     window.addEventListener('scroll', navHighlighter);

     function navHighlighter() {
        let scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - (header ? header.offsetHeight + 50 : 50);
            const sectionId = current.getAttribute('id');
            const navLinkForSection = document.querySelector('.nav-menu a[href*=' + sectionId + ']');

            if (navLinkForSection) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinkForSection.classList.add('active');
                } else {
                    navLinkForSection.classList.remove('active');
                }
            }
        });
     }


    // --- Gallery Filtering (Works for portfolio, gallery, etc.) ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-grid > div'); // More specific selector

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    item.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    item.style.display = 'none';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';

                    if (item.classList.contains(filterValue.replace('.', '')) || filterValue === '*') {
                        setTimeout(() => {
                            item.style.display = 'block';
                            void item.offsetWidth;
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 100);
                    }
                });
            });
        });
    }


    // --- Lightbox Functionality ---
    const lightbox = document.getElementById('lightbox');
    if(lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-content img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        let currentImageIndex = 0;
        let currentGalleryItems = [];

        document.querySelectorAll('a[data-lightbox="gallery"]').forEach(link => {
            link.addEventListener('click', e => e.preventDefault());
        });

        galleryItems.forEach((item) => {
            const link = item.querySelector('a[data-lightbox]');
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();

                    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || '*';
                     currentGalleryItems = [];
                     document.querySelectorAll('.gallery-item').forEach(pItem => {
                          const itemLink = pItem.querySelector('a[data-lightbox]');
                          if(itemLink && (activeFilter === '*' || pItem.classList.contains(activeFilter.replace('.','')))) {
                            // Only add visible items to the lightbox gallery
                            if(pItem.style.display !== 'none') {
                                currentGalleryItems.push(itemLink);
                            }
                          }
                     });

                     currentImageIndex = currentGalleryItems.findIndex(galleryLink => galleryLink === link);
                    showLightbox(currentImageIndex);
                });
            }
        });

        function showLightbox(index) {
            if (index < 0 || index >= currentGalleryItems.length) return;

            const link = currentGalleryItems[index];
            lightboxImg.setAttribute('src', link.getAttribute('href'));
            lightboxCaption.textContent = link.getAttribute('data-title') || '';
            currentImageIndex = index;
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
        }

        function showPrevImage() {
            showLightbox((currentImageIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length);
        }

        function showNextImage() {
            showLightbox((currentImageIndex + 1) % currentGalleryItems.length);
        }

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }

    // --- Back to Top Button ---
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
    }

    // --- Scroll Animations ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.15)) {
                displayScrollElement(el);
            }
        });
    };
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation();

    // --- Footer Current Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Email Form Handler ---
    const emailForm = document.getElementById('email-form');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            const subjectInput = document.getElementById('email-subject');
            const messageInput = document.getElementById('email-message');
            
            const subject = subjectInput.value;
            const message = messageInput.value;

            // Basic validation
            if (!subject.trim() || !message.trim()) {
                alert('Please fill out both the subject and message fields.');
                return;
            }

            const recipient = 'thesonnenscheinevent@gmail.com';
            const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

            // Open user's default email client
            window.location.href = mailtoLink;
        });
    }

});