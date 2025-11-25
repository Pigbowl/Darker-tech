    let deploy_mode = ''full''
    let ip = '';
    // 调用API执行Python脚本
    if (deploy_mode == 'local'){ip = 'http://47.99.204.97:5000'}
    else if (deploy_mode == "full"){ip = '/api'}
    else {ip = 'http://localhost:5000'}


    fetch(ip + '/deploy_information', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },                
        body:JSON.stringify({
                    "deploy_mode":deploy_mode
                })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });