const xlsx = require('xlsx');
const fs = require('fs');

const workbook = xlsx.readFile('./Габаритні та приєднувальні розміри» (Dimensional Specifications) для категорії «Подшипниковые узлы», сформована спеціально для інженерів та к.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rawData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

fs.writeFileSync('./parsed_bearings.json', JSON.stringify(rawData, null, 2));
console.log('Done!');
