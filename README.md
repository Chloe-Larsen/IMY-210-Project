# IMY 210 Project
## Author: Chloe Larsen (u25004141)

## Project description
This project is a Node.js RESTful API that serves as a document management and transformation platform. It allows users to upload XML schedules, validates them against a strict XSD schema, and dynamically transforms them into viewing formats (HTML and PDF) using XSLT and Apache FOP.

### Prerequisites
To run this server locally, ensure you have the following installed:
- Node.js (v14 or higher)
- Java (Required to run Apache FOP)
- Apache FOP (Configured locally. Note: Ensure the fopPath variable in server.js points to your local fop.bat file, currently set to C:\fop-2.11\fop\fop.bat).

## Instructions to run backend
- Extract the `project_mini2_u25004141.zip` file.
- Open a terminal in the root directory of the project.
- Install the required Node.js dependencies:
    - `npm install express multer libxmljs2 xslt-processor`
- Ensure the fopPath variable is updated to match your local FOP path to where your FOP.bat is stored
    - If FOP is not installed download the ZIP file at `https://xmlgraphics.apache.org/fop/download.html`
- Start the server
    - `node server.js`
- The server will initialize and create the necessary uploads/ directory automatically.

## Instructions to run Vue frontend
No Vue front end has been developed for this hand in

## Explanation of CRUD endpoints
### Create:
**POST `/upload/file`**

***Description:*** Uploads utility files (XSD schemas and XSLT stylesheets) to the `uploads/` directory.

***Body:*** form-data -> Key: `file` (File type).

---
**POST `/upload/xml`**

***Description:*** Uploads an XML file and strictly validates it against `schedule.xsd` (which must be uploaded first). If validation fails, the file is rejected and immediately deleted.

***Body:*** form-data -> Key: `xmlFile` (File type).
### Read:

**GET `/files`**

***Description:*** Returns a JSON array of all files currently stored in the `uploads/` directory.
### Update:

**PUT `/files/:name`**

***Description:*** Overwrites an existing file in the `uploads/` directory with a new version.

***URL Parameter:*** `:name` (e.g., schedule.xml).

***Body:*** form-data -> Key: `file` (File type).
### Delete:

**DELETE `/files/:name`**

***Description:*** Overwrites an existing file in the `uploads/` directory with a new version.

***URL Parameter:*** `:name` (e.g., schedule.xml).

## Explanation of transformation workflow
Once the files (schedule.xsd, schedule-to-html.xsl, schedule-to-pdf.xsl, and your XML data files) are successfully uploaded via the POST routes, you can view the transformed schedules directly in your web browser. 
### HTML Transformation 
***Semester 1***: http://localhost:3000/htmlS1

***Semester 2***: http://localhost:3000/htmlS2

**Workflow:** The server reads the XML and XSLT files and uses the xslt-processor package to render a dynamic HTML table. 
- Semester 1 will only display if `schedule_semester1.xml` is uploaded 
- Semester 2 will only work if `schedule_semester2.xml` is uploaded
### PDF Transformation 
***Semester 1***: http://localhost:3000/pdfS1

***Semester 2***: http://localhost:3000/pdfS2

**Workflow:** The server executes an external command to Apache FOP, transforming the XML data into an XSL-FO structured document, which is then compiled into a downloadable PDF file. 
- Semester 1 will only display if `schedule_semester1.xml` is uploaded
- Semester 2 will only work if `schedule_semester2.xml` is uploaded