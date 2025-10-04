export type MemberType = 'individual' | 'business' | 'association';

export interface Member {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  type: MemberType;
  hasPhysicalAccount: boolean;
}

export type AccountType = 'ePay_simp' | 'ePay_atem' | 'credit' | 'sol_tipapa' | 'virtual';

export interface Account {
  id: string;
  memberId: string;
  type: AccountType;
  balance: number;
  currency: 'HTG' | 'USD';
}

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'payment';

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  currency: 'HTG' | 'USD';
  description?: string;
  counterpartyMemberId?: string;
  createdAt: string;
}

export interface AuthCredentials {
  phone: string;
  password: string;
}

export interface PaymentRequest {
  fromAccountId: string;
  toMemberId: string;
  amount: number;
  currency: 'HTG' | 'USD';
  description?: string;
}
