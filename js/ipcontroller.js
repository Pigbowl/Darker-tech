let darker_config = {
    "admin_email": "darkerassistance@thedarkertech.com",
    "sender_email": "songjiawei@thedarkertech.com",
    "sender_password": "HmVHi4sqXicVAmBF",
    "smtp_server": "smtp.exmail.qq.com",
    "darker_url": "thedarkertech.com",
    "port": 465,
    "sender_name": "达客小助手",
    "server_ip": "47.99.204.97",
    "server_sshport": 22,
    "server_pseudo": "Administrator",
    "server_code": "Darker2025",
    "taskname": "DarkServer",
    "deploy_mode": "full",
    "Server_comPort": {
        "CN": 7000,
        "US": 5000
    },
    "test_com_port": 5000,
    "serverLocation": "CN",
    "server_product_config": {
        "host": "localhost",
        "user": "root",
        "password": "12345678",
        "database": "darkerdatabase"
    },
    "server_operation_config": {
        "host": "localhost",
        "user": "root",
        "password": "12345678",
        "database": "operationdatabase"
    },
    "backend_git_repo": "https://github.com/Pigbowl/BackEndS.git",
    "backend_server_folder": "C:\Darker_Backend",
    "frontend_git_repo": "https://github.com/Pigbowl/Darker-tech.git",
    "frontend_server_folder": "C:\Darker_FrontEnd",
    "develop_product_config": {
        "host": "localhost",
        "port": 3306,
        "user": "root",
        "password": "12345678",
        "database": "darkerdatabase",
        "dump_path": "C:\Users\宋嘉玮\OneDrive\Desktop\DarkerTools\Database",
        "sql_filename": "darkerdatabase_auto.sql"
    },
    "develop_operation_config": {
        "host": "47.99.204.97",
        "user": "centeruser",
        "password": "12345678",
        "database": "operationdatabase"
    }
};

let deploy_mode = darker_config.deploy_mode;
let ip = '';
// 调用API执行Python脚本
if (deploy_mode == "test")
    {ip = 'http://localhost:' + darker_config.test_com_port}
else{
    if (darker_config.serverLocation == "CN")
        {ip = 'http://' + darker_config.server_ip + ':' + darker_config.Server_comPort.CN}
    else
        {ip = '/api'}
}

// if (deploy_mode =\full"
//     {ip = 'http://47.99.204.97:5000'}
// else if (deploy_mode =\full"
//     {ip = '/api'}
// else 
//     {ip = 'http://localhost:' + darker_config.test_com_port}
