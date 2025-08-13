/**
 * Initialization script for Simple Calendar
 */
let calendar;
let years = [];

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Extract years from calendar data and sort numerically
    years = Array.from(new Set(calendarData.map(function(item) {
        return parseInt(item.startDate.split('-')[0]);
    }))).sort(function(a, b) { return a - b; });
    
    console.log('Available years:', years); // Debug log
    
    // Create improved sidebar layout
    setupSidebar();
    
    // Initialize calendar
    calendar = new SimpleCalendar('calendar-container', {
        startYear: 1899,
        dataSource: calendarData,
        clickDay: function(e) {
            showEventModal(e.events, e.date);
        }
    });
    
    // Setup sidebar components
    const sidebarControls = calendar.createSidebarControls();
    const sidebar = document.querySelector('.yearscol');
    
    // Add view controls
    sidebar.appendChild(sidebarControls.createViewControls());
    
    // Add legend
    sidebar.appendChild(sidebarControls.createLegend());
    
    // Highlight first year button
    if (years.length > 0) {
        const firstYearBtn = document.getElementById('ybtn' + years[0]);
        if (firstYearBtn) {
            firstYearBtn.classList.add("focus");
        }
    }
});

function setupSidebar() {
    const yearsTable = document.getElementById('years-table');
    
    // Clear existing content
    yearsTable.innerHTML = '';
    
    // Create years container with better styling
    const yearsContainer = document.createElement('div');
    yearsContainer.className = 'years-list-container';
    
    years.forEach(function(year) {
        const yearButton = document.createElement('button');
        yearButton.id = 'ybtn' + year;
        yearButton.className = 'btn btn-light yearbtn';
        yearButton.value = year;
        yearButton.textContent = year;
        yearButton.onclick = function() { updateYear(year); };
        
        yearsContainer.appendChild(yearButton);
    });
    
    // Add title and container
    const yearTitle = document.createElement('h6');
    yearTitle.className = 'sidebar-title';
    yearTitle.textContent = 'Jahr wählen';
    
    yearsTable.appendChild(yearTitle);
    yearsTable.appendChild(yearsContainer);
}

function updateYear(year) {
    // Update button states
    document.querySelectorAll('.yearbtn').forEach(function(btn) {
        btn.classList.remove('focus');
    });
    document.getElementById('ybtn' + year).classList.add('focus');
    
    // Update calendar
    calendar.setYear(parseInt(year));
}

// Global modal instance for better performance
let eventModalInstance = null;

function showEventModal(events, date) {
    if (events.length === 0) return;
    
    const modal = document.getElementById('eventPopup');
    const title = document.getElementById('eventPopupTitle');
    const body = document.getElementById('eventPopupBody');
    
    // Initialize Bootstrap modal instance once
    if (!eventModalInstance && typeof bootstrap !== 'undefined') {
        eventModalInstance = new bootstrap.Modal(modal, {
            backdrop: true,
            keyboard: true,
            focus: true
        });
    }
    
    // Format date
    const formattedDate = date.toLocaleDateString('de-DE', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    title.textContent = 'Ereignisse am ' + formattedDate;
    
    // More efficient DOM manipulation
    // Clear existing content
    body.innerHTML = '';
    
    // Create container
    const listGroup = document.createElement('div');
    listGroup.className = 'list-group list-group-flush';
    
    // Create event items using DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    events.forEach(function(event) {
        const eventItem = document.createElement('a');
        eventItem.href = event.id;
        eventItem.className = 'list-group-item list-group-item-action';
        eventItem.innerHTML = 
            '<div class="d-flex w-100 justify-content-between align-items-start">' +
            '<div class="ms-2 me-auto">' +
            '<div class="fw-bold">' + escapeHtml(event.name) + '</div>' +
            (event.type ? '<small class="text-muted">' + escapeHtml(event.type) + '</small>' : '') +
            '</div>' +
            '</div>';
        
        fragment.appendChild(eventItem);
    });
    
    listGroup.appendChild(fragment);
    body.appendChild(listGroup);
    
    // Show modal with proper Bootstrap integration
    if (eventModalInstance) {
        eventModalInstance.show();
    } else if (typeof $ !== 'undefined') {
        // Fallback for jQuery/Bootstrap 3/4
        $(modal).modal('show');
    } else {
        // Basic fallback with better styling
        modal.style.display = 'block';
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        
        // Create backdrop if it doesn't exist
        let backdrop = document.querySelector('.modal-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
        }
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Optimized close function
function closeEventModal() {
    const modal = document.getElementById('eventPopup');
    
    if (eventModalInstance) {
        eventModalInstance.hide();
    } else if (typeof $ !== 'undefined') {
        $(modal).modal('hide');
    } else {
        // Basic fallback cleanup
        modal.style.display = 'none';
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }
}

// Performance optimizations for modal
document.addEventListener('DOMContentLoaded', function() {
    // Pre-warm modal elements for better performance
    const modal = document.getElementById('eventPopup');
    if (modal && typeof bootstrap !== 'undefined') {
        // Initialize the modal instance on page load
        eventModalInstance = new bootstrap.Modal(modal, {
            backdrop: true,
            keyboard: true,
            focus: true
        });
        
        // Add event listeners for better UX
        modal.addEventListener('show.bs.modal', function () {
            // Add subtle fade-in animation
            modal.style.transition = 'opacity 0.15s linear';
        });
        
        modal.addEventListener('hidden.bs.modal', function () {
            // Clear modal content when hidden for better memory management
            const body = document.getElementById('eventPopupBody');
            if (body && body.children.length > 1) {
                body.innerHTML = '<div class="text-center p-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Lädt...</span></div></div>';
            }
        });
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && eventModalInstance) {
            closeEventModal();
        }
    });
});

// Add CSS for year buttons and modal optimizations
const optimizedStyles = document.createElement('style');
optimizedStyles.textContent = `
    .yearbtn {
        margin: 1px;
        padding: 4px 8px;
        border: none;
        background: transparent;
        transition: all 0.15s ease-in-out;
        font-size: 13px;
        color: #495057;
        border-radius: 3px;
        min-width: auto;
    }
    
    .yearbtn:hover {
        background: #f8f9fa;
        color: #007bff;
    }
    
    .yearbtn.focus {
        background: #007bff;
        color: white;
        font-weight: 600;
    }
    
    .yearscol {
        overflow-y: visible;
        scrollbar-width: thin;
    }
    
    .yearscol::-webkit-scrollbar {
        width: 6px;
    }
    
    .yearscol::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }
    
    .yearscol::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
    }
    
    .yearscol::-webkit-scrollbar-thumb:hover {
        background: #a1a1a1;
    }
    
    /* Modal performance optimizations */
    .modal .list-group-item {
        border-left: none;
        border-right: none;
        transition: background-color 0.1s ease;
    }
    
    .modal .list-group-item:hover {
        background-color: #f8f9fa;
        transform: none; /* Disable transform for better performance */
    }
    
    .modal .list-group-item:first-child {
        border-top: none;
    }
    
    .modal .list-group-item:last-child {
        border-bottom: none;
    }
    
    /* Optimize modal animations */
    .modal.fade .modal-dialog {
        transition: transform 0.15s ease-out;
        transform: translate(0, -50px);
    }
    
    .modal.show .modal-dialog {
        transform: none;
    }
`;
document.head.appendChild(optimizedStyles);