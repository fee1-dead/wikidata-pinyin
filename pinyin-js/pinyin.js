const deps = ["mediawiki.Api"]

function fetch(text, success) {
    return $.getJSON(
        'https://pinyin-api.toolforge.org/api.rs',
        {
            value: text,
        },
        success,
    )
}

function main() {
    console.log("loaded");
    const lang = $('.language-lexical-category-widget_language a').text()
    if (lang !== 'Standard Mandarin') return

    $('.wikibase-lexeme-form-id').each(function () {
        const id = $(this).text()
        const form_id = id.split('-')[1]
        const form = $('#' + form_id)
        const header = form.find('.wikibase-lexeme-form-header')
        const list = $('<ul></ul>')
        header.after(list)
        const button = $('<button>Apply</button>')
        list.after(button)
        button.on('click', function (e) {
            e.preventDefault()
            const api = new mw.Api();
            const promises = []

            list.find("input").each(function () {
                if ($(this).is(":checked")) {
                    const promise = api.postWithToken("csrf", {
                        action: 'wbcreateclaim',
                        entity: id,
                        snaktype: 'value',
                        property: 'P1721',
                        summary: 'via [[User:0xDeadbeef/pinyin.js]]',
                        value: '"' + $(this).val() + '"',
                    }).fail(function (_, data) {
                        console.log(api.getErrorMessage(data).text());
                    });
                    promises.push(promise)
                }
            })

            $.when.apply(null, promises).done(function() {
                location.reload()
            })
        })
        const values = new Set()
        const promises = []
        $(this).parent().find('.representation-widget_representation-value').each(function () {
            const character = $(this).text().trim();

            promises.push(fetch(character, function (res) {
                for (const value of res)
                    for (const elem of value)
                        values.add(`${elem}`)
            }))
        });
        $.when.apply(null, promises).done(() => {
            values.forEach(x => {
                const p = $('<li><input type="checkbox" value="' + x + '"> <label>' + x + ' </label></li>')
                list.append(p)
            })
        })
    })
};

mw.loader.load(deps)

jQuery(main);