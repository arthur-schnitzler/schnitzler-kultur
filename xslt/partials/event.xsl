<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:mam="whatever" version="2.0" exclude-result-prefixes="xsl tei xs">

    <xsl:import href="./LOD-idnos.xsl"/>
    <xsl:param name="current-edition" select="'schnitzler-kultur'"/>
    <xsl:param name="current-colour" select="'#AC7790'"/>
    <xsl:param select="document('../utils/index_days.xml')" name="tb-days"/>
    <xsl:param select="document('../../data/indices/listbibl.xml')" name="works-index"/>

    <!-- Alle Ereignisse eines Ortes (für die Kontext-Karte) -->
    <xsl:key name="events-by-place" match="tei:event"
        use="tei:listPlace/tei:place/tei:placeName/@key"/>
    <!-- Werke im Werkverzeichnis (für Autor/Jahr) -->
    <xsl:key name="work-by-id" match="tei:bibl[@xml:id]" use="@xml:id"/>

    <xsl:template match="tei:event" name="event_detail">
        <xsl:param name="showNumberOfMentions" as="xs:integer" select="50000"/>
        <xsl:variable name="selfLink">
            <xsl:value-of select="concat(data(@xml:id), '.html')"/>
        </xsl:variable>
        <div class="container-fluid">
            <div class="event-article">
                <header class="event-head">
                    <p class="event-kicker">
                        <span class="event-kicker-type">
                            <xsl:choose>
                                <xsl:when test="normalize-space(tei:eventName[1]/@n)">
                                    <xsl:value-of select="tei:eventName[1]/@n"/>
                                </xsl:when>
                                <xsl:otherwise>Veranstaltung</xsl:otherwise>
                            </xsl:choose>
                        </span>
                        <span class="event-kicker-sep" aria-hidden="true"> — </span>
                        <span class="event-kicker-id">
                            <xsl:text>PMB </xsl:text>
                            <xsl:value-of select="substring-after(@xml:id, 'pmb')"/>
                        </span>
                    </p>
                    <xsl:if test="normalize-space(tei:eventName[1])">
                        <xsl:variable name="titletext"
                            select="normalize-space(tei:eventName[1])"/>
                        <xsl:variable name="firstwork"
                            select="normalize-space(tei:listBibl/tei:bibl[not(tei:note[contains(., 'rezensi')])][1]/tei:title)"/>
                        <h1 class="event-title">
                            <xsl:choose>
                                <!-- Werktitel im Ereignisnamen kursiv auszeichnen -->
                                <xsl:when
                                    test="$firstwork != '' and contains($titletext, $firstwork)">
                                    <xsl:value-of
                                        select="substring-before($titletext, $firstwork)"/>
                                    <em>
                                        <xsl:value-of select="$firstwork"/>
                                    </em>
                                    <xsl:value-of
                                        select="substring-after($titletext, $firstwork)"/>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:value-of select="$titletext"/>
                                </xsl:otherwise>
                            </xsl:choose>
                        </h1>
                    </xsl:if>
                    <p class="event-date">
                        <span class="event-date-text">
                            <xsl:choose>
                                <xsl:when test="@from-iso and @to-iso">
                                    <xsl:value-of select="mam:wochentag(@from-iso)"/>
                                    <xsl:text>, </xsl:text>
                                    <xsl:value-of select="format-date(@from-iso, '[D1]. ')"/>
                                    <xsl:value-of select="mam:monat(@from-iso)"/>
                                    <xsl:value-of select="format-date(@from-iso, ' [Y]')"/>
                                    <xsl:text> bis </xsl:text>
                                    <xsl:value-of select="mam:wochentag(@to-iso)"/>
                                    <xsl:text>, </xsl:text>
                                    <xsl:value-of select="format-date(@to-iso, '[D1]. ')"/>
                                    <xsl:value-of select="mam:monat(@to-iso)"/>
                                    <xsl:value-of select="format-date(@to-iso, ' [Y]')"/>
                                </xsl:when>
                                <xsl:when
                                    test="(@from-iso = '' or not(@from-iso)) and @to-iso">
                                    <xsl:text>bis </xsl:text>
                                    <xsl:value-of select="mam:wochentag(@to-iso)"/>
                                    <xsl:text>, </xsl:text>
                                    <xsl:value-of select="format-date(@to-iso, '[D1]. ')"/>
                                    <xsl:value-of select="mam:monat(@to-iso)"/>
                                    <xsl:value-of select="format-date(@to-iso, ' [Y]')"/>
                                </xsl:when>
                                <xsl:when test="@when-iso">
                                    <xsl:value-of select="mam:wochentag(@when-iso)"/>
                                    <xsl:text>, </xsl:text>
                                    <xsl:value-of select="format-date(@when-iso, '[D1]. ')"/>
                                    <xsl:value-of select="mam:monat(@when-iso)"/>
                                    <xsl:value-of select="format-date(@when-iso, ' [Y]')"/>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:text>Datum unbekannt</xsl:text>
                                </xsl:otherwise>
                            </xsl:choose>
                        </span>
                        <xsl:if test="@when-iso">
                            <a class="event-date-link" target="_blank">
                                <xsl:attribute name="href">
                                    <xsl:value-of
                                        select="concat('https://schnitzler-chronik.acdh.oeaw.ac.at/', @when-iso, '.html')"
                                    />
                                </xsl:attribute>
                                <xsl:text>Dieser Tag in der Schnitzler-Chronik →</xsl:text>
                            </a>
                            <xsl:variable name="when" select="@when-iso"/>
                            <xsl:if test="$tb-days/descendant::*:date[. = $when][1]">
                                <a class="event-date-link" target="_blank">
                                    <xsl:attribute name="href">
                                        <xsl:value-of
                                            select="concat('https://schnitzler-tagebuch.acdh.oeaw.ac.at/entry__', $when, '.html')"
                                        />
                                    </xsl:attribute>
                                    <xsl:text>Dieser Tag im Schnitzler-Tagebuch →</xsl:text>
                                </a>
                            </xsl:if>
                        </xsl:if>
                    </p>
                </header>

                <div class="event-body">
                    <div class="event-main">

                        <!-- Aufgeführte Werke -->
                        <xsl:variable name="werke"
                            select="tei:listBibl/tei:bibl[not(tei:note[contains(., 'rezensi')]) and normalize-space(tei:title)]"/>
                        <xsl:if test="$werke">
                            <section class="event-section">
                                <h2 class="event-section-title">Aufgeführte Werke</h2>
                                <ol class="work-list">
                                    <xsl:for-each select="$werke">
                                        <xsl:variable name="workkey"
                                            select="tei:title/@key"/>
                                        <xsl:variable name="workentry"
                                            select="key('work-by-id', $workkey, $works-index)[1]"/>
                                        <li class="work-item">
                                            <span class="work-num">
                                                <xsl:value-of select="position()"/>
                                            </span>
                                            <div class="work-info">
                                                <a class="work-title"
                                                  href="{concat($workkey, '.html')}">
                                                  <xsl:value-of
                                                  select="normalize-space(tei:title)"/>
                                                </a>
                                                <xsl:variable name="autoren"
                                                  select="distinct-values(for $a in $workentry/tei:author return mam:vorname-nachname($a))"/>
                                                <xsl:if
                                                  test="$autoren[1] or normalize-space($workentry/tei:date[1])">
                                                  <p class="work-meta">
                                                  <xsl:value-of
                                                  select="string-join($autoren, ', ')"/>
                                                  <xsl:if
                                                  test="$autoren[1] and normalize-space($workentry/tei:date[1])">
                                                  <xsl:text> · </xsl:text>
                                                  </xsl:if>
                                                  <xsl:value-of
                                                  select="normalize-space($workentry/tei:date[1])"
                                                  />
                                                  </p>
                                                </xsl:if>
                                            </div>
                                            <a class="work-link"
                                                href="{concat($workkey, '.html')}"
                                                >Werkseite →</a>
                                        </li>
                                    </xsl:for-each>
                                </ol>
                            </section>
                        </xsl:if>

                        <!-- Rezensionen -->
                        <xsl:variable name="rezensionen"
                            select="tei:listBibl/tei:bibl[tei:note[contains(., 'rezensi')] and normalize-space(tei:title)]"/>
                        <xsl:if test="$rezensionen">
                            <section class="event-section">
                                <h2 class="event-section-title">Rezensionen</h2>
                                <ol class="work-list">
                                    <xsl:for-each select="$rezensionen">
                                        <li class="work-item">
                                            <span class="work-num">
                                                <xsl:value-of select="position()"/>
                                            </span>
                                            <div class="work-info">
                                                <a class="work-title"
                                                  href="{concat(tei:title/@key, '.html')}">
                                                  <xsl:value-of
                                                  select="normalize-space(tei:title)"/>
                                                </a>
                                            </div>
                                            <a class="work-link"
                                                href="{concat(tei:title/@key, '.html')}"
                                                >Werkseite →</a>
                                        </li>
                                    </xsl:for-each>
                                </ol>
                            </section>
                        </xsl:if>

                        <!-- Mitwirkende -->
                        <xsl:variable name="mitwirkende"
                            select="tei:listPerson/tei:person[@role = 'hat als Arbeitskraft' or contains(@role, 'mitwirkend')]"/>
                        <xsl:if test="$mitwirkende">
                            <section class="event-section">
                                <h2 class="event-section-title">Mitwirkende</h2>
                                <div class="person-chips">
                                    <xsl:for-each select="$mitwirkende">
                                        <xsl:call-template name="person-chip"/>
                                    </xsl:for-each>
                                </div>
                            </section>
                        </xsl:if>

                        <!-- Teilnehmende -->
                        <xsl:variable name="teilnehmende"
                            select="tei:listPerson/tei:person[@role = 'hat als Teilnehmer:in' or contains(@role, 'teilnehmend')]"/>
                        <xsl:if test="$teilnehmende">
                            <section class="event-section">
                                <h2 class="event-section-title">Teilnehmende</h2>
                                <div class="person-chips">
                                    <xsl:for-each select="$teilnehmende">
                                        <xsl:call-template name="person-chip"/>
                                    </xsl:for-each>
                                </div>
                            </section>
                        </xsl:if>

                        <!-- Beteiligte Institutionen -->
                        <xsl:if test="tei:note[@type = 'listorg']/tei:listOrg/tei:org">
                            <section class="event-section">
                                <h2 class="event-section-title">Beteiligte Institutionen</h2>
                                <div class="person-chips">
                                    <xsl:for-each
                                        select="tei:note[@type = 'listorg']/tei:listOrg/tei:org">
                                        <a class="person-chip"
                                            href="{concat(tei:orgName/@key, '.html')}">
                                            <span class="chip-avatar" aria-hidden="true">
                                                <xsl:value-of
                                                  select="upper-case(substring(normalize-space(tei:orgName), 1, 1))"
                                                />
                                            </span>
                                            <span class="chip-body">
                                                <span class="chip-name">
                                                  <xsl:value-of
                                                  select="normalize-space(tei:orgName)"/>
                                                </span>
                                                <span class="chip-role">Institution</span>
                                            </span>
                                        </a>
                                    </xsl:for-each>
                                </div>
                            </section>
                        </xsl:if>

                        <!-- Zeitgenössische Tageszeitungen -->
                        <xsl:if test="@when-iso">
                            <section class="event-section">
                                <h2 class="event-section-title">Zeitgenössische
                                    Tageszeitungen</h2>
                                <div class="newspaper-cards">
                                    <a class="newspaper-card" target="_blank">
                                        <xsl:attribute name="href">
                                            <xsl:value-of
                                                select="concat('https://anno.onb.ac.at/cgi-content/anno?datum=', replace(@when-iso, '-', ''))"
                                            />
                                        </xsl:attribute>
                                        <span class="newspaper-card-title">ANNO –
                                            Österreich</span>
                                        <span class="newspaper-card-sub">
                                            <xsl:text>Zeitungen vom </xsl:text>
                                            <xsl:value-of
                                                select="format-date(@when-iso, '[D01].[M01].[Y]')"/>
                                            <xsl:text> ↗</xsl:text>
                                        </span>
                                    </a>
                                    <a class="newspaper-card" target="_blank">
                                        <xsl:attribute name="href">
                                            <xsl:value-of
                                                select="concat('https://www.deutsche-digitale-bibliothek.de/newspaper/select/month?day=', day-from-date(@when-iso), '&amp;month=', month-from-date(@when-iso), '&amp;year=', year-from-date(@when-iso))"
                                            />
                                        </xsl:attribute>
                                        <span class="newspaper-card-title">DDB –
                                            Deutschland</span>
                                        <span class="newspaper-card-sub">
                                            <xsl:text>Zeitungen vom </xsl:text>
                                            <xsl:value-of
                                                select="format-date(@when-iso, '[D01].[M01].[Y]')"/>
                                            <xsl:text> ↗</xsl:text>
                                        </span>
                                    </a>
                                    <!-- Theaterzettel für Burgtheater/Hofoper -->
                                    <xsl:if
                                        test="(descendant::tei:placeName/@key = 'pmb14' or descendant::tei:placeName/@key = 'pmb185621') and not(contains(tei:eventName/@n, 'robe'))">
                                        <a class="newspaper-card" target="_blank">
                                            <xsl:attribute name="href">
                                                <xsl:choose>
                                                  <xsl:when
                                                  test="year-from-date(@when-iso) &lt; 1899">
                                                  <xsl:value-of
                                                  select="concat('https://anno.onb.ac.at/cgi-content/anno?aid=wtz&amp;datum=', replace(@when-iso, '-', ''))"
                                                  />
                                                  </xsl:when>
                                                  <xsl:otherwise>
                                                  <xsl:value-of
                                                  select="concat('https://anno.onb.ac.at/cgi-content/anno?aid=bth&amp;datum=', replace(@when-iso, '-', ''))"
                                                  />
                                                  </xsl:otherwise>
                                                </xsl:choose>
                                            </xsl:attribute>
                                            <span class="newspaper-card-title">Theaterzettel</span>
                                            <span class="newspaper-card-sub">
                                                <xsl:text>ANNO, </xsl:text>
                                                <xsl:value-of
                                                  select="format-date(@when-iso, '[D01].[M01].[Y]')"/>
                                                <xsl:text> ↗</xsl:text>
                                            </span>
                                        </a>
                                    </xsl:if>
                                </div>
                            </section>
                        </xsl:if>
                    </div>

                    <aside class="event-side">

                        <!-- Ort -->
                        <xsl:variable name="erster-ort"
                            select="tei:listPlace/tei:place[normalize-space(tei:placeName)][1]"/>
                        <xsl:if test="$erster-ort">
                            <div class="side-card">
                                <xsl:if test="$erster-ort/tei:location/tei:geo">
                                    <div id="map_detail" class="side-card-map"/>
                                </xsl:if>
                                <div class="side-card-body">
                                    <h2 class="side-card-title">
                                        <xsl:value-of
                                            select="normalize-space($erster-ort/tei:placeName)"/>
                                    </h2>
                                    <xsl:for-each
                                        select="tei:listPlace/tei:place[normalize-space(tei:placeName)][position() &gt; 1]">
                                        <p class="side-card-sub">
                                            <xsl:value-of
                                                select="normalize-space(tei:placeName)"/>
                                        </p>
                                    </xsl:for-each>
                                    <p class="side-card-links">
                                        <a href="{concat($erster-ort/tei:placeName/@key, '.html')}"
                                            >Ortsseite →</a>
                                        <xsl:if test="$erster-ort/tei:location/tei:geo">
                                            <xsl:variable name="mlat"
                                                select="replace(tokenize($erster-ort/tei:location[1]/tei:geo[1], '\s')[1], ',', '.')"/>
                                            <xsl:variable name="mlong"
                                                select="replace(tokenize($erster-ort/tei:location[1]/tei:geo[1], '\s')[2], ',', '.')"/>
                                            <a target="_blank"
                                                href="{concat('https://www.openstreetmap.org/?mlat=', $mlat, '&amp;mlon=', $mlong, '#map=15/', $mlat, '/', $mlong)}"
                                                >OpenStreetMap ↗</a>
                                        </xsl:if>
                                    </p>
                                </div>
                            </div>
                        </xsl:if>

                        <!-- Datensatz -->
                        <div class="side-card">
                            <div class="side-card-body">
                                <h2 class="side-card-title side-card-title-small">Datensatz</h2>
                                <ul class="record-list">
                                    <xsl:for-each
                                        select="tei:idno[@subtype = 'pmb' and normalize-space(.)]">
                                        <li>
                                            <span class="record-label">PMB</span>
                                            <a target="_blank" href="{normalize-space(.)}">
                                                <xsl:value-of
                                                  select="concat('Eintrag ', substring-after(ancestor::tei:event/@xml:id, 'pmb'), ' ↗')"
                                                />
                                            </a>
                                        </li>
                                    </xsl:for-each>
                                    <xsl:if test="@when-iso">
                                        <li>
                                            <span class="record-label">Chronik</span>
                                            <a target="_blank"
                                                href="{concat('https://schnitzler-chronik.acdh.oeaw.ac.at/', @when-iso, '.html')}">
                                                <xsl:value-of
                                                  select="concat(@when-iso, ' ↗')"/>
                                            </a>
                                        </li>
                                    </xsl:if>
                                    <li>
                                        <span class="record-label">XML/TEI</span>
                                        <a href="listevent.xml">Quelldaten ↓</a>
                                    </li>
                                </ul>
                                <button type="button" class="btn copy-citation">
                                    <xsl:attribute name="data-citation">
                                        <xsl:value-of select="normalize-space(tei:eventName[1])"/>
                                        <xsl:text>. In: Arthur Schnitzler: Kulturveranstaltungen. Konzert-, Theater-, Kinobesuche, Lesungen, Proben- und weitere Veranstaltungsteilnahmen. 1876–1931. Hg. von Martin Anton Müller und Laura Untner. https://schnitzler-kultur.acdh.oeaw.ac.at/</xsl:text>
                                        <xsl:value-of select="$selfLink"/>
                                        <xsl:text> (Abfrage {DATUM})</xsl:text>
                                    </xsl:attribute>
                                    <xsl:text>Zitiervorschlag kopieren</xsl:text>
                                </button>
                            </div>
                        </div>

                        <!-- Kontext -->
                        <xsl:if test="$erster-ort">
                            <xsl:variable name="placekey"
                                select="$erster-ort/tei:placeName/@key"/>
                            <xsl:variable name="weitere"
                                select="count(key('events-by-place', $placekey)) - 1"/>
                            <xsl:if test="$weitere &gt; 0">
                                <div class="side-card side-card-context">
                                    <div class="side-card-body">
                                        <h2 class="side-card-title side-card-title-small">
                                            <xsl:value-of
                                                select="concat('Im ', normalize-space($erster-ort/tei:placeName))"
                                            />
                                        </h2>
                                        <p class="side-card-context-text">
                                            <xsl:text>Schnitzler besuchte </xsl:text>
                                            <xsl:value-of select="$weitere"/>
                                            <xsl:choose>
                                                <xsl:when test="$weitere = 1">
                                                  <xsl:text> weitere Veranstaltung</xsl:text>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                  <xsl:text> weitere Veranstaltungen</xsl:text>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                            <xsl:text> an diesem Ort.</xsl:text>
                                        </p>
                                        <p class="side-card-links">
                                            <a href="{concat($placekey, '.html')}">Alle
                                                Veranstaltungen hier →</a>
                                        </p>
                                    </div>
                                </div>
                            </xsl:if>
                        </xsl:if>
                    </aside>
                </div>
            </div>
        </div>
    </xsl:template>

    <!-- Personen-Chip mit Initialen-Avatar, Name und Rolle -->
    <xsl:template name="person-chip">
        <xsl:variable name="name" select="tei:persName"/>
        <xsl:variable name="anzeigename">
            <xsl:choose>
                <xsl:when test="matches($name, '^[^,]+,\s*[^,]+$')">
                    <xsl:value-of
                        select="concat(normalize-space(substring-after($name, ',')), ' ', normalize-space(substring-before($name, ',')))"
                    />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="normalize-space($name)"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="initialen">
            <xsl:choose>
                <xsl:when test="matches($name, '^[^,]+,\s*[^,]+$')">
                    <xsl:value-of
                        select="upper-case(concat(substring(normalize-space(substring-after($name, ',')), 1, 1), substring(normalize-space(substring-before($name, ',')), 1, 1)))"
                    />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="upper-case(substring(normalize-space($name), 1, 1))"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="rolle">
            <xsl:choose>
                <xsl:when test="@role = 'hat als Arbeitskraft'">Arbeitskraft</xsl:when>
                <xsl:when test="contains(@role, 'mitwirkend')">Mitwirkung</xsl:when>
                <xsl:otherwise>Teilnahme</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <a class="person-chip" href="{concat($name/@key, '.html')}">
            <span class="chip-avatar" aria-hidden="true">
                <xsl:value-of select="$initialen"/>
            </span>
            <span class="chip-body">
                <span class="chip-name">
                    <xsl:value-of select="$anzeigename"/>
                </span>
                <span class="chip-role">
                    <xsl:value-of select="$rolle"/>
                </span>
            </span>
        </a>
    </xsl:template>

    <xsl:function name="mam:vorname-nachname" as="xs:string">
        <xsl:param name="name"/>
        <xsl:choose>
            <xsl:when test="matches($name, '^[^,]+,\s*[^,]+$')">
                <xsl:value-of
                    select="concat(normalize-space(substring-after($name, ',')), ' ', normalize-space(substring-before($name, ',')))"
                />
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="normalize-space($name)"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>

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
