// 动态加载通用资源（CSS和JS链接）
async function loadCommonResources() {
    // 资源列表
    const resources = [
        { type: 'script', src: 'https://cdn.tailwindcss.com', isTailwind: true },
        { type: 'link', href: 'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css', rel: 'stylesheet' },
        { type: 'script', src: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js' },
        { type: 'script', src: 'js/load-duck-assistant.js' }
    ];
    
    // 检查资源是否已加载，避免重复加载
    const head = document.head;
    const existingScripts = Array.from(head.querySelectorAll('script')).map(s => s.src);
    const existingLinks = Array.from(head.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href);
    
    // 首先加载Tailwind，确保它先被加载和执行
    const tailwindResource = resources.find(r => r.type === 'script' && r.isTailwind);
    if (tailwindResource && !existingScripts.includes(tailwindResource.src)) {
        await loadScriptWithCallback(tailwindResource.src);
    }
    
    // 然后加载其他资源
    for (const resource of resources.filter(r => !r.isTailwind)) {
        if (resource.type === 'script' && !existingScripts.includes(resource.src)) {
            const script = document.createElement('script');
            script.src = resource.src;
            script.async = false; // 确保按顺序加载
            head.appendChild(script);
        } else if (resource.type === 'link' && !existingLinks.includes(resource.href)) {
            const link = document.createElement('link');
            link.href = resource.href;
            link.rel = resource.rel;
            head.appendChild(link);
        }
    }
    
    // 确保Tailwind加载完成后，再尝试加载配置
    ensureTailwindConfigLoaded();
}

// 带回调的脚本加载函数
function loadScriptWithCallback(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = () => resolve();
        document.head.appendChild(script);
    });
}

// 确保Tailwind配置在Tailwind加载完成后执行
function ensureTailwindConfigLoaded() {
    // 检查tailwindconfig.js是否已经在HTML中引入
    const hasTailwindConfig = Array.from(document.scripts).some(
        s => s.src.includes('tailwindconfig.js')
    );
    
    // 如果没有引入，则动态引入tailwindconfig.js
    if (!hasTailwindConfig) {
        const configScript = document.createElement('script');
        configScript.src = 'js/tailwindconfig.js';
        document.head.appendChild(configScript);
    }
}

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', loadCommonResources);

