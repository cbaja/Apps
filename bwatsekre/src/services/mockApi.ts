import { Account, Member, Transaction, PaymentRequest } from '../types';
import { isSeeded, setSeeded } from './storage';
import { v4 as uuidv4 } from 'uuid';

let members: Member[] = [];
let accounts: Account[] = [];
let transactions: Transaction[] = [];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function seedIfNeeded(): Promise<void> {
  const seeded = await isSeeded();
  if (seeded) return;

  const member: Member = {
    id: 'mem-1',
    fullName: 'Jean Pierre',
    phone: '+50937000000',
    email: 'jean@example.com',
    type: 'individual',
    hasPhysicalAccount: true,
  };

  const merchant: Member = {
    id: 'mem-merchant',
    fullName: 'Boutik Solidaire',
    phone: '+50936000000',
    type: 'business',
    hasPhysicalAccount: true,
  };

  members = [member, merchant];

  const acc1: Account = {
    id: 'acc-epay-simp',
    memberId: member.id,
    type: 'ePay_simp',
    balance: 12500,
    currency: 'HTG',
  };
  const acc2: Account = {
    id: 'acc-epay-atem',
    memberId: member.id,
    type: 'ePay_atem',
    balance: 4200,
    currency: 'HTG',
  };
  const acc3: Account = {
    id: 'acc-credit',
    memberId: member.id,
    type: 'credit',
    balance: -1500,
    currency: 'HTG',
  };
  const acc4: Account = {
    id: 'acc-sol-tipapa',
    memberId: member.id,
    type: 'sol_tipapa',
    balance: 8000,
    currency: 'HTG',
  };

  accounts = [acc1, acc2, acc3, acc4];

  const now = Date.now();
  transactions = [
    {
      id: 'txn-1',
      accountId: acc1.id,
      type: 'deposit',
      amount: 5000,
      currency: 'HTG',
      description: 'Initial deposit',
      createdAt: new Date(now - 5 * 86400000).toISOString(),
    },
    {
      id: 'txn-2',
      accountId: acc4.id,
      type: 'payment',
      amount: 800,
      currency: 'HTG',
      description: 'Payment to merchant',
      counterpartyMemberId: merchant.id,
      createdAt: new Date(now - 2 * 86400000).toISOString(),
    },
  ];

  await setSeeded();
}

export async function login(phone: string, password: string): Promise<Member> {
  await delay(500);
  const found = members.find((m) => m.phone === phone);
  if (!found) {
    throw new Error('No member found. Visit a branch to open an account.');
  }
  return found;
}

export async function register(member: Omit<Member, 'id'>): Promise<Member> {
  await delay(700);
  const exists = members.find((m) => m.phone === member.phone);
  if (exists) throw new Error('Member already exists');
  const newMember: Member = { ...member, id: uuidv4() };
  members.push(newMember);
  return newMember;
}

export async function getMember(memberId: string): Promise<Member | undefined> {
  await delay(200);
  return members.find((m) => m.id === memberId);
}

export async function listAccounts(memberId: string): Promise<Account[]> {
  await delay(200);
  return accounts.filter((a) => a.memberId === memberId);
}

export async function listTransactions(accountIds: string[]): Promise<Transaction[]> {
  await delay(200);
  return transactions
    .filter((t) => accountIds.includes(t.accountId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function makePayment(req: PaymentRequest): Promise<Transaction> {
  await delay(500);
  const from = accounts.find((a) => a.id === req.fromAccountId);
  const toMember = members.find((m) => m.id === req.toMemberId);
  if (!from) throw new Error('Source account not found');
  if (!toMember) throw new Error('Recipient not found');
  if (from.balance < req.amount) throw new Error('Insufficient funds');

  from.balance -= req.amount;
  const payment: Transaction = {
    id: uuidv4(),
    accountId: from.id,
    type: 'payment',
    amount: req.amount,
    currency: req.currency,
    description: req.description,
    counterpartyMemberId: toMember.id,
    createdAt: new Date().toISOString(),
  };
  transactions.push(payment);
  return payment;
}

export async function searchMembers(query: string): Promise<Member[]> {
  await delay(200);
  const q = query.toLowerCase();
  return members.filter((m) => m.fullName.toLowerCase().includes(q) || m.phone.includes(query));
}
