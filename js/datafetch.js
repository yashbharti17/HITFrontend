document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Unauthorized access! Please log in first.");
        window.location.href = "executive.html"; // Redirect to login page
    }

    const jobSelect = document.getElementById("job-select");
    const tableBody = document.querySelector("#data-table tbody");

    let jobs = []; // Store job details
    let candidates = []; // Store candidate data

    // ✅ Fetch Jobs Data
    async function fetchJobs() {
        try {
            const response = await fetch("https://hitbackend.onrender.com/api/getJobs"); // Change to your actual API
            if (!response.ok) {
                throw new Error("Failed to fetch job data.");
            }
            jobs = await response.json();

            // Populate job dropdown
            jobs.forEach(job => {
                const option = document.createElement("option");
                option.value = job._id;  // Store jobId
                // Display formatted job title, classification, and date posted
                option.textContent = `${job.positionTitle} - ${job.jobClassification} (Posted on: ${new Date(job.datePosted).toLocaleDateString()})`;
                jobSelect.appendChild(option);
            });

        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    }

    // ✅ Fetch Candidates Data
    async function fetchCandidates() {
        try {
            const response = await fetch("https://hitbackend.onrender.com/api/candidates"); // Change to your API
            if (!response.ok) {
                throw new Error("Failed to fetch candidate data.");
            }
            candidates = await response.json();
        } catch (error) {
            console.error("Error fetching candidates:", error);
        }
    }

    // ✅ Render Candidates Based on Job Selection
    async function renderCandidates() {
        const selectedJobId = jobSelect.value;
        tableBody.innerHTML = "";

        // Filter candidates for the selected job
        const filteredCandidates = candidates.filter(candidate => candidate.jobId === selectedJobId);

        if (filteredCandidates.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='13'>No candidates found for this job.</td></tr>";
            return;
        }

        filteredCandidates.forEach(candidate => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${candidate.firstName}</td>
                <td>${candidate.lastName}</td>
                <td>${candidate.phone}</td>
                <td>${candidate.email}</td>
                <td>${candidate.address}</td>
                <td>${(candidate.totalScore || 0).toFixed(2)}</td>
                <td>${candidate.education}</td>
                <td>${candidate.experience}</td>
                <td>${getJobTitle(candidate.jobId)}</td>  <!-- Show Job Name -->
                <td>${candidate.certifications ? candidate.certifications.join(", ") : "N/A"}</td>
                <td>${candidate.skills ? candidate.skills.join(", ") : "N/A"}</td>
                <td><a href="${candidate.resumeLink}" target="_blank">View Resume</a></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // ✅ Get Job Title by jobId
    function getJobTitle(jobId) {
        const job = jobs.find(j => j._id === jobId);
        return job ? job.jobClassification : "Unknown Job";
    }

    // ✅ Initialize Data
    async function init() {
        await fetchJobs(); // Load job options first
        await fetchCandidates(); // Load candidate data
    }

    jobSelect.addEventListener("change", renderCandidates);
    init(); // Start fetching data
});


