import xml.etree.ElementTree as ET
from datetime import datetime
import locale
import os

# Setze deutsche Locale für Wochentagsnamen
try:
    locale.setlocale(locale.LC_TIME, "de_DE.UTF-8")
except locale.Error:
    # Fallback, falls das System "de_DE.UTF-8" nicht unterstützt
    locale.setlocale(locale.LC_TIME, "de_DE")

# Eingabe- und Ausgabepfade
input_file = "./data/editions/listevent.xml"
output_file = "html/js-data/calendarData.js"
os.makedirs(os.path.dirname(output_file), exist_ok=True)

# XML-Namespace
NS = {'tei': 'http://www.tei-c.org/ns/1.0'}

# XML einlesen
tree = ET.parse(input_file)
root = tree.getroot()

# Alle tei:event-Elemente finden
events = root.findall(".//tei:listEvent/tei:event", NS)

entries = []

for event in events:
    xml_id = event.attrib.get("{http://www.w3.org/XML/1998/namespace}id")
    when_iso = event.attrib.get("when-iso")
    event_name_elem = event.find("tei:eventName", NS)

    if xml_id and when_iso and event_name_elem is not None:
        event_name = event_name_elem.text.strip()

        # Datumsformat umwandeln zu "Wochentag, D. Monat JJJJ"
        try:
            date_obj = datetime.strptime(when_iso, "%Y-%m-%d")
            formatted_name = date_obj.strftime("%A, %-d. %B %Y")
        except ValueError:
            # Fallback falls Datumsformat nicht stimmt
            formatted_name = event_name

        entry = {
            "name": event_name_elem.text.strip(),
            "startDate": when_iso,
            "id": f"entry__{when_iso}.html"
        }
        entries.append(entry)

# JavaScript-Datei schreiben
with open(output_file, "w", encoding="utf-8") as f:
    f.write("var calendarData = [\n")
    for i, entry in enumerate(entries):
        comma = "," if i < len(entries) - 1 else ""
        f.write(f'  {{\n    "name": "{entry["name"]}", '
                f'"startDate": "{entry["startDate"]}", '
                f'"id": "{entry["id"]}"\n  }}{comma}\n')
    f.write("];\n")

print(f"{len(entries)} Ereignisse wurden extrahiert und in {output_file} geschrieben.")
