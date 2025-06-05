<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:math="http://www.w3.org/2005/xpath-functions/math"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xsl tei xs math"
    version="3.0">
    
    <xsl:output method="xml"/>
    <xsl:mode on-no-match="shallow-copy"/>
    
    <!-- Diese Datei macht ein paar kleine Änderungen aus dem Standardexport von
    listevent von der Website der PMB. Vor allem: Alle Ereignisse von Arthur Schnitzler
    werden entfernt -->
    
    <xsl:template match="tei:event[not(tei:listPerson/tei:person/tei:persName/@key='pmb2121')]"/>
    
    <xsl:template match="tei:event/@xml:id[starts-with(., 'event__')]">
        <xsl:attribute name="xml:id">
            <xsl:value-of select="replace(., 'event__', 'pmb')"/>
        </xsl:attribute>
    </xsl:template>
    
    
</xsl:stylesheet>