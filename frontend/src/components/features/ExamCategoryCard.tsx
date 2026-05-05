import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Clock, GraduationCap, MapPin } from "lucide-react";

// ── Mini Countdown ──────────────────────────────────────────────────────────
function useCountdown(examDate: string | null) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, active: false });

  useEffect(() => {
    if (!examDate) return;
    const calc = () => {
      const diff = new Date(examDate).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, active: false }); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        active: true
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [examDate]);

  return timeLeft;
}

interface ExamCategoryCardProps {
  category: any;
  idx: number;
  isOpen: boolean;
  onToggle: () => void;
  onViewSyllabus: () => void;
  onRegister: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
  onViewMPSC?: () => void;
  onViewPolice?: () => void;
  onViewMAHATET?: () => void;
  onViewDynamicExam?: (examName: string) => void;
  examDate?: string | null;
}

export function ExamCategoryCard({ 
  category, 
  idx, 
  isOpen, 
  onToggle, 
  onViewSyllabus, 
  onRegister, 
  isSelected, 
  onSelect,
  onViewMPSC,
  onViewPolice,
  onViewMAHATET,
  onViewDynamicExam,
  examDate
}: ExamCategoryCardProps) {
  const countdown = useCountdown(examDate || null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05 }}
      onClick={() => onToggle()}
      className={`group flex flex-col bg-white rounded-2xl border border-gray-100 transition-all duration-300 relative cursor-pointer overflow-hidden ${isOpen ? 'shadow-2xl ring-2 ring-primary -translate-y-2' : 'hover:shadow-lg hover:-translate-y-1'}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={category.thumb} 
          alt={`${category.title} Coaching`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
        
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2">
            <span className="text-sm">{category.icon}</span>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Exam Center</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-6">
          <h3 className="text-xl font-display font-black text-white leading-tight">
            {category.title}
          </h3>
        </div>

        <div className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={18} />
        </div>
      </div>

      {/* Timer Section */}
      <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
        {countdown.active ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-primary" />
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Exam Countdown</span>
            </div>
            <div className="flex gap-2">
              {[
                { val: countdown.days, label: 'd' },
                { val: countdown.hours, label: 'h' },
                { val: countdown.minutes, label: 'm' },
              ].map((b) => (
                <div key={b.label} className="flex items-baseline gap-0.5">
                  <span className="text-dark font-black text-sm">{String(b.val).padStart(2, '0')}</span>
                  <span className="text-[9px] font-bold text-primary uppercase">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 opacity-50">
            <Clock size={14} />
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Batches Starting Soon</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <div>
                {category.subcategories && category.subcategories.length > 0 ? (
                  category.subcategories.map((sub: any) => (
                    <div key={sub.name} className="mb-4 last:mb-0">
                      <p className="label-text mb-2 text-[10px]">{sub.name}</p>
                      <div className="flex flex-wrap gap-2">
                        {sub.exams && sub.exams.map((exam: string) => (
                          <button 
                            key={exam} 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              if (category.id === 12 && onViewMPSC) onViewMPSC();
                              else if (exam.includes("Maharashtra Police Bharti") && onViewPolice) onViewPolice();
                              else if (exam === "MAHA TET (Maharashtra)" && onViewMAHATET) onViewMAHATET();
                              else if (onViewDynamicExam) onViewDynamicExam(category.title);
                              else onRegister();
                            }}
                            className="text-[11px] font-semibold text-dark px-3 py-1.5 bg-gray-50 rounded-lg hover:bg-primary/20 hover:text-dark transition-colors border border-gray-100"
                          >
                            {exam}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted italic">Preparing strategic resources for you...</p>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={(e) => { e.stopPropagation(); onSelect && onSelect(); onRegister(); }}
                  className="w-full btn-primary-new py-3 text-xs"
                >
                  {isSelected ? 'Course Selected ✓' : 'Inquire Now'}
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (onViewDynamicExam) onViewDynamicExam(category.title);
                    else onViewSyllabus(); 
                  }}
                   className="w-full btn-outline-new py-3 text-xs"
                 >
                   View Strategy
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ExamCategoryCard;
