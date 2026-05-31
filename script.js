let correctAnswerIndex = 0;
let hasAnswered = false;

// 網頁開啟時，自動去抓取同目錄下的 today.json
window.onload = function() {
    fetch('today.json?t=' + new Date().getTime()) // 加上時間參數防止瀏覽器快取舊題目
        .then(response => response.json())
        .then(data => {
            // 1. 填入題目與讀音
            document.getElementById('quiz-word').innerText = data.word;
            
            if (data.reading && data.reading.trim() !== "") {
                document.getElementById('quiz-reading').innerText = data.reading;
                document.getElementById('quiz-reading').style.display = 'block';
            } else {
                document.getElementById('quiz-reading').style.display = 'none';
            }

            // 2. 填入選項文字
            const buttons = document.querySelectorAll('.option-btn');
            for (let i = 0; i < 4; i++) {
                if (data.options && data.options[i]) {
                    buttons[i].innerText = data.options[i];
                    buttons[i].style.display = 'block';
                } else {
                    buttons[i].style.display = 'none';
                }
            }

            // 3. 紀錄正確答案索引 (由 Python 傳過來的 0, 1, 2, 3)
            correctAnswerIndex = data.answer_index;

            // 4. 更新題數（你可以根據後台傳遞的變數修改，目前預設單題模式顯示 1/1）
            // 如果你在後台有設計多題，可以直接改用 data.counter_text 類似的欄位
            document.getElementById('quiz-counter').innerText = "1 / 1";
            
            // 儲存解析文字供後面使用
            document.getElementById('explanation-text').innerText = data.explanation || "本題暫無解析。";
        })
        .catch(error => {
            console.error('讀取今日考題失敗:', error);
            document.getElementById('quiz-word').innerText = "點擊畫面重新整理";
        });
};

// 檢查答案的邏輯
function checkAnswer(selectedIndex) {
    if (hasAnswered) return; // 答過就鎖定，防止重複點擊
    hasAnswered = true;

    const buttons = document.querySelectorAll('.option-btn');
    const resultStatus = document.getElementById('result-status');
    const explanationCard = document.getElementById('explanation-card');

    // 標示正確與錯誤按鈕的顏色
    if (selectedIndex === correctAnswerIndex) {
        buttons[selectedIndex].classList.add('correct');
        resultStatus.innerText = "🎉 答對了！";
        resultStatus.style.color = "#6B8E23";
    } else {
        buttons[selectedIndex].classList.add('wrong');
        buttons[correctAnswerIndex].classList.add('correct'); // 自動翻開正確答案
        resultStatus.innerText = "❌ 答錯囉！別灰心";
        resultStatus.style.color = "#CD5C5C";
    }

    // 顯示解析卡片
    explanationCard.style.display = 'block';
}
