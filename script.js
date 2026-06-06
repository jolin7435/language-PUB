let quizData = [];
let currentIdx = 0;
let userAnswers = [];

async function loadQuestions() {
    try {
        const response = await fetch('today.json?t=' + new Date().getTime());
        const text = await response.text();
        const rawData = JSON.parse(text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, ''));
        
        // --- 偵錯區塊 ---
        console.log("資料內容:", rawData); 
        console.log("資料類型:", typeof rawData);
        // ----------------
        
        // 嘗試自動找陣列
        if (Array.isArray(rawData)) {
            quizData = rawData;
        } else {
            // 如果還是找不到，請看 Console 的 [資料內容] 是什麼
            quizData = []; 
        }
        
        renderQuiz();
    } catch (e) {
        document.getElementById('quiz-content').innerHTML = "解析錯誤: " + e.message;
    }
}}

function renderQuiz() {
    if (quizData.length === 0) {
        document.getElementById('quiz-content').innerHTML = "目前沒有題目資料。";
        return;
    }
    
    const q = quizData[currentIdx];
    const isSentence = q.question.length > 10 || q.type !== "單字";

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
    if (userAnswers[currentIdx] !== null) return;
    userAnswers[currentIdx] = i;
    const isCorrect = (i === quizData[currentIdx].answer);
    
    const buttons = document.querySelectorAll('.option-btn');
    buttons[i].style.backgroundColor = isCorrect ? '#6d8c7b' : '#c62828';
    buttons[i].style.color = 'white';
    
    document.getElementById('result-text').textContent = isCorrect ? "答對了！" : "答錯了QQ";
    document.getElementById('exp-detail').innerHTML = quizData[currentIdx].explanation;
    document.getElementById('explanation-area').style.display = 'block';
};

window.prevQuestion = function() { if(currentIdx > 0) { currentIdx--; renderQuiz(); } };
window.nextQuestion = function() {
    if(currentIdx < quizData.length - 1) { currentIdx++; renderQuiz(); }
    else { finishQuiz(); }
};

function finishQuiz() {
    let score = 0;
    quizData.forEach((q, i) => { if(userAnswers[i] === q.answer) score++; });
    const accuracy = ((score / quizData.length) * 100).toFixed(0);
    document.getElementById('quiz-content').innerHTML = `
        <h2>測驗完成！</h2>
        <p>今日正確率：${accuracy}%</p>
        <button class="nav-btn btn-prev" onclick="location.reload()">重新開始</button>
    `;
    document.getElementById('nav-btns').style.display = 'none';
}

loadQuestions();
