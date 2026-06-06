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
    if (isFinished) return showResults();

    const q = quizData[currentIdx];
    const savedAnswer = userAnswers[currentIdx];

    const html = `
        <div style="text-align: center;">
            <div class="q-meta" style="color: #666; margin-bottom: 15px; font-size: 16px;">
                [${q.type}] 第 ${currentIdx + 1} / ${quizData.length} 題
            </div>
            <div class="q-text" style="text-align: ${q.alignment || 'center'}; font-size: 22px; font-weight: bold; margin: 20px 0; color: #333;">
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
            <strong>${savedAnswer !== null ? (savedAnswer === q.answer_index ? "答對了！" : "答錯了QQ") : ""}</strong><br>
            <div style="margin-top: 8px;">${q.explanation || ''}</div>
            ${q.explanation_zh ? `<div style="margin-top: 5px; color: #555;">(翻譯：${q.explanation_zh})</div>` : ''}
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
    let score = 0, summary = { "單字": 0, "文法": 0, "克漏字": 0 }, total = { "單字": 0, "文法": 0, "克漏字": 0 };
    userAnswers.forEach((ans, i) => {
        let type = quizData[i].type.includes("單字") ? "單字" : quizData[i].type;
        total[type]++;
        if (ans === quizData[i].answer_index) score++;
        else summary[type]++;
    });

    const pct = Math.floor((score / quizData.length) * 100);
    const bar = "█".repeat(Math.floor(pct / 10)) + "░".repeat(10 - Math.floor(pct / 10));
    
    let diagnosis = "診斷分析：";
    for(let t in summary) {
        if(summary[t] > 0) diagnosis += `<br>• ${t}：尚有進步空間，建議多複習該領域基礎架構。`;
        else if(total[t] > 0) diagnosis += `<br>• ${t}：掌握良好！`;
    }

    document.getElementById('quiz-content').innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h2>今日得分：${score} / ${quizData.length}</h2>
            <div style="margin: 20px 0; font-family: monospace; font-size: 20px;">${bar} ${pct}%</div>
            <div style="text-align: left; background: #f9f9f9; padding: 15px; border-radius: 8px;">
                <strong>${diagnosis}</strong>
            </div>
        </div>
    `;
}

window.submitAnswer = (i) => { userAnswers[currentIdx] = i; renderQuiz(); };
window.prevQuestion = () => { if(currentIdx > 0) { currentIdx--; isFinished = false; renderQuiz(); } };
window.nextQuestion = () => {
    if (isFinished) { location.reload(); return; }
    if (currentIdx < quizData.length - 1) { currentIdx++; renderQuiz(); }
    else { isFinished = true; renderQuiz(); }
};

loadQuestions();
