var janelaCss = document.createElement('style')
janelaCss.innerText = `
#janela {
    width: 50px;
    height: 50px;
    background-color: green;
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

var html = document.body.innerHTML

var regex = /"actual_price":(\d+(\.\d+)?)/;
var match = html.match(regex);
var preco = match[1];


regex = /"item_id":"([A-Z0-9]+)"/;
match = html.match(regex);
var mlid = match[1];

regex = /"collectorNickname":"([^"]+)"/;
match = html.match(regex);
var loja = match[1];

var tipo
var category_id
var time
var taxa
var sobra
var frete
var endereco

var xmlhttp = new XMLHttpRequest();
var url = "https://api.mercadolibre.com/items/" + mlid;
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var arr = JSON.parse(this.responseText);
        tipo = arr.listing_type_id
        category_id = arr.category_id
        time = arr.date_created.substr(8, 2) + '/' + arr.date_created.substr(5, 2) + '/' + arr.date_created.substr(0, 4)

        endereco = arr.seller_address.city.name + ' - ' + arr.seller_address.state.id.substr(3.2)

        var url = "https://api.mercadolibre.com/sites/MLB/listing_prices?price=" + preco + "&category_id=" + category_id + "&listing_type_id=" + tipo;
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var arr2 = JSON.parse(this.responseText);
                taxa = arr2.sale_fee_amount

                if(preco >= 79){
                    var url = "https://api.mercadolibre.com/items/" + mlid + "/shipping_options/free";
                    xmlhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            var arr = JSON.parse(this.responseText);
                            frete = arr.coverage.all_country.list_cost
                            printa()
                        }
                    };
                    xmlhttp.open("GET", url, true);
                    xmlhttp.send();
                }else{
                    frete = 0
                    printa()
                }
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();

    };

}
xmlhttp.open("GET", url, true);
xmlhttp.send();

function printa(){
    sobra = (preco-frete-taxa).toFixed(2);

    janelaTXT.innerHTML = `
    <b>Preço:</b> R$ ${preco}<br>
    <b>Frete:</b> R$ ${frete}<br>
    <b>Taxa:</b> R$ ${taxa}<br>
    <b>Loja:</b> ${loja}<br>
    <b>Cidade:</b> ${endereco}<br>
    <b>Inicio:</b> ${time}<br>
    <b>Sobra:</b> R$${sobra}
`

    janela.appendChild(janelaTXT)
    document.body.appendChild(janela)
}