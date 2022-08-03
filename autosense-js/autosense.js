function handle(lexeme_id, statement_id, old_statement, new_statement) {
    if (!lexeme_id.startsWith("L")) return;
    if (old_statement !== null) return; // must be adding a new translation
}

function main() {
    // mw.hook('wikibase.statement.saved').add(handle)
    const translations = $('a[title="Property:P5972"]')
    translations.each(function() {
        $(this).after(" <button>Automate</button>")
    });
}

$(main)