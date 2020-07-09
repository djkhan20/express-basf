let ProductsVal = (products) => {
    let preData = []
    let columns = [
        "SKU",
        "Name",
        "Price",
        "Categories",
        "Plus"
      ]

    let regExps = [
    '^[a-zA-Z0-9]+$',
    '^[a-zA-Z0-9]+$',
    '^[0-9]+$',
    '^[A-Za-z]+$',
    '^[0-9]+$',
    ];
      
    products.slice(1).forEach((row, index) => {
        row.forEach((cell,cellInd) => {
        let re = new RegExp(regExps[cellInd])
        let status = re.test(cell)
        let format = status ? 'valid' : 'invalid';
        preData.push(`${columns[cellInd]} : ${format}`)
        });
    });
    console.log(preData);
    return preData;
}

module.exports.ProductsVal = ProductsVal;