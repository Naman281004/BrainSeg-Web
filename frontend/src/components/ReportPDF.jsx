import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#112B5E',
    borderBottomStyle: 'solid',
    alignItems: 'stretch',
    paddingBottom: 8,
    marginBottom: 15,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#112B5E',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  reportIdText: {
    fontSize: 10,
    color: '#666',
  },
  contentContainer: {
    flexDirection: 'row',
    flexGrow: 1,
  },
  leftColumn: {
    width: '38%',
    paddingRight: 10,
  },
  rightColumn: {
    width: '62%',
    paddingLeft: 10,
  },
  patientInfoSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#112B5E',
    marginBottom: 8,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#112B5E',
    borderBottomStyle: 'solid',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  infoLabel: {
    width: '45%',
    fontSize: 11,
    color: '#333',
    fontWeight: 'bold',
  },
  infoValue: {
    width: '55%',
    fontSize: 11,
    color: '#444',
  },
  section: {
    marginBottom: 15,
  },
  imageContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  imageCaption: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 3,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    marginBottom: 3,
  },
  legendContainer: {
    marginBottom: 12,
    padding: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  legendTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  legendText: {
    fontSize: 9,
    color: '#444',
    lineHeight: 1.4,
  },
  metricsContainer: {
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 15,
  },
  metricsTitle: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#112B5E',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomStyle: 'solid',
  },
  metricLabel: {
    fontSize: 11,
    color: '#333',
    width: '60%',
  },
  metricValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'right',
  },
  interpretationContainer: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#112B5E',
    borderLeftStyle: 'solid',
  },
  interpretationText: {
    fontSize: 11,
    lineHeight: 1.4,
    color: '#333',
  },
  keyFindings: {
    marginBottom: 12,
  },
  keyFindingRow: {
    marginBottom: 7,
  },
  keyFindingTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#112B5E',
    marginBottom: 2,
  },
  keyFindingText: {
    fontSize: 9,
    color: '#444',
    lineHeight: 1.3,
  },
  recommendationsContainer: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f0f7ff',
    borderRadius: 4,
  },
  recommendationsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#112B5E',
    marginBottom: 4,
  },
  recommendationItem: {
    fontSize: 9,
    marginBottom: 3,
    lineHeight: 1.3,
  },
  disclaimer: {
    fontSize: 8,
    color: '#666',
    marginTop: 8,
    marginBottom: 12,
    padding: 6,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    lineHeight: 1.3,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderTopStyle: 'solid',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    fontSize: 8,
    color: '#666',
  },
});

const ReportPDF = ({ results, patientInfo }) => {
  if (!results || !results.metrics) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>No results available</Text>
        </Page>
      </Document>
    );
  }

  const patient = patientInfo || {
    name: "Not provided",
    id: "Not provided",
    referringPhysician: "Not provided"
  };

  const formatMetric = (value) => {
    return typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : 'N/A';
  };

  const getFixedImageUrl = (url) => {
    if (!url) return '';
    const cleanPath = url.replace('http://localhost:8000', '');
    return `http://localhost:8000${cleanPath}`;
  };

  const imageUrl = getFixedImageUrl(results.static_image);
  const reportDate = new Date().toLocaleString();
  const reportId = `BSG-${Date.now().toString().substring(6)}`;

  const tumorCore = results.metrics.tumor_core * 100;
  const wholeTumor = results.metrics.whole_tumor * 100;
  const enhancingTumor = results.metrics.enhancing_tumor * 100;
  const totalTumorVolume = ((results.metrics.whole_tumor + results.metrics.tumor_core + results.metrics.enhancing_tumor)/3 * 100).toFixed(1);
    
  let severity = "low";
  if (enhancingTumor > 70 || tumorCore > 80) {
    severity = "high";
  } else if (enhancingTumor > 50 || tumorCore > 60) {
    severity = "moderate";
  }
  
  let tumorProfile = "mixed";
  if (tumorCore > enhancingTumor * 1.5 && tumorCore > wholeTumor * 1.3) {
    tumorProfile = "necrotic-dominant";
  } else if (enhancingTumor > tumorCore * 1.5) {
    tumorProfile = "enhancing-dominant";
  } else if (wholeTumor > tumorCore * 1.5 && wholeTumor > enhancingTumor * 1.5) {
    tumorProfile = "edema-dominant";
  }
  
  const getInterpretation = () => {
    return `Multiparametric MRI analysis shows segmentation of brain tissue with ${severity} signal characteristics. 
    Segmentation reveals a tumor mass with necrotic core component (${tumorCore.toFixed(1)}%), 
    surrounded by peritumoral edema (${wholeTumor.toFixed(1)}%). 
    The enhancing tumor component comprises ${enhancingTumor.toFixed(1)}% of the abnormality. 
    These findings are consistent with an intracranial neoplasm requiring clinical correlation and follow-up.`;
  };

  const getRecommendations = () => {
    const recommendations = [
      "Follow up with a neuro-oncology specialist to discuss these findings.",
      "Consider additional diagnostic imaging such as functional MRI or MR spectroscopy for further evaluation.",
      "Regular monitoring with repeat imaging is recommended to assess potential changes over time."
    ];
    
    if (severity === "high") {
      recommendations.push("Urgent consultation with a neurosurgeon is recommended.");
      recommendations.push("Discuss treatment options including surgical resection, radiation therapy, and/or chemotherapy.");
    } else if (severity === "moderate") {
      recommendations.push("Schedule a follow-up appointment within 4-6 weeks.");
      recommendations.push("Consider a biopsy to determine tumor type and grade.");
    } else {
      recommendations.push("Schedule a follow-up scan in 3-6 months to monitor for changes.");
    }
    
    return recommendations;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Brain Tumor Segmentation Report</Text>
            <Text style={styles.subtitle}>Advanced MRI Analysis</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.subtitle}>Report Date: {reportDate}</Text>
            <Text style={styles.reportIdText}>Report ID: {reportId}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            <View style={styles.patientInfoSection}>
              <Text style={styles.sectionTitle}>Patient Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Patient Name:</Text>
                <Text style={styles.infoValue}>{patient.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Patient ID:</Text>
                <Text style={styles.infoValue}>{patient.id}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Referring Physician:</Text>
                <Text style={styles.infoValue}>{patient.referringPhysician}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Analysis Date:</Text>
                <Text style={styles.infoValue}>{reportDate}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quantitative Assessment</Text>
              <View style={styles.metricsContainer}>
                {results.metrics && (
                  <>
                    <View style={styles.metricRow}>
                      <Text style={styles.metricLabel}>Necrotic Core (NCR):</Text>
                      <Text style={styles.metricValue}>
                        {formatMetric(results.metrics.tumor_core)}
                      </Text>
                    </View>

                    <View style={styles.metricRow}>
                      <Text style={styles.metricLabel}>Peritumoral Edema (ED):</Text>
                      <Text style={styles.metricValue}>
                        {formatMetric(results.metrics.whole_tumor)}
                      </Text>
                    </View>

                    <View style={styles.metricRow}>
                      <Text style={styles.metricLabel}>GD-enhancing Tumor (ET):</Text>
                      <Text style={styles.metricValue}>
                        {formatMetric(results.metrics.enhancing_tumor)}
                      </Text>
                    </View>
                    
                    <View style={styles.metricRow}>
                      <Text style={styles.metricLabel}>Whole Tumor Volume (WT):</Text>
                      <Text style={styles.metricValue}>
                        {totalTumorVolume}%
                      </Text>
                    </View>

                    <View style={styles.metricRow}>
                      <Text style={styles.metricLabel}>Tumor Profile:</Text>
                      <Text style={styles.metricValue}>
                        {tumorProfile.charAt(0).toUpperCase() + tumorProfile.slice(1)}
                      </Text>
                    </View>

                    <View style={styles.metricRow}>
                      <Text style={styles.metricLabel}>Signal Intensity Level:</Text>
                      <Text style={styles.metricValue}>
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              <View style={styles.recommendationsContainer}>
                {getRecommendations().map((recommendation, index) => (
                  <Text key={index} style={styles.recommendationItem}>• {recommendation}</Text>
                ))}
              </View>
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MRI Segmentation Analysis</Text>
              
              <View style={styles.imageContainer}>
                {imageUrl && (
                  <Image 
                    src={imageUrl}
                    style={styles.image}
                    cache={false}
                  />
                )}
                <Text style={styles.imageCaption}>
                  Figure 1: Brain tumor segmentation showing multimodal MRI analysis
                </Text>
              </View>

              <View style={styles.legendContainer}>
                <Text style={styles.legendTitle}>Segmentation Color Legend:</Text>
                <Text style={styles.legendText}>
                  • Black: Background (normal brain tissue){'\n'}
                  • Red: Necrotic core (NCR) - non-enhancing tumor core{'\n'}
                  • Yellow: Peritumoral edema (ED) - surrounding tissue affected by tumor{'\n'}
                  • Green: GD-enhancing tumor (ET) - active tumor regions
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Interpretation</Text>
              <View style={styles.interpretationContainer}>
                <Text style={styles.interpretationText}>
                  {getInterpretation()}
                </Text>
              </View>
            </View>

            <View style={styles.keyFindings}>
              <Text style={styles.sectionTitle}>Key Findings Explained</Text>
              
              <View style={styles.keyFindingRow}>
                <Text style={styles.keyFindingTitle}>Necrotic Core ({tumorCore.toFixed(1)}%):</Text>
                <Text style={styles.keyFindingText}>
                  This represents non-enhancing, dead tissue within the tumor. Higher percentages generally indicate
                  more aggressive tumors with inadequate blood supply leading to cell death in the tumor center.
                </Text>
              </View>
              
              <View style={styles.keyFindingRow}>
                <Text style={styles.keyFindingTitle}>Peritumoral Edema ({wholeTumor.toFixed(1)}%):</Text>
                <Text style={styles.keyFindingText}>
                  This indicates fluid accumulation and swelling in brain tissue surrounding the tumor. 
                  More extensive edema can cause increased pressure and associated symptoms.
                </Text>
              </View>
              
              <View style={styles.keyFindingRow}>
                <Text style={styles.keyFindingTitle}>Enhancing Tumor ({enhancingTumor.toFixed(1)}%):</Text>
                <Text style={styles.keyFindingText}>
                  This represents areas of active tumor with abnormal blood vessels that enhance with contrast. 
                  Higher percentages typically indicate more aggressive, actively growing tumor components.
                </Text>
              </View>
              
              <View style={styles.keyFindingRow}>
                <Text style={styles.keyFindingTitle}>Tumor Profile ({tumorProfile}):</Text>
                <Text style={styles.keyFindingText}>
                  This describes the predominant component of the tumor. {tumorProfile === "necrotic-dominant" 
                  ? "Your tumor shows a prominent necrotic core, which typically indicates rapid growth that has outpaced blood supply." 
                  : tumorProfile === "enhancing-dominant" 
                  ? "Your tumor shows prominent enhancement, indicating active growth with significant blood supply." 
                  : tumorProfile === "edema-dominant" 
                  ? "Your tumor shows significant surrounding edema, which may contribute to pressure-related symptoms." 
                  : "Your tumor shows a mixed profile with balanced components."}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.disclaimer}>
          <Text>
            DISCLAIMER: This report is generated through automated image analysis and is intended to assist healthcare professionals. 
            It should not be used as the sole basis for diagnosis or treatment decisions. Clinical correlation is recommended. 
            The sensitivity and specificity of this analysis may vary depending on image quality and other factors.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This report was generated by the BrainSeg AI Analysis System • For clinical use with professional interpretation only
          </Text>
        </View>
        
        <Text style={styles.pageNumber}>Page 1 of 1</Text>
      </Page>
    </Document>
  );
};

export default ReportPDF; 