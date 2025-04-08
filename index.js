document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.innerHTML = new Date().getFullYear();
    }

    // Mobile Menu Logic
    const mobileMenu = document.getElementById("mobile-menu");
    const closeMenuBtn = document.getElementById("close-menu-btn");
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenuLinks = mobileMenu?.querySelectorAll("a.nav-link"); // Ensure mobileMenu exists

    function toggleMobileMenu() {
        if (!mobileMenu) return; // Guard clause
        mobileMenu.classList.toggle("hidden");
        document.body.style.overflow = mobileMenu.classList.contains('hidden') ? '' : 'hidden';
    }

    menuBtn?.addEventListener("click", toggleMobileMenu);
    closeMenuBtn?.addEventListener("click", toggleMobileMenu);
    mobileMenuLinks?.forEach(link => {
        link.addEventListener("click", () => {
            if (!mobileMenu?.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu if clicking outside
    document.addEventListener('click', (event) => {
        if (!mobileMenu || mobileMenu.classList.contains('hidden')) return; // Guard clauses
        const isClickInsideMenu = mobileMenu.contains(event.target);
        const isClickOnMenuButton = menuBtn?.contains(event.target);

        if (!isClickInsideMenu && !isClickOnMenuButton) {
            toggleMobileMenu();
        }
    });

    // Active Nav Link Highlighting Logic
    const navLinks = document.querySelectorAll('nav a.nav-link');
    const sections = document.querySelectorAll('section[id]');
    let scrollTimeout;

    function updateActiveNavLink() {
        if (sections.length === 0) return; // No sections to track

        let currentSectionId = '';
        const scrollPosition = window.scrollY;
        const activationOffset = window.innerHeight * 0.4; // 40% from top

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop - activationOffset && scrollPosition < sectionTop + sectionHeight - activationOffset) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Edge case: Scrolled to top
        if (scrollPosition < sections[0].offsetTop - activationOffset) {
             currentSectionId = sections[0].getAttribute('id'); // Highlight first section when scrolled way up
        }
        // Edge case: Scrolled to bottom
        const lastSection = sections[sections.length - 1];
         // Check if bottom of viewport is past the top of the last section
        if (scrollPosition + window.innerHeight >= lastSection.offsetTop + lastSection.clientHeight * 0.5 ) {
           currentSectionId = lastSection.getAttribute('id');
        }


        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref && linkHref === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNavLink, 50);
    });

    // Initial call
    updateActiveNavLink();
});