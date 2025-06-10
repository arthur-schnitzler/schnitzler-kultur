<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:mam="whatever" version="2.0" exclude-result-prefixes="xsl tei xs">
    <xsl:param select="document('../utils/index_days.xml')" name="tb-days"/>
    <xsl:template match="tei:event" name="event_detail">
        <table class="table entity-table">
            <tbody>
                <tr>
                    <th> Datum </th>
                    <td>
                        <xsl:value-of select="mam:wochentag(@when-iso)"/>
                        <xsl:text>, </xsl:text>
                        <xsl:value-of select="format-date(@when-iso, '[D1]. ')"/>
                        <xsl:value-of select="mam:monat(@when-iso)"/>
                        <xsl:value-of select="format-date(@when-iso, ' [Y]')"/>
                        <xsl:text> </xsl:text>
                        <xsl:element name="a">
                            <xsl:attribute name="class">
                                <xsl:text>schnitzler-chronik-link ms-3</xsl:text>
                            </xsl:attribute>
                            <xsl:attribute name="target">
                                <xsl:text>_blank</xsl:text>
                            </xsl:attribute>
                            <xsl:attribute name="href">
                                <xsl:value-of
                                    select="concat('https://schnitzler-chronik.acdh.oeaw.ac.at/', @when-iso, '.html')"
                                />
                            </xsl:attribute>
                            <xsl:text>zur Chronik</xsl:text>
                        </xsl:element>
                        <xsl:variable name="when" select="@when-iso"/>
                        <xsl:text> </xsl:text>
                        <xsl:if test="$tb-days/descendant::*:date[. = $when][1]">
                            <xsl:element name="a">
                                <xsl:attribute name="class">
                                    <xsl:text>schnitzler-tagebuch-link ms-3</xsl:text>
                                </xsl:attribute>
                                <xsl:attribute name="target">
                                    <xsl:text>_blank</xsl:text>
                                </xsl:attribute>
                                <xsl:attribute name="href">
                                    <xsl:value-of
                                        select="concat('https://schnitzler-tagebuch.acdh.oeaw.ac.at/entry__', $when, '.html')"
                                    />
                                </xsl:attribute>
                                <xsl:text>zum Tagebuch</xsl:text>
                            </xsl:element>
                        </xsl:if>
                    </td>
                </tr>
               
                <tr>
                    <th>Veranstaltungsort</th>
                    <td>
                        <xsl:for-each select="tei:listPlace/tei:place/tei:placeName[1]">
                            <xsl:element name="a">
                                <xsl:attribute name="target">
                                    <xsl:text>_blank</xsl:text>
                                </xsl:attribute>
                                <xsl:attribute name="href">
                                    <xsl:value-of
                                        select="concat(@key, '.html')"
                                    />
                                </xsl:attribute>
                                <xsl:value-of select="normalize-space(.)"/>
                            </xsl:element>
                          <xsl:if test="not(position()=last())">
                              <xsl:text>, </xsl:text>
                          </xsl:if>
                        </xsl:for-each>
                    </td>
                </tr>
                <xsl:if test="./tei:location[@type = 'located_in_place']">
                    <tr>
                        <th> Teil von </th>
                        <td>
                            <ul>
                                <xsl:for-each select="./tei:location[@type = 'located_in_place']">
                                    <li>
                                        <a href="{./tei:placeName/@key}.html">
                                            <xsl:value-of select="./tei:placeName"/>
                                        </a>
                                    </li>
                                </xsl:for-each>
                            </ul>
                        </td>
                    </tr>
                </xsl:if>
                <xsl:if test="./tei:country">
                    <tr>
                        <th> Land </th>
                        <td>
                            <xsl:value-of select="./tei:country"/>
                        </td>
                    </tr>
                </xsl:if>
                <xsl:if test="./tei:settlement">
                    <tr>
                        <th> Ortstyp </th>
                        <td>
                            <xsl:value-of select="./tei:settlement/@type"/>, <xsl:value-of
                                select="./tei:desc[@type = 'entity_type']"/>
                        </td>
                    </tr>
                </xsl:if>
                <xsl:if test="./tei:idno[@type = 'GEONAMES']">
                    <tr>
                        <th> Geonames ID </th>
                        <td>
                            <a href="{./tei:idno[@type='GEONAMES']}" target="_blank">
                                <xsl:value-of
                                    select="tokenize(./tei:idno[@type = 'GEONAMES'], '/')[4]"/>
                            </a>
                        </td>
                    </tr>
                </xsl:if>
                <xsl:if test="./tei:idno[@type = 'WIKIDATA']">
                    <tr>
                        <th> Wikidata ID </th>
                        <td>
                            <a href="{./tei:idno[@type='WIKIDATA']}" target="_blank">
                                <xsl:value-of
                                    select="tokenize(./tei:idno[@type = 'WIKIDATA'], '/')[last()]"/>
                            </a>
                        </td>
                    </tr>
                </xsl:if>
                <xsl:if test="./tei:idno[@type = 'GND']">
                    <tr>
                        <th> GND ID </th>
                        <td>
                            <a href="{./tei:idno[@type='GND']}" target="_blank">
                                <xsl:value-of
                                    select="tokenize(./tei:idno[@type = 'GND'], '/')[last()]"/>
                            </a>
                        </td>
                    </tr>
                </xsl:if>
                <xsl:if test=".//tei:location">
                    <tr>
                        <th> Latitude </th>
                        <td>
                            <xsl:value-of select="tokenize(./tei:location[1]/tei:geo[1], '\s')[1]"/>
                        </td>
                    </tr>
                </xsl:if>
                <xsl:if test=".//tei:location">
                    <tr>
                        <th> Longitude </th>
                        <td>
                            <xsl:value-of select="tokenize(./tei:location[1]/tei:geo[1], '\s')[2]"/>
                        </td>
                    </tr>
                </xsl:if>
                <xsl:if test="./tei:noteGrp/tei:note[@type = 'mentions']">
                    <tr>
                        <th> Erwähnt in </th>
                        <td>
                            <ul>
                                <xsl:for-each select="./tei:noteGrp/tei:note[@type = 'mentions']">
                                    <li>
                                        <a href="{replace(@target, '.xml', '.html')}">
                                            <xsl:value-of select="./text()"/>
                                        </a>
                                    </li>
                                </xsl:for-each>
                            </ul>
                        </td>
                    </tr>
                </xsl:if>
            </tbody>
        </table>
    </xsl:template>
    <xsl:function name="mam:wochentag" as="xs:string">
        <xsl:param name="iso-datum" as="xs:date"/>
        <xsl:variable name="day-of-the-week" as="xs:string" select="format-date($iso-datum, '[F]')"/>
        <xsl:choose>
            <xsl:when test="$day-of-the-week = 'Monday'">
                <xsl:text>Montag</xsl:text>
            </xsl:when>
            <xsl:when test="$day-of-the-week = 'Tuesday'">
                <xsl:text>Dienstag</xsl:text>
            </xsl:when>
            <xsl:when test="$day-of-the-week = 'Wednesday'">
                <xsl:text>Mittwoch</xsl:text>
            </xsl:when>
            <xsl:when test="$day-of-the-week = 'Thursday'">
                <xsl:text>Donnerstag</xsl:text>
            </xsl:when>
            <xsl:when test="$day-of-the-week = 'Friday'">
                <xsl:text>Freitag</xsl:text>
            </xsl:when>
            <xsl:when test="$day-of-the-week = 'Saturday'">
                <xsl:text>Samstag</xsl:text>
            </xsl:when>
            <xsl:when test="$day-of-the-week = 'Sunday'">
                <xsl:text>Sonntag</xsl:text>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>Unbekannt</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>
    <xsl:function name="mam:monat" as="xs:string">
        <xsl:param name="iso-datum" as="xs:date"/>
        <xsl:variable name="month-of-the-year" as="xs:string"
            select="format-date($iso-datum, '[MNn]')"/>
        <xsl:choose>
            <xsl:when test="$month-of-the-year = 'January'">
                <xsl:text>Jänner</xsl:text>
            </xsl:when>
            <xsl:when test="$month-of-the-year = 'February'">
                <xsl:text>Februar</xsl:text>
            </xsl:when>
            <xsl:when test="$month-of-the-year = 'March'">
                <xsl:text>März</xsl:text>
            </xsl:when>
            <xsl:when test="$month-of-the-year = 'April'">
                <xsl:text>April</xsl:text>
            </xsl:when>
            <xsl:when test="$month-of-the-year = 'May'">
                <xsl:text>Mai</xsl:text>
            </xsl:when>
            <xsl:when test="$month-of-the-year = 'June'">
                <xsl:text>Juni</xsl:text>
            </xsl:when>
            <xsl:when test="$month-of-the-year = 'July'">
                <xsl:text>Juli</xsl:text>
            </xsl:when>
            <xsl:when test="$month-of-the-year = 'August'">
                <xsl:text>August</xsl:text>
            </xsl:when>
            <xsl:when test="$month-of-the-year = 'September'">
                <xsl:text>September</xsl:text>
            </xsl:when>
            <xsl:when test="$month-of-the-year = 'October'">
                <xsl:text>Oktober</xsl:text>
            </xsl:when>
            <xsl:when test="$month-of-the-year = 'November'">
                <xsl:text>November</xsl:text>
            </xsl:when>
            <xsl:when test="$month-of-the-year = 'December'">
                <xsl:text>Dezember</xsl:text>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>Unbekannter Monat</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>
</xsl:stylesheet>
