// 加载达客虚拟助手组件
function loadDuckAssistant() {
    let parenthtml = window.parent.location.pathname;
    console.log(parenthtml);
    if (parenthtml == '/'){
        darkurl = './Pages/darker_assistance.html';
    }else{
        darkurl = 'darker_assistance.html';
    }
    // 创建iframe元素
    const duckIframe = document.createElement('iframe');
    duckIframe.id = 'duckIframe';
    duckIframe.src = darkurl;
    duckIframe.style.position = 'fixed';
    duckIframe.style.bottom = '50px';
    duckIframe.style.right = '50px';
    duckIframe.style.width = '400px';
    duckIframe.style.height = '400px';
    duckIframe.style.border = 'none';
    duckIframe.style.zIndex = '9999';
    duckIframe.style.overflow = 'visible';
    duckIframe.frameBorder = '0';
    duckIframe.scrolling = 'no';
    
    // 将iframe添加到页面
    document.body.appendChild(duckIframe);
    
    // 添加消息监听器来处理高度和宽度更新
    window.addEventListener('message', function(event) {
        // 验证消息来源（可选，增强安全性）
        // if (event.origin !== 'http://你的子页面域名') return;
        
        // 如果是虚拟助手的高度更新消息，则调整iframe高度和宽度
        if (event.data && event.data.type === 'updateDuckSize') {
            const duckIframe = document.getElementById('duckIframe');
            if (duckIframe) {
                // 增加缓冲值（避免内容紧贴边框，可根据实际样式调整）
                duckIframe.style.height = (event.data.height + 150) + 'px';
                duckIframe.style.width = (event.data.width + 80) + 'px';
            }
        }
    });
}

// 当页面加载完成后自动加载虚拟助手
document.addEventListener('DOMContentLoaded', function() {
    loadDuckAssistant();
});

// 导出函数，允许手动调用
window.loadDuckAssistant = loadDuckAssistant;