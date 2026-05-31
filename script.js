let quizData = [];       // 用來存放從 today.json 抓下來的 10 題全部資料
let currentIndex = 0;    // 目前進行到第幾題 (0 代表第 1 題)
let hasAnswered = false; // 這一題是不是已經作答了

// 網頁一開啟，立刻抓取今日的 10 題考題
window.onload = function() {
    fetch('today.json?t=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            quizData = data; // 把 10 題大禮包存起來
            currentIndex = 0;
            showQuiz(currentIndex); // 顯示第一題
        })
        .catch(error => {
            console.error('讀取今日考題失敗:', error);
            document.getElementById('quiz-word').innerText = "考題載入失敗，請重新整理";
        });
};

// 負責把某一題的資料，塞進 HTML 畫面的各個格子裡
function showQuiz(index) {
    if (!quizData || quizData.length === 0) return;
    
    hasAnswered = false; // 重設作答狀態
    const currentQuiz = quizData[index];

    // 1. 更新上方題數顯示 (例如：1 / 10)
    // 我們順便把「題型」加在前面，讓你知道這題是 [單字]、[文法] 還是 [克漏字]
    document.getElementById('quiz-counter').innerText = `[${currentQuiz.type}] ${index + 1} / ${quizData.length}`;
    
    // 2. 把題目文字塞進原本放「explosion」的格子
    // 如果是克漏字短文，換行符號 \n 會自動生效
    document.getElementById('quiz-word').innerHTML = currentQuiz.word.replace(/\n/g, '<br>');
    
    // 3. 處理日文漢字讀音 (讀音有字就顯示，沒字就隱藏)
    const readingElement = document.getElementById('quiz-reading');
    if (currentQuiz.reading && currentQuiz.reading.trim() !== "") {
        readingElement.innerText = currentQuiz.reading;
        readingElement.style.display = 'block';
    } else {
        readingElement.style.display = 'none';
    }

    // 4. 填入 4 個選項的文字，並把按鈕顏色全部重設回莫蘭迪棕色
    const buttons = document.querySelectorAll('.option-btn');
    for (let i = 0; i < 4; i++) {
        buttons[i].innerText = currentQuiz.options[i];
        buttons[i].className = 'option-btn'; // 清除上一題留下來的 correct 或 wrong 顏色
    }

    // 5. 隱藏最底下的解析卡片與下一題按鈕
    document.getElementById('explanation-card').style.display = 'none';
    document.getElementById('next-btn-container').style.display = 'none';
}

// 檢查點擊的答案對不對
function checkAnswer(selectedIndex) {
    if (hasAnswered) return; // 答過就鎖定
    hasAnswered = true;

    const currentQuiz = quizData[currentIndex];
    const buttons = document.querySelectorAll('.option-btn');
    const resultStatus = document.getElementById('result-status');
    const explanationCard = document.getElementById('explanation-card');

    // 比對答案
    if (selectedIndex === currentQuiz.answer_index) {
        buttons[selectedIndex].classList.add('correct');
        resultStatus.innerText = "🎉 答對了！";
        resultStatus.style.color = "#6B8E23";
    } else {
        buttons[selectedIndex].classList.add('wrong');
        buttons[currentQuiz.answer_index].classList.add('correct'); // 幫忙翻開正確答案
        resultStatus.innerText = "❌ 答錯囉！";
        resultStatus.style.color = "#CD5C5C";
    }

    // 塞入這題的詳細中文解析
    document.getElementById('explanation-text').innerText = currentQuiz.explanation || "本題暫無解析。";
    explanationCard.style.display = 'block';

    // 顯示「下一題」或「看總分」的按鈕
    const nextBtnContainer = document.getElementById('next-btn-container');
    const nextBtn = document.getElementById('next-btn');
    
    if (currentIndex < quizData.length - 1) {
        nextBtn.innerText = "下一題 ➡️";
    } else {
        nextBtn.innerText = "完成今日測驗 🏁";
    }
    nextBtnContainer.style.display = 'block';
}

// 點擊下一題按鈕時觸發
function nextQuiz() {
    if (currentIndex < quizData.length - 1) {
        currentIndex++;
        showQuiz(currentIndex); // 載入下一題
    } else {
        alert(`太棒了！你已完成今日的 ${quizData.length} 題日文 N4 小考題！🎉`);
    }
}
