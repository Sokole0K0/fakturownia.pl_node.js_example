const axios = require('axios');


const invoiceData = {
    api_token: "op0TCJMJ45gljQjGb34g/test-3",
    invoice: {
        kind:"vat",
        number: null,
        sell_date: "", 
        issue_date: "",
        payment_to_kind: 0,
        buyer_first_name : "Imie",
        buyer_last_name : "Nazwisko",
        buyer_email : "",
        buyer_company : "0",
        paid : "0,00",
        payment_type : "Przelew eletroniczny",
        positions:[
            {name: "Tranzakcja Share Parking", tax: 23, total_price_gross: 150, quantity: 1}
        ]	
    }
}

module.exports = {
        
    addData(invoiceImportData) {
        return new Promise(resolve => {
                invoiceData.invoice.buyer_first_name = invoiceImportData.name;
                invoiceData.invoice.buyer_last_name = invoiceImportData.surname;
                invoiceData.invoice.buyer_email = invoiceImportData.email;
                invoiceData.invoice.positions[0].total_price_gross = invoiceImportData.price;
                invoiceData.invoice.paid = invoiceImportData.price;

                let rawSelldate = invoiceImportData.startFromDate;
                let finalSellDate = rawSelldate.split(" ", 1);
                invoiceData.invoice.sell_date = finalSellDate[0].split('-').reverse().join('-');

                resolve(invoiceData);
            })
        },
    addInvoice(data){
        return new Promise((resolve,reject) => { axios({
                    method: 'post',
                    url: 'https://test-3.fakturownia.pl/invoices.json',
                    data: data
                    })
                    .then( response => {
                        console.log(response.data)
                        resolve(response.data.id)
                        })
                    .catch( error => { 
                        console.log(error.data);
                        reject(error.data)});
        })
    },
    sendEmail(invoiceId){
        return new Promise((resolve,reject) => { axios({
                    method: 'post',
                    url: 'https://test-3.fakturownia.pl/invoices/' + invoiceId + '/send_by_email.xml?api_token=op0TCJMJ45gljQjGb34g/test-3',
                    })
                    .then( response => resolve(response.data))
                    .catch( error =>  reject(error.data));
        })
    }
}