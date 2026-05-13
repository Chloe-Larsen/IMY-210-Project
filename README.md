# IMY 210 Project
## Author: Chloe Larsen (u25004141)

## Project description
This project is a full stack document transformation platform designed to manage schedules. The system allows users to upload XML schedules, validates them against a strict XSD schema, and dynamically transforms them into viewing formats (HTML and PDF) using XSLT or Apache FOP.

## System Architecture Overview
This application follows a four-layer architecture
1. **Structured Data Layer:** Consists of XML files for content, XSD files for stuctural rules, and XSLTs for transformation into HTML and PDF.
2. **Backend Layer:** A Node.js express server that manages file storage, executes CRUD operations, and performs server-side transformations using xslt-processor and Apache FOP.
3. **Frontend Layer:** A Vue.js **S**ingle **P**age **A**pplication (**SPA**) that provides the user interface for file management and triggering transformations
4. **Environment:** A local development environment requiring Node.js and Java

### Prerequisites
To run this server locally, ensure you have the following installed:
- Node.js (v14 or higher)
- Java (Required to run Apache FOP)
- Apache FOP (Configured locally. Note: Ensure the fopPath variable in server.js points to your local fop.bat file, currently set to C:\fop-2.11\fop\fop.bat).
- Backend must be running before Frontend can be started

## Instructions to run backend
- Extract the `project_u25004141.zip` file.
- Open a terminal in the root directory of the project.
- Install the required Node.js dependencies:
    - `npm install @xmldom/xmldom cors express libxmljs2 multer xml-js xslt-processor`
- Ensure the fopPath variable is updated to match your local FOP path to where your FOP.bat is stored
    - If FOP is not installed download the ZIP file at `https://xmlgraphics.apache.org/fop/download.html`
- Start the server
    - `node server.js`
- The server will run on `http://localhost:3000`
- When the server is running the word `Going` will display in the terminal.
- The server will initialize and create the necessary uploads/ directory automatically.

## Instructions to run Vue frontend
- Navigate to the frontend directory in a new terminal window.
- Install the required dependencies:
    - `npm install vue vue-router vite @vitejs/plugin-vue vite-plugin-vue-devtools`
- Start the development server:
    - `npm run dev`
- Access the interface at the URL provided in the terminal.

## Validation of XML files
The backend utilises the `libxmljs2` library to validate all uploaded XML files against `schedule.xsd`. Files are only saved to the `uploads` folder if they are valid. If invalid files then a `400` error and specified validation errors are returned, this prevents malformed data from being stored
### schedule_semester1.xml
Output from upload:
`{`
`    "message": "File schedule_semester1.xml uploaded and valid"`
`}`
### schedule_semester2.xml
Output from upload:
`{`
`    "message": "File schedule_semester2.xml uploaded and valid"`
`}`

## Explanation of CRUD endpoints
### Create:
**_POST_ `/upload/file`**

***Description:*** Uploads utility files (XSD schemas and XSLT stylesheets) to the `uploads/` directory.

***Body:*** form-data -> Key: `file` (File type).

---
**_POST_ `/upload/xml`**

***Description:*** Uploads an XML file and strictly validates it against `schedule.xsd` (which must be uploaded first). If validation fails, the file is rejected and immediately deleted.

***Body:*** form-data -> Key: `xmlFile` (File type).
### Read:

**_GET_ `/files`**

***Description:*** Returns a JSON array of all files currently stored in the `uploads/` directory.
### Update:

**_PUT_ `/files/:name`**

***Description:*** Overwrites an existing file in the `uploads/` directory with a new version.

***URL Parameter:*** `:name` (e.g., schedule.xml).

***Body:*** form-data -> Key: `file` (File type).
### Delete:

**_DELETE_ `/files/:name`**

***Description:*** Overwrites an existing file in the `uploads/` directory with a new version.

***URL Parameter:*** `:name` (e.g., schedule.xml).

## Explanation of transformation workflow
The transformation occurs exclusively on the server to ensure consistency:
1. **Trigger:** The user selects an XML/XSLT pair in the Vue UI and clicks the `View HTML` or `Download PDF`
2. **Requests:** Vue sends the file names as parameters to the backend transformation endpoints
3. **Processing:**
    - **HTML Transformation:** Server uses `xslt-processor` to combine the XML and XSLT into an HTML string
    - **PDF Transformation:** Server triggers Apache FOP to compile the data into a PDF via XSL-FO
4. **Delivery:** Generated HTML is displayed in an `iframe`, while PDFs are served as a downloadable file