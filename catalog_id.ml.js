function run(){
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
    $('.ui-search-layout__item, .ui-recommendations-card').each(function(i){
        href = $(this).find('a').attr('href')
        if(href.substr(0,11) == 'https://www'){
            mlid = href.split('/')[5].split('?')[0]
            mlid = mlid.split('#')[0]
            $(this).prepend('<div class="mlid-cat">'+mlid+'</div>')
        }
    })
}

run();
setTimeout(run, 5000);
