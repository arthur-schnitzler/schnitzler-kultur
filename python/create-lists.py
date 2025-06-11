import xml.etree.ElementTree as ET
from xml.dom import minidom
from urllib.request import urlopen
import os

# TEI Namespace
NS = {'tei': 'http://www.tei-c.org/ns/1.0'}
ET.register_namespace('', NS['tei'])  # saubere Ausgabe

# Zielverzeichnis
output_dir = "./data/indices"
os.makedirs(output_dir, exist_ok=True)

# Hilfsfunktion: schön formatieren
def pretty_xml(elem):
    rough_string = ET.tostring(elem, encoding='utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")

# Konfiguration für jede Entität
entities = [
    {
        "url": "https://pmb.acdh.oeaw.ac.at/media/listperson.xml",
        "local_list": "temp/mentioned-persons.xml",
        "list_tag": "listPerson",
        "item_tag": "person",
        "id_prefix": "person__",
        "output": "listperson.xml"
    },
    {
        "url": "https://pmb.acdh.oeaw.ac.at/media/listplace.xml",
        "local_list": "temp/mentioned-places.xml",
        "list_tag": "listPlace",
        "item_tag": "place",
        "id_prefix": "place__",
        "output": "listplace.xml"
    },
    {
        "url": "https://pmb.acdh.oeaw.ac.at/media/listorg.xml",
        "local_list": "temp/mentioned-orgs.xml",
        "list_tag": "listOrg",
        "item_tag": "org",
        "id_prefix": "org__",
        "output": "listorg.xml"
    },
    {
        "url": "https://pmb.acdh.oeaw.ac.at/media/listbibl.xml",
        "local_list": "temp/mentioned-bibl.xml",
        "list_tag": "listBibl",
        "item_tag": "bibl",
        "id_prefix": "work__",
        "output": "listbibl.xml"
    }
]

# Hauptschleife
for ent in entities:
    print(f"\n🔄 Verarbeite: {ent['output']}")
    
    # 1. XML-Datei aus dem Netz laden
    with urlopen(ent["url"]) as response:
        content = response.read()
    source_tree = ET.ElementTree(ET.fromstring(content))
    source_root = source_tree.getroot()

    # 2. Erwähnte IDs laden
    mentioned_ids = set()
    mentioned_tree = ET.parse(ent["local_list"])
    for item in mentioned_tree.getroot().findall("item"):
        mentioned_ids.add("pmb" + item.text.strip())

    # 3. Entitäten filtern
    container = source_root.find(f".//tei:{ent['list_tag']}", namespaces=NS)
    for item in list(container.findall(f"tei:{ent['item_tag']}", namespaces=NS)):
        old_id = item.attrib.get("{http://www.w3.org/XML/1998/namespace}id", "")
        new_id = old_id.replace(ent["id_prefix"], "pmb")
        item.set("{http://www.w3.org/XML/1998/namespace}id", new_id)

        if new_id not in mentioned_ids:
            container.remove(item)

    # 4. Speichern
    output_path = os.path.join(output_dir, ent["output"])
    print(f"Ziel: {output_path}")
    print(f"Anzahl Elemente: {len(container.findall(f'tei:{ent['item_tag']}', namespaces=NS))}")

    xml_string = pretty_xml(source_root)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(xml_string)
    print(f"✔️ Gespeichert: {ent['output']}")
