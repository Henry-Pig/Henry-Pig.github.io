export type DesignId = "default" | "dark-academic" | "glassmorphism" | "minimal-light" | "cyber-game";

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
  }
];

export function isDesignId(value: string | null): value is DesignId {
  return registeredDesigns.some((design) => design.id === value);
}
