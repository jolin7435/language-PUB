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

    // 處理漢字讀音 (若有 furigana 欄位則顯示)
    const furigana = q.furigana ? `<div style="font-size: 14px; color: #888; margin-bottom: 5px;">(${q.furigana})</div>` : '';

    // 強制換行：在解釋內容後方插入 block-level 的 div 確保換行
    const explanationZhHtml = q.explanation_zh 
        ? `<div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ccc; color: #555; display: block; width: 100%;">句意為：${q.explanation_zh}</div>` 
        : '';

    const html = `
        <div style="text-align: center;">
            <div class="q-meta" style="color: #666; margin-bottom: 15px; font-size: 16px;">
                [${q.type}] 第 ${currentIdx + 1} / ${quizData.length} 題
            </div>
            <div class="q-text" style="text-align: center; font-size: 22px; font-weight: bold; margin: 20px 0; color: #333;">
                ${furigana}
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
            ${explanationZhHtml}
        </div>
    `;
    
    document.getElementById('quiz-content').innerHTML = html;
    if (savedAnswer !== null) markButtons(savedAnswer, q);
    
    // 更新底部導航按鈕文字
    updateNavButtons();
}

function updateNavButtons() {
    const nextBtn = document.getElementById('next-btn');
    if (!nextBtn) return;
    
    // 只有在最後一題且已作答完成時，才改為「重新開始」
    if (currentIdx === quizData.length - 1 && userAnswers[currentIdx] !== null) {
        nextBtn.textContent = "重新開始";
    } else {
        nextBtn.textContent = "下一題";
    }
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
            <div style="text-align: left; background: #f9f9f9; padding: 15px; border-radius: 8px; line-height: 1.6;">
                得分：${pct}%
            </div>
        </div>
    `;
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.textContent = "重新開始";
}

window.submitAnswer = (i) => { userAnswers[currentIdx] = i; renderQuiz(); };
window.prevQuestion = () => { 
    if(currentIdx > 0) { currentIdx--; isFinished = false; renderQuiz(); } 
};
window.nextQuestion = () => {
    if (currentIdx === quizData.length - 1) { location.reload(); return; }
    currentIdx++; 
    renderQuiz();
};

loadQuestions();
