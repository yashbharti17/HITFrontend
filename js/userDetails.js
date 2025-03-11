
function saveUserDetails(event) {
    event.preventDefault();
    const details = {
        fname: document.getElementById('fname').value,
        lname: document.getElementById('lname').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        education: document.getElementById('edu').value,
        job: document.getElementById('apply-job').value
    };
    localStorage.setItem('candidateDetails', JSON.stringify(details));
    window.location.href = 'assessment.html';
}
