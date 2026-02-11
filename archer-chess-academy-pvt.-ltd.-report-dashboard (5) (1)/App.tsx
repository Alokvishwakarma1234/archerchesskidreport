import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Grade, SkillEvaluation, StudentData, CoachData, Batch } from './types';
import { SKILL_LIST } from './constants';
import { parseCSVData } from './utils';
import EditorPanel from './components/EditorPanel';
import ReportPreview from './components/ReportPreview';

const App: React.FC = () => {
  // Data State (Coaches & Batches)
  const [coachesData, setCoachesData] = useState<CoachData[]>([]);

  // Initialize data from CSV
  useEffect(() => {
    const data = parseCSVData();
    setCoachesData(data);
  }, []);

  const handleAddCoach = (name: string) => {
    if (coachesData.find(c => c.name.toLowerCase() === name.toLowerCase())) {
      alert('Coach already exists!');
      return;
    }
    setCoachesData(prev => [...prev, { name, batches: [] }].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const handleAddBatch = (coachName: string, batch: Batch) => {
    setCoachesData(prev => prev.map(c => {
      if (c.name === coachName) {
        return { ...c, batches: [...c.batches, batch] };
      }
      return c;
    }));
  };

  // Student State
  const [studentData, setStudentData] = useState<StudentData>({
    name: '',
    coachName: '',
    batchName: '',
    level: '',
  });

  const [skills, setSkills] = useState<SkillEvaluation[]>(
    SKILL_LIST.map((name) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      grade: Grade.C, // Default start
    }))
  );

  const [review, setReview] = useState<string>('');
  const [signature, setSignature] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // PDF Generation Logic
  const handleDownloadPDF = async () => {
    const element = document.getElementById('final-report');
    if (!element) return;

    setIsGenerating(true);

    try {
      // 1. Wait for any re-renders
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 2. High Resolution Capture
      // scale: 4 provides approx 384 DPI (very high quality for text/charts)
      const canvas = await html2canvas(element, {
        scale: 4, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        onclone: (clonedDoc) => {
            // Inject styles to ensure fonts render sharply
            const style = clonedDoc.createElement('style');
            style.innerHTML = `
                * {
                    -webkit-font-smoothing: antialiased !important;
                    -moz-osx-font-smoothing: grayscale !important;
                    text-rendering: optimizeLegibility !important;
                }
            `;
            clonedDoc.head.appendChild(style);
        }
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // 3. Calculate Dimensions to fit A4 Width exactly
      const pdfWidthMM = 210; // Standard A4 Width
      const imgWidthPX = canvas.width;
      const imgHeightPX = canvas.height;
      
      // Calculate the height in MM based on the image aspect ratio
      const pdfHeightMM = (imgHeightPX * pdfWidthMM) / imgWidthPX;
      
      // 4. Create Single Page PDF
      // We set the PDF page height to match the content exactly. 
      // This prevents any "cutting" of content across pages and ensures margins are exact.
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [pdfWidthMM, pdfHeightMM]
      });
      
      // Add image at 0,0 - The margins are handled by the padding inside the ReportPreview component
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidthMM, pdfHeightMM);
      
      // Filename
      const safeName = studentData.name.replace(/[^a-z0-9]/gi, '_') || 'Student';
      pdf.save(`Archer_Report_${safeName}.pdf`);

    } catch (error) {
      console.error('PDF Generation failed', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-orange-500 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* Branding Section */}
            <div className="flex items-center gap-3">
                <img 
                    src="https://ik.imagekit.io/5l2evgjsq/Archer%20Kids%20Final%20Logo-01.png?updatedAt=1767789370575" 
                    alt="Archer Logo" 
                    className="h-10 md:h-12 object-contain"
                />
                <div className="font-bold text-sm md:text-lg tracking-tight text-gray-900 leading-none">
                    Archer Chess Academy <span className="text-orange-500">Pvt. Ltd.</span>
                </div>
            </div>

            {/* Dashboard Label */}
            <div className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest border-l-2 border-gray-200 pl-4 hidden md:block">
                Report Dashboard
            </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Editor (Input) */}
        <div className="lg:col-span-4 xl:col-span-3 order-1 lg:order-1">
          <EditorPanel
            studentData={studentData}
            setStudentData={setStudentData}
            skills={skills}
            setSkills={setSkills}
            review={review}
            setReview={setReview}
            setSignature={setSignature}
            coachesData={coachesData}
            onAddCoach={handleAddCoach}
            onAddBatch={handleAddBatch}
          />
        </div>

        {/* Right Column: Preview (Output) */}
        <div className="lg:col-span-8 xl:col-span-9 order-2 lg:order-2 flex flex-col items-center">
            
            <div className="w-full flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-700">Live Preview</h2>
                {/* Mobile/Tablet Helper Text */}
                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded hidden md:inline-block">
                    High Quality PDF Output
                </span>
            </div>

            {/* The Actual Report Paper */}
            <div className="w-full overflow-x-auto pb-8 flex justify-center bg-orange-50 p-4 rounded-xl border border-gray-200 shadow-inner">
                 {/* 
                    Wrapper to enforce min-width context for mobile. 
                    If we don't allow scroll, it shrinks and ruins the PDF layout logic.
                 */}
                 <div className="min-w-[320px] md:min-w-[700px] w-full max-w-[794px]">
                    <ReportPreview 
                        id="final-report"
                        studentData={studentData}
                        skills={skills}
                        review={review}
                        signature={signature}
                    />
                 </div>
            </div>

            {/* Action Bar - Sticky Bottom on Mobile for easy access */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 lg:static lg:bg-transparent lg:border-0 lg:p-0 lg:mt-8 z-40 flex justify-center">
                <button
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                    className={`
                        flex items-center gap-2 px-8 py-4 rounded-full font-bold shadow-lg transition-transform transform active:scale-95
                        ${isGenerating ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-orange-500 text-black hover:bg-orange-600 hover:shadow-orange-500/30'}
                    `}
                >
                    {isGenerating ? (
                        <>
                           <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Generating...
                        </>
                    ) : (
                        <>
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                           Download Report PDF
                        </>
                    )}
                </button>
            </div>
            {/* Spacer for mobile bottom bar */}
            <div className="h-20 lg:hidden"></div>
        </div>
      </main>
    </div>
  );
};

export default App;