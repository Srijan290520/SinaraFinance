document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const userTypeRadios = form?.querySelectorAll('input[name="user_type"]'); // Added safety checks
    const agentFieldsContainer = document.getElementById('agent-fields');
    const buyerFieldsContainer = document.getElementById('buyer-fields');
    const submitButton = form?.querySelector('input[type="submit"]'); // Added safety check
    const thankYouPopup = document.getElementById('thank-you-popup'); // Get popup element

    // Ensure form and essential elements exist before proceeding
    if (!form || !userTypeRadios || !submitButton || !agentFieldsContainer || !buyerFieldsContainer || !thankYouPopup) {
        console.error("Form initialization failed: One or more required elements not found.");
        // Optionally disable the form or show an error message to the user here
        if(submitButton) submitButton.disabled = true;
        if(form) form.innerHTML = "<p class='text-red-400 text-center'>Error initializing form. Please contact support.</p>"; // Example user feedback
        return; // Stop script execution if essential elements are missing
    }


    function toggleConditionalFields() {
        const selectedType = form.querySelector('input[name="user_type"]:checked')?.value;

        // Use Tailwind classes for hiding/showing for simplicity if CSS transitions aren't needed
        agentFieldsContainer.classList.add('hidden');
        buyerFieldsContainer.classList.add('hidden');
        // agentFieldsContainer.classList.remove('visible'); // Remove if using CSS class based visibility
        // buyerFieldsContainer.classList.remove('visible');

        if (selectedType === 'agent') {
            agentFieldsContainer.classList.remove('hidden');
            // agentFieldsContainer.classList.add('visible');
        } else if (selectedType === 'buyer_seller') {
            buyerFieldsContainer.classList.remove('hidden');
            // buyerFieldsContainer.classList.add('visible');
        }
    }

    // Add event listeners to radio buttons
    userTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleConditionalFields);
    });

    // Initial check
    toggleConditionalFields();

    // Form Submission Logic
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default page reload

        const originalButtonText = submitButton.value;
        submitButton.value = 'Submitting...';
        submitButton.disabled = true;

        // Collect Form Data Safely
        const formData = {
            userType: form.querySelector('input[name="user_type"]:checked')?.value || 'N/A', // Default if somehow unchecked
            fullName: document.getElementById('full_name')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '', // Optional common field
            // Conditional Fields
            interest: document.getElementById('interest')?.value || '',
            location: document.getElementById('location')?.value || '',
            buyerDetails: document.getElementById('buyer_details')?.value || '',
            brokerage: document.getElementById('brokerage')?.value || '',
            agentNeeds: document.getElementById('agent_needs')?.value || '',
        };

        // Filter out empty conditional fields that weren't relevant based on userType
        // This isn't strictly necessary if the Apps Script handles empty strings, but can make payload cleaner
        if (formData.userType !== 'buyer_seller') {
            delete formData.interest;
            delete formData.location;
            delete formData.buyerDetails;
        }
        if (formData.userType !== 'agent') {
            delete formData.brokerage;
            delete formData.agentNeeds;
        }


        console.log("Attempting to send data:", JSON.stringify(formData)); // Log data being sent

        // ==================================================================
        // The Web App URL provided by the user is inserted here
        // ==================================================================
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxz57tW7ek7yrWIGsqIZriv4Idl007-JMrCsio8uT2PlEjQD9brBnfij6LZhOhDn1WxqA/exec';
        // ==================================================================


        // --- Fetch Call ---
        // Ensure 'mode: no-cors' is ABSENT
        fetch(scriptURL, {
            method: 'POST',
            // NO 'mode: no-cors' HERE!
            cache: 'no-cache', // Helps avoid potential caching issues
            headers: {
                'Content-Type': 'application/json'
                // Do not add 'Access-Control-Allow-Origin' header here - that's for the server response
            },
            body: JSON.stringify(formData) // Send the collected data as a JSON string
        })
        .then(response => {
             // Check if response status is OK (2xx range)
             // Note: Response object might be opaque if CORS headers weren't perfect,
             // but we mainly care if the request itself didn't throw a network error.
             // We rely more on the JSON *body* of the response from Apps Script.
            console.log('Fetch response received (status might be opaque):', response);
            // Try to parse the JSON response from the Apps Script
            return response.json(); // This will fail if the response wasn't valid JSON
        })
        .then(data => {
            // Process the JSON data returned from Apps Script
            console.log('Success Response from Apps Script:', data);
            if (data.result === "success") {
                thankYouPopup.classList.remove('hidden'); // Show popup
                form.reset(); // Reset the form fields
                toggleConditionalFields(); // Hide conditional fields again

                // Hide popup after delay (optional: redirect instead)
                setTimeout(() => {
                    thankYouPopup.classList.add('hidden');
                    // window.location.href = 'index.html'; // Optional redirect
                }, 5000);
            } else {
                 // Handle application-level errors reported by Apps Script
                 console.error('Apps Script Error:', data.error || 'Unknown error from script.');
                 alert('Submission failed: ' + (data.error || 'Please check your details and try again.'));
            }
        })
        .catch(error => {
            // Handle network errors or issues with the fetch request itself
            console.error('Fetch Error:', error);
            // More specific error check for TypeError which might occur if response.json() fails
             if (error instanceof TypeError) {
                console.error("TypeError during response processing. The Apps Script might not have returned valid JSON or CORS headers might be missing/incorrect.");
                alert('There was an issue processing the server response. Please try again later or contact support.');
            } else {
                alert('There was a network problem submitting your inquiry. Please check your connection and try again.');
            }
        })
        .finally(() => {
             // This block executes regardless of success or failure
             submitButton.value = originalButtonText; // Restore button text
             submitButton.disabled = false; // Re-enable button
             console.log("Form submission process finished.");
        });
        // --- End Fetch Call ---
    });

    // Add script for footer year (moved from form.html for better practice)
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}); // End DOMContentLoaded listener