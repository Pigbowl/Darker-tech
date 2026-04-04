// ShapeTemplate.js
// 定义各种硬件元素的绘制模板参数

const ShapeTemplate = {
    PCBA: {
        align: 'center',
        verticalAlign: 'top',
        fillColor: '#cccccc',
        borderColor: '#000000',
        rounded: 0,
        shape: 'rectangle',
        fontSize: 12,
        fontColor: '#000000',
        collapsible: 0,
        width: 300,
        height: 300
    },
    SoC: {
        align: 'center',
        verticalAlign: 'middle',
        fillColor: '#0066ff',
        borderColor: '#000000',
        rounded: 0,
        shape: 'rectangle',
        fontSize: 10,
        fontColor: '#ffffff',
        collapsible: 0,
        width: 200,
        height: 100
    },
    MCU: {
        align: 'center',
        verticalAlign: 'middle',
        fillColor: '#018f30ff',
        borderColor: '#000000',
        rounded: 0,
        shape: 'rectangle',
        fontSize: 10,
        fontColor: '#ffffff',
        collapsible: 0,
        width: 200,
        height: 100
    },
    SWITCH: {
        align: 1,
        verticalAlign: 1,
        fillColor: 1,
        borderColor: 1,
        rounded: 1,
        shape: 1,
        fontSize: 1,
        fontColor: 1,
        collapsible: 1
    },
    CAMERA: {
        align: 1,
        verticalAlign: 1,
        fillColor: 1,
        borderColor: 1,
        rounded: 1,
        shape: 1,
        fontSize: 1,
        fontColor: 1,
        collapsible: 1
    },
    RADAR: {
        align: 1,
        verticalAlign: 1,
        fillColor: 1,
        borderColor: 1,
        rounded: 1,
        shape: 1,
        fontSize: 1,
        fontColor: 1,
        collapsible: 1
    },
    LIDAR: {
        align: 1,
        verticalAlign: 1,
        fillColor: 1,
        borderColor: 1,
        rounded: 1,
        shape: 1,
        fontSize: 1,
        fontColor: 1,
        collapsible: 1
    },
    USS: {
        align: 1,
        verticalAlign: 1,
        fillColor: 1,
        borderColor: 1,
        rounded: 1,
        shape: 1,
        fontSize: 1,
        fontColor: 1,
        collapsible: 1
    },
    INTERFACE: {
        align: 'left',
        verticalAlign: 'middle',
        fillColor: '#ffffff',
        borderColor: '#000000',
        rounded: 0,
        shape: 'rectangle',
        fontSize: 8,
        fontColor: '#000000',
        collapsible: 0,
        width: 100,
        height: 20
    }
};

// 导出为全局变量（浏览器环境）
if (typeof window !== 'undefined') {
    window.ShapeTemplate = ShapeTemplate;
}

// 导出为模块（Node.js 环境）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShapeTemplate;
}
