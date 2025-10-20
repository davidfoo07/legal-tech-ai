import { useState, useEffect, useMemo, type ChangeEvent } from 'react';
import api from '@/api/axios';
import { Header } from '@/components/layout/Header';
import type { User } from '@/types/user';
import type { CaseReport } from '@/types/caseReport';
import { toast } from 'react-hot-toast';

interface AdminDashboardProps {
  user: User;
  onSignOut: () => void;
}

export const AdminDashboard = ({ user, onSignOut }: AdminDashboardProps) => {
  const [caseReports, setCaseReports] = useState<CaseReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'ALL',
    priority: 'ALL',
    amount: '',
  });

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/admin/case-reports');
        console.log('case report res data:', response.data);
        console.log('user data:', response.data[0].user.email);
        setCaseReports(response.data);
      } catch (error) {
        console.error('Failed to fetch case reports', error);
        toast.error('Could not load case reports.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []); // Empty dependency array means this runs only once on mount

  // Handler for updating filter state
  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // useMemo hook to efficiently filter reports only when data or filters change
  const filteredReports = useMemo(() => {
    return caseReports.filter(report => {
      const statusMatch =
        filters.status === 'ALL' || report.status === filters.status;
      const priorityMatch =
        filters.priority === 'ALL' || report.priority === filters.priority;
      const amountMatch =
        !filters.amount ||
        report.amountInvolved >= Number.parseFloat(filters.amount);
      return statusMatch && priorityMatch && amountMatch;
    });
  }, [caseReports, filters]);

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount Involved
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Submitted On
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.length > 0 ? (
                    filteredReports.map(report => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {report.user.email}
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
                          {report.createdAt}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
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
