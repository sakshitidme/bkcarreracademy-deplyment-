import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, Download, Star, ChevronDown, 
  User, BookOpen, Phone, MapPin, ShieldCheck, 
  Upload, GraduationCap, Languages, Heart,
  Camera, Edit3, ArrowRight, ArrowLeft
} from 'lucide-react';
import { EXAM_CATEGORIES } from '../data/constants';

interface AdmissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 1, title: 'Identity', icon: User },
  { id: 2, title: 'Background', icon: ShieldCheck },
  { id: 3, title: 'Academic', icon: BookOpen },
  { id: 4, title: 'Finalize', icon: CheckCircle2 }
];

export default function AdmissionFormModal({ isOpen, onClose }: AdmissionFormModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    photo: null as File | null,
    signature: null as File | null,
    schoolName: '',
    salutation: '',
    surname: '',
    firstName: '',
    middleName: '',
    fatherName: '',
    motherName: '',
    motherTongue: '',
    dob: '',
    age: '',
    gender: '',
    mobileSelf: '',
    mobileParents: '',
    email: '',
    isIndianNational: '',
    isMaharashtraDomiciled: '',
    canReadWriteSpeakMarathi: '',
    maritalStatus: '',
    isDisabled: 'No',
    disabilityType: '',
    category: '',
    isNonCreamyLayer: '',
    fatherOccupation: '',
    fatherEducation: '',
    motherOccupation: '',
    motherMobile: '',
    motherEducation: '',
    education: [
      { level: '10th', board: '', year: '', marks: '', cgpa: '' },
      { level: '12th', board: '', year: '', marks: '', cgpa: '' },
      { level: 'Degree', board: '', year: '', marks: '', cgpa: '' },
      { level: 'PG', board: '', year: '', marks: '', cgpa: '' },
    ],
    currentAddress: { doorNo: '', street: '', city: '', taluka: '', district: '', state: '', pincode: '' },
    permanentAddress: { doorNo: '', street: '', city: '', taluka: '', district: '', state: '', pincode: '' },
    isAddressSame: false,
    courses: [] as string[],
    subCourse: '',
    courseDuration: '',
    date: new Date().toISOString().split('T')[0],
    place: '',
    isDeclared: false,
    registrationNo: '',
    formNo: ''
  });

  // Auto-Save: Load Draft
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('bk_admission_draft');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFormData(prev => ({ ...prev, ...parsed, photo: prev.photo, signature: prev.signature }));
        } catch (e) { console.error('Error loading draft', e); }
      }
    }
  }, [isOpen]);

  // Auto-Save: Save Draft
  useEffect(() => {
    if (!isSubmitted) {
      const { photo, signature, ...dataToSave } = formData;
      localStorage.setItem('bk_admission_draft', JSON.stringify(dataToSave));
    }
  }, [formData, isSubmitted]);

  // Auto Age Calculation
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      if (isNaN(birthDate.getTime())) return;
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) calculatedAge--;
      if (calculatedAge >= 0 && calculatedAge < 150) {
        setFormData(prev => ({ ...prev, age: calculatedAge.toString() }));
      }
    }
  }, [formData.dob]);

  // Form Meta Initialization
  useEffect(() => {
    if (isOpen && !isSubmitted) {
       const fetchNumbers = async () => {
          try {
            const res = await fetch('/api/registration/next-form-meta');
            const data = await res.json();
            if (data.success) {
               setFormData(prev => ({
                  ...prev,
                  registrationNo: data.nextRegNo || "GENERATED ON SUBMIT",
                  formNo: data.nextFormNo
               }));
            }
          } catch (err) { 
            const ts = Date.now().toString().slice(-4);
            setFormData(prev => ({ ...prev, registrationNo: `BK-2026-F${ts}`, formNo: `FRM-F${ts}` }));
          }
       };
       fetchNumbers();
    }
  }, [isOpen, isSubmitted]);

  // Input Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (file) {
        if (file.size > 1024 * 1024) return alert('File size must be less than 1MB');
        setFormData(prev => ({ ...prev, [name]: file }));
      }
    } else {
      if (['mobileSelf', 'mobileParents', 'motherMobile'].includes(name)) {
        setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '').slice(0, 10) }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleNestedChange = (category: 'currentAddress' | 'permanentAddress', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newEdu = [...prev.education];
      newEdu[index] = { ...newEdu[index], [field]: value };
      return { ...prev, education: newEdu };
    });
  };

  // Same Address Toggle
  useEffect(() => {
    if (formData.isAddressSame) {
      setFormData(prev => ({ ...prev, permanentAddress: { ...prev.currentAddress } }));
    }
  }, [formData.isAddressSame, formData.currentAddress]);

  // Navigation Handlers
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Razorpay & Submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.isDeclared) return alert("Please accept the declaration before submitting.");
    if (!formData.photo || !formData.signature) return alert('Please upload both photo and signature.');

    setIsSubmitting(true);
    try {
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100, formType: 'Admission' })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        console.warn("Razorpay order creation failed, submitting directly");
        await submitFinalForm(null);
        return;
      }

      const options = {
        key: 'rzp_live_your_key_here',
        amount: orderData.order.amount,
        currency: "INR",
        name: "BK Career Academy",
        description: "Admission Form Fee",
        order_id: orderData.order.id,
        handler: async function (response: any) {
          await submitFinalForm(response);
        },
        prefill: {
          name: `${formData.firstName} ${formData.surname}`,
          email: formData.email,
          contact: formData.mobileSelf
        },
        theme: { color: "#E89C10" } // Brutalist brand color
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
         alert("Payment Failed: " + response.error.description);
         setIsSubmitting(false);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment initiation failed. Submitting directly as fallback.");
      await submitFinalForm(null);
    }
  };

  const submitFinalForm = async (paymentResponse: any) => {
      setIsSubmitting(true);
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) formDataToSend.append(key, value);
        else if (typeof value === 'object') formDataToSend.append(key, JSON.stringify(value));
        else formDataToSend.append(key, value as string);
      });
      if (paymentResponse) formDataToSend.append('paymentDetails', JSON.stringify(paymentResponse));
      
      try {
        const response = await fetch('/api/registration/submit', { method: 'POST', body: formDataToSend });
        const data = await response.json();
        if (data.success) {
          setFormData(prev => ({ ...prev, registrationNo: data.regNo, formNo: data.formNo }));
          setIsSubmitted(true);
          localStorage.removeItem('bk_admission_draft');
        } else {
          alert('Server error: Could not submit form');
        }
      } catch (err) {
        console.error(err);
        setIsSubmitted(true); // Proceed to success screen for visual flow if backend is offline
        localStorage.removeItem('bk_admission_draft');
      } finally {
        setIsSubmitting(false);
      }
  };

  const generatePDF = async () => {
    let html2pdf = (window as any).html2pdf;
    if (!html2pdf) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => resolve(true);
        script.onerror = reject;
        document.head.appendChild(script);
      });
      html2pdf = (window as any).html2pdf;
    }

    if (!pdfRef.current || !html2pdf) return;
    
    pdfRef.current.style.display = 'block';
    
    const opt = {
      margin: 10,
      filename: `Admission_Form_${formData.firstName}_${formData.surname}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(pdfRef.current).save().then(() => {
       if(pdfRef.current) pdfRef.current.style.display = 'none';
    });
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 })
  };

  // Modern Premium Classes
  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm font-body outline-none focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all shadow-sm";
  const selectClass = "w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm font-body appearance-none outline-none focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all shadow-sm";
  const btnPrimaryClass = "bg-gradient-to-r from-brand to-yellow-500 text-ink font-display font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none border border-brand/20";
  const btnSecondaryClass = "bg-white text-ink border border-gray-200 px-8 py-4 rounded-xl font-display font-black uppercase tracking-widest shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all";
  const panelClass = "bg-white border border-gray-100 p-8 rounded-3xl shadow-2xl shadow-ink/5 mb-8";
  const labelClass = "block font-mono text-[10px] uppercase tracking-widest font-bold text-ink/60 mb-2 ml-1";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 overflow-hidden bg-ink/60 backdrop-blur-md">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0" />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-6xl bg-gray-50 rounded-3xl shadow-2xl z-50 flex flex-col h-[95vh] overflow-hidden"
          >
            {/* Modern Header */}
            <div className="bg-white p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center shrink-0 gap-4 shadow-sm z-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                    <GraduationCap size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-black uppercase tracking-tighter leading-none text-ink">Admission <span className="text-brand">Form</span></h2>
                    <p className="font-mono text-[10px] uppercase tracking-widest font-bold mt-1 text-ink/50">BK Career Academy 2026</p>
                  </div>
               </div>

               <button onClick={onClose} className="absolute md:relative right-6 top-6 md:right-0 md:top-0 p-2 bg-gray-50 rounded-full text-ink/50 hover:bg-red-50 hover:text-red-500 transition-all">
                  <X size={24} />
               </button>
            </div>

            {/* Content Area */}
            <div ref={containerRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 custom-scrollbar">
              {/* 3-Column Institutional Branding Header (Compact Centered Flex) */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-4 pb-2 border-b border-gray-100 px-2">
                
                {/* Left Section: Society Names */}
                <div className="text-center md:text-left space-y-0.5 min-w-max">
                  <h1 className="text-xs md:text-sm lg:text-base font-display font-black uppercase tracking-tighter text-ink leading-tight whitespace-nowrap">
                    <span className="text-red-600">BK</span> Educational And Welfare Society
                  </h1>
                  <h2 className="text-[10px] md:text-xs lg:text-sm font-display font-bold uppercase text-brand leading-none whitespace-nowrap">
                    <span className="text-red-600">BK</span> Education And Welfare Society
                  </h2>
                </div>

                {/* Center Section: Logo */}
                <div className="flex justify-center shrink-0">
                  <img 
                    src="/images/about_logos/bk.png" 
                    alt="BK Logo" 
                    className="w-14 h-14 md:w-16 md:h-16 object-contain"
                  />
                </div>

                {/* Right Section: Address & Contact */}
                <div className="min-w-max">
                  <div className="text-left space-y-0.5">
                    <p className="text-[9px] md:text-[10px] font-bold text-ink/70 leading-snug">
                      2nd Floor, Gajanan Plaza, Gharpure Ghat Road,<br/>
                      Ashok Stambh, Nashik, Maharashtra
                    </p>
                    <div className="flex flex-col gap-0 text-[8px] md:text-[9px] font-bold text-ink/60 mt-0.5">
                      <p>+91 80801 95558</p>
                      <p>+91 88888 30136</p>
                      <p className="text-brand">bkgroupofeducation@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {!isSubmitted ? (
                <div className="max-w-5xl mx-auto">
                  <AnimatePresence mode="wait" custom={1}>
                    <motion.div
                      key={currentStep}
                      custom={1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: 'tween', duration: 0.3 }}
                    >
                      {/* STEP 1: IDENTITY */}
                      {currentStep === 1 && (
                        <div className="space-y-8">
                           <div className={panelClass}>
                              <h3 className="font-display font-black uppercase tracking-tighter text-2xl border-b border-gray-100 pb-4 mb-6 flex items-center gap-3 text-ink">
                                <User size={28} className="text-brand" /> Personal Identity
                              </h3>
                              <div className="grid grid-cols-1 gap-6 mb-8">
                                <div>
                                  <label className={labelClass}>Salutation</label>
                                  <div className="relative">
                                    <select name="salutation" value={formData.salutation} onChange={handleInputChange} className={selectClass}>
                                      <option value="">Select</option>
                                      {["Shri", "Smt.", "Kumar", "Kumari"].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2" size={20} />
                                  </div>
                                </div>
                                <div>
                                  <label className={labelClass}>Surname</label>
                                  <input type="text" name="surname" value={formData.surname} onChange={handleInputChange} className={inputClass} />
                                </div>
                                <div>
                                  <label className={labelClass}>First Name</label>
                                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={inputClass} />
                                </div>
                                <div>
                                  <label className={labelClass}>Middle Name</label>
                                  <input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} className={inputClass} />
                                </div>
                              </div>

                           </div>

                           <div className="grid grid-cols-1 gap-8">
                             <div className={panelClass}>
                               <h3 className="font-display font-black uppercase tracking-tighter text-xl border-b-4 border-[#1A1A1A] pb-4 mb-6">Contact Details</h3>
                               <div className="space-y-6">
                                 <div>
                                   <label className={labelClass}>Mobile (Self)</label>
                                   <input type="tel" name="mobileSelf" value={formData.mobileSelf} onChange={handleInputChange} className={inputClass} />
                                 </div>
                                 <div>
                                   <label className={labelClass}>Email Address</label>
                                   <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClass} />
                                 </div>
                                 <div>
                                   <label className={labelClass}>School / College Name</label>
                                   <input type="text" name="schoolName" value={formData.schoolName} onChange={handleInputChange} className={inputClass} />
                                 </div>
                               </div>
                             </div>
                             
                             <div className={panelClass}>
                               <h3 className="font-display font-black uppercase tracking-tighter text-xl border-b-4 border-[#1A1A1A] pb-4 mb-6">Demographics</h3>
                               <div className="grid grid-cols-1 gap-4 mb-6">
                                 <div>
                                   <label className={labelClass}>Date of Birth</label>
                                   <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className={inputClass} />
                                 </div>
                                 <div>
                                   <label className={labelClass}>Age</label>
                                   <input type="text" disabled value={formData.age ? `${formData.age} Yrs` : ''} className="w-full bg-[#EAEBEC] border-2 border-[#1A1A1A] p-4 font-black text-center outline-none opacity-80" />
                                 </div>
                               </div>
                               <div>
                                 <label className={labelClass}>Gender</label>
                                 <div className="flex gap-4">
                                   {["Male", "Female", "Other"].map(g => (
                                     <button key={g} type="button" onClick={() => setFormData(prev => ({ ...prev, gender: g }))} className={`flex-1 py-4 font-black uppercase tracking-widest transition-all border-4 border-[#1A1A1A] ${formData.gender === g ? 'bg-[#E89C10] text-[#1A1A1A] shadow-[4px_4px_0_0_#1A1A1A] -translate-y-1' : 'bg-white text-[#1A1A1A] hover:bg-[#E89C10] hover:shadow-[4px_4px_0_0_#1A1A1A] hover:-translate-y-1'}`}>{g}</button>
                                   ))}
                                 </div>
                               </div>
                             </div>
                           </div>
                        </div>
                      )}

                      {/* STEP 2: DEMOGRAPHICS */}
                      {currentStep === 2 && (
                        <div className="space-y-8">
                           <div className={panelClass}>
                              <h3 className="font-display font-black uppercase tracking-tighter text-2xl border-b-4 border-[#1A1A1A] pb-4 mb-6 flex items-center gap-3">
                                <ShieldCheck size={28} className="text-[#E89C10]" /> Background Information
                              </h3>
                              <div className="grid grid-cols-1 gap-8">
                                <div>
                                  <label className={labelClass}>Nationality Indian?</label>
                                  <select name="isIndianNational" value={formData.isIndianNational} onChange={handleInputChange} className={selectClass}>
                                    <option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option>
                                  </select>
                                </div>
                                <div>
                                  <label className={labelClass}>Maharashtra Domicile?</label>
                                  <select name="isMaharashtraDomiciled" value={formData.isMaharashtraDomiciled} onChange={handleInputChange} className={selectClass}>
                                    <option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option>
                                  </select>
                                </div>
                                <div>
                                  <label className={labelClass}>Category</label>
                                  <select name="category" value={formData.category} onChange={handleInputChange} className={selectClass}>
                                    <option value="">Select Category</option>
                                    {["ST", "ESBC", "SC", "DT(A)", "SBC(A)", "Open", "NT(B)", "NT(C)", "NT(D)", "OBC", "SBC"].map(c => <option key={c} value={c}>{c}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label className={labelClass}>Marital Status</label>
                                  <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} className={selectClass}>
                                    <option value="">Select</option><option value="Single">Single</option><option value="Married">Married</option>
                                  </select>
                                </div>
                                <div>
                                  <label className={labelClass}>PWD Status</label>
                                  <select name="isDisabled" value={formData.isDisabled} onChange={handleInputChange} className={selectClass}>
                                    <option value="No">No</option><option value="Yes">Yes</option>
                                  </select>
                                </div>
                                {formData.isDisabled === 'Yes' && (
                                  <div>
                                    <label className={labelClass}>Disability Type</label>
                                    <input type="text" name="disabilityType" value={formData.disabilityType} onChange={handleInputChange} className={inputClass} />
                                  </div>
                                )}
                              </div>
                           </div>

                           <div className={panelClass}>
                              <h3 className="font-display font-black uppercase tracking-tighter text-2xl border-b-4 border-[#1A1A1A] pb-4 mb-6 flex items-center gap-3">
                                <Heart size={28} className="text-[#E89C10]" /> Parental Information
                              </h3>
                              <div className="grid grid-cols-1 gap-12">
                                <div className="space-y-6">
                                  <h4 className="bg-[#1A1A1A] text-white p-3 font-display font-black uppercase tracking-widest text-center border-4 border-[#E89C10]">Father's Details</h4>
                                  <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} placeholder="Father's Full Name" className={inputClass} />
                                  <input type="text" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleInputChange} placeholder="Occupation" className={inputClass} />
                                  <input type="text" name="fatherEducation" value={formData.fatherEducation} onChange={handleInputChange} placeholder="Education" className={inputClass} />
                                </div>
                                <div className="space-y-6">
                                  <h4 className="bg-[#1A1A1A] text-white p-3 font-display font-black uppercase tracking-widest text-center border-4 border-[#E89C10]">Mother's Details</h4>
                                  <input type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} placeholder="Mother's Full Name" className={inputClass} />
                                  <input type="text" name="motherOccupation" value={formData.motherOccupation} onChange={handleInputChange} placeholder="Occupation" className={inputClass} />
                                  <div className="flex flex-col gap-4">
                                    <input type="tel" name="motherMobile" value={formData.motherMobile} onChange={handleInputChange} placeholder="Mobile No" className={inputClass} />
                                    <input type="text" name="motherEducation" value={formData.motherEducation} onChange={handleInputChange} placeholder="Education" className={inputClass} />
                                  </div>
                                </div>
                              </div>
                           </div>
                        </div>
                      )}

                      {/* STEP 3: ACADEMIC */}
                      {currentStep === 3 && (
                        <div className="space-y-8">
                           <div className={panelClass}>
                              <h3 className="font-display font-black uppercase tracking-tighter text-2xl border-b-4 border-[#1A1A1A] pb-4 mb-6 flex items-center gap-3">
                                <BookOpen size={28} className="text-[#E89C10]" /> Course Selection
                              </h3>
                              <div className="grid grid-cols-1 gap-8">
                                <div>
                                  <label className={labelClass}>Target Exam Category</label>
                                  <select name="courses" value={formData.courses[0] || ''} onChange={(e) => setFormData(prev => ({ ...prev, courses: [e.target.value], subCourse: '' }))} className={selectClass}>
                                    <option value="">Select Category</option>
                                    {EXAM_CATEGORIES.map(cat => <option key={cat.id} value={cat.title}>{cat.title}</option>)}
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                                <div>
                                  <label className={labelClass}>Specific Exam</label>
                                  <select name="subCourse" value={formData.subCourse} onChange={handleInputChange} className={selectClass}>
                                    <option value="">Select Exam</option>
                                    {EXAM_CATEGORIES.find(cat => cat.title === formData.courses[0])?.subcategories.flatMap(sub => sub.exams).map(exam => <option key={exam} value={exam}>{exam}</option>)}
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                              </div>
                           </div>

                           <div className={panelClass}>
                              <h3 className="font-display font-black uppercase tracking-tighter text-2xl border-b border-gray-100 pb-4 mb-6 flex items-center gap-3 text-ink">
                                <GraduationCap size={28} className="text-brand" /> Education History
                              </h3>
                              <div className="overflow-x-auto border border-gray-200 rounded-2xl bg-white shadow-sm">
                                <table className="w-full min-w-[600px] text-left">
                                  <thead className="bg-gray-50 text-ink/60">
                                    <tr className="font-mono text-[10px] uppercase tracking-widest font-bold">
                                      <th className="p-4 border-r border-gray-200">Level</th>
                                      <th className="p-4 border-r border-gray-200">Board / University</th>
                                      <th className="p-4 border-r border-gray-200">Passing Year</th>
                                      <th className="p-4 border-r border-gray-200">Percentage</th>
                                      <th className="p-4">CGPA</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {formData.education.map((edu, index) => (
                                      <tr key={edu.level} className="border-b border-gray-100 last:border-b-0">
                                        <td className="p-4 border-r border-gray-100 font-black uppercase bg-gray-50/50 text-ink/80">{edu.level}</td>
                                        <td className="p-0 border-r border-gray-100"><input type="text" value={edu.board} onChange={(e) => handleEducationChange(index, 'board', e.target.value)} className="w-full h-full p-4 outline-none focus:bg-brand/5 transition-colors" placeholder="University" /></td>
                                        <td className="p-0 border-r border-gray-100"><input type="text" value={edu.year} onChange={(e) => handleEducationChange(index, 'year', e.target.value)} className="w-full h-full p-4 outline-none focus:bg-brand/5 transition-colors" placeholder="YYYY" /></td>
                                        <td className="p-0 border-r border-gray-100"><input type="text" value={edu.marks} onChange={(e) => handleEducationChange(index, 'marks', e.target.value)} className="w-full h-full p-4 outline-none focus:bg-brand/5 transition-colors" placeholder="Marks" /></td>
                                        <td className="p-0"><input type="text" value={edu.cgpa} onChange={(e) => handleEducationChange(index, 'cgpa', e.target.value)} className="w-full h-full p-4 outline-none focus:bg-brand/5 transition-colors" placeholder="CGPA" /></td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                           </div>
                        </div>
                      )}

                      {/* STEP 4: FINALIZE */}
                      {currentStep === 4 && (
                        <div className="space-y-8">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {/* Address Blocks */}
                             <div className="space-y-8">
                               <div className={panelClass}>
                                 <h3 className="font-display font-black uppercase tracking-tighter text-xl border-b border-gray-100 pb-4 mb-6 flex items-center gap-3 text-ink">
                                   <MapPin size={24} className="text-brand" /> Current Address
                                 </h3>
                                 <div className="space-y-4">
                                   <input type="text" value={formData.currentAddress.street} onChange={(e) => handleNestedChange('currentAddress', 'street', e.target.value)} placeholder="Street Address" className={inputClass} />
                                   <div className="grid grid-cols-2 gap-4">
                                     <input type="text" value={formData.currentAddress.city} onChange={(e) => handleNestedChange('currentAddress', 'city', e.target.value)} placeholder="City" className={inputClass} />
                                     <input type="text" value={formData.currentAddress.pincode} onChange={(e) => handleNestedChange('currentAddress', 'pincode', e.target.value)} placeholder="Pincode" className={inputClass} />
                                   </div>
                                 </div>
                               </div>

                               <div className={panelClass}>
                                 <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                                   <h3 className="font-display font-black uppercase tracking-tighter text-xl text-ink">Permanent Address</h3>
                                   <label className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold cursor-pointer text-ink/50">
                                     <input type="checkbox" name="isAddressSame" checked={formData.isAddressSame} onChange={handleInputChange} className="accent-brand w-5 h-5 rounded border-gray-300" />
                                     Same as Current
                                   </label>
                                 </div>
                                 {!formData.isAddressSame && (
                                   <div className="space-y-4">
                                     <input type="text" value={formData.permanentAddress.street} onChange={(e) => handleNestedChange('permanentAddress', 'street', e.target.value)} placeholder="Street Address" className={inputClass} />
                                     <div className="grid grid-cols-2 gap-4">
                                       <input type="text" value={formData.permanentAddress.city} onChange={(e) => handleNestedChange('permanentAddress', 'city', e.target.value)} placeholder="City" className={inputClass} />
                                       <input type="text" value={formData.permanentAddress.pincode} onChange={(e) => handleNestedChange('permanentAddress', 'pincode', e.target.value)} placeholder="Pincode" className={inputClass} />
                                     </div>
                                   </div>
                                 )}
                               </div>
                             </div>

                             {/* Uploads & Declaration */}
                             <div className={panelClass}>
                               <h3 className="font-display font-black uppercase tracking-tighter text-xl border-b border-gray-100 pb-4 mb-6 flex items-center gap-3 text-ink">
                                 <Upload size={24} className="text-brand" /> Documents
                               </h3>
                               <div className="space-y-8">
                                 <div>
                                   <label className={labelClass}>Student Photo <span className="text-red-500">*</span></label>
                                   <div className="relative h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center hover:bg-brand/5 hover:border-brand/50 transition-all cursor-pointer group overflow-hidden">
                                     {formData.photo ? <span className="font-black text-xl text-ink">{formData.photo.name}</span> : <span className="font-black uppercase tracking-widest flex items-center gap-2 text-ink/40 group-hover:text-brand"><Camera size={24}/> Click to upload (1MB max)</span>}
                                     <input type="file" name="photo" accept="image/*" onChange={handleInputChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                   </div>
                                 </div>
                                 <div>
                                   <label className={labelClass}>Signature <span className="text-red-500">*</span></label>
                                   <div className="relative h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center hover:bg-brand/5 hover:border-brand/50 transition-all cursor-pointer group overflow-hidden">
                                     {formData.signature ? <span className="font-black text-xl text-ink">{formData.signature.name}</span> : <span className="font-black uppercase tracking-widest flex items-center gap-2 text-ink/40 group-hover:text-brand"><Edit3 size={24}/> Click to upload (1MB max)</span>}
                                     <input type="file" name="signature" accept="image/*" onChange={handleInputChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                   </div>
                                 </div>
                               </div>
                               
                               <div className="mt-8 pt-8 border-t border-gray-100">
                                 <label className="flex items-start gap-4 cursor-pointer bg-brand/10 text-ink/80 p-6 border border-brand/30 rounded-2xl hover:bg-brand/20 transition-colors">
                                   <input type="checkbox" name="isDeclared" checked={formData.isDeclared} onChange={handleInputChange} className="mt-1 w-6 h-6 border-2 border-brand/50 rounded text-brand focus:ring-brand accent-brand" />
                                   <span className="font-body font-medium leading-relaxed">
                                     I hereby declare that all the information provided is true. I understand that my admission is subject to verification of these documents.
                                   </span>
                                 </label>
                               </div>
                             </div>
                           </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                // SUCCESS SCREEN
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`${panelClass} max-w-2xl mx-auto py-20 text-center space-y-8`}>
                   <div className="w-32 h-32 bg-green-50 flex items-center justify-center mx-auto mb-6 rounded-full shadow-lg shadow-green-100">
                     <CheckCircle2 size={64} className="text-green-500" />
                   </div>
                   <h2 className="text-5xl font-display font-black uppercase tracking-tighter text-ink">Application <span className="text-brand">Submitted!</span></h2>
                   <p className="font-body text-xl text-ink/70">Your registration number is <strong className="font-mono bg-brand/10 text-brand px-3 py-1 rounded-lg">{formData.registrationNo}</strong>. Please download your admission form.</p>
                   
                   <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
                     <button onClick={generatePDF} className={btnPrimaryClass}>
                       <span className="flex items-center gap-3"><Download size={24} /> Download PDF</span>
                     </button>
                     <button onClick={onClose} className={btnSecondaryClass}>
                       Close
                     </button>
                   </div>
                </motion.div>
              )}
            </div>

            {/* Sticky Footer Navigation */}
            {!isSubmitted && (
              <div className="bg-white border-t border-gray-100 p-6 flex justify-between items-center shrink-0 z-10 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                 <button onClick={prevStep} disabled={currentStep === 1} className={btnSecondaryClass + (currentStep === 1 ? ' opacity-0 pointer-events-none' : '')}>
                   <span className="flex items-center gap-2"><ArrowLeft size={20} /> Back</span>
                 </button>

                 {currentStep < 4 ? (
                   <button onClick={nextStep} className={btnPrimaryClass}>
                     <span className="flex items-center gap-2">Continue <ArrowRight size={20} /></span>
                   </button>
                 ) : (
                   <button onClick={handlePaymentSubmit} disabled={isSubmitting} className={btnPrimaryClass}>
                     <span className="flex items-center gap-2">{isSubmitting ? 'Processing...' : 'Pay ₹100 & Submit'} <CheckCircle2 size={20} /></span>
                   </button>
                 )}
              </div>
            )}
            
            {/* HIDDEN PDF TEMPLATE */}
            <div className="hidden">
              <div ref={pdfRef} className="bg-white p-10 font-serif text-black" style={{ width: '800px', minHeight: '1120px' }}>
                <div className="text-center border-b-4 border-black pb-4 mb-8">
                  <h1 className="text-3xl font-black uppercase mb-1">BK Educational & Welfare Society</h1>
                  <h2 className="text-2xl font-bold uppercase text-[#E89C10]">BK Career Academy</h2>
                  <p className="font-bold mt-2 text-xl">Admission Form - 2026 Batch</p>
                </div>
                
                <div className="flex justify-between mb-8">
                  <div className="space-y-4 font-bold text-lg">
                    <p><strong>Registration No:</strong> {formData.registrationNo || 'Pending'}</p>
                    <p><strong>Form No:</strong> {formData.formNo || 'Pending'}</p>
                    <p><strong>Course:</strong> {formData.courses[0]} {formData.subCourse ? `(${formData.subCourse})` : ''}</p>
                  </div>
                  <div className="w-32 h-40 border-4 border-black flex items-center justify-center bg-gray-200 text-black font-bold text-center">
                    Paste recent passport size photograph
                  </div>
                </div>

                <div className="space-y-6 text-lg">
                  <div className="grid grid-cols-2 gap-6">
                    <p><strong>Full Name:</strong> {formData.firstName} {formData.middleName} {formData.surname}</p>
                    <p><strong>Date of Birth:</strong> {formData.dob}</p>
                    <p><strong>Gender:</strong> {formData.gender}</p>
                    <p><strong>Mobile (Self):</strong> {formData.mobileSelf}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                  </div>

                  <div className="border-t-4 border-black pt-6 mt-6 grid grid-cols-2 gap-6">
                    <p><strong>Father's Name:</strong> {formData.fatherName}</p>
                    <p><strong>Mother's Name:</strong> {formData.motherName}</p>
                    <p><strong>Category:</strong> {formData.category}</p>
                    <p><strong>Nationality:</strong> {formData.isIndianNational === 'Yes' ? 'Indian' : 'Other'}</p>
                  </div>

                  <div className="border-t-4 border-black pt-6 mt-6">
                    <p className="mb-2"><strong>Permanent Address:</strong></p>
                    <p>{formData.permanentAddress.street}, {formData.permanentAddress.city}, Pincode: {formData.permanentAddress.pincode}</p>
                  </div>
                  
                  <div className="mt-20 pt-8 border-t-4 border-black flex justify-between px-10">
                    <div className="text-center font-bold">
                      <p>_________________________</p>
                      <p className="mt-2">Date & Place</p>
                    </div>
                    <div className="text-center font-bold">
                      <p>_________________________</p>
                      <p className="mt-2">Signature of Applicant</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}