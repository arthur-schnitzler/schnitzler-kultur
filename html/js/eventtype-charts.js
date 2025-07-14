const yearSelect = document.getElementById("yearSelect");
const anaChartCanvasElement = document.getElementById("anaChart"); 
const anaChartCanvas = anaChartCanvasElement.getContext("2d");
const anaNChartsContainer = document.getElementById("anaNChartsContainer");

let anaChart;
const anaNCharts = [];

// Deine 10 Labels für @ana mit festen Farben (HSL)
const anaLabels = [
  "Theater",
  "Veranstaltung",
  "Ausstellung",
  "Film",
  "Musik",
  "Lesung",
"Privatveranstaltung",
  "anderes",


];

const anaBaseColors = [
  "hsl(0, 70%, 50%)",    // Rot
  "hsl(30, 70%, 50%)",   // Orange
  "hsl(60, 70%, 50%)",   // Gelb
  "hsl(120, 70%, 40%)",  // Grün
  "hsl(300, 70%, 50%)",  // Magenta
  "hsl(180, 70%, 50%)",  // Türkis
  "hsl(210, 70%, 50%)",  // Blau
  "hsl(270, 70%, 50%)",  // Violett
  "hsl(330, 70%, 50%)",  // Pink
  "hsl(45, 70%, 40%)"    // dunkles Orange/Braun
];

// Helligkeit einer HSL-Farbe anpassen
function adjustLightness(hsl, amount) {
  const [h, s, l] = hsl.match(/\d+/g).map(Number);
  let newL = Math.min(90, Math.max(30, l + amount)); // nicht zu hell oder dunkel
  return `hsl(${h},${s}%,${newL}%)`;
}

// Label → Index der Basisfarbe (0–9)
function labelToBaseColorIndex(label) {
  const idx = anaLabels.indexOf(label);
  return idx === -1 ? null : idx;
}

// Haupt-Funktion zum Updaten der Charts
function updateChartsForYear(year, data) {
  let yearData;

  if (year === "alle") {
    // Gesamtauswertung erzeugen
    yearData = {
      ana_chart: {
        labels: [],
        datasets: [{ data: [], backgroundColor: [] }]
      },
      ana_n_charts: {}
    };

    // --- 1) Hauptchart alle Jahre zusammenfassen ---
    const combinedMainMap = new Map();

    for (const y in data) {
      const chart = data[y].ana_chart;
      chart.labels.forEach((label, i) => {
        const val = chart.datasets[0].data[i];
        if (!combinedMainMap.has(label)) combinedMainMap.set(label, 0);
        combinedMainMap.set(label, combinedMainMap.get(label) + val);
      });
    }

    yearData.ana_chart.labels = Array.from(combinedMainMap.keys());
    yearData.ana_chart.datasets[0].data = yearData.ana_chart.labels.map(label => combinedMainMap.get(label));
    yearData.ana_chart.datasets[0].backgroundColor = yearData.ana_chart.labels.map(label => {
      const idx = labelToBaseColorIndex(label);
      return idx !== null ? anaBaseColors[idx] : "hsl(0, 0%, 70%)"; // grauer fallback
    });

    // --- 2) Untercharts für alle Jahre zusammenfassen ---
    const combinedSubMap = new Map();

    for (const y in data) {
      const nCharts = data[y].ana_n_charts;
      for (const anaKey in nCharts) {
        if (!combinedSubMap.has(anaKey)) combinedSubMap.set(anaKey, new Map());
        const labelMap = combinedSubMap.get(anaKey);

        const chart = nCharts[anaKey];
        chart.labels.forEach((label, i) => {
          const val = chart.datasets[0].data[i];
          if (!labelMap.has(label)) labelMap.set(label, 0);
          labelMap.set(label, labelMap.get(label) + val);
        });
      }
    }

    // Untercharts neu aufbauen mit Farbvarianten
    yearData.ana_n_charts = {};
    for (const [anaKey, labelMap] of combinedSubMap.entries()) {
      const labels = Array.from(labelMap.keys());
      const dataArray = labels.map(label => labelMap.get(label));

      // Basisfarbe für anaKey bestimmen
      const baseColorIdx = labelToBaseColorIndex(anaKey);
      const baseColor = baseColorIdx !== null ? anaBaseColors[baseColorIdx] : "hsl(0,0%,70%)";

      // Helligkeitsvariationen pro Segment (etwas dunkler bis heller)
      const backgroundColor = labels.map((_, i) => adjustLightness(baseColor, i * 8));

      yearData.ana_n_charts[anaKey] = {
        labels,
        datasets: [{
          label: anaKey,
          data: dataArray,
          backgroundColor
        }]
      };
    }

  } else {
    // Einzeljahr laden
    yearData = data[year];
    // Hauptchart-Farben fix zuweisen
    yearData.ana_chart.datasets[0].backgroundColor = yearData.ana_chart.labels.map(label => {
      const idx = labelToBaseColorIndex(label);
      return idx !== null ? anaBaseColors[idx] : "hsl(0,0%,70%)";
    });

    // Untercharts mit Farbvarianten
    for (const anaKey in yearData.ana_n_charts) {
      const chart = yearData.ana_n_charts[anaKey];
      const baseColorIdx = labelToBaseColorIndex(anaKey);
      const baseColor = baseColorIdx !== null ? anaBaseColors[baseColorIdx] : "hsl(0,0%,70%)";

      chart.datasets[0].backgroundColor = chart.labels.map((_, i) => adjustLightness(baseColor, i * 8));
    }
  }

  // === Hauptchart zeichnen ===
  const chartData = yearData.ana_chart;
  const dataset = chartData.datasets[0];
  const totalEvents = dataset.data.reduce((sum, val) => sum + val, 0);

  const updatedLabels = chartData.labels.map((label, i) => `${label} (${dataset.data[i]})`);

  const baseSize = 200;
  const scaleFactor = 100;
  const dynamicSize = Math.round(baseSize + Math.log10(totalEvents + 1) * scaleFactor);
  anaChartCanvasElement.width = dynamicSize;
  anaChartCanvasElement.height = dynamicSize;

  if (anaChart) anaChart.destroy();

  anaChart = new Chart(anaChartCanvas, {
    type: 'pie',
    data: {
      labels: updatedLabels,
      datasets: [dataset]
    },
    options: {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: `${totalEvents} Ereignisse`
        }
      }
    }
  });

  // === Untercharts zeichnen ===
  anaNChartsContainer.innerHTML = '';
  anaNCharts.length = 0;

  Object.entries(yearData.ana_n_charts).forEach(([anaKey, chartData]) => {
    const dataset = chartData.datasets[0];
    const subTotal = dataset.data.reduce((sum, val) => sum + val, 0);

    const subSize = Math.round(baseSize + Math.log10(subTotal + 1) * scaleFactor);

    const canvas = document.createElement("canvas");
    canvas.width = subSize;
    canvas.height = subSize;
    canvas.className = "mb-5 d-block mx-auto";

    const title = document.createElement("h3");
    title.textContent = `»${anaKey}«: Verteilung`;

    anaNChartsContainer.appendChild(title);
    anaNChartsContainer.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    const updatedLabels = chartData.labels.map((label, i) => `${label} (${dataset.data[i]})`);

    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: updatedLabels,
        datasets: [dataset]
      },
      options: {
        responsive: false,
        plugins: {
          title: {
            display: true,
            text: `${subTotal} Ereignisse`
          }
        }
      }
    });

    anaNCharts.push(chart);
  });
}

// Daten laden und Listener setzen
fetch('./js-data/charts_by_year.json')
  .then(response => response.json())
  .then(data => {
    // Prüfen, ob "alles"-Option schon existiert, wenn nicht hinzufügen
    if (!Array.from(yearSelect.options).some(opt => opt.value === "alle")) {
      const allOption = document.createElement("option");
      allOption.value = "alle";
      allOption.textContent = "Alle";
      yearSelect.prepend(allOption);
    }

    // URL-Parameter lesen, oder Standardwert aus Select
    const urlParams = new URLSearchParams(window.location.search);
    const paramYear = urlParams.get("jahr") || yearSelect.value;

    yearSelect.value = paramYear;
    updateChartsForYear(paramYear, data);

    yearSelect.addEventListener("change", () => {
      updateChartsForYear(yearSelect.value, data);

      // URL-Parameter anpassen
      const url = new URL(window.location);
      url.searchParams.set("jahr", yearSelect.value);
      window.history.replaceState({}, "", url);
    });
  })
  .catch(err => console.error("Fehler beim Laden der Chart-Daten:", err));

  if (window.location.hash === "#") {
  const url = new URL(window.location);
  url.hash = ""; // entfernt das #
  window.history.replaceState({}, "", url);
}