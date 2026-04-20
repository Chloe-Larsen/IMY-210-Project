<!--Larsen u25004141-->
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" indent="yes" encoding="UTF-8"/>

    <xsl:template match="/schedule">
        <html>
            <head>
                <title>Schedule</title>
                <meta charset="UTF-8"/>

                <style>
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        /* Forces consistent column sizing */
                        table-layout: fixed;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                        vertical-align: top;
                        /* Prevents text from pushing the column wider */
                        word-wrap: break-word;
                    }
                    /* Specific column widths */
                    th:first-child, td:first-child {
                        width: 100px; /* Narrower column for Time */
                    }
                    th:not(:first-child) {
                        width: auto; /* Distributes the 5 days equally */
                    }
                    .container {
                        padding: 20px;
                    }
                    header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .event {
                        margin-bottom: 8px;
                        padding: 5px;
                        background: #f0f0f0;
                        border-radius: 5px;
                    }
                    .event.Lectures {
                        background: #e3f2fd;
                        border-left: 4px solid #7cbff6;
                    }
                    .event.Tutorials {
                        background: #e8f5e9;
                        border-left: 4px solid #81b783;
                    }
                    .event.Practicals {
                        background: #fff3e0;
                        border-left: 4px solid #fcd397;
                    }
                </style>

            </head>
            <body>
                <div class="container">
                    <header>
                        <h1>Timetable</h1>
                    </header>                                                                                                   
                    <div class="course-section">
                        <h2 style="margin-bottom: 20px;">Weekly (All Courses)</h2>
                        <div class="week-view">
                            <h3>Course Schedule by Day</h3>
                            <table class="week-table">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Monday</th>
                                        <th>Tuesday</th>
                                        <th>Wednesday</th>
                                        <th>Thursday</th>
                                        <th>Friday</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <xsl:call-template name="weeklySchedule"/>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    </xsl:template>

    <xsl:template name="weeklySchedule">
        <xsl:call-template name="timeRow"><xsl:with-param name="start">07:30</xsl:with-param><xsl:with-param name="end">08:20</xsl:with-param></xsl:call-template>
        <xsl:call-template name="timeRow"><xsl:with-param name="start">08:30</xsl:with-param><xsl:with-param name="end">09:20</xsl:with-param></xsl:call-template>
        <xsl:call-template name="timeRow"><xsl:with-param name="start">09:30</xsl:with-param><xsl:with-param name="end">10:20</xsl:with-param></xsl:call-template>
        <xsl:call-template name="timeRow"><xsl:with-param name="start">10:30</xsl:with-param><xsl:with-param name="end">11:20</xsl:with-param></xsl:call-template>
        <xsl:call-template name="timeRow"><xsl:with-param name="start">11:30</xsl:with-param><xsl:with-param name="end">12:20</xsl:with-param></xsl:call-template>
        <xsl:call-template name="timeRow"><xsl:with-param name="start">12:30</xsl:with-param><xsl:with-param name="end">13:20</xsl:with-param></xsl:call-template>
        <xsl:call-template name="timeRow"><xsl:with-param name="start">13:30</xsl:with-param><xsl:with-param name="end">14:20</xsl:with-param></xsl:call-template>
        <xsl:call-template name="timeRow"><xsl:with-param name="start">14:30</xsl:with-param><xsl:with-param name="end">15:20</xsl:with-param></xsl:call-template>
        <xsl:call-template name="timeRow"><xsl:with-param name="start">15:30</xsl:with-param><xsl:with-param name="end">16:20</xsl:with-param></xsl:call-template>
        <xsl:call-template name="timeRow"><xsl:with-param name="start">16:30</xsl:with-param><xsl:with-param name="end">17:20</xsl:with-param></xsl:call-template>
    </xsl:template>

    <xsl:template name="timeRow">
        <xsl:param name="start"/>
        <xsl:param name="end"/>
        <tr>
            <td><xsl:value-of select="$start"/> - <xsl:value-of select="$end"/></td>
            <xsl:call-template name="dayCell"><xsl:with-param name="day">Monday</xsl:with-param><xsl:with-param name="start" select="$start"/></xsl:call-template>
            <xsl:call-template name="dayCell"><xsl:with-param name="day">Tuesday</xsl:with-param><xsl:with-param name="start" select="$start"/></xsl:call-template>
            <xsl:call-template name="dayCell"><xsl:with-param name="day">Wednesday</xsl:with-param><xsl:with-param name="start" select="$start"/></xsl:call-template>
            <xsl:call-template name="dayCell"><xsl:with-param name="day">Thursday</xsl:with-param><xsl:with-param name="start" select="$start"/></xsl:call-template>
            <xsl:call-template name="dayCell"><xsl:with-param name="day">Friday</xsl:with-param><xsl:with-param name="start" select="$start"/></xsl:call-template>
        </tr>
    </xsl:template>

    <xsl:template name="dayCell">
        <xsl:param name="day"/>
        <xsl:param name="start"/>
        
        <xsl:variable name="startNum" select="number(translate($start, ':', ''))"/>
        
        <td>
            <xsl:for-each select="/schedule//*[Day=$day and number(translate(Time/StartTime, ':', '')) &lt;= $startNum and number(translate(Time/EndTime, ':', '')) &gt; $startNum]">
                <div class="event {name(..)}">
                    <strong><xsl:value-of select="../../Code"/></strong><br/>
                    <xsl:choose>
                        <xsl:when test="name(..)='Lectures'">Lecture</xsl:when>
                        <xsl:when test="name(..)='Tutorials'">Tutorial</xsl:when>
                        <xsl:when test="name(..)='Practicals'">Practical</xsl:when>
                        <xsl:otherwise>Session</xsl:otherwise>
                    </xsl:choose>
                    <br/>
                    <xsl:value-of select="Venue/Building"/><br/>
                    <xsl:value-of select="Venue/Room"/>
                    
                </div>
            </xsl:for-each>
        </td>
    </xsl:template>

</xs:stylesheet>    