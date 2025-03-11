document.addEventListener("DOMContentLoaded", () => {
    fetchJobs();  // Fetch jobs when the page loads
});

// Fetch and display jobs on the main page
async function fetchJobs() {
    try {
        const response = await fetch('https://hitbackend.onrender.com/api/getJobs');  // Fetch all jobs
        if (!response.ok) throw new Error("Failed to fetch jobs.");

        const jobs = await response.json();  // Parse the response
        const jobListingsContainer = document.getElementById('job-listings');
        jobListingsContainer.innerHTML = ''; // Clear previous content

        if (jobs.length === 0) {
            jobListingsContainer.innerHTML = '<p class="text-muted">No jobs available at the moment.</p>';
            return;
        }

        // Loop through each job and create a job card
        jobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.classList.add('col-md-4');

            // Create content for each job card
            jobCard.innerHTML = `
                <div class="card mb-3 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${job.positionTitle}</h5>
                        <p><strong>Classification:</strong> ${job.jobClassification}</p>
                        <p><strong>Experience:</strong> ${job.experience}</p>
                        <p><strong>Location:</strong> ${job.locationZip}</p>
                        <button class="btn btn-info" onclick="viewJob('${job._id}')">View Job</button>
                        <button class="btn btn-success" onclick="applyForJob('${job._id}')">Apply</button>
                    </div>
                </div>
            `;

            // Append the job card to the container
            jobListingsContainer.appendChild(jobCard);
        });
    } catch (err) {
        console.error('Error fetching jobs:', err);
        document.getElementById('job-listings').innerHTML = '<p class="text-danger">Error fetching jobs. Please try again later.</p>';
    }
}

// Function to view job details
function viewJob(jobId) {
    // Redirect to job details page with jobId as a query parameter
    window.location.href = `job-details.html?jobId=${jobId}`;
}

// Function to apply for a job (stores job details and redirects)
async function applyForJob(jobId) {
    try {
        const response = await fetch(`https://hitbackend.onrender.com/api/jobs/${jobId}`);  // Fetch job details
        if (!response.ok) throw new Error("Error fetching job details");

        const jobData = await response.json();  // Parse job details

        // Store job details in localStorage along with jobId
        localStorage.setItem('selectedJob', JSON.stringify(jobData));

        console.log("Job details saved:", jobData);

        // Redirect to candidate application form
        window.location.href = `candidateForm.html?jobId=${jobId}`;
    } catch (error) {
        console.error("Error fetching job details:", error);
        alert("Error fetching job details. Please try again.");
    }
}
