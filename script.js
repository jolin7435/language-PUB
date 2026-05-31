let quizData = [];
let currentIndex = 0;
let hasAnswered = false;

window.onload = function() {
    fetch('today.json?t=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            quizData = data;
            currentIndex = 0;
            showQuiz(currentIndex);
        })
        .catch(error => {
            document.getElementById('quiz-word').innerText = "考題載入失敗";
        });
};

function showQuiz(index) {
    if (!quizData || quizData.length === 0) return;
    hasAnswered = false;
    const currentQuiz = quizData[index];

    document.getElementById('quiz-counter').innerText = `[${currentQuiz.type}] ${index + 1} / ${quizData.length}`;
    document.getElementById('quiz-word').innerHTML = currentQuiz.word.replace(/\n/g, '<br>');
    
    const readingElement = document.getElementById('quiz-reading');
    readingElement.innerText = currentQuiz.reading || "";
    readingElement.style.display = (currentQuiz.reading && currentQuiz.reading.trim()) ? 'block' : 'none';

    const buttons = document.querySelectorAll('.option-btn');
    for (let i = 0; i < 4; i++) {
        buttons[i].innerText = currentQuiz.options[i];
        buttons[i].className = 'option-btn';
    }

    document.getElementById('explanation-card').style.display = 'none';
    document.getElementById('nav-container').style.display = 'none';
}

function checkAnswer(selectedIndex) {
    if (hasAnswered) return;
    hasAnswered = true;
    const currentQuiz = quizData[currentIndex];
    const buttons = document.querySelectorAll('.option-btn');
    
    if (selectedIndex === currentQuiz.answer_index) {
        buttons[selectedIndex].classList.add('correct');
        document.getElementById('result-status').innerText = "🎉 答對了！";
        document.getElementById('result-status').style.color = "#6B8E23";
    } else {
        buttons[selectedIndex].classList.add('wrong');
        buttons[currentQuiz.answer_index].classList.add('correct');
        document.getElementById('result-status').innerText = "❌ 答錯囉！";
        document.getElementById('result-status').style.color = "#CD5C5C";
    }

    document.getElementById('explanation-text').innerText = currentQuiz.explanation || "";
    
    const transTitle = document.getElementById('translation-title');
    const transText = document.getElementById('translation-text');
    transTitle.style.display = (currentQuiz.translation && currentQuiz.translation.trim()) ? 'block' : 'none';
    transText.innerText = currentQuiz.translation || "";

    const gramTitle = document.getElementById('grammar-title');
    const gramText = document.getElementById('grammar-text');
    gramTitle.style.display = (currentQuiz.grammar_explanation && currentQuiz.grammar_explanation.trim()) ? 'block' : 'none';
    gramText.innerText = currentQuiz.grammar_explanation || "";

    document.getElementById('explanation-card').style.display = 'block';
    document.getElementById('nav-container').style.display = 'flex';
    document.getElementById('next-btn').innerText = (currentIndex < quizData.length - 1) ? "下一題 ➡️" : "完成測驗 🏁";
}

function nextQuiz() {
    if (currentIndex < quizData.length - 1) {
        currentIndex++;
        showQuiz(currentIndex);
    } else {
        alert("恭喜完成今日所有測驗！");
    }
}

function prevQuiz() {
    if (currentIndex > 0) {
        currentIndex--;
        showQuiz(currentIndex);
    }
}
