// --- START OF FILE form.js ---

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed.");

    // --- Element Selection ---
    const form = document.getElementById('contact-form');
    const userTypeRadios = form?.querySelectorAll('input[name="user_type"]'); // Use optional chaining on form
    const agentFieldsContainer = document.getElementById('agent-fields');
    const buyerFieldsContainer = document.getElementById('buyer-fields');
    const submitButton = form?.querySelector('input[type="submit"]'); // Use optional chaining on form
    const thankYouPopup = document.getElementById('thank-you-popup');
    const yearSpan = document.getElementById('year');

    // --- Initial Element Validation ---
    let initializationError = false;
    if (!form) { console.error("Initialization Error: Form with id 'contact-form' not found!"); initializationError = true; }
    if (!userTypeRadios || userTypeRadios.length === 0) { console.error("Initialization Error: Radio buttons with name 'user_type' not found inside the form!"); initializationError = true; }
    if (!agentFieldsContainer) { console.error("Initialization Error: Div with id 'agent-fields' not found!"); initializationError = true; }
    if (!buyerFieldsContainer) { console.error("Initialization Error: Div with id 'buyer-fields' not found!"); initializationError = true; }
    if (!submitButton) { console.error("Initialization Error: Submit button not found inside the form!"); initializationError = true; }
    if (!thankYouPopup) { console.warn("Initialization Warning: Thank you popup with id 'thank-you-popup' not found."); } // Warn instead of error
    if (!yearSpan) { console.warn("Initialization Warning: Year span with id 'year' not found."); } // Warn instead of error

    // Stop if critical elements are missing
    if (initializationError) {
        console.error("Stopping script execution due to missing critical form elements.");
        if(form) form.innerHTML = "<p class='text-red-400 text-center font-semibold p-4'>Error: Form failed to initialize correctly. Element IDs might be incorrect in HTML.</p>";
        return; // Stop script
    }
    console.log("All critical form elements found.");

    // --- Conditional Field Logic ---
    function toggleConditionalFields() {
        // Ensure containers exist before trying to access classList
        if (!agentFieldsContainer || !buyerFieldsContainer) return;

        try {
            const selectedType = form.querySelector('input[name="user_type"]:checked')?.value;
            console.log("User type changed/checked:", selectedType);

            agentFieldsContainer.classList.add('hidden');
            buyerFieldsContainer.classList.add('hidden');

            if (selectedType === 'agent') {
                agentFieldsContainer.classList.remove('hidden');
                console.log("Showing agent fields.");
            } else if (selectedType === 'buyer_seller') {
                buyerFieldsContainer.classList.remove('hidden');
                console.log("Showing buyer/seller fields.");
            }
        } catch (error) {
            console.error("Error in toggleConditionalFields:", error);
        }
    }

    // Add event listeners safely
    userTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleConditionalFields);
    });

    // Initial setup call
    console.log("Performing initial call to toggleConditionalFields...");
    toggleConditionalFields();
    console.log("Initial field visibility set.");

    // --- Form Submission Logic ---
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log("Form submission initiated.");

        const originalButtonText = submitButton.value;
        submitButton.value = 'Submitting...';
        submitButton.disabled = true;

        // Collect Form Data Safely
        const formData = {
            userType: form.querySelector('input[name="user_type"]:checked')?.value || 'N/A',
            fullName: document.getElementById('full_name')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            interest: document.getElementById('interest')?.value || '',
            location: document.getElementById('location')?.value || '',
            buyerDetails: document.getElementById('buyer_details')?.value || '',
            brokerage: document.getElementById('brokerage')?.value || '',
            agentNeeds: document.getElementById('agent_needs')?.value || '',
        };

        // Optionally clean data (not strictly necessary)
        if (formData.userType !== 'buyer_seller') {
            delete formData.interest; delete formData.location; delete formData.buyerDetails;
        }
        if (formData.userType !== 'agent') {
            delete formData.brokerage; delete formData.agentNeeds;
        }

        console.log("Attempting to send data:", JSON.stringify(formData));
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxz57tW7ek7yrWIGsqIZriv4Idl007-JMrCsio8uT2PlEjQD9brBnfij6LZhOhDn1WxqA/exec'; // Your URL

        // --- Fetch Call ---
        fetch(scriptURL, {
            method: 'POST',
            // NO 'mode: no-cors'
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            console.log('Fetch response received. Status:', response.status, 'Ok:', response.ok);
             // Log headers to check for CORS
            console.log("Response Headers:");
            response.headers.forEach((value, name) => {
                 console.log(`  ${name}: ${value}`);
            });

            // If response is not OK (e.g., 4xx, 5xx), try to get text first
             if (!response.ok) {
                console.warn("Response status was not OK. Attempting to read response text.");
                return response.text().then(text => {
                    console.error("Non-OK response body:", text);
                    // Throw an error to be caught by the .catch block
                    throw new Error(`Server responded with status ${response.status}: ${text.substring(0, 100)}...`); // Include status and start of text
                });
            }

            // Only attempt .json() if response status is OK
            console.log("Response OK, attempting to parse JSON...");
            return response.json();
        })
        .then(data => {
            console.log('Parsed JSON Response from Apps Script:', data);
            if (data && data.result === "success") { // Check data exists
                console.log("Submission successful according to Apps Script.");
                if(thankYouPopup) thankYouPopup.classList.remove('hidden');
                form.reset();
                toggleConditionalFields();
                setTimeout(() => {
                   if(thankYouPopup) thankYouPopup.classList.add('hidden');
                }, 5000);
            } else {
                 // Handle cases where response was JSON but not a success result
                 const errorMessage = data && data.error ? data.error : 'Unknown error format from script.';
                 console.error('Apps Script reported an error:', errorMessage, 'Received data:', data);
                 alert('Submission failed: ' + errorMessage);
            }
        })
        .catch(error => {
            console.error('Fetch Error encountered:', error);
             // Check if it's the TypeError from response.json()
            if (error instanceof TypeError) {
                console.error("TypeError suggests response wasn't valid JSON or CORS prevented reading the body.");
                alert('There was an issue processing the server response. Please check console logs or contact support.'); // Changed alert slightly
            } else {
                // Handle other errors (network, non-OK response text, etc.)
                 alert('Submission Error: ' + error.message); // Display the specific error message
            }
        })
        .finally(() => {
             submitButton.value = originalButtonText;
             submitButton.disabled = false;
             console.log("Form submission process finished.");
        });
        // --- End Fetch Call ---
    });

    // Set footer year
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("Could not set footer year: span#year not found.");
    }

}); // End DOMContentLoaded listener

// --- END OF FILE form.js ---