/**
 * Initialization script for the SimpleCalendar
 * Tagesdetails öffnen sich in einer seitlichen Spalte (Drawer);
 * dort kann mit Vortag/Folgetag tageweise geblättert werden.
 * Bei genau einem Ereignis an einem Tag wird direkt zur Ereignisseite navigiert.
 */

let calendar;
let data = [];

const categoryColors = {
  'Theater': '#8B4513',
  'Musik': '#228B22',
  'Film': '#FF1493',
  'Vortrag': '#00CED1',
  'Privatveranstaltung': '#4169E1',
  'anderes': '#9932CC'
};

const categoryLabels = {
  'Theater': 'Theater',
  'Musik': 'Musik',
  'Film': 'Film',
  'Vortrag': 'Vortrag',
  'Privatveranstaltung': 'Privatveranstaltung',
  'anderes': 'Anderes'
};

const activeFilters = new Set(Object.keys(categoryColors)); // Alle Kategorien standardmäßig aktiv
window.activeFilters = activeFilters;

const monthNamesDrawer = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const dayNamesDrawer = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag',
  'Freitag', 'Samstag'];

// Einträge nach Datum für das tageweise Blättern im Drawer
let eventsByDate = new Map();
let minDate = null;
let maxDate = null;

// Zuordnung Ereignistyp (aus eventTypes.xml) -> Hauptkategorie
let eventTypeMappings = {};

async function loadEventTypeMappings() {
  try {
    const response = await fetch('./eventTypes.xml');
    const xmlText = await response.text();
    const xmlDoc = new DOMParser().parseFromString(xmlText, 'text/xml');
    xmlDoc.querySelectorAll('item').forEach(item => {
      const type = item.getAttribute('type');
      const description = item.querySelector('description').textContent;
      eventTypeMappings[description] = type;
    });
  } catch (error) {
    console.warn('Konnte eventTypes.xml nicht laden, verwende Fallback-Kategorisierung:', error);
  }
}

function getEventCategory(event) {
  if (!event.type) return 'anderes';

  if (eventTypeMappings[event.type]) {
    return eventTypeMappings[event.type];
  }

  const name = (event.name || '').toLowerCase();
  const type = (event.type || '').toLowerCase();

  if (type.includes('theater') || type.includes('aufführung') || type.includes('generalprobe') || type.includes('probe') ||
      name.includes('theater') || name.includes('aufführung') || name.includes('generalprobe') || name.includes('probe')) {
    return 'Theater';
  } else if (type.includes('konzert') || type.includes('musik') || type.includes('oper') || type.includes('quartett') ||
             name.includes('konzert') || name.includes('musik') || name.includes('oper') || name.includes('quartett')) {
    return 'Musik';
  } else if (type.includes('film') || type.includes('kino') || name.includes('film') || name.includes('kino') ||
             type.includes('panoramabesuch') || name.includes('panoramabesuch')) {
    return 'Film';
  } else if (type.includes('vortrag') || type.includes('lesung') || type.includes('vorlesung') ||
             name.includes('vortrag') || name.includes('lesung') || name.includes('vorlesung')) {
    return 'Vortrag';
  } else if (type.includes('diner') || type.includes('hochzeit') || type.includes('ball') || type.includes('privat') ||
             name.includes('diner') || name.includes('hochzeit') || name.includes('ball') || name.includes('privat')) {
    return 'Privatveranstaltung';
  }

  return 'anderes';
}

function processCalendarData() {
  data = calendarData.map(r => ({
    startDate: r.startDate,
    name: r.name,
    linkId: r.id,
    type: r.type,
    category: getEventCategory(r)
  }));

  eventsByDate = new Map();
  data.forEach(event => {
    if (!eventsByDate.has(event.startDate)) {
      eventsByDate.set(event.startDate, []);
    }
    eventsByDate.get(event.startDate).push(event);
  });
  const keys = [...eventsByDate.keys()].sort();
  minDate = keys[0] || null;
  maxDate = keys[keys.length - 1] || null;
}

// Tagesklick-Handler
function handleDayClick(e) {
  const events = e.events;
  const date = e.date;

  if (events.length === 1) {
    window.location.href = events[0].linkId;
  } else {
    openDayDrawer(dateToKey(date));
  }
}

/* ---------- Tages-Drawer ---------- */

function dateToKey(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

function keyToDate(key) {
  const p = key.split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
}

function addDrawerStyles() {
  if (document.getElementById('calendar-drawer-styles')) return;
  const style = document.createElement('style');
  style.id = 'calendar-drawer-styles';
  style.textContent = `
    .cal-drawer-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 1050;
      animation: cal-drawer-fade .18s ease;
    }
    .cal-drawer {
      position: fixed; top: 0; right: 0; bottom: 0; width: 420px; max-width: 92vw;
      background: #fff; box-shadow: -12px 0 36px rgba(0,0,0,.18);
      overflow: auto; display: flex; flex-direction: column;
      animation: cal-drawer-slide .22s cubic-bezier(.2,.7,.3,1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    @keyframes cal-drawer-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes cal-drawer-slide {
      from { transform: translateX(24px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .cal-drawer-head {
      position: sticky; top: 0; z-index: 1; background: #fff;
      border-bottom: 1px solid #dee2e6; padding: 18px 22px 14px;
      display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
    }
    .cal-drawer-wd {
      font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
      color: #6c757d; margin-bottom: 3px;
    }
    .cal-drawer-date { font-size: 22px; font-weight: 600; color: #212529; line-height: 1.1; }
    .cal-drawer-count { font-size: 12.5px; color: #6c757d; margin-top: 5px; }
    .cal-drawer-close {
      width: 32px; height: 32px; flex: none; display: grid; place-items: center;
      border: 1px solid #dee2e6; background: #fff; border-radius: 6px;
      cursor: pointer; color: #6c757d; font-size: 17px; line-height: 1;
    }
    .cal-drawer-close:hover { background: #f8f9fa; }
    .cal-drawer-list { padding: 10px 22px 22px; flex: 1; }
    .cal-drawer-entry {
      display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f1f3f4;
    }
    .cal-drawer-bar { width: 3px; flex: none; border-radius: 2px; align-self: stretch; }
    .cal-drawer-entry-main { min-width: 0; }
    .cal-drawer-tag {
      font-size: 10.5px; letter-spacing: .06em; text-transform: uppercase; font-weight: 600;
    }
    .cal-drawer-title {
      font-size: 14.5px; line-height: 1.35; color: #212529; margin: 3px 0 2px;
    }
    .cal-drawer-title a { text-decoration: none; font-weight: 500; }
    .cal-drawer-title a:hover { text-decoration: underline; }
    .cal-drawer-empty { color: #adb5bd; font-size: 14px; padding: 20px 0; text-align: center; }
    .cal-drawer-hidden { font-size: 12px; color: #6c757d; font-style: italic; padding-top: 8px; }
    .cal-drawer-foot {
      position: sticky; bottom: 0; background: #fff; border-top: 1px solid #dee2e6;
      padding: 12px 22px; display: flex; justify-content: space-between;
    }
    .cal-drawer-foot button {
      font-size: 13px; color: #495057; background: #f8f9fa; border: 1px solid #dee2e6;
      border-radius: 6px; padding: 7px 13px; cursor: pointer;
    }
    .cal-drawer-foot button:hover:not(:disabled) { background: #e9ecef; }
    .cal-drawer-foot button:disabled { opacity: .4; cursor: default; }
  `;
  document.head.appendChild(style);
}

let drawerKey = null;

function closeDayDrawer() {
  const backdrop = document.getElementById('calendarDayDrawer');
  if (backdrop) backdrop.remove();
  drawerKey = null;
}

function stepDayDrawer(delta) {
  if (!drawerKey) return;
  const d = keyToDate(drawerKey);
  d.setDate(d.getDate() + delta);
  const key = dateToKey(d);
  if (minDate && key < minDate) return;
  if (maxDate && key > maxDate) return;
  openDayDrawer(key);
}

function buildDrawerEntry(event) {
  const color = categoryColors[event.category] || '#999';
  const entry = document.createElement('div');
  entry.className = 'cal-drawer-entry';

  const bar = document.createElement('span');
  bar.className = 'cal-drawer-bar';
  bar.style.background = color;
  bar.setAttribute('aria-hidden', 'true');
  entry.appendChild(bar);

  const main = document.createElement('div');
  main.className = 'cal-drawer-entry-main';

  const tag = document.createElement('div');
  tag.className = 'cal-drawer-tag';
  tag.style.color = color;
  tag.textContent = categoryLabels[event.category] || '';
  main.appendChild(tag);

  const title = document.createElement('div');
  title.className = 'cal-drawer-title';
  const link = document.createElement('a');
  link.href = event.linkId;
  link.style.color = color;
  link.textContent = event.name;
  title.appendChild(link);
  main.appendChild(title);

  entry.appendChild(main);
  return entry;
}

function openDayDrawer(key) {
  addDrawerStyles();
  closeDayDrawer();
  drawerKey = key;

  const date = keyToDate(key);
  const all = eventsByDate.get(key) || [];
  const visible = all.filter(e => activeFilters.has(e.category));
  const hidden = all.length - visible.length;

  const sorted = [...visible].sort((a, b) => a.name.localeCompare(b.name, 'de'));

  const backdrop = document.createElement('div');
  backdrop.className = 'cal-drawer-backdrop';
  backdrop.id = 'calendarDayDrawer';
  backdrop.addEventListener('click', closeDayDrawer);

  const drawer = document.createElement('aside');
  drawer.className = 'cal-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', 'Ereignisse des Tages');
  drawer.addEventListener('click', e => e.stopPropagation());

  const head = document.createElement('div');
  head.className = 'cal-drawer-head';
  const headLeft = document.createElement('div');
  const wd = document.createElement('div');
  wd.className = 'cal-drawer-wd';
  wd.textContent = dayNamesDrawer[date.getDay()];
  const dateEl = document.createElement('div');
  dateEl.className = 'cal-drawer-date';
  dateEl.textContent = `${date.getDate()}. ${monthNamesDrawer[date.getMonth()]} ${date.getFullYear()}`;
  const count = document.createElement('div');
  count.className = 'cal-drawer-count';
  count.textContent = visible.length === 0
    ? 'keine sichtbaren Ereignisse'
    : visible.length + (visible.length === 1 ? ' Ereignis' : ' Ereignisse');
  headLeft.appendChild(wd);
  headLeft.appendChild(dateEl);
  headLeft.appendChild(count);
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'cal-drawer-close';
  closeBtn.setAttribute('aria-label', 'Schließen');
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', closeDayDrawer);
  head.appendChild(headLeft);
  head.appendChild(closeBtn);
  drawer.appendChild(head);

  const list = document.createElement('div');
  list.className = 'cal-drawer-list';
  sorted.forEach(event => list.appendChild(buildDrawerEntry(event)));
  if (visible.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'cal-drawer-empty';
    empty.textContent = 'Keine bekannten Ereignisse an diesem Tag.';
    list.appendChild(empty);
  }
  if (hidden > 0) {
    const note = document.createElement('div');
    note.className = 'cal-drawer-hidden';
    note.textContent = hidden + (hidden === 1
      ? ' Eintrag ist durch den Filter ausgeblendet.'
      : ' Einträge sind durch den Filter ausgeblendet.');
    list.appendChild(note);
  }
  drawer.appendChild(list);

  const foot = document.createElement('div');
  foot.className = 'cal-drawer-foot';
  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.textContent = '‹ Vortag';
  prevBtn.disabled = !!(minDate && key <= minDate);
  prevBtn.addEventListener('click', () => stepDayDrawer(-1));
  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.textContent = 'Folgetag ›';
  nextBtn.disabled = !!(maxDate && key >= maxDate);
  nextBtn.addEventListener('click', () => stepDayDrawer(1));
  foot.appendChild(prevBtn);
  foot.appendChild(nextBtn);
  drawer.appendChild(foot);

  backdrop.appendChild(drawer);
  document.body.appendChild(backdrop);
  closeBtn.focus();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && drawerKey) closeDayDrawer();
});

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
  if (typeof SimpleCalendar === 'undefined') {
    console.error('SimpleCalendar class is not available');
    return;
  }
  if (typeof calendarData === 'undefined') {
    console.error('calendarData is not available');
    return;
  }

  await loadEventTypeMappings();
  processCalendarData();

  calendar = new SimpleCalendar('calendar-container', {
    startYear: 1899,
    dataSource: data,
    clickDay: handleDayClick
  });
});
