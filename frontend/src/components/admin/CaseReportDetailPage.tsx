// src/components/admin/CaseReportDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import type {
  ParsedCaseReport,
  PitchParsedCaseReport,
} from '@/types/caseReport';
import type { CaseReport } from '@/types/caseReport';
import { toast } from 'react-hot-toast';

// Define a unified view model for simplicity in display
interface ReportViewModel {
  isPitchReport: boolean;
  caseType: string;
  incidentSummary: string;
  estimatedAmount: number | string;
  desiredOutcome: string;
  // User/Client info is optional for pitch reports
  clientName?: string;
  clientPhone?: string;
  keyFacts?: string[];
  documentsMentioned?: string[];
  // Full details for non-pitch reports
  fullDetails?: ParsedCaseReport;
}

export const CaseReportDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // State holds the unified view model
  const [reportViewModel, setReportViewModel] =
    useState<ReportViewModel | null>(null);
  const [fullRawReport, setFullRawReport] = useState<any>(null); // To display raw JSON
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await api.get(`/admin/case-reports/${id}`);
        const fullCaseReport: CaseReport = response.data;

        // The raw JSON string from the database (fullCaseReport.report)
        const parsedReportJson = JSON.parse(fullCaseReport.report);
        setFullRawReport(parsedReportJson);

        // --- CORE FIX: Determine Report Type ---
        // A pitch report only has 'caseDescription'. A full report has nested 'caseDetails.incidentSummary'.
        const isPitch = 'caseDescription' in parsedReportJson;

        let viewModel: ReportViewModel;

        if (isPitch) {
          // This is a PitchParsedCaseReport
          const pitchReport: PitchParsedCaseReport = parsedReportJson;
          viewModel = {
            isPitchReport: true,
            caseType: pitchReport.caseType,
            incidentSummary: pitchReport.caseDescription,
            estimatedAmount: pitchReport.estimatedDamages,
            desiredOutcome: pitchReport.desiredOutcome,
            // Client info is pulled from the CaseReport entity's User field, not the 'report' JSON
            clientName: fullCaseReport.user.username,
            clientPhone: fullCaseReport.user.phone,
            keyFacts: ['Demo case submitted via pitch flow.'],
            documentsMentioned: pitchReport.hasDocuments
              ? ['Confirmed existence of documents.']
              : ['No documents confirmed.'],
          };
        } else {
          // This is a ParsedCaseReport (the old, full structure)
          const fullReport: ParsedCaseReport = parsedReportJson;
          viewModel = {
            isPitchReport: false,
            caseType: fullReport.caseDetails.caseType,
            incidentSummary: fullReport.caseDetails.incidentSummary,
            estimatedAmount: fullReport.damages.estimatedAmount,
            desiredOutcome: fullReport.damages.desiredOutcome,
            clientName: fullReport.clientInfo.fullName,
            clientPhone: fullReport.clientInfo.phone,
            keyFacts: fullReport.caseDetails.keyFacts,
            documentsMentioned: fullReport.evidence.documentsMentioned,
            fullDetails: fullReport, // Keep the original structure available
          };
        }

        setReportViewModel(viewModel);
      } catch (error) {
        console.error('Failed to fetch or parse report', error);
        toast.error('Could not load case report.');
        navigate('/admin');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [id, navigate]);

  const handleContactUser = async (phone?: string) => {
    // if (!phone) {
    //   toast.error('No phone number on file for this user.');
    //   return;
    // }
    const contactToast = toast.loading('Sending message...');
    try {
      await api.post('/admin/whatsappApi', {
        recipientName: reportViewModel?.clientName || 'Client',
        caseTitle: reportViewModel?.caseType || 'Case',
        phoneNumber: phone || '+6596110670',
        firmName: 'JCP Law Firm',
        lawyerName: 'Alex',
      });
      alert('Message is successfully sent.');
      toast.success('Message sent!', { id: contactToast });
    } catch (error: unknown) {
      console.error('Failed to send message', error);
      toast.error('Could not send message.', { id: contactToast });
    }
  };

  const report = reportViewModel; // Rename for cleaner JSX

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-600 hover:underline"
        >
          &larr; Back to Dashboard
        </button>

        {isLoading ? (
          <p>Loading report...</p>
        ) : report ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 border-b pb-4">
              <h1 className="text-2xl font-bold mb-2 sm:mb-0">
                Case Report: {report.caseType}
                {report.isPitchReport && (
                  <span className="ml-2 px-2 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">
                    PITCH DEMO
                  </span>
                )}
              </h1>
              <button
                type="button"
                onClick={() => handleContactUser(report.clientPhone)}
                // disabled={!report.clientPhone || report.isPitchReport} // Disable contact for pitch demo users
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Contact via WhatsApp
              </button>
            </div>

            {/* --- CLIENT INFO (Unified) --- */}
            <h2 className="text-lg font-semibold mt-4 mb-2">Client Info</h2>
            <ul className="list-disc list-inside">
              <li>
                <strong>Client/User:</strong> {report.clientName || 'N/A'}
              </li>
              {/* Only show phone if available */}
              {report.clientPhone && (
                <li>
                  <strong>Phone:</strong> {report.clientPhone}
                </li>
              )}
            </ul>

            {/* --- CASE DETAILS (Unified) --- */}
            <h2 className="text-lg font-semibold mt-4 mb-2">Case Details</h2>
            <ul className="list-disc list-inside">
              {!report.isPitchReport && (
                <li>
                  <strong>Priority:</strong>{' '}
                  {report.fullDetails?.caseDetails.priority || 'N/A'}
                </li>
              )}
              <li>
                <strong>Summary:</strong> {report.incidentSummary}
              </li>
            </ul>

            {/* --- KEY FACTS (Unified) --- */}
            <h2 className="text-lg font-semibold mt-4 mb-2">Key Facts</h2>
            <ul className="list-disc list-inside">
              {report.keyFacts && report.keyFacts.length > 0 ? (
                report.keyFacts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))
              ) : (
                <li>No specific key facts provided.</li>
              )}
            </ul>

            {/* --- EMPLOYMENT (Only for full reports) --- */}
            {!report.isPitchReport && report.fullDetails?.employmentDetails && (
              <>
                <h2 className="text-lg font-semibold mt-4 mb-2">Employment</h2>
                <ul className="list-disc list-inside">
                  <li>
                    <strong>Employer:</strong>{' '}
                    {report.fullDetails.employmentDetails.employerName}
                  </li>
                  <li>
                    <strong>Job Title:</strong>{' '}
                    {report.fullDetails.employmentDetails.jobTitle}
                  </li>
                  <li>
                    <strong>Dates:</strong>{' '}
                    {report.fullDetails.employmentDetails.startDate} to{' '}
                    {report.fullDetails.employmentDetails.endDate}
                  </li>
                </ul>
              </>
            )}

            {/* --- DAMAGES (Unified) --- */}
            <h2 className="text-lg font-semibold mt-4 mb-2">Damages</h2>
            <ul className="list-disc list-inside">
              <li>
                <strong>Estimated Amount:</strong> ${report.estimatedAmount}
              </li>
              <li>
                <strong>Desired Outcome:</strong> {report.desiredOutcome}
              </li>
            </ul>

            {/* --- EVIDENCE (Unified) --- */}
            <h2 className="text-lg font-semibold mt-4 mb-2">Evidence</h2>
            <ul className="list-disc list-inside">
              {report.documentsMentioned &&
              report.documentsMentioned.length > 0 ? (
                report.documentsMentioned.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))
              ) : (
                <li>No documents mentioned.</li>
              )}
            </ul>

            {/* --- FULL RAW DATA --- */}
            <h2 className="text-lg font-semibold mt-4 mb-2">Full Raw Data</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(fullRawReport, null, 2)}
            </pre>
          </div>
        ) : (
          <p>Report not found.</p>
        )}
      </div>
    </div>
  );
};
