document.addEventListener('DOMContentLoaded', () => {
    console.log("Form JS: DOM fully loaded.");

    // --- Element Selection ---
    const form = document.getElementById('contact-form');
    const userTypeRadios = form?.querySelectorAll('input[name="user_type"]');
    const agentFieldsContainer = document.getElementById('agent-fields');
    const buyerFieldsContainer = document.getElementById('buyer-fields');
    const submitButton = document.getElementById('submit-button'); // Use button ID
    const thankYouPopup = document.getElementById('thank-you-popup');
    const yearSpan = document.getElementById('year');

    // --- Robust Initial Element Validation ---
    let initializationError = false;
    if (!form) { console.error("Form JS Error: Form '#contact-form' not found!"); initializationError = true; }
    if (!userTypeRadios || userTypeRadios.length !== 2) { console.error("Form JS Error: Need exactly two radios named 'user_type'. Found:", userTypeRadios?.length); initializationError = true; }
    if (!agentFieldsContainer) { console.error("Form JS Error: Div '#agent-fields' not found!"); initializationError = true; }
    if (!buyerFieldsContainer) { console.error("Form JS Error: Div '#buyer-fields' not found!"); initializationError = true; }
    if (!submitButton) { console.error("Form JS Error: Button '#submit-button' not found!"); initializationError = true; }
    if (!thankYouPopup) { console.warn("Form JS Warning: Popup '#thank-you-popup' not found."); }

    // Stop if critical elements are missing
    if (initializationError) {
        console.error("Form JS: Stopping script due to missing critical elements.");
        if(form) form.innerHTML = "<p class='text-red-400 text-center font-semibold p-4'>Error: Form failed to initialize correctly. Please contact support or check element IDs.</p>";
        return; // Stop
    }
    console.log("Form JS: All critical elements found.");

    // --- Conditional Field Logic ---
    function toggleConditionalFields() {
        // These elements are guaranteed to exist if we passed the initial check
        try {
            const selectedRadio = form.querySelector('input[name="user_type"]:checked');
            const selectedType = selectedRadio ? selectedRadio.value : null;
            console.log("Form JS: Toggling fields based on selection:", selectedType);

            // Always hide both first using Tailwind's 'hidden' class
            agentFieldsContainer.classList.add('hidden');
            buyerFieldsContainer.classList.add('hidden');

            // Show the relevant one
            if (selectedType === 'agent') {
                agentFieldsContainer.classList.remove('hidden');
                console.log("Form JS: Showing agent fields.");
            } else if (selectedType === 'buyer_seller') {
                buyerFieldsContainer.classList.remove('hidden');
                console.log("Form JS: Showing buyer/seller fields.");
            } else {
                console.log("Form JS: No selection, conditional fields remain hidden.");
            }
        } catch (error) {
            console.error("Form JS: Error in toggleConditionalFields:", error);
        }
    }

    // --- Attach Event Listeners ---
    userTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleConditionalFields);
    });
    console.log("Form JS: Added 'change' listeners to radio buttons.");

    // --- Initial Call to Set Visibility ---
    console.log("Form JS: Initial call to toggleConditionalFields.");
    toggleConditionalFields(); // Set initial state

    // --- Form Submission Handler ---
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default page reload
        console.log("Form JS: Submit event triggered.");

        const originalButtonText = submitButton.textContent; // Use textContent for button
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;

        // Collect Form Data into a plain object
        const formDataObject = {};
        const formElements = form.elements; // Get all form controls

        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            // Only include named elements that have a value and aren't buttons/fieldsets
            if (element.name && element.value !== undefined && element.type !== 'submit' && element.type !== 'button' && element.tagName !== 'FIELDSET') {
                 // Handle radio buttons specifically (only include the checked one)
                 if (element.type === 'radio') {
                     if (element.checked) {
                         formDataObject[element.name] = element.value;
                     }
                 } else {
                      formDataObject[element.name] = element.value;
                 }
            }
        }

         // Clean irrelevant fields based on the *submitted* userType
         const submittedUserType = formDataObject['user_type'];
         if (submittedUserType === 'buyer_seller') {
             delete formDataObject['brokerage'];
             delete formDataObject['agent_needs'];
         } else if (submittedUserType === 'agent') {
             delete formDataObject['interest'];
             delete formDataObject['location'];
             delete formDataObject['buyer_details'];
         }

        console.log("Form JS: Attempting to send JSON data:", JSON.stringify(formDataObject));

        // ==================================================================
        // !! IMPORTANT !! Replace with your NEWEST deployed Web App URL
        // ==================================================================
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyNyKGMesO1tjCoGP3t6i_l9K0lo4W-ACKz87nYg-_d41dG0ICue5aUW6X1hfTw0MStVg/exec'; // <-- PASTE YOUR URL HERE
        // ==================================================================

        if (scriptURL === 'YOUR_NEW_WEB_APP_URL_HERE' || !scriptURL) {
             console.error("Form JS: SCRIPT URL NOT SET!");
             alert("Configuration error: Submission endpoint is missing.");
             submitButton.textContent = originalButtonText; // Restore text
             submitButton.disabled = false;
             return; // Stop submission
        }

        // --- Standard Fetch Call with JSON ---
        fetch(scriptURL, {
            method: 'POST',
            // NO 'mode: no-cors'
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
                // Accept header isn't strictly necessary but good practice
                // 'Accept': 'application/json'
            },
            body: JSON.stringify(formDataObject) // Send the data object as a JSON string
        })
        .then(response => {
            console.log('Form JS: Fetch response received. Status:', response.status, 'Ok:', response.ok);
            // Log headers to check CORS
            console.log("Form JS: Response Headers:");
            response.headers.forEach((value, name) => { console.log(`  ${name}: ${value}`); });

            // Always try to get the text first to see what the server actually sent
            return response.text();
        })
        .then(text => {
            console.log("Form JS: Raw Response Text:", text);
            try {
                 // Try to parse the text as JSON
                 const data = JSON.parse(text);
                 console.log('Form JS: Parsed JSON Response from Apps Script:', data);

                 // Check the result property from the parsed JSON
                 if (data && data.result === "success") {
                     console.log("Form JS: Submission successful.");
                     if(thankYouPopup) {
                         thankYouPopup.classList.remove('hidden');
                         thankYouPopup.classList.add('flex'); // Use flex to show centered content
                     }
                     form.reset(); // Clear the form
                     toggleConditionalFields(); // Hide conditional fields again

                     setTimeout(() => {
                        if(thankYouPopup) {
                            thankYouPopup.classList.add('hidden');
                            thankYouPopup.classList.remove('flex');
                        }
                     }, 5000); // Hide after 5 seconds
                 } else {
                     // Handle application-level errors reported in the JSON
                     const errorMessage = data?.error || 'Unknown error structure in response.'; // Safer access
                     console.error('Form JS: Apps Script reported an error:', errorMessage, 'Received data:', data);
                     alert('Submission failed: ' + errorMessage);
                 }
            } catch (parseError) {
                 // Handle cases where the response text was NOT valid JSON
                 console.error("Form JS: Error parsing response text as JSON:", parseError, "\nResponse Text was:", text);
                 // Show generic error, maybe include start of text if short & safe
                 let errorDetail = text.length < 100 ? text : text.substring(0,100) + "...";
                 alert("Submission failed: Could not process the server response. Response: " + errorDetail);
            }
        })
        .catch(error => {
            // Handle network errors (fetch couldn't connect, DNS issues, etc.)
            console.error('Form JS: Fetch Error encountered:', error);
            alert('Submission Network Error: ' + error.message + ". Please check your internet connection.");
        })
        .finally(() => {
             // Ensure button state is always restored
             if (submitButton) {
                 submitButton.textContent = originalButtonText; // Restore text
                 submitButton.disabled = false;
             }
             console.log("Form JS: Form submission process finished.");
        });
        // --- End Fetch Call ---
    }); // End form submit listener

    // Set footer year
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("Form JS: Could not set footer year: span#year not found.");
    }

}); // End DOMContentLoaded listener