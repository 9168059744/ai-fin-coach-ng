import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Star, TrendingUp, Wallet, Shield, Target, Smartphone, BookOpen, MessageCircle, ChartBar, Users, Menu, X, ChevronDown, Sparkles, Zap, GraduationCap, PiggyBank, Landmark, MapPin, Award, ChevronRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/App";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] } }),
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const features = [
  { icon: PiggyBank, title: "Smart Savings", desc: "Automated savings plans with competitive interest rates tailored for Nigerian earners." },
  { icon: TrendingUp, title: "Investment Growth", desc: "Access curated investment opportunities in agriculture, real estate, and fixed income." },
  { icon: Wallet, title: "Digital Wallet", desc: "Send money instantly to any Nigerian bank, pay bills, and buy airtime — all in one place." },
  { icon: Shield, title: "Bank-Grade Security", desc: "Your money is protected with 256-bit encryption and NIBSS-compliant infrastructure." },
  { icon: Target, title: "Goal Tracking", desc: "Set financial goals and track your progress with visual milestones and smart reminders." },
  { icon: BookOpen, title: "Financial Literacy", desc: "Learn personal finance through bite-sized courses tailored to the Nigerian market." },
  { icon: MessageCircle, title: "AI Financial Coach", desc: "Get personalized financial advice from our AI coach that understands the Nigerian economy." },
  { icon: ChartBar, title: "Spend Analytics", desc: "Understand your spending patterns with AI-powered categorization and insights." },
];

const pricing = [
  { name: "Starter", price: "Free", popular: false, features: ["Digital wallet", "Basic savings", "Spend tracking", "Bank transfers", "Customer support"] },
  { name: "Growth", price: "₦1,500/mo", popular: true, features: ["Everything in Starter", "Goal-based savings", "Investment access", "AI coach (basic)", "Financial literacy courses", "Priority support"] },
  { name: "Premium", price: "₦5,000/mo", popular: false, features: ["Everything in Growth", "Premium investments", "AI coach (advanced)", "Personal finance advisor", "Exclusive webinars", "Family account sharing", "VIP support"] },
];

const testimonials = [
  { name: "Chioma O.", role: "Lagos", text: "Financial Ladder helped me save over ₦500,000 in 6 months. The AI coach kept me accountable!" },
  { name: "Emeka O.", role: "Abuja", text: "The investment platform opened doors I never had access to as a regular salary earner." },
  { name: "Amina B.", role: "Kano", text: "I finally understand my finances. The literacy courses changed how I think about money." },
];

const faqs = [
  { q: "Is Financial Ladder licensed by the CBN?", a: "Yes, we operate under a CBN-licensed payment service bank framework, ensuring your funds are held in regulated accounts." },
  { q: "How do I withdraw my money?", a: "You can withdraw to any Nigerian bank account instantly. Withdrawals under ₦1M are processed immediately, 24/7." },
  { q: "What are the minimum investment amounts?", a: "Investment minimums start from as low as ₦1,000, making it accessible for everyone to start building wealth." },
  { q: "Is my money safe?", a: "Absolutely. We use bank-grade encryption, biometric authentication, and all funds are held in licensed custodian accounts." },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  useEffect(() => {
    if (mobileMenu) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenu]);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-8 rounded-lg bg-gradient-to-br from-green-emerald to-gold flex items-center justify-center">
              <TrendingUp className="size-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gradient">Financial Ladder</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Button onClick={() => navigate("/dashboard")} className="bg-gradient-to-r from-green-emerald to-green-forest hover:from-green-emerald/90 hover:to-green-forest/90 text-white">
                Dashboard <ArrowRight className="size-4" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
                <Button onClick={() => navigate("/auth?tab=signup")} className="bg-gradient-to-r from-green-emerald to-green-forest hover:from-green-emerald/90 hover:to-green-forest/90 text-white">
                  Get Started <ArrowRight className="size-4" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-foreground p-2" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 pt-16 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center gap-6 pt-12 px-4">
              {navLinks.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setMobileMenu(false)} className="text-lg text-muted-foreground hover:text-foreground transition-colors">
                  {l.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
                {user ? (
                  <Button onClick={() => { setMobileMenu(false); navigate("/dashboard"); }} className="w-full bg-gradient-to-r from-green-emerald to-green-forest text-white">
                    Dashboard <ArrowRight className="size-4" />
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => { setMobileMenu(false); navigate("/auth"); }} className="w-full">
                      Sign In
                    </Button>
                    <Button onClick={() => { setMobileMenu(false); navigate("/auth?tab=signup"); }} className="w-full bg-gradient-to-r from-green-emerald to-green-forest text-white">
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section style={{ opacity: heroOpacity, scale: heroScale }} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-emerald/20 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/15 rounded-full blur-[100px] animate-float" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-green-forest/20 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-xs border-gold/30 text-gold bg-gold/5">
              <Sparkles className="size-3 mr-1.5" /> Trusted by 50,000+ Nigerians
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Climb the{" "}
            <span className="text-gradient-gold">Financial Ladder</span>
            <br />
            <span className="text-muted-foreground">and Build Real Wealth</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Nigeria's intelligent financial platform — save smarter, invest wiser, and grow your wealth
            with AI-powered tools designed for the African economy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {user ? (
              <Button size="lg" onClick={() => navigate("/dashboard")} className="bg-gradient-to-r from-green-emerald to-green-forest hover:from-green-emerald/90 hover:to-green-forest/90 text-white px-8 py-6 text-lg rounded-xl glow-green">
                Go to Dashboard <ArrowRight className="size-5" />
              </Button>
            ) : (
              <Button size="lg" onClick={() => navigate("/auth?tab=signup")} className="bg-gradient-to-r from-green-emerald to-green-forest hover:from-green-emerald/90 hover:to-green-forest/90 text-white px-8 py-6 text-lg rounded-xl glow-green">
                Start Your Journey <ArrowRight className="size-5" />
              </Button>
            )}
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg rounded-xl border-white/20" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
              Explore Features <ChevronDown className="size-4" />
            </Button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              { value: "₦2.5B+", label: "Total Savings" },
              { value: "50K+", label: "Active Users" },
              { value: "98.5%", label: "Uptime" },
              { value: "4.9★", label: "App Rating" },
            ].map((s, i) => (
              <div key={i} className="glass-card p-4 text-center">
                <div className="text-xl font-bold text-gold">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </motion.section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-green-emerald/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="text-gradient-gold">Grow Wealth</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto">
              Purpose-built for the Nigerian market — from inflation-proof savings to smart investments.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card p-6 group cursor-default"
              >
                <div className="size-12 rounded-xl bg-gradient-to-br from-green-emerald/20 to-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="size-6 text-green-emerald" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">
              Start in{" "}
              <span className="text-gradient-gold">3 Simple Steps</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto">
              Get started with your financial journey in minutes, not days.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { step: "01", icon: UserPlus, title: "Create Account", desc: "Sign up for free in under 60 seconds. No paperwork, no hidden fees." },
              { step: "02", icon: PiggyBank, title: "Set Your Goals", desc: "Tell us your financial goals and we'll create a personalized plan." },
              { step: "03", icon: TrendingUp, title: "Start Growing", desc: "Watch your wealth grow with automated savings and smart investments." },
            ].map((s, i) => (
              <motion.div key={s.step} variants={fadeUp} custom={i} className="text-center">
                <div className="size-16 rounded-full bg-gradient-to-br from-green-emerald to-green-forest flex items-center justify-center mx-auto mb-4 glow-green">
                  <s.icon className="size-7 text-white" />
                </div>
                <Badge variant="secondary" className="mb-3">{s.step}</Badge>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, Transparent{" "}
              <span className="text-gradient-gold">Pricing</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto">
              No hidden fees. No surprises. Upgrade or cancel anytime.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {pricing.map((p, i) => (
              <motion.div
                key={p.name}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -5 }}
                className={`relative glass-card p-8 ${p.popular ? "border-gold/40 ring-1 ring-gold/30" : ""}`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-gold to-amber-400 text-black font-semibold px-4">
                      <Zap className="size-3 mr-1" /> Most Popular
                    </Badge>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                <div className="text-3xl font-bold text-gold mb-6">{p.price}</div>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="size-4 text-green-emerald shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${p.popular ? "bg-gradient-to-r from-green-emerald to-green-forest text-white hover:from-green-emerald/90 hover:to-green-forest/90" : "bg-white/10 hover:bg-white/20 text-foreground"}`}
                  onClick={() => navigate("/auth?tab=signup")}
                >
                  {p.name === "Starter" ? "Get Started Free" : "Subscribe Now"} <ArrowRight className="size-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-24 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-emerald/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">
              Trusted by{" "}
              <span className="text-gradient-gold">Thousands</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto">
              Hear from Nigerians who have transformed their financial lives.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                custom={i}
                className="glass-card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="size-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-br from-green-emerald to-green-forest flex items-center justify-center text-xs font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">
              Got{" "}
              <span className="text-gradient-gold">Questions?</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground">
              We've got answers. If you can't find what you're looking for, reach out to our support team.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-3"
          >
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="glass-card overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-300 ${activeFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-green-emerald/5 to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your{" "}
              <span className="text-gradient-gold">Financial Journey?</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
              Join 50,000+ Nigerians who are already climbing the financial ladder. Your first month is on us.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Button size="lg" onClick={() => navigate("/dashboard")} className="bg-gradient-to-r from-green-emerald to-green-forest hover:from-green-emerald/90 hover:to-green-forest/90 text-white px-10 py-6 text-lg rounded-xl glow-green">
                  Go to Dashboard <ArrowRight className="size-5" />
                </Button>
              ) : (
                <Button size="lg" onClick={() => navigate("/auth?tab=signup")} className="bg-gradient-to-r from-green-emerald to-green-forest hover:from-green-emerald/90 hover:to-green-forest/90 text-white px-10 py-6 text-lg rounded-xl glow-green">
                  Create Free Account <ArrowRight className="size-5" />
                </Button>
              )}
              <Button variant="outline" size="lg" className="px-10 py-6 text-lg rounded-xl border-white/20">
                <MapPin className="size-4" /> Find Us in Lagos
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 rounded-lg bg-gradient-to-br from-green-emerald to-gold flex items-center justify-center">
                  <TrendingUp className="size-4 text-white" />
                </div>
                <span className="font-bold text-gradient">Financial Ladder</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nigeria's intelligent financial platform helping you save, invest, and grow your wealth.
              </p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Security", "FAQ"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Cookies", "Licenses"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © 2025 Financial Ladder. All rights reserved. Licensed by the Central Bank of Nigeria.
            </p>
            <div className="flex items-center gap-4">
              <Award className="size-4 text-gold" />
              <span className="text-xs text-muted-foreground">NDIC Insured up to ₦500,000</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}