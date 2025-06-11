import xml.etree.ElementTree as ET
from xml.dom import minidom

# Namespace definieren
NS = {'tei': 'http://www.tei-c.org/ns/1.0'}

# Zu verarbeitende Elemente und Zieldateien
targets = [
    ("persName", "../temp/mentioned-persons.xml", ".//tei:persName"),
    ("placeName", "../temp/mentioned-places.xml", ".//tei:placeName"),
    ("orgName", "../temp/mentioned-orgs.xml", ".//tei:orgName"),
    ("bibl", "../temp/mentioned-bibl.xml", ".//tei:bibl/tei:title")
]

# XML einlesen
tree = ET.parse("../data/editions/listevent.xml")
root = tree.getroot()

# Hilfsfunktion: XML schön formatieren
def pretty_xml(element):
    rough_string = ET.tostring(element, encoding='utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")

# Verarbeitung
for tag_name, output_filename, xpath in targets:
    keys = set()
    
    for elem in root.findall(xpath, namespaces=NS):
        key = elem.get("key")
        if key and key.startswith("pmb"):
            keys.add(key.replace("pmb", "", 1))
    
    # XML-Struktur erzeugen
    list_elem = ET.Element("list")
    for key in sorted(keys):
        item = ET.SubElement(list_elem, "item")
        item.text = key

    # Ausgabe als formatiertes XML
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(pretty_xml(list_elem))
