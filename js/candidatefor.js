document.addEventListener("DOMContentLoaded", function () {
    const form = document.forms["contact-form"]; // Target the form by its name attribute
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent the default form submission behavior
  
      const submitButton = document.querySelector("#submit");
      submitButton.value = "Submitting...";
      submitButton.disabled = true; // Disable the button to prevent multiple submissions
  
      let formData = new FormData(form);
  
      const fileInput = document.querySelector("#file-upload");
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
  
        // Convert file to Base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async function () {
          const base64File = reader.result.split(",")[1]; // Remove the metadata prefix
  
          formData.append("file-upload", base64File);
          formData.append("file-upload-name", file.name);
          formData.append("file-upload-type", file.type);
  
          try {
            let response = await fetch(
              "https://script.google.com/macros/s/AKfycbw3HDh-y-K0cTIZ72uyE225bVtgLbHU3lgjxLbOrvc-HGrqKVIuxLo4uC02RFKnjRpV/exec",
              {
                method: "POST",
                body: formData,
              }
            );
  
            let result = await response.text();
  
            // Show success or failure message
            let msgContainer = document.querySelector("#msg");
            msgContainer.innerHTML = result;
            msgContainer.style.color = "green";
  
            // Reset form after successful submission
            form.reset();
  
            // Redirect to guideline.html
            window.location.href = "guidelines.html";
          } catch (error) {
            console.error("Error!", error.message);
            document.querySelector("#msg").innerHTML = "Submission failed. Please try again.";
            document.querySelector("#msg").style.color = "red";
          } finally {
            submitButton.value = "Submit";
            submitButton.disabled = false;
          }
        };
  
        reader.onerror = function (error) {
          console.error("Error reading file:", error);
        };
      } else {
        console.error("No file uploaded");
        document.querySelector("#msg").innerHTML = "Please upload a file before submitting.";
        document.querySelector("#msg").style.color = "red";
        submitButton.value = "Submit";
        submitButton.disabled = false;
      }
    });
  });
  
  
  