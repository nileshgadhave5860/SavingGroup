/**
 * Services Index
 * Central export for all services
 */

export { API_BASE_URL, APIError, default as apiService } from './APIService';
export type { APIResponse } from './APIService';

export { default as authService } from './AuthService';
export type { ForgotPasswordRequest, LoginRequest, LoginResponse, SignUpRequest } from './AuthService';

export { default as savingGroupService } from './SavingGroupService';
export type { CreateGroupRequest, DashboardData, MemberDashboardData, SavingGroup } from './SavingGroupService';

export { default as memberService } from './MemberService';
export type { CreateMemberRequest, Member, UpdateMemberRequest } from './MemberService';

export { default as savingTransactionService } from './SavingTransactionService';
export type { SavingTransaction, UpdateSavingTransactionRequest } from './SavingTransactionService';

export { default as loanAccountService } from './LoanAccountService';
export type { CreateLoanRequest, LoanAccount, LoanMember, UpdateLoanRequest } from './LoanAccountService';

export { default as loanTransactionService } from './LoanTransactionService';
export type { CreateLoanTransactionRequest, LoanTransaction } from './LoanTransactionService';

export { default as monthService } from './MonthService';
export type { CreateMonthRequest, Month } from './MonthService';

export { default as bankService } from './BankService';
export type { BankDepositRequest, BankTransaction, BankWithdrawRequest } from './BankService';

export { default as incomeExpensesService } from './IncomeExpensesService';
export type { CreateIncomeExpenseRequest, IncomeExpense, UpdateIncomeExpenseRequest } from './IncomeExpensesService';

export { default as interestTransactionService } from './InterestTransactionService';
export type { InterestTransaction, UpdateInterestTransactionRequest } from './InterestTransactionService';

export { default as latePaymentChargesService } from './LatePaymentChargesService';
export type { DepositLatePaymentChargeRequest, LatePaymentCharge } from './LatePaymentChargesService';

