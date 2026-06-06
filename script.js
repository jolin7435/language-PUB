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
    
    if (savedAnswer !== null) markButtons(savedAnswer, q);
}

function markButtons(selectedIdx, q) {
    document.querySelectorAll('.option-btn').forEach((btn, idx) => {
        btn.disabled = true;
        if(idx === q.answer_index) btn.style.backgroundColor = '#6d8c7b';
        else if(idx === selectedIdx && selectedIdx !== q.answer_index) btn.style.backgroundColor = '#c62828';
        if (idx !== q.answer_index && idx !== selectedIdx) btn.style.opacity = '0.7';
    });
}

function getProgressInfo(score) {
    let pct = 0, label = "尚未具備 N4 水準";
    if (score === 10) { pct = 100; label = "具備 N4 以上實力"; }
    else if (score === 9) { pct = 90; label = "穩定達到 N4 水準"; }
    else if (score === 8) { pct = 75; label = "達到 N4 合格邊緣"; }
    else if (score >= 6) { pct = 50; label = "約 N5-N4 實力"; }
    else { pct = 30; label = "尚未具備 N4 水準"; }
    
    const barBlocks = Math.floor(pct / 10);
    const bar = "█".repeat(barBlocks) + "░".repeat(10 - barBlocks);
    return { bar, pct, label };
}

window.submitAnswer = function(i) {
    userAnswers[currentIdx] = i;
    renderQuiz();
};

window.prevQuestion = function() {
    if(currentIdx > 0) {
        currentIdx--;
        isFinished = false;
        renderQuiz();
    }
};

window.nextQuestion = function() {
    if(currentIdx < quizData.length - 1) {
        currentIdx++;
        renderQuiz();
    } else {
        isFinished = true;
        renderQuiz();
    }
};

function showResults() {
    let score = 0, wrongTypes = [];
    userAnswers.forEach((ans, i) => {
        if (ans === quizData[i].answer_index) score++;
        else wrongTypes.push(quizData[i].type);
    });
    
    const info = getProgressInfo(score);
    const diagnosis = wrongTypes.length === 0 ? "表現優異，無明顯弱點！" : `需加強領域：${[...new Set(wrongTypes)].join('、')}。建議回顧相關文法與單字。`;

    document.getElementById('quiz-content').innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h2>測驗完成！</h2>
            <div style="font-size: 20px; margin: 15px 0;">
                <div>${info.bar} ${info.pct}%</div>
                <div style="font-size: 14px; color: #555;">實力落點：${info.label}</div>
            </div>
            <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; text-align: left;">
                <p><strong>強弱項診斷：</strong><br>${diagnosis}</p>
            </div>
        </div>
    `;
    // 更新按鈕文字：將「下一題」改為「重新開始」
    document.querySelector('button[onclick="nextQuestion()"]').textContent = "重新開始";
    document.querySelector('button[onclick="nextQuestion()"]').onclick = () => location.reload();
}

loadQuestions();
