// Interacciones propias del portafolio.
document.addEventListener("DOMContentLoaded", () => {
  actualizarAnio();
  prepararNavegacionActiva();
  prepararProgresoDeLectura();
  prepararBotonDeInicio();
  prepararMenuMovil();
});

// Mantiene actualizado el año que aparece en el pie de página.
function actualizarAnio() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

// Revela las secciones al entrar en pantalla, salvo que el usuario reduzca el movimiento.
function prepararAnimacionesDeEntrada() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sections = document.querySelectorAll(".intro, .portfolio-section");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  document.documentElement.classList.add("js-enhanced");
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  sections.forEach((section) => observer.observe(section));
}

// Resalta en la navegación la sección que el visitante está leyendo.
function prepararNavegacionActiva() {
  if (!("IntersectionObserver" in window)) return;

  const links = [...document.querySelectorAll("#mainNav .nav-link[href^='#']")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleSection) return;

    links.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${visibleSection.target.id}`;
      link.classList.toggle("active", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { threshold: [0.1, 0.35, 0.6], rootMargin: "-18% 0px -62% 0px" });

  sections.forEach((section) => observer.observe(section));
}

// Actualiza la barra superior con el porcentaje de lectura de la página.
function prepararProgresoDeLectura() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  let framePending = false;
  const updateProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0
      ? Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100))
      : 0;

    bar.style.transform = `scaleX(${progress / 100})`;
    bar.setAttribute("aria-valuenow", String(Math.round(progress)));
    framePending = false;
  };

  window.addEventListener("scroll", () => {
    if (!framePending) {
      window.requestAnimationFrame(updateProgress);
      framePending = true;
    }
  }, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();
}

// Muestra un acceso rápido al inicio después de bajar por la página.
function prepararBotonDeInicio() {
  const button = document.getElementById("backToTop");
  if (!button) return;

  const toggleButton = () => {
    button.hidden = window.scrollY < 420;
  };

  window.addEventListener("scroll", toggleButton, { passive: true });
  toggleButton();
  button.addEventListener("click", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
}

// Cierra el menú de Bootstrap cuando se navega desde una pantalla pequeña.
function prepararMenuMovil() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.bootstrap && nav.classList.contains("show")) {
        window.bootstrap.Collapse.getOrCreateInstance(nav).hide();
      }
    });
  });
}

