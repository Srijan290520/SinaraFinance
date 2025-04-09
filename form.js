// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('inquiry-form');
    const submitButton = form ? form.querySelector('input[type="submit"]') : null; // Get button relative to form
    const popup = document.getElementById('thank-you-popup');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyOf12o5Gf2fjcqW-8uov7n4ycNIlBcP--nGeg50_PtG1NldGNvEHrtrTLFF0besLIU/exec'; // <-- Replace with YOUR actual script URL

    // Check if the form element actually exists before adding listener
    if (form && submitButton) {
        const originalButtonText = submitButton.value; // Store original button text

        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            // Provide immediate feedback
            submitButton.value = 'Submitting...';
            submitButton.disabled = true;

            // --- Collect ALL form data ---
            // Use querySelector for radio buttons to get the checked value reliably
            const userTypeElement = form.querySelector('input[name="user_type"]:checked');
            const interestElement = form.querySelector('input[name="interest"]:checked');

            // Get values, providing empty string fallback if element not found or not checked
            const user_type = userTypeElement ? userTypeElement.value : '';
            const full_name = document.getElementById('full_name')?.value || ''; // Use optional chaining ?.
            const email = document.getElementById('email')?.value || '';
            const phone = document.getElementById('phone')?.value || '';
            const interest = interestElement ? interestElement.value : '';
            const location = document.getElementById('location')?.value || '';
            const buyer_details = document.getElementById('buyer_details')?.value || '';
            const seller_details = document.getElementById('seller_details')?.value || '';


            // --- Construct the data payload ---
            const formData = {
                user_type: user_type,
                full_name: full_name,
                email: email,
                phone: phone,
                interest: interest,
                location: location,
                buyer_details: buyer_details,
                seller_details: seller_details
            };

            console.log("Form JS: Attempting to send JSON data:", JSON.stringify(formData)); // Log the data being sent

            // --- Send data using fetch with no-cors ---
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors', // Essential for simple Google Apps Script submissions from different origins
                cache: 'no-cache',
                // headers: { // Content-Type often not needed or causes issues with 'no-cors'
                //   'Content-Type': 'application/json'
                // },
                body: JSON.stringify(formData)
            })
            .then(response => {
                // In 'no-cors' mode, you CANNOT read response.status or response.body.
                // You only know the request was *sent* without a network-level error.
                // Assume success if no error is caught.
                console.log('Form JS: Fetch request sent successfully (mode: no-cors).');

                if (popup) {
                    popup.classList.remove('hidden'); // Show the thank you popup
                }
                form.reset(); // Reset the form fields

                // Redirect after a delay
                setTimeout(() => {
                    window.location.href = 'index.html'; // Redirect back to the homepage
                }, 5000); // 5 seconds delay

            })
            .catch(error => {
                // This catch block handles NETWORK errors (e.g., offline, DNS failure, script URL wrong)
                console.error('Form JS: Fetch Error encountered:', error);
                alert('Submission Network Error: ' + error.message + '. Please check your internet connection or the script URL.');
                // Restore button state ONLY on error
                submitButton.value = originalButtonText;
                submitButton.disabled = false;
            })
            .finally(() => {
                 // Code here runs whether fetch succeeded or failed network-wise.
                 // Button state is handled in .then() for success (stays disabled until redirect)
                 // and in .catch() for error (re-enabled).
                 console.log("Form JS: Form submission attempt finished.");
            });
        });

    } else {
        console.error("Form JS Error: Could not find the form (#inquiry-form) or the submit button.");
        if (!form) console.error("Reason: #inquiry-form not found in the HTML.");
        if (form && !submitButton) console.error("Reason: Submit button (input[type='submit']) not found inside the form.");
    }


    // --- Logic to show/hide buyer/seller details based on radio button selection ---
    // Note: This part was missing in the previous JS, adding it back
    const buyerDetailsDiv = document.getElementById('buyer_details_div');
    const sellerDetailsDiv = document.getElementById('seller_details_div');
    const interestRadios = document.querySelectorAll('input[name="interest"]'); // Changed to listen on interest radios

    function toggleDetailsVisibility() {
        const selectedInterest = document.querySelector('input[name="interest"]:checked');
        if (!selectedInterest) { // Handle case where nothing is selected initially
             if(buyerDetailsDiv) buyerDetailsDiv.style.display = 'none';
             if(sellerDetailsDiv) sellerDetailsDiv.style.display = 'none';
            return;
        };

        const showBuyer = (selectedInterest.value === 'buyer' || selectedInterest.value === 'buyer_seller');
        const showSeller = (selectedInterest.value === 'seller' || selectedInterest.value === 'buyer_seller');

        if (buyerDetailsDiv) {
            buyerDetailsDiv.style.display = showBuyer ? 'block' : 'none';
        }
         if (sellerDetailsDiv) {
            sellerDetailsDiv.style.display = showSeller ? 'block' : 'none';
        }
    }

    interestRadios.forEach(radio => {
        radio.addEventListener('change', toggleDetailsVisibility);
    });

    // Initial check on page load in case a radio is pre-selected or for default state
    toggleDetailsVisibility();

}); // End of DOMContentLoaded listener