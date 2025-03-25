document.getElementById('inquiry-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('full_name').value;
    const phoneNumber = document.getElementById('phone_number').value;
    const email = document.getElementById('email').value;
    const query = document.getElementById('query').value;
    
    const formData = {
        fullName,
        phoneNumber,
        email,
        query
    };
    
    console.log('Submitting form data:', formData);
    
    fetch('https://script.google.com/macros/s/AKfycbzcC0H6C74GChSFackf5jid2esTLFlZYYrihj4tgZSqehOYC_EULV0MvkAFYqKzhrFkgQ/exec', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Response:', response);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data);
        if (data.result === 'success') {
            const popup = document.getElementById('thank-you-popup');
            popup.classList.remove('hidden');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 5000);
        } else {
            console.error('Error in response data:', data);
            alert('There was an error submitting your query. Please try again.');
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('There was an error submitting your query. Please try again.');
    });
});
