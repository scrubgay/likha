const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const fm = require('front-matter');
const {marked} = require('marked');
const path = require('path');

function MDtoJSDOM(filePath) {
    const file = fs.readFileSync(filePath, 'utf-8');
    const parsedFile = fm(file); // splits out the front matter into body and attributes
    parsedFile.body = marked.parse(parsedFile.body); // turns the markdown body into html plaintext
    parsedFile.body = JSDOM.fragment(parsedFile.body); // turns the markdown text into a JSDOM fragment object

    return parsedFile;
};

const Page = (content) => {
    const template = fs.readFileSync(configs.template, 'utf-8');
    const page = new JSDOM(template);

    const main = page.window.document.querySelector(configs.contentAnchor);
    
    main.appendChild(content.body);

    return page;
};

const subsite = (source, output) => {
    const dir = fs.readdirSync(source, {withFileTypes: true})

    const files = dir
        .map(x => x.name)
        .filter(f => f.includes(".md"));

    const subdirs = dir
        .filter(x => x.isDirectory())
        .map(x => x.name);

    for (let file of files) {
        const name = file.slice(0, -3);
        const content = MDtoJSDOM(path.join(source, file));
        const page = Page(content);

        page.window.document.title = configs.titlePrefix + name;

        fs.writeFileSync(path.join(output, name + ".html"), page.window.document.documentElement.outerHTML);
    }

    for (let subdir of subdirs) {
        if (!fs.existsSync(path.join(output, subdir))) {
            fs.mkdirSync(path.join(output, subdir), 0744);
        };

        subsite(path.join(source, subdir), path.join(output, subdir));
    };
};

const main = () => {
    subsite(configs.sourceDir, configs.outputDir);
};

const configs = {
    template: "../scrubgay.github.io/markdowns/template.html",
    contentAnchor: "main",
    sourceDir: "../scrubgay.github.io/markdowns/",
    outputDir: "../scrubgay.github.io/",
    titlePrefix: "renz torres | ",
}

main();