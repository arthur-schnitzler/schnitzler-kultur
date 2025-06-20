import xml.etree.ElementTree as ET
from xml.dom import minidom
import urllib.request

# Namespace definieren
NS = {'tei': 'http://www.tei-c.org/ns/1.0'}

# Zu verarbeitende Elemente und Zieldateien
targets = [
    ("persName", "./temp/mentioned-persons.xml", ".//tei:persName"),
    ("placeName", "./temp/mentioned-places.xml", ".//tei:placeName"),
    ("orgName", "./temp/mentioned-orgs.xml", ".//tei:orgName"),
    ("work", "./temp/mentioned-bibl.xml", ".//tei:bibl/tei:title")
]

# XML einlesen
tree = ET.parse("./data/editions/listevent.xml")
root = tree.getroot()

# Hilfsfunktion: XML schön formatieren
def pretty_xml(element):
    rough_string = ET.tostring(element, encoding='utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")

# Sets für spätere Verwendung
mentioned_person_keys = set()
work_ids = set()

# Verarbeitung der listevent.xml
for tag_name, output_filename, xpath in targets:
    keys = set()

    for elem in root.findall(xpath, namespaces=NS):
        key = elem.get("key")
        if key and key.startswith("pmb"):
            clean_id = key.replace("pmb", "", 1)
            keys.add(clean_id)
            if tag_name == "persName":
                mentioned_person_keys.add(clean_id)
            elif tag_name == "work":
                work_ids.add(clean_id)

    # XML-Struktur erzeugen
    list_elem = ET.Element("list")
    for key in sorted(keys):
        item = ET.SubElement(list_elem, "item")
        item.text = key

    # Ausgabe als formatiertes XML
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(pretty_xml(list_elem))

# ===== Autoren der Werke aus listbibl.xml nachschlagen =====
# Autoren der Werke aus listbibl.xml nachschlagen
response = urllib.request.urlopen("https://pmb.acdh.oeaw.ac.at/media/listbibl.xml")
listbibl_tree = ET.parse(response)
listbibl_root = listbibl_tree.getroot()

# Vergleichs-Set für listbibl Keys im Format: "work__195468"
work_keys_in_listbibl = {f"work__{wid}" for wid in work_ids}

for bibl in listbibl_root.findall(".//tei:bibl", namespaces=NS):
    bibl_key = bibl.get("{http://www.w3.org/XML/1998/namespace}id")  # xml:id beachten!
    if bibl_key in work_keys_in_listbibl:
        for author in bibl.findall(".//tei:author", namespaces=NS):
            author_key = author.get("key")
            if author_key and author_key.startswith("person__"):
                author_id = author_key.replace("person__", "")
                mentioned_person_keys.add(author_id)

# Neue mentioned-persons.xml mit Autoren schreiben
person_list_elem = ET.Element("list")
for key in sorted(mentioned_person_keys):
    item = ET.SubElement(person_list_elem, "item")
    item.text = key

with open("./temp/mentioned-persons.xml", "w", encoding="utf-8") as f:
    f.write(pretty_xml(person_list_elem))
