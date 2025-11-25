let elementTypes = {};

// 按厂商分组产品数据
function groupProductsByManufacturer(productINFO) {
    soc_manufacturerData = {};
    mcu_manufacturerData = {};
    Object.keys(productINFO).forEach(key => {
        product = productINFO[key]
        const manufacturer = product.Supplier_Name || '未知厂商';
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

function get_part_info(){
    command = ip + '/part_list_get'
    fetch(command, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        scriptName: "read_chipset_catalogue.py",
        tablepath: "database.xlsx"
    })
    })
    .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
    }
    return response.json();
    })
    .then(data => {
        console.log(JSON.parse(data.output))
    }
)
}
function getcomponent(){
    // command = ip + '/component_list_get'
    command = ip + '/extract_item_group'
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
        // supplier = JSON.parse(data.output);
        // console.log(JSON.parse(data.output))
        chipset_catalogue = JSON.parse(data.output).Catalogue;
        console.log(chipset_catalogue)
        const {soc_manufacturerData, mcu_manufacturerData} = groupProductsByManufacturer(chipset_catalogue);
        // 定义元素类型配置
        command = ip + '/part_list_get'
        fetch(command, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                scriptName: "read_part_catalogue.py",
                tablepath: "database.xlsx"
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
                    part_catalogue = JSON.parse(data.output);
                    console.log(part_catalogue)
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
                    'COMPONENT': { shape: 'square', color: '#0bf53eff',type:'COMPONENT',size:40,subTypes: part_catalogue },
                    'CAM': { shape: 'circle', color: '#8b5cf6',type:'CAM',radius:40 },
                    // 'SWITCH': { shape: 'rectangle', color: '#facc15',type:'SWITCH',width:80,height:40 },
                    // 'GPS': { shape: 'circle', color: '#009688',type:'GPS',radius:40 },
                    // 'IMU': { shape: 'circle', color: '#d32f2f',type:'IMU',radius:40 }
                    }
                } else {
                    console.log("请求失败");
                    reject(new Error("API返回失败"));
                }
            })
            .catch(error => {
                console.error("请求过程中出错:", error);
            reject(error);
            });
    } else {
        console.log("请求失败");
        reject(new Error("API返回失败"));
    }
    })
    .catch(error => {
        console.error("请求过程中出错:", error);
    reject(error);
    });
}

getcomponent();
// get_part_info();

