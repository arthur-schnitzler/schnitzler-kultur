<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    version="2.0" exclude-result-prefixes="xsl tei xs">
    <xsl:output encoding="UTF-8" media-type="text/html" method="html" version="5.0" indent="yes"
        omit-xml-declaration="yes"/>
    <xsl:import href="./partials/html_navbar.xsl"/>
    <xsl:import href="./partials/html_head.xsl"/>
    <xsl:import href="./partials/html_footer.xsl"/>
    <!-- Haupttemplate -->
    <xsl:template match="/">
        <xsl:variable name="doc_title">
            <xsl:value-of select="//tei:TEI[1]/tei:fileDesc[1]/tei:titleStmt[1]/tei:title[1]/text()"
            />
        </xsl:variable>
        <html class="h-100" lang="{$default_lang}">
            <head>
                <xsl:call-template name="html_head">
                    <xsl:with-param name="html_title" select="'Statistiken'"/>
                    <xsl:with-param name="page_url" select="'statistik.html'"/>
                </xsl:call-template>
                <link href="vendor/tabulator-tables/css/tabulator_bootstrap5.min.css"
                    rel="stylesheet"/>
                <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"/>
            </head>
            <body class="d-flex flex-column h-100">
                <xsl:call-template name="nav_bar"/>
                <main class="flex-shrink-0 flex-grow-1">
                    <div class="container">
                        <h1>
                            <xsl:text>Statistiken</xsl:text>
                        </h1>
                        <div class="mb-4 mx-auto" style="max-width: 800px;">
                            <p>Auf dieser Seite finden sich die Arten von Veranstaltungen, die
                                Arthur Schnitzler besuchte, in sechs Kategorien (»Theater«, »Musik«,
                                »Film«, »Vortrag«, »anderes« und »Privatveranstaltung«) eingeteilt
                                und zueinander in Verhältnis gesetzt. In Folge werden dann die
                                Kategorien einzeln aufgeschlüsselt. </p>
                            <p>Die Unterscheidung, ob eine Veranstaltung privaten oder öffentlichen Charakter hatte,
                                wird stärker gewichtet als ihr Inhalt. Das heißt, dass die
                                Kategorien »Theater«, »Musik«, »Film«, »Vortrag« und »anderes« nur
                                öffentliche Veranstaltungen bezeichnen, während die Kategorie
                                »Privatveranstaltung« alle Sparten privater Aufführungen, Konzerte
                                etc. umfasst.</p>
                        </div>
                        <div class="mb-4 mx-auto" style="max-width: 800px;">
                            <div class="d-flex align-items-center gap-2 mb-3 d-block mx-auto">
                                <label for="chartTypeToggle" class="mb-0">Kreisdiagramm</label>
                                <div class="form-check form-switch m-0">
                                    <input class="form-check-input" type="checkbox" role="switch"
                                        id="chartTypeToggle"
                                        aria-label="Diagrammtyp wechseln zwischen Kreis- und Balkendiagramm"
                                    />
                                </div>
                                <label for="chartTypeToggle" class="mb-0">Balkendiagramm</label>
                            </div>
                            <label for="yearSelect" class="form-label">Jahr auswählen:</label>
                            <select id="yearSelect" class="form-select w-auto"
                                aria-label="Jahr für die Statistik auswählen">
                                <xsl:for-each select="1876 to 1931">
                                    <option>
                                        <xsl:value-of select="."/>
                                    </option>
                                </xsl:for-each>
                            </select>
                        </div>
                        <h2>Veranstaltungstypen</h2>
                        <canvas id="anaChart" width="400" height="400" class="mb-5 d-block mx-auto"
                            aria-label="Diagramm der Veranstaltungstypen" role="img"/>
                        <div id="anaNChartsContainer">
                            <!-- Hier werden dynamisch die @n-Charts pro @ana eingefügt -->
                        </div>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
            </body>
            <script src="./js/eventtype-charts.js"/>
        </html>
    </xsl:template>
</xsl:stylesheet>
