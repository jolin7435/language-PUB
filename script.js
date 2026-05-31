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
            document.getElementById('quiz-word').innerText = "考題載入失敗，請稍後再試";
        });
};

function showQuiz(index) {
    if (!quizData || quizData.length === 0) return;
    hasAnswered = false;
    const currentQuiz = quizData[index];

    document.getElementById('quiz-counter').innerText = `[${currentQuiz.type}] ${index + 1} / ${quizData.length}`;
    
    // 顯示題目
    document.getElementById('quiz-word').innerHTML = currentQuiz.word.replace(/\n/g, '<br>');
    
    // 判斷是否顯示讀音：漢字題或讀音與題目相同者，隱藏讀音以防破題
    const hasKanji = /[\u4e00-\u9faf]/.test(currentQuiz.word);
    const readingElement = document.getElementById('quiz-reading');
    const shouldHideReading = hasKanji || (currentQuiz.word === currentQuiz.reading);
    
    if (currentQuiz.reading && currentQuiz.reading.trim() !== "" && !shouldHideReading) {
        readingElement.innerText = currentQuiz.reading;
        readingElement.style.display = 'block';
    } else {
        readingElement.style.display = 'none';
    }

    const buttons = document.querySelectorAll('.option-btn');
    for (let i = 0; i < 4; i++) {
        buttons[i].innerText = currentQuiz.options[i];
        buttons[i].className = 'option-btn';
    }

    document.getElementById('explanation-card').style.display = 'none';
    document.getElementById('nav-container').style.display = 'none';
}

// checkAnswer, nextQuiz, prevQuiz, showResult 函數保持不變...
// (請使用您之前測試成功的版本)
