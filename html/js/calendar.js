/**
 * Simple, sustainable calendar implementation for Schnitzler Kultur
 * Based on SimpleCalendar from schnitzler-briefe-static
 * Adapted for cultural event data with event-type category filtering
 */

class SimpleCalendar {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.currentYear = options.startYear || new Date().getFullYear();
    this.currentMonth = new Date().getMonth();
    this.currentWeek = this.getWeekOfYear(new Date());
    this.events = options.dataSource || [];
    this.onDayClick = options.clickDay || (() => {});

    // View modes: 'year', 'month', 'week'
    this.currentView = 'year';

    // Event type categories and colors
    this.eventCategories = {
      'Theater': '#8B4513',             // Saddle Brown
      'Musik': '#228B22',               // Forest Green
      'Film': '#FF1493',                // Deep Pink
      'Vortrag': '#00CED1',             // Dark Turquoise
      'Privatveranstaltung': '#4169E1', // Royal Blue
      'anderes': '#9932CC'              // Dark Orchid
    };

    this.categoryLabels = {
      'Theater': 'Theater',
      'Musik': 'Musik',
      'Film': 'Film',
      'Vortrag': 'Vortrag',
      'Privatveranstaltung': 'Privatveranstaltung',
      'anderes': 'Anderes'
    };

    this.monthNames = [
      'Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];

    this.dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

    this.init();
  }

  init() {
    this.container.innerHTML = '';
    this.loadStateFromURL();

    this.availableYears = [...new Set(this.events.map(event =>
      new Date(event.startDate).getFullYear()
    ))].sort((a, b) => a - b);

    this.createCalendarStructure();

    this.container.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.view === this.currentView) {
        btn.classList.add('active');
      }
    });

    if (typeof window.activeFilters !== 'undefined') {
      this.container.querySelectorAll('.filter-toggle').forEach(btn => {
        const category = btn.dataset.category;
        btn.classList.toggle('active', window.activeFilters.has(category));
      });
    }

    this.render();
  }

  // Check if event should be visible based on external activeFilters
  isEventVisible(event) {
    if (typeof window.activeFilters !== 'undefined') {
      return event.category && window.activeFilters.has(event.category);
    }
    return true;
  }

  toggleCategoryFilter(category) {
    if (typeof window.activeFilters === 'undefined') return;
    const button = this.container.querySelector(`[data-category="${category}"]`);

    if (window.activeFilters.has(category)) {
      window.activeFilters.delete(category);
      button.classList.remove('active');
    } else {
      window.activeFilters.add(category);
      button.classList.add('active');
    }

    this.renderCalendar();
  }

  createCalendarStructure() {
    this.container.innerHTML = `
      <div class="calendar">
        <div class="calendar-header">
          <button class="nav-btn prev" data-direction="-1">&lt;</button>
          <div class="current-period">
            <div class="period-navigation">
              <div class="calendar-controls">
                <div class="view-buttons">
                  <button class="view-btn active" data-view="year">Jahr</button>
                  <button class="view-btn" data-view="month">Monat</button>
                  <button class="view-btn" data-view="week">Woche</button>
                </div>
                <div class="period-dropdowns"></div>
                <div class="category-filters">
                  ${Object.entries(this.categoryLabels).map(([category, label]) => `
                    <button class="filter-toggle active" data-category="${category}" title="${label}" style="--filter-color: ${this.eventCategories[category]};">
                      <span class="filter-dot"></span>
                      ${label}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
          <button class="nav-btn next" data-direction="1">&gt;</button>
        </div>
        <div class="calendar-grid"></div>
      </div>
    `;

    this.addStyles();

    this.container.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const direction = parseInt(e.target.dataset.direction);
        this.navigatePeriod(direction);
      });
    });

    this.container.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchView(e.target.dataset.view);
      });
    });

    this.container.querySelectorAll('.filter-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = e.currentTarget.dataset.category;
        this.toggleCategoryFilter(category);
      });
    });

    this.createDropdownNavigation();
  }

  addStyles() {
    if (document.getElementById('calendar-styles')) return;
    const style = document.createElement('style');
    style.id = 'calendar-styles';
    style.textContent = `
      .calendar {
        width: 100%;
        max-width: none;
        margin: 0 auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .current-period {
        flex: 1;
        text-align: center;
        position: relative;
      }

      .period-navigation {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }

      .period-dropdowns {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
      }

      .period-dropdown {
        padding: 6px 12px;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        font-size: 14px;
        background: white;
        cursor: pointer;
        min-width: 100px;
        box-sizing: border-box;
      }

      .period-dropdown:hover {
        border-color: var(--accent, #AC7790);
      }

      .period-dropdown:focus {
        outline: none;
        border-color: var(--accent, #AC7790);
        box-shadow: 0 0 0 2px rgba(172, 119, 144, 0.25);
      }

      .calendar-controls {
        display: flex;
        gap: 20px;
        margin-top: 10px;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
      }

      .view-buttons {
        display: flex;
        gap: 4px;
      }

      .category-filters {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: center;
      }

      .view-btn {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
        color: #495057;
        box-sizing: border-box;
      }

      .view-btn:hover {
        background: #e9ecef;
      }

      .view-btn.active {
        background: var(--accent, #AC7790);
        color: white;
        border-color: var(--accent, #AC7790);
      }

      .filter-toggle {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 6px;
        box-sizing: border-box;
      }

      .filter-toggle:hover {
        background: #e9ecef;
      }

      .filter-toggle .filter-dot {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: white;
        border: 2px solid var(--filter-color, #ddd);
      }

      .filter-toggle.active {
        background: var(--filter-color, #999);
        color: white;
        border-color: var(--filter-color, #999);
      }

      .filter-toggle.active .filter-dot {
        background-color: rgba(255, 255, 255, 0.9);
      }

      .filter-toggle:not(.active) {
        opacity: 0.6;
      }

      .nav-btn {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 14px;
        min-width: 40px;
        box-sizing: border-box;
      }

      .nav-btn:hover {
        background: #e9ecef;
      }

      .calendar-grid {
        display: grid;
        gap: 20px;
      }

      .calendar-grid.year-view {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }

      .calendar-grid.month-view {
        grid-template-columns: 1fr;
        overflow-x: auto;
      }

      .calendar-grid.week-view {
        grid-template-columns: 1fr;
      }

      .month {
        border: 1px solid #dee2e6;
        border-radius: 8px;
        overflow: hidden;
        background: white;
      }

      .month-header {
        background: #f8f9fa;
        padding: 12px;
        text-align: center;
        font-weight: 600;
        color: #495057;
        border-bottom: 1px solid #dee2e6;
        transition: background-color 0.2s, color 0.2s;
      }

      .month-header:hover {
        background: #e9ecef;
        color: var(--accent, #AC7790);
      }

      .month-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
      }

      .day-header {
        background: #f8f9fa;
        padding: 8px 4px;
        text-align: center;
        font-size: 12px;
        font-weight: 500;
        color: #6c757d;
        border-bottom: 1px solid #dee2e6;
      }

      .day {
        position: relative;
        aspect-ratio: 1;
        border: 1px solid #f1f3f4;
        cursor: pointer;
        transition: background-color 0.2s;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding: 4px 2px 2px 2px;
        min-height: 40px;
      }

      .day:hover {
        background-color: #f8f9fa;
      }

      .day.other-month {
        color: #adb5bd;
        background-color: #fafbfc;
      }

      .day.has-events {
        font-weight: 600;
      }

      .day-number {
        font-size: 13px;
        line-height: 1;
        margin-bottom: 3px;
        z-index: 2;
      }

      .event-bars {
        display: flex;
        flex-direction: column;
        gap: 1px;
        width: 100%;
        max-width: 24px;
      }

      .event-bar {
        height: 3px;
        width: 100%;
        border-radius: 1px;
      }

      /* Month view styles */
      .month-large {
        width: 100%;
        overflow-x: auto;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        background: white;
      }

      .month-large .month-header {
        background: #f8f9fa;
        padding: 12px;
        text-align: center;
        font-weight: 600;
        color: #495057;
        border-bottom: 1px solid #dee2e6;
      }

      .month-days-large {
        display: grid;
        grid-template-columns: repeat(7, minmax(135px, 1fr));
        gap: 1px;
        background: #dee2e6;
        min-width: 945px;
      }

      .day-header-large {
        background: #f8f9fa;
        padding: 12px;
        text-align: center;
        font-weight: 600;
        color: #495057;
        font-size: 14px;
      }

      .day-large {
        min-height: 140px;
        background: white;
        padding: 8px;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .day-large:hover {
        background: #f8f9fa;
      }

      .day-large.other-month {
        background: #fafbfc;
        color: #adb5bd;
      }

      .day-number-large {
        font-weight: 600;
        margin-bottom: 6px;
        font-size: 16px;
      }

      .events-container-large {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
        overflow: hidden;
      }

      .event-item-large {
        color: white;
        padding: 4px 6px;
        border-radius: 3px;
        font-size: 11px;
        line-height: 1.3;
        cursor: pointer;
        white-space: normal;
        word-wrap: break-word;
        word-break: break-word;
        hyphens: auto;
        min-height: 20px;
        max-height: none;
        border: 1px solid rgba(255,255,255,0.2);
        display: block;
      }

      .event-item-large:hover {
        opacity: 0.85;
      }

      .more-events-large {
        font-size: 10px;
        color: #6c757d;
        font-style: italic;
        margin-top: 2px;
      }

      /* Week view styles */
      .week-view {
        width: 100%;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        background: white;
        overflow: hidden;
      }

      .week-days-header {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1px;
        background: #dee2e6;
      }

      .week-day-header {
        background: #f8f9fa;
        padding: 12px;
        text-align: center;
      }

      .week-day-name {
        font-weight: 600;
        color: #495057;
        font-size: 14px;
      }

      .week-day-date {
        font-size: 12px;
        color: #6c757d;
        margin-top: 4px;
      }

      .week-days-container {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1px;
        background: #dee2e6;
        min-height: 500px;
      }

      .week-day-column {
        background: white;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .week-event {
        color: white;
        padding: 6px 8px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        white-space: normal;
        word-wrap: break-word;
        word-break: break-word;
        hyphens: auto;
        line-height: 1.4;
        min-height: 24px;
        border: 1px solid rgba(255,255,255,0.2);
        transition: opacity 0.2s;
        display: block;
      }

      .week-event:hover {
        opacity: 0.85;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .calendar-header {
          gap: 8px;
        }
      }

      @media (max-width: 1400px) {
        .calendar-grid.year-view {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }
      }

      @media (max-width: 900px) {
        .calendar-grid.year-view {
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }
      }

      @media (max-width: 600px) {
        .calendar-grid.year-view {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  createDropdownNavigation() {
    const dropdownContainer = this.container.querySelector('.period-dropdowns');
    dropdownContainer.innerHTML = '';

    if (this.currentView === 'month') {
      this.createMonthDropdown(dropdownContainer);
    }

    this.createYearDropdown(dropdownContainer);

    if (this.currentView === 'week') {
      this.createWeekDropdown(dropdownContainer);
    }
  }

  createYearDropdown(container) {
    const yearSelect = document.createElement('select');
    yearSelect.className = 'period-dropdown year-dropdown';

    this.availableYears.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      option.selected = year === this.currentYear;
      yearSelect.appendChild(option);
    });

    yearSelect.addEventListener('change', (e) => {
      this.currentYear = parseInt(e.target.value);
      this.renderCalendar();
      this.updateURL();
    });

    container.appendChild(yearSelect);
  }

  createMonthDropdown(container) {
    const monthSelect = document.createElement('select');
    monthSelect.className = 'period-dropdown month-dropdown';

    this.monthNames.forEach((monthName, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = monthName;
      option.selected = index === this.currentMonth;
      monthSelect.appendChild(option);
    });

    monthSelect.addEventListener('change', (e) => {
      this.currentMonth = parseInt(e.target.value);
      this.renderCalendar();
      this.updateURL();
    });

    container.appendChild(monthSelect);
  }

  createWeekDropdown(container) {
    const weekSelect = document.createElement('select');
    weekSelect.className = 'period-dropdown week-dropdown';

    for (let week = 1; week <= 53; week++) {
      const option = document.createElement('option');
      option.value = week;
      const weekStart = this.getWeekStart(this.currentYear, week);
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
      option.textContent = `Woche ${week} (${weekStart.getDate()}.${weekStart.getMonth() + 1}. - ${weekEnd.getDate()}.${weekEnd.getMonth() + 1}.)`;
      option.selected = week === this.currentWeek;
      weekSelect.appendChild(option);
    }

    weekSelect.addEventListener('change', (e) => {
      this.currentWeek = parseInt(e.target.value);
      this.renderCalendar();
      this.updateURL();
    });

    container.appendChild(weekSelect);
  }

  navigatePeriod(direction) {
    if (this.currentView === 'year') {
      const currentIndex = this.availableYears.indexOf(this.currentYear);
      const newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < this.availableYears.length) {
        this.currentYear = this.availableYears[newIndex];
      }
    } else if (this.currentView === 'month') {
      this.currentMonth += direction;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        const currentIndex = this.availableYears.indexOf(this.currentYear);
        if (currentIndex + 1 < this.availableYears.length) {
          this.currentYear = this.availableYears[currentIndex + 1];
        }
      } else if (this.currentMonth < 0) {
        this.currentMonth = 11;
        const currentIndex = this.availableYears.indexOf(this.currentYear);
        if (currentIndex - 1 >= 0) {
          this.currentYear = this.availableYears[currentIndex - 1];
        }
      }
    } else if (this.currentView === 'week') {
      this.currentWeek += direction;
      if (this.currentWeek > 52) {
        this.currentWeek = 1;
        const currentIndex = this.availableYears.indexOf(this.currentYear);
        if (currentIndex + 1 < this.availableYears.length) {
          this.currentYear = this.availableYears[currentIndex + 1];
        }
      } else if (this.currentWeek < 1) {
        this.currentWeek = 52;
        const currentIndex = this.availableYears.indexOf(this.currentYear);
        if (currentIndex - 1 >= 0) {
          this.currentYear = this.availableYears[currentIndex - 1];
        }
      }
    }
    this.renderCalendar();
    this.updateURL();
  }

  switchView(view) {
    const previousView = this.currentView;
    this.currentView = view;

    if (previousView === 'year' && view === 'month') {
      this.currentMonth = 0;
    }
    if (previousView === 'year' && view === 'week') {
      this.currentWeek = 1;
    }

    this.container.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });

    this.renderCalendar();
    this.updateURL();
  }

  render() {
    this.renderCalendar();
  }

  renderCalendar() {
    const grid = this.container.querySelector('.calendar-grid');
    grid.innerHTML = '';
    grid.className = `calendar-grid ${this.currentView}-view`;

    this.createDropdownNavigation();

    switch (this.currentView) {
      case 'year':
        this.renderYearView(grid);
        break;
      case 'month':
        this.renderMonthView(grid);
        break;
      case 'week':
        this.renderWeekView(grid);
        break;
    }
  }

  groupEventsByDate(events) {
    const eventsByDate = {};
    events.forEach(event => {
      const date = event.startDate;
      if (!eventsByDate[date]) eventsByDate[date] = [];
      eventsByDate[date].push(event);
    });
    return eventsByDate;
  }

  renderYearView(grid) {
    const filteredEvents = this.events.filter(event =>
      new Date(event.startDate).getFullYear() === this.currentYear && this.isEventVisible(event)
    );
    const eventsByDate = this.groupEventsByDate(filteredEvents);

    for (let month = 0; month < 12; month++) {
      grid.appendChild(this.createMonth(month, eventsByDate));
    }
  }

  renderMonthView(grid) {
    const filteredEvents = this.events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getFullYear() === this.currentYear &&
             eventDate.getMonth() === this.currentMonth &&
             this.isEventVisible(event);
    });
    const eventsByDate = this.groupEventsByDate(filteredEvents);
    grid.appendChild(this.createLargeMonth(this.currentMonth, eventsByDate));
  }

  renderWeekView(grid) {
    const filteredEvents = this.events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getFullYear() === this.currentYear &&
             this.getWeekOfYear(eventDate) === this.currentWeek &&
             this.isEventVisible(event);
    });
    const eventsByDate = this.groupEventsByDate(filteredEvents);
    grid.appendChild(this.createWeekView(this.currentYear, this.currentWeek, eventsByDate));
  }

  sortEvents(events) {
    return [...events].sort((a, b) => a.name.localeCompare(b.name, 'de'));
  }

  createMonth(monthIndex, eventsByDate) {
    const monthEl = document.createElement('div');
    monthEl.className = 'month';

    const headerEl = document.createElement('div');
    headerEl.className = 'month-header';
    headerEl.textContent = `${this.monthNames[monthIndex]} ${this.currentYear}`;
    headerEl.style.cursor = 'pointer';
    headerEl.title = `Zu ${this.monthNames[monthIndex]} ${this.currentYear} wechseln`;
    headerEl.addEventListener('click', (e) => {
      e.stopPropagation();
      this.currentMonth = monthIndex;
      this.switchView('month');
    });
    monthEl.appendChild(headerEl);

    const daysEl = document.createElement('div');
    daysEl.className = 'month-days';

    this.dayNames.forEach(dayName => {
      const dayHeaderEl = document.createElement('div');
      dayHeaderEl.className = 'day-header';
      dayHeaderEl.textContent = dayName;
      daysEl.appendChild(dayHeaderEl);
    });

    const firstDay = new Date(this.currentYear, monthIndex, 1);
    const lastDay = new Date(this.currentYear, monthIndex + 1, 0);
    const firstWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const prevMonth = new Date(this.currentYear, monthIndex - 1, 0);
    for (let i = firstWeekday - 1; i >= 0; i--) {
      daysEl.appendChild(this.createDay(
        prevMonth.getDate() - i,
        monthIndex - 1 < 0 ? 11 : monthIndex - 1,
        monthIndex - 1 < 0 ? this.currentYear - 1 : this.currentYear,
        true,
        eventsByDate
      ));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      daysEl.appendChild(this.createDay(day, monthIndex, this.currentYear, false, eventsByDate));
    }

    const cellsUsed = firstWeekday + daysInMonth;
    const cellsNeeded = Math.ceil(cellsUsed / 7) * 7;
    for (let day = 1; day <= cellsNeeded - cellsUsed; day++) {
      daysEl.appendChild(this.createDay(
        day,
        monthIndex + 1 > 11 ? 0 : monthIndex + 1,
        monthIndex + 1 > 11 ? this.currentYear + 1 : this.currentYear,
        true,
        eventsByDate
      ));
    }

    monthEl.appendChild(daysEl);
    return monthEl;
  }

  createDay(day, month, year, isOtherMonth, eventsByDate) {
    const dayEl = document.createElement('div');
    dayEl.className = 'day';
    if (isOtherMonth) dayEl.classList.add('other-month');

    const dayNumberEl = document.createElement('div');
    dayNumberEl.className = 'day-number';
    dayNumberEl.textContent = day;
    dayEl.appendChild(dayNumberEl);

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = eventsByDate[dateStr] || [];

    if (dayEvents.length > 0 && !isOtherMonth) {
      dayEl.classList.add('has-events');

      const backgroundColor = this.calculateDayBackgroundColor(dayEvents);
      if (backgroundColor) dayEl.style.backgroundColor = backgroundColor;

      const sortedEvents = this.sortEvents(dayEvents);

      const barsEl = document.createElement('div');
      barsEl.className = 'event-bars';
      sortedEvents.forEach(event => {
        const barEl = document.createElement('div');
        barEl.className = 'event-bar';
        barEl.style.backgroundColor = this.eventCategories[event.category] || '#999';
        barEl.title = event.name;
        barsEl.appendChild(barEl);
      });
      dayEl.appendChild(barsEl);

      dayEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.onDayClick({ events: sortedEvents, date: new Date(year, month, day) });
      });
    }

    return dayEl;
  }

  calculateDayBackgroundColor(dayEvents) {
    if (!dayEvents || dayEvents.length === 0) return null;

    const categoryCounts = {};
    Object.keys(this.eventCategories).forEach(category => { categoryCounts[category] = 0; });
    dayEvents.forEach(event => {
      if (categoryCounts.hasOwnProperty(event.category)) {
        categoryCounts[event.category]++;
      }
    });

    const parseColor = (hex) => {
      if (hex.startsWith('rgb')) {
        const matches = hex.match(/\d+/g);
        return { r: parseInt(matches[0]), g: parseInt(matches[1]), b: parseInt(matches[2]) };
      }
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    let totalR = 0, totalG = 0, totalB = 0, totalEvents = 0;
    Object.keys(categoryCounts).forEach(category => {
      const count = categoryCounts[category];
      if (count > 0) {
        const color = parseColor(this.eventCategories[category]);
        totalR += color.r * count;
        totalG += color.g * count;
        totalB += color.b * count;
        totalEvents += count;
      }
    });

    if (totalEvents === 0) return null;

    const avgR = Math.round(totalR / totalEvents);
    const avgG = Math.round(totalG / totalEvents);
    const avgB = Math.round(totalB / totalEvents);
    const opacity = Math.min(0.05 + (totalEvents - 1) * 0.05, 0.25);

    return `rgba(${avgR}, ${avgG}, ${avgB}, ${opacity})`;
  }

  getWeekOfYear(date) {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  }

  getWeekStart(year, week) {
    const jan1 = new Date(year, 0, 1);
    const jan1Day = jan1.getDay();
    const daysToFirstMonday = jan1Day === 0 ? 1 : (8 - jan1Day);
    return new Date(year, 0, 1 + daysToFirstMonday + (week - 2) * 7);
  }

  createLargeMonth(monthIndex, eventsByDate) {
    const monthEl = document.createElement('div');
    monthEl.className = 'month-large';

    const headerEl = document.createElement('div');
    headerEl.className = 'month-header';
    headerEl.textContent = `${this.monthNames[monthIndex]} ${this.currentYear}`;
    monthEl.appendChild(headerEl);

    const daysEl = document.createElement('div');
    daysEl.className = 'month-days-large';

    this.dayNames.forEach(dayName => {
      const dayHeaderEl = document.createElement('div');
      dayHeaderEl.className = 'day-header-large';
      dayHeaderEl.textContent = dayName;
      daysEl.appendChild(dayHeaderEl);
    });

    const firstDay = new Date(this.currentYear, monthIndex, 1);
    const lastDay = new Date(this.currentYear, monthIndex + 1, 0);
    const firstWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const prevMonth = new Date(this.currentYear, monthIndex - 1, 0);
    for (let i = firstWeekday - 1; i >= 0; i--) {
      daysEl.appendChild(this.createDayLarge(
        prevMonth.getDate() - i,
        monthIndex - 1 < 0 ? 11 : monthIndex - 1,
        monthIndex - 1 < 0 ? this.currentYear - 1 : this.currentYear,
        true,
        eventsByDate
      ));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      daysEl.appendChild(this.createDayLarge(day, monthIndex, this.currentYear, false, eventsByDate));
    }

    const cellsUsed = firstWeekday + daysInMonth;
    const cellsNeeded = Math.ceil(cellsUsed / 7) * 7;
    for (let day = 1; day <= cellsNeeded - cellsUsed; day++) {
      daysEl.appendChild(this.createDayLarge(
        day,
        monthIndex + 1 > 11 ? 0 : monthIndex + 1,
        monthIndex + 1 > 11 ? this.currentYear + 1 : this.currentYear,
        true,
        eventsByDate
      ));
    }

    monthEl.appendChild(daysEl);
    return monthEl;
  }

  createDayLarge(day, month, year, isOtherMonth, eventsByDate) {
    const dayEl = document.createElement('div');
    dayEl.className = 'day-large';
    if (isOtherMonth) dayEl.classList.add('other-month');

    const dayNumberEl = document.createElement('div');
    dayNumberEl.className = 'day-number-large';
    dayNumberEl.textContent = day;
    dayEl.appendChild(dayNumberEl);

    const eventsContainer = document.createElement('div');
    eventsContainer.className = 'events-container-large';

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = eventsByDate[dateStr] || [];

    if (dayEvents.length > 0 && !isOtherMonth) {
      const sortedEvents = this.sortEvents(dayEvents);

      sortedEvents.slice(0, 5).forEach(event => {
        const eventEl = document.createElement('div');
        eventEl.className = 'event-item-large';
        eventEl.style.backgroundColor = this.eventCategories[event.category] || '#999';
        eventEl.textContent = event.name;
        eventEl.title = event.name;
        eventEl.addEventListener('click', (e) => {
          e.stopPropagation();
          window.location.href = event.linkId;
        });
        eventsContainer.appendChild(eventEl);
      });

      if (sortedEvents.length > 5) {
        const moreEl = document.createElement('div');
        moreEl.className = 'more-events-large';
        moreEl.textContent = `+${sortedEvents.length - 5} weitere`;
        eventsContainer.appendChild(moreEl);
      }

      dayEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.onDayClick({ events: sortedEvents, date: new Date(year, month, day) });
      });
      dayEl.style.cursor = 'pointer';
    }

    dayEl.appendChild(eventsContainer);
    return dayEl;
  }

  createWeekView(year, week, eventsByDate) {
    const weekEl = document.createElement('div');
    weekEl.className = 'week-view';

    const weekStart = this.getWeekStart(year, week);

    const headerEl = document.createElement('div');
    headerEl.className = 'week-days-header';
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000);
      const headerDay = document.createElement('div');
      headerDay.className = 'week-day-header';
      headerDay.innerHTML = `
        <div class="week-day-name">${this.dayNames[i]}</div>
        <div class="week-day-date">${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}</div>
      `;
      headerEl.appendChild(headerDay);
    }
    weekEl.appendChild(headerEl);

    const daysContainer = document.createElement('div');
    daysContainer.className = 'week-days-container';

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const dayEvents = eventsByDate[dateStr] || [];
      const sortedEvents = this.sortEvents(dayEvents);

      const dayColumn = document.createElement('div');
      dayColumn.className = 'week-day-column';

      sortedEvents.forEach(event => {
        const eventEl = document.createElement('div');
        eventEl.className = 'week-event';
        eventEl.style.backgroundColor = this.eventCategories[event.category] || '#999';
        eventEl.textContent = event.name;
        eventEl.title = event.name;
        eventEl.addEventListener('click', (e) => {
          e.stopPropagation();
          window.location.href = event.linkId;
        });
        dayColumn.appendChild(eventEl);
      });

      daysContainer.appendChild(dayColumn);
    }

    weekEl.appendChild(daysContainer);
    return weekEl;
  }

  loadStateFromURL() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('year')) {
      this.currentYear = parseInt(params.get('year')) || this.currentYear;
    }
    if (params.has('month')) {
      const urlMonth = parseInt(params.get('month'));
      if (urlMonth >= 1 && urlMonth <= 12) this.currentMonth = urlMonth - 1;
    }
    if (params.has('week')) {
      this.currentWeek = parseInt(params.get('week')) || this.currentWeek;
    }
    if (params.has('view')) {
      const view = params.get('view');
      if (['year', 'month', 'week'].includes(view)) this.currentView = view;
    }
  }

  updateURL() {
    const params = new URLSearchParams(window.location.search);
    params.set('year', this.currentYear);

    if (this.currentView === 'month') {
      params.set('month', this.currentMonth + 1);
      params.delete('week');
    } else if (this.currentView === 'week') {
      params.set('week', this.currentWeek);
      params.delete('month');
    } else {
      params.delete('month');
      params.delete('week');
    }

    params.set('view', this.currentView);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  }

  setYear(year) {
    this.currentYear = year;
    this.renderCalendar();
    this.updateURL();
  }

  getYear() {
    return this.currentYear;
  }

  setView(view) {
    if (['year', 'month', 'week'].includes(view)) this.switchView(view);
  }

  setDataSource(newData) {
    this.events = newData || [];
    this.renderCalendar();
  }
}

window.SimpleCalendar = SimpleCalendar;
