import pandas as pd
import json
import os

def extract_excel_to_js():
    # 设置文件路径
    excel_file_path = os.path.join('Doc', 'KnowNet.xlsx')
    output_json_path = 'KnowNet.json'
    
    # 检查Excel文件是否存在
    if not os.path.exists(excel_file_path):
        print(f"错误：找不到Excel文件 {excel_file_path}")
        return
    
    try:
        # 读取Excel文件中的Elements sheet
        df = pd.read_excel(excel_file_path, sheet_name='Elements')
        
        # 准备结果数据结构
        result = {
            "Element": [],
            "connections": []
        }
        
        # 创建元素名称到id的映射，方便后续查找
        element_name_to_id = {}
        element_id_to_name = {}
        
        # 处理每一行数据，生成Element数组
        for index, row in df.iterrows():
            # 获取基本信息
            element_id = row['Element_Index']
            element_name = row['Element_Name']
            is_primary = row['isPrimary']
            
            # 存储映射关系
            element_name_to_id[element_name] = element_id
            element_id_to_name[element_id] = element_name
            
            # 处理from字段，按逗号分割并去除空白
            element_from = []
            if pd.notna(row['Element_From']):
                element_from = [x.strip() for x in str(row['Element_From']).split(',') if x.strip() and x.strip() != '/']
            
            # 处理to字段，按逗号分割并去除空白
            element_to = []
            if pd.notna(row['Element_To']):
                element_to = [x.strip() for x in str(row['Element_To']).split(',') if x.strip() and x.strip() != '/']
            
            # 处理知识点，按逗号分割并去除空白
            knowledge = []
            if pd.notna(row['Element_Property_Knowledge']):
                knowledge = [x.strip() for x in str(row['Element_Property_Knowledge']).split(',') if x.strip()]
            
            # 处理产品，按逗号分割并去除空白
            product = []
            if pd.notna(row['Element_Property_Product']):
                product = [x.strip() for x in str(row['Element_Property_Product']).split(',') if x.strip()]
            
            # 创建元素对象
            element = {
                "id": int(element_id),
                "name": element_name,
                "description": str(row['Element_Description']) if pd.notna(row['Element_Description']) else "",
                "from": element_from,
                "to": element_to,
                "domain": str(row['Element_Domain']) if pd.notna(row['Element_Domain']) else "",
                "Metier": str(row['Element_Metier']) if pd.notna(row['Element_Metier']) else "",
                "isPrimary": is_primary,
                "Property": {
                    "Knowledge": knowledge,
                    "Product": product
                }
            }
            
            result["Element"].append(element)
        
        # 生成connections
        connection_set = set()
        
        for element in result["Element"]:
            current_id = element["id"]
            current_name = element["name"]
            
            # 处理from连接
            for from_name in element["from"]:
                if from_name in element_name_to_id:
                    # 创建连接的唯一标识（保持方向）
                    from_id = element_name_to_id[from_name]
                    to_id = current_id
                    connection_key = (from_id, to_id)
                    
                    if connection_key not in connection_set:
                        connection_set.add(connection_key)
                        result["connections"].append({
                            "from": from_id,
                            "to": to_id
                        })
        
        # 数据验证逻辑
        print("\n===== 数据验证结果 =====")
        has_error = False
        
        # 1. 检测元素From或To中的成员无法在name中找到的情况
        print("\n1. 检测未找到的元素引用：")
        reference_errors = False
        for element in result["Element"]:
            current_name = element["name"]
            
            # 检查from字段中的引用
            for from_name in element["from"]:
                if from_name not in element_name_to_id:
                    print(f"   错误：元素 '{current_name}' 的From引用了不存在的元素 '{from_name}'")
                    reference_errors = True
                    has_error = True
            
            # 检查to字段中的引用
            for to_name in element["to"]:
                if to_name not in element_name_to_id:
                    print(f"   错误：元素 '{current_name}' 的To引用了不存在的元素 '{to_name}'")
                    reference_errors = True
                    has_error = True
        
        if not reference_errors:
            print("   未发现元素引用错误")
        
        # 2. 检测元素关联不对等的情况
        print("\n2. 检测关联不对等的情况：")
        symmetry_errors = False
        # 构建关联映射：key是(from_id, to_id)，value是对应的元素名称对
        connection_mapping = {}
        for element in result["Element"]:
            current_id = element["id"]
            current_name = element["name"]
            
            # 检查每个from引用是否在被引用元素的to中存在
            for from_name in element["from"]:
                if from_name in element_name_to_id:
                    from_id = element_name_to_id[from_name]
                    # 查找被引用元素
                    referenced_element = None
                    for e in result["Element"]:
                        if e["name"] == from_name:
                            referenced_element = e
                            break
                    
                    if referenced_element and current_name not in referenced_element["to"]:
                        print(f"   错误：关联不对等 - 元素 '{current_name}' 的From引用了 '{from_name}'，但 '{from_name}' 的To中没有引用 '{current_name}'")
                        symmetry_errors = True
                        has_error = True
        
        if not symmetry_errors:
            print("   未发现关联不对等的情况")
        
        # 3. 检测Element的From/To数量和connections中对应数量不匹配的情况
        print("\n3. 检测连接数量不匹配的情况：")
        count_errors = False
        
        # 统计每个元素在connections中的作为from和to的次数
        from_counts = {}
        to_counts = {}
        for conn in result["connections"]:
            from_id = conn["from"]
            to_id = conn["to"]
            
            if from_id not in from_counts:
                from_counts[from_id] = 0
            from_counts[from_id] += 1
            
            if to_id not in to_counts:
                to_counts[to_id] = 0
            to_counts[to_id] += 1
        
        # 验证每个元素的from数量是否与connections中to该元素的数量匹配
        # 验证每个元素的to数量是否与connections中from该元素的数量匹配
        for element in result["Element"]:
            element_id = element["id"]
            element_name = element["name"]
            
            # 实际的from数量（上游元素数量）
            actual_from_count = len([x for x in element["from"] if x.strip() != '/'])
            # connections中to该元素的数量（应该等于上游元素数量）
            connection_to_count = to_counts.get(element_id, 0)
            
            if actual_from_count != connection_to_count:
                print(f"   错误：元素 '{element_name}' (ID: {element_id}) 的From数量 ({actual_from_count}) 与connections中to该元素的数量 ({connection_to_count}) 不匹配")
                count_errors = True
                has_error = True
            
            # 实际的to数量（下游元素数量）
            actual_to_count = len([x for x in element["to"] if x.strip() != '/'])
            # connections中from该元素的数量（应该等于下游元素数量）
            connection_from_count = from_counts.get(element_id, 0)
            
            if actual_to_count != connection_from_count:
                print(f"   错误：元素 '{element_name}' (ID: {element_id}) 的To数量 ({actual_to_count}) 与connections中from该元素的数量 ({connection_from_count}) 不匹配")
                count_errors = True
                has_error = True
        
        if not count_errors:
            print("   未发现连接数量不匹配的情况")
        
        if not has_error:
            print("\n✅ 数据验证通过，未发现错误！")
        
        # 将结果直接保存为JavaScript文件
        output_js_path = './js/elementdata.js'
        js_content = f"let elementdata = {json.dumps(result, ensure_ascii=False, indent=2)};"
        
        with open(output_js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"\n成功生成JavaScript文件：{output_js_path}")
        print(f"共处理 {len(result['Element'])} 个元素")
        print(f"共生成 {len(result['connections'])} 个连接")
        
    except Exception as e:
        print(f"处理过程中发生错误：{str(e)}")

if __name__ == "__main__":
    extract_excel_to_js()