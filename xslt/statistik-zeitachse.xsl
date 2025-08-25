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
            <xsl:value-of select="//tei:TEI[1]/tei:fileDesc[1]/tei:titleStmt[1]/tei:title[1]/text()"/>
        </xsl:variable>
        <html class="h-100" lang="{$default_lang}">
            <head>
                <xsl:call-template name="html_head">
                    <xsl:with-param name="html_title" select="'Zeitachsen-Statistik'"/>
                </xsl:call-template>
                <link href="vendor/tabulator-tables/css/tabulator_bootstrap5.min.css"
                    rel="stylesheet"/>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"/>
                <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
            </head>
            <body class="d-flex flex-column h-100">
                <xsl:call-template name="nav_bar"/>
                <main class="flex-shrink-0 flex-grow-1">
                    <div class="container">
                        <h1>Zeitachsen-Statistik</h1>
                        <div class="mb-4 mx-auto" style="max-width: 1200px;">
                            <p>Diese Statistik zeigt die zeitliche Entwicklung verschiedener Ereignistypen über die gesamte erfasste Zeitspanne von 1876 bis 1931. 
                            Sie können einen oder mehrere Ereignistypen auswählen, um deren Verlauf über die Zeit zu vergleichen.</p>
                            <p>Wählen Sie die Ereignistypen aus, die Sie visualisieren möchten. Die verschiedenen Typen werden in unterschiedlichen Farben dargestellt, 
                            so dass Sie die Entwicklungen und Trends über Schnitzlers gesamte dokumentierte Zeit verfolgen können.</p>
                        </div>
                        
                        <div class="row">
                            <div class="col-lg-3 col-md-4">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="mb-0">Ereignistypen auswählen</h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="mb-3">
                                            <button type="button" class="btn btn-sm btn-outline-primary me-2" id="selectAllBtn">Alle auswählen</button>
                                            <button type="button" class="btn btn-sm btn-outline-secondary" id="deselectAllBtn">Alle abwählen</button>
                                        </div>
                                        <div id="eventTypeCheckboxes">
                                            <!-- Event type checkboxes will be inserted here by JavaScript -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-9 col-md-8">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="mb-0">Ereignisse über Zeit (1876-1931)</h5>
                                    </div>
                                    <div class="card-body">
                                        <div style="position: relative; height: 500px;">
                                            <canvas id="timelineChart" style="width: 100%; height: 100%;"></canvas>
                                        </div>
                                        <div class="mt-3">
                                            <small class="text-muted">
                                                Bewegen Sie die Maus über die Balken, um detaillierte Informationen zu erhalten.
                                                Die X-Achse zeigt die Jahre von 1876 bis 1931, die Y-Achse die Anzahl der Ereignisse.
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
            </body>
            <script src="./js-data/calendarData.js"></script>
            <script src="./js/timeline-statistics.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" defer='true'></script>
        </html>
    </xsl:template>

    
</xsl:stylesheet>