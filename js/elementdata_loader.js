// elementdata_loader.js - 使用fetch API获取数据并设置全局变量

// 标记数据是否正在加载
window.elementDataLoading = true;

// 获取数据并设置全局变量 - 使用then链式调用方式
function loadElementData() {
    // 这里是你的后端API地址
    command = ip + '/extract_Know_net'
    // const apiUrl = 'http://localhost:3000/api/elementdata'; // 请修改为实际的API地址
    
    // 使用fetch API获取数据（采用与Hardwarehall.html中类似的模式）
    fetch(command, {
        method: 'POST',  // 使用POST方法
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // 这里可以根据实际API需求添加请求参数
            // 示例参数，实际使用时请根据API要求修改
            datatype:"product",
            item_cate: 'elementdata',
            action: 'work'
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // 检查API返回是否成功
        if (data.success) {
            // 假设API返回的数据格式是 {success: true, output: "{...}"} 或 {success: true, data: {...}}
            // 根据实际返回格式调整
            const elementData = typeof data.output === 'string' ? JSON.parse(data.output) : data.data || data;
            // 设置全局变量
            window.elementdata = elementData;
            
            console.log('数据已成功加载并设置为全局变量elementdata');
        } else {
            console.log("请求失败: API返回失败状态");
            throw new Error("API返回失败");
        }
    })
    .catch(error => {
        console.error('加载数据时出错:', error);
        
        // 获取失败后弹窗提醒
        alert('数据加载失败！\n' + error.message);
    })
    .finally(() => {
        // 标记数据加载完成（无论成功或失败）
        window.elementDataLoading = false;
        
        // 触发自定义事件，通知其他脚本数据已加载完成
        const event = new Event('elementDataLoaded');
        window.dispatchEvent(event);
    });
}

// 初始化加载
loadElementData();

// 监听DOMContentLoaded事件，确保在DOM加载完成后数据也已准备就绪
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.elementdata && window.elementDataLoading) {
      // 如果DOM加载完成但数据还在加载中，等待数据加载完成事件
      window.addEventListener('elementDataLoaded', () => {
        console.log('DOM和数据都已加载完成');
      });
    }
  });
} else if (!window.elementdata && window.elementDataLoading) {
  // 如果DOM已经加载完成但数据还在加载中
  window.addEventListener('elementDataLoaded', () => {
    console.log('数据已加载完成');
  });
}

// 导出加载函数（如果需要模块化使用）
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = { loadElementData };
}