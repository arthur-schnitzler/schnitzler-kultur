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

// Group events by date to handle multiple events per day
function groupEventsByDate(events) {
  const grouped = {};
  events.forEach(event => {
    const dateKey = event.startDate.toDateString();
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(event);
  });
  return grouped;
}

// Create calendar data with mixed colors for multiple events
function createCalendarData(rawData, year) {
  const events = rawData.map(r => ({
    startDate: new Date(r.startDate),
    endDate: new Date(r.startDate),
    name: r.name,
    linkId: r.id,
    color: getEventColor(r.name, r),
    type: r.type
  })).filter(r => r.startDate.getFullYear() === year);
  
  const groupedEvents = groupEventsByDate(events);
  const result = [];
  
  Object.values(groupedEvents).forEach(dayEvents => {
    if (dayEvents.length === 1) {
      // Single event - use its color
      result.push(dayEvents[0]);
    } else {
      // Multiple events - create a combined event with mixed color indication
      const combinedEvent = {
        startDate: dayEvents[0].startDate,
        endDate: dayEvents[0].endDate,
        name: `${dayEvents.length} Events: ${dayEvents.map(e => e.name.substring(0, 30)).join(', ')}...`,
        linkId: dayEvents[0].linkId, // We'll handle multiple in click handler
        color: createMixedColor(dayEvents.map(e => e.color)),
        events: dayEvents // Store all events for the popup
      };
      result.push(combinedEvent);
    }
  });
  
  return result;
}

// Create a mixed color for multiple events (diagonal stripes effect)
function createMixedColor(colors) {
  // For now, use the first color but with reduced opacity to indicate multiple events
  return colors[0] + '80'; // Add 50% opacity
}

var data = createCalendarData(calendarData, 1876);


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
  clickDay: function (e) {
    if (e.events.length === 1) {
      const event = e.events[0];
      if (event.events && event.events.length > 1) {
        // This is a combined event with multiple events
        showEventPopup(event.events, e.date);
      } else {
        // Single event
        window.location = event.linkId;
      }
    } else if (e.events.length > 1) {
      // Multiple separate events (shouldn't happen with our grouping, but safety)
      showEventPopup(e.events, e.date);
    }
  },
  renderEnd: function(e) {
    const buttons = document.querySelectorAll(".yearbtn");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('focus');
   }
    document.getElementById(`ybtn${e.currentYear}`).classList.add("focus");
    
    // After calendar renders, apply custom stacking using CSS approach
    setTimeout(applySimpleEventStacking, 200);
}
});

function updateyear(year) {
  calendar.setYear(year);
  const dataSource = createCalendarData(calendarData, parseInt(year));
  calendar.setDataSource(dataSource);
}

// Add CSS for better multiple event display
function applySimpleEventStacking() {
  const calendarElement = document.querySelector('#calendar');
  if (!calendarElement) return;
  
  // Add visual indicators for multiple events
  if (!document.getElementById('event-stacking-styles')) {
    const style = document.createElement('style');
    style.id = 'event-stacking-styles';
    style.textContent = `
      /* Improve day cell styling */
      .calendar table td.day {
        position: relative !important;
        vertical-align: top !important;
      }
      
      /* Add indicator for multiple events */
      .calendar table td.day[title*="Events:"]:after {
        content: "⋯";
        position: absolute;
        bottom: 1px;
        right: 2px;
        font-size: 8px;
        color: rgba(0,0,0,0.7);
        font-weight: bold;
        line-height: 1;
        z-index: 10;
      }
      
      /* Add subtle pattern for multiple event days */
      .calendar table td.day[title*="Events:"] {
        background-image: repeating-linear-gradient(
          45deg,
          transparent,
          transparent 1px,
          rgba(255,255,255,0.2) 1px,
          rgba(255,255,255,0.2) 2px
        ) !important;
      }
      
      /* Improve hover effect */
      .calendar table td.day:hover {
        box-shadow: inset 0 0 0 1px rgba(0,0,0,0.2) !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add tooltips to indicate multiple events
  setTimeout(() => {
    const dayElements = calendarElement.querySelectorAll('td.day');
    dayElements.forEach(dayEl => {
      // Find events for this day from calendar data
      const dateAttr = dayEl.getAttribute('data-date');
      if (dateAttr) {
        const eventsForDay = calendar.getDataSource().filter(event => {
          const eventDateString = event.startDate.toISOString().split('T')[0];
          return eventDateString === dateAttr;
        });
        
        if (eventsForDay.length > 0 && eventsForDay[0].events && eventsForDay[0].events.length > 1) {
          dayEl.title = `${eventsForDay[0].events.length} Events: Click to see all`;
        }
      }
    });
  }, 300);
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