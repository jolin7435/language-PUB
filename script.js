let quizData = [];
let currentIdx = 0;
let userAnswers = [];

async function loadQuestions() {
    try {
        const response = await fetch('today.json?t=' + new Date().getTime());
        let text = await response.text();
        
        // 核心修正：自動移除 Markdown 的標記
        text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
        
        quizData = JSON.parse(text); 
        userAnswers = new Array(quizData.length).fill(null);
        renderQuiz();
    } catch (e) {
        console.error("解析失敗，請確認檔案格式是否為乾淨的 JSON:", e);
        document.getElementById('quiz-content').innerHTML = "資料讀取失敗，請確認 today.json 是否為純 JSON 格式。";
    }
}

function renderQuiz() {
    const q = quizData[currentIdx];
    const isSentence = q.question.length > 15; // 簡單判定：字數超過15字視為句子

    const html = `
        <div class="q-meta">[${q.type}] ${currentIdx + 1} / ${quizData.length}</div>
        <div class="q-text" style="text-align: ${isSentence ? 'left' : 'center'}; font-size: 24px; margin: 20px 0;">
            ${q.question}
        </div>
        <div class="options">
            ${q.options.map((opt, i) => `
                <button class="option-btn" onclick="submitAnswer(${i})" id="btn-${i}">${opt}</button>
            `).join('')}
        </div>
        <div id="explanation-area" style="margin-top:20px; padding:15px; background:#fff8e1; border-radius:8px; display:none;">
            <strong id="result-text"></strong><br>
            <div id="exp-detail"></div>
        </div>
    `;
    document.getElementById('quiz-content').innerHTML = html;
}

window.submitAnswer = function(i) {
    if (userAnswers[currentIdx] !== null) return; // 防止重複作答
    userAnswers[currentIdx] = i;
    
    const isCorrect = (i === quizData[currentIdx].answer);
    const buttons = document.querySelectorAll('.option-btn');
    
    // 顏色處理
    buttons[i].style.backgroundColor = isCorrect ? '#6d8c7b' : '#c62828'; // 綠色或紅色
    
    // 解析欄位顯示
    const expArea = document.getElementById('explanation-area');
    document.getElementById('result-text').textContent = isCorrect ? "答對了！" : "答錯了QQ";
    document.getElementById('exp-detail').innerHTML = quizData[currentIdx].explanation;
    expArea.style.display = 'block';
};

// ... (prevQuestion 與 nextQuestion 邏輯不變)
// 修正後的 finishQuiz 邏輯
function finishQuiz() {
    let score = 0;
    let totalScore = 0; // 滿分計算
    quizData.forEach((q, i) => {
        totalScore += q.difficulty || 1;
        if(userAnswers[i] === q.answer) score += q.difficulty || 1;
    });

    const progress = (score / totalScore) * 100; // 修正邏輯：正確權重 / 總權重

    document.getElementById('quiz-content').innerHTML = `
        <h2>測驗完成！</h2>
        <p>今日正確率：${((userAnswers.filter((a,i)=>a===quizData[i].answer).length/quizData.length)*100).toFixed(0)}%</p>
        <div class="progress-bg"><div class="progress-fill" style="width:${progress}%"></div></div>
        <p>您的實力位子：</p>
        <button class="nav-btn btn-prev" onclick="location.reload()">重新開始</button>
    `;
    document.getElementById('nav-btns').style.display = 'none';
}
