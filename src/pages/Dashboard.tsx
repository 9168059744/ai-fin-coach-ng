import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Wallet, PiggyBank, Target, ChartBar, ArrowUpRight, ArrowDownRight, Bell, Settings, LogOut, Plus, Send, CreditCard, Calendar, Star, Award, Clock, CircleAlert, CircleCheck, ChevronDown, Menu, X, Users, Sparkles, Zap, Landmark, Receipt, RefreshCw, GraduationCap, Ellipsis, Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/App";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

// ─── Types ───────────────────────────────────────────────
interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "transfer" | "bill" | "investment";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  category: "savings" | "investment" | "emergency" | "education";
}

interface Investment {
  id: string;
  name: string;
  amount: number;
  returns: number;
  roi: number;
  duration: string;
  status: "active" | "matured" | "pending";
}

// ─── Helpers ──────────────────────────────────────────────
function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function generateId() { return crypto.randomUUID(); }

function today() { return new Date().toISOString().split("T")[0]; }

// ─── Default Data ─────────────────────────────────────────
function defaultTransactions(): Transaction[] {
  return [
    { id: generateId(), type: "deposit", amount: 250000, description: "Salary Deposit - GTBank", date: "2025-01-15", status: "completed" },
    { id: generateId(), type: "deposit", amount: 50000, description: "Freelance Payment - Upwork", date: "2025-01-14", status: "completed" },
    { id: generateId(), type: "withdrawal", amount: 35000, description: "ATM Withdrawal - Access Bank", date: "2025-01-13", status: "completed" },
    { id: generateId(), type: "transfer", amount: 15000, description: "Transfer to Mom", date: "2025-01-12", status: "completed" },
    { id: generateId(), type: "bill", amount: 5000, description: "Airtime - MTN", date: "2025-01-11", status: "completed" },
    { id: generateId(), type: "investment", amount: 100000, description: "Agric Fund Investment", date: "2025-01-10", status: "completed" },
    { id: generateId(), type: "deposit", amount: 75000, description: "Side Business Revenue", date: "2025-01-09", status: "pending" },
  ];
}

function defaultGoals(): Goal[] {
  return [
    { id: generateId(), title: "Emergency Fund", target: 1000000, current: 450000, deadline: "2025-06-30", category: "emergency" },
    { id: generateId(), title: "Rent Savings", target: 1500000, current: 900000, deadline: "2025-08-15", category: "savings" },
    { id: generateId(), title: "Investment Portfolio", target: 2000000, current: 500000, deadline: "2025-12-31", category: "investment" },
    { id: generateId(), title: "SkillUp Course", target: 350000, current: 200000, deadline: "2025-03-31", category: "education" },
  ];
}

function defaultInvestments(): Investment[] {
  return [
    { id: generateId(), name: "Agric Green Fund", amount: 500000, returns: 37500, roi: 7.5, duration: "6 months", status: "active" },
    { id: generateId(), name: "Real Estate Trust", amount: 1000000, returns: 120000, roi: 12, duration: "12 months", status: "active" },
    { id: generateId(), name: "Fixed Deposit - UBA", amount: 300000, returns: 13500, roi: 4.5, duration: "3 months", status: "matured" },
  ];
}

// ─── Chart data ────────────────────────────────────────────
const spendingData = [
  { month: "Aug", spending: 180000, savings: 120000 },
  { month: "Sep", spending: 165000, savings: 135000 },
  { month: "Oct", spending: 210000, savings: 90000 },
  { month: "Nov", spending: 145000, savings: 155000 },
  { month: "Dec", spending: 280000, savings: 70000 },
  { month: "Jan", spending: 195000, savings: 155000 },
];

const categoryData = [
  { name: "Food & Drinks", value: 35, color: "#16a34a" },
  { name: "Transport", value: 20, color: "#fbbf24" },
  { name: "Bills & Utilities", value: 18, color: "#3b82f6" },
  { name: "Shopping", value: 15, color: "#a855f7" },
  { name: "Others", value: 12, color: "#6b7280" },
];

// ─── Dashboard Component ──────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Data state
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick transfer
  const [transferAmount, setTransferAmount] = useState("");
  const [transferAccount, setTransferAccount] = useState("");
  const [transferBank, setTransferBank] = useState("");

  // New goal
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", target: "", deadline: "", category: "savings" as Goal["category"] });

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("fl_data");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setBalance(data.balance ?? 2450000);
        setTransactions(data.transactions ?? defaultTransactions());
        setGoals(data.goals ?? defaultGoals());
        setInvestments(data.investments ?? defaultInvestments());
      } catch {
        setDefaults();
      }
    } else {
      setDefaults();
    }
    setLoading(false);
  }, []);

  const setDefaults = () => {
    setBalance(2450000);
    setTransactions(defaultTransactions());
    setGoals(defaultGoals());
    setInvestments(defaultInvestments());
  };

  const saveData = useCallback((b: number, t: Transaction[], g: Goal[], i: Investment[]) => {
    localStorage.setItem("fl_data", JSON.stringify({ balance: b, transactions: t, goals: g, investments: i }));
  }, []);

  useEffect(() => {
    if (!loading) saveData(balance, transactions, goals, investments);
  }, [balance, transactions, goals, investments, loading, saveData]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  // ─── Quick Transfer ────────────────────────────────────
  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(transferAmount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    if (!transferAccount || transferAccount.length < 10) { toast.error("Enter a valid account number"); return; }
    if (amt > balance) { toast.error("Insufficient balance"); return; }
    const txn: Transaction = {
      id: generateId(), type: "transfer", amount: amt,
      description: `Transfer to ${transferBank || "Nigerian Bank"} - ${transferAccount}`,
      date: today(), status: "pending",
    };
    setBalance((b) => b - amt);
    setTransactions((prev) => [txn, ...prev]);
    setTransferAmount("");
    setTransferAccount("");
    setTransferBank("");
    toast.success(`₦${amt.toLocaleString()} transferred successfully!`);
  };

  // ─── Goals ──────────────────────────────────────────────
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) {
      toast.error("Please fill in all fields");
      return;
    }
    const target = Number(newGoal.target);
    if (target <= 0) { toast.error("Target must be greater than 0"); return; }
    const goal: Goal = {
      id: generateId(), title: newGoal.title, target, current: 0,
      deadline: newGoal.deadline, category: newGoal.category,
    };
    setGoals((prev) => [...prev, goal]);
    setNewGoal({ title: "", target: "", deadline: "", category: "savings" });
    setShowGoalForm(false);
    toast.success("Goal created! 🎯");
  };

  const handleGoalContribute = (goalId: string) => {
    const amount = Math.floor(Math.random() * 50000) + 10000;
    setGoals((prev) => prev.map((g) => g.id === goalId ? { ...g, current: Math.min(g.current + amount, g.target) } : g));
    const txn: Transaction = {
      id: generateId(), type: "deposit", amount,
      description: `Contribution to "${goals.find((g) => g.id === goalId)?.title}"`,
      date: today(), status: "completed",
    };
    setTransactions((prev) => [txn, ...prev]);
    toast.success(`₦${amount.toLocaleString()} contributed to goal!`);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    toast.success("Goal removed");
  };

  // ─── Stats ─────────────────────────────────────────────
  const totalIncome = transactions.filter((t) => t.type === "deposit" && t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type !== "deposit" && t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const totalInvested = investments.filter((i) => i.status === "active").reduce((s, i) => s + i.amount, 0);
  const totalReturns = investments.filter((i) => i.status === "active").reduce((s, i) => s + i.returns, 0);
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  // ─── Mobile sidebar ─────────────────────────────────────
  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const sidebarLinks = [
    { id: "overview", label: "Overview", icon: ChartBar },
    { id: "transactions", label: "Transactions", icon: Receipt },
    { id: "goals", label: "Goals", icon: Target },
    { id: "investments", label: "Investments", icon: TrendingUp },
    { id: "transfer", label: "Send Money", icon: Send },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-green-emerald to-gold flex items-center justify-center">
            <TrendingUp className="size-4 text-white" />
          </div>
          <span className="font-bold text-sm text-gradient">Financial Ladder</span>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {sidebarLinks.map((l) => (
          <button
            key={l.id}
            onClick={() => { setActiveTab(l.id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
              activeTab === l.id
                ? "bg-green-emerald/20 text-green-emerald font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <l.icon className="size-4" />
            {l.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-white/5 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5">
          <Settings className="size-4" /> Settings
        </button>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut className="size-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64 bg-white/5" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-xl bg-white/5" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-white/5 bg-sidebar">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-60 h-full bg-sidebar border-r border-white/5"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass border-b border-white/5">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3">
              <button className="md:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
                <Menu className="size-5" />
              </button>
              <div>
                <h1 className="font-semibold text-sm capitalize">{activeTab.replace("-", " ")}</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Welcome back, {user?.name?.split(" ")[0]}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative size-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <Bell className="size-4" />
                <span className="absolute -top-0.5 -right-0.5 size-3 bg-gold rounded-full text-[8px] font-bold text-black flex items-center justify-center">3</span>
              </button>
              <Avatar className="size-8 cursor-pointer">
                <AvatarFallback className="bg-gradient-to-br from-green-emerald to-green-forest text-white text-xs font-bold">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* ── OVERVIEW TAB ── */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Balance card */}
                  <div className="glass-strong rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-green-emerald/20 to-transparent rounded-full blur-[60px]" />
                    <div className="relative z-10">
                      <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
                      <h2 className="text-3xl sm:text-4xl font-bold text-gradient-gold">{formatNaira(balance)}</h2>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={`${savingsRate >= 30 ? "border-green-emerald/30 text-green-emerald" : "border-gold/30 text-gold"} bg-white/5`}>
                          <TrendingUp className="size-3 mr-1" /> {savingsRate}% savings rate
                        </Badge>
                        <Badge variant="outline" className="border-white/10 bg-white/5 text-muted-foreground">
                          <Clock className="size-3 mr-1" /> Updated {today()}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Monthly Income", value: formatNaira(totalIncome), icon: ArrowUpRight, color: "text-green-emerald" },
                      { label: "Monthly Expenses", value: formatNaira(totalExpenses), icon: ArrowDownRight, color: "text-red-400" },
                      { label: "Total Invested", value: formatNaira(totalInvested), icon: TrendingUp, color: "text-gold" },
                      { label: "Investment Returns", value: formatNaira(totalReturns), icon: Award, color: "text-green-emerald" },
                    ].map((s, i) => (
                      <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="glass-card p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">{s.label}</span>
                          <s.icon className={`size-4 ${s.color}`} />
                        </div>
                        <div className="text-lg font-bold">{s.value}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Charts */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Spending vs Savings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={spendingData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.02 145 / 0.3)" />
                            <XAxis dataKey="month" stroke="oklch(0.65 0.01 145)" fontSize={12} />
                            <YAxis stroke="oklch(0.65 0.01 145)" fontSize={12} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                            <Tooltip
                              contentStyle={{ background: "oklch(0.18 0.02 145)", border: "1px solid oklch(0.3 0.02 145 / 0.5)", borderRadius: "0.5rem", color: "#fff" }}
                              formatter={(value: number) => formatNaira(value)}
                            />
                            <Bar dataKey="spending" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="savings" fill="#16a34a" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Spending by Category</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                              {categoryData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ background: "oklch(0.18 0.02 145)", border: "1px solid oklch(0.3 0.02 145 / 0.5)", borderRadius: "0.5rem", color: "#fff" }}
                              formatter={(value: number) => `${value}%`}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap gap-3 mt-2 justify-center">
                          {categoryData.map((c) => (
                            <div key={c.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <div className="size-2.5 rounded-full" style={{ background: c.color }} />
                              {c.name} ({c.value}%)
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent transactions */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("transactions")} className="text-xs text-muted-foreground">
                        View All <ChevronDown className="size-3" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {transactions.slice(0, 5).map((t) => (
                          <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`size-9 rounded-lg flex items-center justify-center ${
                                t.type === "deposit" ? "bg-green-emerald/20" :
                                t.type === "withdrawal" ? "bg-red-500/20" :
                                t.type === "transfer" ? "bg-blue-500/20" :
                                t.type === "bill" ? "bg-purple-500/20" : "bg-gold/20"
                              }`}>
                                {t.type === "deposit" ? <ArrowUpRight className="size-4 text-green-emerald" /> :
                                 t.type === "withdrawal" ? <ArrowDownRight className="size-4 text-red-400" /> :
                                 t.type === "transfer" ? <Send className="size-4 text-blue-400" /> :
                                 t.type === "bill" ? <Receipt className="size-4 text-purple-400" /> :
                                 <TrendingUp className="size-4 text-gold" />}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{t.description}</p>
                                <p className="text-xs text-muted-foreground">{t.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm font-medium ${t.type === "deposit" ? "text-green-emerald" : "text-red-400"}`}>
                                {t.type === "deposit" ? "+" : "-"}{formatNaira(t.amount)}
                              </p>
                              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${
                                t.status === "completed" ? "border-green-emerald/30 text-green-emerald" :
                                t.status === "pending" ? "border-gold/30 text-gold" : "border-red-500/30 text-red-400"
                              }`}>
                                {t.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ── TRANSACTIONS TAB ── */}
              {activeTab === "transactions" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Transaction History</h2>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Search..." className="w-48 bg-white/5 border-white/10 h-9 text-sm" />
                      <Button variant="outline" size="sm" className="h-9">
                        <RefreshCw className="size-3 mr-1" /> Filter
                      </Button>
                    </div>
                  </div>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-0">
                      {transactions.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                          <Receipt className="size-12 mx-auto mb-3 opacity-50" />
                          <p>No transactions yet</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-white/5">
                          {transactions.map((t) => (
                            <div key={t.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className={`size-10 rounded-lg flex items-center justify-center ${
                                  t.type === "deposit" ? "bg-green-emerald/20" :
                                  t.type === "withdrawal" ? "bg-red-500/20" :
                                  t.type === "transfer" ? "bg-blue-500/20" :
                                  t.type === "bill" ? "bg-purple-500/20" : "bg-gold/20"
                                }`}>
                                  {t.type === "deposit" ? <ArrowUpRight className="size-4 text-green-emerald" /> :
                                   t.type === "withdrawal" ? <ArrowDownRight className="size-4 text-red-400" /> :
                                   t.type === "transfer" ? <Send className="size-4 text-blue-400" /> :
                                   t.type === "bill" ? <Receipt className="size-4 text-purple-400" /> :
                                   <TrendingUp className="size-4 text-gold" />}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{t.description}</p>
                                  <p className="text-xs text-muted-foreground">{t.date}</p>
                                </div>
                              </div>
                              <div className="text-right flex items-center gap-3">
                                <div>
                                  <p className={`text-sm font-medium ${t.type === "deposit" ? "text-green-emerald" : "text-red-400"}`}>
                                    {t.type === "deposit" ? "+" : "-"}{formatNaira(t.amount)}
                                  </p>
                                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${
                                    t.status === "completed" ? "border-green-emerald/30 text-green-emerald" :
                                    t.status === "pending" ? "border-gold/30 text-gold" : "border-red-500/30 text-red-400"
                                  }`}>
                                    {t.status}
                                  </Badge>
                                </div>
                                <button className="text-muted-foreground hover:text-foreground">
                                  <Ellipsis className="size-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ── GOALS TAB ── */}
              {activeTab === "goals" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Financial Goals</h2>
                      <p className="text-sm text-muted-foreground">Track your progress toward financial freedom</p>
                    </div>
                    <Button onClick={() => setShowGoalForm(true)} className="bg-gradient-to-r from-green-emerald to-green-forest text-white">
                      <Plus className="size-4 mr-1" /> New Goal
                    </Button>
                  </div>

                  {/* Goal form */}
                  <AnimatePresence>
                    {showGoalForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <Card className="bg-white/5 border-white/10 mb-6">
                          <CardContent className="p-6">
                            <form onSubmit={handleAddGoal} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="space-y-1.5">
                                <Label className="text-xs">Goal Title</Label>
                                <Input
                                  placeholder="e.g. Emergency Fund"
                                  value={newGoal.title}
                                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                  className="bg-white/5 border-white/10"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs">Target Amount (₦)</Label>
                                <Input
                                  type="number"
                                  placeholder="1,000,000"
                                  value={newGoal.target}
                                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                                  className="bg-white/5 border-white/10"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs">Deadline</Label>
                                <Input
                                  type="date"
                                  value={newGoal.deadline}
                                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                                  className="bg-white/5 border-white/10"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs">Category</Label>
                                <select
                                  value={newGoal.category}
                                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal["category"] })}
                                  className="w-full h-9 rounded-md bg-white/5 border border-white/10 px-3 text-sm text-foreground"
                                >
                                  <option value="savings">Savings</option>
                                  <option value="investment">Investment</option>
                                  <option value="emergency">Emergency</option>
                                  <option value="education">Education</option>
                                </select>
                              </div>
                              <div className="sm:col-span-2 lg:col-span-4 flex gap-2 justify-end">
                                <Button type="button" variant="ghost" onClick={() => setShowGoalForm(false)}>Cancel</Button>
                                <Button type="submit" className="bg-gradient-to-r from-green-emerald to-green-forest text-white">
                                  <Plus className="size-4 mr-1" /> Create Goal
                                </Button>
                              </div>
                            </form>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Goals grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {goals.length === 0 ? (
                      <div className="sm:col-span-2 lg:col-span-3 p-12 text-center text-muted-foreground glass-card">
                        <Target className="size-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">No goals yet</p>
                        <p className="text-sm">Create your first financial goal to get started</p>
                      </div>
                    ) : (
                      goals.map((goal, i) => {
                        const progress = Math.min(Math.round((goal.current / goal.target) * 100), 100);
                        const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                        return (
                          <motion.div
                            key={goal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card p-5 group"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <Badge variant="outline" className={`text-[10px] border-white/10 ${
                                goal.category === "savings" ? "text-green-emerald" :
                                goal.category === "investment" ? "text-gold" :
                                goal.category === "emergency" ? "text-red-400" : "text-blue-400"
                              }`}>
                                {goal.category}
                              </Badge>
                              <button onClick={() => handleDeleteGoal(goal.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all">
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                            <h3 className="font-semibold text-sm mb-1">{goal.title}</h3>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                              <span>{formatNaira(goal.current)} of {formatNaira(goal.target)}</span>
                              <span>{daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}</span>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${
                                  progress >= 100 ? "bg-green-emerald" :
                                  progress >= 50 ? "bg-gold" : "bg-green-forest"
                                }`}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">{progress}%</span>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={progress >= 100}
                                onClick={() => handleGoalContribute(goal.id)}
                                className="h-7 text-xs border-white/10"
                              >
                                <Plus className="size-3 mr-1" /> Contribute
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* ── INVESTMENTS TAB ── */}
              {activeTab === "investments" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Investment Portfolio</h2>
                      <p className="text-sm text-muted-foreground">Track your investment performance</p>
                    </div>
                    <Button className="bg-gradient-to-r from-green-emerald to-green-forest text-white">
                      <Plus className="size-4 mr-1" /> New Investment
                    </Button>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="glass-card p-4">
                      <p className="text-xs text-muted-foreground mb-1">Total Invested</p>
                      <p className="text-xl font-bold">{formatNaira(totalInvested)}</p>
                    </div>
                    <div className="glass-card p-4">
                      <p className="text-xs text-muted-foreground mb-1">Total Returns</p>
                      <p className="text-xl font-bold text-green-emerald">{formatNaira(totalReturns)}</p>
                    </div>
                    <div className="glass-card p-4">
                      <p className="text-xs text-muted-foreground mb-1">Avg ROI</p>
                      <p className="text-xl font-bold text-gold">
                        {investments.filter((i) => i.status === "active").length > 0
                          ? `${(investments.filter((i) => i.status === "active").reduce((s, i) => s + i.roi, 0) / investments.filter((i) => i.status === "active").length).toFixed(1)}%`
                          : "0%"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {investments.map((inv, i) => (
                      <motion.div
                        key={inv.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-xl bg-gradient-to-br from-green-emerald/20 to-gold/20 flex items-center justify-center">
                            <TrendingUp className="size-6 text-green-emerald" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{inv.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{inv.duration}</span>
                              <span>•</span>
                              <Badge variant="outline" className={`text-[10px] ${
                                inv.status === "active" ? "border-green-emerald/30 text-green-emerald" :
                                inv.status === "matured" ? "border-gold/30 text-gold" : "border-white/20 text-muted-foreground"
                              }`}>
                                {inv.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-6">
                          <div>
                            <p className="text-xs text-muted-foreground">Invested</p>
                            <p className="text-sm font-medium">{formatNaira(inv.amount)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Returns</p>
                            <p className="text-sm font-medium text-green-emerald">+{formatNaira(inv.returns)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">ROI</p>
                            <p className="text-sm font-bold text-gold">{inv.roi}%</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TRANSFER TAB ── */}
              {activeTab === "transfer" && (
                <div className="max-w-lg mx-auto space-y-6">
                  <div>
                    <h2 className="text-xl font-bold">Send Money</h2>
                    <p className="text-sm text-muted-foreground">Transfer to any Nigerian bank account</p>
                  </div>

                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-6">
                      <form onSubmit={handleTransfer} className="space-y-4">
                        <div className="glass-card p-4 text-center">
                          <p className="text-xs text-muted-foreground mb-1">Available Balance</p>
                          <p className="text-2xl font-bold text-gradient-gold">{formatNaira(balance)}</p>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs">Bank</Label>
                          <select
                            value={transferBank}
                            onChange={(e) => setTransferBank(e.target.value)}
                            className="w-full h-9 rounded-md bg-white/5 border border-white/10 px-3 text-sm text-foreground"
                          >
                            <option value="">Select bank</option>
                            <option value="GTBank">GTBank</option>
                            <option value="Access Bank">Access Bank</option>
                            <option value="First Bank">First Bank</option>
                            <option value="Zenith Bank">Zenith Bank</option>
                            <option value="UBA">UBA</option>
                            <option value="Opay">Opay</option>
                            <option value="PalmPay">PalmPay</option>
                            <option value="Moniepoint">Moniepoint</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs">Account Number</Label>
                          <Input
                            placeholder="0123456789"
                            value={transferAccount}
                            onChange={(e) => setTransferAccount(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            className="bg-white/5 border-white/10"
                            maxLength={10}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs">Amount (₦)</Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            className="bg-white/5 border-white/10"
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-green-emerald to-green-forest hover:from-green-emerald/90 hover:to-green-forest/90 text-white py-5"
                        >
                          <Send className="size-4 mr-2" /> Send Money
                        </Button>

                        <p className="text-[10px] text-center text-muted-foreground">
                          Transfers are processed instantly. No fees for transfers under ₦100,000.
                        </p>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}