import { Nav } from "../../../components/Nav";
import { DailyStatusSign } from "../../../components/DailyStatusSign";
import { GuestMessageBottle } from "../../../components/GuestMessageBottle";
import { MomentsHeroCarousel } from "../../../components/MomentsHeroCarousel";
import { MomentsManager } from "../../../components/content/ContentManagers";
import { getSiteData } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function MomentsPage() {
  const data = await getSiteData();

  return (
    <>
      <Nav active="life" lifeActive="moments" />
      <main className="page-main">
        <section className="page-hero shell">
          <MomentsHeroCarousel />
          <div className="section-heading">
            <p className="eyebrow">Moments</p>
            <h1 data-en="Recent Traces" data-zh="一些最近的痕迹">一些最近的痕迹</h1>
            <p className="muted-text" data-en="Short notes and life fragments live here; not every sentence needs to become an article." data-zh="短内容和生活流放在这里，不必每句话都长成一篇文章。">短内容和生活流放在这里，不必每句话都长成一篇文章。</p>
          </div>
          <div className="moments-layout">
            <aside className="moments-side moments-left">
              <DailyStatusSign />
            </aside>
            <MomentsManager initialMoments={data.moments} />
            <aside className="moments-side moments-right">
              <GuestMessageBottle initialMessages={data.guestMessages || []} />
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
