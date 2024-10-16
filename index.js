const { program } = require("commander");
const fs = require("fs");

program
    .option("-i, --input <path>", "path to data.json")
    .option("-o, --output <path>", "path to output file")
    .option("-d, --display", "display results in console");

program.parse(process.argv);
const options = program.opts();
const input = options.input;
const output = options.output;
const display = options.display;

if (!input) {
    console.error("Please, specify input file");
    return;
}

if (!fs.existsSync(input)) {
    console.error("Cannot find input file");
    return;
}

if (!(output || display)) {
    return;
}

const jsonStr = fs.readFileSync(input, {
    encoding: "utf-8",
    flag: "r",
});
const data = JSON.parse(jsonStr);
const newData = data
    .filter((item) => item.parent === "BS3_BanksLiab")
    .map((item) => `${item.txten}:${item.value}`);
const newjsonStr = JSON.stringify(newData);

if (output) {
    fs.writeFileSync(output, newjsonStr, {
        encoding: "utf-8",
    });
}

if (display) console.log(newjsonStr);