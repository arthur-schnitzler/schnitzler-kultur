import xml.etree.ElementTree as ET

# Namespaces definieren
NS = {'tei': 'http://www.tei-c.org/ns/1.0'}

# Pfade
event_types_path = './data/indices/eventTypes.xml'
listevent_path = './data/editions/listevent.xml'

# 1. Lade Mapping von Description → Type aus eventTypes.xml
def load_event_type_mapping(path):
    tree = ET.parse(path)
    root = tree.getroot()
    mapping = {}
    for item in root.findall('item'):
        description = item.findtext('description')
        event_type = item.get('type')
        if description and event_type:
            mapping[description] = event_type
    return mapping

# 2. Ergänze @ana in listevent.xml
def add_ana_attributes(event_type_map, path):
    ET.register_namespace('', NS['tei'])  # Für korrektes Schreiben mit Namespace
    tree = ET.parse(path)
    root = tree.getroot()

    for event_name in root.findall('.//tei:eventName', NS):
        desc = event_name.get('n')
        if desc and desc in event_type_map:
            event_name.set('ana', event_type_map[desc])

    tree.write(path, encoding='utf-8', xml_declaration=True)

# Hauptlogik
if __name__ == '__main__':
    event_type_map = load_event_type_mapping(event_types_path)
    add_ana_attributes(event_type_map, listevent_path)
    print("Fertig: @ana-Attribute ergänzt.")
