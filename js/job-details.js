document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('jobId');  // Get the jobId from the URL query parameter

    if (jobId) {
        fetchJobDetails(jobId);  // Fetch job details using the job ID
    } else {
        document.getElementById('job-details').innerHTML = '<p class="text-danger">No job ID provided.</p>';
    }
});

// Fetch and display full job details
async function fetchJobDetails(jobId) {
    try {
        const response = await fetch(`https://hitbackend.onrender.com/api/jobs/${jobId}`);  // Fetch details of the job with the given ID
        if (!response.ok) throw new Error("Failed to fetch job details.");

        const job = await response.json();
        
        // Store job details in localStorage
        localStorage.setItem("selectedJob", JSON.stringify(job));

        const jobDetailsContainer = document.getElementById('job-details');

        let attachmentsHtml = '';
        if (job.attachmentLinks && job.attachmentLinks.length > 0) {
            attachmentsHtml = job.attachmentLinks.map(link => 
                `<a href="${link}" target="_blank" class="btn btn-primary mb-2">Download Attachment</a>`
            ).join('<br>');
        } else {
            attachmentsHtml = `<p class="text-muted">No attachments available.</p>`;
        }

        jobDetailsContainer.innerHTML = `
            <div class="card shadow-lg p-4">
                <h3>${job.positionTitle}</h3>
                <p><strong>Classification:</strong> ${job.jobClassification}</p>
                <p><strong>Experience:</strong> ${job.experience}</p>
                <p><strong>Location:</strong> ${job.locationZip}</p>
                <p><strong>Attitude:</strong> ${job.attitude}</p>
                <p><strong>Job Description:</strong> ${job.jobDescription}</p>
                <p><strong>Certifications:</strong> ${job.certifications.length > 0 ? job.certifications.join(', ') : "None"}</p>
                <p><strong>Tools Required:</strong> ${job.tools && job.tools.length > 0 ? job.tools.join(', ') : "None"}</p>
                <p><strong>Organization Level:</strong> ${job.organizationLevel}</p>
                <p><strong>Additional Comments:</strong> ${job.comments ? job.comments : "No additional comments"}</p>
                ${attachmentsHtml}
                <br><br>
                <button class="btn btn-success" onclick="applyForJob('${jobId}')">Apply for this Job</button>
            </div>
        `;

    } catch (err) {
        console.error('Error fetching job details:', err);
        document.getElementById('job-details').innerHTML = '<p class="text-danger">Error fetching job details. Please try again later.</p>';
    }
}

// Function to apply for a job
function applyForJob(jobId) {
    // Redirect to the candidate form while keeping job details stored in localStorage
    window.location.href = `candidateForm.html?jobId=${jobId}`;
}
