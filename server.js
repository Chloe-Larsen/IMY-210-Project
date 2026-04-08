//Larsen u25004141
const express = require('express');
const fs = require('fs');
const path = require('path');
const { Xslt, XmlParser } = require('xslt-processor');

const app = express();

app.get('/', async (req, res) => {
    try{
        const xmlPath = path.join(path.join(__dirname, 'schedule.xml'));
        const xsltPath = path.join(path.join(__dirname, 'schedule-to-html.xsl'));
        const xmlString = fs.readFileSync(xmlPath, 'utf8');
        const xsltString = fs.readFileSync(xsltPath, 'utf8');
        const xslt = new Xslt();
        const xmlParser = new XmlParser();
        const xmlDoc = xmlParser.xmlParse(xmlString);
        const xsltDoc = xmlParser.xmlParse(xsltString);
        const htmlOutput = await xslt.xsltProcess(xmlDoc, xsltDoc);
        const htmlString = htmlOutput.toString();
        fs.writeFileSync(path.join(__dirname, 'output.html'), htmlString);
        res.set('Content-Type', 'text/html');
        res.send(htmlString);        
    }
    catch(error){
        console.error(error);
        res.status(500).send(`Transformation failed: ${error.message}`);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Open: http://localhost:${PORT}`);
});