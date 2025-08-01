function getYear(item) {
  return item['startDate'].split('-')[0]
}

function createyearcell(val) {
  return (val !== undefined) ? `<div class="col-xs-6" style="width: auto;">\
  <button id="ybtn${val}" class="btn btn-light rounded-0 yearbtn" value="${val}" onclick="updateyear(this.value)">${val}</button>\
</div>` : '';
}

// Map specific event types to main categories and colors
function getEventTypeCategory(eventType) {
  // Map from eventTypes.xml "description" to main category
  const typeToCategory = {
    // Theater category
    'Theateraufführung': 'Theater',
    'Generalprobe': 'Theater',
    'Probe': 'Theater',
    'Theaterpremiere': 'Theater',
    'Theateruraufführung': 'Theater',
    'Marionettentheater': 'Theater',
    'Kostümprobe': 'Theater',
    'Schulaufführung': 'Theater',
    'Arrangierprobe': 'Theater',
    'Studierendenaufführung': 'Theater',
    'Leseprobe': 'Theater',
    'Puppenspiel': 'Theater',
    'Matinée': 'Theater',
    
    // Musik category  
    'Quartett': 'Musik',
    'Orchesterkonzert': 'Musik',
    'Konzert': 'Musik',
    'Operettenaufführung': 'Musik',
    'Opernaufführung': 'Musik',
    'Kompositionskonzert': 'Musik',
    'Violinkonzert': 'Musik',
    'Musikpremiere': 'Musik',
    'Liederkonzert': 'Musik',
    'Ballett': 'Musik',
    'Tanzaufführung': 'Musik',
    'Philharmonisches Konzert': 'Musik',
    'Trio': 'Musik',
    'Klavierkonzert': 'Musik',
    'Wohltätigkeitskonzert': 'Musik',
    'Violin-Klavier-Konzert': 'Musik',
    'Musikuraufführung': 'Musik',
    'Chorgesang': 'Musik',
    'Sinfoniekonzert': 'Musik',
    'Revue': 'Musik',
    'Varieté': 'Musik',
    'Kammermusikkonzert': 'Musik',
    'Gesellschaftskonzert': 'Musik',
    'Cellokonzert': 'Musik',
    'Schulkonzert': 'Musik',
    'Tanz': 'Musik',
    'Orgelkonzert': 'Musik',
    'Volksgesang': 'Musik',
    
    // Vortrag category
    'Private Lesung': 'Vortrag',
    'Vorlesung': 'Vortrag',
    'Lesung': 'Vortrag',
    'Vortrag': 'Vortrag',
    
    // Film category
    'Filmvorführung': 'Film',
    'Private Filmvorführung': 'Film',
    'Filmpremiere': 'Film',
    'Varieté und Filmvorführung': 'Film',
    
    // Privatveranstaltung category
    'Diner': 'Privatveranstaltung',
    'Hochzeit': 'Privatveranstaltung',
    'Redoute': 'Privatveranstaltung',
    'Privater Vortrag': 'Privatveranstaltung',
    'Beerdigung': 'Privatveranstaltung',
    'Privates Konzert': 'Privatveranstaltung',
    'Ball': 'Privatveranstaltung',
    'Fest': 'Privatveranstaltung',
    'Hausball': 'Privatveranstaltung',
    'Soirée': 'Privatveranstaltung',
    'Polterabend': 'Privatveranstaltung',
    'Silberne Hochzeit': 'Privatveranstaltung',
    'Maskenball': 'Privatveranstaltung',
    'Souper': 'Privatveranstaltung',
    'Kostümfest': 'Privatveranstaltung',
    'Spielabend': 'Privatveranstaltung',
    'Damenabend': 'Privatveranstaltung',
    'Gesellschaftsabend': 'Privatveranstaltung',
    'Soirée-dansante': 'Privatveranstaltung',
    'Privataufführung': 'Privatveranstaltung',
    
    // Veranstaltung category
    'Empfang': 'Veranstaltung',
    'Vereinstreffen': 'Veranstaltung',
    'Festbesuch': 'Veranstaltung',
    'Bankett': 'Veranstaltung',
    'Messebesuch': 'Veranstaltung',
    'Veranstaltung': 'Veranstaltung',
    'Wohltätigkeitsveranstaltung': 'Veranstaltung',
    'Kongress': 'Veranstaltung',
    'Feier': 'Veranstaltung',
    'Vergnügungsabend': 'Veranstaltung',
    'Ballettsoirée': 'Veranstaltung',
    'Kränzchen': 'Veranstaltung',
    'Schulvortragsabend': 'Veranstaltung',
    'Kommers': 'Veranstaltung',
    'Kneipe': 'Veranstaltung',
    'Narrenabend': 'Veranstaltung',
    'Tanzkränzchen': 'Veranstaltung',
    'Universitätskränzchen': 'Veranstaltung',
    'Technikerkränzchen': 'Veranstaltung',
    'Wärmestuben-Kränzchen': 'Veranstaltung',
    'Unitaskränzchen': 'Veranstaltung',
    'Medizinerkränzchen': 'Veranstaltung',
    
    // Ausstellung category
    'Ausstellungsbesuch': 'Ausstellung',
    'Ausstellung': 'Ausstellung',
    
    // anderes category (explicit)
    'Schiedsgericht': 'anderes',
    'Heilige Messe': 'anderes',
    'Sitzung': 'anderes',
    'Zaubervorstellung': 'anderes',
    'Zirkusvorstellung': 'anderes',
    'Umzug': 'anderes',
    'Billardvorstellung': 'anderes',
    'Praktische Übung': 'anderes'
  };
  
  return typeToCategory[eventType] || 'anderes';
}

// Event labels and colors from eventtype-charts.js (lines 14-38)
const anaLabels = [
  "Theater",
  "Veranstaltung", 
  "Ausstellung",
  "Musik",
  "Film",
  "Vortrag",
  "Privatveranstaltung",
  "anderes"
];

const anaBaseColors = [
  "hsl(0, 70%, 50%)",    // Rot - Theater
  "hsl(30, 70%, 50%)",   // Orange - Veranstaltung
  "hsl(60, 70%, 50%)",   // Gelb - Ausstellung
  "hsl(120, 70%, 40%)",  // Grün - Musik
  "hsl(300, 70%, 50%)",  // Magenta - Film
  "hsl(180, 70%, 50%)",  // Türkis - Vortrag
  "hsl(210, 70%, 50%)",  // Blau - Privatveranstaltung
  "hsl(270, 70%, 50%)"   // Violett - anderes
];

// Convert HSL to hex for calendar compatibility
function hslToHex(hslString) {
  const [h, s, l] = hslString.match(/\d+/g).map(Number);
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;
  
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs((hNorm * 6) % 2 - 1));
  const m = lNorm - c/2;
  
  let r, g, b;
  if (hNorm < 1/6) {
    r = c; g = x; b = 0;
  } else if (hNorm < 2/6) {
    r = x; g = c; b = 0;
  } else if (hNorm < 3/6) {
    r = 0; g = c; b = x;
  } else if (hNorm < 4/6) {
    r = 0; g = x; b = c;
  } else if (hNorm < 5/6) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getEventColor(eventTypeOrName, eventObj = null) {
  let category;
  
  if (eventObj && eventObj.type) {
    // Use the structured type data from XML
    category = getEventTypeCategory(eventObj.type);
  } else {
    // Fallback to text analysis for backwards compatibility
    const name = eventTypeOrName.toLowerCase();
    if (name.includes('sitzung') || name.includes('tagung') || name.includes('vorstandssitzung')) {
      category = 'anderes';
    } else if (name.includes('aufführung') || name.includes('generalprobe') || name.includes('theater') || name.includes('oper')) {
      category = 'Theater';
    } else if (name.includes('konzert') || name.includes('zyklus') || name.includes('klavierkonzert') || name.includes('sonatenabend') || name.includes('quartett')) {
      category = 'Musik';
    } else if (name.includes('ausstellung')) {
      category = 'Ausstellung';
    } else if (name.includes('lesung')) {
      category = 'Vortrag';
    } else if (name.includes('empfang') || name.includes('heurigen')) {
      category = 'Veranstaltung';
    } else {
      category = 'anderes';
    }
  }
  
  // Map category to color using same scheme as charts
  const categoryIndex = anaLabels.indexOf(category);
  if (categoryIndex !== -1) {
    return hslToHex(anaBaseColors[categoryIndex]);
  }
  
  // Default fallback
  return hslToHex(anaBaseColors[7]); // anderes - violett
}

var data = calendarData.map(r =>
({
  startDate: new Date(r.startDate),
  endDate: new Date(r.startDate),
  name: r.name,
  linkId: r.id,
  color: getEventColor(r.name, r)
})).filter(r => r.startDate.getFullYear() === 1876);


years = Array.from(new Set(calendarData.map(getYear))).sort();
var yearsTable = document.getElementById('years-table');
for (var i = 0; i <= years.length; i++) {
  yearsTable.insertAdjacentHTML('beforeend', createyearcell(years[i]));
}

// Create color legend using same colors as charts
function createColorLegend() {
  const legends = anaLabels.map((label, index) => ({
    color: hslToHex(anaBaseColors[index]),
    label: label
  }));

  const legendContainer = document.createElement('div');
  legendContainer.id = 'calendar-legend';
  legendContainer.className = 'calendar-color-legend';
  
  const legendTitle = document.createElement('h6');
  legendTitle.textContent = 'Kategorien:';
  legendTitle.style.marginBottom = '10px';
  legendContainer.appendChild(legendTitle);

  const legendList = document.createElement('div');
  legendList.className = 'legend-items';
  
  legends.forEach(item => {
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.innerHTML = `
      <span class="legend-color" style="background-color: ${item.color}"></span>
      <span class="legend-label">${item.label}</span>
    `;
    legendList.appendChild(legendItem);
  });
  
  legendContainer.appendChild(legendList);
  
  // Insert legend after years table
  yearsTable.parentNode.insertBefore(legendContainer, yearsTable.nextSibling);
}

// Create the legend
createColorLegend();

//document.getElementById("ybtn1900").classList.add("focus");

const calendar = new Calendar('#calendar', {
  startYear: 1876,
  language: "de",
  dataSource: data,
  displayHeader: false,
  style: 'custom',
  customDataSourceRenderer: function(element, currentDate, events) {
    // Clear any existing content
    element.innerHTML = '';
    element.style.position = 'relative';
    element.style.height = '100%';
    element.style.overflow = 'visible';
    
    // Sort events by color to group similar events together
    const sortedEvents = events.sort((a, b) => a.color.localeCompare(b.color));
    
    // Create stacked bars for multiple events
    sortedEvents.forEach((event, index) => {
      const eventBar = document.createElement('div');
      eventBar.style.position = 'absolute';
      eventBar.style.left = '2px';
      eventBar.style.right = '2px';
      eventBar.style.height = '3px';
      eventBar.style.backgroundColor = event.color;
      eventBar.style.top = `${2 + (index * 4)}px`; // Stack bars with 4px spacing
      eventBar.style.borderRadius = '1px';
      eventBar.style.zIndex = '10';
      eventBar.title = event.name; // Tooltip
      
      element.appendChild(eventBar);
    });
    
    // Add a subtle indicator for multiple events
    if (events.length > 1) {
      const indicator = document.createElement('div');
      indicator.style.position = 'absolute';
      indicator.style.right = '1px';
      indicator.style.bottom = '1px';
      indicator.style.width = '8px';
      indicator.style.height = '8px';
      indicator.style.backgroundColor = 'rgba(0,0,0,0.3)';
      indicator.style.borderRadius = '50%';
      indicator.style.fontSize = '6px';
      indicator.style.color = 'white';
      indicator.style.display = 'flex';
      indicator.style.alignItems = 'center';
      indicator.style.justifyContent = 'center';
      indicator.style.fontWeight = 'bold';
      indicator.style.zIndex = '15';
      indicator.textContent = events.length;
      indicator.title = `${events.length} Events`;
      
      element.appendChild(indicator);
    }
  },
  clickDay: function (e) {
    if (e.events.length === 1) {
      window.location = e.events[0].linkId;
    } else if (e.events.length > 1) {
      showEventPopup(e.events, e.date);
    }
  },
  renderEnd: function(e) {
    const buttons = document.querySelectorAll(".yearbtn");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('focus');
   }
    document.getElementById(`ybtn${e.currentYear}`).classList.add("focus");
}
});

function updateyear(year) {
  calendar.setYear(year);
  const dataSource = calendarData.map(r =>
  ({
    startDate: new Date(r.startDate),
    endDate: new Date(r.startDate),
    name: r.name,
    linkId: r.id,
    color: getEventColor(r.name, r)
  })).filter(r => r.startDate.getFullYear() === parseInt(year));
  
  // Update calendar with new data and ensure custom renderer is applied
  calendar.setDataSource(dataSource);
  calendar.setStyle('custom');
}

function showEventPopup(events, date) {
  // Check if popup is already visible to prevent duplicates
  const existingPopup = document.getElementById('eventPopup');
  if (existingPopup && existingPopup.style.display === 'block') {
    return;
  }
  
  const popup = existingPopup || createEventPopup();
  const eventList = popup.querySelector('.event-list');
  const dateHeader = popup.querySelector('.popup-date');
  
  // Format date for display
  const formattedDate = date.toLocaleDateString('de-DE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  dateHeader.textContent = formattedDate;
  eventList.innerHTML = '';
  
  // Create unique events array to avoid duplicates
  const uniqueEvents = events.filter((event, index, self) => 
    index === self.findIndex(e => e.linkId === event.linkId)
  );
  
  uniqueEvents.forEach(event => {
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';
    eventItem.innerHTML = `
      <a href="${event.linkId}" class="event-link" onclick="event.stopPropagation();">
        ${event.name}
      </a>
    `;
    eventList.appendChild(eventItem);
  });
  
  popup.style.display = 'block';
  
  // Add keyboard listener for ESC key
  document.addEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closeEventPopup();
  }
}

function createEventPopup() {
  const popup = document.createElement('div');
  popup.id = 'eventPopup';
  popup.className = 'event-popup';
  popup.innerHTML = `
    <div class="popup-backdrop" onclick="closeEventPopup()"></div>
    <div class="popup-content" onclick="event.stopPropagation();">
      <div class="popup-header">
        <h3 class="popup-date"></h3>
        <button class="popup-close" onclick="closeEventPopup()">&times;</button>
      </div>
      <div class="event-list"></div>
    </div>
  `;
  
  document.body.appendChild(popup);
  return popup;
}

function closeEventPopup() {
  const popup = document.getElementById('eventPopup');
  if (popup) {
    popup.style.display = 'none';
  }
  
  // Remove keyboard listener
  document.removeEventListener('keydown', handleEscapeKey);
}