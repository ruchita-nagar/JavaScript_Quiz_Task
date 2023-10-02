document.addEventListener("DOMContentLoaded", function () {
    const questionElement = document.getElementById("question");
    const answerForm = document.getElementById("answer-form");
    const nextButton = document.getElementById("next-button");
    const scoreElement = document.getElementById("score");
    const questionContainer = document.getElementById("question-container");

    let currentQuestionIndex = 0;
    let score = 0;


    // Fetch questions from JSON
    fetch("questions.json")
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            loadQuestion(questions[currentQuestionIndex]);
        })
        .catch(error => {
            console.error("An error occurred while fetching the JSON data:", error);
        });

    // Load a question
    function loadQuestion(question) {
        questionElement.textContent = question.text;
        answerForm.innerHTML = "";

        for (const option of question.options) {
            const input = document.createElement("input");
            input.type = question.type;
            input.name = "answer"; // For radio buttons, use the same name for mutually exclusive selection
            input.value = option;
            input.id = option;

            const label = document.createElement("label");
            label.textContent = option;

            answerForm.appendChild(input);
            answerForm.appendChild(label);
        }

        // Check if it's the last question and update the button text accordingly
        if (currentQuestionIndex === questions.length - 1) {
            nextButton.textContent = "Submit";
        } else {
            nextButton.textContent = "Next";
        }
    }

    nextButton.addEventListener("click", function () {
        const selectedAnswers = document.querySelectorAll(`input[name="answer"]:checked`);
        const currentQuestion = questions[currentQuestionIndex];
    
        if (currentQuestion.type === "radio" && selectedAnswers.length === 1) {
            // Radio button question with one selected answer
            if (selectedAnswers[0].value === currentQuestion.correct) {
                score++;
            }
        } else if (currentQuestion.type === "checkbox" && selectedAnswers.length > 0) {
            // Checkbox question with multiple selected answers
            if (areAnswersCorrect(selectedAnswers, currentQuestion.correct)) {
                score++;
            }
        }
    
        currentQuestionIndex++;
        scoreElement.textContent = `Score: ${score}`;
    
        if (currentQuestionIndex < questions.length) {
            loadQuestion(questions[currentQuestionIndex]);
        } else {
            // Quiz is over
            questionContainer.innerHTML = "<h2>Quiz Completed!</h2>";
            scoreElement.textContent = `Final Score: ${score}`;
            nextButton.style.display = "none";
        }
    });
    
    // Function to check if the selected answers are correct for checkboxes
    function areAnswersCorrect(selectedAnswers, correctAnswers) {
        const selectedValues = Array.from(selectedAnswers).map(input => input.value);
        return selectedValues.sort().join(',') === correctAnswers.sort().join(',');
    }
    
})


