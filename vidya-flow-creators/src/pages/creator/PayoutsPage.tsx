import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Wallet,
  IndianRupee,
  Building2,
  Smartphone,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Edit3,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/creator/StatCard";
import { useAuth } from "@/lib/auth";
import {
  BankDetails,
  maskAccount,
} from "@/lib/payouts";
import { formatINR } from "@/data/mock";
import { useCreatorPayouts, useCreatePayout, useCreatorStats } from "@/hooks/useCreator";

const bankSchema = z.object({
  accountHolder: z.string().trim().min(2, "Account holder name is required").max(80),
  accountNumber: z
    .string()
    .trim()
    .regex(/^\d{9,18}$/, "Enter a valid 9–18 digit account number"),
  ifsc: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code (e.g. HDFC0001234)"),
  bankName: z.string().trim().min(2, "Bank name is required").max(80),
  upi: z
    .string()
    .trim()
    .regex(/^[\w.\-]+@[\w]+$/, "Invalid UPI ID (e.g. name@upi)"),
  pan: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{5}\d{4}[A-Z]$/, "Invalid PAN (e.g. ABCDE1234F)"),
});
type BankForm = z.infer<typeof bankSchema>;

const requestSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Enter an amount" })
    .min(500, "Minimum withdrawal is ₹500")
    .max(500000, "Maximum per request is ₹5,00,000"),
  method: z.enum(["upi", "bank"]),
  note: z.string().max(200).optional(),
});
type ReqForm = z.infer<typeof requestSchema>;

export default function PayoutsPage() {
  const { user } = useAuth();
  const [bank, setBank] = useState<BankDetails | null>(null);
  const [editing, setEditing] = useState(false);
  
  const { data: requests = [], isLoading: reqLoading } = useCreatorPayouts();
  const { data: statsData, isLoading: statsLoading } = useCreatorStats();
  const createPayout = useCreatePayout();

  useEffect(() => {
    const raw = localStorage.getItem(`payvia_bank_details_${user?.email}`);
    if (raw) setBank(JSON.parse(raw));
  }, [user?.email]);

  const bankForm = useForm<BankForm>({
    resolver: zodResolver(bankSchema),
    defaultValues: bank || {
      accountHolder: user?.name || "",
      accountNumber: "",
      ifsc: "",
      bankName: "",
      upi: "",
      pan: "",
    },
  });

  useEffect(() => {
    if (bank) bankForm.reset(bank);
  }, [bank]); // eslint-disable-line

  const reqForm = useForm<ReqForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: { amount: 500, method: "upi", note: "" },
  });

  const pending = useMemo(
    () => requests.filter((r: any) => r.status === "pending").reduce((s: number, r: any) => s + r.amount, 0),
    [requests],
  );
  const paid = useMemo(
    () => requests.filter((r: any) => r.status === "paid").reduce((s: number, r: any) => s + r.amount, 0),
    [requests],
  );
  
  const totalEarnings = statsData?.stats?.totalEarnings || 0;
  const available = totalEarnings - pending - paid;

  const onSaveBank = (data: BankForm) => {
    localStorage.setItem(`payvia_bank_details_${user?.email}`, JSON.stringify(data));
    setBank(data as BankDetails);
    setEditing(false);
    toast.success("Bank details saved securely");
  };

  const onRequest = async (data: ReqForm) => {
    if (!bank) {
      toast.error("Add your bank details first");
      return;
    }
    if (data.amount > available) {
      toast.error("Amount exceeds available balance");
      return;
    }
    
    try {
      await createPayout.mutateAsync({
        amount: data.amount,
        method: data.method,
        details: {
          ...bank,
          accountNumber: data.method === "bank" ? bank.accountNumber : undefined,
        },
        note: data.note,
      });
      reqForm.reset({ amount: 500, method: "upi", note: "" });
      toast.success("Payout request sent to admin for review");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    }
  };

  if (reqLoading || statsLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statusBadge = (s: any) => {
    const map: Record<string, { v: string; cls: string; icon: React.ElementType }> = {
      pending: { v: "Pending", cls: "bg-warning/15 text-warning border-warning/30", icon: Clock },
      approved: { v: "Approved", cls: "bg-primary/15 text-primary border-primary/30", icon: CheckCircle2 },
      paid: { v: "Paid", cls: "bg-success/15 text-success border-success/30", icon: CheckCircle2 },
      rejected: { v: "Rejected", cls: "bg-destructive/15 text-destructive border-destructive/30", icon: XCircle },
    };
    const m = map[s] || map.pending;
    return (
      <Badge variant="outline" className={`gap-1 ${m.cls}`}>
        <m.icon className="h-3 w-3" />
        {m.v}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-3xl font-bold">Payouts</h1>
        <p className="text-muted-foreground">
          Add your bank details and send withdrawal requests to admin for approval.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Available balance" value={formatINR(available)} icon={Wallet} delta={8} />
        <StatCard label="Pending requests" value={formatINR(pending)} icon={Clock} gradient="bg-gradient-secondary" />
        <StatCard label="Lifetime paid" value={formatINR(paid)} icon={IndianRupee} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 border-0 shadow-card">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" /> Bank & UPI details
              </CardTitle>
              <CardDescription>
                We use this to credit your approved payouts. Encrypted at rest.
              </CardDescription>
            </div>
            {bank && !editing && (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Edit3 className="h-4 w-4 mr-1.5" /> Edit
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {bank && !editing ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Account holder" value={bank.accountHolder} />
                  <Field label="Bank name" value={bank.bankName} />
                  <Field label="Account number" value={maskAccount(bank.accountNumber)} />
                  <Field label="IFSC" value={bank.ifsc} />
                  <Field label="UPI ID" value={bank.upi} icon={Smartphone} />
                  <Field label="PAN" value={bank.pan} />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground rounded-lg border bg-muted/30 p-3">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  Your details are stored securely and never shared with third parties.
                </div>
              </motion.div>
            ) : (
              <Form {...bankForm}>
                <form onSubmit={bankForm.handleSubmit(onSaveBank)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={bankForm.control}
                      name="accountHolder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account holder name</FormLabel>
                          <FormControl><Input placeholder="As per bank records" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={bankForm.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank name</FormLabel>
                          <FormControl><Input placeholder="HDFC Bank" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={bankForm.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account number</FormLabel>
                          <FormControl>
                            <Input
                              inputMode="numeric"
                              placeholder="1234567890"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={bankForm.control}
                      name="ifsc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IFSC code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="HDFC0001234"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={bankForm.control}
                      name="upi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UPI ID</FormLabel>
                          <FormControl><Input placeholder="name@upi" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={bankForm.control}
                      name="pan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PAN number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ABCDE1234F"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="bg-gradient-primary shadow-glow">
                      <ShieldCheck className="h-4 w-4 mr-1.5" /> Save details
                    </Button>
                    {bank && (
                      <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-0 shadow-card bg-gradient-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" /> Request payout
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Submit a withdrawal request to admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...reqForm}>
              <form onSubmit={reqForm.handleSubmit(onRequest)} className="space-y-4">
                <FormField
                  control={reqForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-foreground/90">Amount (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={500}
                          placeholder="500"
                          className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive-foreground" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={reqForm.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-foreground/90">Payout method</FormLabel>
                      <Tabs value={field.value} onValueChange={field.onChange}>
                        <TabsList className="grid grid-cols-2 w-full bg-primary-foreground/10">
                          <TabsTrigger value="upi" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                            <Smartphone className="h-4 w-4 mr-1.5" /> UPI
                          </TabsTrigger>
                          <TabsTrigger value="bank" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                            <Building2 className="h-4 w-4 mr-1.5" /> Bank
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="upi" className="mt-2 text-xs text-primary-foreground/85">
                          To: {bank?.upi || "Add UPI in bank details"}
                        </TabsContent>
                        <TabsContent value="bank" className="mt-2 text-xs text-primary-foreground/85">
                          To: {bank ? `${bank.bankName} • ${maskAccount(bank.accountNumber)}` : "Add bank details"}
                        </TabsContent>
                      </Tabs>
                    </FormItem>
                  )}
                />
                <FormField
                  control={reqForm.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-foreground/90">Note (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={2}
                          placeholder="Anything the admin should know"
                          className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={createPayout.isPending || !bank}
                  className="w-full bg-background text-foreground hover:bg-background/90"
                >
                  {createPayout.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="h-4 w-4 mr-1.5" /> Send request to admin</>
                  )}
                </Button>
                <Separator className="bg-primary-foreground/20" />
                <p className="text-xs text-primary-foreground/85">
                  Min ₹500 • Reviewed within 24h • 1% TDS deducted
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle>Request history</CardTitle>
          <CardDescription>All withdrawals you've submitted</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <Wallet className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium">No payout requests yet</p>
              <p className="text-sm text-muted-foreground">Submit your first request above.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r: any) => (
                  <TableRow key={r._id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell className="font-semibold">{formatINR(r.amount)}</TableCell>
                    <TableCell className="capitalize">{r.method}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.method === "upi" ? r.details?.upi : maskAccount(r.details?.accountNumber || "")}
                    </TableCell>
                    <TableCell>{statusBadge(r.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ElementType }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2.5 text-sm font-medium">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        {value}
      </div>
    </div>
  );
}
