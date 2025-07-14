import xml.etree.ElementTree as ET
import json
from collections import defaultdict, Counter
from datetime import datetime

NS = {'tei': 'http://www.tei-c.org/ns/1.0'}
tree = ET.parse('./data/editions/listevent.xml')  
root = tree.getroot()

# Zielstruktur: Jahr → ana → Zähler bzw. n-Zähler
year_data = defaultdict(lambda: {
    "ana_counter": Counter(),
    "ana_n_counter": defaultdict(Counter)
})

# Alle Events durchgehen
for event in root.findall('.//tei:event', NS):
    when_iso = event.attrib.get('when-iso')
    event_name = event.find('tei:eventName', NS)
    
    if not (when_iso and event_name is not None):
        continue

    try:
        year = datetime.strptime(when_iso, "%Y-%m-%d").year
    except ValueError:
        continue

    ana = event_name.attrib.get('ana')
    n = event_name.attrib.get('n')

    if ana and n and 1876 <= year <= 1931:
        year_data[year]["ana_counter"][ana] += 1
        year_data[year]["ana_n_counter"][ana][n] += 1

# JSON strukturieren für jedes Jahr
output = {}

for year, data in year_data.items():
    ana_counter = data["ana_counter"]
    ana_n_counter = data["ana_n_counter"]

    ana_chart = {
        "labels": list(ana_counter.keys()),
        "datasets": [{
            "label": f"Veranstaltungstypen im Jahr {year}",
            "data": list(ana_counter.values())
        }]
    }

    ana_n_charts = {}
    for ana, n_counts in ana_n_counter.items():
        ana_n_charts[ana] = {
            "labels": list(n_counts.keys()),
            "datasets": [{
                "label": f"Verteilung innerhalb von '{ana}' im Jahr {year}",
                "data": list(n_counts.values())
            }]
        }

    output[year] = {
        "ana_chart": ana_chart,
        "ana_n_charts": ana_n_charts
    }

# Als JSON speichern
with open('./html/js-data/charts_by_year.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("Jahresbasiertes JSON erstellt.")
