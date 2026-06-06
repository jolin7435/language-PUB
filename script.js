let quizData = [];
let currentIdx = 0;
let userAnswers = [];

async function loadQuestions() {
    try {
        const response = await fetch('today.json?t=' + new Date().getTime());
        const raw = await response.json();
        
        // 自動提取 quiz 陣列
        quizData = raw.quiz || [];
        
        if (quizData.length === 0) throw new Error("找不到題目");
        
        userAnswers = new Array(quizData.length).fill(null);
        renderQuiz();
    } catch (e) {
        document.getElementById('quiz-content').innerHTML = "載入失敗：" + e.message;
    }
}

function renderQuiz() {
    const q = quizData[currentIdx];
    
    const html = `
        <div class="q-meta" style="color: #666; margin-bottom: 10px;">[${q.type}] 第 ${currentIdx + 1} / ${quizData.length} 題</div>
        <div class="q-text" style="text-align: ${q.alignment}; font-size: 24px; font-weight: bold; margin: 20px 0; color: #333;">
            ${q.word}
        </div>
        <div class="options">
            ${q.options.map((opt, i) => `
                <button class="option-btn" onclick="submitAnswer(${i})" id="btn-${i}" style="display:block; width:100%; margin-bottom:10px; padding:10px;">${opt}</button>
            `).join('')}
        </div>
        <div id="explanation-area" style="margin-top:20px; padding:15px; background:#fff8e1; border-radius:8px; display:none;">
            <strong id="result-text" style="font-size: 18px;"></strong><br>
            <div id="exp-detail" style="margin-top: 8px;"></div>
        </div>
    `;
    document.getElementById('quiz-content').innerHTML = html;
}

window.submitAnswer = function(i) {
    if (userAnswers[currentIdx] !== null) return;
    userAnswers[currentIdx] = i;
    
    const q = quizData[currentIdx];
    const isCorrect = (i === q.answer_index);
    
    document.getElementById('result-text').textContent = isCorrect ? "答對了！" : "答錯了QQ";
    document.getElementById('exp-detail').innerHTML = q.explanation;
    document.getElementById('explanation-area').style.display = 'block';
    
    // 鎖定按鈕顏色
    document.querySelectorAll('.option-btn').forEach((btn, idx) => {
        btn.disabled = true;
        if(idx === q.answer_index) btn.style.backgroundColor = '#6d8c7b';
        else if(idx === i && !isCorrect) btn.style.backgroundColor = '#c62828';
    });
};

loadQuestions();
// 確保下一題和上一題的功能被定義並掛載到 window
window.nextQuestion = function() {
    if (currentIdx < quizData.length - 1) {
        currentIdx++;
        renderQuiz();
    } else {
        alert("這已經是最後一題了！");
    }
};

window.prevQuestion = function() {
    if (currentIdx > 0) {
        currentIdx--;
        renderQuiz();
    } else {
        alert("這是第一題。");
    }
};
