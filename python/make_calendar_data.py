import xml.etree.ElementTree as ET
import os

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

        entry = {
            "name": event_name,
            "startDate": when_iso,
            "id": f"{xml_id}.html"
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
