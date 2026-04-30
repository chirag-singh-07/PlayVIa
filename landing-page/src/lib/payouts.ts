export interface BankDetails {
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  upi: string;
  pan: string;
}

export interface PayoutRequest {
  id: string;
  creatorName: string;
  creatorEmail: string;
  amount: number;
  method: "upi" | "bank";
  destination: string; // upi id or masked account
  bank: BankDetails;
  note?: string;
  status: "pending" | "approved" | "rejected" | "paid";
  requestedAt: string;
  processedAt?: string;
}

const BANK_KEY = "payvia_bank_details";
const REQ_KEY = "payvia_payout_requests";

export function getBankDetails(email?: string): BankDetails | null {
  try {
    const raw = localStorage.getItem(`${BANK_KEY}_${email || "me"}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveBankDetails(email: string | undefined, b: BankDetails) {
  localStorage.setItem(`${BANK_KEY}_${email || "me"}`, JSON.stringify(b));
}

export function getPayoutRequests(): PayoutRequest[] {
  try {
    const raw = localStorage.getItem(REQ_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addPayoutRequest(r: PayoutRequest) {
  const all = getPayoutRequests();
  all.unshift(r);
  localStorage.setItem(REQ_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("payouts-change"));
}

export function updatePayoutStatus(id: string, status: PayoutRequest["status"]) {
  const all = getPayoutRequests().map((r) =>
    r.id === id ? { ...r, status, processedAt: new Date().toISOString() } : r,
  );
  localStorage.setItem(REQ_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("payouts-change"));
}

export function maskAccount(acc: string) {
  if (!acc) return "";
  const last4 = acc.slice(-4);
  return `XXXX XXXX ${last4}`;
}
