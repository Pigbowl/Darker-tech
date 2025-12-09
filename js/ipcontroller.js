// 部署模式配置

    let deploy_mode = "full"
    let ip = '';
    // 调用API执行Python脚本
    if (deploy_mode == 'local'){ip = 'http://47.99.204.97:5000'}
    else if (deploy_mode == "full"){ip = '/api'}
    else {ip = 'http://localhost:5000'}
