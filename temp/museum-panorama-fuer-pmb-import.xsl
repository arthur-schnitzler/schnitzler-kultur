<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs tei"
    version="3.0">
   <xsl:output media-type="text" indent="false"></xsl:output>
    <xsl:mode on-no-match="shallow-skip"/>
    
    <xsl:param name="listevent"
        select="document('../data/editions/listevent.xml')/tei:TEI/tei:text/tei:body/tei:listEvent"/>
    
   <xsl:template match="tei:place">
       <xsl:variable name="current-place" select="@xml:id"/>
       <xsl:for-each select="descendant::tei:event">
           <xsl:variable name="current-date" select="@when"/>
           <xsl:choose>
               <xsl:when test="$listevent/tei:event[@when-iso = $current-date]/tei:listPlace/tei:place/tei:placeName/@key=$current-place"/>
               <xsl:otherwise>
                   <xsl:text>"</xsl:text>
                   <xsl:value-of select="tei:eventName"/>
                   <xsl:text>",</xsl:text>
                   <xsl:value-of select="$current-date"/>
                   <xsl:text>,2121,</xsl:text>
                   <xsl:value-of select="replace($current-place, 'pmb', '')"/>
                   <xsl:text>&#x0A;</xsl:text>
               </xsl:otherwise>
           </xsl:choose>
           
           
           
       </xsl:for-each>
       
       
       
   </xsl:template>
    
</xsl:stylesheet>
