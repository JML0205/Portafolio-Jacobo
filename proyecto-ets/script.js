// ETS InfoPlus: interacciones del sitio educativo.

document.addEventListener("DOMContentLoaded", () => {
  actualizarAnio();
  activarOrientadorEducativo();
  activarBuscadorDeServicios();
  cerrarMenuMovilAlNavegar();
});

// Mantiene el año del pie de página actualizado.
function actualizarAnio() {
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
}

// Ofrece un mensaje general de orientación; no intenta predecir o diagnosticar ITS.
function activarOrientadorEducativo() {
  const form = document.getElementById("orientationForm");
  const result = document.getElementById("orientationResult");

  if (!form || !result) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const answer = new FormData(form).get("orientation");
    const messages = {
      symptoms: "Si tienes síntomas o cambios que te preocupan, pide una cita con un profesional de salud. Solo una evaluación puede indicar qué ocurre.",
      exposure: "Si crees que pudiste estar expuesto a una ITS, consulta pronto con un servicio de salud para recibir orientación sobre pruebas y tiempos adecuados.",
      learn: "Puedes aprender más en las fuentes oficiales de esta página. Un profesional puede recomendar medidas de prevención según tu situación."
    };

    result.textContent = messages[answer] || "Selecciona una opción para continuar.";
    result.hidden = false;
  });
}

// Construye una búsqueda de centros de salud sexual para la ciudad escrita por el usuario.
function activarBuscadorDeServicios() {
  const form = document.getElementById("clinicSearchForm");
  const cityInput = document.getElementById("cityInput");
  const result = document.getElementById("clinicSearchResult");

  if (!form || !cityInput || !result) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();
    if (!city) {
      cityInput.focus();
      return;
    }

    const mapsUrl = new URL("https://www.google.com/maps/search/");
    mapsUrl.searchParams.set("api", "1");
    mapsUrl.searchParams.set("query", `servicios de salud sexual e ITS en ${city}`);

    const link = document.createElement("a");
    link.className = "btn btn-outline-brand";
    link.href = mapsUrl.toString();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `Ver servicios en ${city} en Google Maps ↗`;

    result.replaceChildren(link);
  });
}

// Cierra el menú colapsable de Bootstrap después de seleccionar un enlace en móvil.
function cerrarMenuMovilAlNavegar() {
  const menu = document.getElementById("mainNav");
  if (!menu || !window.bootstrap) return;

  menu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (menu.classList.contains("show")) {
        window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });
}
