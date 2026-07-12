<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="#all" version="2.0">
    <xsl:include href="./params.xsl"/>
    <xsl:template match="/" name="html_head">
        <xsl:param name="html_title" select="$project_short_title"/>
        <xsl:param name="page_url" select="''"/>
        <xsl:variable name="full_url">
            <xsl:choose>
                <xsl:when test="$page_url != ''">
                    <xsl:value-of select="concat($base_url, $page_url)"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="$base_url"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="description">
            <xsl:choose>
                <xsl:when test="normalize-space($html_title) != normalize-space($project_short_title)">
                    <xsl:value-of select="concat($html_title, ' – ', $project_title)"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="$project_title"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="author" content="Martin Anton Müller, Laura Untner"/>
        <meta name="robots" content="index, follow"/>
        <title>
            <xsl:value-of select="$html_title"/>
        </title>
        <link rel="canonical" href="{$full_url}"/>
        <meta name="description" content="{$description}"/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="{$html_title}"/>
        <meta property="og:description" content="{$description}"/>
        <meta property="og:url" content="{$full_url}"/>
        <meta property="og:site_name" content="{$project_short_title}"/>
        <meta property="og:image" content="{concat($base_url, $project_logo)}"/>
        <meta property="og:locale" content="de_DE"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="{$html_title}"/>
        <meta name="twitter:description" content="{$description}"/>
        <meta name="twitter:image" content="{concat($base_url, $project_logo)}"/>
        <link href="vendor/bootstrap-5.3.5-dist/css/bootstrap.min.css" rel="stylesheet"/>
        <link rel="stylesheet" href="vendor/bootstrap-icons/font/bootstrap-icons.min.css"/>
        <link rel="stylesheet" href="css/style.css" type="text/css"/>
        <link rel="stylesheet" href="css/entities.css" type="text/css"/>
        <link rel="stylesheet" href="css/micro-editor.css" type="text/css"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400;1,600&amp;display=swap" rel="stylesheet"/>
        <link rel="stylesheet" href="css/theme.css" type="text/css"/>
        <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon-180x180.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png"/>
        <link rel="icon" type="image/png" sizes="96x96" href="images/favicon-96x96.png"/>
        <link rel="icon" type="image/png" sizes="192x192" href="images/android-chrome-192x192.png"/>
        <link rel="manifest" href="images/site.webmanifest"/>
        <meta name="msapplication-TileImage" content="images/mstile-150x150.png"/>
        <meta name="msapplication-TileColor" content="#ffffff"/>
        <!-- Matomo -->
        <script type="text/javascript">
            var _paq = _paq ||[];
            /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
            _paq.push([ 'trackPageView']);
            _paq.push([ 'enableLinkTracking']);
            (function () {
                var u = "https://matomo.acdh.oeaw.ac.at/";
                _paq.push([ 'setTrackerUrl', u + 'piwik.php']);
                _paq.push([ 'setSiteId', '289']);<!--
                171 is Matomo Code schnitzler - briefe//-->
            var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
            g.type = 'text/javascript';
            g. async = true;
            g.defer = true;
            g.src = u + 'piwik.js';
            s.parentNode.insertBefore(g, s);
        })();</script>
        <!-- End Matomo Code -->
        <script src="vendor/bootstrap-5.3.5-dist/js/bootstrap.bundle.min.js" defer="defer"/>
        <script src="js/entity-tabs.js" defer="defer"/>

    </xsl:template>
</xsl:stylesheet>
