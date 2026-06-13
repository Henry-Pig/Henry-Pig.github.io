const dailyStatuses = [
  {
    title: "今日宜：补一点光",
    text: "把今天切成小块，一块写代码，一块运动，一块留给自己。",
    tag: "Energy +12"
  },
  {
    title: "今日宜：整理思路",
    text: "先把想法写下来，答案通常会在第二遍阅读时露头。",
    tag: "Focus +9"
  },
  {
    title: "今日宜：慢慢变强",
    text: "训练、项目、复盘，各走一步也算赢。",
    tag: "Growth +10"
  },
  {
    title: "今日宜：保存快乐",
    text: "遇到好玩的片段就收进动态里，未来会感谢这份记录。",
    tag: "Memory +8"
  },
  {
    title: "今日宜：清掉一个待办",
    text: "不用清空世界，只要清掉一个卡住你的东西。",
    tag: "Momentum +11"
  }
];

function getDayIndex() {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  return seed % dailyStatuses.length;
}

export function DailyStatusSign() {
  const status = dailyStatuses[getDayIndex()];

  return (
    <div className="daily-status-card">
      <p className="eyebrow">Daily Status</p>
      <h2 data-en="Today's Status Sign" data-zh="今日状态签">今日状态签</h2>
      <div className="status-orbit" aria-hidden="true">
        <span />
      </div>
      <strong>{status.title}</strong>
      <p>{status.text}</p>
      <span className="status-badge">{status.tag}</span>
    </div>
  );
}
