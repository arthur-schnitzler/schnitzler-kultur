<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:tei="http://www.tei-c.org/ns/1.0" exclude-result-prefixes="#all" version="2.0">
    <xsl:template match="/" name="html_footer">
        <xsl:variable name="footer-eventcount"
            select="count(document('../../data/editions/listevent.xml')//tei:body/tei:listEvent/tei:event)"/>
        <footer class="site-footer hide-reading">
            <div class="site-footer-inner">
                <div class="site-footer-col">
                    <p class="site-footer-title">Arthur Schnitzler:
                        Kulturveranstaltungen</p>
                    <p>
                        <xsl:value-of
                            select="format-number($footer-eventcount, '#.###', 'footer-european')"/>
                        <xsl:text> Ereignisse aus den Jahren 1876–1931: Konzert-, Theater- und
                            Kinobesuche, Lesungen, Proben und weitere
                            Veranstaltungsteilnahmen.</xsl:text>
                    </p>
                    <p>Herausgegeben von Martin Anton Müller und Laura Untner, unter
                        Mitarbeit von Katharina Sophie Kühnel.</p>
                </div>
                <div class="site-footer-col">
                    <p class="site-footer-title">ACDH-CH</p>
                    <p>Austrian Centre for Digital Humanities and Cultural
                        Heritage<br/>Österreichische Akademie der
                        Wissenschaften<br/>Bäckerstraße 13<br/>1010 Wien</p>
                    <p>T: +43 1 51581-2200<br/>E: <a
                            href="mailto:acdh-helpdesk@oeaw.ac.at"
                            >acdh-helpdesk(at)oeaw.ac.at</a></p>
                </div>
                <div class="site-footer-col">
                    <p class="site-footer-title">Kontakt</p>
                    <ul class="site-footer-links">
                        <li>
                            <a href="mailto:martin.anton.mueller@encore.at">E-Mail an die
                                Herausgeber</a>
                        </li>
                        <li>
                            <a href="{$github_url}" target="_blank">GitHub</a>
                        </li>
                        <li>
                            <a href="imprint.html">Impressum</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="site-footer-bar">
                <xsl:text>© ÖAW · CC BY 4.0</xsl:text>
            </div>
        </footer>
        <script src="js/listStopProp.js"/>
        <script src="https://code.jquery.com/jquery-3.6.3.min.js"
            integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"/>
    </xsl:template>

    <xsl:decimal-format name="footer-european" grouping-separator="." decimal-separator=","/>
</xsl:stylesheet>
