/**
 * Simple, sustainable calendar implementation
 * No external dependencies, minimal footprint
 * Focused on showing event types with colors for full-day events
 */

class SimpleCalendar {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.currentYear = options.startYear || new Date().getFullYear();
    this.currentMonth = new Date().getMonth();
    this.events = options.dataSource || [];
    this.onDayClick = options.clickDay || (() => {});
    
    // View modes: 'year', 'month'
    this.currentView = 'year';
    
    // Event type categories and colors (same as existing system)
    this.eventCategories = {
      'Theater': '#8B4513',        // Saddle Brown
      'Musik': '#228B22',          // Forest Green
      'Film': '#FF1493',           // Deep Pink (kept original)
      'Vortrag': '#00CED1',        // Dark Turquoise
      'Privatveranstaltung': '#4169E1', // Royal Blue
      'anderes': '#9932CC'          // Dark Orchid
    };
    
    // Track enabled categories
    this.enabledCategories = new Set(Object.keys(this.eventCategories));
    
    this.monthNames = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    
    this.dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    
    this.init();
  }
  
  createPeriodNavigation() {
    switch(this.currentView) {
      case 'year':
        return ``;
      case 'month':
        return `
          <div class="month-navigation">
            <select class="form-select form-select-sm month-select">
              ${this.generateMonthOptions()}
            </select>
            <select class="form-select form-select-sm year-select">
              ${this.generateYearOptions()}
            </select>
          </div>
        `;
      default:
        return '';
    }
  }
  
  generateYearOptions() {
    const availableYears = Array.from(new Set(this.events.map(event => 
      parseInt(event.startDate.split('-')[0])
    ))).sort((a, b) => a - b);
    
    return availableYears.map(year => 
      `<option value="${year}" ${year === this.currentYear ? 'selected' : ''}>${year}</option>`
    ).join('');
  }
  
  generateMonthOptions() {
    return this.monthNames.map((month, index) => 
      `<option value="${index}" ${index === this.currentMonth ? 'selected' : ''}>${month}</option>`
    ).join('');
  }
  
  
  init() {
    this.container.innerHTML = '';
    this.loadStateFromURL();
    this.createCalendarStructure();
    this.render();
  }
  
  createCalendarStructure() {
    this.container.innerHTML = `
      <div class="calendar">
        <div class="calendar-header">
          <div class="nav-controls-left">
            <button class="nav-btn prev" data-direction="-1">
              <i class="bi bi-chevron-left"></i>
            </button>
          </div>
          
          <div class="current-period">
            <div class="period-main">
              <h2 class="period-title">${this.getPeriodTitle()}</h2>
            </div>
            <div class="period-navigation">
              ${this.createPeriodNavigation()}
            </div>
          </div>
          
          <div class="nav-controls-right">
            <button class="nav-btn next" data-direction="1">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
        <div class="calendar-grid"></div>
      </div>
    `;
    
    // Add CSS
    this.addStyles();
    
    // Add event listeners
    this.container.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target.closest('.nav-btn');
        const direction = parseInt(target.dataset.direction);
        this.navigatePeriod(direction);
      });
    });
    
    // Add period navigation listeners
    this.addPeriodNavigationListeners();
  }
  
  addPeriodNavigationListeners() {
    // Year selector
    const yearSelect = this.container.querySelector('.year-select');
    if (yearSelect) {
      yearSelect.addEventListener('change', (e) => {
        this.currentYear = parseInt(e.target.value);
        this.updatePeriodTitle();
        this.renderCalendar();
        this.saveStateToURL();
      });
    }
    
    // Month selector
    const monthSelect = this.container.querySelector('.month-select');
    if (monthSelect) {
      monthSelect.addEventListener('change', (e) => {
        this.currentMonth = parseInt(e.target.value);
        this.updatePeriodTitle();
        this.renderCalendar();
        this.saveStateToURL();
      });
    }
    
  }
  
  goToToday() {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // Find if we have events for current year, otherwise go to first available year
    const availableYears = Array.from(new Set(this.events.map(event => 
      parseInt(event.startDate.split('-')[0])
    ))).sort((a, b) => a - b);
    
    if (availableYears.includes(currentYear)) {
      this.currentYear = currentYear;
      this.currentMonth = today.getMonth();
    } else {
      // Go to first available year
      this.currentYear = availableYears[0] || 1899;
      this.currentMonth = 0;
    }
    
    this.updatePeriodTitle();
    this.renderCalendar();
    this.saveStateToURL();
  }
  
  addStyles() {
    if (!document.getElementById('calendar-styles')) {
      const style = document.createElement('style');
      style.id = 'calendar-styles';
      style.textContent = `
        .calendar {
          width: 100%;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 15px 20px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }
        
        .nav-controls-left,
        .nav-controls-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .current-period {
          flex: 1;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .period-main {
          display: flex;
          align-items: center;
        }
        
        .period-navigation {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .nav-btn {
          background: #fff;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 16px;
          min-width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .nav-btn:hover {
          background: #e9ecef;
          border-color: #adb5bd;
          transform: translateY(-1px);
        }
        
        .nav-btn.today {
          background: #007bff;
          border-color: #007bff;
          color: white;
        }
        
        .nav-btn.today:hover {
          background: #0056b3;
          border-color: #0056b3;
        }
        
        .period-title {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #333;
        }
        
        .view-selector .form-select {
          min-width: 80px;
          border-radius: 6px;
          border: 1px solid #dee2e6;
          background: white;
        }
        
        .year-navigation,
        .month-navigation {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .year-select,
        .month-select {
          min-width: 80px;
          border-radius: 6px;
          border: 1px solid #dee2e6;
          background: white;
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
        }
        
        .month-link {
          color: #495057;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        
        .month-link:hover {
          color: #007bff;
          text-decoration: underline;
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
          padding: 2px;
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
          font-size: 12px;
          line-height: 1;
          margin-bottom: 2px;
          z-index: 2;
        }
        
        .event-dots {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1px;
          max-width: 100%;
          overflow: hidden;
        }
        
        .event-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.8);
        }
        
        .event-bars {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
        }
        
        .event-bar {
          height: 2px;
          width: 100%;
        }
        
        .events-count {
          position: absolute;
          top: 2px;
          right: 2px;
          background: rgba(0,0,0,0.7);
          color: white;
          font-size: 8px;
          padding: 1px 3px;
          border-radius: 2px;
          line-height: 1;
          display: none;
        }
        
        .day.many-events .events-count {
          display: block;
        }
        
        /* Month view styles */
        .month-large {
          width: 100%;
          overflow-x: auto;
        }
        
        .month-days-large {
          display: grid;
          grid-template-columns: repeat(7, minmax(120px, 1fr));
          gap: 1px;
          background: #dee2e6;
          border: 1px solid #dee2e6;
          min-width: 840px;
        }
        
        .day-header-large {
          background: #f8f9fa;
          padding: 12px;
          text-align: center;
          font-weight: 600;
          color: #495057;
        }
        
        .day-large {
          min-height: 120px;
          background: white;
          padding: 4px;
          display: flex;
          flex-direction: column;
        }
        
        .day-number-large {
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .events-container-large {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1px;
          overflow: hidden;
        }
        
        .event-item-large {
          background: #007bff;
          color: white;
          padding: 1px 3px;
          border-radius: 2px;
          font-size: 9px;
          line-height: 1.1;
          cursor: pointer;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          max-height: 20px;
          word-break: break-word;
        }
        
        .more-events-large {
          font-size: 10px;
          color: #6c757d;
          font-style: italic;
        }
        
        
        /* Responsive design */
        @media (max-width: 768px) {
          .calendar-header {
            flex-direction: column;
            gap: 15px;
            padding: 15px;
          }
          
          .nav-controls-left,
          .nav-controls-right {
            order: 2;
            justify-content: space-between;
            width: 100%;
          }
          
          .current-period {
            order: 1;
            gap: 10px;
          }
          
          .period-navigation {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          
          .period-title {
            font-size: 20px;
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
          
          .calendar-legend {
            gap: 10px;
          }
          
          .legend-item {
            font-size: 12px;
          }
          
          
          .day-large {
            min-height: 80px;
          }
          
          .month-days-large {
            grid-template-columns: repeat(7, minmax(100px, 1fr));
            min-width: 700px;
          }
        }
        
        @media (max-width: 480px) {
          .month-days-large {
            grid-template-columns: repeat(7, minmax(80px, 1fr));
            min-width: 560px;
          }
          
          .day-header-large {
            padding: 8px 4px;
            font-size: 12px;
          }
          
          .day-large {
            padding: 2px;
            min-height: 80px;
          }
          
          .event-item-large {
            font-size: 8px;
            padding: 1px 2px;
            max-height: 18px;
          }
          
          .day-number-large {
            font-size: 12px;
            margin-bottom: 2px;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  createSidebarControls() {
    // This method will be called externally to setup sidebar controls
    return {
      createViewControls: () => this.createViewControls(),
      createLegend: () => this.createLegendForSidebar()
    };
  }
  
  createViewControls() {
    const viewControls = document.createElement('div');
    viewControls.className = 'view-controls-sidebar';
    viewControls.innerHTML = `
      <h6 class="sidebar-title">Ansicht</h6>
      <div class="btn-group-vertical w-100" role="group">
        <button class="btn btn-outline-primary view-btn ${this.currentView === 'year' ? 'active' : ''}" data-view="year">
          <i class="bi bi-calendar3"></i> Jahr
        </button>
        <button class="btn btn-outline-primary view-btn ${this.currentView === 'month' ? 'active' : ''}" data-view="month">
          <i class="bi bi-calendar-month"></i> Monat
        </button>
      </div>
    `;
    
    // Add event listeners
    viewControls.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.target.closest('.view-btn').dataset.view;
        this.changeView(view);
      });
    });
    
    return viewControls;
  }
  
  createLegendForSidebar() {
    const legendContainer = document.createElement('div');
    legendContainer.className = 'calendar-legend-sidebar';
    
    legendContainer.innerHTML = `
      <h6 class="sidebar-title">Kategorien</h6>
      <div class="legend-controls-sidebar">
        <button class="btn btn-sm btn-outline-secondary me-1" onclick="calendar.selectAllCategories()">Alle</button>
        <button class="btn btn-sm btn-outline-secondary" onclick="calendar.deselectAllCategories()">Keine</button>
      </div>
    `;
    
    const legendList = document.createElement('div');
    legendList.className = 'legend-items-sidebar';
    
    Object.entries(this.eventCategories).forEach(([category, color]) => {
      const item = document.createElement('div');
      item.className = 'legend-item legend-item-sidebar';
      item.dataset.category = category;
      item.style.setProperty('--category-color', color);
      item.innerHTML = `
        <div class="legend-toggle">
          <div class="legend-color" style="background-color: ${color}"></div>
          <span class="legend-label">${category}</span>
        </div>
      `;
      
      item.addEventListener('click', () => this.toggleCategory(category));
      legendList.appendChild(item);
    });
    
    legendContainer.appendChild(legendList);
    
    // Add CSS for sidebar components
    this.addSidebarStyles();
    
    return legendContainer;
  }
  
  toggleCategory(category) {
    if (this.enabledCategories.has(category)) {
      this.enabledCategories.delete(category);
    } else {
      this.enabledCategories.add(category);
    }
    
    this.updateLegendState();
    this.renderCalendar();
    this.saveStateToURL();
  }
  
  selectAllCategories() {
    this.enabledCategories = new Set(Object.keys(this.eventCategories));
    this.updateLegendState();
    this.renderCalendar();
    this.saveStateToURL();
  }
  
  deselectAllCategories() {
    this.enabledCategories.clear();
    this.updateLegendState();
    this.renderCalendar();
    this.saveStateToURL();
  }
  
  updateLegendState() {
    // Update legend items in both main container and sidebar
    document.querySelectorAll('.legend-item').forEach(item => {
      const category = item.dataset.category;
      if (this.enabledCategories.has(category)) {
        item.classList.remove('disabled');
      } else {
        item.classList.add('disabled');
      }
    });
  }
  
  getPeriodTitle() {
    switch(this.currentView) {
      case 'year':
        return this.currentYear.toString();
      case 'month':
        return `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
      default:
        return this.currentYear.toString();
    }
  }
  
  
  navigatePeriod(direction) {
    switch(this.currentView) {
      case 'year':
        this.currentYear += direction;
        break;
      case 'month':
        this.currentMonth += direction;
        if (this.currentMonth > 11) {
          this.currentMonth = 0;
          this.currentYear++;
        } else if (this.currentMonth < 0) {
          this.currentMonth = 11;
          this.currentYear--;
        }
        break;
    }
    this.updatePeriodTitle();
    this.renderCalendar();
    this.saveStateToURL();
  }
  
  changeView(newView) {
    const oldView = this.currentView;
    this.currentView = newView;
    
    // Smart view switching logic
    if (oldView === 'year' && newView === 'month') {
      // Jump to January of the current year
      this.currentMonth = 0;
    }
    
    // Update view buttons (both in calendar and sidebar)
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.view === newView) {
        btn.classList.add('active');
      }
    });
    
    
    // Recreate navigation structure
    const currentPeriod = this.container.querySelector('.current-period');
    if (currentPeriod) {
      currentPeriod.innerHTML = `
        <div class="period-main">
          <h2 class="period-title">${this.getPeriodTitle()}</h2>
        </div>
        <div class="period-navigation">
          ${this.createPeriodNavigation()}
        </div>
      `;
      // Re-add navigation listeners
      this.addPeriodNavigationListeners();
    }
    
    this.renderCalendar();
    this.saveStateToURL();
  }
  
  addSidebarStyles() {
    if (!document.getElementById('sidebar-calendar-styles')) {
      const style = document.createElement('style');
      style.id = 'sidebar-calendar-styles';
      style.textContent = `
        .sidebar-title {
          font-weight: 600;
          color: #495057;
          margin-bottom: 12px;
          margin-top: 20px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e9ecef;
          font-size: 14px;
        }
        
        .sidebar-title:first-child {
          margin-top: 0;
        }
        
        .view-controls-sidebar {
          margin-bottom: 20px;
        }
        
        .view-controls-sidebar .btn {
          margin-bottom: 4px;
          text-align: left;
          border-radius: 6px;
          font-size: 14px;
          padding: 8px 12px;
          transition: all 0.2s ease;
        }
        
        .view-controls-sidebar .btn i {
          margin-right: 8px;
          width: 16px;
        }
        
        .view-controls-sidebar .btn.active {
          background-color: #007bff;
          border-color: #007bff;
          color: white;
          box-shadow: 0 2px 4px rgba(0,123,255,0.3);
        }
        
        .legend-controls-sidebar {
          margin-bottom: 12px;
          text-align: center;
        }
        
        .legend-controls-sidebar .btn {
          font-size: 12px;
          padding: 4px 8px;
        }
        
        .legend-items-sidebar {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .legend-item-sidebar {
          cursor: pointer;
          margin-bottom: 6px;
          transition: all 0.2s;
          font-size: 13px;
          border-radius: 6px;
          overflow: hidden;
        }
        
        .legend-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          transition: all 0.2s;
          border-radius: 6px;
          position: relative;
        }
        
        .legend-item-sidebar:hover .legend-toggle {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .legend-item-sidebar:not(.disabled) .legend-toggle {
          background: linear-gradient(135deg, var(--category-color, #007bff) 0%, var(--category-color, #007bff) 100%);
          color: white;
          font-weight: 500;
        }
        
        .legend-item-sidebar.disabled .legend-toggle {
          background: #f8f9fa;
          color: #6c757d;
          border: 2px dashed #dee2e6;
        }
        
        .legend-item-sidebar.disabled .legend-color {
          background-color: #ccc !important;
          opacity: 0.5;
        }
        
        .legend-item-sidebar .legend-color {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.8);
          flex-shrink: 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        
        .legend-item-sidebar .legend-label {
          flex: 1;
          line-height: 1.2;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .legend-item-sidebar.disabled .legend-label {
          text-shadow: none;
        }
        
        /* Years list improvements */
        .years-list-container {
          border-radius: 6px;
          background: white;
          padding: 4px;
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          justify-content: center;
        }
        
        .years-list-container .yearbtn {
          display: inline-block;
          text-align: center;
          font-size: 12px;
          padding: 3px 6px;
          flex: 0 0 auto;
        }
        
        @media (max-width: 768px) {
          .sidebar-title {
            font-size: 13px;
            margin-top: 15px;
          }
          
          .view-controls-sidebar .btn {
            font-size: 13px;
            padding: 6px 10px;
          }
          
          .legend-item-sidebar {
            font-size: 12px;
            padding: 4px 6px;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  updatePeriodTitle() {
    const titleElement = this.container.querySelector('.period-title');
    if (titleElement) {
      titleElement.textContent = this.getPeriodTitle();
    }
  }
  
  getEventCategory(event) {
    // Use existing categorization logic if available, otherwise fallback
    if (typeof getEventTypeCategory === 'function') {
      return getEventTypeCategory(event.type || event.name) || 'anderes';
    }
    
    // Fallback categorization if function not available
    const name = (event.name || '').toLowerCase();
    
    if (name.includes('theater') || name.includes('aufführung') || name.includes('generalprobe') || name.includes('probe')) {
      return 'Theater';
    } else if (name.includes('konzert') || name.includes('musik') || name.includes('oper') || name.includes('quartett')) {
      return 'Musik';
    } else if (name.includes('film') || name.includes('kino') || name.includes('panoramabesuch')) {
      return 'Film';
    } else if (name.includes('vortrag') || name.includes('lesung') || name.includes('vorlesung')) {
      return 'Vortrag';
    } else if (name.includes('diner') || name.includes('hochzeit') || name.includes('ball') || name.includes('privat')) {
      return 'Privatveranstaltung';
    } else if (name.includes('empfang') || name.includes('fest') || name.includes('feier') || name.includes('vereinstreffen') || name.includes('ausstellung')) {
      return 'anderes';
    }
    
    return 'anderes';
  }
  
  getEventsForDate(year, month, day) {
    return this.events.filter(event => {
      const eventDate = new Date(event.startDate);
      const category = this.getEventCategory(event);
      
      return eventDate.getFullYear() === year &&
             eventDate.getMonth() === month &&
             eventDate.getDate() === day &&
             this.enabledCategories.has(category);
    });
  }
  
  renderCalendar() {
    const grid = this.container.querySelector('.calendar-grid');
    grid.innerHTML = '';
    
    // Remove all view classes and add current view
    grid.className = `calendar-grid ${this.currentView}-view`;
    
    switch(this.currentView) {
      case 'year':
        this.renderYearView(grid);
        break;
      case 'month':
        this.renderMonthView(grid);
        break;
    }
  }
  
  renderYearView(grid) {
    for (let month = 0; month < 12; month++) {
      const monthDiv = this.createMonth(month);
      grid.appendChild(monthDiv);
    }
  }
  
  renderMonthView(grid) {
    const monthDiv = this.createLargeMonth(this.currentMonth);
    grid.appendChild(monthDiv);
  }
  
  
  createMonth(month) {
    const monthDiv = document.createElement('div');
    monthDiv.className = 'month';
    
    const header = document.createElement('div');
    header.className = 'month-header';
    header.innerHTML = `<a href="#" class="month-link" data-month="${month}">${this.monthNames[month]}</a>`;
    monthDiv.appendChild(header);
    
    // Add click handler for month name
    const monthLink = header.querySelector('.month-link');
    monthLink.addEventListener('click', (e) => {
      e.preventDefault();
      const clickedMonth = parseInt(e.target.dataset.month);
      this.currentMonth = clickedMonth;
      this.changeView('month');
    });
    
    const daysGrid = document.createElement('div');
    daysGrid.className = 'month-days';
    
    // Add day headers
    this.dayNames.forEach(dayName => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'day-header';
      dayHeader.textContent = dayName;
      daysGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(this.currentYear, month, 1);
    const lastDay = new Date(this.currentYear, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // 0 = Sunday
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'day other-month';
      daysGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDiv = this.createDay(this.currentYear, month, day);
      daysGrid.appendChild(dayDiv);
    }
    
    monthDiv.appendChild(daysGrid);
    return monthDiv;
  }
  
  createDay(year, month, day) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    dayDiv.appendChild(dayNumber);
    
    const events = this.getEventsForDate(year, month, day);
    
    if (events.length > 0) {
      dayDiv.classList.add('has-events');
      
      // Create event visualization
      if (events.length <= 6) {
        // Show as dots for few events
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'event-dots';
        
        events.forEach(event => {
          const dot = document.createElement('div');
          dot.className = 'event-dot';
          const category = this.getEventCategory(event);
          dot.style.backgroundColor = this.eventCategories[category] || this.eventCategories['anderes'];
          dot.title = event.name;
          dotsContainer.appendChild(dot);
        });
        
        dayDiv.appendChild(dotsContainer);
      } else {
        // Show as bars for many events
        dayDiv.classList.add('many-events');
        
        const barsContainer = document.createElement('div');
        barsContainer.className = 'event-bars';
        
        // Group events by category and show up to 4 bars
        const categoryGroups = {};
        events.forEach(event => {
          const category = this.getEventCategory(event);
          if (!categoryGroups[category]) {
            categoryGroups[category] = [];
          }
          categoryGroups[category].push(event);
        });
        
        let barCount = 0;
        Object.entries(categoryGroups).forEach(([category, categoryEvents]) => {
          if (barCount < 4) {
            const bar = document.createElement('div');
            bar.className = 'event-bar';
            bar.style.backgroundColor = this.eventCategories[category];
            bar.title = `${category}: ${categoryEvents.length} Event${categoryEvents.length > 1 ? 's' : ''}`;
            barsContainer.appendChild(bar);
            barCount++;
          }
        });
        
        dayDiv.appendChild(barsContainer);
        
        // Add count indicator
        const countDiv = document.createElement('div');
        countDiv.className = 'events-count';
        countDiv.textContent = events.length;
        dayDiv.appendChild(countDiv);
      }
      
      // Add click handler
      dayDiv.addEventListener('click', () => {
        this.onDayClick({
          date: new Date(year, month, day),
          events: events
        });
      });
    }
    
    return dayDiv;
  }
  
  createLargeMonth(month) {
    const monthDiv = document.createElement('div');
    monthDiv.className = 'month month-large';
    
    const header = document.createElement('div');
    header.className = 'month-header';
    header.textContent = this.monthNames[month];
    monthDiv.appendChild(header);
    
    const daysGrid = document.createElement('div');
    daysGrid.className = 'month-days month-days-large';
    
    // Add day headers
    this.dayNames.forEach(dayName => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'day-header day-header-large';
      dayHeader.textContent = dayName;
      daysGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(this.currentYear, month, 1);
    const lastDay = new Date(this.currentYear, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'day day-large other-month';
      daysGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDiv = this.createLargeDay(this.currentYear, month, day);
      daysGrid.appendChild(dayDiv);
    }
    
    monthDiv.appendChild(daysGrid);
    return monthDiv;
  }
  
  createLargeDay(year, month, day) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day day-large';
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number day-number-large';
    dayNumber.textContent = day;
    dayDiv.appendChild(dayNumber);
    
    const events = this.getEventsForDate(year, month, day);
    
    if (events.length > 0) {
      dayDiv.classList.add('has-events');
      
      // In large month view, show more events
      const eventsContainer = document.createElement('div');
      eventsContainer.className = 'events-container-large';
      
      events.slice(0, 5).forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event-item-large';
        const category = this.getEventCategory(event);
        eventDiv.style.backgroundColor = this.eventCategories[category];
        eventDiv.title = event.name;
        eventDiv.textContent = event.name;
        eventsContainer.appendChild(eventDiv);
      });
      
      if (events.length > 5) {
        const moreDiv = document.createElement('div');
        moreDiv.className = 'more-events-large';
        moreDiv.textContent = `+${events.length - 5} weitere`;
        eventsContainer.appendChild(moreDiv);
      }
      
      dayDiv.appendChild(eventsContainer);
      
      // Add click handler
      dayDiv.addEventListener('click', () => {
        this.onDayClick({
          date: new Date(year, month, day),
          events: events
        });
      });
    }
    
    return dayDiv;
  }
  
  
  setYear(year) {
    this.currentYear = year;
    this.updatePeriodTitle();
    this.renderCalendar();
    this.saveStateToURL();
  }
  
  setDataSource(events) {
    this.events = events;
    this.renderCalendar();
  }
  
  render() {
    this.renderCalendar();
  }
  
  // URL state management methods
  loadStateFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('year')) {
      this.currentYear = parseInt(urlParams.get('year')) || this.currentYear;
    }
    
    if (urlParams.has('month')) {
      const monthFromURL = parseInt(urlParams.get('month'));
      this.currentMonth = monthFromURL ? monthFromURL - 1 : this.currentMonth;
    }
    
    
    if (urlParams.has('view')) {
      const view = urlParams.get('view');
      if (['year', 'month'].includes(view)) {
        this.currentView = view;
      }
    }
    
    if (urlParams.has('categories')) {
      try {
        const categories = JSON.parse(decodeURIComponent(urlParams.get('categories')));
        if (Array.isArray(categories)) {
          this.enabledCategories = new Set(categories);
        }
      } catch (e) {
        console.warn('Failed to parse categories from URL:', e);
      }
    }
  }
  
  saveStateToURL() {
    const urlParams = new URLSearchParams();
    
    urlParams.set('year', this.currentYear.toString());
    urlParams.set('view', this.currentView);
    
    if (this.currentView === 'month') {
      urlParams.set('month', (this.currentMonth + 1).toString());
    }
    
    
    // Save enabled categories
    if (this.enabledCategories.size !== Object.keys(this.eventCategories).length) {
      urlParams.set('categories', encodeURIComponent(JSON.stringify(Array.from(this.enabledCategories))));
    }
    
    const newURL = window.location.pathname + '?' + urlParams.toString();
    window.history.replaceState({ path: newURL }, '', newURL);
  }
}

// Export for global use
window.SimpleCalendar = SimpleCalendar;