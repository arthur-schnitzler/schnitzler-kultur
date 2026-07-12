/**
 * Zitiervorschlag in die Zwischenablage kopieren.
 * Buttons mit der Klasse .copy-citation tragen den Text im
 * data-citation-Attribut; {DATUM} wird durch das Abfragedatum ersetzt.
 */
document.addEventListener('click', function (e) {
    var btn = e.target.closest('.copy-citation');
    if (!btn || !btn.dataset.citation) return;

    var heute = new Date().toLocaleDateString('de-AT', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
    var text = btn.dataset.citation.replace('{DATUM}', heute);

    function feedback() {
        if (btn.dataset.origLabel) return;
        btn.dataset.origLabel = btn.textContent;
        btn.textContent = 'Zitation kopiert ✓';
        btn.classList.add('copied');
        setTimeout(function () {
            btn.textContent = btn.dataset.origLabel;
            delete btn.dataset.origLabel;
            btn.classList.remove('copied');
        }, 2000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(feedback);
    } else {
        // Fallback für ältere Browser
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        feedback();
    }
});
