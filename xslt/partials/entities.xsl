<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:mam="whatever" version="2.0" exclude-result-prefixes="xsl tei xs">
    <xsl:import href="./LOD-idnos.xsl"/>
    <xsl:param name="places" select="document('../../data/indices/listplace.xml')"/>
    <xsl:param name="works" select="document('../../data/indices/listbibl.xml')"/>
    <xsl:param name="events"
        select="document('../../data/editions/listevent.xml')/descendant::tei:listEvent[1]"/>
    <xsl:key name="work-lookup" match="tei:bibl" use="tei:relatedItem/@target"/>
    <xsl:key name="only-relevant-uris" match="item" use="abbr"/>
    <xsl:key name="authorwork-lookup" match="tei:bibl"
        use="tei:author/@*[name() = 'key' or name() = 'ref']/replace(replace(., 'person__', ''), 'pmb', '')"/>
    <!-- PERSON -->
    <xsl:template match="tei:person" name="person_detail">
        <xsl:param name="showNumberOfMentions" as="xs:integer" select="50000"/>
        <xsl:variable name="selfLink">
            <xsl:value-of select="concat(data(@xml:id), '.html')"/>
        </xsl:variable>
        <div class="card-body-index">
            <xsl:variable name="lemma-name" select="tei:persName[(position() = 1)]" as="node()"/>
            <xsl:variable name="namensformen" as="node()">
                <xsl:element name="listPerson">
                    <xsl:for-each select="descendant::tei:persName[not(position() = 1)]">
                        <xsl:copy-of select="."/>
                    </xsl:for-each>
                </xsl:element>
            </xsl:variable>
            <xsl:choose>
                <xsl:when test="tei:figure/tei:graphic/@url">
                    <div class="WikimediaContainer">
                        <!-- Left div -->
                        <div class="WikimediaLeft-div">
                            <xsl:element name="figure">
                                <xsl:variable name="imageUrl" select="tei:figure/tei:graphic/@url"/>
                                <!-- Create an <img> element with the extracted URL -->
                                <img src="{$imageUrl}" alt="Image" width="200px;"/>
                            </xsl:element>
                        </div>
                        <!-- Right div -->
                        <div class="WikimediaRight-div">
                            <!-- Achtung, der Teil kommt zweimal, einmal mit Bild auf der Seite, einmal ohne -->
                            <xsl:for-each select="$namensformen/descendant::tei:persName">
                                <p class="personenname">
                                    <xsl:choose>
                                        <xsl:when test="descendant::*">
                                            <!-- den Fall dürfte es eh nicht geben, aber löschen braucht man auch nicht -->
                                            <xsl:choose>
                                                <xsl:when
                                                  test="./tei:forename/text() and ./tei:surname/text()">
                                                  <xsl:value-of
                                                  select="concat(./tei:forename/text(), ' ', ./tei:surname/text())"
                                                  />
                                                </xsl:when>
                                                <xsl:when test="./tei:forename/text()">
                                                  <xsl:value-of select="./tei:forename/text()"/>
                                                </xsl:when>
                                                <xsl:when test="./tei:surname/text()">
                                                  <xsl:value-of select="./tei:surname/text()"/>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                  <xsl:value-of select="."/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:choose>
                                                <xsl:when
                                                  test="@type = 'person_geburtsname_vorname' and $namensformen/descendant::tei:persName[@type = 'person_geburtsname_nachname']">
                                                  <xsl:text>geboren </xsl:text>
                                                  <xsl:value-of
                                                  select="concat(., ' ', $namensformen/descendant::tei:persName[@type = 'person_geburtsname_nachname'][1])"
                                                  />
                                                </xsl:when>
                                                <xsl:when
                                                  test="@type = 'person_geburtsname_vorname'">
                                                  <xsl:text>geboren </xsl:text>
                                                  <xsl:value-of
                                                  select="concat(., ' ', $lemma-name//tei:surname)"
                                                  />
                                                </xsl:when>
                                                <xsl:when
                                                  test="@type = 'person_geburtsname_nachname' and $namensformen/descendant::tei:persName[@type = 'person_geburtsname_vorname'][1]"/>
                                                <xsl:when
                                                  test="@type = 'person_geburtsname_nachname'">
                                                  <xsl:text>geboren </xsl:text>
                                                  <xsl:value-of select="."/>
                                                </xsl:when>
                                                <xsl:when
                                                  test="@type = 'person_adoptierter-nachname'">
                                                  <xsl:text>Nachname durch Adoption </xsl:text>
                                                  <xsl:value-of select="."/>
                                                </xsl:when>
                                                <xsl:when
                                                  test="@type = 'person_namensvariante-nachname'">
                                                  <xsl:text>Namensvariante Nachame </xsl:text>
                                                  <xsl:value-of select="."/>
                                                </xsl:when>
                                                <xsl:when
                                                  test="@type = 'person_namensvariante-vorname'">
                                                  <xsl:text>Namensvariante Vorname </xsl:text>
                                                  <xsl:value-of select="."/>
                                                </xsl:when>
                                                <xsl:when test="@type = 'person_namensvariante'">
                                                  <xsl:text>Namensvariante </xsl:text>
                                                  <xsl:value-of select="."/>
                                                </xsl:when>
                                                <xsl:when test="@type = 'person_rufname_vorname'">
                                                  <xsl:text>Rufname </xsl:text>
                                                  <xsl:value-of select="."/>
                                                </xsl:when>
                                                <xsl:when test="@type = 'person_pseudonym'">
                                                  <xsl:text>Pseudonym </xsl:text>
                                                  <xsl:value-of select="."/>
                                                </xsl:when>
                                                <xsl:when test="@type = 'person_ehename_nachname'">
                                                  <xsl:text>Ehename </xsl:text>
                                                  <xsl:value-of select="."/>
                                                </xsl:when>
                                                <xsl:when
                                                  test="@type = 'person_geschieden_nachname'">
                                                  <xsl:text>geschieden </xsl:text>
                                                  <xsl:value-of select="."/>
                                                </xsl:when>
                                                <xsl:when test="@type = 'person_verwitwet_nachname'">
                                                  <xsl:text>verwitwet </xsl:text>
                                                  <xsl:value-of select="."/>
                                                </xsl:when>
                                            </xsl:choose>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </p>
                            </xsl:for-each>
                            <xsl:if test=".//tei:occupation">
                                <xsl:variable name="entity" select="."/>
                                <p>
                                    <xsl:if test="$entity/descendant::tei:occupation">
                                        <i>
                                            <xsl:for-each
                                                select="$entity/descendant::tei:occupation">
                                                <xsl:variable name="beruf" as="xs:string">
                                                  <xsl:choose>
                                                  <xsl:when test="contains(., '&gt;&gt;')">
                                                  <xsl:value-of
                                                  select="tokenize(., '&gt;&gt;')[last()]"/>
                                                  </xsl:when>
                                                  <xsl:otherwise>
                                                  <xsl:value-of select="."/>
                                                  </xsl:otherwise>
                                                  </xsl:choose>
                                                </xsl:variable>
                                                <xsl:choose>
                                                  <xsl:when test="$entity/tei:sex/@value = 'male'">
                                                  <xsl:value-of select="tokenize($beruf, '/')[1]"/>
                                                  </xsl:when>
                                                  <xsl:when test="$entity/tei:sex/@value = 'female'">
                                                  <xsl:value-of select="tokenize($beruf, '/')[2]"/>
                                                  </xsl:when>
                                                  <xsl:otherwise>
                                                  <xsl:value-of select="$beruf"/>
                                                  </xsl:otherwise>
                                                </xsl:choose>
                                                <xsl:if test="not(position() = last())">
                                                  <xsl:text>, </xsl:text>
                                                </xsl:if>
                                            </xsl:for-each>
                                        </i>
                                    </xsl:if>
                                </p>
                            </xsl:if>
                        </div>
                    </div>
                </xsl:when>
                <xsl:otherwise>
                    <div>
                        <xsl:for-each select="$namensformen/descendant::tei:persName">
                            <p class="personenname">
                                <xsl:choose>
                                    <xsl:when test="descendant::*">
                                        <!-- den Fall dürfte es eh nicht geben, aber löschen braucht man auch nicht -->
                                        <xsl:choose>
                                            <xsl:when
                                                test="./tei:forename/text() and ./tei:surname/text()">
                                                <xsl:value-of
                                                  select="concat(./tei:forename/text(), ' ', ./tei:surname/text())"
                                                />
                                            </xsl:when>
                                            <xsl:when test="./tei:forename/text()">
                                                <xsl:value-of select="./tei:forename/text()"/>
                                            </xsl:when>
                                            <xsl:when test="./tei:surname/text()">
                                                <xsl:value-of select="./tei:surname/text()"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="."/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:choose>
                                            <xsl:when
                                                test="@type = 'person_geburtsname_vorname' and $namensformen/descendant::tei:persName[@type = 'person_geburtsname_nachname']">
                                                <xsl:text>geboren </xsl:text>
                                                <xsl:value-of
                                                  select="concat(., ' ', $namensformen/descendant::tei:persName[@type = 'person_geburtsname_nachname'][1])"
                                                />
                                            </xsl:when>
                                            <xsl:when
                                                test="@type = 'person_geburtsname_nachname' and $namensformen/descendant::tei:persName[@type = 'person_geburtsname_vorname'][1]"/>
                                            <xsl:when test="@type = 'person_geburtsname_nachname'">
                                                <xsl:text>geboren </xsl:text>
                                                <xsl:value-of select="."/>
                                            </xsl:when>
                                            <xsl:when test="@type = 'person_adoptierter-nachname'">
                                                <xsl:text>Nachname durch Adoption </xsl:text>
                                                <xsl:value-of select="."/>
                                            </xsl:when>
                                            <xsl:when
                                                test="@type = 'person_namensvariante-nachname'">
                                                <xsl:text>Namensvariante Nachame </xsl:text>
                                                <xsl:value-of select="."/>
                                            </xsl:when>
                                            <xsl:when test="@type = 'person_namensvariante-vorname'">
                                                <xsl:text>Namensvariante Vorname </xsl:text>
                                                <xsl:value-of select="."/>
                                            </xsl:when>
                                            <xsl:when test="@type = 'person_namensvariante'">
                                                <xsl:text>Namensvariante </xsl:text>
                                                <xsl:value-of select="."/>
                                            </xsl:when>
                                            <xsl:when test="@type = 'person_rufname_vorname'">
                                                <xsl:text>Rufname </xsl:text>
                                                <xsl:value-of select="."/>
                                            </xsl:when>
                                            <xsl:when test="@type = 'person_pseudonym'">
                                                <xsl:text>Pseudonym </xsl:text>
                                                <xsl:value-of select="."/>
                                            </xsl:when>
                                            <xsl:when test="@type = 'person_ehename_nachname'">
                                                <xsl:text>Ehename </xsl:text>
                                                <xsl:value-of select="."/>
                                            </xsl:when>
                                            <xsl:when test="@type = 'person_geschieden_nachname'">
                                                <xsl:text>geschieden </xsl:text>
                                                <xsl:value-of select="."/>
                                            </xsl:when>
                                            <xsl:when test="@type = 'person_verwitwet_nachname'">
                                                <xsl:text>verwitwet </xsl:text>
                                                <xsl:value-of select="."/>
                                            </xsl:when>
                                        </xsl:choose>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </p>
                        </xsl:for-each>
                        <xsl:if test=".//tei:occupation">
                            <xsl:variable name="entity" select="."/>
                            <p>
                                <xsl:if test="$entity/descendant::tei:occupation">
                                    <i>
                                        <xsl:for-each select="$entity/descendant::tei:occupation">
                                            <xsl:variable name="beruf" as="xs:string">
                                                <xsl:choose>
                                                  <xsl:when test="contains(., '&gt;&gt;')">
                                                  <xsl:value-of
                                                  select="tokenize(., '&gt;&gt;')[last()]"/>
                                                  </xsl:when>
                                                  <xsl:otherwise>
                                                  <xsl:value-of select="."/>
                                                  </xsl:otherwise>
                                                </xsl:choose>
                                            </xsl:variable>
                                            <xsl:choose>
                                                <xsl:when test="$entity/tei:sex/@value = 'male'">
                                                  <xsl:value-of select="tokenize($beruf, '/')[1]"/>
                                                </xsl:when>
                                                <xsl:when test="$entity/tei:sex/@value = 'female'">
                                                  <xsl:value-of select="tokenize($beruf, '/')[2]"/>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                  <xsl:value-of select="$beruf"/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                            <xsl:if test="not(position() = last())">
                                                <xsl:text>, </xsl:text>
                                            </xsl:if>
                                        </xsl:for-each>
                                    </i>
                                </xsl:if>
                            </p>
                        </xsl:if>
                    </div>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:variable name="xmlid" select="@xml:id"/>
            <div id="mentions">
                <xsl:if test="key('only-relevant-uris', tei:idno/@subtype, $relevant-uris)[1]">
                    <p class="buttonreihe">
                        <xsl:variable name="idnos-of-current" as="node()">
                            <xsl:element name="nodeset_person">
                                <xsl:for-each select="tei:idno">
                                    <xsl:copy-of select="."/>
                                </xsl:for-each>
                            </xsl:element>
                        </xsl:variable>
                        <xsl:call-template name="mam:idnosToLinks">
                            <xsl:with-param name="idnos-of-current" select="$idnos-of-current"/>
                        </xsl:call-template>
                    </p>
                </xsl:if>
            </div>
            <div class="werke">
                <xsl:variable name="author-ref"
                    select="replace(replace(@xml:id, 'person__', ''), 'pmb', '')"/>
                <xsl:if test="key('authorwork-lookup', $author-ref, $works)[1]">
                    <legend>Werke</legend>
                    <ul class="dashed">
                        <xsl:for-each select="key('authorwork-lookup', $author-ref, $works)">
                            <xsl:sort select="descendant::tei:date[1]"/>
                            <li>
                                <xsl:if test="@role = 'editor' or @role = 'hat-herausgegeben'">
                                    <xsl:text> (Herausgabe)</xsl:text>
                                </xsl:if>
                                <xsl:if test="@role = 'translator' or @role = 'hat-ubersetzt'">
                                    <xsl:text> (Übersetzung)</xsl:text>
                                </xsl:if>
                                <xsl:if test="@role = 'illustrator' or @role = 'hat-illustriert'">
                                    <xsl:text> (Illustration)</xsl:text>
                                </xsl:if>
                                <xsl:if test="@role = 'hat-einen-beitrag-geschaffen-zu'">
                                    <xsl:text> (Beitrag)</xsl:text>
                                </xsl:if>
                                <xsl:if test="@role = 'hat-ein-vorwortnachwort-verfasst-zu'">
                                    <xsl:text> (Vor-/Nachwort)</xsl:text>
                                </xsl:if>
                                <xsl:choose>
                                    <xsl:when test="tei:author[2]">
                                        <xsl:for-each
                                            select="tei:author[not(replace(@*[name() = 'key' or name() = 'ref'], '#', '') = $author-ref)]">
                                            <xsl:choose>
                                                <xsl:when
                                                  test="tei:persName/tei:forename and tei:persName/tei:surname">
                                                  <xsl:value-of select="tei:persName/tei:forename"/>
                                                  <xsl:text> </xsl:text>
                                                  <xsl:value-of select="tei:persName/tei:surname"/>
                                                </xsl:when>
                                                <xsl:when test="tei:persName/tei:surname">
                                                  <xsl:value-of select="tei:persName/tei:surname"/>
                                                </xsl:when>
                                                <xsl:when test="tei:persName/tei:forename">
                                                  <xsl:value-of select="tei:persName/tei:forename"
                                                  />"/> </xsl:when>
                                                <xsl:when test="contains(tei:persName, ', ')">
                                                  <xsl:value-of
                                                  select="concat(substring-after(tei:persName, ', '), ' ', substring-before(tei:persName, ', '))"
                                                  />
                                                </xsl:when>
                                                <xsl:when test="contains(., ', ')">
                                                  <xsl:value-of
                                                  select="concat(substring-after(., ', '), ' ', substring-before(., ', '))"
                                                  />
                                                </xsl:when>
                                                <xsl:otherwise>
                                                  <xsl:value-of select="."/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                            <xsl:if
                                                test="@role = 'editor' or @role = 'hat-herausgegeben'">
                                                <xsl:text> (Herausgabe)</xsl:text>
                                            </xsl:if>
                                            <xsl:if
                                                test="@role = 'translator' or @role = 'hat-ubersetzt'">
                                                <xsl:text> (Übersetzung)</xsl:text>
                                            </xsl:if>
                                            <xsl:if
                                                test="@role = 'illustrator' or @role = 'hat-illustriert'">
                                                <xsl:text> (Illustration)</xsl:text>
                                            </xsl:if>
                                            <xsl:if test="@role = 'hat-einen-beitrag-geschaffen-zu'">
                                                <xsl:text> (Beitrag)</xsl:text>
                                            </xsl:if>
                                            <xsl:if
                                                test="@role = 'hat-ein-vorwortnachwort-verfasst-zu'">
                                                <xsl:text> (Vor-/Nachwort)</xsl:text>
                                            </xsl:if>
                                            <xsl:choose>
                                                <xsl:when test="position() = last()"/>
                                                <xsl:otherwise>
                                                  <xsl:text>, </xsl:text>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </xsl:for-each>
                                        <xsl:text>: </xsl:text>
                                    </xsl:when>
                                </xsl:choose>
                                <xsl:element name="a">
                                    <xsl:attribute name="href">
                                        <xsl:value-of select="concat(@xml:id, '.html')"/>
                                    </xsl:attribute>
                                    <xsl:value-of select="normalize-space(tei:title[1])"/>
                                </xsl:element>
                                <xsl:if test="tei:date[not(. = 'None')][1]">
                                    <xsl:text> (</xsl:text>
                                    <xsl:choose>
                                        <xsl:when test="contains(tei:date[1], '–')">
                                            <xsl:choose>
                                                <xsl:when
                                                  test="normalize-space(tokenize(tei:date[1], '–')[1]) = normalize-space(tokenize(tei:date[1], '–')[2])">
                                                  <xsl:value-of
                                                  select="mam:normalize-date(normalize-space((tokenize(tei:date[1], '–')[1])))"
                                                  />
                                                </xsl:when>
                                                <xsl:otherwise>
                                                  <xsl:value-of
                                                  select="mam:normalize-date(normalize-space(tei:date[1]))"
                                                  />
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:value-of select="mam:normalize-date(tei:date[1])"/>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                    <xsl:text>)</xsl:text>
                                </xsl:if>
                                <!--<xsl:text> </xsl:text>
                            <xsl:variable name="idnos-of-current" as="node()">
                                <xsl:element name="nodeset_person">
                                    <xsl:for-each select="tei:idno">
                                        <xsl:copy-of select="."/>
                                    </xsl:for-each>
                                </xsl:element>
                            </xsl:variable>
                            <xsl:call-template name="mam:idnosToLinks">
                                <xsl:with-param name="idnos-of-current" select="$idnos-of-current"/>
                            </xsl:call-template>-->
                            </li>
                        </xsl:for-each>
                    </ul>
                </xsl:if>
            </div>
            <xsl:variable name="xmlid" select="@xml:id"/>
            <div id="mentions" class="mt-2">
                <span class="infodesc mr-2">
                    <legend>Teilnahme an Veranstaltungen</legend>
                    <xsl:call-template name="render-events-for-key">
                        <xsl:with-param name="elementName" select="'persName'"/>
                        <xsl:with-param name="xmlid" select="$xmlid"/>
                    </xsl:call-template>
                </span>
            </div>
        </div>
    </xsl:template>
    <!-- WORK -->
    <xsl:template match="tei:listBibl/tei:bibl" name="work_detail">
        <xsl:param name="showNumberOfMentions" as="xs:integer" select="50000"/>
        <xsl:variable name="selfLink">
            <xsl:value-of select="concat(data(@xml:id), '.html')"/>
        </xsl:variable>
        <div class="card-body-index">
            <div id="mentions">
                <xsl:if test="key('only-relevant-uris', tei:idno/@subtype, $relevant-uris)[1]">
                    <p class="buttonreihe">
                        <xsl:variable name="idnos-of-current" as="node()">
                            <xsl:element name="nodeset_work">
                                <xsl:for-each select="tei:idno">
                                    <xsl:copy-of select="."/>
                                </xsl:for-each>
                            </xsl:element>
                        </xsl:variable>
                        <xsl:call-template name="mam:idnosToLinks">
                            <xsl:with-param name="idnos-of-current" select="$idnos-of-current"/>
                        </xsl:call-template>
                    </p>
                </xsl:if>
            </div>
            <xsl:if test="tei:author">
                <div id="autor_innen">
                    <xsl:choose>
                        <xsl:when test="tei:author[2]">
                            <ul>
                                <legend>Geschaffen von</legend>
                                <xsl:for-each select="tei:author">
                                    <li>
                                        <xsl:variable name="keyToRef" as="xs:string">
                                            <xsl:choose>
                                                <xsl:when test="@key != ''">
                                                  <xsl:value-of select="@key"/>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                  <xsl:value-of select="@ref"/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </xsl:variable>
                                        <xsl:variable name="autor-ref" as="xs:string">
                                            <xsl:choose>
                                                <xsl:when test="contains($keyToRef, 'person__')">
                                                  <xsl:value-of
                                                  select="concat('pmb', substring-after($keyToRef, 'person__'))"
                                                  />
                                                </xsl:when>
                                                <xsl:when test="starts-with($keyToRef, 'pmb')">
                                                  <xsl:value-of select="$keyToRef"/>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                  <xsl:value-of select="concat('pmb', $keyToRef)"/>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </xsl:variable>
                                        <xsl:choose>
                                            <xsl:when test="$autor-ref = 'pmb2121'">
                                                <a href="pmb2121.html">
                                                  <xsl:text>Arthur Schnitzler</xsl:text>
                                                </a>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <a>
                                                  <xsl:attribute name="href">
                                                  <xsl:value-of select="concat($autor-ref, '.html')"
                                                  />
                                                  </xsl:attribute>
                                                  <xsl:choose>
                                                  <xsl:when
                                                  test="child::tei:forename and child::tei:surname">
                                                  <xsl:value-of select="tei:persName/tei:forename"/>
                                                  <xsl:text> </xsl:text>
                                                  <xsl:value-of select="tei:persName/tei:surname"/>
                                                  </xsl:when>
                                                  <xsl:when test="child::tei:surname">
                                                  <xsl:value-of select="child::tei:surname"/>
                                                  </xsl:when>
                                                  <xsl:when test="child::tei:forename">
                                                  <xsl:value-of select="child::tei:forename"/>"/> </xsl:when>
                                                  <xsl:when test="contains(., ', ')">
                                                  <xsl:value-of
                                                  select="concat(substring-after(., ', '), ' ', substring-before(., ', '))"
                                                  />
                                                  </xsl:when>
                                                  <xsl:otherwise>
                                                  <xsl:value-of select="."/>
                                                  </xsl:otherwise>
                                                  </xsl:choose>
                                                </a>
                                                <xsl:choose>
                                                  <xsl:when
                                                  test="@role = 'editor' or @role = 'hat-herausgegeben'">
                                                  <xsl:text> (Herausgabe)</xsl:text>
                                                  </xsl:when>
                                                  <xsl:when
                                                  test="@role = 'translator' or @role = 'hat-ubersetzt'">
                                                  <xsl:text> (Übersetzung)</xsl:text>
                                                  </xsl:when>
                                                  <xsl:when test="@role = 'hat-ubersetzt'">
                                                  <xsl:text> (unter Pseudonym)</xsl:text>
                                                  </xsl:when>
                                                  <xsl:when
                                                  test="@role = 'hat-unter-einem-kurzel-veroffentlicht'">
                                                  <xsl:text> (unter Kürzel)</xsl:text>
                                                  </xsl:when>
                                                  <xsl:when test="@role = 'hat-illustriert'">
                                                  <xsl:text> (Illustration)</xsl:text>
                                                  </xsl:when>
                                                  <xsl:when test="@role = 'hat-vertont'">
                                                  <xsl:text> (Vertonung)</xsl:text>
                                                  </xsl:when>
                                                  <xsl:when
                                                  test="@role = 'hat-einen-beitrag-geschaffen-zu'">
                                                  <xsl:text> (Beitrag)</xsl:text>
                                                  </xsl:when>
                                                  <xsl:when
                                                  test="@role = 'hat-ein-vorwortnachwort-verfasst-zu'">
                                                  <xsl:text> (Vorwort/Nachwort)</xsl:text>
                                                  </xsl:when>
                                                  <xsl:when
                                                  test="@role = 'hat-anonym-veroffentlicht'">
                                                  <xsl:text> (ohne Namensnennung)</xsl:text>
                                                  </xsl:when>
                                                  <xsl:when test="@role = 'bekommt-zugeschrieben'">
                                                  <xsl:text> (Zuschreibung)</xsl:text>
                                                  </xsl:when>
                                                </xsl:choose>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </li>
                                </xsl:for-each>
                            </ul>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:variable name="keyToRef" as="xs:string">
                                <xsl:choose>
                                    <xsl:when test="tei:author/@key != ''">
                                        <xsl:value-of select="tei:author/@key"/>
                                    </xsl:when>
                                    <xsl:when test="tei:author/@ref != ''">
                                        <xsl:value-of select="tei:author/@ref"/>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:text>SELTSAM</xsl:text>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:variable>
                            <xsl:variable name="autor-ref" as="xs:string">
                                <xsl:choose>
                                    <xsl:when test="contains($keyToRef, 'person__')">
                                        <xsl:value-of
                                            select="concat('pmb', substring-after($keyToRef, 'person__'))"
                                        />
                                    </xsl:when>
                                    <xsl:when test="starts-with($keyToRef, 'pmb')">
                                        <xsl:value-of select="$keyToRef"/>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:value-of select="concat('pmb', $keyToRef)"/>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:variable>
                            <xsl:choose>
                                <xsl:when test="$autor-ref = 'pmb2121'">
                                    <a href="pmb2121.html">
                                        <xsl:text>Arthur Schnitzler</xsl:text>
                                    </a>
                                </xsl:when>
                                <xsl:otherwise>
                                    <a>
                                        <xsl:attribute name="href">
                                            <xsl:value-of select="concat($autor-ref, '.html')"/>
                                        </xsl:attribute>
                                        <xsl:choose>
                                            <xsl:when
                                                test="child::tei:forename and child::tei:surname">
                                                <xsl:value-of select="tei:persName/tei:forename"/>
                                                <xsl:text> </xsl:text>
                                                <xsl:value-of select="tei:persName/tei:surname"/>
                                            </xsl:when>
                                            <xsl:when test="child::tei:surname">
                                                <xsl:value-of select="child::tei:surname"/>
                                            </xsl:when>
                                            <xsl:when test="child::tei:forename">
                                                <xsl:value-of select="child::tei:forename"/>"/> </xsl:when>
                                            <xsl:when test="contains(., ', ')">
                                                <xsl:value-of
                                                  select="concat(substring-after(tei:author[1], ', '), ' ', substring-before(tei:author[1], ', '))"
                                                />
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="tei:author[1]"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </a>
                                    <xsl:if test="@role = 'editor'">
                                        <xsl:text> (Herausgabe)</xsl:text>
                                    </xsl:if>
                                    <xsl:if test="@role = 'translator'">
                                        <xsl:text> (Übersetzung)</xsl:text>
                                    </xsl:if>
                                    <xsl:if test="@role = 'illustrator'">
                                        <xsl:text> (Illustration)</xsl:text>
                                    </xsl:if>
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:otherwise>
                    </xsl:choose>
                </div>
                <div id="erscheinungsdatum" class="mt-2">
                    <p>
                        <xsl:if test="tei:date[1]">
                            <legend>Erschienen</legend>
                            <ul>
                                <li>
                                    <xsl:choose>
                                        <xsl:when test="contains(tei:date[1], '-')">
                                            <xsl:choose>
                                                <xsl:when
                                                  test="normalize-space(tokenize(tei:date[1], '-')[1]) = normalize-space(tokenize(tei:date[1], '-')[2])">
                                                  <xsl:value-of
                                                  select="mam:normalize-date(normalize-space((tokenize(tei:date[1], '-')[1])))"
                                                  />
                                                </xsl:when>
                                                <xsl:otherwise>
                                                  <xsl:value-of
                                                  select="mam:normalize-date(normalize-space(tei:date[1]))"
                                                  />
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:value-of select="mam:normalize-date(tei:date[1])"/>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                    <xsl:if test="not(ends-with(tei:date[1], '.'))">
                                        <xsl:text>.</xsl:text>
                                    </xsl:if>
                                </li>
                            </ul>
                        </xsl:if>
                    </p>
                </div>
                <p/>
            </xsl:if>
            <xsl:if
                test="tei:title[@type = 'werk_bibliografische-angabe' or starts-with(@type, 'werk_link')]">
                <div id="labels" class="mt-2">
                    <span class="infodesc mr-2">
                        <ul>
                            <xsl:for-each select="tei:title[@type = 'werk_bibliografische-angabe']">
                                <li>
                                    <xsl:text>Bibliografische Angabe: </xsl:text>
                                    <xsl:value-of select="."/>
                                </li>
                            </xsl:for-each>
                            <xsl:for-each select="tei:title[@type = 'werk_link' or @type = 'anno']">
                                <li>
                                    <a>
                                        <xsl:attribute name="href">
                                            <xsl:value-of select="."/>
                                        </xsl:attribute>
                                        <xsl:attribute name="target">
                                            <xsl:text>_blank</xsl:text>
                                        </xsl:attribute>
                                        <xsl:text>Online verfügbar</xsl:text>
                                    </a>
                                </li>
                            </xsl:for-each>
                        </ul>
                    </span>
                </div>
            </xsl:if>
            <xsl:variable name="xmlid" select="@xml:id"/>
            <div id="mentions" class="mt-2">
                <span class="infodesc mr-2">
                    <legend>Aufführungen</legend>
                    <xsl:call-template name="render-events-for-key">
                        <xsl:with-param name="elementName" select="'title'"/>
                        <xsl:with-param name="xmlid" select="$xmlid"/>
                    </xsl:call-template>
                    
                </span>
            </div>
        </div>
    </xsl:template>
    <!-- PLACE -->
    <xsl:template match="tei:place" name="place_detail">
        <xsl:param name="showNumberOfMentions" as="xs:integer" select="50000"/>
        <xsl:variable name="selfLink">
            <xsl:value-of select="concat(data(@xml:id), '.html')"/>
        </xsl:variable>
        <div class="container-fluid">
            <div class="card-body-index">
                <div id="mentions">
                    <xsl:if test="key('only-relevant-uris', tei:idno/@subtype, $relevant-uris)[1]">
                        <p class="buttonreihe">
                            <xsl:variable name="idnos-of-current" as="node()">
                                <xsl:element name="nodeset_place">
                                    <xsl:for-each select="tei:idno">
                                        <xsl:copy-of select="."/>
                                    </xsl:for-each>
                                </xsl:element>
                            </xsl:variable>
                            <xsl:call-template name="mam:idnosToLinks">
                                <xsl:with-param name="idnos-of-current" select="$idnos-of-current"/>
                            </xsl:call-template>
                        </p>
                    </xsl:if>
                </div>
                <xsl:if test=".//tei:geo/text()">
                    <div id="mapid" style="height: 400px; width:100%; clear: both;"/>
                    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                        crossorigin=""/>
                    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""/>
                    <script>
                        
                        var mymap = L.map('mapid').setView([50, 12], 5);
                        
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: 'Map data &amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                        maxZoom: 18,
                        zIndex: 1
                        }).addTo(mymap);
                        <xsl:variable name="laenge" as="xs:string" select="replace(tokenize(descendant::tei:geo[1]/text(), ' ')[1], ',', '.')"/>
                        <xsl:variable name="breite" as="xs:string" select="replace(tokenize(descendant::tei:geo[1]/text(), ' ')[2], ',', '.')"/>
                        <xsl:variable name="laengebreite" as="xs:string" select="concat($laenge, ', ', $breite)"/>
                        <xsl:value-of select="$laengebreite"/>
                        L.marker([<xsl:value-of select="$laengebreite"/>]).addTo(mymap)
                        .bindPopup("<b>
                            <xsl:value-of select="./tei:placeName[1]/text()"/>
                        </b>").openPopup();
                    </script>
                    <div class="card"> </div>
                </xsl:if>
                <xsl:if test="count(.//tei:placeName[contains(@type, 'namensvariante')]) gt 1">
                    <ul>
                        <legend>Namensvarianten</legend>
                        <xsl:for-each select=".//tei:placeName[contains(@type, 'namensvariante')]">
                            <li>
                                <xsl:value-of select="./text()"/>
                            </li>
                        </xsl:for-each>
                    </ul>
                </xsl:if>
                <xsl:variable name="xmlid" select="@xml:id"/>
                <div id="mentions" class="mt-2">
                    <span class="infodesc mr-2">
                        <legend>Veranstaltungsort von</legend>
                        <xsl:call-template name="render-events-for-key">
                            <xsl:with-param name="elementName" select="'placeName'"/>
                            <xsl:with-param name="xmlid" select="$xmlid"/>
                        </xsl:call-template>
                        
                    </span>
                </div>
            </div>
        </div>
    </xsl:template>
    <xsl:function name="mam:pmbChange">
        <xsl:param name="url" as="xs:string"/>
        <xsl:param name="entitytyp" as="xs:string"/>
        <xsl:value-of select="
                concat('https://pmb.acdh.oeaw.ac.at/apis/entities/entity/', $entitytyp, '/',
                substring-after($url, 'https://pmb.acdh.oeaw.ac.at/entity/'), '/detail')"/>
    </xsl:function>
    <!-- ORG -->
    <xsl:key name="place-lookup" match="tei:place" use="@xml:id"/>
    <xsl:template match="tei:org" name="org_detail">
        <xsl:param name="showNumberOfMentions" as="xs:integer" select="50000"/>
        <xsl:variable name="selfLink">
            <xsl:value-of select="concat(data(@xml:id), '.html')"/>
        </xsl:variable>
        <div class="card-body-index">
            <div id="mentions">
                <xsl:if test="key('only-relevant-uris', tei:idno/@subtype, $relevant-uris)[1]">
                    <p class="buttonreihe">
                        <xsl:variable name="idnos-of-current" as="node()">
                            <xsl:element name="nodeset_org">
                                <xsl:for-each select="tei:idno">
                                    <xsl:copy-of select="."/>
                                </xsl:for-each>
                            </xsl:element>
                        </xsl:variable>
                        <xsl:call-template name="mam:idnosToLinks">
                            <xsl:with-param name="idnos-of-current" select="$idnos-of-current"/>
                        </xsl:call-template>
                    </p>
                </xsl:if>
            </div>
            <xsl:variable name="ersterName" select="tei:orgName[1]"/>
            <xsl:if test="tei:orgName[2]">
                <p>
                    <xsl:for-each
                        select="distinct-values(tei:orgName[@type = 'ort_alternative-name'])">
                        <xsl:if test=". != $ersterName">
                            <xsl:value-of select="."/>
                        </xsl:if>
                        <xsl:if test="not(position() = last())">
                            <xsl:text>, </xsl:text>
                        </xsl:if>
                    </xsl:for-each>
                </p>
            </xsl:if>
            <xsl:if test="tei:location">
                <div>
                    <ul>
                        <legend>Orte</legend>
                        <li>
                            <xsl:for-each
                                select="tei:location/tei:placeName[not(. = preceding-sibling::tei:placeName)]">
                                <xsl:variable name="key-or-ref" as="xs:string?">
                                    <xsl:value-of
                                        select="concat(replace(@key, 'place__', 'pmb'), replace(@ref, 'place__', 'pmb'))"
                                    />
                                </xsl:variable>
                                <xsl:choose>
                                    <xsl:when test="key('place-lookup', $key-or-ref, $places)">
                                        <xsl:element name="a">
                                            <xsl:attribute name="href">
                                                <xsl:value-of select="concat($key-or-ref, '.html')"
                                                />
                                            </xsl:attribute>
                                            <xsl:value-of select="."/>
                                        </xsl:element>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:value-of select="."/>
                                    </xsl:otherwise>
                                </xsl:choose>
                                <xsl:if test="not(position() = last())">
                                    <xsl:text>, </xsl:text>
                                </xsl:if>
                            </xsl:for-each>
                        </li>
                    </ul>
                </div>
            </xsl:if>
            <xsl:variable name="xmlid" select="@xml:id"/>
            <div id="mentions" class="mt-2">
                <span class="infodesc mr-2">
                    <legend>Veranstaltungen</legend>
                    <xsl:call-template name="render-events-for-key">
                        <xsl:with-param name="elementName" select="'orgName'"/>
                        <xsl:with-param name="xmlid" select="$xmlid"/>
                    </xsl:call-template>
                    
                </span>
            </div>
        </div>
    </xsl:template>
    <xsl:function name="mam:ahref-namen">
        <xsl:param name="typityp" as="xs:string"/>
        <xsl:choose>
            <xsl:when test="$typityp = 'schnitzler-tagebuch'">
                <xsl:text> Tagebuch</xsl:text>
            </xsl:when>
            <xsl:when test="$typityp = 'schnitzler-briefe'">
                <xsl:text> Briefe</xsl:text>
            </xsl:when>
            <xsl:when test="$typityp = 'schnitzler-lektueren'">
                <xsl:text> Lektüren</xsl:text>
            </xsl:when>
            <xsl:when test="$typityp = 'PMB'">
                <xsl:text> PMB</xsl:text>
            </xsl:when>
            <xsl:when test="$typityp = 'pmb'">
                <xsl:text> PMB</xsl:text>
            </xsl:when>
            <xsl:when test="$typityp = 'briefe_i'">
                <xsl:text> Briefe 1875–1912</xsl:text>
            </xsl:when>
            <xsl:when test="$typityp = 'briefe_ii'">
                <xsl:text> Briefe 1913–1931</xsl:text>
            </xsl:when>
            <xsl:when test="$typityp = 'DLAwidmund'">
                <xsl:text> Widmungsexemplar Deutsches Literaturarchiv</xsl:text>
            </xsl:when>
            <xsl:when test="$typityp = 'jugend-in-wien'">
                <xsl:text> Jugend in Wien</xsl:text>
            </xsl:when>
            <xsl:when test="$typityp = 'gnd'">
                <xsl:text> Wikipedia?</xsl:text>
            </xsl:when>
            <xsl:when test="$typityp = 'schnitzler-briefe'">
                <xsl:text> Bahr/Schnitzler</xsl:text>
            </xsl:when>
            <xsl:when test="$typityp = 'widmungDLA'">
                <xsl:text> Widmung DLA</xsl:text>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text> </xsl:text>
                <xsl:value-of select="$typityp"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>
    <xsl:template name="render-events-for-key">
        <xsl:param name="elementName"/>
        <xsl:param name="xmlid"/>
        
        <xsl:variable name="matchingEvents" select="$events/tei:event[descendant::*[name() = $elementName]/@key = $xmlid]"/>
        
        <xsl:choose>
            <xsl:when test="$matchingEvents[11]">
                <div class="accordion" id="eventAccordion">
                    <xsl:for-each-group select="$matchingEvents" group-by="substring(@when-iso, 1, 4)">
                        <xsl:sort select="current-grouping-key()" data-type="number"/>
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="heading-{@when-iso}">
                                <button class="accordion-button collapsed" type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapse-{current-grouping-key()}"
                                    aria-expanded="false"
                                    aria-controls="collapse-{current-grouping-key()}">
                                    <xsl:value-of select="current-grouping-key()"/>
                                    <xsl:choose>
                                        <xsl:when test="count(current-group()) = 1">
                                            <xsl:text> (ein Eintrag)</xsl:text>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:value-of select="concat(' (', count(current-group()), ' Einträge)')"/>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </button>
                            </h2>
                            
                            <div id="collapse-{current-grouping-key()}" class="accordion-collapse collapse"
                                aria-labelledby="heading-{current-grouping-key()}" data-bs-parent="#eventAccordion">
                                <div class="accordion-body">
                                    <xsl:choose>
                                        
                                        <!-- Wenn mehr als 10 Einträge, gruppiere nach Monat -->
                                        <xsl:when test="count(current-group()) > 10">
                                            <xsl:for-each-group select="current-group()" group-by="substring(@when-iso, 6, 2)">
                                                <xsl:sort select="current-grouping-key()" data-type="number"/>
                                                
                                                <!-- Monatsüberschrift -->
                                                <h5 class="mt-3">
                                                    <xsl:value-of select="mam:monat(current-group()[1]/@when-iso)"/>
                                                </h5>
                                                
                                                <ul>
                                                    <xsl:for-each select="current-group()">
                                                        <xsl:sort select="@when-iso"/>
                                                        <li>
                                                            <a href="{concat(@xml:id, '.html')}">
                                                                <xsl:value-of select="normalize-space(tei:eventName)"/>
                                                            </a>
                                                        </li>
                                                    </xsl:for-each>
                                                </ul>
                                            </xsl:for-each-group>
                                        </xsl:when>
                                        
                                        <!-- Sonst: normale flache Liste -->
                                        <xsl:otherwise>
                                            <ul>
                                                <xsl:for-each select="current-group()">
                                                    <xsl:sort select="@when-iso"/>
                                                    <li>
                                                        <a href="{concat(@xml:id, '.html')}">
                                                            <xsl:value-of select="normalize-space(tei:eventName)"/>
                                                        </a>
                                                    </li>
                                                </xsl:for-each>
                                            </ul>
                                        </xsl:otherwise>
                                        
                                    </xsl:choose>
                                </div>
                            </div>
                        </div>
                    </xsl:for-each-group>
                    
                </div>
            </xsl:when>
            <xsl:otherwise>
                <ul>
                    <xsl:for-each select="$matchingEvents">
                        <xsl:sort select="@when-iso"/>
                        <li>
                            <a href="{concat(@xml:id, '.html')}">
                                <xsl:value-of select="normalize-space(tei:eventName)"/>
                            </a>
                        </li>
                    </xsl:for-each>
                </ul>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
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
