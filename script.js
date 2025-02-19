let questions = [];
let currentQuestion = {};
let questionsLength = 0;
let correctAnswers = 0;

document
  .getElementById("json-selector")
  .addEventListener("change", function () {
    if (this.value !== "") loadQuestions(this.value);
  });

async function loadQuestions(jsonFile) {
  try {
    const response = await fetch(jsonFile);
    questions = await response.json();
    shuffleArray(questions);
    questionsLength = questions.length;
    loadQuestion();
  } catch (error) {
    console.error("Fehler beim Laden der Fragen:", error);
    document.getElementById("question").textContent =
      "Fehler beim Laden der Fragen.";
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
  if (questions.length === 0) {
    alert(
      `Congratulations you had ${correctAnswers}/${questionsLength} correct answers`
    );
    console.error("Keine Fragen vorhanden!");
    return;
  }
  updateScore();
  currentQuestion = questions[questions.length - 1];

  document.getElementById("question").textContent = currentQuestion.question;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  let shuffledOptions = [...currentQuestion.options];
  shuffleArray(shuffledOptions);

  shuffledOptions.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () => checkAnswer(option, button);
    optionsContainer.appendChild(button);
  });

  document.getElementById("feedback").textContent = "";
  document.getElementById("next-question").style.display = "none";
}

function checkAnswer(selectedOption, button) {
  if (selectedOption === currentQuestion.answer) {
    correctAnswers++;
    document.getElementById("feedback").textContent = "Richtig! 🎉";
  } else {
    document.getElementById("feedback").textContent = "Falsch! 😢";
  }
  document.querySelectorAll("#options button").forEach((btn) => {
    btn.disabled = true;
  });
  questions.pop();
  document.getElementById("next-question").style.display = "block";
}
const updateScore = () => {
  document.getElementById("score").innerText = `${
    questionsLength - questions.length + 1
  }/${questionsLength}`;
};

document
  .getElementById("next-question")
  .addEventListener("click", loadQuestion);

// Standardmäßig eine JSON-Datei laden
loadQuestions("questions_css.json");
