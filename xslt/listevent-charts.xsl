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
        
                
                <!-- Event-Arten -->
                <div class="mb-5">
                    <h2>Häufigste Veranstaltungsarten</h2>
                    <canvas id="chartTypes" height="100"></canvas>
                </div>
                
                <!-- Personen -->
                <div class="mb-5">
                    <h2>Häufigste Teilnehmer:innen</h2>
                    <canvas id="chartPeople" height="100"></canvas>
                </div>
                
                <!-- Orte -->
                <div class="mb-5">
                    <h2>Häufigste Orte</h2>
                    <canvas id="chartPlaces" height="100"></canvas>
                </div>
                
                        <script>
                            // Hilfsfunktion: Zufällig viele gut unterscheidbare Farben generieren
                            function generateColors(count) {
                            const colors = [];
                            for (let i = 0; i &lt; count; i++) {
                            const hue = (i * 137.508) % 360; // goldener Winkel für gleichmäßige Verteilung
                            colors.push(`hsl(${hue}, 65%, 60%)`);
                            }
                            return colors;
                            }
                            
                            // Veranstaltungsarten (alle, dynamisch gefärbt)
                            const eventTypes = {
                            labels: [<xsl:call-template name="labels">
                            <xsl:with-param name="xpath" select="//tei:event/tei:eventName/@n"/>
                            </xsl:call-template>],
                            data: [<xsl:call-template name="counts">
                                <xsl:with-param name="xpath" select="//tei:event/tei:eventName/@n"/>
                            </xsl:call-template>]
                            };
                            eventTypes.backgroundColors = generateColors(eventTypes.labels.length);
                            
                            new Chart(document.getElementById("chartTypes"), {
                            type: 'pie',
                            data: {
                            labels: eventTypes.labels,
                            datasets: [{
                            data: eventTypes.data,
                            backgroundColor: eventTypes.backgroundColors
                            }]
                            },
                            options: {
                            responsive: true,
                            plugins: {
                            legend: { position: 'right' },
                            title: { display: true, text: 'Veranstaltungsarten' }
                            }
                            }
                            });
                            
                            // Personen (ohne bestimmte ID)
                            const eventPeople = {
                            labels: [<xsl:call-template name="labels">
                                <xsl:with-param name="xpath" select="//tei:event//tei:persName[not(@key='pmb2121')]/@key"/>
                            </xsl:call-template>],
                            data: [<xsl:call-template name="counts">
                                <xsl:with-param name="xpath" select="//tei:event//tei:persName[not(@key='pmb2121')]/@key"/>
                            </xsl:call-template>]
                            };
                            
                            // Orte
                            const eventPlaces = {
                            labels: [<xsl:call-template name="labels">
                                <xsl:with-param name="xpath" select="//tei:event//tei:placeName/@key"/>
                            </xsl:call-template>],
                            data: [<xsl:call-template name="counts">
                                <xsl:with-param name="xpath" select="//tei:event//tei:placeName/@key"/>
                            </xsl:call-template>]
                            };
                            
                            // Allgemeine Chart-Zeichnung für Balkendiagramme
                            function drawChart(id, chartData, title) {
                            new Chart(document.getElementById(id), {
                            type: 'bar',
                            data: {
                            labels: chartData.labels,
                            datasets: [{
                            label: title,
                            data: chartData.data,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                            }]
                            },
                            options: {
                            responsive: true,
                            plugins: {
                            legend: { display: false },
                            title: { display: true, text: title }
                            },
                            scales: {
                            y: {
                            beginAtZero: true,
                            ticks: { precision: 0 }
                            }
                            }
                            }
                            });
                            }
                            
                            drawChart("chartPeople", eventPeople, "Teilnehmer:innen");
                            drawChart("chartPlaces", eventPlaces, "Orte");
                        </script>
                        
                    </div></main>
            </body>
        </html>
    </xsl:template>
    
    <!-- Label-Generator -->
    <xsl:template name="labels">
        <xsl:param name="xpath"/>
        <xsl:for-each-group select="$xpath" group-by=".">
            <xsl:sort select="count(current-group())" order="descending"/>
            "<xsl:value-of select="."/>"<xsl:if test="position() ne last()">,</xsl:if>
        </xsl:for-each-group>
    </xsl:template>
    
    <!-- Count-Generator -->
    <xsl:template name="counts">
        <xsl:param name="xpath"/>
        <xsl:for-each-group select="$xpath" group-by=".">
            <xsl:sort select="count(current-group())" order="descending"/>
            <xsl:value-of select="count(current-group())"/><xsl:if test="position() ne last()">,</xsl:if>
        </xsl:for-each-group>
    </xsl:template>
    
</xsl:stylesheet>
