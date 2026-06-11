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
                <p data-en="Hello, I am Yu Shuheng, an undergraduate student at Jilin University majoring in Data Science and Big Data Technology." data-zh="你好，我是于书蘅，本科就读于吉林大学，专业是数据科学与大数据技术。">你好，我是于书蘅，本科就读于吉林大学，专业是数据科学与大数据技术。</p>
                <p data-en="Most of the time, I level up in the world of computer science. I also appear from time to time in the gym or on a badminton court." data-zh="平时主要在计算机的世界里打怪升级，也会在健身房和羽毛球馆随机刷新。">平时主要在计算机的世界里打怪升级，也会在健身房和羽毛球馆随机刷新。</p>
                <p data-en="I am someone still growing, sometimes slowly, sometimes clumsily, but always moving forward." data-zh="总之，我是一个正在努力变强、偶尔摆烂、但一直向前的人。欢迎来到我的个人主页。">总之，我是一个正在努力变强、偶尔摆烂、但一直向前的人。欢迎来到我的个人主页。</p>
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
