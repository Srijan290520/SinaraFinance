document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const userTypeRadios = form.querySelectorAll('input[name="user_type"]');
    const agentFieldsContainer = document.getElementById('agent-fields');
    const buyerFieldsContainer = document.getElementById('buyer-fields');
    const submitButton = form.querySelector('input[type="submit"]');

    function toggleConditionalFields() {
        const selectedType = form.querySelector('input[name="user_type"]:checked')?.value;

        // Hide all conditional sections first
        agentFieldsContainer?.classList.remove('visible');
        buyerFieldsContainer?.classList.remove('visible');
        agentFieldsContainer?.classList.add('hidden'); // Use hidden if not transitioning
        buyerFieldsContainer?.classList.add('hidden'); // Use hidden if not transitioning


        // Show the relevant section
        if (selectedType === 'agent') {
            agentFieldsContainer?.classList.add('visible');
            agentFieldsContainer?.classList.remove('hidden');
        } else if (selectedType === 'buyer_seller') {
            buyerFieldsContainer?.classList.add('visible');
            buyerFieldsContainer?.classList.remove('hidden');
        }
    }

    // Add event listeners to radio buttons
    userTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleConditionalFields);
    });

    // Initial check in case a radio is pre-selected or for browser back navigation
    toggleConditionalFields();

    // Form Submission Logic
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if(!submitButton) return;

        const originalButtonText = submitButton.value;
        submitButton.value = 'Submitting...';
        submitButton.disabled = true;

        // Collect Common Data
        const formData = {
            userType: form.querySelector('input[name="user_type"]:checked')?.value,
            fullName: document.getElementById('full_name')?.value,
            email: document.getElementById('email')?.value,
            phone: document.getElementById('phone')?.value, // Optional common field
        };

        // Collect Conditional Data
        if (formData.userType === 'agent') {
            formData.brokerage = document.getElementById('brokerage')?.value;
            formData.agentNeeds = document.getElementById('agent_needs')?.value;
        } else if (formData.userType === 'buyer_seller') {
            formData.interest = document.getElementById('interest')?.value;
            formData.location = document.getElementById('location')?.value;
            formData.buyerDetails = document.getElementById('buyer_details')?.value;
        }

        console.log("Form Data:", formData); // For debugging

        // Replace with your actual Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzlsW-foqa4JLMPZOuZQ7296w5RMUzfc_ZKsEV076WNJEexdtaYD3x5Be05H0jvGykGaA/exec'; // MAKE SURE THIS IS CORRECT

        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            console.log('Success!', response);
            const popup = document.getElementById('thank-you-popup');
            if (popup) popup.classList.remove('hidden');
            form.reset(); // Reset the form
            toggleConditionalFields(); // Hide conditional fields after reset

            setTimeout(() => {
                // Optional: Redirect or just hide popup
                 if (popup) popup.classList.add('hidden');
                // window.location.href = 'index.html';
            }, 5000);
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('There was an error submitting your inquiry. Please try again or contact us directly.');
        })
        .finally(() => {
             // Re-enable button regardless of success or error
             submitButton.value = originalButtonText;
             submitButton.disabled = false;
        });
    });
});