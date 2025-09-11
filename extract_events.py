#!/usr/bin/env python3
import xml.etree.ElementTree as ET
import csv

def extract_events_to_csv():
    # Parse the XML file
    tree = ET.parse('data/editions/listevent.xml')
    root = tree.getroot()
    
    # Define TEI namespace
    ns = {'tei': 'http://www.tei-c.org/ns/1.0'}
    
    # Find all event elements
    events = root.findall('.//tei:event', ns)
    
    # Create CSV file
    with open('events.csv', 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        
        # Write header
        writer.writerow(['xml_id', 'url'])
        
        # Extract data for each event
        for event in events:
            xml_id = event.get('{http://www.w3.org/XML/1998/namespace}id')
            if xml_id:
                url = f"https://www.schnitzler-kultur.acdh.oeaw.ac.at/{xml_id}.html"
                writer.writerow([xml_id, url])
    
    print(f"CSV file created with {len(events)} events")

if __name__ == "__main__":
    extract_events_to_csv()