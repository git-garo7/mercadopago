const express = require("express");
const mercadopago = require("mercadopago");
const MercadoPago = require("mercadopago");
const app = express();

MercadoPago.configure({
    sandbox: true,
    access_token :"           "//criar a conta do mercado pago receber as chaves e colar elas aqui/https://www.mercadopago.com.br/registration-mp?confirmation_url=https://www.mercadopago.com.br/&rtx=50c3c921-288f-4daf-af36-a1071ddecd73
});//true devido aplicação estar em desenvolvimento

app.get("/",async (req,res)=>{
    res.send("olá mundo!!!");
});

    app.get("/pagar",(req,res)=>{
        var id = "" +Date.now();
        var emailDoPagador = "...@gmail.com";
        var dados = {
            items:[
                item = {//id sempre tem q ser unico em toda venda/podendo usar o UUID para isso
                    id :""+ Date.now(),//abre aspas("") e concatena(+) pra fazer string
                    description:"3x videogames;7x camisas", //ex de descrição de produto que pode pegar deu banco de dados
                    quantity: 1,//todos aqui vão ser exemplos
                    currency_id:'BRL',//exemplo de moeda brasileira
                    unit_price: parseFloat(150)
                }
            ],
            payer:{
                email: emailDoPagador
            },//todos os dados deveriam ser puxados de um banco de dados mas não conectei um são só exemplos
                external_reference: id//campo de pagamento concludo deve ter o  mesmo conteúdo do id
        }
        try{
            var Pagamento = await MercadoPago.preferences.create(dados);
        console.log(pagamento);
        //Banco.SalvarPagamento({id:id,pagador:emailDoPagador}); aqui chama banco de dados
        return res.redirect(pagamento.body.init_point);

        }catch(err){
            return res.send(err.message);
        } 
        
    });
    app.post("/not",(req,res)=>{
        var id = req.query.id;

        //MercadoPago.banco();
        setTimeout(()=>{

            var filtro = {
                "order.id": id
            }
            MercadoPago.payment.search({
                qs:filtro
            }).then(data =>{
                var pagamento = data.body.results[0];
                if(pagamento != undefined){
                    console.log(pagamento);
                    console.log(pagamento.external_reference);//saber exatamente oque é o pagamento.
                    console.log(pagamento.status);
                    //if(status=== "aproved"){
                      //  banco.definirComoPago(pagamento.external_reference)
                    //}
                }else{
                    console.log("pagament inexistente!");
                }
                console.log(data);
            }).catch(err =>{
                console.log(err);
            })

        },20000)

        res.send("ok");
    })//roota de notificação de pagamento mercado pago


app.listen(3000,(req,res) => {
    console.log("servidor rodando!");

});
//AQUI FAZ CONFIGURAÇÃO COM MERCADO PAGO SE COLOCAR O TOKEN(NA LINHA 7 LOGO ACIMA).