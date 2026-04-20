//Larsen u25004141
const express = require('express');
const fs = require('fs');
const path = require('path');
const { Xslt, XmlParser } = require('xslt-processor');
const libxmljs = require('libxmljs2');
const multer = require('multer');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storageDir = path.join(__dirname, 'files');
if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

function validateXML(xmlString, xsdString) {
    try {
        const xmlDoc = libxmljs.parseXml(xmlString);
        const xsdDoc = libxmljs.parseXml(xsdString);

        if (xmlDoc.validate(xsdDoc)) {
            return { valid: true };
        } else {
            return { valid: false, errors: xmlDoc.validationErrors };
        }

    } catch (err) {
        return { valid: false, errors: [err.message] };
    }
}


app.get('/', async (req, res) => {
    try {
        const xmlPath = path.join(path.join(storageDir, 'schedule.xml'));
        const xsltPath = path.join(path.join(storageDir, 'schedule-to-html.xsl'));
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
    catch (error) {
        console.error(error);
        res.status(500).send(`Transformation failed: ${error.message}`);
    }
});

app.get('/files', (req, res) => {
    try {
        const files = fs.readdirSync(storageDir);
        res.status(200).json({ files });
    } catch (error) {
        res.status(500).json({ message: "Error reading directory", error: error.message });
    }
});

app.post('/upload/xml', upload.single('xmlFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");

        }
        const xmlPath = req.file.path;
        const xmlString = fs.readFileSync(xmlPath, 'utf8');
        const xsdString = fs.readFileSync(path.join(storageDir, 'schedule.xsd'), 'utf8');
        const validation = validateXML(xmlString, xsdString);

        if (validation.valid) {
            res.send({ message: `File ${req.file.originalname} uploaded and valid` })
        } else {
            fs.unlinkSync(xmlPath);
            res.status(400).send({ message: 'Validation failed', errors: validation.errors });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Transformation failed: ${error.message}`);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Open: http://localhost:${PORT}`);
});