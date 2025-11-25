homepage = deploy_mode != 'full' ? '/index.html':'/'
knowledge_page = deploy_mode != 'full' ? '/Pages/KnowledgeNet.html':'/pages/knowledge'
learning_page = deploy_mode != 'full' ? '/Pages/Learning_Gallary.html':'/pages/learning_gallary'
function_page = deploy_mode != 'full' ? '/Pages/FunctionHall.html':'/pages/functionhall'
hardware_page = deploy_mode != 'full' ? '/Pages/HardWareHall.html':'/pages/hardwarehall'
sensor_page = deploy_mode != 'full' ? '/Pages/SensorHall.html':'/pages/sensorhall'
regulation_page = deploy_mode != 'full' ? '/Pages/RegulationMap.html':'/pages/regulationmap'
architecture_page = deploy_mode != 'full' ? '/Pages/architecture_build.html':'/pages/architecture_build'
benchmark_page = deploy_mode != 'full' ? '/Pages/AdasBenchmark.html':'/pages/adasbenchmark'
configurator_page = deploy_mode != 'full' ? '/Pages/Configurator.html':'/pages/configurator'
roadbuilder_page = deploy_mode != 'full' ? '/Pages/RoadBuilder.html':'/pages/roadbuilder'
fov_build_page = deploy_mode != 'full' ? '/Pages/FoV_build.html':'/pages/fov_build'
sensor_simulation_page = deploy_mode != 'full' ? '/Pages/SENSOR_SIMU.html':'/pages/sensor_simu'
simulation_platform_page = deploy_mode != 'full' ? '/Pages/SimulationPlatform.html':'/pages/simulation_platform'


let conversion_blog ={
    [homepage]: [
      "我是你的智能助手小达~",
      "我能引导您游览《达客科技》",
      "在《达客科技》我们能您提供的ADAS知识框架,让您了解如何开发ADAS",
      "能够为你提供ADAS相关的知识点和工具",
      "更多其他的相关服务",
      "想要了解更多的ADAS知识吗？",
      "想要了解关于《达客科技》的更多信息吗？",
      "点击我聊天啊！:)"
    ],
    [knowledge_page]: [
      "在这里你可以看到所有的ADAS开发的相关知识的网络",
      "我能给你提供所有需要做的事情，对应的知识点，相关的任务以及应有的产出",
      "点击任务可以进入细节模式哦~",
      "如果你有具体想了解的内容，右上角搜索，选择你想了解的内容，网络会自动为你更新！"
    ],
    [learning_page]: [
      "ADAS领域太庞大了！知识太多了！要是有个知识库就好了！",
      "嗯呢，那你来对地方了。",
      "东西都在这了，自己看吧。",
      "看完你就出师了",
    ],
    [function_page]: [
      "这里陈列了很多功能的介绍哦",
      "你可以搜索你想要的关键词查询功能",
      "或者干脆直接点击全部功能来查看！",
      "学习起来吧",
    ],
    [hardware_page]: [
      "这里陈列了很多硬件的介绍哦",
      "你可以点击具体的芯片来看详情",
      "还能通过条件进行筛选哦",
      "学习起来吧",
    ],
    [sensor_page]: [
      "这里陈列了很多传感器的介绍哦",
      "你可以点击具体的传感器来看详情",
      "还能通过条件进行筛选哦",
      "学习起来吧",
    ],
    [architecture_page]: [
      "恭喜您来到了神秘的“架构领域”",
      "听过架构吧？只是听过吧？（果然）",
      "那让我带你了解一下ADAS的架构",
      "让你了解什么是架构，怎么做架构",
      "还给你提供了工具能够让你自动生成架构哦",
      "GO GO GO！"
    ],
    [regulation_page]: [
      "看到世界地图了吗？",
      "点击你感兴趣的国家，然后点击应用",
      "你就可以得到该地区需要遵守的法规信息了哦",
      "学习起来吧",
    ],
    [benchmark_page]: [
      "你知道市面上有多少ADAS产品吗？",
      "你知道哪些车辆有什么ADAS功能么？",
      "你知道谁做得好谁做的不好么？",
      "不！你不知道！你不关心！你只关心你自己 ！（手动狗头）",
      "不过没关系~ 小达帮你整理好了",
      "ADAS对标库里具备海量的咨询和工具！，让你了解ADAS市场",
      "开整！"
    ],
    [fov_build_page]: [
      "你曾经因为绘制传感器图而苦恼么？",
      "那你来对地方了！",
      "我在这里给你提供一个工具",
      "通过添加和配置传感器,自动绘制一个传感器配置图",
      "不想自己配置？没关系，你还能加载我给你准备好的传感器配置哦",
      "不仅如此,喜欢的话可以保存成图片,在自己需要的地方使用！",
      "2D不过瘾的话,我还有3D版本哦",
      "开始尝试吧！ ^o^"
    ],
    [configurator_page]: [
      "我要给客户一个ADAS产品/解决方案了！怎么办",
      "都有哪些方案？需要考虑哪些需求？我该怎么选？",
      "不要着急，跟着咱们得工具一步一步来！",
      "让你找到合适的产品，让你定义自己的产品",
      "GO GO GO！"
    ],
    [roadbuilder_page]: [
      "你曾经因为绘制场景，道路而苦恼么？",
      "别苦恼了，这儿都有",
      "在这里你可以简单在画布上绘制道路，配置道路，哪些复杂道路的绘制不再是噩梦。",
      "画完了，你可以保存成图片，在自己需要的地方使用！还能导出地图数据，供你使用",
      "最后还能生成导出3D环境模型哦，问我能干嘛？晚点告诉你",
      "尝试绘制你的环境吧！",
    ],
    [sensor_simulation_page]: [
      "来了来了,3D的来了,炫酷的来了！",
      "这个页面给你提供了一个3D的视觉传感器仿真的地方",
      "想看你布置的摄像头能看到什么嘛？想看你的传感器组有没有盲区嘛？",
      "想尝试不用的传感器嘛？",
      "自己试试吧！"
    ],
    [simulation_platform_page]: [
      "这是一个完整的仿真工具和仿真框架",
      "你可以用这个工具验证的感知算法，规控算法，以及ADAS系统的整体性能",
      "这个框架提供简单易读的接口和架构，完整的算法部署环境。简单易上手",
      "不过还未上线哦，敬请期待！"
  ],

}

let pagename = {
    [homepage]:'达客科技主',
    [knowledge_page]:"ADAS知识网络",
    [function_page]:"功能介绍",
    [hardware_page]:"硬件介绍",
    [sensor_page]:"传感器介绍",
    [regulation_page]:"法规地图",
    [architecture_page]:"架构查看",
    [configurator_page]:"产品配置工具",
    [fov_build_page]:"传感器图生成工具",
    [roadbuilder_page]:"道路环境绘制工具",
    [sensor_simulation_page]:"传感器模拟工具",
    [simulation_platform_page]:"ADAS仿真环境",
    [benchmark_page]:"ADAS对标库",
    [learning_page]:"ADAS学习",
    
}

