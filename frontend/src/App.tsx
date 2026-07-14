 import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import NotFound from './pages/NotFound';
import PublicRoute from './components/common/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import AppShell from './layouts/AppShell';

// --- Admin ---
import AdminDashboardPage from '@pages/Admin/AdminDashboardPage';
import AdminUsers from '@pages/Admin/AdminUsers';
import AdminManageUsersPage from '@pages/Admin/AdminManageUsersPage';
import AdminRoles from '@pages/Admin/AdminRoles';
import AdminMentorships from '@pages/Admin/AdminMentorships';
import AdminManageReportsPage from '@pages/Admin/AdminManageReportsPage';
import AdminReports from '@pages/Admin/AdminReports';
import AdminStatisticsPage from '@pages/Admin/AdminStatisticsPage';
import AdminSettingsPage from '@pages/Admin/AdminSettingsPage';
import AdminRH from '@pages/Admin/AdminRH';
import AdminNotifications from '@pages/Admin/AdminNotifications';
import AdminFeedback from '@pages/Admin/AdminFeedback';

// --- RH ---
import RHDashboardPage from '@pages/hr/RHDashboardPage';
import RHInterns from '@pages/hr/RHInterns';
import RHMentors from '@pages/hr/RHMentors';
import RhMentorships from '@pages/hr/RhMentorships';
import RHMatching from '@pages/hr/RHMatching';
import RHCandidates from '@pages/hr/RHCandidates';
import RHContracts from '@pages/hr/RHContracts';
import RHDepartures from '@pages/hr/RHDepartures';
import RHEvaluations from '@pages/hr/RHEvaluations';
import RHReports from '@pages/hr/RHReports';
import RHStatisticsPage from '@pages/hr/RHStatisticsPage';
import RHFeedback from '@pages/hr/RHFeedback';
import RHNotifications from '@pages/hr/RHNotifications';
import RHProfile from '@pages/hr/RHProfile';
import RHSettingsPage from '@pages/hr/RHSettingsPage';

// --- Mentor ---
import MentorDashboardPage from '@pages/mentor/MentorDashboardPage';
import MentorInterns from '@pages/mentor/MentorInterns';
import MentorCandidates from '@pages/mentor/MentorCandidates';
import MentorMatching from '@pages/mentor/MentorMatching';
import MentorMentorships from '@pages/mentor/MentorMentorships';
import MentorSessions from '@pages/mentor/MentorSessions';
import MentorEvaluations from '@pages/mentor/MentorEvaluations';
import MentorReports from '@pages/mentor/MentorReports';
import MentorContracts from '@pages/mentor/MentorContracts';
import MentorDepartures from '@pages/mentor/MentorDepartures';
import MentorFeedback from '@pages/mentor/MentorFeedback';
import MentorNotifications from '@pages/mentor/MentorNotifications';
import MentorStatisticsPage from '@pages/mentor/MentorStatisticsPage';
import MentorProfile from '@pages/mentor/MentorProfile';
import MentorSettingsPage from '@pages/mentor/MentorSettingsPage';

// --- Intern ---
import InternDashboardPage from '@pages/intern/InternDashboardPage';
import InternProfile from '@pages/intern/InternProfile';
import InternMatching from '@pages/intern/InternMatching';
import InternMentorships from '@pages/intern/InternMentorships';
import InternMessages from '@pages/intern/InternMessages';
import InternChat from '@pages/intern/InternChat';
import InternReports from '@pages/intern/InternReports';
import InternTasks from '@pages/intern/InternTasks';
import InternDocuments from '@pages/intern/InternDocuments';
import InternContracts from '@pages/intern/InternContracts';
import InternEvaluations from '@pages/intern/InternEvaluations';
import InternSessions from '@pages/intern/InternSessions';
import InternDepartures from '@pages/intern/InternDepartures';
import InternCandidates from '@pages/intern/InternCandidates';
import InternFeedback from '@pages/intern/InternFeedback';
import InternNotifications from '@pages/intern/InternNotifications';
import InternStatisticsPage from '@pages/intern/InternStatisticsPage';
import InternSettingsPage from '@pages/intern/InternSettingsPage';
import { Evaluation } from 'api/matching.api';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* --- Public --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

          {/* --- Ancienne route générique conservée en redirection --- */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />

          {/* --- Admin --- */}
          <Route element={<PrivateRoute allowedRoles={['admin']}><AppShell /></PrivateRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminManageUsersPage />} />
            <Route path="/admin/users-list" element={<AdminUsers />} />
            <Route path="/admin/roles" element={<AdminRoles />} />
            <Route path="/admin/mentorships" element={<AdminMentorships />} />
            <Route path="/admin/moderation" element={<AdminManageReportsPage />} />
            <Route path="/admin/charts" element={<AdminReports />} />
            <Route path="/admin/statistics" element={<AdminStatisticsPage />} />
            <Route path="/admin/hr" element={<AdminRH />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>

          {/* --- RH --- */}
          <Route element={<PrivateRoute allowedRoles={['hr']}><AppShell /></PrivateRoute>}>
            <Route path="/hr/dashboard" element={<RHDashboardPage />} />
            <Route path="/hr/interns" element={<RHInterns />} />
            <Route path="/hr/mentors" element={<RHMentors />} />
            <Route path="/hr/mentorships" element={<RhMentorships />} />
            <Route path="/hr/matching" element={<RHMatching />} />
            <Route path="/hr/candidates" element={<RHCandidates />} />
            <Route path="/hr/contracts" element={<RHContracts />} />
            <Route path="/hr/departures" element={<RHDepartures />} />
            <Route path="/hr/evaluations" element={<RHEvaluations />} />
            <Route path="/hr/reports" element={<RHReports />} />
            <Route path="/hr/statistics" element={<RHStatisticsPage />} />
            <Route path="/hr/feedback" element={<RHFeedback />} />
            <Route path="/hr/notifications" element={<RHNotifications />} />
            <Route path="/hr/profile" element={<RHProfile />} />
            <Route path="/hr/settings" element={<RHSettingsPage />} />
          </Route>

          {/* --- Mentor --- */}
          <Route element={<PrivateRoute allowedRoles={['mentor']}><AppShell /></PrivateRoute>}>
            <Route path="/mentor/dashboard" element={<MentorDashboardPage />} />
            <Route path="/mentor/interns" element={<MentorInterns />} />
            <Route path="/mentor/candidates" element={<MentorCandidates />} />
            <Route path="/mentor/matching" element={<MentorMatching title={''} description={''} placeholder={''} textareaPlaceholder={''} submitButtonText={''} additionalInfo={''} mentors={[]} onMatch={function (mentorId: string): void {
              throw new Error('Function not implemented.');
            } } interns={[]} onInternSelect={function (internId: string): void {
              throw new Error('Function not implemented.');
            } } evaluations={[]} onEvaluationSubmit={function (evaluation: Evaluation): void {
              throw new Error('Function not implemented.');
            } } />} />
            <Route path="/mentor/mentorships" element={<MentorMentorships />} />
            <Route path="/mentor/sessions" element={<MentorSessions />} />
            <Route path="/mentor/evaluations" element={<MentorEvaluations />} />
            <Route path="/mentor/reports" element={<MentorReports />} />
            <Route path="/mentor/contracts" element={<MentorContracts />} />
            <Route path="/mentor/departures" element={<MentorDepartures />} />
            <Route path="/mentor/feedback" element={<MentorFeedback />} />
            <Route path="/mentor/notifications" element={<MentorNotifications />} />
            <Route path="/mentor/statistics" element={<MentorStatisticsPage />} />
            <Route path="/mentor/profile" element={<MentorProfile />} />
            <Route path="/mentor/settings" element={<MentorSettingsPage />} />
          </Route>

          {/* --- Stagiaire --- */}
          <Route element={<PrivateRoute allowedRoles={['intern']}><AppShell /></PrivateRoute>}>
            <Route path="/intern/dashboard" element={<InternDashboardPage />} />
            <Route path="/intern/profile" element={<InternProfile />} />
            <Route path="/intern/matching" element={<InternMatching />} />
            <Route path="/intern/mentorships" element={<InternMentorships />} />
            <Route path="/intern/messages" element={<InternMessages />} />
            <Route path="/intern/chat" element={<InternChat />} />
            <Route path="/intern/reports" element={<InternReports />} />
            <Route path="/intern/tasks" element={<InternTasks />} />
            <Route path="/intern/documents" element={<InternDocuments />} />
            <Route path="/intern/contracts" element={<InternContracts />} />
            <Route path="/intern/evaluations" element={<InternEvaluations />} />
            <Route path="/intern/sessions" element={<InternSessions />} />
            <Route path="/intern/departures" element={<InternDepartures />} />
            <Route path="/intern/candidates" element={<InternCandidates />} />
            <Route path="/intern/feedback" element={<InternFeedback />} />
            <Route path="/intern/notifications" element={<InternNotifications />} />
            <Route path="/intern/statistics" element={<InternStatisticsPage />} />
            <Route path="/intern/settings" element={<InternSettingsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;