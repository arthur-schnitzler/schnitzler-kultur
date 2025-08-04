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


// Create calendar data - now supports multiple events per day with individual colors
function createCalendarData(rawData, year) {
  return createFilteredCalendarData(rawData, year);
}

// Create filtered calendar data based on enabled categories
function createFilteredCalendarData(rawData, year) {
  const events = rawData.map(r => {
    const eventColor = getEventColor(r.name, r);
    const category = getEventTypeCategory(r.type || r.name);
    
    return {
      startDate: new Date(r.startDate),
      endDate: new Date(r.startDate),
      name: r.name,
      linkId: r.id,
      color: eventColor,
      type: r.type,
      category: category
    };
  }).filter(r => {
    // Filter by year and enabled categories
    return r.startDate.getFullYear() === year && enabledCategories.has(r.category);
  });
  
  // Return all events individually - js-year-calendar will handle multiple events per day
  return events;
}


// Track which categories are enabled - must be defined before use
let enabledCategories = new Set(anaLabels);

var data = createCalendarData(calendarData, 1876);

years = Array.from(new Set(calendarData.map(getYear))).sort();
var yearsTable = document.getElementById('years-table');
for (var i = 0; i <= years.length; i++) {
  yearsTable.insertAdjacentHTML('beforeend', createyearcell(years[i]));
}

// Create interactive color legend with toggle functionality
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
  legendTitle.style.margin = '0 0 5px 0';
  legendContainer.appendChild(legendTitle);
  
  const buttonGroup = document.createElement('div');
  buttonGroup.style.marginBottom = '10px';
  
  const selectAllBtn = document.createElement('button');
  selectAllBtn.textContent = 'Alle';
  selectAllBtn.style.marginRight = '10px';
  selectAllBtn.style.padding = '2px 8px';
  selectAllBtn.style.fontSize = '12px';
  selectAllBtn.style.border = 'none';
  selectAllBtn.style.background = 'none';
  selectAllBtn.style.color = '#007bff';
  selectAllBtn.style.cursor = 'pointer';
  selectAllBtn.style.textDecoration = 'underline';
  selectAllBtn.onclick = selectAllCategories;
  
  const deselectAllBtn = document.createElement('button');
  deselectAllBtn.textContent = 'Keine';
  deselectAllBtn.style.padding = '2px 8px';
  deselectAllBtn.style.fontSize = '12px';
  deselectAllBtn.style.border = 'none';
  deselectAllBtn.style.background = 'none';
  deselectAllBtn.style.color = '#007bff';
  deselectAllBtn.style.cursor = 'pointer';
  deselectAllBtn.style.textDecoration = 'underline';
  deselectAllBtn.onclick = deselectAllCategories;
  
  buttonGroup.appendChild(selectAllBtn);
  buttonGroup.appendChild(deselectAllBtn);
  legendContainer.appendChild(buttonGroup);

  const legendList = document.createElement('div');
  legendList.className = 'legend-items';
  
  legends.forEach(item => {
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item clickable';
    legendItem.dataset.category = item.label;
    legendItem.innerHTML = `
      <span class="legend-color" style="background-color: ${item.color}"></span>
      <span class="legend-label">${item.label}</span>
    `;
    
    // Add click handler for toggling
    legendItem.onclick = () => toggleCategory(item.label);
    
    legendList.appendChild(legendItem);
  });
  
  legendContainer.appendChild(legendList);
  
  // Add CSS for interactive legend
  addLegendStyles();
  
  // Insert legend after years table
  yearsTable.parentNode.insertBefore(legendContainer, yearsTable.nextSibling);
}

// Add CSS styles for interactive legend
function addLegendStyles() {
  if (!document.getElementById('legend-styles')) {
    const style = document.createElement('style');
    style.id = 'legend-styles';
    style.textContent = `
      .legend-item.clickable {
        cursor: pointer;
        padding: 2px 0;
        transition: opacity 0.2s;
      }
      
      .legend-item.clickable:hover {
        opacity: 0.7;
      }
      
      .legend-item.disabled {
        opacity: 0.3;
      }
      
      .legend-item.disabled .legend-color {
        background-color: #ccc !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// Toggle category visibility
function toggleCategory(category) {
  if (enabledCategories.has(category)) {
    enabledCategories.delete(category);
  } else {
    enabledCategories.add(category);
  }
  
  // Update legend appearance
  updateLegendAppearance();
  
  // Refresh calendar with filtered data
  refreshCalendarWithFilters();
}

// Update legend visual state
function updateLegendAppearance() {
  const legendItems = document.querySelectorAll('.legend-item[data-category]');
  legendItems.forEach(item => {
    const category = item.dataset.category;
    if (enabledCategories.has(category)) {
      item.classList.remove('disabled');
    } else {
      item.classList.add('disabled');
    }
  });
}

// Refresh calendar with current filters
function refreshCalendarWithFilters() {
  const currentYear = calendar.getYear();
  const filteredData = createFilteredCalendarData(calendarData, currentYear);
  calendar.setDataSource(filteredData);
  
  // Apply custom stacking after filter change
  setTimeout(() => {
    applySimpleEventStacking();
  }, 200);
}

// Select all categories
function selectAllCategories() {
  enabledCategories = new Set(anaLabels);
  updateLegendAppearance();
  refreshCalendarWithFilters();
}

// Deselect all categories
function deselectAllCategories() {
  enabledCategories.clear();
  updateLegendAppearance();
  refreshCalendarWithFilters();
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
      // Single event - navigate directly
      window.location = e.events[0].linkId;
    } else if (e.events.length > 1) {
      // Multiple events - show popup
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
  const dataSource = createFilteredCalendarData(calendarData, parseInt(year));
  calendar.setDataSource(dataSource);
  
  // Apply custom stacking after year change
  setTimeout(() => {
    applySimpleEventStacking();
  }, 200);
}

// Add CSS for better multiple event display
function applySimpleEventStacking() {
  const calendarElement = document.querySelector('#calendar');
  if (!calendarElement) return;
  
  // Add styles for better multiple event display
  if (!document.getElementById('event-stacking-styles')) {
    const style = document.createElement('style');
    style.id = 'event-stacking-styles';
    style.textContent = `
      /* Improve day cell styling */
      .calendar table td.day {
        position: relative !important;
        vertical-align: top !important;
        padding: 2px !important;
        min-height: 30px !important;
      }
      
      /* Custom event bars container */
      .custom-event-bars {
        position: absolute !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 5 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 0 !important;
      }
      
      .custom-event-bars .custom-event-bar {
        height: 1mm !important;
        width: 100% !important;
        display: block !important;
        margin: 0 !important;
        border: none !important;
      }
      
      /* Hide original events but keep them for click handling */
      .calendar .event {
        opacity: 0 !important;
        pointer-events: none !important;
      }
      
      /* Style for more events indicator */
      .calendar .more-events-indicator {
        position: absolute;
        bottom: 1px;
        right: 2px;
        font-size: 8px;
        color: rgba(0,0,0,0.8);
        font-weight: bold;
        line-height: 1;
        z-index: 10;
      }
      
      /* Improve hover effect */
      .calendar table td.day:hover {
        box-shadow: inset 0 0 0 1px rgba(0,0,0,0.2) !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Create custom event bars after calendar renders
  setTimeout(() => {
    // Get the current year and data source from the calendar
    const currentYear = calendar.getYear();
    const dataSource = calendar.getDataSource();
    
    // Debug: Show what data we're working with
    if (currentYear === 1876) {
      console.log(`Debug 1876: Current year: ${currentYear}`);
      console.log(`Debug 1876: DataSource length: ${dataSource.length}`);
      console.log(`Debug 1876: First few events:`, dataSource.slice(0, 5).map(e => ({
        name: e.name,
        date: e.startDate.toDateString(),
        year: e.startDate.getFullYear()
      })));
    }
    
    // Group events by date
    const eventsByDate = {};
    dataSource.forEach(event => {
      const dateKey = event.startDate.toDateString();
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }
      eventsByDate[dateKey].push(event);
    });
    
    // Process each day cell - try multiple selectors
    let dayElements = calendarElement.querySelectorAll('td[data-date]');
    if (dayElements.length === 0) {
      // Fallback: find day cells by class or content
      dayElements = calendarElement.querySelectorAll('td.day, td[class*="day"]');
    }
    
    dayElements.forEach((dayEl, index) => {
      let cellDate;
      let dateKey;
      let eventsForDay = [];
      
      // Try to get date from data attribute
      const dateAttr = dayEl.getAttribute('data-date');
      if (dateAttr) {
        cellDate = new Date(dateAttr);
        dateKey = cellDate.toDateString();
        eventsForDay = eventsByDate[dateKey] || [];
      } else {
        // Fallback: try to extract date from text content or position
        const dayText = dayEl.textContent.trim();
        const dayNumber = parseInt(dayText);
        
        if (dayNumber && dayNumber >= 1 && dayNumber <= 31) {
          // Find events that match this day number and year
          eventsForDay = dataSource.filter(event => {
            const eventDate = event.startDate.getDate();
            const eventYear = event.startDate.getFullYear();
            const match = eventDate === dayNumber && eventYear === currentYear;
            
            // Debug: Log matches for 1876 to see what's happening
            if (currentYear === 1876 && match) {
              console.log(`Debug 1876: Day ${dayNumber} matched event:`, {
                eventName: event.name,
                eventDate: event.startDate.toDateString(),
                dayNumber: dayNumber,
                eventDay: eventDate,
                currentYear: currentYear,
                eventYear: eventYear
              });
            }
            
            return match;
          });
        }
      }
      
      // Remove existing custom bars
      const existingBars = dayEl.querySelector('.custom-event-bars');
      if (existingBars) {
        existingBars.remove();
      }
      
      if (eventsForDay.length > 0) {
        // Create container for custom event bars
        const barsContainer = document.createElement('div');
        barsContainer.className = 'custom-event-bars';
        
        // Add click handler to the entire day cell for event navigation
        const originalClickHandler = dayEl.onclick;
        dayEl.onclick = function(e) {
          if (eventsForDay.length === 1) {
            // Single event - navigate directly
            window.location = eventsForDay[0].linkId;
          } else if (eventsForDay.length > 1) {
            // Multiple events - show popup
            const date = eventsForDay[0].startDate;
            showEventPopup(eventsForDay, date);
          }
          e.stopPropagation();
        };
        
        // Create individual bars for each event
        eventsForDay.forEach((event, index) => {
          if (index < 8) { // Limit to 8 visible bars
            const bar = document.createElement('div');
            bar.className = 'custom-event-bar';
            bar.style.backgroundColor = event.color;
            bar.title = event.name; // Add tooltip
            barsContainer.appendChild(bar);
          }
        });
        
        dayEl.appendChild(barsContainer);
        
        // Add indicator for more than 8 events
        if (eventsForDay.length > 8) {
          const existingIndicator = dayEl.querySelector('.more-events-indicator');
          if (existingIndicator) {
            existingIndicator.remove();
          }
          
          const indicator = document.createElement('span');
          indicator.className = 'more-events-indicator';
          indicator.textContent = `+${eventsForDay.length - 8}`;
          indicator.title = `${eventsForDay.length} Events insgesamt`;
          dayEl.appendChild(indicator);
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