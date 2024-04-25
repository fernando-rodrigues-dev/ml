function custo(id, category, price, listing, free_shipping) {
    $.getJSON('https://info.sisfy.com.br/ml.php?category=' + category + '&price=' + price + '&listing=' + listing + '&shipping=' + free_shipping, function (response) {
        $(response[0].bricks).each(function (i, v) {
            if (v.id == 'summary') {
                $(v.bricks).each(function (j, a) {
                    if (a.id == 'summary_container_col0_row3') {
                        $(a.bricks).each(function (k, c) {
                            if (c.id == 'summary_col0_row3') {
                                $('#cat-' + id).append('<br>' + c.data.text)
                            }
                        })
                    }
                })
            }
        })
    })
}

function run() {
    var style = document.createElement('style')
    style.innerText = `.mlid-cat{
background: red;
position: absolute;
z-index: 999;
padding: 1px 8px;
color: white;
font-weight: bold;
font-size: 13px;}`
    document.body.appendChild(style)

    var html
    var href
    var mlid
    var conta = 0;
    $('.ui-search-layout__item, .ui-recommendations-card').each(function (i) {
        html = $(this).html()
        href = $(this).find('a').attr('href')
        if (href.substr(0, 11) == 'https://www') {

            mlid = href.split('/')[5].split('?')[0]
            mlid = mlid.split('#')[0]

            var regex = /category:(.*?)#/;
            var match = href.match(regex);
            var category = match ? match[1] : null;

            var precoElement = $(this).find('.andes-money-amount.ui-search-price__part--medium');
            var centavos = precoElement.find('.andes-money-amount__cents').text();
            var valor = precoElement.find('.andes-money-amount__fraction').text() + '.' + (centavos == '' ? '00' : centavos);

            var regexSemJuros = /sem\s+juros/i;
            var resultado = regexSemJuros.test($(this).find('.ui-search-installments').html());
            var listing = resultado ? 'gold_pro' : 'gold_special';

            var regexFreteGratis = /Frete\s+grátis/i;
            var resFrrete = regexFreteGratis.test($(this).find('.ui-pb-container').html());
            var free_shipping = resFrrete ? 'true' : 'false';

            $(this).prepend('<div class="mlid-cat" id="cat-' + mlid + '">' + mlid + '</div>')

            setTimeout(function (url, id, category, valor, listing, free_shipping) {
                $.get(url, function (data) {
                    var startIndex = data.indexOf('<span class="ui-pdp-subtitle">Novo  |  +');
                    var endIndex = data.indexOf(' vendidos</span>', startIndex);
                    var vendas = data.substring(startIndex + 38, endIndex);
                    $('#cat-' + id).append('<br>' + vendas)
                })

                custo(id, category, valor, listing, free_shipping);

            }, 500 * conta, href, mlid, category, valor, listing, free_shipping)
            conta++;
        }
    })
}

setTimeout(run, 5000);
