// 产品卡片渲染器

// 渲染产品列表
function renderProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    // 清空容器
    productsContainer.innerHTML = '';
    
    if (!product_info || product_info.length === 0) {
        // 无数据状态
        productsContainer.innerHTML = `
            <div class="text-center py-10 text-gray-400">
                <i class="fa fa-search mr-2"></i>没有符合条件的产品数据
            </div>
        `;
        return;
    }
    
    // 按产品分类分组
    const productsByCategory = {};
    product_info.forEach(product => {
        const category = product.Category || '未分类';
        if (!productsByCategory[category]) {
            productsByCategory[category] = [];
        }
        productsByCategory[category].push(product);
    });
    
    // 遍历每个分类，生成分类大卡片
    Object.entries(productsByCategory).forEach(([category, products]) => {
        // 创建分类大卡片
        const categoryCard = document.createElement('div');
        categoryCard.className = 'space-y-4';
        
        // 分类标题
        categoryCard.innerHTML = `
            <h3 class="text-xl font-bold text-white flex items-center">
                <i class="fa fa-folder-open text-purple-400 mr-2"></i>${category}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- 产品卡片将在这里生成 -->
            </div>
        `;
        
        // 获取产品卡片容器
        const productsGrid = categoryCard.querySelector('div.grid');
        
        // 为每个产品生成卡片
        products.forEach(product => {
            // 获取状态信息
            const statusText = status_enum.includes(product.Status) ? product.Status : '未知';
            
            // 获取状态样式和图标
            let statusClass = 'bg-gray-400/20 text-gray-400';
            let statusIcon = 'fa-question-circle';
            switch (product.Status) {
                case '测试版本上线':
                    statusClass = 'bg-yellow-400/20 text-yellow-400';
                    statusIcon = 'fa-flask';
                    break;
                case '规划中':
                    statusClass = 'bg-blue-400/20 text-blue-400';
                    statusIcon = 'fa-calendar-check-o';
                    break;
                case '正式版本上线':
                    statusClass = 'bg-green-400/20 text-green-400';
                    statusIcon = 'fa-check-circle';
                    break;
                case '未上线':
                    statusClass = 'bg-red-400/20 text-red-400';
                    statusIcon = 'fa-times-circle';
                    break;
                case '先产品上线':
                    statusClass = 'bg-purple-400/20 text-purple-400';
                    statusIcon = 'fa-rocket';
                    break;
            }
            
            // 创建产品卡片
            const productCard = document.createElement('div');
            productCard.className = 'bg-gray-900/30 rounded-lg p-4 border border-gray-800 hover:border-purple-400 transition-all duration-300 relative';
            productCard.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <h4 class="font-medium text-white">${product.CN_Name || '未知'}</h4>
                    <button class="status-icon ${statusClass} p-2 rounded-full hover:opacity-80 transition-opacity cursor-pointer" 
                            data-id="${product.ID}" data-current-status="${product.Status}" title="点击修改状态">
                        <i class="fa ${statusIcon} text-lg"></i>
                    </button>
                </div>
                <p class="text-sm text-gray-400 mb-3">${product.Function || '未知'}</p>
                <div class="text-xs text-gray-500">
                    状态：<span class="${statusClass} px-2 py-1 rounded-full">${statusText}</span>
                </div>
            `;
            
            // 添加到分类卡片中
            productsGrid.appendChild(productCard);
        });
        
        // 添加到主容器
        productsContainer.appendChild(categoryCard);
    });
    
    // 绑定状态图标点击事件
    bindStatusIconEvents();
}

// 绑定状态图标点击事件
function bindStatusIconEvents() {
    document.querySelectorAll('.status-icon').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 移除所有其他下拉菜单
            document.querySelectorAll('.status-dropdown').forEach(dropdown => {
                dropdown.remove();
            });
            
            // 获取当前图标和产品信息
            const productId = this.getAttribute('data-id');
            const currentStatus = this.getAttribute('data-current-status');
            
            // 创建下拉菜单
            const dropdown = document.createElement('div');
            dropdown.className = 'status-dropdown absolute z-10 bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-2 mt-1 min-w-[150px]';
            
            // 生成状态选项
            status_enum.forEach(status => {
                const isActive = status === currentStatus;
                const option = document.createElement('div');
                option.className = `px-3 py-2 rounded cursor-pointer hover:bg-gray-800 transition-colors ${isActive ? 'bg-gray-800' : ''}`;
                option.textContent = status;
                option.addEventListener('click', () => {
                    // 更新产品状态
                    updateProductStatus(productId, status);
                    // 移除下拉菜单
                    dropdown.remove();
                });
                dropdown.appendChild(option);
            });
            
            // 添加到文档中
            document.body.appendChild(dropdown);
            
            // 计算并设置下拉菜单位置
            const rect = this.getBoundingClientRect();
            dropdown.style.left = `${rect.left}px`;
            dropdown.style.top = `${rect.bottom}px`;
        });
    });
    
    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.status-icon')) {
            document.querySelectorAll('.status-dropdown').forEach(dropdown => {
                dropdown.remove();
            });
        }
    });
}

// 更新产品状态
function updateProductStatus(productId, newStatus) {
    // 更新本地数据
    const product = product_info.find(product => product.ID == productId);
    if (product) {
        product.Status = newStatus;
    }
    
    // 发送数据给后端
    const data = { Status: newStatus };
    modifyproductindatabase(data, productId);
    
    // 重新渲染产品列表
    renderProducts();
}

// 替换原始的renderProducts函数
document.addEventListener('DOMContentLoaded', function() {
    // 替换原始的renderProducts函数
    window.renderProducts = renderProducts;
});
