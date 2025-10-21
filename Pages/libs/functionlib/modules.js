function setbackground(Name) {
    new THREE.RGBELoader()
        .setPath('FrontEnd/Pictures/')
        .load(
            Name, 
            function (texture) {
                // 直接使用纹理，不使用 PMREMGenerator
                texture.mapping = THREE.EquirectangularReflectionMapping;
                scene.environment = texture;
                scene.background = texture;
            },
            undefined,
            function (error) {
                console.error('加载 HDR 纹理时出错:', error);
            }
        );

}

// 设置白天环境
function setDayMode() {
    // 更新按钮样式
    current_time = "day";
    document.getElementById('day-mode').classList.add('bg-blue-600', 'text-white');
    document.getElementById('day-mode').classList.remove('bg-white', 'text-gray-700');
    document.getElementById('night-mode').classList.add('bg-white', 'text-gray-700');
    document.getElementById('night-mode').classList.remove('bg-blue-600', 'text-white');
    setbackground('dayscene.hdr')
    setlight();
    setweather();
}
// 设置夜晚环境
function setNightMode() {
    // 设置夜晚光照
    current_time = "night";
    // 更新按钮样式
    document.getElementById('night-mode').classList.add('bg-blue-600', 'text-white');
    document.getElementById('night-mode').classList.remove('bg-white', 'text-gray-700');
    document.getElementById('day-mode').classList.add('bg-white', 'text-gray-700');
    document.getElementById('day-mode').classList.remove('bg-blue-600', 'text-white');
    setbackground('nightscene.hdr')            
    setlight();
    setweather();
}

function setlight(){
    // console.log('setting the light to',current_time,currentSpecialWeather,isSpecialWeatherEnabled)

    if (isSpecialWeatherEnabled){
        // 设置白天光照
        if (ambientLight) {
            ambientLight.intensity = environmentlightdense[current_time].ambient*environmentlightrate[currentSpecialWeather]; // 明亮的环境光
            ambientLight.color.set(0xFFFFFF); // 白色环境光
        }
        
        if (lights['sunlight']) {
            lights['sunlight'].intensity = environmentlightdense[current_time].sunlight*environmentlightrate[currentSpecialWeather]; // 强烈的日光
            if (currentSpecialWeather === 'sand'){
                lights['sunlight'].color.set(0xffd700); // 阳光偏黄
            }else{
                lights['sunlight'].color.set(0xFFFFFF); // 白色日光
            }
            lights['sunlight'].position.set(0, 100, 0); // 调整日光位置
        }
    }else{
        // 设置夜晚光照
        if (ambientLight) {
            ambientLight.intensity = environmentlightdense[current_time].ambient; // 明亮的环境光
            ambientLight.color.set(0xFFFFFF); // 白色环境光
        }
        
        if (lights['sunlight']) {
            lights['sunlight'].intensity = environmentlightdense[current_time].sunlight; // 强烈的日光
            lights['sunlight'].color.set(0xFFFFFF); // 白色日光
            lights['sunlight'].position.set(0, 90, 0); // 调整日光位置
        }
    }
}

function setweather(){
    if (!isSpecialWeatherEnabled) {
        // 关闭所有特殊天气效果
        if (rainGroup){
            rainGroup.visible = false;
            // console.log("rainGroup is ",rainGroup)
        };
        if (snowGroup) snowGroup.visible = false;
        if (sandGroup) sandGroup.visible = false;
        if (fogPass) fogPass.enabled = false;
        // 如果使用的是内置雾效果
        if (scene.fog) scene.fog.isFog = false;
    }else{
        if (currentSpecialWeather === 'fog' ||currentSpecialWeather === 'sand' ){
            if (fogPass) fogPass.enabled= true;
            if (scene.fog) scene.fog.isFog = true;
        }else{
            if (fogPass) fogPass.enabled = false;
            if (scene.fog) scene.fog.isFog = false;
        }
        // 根据当前选择的特殊天气模式设置效果可见性
        if (rainGroup) rainGroup.visible = currentSpecialWeather === 'rain';
        if (snowGroup) snowGroup.visible = currentSpecialWeather === 'snow';
        if (sandGroup) sandGroup.visible = currentSpecialWeather === 'sand';
    }
}

// 特殊天气总开关函数
function toggleSpecialWeather() {
    isSpecialWeatherEnabled = !isSpecialWeatherEnabled;
    console.log("specialweather is ",isSpecialWeatherEnabled)
    // 根据是否开启特殊天气和当前选择的特殊天气模式更新效果可见性
    const specialWeatherButton = document.getElementById('toggle-special-weather');
    if (specialWeatherButton) {
        if (isSpecialWeatherEnabled) {
            specialWeatherButton.textContent = '关闭特殊天气';
            specialWeatherButton.classList.remove('bg-blue-600');
            specialWeatherButton.classList.add('bg-red-600');
        } else {
            specialWeatherButton.textContent = '开启特殊天气';
            specialWeatherButton.classList.remove('bg-red-600');
            specialWeatherButton.classList.add('bg-blue-600');
        }
    }

    setlight();
    setweather();
}

// 设置特殊天气模式函数
function setSpecialWeatherMode(mode) {
    currentSpecialWeather = mode;
    
    // 更新按钮样式
    document.getElementById('weather-rain').className = mode === 'rain' ? 
        'px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-lg' : 
        'px-3 py-1 text-xs font-medium text-white bg-gray-600 rounded-lg';
    document.getElementById('weather-snow').className = mode === 'snow' ? 
        'px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-lg' : 
        'px-3 py-1 text-xs font-medium text-white bg-gray-600 rounded-lg';
    document.getElementById('weather-sand').className = mode === 'sand' ? 
        'px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-lg' : 
        'px-3 py-1 text-xs font-medium text-white bg-gray-600 rounded-lg';
    document.getElementById('weather-fog').className = mode === 'fog' ? 
        'px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-lg' : 
        'px-3 py-1 text-xs font-medium text-white bg-gray-600 rounded-lg';
    
    // 更新天气效果可见性
    setlight();
    setweather();
}
// 创建增强版下雪效果
function createSnowEffectEnhanced() {
    snowGroup = new THREE.Group();
    scene.add(snowGroup);
    
    const particleCount = 15000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const rotations = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // 随机位置
        positions[i3] = (Math.random() - 0.5) * 300;
        positions[i3 + 1] = Math.random() * 100;
        positions[i3 + 2] = (Math.random() - 0.5) * 300;
        
        // 根据高度调整速度（增加真实感）
        const heightFactor = positions[i3 + 1] / 100;
        velocities[i3] = (Math.random() - 0.5) * 0.08 * (0.5 + heightFactor * 0.5); // 水平飘动
        velocities[i3 + 1] = -Math.random() * 0.12 - 0.03; // 下落速度
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.08 * (0.5 + heightFactor * 0.5); // 水平飘动
        
        // 随机大小（模拟不同大小的雪花）
        sizes[i] = 0.2 + Math.random() * 0.8;
        
        // 随机旋转角度
        rotations[i] = Math.random() * Math.PI * 2;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1));
    
    // 使用带透明度渐变的纹理和自定义着色器提升真实感
    const material = new THREE.ShaderMaterial({
        uniforms: {
            snowTexture: {
                value: new THREE.TextureLoader().load('FrontEnd/Pictures/snow.png')
            },
            // 添加时间 uniform，从 JavaScript 传递时间值
            time: {
                value: 0.0
            }
        },
        vertexShader: `
            uniform float time;
            attribute vec3 velocity;
            attribute float size;
            attribute float rotation;
            varying float vRotation;
            
            void main() {
                vRotation = rotation;
                
                // 应用速度（使用时间因子增加飘动效果）
                vec3 newPosition = position;
                
                // 添加雪花旋转效果
                float windStrength = 0.5 + sin(time * 0.1) * 0.2;
                newPosition.x += velocity.x + sin(time * 0.5 + position.z) * 0.02;
                newPosition.y += velocity.y;
                newPosition.z += velocity.z + cos(time * 0.3 + position.x) * 0.02;
                
                // 透视大小调整
                vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D snowTexture;
            varying float vRotation;
            
            void main() {
                // 应用旋转到纹理坐标
                vec2 rotatedUV = vec2(
                    cos(vRotation) * (gl_PointCoord.x - 0.5) + sin(vRotation) * (gl_PointCoord.y - 0.5) + 0.5,
                    -sin(vRotation) * (gl_PointCoord.x - 0.5) + cos(vRotation) * (gl_PointCoord.y - 0.5) + 0.5
                );
                
                // 采样纹理并应用透明度
                vec4 textureColor = texture2D(snowTexture, rotatedUV);
                gl_FragColor = vec4(1.0, 1.0, 1.0, textureColor.a * 0.9);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    snowParticles = new THREE.Points(geometry, material);
    snowGroup.add(snowParticles);
    snowGroup.visible = false; // 初始隐藏
}

// 更新增强版下雪效果
function updateSnowEffectEnhanced() {
    if (!snowParticles || !snowGroup.visible) return;

        // 更新时间 uniform
    snowParticles.material.uniforms.time.value = performance.now() * 0.001;
    
    const positions = snowParticles.geometry.getAttribute('position').array;
    const velocities = snowParticles.geometry.getAttribute('velocity').array;
    
    const time = performance.now() * 0.001;
    const windStrength = 0.5 + Math.sin(time * 0.1) * 0.2;
    
    for (let i = 0; i < positions.length; i += 3) {
        const i3 = i / 3;
        
        // 应用基础速度
        positions[i] += velocities[i3 * 3] * 0.8;
        positions[i + 1] += velocities[i3 * 3 + 1];
        positions[i + 2] += velocities[i3 * 3 + 2] * 0.8;
        
        // 添加动态风力效果
        const windOffset = Math.sin(time * 0.2 + i3 * 0.1) * 0.02 * windStrength;
        positions[i] += windOffset;
        
        // 模拟雪花的不规则飘动
        const flutter = Math.sin(time * 0.5 + positions[i] * 0.1) * 0.005;
        positions[i + 2] += flutter;
        
        // 如果粒子落到地面以下，重置位置到上方随机位置
        if (positions[i + 1] < 0) {
            positions[i] = (Math.random() - 0.5) * 300;
            positions[i + 1] = 100 + Math.random() * 50;
            positions[i + 2] = (Math.random() - 0.5) * 300;
        }
    }
    
    // 标记属性需要更新
    snowParticles.geometry.getAttribute('position').needsUpdate = true;
}

// 创建沙尘效果
function createSandEffectEnhanced() {
    sandGroup = new THREE.Group();
    scene.add(sandGroup);
    
    // 创建多层沙尘效果，增加层次感
    const layers = 5;
    const particleCountPerLayer = 10000;
    
    for (let layer = 0; layer < layers; layer++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCountPerLayer * 3);
        const velocities = new Float32Array(particleCountPerLayer * 3);
        const sizes = new Float32Array(particleCountPerLayer);
        const opacities = new Float32Array(particleCountPerLayer);
        
        // 每层的高度范围
        const heightMin = layer * 10;
        const heightMax = (layer + 1) * 10;
        
        // 每层的速度和大小随高度变化
        const speedFactor = 0.5 + layer * 0.2; // 上层风速更大
        const sizeFactor = 0.3 + layer * 0.05; // 上层颗粒更小
        
        for (let i = 0; i < particleCountPerLayer; i++) {
            const i3 = i * 3;
            
            // 随机位置
            positions[i3] = (Math.random() - 0.5) * 400;
            positions[i3 + 1] = heightMin + Math.random() * (heightMax - heightMin);
            positions[i3 + 2] = (Math.random() - 0.5) * 400;
            
            // 随机速度（水平飘动为主，上层速度更大）
            velocities[i3] = (Math.random() - 0.5) * 0.3 * speedFactor;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.03;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.3 * speedFactor;
            
            // 根据高度和层级调整大小
            const heightRatio = (positions[i3 + 1] - heightMin) / (heightMax - heightMin);
            sizes[i] = 0.1 + Math.random() * 0.3 * sizeFactor * (1 - heightRatio * 0.8);
            
            // 根据高度调整透明度
            opacities[i] = 0.3 + Math.random() * 0.3 * (1 - heightRatio * 0.3);
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
        
        // 使用自定义着色器和纹理提升真实感
        const material = new THREE.ShaderMaterial({
            uniforms: {
                sandtexture: {
                    value: new THREE.TextureLoader().load('FrontEnd/Pictures/sand.png')
                },
                sandColor: {
                    value: new THREE.Color(layer === 0 ? 0xd2b48c : layer === 1 ? 0xd4a66a : 0xd8b365)
                },        // 添加时间 uniform，从 JavaScript 传递时间值
                time: {
                    value: 0.0
                }
            },
            vertexShader: `
                uniform float time;
                attribute vec3 velocity;
                attribute float size;
                attribute float opacity;
                varying float vOpacity;
                
                void main() {
                    vOpacity = opacity;
                    
                    // 应用速度（使用时间因子增加动态效果）
                    vec3 newPosition = position;

                    
                    // 添加风力效果
                    float windIntensity = 0.5 + sin(time * 0.05) * 0.2;
                    float windDirection = sin(time * 0.02) * 0.5 + 0.5;
                    
                    newPosition.x += velocity.x * windIntensity + windDirection * 0.02;
                    newPosition.y += velocity.y;
                    newPosition.z += velocity.z * windIntensity;
                    
                    // 添加上升和下降的热气流效果
                    float thermalEffect = sin(time * 0.01 + position.x * 0.01) * 0.003;
                    newPosition.y += thermalEffect;
                    
                    // 透视大小调整
                    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
                    gl_PointSize = size * (100.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D sandtexture;
                uniform vec3 sandColor;
                varying float vOpacity;
                
                void main() {
                    vec4 textureColor = texture2D(sandtexture, gl_PointCoord);
                    // 混合沙尘颜色和纹理，添加一些随机性
                    float random = fract(sin(gl_FragCoord.x * 12.9898 + gl_FragCoord.y * 78.233) * 43758.5453);
                    vec3 finalColor = sandColor * (0.9 + random * 0.2);
                    gl_FragColor = vec4(finalColor, textureColor.a * vOpacity);
                }
            `,
            transparent: false,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const layerParticles = new THREE.Points(geometry, material);
        sandGroup.add(layerParticles);
        
        // 存储每层的粒子对象，便于后续更新
        if (!sandParticles) sandParticles = [];
        sandParticles.push(layerParticles);
    }
    
    sandGroup.visible = false; // 初始隐藏
}

// 更新增强版沙尘效果
function updateSandEffectEnhanced() {
    if (!sandParticles || !sandGroup.visible) return;

    // sandParticles.material.uniforms.time.value = performance.now() * 0.001;
    const time = performance.now() * 0.001;
    const windIntensity = 0.5 + Math.sin(time * 0.05) * 0.2;
    const windDirection = Math.sin(time * 0.02) * 0.5 + 0.5;

    // 遍历所有层
    for (let layer = 0; layer < sandParticles.length; layer++) {
        const particles = sandParticles[layer];
        particles.material.uniforms.time.value = time;
        const positions = particles.geometry.getAttribute('position').array;
        const velocities = particles.geometry.getAttribute('velocity').array;
        
        // 每层的高度范围和特性
        const heightMin = layer * 10;
        const heightMax = (layer + 1) * 10;
        const speedFactor = 0.5 + layer * 0.2;
        
        for (let i = 0; i < positions.length; i += 3) {
            const i3 = i / 3;
            
            // 应用速度，上层速度更快
            positions[i] += velocities[i3 * 3] * speedFactor * 0.8;
            positions[i + 1] += velocities[i3 * 3 + 1];
            positions[i + 2] += velocities[i3 * 3 + 2] * speedFactor * 0.8;
            
            // 添加整体风向
            positions[i] += windDirection * 0.02 * speedFactor;
            
            // 添加热气流效果
            const thermalEffect = Math.sin(time * 0.01 + positions[i] * 0.01) * 0.003 * speedFactor;
            positions[i + 1] += thermalEffect;
            
            // 限制在高度范围内
            if (positions[i + 1] < heightMin) positions[i + 1] = heightMin;
            if (positions[i + 1] > heightMax) positions[i + 1] = heightMax;
            
            // 如果粒子飞出边界，重置位置
            if (Math.abs(positions[i]) > 200 || Math.abs(positions[i + 2]) > 200) {
                // 从相反方向重新进入
                if (positions[i] > 200) positions[i] = -200;
                else if (positions[i] < -200) positions[i] = 200;
                if (positions[i + 2] > 200) positions[i + 2] = -200;
                else if (positions[i + 2] < -200) positions[i + 2] = 200;
            }
        }
        
        // 标记属性需要更新
        particles.geometry.getAttribute('position').needsUpdate = true;
    }
}

// 创建雾天效果
function createFogEffect() {
    // 使用后处理效果实现雾天
    if (typeof THREE.AfterimagePass !== 'undefined') {
        fogUniforms = {
            tDiffuse: { value: null },
            fogDensity: { value: 0.03 },
            fogColor: { value: new THREE.Vector3(0.8, 0.8, 0.8) },
            fogNear: { value: 10.0 },
            fogFar: { value: 100.0 }
        };
        const fogShader = {
            uniforms: fogUniforms,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float fogDensity;
                uniform vec3 fogColor;
                uniform float fogNear;
                uniform float fogFar;
                varying vec2 vUv;
                
                void main() {
                    float depth = gl_FragCoord.z / gl_FragCoord.w;
                    float fogFactor = smoothstep(fogNear, fogFar, depth);
                    vec4 color = texture2D(tDiffuse, vUv);
                    gl_FragColor = mix(color, vec4(fogColor, 1.0), fogFactor * fogDensity);
                }
            `
        };
        
        fogPass = new THREE.ShaderPass(fogShader);
        fogPass.enabled = false; // 初始禁用
        
        // 添加到后处理通道
        if (composer) {
            composer.addPass(fogPass);
        }
    } else {
        // 如果没有后处理，使用Three.js内置的雾效果
        scene.fog = new THREE.Fog(0x888888, 20, 100);
        scene.fog.density = 0.01;
        scene.fog.isFog = false; // 初始禁用
    }
}
        
// 增强版下雨效果：添加雨滴拖尾
function createEnhancedRainEffect() {
    // 创建粒子组
    rainGroup = new THREE.Group();
    scene.add(rainGroup);
    
    // 雨滴数量 - 扩大一倍
    const particleCount = 12000;
    
    // 创建几何体（使用线段代替点来模拟拖尾）
    const geometry = new THREE.BufferGeometry();
    // 每条线段需要2个点，所以总点数是particleCount * 2
    const positions = new Float32Array(particleCount * 2 * 3);
    const colors = new Float32Array(particleCount * 2 * 3); // 用于透明度渐变
    
    // 创建速度数组
    const velocities = new Float32Array(particleCount * 3);
    
    // 设置粒子位置、颜色和速度
    for (let i = 0; i < particleCount; i++) {
        const i6 = i * 6;
        const i3 = i * 3;
        
        // 随机位置（扩大一倍面积：从±100改为±200）
        const x = (Math.random() - 0.5) * 400; // 扩大一倍
        const y = Math.random() * 50;
        const z = (Math.random() - 0.5) * 400; // 扩大一倍
        
        // 设置线段的两个点（上端点和下端点）
        positions[i6] = x;
        positions[i6 + 1] = y;
        positions[i6 + 2] = z;
        positions[i6 + 3] = x;
        positions[i6 + 4] = y - 0.5; // 下端点比上端点低一些
        positions[i6 + 5] = z;
        
        // 设置颜色渐变：上端点更透明，下端点更不透明
        // 上端点颜色
        colors[i6] = 0.8; // R
        colors[i6 + 1] = 0.9; // G
        colors[i6 + 2] = 1.0; // B
        // 下端点颜色
        colors[i6 + 3] = 0.8; // R
        colors[i6 + 4] = 0.9; // G
        colors[i6 + 5] = 1.0; // B
        
        // 设置雨滴速度
        velocities[i3] = (Math.random() - 0.5) * 2;
        velocities[i3 + 1] = -10 - Math.random() * 5;
        velocities[i3 + 2] = (Math.random() - 0.5) * 2;
    }
    
    // 设置几何体属性
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // 创建材质 - 使用更高级的材质实现更好的视觉效果
    const material = new THREE.LineBasicMaterial({
        vertexColors: true, // 使用顶点颜色
        transparent: true,
        opacity: 0.8,
        linewidth: 1.5 // 稍微增加线宽
    });
    
    // 创建线段系统
    rainParticles = new THREE.LineSegments(geometry, material);
    rainGroup.add(rainParticles);
    
    // 保存速度数组以供更新使用
    rainParticles.userData.velocities = velocities;
    
    // 初始隐藏
    rainGroup.visible = false;
}

// 高级下雨效果实现
function createAdvancedRainEffect() {
    // 创建粒子组
    rainGroup = new THREE.Group();
    scene.add(rainGroup);
    
    // 雨滴数量
    const particleCount = 12000;
    
    // 创建几何体
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);
    
    // 创建速度数组
    const velocities = new Float32Array(particleCount * 3);
    
    // 设置粒子位置、大小、透明度和速度
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // 随机位置（扩大后的范围）
        const x = (Math.random() - 0.5) * 400;
        const y = Math.random() * 50;
        const z = (Math.random() - 0.5) * 400;
        
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        
        // 设置大小
        sizes[i] = 0.5 + Math.random() * 0.5;
        
        // 设置透明度
        alphas[i] = 0.4 + Math.random() * 0.6;
        
        // 设置速度
        velocities[i3] = (Math.random() - 0.5) * 2;
        velocities[i3 + 1] = -10 - Math.random() * 5;
        velocities[i3 + 2] = (Math.random() - 0.5) * 2;
    }
    
    // 设置几何体属性
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    
    // 创建自定义着色器材质
    const material = new THREE.ShaderMaterial({
        uniforms: {
            color: { value: new THREE.Color(0x88aaff) },
            raintexture: { value: new THREE.TextureLoader().load('FrontEnd/Pictures/rain.png') }, // 需要准备雨滴纹理
            cameraNear: { value: camera.near },
            cameraFar: { value: camera.far },
            time: {value: 0.0}
        },
        vertexShader: `
            uniform float time;
            attribute float size;
            attribute float alpha;
            varying float vAlpha;
            void main() {
                vAlpha = alpha;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (50.0 / -mvPosition.z); // 透视大小调整
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            uniform sampler2D raintexture;
            varying float vAlpha;
            void main() {
                gl_FragColor = vec4(color, vAlpha) * texture2D(raintexture, gl_PointCoord);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false
    });
    
    // 创建点系统
    rainParticles = new THREE.Points(geometry, material);
    rainGroup.add(rainParticles);
    
    // 保存速度数组以供更新使用
    rainParticles.userData.velocities = velocities;
    
    // 初始隐藏
    rainGroup.visible = false;
}

// 更新增强版下雨效果
function updateEnhancedRainEffect() {
    if (!rainParticles || !rainGroup.visible) return;
    
    const positions = rainParticles.geometry.getAttribute('position').array;
    const velocities = rainParticles.userData.velocities;
    
    // 更新每个雨滴线段的位置
    for (let i = 0; i < velocities.length; i += 3) {
        const i6 = i * 2;
        
        // 应用速度到线段的两个点
        positions[i6] += velocities[i] * 0.1; // 上端点X
        positions[i6 + 1] += velocities[i + 1] * 0.1; // 上端点Y
        positions[i6 + 2] += velocities[i + 2] * 0.1; // 上端点Z
        
        positions[i6 + 3] = positions[i6]; // 下端点X与上端点相同
        positions[i6 + 4] = positions[i6 + 1] - 0.5; // 下端点Y比上端点低一些
        positions[i6 + 5] = positions[i6 + 2]; // 下端点Z与上端点相同
        
        // 如果雨滴落到地面以下，重置到上方（扩大后的范围）
        if (positions[i6 + 1] < 0) {
            const x = (Math.random() - 0.5) * 200; // 扩大一倍的重置范围
            const y = Math.random() * 50;
            const z = (Math.random() - 0.5) * 200; // 扩大一倍的重置范围
            
            positions[i6] = x;
            positions[i6 + 1] = y;
            positions[i6 + 2] = z;
            positions[i6 + 3] = x;
            positions[i6 + 4] = y - 0.5;
            positions[i6 + 5] = z;
        }
    }
    
    // 标记属性需要更新
    rainParticles.geometry.getAttribute('position').needsUpdate = true;
}


function updateDataField(key, value) {   // 更新数据字段和进度条
    const element = document.getElementById(key);
    if (element) {
        // 添加数值变化动画 - 仅保留缩放效果，移除颜色变化
        element.classList.add('scale-110');
        setTimeout(() => {
            element.classList.remove('scale-110');
        }, 300);
        
        // 状态映射字典：数字值转文字描述
        const stateMappings = {
            adas_stat: {
                0: "未激活",
                1: "L2功能激活",
                2: "记忆行车激活"
            },
            Map_state: {
                0: "未加载",
                1: "部分覆盖",
                2: "完全覆盖",
                3: "可进行定位",
                4: "融合定位成功"
            }
        };

        // 格式化显示值
        let displayValue = value;

        // 应用状态映射（如果存在）
        if (stateMappings.hasOwnProperty(key)) {
            displayValue = stateMappings[key][value] !== undefined ? 
                stateMappings[key][value] : 
                `未知(${value})`;
        } else if (Array.isArray(value)) {
            displayValue = `[${value[0].toFixed(2)}, ${value[1].toFixed(2)}]`;
        } else if (typeof value === 'number') {
            displayValue = value.toFixed(2);
        }
                
        // 更新数值
        element.textContent = displayValue;
    }
    // 仪表盘数据更新
if (key === 'velocity') {
    // 车速转换为km/h并更新速度表
    const speedKmH = (value * 20 * 3.6).toFixed(0);
    const speedValueEl = document.getElementById('speed-value');
    if (speedValueEl) speedValueEl.textContent = speedKmH;
    // 更新速度表圆环
    const maxSpeed = 120; // 最大显示速度120km/h
    const percentage = Math.min(100, (speedKmH / maxSpeed) * 100);
    const circumference = 283; // 2 * Math.PI * 45
    const offset = circumference - (percentage / 100) * circumference;
    const speedGaugeEl = document.getElementById('speed-gauge');
    document.getElementById('speed-gauge').style.strokeDashoffset = offset;
    if (speedGaugeEl) {
        speedGaugeEl.style.strokeDashoffset = offset;
        // 改变颜色 based on speed
        if (speedKmH > 80) {
            speedGaugeEl.style.stroke = '#ef4444';
        } else if (speedKmH > 40) {
            speedGaugeEl.style.stroke = '#f59e0b';
        } else {
            speedGaugeEl.style.stroke = '#3b82f6';
        }
    }
    // 更新转向灯状态
    if (value > 0) {
        const rightIndicatorEl = document.getElementById('right-indicator');
        const leftIndicatorEl = document.getElementById('left-indicator');
        if (rightIndicatorEl) rightIndicatorEl.style.backgroundColor = '#3b82f6';
        if (leftIndicatorEl) leftIndicatorEl.style.backgroundColor = '#e5e7eb';
    } else if (value < 0) {
        const leftIndicatorEl = document.getElementById('left-indicator');
        const rightIndicatorEl = document.getElementById('right-indicator');
        if (leftIndicatorEl) leftIndicatorEl.style.backgroundColor = '#3b82f6';
        if (rightIndicatorEl) rightIndicatorEl.style.backgroundColor = '#e5e7eb';
    } else {
        const leftIndicatorEl = document.getElementById('left-indicator');
        const rightIndicatorEl = document.getElementById('right-indicator');
        if (leftIndicatorEl) leftIndicatorEl.style.backgroundColor = '#e5e7eb';
        if (rightIndicatorEl) rightIndicatorEl.style.backgroundColor = '#e5e7eb';
    }
} else if (key === 'adas_stat') {
    // 更新ADAS状态灯
    const adasStatusEl = document.getElementById('adas-status');
    if (adasStatusEl) {
        if (value == 1) {
            adasStatusEl.style.backgroundColor = '#71E959';
        } else if (value == 2) {
            adasStatusEl.style.backgroundColor = '#57EBEB';
        } else {
            adasStatusEl.style.backgroundColor = '#DAE3F3';
        }
    }
} else if (key === 'Map_state') {
// 更新定位状态灯
    const mapStatusEl = document.getElementById('Map-status');
    if (mapStatusEl) {
        if (value === 3) {
            mapStatusEl.style.backgroundColor = '#6BB5AD';
        } else if (value === 4) {
            mapStatusEl.style.backgroundColor = '#92D050';
        } else {
            mapStatusEl.style.backgroundColor = '#E63A3A';
        }
    }
}
}

// 修改：发送键盘状态到控制服务器
function sendAllKeyStates() {
    if (controlSocket.connected) {
        controlSocket.emit('keyboard_event', {
            ArrowUp: keyStates.ArrowUp,
            ArrowDown: keyStates.ArrowDown,
            ArrowLeft: keyStates.ArrowLeft,
            ArrowRight: keyStates.ArrowRight,
            f: keyStates.f,
            q: keyStates.q,
            j: keyStates.j,
            x: keyStates.x,
            setspeedup: UserInteraction.setSpeedUp,
            setspeeddown: UserInteraction.setSpeedDown,
        });
    }
}

function updateKeyState(key, pressed) {
    if (keyMap.hasOwnProperty(key)) {
        keyStates[key] = pressed;
        document.getElementById(keyMap[key]).style.background = pressed ? '#00f0ff' : '#333';
    }
}

// 初始化相机视锥
function initCameraFrustums() {
    // 清空现有视锥
    if (cameraFrustums && cameraFrustums.length > 0) {
        cameraFrustums.forEach(item => {
            if (item.frustum && item.frustum.parent === scene) {
                scene.remove(item.frustum);
            }
        });
    }

    cameraFrustums = [];
    // 相机和颜色配置
    const cameraConfigs = [
        { camera: virtualcameras["frontWide"], color: 0xff0000 },  // 红色
        { camera: virtualcameras["frontNarrow"], color: 0x00ff00 },// 绿色
        { camera: virtualcameras["frontRight"], color: 0x00ffff }, // 蓝色
        { camera: virtualcameras["frontLeft"], color: 0x00ffff },  // 黄色
        { camera: virtualcameras["rear"], color: 0xff00ff },       // 品红
        { camera: virtualcameras["rearLeft"], color: 0x00ffff },   // 青色
        { camera: virtualcameras["rearRight"], color: 0x00ffff }   // 橙色
    ];


    cameraConfigs.forEach(config => {
        if (config.camera) {
            const frustum = createCameraFrustum(config.camera, config.color);

            if (frustum && frustum.frustum) {
                frustum.frustum.layers.set(2); // 确保设置为图层2
                scene.add(frustum.frustum);
                cameraFrustums.push(frustum);
            }
        }
    });

    // createCameraCheckboxes();
}
      
// 路灯开关
function streetlightswitch(streetlighton){
    Object.keys(roadlights).forEach(key => {
        if (streetlighton){
            roadlights[key].intensity = 80;
        }else{
                roadlights[key].intensity = 0;
            }
    });
}

// 批量创建虚拟相机
function createvirtualCameras(name){
    virtualcameras[name] = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.05, 1000);
    virtualcameras[name].fovx=adascampara[name].hfov;
    virtualcameras[name].fovy=adascampara[name].vfov;
    virtualcameras[name].tags=name;
    virtualcameras[name].far = adascampara[name].range;
    virtualcameras[name].layers.enable(1); // 前视图相机启用图层1
    virtualcameras[name].layers.disable(2); // 前视图相机启用图层2
    virtualcameras[name].layers.disable(3); // 前视图相机启用图层2
}

// 创建相机视锥函数
function createCameraFrustum(camera, color = 0xff0000) {
    // 创建视锥几何体

    const fov = THREE.MathUtils.degToRad(camera.fov);
    const fovX = THREE.MathUtils.degToRad(camera.fovx);
    const fovY = THREE.MathUtils.degToRad(camera.fovy);


    const near = camera.near;
    const far = frustum_scale*camera.far; // 使用固定长度而不是相机的far值

    // 计算视锥的顶点
    const halfHeightNear = Math.tan(fovY / 2) * near;
    const halfWidthNear = Math.tan(fovX / 2) * near;
    const halfHeightFar = Math.tan(fovY / 2) * far;
    const halfWidthFar = Math.tan(fovX / 2) * far;
    

    // 创建顶点数组
    const vertices = [
        // 近裁剪面
        -halfWidthNear, -halfHeightNear, -near,
        halfWidthNear, -halfHeightNear, -near,
        halfWidthNear, halfHeightNear, -near,
        -halfWidthNear, halfHeightNear, -near,

        // 远裁剪面
        -halfWidthFar, -halfHeightFar, -far,
        halfWidthFar, -halfHeightFar, -far,
        halfWidthFar, halfHeightFar, -far,
        -halfWidthFar, halfHeightFar, -far
    ];

    // 创建面索引（添加填充面）
    const indices = [
        // 近裁剪面
        0, 1, 2,
        2, 3, 0,

        // // 远裁剪面
        // 4, 5, 6,
        // 6, 7, 4,

        // 四个侧面
        0, 1, 5,
        5, 4, 0,

        1, 2, 6,
        6, 5, 1,

        2, 3, 7,
        7, 6, 2,

        3, 0, 4,
        4, 7, 3
    ];


    // 创建几何体
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    // 创建线框材质
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: color,
        opacity: 0.4,
        transparent: true,
        wireframe: true
    });

    // 创建填充材质
    const fillMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });

    // 创建线框网格和填充网格
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
    const fillMesh = new THREE.Mesh(geometry, fillMaterial);
    wireframeMesh.layers.set(2); // 使用图层2
    fillMesh.layers.set(2); // 使用图层2

    // 创建组来包含线框和填充
    const frustum = new THREE.Group();
    frustum.add(wireframeMesh);
    frustum.add(fillMesh);

    frustum.layers.set(2); // 使用图层2

    return { camera, frustum };
}

        function createTrajectoryLine(targetScene = scene) { // 创建轨迹线
            // 创建轨迹线几何体
            trajectoryPoints = [];
            trajectoryGeometry = new THREE.BufferGeometry();
            trajectoryGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(1000 * 3), 3));
            
            // 创建轨迹线材质 - 设置为蓝色荧光效果
            const trajectoryMaterial = new THREE.LineBasicMaterial({
                color: 0x00f0ff,
                linewidth: 30,
                transparent: true,
                opacity: 0.8
            });
            
            // 创建轨迹线对象
            trajectoryLine = new THREE.Line(trajectoryGeometry, trajectoryMaterial);
            scene.add(trajectoryLine);
        }

        function joyviewchange(mode){
            switch(mode) {
                case 1:
                    cameraMode = 'free';
                    break;
                case 2:
                    cameraMode = 'POV';
                    break;
                case 3:
                    cameraMode = 'followRear';
                    break;
                case 4:
                    cameraMode = 'followFixed';
                    break;
                case 5:
                    cameraMode = 'birdView';
                    break;
                default:
                    return; // 不是视角切换键，不处理
            }

            // 更新相机模式
            if (cameraMain) {
                cameraMain.fov = fovPerMode[cameraMode];
                cameraMain.updateProjectionMatrix();
            }
            console.log('相机模式切换为:', cameraMode, '视场角:', fovPerMode[cameraMode]);
        }
        
// 新增：更新轨迹线和平面的函数
function updateTrajectory(adas_stat) {

    const { bezierX, bezierY } = simulationState.trajectory;

    const egoX = simulationState.egoVehicle.x || 0;
    const egoY = -simulationState.egoVehicle.z || 0;
    const rotation = simulationState.egoVehicle.rotation * Math.PI/180|| 0
    // const egoHeading = -simulationState.egoVehicle.heading * Math.PI/180|| 0; // 弧度值
    const egoHeading = rotation;

    // 清除旧的轨迹线和平面
    if (trajectoryLine) {
        scene.remove(trajectoryLine);
    }
    if (trajectoryPlane) {
        scene.remove(trajectoryPlane);
    }

    // 检查轨迹数据是否有效
    if (!bezierX || !bezierY || bezierX.length !== bezierY.length || bezierX.length === 0) {
        return;
    }
    // 获取轨迹起点
    const startX = bezierX[0];
    const startY = bezierY[0];

    // 创建轨迹线
    const points = [];
    for (let i = 0; i < bezierX.length; i++) {
        // 计算相对于起点的坐标
        const relX = bezierX[i] - startX;
        const relY = bezierY[i] - startY;
        
        // 应用旋转 (围绕起点)
        const rotatedX = relX * Math.cos(egoHeading) - relY * Math.sin(egoHeading);
        const rotatedY = relX * Math.sin(egoHeading) + relY * Math.cos(egoHeading);
        
        // 转换到世界坐标系 (加上自车位置)
        const worldX = rotatedX + startX + egoX;
        const worldY = rotatedY + startY + egoY;
        
        // y投影为-z
        points.push(new THREE.Vector3(worldX, 0.2, -worldY));
    }

    switch (adas_stat) {
        case 0:
            plancolor = "#DAE3F3";
            break;
        case 1:
            plancolor = "#71E959";
            break;
        case 2:
            plancolor = "#57EBEB";
            break;
    }


    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({ color: plancolor, linewidth: 2 });
    trajectoryLine = new THREE.Line(lineGeometry, lineMaterial);

    scene.add(trajectoryLine);

    // // 为ADAS场景添加相同的轨迹线
    // const adasLine = trajectoryLine.clone();
    // adasLine.name = 'trajectoryLineADAS';
    // adasScene.add(adasLine);

    // 创建轨迹平面
    // 创建轨迹平面 - 平行于xz平面
    const planePoints = [];
    for (let i = 0; i < points.length; i++) {
        // 获取当前点和下一个点以计算方向
        const currentPoint = points[i];
        const nextPoint = i < points.length - 1 ? points[i + 1] : points[i];
        
        // 计算轨迹方向向量
        const direction = new THREE.Vector3().subVectors(nextPoint, currentPoint).normalize();
        
        // 计算垂直于轨迹方向的向量(在xz平面上)
        const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x).normalize();
        
        // 计算平面宽度的一半(2)
        const halfWidth = 1;
        
        // 在当前点两侧创建平面顶点
        const leftPoint = new THREE.Vector3().copy(currentPoint).add(perpendicular.clone().multiplyScalar(-halfWidth));
        const rightPoint = new THREE.Vector3().copy(currentPoint).add(perpendicular.clone().multiplyScalar(halfWidth));
        
        planePoints.push(leftPoint, rightPoint);
    }

    // 创建平面几何体
    const planeGeometry = new THREE.BufferGeometry();
    const vertices = [];

    // 创建三角形面
    for (let i = 0; i < planePoints.length - 2; i += 2) {
        // 第一个三角形
        vertices.push(planePoints[i].x, planePoints[i].y, planePoints[i].z);
        vertices.push(planePoints[i + 1].x, planePoints[i + 1].y, planePoints[i + 1].z);
        vertices.push(planePoints[i + 2].x, planePoints[i + 2].y, planePoints[i + 2].z);
        
        // 第二个三角形
        vertices.push(planePoints[i + 1].x, planePoints[i + 1].y, planePoints[i + 1].z);
        vertices.push(planePoints[i + 3].x, planePoints[i + 3].y, planePoints[i + 3].z);
        vertices.push(planePoints[i + 2].x, planePoints[i + 2].y, planePoints[i + 2].z);
    }

    planeGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: plancolor,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });
    trajectoryPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    trajectoryPlane.layers.set(3)
    scene.add(trajectoryPlane);
}

function renderviewport(Name){
    renderer.setViewport(layoutdetail[Name].posx,layoutdetail[Name].posy,layoutdetail[Name].sizex,layoutdetail[Name].sizey);
    renderer.setScissor(layoutdetail[Name].posx,layoutdetail[Name].posy,layoutdetail[Name].sizex,layoutdetail[Name].sizey);

    const cam = virtualcameras[Name]
    if (cam === cameraMain){
        if(frostumshow){
            cam.layers.enable(2);
        }else{
            cam.layers.disable(2);
        }
        cam.layers.enable(1); // 渲染后禁用，防止影响其他相机
    }
    else{
        cam.layers.enable(1);
        cam.layers.disable(2);
        cam.layers.disable(3);
    }
    renderer.clear();
    renderer.render(scene, cam);
}

function determineviewunitsize(){
    Object.keys(pagelayoutscale).forEach((value,key) => {
        
        const unit = Math.min(pagelayoutscale[value].sizex*viewSizeH/adascampara[value].hfov,pagelayoutscale[value].sizey*viewSizeV/adascampara[value].vfov);
        const sizex = unit*adascampara[value].hfov;
        const sizey = unit*adascampara[value].vfov;
        const posx = pagelayoutscale[value].posx*viewSizeH;
        const posy = pagelayoutscale[value].posy*viewSizeV;
        
        const labelposy = posy;
        layoutdetail[value] = {
            "sizex":sizex,
            "sizey":sizey,
            "posx":posx,
            "posy":posy,
            "labelposy":labelposy,
        }
        // console.log("round finished")
    });
    // console.log(layoutdetail);
};

function createlight(lightname){
    if (lightname === "frontLight"){
        lights[lightname] = new THREE.RectAreaLight(lightsetup[lightname].color, lightsetup[lightname].density * 1, 2, 2);
        lights[lightname].position.set(lightsetup[lightname].posx, lightsetup[lightname].posy+10, lightsetup[lightname].posz);
        lights[lightname].lookAt(0, 0, 0); // 指向原点（车辆位置）

        scene.add(lights[lightname]);
        // scene.add(lights[lightname].target);


    }else if(lightname === "leftheadlight" || lightname === "rightheadlight") {
        lights[lightname] = new THREE.SpotLight(lightsetup[lightname].color, lightsetup[lightname].density);
        lights[lightname].position.set(lightsetup[lightname].posx, lightsetup[lightname].posy, lightsetup[lightname].posz);
        lights[lightname].lookAt(0, 0, 0); // 指向原点（车辆位置）
        scene.add(lights[lightname]);
        scene.add(lights[lightname].target);
        // 设置灯光锥和有限照明距离
        lights[lightname].angle = Math.PI / 9; // 约30度的光束角度
        lights[lightname].penumbra = 0.2; // 边缘模糊度
        lights[lightname].distance = 200; // 照明距离（单位与场景一致）
        lights[lightname].decay = 2; // 距离衰减率，符合真实物理
    }else if(lightname === "sunlight"){
        lights[lightname]= new THREE.DirectionalLight(lightsetup[lightname].color, 0.6);
        lights[lightname].position.set(lightsetup[lightname].posx, lightsetup[lightname].posy, lightsetup[lightname].posz); // 前上方位置
        lights[lightname].target.position.set(0, 0, 0); // 指向原点（车辆位置）
        lights[lightname].castShadow = true;
        lights['sunlight'].shadow.mapSize.width = 4096;
        lights['sunlight'].shadow.mapSize.height = 4096;
        lights['sunlight'].shadow.camera.near = 0.5;
        lights['sunlight'].shadow.camera.far = 400;
        lights['sunlight'].shadow.bias = -0.0001;
        lights['sunlight'].shadow.shadowDarkness = 0.7;

        const d = 50;
        lights['sunlight'].shadow.camera.left = -d;
        lights['sunlight'].shadow.camera.right = d;
        lights['sunlight'].shadow.camera.top = d;
        lights['sunlight'].shadow.camera.bottom = -d;
        scene.add(lights[lightname]);
        // scene.add(lights[lightname].target);
    }

}

// 修改loadModel函数定义，添加rotation参数
function loadModel(filePath,filetype, position = new THREE.Vector3(0, 0, 0), scaleFactor = 3, rotation = new THREE.Vector3(0, 0, 0)) {
    const loader = new THREE.GLTFLoader();
    loader.load(filePath, (gltf) => {
        // 添加新模型
        const newModel = gltf.scene;
        newModel.type = filetype;
        // 设置模型到图层1
        newModel.traverse(function(child) {
            child.layers.set(1);
                        // 关键点：为所有网格启用接收阴影
        if (child.isMesh) {
            child.castShadow = true;  // 投射阴影（可选，根据需要）
            child.receiveShadow = true;  // 接收阴影（必须）
        }
        // 为车辆和相机模型应用PBR材质
        if ((filetype === "ego_car" ||filetype === "target_car" || filetype.includes("camera")) && child.isMesh) {
            // 检查是否已有材质，有则保留基础属性
            const originalMaterial = child.material;
            
            // 创建PBR材质
            const pbrMaterial = new THREE.MeshPhysicalMaterial({
                // 基础颜色属性
                color: originalMaterial.color || 0xffffff,
                emissive: originalMaterial.emissive || 0x000000,
                emissiveIntensity: originalMaterial.emissiveIntensity !== undefined ? originalMaterial.emissiveIntensity : 1,
                
                // 金属/粗糙度属性
                metalness: originalMaterial.metalness !== undefined ? originalMaterial.metalness : 0.3,
                roughness: originalMaterial.roughness !== undefined ? originalMaterial.roughness : 0.3,
                
                // 清漆属性
                clearcoat: originalMaterial.clearcoat !== undefined ? originalMaterial.clearcoat : 1.0,
                clearcoatRoughness: originalMaterial.clearcoatRoughness !== undefined ? originalMaterial.clearcoatRoughness : 0.1,
                
                // 透明度和折射
                transparent: originalMaterial.transparent || false,
                opacity: originalMaterial.opacity !== undefined ? originalMaterial.opacity : 1,
                ior: originalMaterial.ior !== undefined ? originalMaterial.ior : 1.5,
                
                // 环境和反射
                envMapIntensity: originalMaterial.envMapIntensity !== undefined ? originalMaterial.envMapIntensity : 1.5,
                reflectivity: originalMaterial.reflectivity !== undefined ? originalMaterial.reflectivity : 0.0,
                
                // 其他光学属性
                side: originalMaterial.side !== undefined ? originalMaterial.side : THREE.FrontSide,
                blending: originalMaterial.blending !== undefined ? originalMaterial.blending : THREE.NormalBlending,
                depthTest: originalMaterial.depthTest !== undefined ? originalMaterial.depthTest : true,
                depthWrite: originalMaterial.depthWrite !== undefined ? originalMaterial.depthWrite : true,
                
                // 高级PBR属性
                sheen: originalMaterial.sheen !== undefined ? originalMaterial.sheen : 0,
                sheenColor: originalMaterial.sheenColor || 0xffffff,
                sheenRoughness: originalMaterial.sheenRoughness !== undefined ? originalMaterial.sheenRoughness : 0.5,
                
                transmission: originalMaterial.transmission !== undefined ? originalMaterial.transmission : 0,
                thickness: originalMaterial.thickness !== undefined ? originalMaterial.thickness : 0.5
            });
            
            // 如果原始材质有贴图，应用到PBR材质上
            if (originalMaterial.map) {
                pbrMaterial.map = originalMaterial.map;
                // 复制贴图相关属性
                pbrMaterial.map.encoding = originalMaterial.map.encoding !== undefined ? originalMaterial.map.encoding : THREE.LinearEncoding;
            }
            
            if (originalMaterial.normalMap) {
                pbrMaterial.normalMap = originalMaterial.normalMap;
                pbrMaterial.normalScale = originalMaterial.normalScale || new THREE.Vector2(1, 1);
            }
            
            if (originalMaterial.metalnessMap) pbrMaterial.metalnessMap = originalMaterial.metalnessMap;
            if (originalMaterial.roughnessMap) pbrMaterial.roughnessMap = originalMaterial.roughnessMap;
            if (originalMaterial.emissiveMap) pbrMaterial.emissiveMap = originalMaterial.emissiveMap;
            if (originalMaterial.aoMap) {
                pbrMaterial.aoMap = originalMaterial.aoMap;
                pbrMaterial.aoMapIntensity = originalMaterial.aoMapIntensity !== undefined ? originalMaterial.aoMapIntensity : 1;
            }
            
            // 额外的贴图支持
            if (originalMaterial.bumpMap) {
                pbrMaterial.bumpMap = originalMaterial.bumpMap;
                pbrMaterial.bumpScale = originalMaterial.bumpScale !== undefined ? originalMaterial.bumpScale : 1;
            }
            
            if (originalMaterial.clearcoatMap) pbrMaterial.clearcoatMap = originalMaterial.clearcoatMap;
            if (originalMaterial.clearcoatNormalMap) {
                pbrMaterial.clearcoatNormalMap = originalMaterial.clearcoatNormalMap;
                pbrMaterial.clearcoatNormalScale = originalMaterial.clearcoatNormalScale || new THREE.Vector2(1, 1);
            }
            
            if (originalMaterial.displacementMap) {
                pbrMaterial.displacementMap = originalMaterial.displacementMap;
                pbrMaterial.displacementScale = originalMaterial.displacementScale !== undefined ? originalMaterial.displacementScale : 1;
                pbrMaterial.displacementBias = originalMaterial.displacementBias !== undefined ? originalMaterial.displacementBias : 0;
            }
            
            if (originalMaterial.sheenColorMap) pbrMaterial.sheenColorMap = originalMaterial.sheenColorMap;
            if (originalMaterial.sheenRoughnessMap) pbrMaterial.sheenRoughnessMap = originalMaterial.sheenRoughnessMap;
            
            // 如果原始材质有环境贴图，也应用到PBR材质
            if (originalMaterial.envMap) pbrMaterial.envMap = originalMaterial.envMap;
            
            child.material = pbrMaterial;
        }
        });
        // console.log(newModel.name, '及其所有子对象已设置到图层1');

        // models.push(egoVehicleMesh); // 将新模型添加到数组
        scene.add(newModel);

        newModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
        
        // 设置模型旋转
        newModel.rotation.x = rotation.x * Math.PI/180;
        newModel.rotation.y = rotation.y * Math.PI/180; 
        newModel.rotation.z = rotation.z * Math.PI/180;
        
        // 新增：输出模型原始尺寸和缩放后的尺寸
        // const scaledSize = new THREE.Vector3(size.x * scaleFactor, size.y * scaleFactor, size.z * scaleFactor);
        roadlightid = 0;
        if (filetype === "environment"){
            newModel.children[0].children.forEach((element)=>{
                const Name = element.name;
                if (Name.includes("TLR")){
                    trafficLightMeshes.push(element);
                }
                if (Name.includes("BULB")){
                    // id = Name.replace("TLR","")
                    trafficLightMeshes.push(element);

                }
                if (Name.includes('roadlightbulb')) {
                    // 添加基本类型检查c
                    // 1. 确保变量声明在使用之前
                    if (element && element.isObject3D) {
                        roadlightid ++
                        const lightpos = [element.userData.x, element.userData.y, element.userData.z];
                        roadlights[roadlightid] =new THREE.SpotLight(0xFFFFFF, 200);
                        // 例如，每3个路灯中只给1个启用阴影
                        // if (roadlightid % 6 === 0) {
                        //     roadlights[roadlightid].castShadow = true;
                        //     // 优化2: 降低阴影贴图分辨率
                        //     roadlights[roadlightid].shadow.mapSize.width = 256;
                        //     roadlights[roadlightid].shadow.mapSize.height = 256; // 修复这里的102错误
                        //     roadlights[roadlightid].shadow.camera.near = 1;
                        //     roadlights[roadlightid].shadow.camera.far = 30;
                        //     roadlights[roadlightid].shadow.bias = -0.0001;
                        // }
                        scene.add(roadlights[roadlightid]);
                        scene.add(roadlights[roadlightid].target);
                        roadlights[roadlightid].position.set(lightpos[0], lightpos[1], lightpos[2]);
                        roadlights[roadlightid].target.position.set(lightpos[0],0,lightpos[2]); // 指向原点（车辆位置）
                        // 设置灯光锥和有限照明距离
                        roadlights[roadlightid].angle = Math.PI/4; // 约30度的光束角度
                        roadlights[roadlightid].penumbra = 0.2; // 边缘模糊度
                        roadlights[roadlightid].distance = 20; // 照明距离（单位与场景一致）
                        roadlights[roadlightid].decay = 1; // 距离衰减率，符合真实物理
                        roadlights[roadlightid].intensity = 0; // 距离衰减率，符合真实物理



                    // 添加调试信息
                    // console.log('添加了元素:', lightpos);
                    // console.log('当前数组长度:', roadlights.length);
                    }else {
                        console.warn('Found element with roadlightbulb in name but it is not a valid THREE.Object3D');
                    }
                }

            })
        }
        // // 如果是第一个模型（假设是Urus），更新轨道控制器目标123
        if (filetype === "ego_car") {
            const modelBox = new THREE.Box3().setFromObject(newModel);
            const modelCenter = modelBox.getCenter(new THREE.Vector3());
            controls.target.copy(modelCenter);
            cameraMain.lookAt(modelCenter);
            egoVehicleMesh = newModel;

            // 
            // console.log('更新轨道控制器目标到Urus模型中心');    
        }

        if(filetype === "target_car"){
            scene.remove(newModel)
            dynamicTargetModel = newModel;
        }
        // 设置模型位置
        newModel.position.copy(position);
        // console.log('模型位置设置为:', position.x, position.y, position.z);

        // 更新相机位置
        // updateCameraPositions();

        // 模型加载完成后渲染一次
        // renderOnce();
        // console.log('模型加载成功完成');
    }, (xhr) => {
        // 加载进度回调
        const percentComplete = xhr.loaded / xhr.total * 100;
        // console.log('模型加载进度:', percentComplete.toFixed(2), '%');      
    }, (error) => {
        console.error('模型加载失败', error);
        alert('模型加载失败，请检查文件格式是否正确');
    });
}
     

function setnewPosition(Name,model,angle){
    const center = model.position;
    const newz = adascampara[Name].posz*Math.cos(angle)-adascampara[Name].posx*Math.sin(angle);
    const newx = adascampara[Name].posz*Math.sin(angle)+adascampara[Name].posx*Math.cos(angle);
    virtualcameras[Name].position.set(center.x+newx, center.y+adascampara[Name].posy, center.z+newz); // 安装位置
    cameraaxe=getDirectionVector(adascampara[Name].anglex, adascampara[Name].angley+angle/(Math.PI/180), adascampara[Name].anglez);
    const frontLookAt = new THREE.Vector3(center.x+newx+cameraaxe.x, center.y+adascampara[Name].posy+cameraaxe.y, center.z+newz+cameraaxe.z); 
    virtualcameras[Name].lookAt(frontLookAt);
    setCameraHorizontalVerticalFOV(virtualcameras[Name], adascampara[Name].hfov, adascampara[Name].vfov, 0.05, adascampara[Name].range);
                
}

function getDirectionVector(rotationX, rotationY, rotationZ) {
    // 将角度转换为弧度
    const radX = THREE.MathUtils.degToRad(rotationX);
    const radY = THREE.MathUtils.degToRad(rotationY);
    const radZ = THREE.MathUtils.degToRad(rotationZ);

    // 初始方向向量 (0, 0, 1)
    let direction = new THREE.Vector3(0, 0, 1);

    // 基于全局坐标系旋转 - 使用 ZYX 顺序
    // 1. 先绕全局 Z 轴旋转
    // const zRotation = new THREE.Matrix4().makeRotationZ(radZ);
    // direction.applyMatrix4(zRotation);
    // 3. 最后绕全局 X 轴旋转
    const xRotation = new THREE.Matrix4().makeRotationX(radX);
    direction.applyMatrix4(xRotation);
    
    // 2. 再绕全局 Y 轴旋转
    const yRotation = new THREE.Matrix4().makeRotationY(radY);
    direction.applyMatrix4(yRotation);
    


    // 归一化向量
    direction.normalize();

    return direction;
}

function setCameraHorizontalVerticalFOV(camera, horizontalFOV, verticalFOV, near, far2) {
    far = frustum_scale*far2
    const fovX = THREE.MathUtils.degToRad(horizontalFOV);
    const fovY = THREE.MathUtils.degToRad(verticalFOV);
    
    const cotHalfFovY = 1 / Math.tan(fovY / 2);
    const cotHalfFovX = 1 / Math.tan(fovX / 2);
    
    // 创建自定义投影矩阵
    const projectionMatrix = new THREE.Matrix4();
    projectionMatrix.set(
        cotHalfFovX, 0, 0, 0,
        0, cotHalfFovY, 0, 0,
        0, 0, -(far + near) / (far - near), -2 * far * near / (far - near),
        0, 0, -1, 0
    );
    
    camera.projectionMatrix = projectionMatrix;
    camera.projectionMatrixInverse.copy(projectionMatrix).invert();
}

// 更新车辆位置
function updateVehiclePositions() {
    // ite_number++;
    if (!isSceneInitialized) return;
    if (!simulationState.running || !egoVehicleMesh) return;
    // 更新主场景车辆
    if (egoVehicleMesh && 
        simulationState.hasOwnProperty('egoVehicle') && 
        simulationState.egoVehicle.hasOwnProperty('x') && 
        simulationState.egoVehicle.hasOwnProperty('z') && 
        simulationState.egoVehicle.hasOwnProperty('heading')){

        egoVehicleMesh.position.x = simulationState.egoVehicle.x;
        egoVehicleMesh.position.z = simulationState.egoVehicle.z;
        egoVehicleMesh.rotation.y = (simulationState.egoVehicle.heading+ egosetup[egoname].rotationy) * Math.PI / 180 ;
    }

    // 新增: 更新动态目标物
    updateDynamicTargets();
    const center = egoVehicleMesh.position;
    const angle = egoVehicleMesh.rotation.y;

    scene.children.forEach((child) => {
        if(child.type in adascampara){
            const newz = adascampara[child.type].posz*Math.cos(angle)-adascampara[child.type].posx*Math.sin(angle);
            const newx = adascampara[child.type].posz*Math.sin(angle)+adascampara[child.type].posx*Math.cos(angle);
            child.position.x = center.x+newx;
            child.position.y = center.y+adascampara[child.type].posy;
            child.position.z = center.z+newz;
            setnewPosition(child.type,egoVehicleMesh,egoVehicleMesh.rotation.y);

        }});

        

    
    cameraFrustums.forEach(({ camera, frustum }) => {
        // 获取相机的世界矩阵
        const worldMatrix = new THREE.Matrix4();
        camera.updateMatrixWorld();
        worldMatrix.copy(camera.matrixWorld);

        // 更新视锥的位置和方向
        frustum.position.setFromMatrixPosition(worldMatrix);
        frustum.quaternion.setFromRotationMatrix(worldMatrix);
    });

    // 相机跟随逻辑
    if (cameraMain && egoVehicleMesh) {
    // 根据相机模式更新位置和朝向
    switch(cameraMode) {
        case 'POV':
            const offsetDistance = egosetup[egoname].offsetdistance;
            const height = egosetup[egoname].height;
            const offsetlat = egosetup[egoname].offsetlat;
            // 根据车辆朝向计算相机位置
            const headingRadians = simulationState.egoVehicle.heading * Math.PI / 180-gap_angle + Math.PI;
            const cameraX = egoVehicleMesh.position.x - Math.sin(headingRadians) * offsetDistance - Math.cos(headingRadians) * offsetlat;
            const cameraZ = egoVehicleMesh.position.z - Math.cos(headingRadians) * offsetDistance + Math.sin(headingRadians) * offsetlat;
            cameraMain.position.set(cameraX, egoVehicleMesh.position.y + height, cameraZ);
            // 看向车头方向
            const lookTarget = new THREE.Vector3();
            lookTarget.x = egoVehicleMesh.position.x + Math.sin(headingRadians) * 10;
            lookTarget.y = egoVehicleMesh.position.y;
            lookTarget.z = egoVehicleMesh.position.z + Math.cos(headingRadians) * 10;
            cameraMain.lookAt(lookTarget);
            
            // 更新相机灯光位置和方向
            // cameraLight.position.set(cameraMain.position.x, cameraMain.position.y + 1, cameraMain.position.z);
            // cameraLight.target.position.set(cameraMain.position.x, cameraMain.position.y, cameraMain.position.z);
            break;

        case 'followRear':
            // 新模式: 车辆前方上方，朝向车尾
            const frontOffset = 10; // 前方距离
            const frontHeight = 10; // 高度
            
            // 根据车辆朝向计算相机位置
            const rearHeadingRadians = simulationState.egoVehicle.heading * Math.PI / 180-gap_angle + Math.PI;
            const rearCameraX = egoVehicleMesh.position.x + Math.sin(rearHeadingRadians) * frontOffset;
            const rearCameraZ = egoVehicleMesh.position.z + Math.cos(rearHeadingRadians) * frontOffset;
            
            cameraMain.position.set(rearCameraX, egoVehicleMesh.position.y + frontHeight, rearCameraZ);
            
            // 看向车尾方向
            const rearLookTarget = new THREE.Vector3();
            rearLookTarget.x = egoVehicleMesh.position.x - Math.sin(rearHeadingRadians) * 10;
            rearLookTarget.y = egoVehicleMesh.position.y;
            rearLookTarget.z = egoVehicleMesh.position.z - Math.cos(rearHeadingRadians) * 10;
            cameraMain.lookAt(rearLookTarget);
            
            // // 更新相机灯光位置和方向
            // cameraLight.position.copy(cameraMain.position);
            // cameraLight.target.position.copy(rearLookTarget);
            break;
        case 'followFixed':
            // 模式3: 跟随车辆，方向固定X方向
            cameraMain.position.x = egoVehicleMesh.position.x;
            cameraMain.position.y = egoVehicleMesh.position.y + 15; // 保持高度
            cameraMain.position.z = egoVehicleMesh.position.z + 20; // 后方偏移
            
            // 看向X轴正方向
            const fixedLookTarget = new THREE.Vector3();
            fixedLookTarget.x = egoVehicleMesh.position.x;
            fixedLookTarget.y = egoVehicleMesh.position.y;
            fixedLookTarget.z = egoVehicleMesh.position.z;
            cameraMain.lookAt(fixedLookTarget);
            
            // // 更新相机灯光位置和方向
            // cameraLight.position.copy(cameraMain.position);
            // cameraLight.target.position.copy(fixedLookTarget);
            break;
        case 'free':
            // 模式1: 不固定位置，用户可自由控制
            // 不做任何操作，由OrbitControls控制
            
            // 更新相机灯光位置和方向
            // 创建一个位于相机前方的目标点
            const freeLookTarget = new THREE.Vector3();
            cameraMain.getWorldDirection(freeLookTarget);
            freeLookTarget.multiplyScalar(10);
            freeLookTarget.add(cameraMain.position);
            
            // cameraLight.position.copy(cameraMain.position);
            // cameraLight.target.position.copy(freeLookTarget);
            break;
        case 'birdView':
            // 新增鸟瞰视角
            const birdHeight = 3; // 高空中
            const birdDistance = 4; // 正上方
            
            // 相机位于车辆正上方
            cameraMain.position.set(
                egoVehicleMesh.position.x,
                egoVehicleMesh.position.y + birdHeight,
                egoVehicleMesh.position.z + birdDistance
            );
            
            // 看向车辆
            const birdLookTarget = new THREE.Vector3(
                egoVehicleMesh.position.x,
                egoVehicleMesh.position.y,
                egoVehicleMesh.position.z
            );
            cameraMain.lookAt(birdLookTarget);
            
            // // 更新相机灯光
            // cameraLight.position.copy(cameraMain.position);
            // cameraLight.target.position.copy(birdLookTarget);
            break;
    }
    }
    // 更新其他车辆位置 - 保持不变
    simulationState.otherVehicles.forEach((vehicle, index) => {
        if (index < otherVehicleMeshes.length) {
            // 计算3D位置
            const x = (vehicle.x / 600 - 0.5) * 20;
            let z = -(vehicle.y / 600 - 0.5) * 100;
            z -= simulationState.egoVehicle.speed / 100;

            // 更新位置
            otherVehicleMeshes[index].position.set(x, 0.25, z);

            // 超出范围重置
            if (otherVehicleMeshes[index].position.z < -50) {
                otherVehicleMeshes[index].position.z = 50;
            }
        }
    });

    // 更新障碍物位置 - 保持不变
    simulationState.obstacles.forEach((obstacle, index) => {
        if (index < obstacleMeshes.length) {
            // 计算3D位置
            const x = (obstacle.x / 600 - 0.5) * 20;
            let z = -(obstacle.y / 600 - 0.5) * 100;
            z -= simulationState.egoVehicle.speed / 100;

            // 更新位置
            obstacleMeshes[index].position.set(x, 0.5, z);

            // 超出范围重置
            if (obstacleMeshes[index].position.z < -50) {
                obstacleMeshes[index].position.z = 50;
            }
        }
    });
    // 更新灯光目标位置到Urus模型中心
    if (Object.keys(lights).length >0) {
        lights["frontLight"].lookAt(egoVehicleMesh.position.x,egoVehicleMesh.position.y,egoVehicleMesh.position.z);
        lights["sunlight"].target.position.set(0,0,0);
        // lights["leftLight"].target.position.copy(egoVehicleMesh.position);
        // lights["rightLight"].target.position.copy(egoVehicleMesh.position);
        const newz = (lightsetup["leftheadlight"].posz+30)*Math.cos(angle)-lightsetup["leftheadlight"].posx*Math.sin(angle);
        const newx = (lightsetup["leftheadlight"].posz+30)*Math.sin(angle)+lightsetup["leftheadlight"].posx*Math.cos(angle);
        lights["leftheadlight"].target.position.set(egoVehicleMesh.position.x + newx, egoVehicleMesh.position.y + lightsetup["leftheadlight"].posy, egoVehicleMesh.position.z + newz);
        const newz2 = (lightsetup["rightheadlight"].posz+30)*Math.cos(angle)-lightsetup["rightheadlight"].posx*Math.sin(angle);
        const newx2 = (lightsetup["rightheadlight"].posz+30)*Math.sin(angle)+lightsetup["rightheadlight"].posx*Math.cos(angle);
        lights["rightheadlight"].target.position.set(egoVehicleMesh.position.x + newx2, egoVehicleMesh.position.y + lightsetup["rightheadlight"].posy, egoVehicleMesh.position.z + newz2);
        
    }

    // 前上方灯光
    if (Object.keys(lights).length >0) {
        lights["frontLight"].position.set(egoVehicleMesh.position.x, egoVehicleMesh.position.y+1, egoVehicleMesh.position.z);
        // 后上方灯光
        lights["sunlight"].position.set(0,40,0);
        // // 左上方灯光
        // lights["leftLight"].position.set(egoVehicleMesh.position.x - 5, egoVehicleMesh.position.y +0.5, egoVehicleMesh.position.z + 5); 
        // // 右上方灯光
        // lights["rightLight"].position.set(egoVehicleMesh.position.x + 5, egoVehicleMesh.position.y + 0.5, egoVehicleMesh.position.z - 5);
        // 左侧车灯
        const newz3 = lightsetup["leftheadlight"].posz*Math.cos(angle)-lightsetup["leftheadlight"].posx*Math.sin(angle);
        const newx3 = lightsetup["leftheadlight"].posz*Math.sin(angle)+lightsetup["leftheadlight"].posx*Math.cos(angle);
        lights["leftheadlight"].position.set(egoVehicleMesh.position.x + newx3, egoVehicleMesh.position.y + lightsetup["leftheadlight"].posy, egoVehicleMesh.position.z + newz3);
        lights["leftheadlight"].intensity = lightdense*50;
        // 右侧车灯 
        const newz4 = lightsetup["rightheadlight"].posz*Math.cos(angle)-lightsetup["rightheadlight"].posx*Math.sin(angle);
        const newx4 = lightsetup["rightheadlight"].posz*Math.sin(angle)+lightsetup["rightheadlight"].posx*Math.cos(angle);
        lights["rightheadlight"].position.set(egoVehicleMesh.position.x + newx4, egoVehicleMesh.position.y + lightsetup["rightheadlight"].posy, egoVehicleMesh.position.z + newz4);
        lights["rightheadlight"].intensity=lightdense*50;
    }
}

// 新增：更新交通灯状态和倒计时
function updateTrafficLights() {
    if (!isSceneInitialized) return;
    // 遍历所有交通灯
    trafficLightMeshes.forEach(tl => {
        // 获取当前交通灯的ID
        if (tl.name.includes("TLR")){
            const tlId = tl.name.replace("TLR","")
            
            // 查找对应的交通灯状态 - 添加存在性检查
            const tlState = simulationState.trafficLights.find(t => t && String(t.ID) === tlId);

            if (!tlState) {
                console.log('No state found for traffic light:', tlId);
                return;
            }

            const tlgreenBulb = scene.getObjectByName(tlId+"_BULB_GREEN");
            const tlyellowBulb = scene.getObjectByName(tlId+"_BULB_YELLOW");
            const tlredBulb = scene.getObjectByName(tlId+"_BULB_RED");
            
            if (tlState.color == 1){
                tlgreenBulb.material.emissive.setHex(0x1BFF09);
                tlgreenBulb.material.color.setHex(0x1BFF09);
                tlyellowBulb.material.emissive.setHex(0x000000);
                tlyellowBulb.material.color.setHex(0x000000);
                tlredBulb.material.emissive.setHex(0x000000);
                tlredBulb.material.color.setHex(0x000000);
            }
            else if (tlState.color == 2){
                tlyellowBulb.material.emissive.setHex(0xF9FF09);
                tlyellowBulb.material.color.setHex(0xF9FF09);
                tlgreenBulb.material.emissive.setHex(0x000000);
                tlgreenBulb.material.color.setHex(0x000000);
                tlredBulb.material.emissive.setHex(0x000000);
                tlredBulb.material.color.setHex(0x000000);
            }
            else if (tlState.color == 3){
                tlredBulb.material.emissive.setHex(0xFF0909);
                tlredBulb.material.color.setHex(0xFF0909);
                tlyellowBulb.material.emissive.setHex(0x000000);
                tlyellowBulb.material.color.setHex(0x000000);
                tlgreenBulb.material.emissive.setHex(0x000000);
                tlgreenBulb.material.color.setHex(0x000000);
            }
            
            // 新增：创建或更新交通灯倒计时标签
            updateTrafficLightCountdown(tl, tlId, tlState.timer);
        }
    });
}

// 新增：更新交通灯倒计时标签
function updateTrafficLightCountdown(trafficLightMesh, tlId, countdown) {
    // 检查是否已存在该交通灯的标签
    let labelObject = scene.getObjectByName(`TLR_COUNTDOWN_${tlId}`);
    
    if (!labelObject) {
        // 如果不存在，创建新标签
        const div = document.createElement('div');
        div.className = 'traffic-light-countdown';
        div.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        div.style.color = 'white';
        div.style.padding = '4px 8px';
        div.style.borderRadius = '4px';
        div.style.fontSize = '16px';
        div.style.fontWeight = 'bold';
        div.style.textAlign = 'center';
        
        const label = new THREE.CSS2DObject(div);
        label.name = `TLR_COUNTDOWN_${tlId}`;
        
        // 将标签放置在交通灯上方
        const box = new THREE.Box3().setFromObject(trafficLightMesh);
        const center = new THREE.Vector3();
        box.getCenter(center);
        
        // 获取交通灯的最高点
        const size = new THREE.Vector3();
        box.getSize(size);
        
        // 设置标签位置在交通灯中心上方
        label.position.copy(center);
        label.position.y = center.y + size.y / 2 + 0.5; // 稍微高于交通灯
        
        scene.add(label);
        labelObject = label;
    }
    
    // 更新倒计时显示
    const div = labelObject.element;
    div.textContent = Math.ceil(countdown);
}
    
function leftblinkeron() {
    // const urusModel = models && models.find(model => model.type === "ego_car") || null;
    if (egoVehicleMesh) {

    const turnlight_1 = egoVehicleMesh.getObjectByName("Left_Head_Blinker");
    turnlight_1.material.emissive.r = 1;
    turnlight_1.material.emissive.g = 1;
    turnlight_1.material.emissive.b = 0;
    turnlight_1.material.emissive.intensity = 10;
    const turnlight_2 = egoVehicleMesh.getObjectByName("Left_Ear_Blinker");
    turnlight_2.material.emissive.r = 1;
    turnlight_2.material.emissive.g = 1;
    turnlight_2.material.emissive.b = 0;
    const turnlight_3 = egoVehicleMesh.getObjectByName("Left_Rear_Blinker");
    turnlight_3.material.emissive.r = 1;
    turnlight_3.material.emissive.g = 1;
    turnlight_3.material.emissive.b = 0;
    }
}

function leftblinkeroff() {

    // const urusModel = models && models.find(model => model.type === "ego_car") || null;
    if (egoVehicleMesh) {

    const turnlight_1 = egoVehicleMesh.getObjectByName("Left_Head_Blinker");
    turnlight_1.material.emissive.r = 0;
    turnlight_1.material.emissive.g = 0;
    turnlight_1.material.emissive.b = 0;
    const turnlight_2 = egoVehicleMesh.getObjectByName("Left_Ear_Blinker");
    turnlight_2.material.emissive.r = 0;
    turnlight_2.material.emissive.g = 0;
    turnlight_2.material.emissive.b = 0;
    const turnlight_3 = egoVehicleMesh.getObjectByName("Left_Rear_Blinker");
    turnlight_3.material.emissive.r = 0;
    turnlight_3.material.emissive.g = 0;
    turnlight_3.material.emissive.b = 0;

    }
}

function rightblinkeron() {
    // const urusModel = models && models.find(model => model.type === "ego_car") || null;
    if (egoVehicleMesh) {

    const turnlight_1 = egoVehicleMesh.getObjectByName("Right_Head_Blinker");
    turnlight_1.material.emissive.r = 1;
    turnlight_1.material.emissive.g = 1;
    turnlight_1.material.emissive.b = 0;
    const turnlight_2 = egoVehicleMesh.getObjectByName("Right_Ear_Blinker");
    turnlight_2.material.emissive.r = 1;
    turnlight_2.material.emissive.g = 1;
    turnlight_2.material.emissive.b = 0;
    const turnlight_3 = egoVehicleMesh.getObjectByName("Right_Rear_Blinker");
    turnlight_3.material.emissive.r = 1;
    turnlight_3.material.emissive.g = 1;
    turnlight_3.material.emissive.b = 0;
    }
}

function rightblinkeroff() {

    // const urusModel = models && models.find(model => model.type === "ego_car") || null;
    if (egoVehicleMesh) {

    const turnlight_1 = egoVehicleMesh.getObjectByName("Right_Head_Blinker");
    turnlight_1.material.emissive.r = 0;
    turnlight_1.material.emissive.g = 0;
    turnlight_1.material.emissive.b = 0;
    const turnlight_2 = egoVehicleMesh.getObjectByName("Right_Ear_Blinker");    
    turnlight_2.material.emissive.r = 0;
    turnlight_2.material.emissive.g = 0;
    turnlight_2.material.emissive.b = 0;
    const turnlight_3 = egoVehicleMesh.getObjectByName("Right_Rear_Blinker");
    turnlight_3.material.emissive.r = 0;
    turnlight_3.material.emissive.g = 0;
    turnlight_3.material.emissive.b = 0;

    }
}

function wheelspin(){
    // constModel = models && models.find(model => model.type === "ego_car") || null;
    if (egoVehicleMesh) {

        const LFW = egoVehicleMesh.getObjectByName("Left_Front_Wheel");
        const RFW = egoVehicleMesh.getObjectByName("Right_Front_Wheel");
        const RRW = egoVehicleMesh.getObjectByName("Right_Rear_Wheel");
        const LRW = egoVehicleMesh.getObjectByName("Left_Rear_Wheel");   

        LFW.rotation.y += vehiclespeed/(wheelradius/2);
        RFW.rotation.y -= vehiclespeed/(wheelradius/2);
        RRW.rotation.y -= vehiclespeed/(wheelradius/2);
        LRW.rotation.y -= vehiclespeed/(wheelradius/2);

    }
}

function targetwheelspin(targetmesh,speed){
    // constModel = models && models.find(model => model.type === "ego_car") || null;
    if (targetmesh) {

        const LFW_T = targetmesh.getObjectByName("car_wheel_FL_car_body_0");
        const RFW_T = targetmesh.getObjectByName("car_wheel_FR_car_body_0");
        const RRW_T = targetmesh.getObjectByName("car_wheel_BR_car_body_0");
        const LRW_T = targetmesh.getObjectByName("car_wheel_BL_car_body_0");   

        LFW_T.rotation.x -= speed/(targetwheelradius/2);
        RFW_T.rotation.x -= speed/(targetwheelradius/2);
        RRW_T.rotation.x -= speed/(targetwheelradius/2);
        LRW_T.rotation.x -= speed/(targetwheelradius/2);

    }
}

function steeringspin(){
    // const urusModel = models && models.find(model => model.type === "ego_car") || null;
    if (egoVehicleMesh) {

    const Steer = egoVehicleMesh.getObjectByName("Steering_Wheel");

    Steer.rotation.x = -steeringangle * Math.PI/180*10;

    }
}

// 格式化时间显示（保持不变）
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 新增: 更新动态目标物位置
function updateDynamicTargets() {
    
    if (!simulationState.DynTar_info || !dynamicTargetModel) return;
    
    const targets = simulationState.DynTar_info;

    // 移除多余的目标物
    while (dynamicTargetMeshes.length > targets.length) {
        const mesh = dynamicTargetMeshes.pop();
        scene.remove(mesh);
    }

    // 更新或创建目标物
    targets.forEach((target, index) => {
        let mesh;
        // 如果已存在该索引的目标物，则更新
        if (index < dynamicTargetMeshes.length) {
            mesh = dynamicTargetMeshes[index];
        } else {
            // 否则创建新的目标物
            mesh = dynamicTargetModel.clone();
            // 调整模型大小（与自车相同比例）
            const scale = 0.8;
            mesh.scale.set(scale, scale, scale);
            scene.add(mesh);
            dynamicTargetMeshes.push(mesh);
        }
        
        // targetwheelspin(mesh,target.speed)
        // 应用位置转换（参考自车的坐标转换方式）
        mesh.position.x = target.Posx;
        mesh.position.z = -target.Posy; // 注意这里的负号，与自车一致
        mesh.position.y = 0; // 抬高一点，避免陷入地面

        // 应用旋转（参考自车的旋转方式）

        mesh.rotation.y = (target.heading-180) * Math.PI / 180; // 转换为弧度
    });
}


function getRendererInfo() {
    // 获取像素点数
    const gl = renderer.getContext();
    const drawingBufferWidth = gl.drawingBufferWidth;
    const drawingBufferHeight = gl.drawingBufferHeight;
    const totalPixels = drawingBufferWidth * drawingBufferHeight;
    
    // 获取像素比例
    const pixelRatio = renderer.getPixelRatio();
    
    // 获取尺寸和宽高比例
    const size = new THREE.Vector2();
    renderer.getSize(size);
    const width = size.width;
    const height = size.height;
    const aspectRatio = width / height;
    
    // 输出信息
    console.log('===== 渲染器信息 =====');
    console.log('显示尺寸:', width + 'x' + height);
    console.log('渲染缓冲区尺寸:', drawingBufferWidth + 'x' + drawingBufferHeight);
    console.log('总像素点数:', totalPixels.toLocaleString());
    console.log('像素比例:', pixelRatio);
    console.log('宽高比例:', aspectRatio.toFixed(2));
    console.log('======================');
    
    // 返回信息对象，便于在代码中使用
    return {
        displaySize: { width, height },
        drawingBufferSize: { width: drawingBufferWidth, height: drawingBufferHeight },
        totalPixels,
        pixelRatio,
        aspectRatio
    };
}

        // // 修改renderForRecording函数，确保使用frontWide摄像头
        // function renderForRecording() {
        //     if (!isRecording || !recordingCanvas || !recordingContext || !tempComposer || !virtualcameras || !virtualcameras['frontWide']) return;
            
        //     // 确保临时composer使用的是frontWide摄像头
        //     const renderPass = tempComposer.passes.find(pass => pass instanceof THREE.RenderPass);
        //     if (renderPass) {
        //         renderPass.camera = virtualcameras['frontWide'];
        //     }
            
        //     // 使用临时composer直接从frontWide摄像头渲染场景
        //     tempComposer.render();
            
        //     // 将临时渲染器的canvas内容绘制到录制canvas
        //     recordingContext.drawImage(
        //         tempRenderer.domElement, 
        //         0, 0, 
        //         recordingCanvas.width, 
        //         recordingCanvas.height
        //     );
        // }

        // // 修改stopRecording函数，确保清理资源
        // function stopRecording() {
        //     if (!isRecording || !recorder) return;
            
        //     try {
        //         recorder.stop();
        //         updateRecordingUI(false);
        //     } catch (error) {
        //         console.error('停止录制失败:', error);
        //         // 即使出错，也要更新UI状态
        //         updateRecordingUI(false);
        //     }
        // }

        // // 添加一个统一的UI更新函数
        // function updateRecordingUI(isRecordingActive) {
        //     // 使用ID选择器获取元素
        //     const startBtn = document.getElementById('start-recording-btn');
        //     const stopBtn = document.getElementById('stop-recording-btn');
        //     const statusDisplay = document.getElementById('recording-status');
            
        //     if (startBtn) startBtn.style.display = isRecordingActive ? 'none' : 'inline';
        //     if (stopBtn) stopBtn.style.display = isRecordingActive ? 'inline' : 'none';
        //     if (statusDisplay) {
        //         if (isRecordingActive) {
        //             updateRecordingStatus();
        //         } else {
        //             statusDisplay.innerText = '未录制';
        //         }
        //     }
            
        //     // 更新全局状态
        //     isRecording = isRecordingActive;
        // }
        
        // // 更新录制状态显示（保持不变）
        // function updateRecordingStatus() {
        //     if (!isRecording) return;
            
        //     const elapsedTime = Math.floor((Date.now() - recordingStartTime) / 1000);
        //     // console.log(Date.now(),recordingStartTime,elapsedTime)
        //     const statusDisplay = document.getElementById('recording-status');
            
        //     if (statusDisplay) {
        //         statusDisplay.innerText = `录制中: ${formatTime(elapsedTime)}`;
        //     }
            
        //     // 检查是否超过最大录制时间
        //     if (elapsedTime >= maxRecordingTime) {
        //         stopRecording();
        //         alert('已达到最大录制时间，录制将自动停止。');
        //         return;
        //     }
            
        //     // 继续更新状态
        //     requestAnimationFrame(updateRecordingStatus);
        // }