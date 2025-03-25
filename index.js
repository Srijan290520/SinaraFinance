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

learnMoreModal.classList.add('hidden'); // Ensure the modal is hidden when the webpage is first opened

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

const getStartedButtons = document.querySelectorAll('a[href="#get-started"]');

getStartedButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        alert('Get Started button clicked! You can add your smooth scrolling or modal logic here.');
    });
});

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
        name: event.target.name.value,
        phone: event.target.phone.value,
        email: event.target.email.value,
        query: event.target.query.value
    };
    let submissions = JSON.parse(localStorage.getItem('submissions')) || [];
    submissions.push(formData);
    localStorage.setItem('submissions', JSON.stringify(submissions));
    alert('Form submitted! Your query has been recorded.');
    learnMoreModal.classList.add('hidden');
    learnMoreForm.reset(); // Reset the form fields
});

document.addEvent	DefaultListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    if (status === 'success') {
      alert('Form submitted successfully!');
    } else if (status === 'error') {
      alert('Error submitting form. Please try again.');
    }
  });