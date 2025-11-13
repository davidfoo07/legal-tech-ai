import { useState, useEffect, useMemo, type ChangeEvent } from 'react';
import api from '@/api/axios';
import { Header } from '@/components/layout/Header';
import type { User } from '@/types/user';
import type {
  CaseReport,
  // WhatsappApiPayload,
  ParsedCaseReport,
  PitchParsedCaseReport,
} from '@/types/caseReport';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface AdminDashboardProps {
  user: User;
  onSignOut: () => void;
}

// Helper Type for a unified row object
interface ReportRowData {
  isPitchReport: boolean;
  userEmail: string;
  contactPhone: string;
  caseType: string;
  summary: string;
  createdAt: string;
  id: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'CONTACTED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  amountInvolved: number;
}

export const AdminDashboard = ({ user, onSignOut }: AdminDashboardProps) => {
  const [caseReports, setCaseReports] = useState<CaseReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'ALL',
    priority: 'ALL',
    amount: '',
  });

  const createDateFromJavaArray = (dateArray: string) => {
    // Ensure all elements are treated as numbers using Number()
    const year = Number(dateArray[0]);
    const month = Number(dateArray[1]); // This will be 1-based (Jan=1)
    const day = Number(dateArray[2]);
    const hour = Number(dateArray[3] || 0);
    const minute = Number(dateArray[4] || 0);
    const second = Number(dateArray[5] || 0);
    const nano = Number(dateArray[6] || 0);

    return new Date(
      year,
      month - 1, // Subtract 1 for JS's 0-based month index
      day,
      hour,
      minute,
      second,
      nano / 1000000 // Convert nanoseconds to milliseconds
    );
  };

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/admin/case-reports');
        setCaseReports(
          response.data.sort(
            (a: { createdAt: string }, b: { createdAt: string }) =>
              createDateFromJavaArray(b.createdAt).getTime() -
              createDateFromJavaArray(a.createdAt).getTime()
          )
        );
        console.log('Fetched case reports:', response.data);
      } catch (error) {
        console.error('Failed to fetch case reports', error);
        toast.error('Could not load case reports.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Handler for updating filter state
  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // const handleContactUser = async (whatsappApiPayload: WhatsappApiPayload) => {
  //   if (!whatsappApiPayload.phoneNumber) {
  //     toast.error('No phone number on file for this user.');
  //     return;
  //   }
  //   const contactToast = toast.loading('Sending message...');
  //   try {
  //     await api.post('/admin/whatsappApi', {
  //       recipientName: whatsappApiPayload.recipientName,
  //       caseTitle: whatsappApiPayload.caseTitle,
  //       phoneNumber: whatsappApiPayload.phoneNumber,
  //       firmName: 'LawFirm X',
  //       lawyerName: 'Lawyer Y',
  //     });
  //     toast.success('Message sent!', { id: contactToast });
  //   } catch (error: unknown) {
  //     console.error('Failed to send message', error);
  //     toast.error('Could not send message.', { id: contactToast });
  //   }
  // };

  // useMemo hook to efficiently filter reports only when data or filters change
  const filteredReports = useMemo(() => {
    return caseReports.filter(report => {
      const statusMatch =
        filters.status === 'ALL' || report.status === filters.status;
      const priorityMatch =
        filters.priority === 'ALL' || report.priority === report.priority; // Using report.priority to match the Java enum value
      const amountMatch =
        !filters.amount ||
        report.amountInvolved >= Number.parseFloat(filters.amount);
      return statusMatch && priorityMatch && amountMatch;
    });
  }, [caseReports, filters]);

  const parseReport = (report: string, createdAt: string) => {
    try {
      const parsed = JSON.parse(report);
      // Determine report type by checking for a top-level 'caseDescription' key
      const isPitch = 'caseDescription' in parsed;

      if (isPitch) {
        // PITCH Report
        const pitchReport: PitchParsedCaseReport = parsed;
        return {
          isPitchReport: true,
          contactPhone: pitchReport.hasDocuments
            ? 'Documents Confirmed'
            : 'No Documents',
          caseType: pitchReport.caseType,
          summary: pitchReport.caseDescription,
          createdAt,
        };
      } else {
        // FULL Report
        const fullReport: ParsedCaseReport = parsed;
        return {
          isPitchReport: false,
          contactPhone: fullReport.clientInfo?.phone ?? 'N/A',
          caseType: fullReport.caseDetails?.caseType ?? 'N/A',
          summary: fullReport.caseDetails?.incidentSummary ?? 'N/A',
          createdAt,
        };
      }
    } catch (error) {
      console.error('Error parsing report:', error);
      return null;
    }
  };

  const reportsWithParsedDetails = useMemo(() => {
    return filteredReports.map(report => {
      console.log('Parsing report createdAt:', report.createdAt);
      const parsedDetails = parseReport(report.report, report.createdAt);

      // Build an explicit ReportRowData to ensure all required fields are present and typed correctly
      const row: ReportRowData = {
        isPitchReport: parsedDetails?.isPitchReport ?? false,
        userEmail: report.user?.email ?? 'N/A',
        contactPhone:
          parsedDetails?.contactPhone ?? report.user?.phone ?? 'N/A',
        caseType: parsedDetails?.caseType ?? 'N/A',
        summary: parsedDetails?.summary ?? 'N/A',
        createdAt: report.createdAt,
        id: report.id,
        status: report.status,
        priority: report.priority,
        amountInvolved: report.amountInvolved,
      };

      return row;
    });
  }, [filteredReports]);
  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onSignOut={onSignOut} />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1 mb-6">
            Overview of all submitted case reports.
          </p>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-white rounded-lg shadow">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="CONTACTED">Contacted</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Min. Amount ($)
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                value={filters.amount}
                onChange={handleFilterChange}
                placeholder="e.g., 5000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          {/* Case Reports Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            {isLoading ? (
              <p className="p-6 text-center text-slate-500">
                Loading reports...
              </p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User Email
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Contact
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Case Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Case Summary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportsWithParsedDetails.length > 0 ? (
                    reportsWithParsedDetails.map(report => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {report.userEmail}
                          {report.isPitchReport && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">
                              DEMO
                            </span>
                          )}
                        </td>
                        {/* commented out for demo */}
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            onClick={() => {
                              if (!report.isPitchReport) {
                                handleContactUser({
                                  recipientName:
                                    (report as any).contactName || 'Client',
                                  caseTitle:
                                    (report as any).caseTitle || 'Case',
                                  phoneNumber: report.contactPhone,
                                  firmName: 'LawFirm X',
                                  lawyerName: 'Lawyer Y',
                                });
                              } else {
                                toast.info(
                                  'Cannot contact Demo User via WhatsApp.'
                                );
                              }
                            }}
                            title={
                              report.isPitchReport
                                ? 'Contact Disabled for Demo'
                                : 'Contact user via WhatsApp'
                            }
                            className={`underline cursor-pointer ${report.isPitchReport ? 'text-gray-400' : 'text-green-600 hover:text-green-700'}`}
                          >
                            WhatsApp
                          </span>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.caseType}
                        </td>
                        <td className="px-6 py-4 text-md text-gray-500 max-w-xs">
                          <Link
                            to={`/admin/case-report/${report.id}`}
                            className="text-blue-600 underline line-clamp-2"
                            title="Click to view full report"
                          >
                            {report.summary || 'N/A'}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.priority}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${report.amountInvolved}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {`${createDateFromJavaArray(report.createdAt).toDateString()}`}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-sm text-gray-500"
                      >
                        No case reports match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
