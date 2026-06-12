export type DesignId =
  | "default"
  | "dark-academic"
  | "glassmorphism"
  | "minimal-light"
  | "cyber-game"
  | "resend-dark"
  | "claude-warm"
  | "mongodb-green"
  | "sentry-violet"
  | "voltagent-code"
  | "warp-terminal";

export type RegisteredDesign = {
  id: DesignId;
  nameZh: string;
  nameEn: string;
  descriptionZh: string;
  descriptionEn: string;
  recommendedZh: string;
  recommendedEn: string;
  previewPath?: string;
};

export const DEFAULT_DESIGN: DesignId = "default";

export const registeredDesigns: RegisteredDesign[] = [
  {
    id: "default",
    nameZh: "默认",
    nameEn: "Default",
    descriptionZh: "保留当前温暖、克制、带一点文学感的个人主页风格。",
    descriptionEn: "Keeps the current warm, quiet, slightly literary homepage style.",
    recommendedZh: "日常浏览",
    recommendedEn: "Everyday browsing"
  },
  {
    id: "dark-academic",
    nameZh: "暗色学术",
    nameEn: "Dark Academic",
    descriptionZh: "深色纸面、暖金强调，适合项目、科研和长文展示。",
    descriptionEn: "Dark paper, warm gold accents, tuned for research and long-form pages.",
    recommendedZh: "科研项目",
    recommendedEn: "Research projects"
  },
  {
    id: "glassmorphism",
    nameZh: "玻璃拟态",
    nameEn: "Glassmorphism",
    descriptionZh: "柔和光晕与半透明面板，呼应首页的梦幻氛围。",
    descriptionEn: "Soft glows and translucent panels for the dreamy homepage mood.",
    recommendedZh: "首页与生活记录",
    recommendedEn: "Home and life notes"
  },
  {
    id: "minimal-light",
    nameZh: "简洁浅色",
    nameEn: "Minimal Light",
    descriptionZh: "更白、更清爽，减少装饰，优先服务阅读。",
    descriptionEn: "Brighter and cleaner, with decoration reduced for comfortable reading.",
    recommendedZh: "博客与项目详情",
    recommendedEn: "Blog and project details"
  },
  {
    id: "cyber-game",
    nameZh: "轻赛博游戏",
    nameEn: "Cyber Game",
    descriptionZh: "冷色暗底与霓虹边线，带一点游戏感但不过分喧闹。",
    descriptionEn: "Cool dark surfaces and neon edges, playful without overwhelming the page.",
    recommendedZh: "兴趣展示",
    recommendedEn: "Interests and showcases"
  },
  {
    id: "resend-dark",
    nameZh: "Resend 暗黑",
    nameEn: "Resend Dark",
    descriptionZh: "来自 DESIGN_Resend.md：纯黑画布、白色主按钮、代码感边线和低调光晕。",
    descriptionEn: "From DESIGN_Resend.md: black canvas, white CTAs, code-like hairlines, and subtle glows.",
    recommendedZh: "技术项目",
    recommendedEn: "Technical projects"
  },
  {
    id: "claude-warm",
    nameZh: "Claude 暖调",
    nameEn: "Claude Warm",
    descriptionZh: "来自 DESIGN_Claude.md：奶油色画布、珊瑚色按钮、温和的编辑感。",
    descriptionEn: "From DESIGN_Claude.md: cream canvas, coral actions, and a warm editorial feel.",
    recommendedZh: "关于我与博客",
    recommendedEn: "About and blog"
  },
  {
    id: "mongodb-green",
    nameZh: "MongoDB 绿",
    nameEn: "MongoDB Green",
    descriptionZh: "来自 DESIGN_MongoDB.md：深青与亮绿强调，偏文档和产品展示。",
    descriptionEn: "From DESIGN_MongoDB.md: deep teal and bright green accents for docs and product-like pages.",
    recommendedZh: "项目目录",
    recommendedEn: "Project index"
  },
  {
    id: "sentry-violet",
    nameZh: "Sentry 紫夜",
    nameEn: "Sentry Violet",
    descriptionZh: "来自 DESIGN_Sentry.md：紫色夜幕、荧光青柠强调，开发者工具气质更强。",
    descriptionEn: "From DESIGN_Sentry.md: violet midnight surfaces with electric lime accents.",
    recommendedZh: "技术与调试记录",
    recommendedEn: "Technical notes"
  },
  {
    id: "voltagent-code",
    nameZh: "VoltAgent 代码绿",
    nameEn: "VoltAgent Code",
    descriptionZh: "来自 DESIGN_VoltAgent.md：近黑背景、电绿色强调、文档式卡片网格。",
    descriptionEn: "From DESIGN_VoltAgent.md: near-black canvas, electric green accents, and documentation-like cards.",
    recommendedZh: "工程展示",
    recommendedEn: "Engineering showcases"
  },
  {
    id: "warp-terminal",
    nameZh: "Warp 终端",
    nameEn: "Warp Terminal",
    descriptionZh: "来自 DESIGN_Warp.md：暖炭黑底、克制按钮、终端开发环境氛围。",
    descriptionEn: "From DESIGN_Warp.md: warm charcoal canvas, restrained controls, and terminal ambience.",
    recommendedZh: "代码与工具",
    recommendedEn: "Code and tools"
  }
];

export function isDesignId(value: string | null): value is DesignId {
  return registeredDesigns.some((design) => design.id === value);
}
