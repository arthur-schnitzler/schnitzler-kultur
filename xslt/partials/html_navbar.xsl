<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" exclude-result-prefixes="#all" version="2.0">
    <xsl:template match="/" name="nav_bar">
        <header>
            <nav aria-label="Primary" class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <a href="index.html" class="navbar-brand custom-logo-link" rel="home" itemprop="url">
                        <img src="./images/schnitzler-kultur.svg" class="img-fluid" title="{$project_short_title}"
                            alt="{$project_short_title}" itemprop="logo"/>
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Projekt</a>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a class="dropdown-item" href="about.html">Über das Projekt</a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="imprint.html">Impressum</a>
                                    </li>
                                </ul>
                            </li>

                            <li class="nav-item">
                                <a class="nav-link" href="listevent.html">Ereignisse</a>
                            </li>

                            <li class="nav-item dropdown disabled">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Register</a>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a class="dropdown-item" href="listperson.html">Personen</a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="listbibl.html">Werke</a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="listplace.html">Orte</a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="listorg.html">Organisationen</a>
                                    </li>
                                    
                                </ul>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="schnitzlerLinksDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Schnitzler</a>
                                <ul class="dropdown-menu" aria-labelledby="schnitzlerLinksDropdown">
                                    <li><a class="dropdown-item" href="https://de.wikipedia.org/wiki/Arthur_Schnitzler" target="_blank">Wikipedia</a></li>
                                    <li><a class="dropdown-item" href="https://www.geschichtewiki.wien.gv.at/Arthur_Schnitzler" target="_blank">Wien Geschichte Wiki</a></li>
                                    <li><a class="dropdown-item" href="https://schnitzler-tagebuch.acdh.oeaw.ac.at/" target="_blank">Tagebuch (1879–1931)</a></li>
                                    <li><a class="dropdown-item" href="https://schnitzler-briefe.acdh.oeaw.ac.at/" target="_blank">Briefe (1888–1931)</a></li>
                                    <li><a class="dropdown-item" href="https://www.arthur-schnitzler.de" target="_blank">Werke digital (1905–1931)</a></li>
                                    <li><a class="dropdown-item" href="https://schnitzler-mikrofilme.acdh.oeaw.ac.at/" target="_blank">Mikrofilme</a></li>
                                    <li><a class="dropdown-item" href="https://schnitzler-zeitungen.acdh.oeaw.ac.at/" target="_blank">Archiv der Zeitungsausschnitte</a></li>
                                    <li><a class="dropdown-item" href="https://schnitzler-interviews.acdh.oeaw.ac.at/" target="_blank">Interviews, Meinungen, Proteste</a></li>
                                    <li><a class="dropdown-item" href="https://wienerschnitzler.org/" target="_blank">Wiener Schnitzler – Schnitzlers Wien</a></li>
                                    <li><a class="dropdown-item" href="https://schnitzler-bahr.acdh.oeaw.ac.at/" target="_blank">Korrespondenz mit Hermann Bahr</a></li>
                                    <li><a class="dropdown-item" href="https://schnitzler-chronik.acdh.oeaw.ac.at/" target="_blank">Chronik</a></li>
                                    <li><a class="dropdown-item" href="https://schnitzler-lektueren.acdh.oeaw.ac.at/" target="_blank">Lektüren</a></li>
                                    <li><a class="dropdown-item" href="https://pollaczek.acdh.oeaw.ac.at/" target="_blank">Pollaczek: Schnitzler und ich</a></li>
                                    <li><a class="dropdown-item" href="https://pmb.acdh.oeaw.ac.at/" target="_blank" >PMB – Personen der Moderne Basis</a></li>
                                    
                                </ul>
                            </li>
                          <!--  <li class="nav-item">
                                <a title="Suche" class="nav-link" href="search.html"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-search">
                                        <circle cx="11" cy="11" r="8"/>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                </svg> SUCHE</a>
                            </li>-->
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    </xsl:template>
</xsl:stylesheet>