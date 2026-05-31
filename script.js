let quizData = [];
let currentIndex = 0;
let correctCount = 0;
let userAnswers = {}; // 記錄使用者的答題狀態
let quizSummary = "";
let averageDifficulty = 5;

window.onload = function() {
    fetch('today.json?t=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            quizData = data.quiz;
            quizSummary = data.summary;
            averageDifficulty = data.average_difficulty;
            currentIndex = 0;
            correctCount = 0;
            userAnswers = {};
            showQuiz(currentIndex);
        })
        .catch(error => {
            console.error('讀取失敗:', error);
            document.getElementById('quiz-word').innerText = "考題載入失敗，請檢查 JSON 格式";
        });
};

function showQuiz(index) {
    const currentQuiz = quizData[index];
    const quizWord = document.getElementById('quiz-word');
    
    // 設定題目文字與對齊方式 (根據 JSON 中的 alignment)
    quizWord.innerText = currentQuiz.word;
    quizWord.style.textAlign = currentQuiz.alignment || 'center'; 

    // 設定題目計數器
    document.getElementById('quiz-counter').innerText = `[${currentQuiz.type}] ${index + 1} / ${quizData.length}`;

    // 生成選項按鈕
    const container = document.getElementById('options-container');
    container.innerHTML = ''; 
    currentQuiz.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(i);
        container.appendChild(btn);
    });

    document.getElementById('explanation-card').style.display = 'none';
    document.getElementById('nav-container').style.display = 'none';
}

function checkAnswer(selectedIndex) {
    if (userAnswers[currentIndex] !== undefined) return; // 防止重複作答

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
    document.getElementById('result-status').innerText = isCorrect ? "✅ 正確！" : "❌ 錯誤";
    document.getElementById('explanation-text').innerText = "解析：" + currentQuiz.explanation;
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
    document.getElementById('score-text').innerText = `答對率：${score}% (${correctCount}/${quizData.length})`;
    
    // 進度條計算：將 averageDifficulty (1-10) 映射為進度條寬度
    const progress = averageDifficulty * 10; 
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('summary-text').innerText = quizSummary;
}
