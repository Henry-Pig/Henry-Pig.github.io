export const projects = [
  {
    slug: "densenet-caltech101",
    time: "2025.09",
    title: "基于 DenseNet121 的 Caltech-101 图像识别与对比研究",
    enTitle: "Caltech-101 Image Classification and Comparative Study Based on DenseNet121",
    type: "图像分类 / 深度学习项目",
    role: "核心成员",
    summary:
      "面向 Caltech-101 多类别图像识别任务，构建 DenseNet121 迁移学习方案，引入数据增强策略，改造分类器，并与 ResNet50 进行性能对比分析。",
    tags: ["DenseNet121", "Caltech-101", "Transfer Learning", "PyTorch"]
  },
  {
    slug: "dti-subgraph-attention",
    time: "2025.09 - 2026.01",
    title: "A Dual Channel Subgraph Attention Framework for Drug-Target Interaction Prediction by Eliminating Meta-path Dependency",
    enTitle: "A Dual Channel Subgraph Attention Framework for Drug-Target Interaction Prediction by Eliminating Meta-path Dependency",
    type: "论文 / 科研项目",
    role: "第三作者",
    summary:
      "围绕药物-靶点相互作用预测，使用双通道子图、边类型注意力嵌入和 TP-Graph 预测模块，减少传统方法对人工 Meta-path 设计的依赖。",
    tags: ["DTI", "Heterogeneous Graph", "Subgraph Attention", "TP-Graph"]
  },
  {
    slug: "convnextv2-lightlygrn",
    time: "2025.10 - 2025.11",
    title: "ConvNeXt V2 论文复现与改进",
    enTitle: "ConvNeXt V2 Paper Reproduction and Improvement",
    type: "论文复现 / 深度学习项目",
    role: "核心成员",
    summary:
      "围绕 ConvNeXt V2 中 FCMAE 与 GRN 模块展开复现与改进，实现 LightlyGRN 与 DGRN 等替代方案，并在 CIFAR-100 上进行对比实验。",
    tags: ["ConvNeXt V2", "FCMAE", "GRN", "CIFAR-100"]
  },
  {
    slug: "basketball-reid",
    time: "2026.03 - 至今",
    title: "复杂运动场景下篮球持球人身份重识别算法开发",
    enTitle: "Basketball Ball-Handler Person Re-identification in Complex Motion Scenes",
    type: "科研 / 算法项目",
    role: "核心成员",
    summary:
      "基于 TransReID 构建 HE-TransReID，结合 Hyper-Connection、局部特征融合和 A-Jaccard 重排序方法，提升篮球复杂运动场景下持球人身份检索表现。",
    tags: ["TransReID", "Person ReID", "Hyper-Connection", "A-Jaccard"]
  }
];
