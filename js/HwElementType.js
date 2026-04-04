let elementTypes = {};

function groupProductsByManufacturer(productINFO) {
    soc_manufacturerData = {};
    mcu_manufacturerData = {};
    Object.keys(productINFO).forEach(key => {
        product = productINFO[key]
        const manufacturer = product.Supplier_Name.Name || '未知厂商';
        const type = product.Type || '未知类型';
        if (type === 'SoC') {
            if (!soc_manufacturerData[manufacturer]) {
                soc_manufacturerData[manufacturer] = [];
            }
            soc_manufacturerData[manufacturer].push(product);
        } else if (type === 'MCU') {
            if (!mcu_manufacturerData[manufacturer]) {
                mcu_manufacturerData[manufacturer] = [];
            }
            mcu_manufacturerData[manufacturer].push(product);
        }
    });
    return {soc_manufacturerData, mcu_manufacturerData} 
}

function getcomponent() {
    return new Promise((resolve, reject) => {
        const command = ip + '/extract_item_group';
        fetch(command, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                table_name:"calculator"
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                chipset_catalogue = JSON.parse(data.output).Catalogue;
                const {soc_manufacturerData, mcu_manufacturerData} = groupProductsByManufacturer(chipset_catalogue);
                
                elementTypes = {
                    'PCBA': { shape: 'rectangle', color: '#eeeeee',type:'PCBA',width:500,height:500 },
                    'SoC': { 
                        shape: 'rectangle', 
                        color: '#0066ff',
                        type:'SoC',
                        width:150,
                        height:80,
                        subTypes: soc_manufacturerData
                    },
                    'MCU': { shape: 'rectangle', color: '#10b981',type:'MCU',width:80,height:40,subTypes: mcu_manufacturerData },
                    'CAM': { shape: 'circle', color: '#8b5cf6',type:'CAM',radius:40 },
                };
                
                resolve(elementTypes);
            } else {
                console.log("请求失败");
                reject(new Error("API返回失败"));
            }
        })
        .catch(error => {
            console.error("请求过程中出错:", error);
            reject(error);
        });
    });
}
