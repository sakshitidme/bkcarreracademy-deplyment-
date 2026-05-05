import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import ExamCategoryCard from '../components/features/ExamCategoryCard';
import CourseCard from '../components/CourseCard';
import { EXAM_CATEGORIES } from '../data/constants';

interface CoursesProps {
  selectedCategory: number | null;
  activeNavCategory: number;
  dynamicCourses: any[];
  dynamicExams: any[];
  onViewSyllabus: (id: number) => void;
  onRegister: () => void;
  onSelectCategory: (id: number | null) => void;
  onViewMPSC: () => void;
  onViewPolice: () => void;
  onViewMAHATET: () => void;
  onViewDynamicExam?: (examName: string) => void;
}

export const Courses: React.FC<CoursesProps> = ({
  selectedCategory,
  dynamicCourses,
  onViewSyllabus,
  onRegister,
  onSelectCategory,
  onViewMPSC,
  onViewPolice,
  onViewMAHATET,
  onViewDynamicExam
}) => {
  const [activeCipherId, setActiveCipherId] = React.useState<number | null>(null);
  const [examDates, setExamDates] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const [examsResp, coursesResp, upscResp] = await Promise.all([
          fetch('/api/content/exams'),
          fetch('/api/content/courses'),
          fetch('/api/content/upsc_hub')
        ]);
        
        const [examsData, coursesData, upscData] = await Promise.all([
          examsResp.json(),
          coursesResp.json(),
          upscResp.json()
        ]);
        
        const allItems = [
          ...(examsData.items || []),
          ...(coursesData.items || []),
          ...(upscData.items || [])
        ];

        const map: Record<string, string> = {};
        allItems.forEach((item: any) => {
          if (item.examDate && item.category) {
            const cleanKey = item.category.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            if (!map[cleanKey]) {
              map[cleanKey] = item.examDate;
            }
          }
        });
        setExamDates(map);
      } catch (e) { console.error("Date Fetch Failed:", e); }
    };
    fetchDates();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg"
    >
      <section className="pt-40 pb-20">
        <div className="section-container">
          <header className="mb-16">
            <p className="label-text mb-4">Our Curriculum</p>
            <h2 className="section-heading md:text-6xl">
              Explore Our <span className="text-primary">Programs</span>
            </h2>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-8 border-t border-gray-100 mt-8">
              <p className="body-text text-lg max-w-2xl">
                Choose your path to success. We provide comprehensive guidance and resources for India's most prestigious competitive examinations.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => onSelectCategory(null)}
                  className={`px-8 py-4 rounded-2xl font-display font-bold uppercase tracking-widest transition-all duration-300 ${!selectedCategory ? 'bg-dark text-primary shadow-xl shadow-primary/10' : 'bg-white text-dark border border-gray-100 hover:bg-gray-50'}`}
                >
                  All Exams
                </button>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start mb-20">
            {EXAM_CATEGORIES.map((category, idx) => {
              const cleanKey = category.title.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
              const examDate = examDates[cleanKey] || null;

              return (
                <ExamCategoryCard 
                  key={category.id}
                  category={category}
                  idx={idx}
                  isOpen={activeCipherId === category.id}
                  onToggle={() => setActiveCipherId(activeCipherId === category.id ? null : category.id)}
                  onViewSyllabus={() => onViewSyllabus(category.id)}
                  onRegister={onRegister}
                  isSelected={selectedCategory === category.id}
                  onSelect={() => onSelectCategory(selectedCategory === category.id ? null : category.id)}
                  onViewMPSC={onViewMPSC}
                  onViewPolice={onViewPolice}
                  onViewMAHATET={onViewMAHATET}
                  onViewDynamicExam={onViewDynamicExam}
                  examDate={examDate}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Courses Section */}
      {dynamicCourses.length > 0 && !selectedCategory && (
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="section-container">
            <div className="flex flex-col mb-12">
              <p className="label-text mb-4">Special Batches</p>
              <h2 className="section-heading">
                Specialized <span className="text-primary">Programs</span>
              </h2>
              <p className="body-text mt-4 max-w-2xl">
                Tailored coaching modules focusing on specific exam patterns and latest syllabus updates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {dynamicCourses.map((course, index) => (
                <CourseCard 
                  key={course._id || course.id} 
                  course={course} 
                  index={index} 
                  onClick={() => {
                    if (course.subCategory || course.title) {
                      onViewDynamicExam && onViewDynamicExam(course.subCategory || course.title);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default Courses;
