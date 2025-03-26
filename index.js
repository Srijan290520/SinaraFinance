document.getElementById("year").innerHTML = new Date().getFullYear();

const mobileMenu = document.getElementById("mobile-menu");
const closeMenuBtn = document.getElementById("close-menu-btn");
const menuBtn = document.getElementById("menu-btn");
const mobileMenuLinks = mobileMenu.querySelectorAll("a");
const navLinks = document.querySelectorAll('.md\\:block ul li a');
const sections = document.querySelectorAll('section');
const learnMoreLinks = document.querySelectorAll('.learn-more-link');
const learnMoreModal = document.getElementById('learn-more-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const learnMoreForm = document.getElementById('learn-more-form');

function toggleMobileMenu() {
    mobileMenu.classList.toggle("hidden");
}

menuBtn.addEventListener("click", toggleMobileMenu);
closeMenuBtn.addEventListener("click", toggleMobileMenu);
mobileMenuLinks.forEach(link => {
    link.addEventListener("click", toggleMobileMenu);
});

document.addEventListener('click', (event) => {
    if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(event.target) && event.target !== menuBtn) {
        toggleMobileMenu();
    }
});

function updateActiveNavLink() {
    let currentSectionId = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSectionId) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

learnMoreLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        learnMoreModal.classList.remove('hidden');
    });
});

closeModalBtn.addEventListener('click', () => {
    learnMoreModal.classList.add('hidden');
});

learnMoreModal.addEventListener('click', (event) => {
    if (event.target === learnMoreModal) {
        learnMoreModal.classList.add('hidden');
    }
});

learnMoreForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = {
        fullName: event.target.name.value,
        phoneNumber: event.target.phone.value,
        email: event.target.email.value,
        query: event.target.query.value
    };

    fetch('https://script.google.com/macros/s/AKfycbwrxPzew25M-5bnMeSf8l0TLN-xpogxl8PX8kp1PmBf0Du2qWCwiS2H82ToBjc8HknPig/exec', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors'
    })
    .then(() => {
        alert('Form submitted! Your query has been recorded.');
        learnMoreModal.classList.add('hidden');
        learnMoreForm.reset();
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('There was an error submitting your query. Please try again.');
    });
});