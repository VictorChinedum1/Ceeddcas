import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'motion/react';
import { 
  Droplets, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Twitter, 
  Facebook,
  Menu,
  X,
  ArrowRight,
  Zap,
  Waves,
  CheckCircle2,
  Trophy,
  Users,
  Calendar,
  Settings,
  Share2
} from 'lucide-react';
import { cn } from './lib/utils';
import { getTopCarWashCompanies, type CarWashCompany } from './services/geminiService';

// --- Components ---

const Navbar = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
      isScrolled 
        ? "bg-zinc-950/80 backdrop-blur-md border-b border-white/5 py-4 shadow-2xl" 
        : "bg-transparent py-8"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(0,255,204,0.2)]">
            <Droplets className="text-zinc-950 w-6 h-6" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-xl tracking-tight">LUXE<span className="text-brand">WASH</span></span>
            <span className="text-[8px] uppercase tracking-[0.4em] text-zinc-500 font-bold">Global Standards</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {['Services', 'Benchmark', 'Process', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-brand transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand transition-all group-hover:w-full" />
            </a>
          ))}
          <button 
            onClick={onOpenBooking}
            className="bg-white text-zinc-950 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand transition-all transform hover:scale-105 active:scale-95"
          >
            Book Now
          </button>
        </div>

        <button 
          className="md:hidden text-zinc-100 p-2 glass rounded-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-zinc-950 border-b border-white/5 overflow-hidden md:hidden"
          >
            <div className="p-8 flex flex-col gap-6">
              {['Services', 'Benchmark', 'Process', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="text-2xl font-display font-bold text-zinc-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="bg-brand text-zinc-950 py-4 rounded-2xl font-bold text-lg"
              >
                Book Appointment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const images = [
    {
      url: "https://images.unsplash.com/photo-1601362840469-51e4d8d59085?auto=format&fit=crop&q=80&w=1000",
      title: "Active Foam Treatment",
      desc: "Deep cleaning with pH-neutral premium foam."
    },
    {
      url: "https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=1000",
      title: "Interior Precision",
      desc: "Meticulous care for every interior surface."
    },
    {
      url: "https://images.unsplash.com/photo-1552933529-e359b2477252?auto=format&fit=crop&q=80&w=1000",
      title: "Showroom Shine",
      desc: "Advanced ceramic protection and gloss enhancement."
    },
    {
      url: "https://images.unsplash.com/photo-1507136566006-bb7aef55f175?auto=format&fit=crop&q=80&w=1000",
      title: "Wheel & Rim Care",
      desc: "Specialized treatment for high-performance wheels."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9
    })
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + images.length) % images.length);
  };

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with Grid and Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,255,204,0.05)_0%,transparent_70%)]" />
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950" />
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center"
      >
        <div className="text-left max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-[1px] w-12 bg-brand" />
            <span className="text-xs font-bold tracking-[0.4em] uppercase text-brand">Automotive Excellence</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-display font-bold leading-[0.85] mb-8 tracking-tighter"
          >
            THE ART OF <br />
            <span className="text-gradient">PERFECTION</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl text-zinc-400 mb-12 max-w-lg font-light leading-relaxed"
          >
            We don't just wash cars; we restore them to their showroom glory using 
            proprietary techniques inspired by the world's elite detailing studios.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-wrap gap-6 mb-12"
          >
            <button 
              onClick={onOpenBooking}
              className="bg-brand hover:bg-brand-dark text-zinc-950 px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest flex items-center gap-3 transition-all group shadow-[0_0_40px_rgba(0,255,204,0.2)]"
            >
              Book Appointment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="glass hover:bg-white/10 text-white px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest transition-all">
              Our Services
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <button 
              onClick={onOpenBooking}
              className="w-full md:w-auto bg-brand text-zinc-950 px-12 py-6 rounded-2xl font-black text-xl uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,255,204,0.3)] group relative overflow-hidden"
            >
              <span className="relative z-10">Book Now</span>
              <Calendar className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            rotate: 0,
            y: [0, -15, 0]
          }}
          transition={{ 
            duration: 1.5, 
            delay: 0.3, 
            ease: [0.16, 1, 0.3, 1],
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="relative hidden lg:block h-[600px]"
        >
          <div className="relative z-10 h-full rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group/carousel">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 }
                }}
                className="absolute inset-0"
              >
                <img 
                  src={images[currentIndex].url} 
                  alt={images[currentIndex].title} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
                
                <div className="absolute bottom-10 left-10 right-10 p-8 glass rounded-3xl backdrop-blur-md">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-4 mb-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
                      <Sparkles className="text-brand w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-brand">{images[currentIndex].title}</div>
                      <div className="text-sm font-medium text-zinc-300">{images[currentIndex].desc}</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Controls */}
            <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover/carousel:opacity-100 transition-opacity z-20 pointer-events-none">
              <button 
                onClick={() => paginate(-1)}
                className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-brand hover:text-zinc-950 transition-all pointer-events-auto"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => paginate(1)}
                className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-brand hover:text-zinc-950 transition-all pointer-events-auto"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Indicators */}
            <div className="absolute top-8 right-10 flex gap-2 z-20">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    idx === currentIndex ? "w-8 bg-brand" : "w-4 bg-white/20 hover:bg-white/40"
                  )}
                />
              ))}
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 border-t-2 border-r-2 border-brand/30 rounded-tr-[40px]" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 border-b-2 border-l-2 border-brand/30 rounded-bl-[40px]" />
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="w-6 h-10 border-2 border-white/10 rounded-full flex justify-center p-1">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-1 bg-brand rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { label: "Vehicles Restored", value: "12,400+", icon: <Users /> },
    { label: "Expert Detailers", value: "45", icon: <Settings /> },
    { label: "Global Partners", value: "12", icon: <Trophy /> },
    { label: "Customer Rating", value: "4.9/5", icon: <Star /> },
  ];

  return (
    <section className="py-20 border-y border-white/5 bg-zinc-950">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.8, 
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="text-center group"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="text-3xl md:text-5xl font-display font-bold mb-2 tracking-tighter text-white group-hover:text-brand transition-colors"
              >
                {stat.value}
              </motion.div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold group-hover:text-zinc-400 transition-colors">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BenchmarkSection = () => {
  const [companies, setCompanies] = useState<CarWashCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getTopCarWashCompanies().then(data => {
      setCompanies(data);
      setLoading(false);
    });
  }, []);

  const toggleExpand = (name: string) => {
    setExpandedCards(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleShare = (company: CarWashCompany) => {
    if (navigator.share) {
      navigator.share({
        title: company.name,
        text: `Check out ${company.name}, a top car wash company from ${company.country}!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      const emailBody = `Check out ${company.name}, a top car wash company from ${company.country}!\n\n${company.description}`;
      window.location.href = `mailto:?subject=Top Car Wash Recommendation: ${company.name}&body=${encodeURIComponent(emailBody)}`;
    }
  };

  return (
    <section id="benchmark" className="relative py-32 px-6 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-40 blur-2xl"
        >
          <source src="https://player.vimeo.com/external/494252666.sd.mp4?s=727fa3097893f1f7d24785448373f9152a5c136a&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-sky-950/40 to-zinc-950" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-sky-400/20 bg-sky-400/5 text-sky-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
          >
            Industry Benchmarks
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 text-sky-400"
          >
            GLOBAL <span className="italic font-light text-sky-300/50">STANDARDS</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sky-200/70 max-w-2xl mx-auto text-lg font-light"
          >
            We've meticulously studied the world's most successful car wash enterprises 
            to bring their operational excellence to our local studio.
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-80 rounded-[32px] bg-zinc-800/20 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {companies.map((company, idx) => (
              <motion.div 
                key={company.name}
                initial={{ opacity: 0, y: 80, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 1, 
                  delay: idx * 0.15, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="group relative p-10 rounded-[40px] glass hover:bg-white/10 transition-all duration-700 border-white/5 flex flex-col h-full overflow-hidden"
              >
                <div className="absolute top-8 right-10 text-5xl font-display font-black text-white/5 group-hover:text-sky-400/10 transition-colors">
                  0{idx + 1}
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: idx * 0.15 + 0.5 }}
                  className="flex flex-col h-full"
                >
                  <div className="mb-8">
                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-sky-400 mb-2">{company.country}</div>
                    <h4 className="text-2xl font-display font-bold mb-3 tracking-tight text-sky-300">{company.name}</h4>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-sky-200/50 bg-sky-900/20 inline-block px-3 py-1.5 rounded-full border border-sky-400/10">
                      {company.specialty}
                    </div>
                  </div>

                  <motion.p 
                    layout
                    className={cn(
                      "text-sm text-sky-100/60 leading-relaxed font-light mb-4 transition-all duration-500",
                      expandedCards[company.name] ? "" : "line-clamp-3"
                    )}
                  >
                    {company.description}
                  </motion.p>
                  
                  <motion.button 
                    layout
                    onClick={() => toggleExpand(company.name)}
                    className="text-[10px] font-bold uppercase tracking-widest text-sky-400 hover:text-sky-300 transition-colors mb-8 text-left flex items-center gap-1"
                  >
                    {expandedCards[company.name] ? "Read Less" : "Read More"}
                    <motion.div
                      animate={{ rotate: expandedCards[company.name] ? 180 : 0 }}
                    >
                      <ChevronRight size={10} />
                    </motion.div>
                  </motion.button>

                  {/* Testimonials Section */}
                  <motion.div layout className="pt-6 border-t border-white/5 mb-8">
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={10} className="fill-sky-400 text-sky-400" />
                      ))}
                    </div>
                    <p className="text-[10px] italic text-sky-200/40 font-light">
                      "The gold standard in detailing. Unmatched results and professional service."
                    </p>
                  </motion.div>

                  <motion.div layout className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <button 
                      onClick={() => handleShare(company)}
                      className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sky-400 group/share"
                      title="Share"
                    >
                      <Share2 size={14} className="group-hover/share:scale-110 transition-transform" />
                    </button>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-sky-500">Case Study</span>
                      <ArrowRight size={14} className="text-sky-400" />
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const Process = () => {
  const steps = [
    { title: "Inspection", desc: "Full vehicle assessment to identify specific needs.", icon: <CheckCircle2 /> },
    { title: "Preparation", desc: "Pre-wash treatment to loosen stubborn contaminants.", icon: <Droplets /> },
    { title: "Execution", desc: "Precision cleaning using our multi-stage process.", icon: <Zap /> },
    { title: "Protection", desc: "Application of premium sealants and coatings.", icon: <ShieldCheck /> },
  ];

  return (
    <section id="process" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-brand mb-6">Our Methodology</h2>
            <h3 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-8">
              A SCIENTIFIC <br />APPROACH TO <br /><span className="text-gradient">SHINE</span>
            </h3>
            <p className="text-zinc-400 text-lg font-light leading-relaxed mb-12">
              Our process is refined through years of experience and constant 
              testing of new technologies. We follow a strict 4-stage protocol 
              to ensure consistent, world-class results for every vehicle.
            </p>
            <button className="bg-white text-zinc-950 px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-brand transition-all">
              Learn More
            </button>
          </div>
          <div className="grid gap-6">
            {steps.map((step, idx) => (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, y: 40, x: 20 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: idx * 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="group p-8 rounded-3xl glass border-white/5 hover:border-brand/30 transition-all flex gap-6 items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-zinc-950 transition-all">
                  {step.icon}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Step 0{idx + 1}</div>
                  <h4 className="text-xl font-bold mb-1">{step.title}</h4>
                  <p className="text-sm text-zinc-500 font-light">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      title: "Ceramic Coating",
      desc: "Nano-technology protection that lasts for years, providing ultimate gloss and hydrophobicity.",
      icon: <ShieldCheck className="w-8 h-8" />,
      price: "$299+"
    },
    {
      title: "Express Tunnel",
      desc: "High-speed automated wash using soft-touch technology and premium soaps.",
      icon: <Zap className="w-8 h-8" />,
      price: "$15+"
    },
    {
      title: "Interior Detail",
      desc: "Deep cleaning of every surface, steam treatment, and leather conditioning.",
      icon: <Waves className="w-8 h-8" />,
      price: "$149+"
    },
    {
      title: "Paint Correction",
      desc: "Multi-stage machine polishing to remove swirls, scratches, and oxidation.",
      icon: <Sparkles className="w-8 h-8" />,
      price: "$499+"
    }
  ];

  return (
    <section id="services" className="py-32 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-brand mb-6">Service Menu</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold tracking-tight">TAILORED SOLUTIONS</h3>
          </div>
          <p className="text-zinc-500 max-w-md font-light">
            From quick maintenance washes to full-scale restorations, we offer a 
            comprehensive suite of services for every automotive need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <motion.div 
              key={service.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.8, 
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="group p-10 rounded-[40px] border border-white/5 bg-zinc-900/20 hover:border-brand/30 transition-all flex flex-col"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand/5 flex items-center justify-center text-brand mb-8 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h4 className="text-2xl font-display font-bold mb-4 tracking-tight">{service.title}</h4>
              <p className="text-zinc-500 text-sm mb-10 leading-relaxed font-light">
                {service.desc}
              </p>
              <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Starting at</span>
                  <span className="font-display font-bold text-xl text-brand">{service.price}</span>
                </div>
                <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-zinc-400 group-hover:text-brand group-hover:border-brand/50 transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="bg-zinc-950 pt-32 pb-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
                <Droplets className="text-zinc-950 w-6 h-6" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight">LUXE<span className="text-brand">WASH</span></span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-10 font-light">
              Redefining the automotive care experience through precision, 
              technology, and a relentless pursuit of perfection.
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-full glass flex items-center justify-center text-zinc-400 hover:text-brand hover:border-brand/50 transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4 className="font-display font-bold text-lg mb-8 uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-4 text-sm text-zinc-500 font-light">
              {['Home', 'Services', 'Benchmark', 'Process', 'Privacy Policy'].map(item => (
                <li key={item}><a href="#" className="hover:text-brand transition-colors">{item}</a></li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h4 className="font-display font-bold text-lg mb-8 uppercase tracking-widest">Contact</h4>
            <ul className="space-y-6 text-sm text-zinc-500 font-light">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-brand shrink-0" />
                <span>123 Elite Drive, <br />Automotive District, NY 10001</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-brand shrink-0" />
                <span>+1 (555) 000-LUXE</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-brand shrink-0" />
                <span>hello@luxewash.global</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h4 className="font-display font-bold text-lg mb-8 uppercase tracking-widest">Newsletter</h4>
            <p className="text-sm text-zinc-500 mb-6 font-light">Join our elite list for exclusive updates.</p>
            <div className="flex gap-3">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-zinc-900 border border-white/5 rounded-2xl px-6 py-3 text-sm w-full focus:outline-none focus:border-brand/30 transition-all font-light"
              />
              <button className="bg-brand text-zinc-950 px-4 rounded-2xl hover:bg-brand-dark transition-colors">
                <ChevronRight />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
          <p>© 2024 LuxeWash Global. All rights reserved.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:text-zinc-400">Terms of Service</a>
            <a href="#" className="hover:text-zinc-400">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const BookingModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const services = [
    "Ceramic Coating",
    "Express Tunnel",
    "Interior Detail",
    "Paint Correction"
  ];

  const times = ["09:00 AM", "10:30 AM", "12:00 PM", "01:30 PM", "03:00 PM", "04:30 PM"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-xl"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors z-10"
          >
            <X size={24} />
          </button>

          {isSuccess ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="text-brand w-10 h-10" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-4">Booking Confirmed!</h3>
              <p className="text-zinc-400 mb-10 font-light">
                Thank you, {formData.name}. We've sent a confirmation email to {formData.email}. 
                Our team will see you on {formData.date} at {formData.time}.
              </p>
              <button 
                onClick={onClose}
                className="bg-brand text-zinc-950 px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm"
              >
                Close Window
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/3 bg-zinc-800/50 p-10 border-r border-white/5">
                <div className="flex items-center gap-3 mb-12">
                  <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                    <Droplets className="text-zinc-950 w-5 h-5" />
                  </div>
                  <span className="font-display font-bold tracking-tight">LUXE<span className="text-brand">WASH</span></span>
                </div>
                
                <div className="space-y-8">
                  {[
                    { s: 1, t: "Service", d: "Choose your package" },
                    { s: 2, t: "Schedule", d: "Pick date & time" },
                    { s: 3, t: "Details", d: "Contact information" }
                  ].map((item) => (
                    <div key={item.s} className={cn(
                      "flex gap-4 transition-opacity",
                      step === item.s ? "opacity-100" : "opacity-30"
                    )}>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold",
                        step === item.s ? "border-brand text-brand" : "border-zinc-600 text-zinc-600"
                      )}>
                        {item.s}
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest">{item.t}</div>
                        <div className="text-[10px] text-zinc-500 font-medium">{item.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:w-2/3 p-10 md:p-16">
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <h4 className="text-2xl font-display font-bold mb-8">Select Service</h4>
                      <div className="grid gap-4">
                        {services.map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setFormData({...formData, service: s});
                              setStep(2);
                            }}
                            className={cn(
                              "p-5 rounded-2xl border text-left transition-all group",
                              formData.service === s 
                                ? "bg-brand/10 border-brand text-brand" 
                                : "bg-zinc-800/50 border-white/5 hover:border-white/20"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold">{s}</span>
                              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <h4 className="text-2xl font-display font-bold mb-8">Schedule Visit</h4>
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-3 block">Select Date</label>
                          <input 
                            type="date" 
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-brand/30 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-3 block">Select Time</label>
                          <div className="grid grid-cols-3 gap-3">
                            {times.map(t => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setFormData({...formData, time: t})}
                                className={cn(
                                  "py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                                  formData.time === t 
                                    ? "bg-brand text-zinc-950 border-brand" 
                                    : "bg-zinc-800 border-white/5 hover:border-white/20"
                                )}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                          <button 
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 py-4 rounded-xl border border-white/10 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                          >
                            Back
                          </button>
                          <button 
                            type="button"
                            disabled={!formData.date || !formData.time}
                            onClick={() => setStep(3)}
                            className="flex-1 py-4 rounded-xl bg-brand text-zinc-950 font-bold text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <h4 className="text-2xl font-display font-bold mb-8">Contact Details</h4>
                      <div className="space-y-4">
                        <input 
                          type="text" 
                          placeholder="Full Name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-brand/30 transition-all"
                        />
                        <input 
                          type="email" 
                          placeholder="Email Address"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-brand/30 transition-all"
                        />
                        <input 
                          type="tel" 
                          placeholder="Phone Number"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-brand/30 transition-all"
                        />
                        <div className="flex gap-4 pt-4">
                          <button 
                            type="button"
                            onClick={() => setStep(2)}
                            className="flex-1 py-4 rounded-xl border border-white/10 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                          >
                            Back
                          </button>
                          <button 
                            type="submit"
                            disabled={isSubmitting || !formData.name || !formData.email || !formData.phone}
                            className="flex-1 py-4 rounded-xl bg-brand text-zinc-950 font-bold text-xs uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? (
                              <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                            ) : "Confirm Booking"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen selection:bg-brand selection:text-zinc-950 bg-zinc-950">
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />
      <main>
        <Hero onOpenBooking={() => setIsBookingOpen(true)} />
        <Stats />
        <BenchmarkSection />
        <Process />
        <Services />
        
        {/* Call to Action Section */}
        <section className="py-32 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 1.2, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="max-w-7xl mx-auto relative rounded-[60px] overflow-hidden bg-brand p-16 md:p-32 text-center"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand to-brand-dark" />
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-display font-bold text-zinc-950 mb-10 tracking-tighter leading-none">
                EXPERIENCE THE <br />DIFFERENCE TODAY
              </h2>
              <p className="text-zinc-900/80 text-lg md:text-xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
                Join the elite circle of vehicle owners who refuse to settle for 
                anything less than perfection. Your vehicle deserves LuxeWash.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <button 
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-zinc-950 text-white px-12 py-6 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl"
                >
                  Book Appointment
                </button>
                <button className="bg-white/20 backdrop-blur-md border border-white/30 text-zinc-950 px-12 py-6 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white/30 transition-all">
                  Contact Sales
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}
