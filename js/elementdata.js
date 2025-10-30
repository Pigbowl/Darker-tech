let elementdata = {
  "Element": [
    {
      "id": 1,
      "name": "用户功能定义",
      "description": "明确用户功能是什么？这个功能是要做什么的？给出一个边界和框架为后续的开发做工起头。例如定义ACC功能,为辅助车辆进行车辆的纵向运动控制,只能进行缓加速缓减速的情况下保持车辆匀速行驶且能避免和前方车辆的碰撞",
      "from": [],
      "to": [
        "功能场景定义",
        "功能体验定义",
        "产品限制识别",
        "行业对标",
        "场景性能定义"
      ],
      "domain": "产品定义",
      "Metier": "产品工程",
      "isPrimary": "YES",
      "Property": {
        "Knowledge": [
          "ADAS通用知识",
          "KnowLedge_1"
        ],
        "Product": [
          "产品PRD"
        ]
      }
    },
    {
      "id": 2,
      "name": "行业对标",
      "description": "对市场上的ADAS产品针对不同的功能进行对标",
      "from": [
        "用户功能定义"
      ],
      "to": [
        "场景性能定义"
      ],
      "domain": "产品定义",
      "Metier": "产品工程",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "ADAS通用知识",
          "KnowLedge_1"
        ],
        "Product": [
          "对标报告"
        ]
      }
    },
    {
      "id": 3,
      "name": "功能场景定义",
      "description": "明确的定义该功能可以覆盖哪些场景,在哪些场景下有什么表现,在哪些场景下有什么限制。定义了所有的场景后才能清晰的定义出这个功能的边界",
      "from": [
        "用户功能定义",
        "产品限制提取"
      ],
      "to": [
        "场景性能定义",
        "场景逻辑拆解",
        "功能安全分析"
      ],
      "domain": "产品定义",
      "Metier": "产品工程",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "ADAS通用知识",
          "KnowLedge_1"
        ],
        "Product": [
          "使用场景列表"
        ]
      }
    },
    {
      "id": 4,
      "name": "功能体验定义",
      "description": "定义该功能的体验,用什么方法体验,体验到生成程度,如何实现这些体验",
      "from": [
        "用户功能定义"
      ],
      "to": [
        "场景性能定义"
      ],
      "domain": "产品定义",
      "Metier": "产品工程",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "功能体验通用知识",
          "KnowLedge_1"
        ],
        "Product": [
          "Deliver_1",
          "Deliver_2",
          "Deliver_5",
          "Deliver_15"
        ]
      }
    },
    {
      "id": 5,
      "name": "产品限制识别",
      "description": "设计一个功能的时候,根据定义的功能边界,会使得这个功能受到很多的外部限制,如性能约束,场景约束等。需要提取这些约束并添加到场景设计中",
      "from": [
        "用户功能定义"
      ],
      "to": [
        "法规限制识别",
        "评测指标限制识别"
      ],
      "domain": "系统工程",
      "Metier": "功能开发",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "ADAS通用知识",
          "KnowLedge_1"
        ],
        "Product": [
          "Deliver_1",
          "Deliver_2",
          "Deliver_5",
          "Deliver_16"
        ]
      }
    },
    {
      "id": 6,
      "name": "法规限制识别",
      "description": "",
      "from": [
        "产品限制识别"
      ],
      "to": [
        "产品限制提取"
      ],
      "domain": "系统工程",
      "Metier": "功能开发",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "R79",
          "ISO",
          "GBT"
        ],
        "Product": [
          "Deliver_1",
          "Deliver_2",
          "Deliver_5",
          "Deliver_17"
        ]
      }
    },
    {
      "id": 7,
      "name": "评测指标限制识别",
      "description": "",
      "from": [
        "产品限制识别"
      ],
      "to": [
        "产品限制提取"
      ],
      "domain": "系统工程",
      "Metier": "功能开发",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "ENCAP",
          "CNCAP",
          "iVISTA"
        ],
        "Product": [
          "Deliver_1",
          "Deliver_2",
          "Deliver_5",
          "Deliver_18"
        ]
      }
    },
    {
      "id": 8,
      "name": "产品限制提取",
      "description": "设计一个功能的时候,根据定义的功能边界,会使得这个功能受到很多的外部限制,如性能约束,场景约束等。需要提取这些约束并添加到场景设计中",
      "from": [
        "法规限制识别",
        "评测指标限制识别"
      ],
      "to": [
        "功能场景定义"
      ],
      "domain": "系统工程",
      "Metier": "功能开发",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "系统开发方法论"
        ],
        "Product": [
          "Deliver_1",
          "Deliver_2",
          "Deliver_5",
          "Deliver_19"
        ]
      }
    },
    {
      "id": 9,
      "name": "场景性能定义",
      "description": "明确定义所有的的场景都要达到什么样的性能指标",
      "from": [
        "用户功能定义",
        "行业对标",
        "功能场景定义",
        "功能体验定义"
      ],
      "to": [],
      "domain": "系统工程",
      "Metier": "系统开发",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "系统开发方法论",
          "ADAS通用知识",
          "KnowLedge_1"
        ],
        "Product": [
          "Deliver_1",
          "Deliver_2",
          "Deliver_5",
          "Deliver_20"
        ]
      }
    },
    {
      "id": 10,
      "name": "场景逻辑拆解",
      "description": "针对一个场景,事无巨细的定义出所有的逻辑步骤,并涵盖完整的功能场景,从车辆运动到环境提取等。该步骤可以通过最基础的逻辑流保证不会有漏掉的不走,并且明确的展示和定义功能是如何一步一步实现的。",
      "from": [
        "功能场景定义"
      ],
      "to": [
        "功能架构定义"
      ],
      "domain": "软件工程",
      "Metier": "安全开发",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "系统开发方法论",
          "ADAS通用知识",
          "KnowLedge_1"
        ],
        "Product": [
          "Deliver_1",
          "Deliver_2",
          "Deliver_5",
          "Deliver_21"
        ]
      }
    },
    {
      "id": 11,
      "name": "功能安全分析",
      "description": "针对一个场景,定义这场景的安全风险等内容",
      "from": [
        "功能场景定义"
      ],
      "to": [
        "功能安全级别定义"
      ],
      "domain": "功能安全",
      "Metier": "系统开发",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "系统开发方法论",
          "ADAS通用知识",
          "KnowLedge_1"
        ],
        "Product": [
          "Deliver_1",
          "Deliver_2",
          "Deliver_5",
          "Deliver_22"
        ]
      }
    },
    {
      "id": 12,
      "name": "功能安全级别定义",
      "description": "XXXXXX",
      "from": [
        "功能安全分析"
      ],
      "to": [
        "功能安全需求定义"
      ],
      "domain": "功能安全",
      "Metier": "系统开发",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "ISO26262",
          "SOTIF"
        ],
        "Product": [
          "Deliver_1",
          "Deliver_2",
          "Deliver_5",
          "Deliver_23"
        ]
      }
    },
    {
      "id": 13,
      "name": "功能架构定义",
      "description": "将所有场景的逻辑拆解进行合并,形成一整个针对功能的逻辑架构。然后根据实际情况,逻辑架构中的元素进行整合后形成具备独立业务模块串联而成的功能架构。",
      "from": [
        "场景逻辑拆解"
      ],
      "to": [
        "性能拆解"
      ],
      "domain": "软件工程",
      "Metier": "软件开发",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "系统开发方法论",
          "ADAS通用知识",
          "KnowLedge_1"
        ],
        "Product": [
          "Deliver_1",
          "Deliver_2",
          "Deliver_5",
          "Deliver_24"
        ]
      }
    },
    {
      "id": 14,
      "name": "性能拆解",
      "description": "XXXXXX",
      "from": [
        "功能架构定义"
      ],
      "to": [
        "感知性能指标定义",
        "硬件性能指标定义",
        "规控性能指标定义"
      ],
      "domain": "软件工程",
      "Metier": "软件开发",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "系统开发方法论",
          "ADAS通用知识",
          "KnowLedge_2"
        ],
        "Product": [
          "Deliver_1",
          "Deliver_2",
          "Deliver_5",
          "Deliver_25"
        ]
      }
    },
    {
      "id": 15,
      "name": "感知性能指标定义",
      "description": "根据性能拆解的情况,推断出对于感知系统方案的选型",
      "from": [
        "性能拆解"
      ],
      "to": [
        "感知系统方案选型"
      ],
      "domain": "感知开发",
      "Metier": "软件开发",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "系统开发方法论",
          "ADAS通用知识",
          "KnowLedge_3"
        ],
        "Product": [
          "Deliver_1",
          "Deliver_2",
          "Deliver_5",
          "Deliver_26"
        ]
      }
    },
    {
      "id": 16,
      "name": "硬件性能指标定义",
      "description": "根据性能拆解的情况,推断出对于感知系统方案的选型",
      "from": [
        "性能拆解"
      ],
      "to": [
        "硬件系统方案选型"
      ],
      "domain": "硬件开发",
      "Metier": "软件开发",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "系统开发方法论",
          "ADAS通用知识",
          "KnowLedge_4"
        ],
        "Product": [
          "Deliver_1",
          "Deliver_2",
          "Deliver_5",
          "Deliver_27"
        ]
      }
    },
    {
      "id": 17,
      "name": "规控性能指标定义",
      "description": "根据性能拆解的情况,推断出对于感知系统方案的选型",
      "from": [
        "性能拆解"
      ],
      "to": [
        "规控系统方案选型"
      ],
      "domain": "功能安全",
      "Metier": "软件开发",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "系统开发方法论",
          "ADAS通用知识",
          "KnowLedge_5"
        ],
        "Product": [
          "Deliver_1",
          "Deliver_2",
          "Deliver_5",
          "Deliver_28"
        ]
      }
    },
    {
      "id": 18,
      "name": "感知系统方案选型",
      "description": "/",
      "from": [
        "感知性能指标定义"
      ],
      "to": [],
      "domain": "软件工程",
      "Metier": "软件开发",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "系统开发方法论",
          "ADAS通用知识",
          "KnowLedge_6"
        ],
        "Product": [
          "Deliver_1",
          "Deliver_2",
          "Deliver_5",
          "Deliver_29"
        ]
      }
    },
    {
      "id": 19,
      "name": "硬件系统方案选型",
      "description": "/",
      "from": [
        "硬件性能指标定义"
      ],
      "to": [],
      "domain": "软件工程",
      "Metier": "软件开发",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "系统开发方法论",
          "ADAS通用知识",
          "KnowLedge_7"
        ],
        "Product": [
          "Deliver_1",
          "Deliver_2",
          "Deliver_5",
          "Deliver_30"
        ]
      }
    },
    {
      "id": 20,
      "name": "规控系统方案选型",
      "description": "/",
      "from": [
        "规控性能指标定义"
      ],
      "to": [],
      "domain": "软件工程",
      "Metier": "软件开发",
      "isPrimary": "NO",
      "Property": {
        "Knowledge": [
          "系统开发方法论",
          "ADAS通用知识",
          "KnowLedge_8"
        ],
        "Product": [
          "Deliver_1",
          "Deliver_2",
          "Deliver_5",
          "Deliver_31"
        ]
      }
    }
  ],
  "connections": [
    {
      "from": 1,
      "to": 2
    },
    {
      "from": 1,
      "to": 3
    },
    {
      "from": 8,
      "to": 3
    },
    {
      "from": 1,
      "to": 4
    },
    {
      "from": 1,
      "to": 5
    },
    {
      "from": 5,
      "to": 6
    },
    {
      "from": 5,
      "to": 7
    },
    {
      "from": 6,
      "to": 8
    },
    {
      "from": 7,
      "to": 8
    },
    {
      "from": 1,
      "to": 9
    },
    {
      "from": 2,
      "to": 9
    },
    {
      "from": 3,
      "to": 9
    },
    {
      "from": 4,
      "to": 9
    },
    {
      "from": 3,
      "to": 10
    },
    {
      "from": 3,
      "to": 11
    },
    {
      "from": 11,
      "to": 12
    },
    {
      "from": 10,
      "to": 13
    },
    {
      "from": 13,
      "to": 14
    },
    {
      "from": 14,
      "to": 15
    },
    {
      "from": 14,
      "to": 16
    },
    {
      "from": 14,
      "to": 17
    },
    {
      "from": 15,
      "to": 18
    },
    {
      "from": 16,
      "to": 19
    },
    {
      "from": 17,
      "to": 20
    }
  ]
};