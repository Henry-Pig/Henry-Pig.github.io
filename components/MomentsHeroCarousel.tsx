"use client";

import { useState } from "react";

const bannerImages = [
  { src: "/tiga-1.png", alt: "Ultraman banner 1" },
  { src: "/tiga-2.png", alt: "Ultraman banner 2" },
  { src: "/tiga-3.png", alt: "Ultraman banner 3" }
];

export function MomentsHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = bannerImages[activeIndex];

  function goPrevious() {
    setActiveIndex((current) => (current - 1 + bannerImages.length) % bannerImages.length);
  }

  function goNext() {
    setActiveIndex((current) => (current + 1) % bannerImages.length);
  }

  return (
    <div className="moments-hero-banner">
      <img className="moments-banner-image" src={activeImage.src} alt={activeImage.alt} />
      <button className="moments-banner-button moments-banner-prev" type="button" onClick={goPrevious} aria-label="上一张背景图">
        ‹
      </button>
      <button className="moments-banner-button moments-banner-next" type="button" onClick={goNext} aria-label="下一张背景图">
        ›
      </button>
      <div className="moments-banner-dots" aria-label="背景图序号">
        {bannerImages.map((image, index) => (
          <button
            key={image.src}
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            onClick={() => setActiveIndex(index)}
            aria-label={`切换到第 ${index + 1} 张背景图`}
          />
        ))}
      </div>
    </div>
  );
}
