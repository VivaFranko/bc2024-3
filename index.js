const fs = require('fs');
const { Command } = require('commander');

const program = new Command();

program.configureOutput({
    writeErr: (str) => {
        if (str.includes("option '-i, --input <file>' argument missing")) {
            console.error('Please, specify input file');
        } else if (str.includes("option '-o, --output <file>' argument missing")) {
            // Перевіряємо, чи задано -i
            if (program.opts().input) {
                console.error('Please, specify output file');
            } else {
                console.error('Please, specify input file');
            }
        } else {
            console.error(str);
        }
    }
});

// Визначаємо відомі параметри
program
    .option('-i, --input <file>', 'шлях до файлу для читання (json)')
    .option('-o, --output <file>', 'шлях до файлу для запису результату')
    .option('-d, --display', 'вивести результат у консоль')
    .parse(process.argv);

const options = program.opts();

// Перевірка, чи вказано input
if (!options.input) {
    console.error('Please, specify input file');
    process.exit(1); // Вихід з кодом помилки
}

// Перевірка, чи існує файл input
if (!fs.existsSync(options.input)) {
    console.error('Cannot find input file');
    process.exit(1); // Вихід з кодом помилки
}

// Ваш основний код для читання, обробки і виводу даних
const jsonStr = fs.readFileSync(options.input, {
    encoding: 'utf-8',
    flag: 'r',
});
const data = JSON.parse(jsonStr);
const newData = data
    .filter((item) => item.parent === 'BS3_BanksLiab')
    .map((item) => `${item.txten}:${item.value}`);
const newjsonStr = JSON.stringify(newData);

if (options.output) {
    fs.writeFileSync(options.output, newjsonStr, {
        encoding: 'utf-8',
    });
}

if (options.display) console.log(newjsonStr);
