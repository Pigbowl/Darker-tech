
        
        // 连接到控制服务器 - 端口5000
        const controlSocket = io(`http://${window.location.hostname}:5000`);
        // 连接到视觉服务器 - 端口5001
        const visionSocket = io(`http://${window.location.hostname}:5001`);
        // 定义变量
    
        let wheelradius = 0;  // Wheel radius of the ego vehicle
        let targetwheelradius = 0.57;
        let vehiclespeed = 0; // initilization of the vehicle speed
        let steeringangle = 0; // initilization of the vehicle steering angle
        let gap_angle = 0; //the angle between model's coordinate and world coordinate
        let leftblinkState = false;  // 闪烁状态（true为亮，false为灭）
        let rightblinkState = false;  // 闪烁状态（true为亮，false为灭）
        let leftblinking = false; // command of left blinkers
        let rightblinking = false; // command of right blinkers
        let leftlastBlinkTime = 0;   // 上次闪烁时间
        let rightlastBlinkTime = 0;   // 上次闪烁时间
        const BLINK_INTERVAL = 500;  // 闪烁间隔时间（毫秒，这里设为1秒，完整周期2秒）
        let virtualcameras ={}; // virtual cameras group contains virtual cameras representing adas camera view
        let composer = null;  // ??? to understand ???
        let frostumshow = false; // command to show or hide the camera fov frostum
        let headlighton = false; // command to turn on headlight
        let roadlights = {}; // group to contains lights that representing the roadlight
        const connectionStatus = document.getElementById('connection-status'); // connection status UI element
        const lastUpdateElement = document.getElementById('last-update'); 
        let scene, cameraMain, renderer, controls;  // initilaizaiotn of scene, maincamera, renderer, controls
        let otherVehicleMeshes = [], obstacleMeshes = []; // array to contain all target vehicle and obstacles
        let trajectoryGeometry, trajectoryPoints = [];
        let egoVehicleMesh=null;  // init of egoVehicleMesh
        let lastRightStickState = 0; // rise-edge detection parameter for joy-stick
        let lastLeftStickState = 0; // rise-edge detection parameter for joy-stick
        let camindex = 2; // number of view mode init from joy-stick mode
        let sendIntervalId = null; // 添加发送周期控制变量
        let cameraMode = 'free'; // 初始默认模式
        let rainParticles, rainGroup; //雨滴粒子和雨滴粒子集合
        let snowParticles, snowGroup; // 雪粒子和雪粒子集合
        let sandParticles, sandGroup; // 沙尘粒子和沙尘粒子集合
        let fogUniforms, fogPass; //雾相关参数
        let isSpecialWeatherEnabled = false; // 特殊天气总开关状态
        let currentSpecialWeather = 'rain'; // 当前选择的特殊天气，默认为下雨
        let current_time = 'day'; // 当前选择的时间
        let lightdense = 0; //大灯亮度
        let simulationState = { //当前仿真状态初始化，后续有matlab数据填充
            running: true,
            egoVehicle: {
                x: 300,
                y: 400,
                speed: 50,
                acceleration: 0,
                heading: 0,
                lane: 2,
                rotation:0,
                positionHistory: [] // 用于存储轨迹点
            },
            otherVehicles: [
                { x: 200, y: 200, speed: 45, heading: 0 },
                { x: 400, y: 100, speed: 55, heading: 0 }
            ],
            obstacles: [
                { x: 300, y: 150 }
            ],
            DynTar_info:[],
            trafficLights: [],  // 添加这一行，初始化
            trajectory: {  // 新增轨迹数据结构
                bezierX: [],
                bezierY: []
            }
        };
        let egosetup ={  //自车参数配置，可根据不同的车模自动调整模型位置和第一视角位置
            "Urus":{posx:0,posy:0,posz:0,scale:100,rotationx:0,rotationy:0,rotationz:0,wheelsize:0.75,offsetdistance:-0.5,height:1.5,offsetlat:-0.3},
            "NIO_ES7":{posx:0,posy:0,posz:0,scale:1,rotationx:0,rotationy:180,rotationz:0,wheelsize:0.725,offsetdistance:-0.6,height:1.3,offsetlat:-0.3},
            "VUT":{posx:0,posy:0,posz:0,scale:1,rotationx:0,rotationy:0,rotationz:0,wheelsize:0.725},
            "F1":{posx:0,posy:0,posz:0,scale:0.65,rotationx:0,rotationy:0,rotationz:0,wheelsize:0.725},
        }
        let pagelayoutscale ={ //前端页面，不同adas相机视角画面设置
            "frontWide":{"sizex":1,"sizey":1,"posx":2,"posy":3},
            "frontNarrow":{"sizex":1,"sizey":1,"posx":3,"posy":3},
            "frontRight":{"sizex":1,"sizey":1,"posx":2,"posy":2},
            "frontLeft":{"sizex":1,"sizey":1,"posx":3,"posy":2},
            "rearRight":{"sizex":1,"sizey":1,"posx":2,"posy":1},
            "rearLeft":{"sizex":1,"sizey":1,"posx":3,"posy":1},
            "rear":{"sizex":1,"sizey":1,"posx":2,"posy":0},
        }
        //光源位置，强度等预配置
        let lightsetup ={ 
            "frontLight":{"posx":0,"posy":0,"posz":0,"color":0x222222,"density":0.1},
            "sunlight":{"posx":0,"posy":4,"posz":-4,"color":0xFFFFFF,"density":0.7},
            "rightLight":{"posx":4,"posy":4,"posz":0,"color":0xFFFFFF,"density":0},
            "leftLight":{"posx":-4,"posy":4,"posz":0,"color":0xFFFFFF,"density":0},
            "leftheadlight":{"posx":0.806,"posy":0.79,"posz":3,"color":0xFFFFFF,"density":lightdense},
            "rightheadlight":{"posx":-0.806,"posy":0.79,"posz":3,"color":0xFFFFFF,"density":lightdense}
        }
        // 3D场景变量
        let streamingCanvas = null;
        let canvasContainer;  // 3D场景容器
        let ambientLight; //环境光初始化
        let sunlight; //日光初始化
        let mapData = null; // 存储地图数据
        let roadMeshes = []; // 存储道路网格
        let laneMarkMeshes = []; // 存储车道线网格
        let stopLineMeshes = []; // 存储停止线网格
        let landmarkMeshes = []; // 存储地面箭头网格
        let trafficLightMeshes = [];// 存储交通灯网格
        let dynamicTargetMeshes = []; // 新增: 存储动态目标物网格
        let dynamicTargetModel = null; // 新增: 存储动态目标物模型
        let isSceneInitialized = true;
        let trajectoryLine = null;  // 新增: 轨迹线
        let trajectoryPlane = null; // 新增: 轨迹平面
        let modelpath = "FrontEnd/ModelTemplate/";
        let egoname = "NIO_ES7"
        let viewSizeH = 0; //unit size of the viewport in horizontal direction
        let viewSizeV = 0; //unit size of the viewport in vertical direction
        let adascampara = { // adas camera property and installation specs
            "frontWide":    {'posx':0,'posy':1.45,'posz':1.18,'anglex':0,'angley':0,'anglez':0,'hfov':120,'vfov':40,'range':200},
            "frontNarrow":  {'posx':0.1,'posy':1.45,'posz':1.18,'anglex':0,'angley':0,'anglez':0,'hfov':30,'vfov':40,'range':400},
            "frontRight":   {'posx':-0.927,'posy':0.85,'posz':1.905,'anglex':0,'angley':-135,'anglez':0,'hfov':100,'vfov':60,'range':80},  // near the wheel, looking backwards
            "frontLeft":    {'posx':0.927,'posy':0.85,'posz':1.905,'anglex':0,'angley':135,'anglez':0,'hfov':100,'vfov':60,'range':80},
            "rearRight":    {'posx':-0.918,'posy':1.05,'posz':1.3656,'anglex':15,'angley':-50,'anglez':0,'hfov':100,'vfov':60,'range':80},
            "rearLeft":     {'posx':0.918,'posy':1.05,'posz':1.3656,'anglex':15,'angley':50,'anglez':0,'hfov':100,'vfov':60,'range':80},
            "rear":         {'posx':0,'posy':1.62,'posz':-0.88,'anglex':15,'angley':-180,'anglez':0,'hfov':100,'vfov':60,'range':80},
        }
        let cameraFrustums = [];  // array to contain all frustums of cameras
        let frustum_scale = 0.5; // 视锥长度缩放比例尺，进调整长度
        let lights = {};  //object to contain all the lights from scene
        let fatherwidth = 0; //父容器宽度
        let fatherheight = 0; //父容器高度
        let layoutdetail = {}; //具体带像素点为的视角画面布局
        let newmode = 0; //主视角模式，切换后的新模式
        let streetlighton = false;
        let pmremGenerator;
        // 添加一个全局变量控制录制模式
        let highQualityRecording = true;
        let taaPass = null;
        let cvContext;
        // 视频录制相关变量
        let tempRenderer = null; // 临时渲染器
        let tempComposer = null; // 临时 composer
        let isRecording = false; // 是否正在录制状态
        let recorder = null;
        let chunks = []; // 视频数据块
        let recordingStartTime = 0; // 录制开始时间初始化
        let maxRecordingTime = 300; // 最大录制时间(秒)，这里设置为5分钟
        let recordingCanvas = null;
        let recordingContext = null;
        let recordingInterval = null;
        let environmentlightdense ={ //不同时间段日光配置
            "day":{"ambient":0.3,"sunlight":0.8},
            "night":{"ambient":0.1,"sunlight":0.2}
        }
        let environmentlightrate ={ //不同天气下光线强度增益
            "rain":0.8,
            "sand":1,
            "snow":1.4,
            "fog":0.9,
            "normal":1,
        }
        let fovPerMode = {  // 不同视角的fov
            'free':75,
            'POV': 110, // 第一视角设置为180度
            'followRear':60,
            'followFixed':90,
            'birdView':120  // 新增第五种模式：鸟瞰视角
        };

        const keyStates = { // 键盘状态跟踪
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            f: false,
            q: false,
            j: false,
            x: false,
        };
        
        const UserInteraction = { //设定车速调整指令
            setSpeedUp:false,
            setSpeedDown:false,
        }

        const keyMap = {  // 键盘按键映射
            ArrowUp: 'key-up',
            ArrowDown: 'key-down',
            ArrowLeft: 'key-left',
            ArrowRight: 'key-right',
            f: 'key-f',
            q: 'key-q',
            j: 'key-j',
            x: 'key-x'
        };
        
        const SEND_INTERVAL = 200; // 发送周期，单位毫秒
                
        
        // 修改：键盘按下事件
        document.addEventListener('keydown', function(event) {
            if (keyMap.hasOwnProperty(event.key)) {
                event.preventDefault(); 
                if (!keyStates[event.key]) {
                    updateKeyState(event.key, true);
                }
            }
        });

        // 修改：键盘释放事件
        document.addEventListener('keyup', function(event) {
            if (keyMap.hasOwnProperty(event.key)) {
                event.preventDefault();
                updateKeyState(event.key, false);
            }
        });


        document.addEventListener('keydown', function(event) {
            const key =event.key;
            if (key ==="l"){
                headlighton = !headlighton;

            }
            if (headlighton){
                lightdense=10;
                // console.log(scene)
            }else{
                lightdense=0;
            }

        });

        document.addEventListener('keydown', function(event) {
            const key =event.key;
            if (key ==="r"){
                streetlighton = !streetlighton;
                streetlightswitch(streetlighton)
            }
        });

        document.addEventListener('keydown', function(event) {
            const key =event.key;
            if (key ==="h"){
                frostumshow = false;
            }else if(key ==="s"){
                frostumshow=true;
            }
        });
            
        // 添加键盘视角切换监听
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            switch(key) {
                case '1':
                    cameraMode = 'free';
                    break;
                case '2':
                    cameraMode = 'POV';
                    break;
                case '3':
                    cameraMode = 'followRear';
                    break;
                case '4':
                    cameraMode = 'followFixed';
                    break;
                case '5':
                    cameraMode = 'birdView';
                    break;
                default:
                    return; // 不是视角切换键，不处理
            }

            // 更新相机模式
            if (cameraMain) {
                cameraMain.fov = fovPerMode[cameraMode];
                cameraMain.updateProjectionMatrix();
                // setCameraHorizontalVerticalFOV(cameraMain, fovPerMode[cameraMode].h, fovPerMode[cameraMode].v, 0, 500)
                
            }
            console.log('相机模式切换为:', cameraMode, '视场角:', fovPerMode[cameraMode]);
        });

        window.addEventListener('resize', function() {
            if (canvasContainer) { // 添加此检查
                fatherwidth = canvasContainer.clientWidth;
                fatherheight = canvasContainer.clientHeight;

                cameraMain.aspect = fatherwidth / fatherheight;
                cameraMain.updateProjectionMatrix();

                renderer.setSize(fatherwidth/2, fatherheight);
                labelRenderer.setSize(fatherwidth/2, fatherheight);
            }
        });
        
        // 控制连接状态处理
        controlSocket.on('connect', () => {
            console.log('控制服务器已连接');
            const connectionStatus = document.getElementById('connection-status');
            if (connectionStatus) {
                connectionStatus.innerHTML = '<i class="fa fa-circle mr-2 text-green-500"></i>控制连接已建立';
                connectionStatus.className = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800';
            }
            
            // 启动控制数据发送
            if (!sendIntervalId) {
                sendIntervalId = setInterval(sendAllKeyStates, SEND_INTERVAL);
            }
        });

        controlSocket.on('disconnect', () => {
            console.log('控制服务器已断开');
            const connectionStatus = document.getElementById('connection-status');
            if (connectionStatus) {
                connectionStatus.innerHTML = '<i class="fa fa-circle mr-2 text-red-500"></i>控制连接已断开';
                connectionStatus.className = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800';
            }
            
            // 停止控制数据发送
            if (sendIntervalId) {
                clearInterval(sendIntervalId);
                sendIntervalId = null;
            }
        });

        controlSocket.on('matlab_data', (data) => {
            
            // 更新数据接收指示器
            const dataIndicator = document.getElementById('data-receive-indicator');
            dataIndicator.innerHTML = '<i class="fa fa-circle mr-2 text-green-500 animate-pulse"></i>正在接收数据';
            dataIndicator.className = 'ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800';
            
            // 3秒后恢复默认状态（表示最近接收过数据）
            clearTimeout(window.dataIndicatorTimeout);
            window.dataIndicatorTimeout = setTimeout(() => {
                dataIndicator.innerHTML = '<i class="fa fa-circle mr-2 text-green-500"></i>已接收数据';
                dataIndicator.className = 'ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800';
            }, 3000);
            
            // 更新最后更新时间
            const now = new Date();
            lastUpdateElement.textContent = `最后更新: ${now.toLocaleString()}`;

            // 新增：处理TLR.info数据
            if (data.TLR_info) {
                // 存储红绿灯状态
                if (!simulationState.trafficLights) {
                    simulationState.trafficLights = {};
                }
                
                // 更新每个红绿灯的状态
                data.TLR_info.forEach(tl => {
                    simulationState.trafficLights[tl.ID] = {
                        color: tl.color,
                        timer: tl.timer,
                        ID: tl.ID

                    };
                });
                
                // 更新红绿灯显示
                updateTrafficLights();
            }
            // 处理ADAS_info数据
            if (data.ADAS_info) {
                Object.keys(data.ADAS_info).forEach(key => {
                    updateDataField(key, data.ADAS_info[key]);
                });
                if(data.ADAS_info.LC_count>0 && data.ADAS_info.LC_stat ===2){
                    rightblinking = true;
                }else if(data.ADAS_info.LC_stat ===0){
                    rightblinking = false;
                }

                if(data.ADAS_info.LC_count<0 && data.ADAS_info.LC_stat ===2){
                    leftblinking = true;
                }else if(data.ADAS_info.LC_stat ===0){
                    leftblinking = false;
                }
                // console.log(data.ADAS_info.LC_count,data.ADAS_info.LC_stat,leftblinking)
                // console.log("rightblinking",rightblinking)
                // console.log("leftblinking",leftblinking)


            }
            if (data.CAL_PARA) {
                setspeedtodisp = data.CAL_PARA.set_speed;
                updateDataField('set-speed-value', setspeedtodisp);
            }

            
            if (data.joystick_button_states) {
                if(data.joystick_button_states.RightStick === 1 && lastRightStickState === 0){
                    camindex = camindex % 5 + 1;
                    joyviewchange(camindex);
                }
                lastRightStickState = data.joystick_button_states.RightStick;
                if(data.joystick_button_states.LeftStick === 1 && lastLeftStickState === 0){
                    
                    camindex = (camindex - 2 + 5) % 5 + 1;
                    joyviewchange(camindex);
                    
                }
                lastLeftStickState = data.joystick_button_states.LeftStick;

            }
            
            if (data.UICommand) {
                updateDataField('ACC_CMD', data.UICommand.Acc_cmd);
                updateDataField('TURN_CMD', data.UICommand.turn_cmd);
            }
            
            // 处理Veh_info数据
            if (data.Veh_info) {
                // 显示需要的字段
                updateDataField('velocity', data.Veh_info.velocity);
                updateDataField('rotation', data.Veh_info.rotation);
                updateDataField('V_center_rear', data.Veh_info.V_center_rear);
                
                if (simulationState && egoVehicleMesh) {
                    simulationState.egoVehicle.speed = data.Veh_info.velocity * 36; // 转换为km/h
                    simulationState.egoVehicle.heading = -data.Veh_info.rotation + gap_angle/(Math.PI/180);
                    simulationState.egoVehicle.rotation =  -data.Veh_info.rotation;
                    vehiclespeed = data.Veh_info.velocity;
                    steeringangle = data.Veh_info.angle;


                    simulationState.egoVehicle.z = -data.Veh_info.V_center_rear[1];
                    simulationState.egoVehicle.x = data.Veh_info.V_center_rear[0]; // 修复：将第二个x改为z
                    // 更新轨迹线
                    // updateTrajectoryLine(simulationState.x, 0, simulationState.z);
                    // simulationState.y = data.Veh_info.V_center_rear[1]*50;
                    // 这里可以根据需要更新更多车辆状态
                }
            }

            // 添加以下代码更新DynTar_info
            if (data.DynTar_info) {
                simulationState.DynTar_info = data.DynTar_info;
                // 遍历DynTar_info，更新其他车辆的位置
                Object.keys(data.DynTar_info).forEach(key => {
                    if(data.DynTar_info[key].heading === 90){
                        data.DynTar_info[key].heading = -90;
                    }
                    else if (data.DynTar_info[key].heading === -90){
                        data.DynTar_info[key].heading = 90;
                    }
                    // console.log(data.DynTar_info[key].speed);

                });

            }
            // 新增：处理Planning_info轨迹数据
            if (data.Planning_info && data.Planning_info.Trajectory) {
                simulationState.trajectory.bezierX = data.Planning_info.Trajectory.bezierX || [];
                simulationState.trajectory.bezierY = data.Planning_info.Trajectory.bezierY || [];
                if (data.Planning_info.trajmode === 1) {
                    updateTrajectory(data.ADAS_info.adas_stat);  // 调用更新轨迹函数
                }
                
            }
        });
        
        // 视觉连接状态处理
        visionSocket.on('connect', () => {
            console.log('视觉服务器已连接');
            const visionStatus = document.getElementById('vision-status');
            if (visionStatus) {
                visionStatus.innerHTML = '<i class="fa fa-eye mr-2 text-green-500"></i>视觉连接已建立';
                visionStatus.className = 'ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800';
            }
        });

        visionSocket.on('disconnect', () => {
            console.log('视觉服务器已断开');
            const visionStatus = document.getElementById('vision-status');
            if (visionStatus) {
                visionStatus.innerHTML = '<i class="fa fa-eye-slash mr-2 text-red-500"></i>视觉连接已断开';
                visionStatus.className = 'ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800';
            }
        });

        // 修改：处理检测结果
        visionSocket.on('detection_results', function(data) {
            console.log(data);
            if (data && data.timestamp > 0) {
                updateDataReceptionIndicator('vision-data-indicator');
                // 更新CV状态显示
                updateCVStatus(true);
                
                // 显示检测统计信息
                updateDetectionStats(data);
                
                // 在视频上绘制检测框
                drawDetections(data);
            } else {
                console.error('接收到无效的检测结果:', data);
                updateCVStatus(false);
            }
        });
        

        // 处理MATLAB数据

        document.addEventListener('DOMContentLoaded', function() {

            const style = document.createElement('style');
            style.textContent = `
                /* 数据接收指示器动画 */
                #vision-data-indicator {
                    transition: all 0.3s ease;
                }
                
                #vision-data-indicator.data-received i {
                    color: #4ade80; /* 绿色 */
                    animation: pulse 0.5s ease-in-out;
                }
                
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.3);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
            const radioButtons = document.querySelectorAll('input[name="cameraMode"]');
            radioButtons.forEach(button => {
                button.addEventListener('change', function() {
                    cameraMode = this.value;
                    // 切换模式时更新视场角
                    if (cameraMain) {
                        cameraMain.fov = fovPerMode[cameraMode];
                        cameraMain.updateProjectionMatrix();
                    }
                    console.log('相机模式切换为:', cameraMode, '视场角:', fovPerMode[cameraMode]);
                });
            });
                        
            const speedUpBtn = document.getElementById('speed-up');
            const speedDownBtn = document.getElementById('speed-down');
            
            const setSpeedValue = document.getElementById('set-speed-value');
            const currentSetSpeed = document.getElementById('current-set-speed');
            // 加速按钮事件监听
            speedUpBtn.addEventListener('mousedown', function() {
                UserInteraction.setSpeedUp = true;

            });
            speedUpBtn.addEventListener('mouseup', function() {
                UserInteraction.setSpeedUp = false;
            });

                    // 加速按钮事件监听
            speedDownBtn.addEventListener('mousedown', function() {
                UserInteraction.setSpeedDown = true;

            });
            speedDownBtn.addEventListener('mouseup', function() {
                UserInteraction.setSpeedDown = false;
            });

            const fileInput = document.getElementById('map-file');
            const fileStatus = document.getElementById('file-status');
            const fileSelection = document.getElementById('file-selection');
            
            const statusContainer = document.getElementById('connection-status').parentElement;
            if (!document.getElementById('vision-data-indicator')) {
                const visionIndicator = document.createElement('span');
                visionIndicator.id = 'vision-data-indicator';
                visionIndicator.className = 'ml-3 inline-flex items-center';
                visionIndicator.innerHTML = '<i class="fa fa-signal text-gray-500"></i>';
                statusContainer.appendChild(visionIndicator);
            }

            fileInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    if (file.name.endsWith('.json')) {
                        fileStatus.textContent = `正在加载文件: ${file.name}`;
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            try {
                                mapData = JSON.parse(e.target.result);
                                fileStatus.textContent = `文件加载成功: ${file.name}`;
                                fileSelection.style.display = 'none'; // 隐藏文件选择区域
                                init3DScene(); // 初始化3D场景
                                animate(); // 启动动画循环
                                isSceneInitialized = true;
                                console.log('3D场景初始化完成');

                            } catch (error) {
                                fileStatus.textContent = `文件解析错误: ${error.message}`;
                            }
                        };
                        reader.readAsText(file);
                    } else {
                        fileStatus.textContent = '请选择JSON格式的文件';
                    }
                }
            });
        });
        
        function updateDataReceptionIndicator(indicatorId) {
            const indicator = document.getElementById(indicatorId);
            if (indicator) {
                // 添加闪烁动画效果
                indicator.classList.add('data-received');
                
                // 移除动画类以便下次可以再次触发
                setTimeout(() => {
                    indicator.classList.remove('data-received');
                }, 500);
            }
        }

        // 初始化3D场景
        function init3DScene() {
            // 创建场景
            canvasContainer = document.getElementById('simulation-container');
            scene = new THREE.Scene();
            // scene.background = new THREE.Color(0xFFFFFF);
            // 创建相机
            cameraMain = new THREE.PerspectiveCamera(fovPerMode[cameraMode], (canvasContainer.clientWidth/2) / canvasContainer.clientHeight, 0.1, 1000);
            
            cameraMain.layers.enable(1); // 主相机启用图层1
            cameraMain.layers.enable(2); // 主相机启用图层2
            cameraMain.layers.enable(3); // 主相机启用图层2
            // 设置初始相机位置 - 朝向x正方向
            cameraMain.position.set(0, 15, 20); // 调整位置
            cameraMain.lookAt(new THREE.Vector3(10, 0, 0)); // 朝向x轴正方向
            
            // 创建渲染器 - 增强渲染质量
            renderer = new THREE.WebGLRenderer({
                antialias: true,
                precision: 'highp', // 使用高精度渲染
                alpha: true,
                stencil: true,
                depth: true,
                powerPreference: 'high-performance',
                preserveDrawingBuffer: true // 保留绘制缓冲区以便高质量捕获
            });

            // 增加渲染器的物理像素比例以匹配显示器
            renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio*1.2);
            // 改进渲染器设置
            renderer.physicallyCorrectLights = true; // 启用物理正确光照
            renderer.outputEncoding = THREE.sRGBEncoding; // 设置输出编码
            renderer.toneMapping = THREE.ACESFilmicToneMapping; // 启用电影级色调映射
            renderer.toneMappingExposure = 1; // 稍微增加曝光以提高亮度
            renderer.shadowMap.enabled = true; // 启用阴影
            renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 使用柔和阴影
            const shadowMaterial = new THREE.ShadowMaterial();
            shadowMaterial.opacity = 1; // 增大此值使阴影更暗（范围0-1）
            renderer.shadowMap.autoUpdate = true; // 自动更新阴影
            renderer.shadowMap.needsUpdate = true; // 确保阴影更新
            renderer.shadowMap.verbose = false; // 生产环境设为false
            // 提升材质质量
            renderer.localClippingEnabled = true; // 启用局部裁剪
            canvasContainer.appendChild(renderer.domElement);

            // 调用函数获取信息
            // const rendererInfo = getRendererInfo();
            // 新增：创建CSS2D渲染器用于文本 - 修复作用域问题
            labelRenderer = new THREE.CSS2DRenderer(); // 移除let关键字，使其成为全局变量
            labelRenderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
            labelRenderer.domElement.style.position = 'absolute';
            labelRenderer.domElement.style.top = '0px';
            labelRenderer.domElement.style.pointerEvents = 'none'; // 允许鼠标事件穿透
            canvasContainer.appendChild(labelRenderer.domElement);

            fatherwidth = canvasContainer.clientWidth;
            fatherheight = canvasContainer.clientHeight;
            viewSizeH = fatherwidth/4; // 调整视口大小，避免重叠
            viewSizeV = fatherheight/4; // 调整视口大小，避免重叠

            determineviewunitsize()

                // 改进后处理效果
            const renderScene = new THREE.RenderPass(scene, cameraMain);
            const bloomPass = new THREE.UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                1.0,  // 调整强度
                0.4,  // 半径
                0.85  // 阈值
            );

            composer = new THREE.EffectComposer(renderer);
            composer.addPass(renderScene);
            // composer.addPass(fxaaPass);
            composer.addPass(bloomPass);
            
            // 添加环境光
            ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5); // 暗蓝色环境光，强度0.7
            scene.add(ambientLight);
            
            setbackground('dayscene.hdr')

            controls = new THREE.OrbitControls(cameraMain, renderer.domElement);
            controls.enableDamping = true; // 启用阻尼效果
            controls.dampingFactor = 0.25; // 阻尼系数
            controls.enableZoom = true; // 启用缩放
            controls.enablePan = true; // 添加此行以启用鼠标拖拽平移
            controls.panSpeed = 1.0; // 设置平移速度（可选）

            // 加载环境模型
            const envpath = modelpath+'exported_map.glb';
            loadModel(envpath,"environment",new THREE.Vector3(0, 0, 0), 1,new THREE.Vector3(0, 0, 0)); 
            // 创建自车模型

            const egoPath = modelpath+egoname+'.glb';
            loadModel(egoPath,"ego_car",new THREE.Vector3(egosetup[egoname].posx, egosetup[egoname].posy, egosetup[egoname].posz), egosetup[egoname].scale,new THREE.Vector3(egosetup[egoname].rotationx, egosetup[egoname].rotationy, egosetup[egoname].rotationz)); 
            wheelradius = egosetup[egoname].wheelsize;

            const targetPath = modelpath+'targetcar.glb';
            loadModel(targetPath,"target_car",new THREE.Vector3(0,0,0),0.8,new THREE.Vector3(0,0,0));
            createlight("frontLight");
            createlight("sunlight");
            createlight("leftheadlight")
            createlight("rightheadlight")

            // 初始化增强的下雨效果
            createEnhancedRainEffect();
            createSnowEffectEnhanced(); // 初始化雪天特效
            createSandEffectEnhanced(); // 初始化沙尘特效
            createFogEffect();  // 初始化雾天特效
            setDayMode(); // 初始化天气
            
            // 添加特殊天气模式切换按钮事件监听
            document.getElementById('toggle-special-weather').addEventListener('click',function(){toggleSpecialWeather();});
            document.getElementById('weather-rain').addEventListener('click', function() { setSpecialWeatherMode('rain'); });
            document.getElementById('weather-snow').addEventListener('click', function() { setSpecialWeatherMode('snow'); });
            document.getElementById('weather-sand').addEventListener('click', function() { setSpecialWeatherMode('sand'); });
            document.getElementById('weather-fog').addEventListener('click', function() { setSpecialWeatherMode('fog'); });
            document.getElementById('day-mode').addEventListener('click', function() { setDayMode(); });
            document.getElementById('night-mode').addEventListener('click', function() { setNightMode(); });


            const camPath = modelpath+'CAM.glb';
            const camscale = 0.5;
                        // 创建摄像头模型
            Object.keys(adascampara).forEach((key,value) => {
                const caminfo = adascampara[key]
                const camname = key
                loadModel(camPath,camname, new THREE.Vector3(caminfo.posx, caminfo.posy, caminfo.posz), camscale, new THREE.Vector3(caminfo.anglex, 90+caminfo.angley, caminfo.anglez));
                createvirtualCameras(camname);

            })

            initCameraFrustums(); // 初始化触感器视锥
            createTrajectoryLine(); // 创建轨迹线

            // 初始化视频录制功能，创建空canvas，创建按钮状态
            initVideoStreaming();
            initCVDisplay();
        }



        function animate() {
            requestAnimationFrame(animate);
            // 更新控制器
            controls.update();
            // adasControls.update();
            // 更新车辆位置
            updateVehiclePositions();
            wheelspin();
            steeringspin();
            // 转向灯闪烁逻辑
            if (leftblinking === true) {
                const currentTime = Date.now();
                // 检查是否达到闪烁间隔时间
                if (currentTime - leftlastBlinkTime >= BLINK_INTERVAL) {
                    // 切换闪烁状态
                    leftblinkState = !leftblinkState;

                    leftlastBlinkTime = currentTime;

                    
                    // 根据闪烁状态调用相应的函数
                    if (leftblinkState) {

                        leftblinkeron();
                    } else {
                        leftblinkeroff();

                    }
                }
                } else {
                    // 当blinking为0时，确保转向灯熄灭
                    leftblinkeroff();

                    // 重置闪烁状态，以便下次blinking为1时从头开始
                    leftblinkState = false;
                    leftlastBlinkTime = 0;
                }

            if (rightblinking === true) {
                const currentTime = Date.now();
                // 检查是否达到闪烁间隔时间
                if (currentTime - rightlastBlinkTime >= BLINK_INTERVAL) {
                    // 切换闪烁状态
                    rightblinkState = !rightblinkState;
                    rightlastBlinkTime = currentTime;
                    
                    // 根据闪烁状态调用相应的函数
                    if (rightblinkState) {
                        rightblinkeron();
                    } else {
                        rightblinkeroff();

                    }

                }
            } else {
                // 当blinking为0时，确保转向灯熄灭
                rightblinkeroff();
                // 重置闪烁状态，以便下次blinking为1时从头开始
                rightblinkState = false;
                rightlastBlinkTime = 0;
            }

            
            updateEnhancedRainEffect();

            // 更新其他天气效果
            updateSnowEffectEnhanced();

            updateSandEffectEnhanced();

            // 先渲染3D场景
            renderer.setScissorTest(true);
            renderer.setViewport(0,0, fatherwidth/2, fatherheight);
            renderer.setScissor(0,0, fatherwidth/2, fatherheight);

            if(frostumshow){
                cameraMain.layers.enable(2); 
            }else{
                cameraMain.layers.disable(2);
            }

            composer.render(); // 使用composer渲染主视图
            renderviewport("frontWide");
            
            renderviewport("frontNarrow");
            renderviewport("rearLeft");
            // renderviewport("rearRight");
            // renderviewport("frontRight");
            // renderviewport("frontLeft");
            // renderviewport("rear");
            renderer.setScissorTest(false);
            

            // 再渲染CSS标签
            labelRenderer.render(scene, cameraMain);
            
            // 添加：如果正在录制，渲染到录制canvas
            renderForStreaming();
        }
        
        // 修改initCVDisplay函数，在新区域创建检测相关元素
        function initCVDisplay() {
            // 在状态显示区域添加CV状态指示
            const statusContainer = document.getElementById('connection-status').parentElement;
            const cvStatus = document.createElement('span');
            cvStatus.id = 'cv-status';
            cvStatus.className = 'ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800';
            cvStatus.innerHTML = '<i class="fa fa-eye mr-2 text-gray-500"></i>CV未连接';
            statusContainer.appendChild(cvStatus);
            
            // 添加检测结果统计信息面板
            const statsPanel = document.createElement('div');
            statsPanel.id = 'detection-stats';
            statsPanel.innerHTML = 'CV状态: 等待连接...<br>检测到车辆: 0<br>检测到车道线: 0';
            
            // 获取新的CV视频容器
            const cvContainer = document.getElementById('cv-video-container');
            
            // 移除之前可能添加到simulation-container的statsPanel
            const oldStatsPanel = document.querySelector('#simulation-container #detection-stats');
            if (oldStatsPanel) {
                oldStatsPanel.remove();
            }
            
            // 将统计面板添加到新容器
            cvContainer.appendChild(statsPanel);
            
            // 设置样式
            statsPanel.style.position = 'absolute';
            statsPanel.style.top = '10px';
            statsPanel.style.right = '10px';
            statsPanel.style.padding = '10px';
            statsPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            statsPanel.style.color = 'white';
            statsPanel.style.borderRadius = '5px';
            statsPanel.style.fontSize = '12px';
            statsPanel.style.zIndex = '10';
            
            // 创建检测框覆盖层
            const overlay = document.createElement('canvas');
            overlay.id = 'detection-overlay';
            overlay.width = streamingCanvas ? streamingCanvas.width : 2560;
            overlay.height = streamingCanvas ? streamingCanvas.height : 1440;
            
            // 设置overlay样式
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.zIndex = '50';
            overlay.style.pointerEvents = 'none';
            
            // 移除之前可能存在的overlay
            const oldOverlay = document.querySelector('#simulation-container #detection-overlay');
            if (oldOverlay) {
                oldOverlay.remove();
            }
            
            // 将overlay添加到新容器
            cvContainer.appendChild(overlay);
            
            // 确保CV容器有相对定位
            cvContainer.style.position = 'relative';
            
            // 创建用于显示视频流的元素
            const videoDisplay = document.createElement('canvas');
            videoDisplay.id = 'streaming-display-canvas';
            videoDisplay.width = streamingCanvas ? streamingCanvas.width : 2560;
            videoDisplay.height = streamingCanvas ? streamingCanvas.height : 1440;
            videoDisplay.style.position = 'absolute';
            videoDisplay.style.top = '0';
            videoDisplay.style.left = '0';
            videoDisplay.style.width = '100%';
            videoDisplay.style.height = '100%';
            videoDisplay.style.objectFit = 'contain';
            videoDisplay.style.zIndex = '1';
            
            cvContainer.appendChild(videoDisplay);
            
            // 修改视频流渲染逻辑，将帧绘制到显示canvas
            window.updateStreamingDisplay = function() {
                const displayCanvas = document.getElementById('streaming-display-canvas');
                if (displayCanvas && streamingCanvas) {
                    const displayCtx = displayCanvas.getContext('2d');
                    displayCtx.drawImage(streamingCanvas, 0, 0, displayCanvas.width, displayCanvas.height);
                }
            };

            // // 创建视频显示canvas
            // cvDisplayCanvas = document.createElement('canvas');
            // cvDisplayCanvas.id = 'cv-display-canvas';
            // cvDisplayCanvas.width = 1280;
            // cvDisplayCanvas.height = 720;
            // cvDisplayCanvas.style.width = '100%';
            // cvDisplayCanvas.style.height = '100%';
            // cvDisplayCanvas.style.objectFit = 'contain';
            // cvContainer.appendChild(cvDisplayCanvas);
            
            // cvContext = cvDisplayCanvas.getContext('2d');
            
            // // 初始显示提示信息
            // cvContext.fillStyle = '#333';
            // cvContext.fillRect(0, 0, cvDisplayCanvas.width, cvDisplayCanvas.height);
            // cvContext.fillStyle = '#fff';
            // cvContext.font = '16px Arial';
            // cvContext.textAlign = 'center';
            // cvContext.fillText('等待视频流...', cvDisplayCanvas.width / 2, cvDisplayCanvas.height / 2);
        }


        // 新增: 更新CV状态显示
        function updateCVStatus(isActive) {
            const cvStatus = document.getElementById('cv-status');
            // console.log(cvStatus)
            if (cvStatus) {
                if (isActive) {
                    cvStatus.className = 'ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800';
                    cvStatus.innerHTML = '<i class="fa fa-eye mr-2 text-green-500"></i>CV运行中';
                } else {
                    cvStatus.className = 'ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800';
                    cvStatus.innerHTML = '<i class="fa fa-eye-slash mr-2 text-red-500"></i>CV未响应';
                }
            }
        }
        
        // // 新增: 更新检测统计信息
        // function updateDetectionStats(data) {
        //     const statsPanel = document.getElementById('detection-stats');
        //     if (statsPanel && data) {
        //         const vehicleCount = data.detections ? data.detections.length : 0;
        //         const timestamp = new Date(data.timestamp || Date.now()).toLocaleTimeString();
                
        //         let statsHTML = `CV状态: 正常<br>`;
        //         statsHTML += `检测到车辆: ${vehicleCount}<br>`;
        //         statsHTML += `最后更新: ${timestamp}`;
                
        //         if (vehicleCount > 0) {
        //             // 按置信度排序并显示最确定的3个检测结果
        //             const topDetections = [...data.detections]
        //                 .sort((a, b) => b.confidence - a.confidence)
        //                 .slice(0, 3);
                    
        //             topDetections.forEach((det, index) => {
        //                 statsHTML += `<br>${index + 1}. ${det.class} (${(det.confidence * 100).toFixed(0)}%)`;
        //             });
        //         }
                
        //         statsPanel.innerHTML = statsHTML;
        //     }
        // }
        
        function updateDetectionStats(data) {
            const statsPanel = document.getElementById('detection-stats');
            if (statsPanel && data) {
                const vehicleCount = data.vehicle_detections ? data.vehicle_detections.detections.length : 0;
                const laneCount = data.lane_detections ? data.lane_detections.lanes.length : 0;
                const timestamp = new Date(data.timestamp || Date.now()).toLocaleTimeString();
                
                let statsHTML = `CV状态: 正常<br>`;
                statsHTML += `检测到车辆: ${vehicleCount}<br>`;
                statsHTML += `检测到车道线: ${laneCount}<br>`;
                statsHTML += `最后更新: ${timestamp}`;
                
                if (vehicleCount > 0) {
                    // 按置信度排序并显示最确定的3个检测结果
                    const topDetections = [...data.vehicle_detections.detections]
                        .sort((a, b) => b.confidence - a.confidence)
                        .slice(0, 3);
                    
                    topDetections.forEach((det, index) => {
                        statsHTML += `<br>${index + 1}. ${det.class} (${(det.confidence * 100).toFixed(0)}%)`;
                    });
                }
                
                statsPanel.innerHTML = statsHTML;
            }
        }
                
        // // 新增: 在视频上绘制检测框
        // function drawDetections(detections) {
        //     const overlay = document.getElementById('detection-overlay');
        //     if (!overlay || !detections) return;
            
        //     const ctx = overlay.getContext('2d');
        //     const simContainer = document.getElementById('cv-video-container');
            
        //     // 清除之前的绘制
        //     ctx.clearRect(0, 0, overlay.width, overlay.height);
            
        //     // 计算视频流到显示区域的缩放比例
        //     const containerRect = simContainer.getBoundingClientRect();
        //     const scaleX = containerRect.width / overlay.width;
        //     const scaleY = containerRect.height / overlay.height;
        //     const scale = Math.min(scaleX, scaleY);
            
        //     // 计算居中位置偏移
        //     const offsetX = (containerRect.width - (overlay.width * scale)) / 2;
        //     const offsetY = (containerRect.height - (overlay.height * scale)) / 2;
            
        //     // 更新overlay的尺寸和位置以匹配视频显示
        //     overlay.style.width = `${overlay.width * scale}px`;
        //     overlay.style.height = `${overlay.height * scale}px`;
        //     overlay.style.left = `${offsetX}px`;
        //     overlay.style.top = `${offsetY}px`;
            
        //     // 绘制所有检测框
        //     detections.forEach(detection => {
        //         const { x1, y1, x2, y2 } = detection.bbox;
        //         const { class: className, confidence } = detection;
                
        //         // 设置绘制样式
        //         ctx.strokeStyle = '#ff0000';
        //         ctx.lineWidth = 2;
        //         ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
                
        //         // 绘制检测框
        //         ctx.beginPath();
        //         ctx.rect(x1, y1, x2 - x1, y2 - y1);
        //         ctx.fill();
        //         ctx.stroke();
                
        //         // 绘制标签
        //         ctx.fillStyle = '#ff0000';
        //         ctx.font = '12px Arial';
        //         const labelText = `${className} (${(confidence * 100).toFixed(0)}%)`;
        //         const textWidth = ctx.measureText(labelText).width;
                
        //         ctx.fillRect(x1, y1 - 18, textWidth + 8, 18);
        //         ctx.fillStyle = '#ffffff';
        //         ctx.fillText(labelText, x1 + 4, y1 - 6);
        //     });
        // }
            

        // 新增: 在视频上绘制检测框和车道线
        function drawDetections(data) {
            const overlay = document.getElementById('detection-overlay');
            if (!overlay || !data) return;
            
            const ctx = overlay.getContext('2d');
            const simContainer = document.getElementById('cv-video-container');
            
            // 清除之前的绘制
            ctx.clearRect(0, 0, overlay.width, overlay.height);
            
            // 计算视频流到显示区域的缩放比例
            const containerRect = simContainer.getBoundingClientRect();
            const scaleX = containerRect.width / overlay.width;
            const scaleY = containerRect.height / overlay.height;
            const scale = Math.min(scaleX, scaleY);
            
            // 计算居中位置偏移
            const offsetX = (containerRect.width - (overlay.width * scale)) / 2;
            const offsetY = (containerRect.height - (overlay.height * scale)) / 2;
            
            // 更新overlay的尺寸和位置以匹配视频显示
            overlay.style.width = `${overlay.width * scale}px`;
            overlay.style.height = `${overlay.height * scale}px`;
            overlay.style.left = `${offsetX}px`;
            overlay.style.top = `${offsetY}px`;
            
            // 绘制车辆检测框
            if (data.vehicle_detections.detections && data.vehicle_detections.detections.length > 0) {
                data.vehicle_detections.detections.forEach(detection => {
                    const { x1, y1, x2, y2 } = detection.bbox;
                    const { class: className, confidence } = detection;
                    
                    // 设置绘制样式 - 车辆检测框使用红色
                    ctx.strokeStyle = '#ff0000';
                    ctx.lineWidth = 2;
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
                    
                    // 绘制检测框
                    ctx.beginPath();
                    ctx.rect(x1, y1, x2 - x1, y2 - y1);
                    ctx.fill();
                    ctx.stroke();
                    
                    // 绘制标签
                    ctx.fillStyle = '#ff0000';
                    ctx.font = '12px Arial';
                    const labelText = `${className} (${(confidence * 100).toFixed(0)}%)`;
                    const textWidth = ctx.measureText(labelText).width;
                    
                    ctx.fillRect(x1, y1 - 18, textWidth + 8, 18);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(labelText, x1 + 4, y1 - 6);
                });
            }
            
            // 绘制车道线
            if (data.lane_detections.lanes && data.lane_detections.lanes.length > 0) {
                data.lane_detections.lanes.forEach((lane, index) => {
                    // console.log(lane)
                    // 修改后的代码
                    if (lane.start && lane.end) {
                        // 设置车道线绘制样式 - 使用蓝色虚线
                        ctx.strokeStyle = '#0000ff';
                        ctx.lineWidth = 3;
                        ctx.setLineDash([5, 5]); // 设置虚线样式
                        
                        ctx.beginPath();
                        // 从起点移动到终点绘制一条直线
                        ctx.moveTo(lane.start.x, lane.start.y);
                        ctx.lineTo(lane.end.x, lane.end.y);
                        
                        ctx.stroke();
                        ctx.setLineDash([]); // 重置为实线
                    }
                });
            }
        }
        
        // 修改initVideoStreaming函数
        function initVideoStreaming() {
            console.log("初始化视频流传输功能");
            // 创建用于视频流的canvas
            streamingCanvas = document.createElement('canvas');
            streamingCanvas.width = 1280;
            streamingCanvas.height = 720;
            streamingCanvas.style.display = 'none'; // 隐藏这个canvas
            document.body.appendChild(streamingCanvas);
            // 添加这行初始化streamingContext
            streamingContext = streamingCanvas.getContext('2d');
            try {
                // 创建临时渲染器
                tempRenderer = new THREE.WebGLRenderer();
                tempRenderer.setSize(streamingCanvas.width, streamingCanvas.height);
                tempRenderer.setPixelRatio(window.devicePixelRatio);
                tempRenderer.setClearColor(0x000000, 1.0);
                tempRenderer.toneMapping = THREE.ACESFilmicToneMapping;
                tempRenderer.toneMappingExposure = renderer.toneMappingExposure;
                tempRenderer.shadowMap.enabled = renderer.shadowMap.enabled;
                tempRenderer.shadowMap.type = renderer.shadowMap.type;
                
                // 创建临时的EffectComposer，使用frontWide摄像头
                tempComposer = new THREE.EffectComposer(tempRenderer);
                
                // 复制主composer的pass设置，但使用frontWide摄像头
                const renderScene = new THREE.RenderPass(scene, virtualcameras['frontWide']);
                const bloomPass = new THREE.UnrealBloomPass(
                    new THREE.Vector2(streamingCanvas.width, streamingCanvas.height),
                    1.5,  // 强度
                    0.4,  // 半径
                    0.85  // 阈值
                );
                
                tempComposer.addPass(renderScene);
                tempComposer.addPass(bloomPass);
                
                // 启动定时发送视频帧到服务器
                startVideoStreaming();
                
            } catch (error) {
                console.error('视频流初始化失败:', error);
            }
            console.log("初始化视频流完成");
        }

        // 修改startVideoStreaming函数
        function startVideoStreaming() {
            // 设置发送间隔（每100ms发送一帧）
            const frameInterval = 200; // 每100ms发送一帧
            const frameSender = setInterval(() => {
                if (visionSocket.connected && streamingCanvas) {
                    try {
                        // // 捕获并发送视频帧
                        const imageData = streamingCanvas.toDataURL('image/jpeg', 0.8);
                        visionSocket.emit('video_frame', {
                            frame: imageData,
                            timestamp: Date.now()
                        });
                        // // 同时在本地显示原始视频帧
                        // if (cvContext) {
                        //     const img = new Image();
                        //     img.onload = function() {
                        //         // 清除画布并绘制新图像
                        //         cvContext.clearRect(0, 0, cvDisplayCanvas.width, cvDisplayCanvas.height);
                        //         cvContext.drawImage(img, 0, 0, cvDisplayCanvas.width, cvDisplayCanvas.height);
                        //     };
                        //     img.src = imageData;
                        // }
                        // 修改视频流渲染逻辑，将帧绘制到显示canvas
                        // window.updateStreamingDisplay = function() {
                        const displayCanvas = document.getElementById('streaming-display-canvas');
                        if (displayCanvas && streamingCanvas) {
                            const displayCtx = displayCanvas.getContext('2d');
                            displayCtx.drawImage(streamingCanvas, 0, 0, displayCanvas.width, displayCanvas.height);
                        }
                        // };
                    } catch (error) {
                        console.error('发送视频帧失败:', error);
                    }
                }
            }, frameInterval);
        }

        // 添加停止视频流的函数（如果需要的话）
        function stopVideoStreaming() {
            if (videoStreamInterval) {
                clearInterval(videoStreamInterval);
                videoStreamInterval = null;
            }
            
            // 清理临时渲染器
            if (tempRenderer) {
                tempRenderer.dispose();
                tempRenderer = null;
            }
            if (tempComposer) {
                tempComposer.dispose();
                tempComposer = null;
            }
        }
        // 修改renderForRecording函数为renderForStreaming，确保使用frontWide摄像头
        function renderForStreaming() {
            if (!streamingCanvas || !streamingContext || !tempComposer || !virtualcameras || !virtualcameras['frontWide']) return;
            
            // 确保临时composer使用的是frontWide摄像头
            const renderPass = tempComposer.passes.find(pass => pass instanceof THREE.RenderPass);
            if (renderPass) {
                renderPass.camera = virtualcameras['frontWide'];
            }
            
            // 使用临时composer直接从frontWide摄像头渲染场景
            tempComposer.render();
            
            // 将临时渲染器的canvas内容绘制到streamingCanvas
            streamingContext.drawImage(
                tempRenderer.domElement, 
                0, 0, 
                streamingCanvas.width, 
                streamingCanvas.height
            );
        }
