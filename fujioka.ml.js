function run(){
    var janelaCss = document.createElement('style')
    janelaCss.innerText = `
#janela {
    width: 50px;
    height: 50px;
    /*background-color: green;*/
    position: fixed;
    top: 50px;
    left: 50px;
    border-radius: 10px;
    transition: width 0.3s, height 0.3s;
    padding: 10px;
    color: white;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.5);
    overflow: hidden;
    z-index: 9999;
}
.janelaOver {
    width: 200px!important;
    height: 200px!important;
}
#janelaTXT {
    width: 180px;
    height: 200px;
}
#janelaTXT a {
    color: white;
    text-decoration: underline;
}
`
    document.head.appendChild(janelaCss);

    var janela = document.createElement('div');
    janela.id = 'janela'
    janela.classList.add('janelaOver');

    var janelaTXT = document.createElement('div')
    janelaTXT.id = 'janelaTXT'

    janela.addEventListener('mouseover', function () {
        this.classList.add('janelaOver');
    });

    janela.addEventListener('mouseout', function () {
        this.classList.remove('janelaOver');
    });

    //product_ean
    var gtin = $('.value-field.GTIN').text()

    var html = document.head.innerHTML

    var regex = /"productPriceTo":"(\d+(\.\d+)?)"/;
    var match = html.match(regex);
    var custo = match[1];

    var mlid
    var preco
    var tipo
    var category_id
    var time
    var taxa
    var sobra
    var percent
    var frete
    var endereco
    var catalogo_id
    var vendas

    $.getJSON("https://api.mercadolibre.com/products/search?status=active&site_id=MLB&product_identifier="+gtin, function(data){
        catalogo_id = data.results[0].id
        if(data.results.length == 0) alert("Não encontrou catalogo")

        $.getJSON("https://api.mercadolibre.com/products/"+ data.results[0].id +"/items", function(d){
            mlid = d.results[0].item_id
            $.getJSON("https://api.mercadolibre.com/items/" + mlid, function(arr){
                //preco = arr.price
                tipo = arr.listing_type_id
                category_id = arr.category_id
                time = arr.date_created.substr(8, 2) + '/' + arr.date_created.substr(5, 2) + '/' + arr.date_created.substr(0, 4)

                endereco = arr.seller_address.city.name + ' - ' + arr.seller_address.state.id.substr(3.2)

                $.ajax({
                    url: "https://www.mercadolivre.com.br//p/"+catalogo_id,
                    type: "GET",
                    success: function(data) {
                        fim(data)
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status === 301) {
                            var novaUrl = jqXHR.getResponseHeader('Location');
                            $.ajax(novaURL, function(data){
                                fim(data)
                            })
                        }
                    }
                })
            })
        })
    })

    function fim(pagina){

        vendas = $(pagina).find('.ui-pdp-subtitle').text();
        vendas = vendas.match(/\+(\d+)(mil)?/)
        vendas = vendas[0]

        preco = $(pagina).find('meta[itemProp=price]').attr('content')
        console.log(preco)

        $.getJSON("https://api.mercadolibre.com/sites/MLB/listing_prices?price=" + preco + "&category_id=" + category_id + "&listing_type_id=" + tipo, function(arr2){
            taxa = arr2.sale_fee_amount

            if(preco >= 79){
                $.getJSON("https://api.mercadolibre.com/items/" + mlid + "/shipping_options/free", function(arr){
                    frete = arr.coverage.all_country.list_cost
                }).done(function(){
                    printa()
                }).fail(function(){
                    frete = -0.01
                    printa()
                })
            }else{
                frete = 0
                printa()
            }
        })
    }

    function printa(){
        sobra = (preco-frete-taxa-custo).toFixed(2);
        percent = (sobra/preco*100).toFixed(2);

        if(frete < 0) frete = "Frete ME1"

        if(sobra < 0){
            janela.style.backgroundColor = 'red'
        }else{
            janela.style.backgroundColor = 'green'
        }

        janelaTXT.innerHTML = `
    <b>Custo:</b> R$ ${custo}<br>
    <b>Preço:</b> R$ ${preco}<br>
    <b>Frete:</b> R$ ${frete}<br>
    <b>Taxa:</b> R$ ${taxa}<br>
    <b>Cidade:</b> ${endereco}<br>
    <b>Inicio:</b> ${time}<br>
    <b>Sobra:</b> R$${sobra} (${percent}%)<br>
    <b>Vendas:</b> ${vendas}<br>
    <a href="https://www.mercadolivre.com.br//p/${catalogo_id}" target="_blank">Link catalogo</a>
`

        janela.appendChild(janelaTXT)
        document.body.appendChild(janela)
    }
}

setTimeout(run, 300);
