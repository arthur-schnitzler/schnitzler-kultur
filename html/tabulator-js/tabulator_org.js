var table = new Tabulator("#tabulator-table-org", {
   height: 800,
   width: "100%",
    tooltips: true,
            pagination:"local",
            paginationSize:25,
            paginationCounter:"rows",
            movableColumns:true,
            layout:"fitColumns",
            responsiveLayout:"collapse", // Spalten bei Platzmangel einklappen, per Toggle aufklappbar
            responsiveLayoutCollapseStartOpen:false,
            dataLoader: true,
    columns:[
            { formatter: "responsiveCollapse", width: 30, minWidth: 30, hozAlign: "center", resizable: false, headerSort: false, responsive: 0 },
            { title: "Name", field: "name", sorter: "string", responsive: 0, minWidth: 150 },
            { title: "Namensvarianten", field: "namensvarianten", sorter: "string", responsive: 3 },
            { title: "Ort", field: "ort", sorter: "string", responsive: 1, minWidth: 120 },
            { title: "Typ", field: "typ", sorter: "string", responsive: 2 }
            ],
            initialSort: [
            { column: "ort", dir: "asc" },
            { column: "name", dir: "asc" }
            ],
            langs: {
            "de-de": { // German language definition
            "pagination": {
            "first": "Erste",
            "first_title": "Erste Seite",
            "last": "Letzte",
            "last_title": "Letzte Seite",
            "prev": "Vorige",
            "prev_title": "Vorige Seite",
            "next": "Nächste",
            "next_title": "Nächste Seite",
            "all": "Alle",
            "counter": {
            "showing": "Zeige",
            "of": "von",
            "rows": "Reihen",
            "pages": "Seiten"
            }
            }
            }
            },
            locale: "de-de"
            });
            