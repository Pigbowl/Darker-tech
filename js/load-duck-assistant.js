function loadDuckAssistant() {

    let parenthtml = window.parent.location.pathname;

    if (deploy_mode != 'full'){
        mainpageaddress = ['/index.html','/index.html#contact','/index.html#about']
    }else{
        mainpageaddress = ['/','/index.html#contact','/index.html#about']
        darkurl = './Pages/darker_assistance.html';
    }

    if (parenthtml == mainpageaddress[0] || parenthtml == mainpageaddress[1] || parenthtml == mainpageaddress[2]){
        darkurl = './Pages/darker_assistance.html';
    }else{
        darkurl = 'darker_assistance.html';
    }
    
    // 创建启动样式
    const startStyle = document.createElement('style');
    startStyle.innerHTML = `
        /* 启动模式样式 */
        #duckIframe.start-mode {
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) scale(8) !important;
            bottom: auto !important;
            right: auto !important;
        }
        
        /* 恢复正常样式 */
        #duckIframe.normal-mode {
            left: auto !important;
            top: auto !important;
            transform: none !important;
        }
    `;
    document.head.appendChild(startStyle);
    
    // 记录标准位置
    const standardPosition = {
        bottom: '150px',
        right: '150px'
    };
    
    // debug参数：true - 每次加载都进入初始模式；false - 保持当前逻辑
    const debug = true;
    
    // 检查sessionStorage，判断是否是第一次访问
    // 使用let声明，以便后续可以修改
    let hasSeenInitialMode = sessionStorage.getItem('hasSeenDuckInitialMode') === 'true';
    
    // // 如果debug为true，强制进入初始模式
    // if (debug) {
    //     hasSeenInitialMode = false;
    // }
    // const hasSeenInitialMode = "false";
    // 创建iframe元素
    const duckIframe = document.createElement('iframe');
    duckIframe.id = 'duckIframe';
    duckIframe.src = darkurl;
    duckIframe.style.position = 'fixed';
    duckIframe.style.border = 'none';
    duckIframe.style.zIndex = '9999';
    duckIframe.style.overflow = 'visible';
    duckIframe.frameBorder = '0';
    duckIframe.scrolling = 'no';
    // hasSeenInitialMode = false;  
    // 根据是否是第一次访问，设置不同的样式
    if (hasSeenInitialMode) {
        // 非第一次访问，直接进入正常模式
        duckIframe.style.background = 'rgba(128, 128, 128, 0)'; // 完全透明
        duckIframe.style.left = 'auto';
        duckIframe.style.top = 'auto';
        duckIframe.style.transform = 'none';
        duckIframe.style.bottom = standardPosition.bottom;
        duckIframe.style.right = standardPosition.right;
        // 移除固定大小设置，让iframe根据内容动态调整
        // duckIframe.style.width = '300px';
        // duckIframe.style.height = '300px';
    } else {
        // 第一次访问，显示初始模式
        duckIframe.style.background = 'rgba(10, 9, 9, 0.9)'; // 半透明背景
        // 初始设置为启动模式，居中显示
        duckIframe.style.left = '50%';
        duckIframe.style.top = '50%';
        duckIframe.style.transform = 'translate(-50%, -50%) scale(1)';
        duckIframe.style.bottom = 'auto';
        duckIframe.style.right = 'auto';
        // 全屏显示
        duckIframe.style.width = window.innerWidth + 'px';
        duckIframe.style.height = window.innerHeight + 'px';
        
        // 添加返回按钮
        const returnButton = document.createElement('button');
        returnButton.id = 'returnDuckButton';
        returnButton.textContent = '回去吧达客鸭';
        returnButton.style.cssText = `
            position: fixed;
            left: 50%;
            top: 85%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: rgba(30, 30, 30, 0.95);
            color: white;
            border: 2px solid #007bff;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            z-index: 10000;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        
        // 按钮悬停效果
        returnButton.addEventListener('mouseenter', function() {
            this.style.background = '#007bff';
            this.style.transform = 'translateX(-50%) scale(1.05)';
        });
        
        returnButton.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(30, 30, 30, 0.95)';
            this.style.transform = 'translateX(-50%)';
        });
        
        // 按钮点击事件，恢复正常模式
        returnButton.addEventListener('click', function() {
            // 移除按钮
            this.remove();
            
            // 发送消息给iframe，直接切换到正常模式
            duckIframe.contentWindow.postMessage({
                type: 'startNormalModeTransition'
            }, '*');
            
            // 直接切换iframe到正常模式样式
            duckIframe.style.background = 'rgba(128, 128, 128, 0)'; // 完全透明
            duckIframe.style.left = 'auto';
            duckIframe.style.top = 'auto';
            duckIframe.style.transform = 'none';
            duckIframe.style.bottom = standardPosition.bottom;
            duckIframe.style.right = standardPosition.right;
            // 移除固定大小设置，让iframe根据内容动态调整
            // duckIframe.style.width = '300px';
            // duckIframe.style.height = '300px';
            
            // 设置sessionStorage标记，表示用户已经看过初始模式
            sessionStorage.setItem('hasSeenDuckInitialMode', 'true');
        });
        
        // 添加按钮到页面
        document.body.appendChild(returnButton);
    }
    
    // 添加设备类型判断函数
    function isMobileDevice() {
        // 使用与Tailwind CSS md断点一致的768px作为区分标准
        return window.innerWidth < 768;
    }
    
    // 将iframe添加到页面
    document.body.appendChild(duckIframe);
    
    // iframe加载完成后，发送设备类型信息
    duckIframe.onload = function() {
        const deviceType = isMobileDevice() ? 'mobile' : 'pc';
        duckIframe.contentWindow.postMessage({
            type: 'setDeviceType',
            deviceType: deviceType,
            screenWidth: window.innerWidth
        }, '*');
    };
    
    // 添加消息监听器来处理高度和宽度更新以及位置移动
    window.addEventListener('message', function(event) {
        // 验证消息来源（可选，增强安全性）
        // if (event.origin !== 'http://你的子页面域名') return;
        
        const duckIframe = document.getElementById('duckIframe');
        if (!duckIframe) {
            return;
        }
        
        // 如果是虚拟助手的高度更新消息，则调整iframe高度和宽度
        if (event.data && event.data.type === 'updateDuckSize') {
            // 增加合理的缓冲值（避免内容紧贴边框，根据实际样式调整）
            duckIframe.style.height = event.data.height + 'px';
            duckIframe.style.width = event.data.width + 'px';
        }
        // 如果是虚拟助手的位置移动消息，则调整iframe位置
        else if (event.data && event.data.type === 'moveDuckIframe') {
            // 计算新的bottom和right值，保持右下角坐标固定
            // 获取视口尺寸
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // 获取iframe当前尺寸
            const iframeWidth = duckIframe.offsetWidth;
            const iframeHeight = duckIframe.offsetHeight;
            
            // 计算新的bottom和right值
            // 注意：新位置是基于鼠标拖拽的新左上角位置，我们需要将其转换为bottom和right
            const newBottom = viewportHeight - (event.data.y + iframeHeight);
            const newRight = viewportWidth - (event.data.x + iframeWidth);
            
            // 使用bottom和right定位，保持右下角坐标固定
            duckIframe.style.bottom = newBottom + 'px';
            duckIframe.style.right = newRight + 'px';
            // 移除left和top属性，避免冲突
            duckIframe.style.left = 'auto';
            duckIframe.style.top = 'auto';
        }
        // 如果是显示成功提示的消息，则显示成功提示弹窗
        else if (event.data && event.data.type === 'showSuccessMessage') {
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                // 直接设置display为block，确保显示
                successMessage.style.display = 'block';
                // 确保visibility为visible
                successMessage.style.visibility = 'visible';
                // 确保opacity为1
                successMessage.style.opacity = '1';
                // 确保z-index足够高
                successMessage.style.zIndex = '10000';
                
                // 更新成功消息内容
                successMessage.innerHTML = `
                    <div>
                        <i class="fa fa-check-circle" style="color:#007bff;font-size:48px;margin-bottom:16px;"></i>
                        <h3 style="font-size:20px;font-weight:bold;color:white;margin-bottom:8px;">提交成功</h3>
                        <p style="color:#999;margin-bottom:20px;">感谢您的留言，我们会尽快回复您！</p>
                        <button id="closeMessage" style="
                            background:#007bff;
                            color:white;
                            border:none;
                            border-radius:4px;
                            padding:8px 16px;
                            cursor:pointer;
                            font-weight:medium;
                            transition:background-color 0.3s ease;
                        ">关闭</button>
                    </div>
                `;
                
                // 重新绑定关闭按钮事件
                const closeMessageBtn = successMessage.querySelector('#closeMessage');
                closeMessageBtn.addEventListener('click', () => {
                    successMessage.style.display = 'none';
                });
            }
        }
        // 如果是显示失败提示的消息，则显示失败提示弹窗
        else if (event.data && event.data.type === 'showErrorMessage') {
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                // 直接设置display为block，确保显示
                successMessage.style.display = 'block';
                // 确保visibility为visible
                successMessage.style.visibility = 'visible';
                // 确保opacity为1
                successMessage.style.opacity = '1';
                // 确保z-index足够高
                successMessage.style.zIndex = '10000';
                
                // 获取失败消息内容
                const errorMessage = event.data.message || '提交失败，请稍后重试';
                
                // 更新为失败消息内容
                successMessage.innerHTML = `
                    <div>
                        <i class="fa fa-times-circle" style="color:#ff6b6b;font-size:48px;margin-bottom:16px;"></i>
                        <h3 style="font-size:20px;font-weight:bold;color:white;margin-bottom:8px;">提交失败</h3>
                        <p style="color:#ff6b6b;margin-bottom:20px;">${errorMessage}</p>
                        <button id="closeMessage" style="
                            background:#ff6b6b;
                            color:white;
                            border:none;
                            border-radius:4px;
                            padding:8px 16px;
                            cursor:pointer;
                            font-weight:medium;
                            transition:background-color 0.3s ease;
                        ">关闭</button>
                    </div>
                `;
                
                // 重新绑定关闭按钮事件
                const closeMessageBtn = successMessage.querySelector('#closeMessage');
                closeMessageBtn.addEventListener('click', () => {
                    successMessage.style.display = 'none';
                });
            }
        }
    });
}

// 页面加载完成后，添加关闭按钮事件监听器并加载虚拟助手
document.addEventListener('DOMContentLoaded', function() {
    // 首先移除可能存在的旧successMessage元素（避免冲突）
    const oldSuccessMessage = document.getElementById('successMessage');
    if (oldSuccessMessage) {
        oldSuccessMessage.remove();
    }
    
    // 直接创建新的successMessage元素，确保它在所有页面都能正常工作
    const newSuccessMessage = document.createElement('div');
    newSuccessMessage.id = 'successMessage';
    newSuccessMessage.style.cssText = `
        display:none;
        position:fixed;
        top:25%;
        left:50%;
        transform:translate(-50%, -50%);
        background:rgba(30, 30, 30, 0.95);
        padding:24px;
        border-radius:15px;
        box-shadow:0 2px 10px rgba(0,0,0,0.3);
        z-index:10000;
        text-align:center;
        color:white;
        font-family:Arial, sans-serif;
        border:2px solid #007bff;
    `;
    
    newSuccessMessage.innerHTML = `
        <div>
            <i class="fa fa-check-circle" style="color:#007bff;font-size:48px;margin-bottom:16px;"></i>
            <h3 style="font-size:20px;font-weight:bold;color:white;margin-bottom:8px;">提交成功</h3>
            <p style="color:#999;margin-bottom:20px;">感谢您的留言，我们会尽快回复您！</p>
            <button id="closeMessage" style="
                background:#007bff;
                color:white;
                border:none;
                border-radius:4px;
                padding:8px 16px;
                cursor:pointer;
                font-weight:medium;
                transition:background-color 0.3s ease;
            ">关闭</button>
        </div>
    `;
    
    // 添加到body，确保它是顶级元素
    document.body.appendChild(newSuccessMessage);
    
    // 添加关闭按钮事件监听器
    const closeMessageBtn = newSuccessMessage.querySelector('#closeMessage');
    closeMessageBtn.addEventListener('click', () => {
        newSuccessMessage.style.display = 'none';
    });
    
    // 点击弹窗外部关闭弹窗
    newSuccessMessage.addEventListener('click', (e) => {
        if (e.target === newSuccessMessage) {
            newSuccessMessage.style.display = 'none';
        }
    });
    
    // 加载虚拟助手
    loadDuckAssistant();
});

// 导出函数，允许手动调用
window.loadDuckAssistant = loadDuckAssistant;