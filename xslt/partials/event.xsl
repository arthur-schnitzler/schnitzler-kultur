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
                        <xsl:for-each select="tei:listPlace/tei:place">
                            <xsl:element name="a">
                                <xsl:attribute name="target">
                                    <xsl:text>_blank</xsl:text>
                                </xsl:attribute>
                                <xsl:attribute name="href">
                                    <xsl:value-of select="concat(tei:placeName/@key, '.html')"/>
                                </xsl:attribute>
                                <xsl:value-of select="normalize-space(tei:placeName)"/>
                            </xsl:element>
                            <xsl:if test="./tei:location/tei:geo">
                                <div id="map_detail" style="height: 250px; width: 400px;"/>
                                <xsl:variable name="mlat"
                                    select="replace(tokenize(./tei:location[1]/tei:geo[1], '\s')[1], ',', '.')"/>
                                <xsl:variable name="mlong"
                                    select="replace(tokenize(./tei:location[1]/tei:geo[1], '\s')[2], ',', '.')"/>
                                <xsl:variable name="mappin"
                                    select="concat('mlat=',$mlat, '&amp;mlon=', $mlong)"
                                    as="xs:string"/>
                                <xsl:variable name="openstreetmapurl"
                                    select="concat('https://www.openstreetmap.org/?', $mappin, '#map=12/', $mlat, '/', $mlong)"/>
                                <a class="osm-link">
                                    <xsl:attribute name="href">
                                        <xsl:value-of select="$openstreetmapurl"/>
                                    </xsl:attribute>
                                    <xsl:attribute name="target">
                                        <xsl:text>_blank</xsl:text>
                                    </xsl:attribute>
                                    <i class="bi bi-box-arrow-up-right"/> OpenStreetMap </a>
                            </xsl:if>
                        </xsl:for-each>
                    </td>
                </tr>
                <xsl:if test="tei:listBibl/tei:title">
                    <tr>
                        <th>Aufgeführte Werke</th>
                        <td>
                            <ul>
                                <xsl:for-each
                                    select="tei:listBibl/tei:bibl[not(tei:note[contains(., 'rezensi')]) and normalize-space(tei:title)]">
                                    <li>
                                        <xsl:element name="a">
                                            <xsl:attribute name="href">
                                                <xsl:value-of
                                                  select="concat(tei:title/@key, '.html')"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="normalize-space(tei:title)"/>
                                        </xsl:element>
                                    </li>
                                </xsl:for-each>
                            </ul>
                        </td>
                    </tr>
                </xsl:if>
                <xsl:if test="tei:listPerson/tei:person[@role = 'hat als Arbeitskraft']">
                    <tr>
                        <th>Arbeitskräfte</th>
                        <td>
                            <ul>
                                <xsl:for-each
                                    select="tei:listPerson/tei:person[@role = 'hat als Arbeitskraft']">
                                    <li>
                                        <xsl:variable name="name" select="tei:persName"/>
                                        <xsl:choose>
                                            <!-- Wenn genau ein Komma enthalten ist -->
                                            <xsl:when test="matches($name, '^[^,]+,\s*[^,]+$')">
                                                <xsl:element name="a">
                                                  <xsl:attribute name="href">
                                                  <xsl:value-of select="concat($name/@key, '.html')"
                                                  />
                                                  </xsl:attribute>
                                                  <xsl:analyze-string select="$name"
                                                  regex="^([^,]+),\s*(.+)$">
                                                  <xsl:matching-substring>
                                                  <xsl:value-of select="regex-group(2)"/>
                                                  <xsl:text> </xsl:text>
                                                  <xsl:value-of select="regex-group(1)"/>
                                                  </xsl:matching-substring>
                                                  <xsl:non-matching-substring>
                                                  <xsl:value-of select="."/>
                                                  </xsl:non-matching-substring>
                                                  </xsl:analyze-string>
                                                </xsl:element>
                                            </xsl:when>
                                            <!-- Wenn kein oder mehr als ein Komma enthalten ist -->
                                            <xsl:otherwise>
                                                <xsl:element name="a">
                                                  <xsl:attribute name="href">
                                                  <xsl:value-of select="concat($name/@key, '.html')"
                                                  />
                                                  </xsl:attribute>
                                                  <xsl:value-of select="$name"/>
                                                </xsl:element>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </li>
                                </xsl:for-each>
                            </ul>
                        </td>
                    </tr>
                </xsl:if>
                <tr>
                    <th>Teilnehmende</th>
                    <td>
                        <ul>
                            <xsl:for-each
                                select="tei:listPerson/tei:person[@role = 'hat als Teilnehmer:in']">
                                <li>
                                    <xsl:variable name="name" select="tei:persName"/>
                                    <xsl:choose>
                                        <!-- Wenn genau ein Komma enthalten ist -->
                                        <xsl:when test="matches($name, '^[^,]+,\s*[^,]+$')">
                                            <xsl:element name="a">
                                                <xsl:attribute name="href">
                                                  <xsl:value-of select="concat($name/@key, '.html')"
                                                  />
                                                </xsl:attribute>
                                                <xsl:analyze-string select="$name"
                                                  regex="^([^,]+),\s*(.+)$">
                                                  <xsl:matching-substring>
                                                  <xsl:value-of select="regex-group(2)"/>
                                                  <xsl:text> </xsl:text>
                                                  <xsl:value-of select="regex-group(1)"/>
                                                  </xsl:matching-substring>
                                                  <xsl:non-matching-substring>
                                                  <xsl:value-of select="."/>
                                                  </xsl:non-matching-substring>
                                                </xsl:analyze-string>
                                            </xsl:element>
                                        </xsl:when>
                                        <!-- Wenn kein oder mehr als ein Komma enthalten ist -->
                                        <xsl:otherwise>
                                            <xsl:element name="a">
                                                <xsl:attribute name="href">
                                                  <xsl:value-of select="concat($name/@key, '.html')"
                                                  />
                                                </xsl:attribute>
                                                <xsl:value-of select="$name"/>
                                            </xsl:element>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </li>
                            </xsl:for-each>
                        </ul>
                    </td>
                </tr>
                <xsl:if test="descendant::tei:listOrg">
                    <tr>
                        <th>Beteiligte Institution</th>
                        <td>
                            <ul>
                                <xsl:for-each
                                    select="tei:note[@type = 'listorg']/tei:listOrg/tei:org">
                                    <li>
                                        <xsl:element name="a">
                                            <xsl:attribute name="href">
                                                <xsl:value-of
                                                  select="concat(tei:orgName/@key, '.html')"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="tei:orgName"/>
                                        </xsl:element>
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
