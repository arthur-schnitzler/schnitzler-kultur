<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" version="2.0" exclude-result-prefixes="xsl tei xs">
    <xsl:output encoding="UTF-8" media-type="text/html" method="xhtml" version="1.0" indent="yes"
        omit-xml-declaration="yes"/>

    <xsl:import href="./partials/html_navbar.xsl"/>
    <xsl:import href="./partials/html_head.xsl"/>
    <xsl:import href="./partials/html_footer.xsl"/>
    
    <xsl:template match="/">
        <xsl:variable name="doc_title">
            <xsl:text>Kalender</xsl:text>
        </xsl:variable>
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE html&gt;</xsl:text>
        <html lang="de">
            <xsl:call-template name="html_head">
                <xsl:with-param name="html_title" select="$doc_title"/>
                <xsl:with-param name="page_url" select="'kalender.html'"/>
            </xsl:call-template>
            <body class="page">
                <div class="hfeed site" id="page">
                    <xsl:call-template name="nav_bar"/>

                    <div class="container">
                        <header class="page-head">
                            <p class="page-kicker">Veranstaltungen</p>
                            <h1>Kalender</h1>
                            <p class="page-sub">
                                <a href="#" data-bs-toggle="modal" data-bs-target="#calendarModal"
                                    >Über diese Ansicht</a>
                                <xsl:text> · </xsl:text>
                                <a href="js-data/calendarData.js">Kalenderdaten (JS) ↓</a>
                            </p>
                        </header>
                        <div>
                            <div>
                                <div class="row">
                                    <div class="col-lg-2 col-md-3 col-sm-12 yearscol">
                                        <div class="row justify-content-md-center" id="years-table"></div>
                                    </div>
                                    <div class="col-lg-10 col-md-9 col-sm-12">
                                        <div id="calendar-container"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Event Popup Modal - Bootstrap 5 optimized -->
                    <div class="modal fade" id="eventPopup" tabindex="-1" aria-labelledby="eventPopupTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="eventPopupTitle">Ereignisse</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schließen" onclick="closeEventModal()"></button>
                                </div>
                                <div class="modal-body p-0" id="eventPopupBody">
                                    <!-- Events will be inserted here dynamically -->
                                    <div class="text-center p-4">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">Lädt...</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="closeEventModal()">Schließen</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Info Modal -->
                    <div class="modal fade" id="calendarModal" tabindex="-1" aria-labelledby="calendarModalTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="calendarModalTitle">Kalender</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schließen"></button>
                                </div>
                                <div class="modal-body">
                                    <p class="lead">Dieser Kalender zeigt Arthur Schnitzlers kulturelle Aktivitäten in verschiedenen übersichtlichen Ansichten.</p>
                                    <h6 class="fw-bold">Ansichten:</h6>
                                    <ul class="list-unstyled">
                                        <li><i class="bi bi-calendar3 text-primary"></i> <strong>Jahr:</strong> Kompakte Übersicht aller 12 Monate</li>
                                        <li><i class="bi bi-calendar-month text-success"></i> <strong>Monat:</strong> Detaillierte Monatsansicht mit Event-Namen</li>
                                        <li><i class="bi bi-calendar-week text-info"></i> <strong>Woche:</strong> Wochenansicht mit vollständigen Event-Details</li>
                                    </ul>
                                    <h6 class="fw-bold">Funktionen:</h6>
                                    <ul>
                                        <li>Farbkodierte Ereignistypen (Theater, Musik, Film, etc.)</li>
                                        <li>Interaktive Filterung nach Kategorien</li>
                                        <li>Responsive Design für alle Geräte</li>
                                        <li>Schnelle Navigation zwischen Zeitperioden</li>
                                        <li>Detaillierte Event-Informationen per Klick</li>
                                    </ul>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Schließen</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Load calendar data and initialize -->
                    <script src="js-data/calendarData.js"></script>
                    <script src="js/calendar.js"></script>
                    
                    <script src="js/calendar-init.js"></script>
                    
                    <xsl:call-template name="html_footer"/>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>