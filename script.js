document.addEventListener('DOMContentLoaded', () => {
    // 讀取 GitHub 同目錄下的 today.json
    fetch('today.json')
        .then(response => response.json())
        .then(data => {
            // 渲染單字卡
            document.getElementById('word').textContent = data.word;
            document.getElementById('reading').textContent = data.reading ? `[ ${data.reading} ]` : '';
            document.getElementById('meaning').textContent = data.meaning;
            document.getElementById('example').textContent = `例句：${data.example}`;
            
            // 渲染題目
            document.getElementById('question').textContent = data.question;
            
            const container = document.getElementById('options-container');
            data.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = "w-full text-left px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition font-medium text-slate-700";
                button.textContent = option;
                
                // 點擊選項時的邏輯
                button.addEventListener('click', () => {
                    // 凍結所有按鈕
                    const allButtons = container.querySelectorAll('button');
                    allButtons.forEach(btn => btn.disabled = true);
                    
                    if (index === data.answer_index) {
                        button.className = "w-full text-left px-4 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-sm";
                    } else {
                        button.className = "w-full text-left px-4 py-3 bg-rose-500 text-white font-bold rounded-xl shadow-sm";
                        allButtons[data.answer_index].className = "w-full text-left px-4 py-3 bg-emerald-100 text-emerald-800 font-bold rounded-xl";
                    }
                    
                    // 顯示解析
                    document.getElementById('explanation').textContent = data.explanation;
                    document.getElementById('explanation-box').classList.remove('hidden');
                });
                
                container.appendChild(button);
            });
        })
        .catch(err => {
            document.getElementById('word').textContent = "未找到今日資料，請稍後再試！";
            console.error("讀取資料失敗:", err);
        });
});
