import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  CheckCircle,
  Brain,
  BarChart3,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Layout } from "../components/layout/Layout";
import { data, useNavigate } from "react-router-dom";
import { leadService } from "../services/leadService";
import { ProcessingStatus } from "../types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Papa from "papaparse";
export const ProcessLeadsPage: React.FC = () => {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyBwVFeHP6qD6KX348M6yquiu0FtxDBJ9B4"//"AIzaSyDucUyRn5RGVl5FK7BRqre_rBeevA_EbqE"
  );
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    step: "upload",
    progress: 0,
    message: "Ready to upload leads file",
    isProcessing: false,
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  //file states
  const [leadsData, setLeadsData] = useState<any[]>([]);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [preAccountsData, setPreAccountsData] = useState<any[]>([]);
  const [runningAccountsData, setRunningAccountsData] = useState<any[]>([]);
  const [output, setOutput] = useState<string>('');

  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const multipleFiles = acceptedFiles.length > 1 ? acceptedFiles : null;
    if (multipleFiles) {
      parseCSV(multipleFiles);
    }
    // if (file) {
    //   // setUploadedFile(file);
    //   // processFile(file);
    //   parseCSV(file); // New code to parse CSV
    // }
  }, []);

  //=== New code, manage file upload ans process it for extrating different data
  const parseCSV = (files: any[]) => {
    console.log('file to parse into json', files);
    try {
      if (files && files.length > 0) {
        files.forEach(file => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              switch (true) {
                case file.name.startsWith('Leads_data'):
                  console.log('leads data file found');
                  localStorage.removeItem('leads_data');
                  setLeadsData(results.data);
                  localStorage.setItem('leads_data', JSON.stringify(results.data));
                  break;
                case file.name.startsWith('Services_data'):
                  console.log('serice data file found');
                  setServicesData(results.data);
                  break;
                case file.name.startsWith('PreAccount_data'):
                  console.log('preacc data file found');
                  setPreAccountsData(results.data);
                  break;
                case file.name.startsWith('RunningAccout_data'):
                  console.log('runningac data file found');
                  setRunningAccountsData(results.data);
                  break;
                default:
                  console.warn('Unrecognized file:', file.name);
              }
              console.log('Parsed Results:', results.data);
            }
          })
        })
      }
    } catch (err) {
      console.error('Error parsing CSV:', err);
    }

  }
  //=== End of new code

  useEffect(() => {
    // const dataToshow = localStorage.getItem('ai_output') || '';
    // const cleaned = dataToshow?.replace('json\n', '')
    // const preFixToremove = '```json\n';
    // const suffixFixToreove = '\n```';
    // let cleanutput = dataToshow.replace(preFixToremove, '').replace(suffixFixToreove, '').trim();
    // console.log('dataToshow', cleanutput, dataToshow.split('\n'));
    // localStorage.setItem('clean_ai_output', cleanutput);
    // console.log('parsed', JSON.parse(cleanutput));
    // if (uploadedFile) requestAI(uploadedFile);
  }, []);

  useEffect(() => {
    if (leadsData.length && servicesData.length && preAccountsData.length && runningAccountsData.length) {
      console.log('All data files are set, ready to call AI model');
      //call AI model
      setOutput('Processing completed successfully');
      setProcessingStatus({
        step: "extract",
        progress: 40,
        message: `Uploaded all files successfully. Preparing for AI analysis...`,
        isProcessing: true,
      });
      // requestAI(uploadedFile!);
      runGenAIModel();
      // setProcessingStatus({
      //   step: "complete",
      //   progress: 100,
      //   message: `Successfully processed ${leadsData.length} leads!`,
      //   isProcessing: false,
      // });
    }
  }, [leadsData, servicesData, preAccountsData, runningAccountsData])

  const getStructredOutput = (dataOutput: string) => {
    if (dataOutput) {
      // console.log('parsing output when data is there', dataOutput);
      try {
        const preFixToremove = '```json\n';
        const suffixFixToreove = '\n```';
        let cleanutput = dataOutput.replace(preFixToremove, '').replace(suffixFixToreove, '').trim();
        const parsed = JSON.parse(cleanutput);
        if (parsed){
          localStorage.removeItem('clean_ai_output');
          console.log('parsed output', parsed);
          localStorage.setItem('clean_ai_output', JSON.stringify(parsed));
        }
      } catch (err) {
        console.error('Error parsing AI output JSON:', err);
        return null;
      }
    }
  }

  const requestAI = async (file: File) => {
    let generatedContent;
    try {
      const input =
        "Analyze the following lead data and provide insights on lead quality and potential next steps:";
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Read file as base64
      const readFileAsBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            // Remove the data URL prefix to get only the base64 string
            const result = reader.result as string;
            const base64 = result.split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

      type ContentItem =
        | string
        | { inlineData: { data: string; mimeType: string } };
      const contentToSend: ContentItem[] = [input];
      if (file) {
        const base64Data = await readFileAsBase64(file);
        contentToSend.push({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      }
      console.log("Content to send to AI:", contentToSend);
      // return;
      generatedContent = await model.generateContent(contentToSend);
      console.log("Generated Content:", generatedContent.response.text());
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: true,
  });

  const processFile = async (file: File) => {
    setProcessingStatus({
      step: "extract",
      progress: 10,
      message: "Extracting data from file...",
      isProcessing: true,
    });

    // Simulate processing steps
    setTimeout(() => {
      setProcessingStatus({
        step: "extract",
        progress: 40,
        message: "Data extracted successfully. Preparing for AI analysis...",
        isProcessing: true,
      });
    }, 1000);

    setTimeout(() => {
      setProcessingStatus({
        step: "analyze",
        progress: 70,
        message: "AI is analyzing and scoring leads...",
        isProcessing: true,
      });
    }, 2000);

    setTimeout(async () => {
      try {
        const result = await leadService.processFile(file);
        setProcessingStatus({
          step: "complete",
          progress: 100,
          message: `Successfully processed ${result.leadsCount} leads!`,
          isProcessing: false,
        });
      } catch (error) {
        setProcessingStatus({
          step: "upload",
          progress: 0,
          message: "Processing failed. Please try again.",
          isProcessing: false,
        });
        console.log("Error processing file:", error);
      }
    }, 4000);
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case "upload":
        return <Upload className="h-6 w-6" />;
      case "extract":
        return <FileText className="h-6 w-6" />;
      case "analyze":
        return <Brain className="h-6 w-6" />;
      case "complete":
        return <CheckCircle className="h-6 w-6" />;
      default:
        return <Upload className="h-6 w-6" />;
    }
  };


  //  Testing for more model

  const runGenAIModel = async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { temperature: 0.2, maxOutputTokens: 1500 } });
    const toremoveText = "```json' from start and '```' from end of the json output if any"
    const prompt = `
      You are an AI Sales Lead Scorer system for a hackathon MVP.
 
      **Input Data (provided as separate JSON files):**
      - Leads Data:
      ${JSON.stringify(leadsData, null, 2)}
      - Services Offered:
      ${JSON.stringify(servicesData, null, 2)}
      - Pre Accounts Data:
      ${JSON.stringify(preAccountsData, null, 2)}
      - Running Accounts Data:
      ${JSON.stringify(runningAccountsData, null, 2)}
      
      **Task:**
      1️⃣ For each lead, compute the **Initial Lead Score** using this simplified MVP formula:
      
      Initial_Lead_Score =
        (0.3 * Profile_Score) +
        (0.2 * Industry_Encoded) +
        (0.2 * Company_Size_Normalized) +
        (0.3 * Engagement_Summary_Score)
      
      **Notes:**
      - **Profile_Score**: Prioritize decision-makers:
          - CTO, CIO, CEO → 1.0
          - Director → 0.7
          - Manager → 0.4
          - Other → 0.1
      -- **Qualification Status:
      - ** Status Classification:
          - Converted → 1.0
          - Interested → if Initial_Lead_Score >= 0.5 and Conversion_Probability >= 0.5 else Not Interested
      - **Industry_Encoded**: Encoded relevance of industry to your services (0–1)
      - **Company_Size_Normalized**: Normalize company size (0–1)
      - **Engagement_Summary_Score**: Weighted sum of Email_Opens, Web_Visits, Campaign_Clicks, normalized 0–1
      - For MVP, **ignore Account Similarity, Campaign Relevance, Past Purchases, and Contact Summary** to simplify processing
      - Recommended Services: Match Interested_Services with Active Services Offered
      - Conversion Probability: Estimate heuristically based on Initial Lead Score (e.g., normalized 0–1)
      
      2️⃣ Additionally, provide:
      - **Top Leads**: sorted by Conversion Probability
      - **Engagement Summary per Lead**: Total Email Opens, Web Visits, Campaign Clicks, Last Interaction Date (if available)
      - Optional: highlight any high-potential leads for quick action
      
      **Output Format (JSON):**
      Only return the JSON object as shown below, without any additional text or explanation:
      {
        "per_lead": [
          {
            "Lead_ID": "string",
            "Profile_Score": "float (0 to 1)",
            "Initial_Lead_Score": "float (0 to 1)",
            "Conversion_Probability": "float (0 to 1)",
            "Recommended_Services": ["string"],
            "Status": "string (Converted, Interested, Not Interested)",
            "Engagement_Summary": {
              "Total_Email_Opens": "int",
              "Total_Web_Visits": "int",
              "Total_Campaign_Clicks": "int",
              "Last_Interaction_Date": "string (YYYY-MM-DD)"
            }
          }
        ]
      }
      
      **Additional Instructions for MVP:**
      - Focus on clear, actionable insights.
      - Provide results based on uploaded file data.
      - Ensure JSON output is well-structured and parsable.
      - Esnure all the records from leads data are processed and included in the output.
      - remove ${toremoveText}
    `
    console.log('Prompt for AI model:', prompt);
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    if (result) {
      localStorage.removeItem('ai_output');
      setProcessingStatus({
        step: "complete",
        progress: 100,
        message: `Successfully processed ${leadsData.length} leads!`,
        isProcessing: false,
      });
      localStorage.setItem('ai_output', result.response.text());
      setOutput(result.response.text());
      getStructredOutput(result.response.text());
    }
  }




  const steps = [
    {
      key: "upload",
      label: "Upload File",
      description: "Select your CSV/Excel file",
    },
    {
      key: "extract",
      label: "Extract Data",
      description: "Parse and validate data",
    },
    { key: "analyze", label: "AI Analysis", description: "Score leads with AI" },
    { key: "complete", label: "Complete", description: "Ready to view results" },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.key === processingStatus.step);
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Process New Leads
          </h1>
          <p className="text-gray-600">
            Upload your CSV or Excel file to start AI-powered lead scoring
          </p>
        </div>

        {/* Processing Steps */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold">Processing Steps</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center relative">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${index <= getCurrentStepIndex()
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                      }`}
                  >
                    {getStepIcon(step.key)}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium text-gray-900">{step.label}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-6 left-32 w-24 h-0.5 transition-all duration-300 ${index < getCurrentStepIndex() ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {processingStatus.isProcessing && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>{processingStatus.message}</span>
                  <span>{processingStatus.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${processingStatus.progress}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* File Upload Area */}
        {processingStatus.step === "upload" && (
          <Card>
            <CardContent className="p-8">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${isDragActive
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                  }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <FileSpreadsheet className="h-8 w-8 text-white" />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {isDragActive ? "Drop your file here" : "Upload leads file"}
                    </h3>
                    <p className="text-gray-500">
                      Drag and drop your CSV or Excel file, or{" "}
                      <span className="text-indigo-600 font-medium">browse files</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>✓ CSV files</span>
                    <span>✓ Excel files (.xlsx, .xls)</span>
                    <span>✓ Up to 10MB</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Processing Status */}
        {processingStatus.isProcessing && (
          <Card>
            <CardContent className="p-8 text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Processing Your Leads
              </h3>
              <p className="text-gray-600 mb-4">{processingStatus.message}</p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Brain className="h-4 w-4" />
                <span>AI is analyzing your data...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completion Status */}
        {processingStatus.step === "complete" && !processingStatus.isProcessing && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Processing Complete!
              </h3>
              <p className="text-gray-600 mb-6">{processingStatus.message}</p>

              <div className="flex justify-center space-x-4">
                <Button onClick={() => navigate("/dashboard")}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Dashboard
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Process Another File
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};
