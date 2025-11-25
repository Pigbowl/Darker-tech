# 测试Git钩子功能指南

## 测试pre-commit钩子

按照以下步骤测试你创建的pre-commit钩子是否正常工作：

### 1. 准备测试环境

1. 确保你已经设置了脚本的执行权限（参考`set-hook-permissions.md`文档）
2. 确保目标文件存在并包含可修改的参数
3. 根据你的实际需求修改`.git/hooks/pre-commit`文件中的配置部分：
   - 更新`TARGET_FILE`为你要修改的实际文件路径
   - 更新`PARAM_NAME`为你要修改的参数名
   - 根据需要调整`NEW_VALUE`的生成方式

### 2. 执行测试

```bash
# 步骤1：确保有未提交的更改
# 可以修改任意文件，或使用touch创建一个新文件
touch test_file.txt

# 步骤2：将更改添加到暂存区
git add test_file.txt

# 步骤3：执行提交操作
git commit -m "测试pre-commit钩子"
```

### 3. 验证结果

在提交过程中，你应该能看到钩子的输出信息，显示参数已被更新。提交完成后：

1. 检查目标文件中的参数是否已被更新
2. 使用`git diff HEAD~1 HEAD`查看提交内容，确认参数修改已包含在提交中

## 常见问题排查

如果钩子没有正常工作，请检查以下几点：

### 1. 脚本权限问题
- 确保已正确设置执行权限
- 在Windows上，尝试使用Git Bash而不是CMD

### 2. 脚本内容问题
- 检查目标文件路径是否正确
- 检查参数名称是否与文件中的实际名称匹配
- 在脚本中添加更多`echo`语句来输出调试信息

### 3. 修改sed命令以适应不同格式

如果参数在文件中的格式与脚本预期不符，可能需要调整正则表达式。例如：

- 对于JSON格式：`sed -i "s/\"$PARAM_NAME\": \?\"[^"]*\"/\"$PARAM_NAME\": \"$NEW_VALUE\"/g" "$TARGET_FILE"`
- 对于JavaScript对象：`sed -i "s/$PARAM_NAME:[[:space:]]*[\"'].*[\"']/$PARAM_NAME: \"$NEW_VALUE\"/g" "$TARGET_FILE"`
- 对于Python格式：`sed -i "s/$PARAM_NAME[[:space:]]*=[[:space:]]*[\"'].*[\"']/$PARAM_NAME = \"$NEW_VALUE\"/g" "$TARGET_FILE"`

### 4. 使用不同的脚本语言

如果你更熟悉其他脚本语言，可以将钩子脚本改为使用Python或Node.js等。例如，创建一个Python脚本并在pre-commit钩子中调用它：

```bash
#!/bin/sh
python3 update_param.py
```

## 自定义进阶功能

如果你需要更复杂的修改逻辑，可以考虑：

1. 创建一个独立的Python或Node.js脚本来处理参数修改
2. 在钩子中调用这个脚本
3. 使用库来处理复杂的文件格式（如JSON、XML等）

例如，对于JSON文件，可以使用Python的json模块进行更可靠的修改。