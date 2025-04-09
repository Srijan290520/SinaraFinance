document.getElementById('inquiry-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const submitButton = event.target.querySelector('input[type="submit"]');
    const originalButtonText = submitButton.value;
    submitButton.value = 'Submitting...'; // Provide feedback
    submitButton.disabled = true; // Prevent double submission

    // --- Collect ALL form data ---
    const userTypeElement = document.querySelector('input[name="user_type"]:checked');
    const user_type = userTypeElement ? userTypeElement.value : ''; // Get selected radio value
    const full_name = document.getElementById('full_name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value; // Assuming ID is 'phone'
    const interestElement = document.querySelector('input[name="interest"]:checked');
    const interest = interestElement ? interestElement.value : ''; // Get selected radio value
    const location = document.getElementById('location').value; // Assuming ID is 'location'
    const buyer_details = document.getElementById('buyer_details').value; // Assuming ID is 'buyer_details'
    const seller_details = document.getElementById('seller_details').value; // Assuming ID is 'seller_details'

    // --- Construct the data payload ---
    // Send ALL fields, let the Apps Script decide what to use based on user_type/interest
    const formData = {
        user_type: user_type,
        full_name: full_name,
        email: email,
        phone: phone,
        interest: interest,
        location: location,
        buyer_details: buyer_details,
        seller_details: seller_details // Include seller details too
    };

    console.log("Form JS: Attempting to send JSON data:", JSON.stringify(formData)); // Log the actual data being sent

    const scriptURL = 'https://script.google.com/macros/s/AKfycbzPlFO-EFrv5MLMlCeEMhwM6w5IOXY63p1iqedVwVHVuCFlzMAYxPNGn25f6wC_beUQ/exec'; // Your script URL

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', // <---- MAKE SURE THIS IS HERE!
        cache: 'no-cache',
        headers: {
            // Content-Type header is often NOT needed or can even cause issues with 'no-cors'
            // 'Content-Type': 'application/json' // Try removing this first if 'no-cors' alone doesn't work
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        // IMPORTANT: With mode: 'no-cors', the response object here is "opaque".
        // You CANNOT check response.ok, response.status, or read response.body.
        // You just assume success if the request didn't throw a network error.
        console.log('Form JS: Fetch request sent successfully (mode: no-cors).');

        const popup = document.getElementById('thank-you-popup');
        if (popup) {
            popup.classList.remove('hidden');
        }
        document.getElementById('inquiry-form').reset(); // Reset the form

        // Redirect after a delay
        setTimeout(() => {
            window.location.href = 'index.html'; // Redirect back
        }, 5000);
    })
    .catch(error => {
        // This catch block handles NETWORK errors (e.g., offline, DNS issues),
        // NOT errors reported back from the Apps Script itself.
        console.error('Form JS: Fetch Error encountered:', error);
        alert('Submission Network Error: ' + error.message + '. Please check your internet connection or try again later.');
        // Restore button state on error
        if (submitButton) {
            submitButton.value = originalButtonText;
            submitButton.disabled = false;
        }
    })
    .finally(() => {
        console.log("Form JS: Form submission process finished.");
        // Ensure button is re-enabled *unless* successful submission started redirect timer
        // This logic might need adjustment based on when you want it re-enabled after success popup
         if (submitButton && document.getElementById('thank-you-popup')?.classList.contains('hidden')) { // Only re-enable if popup not shown
             submitButton.value = originalButtonText;
             submitButton.disabled = false;
         }
    });
});

// Add logic to show/hide buyer/seller details based on radio button selection
document.querySelectorAll('input[name="user_type"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const buyerDetailsDiv = document.getElementById('buyer_details_div');
        const sellerDetailsDiv = document.getElementById('seller_details_div');
        if (this.value === 'buyer' || this.value === 'buyer_seller') {
            buyerDetailsDiv.style.display = 'block';
        } else {
            buyerDetailsDiv.style.display = 'none';
        }
        if (this.value === 'seller' || this.value === 'buyer_seller') {
            sellerDetailsDiv.style.display = 'block';
        } else {
            sellerDetailsDiv.style.display = 'none';
        }
    });
});
// Initial check on page load in case a radio is pre-selected
document.querySelector('input[name="user_type"]:checked')?.dispatchEvent(new Event('change'));  