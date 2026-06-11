(function () {
  let currentLanguage = localStorage.getItem("site-language") || "zh";
  let observer;

  function observeLanguageTargets() {
    if (!observer || !document.body) return;
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function applyLanguage(lang) {
    if (observer) observer.disconnect();
    currentLanguage = lang;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-en][data-zh]").forEach((node) => {
      const text = node.getAttribute(`data-${lang}`);
      if (text !== null) node.textContent = text;
    });

    document.querySelectorAll("[data-title]").forEach((title) => {
      title.hidden = title.dataset.title !== lang;
    });

    const toggle = document.querySelector("[data-lang-toggle]");
    if (toggle) {
      toggle.textContent = lang === "zh" ? "EN" : "中文";
      toggle.setAttribute("aria-label", lang === "zh" ? "Switch to English" : "切换到中文");
    }

    localStorage.setItem("site-language", lang);
    document.dispatchEvent(new CustomEvent("site-language-change", { detail: { lang } }));
    observeLanguageTargets();
  }

  applyLanguage(currentLanguage);

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest("[data-lang-toggle]")) {
      const next = currentLanguage === "zh" ? "en" : "zh";
      applyLanguage(next);
      return;
    }

    const dropdownButton = target instanceof Element ? target.closest("[data-dropdown-toggle]") : null;
    if (dropdownButton) {
      event.stopPropagation();
      const dropdown = dropdownButton.closest("[data-dropdown]");
      if (!dropdown) return;
      const isOpen = dropdown.classList.toggle("is-open");
      dropdownButton.setAttribute("aria-expanded", String(isOpen));

      document.querySelectorAll("[data-dropdown]").forEach((other) => {
        if (other !== dropdown) {
          other.classList.remove("is-open");
          other.querySelector("[data-dropdown-toggle]")?.setAttribute("aria-expanded", "false");
        }
      });
      return;
    }

    document.querySelectorAll("[data-dropdown]").forEach((dropdown) => {
      dropdown.classList.remove("is-open");
      dropdown.querySelector("[data-dropdown-toggle]")?.setAttribute("aria-expanded", "false");
    });
  });

  observer = new MutationObserver(() => {
    applyLanguage(currentLanguage);
  });

  observeLanguageTargets();
})();
