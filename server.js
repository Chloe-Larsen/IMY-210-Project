//Larsen u25004141
const express = require('express');
const fs = require('fs');
const path = require('path');
const { Xslt, XmlParser } = require('xslt-processor');
const libxmljs = require('libxmljs2');
const multer = require('multer');
const { exec } = require('child_process');

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

//View schedule in html
app.get('/transform', async (req, res) => {//Semester 1
    try {
        const { xml, xslt } = req.query;
        const xmlPath = path.join(path.join(storageDir, xml));
        const xsltPath = path.join(path.join(storageDir, xslt));

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

//View schedule in pdf
app.get('/pdfS1', async (req, res) => {//Semester 1
    const xmlPath = path.join(path.join(storageDir, 'schedule_semester1.xml'));
    const xsltPath = path.join(path.join(storageDir, 'schedule-to-pdf.xsl'));
    const pdfPath = path.join(__dirname, 'semester1.pdf');
    
    const fopPath = "C:\\fop-2.11\\fop\\fop.bat";

    const command = `"${fopPath}" -xml "${xmlPath}" -xsl "${xsltPath}" -pdf "${pdfPath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`FOP Execution Error: ${error.message}`);
            return res.status(500).send("Error generating PDF. Make sure Apache FOP is installed and in your PATH.");
        }
                
        const pdfPath = path.join(__dirname, 'semester1.pdf');
        res.sendFile(pdfPath, (err) => {
            if (err) {
                console.error("Error sending PDF:", err);
            } else {
                console.log("PDF sent successfully!");
            }
        });
    });
});

app.get('/pdfS2', async (req, res) => {//Semester 2
    const xmlPath = path.join(path.join(storageDir, 'schedule_semester2.xml'));
    const xsltPath = path.join(path.join(storageDir, 'schedule-to-pdf.xsl'));
    const pdfPath = path.join(__dirname, 'semester2.pdf');
    
    const fopPath = "C:\\fop-2.11\\fop\\fop.bat";

    const command = `"${fopPath}" -xml "${xmlPath}" -xsl "${xsltPath}" -pdf "${pdfPath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`FOP Execution Error: ${error.message}`);
            return res.status(500).send("Error generating PDF. Make sure Apache FOP is installed and in your PATH.");
        }
                
        const pdfPath = path.join(__dirname, 'semester2.pdf');
        res.sendFile(pdfPath, (err) => {
            if (err) {
                console.error("Error sending PDF:", err);
            } else {
                console.log("PDF sent successfully!");
            }
        });
    });
});

//CRUD
//Read: view all of the uploaded files
app.get('/files', (req, res) => {
    try {
        const files = fs.readdirSync(storageDir);
        res.status(200).json({ files });
    } catch (error) {
        res.status(500).json({ message: "Error reading directory", error: error.message });
    }
});

//Create: Upload an xml file and validate it against the uploaded xsd
app.post('/upload/xml', upload.single('xmlFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
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
            fs.unlinkSync(xmlPath);
            res.status(400).send({ message: 'Validation failed', errors: validation.errors });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`Transformation failed: ${error.message}`);
    }
});

//Create: Upload files with no validation
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

//Delete: Remove the file indicated by :name
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

//Update: Update the file by the name of :name with the provided file
app.put('/files/:name', upload.single('file'), (req, res) => {
    try {
        const targetFileName = req.params.name;
        const targetPath = path.join(storageDir, targetFileName);

        if (!fs.existsSync(targetPath)) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: `File ${targetFileName} not found. Cannot update.` });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No new file provided for the update." });
        }

        if (req.file.path !== targetPath) {
            fs.renameSync(req.file.path, targetPath);
        }

        res.status(200).json({ message: `File ${targetFileName} was successfully updated.` });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Open: http://localhost:${PORT}/htmlS1`);
    console.log(`Open: http://localhost:${PORT}/htmlS2`);
    console.log(`Open: http://localhost:${PORT}/pdfS1`);
    console.log(`Open: http://localhost:${PORT}/pdfS2`);
});