import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Users } from 'lucide-react';
import { SocialIcon } from '../common/SocialIcon';

interface FooterProps {
  setView: (view: any) => void;
  setSelectedCategory: (id: number | null) => void;
  setIsRegistrationModalOpen: (open: boolean) => void;
  setSelectedExamName?: (name: string) => void;
}

const VisitorCounter = () => {
  const [count, setCount] = React.useState(125432);
  const [dbStatus, setDbStatus] = React.useState<'checking' | 'connected' | 'offline'>('checking');
  
  React.useEffect(() => {
    fetch('/api/visitor-count')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCount(data.count);
          setDbStatus(data.isOffline ? 'offline' : 'connected');
        }
      })
      .catch(() => setDbStatus('offline'));

    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, Math.random() * 15000 + 8000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-8 pt-8 border-t border-ink/5">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 bg-white border-2 border-ink flex items-center justify-center shadow-[4px_4px_0_0_#1A1A1A]">
            <Users size={20} className="text-ink" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-2xl font-display font-black text-ink leading-none">
            {count.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted mt-1 flex items-center gap-2">
            Total Portal Visits 
          </div>
        </div>
      </div>
    </div>
  );
};

const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M4 4l11.733 16h4.267l-11.733-16z" />
    <path d="M4 20l6.768-6.768m2.46-2.46L20 4" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ setView, setSelectedCategory, setIsRegistrationModalOpen, setSelectedExamName }) => {
  return (
    <footer className="relative bg-white border-t-8 border-ink pt-20 pb-12 px-8 overflow-hidden">
      <div className="absolute top-0 right-0 text-[15rem] font-display font-black text-ink/[0.02] leading-none select-none -translate-y-1/4 translate-x-1/4">
        BKCA
      </div>

      <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20 relative z-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 border-4 border-ink flex items-center justify-center bg-brand">
              <span className="font-display font-black text-2xl text-red-600">BK</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-display font-black uppercase leading-none text-ink">Career Academy</span>
              <span className="text-[10px] font-mono text-brand font-bold uppercase tracking-widest mt-1">Education & Welfare Society</span>
            </div>
          </div>
          <p className="text-muted font-body text-sm leading-relaxed max-w-sm mb-10">
            Founded with the sole purpose of democratizing elite civil services coaching. We don't just teach modules; we forge administrative leaders for India's future.
          </p>
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-3xl font-display font-black text-ink">10K+</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand font-bold">Trusted Aspirants</span>
            </div>
            <div className="w-px h-10 bg-ink/10" />
            <div className="flex flex-col">
              <span className="text-3xl font-display font-black text-ink">95%</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand font-bold">Strategic Success</span>
            </div>
          </div>
          <VisitorCounter />
        </div>

        <div>
          <h4 className="text-lg font-display font-bold mb-8 flex items-center gap-3">
            <span className="text-brand opacity-60">02</span>
            <span className="uppercase tracking-wider text-ink">About Exam</span>
          </h4>
          <ul className="space-y-4 text-sm text-muted font-body">
            <li><Link to="/exam/UPSC%20(IAS%2C%20IPS%2C%20IFS)" onClick={() => { setSelectedExamName?.('UPSC (IAS, IPS, IFS)'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand transition-colors block">UPSC Civil Services</Link></li>
            <li><Link to="/mpsc" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-brand transition-colors block">MPSC Exams</Link></li>
            <li><Link to="/exam/SSC%20(Staff%20Selection%20Commission)" onClick={() => { setSelectedExamName?.('SSC (Staff Selection Commission)'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand transition-colors block">SSC CGL</Link></li>
            <li><Link to="/exam/Banking%20%26%20Finance%20Exams" onClick={() => { setSelectedExamName?.('Banking & Finance Exams'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand transition-colors block">Banking & Finance</Link></li>
            <li><Link to="/exam/Defence%20Exams" onClick={() => { setSelectedExamName?.('Defence Exams'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand transition-colors block">Defence Exams</Link></li>
            <li><Link to="/police" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-brand transition-colors block">Police Bharti</Link></li>
            <li><Link to="/exam/Railway%20Exams%20(RRB)" onClick={() => { setSelectedExamName?.('Railway Exams (RRB)'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand transition-colors block">Railway Exams (RRB)</Link></li>
            <li><Link to="/exam/Teaching%20%26%20Education%20Exams" onClick={() => { setSelectedExamName?.('Teaching & Education Exams'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand transition-colors block">Teaching & Education</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-display font-bold mb-8 flex items-center gap-3">
            <span className="text-brand opacity-60">03</span>
            <span className="uppercase tracking-wider text-ink">Contact Us</span>
          </h4>
          <ul className="space-y-4 text-sm text-muted font-body">
            <li><button onClick={() => setIsRegistrationModalOpen(true)} className="hover:text-brand transition-colors cursor-pointer">Contact Us</button></li>
            <li><button onClick={() => setIsRegistrationModalOpen(true)} className="hover:text-brand transition-colors cursor-pointer">Enquiry</button></li>
            <li><button onClick={() => setIsRegistrationModalOpen(true)} className="hover:text-brand transition-colors cursor-pointer">Be A Partner</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-display font-bold mb-6 uppercase tracking-wider text-ink">Corporate Office</h4>
          <div className="space-y-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-none bg-brand/10 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-none bg-brand" />
              </div>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=BK+Career+Academy+Gajanan+Plaza+Nashik" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted leading-relaxed hover:text-brand transition-colors"
              >
                2nd Floor, Gajanan Plaza,<br />
                Gharpura Ghat Rd, Nashik,<br />
                Maharashtra 422002
              </a>
            </div>
            <div className="flex flex-col gap-1 text-xl font-display font-bold text-brand">
              <a href="tel:02532313962" className="flex items-center gap-3 hover:scale-105 origin-left transition-transform">
                <div className="w-8 h-8 rounded-none bg-brand/10 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-none bg-brand" />
                </div>
                0253-2313962
              </a>
              <a href="tel:9890633962" className="flex items-center gap-3 hover:scale-105 origin-left transition-transform">
                <div className="w-8 h-8 rounded-none bg-brand/10 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-none bg-brand" />
                </div>
                9890633962
              </a>
            </div>
            <a href="mailto:bkgroupofeducation@gmail.com" className="flex items-center gap-3 text-sm font-display font-bold text-ink/60 hover:text-brand transition-colors">
              <div className="w-8 h-8 rounded-none bg-brand/10 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-none bg-brand" />
              </div>
              bkgroupofeducation@gmail.com
            </a>
            <div className="flex gap-4 pt-2">
              <SocialIcon Icon={Facebook} href="https://www.facebook.com/profile.php?id=61581568062602" />
              <SocialIcon Icon={Instagram} href="https://www.instagram.com/bk_groupofeducation/" />
              <SocialIcon Icon={XIcon} href="https://x.com/BKTimesNews" />
              <SocialIcon Icon={Linkedin} href="https://www.linkedin.com/company/112511315/admin/dashboard/" />
              <SocialIcon Icon={Youtube} href="https://www.youtube.com/@bkcareeracademy2025" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto pt-10 border-t border-ink/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <Link to="/" className="flex items-center gap-4 cursor-pointer group" onClick={() => { setSelectedCategory(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
           <div className="w-10 h-10 border-4 border-ink flex items-center justify-center bg-brand group-hover:rotate-6 transition-transform">
              <span className="font-display font-black text-xl text-red-600">BK</span>
            </div>
          <div className="flex flex-col">
            <div className="text-lg text-ink font-display font-black uppercase leading-none">Career Academy</div>
            <div className="text-[10px] text-brand font-mono uppercase tracking-wider font-bold mt-1">Education & Welfare Society</div>
          </div>
        </Link>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs text-muted font-mono uppercase tracking-widest opacity-60">
          <a href="#" className="hover:text-brand transition-colors">CSR Policy</a>
          <a href="#" className="hover:text-brand transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand transition-colors">Refund Rules</a>
          <a href="#" className="hover:text-brand transition-colors">Terms & Conditions</a>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto mt-12 text-[10px] text-ink/10 font-mono uppercase text-center pointer-events-none select-none">
        UPSC Coaching Nashik • MPSC Classes Nashik • Banking Exam Prep Maharashtra • SSC CGL Coaching Nashik • Police Bharti Training Nashik • Best Competitive Exam Academy Nashik • BK Career Academy Nashik Maharashtra
      </div>
    </footer>
  );
};

export default Footer;
