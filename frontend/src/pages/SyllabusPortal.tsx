import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft,
  ChevronDown,
  Book,
  Download,
  Search,
  Filter,
  Library,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface SyllabusPortalProps {
  category: any;
  onBack: () => void;
  onRegister: () => void;
  initialModule?: string | null;
  view: string;
  setView: (view: any) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  setIsRegistrationModalOpen: (open: boolean) => void;
  setIsAdmissionModalOpen: (open: boolean) => void;
}

export const SyllabusPortal: React.FC<SyllabusPortalProps> = ({
  category,
  onBack,
  onRegister,
  initialModule = null,
  view,
  setView,
  isMenuOpen,
  setIsMenuOpen,
  setIsRegistrationModalOpen,
  setIsAdmissionModalOpen
}) => {
  const [activeModule, setActiveModule] = useState<string | null>(initialModule);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    'UPSC', 'MPSC', 'SSC', 'Banking', 'Railway', 'Defence', 
    'Teaching', 'Insurance', 'Engineering', 'Law', 'Medical', 'FCI', 'Question Papers'
  ];

  useEffect(() => {
    setLoading(true);
    const isQP = activeModule === 'Question Papers';
    const url = (activeModule && !isQP && activeModule !== 'All') ? `/api/books?category=${activeModule}` : '/api/books';
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (isQP) {
            const filtered = data.items.filter((b: any) => 
              b.category && b.category.toLowerCase().includes('question paper')
            );
            setBooks(filtered);
          } else {
            setBooks(data.items);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeModule]);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (book.category && book.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-bg min-h-screen"
    >
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 h-20">
        <div className="section-container h-full flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onBack}
          >
            <div className="w-10 h-10 bg-dark rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Library size={20} />
            </div>
            <div>
              <span className="text-xl font-display font-black text-dark block leading-none">Digital Archive</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Book Portal</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={onRegister}
              className="btn-primary-new px-6 py-2.5 text-[10px]"
            >
              Request Special Notes
            </button>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <header className="pt-48 pb-16 bg-white border-b border-gray-100">
        <div className="section-container">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="max-w-3xl">
              <button 
                onClick={onBack}
                className="group flex items-center gap-2 text-muted mb-8 hover:text-primary transition-colors"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Return to Dashboard</span>
              </button>
              <h1 className="text-5xl md:text-7xl font-display font-black text-dark leading-tight mb-6">
                Knowledge <span className="text-primary text-glow">Repository</span>
              </h1>
              <p className="text-lg text-body font-body max-w-2xl leading-relaxed">
                Access Nashik's most comprehensive digital library. Specialized notes and strategic roadmaps for all major competitive exams.
              </p>
            </div>

            <div className="w-full lg:w-96">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-body"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16">
        <div className="section-container">
          {/* Filter Bar */}
          <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-3 min-w-max">
              {['All', ...categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveModule(cat === 'All' ? null : cat)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    (activeModule === cat || (cat === 'All' && !activeModule))
                      ? 'bg-dark text-primary border-dark shadow-lg shadow-primary/5'
                      : 'bg-white text-muted border-gray-100 hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-xs font-bold text-muted uppercase tracking-[0.2em]">Indexing Library...</p>
              </div>
            ) : filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredBooks.map((book: any, i) => (
                    <motion.div 
                      key={book._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-2xl hover:shadow-primary/10 transition-all group flex flex-col h-full"
                    >
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-dark group-hover:bg-primary group-hover:text-dark transition-colors mb-6">
                        <Book size={24} />
                      </div>
                      
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2">{book.category || 'Academic'}</span>
                        <h4 className="text-xl font-display font-black text-dark mb-4 leading-tight group-hover:text-primary transition-colors">{book.title}</h4>
                        {book.description && <p className="text-xs text-body line-clamp-3 mb-6 font-body leading-relaxed">{book.description}</p>}
                      </div>

                      <div className="pt-6 border-t border-gray-50 mt-auto">
                        <a 
                          href={book.pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between group/btn"
                          onClick={() => {
                             fetch('/api/track/download', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ formType: book.title, studentName: 'Portal User' })
                             });
                          }}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest text-dark group-hover/btn:translate-x-2 transition-transform flex items-center gap-2">
                            Download PDF <ArrowRight size={14} className="text-primary" />
                          </span>
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover/btn:bg-primary/10">
                            <Download size={14} className="text-dark" />
                          </div>
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-32 text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-muted/30">
                  <Library size={40} />
                </div>
                <h3 className="text-2xl font-display font-black text-dark mb-4 uppercase">No matching resources</h3>
                <p className="text-body font-body mb-8 leading-relaxed">
                  We couldn't find any resources matching your search. Try adjusting your filters or search keywords.
                </p>
                <button 
                  onClick={() => {setSearchQuery(""); setActiveModule(null)}}
                  className="btn-outline-new px-8 py-3 text-xs"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <section className="bg-dark py-24 text-center border-t-8 border-primary relative overflow-hidden">
         <div className="section-container relative z-10">
            <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase mb-8 leading-tight">
              Cant find what you're <span className="text-primary text-glow">looking</span> for?
            </h2>
            <p className="text-white/60 mb-12 max-w-2xl mx-auto text-lg font-body">
              Contact our academic team for personalized resource assistance or specific exam notes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <button onClick={onRegister} className="btn-primary-new px-12 py-5 text-lg group">
                  Contact Academic Support
               </button>
               <button 
                onClick={() => setIsAdmissionModalOpen(true)}
                className="btn-outline-new border-white/20 text-white hover:bg-white hover:text-dark px-12 py-5 text-lg"
              >
                Request Free Counselling
               </button>
            </div>
         </div>
      </section>
    </motion.div>
  );
};

export default SyllabusPortal;
