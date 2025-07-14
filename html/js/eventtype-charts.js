                            // Hilfsfunktion: Zufällig viele gut unterscheidbare Farben generieren
                            function generateColors(count) {
                            const colors = [];
                            for (let i = 0; i < count; i++) {
                            const hue = (i * 137.508) % 360; // goldener Winkel für gleichmäßige Verteilung
                            colors.push(`hsl(${hue}, 65%, 60%)`);
                            }
                            return colors;
                            }
                            
                            // Veranstaltungsarten (alle, dynamisch gefärbt)
                            const eventTypes = {
                            labels: [<xsl:call-template name="labels">
                            <xsl:with-param name="xpath" select="//tei:event/tei:eventName/@n"/>
                            </xsl:call-template>],
                            data: [<xsl:call-template name="counts">
                                <xsl:with-param name="xpath" select="//tei:event/tei:eventName/@n"/>
                            </xsl:call-template>]
                            };
                            eventTypes.backgroundColors = generateColors(eventTypes.labels.length);
                            
                            new Chart(document.getElementById("chartTypes"), {
                            type: 'pie',
                            data: {
                            labels: eventTypes.labels,
                            datasets: [{
                            data: eventTypes.data,
                            backgroundColor: eventTypes.backgroundColors
                            }]
                            },
                            options: {
                            responsive: true,
                            plugins: {
                            legend: { position: 'right' },
                            title: { display: true, text: 'Veranstaltungsarten' }
                            }
                            }
                            });
                            
                            // Personen (ohne bestimmte ID)
                            const eventPeople = {
                            labels: [<xsl:call-template name="labels">
                                <xsl:with-param name="xpath" select="//tei:event//tei:persName[not(@key='pmb2121')]/@key"/>
                            </xsl:call-template>],
                            data: [<xsl:call-template name="counts">
                                <xsl:with-param name="xpath" select="//tei:event//tei:persName[not(@key='pmb2121')]/@key"/>
                            </xsl:call-template>]
                            };
                            
                            // Orte
                            const eventPlaces = {
                            labels: [<xsl:call-template name="labels">
                                <xsl:with-param name="xpath" select="//tei:event//tei:placeName/@key"/>
                            </xsl:call-template>],
                            data: [<xsl:call-template name="counts">
                                <xsl:with-param name="xpath" select="//tei:event//tei:placeName/@key"/>
                            </xsl:call-template>]
                            };
                            
                            // Allgemeine Chart-Zeichnung für Balkendiagramme
                            function drawChart(id, chartData, title) {
                            new Chart(document.getElementById(id), {
                            type: 'bar',
                            data: {
                            labels: chartData.labels,
                            datasets: [{
                            label: title,
                            data: chartData.data,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                            }]
                            },
                            options: {
                            responsive: true,
                            plugins: {
                            legend: { display: false },
                            title: { display: true, text: title }
                            },
                            scales: {
                            y: {
                            beginAtZero: true,
                            ticks: { precision: 0 }
                            }
                            }
                            }
                            });
                            }
                            
                            drawChart("chartPeople", eventPeople, "Teilnehmer:innen");
                            drawChart("chartPlaces", eventPlaces, "Orte");
                    