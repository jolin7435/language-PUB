let quizData = [];
let currentIdx = 0;
let userAnswers = [];

async function loadQuestions() {
    try {
        const response = await fetch('today.json?t=' + new Date().getTime());
        const text = await response.text();
        // 清除任何可能的非法字元
        const cleanText = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
        quizData = JSON.parse(cleanText);
        
        userAnswers = new Array(quizData.length).fill(null);
        renderQuiz();
    } catch (e) {
        console.error("載入失敗:", e);
        document.getElementById('quiz-content').innerHTML = "載入題目失敗，請確認 today.json 格式。";
    }
}

function renderQuiz() {
    if (!quizData || quizData.length === 0) return;
    
    const q = quizData[currentIdx];
    const html = `
        <div class="q-meta">[${q.type}] ${currentIdx + 1} / ${quizData.length}</div>
        <div class="q-text" style="font-size: 24px; margin: 20px 0; text-align: center;">
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
    
    document.getElementById('result-text').textContent = isCorrect ? "答對了！" : "答錯了QQ";
    document.getElementById('exp-detail').innerHTML = quizData[currentIdx].explanation;
    document.getElementById('explanation-area').style.display = 'block';
};

window.prevQuestion = function() { if(currentIdx > 0) { currentIdx--; renderQuiz(); } };
window.nextQuestion = function() { 
    if(currentIdx < quizData.length - 1) { currentIdx++; renderQuiz(); } 
};

loadQuestions();
