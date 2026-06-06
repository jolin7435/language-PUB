console.log("=== 程式開始載入 ===");

async function testInit() {
    try {
        console.log("嘗試 fetch today.json...");
        const response = await fetch('today.json?t=' + new Date().getTime());
        console.log("Fetch 狀態:", response.status);
        
        const text = await response.text();
        console.log("抓取到的內容長度:", text.length);
        console.log("內容預覽:", text.substring(0, 50));
        
        const data = JSON.parse(text);
        console.log("JSON 解析成功，題目共有:", data.length, "題");
        
        document.getElementById('quiz-content').innerHTML = "<h1>恭喜！程式運作正常，讀到了 " + data.length + " 題</h1>";
    } catch (err) {
        console.error("!!! 發現錯誤 !!!", err);
        document.getElementById('quiz-content').innerHTML = "<h1>錯誤：請看 Console</h1><p>" + err.message + "</p>";
    }
}

testInit();
