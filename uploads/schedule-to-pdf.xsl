<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet 
	version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:fo="http://www.w3.org/1999/XSL/Format">

	<xsl:output method="xml" indent="yes"/>
	
	<xsl:template match="/schedule">
		<fo:root>
			<fo:layout-master-set>
				<fo:simple-page-master master-name="A4-portrait" page-width="210mm" page-height="297mm" margin-top="5mm" margin-bottom="5mm" margin-left = "5mm" margin-right="5mm">					
					<fo:region-body background-color="#ffffff"/>
				</fo:simple-page-master>
			</fo:layout-master-set>
		
			<fo:page-sequence master-reference="A4-portrait">				
				<fo:flow flow-name="xsl-region-body">
                    <fo:block font-size="18pt" font-weight="bold" text-align="center" space-after="5mm">
                        Weekly Timetable
                    </fo:block>

					<fo:table table-layout="fixed" width="100%" border-collapse="collapse">
                        <fo:table-column column-width="8%"/>
                        <fo:table-column column-width="18.4%"/>
                        <fo:table-column column-width="18.4%"/>
                        <fo:table-column column-width="18.4%"/>
                        <fo:table-column column-width="18.4%"/>
                        <fo:table-column column-width="18.4%"/>

                        <fo:table-header>
                            <fo:table-row background-color="#546859" color="white" font-weight="bold" text-align="center">
                                <fo:table-cell border="1pt solid black" padding="2mm">
                                    <fo:block>Time</fo:block>
                                </fo:table-cell>
                                <fo:table-cell border="1pt solid black" padding="2mm">
                                    <fo:block>Monday</fo:block>
                                </fo:table-cell>
                                <fo:table-cell border="1pt solid black" padding="2mm">
                                    <fo:block>Tuesday</fo:block>
                                </fo:table-cell>
                                <fo:table-cell border="1pt solid black" padding="2mm">
                                    <fo:block>Wednesday</fo:block>
                                </fo:table-cell>
                                <fo:table-cell border="1pt solid black" padding="2mm">
                                    <fo:block>Thursday</fo:block>
                                </fo:table-cell>
                                <fo:table-cell border="1pt solid black" padding="2mm">
                                    <fo:block>Friday</fo:block>
                                </fo:table-cell>
                            </fo:table-row>
                        </fo:table-header>

                        <fo:table-body>
                            <xsl:call-template name="weeklySchedule"/>
                        </fo:table-body>
                    </fo:table>
				</fo:flow>
		  	</fo:page-sequence>
		</fo:root>
	</xsl:template>

	<xsl:template name="weeklySchedule">
		<xsl:call-template name="timeRow">
            <xsl:with-param name="start">07:30</xsl:with-param>
            <xsl:with-param name="end">08:20</xsl:with-param>
        </xsl:call-template>
        <xsl:call-template name="timeRow">
            <xsl:with-param name="start">08:30</xsl:with-param>
            <xsl:with-param name="end">09:20</xsl:with-param>
        </xsl:call-template>
        <xsl:call-template name="timeRow">
            <xsl:with-param name="start">09:30</xsl:with-param>
            <xsl:with-param name="end">10:20</xsl:with-param>
        </xsl:call-template>
        <xsl:call-template name="timeRow">
            <xsl:with-param name="start">10:30</xsl:with-param>
            <xsl:with-param name="end">11:20</xsl:with-param>
        </xsl:call-template>
        <xsl:call-template name="timeRow">
            <xsl:with-param name="start">11:30</xsl:with-param>
            <xsl:with-param name="end">12:20</xsl:with-param>
        </xsl:call-template>
        <xsl:call-template name="timeRow">
            <xsl:with-param name="start">12:30</xsl:with-param>
            <xsl:with-param name="end">13:20</xsl:with-param>
        </xsl:call-template>
        <xsl:call-template name="timeRow">
            <xsl:with-param name="start">13:30</xsl:with-param>
            <xsl:with-param name="end">14:20</xsl:with-param>
        </xsl:call-template>
        <xsl:call-template name="timeRow">
            <xsl:with-param name="start">14:30</xsl:with-param>
            <xsl:with-param name="end">15:20</xsl:with-param>
        </xsl:call-template>
        <xsl:call-template name="timeRow">
            <xsl:with-param name="start">15:30</xsl:with-param>
            <xsl:with-param name="end">16:20</xsl:with-param>
        </xsl:call-template>
        <xsl:call-template name="timeRow">
            <xsl:with-param name="start">16:30</xsl:with-param>
            <xsl:with-param name="end">17:20</xsl:with-param>
        </xsl:call-template>
	</xsl:template>

    <xsl:template name="timeRow">
        <xsl:param name="start"/>
        <xsl:param name="end"/>
        <fo:table-row>
            <fo:table-cell border="1pt solid black" padding="2mm" text-align="center">
                <fo:block><xsl:value-of select="$start"/> - <xsl:value-of select="$end"/></fo:block>
            </fo:table-cell>
            <xsl:call-template name="dayCell">
                <xsl:with-param name="day">Monday</xsl:with-param>
                <xsl:with-param name="start" select="$start"/>
            </xsl:call-template>
            <xsl:call-template name="dayCell">
                <xsl:with-param name="day">Tuesday</xsl:with-param>
                <xsl:with-param name="start" select="$start"/>
            </xsl:call-template>
            <xsl:call-template name="dayCell">
                <xsl:with-param name="day">Wednesday</xsl:with-param>
                <xsl:with-param name="start" select="$start"/>
            </xsl:call-template>
            <xsl:call-template name="dayCell">
                <xsl:with-param name="day">Thursday</xsl:with-param>
                <xsl:with-param name="start" select="$start"/>
            </xsl:call-template>
            <xsl:call-template name="dayCell">
                <xsl:with-param name="day">Friday</xsl:with-param>
                <xsl:with-param name="start" select="$start"/>
            </xsl:call-template>
        </fo:table-row>
    </xsl:template>

    <xsl:template name="dayCell">
        <xsl:param name="day"/>
        <xsl:param name="start"/>
        <xsl:variable name="startNum" select="number(translate($start, ':', ''))"/>

        <fo:table-cell border="1pt solid black" padding="1mm">
            <fo:block>
                <xsl:for-each select="/schedule//*[Day=$day and number(translate(Time/StartTime, ':', '')) &lt;= $startNum and number(translate(Time/EndTime, ':', '')) &gt; $startNum]">
                    <xsl:variable name="bgColor">
                        <xsl:choose>
                            <xsl:when test="name(..)='Lectures'">#e3f2fd</xsl:when>   
                            <xsl:when test="name(..)='Practicals'">#fff3e0</xsl:when> 
                            <xsl:when test="name(..)='Tutorials'">#e8f5e9</xsl:when>  
                            <xsl:otherwise>#f0f0f0</xsl:otherwise>
                            </xsl:choose>
                    </xsl:variable>
                    <xsl:variable name="mgColor">
                        <xsl:choose>
                            <xsl:when test="name(..)='Lectures'">#7cbff6</xsl:when>   
                            <xsl:when test="name(..)='Practicals'">#fcd397</xsl:when> 
                            <xsl:when test="name(..)='Tutorials'">#81b783</xsl:when>  
                            <xsl:otherwise>#f0f0f0</xsl:otherwise>
                            </xsl:choose>
                    </xsl:variable>
                    <fo:block background-color="{$bgColor}" margin ="1mm" padding="1mm" font-size="9pt" border="1pt solid {$mgColor}"> 
                        <fo:block font-weight="bold"><xsl:value-of select="../../Code"/></fo:block>
                        <fo:block>
                            <xsl:choose>
                                <xsl:when test="name(..)='Lectures'">Lecture</xsl:when>
                                <xsl:when test="name(..)='Tutorials'">Tutorial</xsl:when>
                                <xsl:when test="name(..)='Practicals'">Practical</xsl:when>
                                <xsl:otherwise>Session</xsl:otherwise>
                            </xsl:choose>
                        </fo:block>
                        <fo:block><xsl:value-of select="Venue/Building"/></fo:block>
                        <fo:block><xsl:value-of select="Venue/Room"/></fo:block>
                    </fo:block>
                </xsl:for-each>
            </fo:block>
        </fo:table-cell>
    </xsl:template>

</xsl:stylesheet>