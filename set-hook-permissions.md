# 设置Git钩子脚本执行权限指南

## Windows环境

在Windows环境下，Git钩子脚本的执行权限设置与Linux/macOS有所不同。通常情况下，在Windows上使用Git Bash或WSL时，你需要确保脚本有正确的执行权限。

### 方法1：使用Git Bash设置权限

1. 打开Git Bash终端
2. 导航到项目目录：
   ```bash
   cd c:\Users\宋嘉玮\OneDrive\Desktop\Darker-tech
   ```
3. 执行以下命令设置执行权限：
   ```bash
   chmod +x .git/hooks/pre-commit
   ```

### 方法2：使用Windows PowerShell设置权限

1. 以管理员身份打开PowerShell
2. 导航到项目目录：
   ```powershell
   cd c:\Users\宋嘉玮\OneDrive\Desktop\Darker-tech
   ```
3. 执行以下命令设置执行权限：
   ```powershell
   icacls .git\hooks\pre-commit /grant Everyone:F
   ```

## Linux/macOS环境

在Linux或macOS系统中，设置执行权限相对简单：

1. 打开终端
2. 导航到项目目录：
   ```bash
   cd path/to/your/project
   ```
3. 执行以下命令设置执行权限：
   ```bash
   chmod +x .git/hooks/pre-commit
   ```

## 注意事项

1. 确保文件第一行的shebang（`#!/bin/sh`）正确无误
2. 在Windows上，如果使用的是CMD而不是Git Bash或PowerShell，Git可能仍然会尝试执行脚本
3. 如果脚本执行出现问题，可以在脚本中添加更多的echo语句来调试

设置好权限后，每次执行`git commit`命令时，pre-commit钩子将会自动运行，修改指定文件中的参数并将修改添加到当前提交中。