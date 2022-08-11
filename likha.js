const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const fm = require('front-matter');
const {marked} = require('marked');

const MDtoJSDOM = (filePath) => {
    const file = fs.readFileSync(filePath, 'utf-8');
    const parsedFile = fm(file); // splits out the front matter into body and attributes
    parsedFile.body = marked.parse(parsedFile.body); // turns the markdown body into html plaintext
    parsedFile.body = JSDOM.fragment(parsedFile.body); // turns the markdown text into a JSDOM fragment object

    return parsedFile;
}

const constructPage = (content) => {
    const template = fs.readFileSync('./template.html', 'utf-8');
    const dom = new JSDOM(template);
    const anchor = dom.window.document.querySelector("main");

    anchor.appendChild(content);

    return dom;
}

