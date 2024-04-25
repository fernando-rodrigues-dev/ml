function run() {
    var style = document.createElement('style')
    style.innerText = `.mlid-cat{
background: red;
position: absolute;
z-index: 999;
padding: 1px 8px;
color: white;
font-weight: bold;}`
    document.body.appendChild(style)

    var href
    var mlid
    var conta = 0;
    $('.ui-search-layout__item, .ui-recommendations-card').each(function (i) {
        href = $(this).find('a').attr('href')
        if (href.substr(0, 11) == 'https://www') {
            mlid = href.split('/')[5].split('?')[0]
            mlid = mlid.split('#')[0]
            $(this).prepend('<div class="mlid-cat" id="cat-' + mlid + '">' + mlid + '</div>')

            setTimeout(function (url, id) {
                $.get(url, function (data) {
                    var startIndex = data.indexOf('<span class="ui-pdp-subtitle">Novo  |  +');
                    var endIndex = data.indexOf(' vendidos</span>', startIndex);
                    var vendas = data.substring(startIndex + 38, endIndex);
                    $('#cat-' + id).append('<br>' + vendas)
                })
            }, 500 * conta, href, mlid)
            conta++;
        }
    })
}

run();
setTimeout(run, 5000);
