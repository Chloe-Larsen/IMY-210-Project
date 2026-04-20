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

const storageDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
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


app.get('/htmlS1', async (req, res) => {
    try {
        const xmlPath = path.join(path.join(storageDir, 'schedule_semester1.xml'));
        const xsltPath = path.join(path.join(storageDir, 'schedule-to-html.xsl'));

        if (!fs.existsSync(xmlPath) || !fs.existsSync(xsltPath)) {
            return res.status(404).send("Required XML/XSLT files missing in 'uploads' folder.");
        }

        const xmlString = fs.readFileSync(xmlPath, 'utf8');
        const xsltString = fs.readFileSync(xsltPath, 'utf8');

        const xslt = new Xslt();
        const xmlParser = new XmlParser();
        const xmlDoc = xmlParser.xmlParse(xmlString);
        const xsltDoc = xmlParser.xmlParse(xsltString);

        const htmlOutput = await xslt.xsltProcess(xmlDoc, xsltDoc);
        const htmlString = htmlOutput.toString();        
        res.set('Content-Type', 'text/html');
        res.send(htmlString);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Transformation failed: ${error.message}`);
    }
});

app.get('/htmlS2', async (req, res) => {
    try {
        const xmlPath = path.join(path.join(storageDir, 'schedule_semester2.xml'));
        const xsltPath = path.join(path.join(storageDir, 'schedule-to-html.xsl'));

        if (!fs.existsSync(xmlPath) || !fs.existsSync(xsltPath)) {
            return res.status(404).send("Required XML/XSLT files missing in 'uploads' folder.");
        }

        const xmlString = fs.readFileSync(xmlPath, 'utf8');
        const xsltString = fs.readFileSync(xsltPath, 'utf8');

        const xslt = new Xslt();
        const xmlParser = new XmlParser();
        const xmlDoc = xmlParser.xmlParse(xmlString);
        const xsltDoc = xmlParser.xmlParse(xsltString);

        const htmlOutput = await xslt.xsltProcess(xmlDoc, xsltDoc);
        const htmlString = htmlOutput.toString();        
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
            return res.status(400).send("No file uploaded.");s
        }
        const xmlPath = req.file.path;
        const xsdPath = path.join(storageDir, "schedule.xsd");

        if(!fs.existsSync(xsdPath)){
            return res.status(400).json({ 
                message: "Missing XSD schema. Please upload schedule.xsd first." 
            });
        }

        const xmlString = fs.readFileSync(xmlPath, 'utf8');
        const xsdString = fs.readFileSync(xsdPath, 'utf8');
        const validation = validateXML(xmlString, xsdString);

        if (validation.valid) {
            res.send({ message: `File ${req.file.originalname} uploaded and valid` })
        } else {            
            res.status(400).send({ message: 'Validation failed', errors: validation.errors });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Transformation failed: ${error.message}`);
    }
});

app.post('/upload/file', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }
        res.status(200).json({ 
            message: `File ${req.file.originalname} uploaded successfully to the uploads directory.` 
        });        
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Upload failed: ${error.message}`);
    }
});

app.delete('/files/:name', async(req,res) => {
    try {
        const filePath = path.join(storageDir, req.params.name);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.status(200).json({ message: "File deleted successfully" });
        } else {
            res.status(404).send({ message: "File not found" });
        }      
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Error deleting file: ${error.message}`);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Open: http://localhost:${PORT}/htmlS1`);
    console.log(`Open: http://localhost:${PORT}/htmlS2`);
});