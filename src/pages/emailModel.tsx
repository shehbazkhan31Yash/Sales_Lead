import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { LeadsData } from "../types";
import { AlertCircle, Loader } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const EmailModelPage = ({ isOpenDialog, selectedLead, handleclose }: { isOpenDialog: boolean, selectedLead: LeadsData | null, handleclose: any }) => {
    const genAI = new GoogleGenerativeAI(
        "YOUR API KEY"
    );
    const [isOpen, setOpen] = useState<Boolean | undefined>(isOpenDialog);
    const [isProcessingEmail, setIsProcessingEmail] = useState<boolean>(false);
    const [generatedEmail, setGeneratedEmail] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);
    const [existingEmailContent, setExistingEmailContent] = useState<string>('');

    const preGeneratedEmail = localStorage.getItem('last_generated_email');
    useEffect(() => {
        if (preGeneratedEmail) {
            setExistingEmailContent(preGeneratedEmail);
        }
    }, [preGeneratedEmail]);

    const generateEmail = async () => {
        if (!selectedLead) return;
        setIsProcessingEmail(true);
        setIsError(false);
        setGeneratedEmail('');
        setExistingEmailContent('');
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `
                You are an AI Sales Assistant helping to write personalized engagement emails for potential leads.
 
                For each lead, based on the available data (Lead Profile, Lead Score, Conversion Probability, Recommended Services, and Interested Services), generate a professional, engaging email to start a conversation.
                
                Provide:  
                - A subject line  
                - An email body (friendly, concise, and focused on their business needs)  
                - A call-to-action (to schedule a meeting, learn more about services, etc.)
                
                Lead Input Data: 
                ${selectedLead ? JSON.stringify(selectedLead, null, 2) : 'No lead data available'}
                
                Example Output format: Return a JSON object with:  
                {  
                "subject": "Accelerate Your Cloud Journey with Expert Support",  
                "body": "Hi John, I’m reaching out from [Your Company] because we specialize in helping technology leaders like you enhance cloud infrastructure and integrate APIs seamlessly. Given TechNova’s focus on innovation, we believe our Cloud Infrastructure and API Integration services can significantly help accelerate your growth. Let’s set up a quick call to discuss further.",  
                "call_to_action": "Schedule a call"  
                }
                
                Return only the valid JSON object without extra text.
            `
            const result = await model.generateContent(prompt);
            if (result) {
                destructureTheEmailresponse(result.response.text());
            }
            setIsProcessingEmail(false);
        } catch (error) {
            setIsProcessingEmail(false);
            setIsError(true);
            console.error('Error generating email:', error);
        }
    }

    const destructureTheEmailresponse = (response: string) => {
        try {
            const preFixToremove = '```json\n';
            const suffixFixToreove = '\n```';
            let cleadOutput = response.replace(preFixToremove, '').replace(suffixFixToreove, '').trim();
            if (cleadOutput.startsWith('{') && cleadOutput.endsWith('}')) {
                const emailObj = JSON.parse(cleadOutput);
                console.log('Parsed email object:', emailObj);
                const emailContent = `Subject: ${emailObj.subject}\n\n${emailObj.body}\n\nCall to Action: ${emailObj.call_to_action}`;
                localStorage.setItem('last_generated_email', emailContent);
                setGeneratedEmail(emailContent);
            } else {
                setIsError(true);
                console.error('Response is not a valid JSON object:', cleadOutput);
            }
        } catch (err) {
            console.error('Error parsing email response:', err);
        }
    }

    const copyEmailContent = () => {
        const emailToCopy = generatedEmail || existingEmailContent;
        if (!emailToCopy) return;
        navigator.clipboard.writeText(emailToCopy).then(() => {
            alert('Email content copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy email content:', err);
        });
    }

    return <>
        {/* Detail View Dialog */}
        {/* onOpenChange={() => setSelectedJob(null)} */}
        <Dialog open={isOpenDialog} onOpenChange={() => handleclose(false)}>
            <DialogContent className="max-w-5xl bg-gradient-to-b from-indigo-900 to-purple-900 text-white border-0 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                        AI Powered Engagement Sugestions
                    </DialogTitle>
                </DialogHeader>
                <div className='leadDetails'>
                    <div className="grid grid-flow-col grid-rows-1 gap-4">
                        <div>
                            <div className='font-bold text-lg mb-2'>Lead Details:</div>
                            <table className='table-auto border-collapse border border-gray-300 mt-2'>
                                <thead>
                                    <tr>
                                        <th>Parameteres</th>
                                        <th>Details / Insights</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(selectedLead || {}).map(([key, value]) => (
                                        key !== 'Engagement_Summary' &&
                                        <tr key={key} className="border border-gray-300">
                                            <td className="border border-gray-300 px-2 py-1 font-medium">{key}</td>
                                            <td className="border border-gray-300 px-2 py-1">
                                                {value !== null && value !== undefined ? value.toString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='w-full'>
                            <div className='font-bold text-lg mb-2'>Dynamic Email</div>
                            <div className='p-3 border-2 border-white customstyle'>
                                {
                                    (!generatedEmail && !existingEmailContent && !isProcessingEmail && !isError) &&
                                    <div className='p-5 text-center'>Generate Email</div>
                                }
                                {
                                    isProcessingEmail && <div className='p-5 text-center'>
                                        <Loader className="m-auto h-4 w-4 animate-spin" />
                                        Generating Email...
                                    </div>
                                }
                                {
                                    isError && !isProcessingEmail && !existingEmailContent && <div className='p-5 text-center'>
                                        <AlertCircle className="m-auto h-4 w-4 text-red-500" />
                                        Oops! Something went wrong while generating the email. Please try again.
                                    </div>
                                }
                                {
                                    (existingEmailContent || generatedEmail) && !isProcessingEmail && !isError &&
                                    <div>
                                        <p className='text-center pb-2'>Generated Email</p>
                                        <div className='whitespace-pre-wrap'>
                                            {existingEmailContent && <p className='text-sm text-gray-300 mb-2'>*Showing last generated email.</p>}
                                            {generatedEmail || existingEmailContent}
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className='flex space-x-4'>
                                <Button className="mt-4" onClick={generateEmail}>Generate New Email</Button>
                                <Button className="mt-4" onClick={copyEmailContent} disabled={!generatedEmail && !existingEmailContent}>Copy</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <Button onClick={() => handleclose(false)}>Close</Button> */}
            </DialogContent>
        </Dialog>
    </>
}

export default EmailModelPage;