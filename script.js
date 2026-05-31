let quizData = [];
let currentIndex = 0;
let correctCount = 0;
let averageDifficulty = 5;
let hasAnswered = false;
let quizSummary = "";

window.onload = function() {
    fetch('today.json?t=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            quizData = data.quiz; 
            quizSummary = data.summary;
            averageDifficulty = data.average_difficulty;
            currentIndex = 0;
            showQuiz(currentIndex);
        })
        .catch(error => {
            console.error('讀取失敗:', error);
            document.getElementById('quiz-word').innerText = "考題載入失敗，請檢查網路";
        });
};

function showQuiz(index) {
    if (!quizData || quizData.length === 0) return;
    hasAnswered = false;
    const currentQuiz = quizData[index];

    // 更新計數器
    document.getElementById('quiz-counter').innerText = `[${currentQuiz.type}] ${index + 1} / ${quizData.length}`;
    
    // 強制顯示題目文字，如果為空則顯示提示
    const wordDisplay = document.getElementById('quiz-word');
    if (currentQuiz.word && currentQuiz.word.trim() !== "") {
        wordDisplay.innerHTML = currentQuiz.word.replace(/\n/g, '<br>');
    } else {
        wordDisplay.innerHTML = `請根據選項回答關於「${currentQuiz.type}」的問題`;
    }
    
    // 讀音處理
    const readingElement = document.getElementById('quiz-reading');
    readingElement.innerText = currentQuiz.reading || "";
    readingElement.style.display = (currentQuiz.reading && currentQuiz.reading.trim()) ? 'block' : 'none';

    // 選項按鈕處理
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
    if (selectedIndex === currentQuiz.answer_index) correctCount++;

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
    document.getElementById('translation-text').innerText = currentQuiz.translation || "";
    document.getElementById('grammar-text').innerText = currentQuiz.grammar_explanation || "";

    document.getElementById('explanation-card').style.display = 'block';
    document.getElementById('nav-container').style.display = 'flex';
    document.getElementById('next-btn').innerText = (currentIndex < quizData.length - 1) ? "下一題 ➡️" : "查看成績 🏁";
}

function nextQuiz() {
    if (currentIndex < quizData.length - 1) {
        currentIndex++;
        showQuiz(currentIndex);
    } else {
        showResult();
    }
}

function prevQuiz() {
    if (currentIndex > 0) {
        currentIndex--;
        showQuiz(currentIndex);
    }
}

function showResult() {
    document.getElementById('quiz-area').style.display = 'none';
    document.getElementById('main-title').style.display = 'none';
    
    const resultCard = document.getElementById('result-card');
    resultCard.style.display = 'block';
    
    document.getElementById('score-text').innerText = `今日得分：${correctCount} / 10`;
    
    const progress = 40 + (correctCount * (averageDifficulty / 10) * 6);
    document.getElementById('progress-bar').style.width = Math.min(progress, 100) + "%";
    document.getElementById('summary-text').innerText = quizSummary;
}
