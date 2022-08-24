const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const fm = require('front-matter');
const {marked} = require('marked');
const path = require('path');

const configs = {
    template: "/home/renz/Repositories/renzst.github.io/markdowns/template.html",
    contentAnchor: "main",
    sourceDir: "/home/renz/Repositories/renzst.github.io/markdowns/",
    outputDir: "./dist/"
}

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

const main = () => {
    const dir = fs.readdirSync(configs.sourceDir);
    const files = dir.filter(x => x.includes(".md"));

    for (let file of files) {
        const name = file.slice(0, -3);
        const content = MDtoJSDOM(path.join(configs.sourceDir, file));
        const page = Page(content);

        page.window.document.title = "renz torres | " + name;

        fs.writeFileSync(path.join(configs.outputDir, name + ".html"), page.window.document.documentElement.outerHTML);
    }
}

main();