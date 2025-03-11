// Mapping of traits to question numbers based on your provided matrix
const traitMapping = {
    Extroversion: [49, 20, 3, 52, 8, 50, 60, 9, 54],
    Conscientiousness: [55, 16, 33, 13, 39, 24, 31, 23, 51, 1, 53, 46, 18],
    Openness: [11, 19, 25, 6, 59, 15, 27, 36, 44, 41, 5],
    Agreeableness: [35, 40, 10, 17, 21, 47, 38, 2, 56],
    Emotional_Stability: [26, 14, 37, 30, 42, 29, 43],
    Communication_Skills: [8, 50, 60, 35, 40, 10, 32, 4, 34, 12],
    Critical_Thinking: [31, 27, 36, 45, 28, 48],
    Leadership_Ability: [50, 60, 32, 4, 22, 7, 57, 52, 58, 12]
};

// This function is called when the assessment form is submitted
function calculateAssessment(event) {
    event.preventDefault();

    const scores = {};
    for (const trait in traitMapping) {
        scores[trait] = 0;
    }

    // Loop through all 60 questions and fetch their responses
    for (let i = 1; i <= 60; i++) {
        const response = document.querySelector(`input[name="q${i}"]:checked`);
        if (response) {
            const score = parseInt(response.value, 10);
            for (const trait in traitMapping) {
                if (traitMapping[trait].includes(i)) {
                    scores[trait] += score;
                }
            }
        } else {
            alert(`Please answer all questions before submitting (Missing: Q${i})`);
            return;
        }
    }
    console.log(scores);
    // Store the calculated trait scores into localStorage to use in final report
    localStorage.setItem('assessmentScores', JSON.stringify(scores));

    // // Redirect to the final report page
    // window.location.href = 'finalReport.html';
}
