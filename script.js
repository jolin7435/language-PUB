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

    // 這裡直接強制在解釋與句意之間插入 <br>，確保絕對換行
    const explanationZhHtml = q.explanation_zh 
        ? `<br><br><div style="margin-top: 5px; padding-top: 10px; border-top: 1px dashed #ccc; color: #555;">句意為：${q.explanation_zh}</div>` 
        : '';

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
            ${explanationZhHtml}
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

    document.getElementById('quiz-content').innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h2>測驗完成</h2>
            <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin: 30px 0;">
                <div style="flex-grow: 1; height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden; max-width: 300px;">
                    <div style="width: ${pct}%; height: 100%; background: #6d8c7b; border-radius: 10px;"></div>
                </div>
                <span style="font-size: 24px; font-weight: bold;">${pct}%</span>
            </div>
            <div style="text-align: left; background: #f9f9f9; padding: 15px; border-radius: 8px; line-height: 1.6;">
                ${getExpertDiagnosis(score)}
            </div>
        </div>
    `;

    // 只有在進入此頁面時，才針對按鈕進行文字替換
    const btn = document.querySelector('button[onclick="nextQuestion()"]');
    if (btn) btn.textContent = "重新開始";
}

// 其餘功能維持不變
function getExpertDiagnosis(score) { /* ... 保持原樣 ... */ }

window.submitAnswer = (i) => { userAnswers[currentIdx] = i; renderQuiz(); };
window.prevQuestion = () => { if(currentIdx > 0) { currentIdx--; isFinished = false; renderQuiz(); } };
window.nextQuestion = () => {
    if (isFinished) { location.reload(); return; }
    if (currentIdx < quizData.length - 1) { currentIdx++; renderQuiz(); }
    else { isFinished = true; renderQuiz(); }
};

loadQuestions();
