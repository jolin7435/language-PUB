let quizData = [];
let currentIdx = 0;
let userAnswers = [];

// 1. 載入題目
async function loadQuestions() {
    try {
        const response = await fetch('today.json?t=' + new Date().getTime());
        quizData = await response.json();
        userAnswers = new Array(quizData.length).fill(null);
        renderQuiz();
    } catch (e) {
        document.getElementById('quiz-content').innerHTML = "題目載入失敗，請檢查 today.json 格式";
    }
}

// 2. 渲染畫面
function renderQuiz() {
    const q = quizData[currentIdx];
    const html = `
        <div class="q-meta">[${q.type}] ${currentIdx + 1} / ${quizData.length}</div>
        <div class="q-text" style="font-size: 24px; margin: 20px 0;">${q.question}</div>
        <div class="options">
            ${q.options.map((opt, i) => `
                <button class="option-btn" onclick="submitAnswer(${i})" id="btn-${i}">${opt}</button>
            `).join('')}
        </div>
        <div id="explanation-area" style="margin-top:20px; padding:15px; background:#fff8e1; border-radius:8px; display:none;">
            <strong>解析：</strong><br>${q.explanation || '無解析'}
        </div>
    `;
    document.getElementById('quiz-content').innerHTML = html;
    
    // 如果已經回答過，標示顏色
    if(userAnswers[currentIdx] !== null) {
        highlightAnswer(userAnswers[currentIdx]);
    }
}

// 3. 提交答案邏輯
window.submitAnswer = function(i) {
    userAnswers[currentIdx] = i;
    highlightAnswer(i);
    document.getElementById('explanation-area').style.display = 'block';
};

function highlightAnswer(i) {
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(b => b.style.backgroundColor = '#d2b48c'); // 原本的土色
    buttons[i].style.backgroundColor = '#6d8c7b'; // 選中後的橄欖綠
    buttons[i].style.color = 'white';
}

// 4. 導覽邏輯
window.prevQuestion = function() {
    if(currentIdx > 0) { currentIdx--; renderQuiz(); }
};

window.nextQuestion = function() {
    if(currentIdx < quizData.length - 1) {
        currentIdx++; renderQuiz();
    } else {
        finishQuiz();
    }
};

// 5. 結算邏輯
function finishQuiz() {
    let score = 0;
    let totalDiff = 0;
    quizData.forEach((q, i) => {
        if(userAnswers[i] === q.answer) {
            score++;
            totalDiff += q.difficulty || 1;
        }
    });

    const accuracy = (score / quizData.length) * 100;
    const progress = (totalDiff / (quizData.length * 3)) * 100; // 假設難度最高為3

    document.getElementById('quiz-content').innerHTML = `
        <h2>測驗完成！</h2>
        <p>正確率：${accuracy}%</p>
        <div style="background:#ddd; width:100%; height:20px; border-radius:10px;">
            <div style="background:#6d8c7b; width:${progress}%; height:100%; border-radius:10px;"></div>
        </div>
        <p>N4 程度位子：${progress > 70 ? '前段 (Advanced)' : '後段 (Basic)'}</p>
        <button onclick="location.reload()">重新開始</button>
    `;
    document.getElementById('nav-btns').style.display = 'none';
}

loadQuestions();
