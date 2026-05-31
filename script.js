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
function resetQuiz() {
    // 1. 強制重置所有全域變數
    currentIndex = 0;
    correctCount = 0;
    hasAnswered = false;
    
    // 2. 切換介面顯示
    document.getElementById('result-card').style.display = 'none';
    document.getElementById('quiz-area').style.display = 'block';
    document.getElementById('main-title').style.display = 'block';
    
    // 3. 重新呼叫 onload 邏輯來抓取新資料或重置題目
    // 若要強制重新取得今日最新的 JSON，可再次呼叫 window.onload() 的邏輯
    window.onload(); 
}
