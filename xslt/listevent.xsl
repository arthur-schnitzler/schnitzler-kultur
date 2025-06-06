<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    version="2.0" exclude-result-prefixes="xsl tei xs">
    
    <xsl:output encoding="UTF-8" media-type="text/html" method="html" version="5.0" indent="yes" omit-xml-declaration="yes"/>

    <xsl:import href="./partials/html_navbar.xsl"/>
    <xsl:import href="./partials/html_head.xsl"/>
    <xsl:import href="./partials/html_footer.xsl"/>
    <xsl:import href="./partials/event.xsl"/>
    <xsl:import href="./partials/blockquote.xsl"/>
    <xsl:import href="./partials/tabulator_js.xsl"/>
    <xsl:template match="/">
        <xsl:variable name="doc_title">
            <xsl:value-of select=".//tei:titleStmt/tei:title[1]/text()"/>
        </xsl:variable>
        <html class="h-100" lang="{$default_lang}">
            
            <head>
                <xsl:call-template name="html_head">
                    <xsl:with-param name="html_title" select="$doc_title"></xsl:with-param>
                </xsl:call-template>
                <link href="vendor/tabulator-tables/css/tabulator_bootstrap5.min.css" rel="stylesheet"/>
            </head>
            
            <body class="d-flex flex-column h-100">
                <xsl:call-template name="nav_bar"/>
                <main class="flex-shrink-0 flex-grow-1">
                    <div class="container">
                        <h1><xsl:value-of select="$doc_title"/></h1>
                        <div class="text-center p-1"><span id="counter1"></span> von <span id="counter2"></span> Ereignissen</div>
                        <table class="table table-sm display" id="tabulator-table-event">
                            <thead>
                                <tr>
                                    <th scope="col" tabulator-headerFilter="input"
                                        tabulator-formatter="html">Ereignis</th>
                                    <th scope="col" tabulator-headerFilter="input"
                                        tabulator-formatter="html">Arbeitskraft</th>
                                    <th scope="col" tabulator-headerFilter="input"
                                        tabulator-formatter="html">Teilnehmer_innen</th>
                                    <th scope="col" tabulator-headerFilter="input"
                                        tabulator-formatter="html">Werk</th>
                                    <th scope="col" tabulator-headerFilter="input"
                                        tabulator-formatter="html">Ort</th>
                                    <th scope="col" tabulator-headerFilter="input"
                                        tabulator-formatter="html">Organisation</th>
                                    <th scope="col" tabulator-headerFilter="input"
                                        tabulator-formatter="html">Datum</th>
                                    <th scope="col" tabulator-headerFilter="input"
                                        tabulator-formatter="html">Link</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                <xsl:for-each select=".//tei:event[@xml:id]">
                                    <xsl:variable name="id">
                                        <xsl:value-of select="data(@xml:id)"/>
                                    </xsl:variable>
                                    <tr>
                                        <td>
                                            <xsl:value-of select="./tei:eventName[1]/text()"/>
                                        </td>
                                        <td>
                                            <xsl:for-each select="tei:listPerson/tei:person[@role='hat als Arbeitskraft']">
                                                <xsl:variable name="name" select="tei:persName"/>
                                                
                                                <xsl:choose>
                                                    <!-- Wenn genau ein Komma enthalten ist -->
                                                    <xsl:when test="matches($name, '^[^,]+,\s*[^,]+$')">
                                                        <xsl:analyze-string select="$name" regex="^([^,]+),\s*(.+)$">
                                                            <xsl:matching-substring>
                                                                <xsl:value-of select="regex-group(2)"/><xsl:text> </xsl:text><xsl:value-of select="regex-group(1)"/>
                                                            </xsl:matching-substring>
                                                            <xsl:non-matching-substring>
                                                                <xsl:value-of select="."/>
                                                            </xsl:non-matching-substring>
                                                        </xsl:analyze-string>
                                                    </xsl:when>
                                                    
                                                    <!-- Wenn kein oder mehr als ein Komma enthalten ist -->
                                                    <xsl:otherwise>
                                                        <xsl:value-of select="$name"/>
                                                    </xsl:otherwise>
                                                </xsl:choose>
                                                
                                                <!-- Semikolon nur, wenn nicht letztes Element -->
                                                <xsl:if test="not(position() = last())">
                                                    <xsl:text>; </xsl:text>
                                                </xsl:if>
                                            </xsl:for-each>
                                        </td>
                                        <td>
                                            <xsl:for-each select="tei:listPerson/tei:person[@role='hat als Teilnehmer:in']">
                                                <xsl:variable name="name" select="tei:persName"/>
                                                
                                                <xsl:choose>
                                                    <!-- Wenn genau ein Komma enthalten ist -->
                                                    <xsl:when test="matches($name, '^[^,]+,\s*[^,]+$')">
                                                        <xsl:analyze-string select="$name" regex="^([^,]+),\s*(.+)$">
                                                            <xsl:matching-substring>
                                                                <xsl:value-of select="regex-group(2)"/><xsl:text> </xsl:text><xsl:value-of select="regex-group(1)"/>
                                                            </xsl:matching-substring>
                                                            <xsl:non-matching-substring>
                                                                <xsl:value-of select="."/>
                                                            </xsl:non-matching-substring>
                                                        </xsl:analyze-string>
                                                    </xsl:when>
                                                    
                                                    <!-- Wenn kein oder mehr als ein Komma enthalten ist -->
                                                    <xsl:otherwise>
                                                        <xsl:value-of select="$name"/>
                                                    </xsl:otherwise>
                                                </xsl:choose>
                                                
                                                <!-- Semikolon nur, wenn nicht letztes Element -->
                                                <xsl:if test="not(position() = last())">
                                                    <xsl:text>; </xsl:text>
                                                </xsl:if>
                                            </xsl:for-each>
                                        </td>
                                        
                                        <td>
                                            <xsl:for-each select="tei:listBibl/tei:bibl[not(tei:note[contains(., 'rezensi')]) and normalize-space(tei:title)]">
                                                <xsl:value-of select="normalize-space(tei:title)"/>
                                                <xsl:if test="not(position()=last())">
                                                    <xsl:text>; </xsl:text>
                                                </xsl:if>
                                            </xsl:for-each>
                                        </td>
                                        <td>
                                            <xsl:for-each select="tei:listPlace/tei:place">
                                                <xsl:value-of select="tei:placeName"/>
                                                <xsl:if test="not(position()=last())">
                                                    <xsl:text>; </xsl:text>
                                                </xsl:if>
                                            </xsl:for-each>
                                        </td>
                                        <td>
                                            <xsl:for-each select="tei:note[@type='listorg']/tei:listOrg/tei:org">
                                                <xsl:value-of select="tei:orgName"/>
                                                <xsl:if test="not(position()=last())">
                                                    <xsl:text>; </xsl:text>
                                                </xsl:if>
                                            </xsl:for-each>
                                        </td>
                                        <td>
                                            <xsl:value-of select="@when-iso"/>
                                        </td>
                                        <td>
                                            <a>
                                                <xsl:attribute name="href">
                                                    <xsl:value-of select="concat($id, '.html')"/>
                                                </xsl:attribute>
                                                <xsl:value-of select="$id"/>
                                            </a>

                                            
                                        </td>
                                    </tr>
                                </xsl:for-each>
                            </tbody>
                        </table>
                        <xsl:call-template name="tabulator_dl_buttons"/>
                        <div class="text-center p-4">
                            <xsl:call-template name="blockquote">
                                <xsl:with-param name="pageId" select="'listevent.html'"/>
                            </xsl:call-template>
                        </div>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
                <xsl:call-template name="tabulator_event_js"/>
                
            </body>
        </html>
        <xsl:for-each select=".//tei:place[@xml:id]">
            <xsl:variable name="filename" select="concat(./@xml:id, '.html')"/>
            <xsl:variable name="name" select="normalize-space(string-join(./tei:placeName[1]//text()))"></xsl:variable>
            <xsl:result-document href="{$filename}">
                <html class="h-100" lang="{$default_lang}">
                    <head>
                        <xsl:call-template name="html_head">
                            <xsl:with-param name="html_title" select="$name"></xsl:with-param>
                        </xsl:call-template>
                    </head>

                    <body class="d-flex flex-column h-100">
                        <xsl:call-template name="nav_bar"/>
                        <main class="flex-shrink-0 flex-grow-1">
                            <div class="container">
                                <h1>
                                    <xsl:value-of select="$name"/>
                                </h1>
                                <xsl:call-template name="place_detail"/>
                                <xsl:if test="./tei:location/tei:geo">
                                    <div id="map_detail"/>
                                </xsl:if>
                                <div class="text-center p-4">
                                    <xsl:call-template name="blockquote">
                                        <xsl:with-param name="pageId" select="$filename"/>
                                    </xsl:call-template>
                                </div>
                            </div>
                        </main>
                        <xsl:call-template name="html_footer"/>
                        <xsl:if test="./tei:location/tei:geo">
                            <link rel="stylesheet" href="vendor/leaflet/leaflet.css"/>
                            <script src="vendor/leaflet/leaflet.js"></script>
                            <script>
                                var lat = <xsl:value-of select="replace(tokenize(./tei:location[1]/tei:geo[1]/text(), ' ')[1], ',', '.')"/>;
                                var long = <xsl:value-of select="replace(tokenize(./tei:location[1]/tei:geo[1]/text(), ' ')[2], ',', '.')"/>;
                                $("#map_detail").css("height", "500px");
                                var map = L.map('map_detail').setView([Number(lat), Number(long)], 13);
                                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                maxZoom: 19,
                                attribution: '&amp;copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                }).addTo(map);
                                var marker = L.marker([Number(lat), Number(long)]).addTo(map);
                            </script>
                        </xsl:if>
                    </body>
                </html>
            </xsl:result-document>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>