let quizData = [];
let currentIndex = 0;
let correctCount = 0;
let averageDifficulty = 5;

window.onload = function() {
    fetch('today.json?t=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            quizData = data.quiz;
            averageDifficulty = data.average_difficulty;
            showQuiz(currentIndex);
        });
};

// 在 checkAnswer 中增加計分
function checkAnswer(selectedIndex) {
    if (hasAnswered) return;
    hasAnswered = true;
    if (selectedIndex === quizData[currentIndex].answer_index) correctCount++;
    
    // ... 原本的顯示解析邏輯 ...
    document.getElementById('next-btn').innerText = (currentIndex < quizData.length - 1) ? "下一題 ➡️" : "查看成績 🏁";
}

// 修改 nextQuiz，最後一題觸發結果頁
function nextQuiz() {
    if (currentIndex < quizData.length - 1) {
        currentIndex++;
        showQuiz(currentIndex);
    } else {
        showResult();
    }
}

function showResult() {
    document.querySelector('.container > h1').style.display = 'none';
    document.querySelector('.quiz-card').style.display = 'none';
    document.querySelector('.options-container').style.display = 'none';
    document.querySelector('.nav-container').style.display = 'none';
    document.querySelector('.explanation-card').style.display = 'none';

    const resultCard = document.getElementById('result-card');
    resultCard.style.display = 'block';
    
    document.getElementById('score-text').innerText = `答對題數：${correctCount} / 10`;
    
    // 計算程度位階：(答對率 * 難度) / 10
    const progress = (correctCount * averageDifficulty) * 1.5; 
    document.getElementById('progress-bar').style.width = Math.min(progress, 100) + "%";
    document.getElementById('summary-text').innerText = "點評：" + quizData[0].summary; // 需調整JSON結構對應
}
