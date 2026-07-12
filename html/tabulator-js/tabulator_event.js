var table = new Tabulator("#tabulator-table-event", {
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

            columns: [
            {formatter:"responsiveCollapse", width:30, minWidth:30, hozAlign:"center", resizable:false, headerSort:false, responsive:0},
            {title:"Datum", field:"datum", headerFilter:"input", formatter:"html", responsive:0, minWidth:95, maxWidth:120},
            {title:"Ereignis", field:"ereignis", minWidth:150, widthGrow:3, headerFilter:"input", formatter:"html", responsive:0},
            {title:"Werk", field:"werk", minWidth:150, headerFilter:"input", formatter:"html", responsive:2},
            {title:"Ort", field:"ort", headerFilter:"input", formatter:"html", responsive:2, minWidth:120, maxWidth:250},
            {title:"Typ", field:"typ", headerFilter:"input", formatter:"html", responsive:1, minWidth:100, maxWidth:160},
            {title:"Mitwirkende", field:"mitwirkende", headerFilter:"input", formatter:"html", responsive:1, minWidth:150},
            {title:"Teilnehmer_innen", field:"teilnehmer_innen", headerFilter:"input", formatter:"html", responsive:1, minWidth:150},
            {title:"Organisation", field:"organisation", headerFilter:"input", formatter:"html", responsive:4, minWidth:150, maxWidth:250},
            ],
            
            initialSort:[
            {column:"ereignis", dir:"asc"},
            {column:"datum", dir:"asc"}, 

            ],
            
            langs: {
            "de-de": {
            "pagination": {
            "first":"Erste",
            "first_title":"Erste Seite",
            "last":"Letzte",
            "last_title":"Letzte Seite",
            "prev":"Vorige",
            "prev_title":"Vorige Seite",
            "next":"Nächste",
            "next_title":"Nächste Seite",
            "all":"Alle",
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
            
            table.on("dataLoaded", function (data) {
            var el = document.getElementById("counter1");
            el.innerHTML = `${data.length}`;
            var el = document.getElementById("counter2");
            el.innerHTML = `${data.length}`;
            });
            
            table.on("dataFiltered", function (filters, data) {
            var el = document.getElementById("counter1");
            el.innerHTML = `${data.length}`;
            }); 
            
            
      