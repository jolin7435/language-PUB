let quizData = [];
let currentIndex = 0;
let correctCount = 0;
let averageDifficulty = 5;
let hasAnswered = false;
let quizSummary = "";

window.onload = function() {
    // 強制避開快取讀取最新的 JSON
    fetch('today.json?t=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            // 這裡對應你目前 JSON 的結構：外層是物件，內容包含 quiz 陣列
            quizData = data.quiz; 
            quizSummary = data.summary;
            averageDifficulty = data.average_difficulty;
            currentIndex = 0;
            showQuiz(currentIndex);
        })
        .catch(error => {
            console.error('資料載入錯誤:', error);
            document.getElementById('quiz-word').innerText = "題目載入失敗，請稍後再試";
        });
};

function showQuiz(index) {
    if (!quizData || quizData.length === 0) return;
    hasAnswered = false;
    const currentQuiz = quizData[index];

    // 更新計數器與題目
    document.getElementById('quiz-counter').innerText = `[${currentQuiz.type}] ${index + 1} / ${quizData.length}`;
    document.getElementById('quiz-word').innerHTML = currentQuiz.word.replace(/\n/g, '<br>');
    
    // 處理讀音顯示
    const readingElement = document.getElementById('quiz-reading');
    readingElement.innerText = currentQuiz.reading || "";
    readingElement.style.display = (currentQuiz.reading && currentQuiz.reading.trim()) ? 'block' : 'none';

    // 重置選項按鈕狀態
    const buttons = document.querySelectorAll('.option-btn');
    for (let i = 0; i < 4; i++) {
        buttons[i].innerText = currentQuiz.options[i];
        buttons[i].className = 'option-btn';
    }

    // 隱藏結果區塊
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
    // 隱藏所有測驗介面
    document.getElementById('quiz-area').style.display = 'none';
    document.getElementById('main-title').style.display = 'none';
    
    // 顯示結果卡片
    const resultCard = document.getElementById('result-card');
    resultCard.style.display = 'block';
    
    document.getElementById('score-text').innerText = `今日得分：${correctCount} / 10`;
    
    // 進度條計算：基礎寬度 40% + (答對率 * 難度加權)
    const progress = 40 + (correctCount * (averageDifficulty / 10) * 6);
    document.getElementById('progress-bar').style.width = Math.min(progress, 100) + "%";
    document.getElementById('summary-text').innerText = quizSummary;
}
