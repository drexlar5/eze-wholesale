const fs = require('fs')
const mongoose = require('mongoose');
const config = require('./src/config/config');

exports.connection = () => {
    return mongoose.connect(config.mongoConnection,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    );
}

// this.connection()
// .then(result => {
//  console.info(`server connected at port: mongo`);
// })
// .catch(err => console.log(err));


const excelToJson = require('convert-excel-to-json');

const result = excelToJson({
    sourceFile: 'iphoneTemplate.xlsx'
});

let deviceNames = [
    'iPhone XS Max',
    'iPhone XS',
    'iPhone XR',
    'iPhone X',
    'iPhone 8 PLUS',
    'iPhone 8',
    'iPhone 7 Plus',
    'iPhone 7',
    'iPhone 6S Plus',
    'iPhone 6S',
    'iPhone 6 Plus',
    'iPhone 6',
    'iPhone SE'
]

// fs.writeFileSync('abc.json', JSON.stringify(result.IPHONES))
// console.log(result.IPHONES[0])

let buyRequestArray = []
let sellRequestArray = []
let deviceName;
let storageSize;
let conditions = [
    'New', 'A1', 'A2',
    'B1', 'B2', 'C',
    'C/B', 'C/D'
]
let conditionsCount = 0;


for (const item of result.IPHONES) {
    for (let obj in item) {

        if (obj === 'A' && deviceNames.includes(item[obj]))
            deviceName = item[obj]

        if (obj === 'B' && item[obj] !== 'Storage Size')
            storageSize = item[obj]

        if (obj === 'C' && typeof item[obj] === 'string')
            break;

        if (obj > 'B' && obj < 'K') {
            let newObj = {
                deviceName,
                storageSize,
                condition: conditions[conditionsCount % 8],
                price: item[obj]
            }
            buyRequestArray.push(newObj);
        } else if (obj > 'M' && obj < 'V') {
            let newObj = {
                deviceName,
                storageSize,
                condition: conditions[conditionsCount % 8],
                price: item[obj]
            }
            sellRequestArray.push(newObj);
        }
        conditionsCount++;
    }
    console.log(buyRequestArray, sellRequestArray)
}
