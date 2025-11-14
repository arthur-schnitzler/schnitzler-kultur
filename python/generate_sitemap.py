#!/usr/bin/env python3
"""
Generate sitemap.xml for schnitzler-kultur project.
Scans the html/ directory for all HTML files and creates a sitemap.xml.
"""

import os
from datetime import datetime
from pathlib import Path
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom

# Configuration
BASE_URL = "https://arthur-schnitzler.github.io/schnitzler-kultur/"
HTML_DIR = "html"
OUTPUT_FILE = "html/sitemap.xml"

# Priority and change frequency settings
PRIORITY_MAP = {
    "index.html": ("1.0", "weekly"),
    "listevent.html": ("0.9", "daily"),
    "kalender.html": ("0.9", "weekly"),
    "simple-kalender.html": ("0.8", "weekly"),
    "statistik.html": ("0.8", "weekly"),
    "statistik-zeitachse.html": ("0.8", "weekly"),
    "listperson.html": ("0.7", "monthly"),
    "listplace.html": ("0.7", "monthly"),
    "listorg.html": ("0.7", "monthly"),
    "listbibl.html": ("0.7", "monthly"),
    "ueber-das-projekt.html": ("0.6", "monthly"),
    "faqs.html": ("0.5", "monthly"),
    "imprint.html": ("0.3", "yearly"),
    "404.html": ("0.1", "yearly"),
}

DEFAULT_PRIORITY = "0.5"
DEFAULT_CHANGEFREQ = "monthly"


def get_last_modified(file_path):
    """Get last modified time of a file."""
    try:
        timestamp = os.path.getmtime(file_path)
        return datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d")
    except:
        return datetime.now().strftime("%Y-%m-%d")


def should_include(filename, path):
    """Determine if a file should be included in sitemap."""
    # Skip files in certain directories
    skip_dirs = ["css", "js", "js-data", "images", "vendor", "xml-view"]

    for skip_dir in skip_dirs:
        if f"/{skip_dir}/" in path or path.startswith(f"{skip_dir}/"):
            return False

    # Only include .html files
    if not filename.endswith(".html"):
        return False

    return True


def create_sitemap():
    """Generate sitemap.xml from HTML files."""
    # Create root element
    urlset = Element("urlset")
    urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")

    html_path = Path(HTML_DIR)

    # Collect all HTML files
    html_files = []
    for root, dirs, files in os.walk(html_path):
        for file in files:
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, html_path)

            if should_include(file, rel_path):
                html_files.append((file, rel_path, file_path))

    # Sort files for consistent output (index.html first, then alphabetically)
    html_files.sort(key=lambda x: (x[0] != "index.html", x[1]))

    # Create URL entries
    for filename, rel_path, file_path in html_files:
        url = SubElement(urlset, "url")

        # Create URL location
        loc = SubElement(url, "loc")
        url_path = rel_path.replace("\\", "/")  # Windows compatibility
        loc.text = BASE_URL + url_path

        # Add last modified date
        lastmod = SubElement(url, "lastmod")
        lastmod.text = get_last_modified(file_path)

        # Add change frequency and priority
        priority, changefreq = PRIORITY_MAP.get(filename, (DEFAULT_PRIORITY, DEFAULT_CHANGEFREQ))

        changefreq_elem = SubElement(url, "changefreq")
        changefreq_elem.text = changefreq

        priority_elem = SubElement(url, "priority")
        priority_elem.text = priority

    # Pretty print XML
    xml_str = minidom.parseString(tostring(urlset, encoding="utf-8")).toprettyxml(
        indent="  ", encoding="utf-8"
    )

    # Write to file
    with open(OUTPUT_FILE, "wb") as f:
        f.write(xml_str)

    print(f"✓ Sitemap generated: {OUTPUT_FILE}")
    print(f"✓ Total URLs: {len(html_files)}")


if __name__ == "__main__":
    create_sitemap()
