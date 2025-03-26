document.getElementById('inquiry-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const fullName = document.getElementById('full_name').value;
  const phoneNumber = document.getElementById('phone_number').value;
  const email = document.getElementById('email').value;
  const query = document.getElementById('query').value;
  
  const formData = { fullName, phoneNumber, email, query };
  
  fetch('https://script.google.com/macros/s/AKfycbxdsx-PGWl_EQRrHVwQvmiv7p-elp5yCp2vZpElLz5_Gyeuc8Yj91XP2CBggGrN6ACw1Q/exec', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
      mode: 'no-cors'
  })
  .then(() => {
      const popup = document.getElementById('thank-you-popup');
      popup.classList.remove('hidden');
      setTimeout(() => {
          window.location.href = 'index.html';
      }, 5000);
  })
  .catch(error => {
      console.error('Fetch error:', error);
      alert('There was an error submitting your query. Please try again.');
  });
});