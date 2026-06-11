(function () {
  const toggle = document.querySelector("[data-lang-toggle]");
  const titles = document.querySelectorAll("[data-title]");
  const dropdowns = document.querySelectorAll("[data-dropdown]");

  function applyLanguage(lang) {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-en][data-zh]").forEach((node) => {
      node.textContent = node.dataset[lang];
    });

    titles.forEach((title) => {
      title.hidden = title.dataset.title !== lang;
    });

    if (toggle) {
      toggle.textContent = lang === "zh" ? "EN" : "中文";
    }

    localStorage.setItem("site-language", lang);
    document.dispatchEvent(new CustomEvent("site-language-change", { detail: { lang } }));
  }

  applyLanguage(localStorage.getItem("site-language") || "zh");

  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = document.documentElement.lang === "zh-CN" ? "en" : "zh";
      applyLanguage(next);
    });
  }

  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector("[data-dropdown-toggle]");
    if (!button) return;

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = dropdown.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));

      dropdowns.forEach((other) => {
        if (other !== dropdown) {
          other.classList.remove("is-open");
          other.querySelector("[data-dropdown-toggle]")?.setAttribute("aria-expanded", "false");
        }
      });
    });
  });

  document.addEventListener("click", () => {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("is-open");
      dropdown.querySelector("[data-dropdown-toggle]")?.setAttribute("aria-expanded", "false");
    });
  });
})();
