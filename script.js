let quizData = [];
let currentIdx = 0;
let userAnswers = []; // 儲存使用者紀錄，null 代表未作答
let isFinished = false; // 新增狀態：是否已結束測驗

async function loadQuestions() {
    try {
        const response = await fetch('today.json?t=' + new Date().getTime());
        const raw = await response.json();
        quizData = raw.quiz || [];
        if (quizData.length === 0) throw new Error("找不到題目");
        
        userAnswers = new Array(quizData.length).fill(null);
        renderQuiz();
    } catch (e) {
        document.getElementById('quiz-content').innerHTML = "載入失敗：" + e.message;
    }
}

function renderQuiz() {
    if (isFinished) return showResults();

    const q = quizData[currentIdx];
    const savedAnswer = userAnswers[currentIdx];
    
    // 計算進度百分比 (0 到 100)
    const progress = (currentIdx / quizData.length) * 100;

    const html = `
        <div style="text-align: center;">
            <div style="margin-bottom: 10px; font-weight: bold;">0 <progress value="${progress}" max="100" style="width: 60%;"></progress> N4</div>
            <div class="q-meta" style="color: #666; margin-bottom: 15px; font-size: 16px;">
                [${q.type}] 第 ${currentIdx + 1} / ${quizData.length} 題
            </div>
            <div class="q-text" style="text-align: ${q.alignment || 'center'}; font-size: 24px; font-weight: bold; margin: 20px 0; color: #333;">
                ${q.word}
            </div>
        </div>
        <div class="options">
            ${q.options.map((opt, i) => `
                <button class="option-btn" onclick="submitAnswer(${i})" id="btn-${i}" 
                    style="display:block; width:100%; margin-bottom:10px; padding:12px; cursor:pointer;"
                    ${savedAnswer !== null ? 'disabled' : ''}>${opt}</button>
            `).join('')}
        </div>
        <div id="explanation-area" style="margin-top:20px; padding:15px; background:#fff8e1; border-radius:8px; display:${savedAnswer !== null ? 'block' : 'none'};">
            <strong id="result-text" style="font-size: 18px;">${savedAnswer !== null ? (savedAnswer === q.answer_index ? "答對了！" : "答錯了QQ") : ""}</strong><br>
            <div id="exp-detail" style="margin-top: 8px;">${savedAnswer !== null ? q.explanation : ""}</div>
        </div>
    `;
    document.getElementById('quiz-content').innerHTML = html;
    
    // 若已作答，自動標記正確/錯誤顏色
    if (savedAnswer !== null) {
        markButtons(savedAnswer, q);
    }
}

function markButtons(selectedIdx, q) {
    document.querySelectorAll('.option-btn').forEach((btn, idx) => {
        btn.disabled = true;
        if(idx === q.answer_index) btn.style.backgroundColor = '#6d8c7b';
        else if(idx === selectedIdx && selectedIdx !== q.answer_index) btn.style.backgroundColor = '#c62828';
        if (idx !== q.answer_index && idx !== selectedIdx) btn.style.opacity = '0.7';
    });
}

window.submitAnswer = function(i) {
    userAnswers[currentIdx] = i;
    renderQuiz();
};

window.prevQuestion = function() {
    if(currentIdx > 0) {
        currentIdx--;
        isFinished = false; // 回到題目頁
        renderQuiz();
    }
};

window.nextQuestion = function() {
    if(currentIdx < quizData.length - 1) {
        currentIdx++;
        renderQuiz();
    } else {
        isFinished = true;
        showResults();
    }
};

function showResults() {
    let score = 0;
    userAnswers.forEach((ans, i) => { if (ans === quizData[i].answer_index) score++; });
    const accuracy = ((score / quizData.length) * 100).toFixed(0);
    
    document.getElementById('quiz-content').innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
            <h2 style="font-size: 28px;">測驗完成！</h2>
            <p style="font-size: 20px;">您的最終正確率：${accuracy}% (${score} / ${quizData.length})</p>
            <button onclick="prevQuestion()" style="margin: 10px; padding: 10px 20px; cursor: pointer;">上一題</button>
            <button onclick="location.reload()" style="margin: 10px; padding: 10px 20px; cursor: pointer;">重新開始</button>
        </div>
    `;
}

loadQuestions();
