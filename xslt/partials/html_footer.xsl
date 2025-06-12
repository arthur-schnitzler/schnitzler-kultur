<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="#all" version="2.0">
    <xsl:template match="/" name="html_footer">
        <div class="wrapper hide-reading" id="wrapper-footer-full">
            <div class="container" id="footer-full-content" tabindex="-1">
                <div class="footer-separator text-center"> KONTAKT </div>
                <div class="row text-center justify-content-center">
                    <!-- Logo -->
                    <div class="footer-widget col-lg-4 col-md-6 mb-4">
                        <div class="textwidget custom-html-widget">
                            <a href="https://www.oeaw.ac.at/acdh/">
                                <img
                                    src="https://fundament.acdh.oeaw.ac.at/common-assets/images/acdh_logo.svg"
                                    class="image" alt="ACDH Logo"
                                    style="max-width: 70%; height: auto;" title="ACDH Logo"/>
                            </a>
                        </div>
                    </div>
                    
                    <!-- Adresse & Kontakt -->
                    <div class="footer-widget col-lg-4 col-md-6 mb-4">
                        <div class="textwidget custom-html-widget">
                            <p>
                                <strong>ACDH-CH</strong><br/>
                                Austrian Centre for Digital Humanities <br/>
                                and Cultural Heritage<br/>
                                Österreichische Akademie der Wissenschaften
                            </p>
                            <p>
                                Bäckerstraße 13<br/>
                                1010 Wien
                            </p>
                            <p>
                                T: +43 1 51581-2200<br/>
                                E: <a href="mailto:acdh-ch-helpdesk@oeaw.ac.at">acdh-ch-helpdesk(at)oeaw.ac.at</a>
                            </p>
                        </div>
                    </div>
                    
                    <!-- Ansprechpartner & GitHub -->
                    <div class="footer-widget col-lg-4 col-md-12 mb-4">
                        <div class="textwidget custom-html-widget">
                            <h6 class="font-weight-bold">KONTAKT</h6>
                            <p>Bei Fragen, Anmerkungen, Kritik, aber gerne auch Lob, kontaktieren Sie bitte Martin Anton Müller.</p>
                            <p>
                                <a class="helpdesk-button" href="mailto:martin.anton.mueller@encore.at">e-Mail</a>
                            </p>
                            <p>
                                <a id="github-logo" title="GitHub" href="{$github_url}" target="_blank">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                        <path d="..."/>
                                    </svg>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Footer bar -->
        <div class="footer-imprint-bar hide-reading" id="wrapper-footer-secondary"
            style="text-align:center; padding:0.4rem 0; font-size: 0.9rem;">
            © Copyright OEAW | <a href="imprint.html">Impressum</a>
        </div>
        
        <script src="js/listStopProp.js"/>
        <script src="https://code.jquery.com/jquery-3.6.3.min.js"
            integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"/>
    </xsl:template>
    
</xsl:stylesheet>
