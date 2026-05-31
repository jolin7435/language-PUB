let quizData = [];       // 存放從 today.json 抓下來的 10 題資料
let currentIndex = 0;    // 目前進度
let hasAnswered = false; // 是否已作答

// 網頁開啟時，自動抓取最新的考題
window.onload = function() {
    fetch('today.json?t=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            quizData = data;
            currentIndex = 0;
            showQuiz(currentIndex);
        })
        .catch(error => {
            console.error('讀取今日考題失敗:', error);
            document.getElementById('quiz-word').innerText = "考題載入失敗，請檢查網路或稍後再試";
        });
};

// 顯示指定題目的內容
function showQuiz(index) {
    if (!quizData || quizData.length === 0) return;
    
    hasAnswered = false;
    const currentQuiz = quizData[index];

    // 1. 更新題數與題型顯示
    document.getElementById('quiz-counter').innerText = `[${currentQuiz.type}] ${index + 1} / ${quizData.length}`;
    
    // 2. 更新題目文字
    document.getElementById('quiz-word').innerHTML = currentQuiz.word.replace(/\n/g, '<br>');
    
    // 3. 處理讀音顯示
    const readingElement = document.getElementById('quiz-reading');
    if (currentQuiz.reading && currentQuiz.reading.trim() !== "") {
        readingElement.innerText = currentQuiz.reading;
        readingElement.style.display = 'block';
    } else {
        readingElement.style.display = 'none';
    }

    // 4. 更新選項
    const buttons = document.querySelectorAll('.option-btn');
    for (let i = 0; i < 4; i++) {
        buttons[i].innerText = currentQuiz.options[i];
        buttons[i].className = 'option-btn'; // 重設樣式
    }

    // 5. 隱藏解析卡片與下一題按鈕
    document.getElementById('explanation-card').style.display = 'none';
    document.getElementById('next-btn-container').style.display = 'none';
}

// 檢查答案
function checkAnswer(selectedIndex) {
    if (hasAnswered) return;
    hasAnswered = true;

    const currentQuiz = quizData[currentIndex];
    const buttons = document.querySelectorAll('.option-btn');
    const explanationCard = document.getElementById('explanation-card');

    // 判斷對錯
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

    // 填入詳細資料 (解析、翻譯、文法)
    document.getElementById('explanation-text').innerText = currentQuiz.explanation || "無解析內容。";
    
    // 處理翻譯顯示
    const transTitle = document.getElementById('translation-title');
    const transText = document.getElementById('translation-text');
    if (currentQuiz.translation && currentQuiz.translation.trim() !== "") {
        transTitle.style.display = 'block';
        transText.innerText = currentQuiz.translation;
    } else {
        transTitle.style.display = 'none';
        transText.innerText = "";
    }

    // 處理文法解釋顯示
    const gramTitle = document.getElementById('grammar-title');
    const gramText = document.getElementById('grammar-text');
    if (currentQuiz.grammar_explanation && currentQuiz.grammar_explanation.trim() !== "") {
        gramTitle.style.display = 'block';
        gramText.innerText = currentQuiz.grammar_explanation;
    } else {
        gramTitle.style.display = 'none';
        gramText.innerText = "";
    }

    explanationCard.style.display = 'block';

    // 顯示下一題按鈕
    const nextBtnContainer = document.getElementById('next-btn-container');
    const nextBtn = document.getElementById('next-btn');
    nextBtn.innerText = (currentIndex < quizData.length - 1) ? "下一題 ➡️" : "完成今日測驗 🏁";
    nextBtnContainer.style.display = 'block';
}

// 切換下一題
function nextQuiz() {
    if (currentIndex < quizData.length - 1) {
        currentIndex++;
        showQuiz(currentIndex);
    } else {
        alert("太棒了！你已經完成今天所有的考題！");
    }
}
