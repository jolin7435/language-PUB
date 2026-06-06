let quizData = [];
let currentIdx = 0;
let userAnswers = [];

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
    const q = quizData[currentIdx];
    
    // 調整佈局：將 Meta 移至標題下方並置中
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
                <button class="option-btn" onclick="submitAnswer(${i})" id="btn-${i}" style="display:block; width:100%; margin-bottom:10px; padding:12px; cursor:pointer;">${opt}</button>
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
    
    document.querySelectorAll('.option-btn').forEach((btn, idx) => {
        btn.disabled = true;
        if(idx === q.answer_index) btn.style.backgroundColor = '#6d8c7b';
        else if(idx === i && !isCorrect) btn.style.backgroundColor = '#c62828';
        if (idx !== q.answer_index && idx !== i) btn.style.opacity = '0.7';
    });
};

window.prevQuestion = function() {
    if(currentIdx > 0) {
        currentIdx--;
        renderQuiz();
    }
};

window.nextQuestion = function() {
    if(currentIdx < quizData.length - 1) {
        currentIdx++;
        renderQuiz();
    } else {
        showResults();
    }
};

function showResults() {
    let score = 0;
    userAnswers.forEach((ans, i) => {
        if (ans === quizData[i].answer_index) score++;
    });
    const accuracy = ((score / quizData.length) * 100).toFixed(0);
    
    document.getElementById('quiz-content').innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
            <h2 style="font-size: 28px;">測驗完成！</h2>
            <p style="font-size: 20px;">您的最終正確率：${accuracy}% (${score} / ${quizData.length})</p>
            <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 30px; font-size: 18px; cursor: pointer; background-color: #5d4037; color: white; border: none; border-radius: 5px;">重新開始</button>
        </div>
    `;
}

loadQuestions();
