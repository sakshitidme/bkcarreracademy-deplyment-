import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Star, Globe, ChevronDown, CheckCircle2, Clock, Ruler, Target, ExternalLink, ArrowRight, BookOpen, Users, Trophy, Shield } from 'lucide-react';
import HomeHero from '../components/HomeHero';
import CourseCard from '../components/CourseCard';
import StaffCarousel from '../components/StaffCarousel';
import { STAFF } from '../data/constants';
import { Story } from '../data/stories';

interface HomeProps {
  setView: (view: any) => void;
  setSelectedCategory: (id: number | null) => void;
  setIsRegistrationModalOpen: (open: boolean) => void;
  setIsAdmissionModalOpen: (open: boolean) => void;
  setIsAddStoryModalOpen: (open: boolean) => void;
  dynamicCourses: any[];
  dynamicExams: any[];
  stories: Story[];
  setSelectedExamName: (name: string) => void;
  quickAccessList: any[];
}

export const Home: React.FC<HomeProps> = ({
  setView,
  setSelectedCategory,
  setIsRegistrationModalOpen,
  setIsAdmissionModalOpen,
  dynamicCourses,
  setSelectedExamName,
  quickAccessList
}) => {
  const [selectedTab, setSelectedTab] = React.useState<string>('psi');
  const [heroContent, setHeroContent] = React.useState<any>(null);
  const [faqCategory, setFaqCategory] = React.useState<string>('RAILWAY');

  React.useEffect(() => {
    fetch('/api/content/hero')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.items.length > 0) {
          setHeroContent(data.items[0]);
        }
      })
      .catch(err => console.error("Hero Fetch Error:", err));
  }, []);

  React.useEffect(() => {
    if (quickAccessList && quickAccessList.length > 0) {
      setSelectedTab(quickAccessList[0].category);
    }
  }, [quickAccessList]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-bg"
    >
      <HomeHero 
        setView={setView} 
        setSelectedCategory={setSelectedCategory} 
        onRegistration={() => setIsRegistrationModalOpen(true)}
        onAdmission={() => setIsAdmissionModalOpen(true)}
        heroContent={heroContent}
      />

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Successful Aspirants', value: '10K+', icon: Users },
              { label: 'Expert Mentors', value: '25+', icon: GraduationCap },
              { label: 'Exam Categories', value: '12+', icon: BookOpen },
              { label: 'Success Rate', value: '95%', icon: Trophy },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                  <stat.icon size={24} />
                </div>
                <h3 className="text-3xl font-display font-black text-dark">{stat.value}</h3>
                <p className="label-text text-[10px] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      {dynamicCourses && dynamicCourses.length > 0 && (
        <section className="py-24">
          <div className="section-container">
            <header className="mb-16 text-center max-w-3xl mx-auto">
              <p className="label-text mb-4">Our Curriculum</p>
              <h2 className="section-heading">
                Popular <span className="text-primary">Learning Paths</span>
              </h2>
              <p className="body-text">
                Structured for success, our courses are designed by experts who have been through the journey themselves. Choose your goal and start today.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {dynamicCourses.slice(0, 4).map((course, index) => (
                <CourseCard 
                  key={course._id || course.id} 
                  course={course} 
                  index={index} 
                  onClick={() => {
                    const title = (course.title || "").toLowerCase();
                    if (course.id === 100 || title.includes('police')) {
                      setView('courseDetailPolice');
                    } else if (title.includes('mpsc')) {
                      setView('courseDetailMPSC');
                    } else if (title.includes('tet') || title.includes('teaching')) {
                      setView('courseDetailMAHATET');
                    } else if (course._id) {
                      setSelectedExamName(course.subCategory || course.title);
                      setView('dynamicExamDetail');
                    } else {
                      setSelectedCategory(course.id);
                      setView('courses');
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>

            <div className="mt-16 text-center">
              <button 
                onClick={() => setView('courses')}
                className="btn-outline-new px-10 py-4"
              >
                View All Programs
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Strategic Insights Section */}
      <section className="py-24 bg-bg relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="section-container relative z-10">
          <div className="flex flex-col items-center text-center gap-8 mb-16">
            <div className="max-w-3xl">
              <p className="label-text mb-4">Strategic Guidance</p>
              <h2 className="section-heading mb-0">
                Strategic <span className="text-primary">Insights</span>
              </h2>
              <p className="body-text mt-6">
                Navigate the complexities of competitive examinations with our curated roadmap and eligibility frameworks.
              </p>
            </div>
            
            {/* Tab Switcher - Premium Slider Style */}
            <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto scrollbar-hide w-full lg:w-auto">
              {(quickAccessList && quickAccessList.length > 0 ? quickAccessList : [
                { category: 'psi', title: 'PSI / STI / ASO' },
                { category: 'tet', title: 'TET / CTET' },
                { category: 'police', title: 'POLICE BHARTI' }
              ]).map(tab => (
                <button
                  key={tab.category}
                  onClick={() => setSelectedTab(tab.category)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                    selectedTab === tab.category 
                      ? 'bg-dark text-primary shadow-lg scale-[1.02]' 
                      : 'text-muted hover:text-dark hover:bg-gray-50'
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid grid-cols-1 gap-8"
            >
              {quickAccessList.some(q => q.category === selectedTab) ? (
                quickAccessList.filter(q => q.category === selectedTab).map(item => (
                  <div 
                    key={item._id}
                    className="group"
                  >
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                      {/* Card Header */}
                      <div className="p-8 md:p-12 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-white to-gray-50/50">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-dark rounded-2xl flex items-center justify-center text-primary shadow-xl group-hover:scale-110 transition-transform duration-500">
                            {selectedTab === 'psi' ? <Trophy size={32} /> : selectedTab === 'police' ? <Shield size={32} /> : <GraduationCap size={32} />}
                          </div>
                          <div>
                            <h3 className="text-2xl md:text-4xl font-display font-black text-dark">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="px-3 py-1 bg-primary/10 rounded-full text-[9px] font-bold text-primary uppercase tracking-widest">{item.subCategory || 'Exam Overview'}</span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full" />
                              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Strategic Roadmap 2026</span>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => {
                            if (item.category === 'psi') setView('courseDetailMPSC');
                            else if (item.category === 'police') setView('courseDetailPolice');
                            else if (item.category === 'tet') setView('courseDetailMAHATET');
                            else {
                              setSelectedExamName(item.subCategory || item.title);
                              setView('dynamicExamDetail');
                            }
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex items-center gap-3 px-6 py-3 bg-dark text-primary rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-dark transition-all duration-300 group/btn shadow-lg"
                        >
                          Deep Explanation <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                      
                      {/* Card Body */}
                      <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 relative">
                        {/* Vertical Divider for desktop */}
                        <div className="hidden md:block absolute left-1/2 top-12 bottom-12 w-px bg-gray-100 -translate-x-1/2" />
                        
                        {item.dynamicSections?.map((module: any, mIdx: number) => (
                          <div key={mIdx} className="space-y-6 relative">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                {mIdx === 0 ? <CheckCircle2 size={20} /> : <Target size={20} />}
                              </div>
                              <h4 className="text-lg font-display font-black text-dark uppercase tracking-tight">{module.title}</h4>
                            </div>
                            <div 
                              className="text-sm md:text-base text-body leading-relaxed prose-container max-w-none"
                              dangerouslySetInnerHTML={{ __html: module.content }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Card Footer - Visual Accent */}
                      <div className="h-2 bg-gradient-to-r from-primary via-dark to-primary/50" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-[2.5rem] p-12 border border-dashed border-gray-200 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-muted">
                    <Clock size={32} className="animate-pulse" />
                  </div>
                  <p className="text-muted uppercase font-bold tracking-widest text-xs">Curating resources for {selectedTab}...</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Staff Section */}
      <section className="py-24">
        <div className="section-container">
          <header className="mb-16 text-center">
            <p className="label-text mb-4">Our Faculty</p>
            <h2 className="section-heading">
              Meet Our <span className="text-primary">Expert Mentors</span>
            </h2>
            <p className="body-text mt-4 max-w-2xl mx-auto">
              Learn from the best. Our faculty includes former officers and industry veterans with years of experience.
            </p>
          </header>
          <StaffCarousel staff={STAFF} />
        </div>
      </section>

      {/* Resources */}
      <section className="py-24 bg-white relative">
        <div className="section-container">
          <header className="mb-16 text-center max-w-3xl mx-auto">
            <p className="label-text mb-4">Learning Hub</p>
            <h2 className="section-heading">
              Important <span className="text-primary">Resources</span>
            </h2>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: "THE HINDU", url: "https://www.thehindu.com", img: "/images/resources/the-hindu-new.webp" },
              { name: "PIB INDIA", url: "https://pib.gov.in", img: "/images/resources/press-information-bureau.webp" },
              { name: "THE INDIAN EXPRESS", url: "https://indianexpress.com", img: "/images/resources/the-indian-express.webp" },
              { name: "LOKSATTA", url: "https://www.loksatta.com", img: "/images/resources/loksatta.png" },
              { name: "UPSC", url: "https://www.upsc.gov.in", img: "/images/resources/upscs.jpeg" },
              { name: "MPSC", url: "https://mpsc.gov.in", img: "/images/resources/mpsc-logo.webp" },
              { name: "SSC", url: "https://ssc.nic.in", img: "/images/resources/ssc-resc-logo.webp" },
              { name: "RBI", url: "https://www.rbi.org.in", img: "/images/resources/download.jpg" },
              { name: "INDIAN RAILWAYS", url: "https://indianrailways.gov.in", img: "/images/resources/railways-logo.webp" },
              { name: "MAHARASHTRA TIMES", url: "https://maharashtratimes.com", img: "/images/resources/maharashtra-times.webp" },
              { name: "MY GOV", url: "https://www.mygov.in", img: "/images/resources/my-gov.webp" },
              { name: "AAPLE SARKAR", url: "https://aaplesarkar.mahaonline.gov.in", img: "/images/resources/aaple-sarkar.webp" },
            ].map((res, i) => (
              <a 
                key={res.name}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 aspect-square border border-gray-50"
              >
                <div className="flex-grow flex items-center justify-center w-full">
                  <img 
                    src={res.img} 
                    alt={res.name}
                    className="max-w-full max-h-[64px] object-contain transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=' + res.name;
                    }}
                  />
                </div>
                <div className="mt-6">
                  <span className="text-[11px] font-black text-dark uppercase tracking-widest leading-tight">{res.name}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-bg">
        <div className="section-container max-w-4xl">
          <header className="mb-16 text-center">
            <h2 className="section-heading">
              Common <span className="text-primary">Queries</span>
            </h2>
            
            <div className="flex flex-wrap justify-center gap-2 mt-8">
               {['UPSC', 'MPSC', 'SSC', 'BANK'].map(cat => (
                 <button 
                  key={cat}
                  onClick={() => setFaqCategory(cat)}
                  className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${faqCategory === cat ? 'bg-dark text-primary shadow-lg' : 'bg-white text-dark border border-gray-100 hover:bg-gray-50'}`}
                 >
                   {cat}
                 </button>
               ))}
            </div>
          </header>

          <div className="space-y-4">
             {(faqCategory === 'UPSC' ? [
               { q: "How many attempts are allowed in UPSC?", a: "General category candidates have 6 attempts, OBC have 9, and SC/ST candidates have no attempt limit until the age of 37." },
               { q: "What is the age limit?", a: "The general age limit is 21-32 years, with relaxations for reserved categories." },
             ] : [
               { q: "What is the selection process?", a: "The process typically involves a Preliminary exam, a Main exam, and a Personal Interview." },
               { q: "Is Marathi compulsory for MPSC?", a: "Yes, candidates must be proficient in Marathi and have passed it at the 10th standard level." },
             ]).map((faq, i) => (
               <FAQItem key={i + faqCategory} question={faq.q} answer={faq.a} />
             ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between text-left"
      >
        <span className="text-sm font-bold text-dark uppercase tracking-wide">
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition-transform ${isOpen ? 'rotate-180 bg-primary text-dark' : 'text-muted'}`}>
           <ChevronDown size={18} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 text-sm text-body leading-relaxed border-t border-gray-50 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
