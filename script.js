let quizData = [];
let currentIdx = 0;
let userAnswers = [];

// 1. 讀取題目資料
async function loadQuestions() {
    try {
        // 使用時間戳記參數強制向伺服器請求最新檔案，繞過瀏覽器快取
        const response = await fetch('today.json?t=' + new Date().getTime());
        quizData = await response.json();
        userAnswers = new Array(quizData.length).fill(null);
        renderQuiz();
    } catch (e) {
        document.getElementById('quiz-content').innerHTML = "題目載入失敗，請檢查 today.json 是否存在。";
    }
}

// 2. 渲染題目
function renderQuiz() {
    const q = quizData[currentIdx];
    const html = `
        <div class="q-type">類型：${q.type} (${currentIdx + 1}/10)</div>
        <div class="q-text"><h3>${q.question}</h3></div>
        <div class="options">
            ${q.options.map((opt, i) => `<button onclick="submitAnswer(${i})">${opt}</button>`).join('')}
        </div>
    `;
    document.getElementById('quiz-content').innerHTML = html;
}

// 3. 提交答案並結算 (包含您的程度位子邏輯)
function finishQuiz() {
    let score = 0;
    let totalDiff = 0;
    quizData.forEach((q, i) => {
        if(userAnswers[i] === q.answer) {
            score++;
            totalDiff += q.difficulty; // 難度加權
        }
    });

    // 程度計算：(答對題數 + 難度權重) 的綜合指標
    const level = (score / quizData.length) * 100;
    
    document.getElementById('quiz-app').innerHTML = `
        <h2>今日測驗報告</h2>
        <p>正確率：${(score/10)*100}%</p>
        <div style="background:#eee; height:20px; width:100%;"><div style="background:green; width:${level}%; height:100%;"></div></div>
        <p>您的目前程度位子：N4 ${level > 80 ? '前段' : '後段'}</p>
        <button onclick="location.reload()">重新作答</button>
    `;
}

loadQuestions();
