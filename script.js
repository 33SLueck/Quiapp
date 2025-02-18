let questions = [];
let currentQuestion = {};
let lastQuestion;

document.getElementById("json-selector").addEventListener("change", function () {
    loadQuestions(this.value);
});

async function loadQuestions(jsonFile) {
    try {
        const response = await fetch(jsonFile);
        questions = await response.json();
        loadQuestion();
    } catch (error) {
        console.error("Fehler beim Laden der Fragen:", error);
        document.getElementById("question").textContent = "Fehler beim Laden der Fragen.";
    }
}

// Fisher-Yates Shuffle Algorithmus
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadQuestion() {
    let newQuestion;

    if (questions.length === 0) {
        console.error("Keine Fragen vorhanden!");
        return;
    }

    do {
        newQuestion = questions[Math.floor(Math.random() * questions.length)];
    } while (lastQuestion && newQuestion.id === lastQuestion.id);

    currentQuestion = newQuestion;
    lastQuestion = currentQuestion;

    document.getElementById("question").textContent = currentQuestion.question;

    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    let shuffledOptions = [...currentQuestion.options];
    shuffleArray(shuffledOptions);

    shuffledOptions.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(option, button);
        optionsContainer.appendChild(button);
    });

    document.getElementById("feedback").textContent = "";
    document.getElementById("next-question").style.display = "none";
}

function checkAnswer(selectedOption, button) {
    const isCorrect = selectedOption === currentQuestion.answer;
    document.getElementById("feedback").textContent = isCorrect ? "Richtig! 🎉" : "Falsch! 😢";

    document.querySelectorAll("#options button").forEach(btn => {
        btn.disabled = true;
    });

    document.getElementById("next-question").style.display = "block";
}

document.getElementById("next-question").addEventListener("click", loadQuestion);

// Standardmäßig eine JSON-Datei laden
loadQuestions("questions_css.json");
