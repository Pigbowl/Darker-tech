
// 功能链接管理器 - 用于管理所有页面中的功能链接状态
class FunctionLinkManager {
    constructor() {
        this.sessionKey = 'function_online_management';
        this.apiUrl = '/get_siteproduct_info'; // 后端API地址
        this.hasRetried = false; // 用于控制是否已经重试过
    }

    // 初始化函数 - 入口点
    async init() {
        // 确保DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.processLinks());
        } else {
            await this.processLinks();
        }
    }

    // 处理所有功能链接
    async processLinks() {
        try {            
            // 检查deploy_mode变量，如果为test，则不进行任何禁用操作
            if (typeof deploy_mode !== 'undefined' && deploy_mode === 'test') {
                return;
            }
            
            // 先检查DOM中是否有func_link元素
            const funcLinks = document.querySelectorAll('.func_link, .button_func_link');
            
            // 如果没有找到元素，添加一个延迟重试
            if (funcLinks.length === 0) {
                setTimeout(() => this.processLinks(), 300);
                return;
            }
            
            // 即使找到了元素，也尝试再次查找，确保所有元素都被找到
            // 只在第一次调用时重试，避免无限循环
            if (!this.hasRetried) {
                this.hasRetried = true;
                setTimeout(() => this.processLinks(), 500);
            }
            
            // 获取功能上线管理数据
            const functionData = await this.getFunctionData();
            if (!functionData) {
                return;
            }
            
            // 确保functionData是正确的结构
            let productFeatures = [];
            if (Array.isArray(functionData)) {
                productFeatures = functionData;
            } else if (functionData.productfeatures) {
                productFeatures = functionData.productfeatures;
            } else {
                return;
            }

            
            // 遍历所有功能链接，根据状态进行处理
            funcLinks.forEach(link => {
                const funcId = link.id;
                if (!funcId) {
                    return;
                }                
                // 在功能数据中查找对应的功能
                const funcInfo = productFeatures.find(func => func.CN_Name === funcId);
                
                if (!funcInfo) {
                    return;
                }

                // 检查功能是否可用
                if (funcInfo.Status === '未上线' || funcInfo.Status === '规划中') {
                    this.disableLink(link);
                } else {
                    this.enableLink(link);
                }
            });
        } catch (error) {
            // 静默处理错误，不影响页面正常运行
        }
    }

    // 动态加载product_configure.js文件
    loadProductConfigure() {
        return new Promise((resolve, reject) => {
            // 检查是否已经加载过
            if (typeof products_config !== 'undefined') {
                resolve();
                return;
            }

            // 创建script标签
            const script = document.createElement('script');
            script.src = '/js/product_configure.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // 从session获取功能数据，如果不存在则从全局变量products_config获取
    async getFunctionData() {
        // 尝试从session获取数据
        const sessionData = sessionStorage.getItem(this.sessionKey);
        if (sessionData) {
            return JSON.parse(sessionData);
        }

        try {
            // 动态加载product_configure.js文件
            await this.loadProductConfigure();
            
            // 从全局变量products_config获取数据
            if (typeof products_config !== 'undefined' && products_config.productfeatures) {
                const result = products_config.productfeatures;
                // 将数据存入session
                sessionStorage.setItem(this.sessionKey, JSON.stringify(result));
                return result;
            } else {
                throw new Error('products_config变量未定义或结构不正确');
            }
        } catch (error) {
            console.error('获取产品配置数据失败:', error);
            return [];
        }
    }

    // 禁用链接
    disableLink(link) {
        // 检查是否已经添加了'敬请期待'字样，避免重复添加
        if (link.dataset.hasComingSoon) {
            return;
        }
        
        // 保存原始属性，以便后续可能需要恢复
        link.dataset.originalHref = link.href;
        link.dataset.originalStyle = link.style.cssText;
        link.dataset.originalClass = link.className;
        // 保存原始HTML内容，以便启用时恢复
        link.dataset.originalHtml = link.innerHTML;
        // 标记已经添加了'敬请期待'字样
        link.dataset.hasComingSoon = 'true';

        // 修改样式
        link.style.pointerEvents = 'none';
        // 不要设置整个链接的opacity，而是修改文字颜色为半透明
        link.style.color = 'rgba(255, 255, 255, 0.5)';
        link.style.cursor = 'not-allowed';

        // 移除hover效果
        link.classList.remove('hover:bg-logoup/20');
        
        // 阻止默认点击行为
        link.addEventListener('click', this.handleDisabledLinkClick);

        // 如果是<a>标签，移除href属性或者设置为#
        if (link.tagName === 'A') {
            link.href = '#';
        }
        
        // 如果是<button>标签，添加disabled属性
        if (link.tagName === 'BUTTON') {
            link.disabled = true;
        }
        
        // 在文字右侧添加'敬请期待'字样
        const comingSoonSpan = document.createElement('span');
        comingSoonSpan.className = 'ml-2 text-xs text-green-300 font-medium';
        comingSoonSpan.style.color = 'rgba(16, 185, 129, 1)'; // 确保完全不透明的绿色
        comingSoonSpan.style.opacity = '1'; // 显式设置opacity为1
        comingSoonSpan.textContent = '(敬请期待)';
        link.appendChild(comingSoonSpan);
    }

    // 启用链接
    enableLink(link) {
        // 移除点击事件监听
        link.removeEventListener('click', this.handleDisabledLinkClick);

        // 恢复原始属性（如果有保存）
        if (link.dataset.originalHref) {
            link.href = link.dataset.originalHref;
            delete link.dataset.originalHref;
        }

        if (link.dataset.originalStyle) {
            link.style.cssText = link.dataset.originalStyle;
            delete link.dataset.originalStyle;
        } else {
            // 如果没有保存原始样式，恢复默认样式
            link.style.pointerEvents = '';
            link.style.color = '';
            link.style.opacity = '';
            link.style.cursor = '';
        }
        
        if (link.dataset.originalClass) {
            link.className = link.dataset.originalClass;
            delete link.dataset.originalClass;
        }
        
        // 如果是<button>标签，移除disabled属性
        if (link.tagName === 'BUTTON') {
            link.disabled = false;
        }
        
        // 恢复原始HTML内容，去掉'(敬请期待)'字样
        if (link.dataset.originalHtml) {
            link.innerHTML = link.dataset.originalHtml;
            delete link.dataset.originalHtml;
        }
        
        // 删除'已添加敬请期待'标记
        delete link.dataset.hasComingSoon;
    }

    // 处理禁用链接的点击事件
    handleDisabledLinkClick(e) {
        e.preventDefault();
        e.stopPropagation();
        alert('功能未上线，敬请期待。');
    }

    // 手动刷新功能数据（例如在管理页面中使用）
    async refreshFunctionData() {
        // 清除session中的数据
        sessionStorage.removeItem(this.sessionKey);
        // 重新获取数据并处理链接
        await this.processLinks();
    }
}

// 初始化功能链接管理器
const functionLinkManager = new FunctionLinkManager();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    functionLinkManager.init();
});

// // 添加一个全局方法，允许其他脚本（如load-components.js）在组件加载完成后调用
// window.updateFunctionLinks = () => {
//     functionLinkManager.processLinks();
// };
