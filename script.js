let quizData = [];
let currentIdx = 0;
let userAnswers = [];
let isFinished = false;

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
    if (isFinished) {
        showResults();
        return;
    }

    const q = quizData[currentIdx];
    const savedAnswer = userAnswers[currentIdx];

    // 強制換行處理：利用 <div style="display:block"> 強制將句意移至新的一行
    const translationBlock = q.explanation_zh 
        ? `<div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ccc; display: block; color: #555;">句意為：${q.explanation_zh}</div>` 
        : '';

    const html = `
        <div style="text-align: center;">
            <div class="q-meta" style="color: #666; margin-bottom: 15px; font-size: 16px;">
                [${q.type}] 第 ${currentIdx + 1} / ${quizData.length} 題
            </div>
            <div class="q-text" style="font-size: 22px; font-weight: bold; margin: 20px 0; color: #333;">
                ${q.word}<br>
                ${q.translation ? `<div style="font-size: 16px; color: #666; margin-top:10px;">${q.translation}</div>` : ''}
            </div>
        </div>
        <div class="options">
            ${q.options.map((opt, i) => `
                <button class="option-btn" onclick="submitAnswer(${i})" ${savedAnswer !== null ? 'disabled' : ''}
                    style="display:block; width:100%; margin-bottom:10px; padding:12px; cursor:pointer;">${opt}</button>
            `).join('')}
        </div>
        <div id="explanation-area" style="margin-top:20px; padding:15px; background:#fff8e1; border-radius:8px; display:${savedAnswer !== null ? 'block' : 'none'};">
            <strong>${savedAnswer !== null ? (savedAnswer === q.answer_index ? "答對了！" : "答錯了QQ") : ""}</strong>
            <div style="margin-top: 8px;">${q.explanation || ''}</div>
            ${translationBlock}
        </div>
        <div style="margin-top: 20px; display: flex; gap: 10px;">
            <button onclick="prevQuestion()" style="flex:1; padding: 12px;">← 上一題</button>
            <button onclick="nextQuestion()" style="flex:1; padding: 12px;">下一題 →</button>
        </div>
    `;
    document.getElementById('quiz-content').innerHTML = html;
    if (savedAnswer !== null) markButtons(savedAnswer, q);
}

function markButtons(selectedIdx, q) {
    document.querySelectorAll('.option-btn').forEach((btn, idx) => {
        btn.disabled = true;
        if(idx === q.answer_index) btn.style.backgroundColor = '#6d8c7b';
        else if(idx === selectedIdx && selectedIdx !== q.answer_index) btn.style.backgroundColor = '#c62828';
    });
}

function showResults() {
    let score = 0;
    userAnswers.forEach((ans, i) => { if (ans === quizData[i].answer_index) score++; });
    const pct = Math.floor((score / quizData.length) * 100);

    // 這裡明確寫出完成頁的 HTML，確保不會消失
    document.getElementById('quiz-content').innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h2>測驗完成</h2>
            <div style="margin: 20px 0; font-size: 20px;">得分：${pct}%</div>
            <button onclick="location.reload()" style="padding: 12px 30px; cursor: pointer;">重新開始</button>
        </div>
    `;
}

window.submitAnswer = (i) => { userAnswers[currentIdx] = i; renderQuiz(); };
window.prevQuestion = () => { if(currentIdx > 0) { currentIdx--; isFinished = false; renderQuiz(); } };
window.nextQuestion = () => {
    if (currentIdx < quizData.length - 1) { 
        currentIdx++; 
        renderQuiz(); 
    } else { 
        isFinished = true; 
        showResults(); // 確保進入最後一頁
    }
};

loadQuestions();
