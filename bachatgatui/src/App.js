import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import MemberDashboard from './components/MemberDashboard';
import SavingGroupDashboard from './components/SavingGroupDashboard';
import MemberPage from './components/MemberPage';
import LoanAccountPage from './components/LoanAccountPage';
import MonthPage from './components/MonthPage';
import SavingPendingPage from './components/SavingPendingPage';
import SavingDepositPage from './components/SavingDepositPage';
import IntrestPendingPage from './components/IntrestPendingPage';
import BankDepositPage from './components/BankDepositPage';
import BankWithdrawPage from './components/BankWithdrawPage';
import IncomeExpensesPage from './components/IncomeExpensesPage';
import LatePaymentPendingPage from './components/LatePaymentPendingPage';
import SavingPendingReport from './components/Report/SavingPendingReport';
import LoanPendingReport from './components/Report/LoanPendingReport';
import IntrestPendingReport from './components/Report/IntrestPendingReport';
import LatePaymentPendingReport from './components/Report/LatePaymentPendingReport';
import MemberReport from './components/Report/MemberReport';
import MonthDepositReport from './components/Report/MonthDepositReport';
import MonthPendingReport from './components/Report/MonthPendingReport';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<Layout />}>
          <Route path="/member-dashboard" element={<MemberDashboard />} />
          <Route path="/saving-group-dashboard" element={<SavingGroupDashboard />} />
          <Route path="/members" element={<MemberPage />} />
          <Route path="/months" element={<MonthPage />} />
          <Route path="/loans" element={<LoanAccountPage />} />
          <Route path="/saving-pending" element={<SavingPendingPage />} />
          <Route path="/saving-deposit" element={<SavingDepositPage />} />
          <Route path="/intrest-pending" element={<IntrestPendingPage />} />
          <Route path="/bank-deposit" element={<BankDepositPage />} />
          <Route path="/bank-withdraw" element={<BankWithdrawPage />} />
          <Route path="/income-expenses" element={<IncomeExpensesPage />} />
          <Route path="/late-payment-pending" element={<LatePaymentPendingPage />} />
          <Route path="/saving-pending-report" element={<SavingPendingReport />} />
          <Route path="/loan-pending-report" element={<LoanPendingReport />} />
          <Route path="/intrest-pending-report" element={<IntrestPendingReport />} />
          <Route path="/late-payment-pending-report" element={<LatePaymentPendingReport />} />
          <Route path="/member-report" element={<MemberReport />} />
          <Route path="/month-deposit-report" element={<MonthDepositReport />} />
          <Route path="/month-pending-report" element={<MonthPendingReport />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
