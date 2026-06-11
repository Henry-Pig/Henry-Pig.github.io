import { Nav } from "../../components/Nav";

export default function AboutPage() {
  return (
    <>
      <Nav active="about" />
      <main className="page-main">
        <section className="page-hero">
          <div className="shell about-layout">
            <div className="about-copy">
              <p className="eyebrow" data-en="About" data-zh="关于我">关于我</p>
              <h1 data-en="About Me" data-zh="关于我">关于我</h1>
              <div className="lead-card about-intro">
                <p data-en="Hello, I am Yu Shuheng, an undergraduate student at Jilin University." data-zh="你好，我是于书蘅，本科就读于吉林大学。">你好，我是于书蘅，本科就读于吉林大学。</p>
                <p data-en="Most of the time, I level up in the world of computer science, wrestling with code, algorithms, major courses, and bugs in every possible sense. Outside study, I also appear from time to time in the gym or on a badminton court." data-zh="平时主要在计算机的世界里打怪升级，和代码、算法、专业课以及各种意义上的 bug 斗智斗勇；学习之余，也会在健身房和羽毛球馆随机刷新。">平时主要在计算机的世界里打怪升级，和代码、算法、专业课以及各种意义上的 bug 斗智斗勇；学习之余，也会在健身房和羽毛球馆随机刷新。</p>
                <p data-en="Deep down, I am still someone who loves to play. I may not be especially skilled, but when I become a Tenno traveling among the stars, pick up an AK and fight through Dust II, or raise the golden staff to face the fallen Great Sage, I feel like that carefree kid who never really grew up." data-zh="但说到底，我也是一个很贪玩的人。尽管没有多么精湛的技术，但当我化身 Tenno 在星际间穿梭，拿起 AK 在沙二出生入死，或是举起金箍棒面对大圣残躯时，我仿佛又变回了那个尚未长大的、无忧无虑的小孩。">但说到底，我也是一个很贪玩的人。尽管没有多么精湛的技术，但当我化身 Tenno 在星际间穿梭，拿起 AK 在沙二出生入死，或是举起金箍棒面对大圣残躯时，我仿佛又变回了那个尚未长大的、无忧无虑的小孩。</p>
                <p data-en="I do not have Naruto Uzumaki's extraordinary persistence, nor Sasuke Uchiha's astonishing talent, but I am still growing through all the stumbles, slowly becoming a better version of myself." data-zh="我没有漩涡鸣人那样强大的毅力，也没有宇智波佐助那样惊人的天赋，但我依然在磕磕绊绊中努力长大，慢慢成为更好的自己。">我没有漩涡鸣人那样强大的毅力，也没有宇智波佐助那样惊人的天赋，但我依然在磕磕绊绊中努力长大，慢慢成为更好的自己。</p>
              </div>
            </div>
            <aside className="about-card" aria-label="基础信息">
              <div>
                <p className="eyebrow" data-en="Profile" data-zh="基础信息">基础信息</p>
                <h2 data-en="Yu Shuheng" data-zh="于书蘅">于书蘅</h2>
              </div>
              <dl className="info-list">
                <div><dt data-en="Name" data-zh="姓名">姓名</dt><dd data-en="Yu Shuheng" data-zh="于书蘅">于书蘅</dd></div>
                <div><dt data-en="Birthday" data-zh="生日">生日</dt><dd>2005.1.7</dd></div>
                <div><dt data-en="University" data-zh="本科院校">本科院校</dt><dd data-en="Jilin University" data-zh="吉林大学">吉林大学</dd></div>
                <div><dt data-en="Major" data-zh="专业">专业</dt><dd data-en="Data Science and Big Data Technology" data-zh="数据科学与大数据技术">数据科学与大数据技术</dd></div>
                <div><dt data-en="Email" data-zh="邮箱">邮箱</dt><dd><a href="mailto:yushuheng@126.com">yushuheng@126.com</a></dd></div>
                <div><dt>GitHub</dt><dd><a href="https://github.com/Henry-Pig" target="_blank" rel="noopener">Henry-Pig</a></dd></div>
              </dl>
              <div className="about-interests">
                <p data-en="Interests" data-zh="兴趣爱好">兴趣爱好</p>
                <div className="interest-tags">
                  <span data-en="Badminton" data-zh="羽毛球">羽毛球</span>
                  <span data-en="Fitness" data-zh="健身">健身</span>
                  <span data-en="Gaming" data-zh="游戏">游戏</span>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
