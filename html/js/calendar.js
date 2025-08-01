function getYear(item) {
  return item['startDate'].split('-')[0]
}

function createyearcell(val) {
  return (val !== undefined) ? `<div class="col-xs-6" style="width: auto;">\
  <button id="ybtn${val}" class="btn btn-light rounded-0 yearbtn" value="${val}" onclick="updateyear(this.value)">${val}</button>\
</div>` : '';
}

var data = calendarData.map(r =>
({
  startDate: new Date(r.startDate),
  endDate: new Date(r.startDate),
  name: r.name,
  linkId: r.id,
  color: '#AC7790'
})).filter(r => r.startDate.getFullYear() === 1876);


years = Array.from(new Set(calendarData.map(getYear))).sort();
var yearsTable = document.getElementById('years-table');
for (var i = 0; i <= years.length; i++) {
  yearsTable.insertAdjacentHTML('beforeend', createyearcell(years[i]));
}

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
    color: '#AC7790'
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
      <a href="${event.linkId}" class="event-link">
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
    <div class="popup-content">
      <div class="popup-header">
        <h3 class="popup-date"></h3>
        <button class="popup-close" onclick="closeEventPopup()">&times;</button>
      </div>
      <div class="event-list"></div>
    </div>
    <div class="popup-backdrop" onclick="closeEventPopup()"></div>
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