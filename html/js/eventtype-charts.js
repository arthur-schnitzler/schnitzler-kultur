const yearSelect = document.getElementById("yearSelect");
const anaChartCanvasElement = document.getElementById("anaChart"); 
const anaChartCanvas = anaChartCanvasElement.getContext("2d");
const anaNChartsContainer = document.getElementById("anaNChartsContainer");

let chartType = "pie"; // Default
let chartDataByYear;   // globale Daten

let anaChart;
const anaNCharts = [];


// Labels für @ana mit festen Farben (matching calendar.js)
const anaLabels = [
  "Theater",
  "Musik",
  "Film",
  "Vortrag",
  "Privatveranstaltung",
  "anderes"
];

const anaBaseColors = [
  "#8B4513",    // Theater - Saddle Brown
  "#228B22",    // Musik - Forest Green
  "#FF1493",    // Film - Deep Pink (kept original)
  "#00CED1",    // Vortrag - Dark Turquoise
  "#4169E1",    // Privatveranstaltung - Royal Blue
  "#9932CC"     // anderes - Dark Orchid
];

// Generate color variations using HSL for better control
function generateColorVariation(baseHex, index, total) {
  // Convert hex to RGB
  const r = parseInt(baseHex.substr(1, 2), 16) / 255;
  const g = parseInt(baseHex.substr(3, 2), 16) / 255;
  const b = parseInt(baseHex.substr(5, 2), 16) / 255;
  
  // Convert RGB to HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  let h, s, l = (max + min) / 2;
  
  if (diff === 0) {
    h = s = 0;
  } else {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    switch (max) {
      case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
      case g: h = (b - r) / diff + 2; break;
      case b: h = (r - g) / diff + 4; break;
    }
    h /= 6;
  }
  
  // Create variations by adjusting lightness and saturation
  // Distribute variations across a wider range
  const factor = total > 1 ? (index / (total - 1)) : 0;
  
  // Create variations from dark to light with some saturation changes
  let newL, newS;
  if (factor < 0.5) {
    // Darker variations (first half)
    newL = Math.max(0.15, l * (0.4 + factor * 1.2));
    newS = Math.min(1, s * (1 + factor * 0.5));
  } else {
    // Lighter variations (second half) 
    newL = Math.min(0.9, l + (factor - 0.5) * 1.4);
    newS = Math.max(0.3, s * (1.5 - (factor - 0.5) * 0.8));
  }
  
  // Convert HSL back to RGB
  const hslToRgb = (h, s, l) => {
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };
  
  const [red, green, blue] = hslToRgb(h, newS, newL);
  return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
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
      return idx !== null ? anaBaseColors[idx] : "#B0B0B0"; // grauer fallback
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
      const baseColor = baseColorIdx !== null ? anaBaseColors[baseColorIdx] : "#B0B0B0";

      // Farbvariationen pro Segment (von dunkel zu hell)
      const backgroundColor = labels.map((_, i) => generateColorVariation(baseColor, i, labels.length));

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
      return idx !== null ? anaBaseColors[idx] : "#B0B0B0";
    });

    // Untercharts mit Farbvarianten
    for (const anaKey in yearData.ana_n_charts) {
      const chart = yearData.ana_n_charts[anaKey];
      const baseColorIdx = labelToBaseColorIndex(anaKey);
      const baseColor = baseColorIdx !== null ? anaBaseColors[baseColorIdx] : "#B0B0B0";

      chart.datasets[0].backgroundColor = chart.labels.map((_, i) => generateColorVariation(baseColor, i, chart.labels.length));
    }
  }

  // === Hauptchart zeichnen ===
  const chartData = yearData.ana_chart;
  const dataset = chartData.datasets[0];
  const totalEvents = dataset.data.reduce((sum, val) => sum + val, 0);

  const updatedLabels = chartData.labels.map((label, i) => `${label} (${dataset.data[i]})`);

anaChartCanvasElement.width = 500;
anaChartCanvasElement.height = 500;

  if (anaChart) anaChart.destroy();

  anaChart = new Chart(anaChartCanvas, {
  type: chartType,
  data: {
    labels: updatedLabels,
    datasets: [{
      ...dataset,
      borderWidth: 1
    }]
  },
  options: {
    responsive: false,
    plugins: {
      title: {
        display: true,
        text: `${totalEvents} Ereignisse`
      },
      legend: {
        display: chartType === 'pie'
      }
    },
    indexAxis: chartType === 'bar' ? 'y' : undefined,
scales: chartType === 'bar' ? {
  x: {
    beginAtZero: true,
    title: { display: true, text: 'Anzahl' },
    ticks: {
      autoSkip: false,
      maxRotation: 45,
      minRotation: 45
    }
  },
  y: {
    ticks: {
      autoSkip: false,
      maxRotation: 45,
      minRotation: 45
    }
  }
} : {}
  }
});

  // === Untercharts zeichnen ===
  anaNChartsContainer.innerHTML = '';
  anaNCharts.length = 0;

  Object.entries(yearData.ana_n_charts).forEach(([anaKey, chartData]) => {
    const dataset = chartData.datasets[0];
    const subTotal = dataset.data.reduce((sum, val) => sum + val, 0);

const labelCount = chartData.labels.length;

    const canvas = document.createElement("canvas");
canvas.width = 400;
canvas.height = 400;    canvas.className = "mb-5 d-block mx-auto";

    const title = document.createElement("h3");
    title.textContent = `»${anaKey}«: Verteilung`;

    anaNChartsContainer.appendChild(title);
    anaNChartsContainer.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    const updatedLabels = chartData.labels.map((label, i) => `${label} (${dataset.data[i]})`);

    const chart = new Chart(ctx, {
  type: chartType,
  data: {
    labels: updatedLabels,
    datasets: [{
      ...dataset,
      borderWidth: 1
    }]
  },
  options: {
    responsive: false,
    indexAxis: chartType === 'bar' ? 'y' : 'x',  // 👈 Das ist neu!
    plugins: {
      title: {
        display: true,
        text: `${subTotal} Ereignisse`
      },
      legend: {
        display: chartType === 'pie',
      }
    },
    scales: chartType === 'bar' ? {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Anzahl'
        }
      },
      y: {
        ticks: {
          autoSkip: false
        }
      }
    } : {}
  }
});


    anaNCharts.push(chart);
  });
}

// Entferne das "#" aus der URL, falls es alleine steht
if (window.location.hash === "#") {
  const url = new URL(window.location);
  url.hash = "";
  window.history.replaceState({}, "", url);
}

// Daten laden
fetch('./js-data/charts_by_year.json')
  .then(response => response.json())
  .then(data => {
    chartDataByYear = data;

    // URL-Parameter lesen
    const urlParams = new URLSearchParams(window.location.search);
    const paramYear = urlParams.get("jahr") || "alle";
    chartType = urlParams.get("typ") || "pie";

    // "Alle"-Option hinzufügen, wenn nicht vorhanden
    if (![...yearSelect.options].some(opt => opt.value === "alle")) {
      const allOption = document.createElement("option");
      allOption.value = "alle";
      allOption.textContent = "Alle";
      yearSelect.prepend(allOption);
    }

    // Falls das Jahr aus der URL nicht in der Selectbox ist, hinzufügen
    if (![...yearSelect.options].some(opt => opt.value === paramYear)) {
      const customOption = document.createElement("option");
      customOption.value = paramYear;
      customOption.textContent = paramYear === "alle" ? "Alle" : paramYear;
      yearSelect.appendChild(customOption);
    }

    // Initiale Auswahl setzen
    yearSelect.value = paramYear;
    chartTypeToggle.checked = (chartType === "bar");

    // Diagramm initial anzeigen
    updateChartsForYear(paramYear, chartDataByYear);

    // Jahr-Änderung Listener
    yearSelect.addEventListener("change", () => {
      updateChartsForYear(yearSelect.value, chartDataByYear);

      const url = new URL(window.location);
      url.searchParams.set("jahr", yearSelect.value);
      url.searchParams.set("typ", chartType);
      window.history.replaceState({}, "", url);
    });

    // Charttyp-Toggle Listener
    chartTypeToggle.addEventListener("change", () => {
      chartType = chartTypeToggle.checked ? "bar" : "pie";
      updateChartsForYear(yearSelect.value, chartDataByYear);

      const url = new URL(window.location);
      url.searchParams.set("typ", chartType);
      url.searchParams.set("jahr", yearSelect.value);
      window.history.replaceState({}, "", url);
    });
  })
  .catch(err => console.error("Fehler beim Laden der Chart-Daten:", err));
