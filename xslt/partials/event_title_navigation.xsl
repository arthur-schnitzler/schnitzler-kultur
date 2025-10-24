<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xsl tei xs" version="2.0">

    <!-- Navigation für Event-Seiten: Blättern zwischen Events in chronologischer Reihenfolge -->

    <xsl:template name="event-header-nav">
        <xsl:param name="current-id" as="xs:string"/>
        <xsl:param name="all-events" as="node()*"/>

        <xsl:variable name="current-position" select="count($all-events[@xml:id = $current-id]/preceding-sibling::tei:event) + 1"/>
        <xsl:variable name="previous-event" select="$all-events[$current-position - 1]"/>
        <xsl:variable name="next-event" select="$all-events[$current-position + 1]"/>

        <div class="row" id="title-nav">
            <div class="col-md-2 col-lg-2 col-sm-12">
                <xsl:if test="$previous-event">
                    <h1>
                        <a class="text-decoration-none" style="color: #6B4C5A;">
                            <xsl:attribute name="href">
                                <xsl:value-of select="concat($previous-event/@xml:id, '.html')"/>
                            </xsl:attribute>
                            <xsl:attribute name="title">
                                <xsl:value-of select="normalize-space($previous-event/tei:eventName)"/>
                            </xsl:attribute>
                            <i class="bi bi-chevron-left" style="font-size: 1.5rem;"/>
                        </a>
                    </h1>
                </xsl:if>
            </div>
            <div class="col-md-8">
                <h1 class="text-center">
                    <xsl:value-of select="normalize-space($all-events[@xml:id = $current-id]/tei:eventName)"/>
                </h1>
            </div>
            <div class="col-md-2 col-lg-2 col-sm-12 text-end">
                <xsl:if test="$next-event">
                    <h1>
                        <a class="text-decoration-none" style="color: #6B4C5A;">
                            <xsl:attribute name="href">
                                <xsl:value-of select="concat($next-event/@xml:id, '.html')"/>
                            </xsl:attribute>
                            <xsl:attribute name="title">
                                <xsl:value-of select="normalize-space($next-event/tei:eventName)"/>
                            </xsl:attribute>
                            <i class="bi bi-chevron-right" style="font-size: 1.5rem;"/>
                        </a>
                    </h1>
                </xsl:if>
            </div>
        </div>
    </xsl:template>

</xsl:stylesheet>
