document.addEventListener('DOMContentLoaded', function() {
    const submissionsTableBody = document.getElementById('submissions-table-body');
    const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
    
    submissions.forEach(submission => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="py-2 px-4 border-b border-gray-700">${submission.fullName}</td>
            <td class="py-2 px-4 border-b border-gray-700">${submission.phoneNumber}</td>
            <td class="py-2 px-4 border-b border-gray-700">${submission.email}</td>
            <td class="py-2 px-4 border-b border-gray-700">${submission.query}</td>
        `;
        
        submissionsTableBody.appendChild(row);
    });
});
