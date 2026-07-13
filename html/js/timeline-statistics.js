/**
 * Timeline Statistics for Schnitzler Culture Events
 * Shows event types over time from 1876-1931
 */

// Event categories and colors (matching calendar.js)
// Only include categories that have actual data
const eventCategories = {
    'Theater': '#8B4513',        // Saddle Brown
    'Musik': '#228B22',          // Forest Green
    'Film': '#FF1493',           // Deep Pink (kept original)
    'Vortrag': '#00CED1',        // Dark Turquoise
    'Privatveranstaltung': '#4169E1', // Royal Blue
    'anderes': '#9932CC'          // Dark Orchid
};

let timelineChart;
let selectedEventTypes = new Set(Object.keys(eventCategories)); // All selected by default
let selectedSubTypes = new Set(); // Individual subtypes
let showSubTypes = false; // Toggle between main types and subtypes
let eventSubTypes = {}; // Will store main type -> [subtypes] mapping
let eventTypeMappings = {}; // Will store subtype -> main type mappings from XML

// DOM elements
const eventTypeCheckboxes = document.getElementById('eventTypeCheckboxes');
const selectAllBtn = document.getElementById('selectAllBtn');
const deselectAllBtn = document.getElementById('deselectAllBtn');
const timelineCanvas = document.getElementById('timelineChart');

// Load event type mappings from XML
async function loadEventTypeMappings() {
    try {
        const response = await fetch('./eventTypes.xml');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Parse XML and build mapping
        const items = xmlDoc.querySelectorAll('item');
        items.forEach(item => {
            const type = item.getAttribute('type');
            const description = item.querySelector('description').textContent;
            eventTypeMappings[description] = type;
        });
        
        console.log('Loaded event type mappings:', Object.keys(eventTypeMappings).length, 'types');
    } catch (error) {
        console.warn('Failed to load eventTypes.xml, using fallback categorization:', error);
    }
}

// Event categorization function using XML mappings
function getEventCategory(event) {
    if (!event.type) {
        return 'anderes';
    }
    
    // First, try exact match from XML mappings
    if (eventTypeMappings[event.type]) {
        return eventTypeMappings[event.type];
    }
    
    // If no exact match, apply fallback logic
    const name = (event.name || '').toLowerCase();
    const type = (event.type || '').toLowerCase();
    
    if (type.includes('theater') || type.includes('aufführung') || type.includes('generalprobe') || type.includes('probe') ||
        name.includes('theater') || name.includes('aufführung') || name.includes('generalprobe') || name.includes('probe')) {
        return 'Theater';
    } else if (type.includes('konzert') || type.includes('musik') || type.includes('oper') || type.includes('quartett') ||
               name.includes('konzert') || name.includes('musik') || name.includes('oper') || name.includes('quartett')) {
        return 'Musik';
    } else if (type.includes('film') || type.includes('kino') || name.includes('film') || name.includes('kino') || type.includes('panoramabesuch') || name.includes('panoramabesuch')) {
        return 'Film';
    } else if (type.includes('vortrag') || type.includes('lesung') || type.includes('vorlesung') ||
               name.includes('vortrag') || name.includes('lesung') || name.includes('vorlesung')) {
        return 'Vortrag';
    } else if (type.includes('diner') || type.includes('hochzeit') || type.includes('ball') || type.includes('privat') ||
               name.includes('diner') || name.includes('hochzeit') || name.includes('ball') || name.includes('privat')) {
        return 'Privatveranstaltung';
    } else if (type.includes('empfang') || type.includes('fest') || type.includes('feier') || type.includes('vereinstreffen') ||
               name.includes('empfang') || name.includes('fest') || name.includes('feier') || name.includes('vereinstreffen') ||
               type.includes('ausstellung') || name.includes('ausstellung') || type.includes('museumsbesuch') || name.includes('museumsbesuch')) {
        return 'anderes';
    }
    
    return 'anderes';
}

// Extract all subtypes from calendar data and categorize them
function extractSubTypes() {
    eventSubTypes = {
        'Theater': new Set(),
        'Musik': new Set(),
        'Film': new Set(),
        'Vortrag': new Set(),
        'Privatveranstaltung': new Set(),
        'anderes': new Set()
    };
    
    if (typeof calendarData !== 'undefined') {
        calendarData.forEach(event => {
            if (event.type) {
                const mainCategory = getEventCategory(event);
                eventSubTypes[mainCategory].add(event.type);
            }
        });
    }
    
    // Convert Sets to sorted Arrays
    Object.keys(eventSubTypes).forEach(category => {
        eventSubTypes[category] = Array.from(eventSubTypes[category]).sort();
    });
}

// Generate color variations for subtypes
function generateSubTypeColor(mainColor, index, total) {
    // Convert hex to HSL, then create variations
    const hex = mainColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
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
    
    // Create variation by adjusting lightness and saturation
    const variation = (index / Math.max(total - 1, 1)) - 0.5; // -0.5 to 0.5
    const newL = Math.max(0.2, Math.min(0.8, l + variation * 0.3));
    const newS = Math.max(0.3, Math.min(1, s + variation * 0.2));
    
    // Convert back to hex
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

// Generate timeline data for all event types or subtypes
function generateTimelineData() {
    const years = [];
    let eventTypeCounts = {};
    
    // Initialize years array (1876-1931)
    for (let year = 1876; year <= 1931; year++) {
        years.push(year.toString());
    }
    
    if (showSubTypes) {
        // Initialize counts for selected subtypes
        selectedSubTypes.forEach(subType => {
            eventTypeCounts[subType] = new Array(56).fill(0);
        });
        
        // Count events by year and subtype
        if (typeof calendarData !== 'undefined') {
            calendarData.forEach(event => {
                const eventYear = parseInt(event.startDate.split('-')[0]);
                const subType = event.type;
                
                if (subType && selectedSubTypes.has(subType) && eventYear >= 1876 && eventYear <= 1931) {
                    const yearIndex = eventYear - 1876;
                    eventTypeCounts[subType][yearIndex]++;
                }
            });
        }
    } else {
        // Initialize counts for selected main event types
        selectedEventTypes.forEach(eventType => {
            eventTypeCounts[eventType] = new Array(56).fill(0);
        });
        
        // Count events by year and main type
        if (typeof calendarData !== 'undefined') {
            calendarData.forEach(event => {
                const eventYear = parseInt(event.startDate.split('-')[0]);
                const category = getEventCategory(event);
                
                if (selectedEventTypes.has(category) && eventYear >= 1876 && eventYear <= 1931) {
                    const yearIndex = eventYear - 1876;
                    eventTypeCounts[category][yearIndex]++;
                }
            });
        }
    }
    
    return { years, eventTypeCounts };
}

// Create hierarchical checkboxes for event types and subtypes
function createEventTypeCheckboxes() {
    eventTypeCheckboxes.innerHTML = '';
    
    // Add view toggle buttons
    const toggleWrapper = document.createElement('div');
    toggleWrapper.className = 'mb-3';
    toggleWrapper.innerHTML = `
        <div class="btn-group w-100" role="group">
            <input type="radio" class="btn-check" name="viewMode" id="mainTypes" autocomplete="off" ${!showSubTypes ? 'checked' : ''}>
            <label class="btn btn-outline-secondary btn-sm" for="mainTypes">Haupttypen</label>
            
            <input type="radio" class="btn-check" name="viewMode" id="subTypes" autocomplete="off" ${showSubTypes ? 'checked' : ''}>
            <label class="btn btn-outline-secondary btn-sm" for="subTypes">Untertypen</label>
        </div>
    `;
    eventTypeCheckboxes.appendChild(toggleWrapper);
    
    // Add event listeners for toggle
    document.getElementById('mainTypes').addEventListener('change', () => {
        if (!showSubTypes) return;
        showSubTypes = false;
        createEventTypeCheckboxes();
        updateChart();
    });
    
    document.getElementById('subTypes').addEventListener('change', () => {
        if (showSubTypes) return;
        showSubTypes = true;
        createEventTypeCheckboxes();
        updateChart();
    });
    
    if (!showSubTypes) {
        // Show main categories
        Object.entries(eventCategories).forEach(([eventType, color]) => {
            const categoryWrapper = document.createElement('div');
            categoryWrapper.className = 'mb-3';
            
            // Main category checkbox
            const mainCheckboxWrapper = document.createElement('div');
            mainCheckboxWrapper.className = 'form-check';
            
            const checkbox = document.createElement('input');
            checkbox.className = 'form-check-input';
            checkbox.type = 'checkbox';
            checkbox.id = `eventType_${eventType}`;
            checkbox.value = eventType;
            checkbox.checked = selectedEventTypes.has(eventType);
            
            const label = document.createElement('label');
            label.className = 'form-check-label d-flex align-items-center fw-bold';
            label.htmlFor = checkbox.id;
            
            const colorBox = document.createElement('span');
            colorBox.style.cssText = `
                display: inline-block;
                width: 16px;
                height: 16px;
                background-color: ${color};
                margin-right: 8px;
                border: 1px solid rgba(0,0,0,0.2);
                border-radius: 2px;
            `;
            
            label.appendChild(colorBox);
            label.appendChild(document.createTextNode(eventType));
            
            // Add subtype count
            const subTypeCount = eventSubTypes[eventType] ? eventSubTypes[eventType].length : 0;
            if (subTypeCount > 0) {
                const countSpan = document.createElement('small');
                countSpan.className = 'text-muted ms-1';
                countSpan.textContent = `(${subTypeCount})`;
                label.appendChild(countSpan);
            }
            
            mainCheckboxWrapper.appendChild(checkbox);
            mainCheckboxWrapper.appendChild(label);
            
            // Add event listener
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    selectedEventTypes.add(eventType);
                } else {
                    selectedEventTypes.delete(eventType);
                }
                updateChart();
            });
            
            categoryWrapper.appendChild(mainCheckboxWrapper);
            eventTypeCheckboxes.appendChild(categoryWrapper);
        });
    } else {
        // Show subtypes grouped by main category
        Object.entries(eventCategories).forEach(([eventType, color]) => {
            const subTypes = eventSubTypes[eventType] || [];
            if (subTypes.length === 0) return;
            
            const categoryWrapper = document.createElement('div');
            categoryWrapper.className = 'mb-3';
            
            // Category header
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'd-flex align-items-center mb-2';
            categoryHeader.innerHTML = `
                <span style="
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    background-color: ${color};
                    margin-right: 8px;
                    border: 1px solid rgba(0,0,0,0.2);
                    border-radius: 2px;
                "></span>
                <strong>${eventType}</strong>
                <button class="btn btn-sm btn-link p-0 ms-2" onclick="toggleCategory('${eventType}')">
                    <small>alle ${selectedSubTypes.size > 0 && subTypes.every(st => selectedSubTypes.has(st)) ? 'ab' : ''}wählen</small>
                </button>
            `;
            categoryWrapper.appendChild(categoryHeader);
            
            // Subtypes
            const subTypesContainer = document.createElement('div');
            subTypesContainer.className = 'ps-3';
            
            subTypes.forEach((subType, index) => {
                const subCheckboxWrapper = document.createElement('div');
                subCheckboxWrapper.className = 'form-check form-check-sm';
                
                const subCheckbox = document.createElement('input');
                subCheckbox.className = 'form-check-input form-check-input-sm';
                subCheckbox.type = 'checkbox';
                subCheckbox.id = `subType_${subType.replace(/\s+/g, '_')}`;
                subCheckbox.value = subType;
                subCheckbox.checked = selectedSubTypes.has(subType);
                
                const subLabel = document.createElement('label');
                subLabel.className = 'form-check-label d-flex align-items-center';
                subLabel.htmlFor = subCheckbox.id;
                
                const subColorBox = document.createElement('span');
                const subColor = generateSubTypeColor(color, index, subTypes.length);
                subColorBox.style.cssText = `
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    background-color: ${subColor};
                    margin-right: 6px;
                    border: 1px solid rgba(0,0,0,0.2);
                    border-radius: 2px;
                `;
                
                subLabel.appendChild(subColorBox);
                subLabel.appendChild(document.createTextNode(subType));
                
                subCheckboxWrapper.appendChild(subCheckbox);
                subCheckboxWrapper.appendChild(subLabel);
                
                // Add event listener
                subCheckbox.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        selectedSubTypes.add(subType);
                    } else {
                        selectedSubTypes.delete(subType);
                    }
                    updateChart();
                });
                
                subTypesContainer.appendChild(subCheckboxWrapper);
            });
            
            categoryWrapper.appendChild(subTypesContainer);
            eventTypeCheckboxes.appendChild(categoryWrapper);
        });
    }
}

// Helper function for category toggle
window.toggleCategory = function(category) {
    const subTypes = eventSubTypes[category] || [];
    const allSelected = subTypes.every(st => selectedSubTypes.has(st));
    
    if (allSelected) {
        // Deselect all
        subTypes.forEach(st => selectedSubTypes.delete(st));
    } else {
        // Select all
        subTypes.forEach(st => selectedSubTypes.add(st));
    }
    
    createEventTypeCheckboxes();
    updateChart();
};

// Update the timeline chart
function updateChart() {
    const { years, eventTypeCounts } = generateTimelineData();
    
    // Prepare datasets for selected event types or subtypes
    const datasets = [];
    
    if (showSubTypes) {
        // Group subtypes by main category for color coordination
        const subTypesByCategory = {};
        
        selectedSubTypes.forEach(subType => {
            // Find which main category this subtype belongs to
            let mainCategory = 'anderes';
            for (const [category, subTypes] of Object.entries(eventSubTypes)) {
                if (subTypes.includes(subType)) {
                    mainCategory = category;
                    break;
                }
            }
            
            if (!subTypesByCategory[mainCategory]) {
                subTypesByCategory[mainCategory] = [];
            }
            subTypesByCategory[mainCategory].push(subType);
        });
        
        // Create datasets with color variations
        Object.entries(subTypesByCategory).forEach(([mainCategory, subTypes]) => {
            const mainColor = eventCategories[mainCategory];
            subTypes.forEach((subType, index) => {
                const subColor = generateSubTypeColor(mainColor, index, subTypes.length);
                datasets.push({
                    label: subType,
                    data: eventTypeCounts[subType] || new Array(56).fill(0),
                    backgroundColor: subColor,
                    borderColor: subColor,
                    borderWidth: 1,
                    barThickness: 'flex',
                    maxBarThickness: 15
                });
            });
        });
    } else {
        // Use main categories
        selectedEventTypes.forEach(eventType => {
            datasets.push({
                label: eventType,
                data: eventTypeCounts[eventType] || new Array(56).fill(0),
                backgroundColor: eventCategories[eventType],
                borderColor: eventCategories[eventType],
                borderWidth: 1,
                barThickness: 'flex',
                maxBarThickness: 20
            });
        });
    }
    
    // Destroy existing chart if it exists
    if (timelineChart) {
        timelineChart.destroy();
    }
    
    // Create new chart
    timelineChart = new Chart(timelineCanvas, {
        type: 'bar',
        data: {
            labels: years,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: showSubTypes ? 'Ereignisse nach Untertyp über Zeit (1876-1931)' : 'Ereignisse nach Typ über Zeit (1876-1931)',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return `Jahr ${context[0].label}`;
                        },
                        label: function(context) {
                            const count = context.parsed.y;
                            const eventType = context.dataset.label;
                            return `${eventType}: ${count === 1 ? '1 Ereignis' : `${count} Ereignisse`}`;
                        },
                        footer: function(tooltipItems) {
                            let total = 0;
                            tooltipItems.forEach(item => {
                                total += item.parsed.y;
                            });
                            return total > 0 ? `Gesamt: ${total === 1 ? '1 Ereignis' : `${total} Ereignisse`}` : '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Jahr',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        font: {
                            size: 10
                        },
                        callback: function(value, index) {
                            const year = parseInt(years[index]);
                            // Show every 5th year for readability, plus start and end years
                            return year % 5 === 0 || year === 1876 || year === 1931 ? year : '';
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Anzahl Ereignisse',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Select/Deselect all buttons
selectAllBtn.addEventListener('click', () => {
    if (showSubTypes) {
        // Select all subtypes
        selectedSubTypes.clear();
        Object.values(eventSubTypes).forEach(subTypes => {
            subTypes.forEach(subType => selectedSubTypes.add(subType));
        });
    } else {
        // Select all main types
        selectedEventTypes = new Set(Object.keys(eventCategories));
    }
    
    createEventTypeCheckboxes();
    updateChart();
});

deselectAllBtn.addEventListener('click', () => {
    if (showSubTypes) {
        selectedSubTypes.clear();
    } else {
        selectedEventTypes.clear();
    }
    
    createEventTypeCheckboxes();
    updateChart();
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Load event type mappings first
    await loadEventTypeMappings();
    
    // Wait a bit for calendarData to be loaded, then initialize
    setTimeout(() => {
        extractSubTypes();
        createEventTypeCheckboxes();
        updateChart();
    }, 100);
});