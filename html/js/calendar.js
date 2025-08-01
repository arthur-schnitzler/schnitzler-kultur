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
    'Privataufführung': 'Privatveranstaltung'
  };
  
  return typeToCategory[eventType] || 'anderes';
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
      category = 'anderes';
    } else if (name.includes('lesung')) {
      category = 'Vortrag';
    } else if (name.includes('empfang') || name.includes('heurigen')) {
      category = 'anderes';
    } else {
      category = 'anderes';
    }
  }
  
  // Map categories to colors
  switch (category) {
    case 'Theater': return '#A23B72'; // Pink/Magenta für Theater
    case 'Musik': return '#F18F01'; // Orange für Musik
    case 'Vortrag': return '#592E83'; // Lila für Vorträge/Lesungen
    case 'Film': return '#6A4C93'; // Dunkellila für Film
    case 'Privatveranstaltung': return '#037A33'; // Grün für Private Events
    case 'anderes': 
    default: return '#2E86AB'; // Blau für Sitzungen/anderes
  }
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

// Create color legend
function createColorLegend() {
  const legends = [
    { color: '#A23B72', label: 'Theater' },
    { color: '#F18F01', label: 'Musik' },
    { color: '#592E83', label: 'Vorträge/Lesungen' },
    { color: '#6A4C93', label: 'Film' },
    { color: '#037A33', label: 'Privatveranstaltungen' },
    { color: '#2E86AB', label: 'Sitzungen/Anderes' }
  ];

  const legendContainer = document.createElement('div');
  legendContainer.id = 'calendar-legend';
  legendContainer.className = 'calendar-color-legend';
  
  const legendTitle = document.createElement('h6');
  legendTitle.textContent = 'Event-Kategorien:';
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
  calendar.setDataSource(dataSource);
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