document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('inquiry-form');
    const submitButtonContainer = document.getElementById('submit_button_container');
    const submitButton = submitButtonContainer ? submitButtonContainer.querySelector('input[type="submit"]') : null;
    const popup = document.getElementById('thank-you-popup');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwyMuAMRe-S7kBG8wGZl1CyLqIntB57fRJdHkqqDHpfQrayhG0Y2SC8V3sYquM8OzHe/exec'; // <-- YOUR SCRIPT URL

    // Get references to the conditional field containers
    const commonFieldsDiv = document.getElementById('common_fields');
    const agentFieldsDiv = document.getElementById('agent_fields_container');
    const customerFieldsDiv = document.getElementById('customer_fields_container');
    const userRoleRadios = form ? form.querySelectorAll('input[name="user_primary_role"]') : [];

    // --- Function to show/hide sections based on User Role ---
    function toggleVisibleSections() {
        const selectedRole = form.querySelector('input[name="user_primary_role"]:checked');

        // Hide all conditional sections initially
        commonFieldsDiv?.classList.add('hidden');
        agentFieldsDiv?.classList.add('hidden');
        customerFieldsDiv?.classList.add('hidden');
        submitButtonContainer?.classList.add('hidden');
        // Remove required attributes from all potentially conditional fields
        form.querySelector('#full_name')?.removeAttribute('required');
        form.querySelector('#email')?.removeAttribute('required');
        form.querySelector('input[name="agent_lead_interest"]')?.removeAttribute('required');
        form.querySelector('#agent_service_area')?.removeAttribute('required');
        form.querySelector('input[name="customer_action"]')?.removeAttribute('required');
        form.querySelector('#customer_location')?.removeAttribute('required');
        form.querySelector('#customer_details')?.removeAttribute('required');


        if (!selectedRole) return; // Exit if no role selected yet

        // Show common fields and submit button once a role is selected
        commonFieldsDiv?.classList.remove('hidden');
        submitButtonContainer?.classList.remove('hidden');
        // Make common fields required
        form.querySelector('#full_name')?.setAttribute('required', 'required');
        form.querySelector('#email')?.setAttribute('required', 'required');


        // Show role-specific fields and set their required attributes
        if (selectedRole.value === 'agent') {
            agentFieldsDiv?.classList.remove('hidden');
            // Add required attributes for agent fields as needed
            form.querySelector('input[name="agent_lead_interest"]')?.setAttribute('required', 'required'); // Example: Make interest required for agent
            form.querySelector('#agent_service_area')?.setAttribute('required', 'required'); // Example: Make service area required for agent

        } else if (selectedRole.value === 'customer') {
            customerFieldsDiv?.classList.remove('hidden');
            // Add required attributes for customer fields as needed
            form.querySelector('input[name="customer_action"]')?.setAttribute('required', 'required'); // Example: Make action required
            form.querySelector('#customer_location')?.setAttribute('required', 'required'); // Example: Make location required
            form.querySelector('#customer_details')?.setAttribute('required', 'required'); // Example: Make details required
        }
    }

    // --- Add Event Listeners ---
    if (form && submitButton && commonFieldsDiv && agentFieldsDiv && customerFieldsDiv && submitButtonContainer) {
        const originalButtonText = submitButton.value;

        // Listener for User Role change
        userRoleRadios.forEach(radio => {
            radio.addEventListener('change', toggleVisibleSections);
        });

        // Initial check on page load (sections will be hidden)
        toggleVisibleSections();

        // Form Submit Listener
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            submitButton.value = 'Submitting...';
            submitButton.disabled = true;

            // --- Collect Data from ALL potential fields ---
            const userRoleElement = form.querySelector('input[name="user_primary_role"]:checked');
            const agentInterestElement = form.querySelector('input[name="agent_lead_interest"]:checked');
            const customerActionElement = form.querySelector('input[name="customer_action"]:checked');

            const formData = {
                // Common
                user_primary_role: userRoleElement ? userRoleElement.value : '',
                full_name: document.getElementById('full_name')?.value || '',
                email: document.getElementById('email')?.value || '',
                phone: document.getElementById('phone')?.value || '',

                // Agent specific
                agent_lead_interest: agentInterestElement ? agentInterestElement.value : '',
                agent_service_area: document.getElementById('agent_service_area')?.value || '',
                agent_lead_criteria: document.getElementById('agent_lead_criteria')?.value || '',

                // Customer specific
                customer_action: customerActionElement ? customerActionElement.value : '',
                customer_location: document.getElementById('customer_location')?.value || '',
                customer_details: document.getElementById('customer_details')?.value || '',
            };

            console.log("Form JS: Attempting to send JSON data:", JSON.stringify(formData));

            // --- Fetch (NO CHANGES HERE - uses no-cors) ---
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                body: JSON.stringify(formData)
            })
            .then(response => {
                console.log('Form JS: Fetch request sent successfully (mode: no-cors).');
                if (popup) popup.classList.remove('hidden');
                form.reset();
                // Hide conditional sections again after reset
                toggleVisibleSections();

                setTimeout(() => { window.location.href = 'index.html'; }, 5000);
            })
            .catch(error => {
                console.error('Form JS: Fetch Error encountered:', error);
                alert('Submission Network Error: ' + error.message);
                // Restore button state ONLY on error
                submitButton.value = originalButtonText;
                submitButton.disabled = false;
            })
            .finally(() => {
                 console.log("Form JS: Form submission attempt finished.");
                  // Re-enable button if not successful (handled in catch)
                 if(!popup || popup.classList.contains('hidden')) { // Check if popup ISN'T shown
                    submitButton.value = originalButtonText;
                    submitButton.disabled = false;
                 }
            });
        });

    } else {
        console.error("Form JS Error: Could not find all required form elements (form, buttons, containers). Check HTML IDs.");
    }
}); // End DOMContentLoaded