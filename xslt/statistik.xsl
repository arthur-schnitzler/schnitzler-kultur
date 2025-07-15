<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    version="2.0" exclude-result-prefixes="xsl tei xs">
    <xsl:output encoding="UTF-8" media-type="text/html" method="html" version="5.0" indent="yes"
        omit-xml-declaration="yes"/>
    <xsl:import href="./partials/html_navbar.xsl"/>
    <xsl:import href="./partials/html_head.xsl"/>
    <xsl:import href="./partials/html_footer.xsl"/>
    
    <xsl:output method="html" indent="yes" encoding="UTF-8"/>
    
    <!-- Haupttemplate -->
    <xsl:template match="/">
        <xsl:variable name="doc_title">
            <xsl:value-of select=".//tei:titleStmt/tei:title[1]/text()"/>
        </xsl:variable>
        <html class="h-100" lang="{$default_lang}">
            <head>
                <xsl:call-template name="html_head">
                    <xsl:with-param name="html_title" select="'Statistiken'"/>
                </xsl:call-template>
                <link href="vendor/tabulator-tables/css/tabulator_bootstrap5.min.css"
                    rel="stylesheet"/>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"/>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                
            </head>
            <body class="d-flex flex-column h-100">
                <xsl:call-template name="nav_bar"/>
                <main class="flex-shrink-0 flex-grow-1">
                    <div class="container">
                        <h1>
                            <xsl:text>Statistiken</xsl:text>
                        </h1>
                        <div class="mb-4 mx-auto" style="max-width: 800px;">
                            <p>Auf dieser Seite finden sich die Arten von Veranstaltungen, die Arthur Schnitzler 
                                besuchte, in sechs Kategorien (»Theater«, »Musik«, »Film«, »Vortrag«, »anderes« und »Privatveranstaltung«) eingeteilt und zueinander in Verhältnis gesetzt. In Folge
                                werden dann die Kategorien einzeln aufgeschlüsselt.
                            </p>
                            <p>Die Einordnung, ob eine Veranstaltung öffentlich oder privat war, wird stärker gewichtet als die anderen. Das heißt, dass
                                die ersten fünf Kategorien alle öffentlichen Veranstaltungen umfassen, die letzte aber auch
                            Privataufführungen, private Konzerte etc.</p>
                        </div>
                        
                        <div class="mb-4">
                            <div class="d-flex align-items-center gap-2 mb-3 d-block mx-auto">
                                <label for="chartTypeToggle" class="mb-0">Kreisdiagramm</label>
                                
                                <div class="form-check form-switch m-0">
                                    <input class="form-check-input" type="checkbox" role="switch" id="chartTypeToggle"/>
                                </div>
                                
                                <label for="chartTypeToggle" class="mb-0">Balkendiagramm</label>
                            </div>
                            <label for="yearSelect" class="form-label">Jahr auswählen:</label>
                            <select id="yearSelect" class="form-select w-auto">
                                <xsl:for-each select="1876 to 1931">
                                    <option>
                                        <xsl:value-of select="."/>
                                    </option>
                                </xsl:for-each>
                            </select>
                            
                        </div>
                        
                        <h2>Veranstaltungstypen</h2>
                        <canvas id="anaChart" width="400" height="400" class="mb-5 d-block mx-auto"></canvas>
                        
                        <div id="anaNChartsContainer">
                            <!-- Hier werden dynamisch die @n-Charts pro @ana eingefügt -->
                        </div>
                
                    </div>
                </main>
            </body>
            <script src="./js/eventtype-charts.js"></script>
        </html>
    </xsl:template>

    
</xsl:stylesheet>
