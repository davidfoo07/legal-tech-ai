// src/components/admin/CaseReportDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import type { ParsedCaseReport } from '@/types/caseReport';
import type { CaseReport } from '@/types/caseReport';
import { toast } from 'react-hot-toast';

export const CaseReportDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // State holds the PARSED report
  const [report, setReport] = useState<ParsedCaseReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await api.get(`/admin/case-reports/${id}`);
        const fullCaseReport: CaseReport = response.data;
        const parsedReportJson: ParsedCaseReport = JSON.parse(
          fullCaseReport.report
        );

        setReport(parsedReportJson);
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

  const handleContactUser = async (phone: string) => {
    if (!phone) {
      toast.error('No phone number on file for this user.');
      return;
    }
    const contactToast = toast.loading('Sending message...');
    try {
      await api.post('/admin/whatsappApi', {
        recipientName: report?.clientInfo.fullName || 'Client',
        caseTitle: report?.caseDetails.keyFacts || 'Case',
        phoneNumber: phone,
        firmName: 'LawFirm X',
        lawyerName: 'Lawyer Y',
      });
      toast.success('Message sent!', { id: contactToast });
    } catch (error: unknown) {
      console.error('Failed to send message', error);
      toast.error('Could not send message.', { id: contactToast });
    }
  };

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
                Case Report: {report.caseDetails.caseType}
              </h1>
              <button
                type="button"
                onClick={() => handleContactUser(report.clientInfo.phone)}
                disabled={!report.clientInfo.phone}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Contact via WhatsApp
              </button>
            </div>
            <h2 className="text-lg font-semibold mt-4 mb-2">Client Info</h2>
            <ul className="list-disc list-inside">
              <li>
                <strong>Full Name:</strong> {report.clientInfo.fullName}
              </li>
              <li>
                <strong>Email:</strong> {report.clientInfo.email}
              </li>
              <li>
                <strong>Phone:</strong> {report.clientInfo.phone}
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-4 mb-2">Case Details</h2>
            <ul className="list-disc list-inside">
              <li>
                {/* **FIX 3: Moved priority to caseDetails** */}
                <strong>Priority:</strong> {report.caseDetails.priority}
              </li>
              <li>
                <strong>Summary:</strong> {report.caseDetails.incidentSummary}
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-4 mb-2">Key Facts</h2>
            <ul className="list-disc list-inside">
              {report.caseDetails.keyFacts.map((fact, index) => (
                <li key={index}>{fact}</li>
              ))}
            </ul>

            <h2 className="text-lg font-semibold mt-4 mb-2">Employment</h2>
            <ul className="list-disc list-inside">
              <li>
                <strong>Employer:</strong>{' '}
                {report.employmentDetails.employerName}
              </li>
              <li>
                <strong>Job Title:</strong> {report.employmentDetails.jobTitle}
              </li>
              <li>
                <strong>Dates:</strong> {report.employmentDetails.startDate} to{' '}
                {report.employmentDetails.endDate}
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-4 mb-2">Damages</h2>
            <ul className="list-disc list-inside">
              <li>
                {/* **FIX 4: Moved estimatedAmount to damages** */}
                <strong>Estimated Amount:</strong> $
                {report.damages.estimatedAmount}
              </li>
              <li>
                {/* **FIX 5: Moved desiredOutcome to damages** */}
                <strong>Desired Outcome:</strong>{' '}
                {report.damages.desiredOutcome}
              </li>
            </ul>

            {/* **FIX 6: Added missing Evidence section** */}
            <h2 className="text-lg font-semibold mt-4 mb-2">Evidence</h2>
            <ul className="list-disc list-inside">
              {report.evidence.documentsMentioned.length > 0 ? (
                report.evidence.documentsMentioned.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))
              ) : (
                <li>No documents mentioned.</li>
              )}
            </ul>

            <h2 className="text-lg font-semibold mt-4 mb-2">Full Raw Data</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>
        ) : (
          <p>Report not found.</p>
        )}
      </div>
    </div>
  );
};
