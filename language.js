(function () {
  const toggle = document.querySelector("[data-lang-toggle]");
  const translatable = document.querySelectorAll("[data-en][data-zh]");
  const titleEn = document.querySelector('[data-title="en"]');
  const titleZh = document.querySelector('[data-title="zh"]');
  const dropdowns = document.querySelectorAll("[data-dropdown]");

  function setLanguage(lang) {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    translatable.forEach((item) => {
      item.textContent = item.dataset[lang];
    });
    if (titleEn && titleZh) {
      titleEn.hidden = lang === "zh";
      titleZh.hidden = lang !== "zh";
    }
    if (toggle) {
      toggle.textContent = lang === "zh" ? "EN" : "中文";
    }
    localStorage.setItem("site-language", lang);
    document.dispatchEvent(new CustomEvent("site-language-change", { detail: { lang } }));
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      const nextLang = document.documentElement.lang === "zh-CN" ? "en" : "zh";
      setLanguage(nextLang);
    });
  }

  dropdowns.forEach((dropdown) => {
    const dropdownToggle = dropdown.querySelector("[data-dropdown-toggle]");
    if (!dropdownToggle) return;

    dropdownToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = dropdown.classList.toggle("is-open");
      dropdownToggle.setAttribute("aria-expanded", String(isOpen));
      dropdowns.forEach((item) => {
        if (item !== dropdown) {
          item.classList.remove("is-open");
          const itemToggle = item.querySelector("[data-dropdown-toggle]");
          if (itemToggle) itemToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  });

  document.addEventListener("click", () => {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("is-open");
      const dropdownToggle = dropdown.querySelector("[data-dropdown-toggle]");
      if (dropdownToggle) dropdownToggle.setAttribute("aria-expanded", "false");
    });
  });

  setLanguage(localStorage.getItem("site-language") || "en");
})();
