// Function to toggle certificate input field based on selection
function toggleCertificateInput() {
    const certificationStatus = document.getElementById("certification-status").value;
    const certificateNameField = document.getElementById("certificate-name-field");

    if (certificationStatus === "yes") {
        certificateNameField.style.display = "block";
    } else {
        certificateNameField.style.display = "none";
        document.getElementById("certificate-name").value = ""; // Clear input if hidden
    }
}

// Restrict ZIP code input to 5 digits
document.getElementById("zipcode").addEventListener("input", function () {
    this.value = this.value.slice(0, 5);
});
