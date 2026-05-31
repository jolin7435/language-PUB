/**
 * script.js - 核心引擎
 */
let quizData = [];
let currentIndex = 0;
let correctCount = 0;
let userAnswers = {}; 
let quizSummary = "";
let averageDifficulty = 5;

window.onload = function() {
    // 透過 timestamp 防止瀏覽器快取舊的考題
    fetch('today.json?t=' + new Date().getTime())
        .then(response => response.text()) // 先讀取為純文字以進行清理
        .then(text => {
            // 清理潛在的 markdown 標籤，確保 JSON 解析不出錯
            const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const data = JSON.parse(cleanJson);
            
            quizData = data.quiz;
            quizSummary = data.summary;
            averageDifficulty = data.average_difficulty;
            
            currentIndex = 0;
            correctCount = 0;
            userAnswers = {};
            
            showQuiz(currentIndex);
        })
        .catch(error => {
            console.error('JSON 讀取或解析失敗:', error);
            document.getElementById('quiz-word').innerText = "考題載入失敗，請檢查 JSON 檔案格式。";
        });
};

function showQuiz(index) {
    const currentQuiz = quizData[index];
    const quizWord = document.getElementById('quiz-word');
    
    // 設定對齊方式 (根據 JSON 內的 alignment 欄位)
    quizWord.style.textAlign = currentQuiz.alignment || 'center';
    quizWord.innerText = currentQuiz.word;

    // 設定計數器
    document.getElementById('quiz-counter').innerText = `[${currentQuiz.type}] ${index + 1} / ${quizData.length}`;

    // 生成選項
    const container = document.getElementById('options-container');
    container.innerHTML = ''; 
    currentQuiz.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(i);
        container.appendChild(btn);
    });

    // 隱藏解析與導航
    document.getElementById('explanation-card').style.display = 'none';
    document.getElementById('nav-container').style.display = 'none';
}

function checkAnswer(selectedIndex) {
    if (userAnswers[currentIndex] !== undefined) return; 

    const currentQuiz = quizData[currentIndex];
    const isCorrect = (selectedIndex === currentQuiz.answer_index);
    if (isCorrect) correctCount++;
    userAnswers[currentIndex] = selectedIndex;

    // 視覺回饋
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach((btn, i) => {
        btn.disabled = true;
        if (i === currentQuiz.answer_index) btn.classList.add('correct');
        else if (i === selectedIndex) btn.classList.add('wrong');
    });

    // 顯示解析
    document.getElementById('explanation-card').style.display = 'block';
    document.getElementById('result-status').innerText = isCorrect ? "✅ 正確" : "❌ 錯誤";
    document.getElementById('explanation-text').innerText = "解析：" + currentQuiz.explanation;
    
    // 顯示導航
    document.getElementById('nav-container').style.display = 'flex';
}

function nextQuiz() {
    if (currentIndex < quizData.length - 1) {
        currentIndex++;
        showQuiz(currentIndex);
    } else {
        showResults();
    }
}

function prevQuiz() {
    if (currentIndex > 0) {
        currentIndex--;
        showQuiz(currentIndex);
    }
}

function showResults() {
    document.getElementById('quiz-area').style.display = 'none';
    const resCard = document.getElementById('result-card');
    resCard.style.display = 'block';

    const score = Math.round((correctCount / quizData.length) * 100);
    document.getElementById('score-text').innerText = `今日答對率：${score}% (${correctCount}/${quizData.length})`;
    
    // 進度條計算
    const progress = averageDifficulty * 10; 
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('summary-text').innerText = quizSummary;
}
