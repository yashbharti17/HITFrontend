document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Unauthorized access! Please log in first.");
        window.location.href = "executive.html"; // Redirect to login page
    }

    const jobSelect = document.getElementById("job-select");
    const tableBody = document.querySelector("#data-table tbody");
    const reportContainer = document.getElementById("reportContainer");
    const evaluationReport = document.getElementById("evaluationReport");

    let jobs = [];
    let candidates = [];

    // ✅ Fetch Jobs Data
    async function fetchJobs() {
        try {
            const response = await fetch("https://hitbackend.onrender.com/api/getJobs");
            if (!response.ok) {
                throw new Error("Failed to fetch job data.");
            }
            jobs = await response.json();

            jobs.forEach(job => {
                const option = document.createElement("option");
                option.value = job._id;
                option.textContent = `${job.positionTitle} - ${job.jobClassification} (Posted: ${new Date(job.datePosted).toLocaleDateString()})`;
                jobSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    }

    // ✅ Fetch Candidates Data
    async function fetchCandidates() {
        try {
            const response = await fetch("https://hitbackend.onrender.com/api/candidates");
            if (!response.ok) {
                throw new Error("Failed to fetch candidate data.");
            }
            candidates = await response.json();
        } catch (error) {
            console.error("Error fetching candidates:", error);
        }
    }

    // ✅ Render Candidates in Table
    async function renderCandidates() {
        const selectedJobId = jobSelect.value;
        tableBody.innerHTML = "";

        const filteredCandidates = candidates.filter(candidate => candidate.jobId === selectedJobId);

        if (filteredCandidates.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='14'>No candidates found for this job.</td></tr>";
            return;
        }

        filteredCandidates.forEach(candidate => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${candidate.candidateId}</td>
                <td>${candidate.firstName}</td>
                <td>${candidate.lastName}</td>
                <td>${candidate.phone}</td>
                <td>${candidate.email}</td>
                <td>${candidate.address}</td>
                <td>${(candidate.totalScore || 0).toFixed(2)}</td>
                <td>${candidate.education}</td>
                <td>${candidate.experience}</td>
                <td>${getJobTitle(candidate.jobId)}</td>
                <td>${candidate.certifications ? candidate.certifications.join(", ") : "N/A"}</td>
                <td>${candidate.skills ? candidate.skills.join(", ") : "N/A"}</td>
                <td><a href="${candidate.resumeLink}" target="_blank">View Resume</a></td>
                <td><button onclick="redirectToEvaluation('${candidate.candidateId}')">View Evaluation</button></td>

            `;
            tableBody.appendChild(row);
        });
    }


    // ✅ Get Job Title by jobId
    function getJobTitle(jobId) {
        const job = jobs.find(j => j._id === jobId);
        return job ? job.jobClassification : "Unknown Job";
    }

    async function init() {
        await fetchJobs();
        await fetchCandidates();
    }

    jobSelect.addEventListener("change", renderCandidates);
    init();
});


// ✅ Fetch Evaluation Report by Candidate ID
async function fetchEvaluation(candidateId) {
    try {
        const response = await fetch(`https://hitbackend.onrender.com/api/getEvaluation/${candidateId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch evaluation.");
        }
        const evaluationData = await response.json();

        // Clear previous data
        reportContainer.innerHTML = "<h4>Detailed Analysis of Results</h4><hr>";

        for (const trait in evaluationData.evaluationResults) {
            const traitName =evaluationData.evaluationResults[trait].trait;
            const score = evaluationData.evaluationResults[trait].score;
            const description = evaluationData.evaluationResults[trait].description;
            const jobCompatibility = evaluationData.evaluationResults[trait].jobCompatibility;

            reportContainer.innerHTML += `
                <div class="mb-3">
                <h5>${traitName}</h5>
                    <span class="text-muted">Score: ${score}</span><br>

                    ${description}<br>
                    <em><strong>Job Compatibility:</strong></em> ${jobCompatibility || 'No specific feedback available.'}
                </div><hr>
            `;
        }

        evaluationReport.style.display = "block";

    } catch (error) {
        console.error("Error fetching evaluation:", error);
        alert("Failed to fetch evaluation.");
    }
}


function redirectToEvaluation(candidateId) {
    window.open(`evaluation.html?candidateId=${candidateId}`, '_blank');
}

