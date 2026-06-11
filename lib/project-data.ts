import type { ProjectItem } from "./types";

export const defaultProjects: ProjectItem[] = [
  {
    id: "densenet-caltech101",
    slug: "densenet-caltech101",
    period: "2025.09",
    title: "基于 DenseNet121 的 Caltech-101 图像识别与对比研究",
    type: "图像分类 / 深度学习项目",
    role: "核心成员",
    summary: "面向 Caltech-101 多类别图像识别任务，基于 DenseNet121 构建迁移学习方案，通过数据增强、分类器改造和训练调优完成图像识别实验，并与 ResNet50 进行对比分析。",
    description: "Caltech-101 Image Classification and Comparative Study Based on DenseNet121",
    techStack: ["DenseNet121", "Caltech-101", "Transfer Learning", "Data Augmentation", "ResNet50", "PyTorch"],
    sortOrder: 10,
    content: [
      {
        title: "背景与任务",
        body: "Caltech-101 覆盖 101 个物体类别，每类图片数量不完全均衡，包含背景、姿态和细粒度类别差异。项目以该数据集作为多类别图像分类任务，检验基于迁移学习的深度卷积网络能否在每类样本有限的条件下学习稳定视觉特征。"
      },
      {
        title: "技术路线",
        items: [
          "实现 Caltech101Dataset，排除 BACKGROUND_Google，按类别读取图片，并按 8:2 划分训练集与测试集。",
          "输入统一到 224×224，使用随机水平翻转、10 度内随机旋转、颜色扰动、Tensor 转换和 ImageNet 标准化。",
          "加载 torchvision DenseNet121 的 ImageNet 预训练权重，将分类器替换为 Linear-ReLU-Dropout-Linear 两层全连接头。",
          "训练 30 轮，使用 CrossEntropyLoss、Adam、学习率 0.0005、weight decay 1e-5、batch size 32，并与 ResNet50 对比。"
        ]
      },
      {
        title: "实验结果",
        metrics: [
          { label: "最终测试准确率", value: "93.94%", note: "DenseNet121 在测试集上的结果" },
          { label: "训练轮数", value: "30", note: "batch size 32，初始学习率 0.0005" },
          { label: "数据划分", value: "8:2", note: "按类别划分训练集与测试集" }
        ],
        body: "DenseNet121 训练准确率接近 100%，测试准确率稳定在 90% 以上；与 ResNet50 相比，在若干细分类别上表现更稳定。"
      },
      {
        title: "个人贡献",
        items: [
          "实现并整理 DenseNet121 迁移学习分类流程。",
          "完成数据读取、类别过滤、划分、预处理与数据增强策略设计。",
          "针对 Caltech-101 重构分类头并搭建训练、测试与模型保存流程。",
          "通过识别示例和混淆矩阵对比 DenseNet121 与 ResNet50，并整理实验结果用于汇报。"
        ]
      }
    ]
  },
  {
    id: "dti-subgraph-attention",
    slug: "dti-subgraph-attention",
    period: "2025.09 - 2026.01",
    title: "A Dual Channel Subgraph Attention Framework for Drug-Target Interaction Prediction by Eliminating Meta-path Dependency",
    type: "论文 / 科研项目",
    role: "第三作者",
    summary: "提出 SGAN-DTI，使用双通道异构子图、边类型注意力嵌入与 DTP-Graph 预测模块，减少传统异构图方法对人工 Meta-path 设计的依赖。",
    description: "面向药物-靶点相互作用预测的双通道子图注意力框架，在投于 IEEE/ACM TCBB（CCF-B 类期刊）。",
    techStack: ["Drug-Target Interaction", "Heterogeneous Graph", "Subgraph Attention", "Edge-type Attention", "DTP-Graph", "PyTorch"],
    sortOrder: 20,
    content: [
      { title: "项目简介", body: "药物-靶点相互作用预测可以在昂贵生物实验前筛选潜在作用关系，为药物研发与老药新用提供计算支持。本项目将药物、靶点、疾病和副作用建模为异构生物网络，并通过不依赖人工元路径的双通道子图注意力框架完成 DTI 链接预测。" },
      {
        title: "方法框架",
        items: [
          "构造以药物为中心的 Subgraph-D 和以靶点为中心的 Subgraph-T，分别捕获局部生物语义上下文。",
          "在 Simple-HGN 风格注意力层中引入可学习边类型嵌入，使不同生物关系在邻居聚合时动态贡献语义信息。",
          "将药物-靶点对作为节点构建 DTP-Graph，通过图卷积挖掘候选作用对之间的高阶关联。",
          "从关系感知局部子图中学习表示，而不是手工枚举 Meta-path。"
        ]
      },
      {
        title: "实验结果",
        metrics: [
          { label: "Hetero-A AUC", value: "0.9847", note: "AUPR 0.9792" },
          { label: "Hetero-B AUC", value: "0.9889", note: "AUPR 0.9837" },
          { label: "评测方式", value: "10-fold", note: "训练/验证/测试为 7:2:1，正负样本 1:1" }
        ],
        body: "对比 baseline 包括 NeoDTI、MAGNN、DTI-MGNN、IMCHGAN、SGCL-DTI、MHTAN、MHGNN、AMGDTI、DMHGNN 和 MvFNMC 等。"
      },
      {
        title: "个人贡献",
        items: [
          "复现并评测 DTI 领域 20 余种代表性 baseline。",
          "统一数据处理、训练、验证与评测流程。",
          "整理并处理 700+ 药物分子、1900+ 靶点蛋白、约 140 万潜在作用对相关实验数据。",
          "参与核心实验、结果对比、指标分析与论文内容整理。"
        ]
      }
    ]
  },
  {
    id: "convnextv2-lightlygrn",
    slug: "convnextv2-lightlygrn",
    period: "2025.10 - 2025.11",
    title: "ConvNeXt V2 论文复现与改进",
    type: "论文复现 / 深度学习项目",
    role: "核心成员",
    summary: "围绕 ConvNeXt V2 的 FCMAE 与 GRN 模块展开复现与改进，实现 LightlyGRN 与 DGRN 变体，并在 CIFAR-100 微调实验中进行对比。",
    description: "ConvNeXt V2 Paper Reproduction and Improvement",
    techStack: ["ConvNeXt V2", "FCMAE", "GRN", "LightlyGRN", "DGRN", "CIFAR-100", "PyTorch"],
    sortOrder: 30,
    content: [
      { title: "背景与动机", body: "ConvNeXt V2 将 FCMAE 与 GRN 共同设计。FCMAE 解决卷积网络掩码自编码预训练形式，GRN 则通过全局响应归一化增强通道间竞争，缓解通道激活冗余与特征坍缩问题。" },
      {
        title: "核心改进",
        items: [
          "复现 ConvNeXt V2 Tiny 的微调流程，并理解 FCMAE 与原始 GRN 的作用。",
          "LightlyGRN 使用 1×1 降维、深度卷积、低维响应归一化与升维恢复，作为原文 GRN 的轻量替代路径。",
          "DGRN 在保留 GRN 主干的同时加入动态门控分支，使归一化响应能够随输入自适应调制。",
          "受本地算力约束，实验策略从完整 ImageNet 预训练调整为 CIFAR-100 直接微调。"
        ]
      },
      {
        title: "实验结果",
        metrics: [
          { label: "GRN Top-1", value: "76.6%", note: "Top-5 93.1%" },
          { label: "LightlyGRN Top-1", value: "69.6%", note: "Top-5 84.7%" },
          { label: "DGRN Top-1", value: "77.1%", note: "Top-5 93.4%" }
        ]
      },
      {
        title: "个人贡献",
        items: [
          "搭建基线复现与微调流程，将原始 ConvNeXt V2 代码适配到 CIFAR-100 实验设置。",
          "集成 MobileGRN / LightlyGRN 与 DGRN 改动到核心模型脚本。",
          "调试 MinkowskiEngine、ImportError、TypeError 等环境与依赖问题。",
          "基于训练日志与导出图表整理 GRN、LightlyGRN 与 DGRN 的对比分析。"
        ]
      }
    ]
  },
  {
    id: "basketball-reid",
    slug: "basketball-reid",
    period: "2026.03 - 至今",
    title: "复杂运动场景下篮球持球人身份重识别算法开发",
    type: "科研 / 算法项目",
    role: "核心成员 / 组长",
    summary: "基于 TransReID 构建 HE-TransReID，结合 Hyper-Connection、局部特征融合和 A-Jaccard 重排序，提升篮球复杂运动场景下持球人身份检索表现。",
    description: "Basketball Ball-Handler Person Re-identification in Complex Motion Scenes",
    techStack: ["Person ReID", "TransReID", "Transformer", "Hyper-Connection", "A-Jaccard", "Re-ranking"],
    repoUrl: "https://github.com/Henry-Pig/HE-TransReID",
    sortOrder: 40,
    content: [
      { title: "项目简介", body: "本项目来源于第十七届中国大学生服务外包创新创业大赛 A11 赛题。模型输入一张持球人 Query 裁剪图像，在不依赖连续轨迹追踪的前提下，从 Gallery 中检索同一球员，用于支撑球员检索、个人集锦生成与篮球视频分析。" },
      {
        title: "核心改进",
        items: [
          "基于 ViT 结构的 TransReID 构建 HE-TransReID，用于篮球持球人身份检索。",
          "改进 JPM：用双向空间划分替代随机移位与混洗，形成纵向和横向局部分支。",
          "在 Transformer backbone 中引入 Hyper-Connection，增强跨层信息传递和训练稳定性。",
          "设计轻量 MLP 动态局部特征融合模块，为不同局部区域分配置信权重。",
          "使用相机感知 A-Jaccard / CA-Jaccard 重排序进一步优化离线检索排序。"
        ]
      },
      {
        title: "实验结果",
        metrics: [
          { label: "Baseline", value: "91.1% / 93.6%", note: "mAP / Rank-1，未使用重排序" },
          { label: "HE-TransReID", value: "91.9% / 94.8%", note: "mAP / Rank-1，未使用重排序" },
          { label: "HE-TransReID + CA-reranking", value: "93.4% / 95.5%", note: "最终 mAP / Rank-1" }
        ],
        body: "在白队同队细粒度识别子集上达到 96.8% mAP / 96.4% Rank-1；在跨姿态与严重遮挡鲁棒性子集上达到 91.4% mAP / 91.8% Rank-1。"
      },
      {
        title: "个人贡献",
        items: [
          "提出并实现基于 MLP 的动态权重融合思路，替换基线中局部特征等权融合方式。",
          "参与模型设计、训练与评估，进行不同 checkpoint 与模型配置的结果对比。",
          "参与高精度识别实验与鲁棒性测试。",
          "设计工作流程图，主要撰写项目概要和详细方案文档，并制作项目介绍 PPT。",
          "作为组长统筹项目整体推进。"
        ]
      }
    ]
  }
];
