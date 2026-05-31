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
            // 關鍵修改：從物件中抓取 quiz 陣列與其他欄位
            quizData = data.quiz; 
            quizSummary = data.summary;
            averageDifficulty = data.average_difficulty;
            currentIndex = 0;
            showQuiz(currentIndex);
        })
        .catch(error => {
            console.error('讀取失敗:', error);
            document.getElementById('quiz-word').innerText = "考題載入失敗";
        });
};

function showQuiz(index) {
    if (!quizData || quizData.length === 0) return;
    hasAnswered = false;
    const currentQuiz = quizData[index];

    // 更新介面
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
    
    // 計算進度條寬度 (假設難度為平均 5.5)
    const progress = (correctCount / 10) * (averageDifficulty / 10) * 100 + 40; 
    document.getElementById('progress-bar').style.width = Math.min(progress, 100) + "%";
    document.getElementById('summary-text').innerText = quizSummary;
}
