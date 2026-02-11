import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Bar, Radar, Doughnut, Line } from 'react-chartjs-2';
import { Grade, SkillEvaluation, StudentData } from '../types';
import { LOGO_ARCHER, LOGO_FIDE, LOGO_ISO, GRADE_SCORES, MAX_SCORE } from '../constants';
import { calculateTotalScore, getVerdict } from '../utils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement
);

// --- STRICT FONT SYSTEM FOR CHARTS ---
// Headings (Titles) -> Monospace ('Space Mono')
// UI/Labels (Legend, Ticks) -> Sans-Serif ('Inter')

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#000000', 
        font: { size: 10, weight: 'bold' as const, family: "'Inter', sans-serif" }, // Sans for UI
      },
    },
    title: {
      display: true,
      color: '#000000',
      // Chart Titles act as Headings -> Monospace
      font: { size: 12, weight: 'bold' as const, family: "'Space Mono', monospace" }, 
      padding: { bottom: 10 }
    },
    tooltip: {
      titleFont: { family: "'Space Mono', monospace" },
      bodyFont: { family: "'Inter', sans-serif" }
    }
  },
};

// Cartesian options (Bar, Line) which include x/y scales
const cartesianOptions = {
  ...baseOptions,
  scales: {
    x: {
      ticks: { 
        color: '#000000', 
        font: { size: 9, family: "'Inter', sans-serif" } // Sans for Ticks
      },
      grid: { color: '#e5e5e5' }
    },
    y: {
      ticks: { 
        color: '#000000', 
        font: { size: 9, family: "'Inter', sans-serif" } // Sans for Ticks
      },
      grid: { color: '#e5e5e5' },
      beginAtZero: true,
      max: 100,
    }
  }
};

interface ReportPreviewProps {
  id: string; // Critical for html2canvas
  studentData: StudentData;
  skills: SkillEvaluation[];
  review: string;
  signature: string | null;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ id, studentData, skills, review, signature }) => {
  const totalScore = calculateTotalScore(skills);
  const verdict = getVerdict(totalScore);
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Helper to extract score by name
  const getScore = (name: string) => {
    const skill = skills.find(s => s.name === name);
    return skill ? GRADE_SCORES[skill.grade] : 0;
  };

  // --- CHART 1: DYNAMIC LOGIC BASED ON VERDICT ---
  let Chart1Component: React.ReactNode;

  if (verdict.status === 'READY') {
    // CASE 1: READY -> 100% GRAPH
    const data: ChartData<'doughnut'> = {
      labels: ['Ready'],
      datasets: [{
        data: [100, 0],
        backgroundColor: ['#16a34a', '#e5e7eb'], // Green
        borderWidth: 0,
      }]
    };
    Chart1Component = (
      <div className="relative flex-1 h-full w-full">
         <Doughnut 
            data={data} 
            options={{
                ...baseOptions, 
                plugins: { legend: { display: false }, tooltip: { enabled: false } }, 
                cutout: '70%' 
            }} 
         />
         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="block text-xl font-black text-black font-slab">100%</span>
            <span className="text-[9px] font-bold text-green-600 uppercase font-slab">Ready</span>
         </div>
      </div>
    );
  } else if (verdict.status === 'ALMOST') {
    // CASE 2: ALMOST -> SKILL-BASED (Bottom 3 Skills)
    const sortedSkills = [...skills].sort((a, b) => GRADE_SCORES[a.grade] - GRADE_SCORES[b.grade]);
    const bottomSkills = sortedSkills.slice(0, 3);
    
    const data: ChartData<'bar'> = {
        labels: bottomSkills.map(s => s.name.substring(0, 8) + '..'),
        datasets: [{
            label: 'Score',
            data: bottomSkills.map(s => GRADE_SCORES[s.grade]),
            backgroundColor: '#f97316',
            borderRadius: 3
        }]
    };
    Chart1Component = (
        <div className="flex-1 h-full w-full flex flex-col justify-end pb-2">
            <div className="text-[9px] font-bold text-black text-center mb-1 font-mono">Improvement Areas</div>
            <div className="flex-1 min-h-0">
                 <Bar 
                    data={data} 
                    options={{
                        ...cartesianOptions, 
                        maintainAspectRatio: false, 
                        scales: { x: { ticks: { font: { size: 8, family: "'Inter', sans-serif" } } }, y: { display: false, max: 100 } }, 
                        plugins: { legend: { display: false } } 
                    }} 
                 />
            </div>
            <div className="text-[8px] text-gray-500 text-center mt-1 leading-tight font-sans">
                Overall performance depends on skill improvement.
            </div>
        </div>
    );
  } else {
    // CASE 3: NOT READY -> 0% GRAPH
    const data: ChartData<'doughnut'> = {
      labels: ['Not Ready'],
      datasets: [{
        data: [0, 100],
        backgroundColor: ['#e5e7eb', '#e5e7eb'], // Gray
        borderWidth: 0,
      }]
    };
    Chart1Component = (
      <div className="relative flex-1 h-full w-full">
         <Doughnut 
            data={data} 
            options={{
                ...baseOptions, 
                plugins: { legend: { display: false }, tooltip: { enabled: false } }, 
                cutout: '70%' 
            }} 
         />
         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="block text-xl font-black text-black font-slab">0%</span>
            <span className="text-[8px] font-bold text-red-600 uppercase mt-1 px-2 text-center leading-tight font-slab">
                You need more practice
            </span>
         </div>
      </div>
    );
  }


  // --- DATA PREPARATION FOR OTHER CHARTS ---

  // 2. Skill-wise Performance (Vertical Bar)
  const chart2Data: ChartData<'bar'> = {
    labels: skills.map(s => s.name.substring(0, 10) + (s.name.length > 10 ? '.' : '')), // Truncate for space
    datasets: [{
      label: 'Score',
      data: skills.map(s => GRADE_SCORES[s.grade]),
      backgroundColor: '#f97316',
      borderRadius: 4,
    }]
  };

  // 3. Strength vs Weakness (Radar)
  const chart3Data: ChartData<'radar'> = {
    labels: skills.map(s => s.name),
    datasets: [{
      label: 'Skill Profile',
      data: skills.map(s => GRADE_SCORES[s.grade]),
      backgroundColor: 'rgba(249, 115, 22, 0.2)', // Transparent Orange
      borderColor: '#f97316',
      pointBackgroundColor: '#000000',
      pointBorderColor: '#fff',
    }]
  };

  // 4. Tactical vs Positional (Horizontal Bar)
  const tacPosSkills = ['Tactics', 'Positional Play', 'Opening', 'Middle Game', 'Endgame'];
  const chart4Data: ChartData<'bar'> = {
    labels: tacPosSkills,
    datasets: [{
      label: 'Proficiency',
      data: tacPosSkills.map(name => getScore(name)),
      backgroundColor: ['#000000', '#f97316', '#333333', '#ea580c', '#fb923c'], // Mix of Black/Orange
      indexAxis: 'y' as const,
      borderRadius: 4,
    }]
  };

  // 5. Focus & Patience Stability (Line)
  const chart5Data: ChartData<'line'> = {
    labels: ['Focus', 'Patience'],
    datasets: [{
      label: 'Mental Stability',
      data: [getScore('Focus'), getScore('Patience')],
      borderColor: '#f97316',
      backgroundColor: '#000000',
      pointRadius: 6,
      borderWidth: 3,
    }]
  };

  // 6. Game Phase Readiness (Bar Group)
  const phases = ['Opening', 'Middle Game', 'Endgame'];
  const chart6Data: ChartData<'bar'> = {
    labels: phases,
    datasets: [{
      label: 'Phase Mastery',
      data: phases.map(p => getScore(p)),
      backgroundColor: ['#fdba74', '#f97316', '#c2410c'], // Light to Dark Orange
      borderRadius: 4,
    }]
  };

  // 7. Logical vs Creative (Donut)
  const chart7Data: ChartData<'doughnut'> = {
    labels: ['Logical', 'Creative'],
    datasets: [{
      data: [getScore('Logical Thinking'), getScore('Creativity')],
      backgroundColor: ['#000000', '#f97316'], // Black vs Orange
      hoverOffset: 4
    }]
  };

  // 8. Skill Consistency Index (Area)
  const chart8Data: ChartData<'line'> = {
    labels: skills.map((_, i) => `S${i+1}`), // S1, S2... to save space
    datasets: [{
      label: 'Consistency',
      data: skills.map(s => GRADE_SCORES[s.grade]),
      fill: true,
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      borderColor: '#f97316',
      tension: 0.4, // Smooth curve
      pointRadius: 0
    }]
  };

  // 9. Coach Verdict Indicator (Gauge Simulation)
  const verdictColor = totalScore >= 750 ? '#16a34a' : totalScore >= 600 ? '#ca8a04' : '#dc2626'; // Green, Yellow, Red
  const chart9Data: ChartData<'doughnut'> = {
    labels: ['Score', 'Gap'],
    datasets: [{
      data: [totalScore, MAX_SCORE - totalScore],
      backgroundColor: [verdictColor, '#e5e7eb'],
      circumference: 180,
      rotation: -90,
      borderWidth: 0,
    }]
  };

  // --- CHART OPTIONS CUSTOMIZATIONS ---

  const radarOptions: ChartOptions<'radar'> = {
      ...baseOptions,
      scales: {
          r: {
              angleLines: { color: '#e5e5e5' },
              grid: { color: '#e5e5e5' },
              pointLabels: { 
                  color: '#000000', 
                  font: { size: 9, weight: 'bold', family: "'Inter', sans-serif" } // Sans for labels
              },
              ticks: { display: false }
          }
      }
  };

  return (
    <div
      id={id}
      className="report-paper w-full max-w-[794px] mx-auto p-8 text-black bg-white relative flex flex-col"
      style={{ minHeight: '1123px' }} // Approx A4 height to ensure spacing
    >
      {/* 1. Header Section (Redesigned) */}
      <header className="mb-6">
        <div className="flex justify-between items-center h-20 mb-2">
          {/* Left: Archer Logo */}
          <div className="w-1/4 flex justify-start">
             <img src={LOGO_ARCHER} alt="Archer Kids" className="h-16 object-contain" crossOrigin="anonymous" />
          </div>
          
          {/* Center: Title */}
          <div className="w-2/4 text-center">
            {/* H1 -> Monospace */}
            <h1 className="text-2xl font-black text-black uppercase tracking-tight leading-none">
              Archer Chess Academy<br/><span className="text-xl">Pvt. Ltd.</span>
            </h1>
            <p className="text-orange-600 font-bold text-xs mt-1 tracking-widest uppercase font-sans">
              Chess Tournament Readiness Report
            </p>
          </div>

          {/* Right: ISO & FIDE */}
          <div className="w-1/4 flex justify-end gap-3">
             <img src={LOGO_ISO} alt="ISO" className="h-10 object-contain" crossOrigin="anonymous" />
             <img src={LOGO_FIDE} alt="FIDE" className="h-10 object-contain" crossOrigin="anonymous" />
          </div>
        </div>
        <div className="h-[3px] w-full bg-orange-500"></div>
      </header>

      {/* 2. Student Details (Compact) */}
      <section className="mb-6">
        <div className="bg-white border-l-4 border-orange-500 shadow-sm p-4 grid grid-cols-2 gap-4 text-sm font-sans">
           <div>
             <span className="block text-xs font-bold text-gray-400 uppercase">Student Name</span>
             <span className="block text-base font-bold text-black">{studentData.name || 'N/A'}</span>
           </div>
           <div>
             <span className="block text-xs font-bold text-gray-400 uppercase">Coach Name</span>
             <span className="block text-base font-bold text-black">{studentData.coachName || 'N/A'}</span>
           </div>
           <div>
             <span className="block text-xs font-bold text-gray-400 uppercase">Batch / Level</span>
             <span className="block text-base font-bold text-black">
                {studentData.batchName ? `${studentData.batchName} (${studentData.level})` : 'N/A'}
             </span>
           </div>
           <div>
             <span className="block text-xs font-bold text-gray-400 uppercase">Report Date</span>
             <span className="block text-base font-bold text-black">{today}</span>
           </div>
        </div>
      </section>

      {/* 3. ANALYTICS GRID (9 Charts) */}
      <section className="mb-6">
        {/* H3 -> Monospace */}
        <h3 className="text-sm font-black text-black uppercase tracking-widest mb-4 border-b border-gray-200 pb-1">
          Performance Analytics
        </h3>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          
          {/* Chart 1: Dynamic Overall Report */}
          <div className="bg-white border border-gray-100 p-2 rounded shadow-sm h-48 flex flex-col">
             {/* H4 -> Monospace */}
             <h4 className="text-center text-[10px] font-bold uppercase mb-1 text-black">Overall Performance</h4>
             {Chart1Component}
          </div>

          {/* Chart 2: Skill Performance */}
          <div className="bg-white border border-gray-100 p-2 rounded shadow-sm h-48 col-span-2">
            <Bar 
              data={chart2Data} 
              options={{...cartesianOptions, plugins: { ...cartesianOptions.plugins, title: { display: true, text: 'Skill-wise Breakdown', font: { ...baseOptions.plugins.title.font, family: "'Space Mono', monospace" } } }}} 
            />
          </div>

          {/* Chart 3: Radar */}
          <div className="bg-white border border-gray-100 p-2 rounded shadow-sm h-52 col-span-1">
             <Radar data={chart3Data} options={radarOptions} />
          </div>

          {/* Chart 4: Tac vs Pos */}
          <div className="bg-white border border-gray-100 p-2 rounded shadow-sm h-52 col-span-1">
             <Bar 
                data={chart4Data} 
                options={{
                    ...cartesianOptions, 
                    indexAxis: 'y', 
                    plugins: { legend: { display: false }, title: { display: true, text: 'Key Areas', font: { ...baseOptions.plugins.title.font, family: "'Space Mono', monospace" } } }
                }} 
             />
          </div>

           {/* Chart 6: Game Phase */}
           <div className="bg-white border border-gray-100 p-2 rounded shadow-sm h-52 col-span-1">
             <Bar 
               data={chart6Data} 
               options={{...cartesianOptions, plugins: { legend: { display: false }, title: { display: true, text: 'Game Phases', font: { ...baseOptions.plugins.title.font, family: "'Space Mono', monospace" } } }}} 
             />
          </div>

          {/* Chart 5: Mental Stability */}
          <div className="bg-white border border-gray-100 p-2 rounded shadow-sm h-40 col-span-1">
             <Line 
               data={chart5Data} 
               options={{...cartesianOptions, scales: { ...cartesianOptions.scales, x: { display: true, ticks: { ...cartesianOptions.scales.x.ticks } } }, plugins: { legend: { display: false }, title: { display: true, text: 'Mental Stability', font: { ...baseOptions.plugins.title.font, family: "'Space Mono', monospace" } } }}} 
             />
          </div>

           {/* Chart 7: Logic vs Creative */}
           <div className="bg-white border border-gray-100 p-2 rounded shadow-sm h-40 col-span-1">
             <Doughnut 
               data={chart7Data} 
               options={{
                 ...baseOptions, 
                 plugins: { 
                    ...baseOptions.plugins, 
                    legend: { display: true, position: 'bottom' },
                    title: { display: true, text: 'Thinking Style', font: { ...baseOptions.plugins.title.font, family: "'Space Mono', monospace" } } 
                 }
               }} 
             />
          </div>

          {/* Chart 8: Consistency */}
           <div className="bg-white border border-gray-100 p-2 rounded shadow-sm h-40 col-span-1">
             <Line 
               data={chart8Data} 
               options={{
                   ...cartesianOptions, 
                   plugins: { legend: { display: false }, title: { display: true, text: 'Skill Consistency', font: { ...baseOptions.plugins.title.font, family: "'Space Mono', monospace" } } },
                   scales: { x: { display: false }, y: { display: false } }
               }} 
             />
          </div>

        </div>

        {/* Chart 9: Verdict Gauge (Wide) */}
        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
           <div className="w-1/3 h-24 relative">
              <Doughnut 
                data={chart9Data} 
                options={{
                    ...baseOptions, 
                    plugins: { 
                        legend: { display: false }, 
                        tooltip: { enabled: false } 
                    }
                }} 
              />
              <div className="absolute inset-x-0 bottom-0 text-center">
                 <span className="text-xs font-bold text-gray-400 uppercase font-sans">Score Gauge</span>
              </div>
           </div>
           <div className="w-2/3 text-right">
              <h3 className="text-sm font-bold text-gray-500 uppercase">Tournament Report</h3>
              {/* Highlighted Text -> Slab Serif */}
              <div className={`text-2xl font-black uppercase font-slab ${verdict.colorClass.replace('bg-', 'text-').split(' ')[0]}`}>
                 {verdict.label}
              </div>
              <p className="text-xs text-black mt-1 font-medium font-sans">
                 Score: {verdict.score} / {MAX_SCORE}
              </p>
           </div>
        </div>
      </section>

      {/* 4. Coach Final Review */}
      <section className="mb-4">
        <div className="border-t-2 border-orange-500 pt-4">
          {/* H3 -> Monospace */}
          <h3 className="text-sm font-black text-black uppercase mb-2">Coach Final Observation</h3>
          {/* Body -> Sans */}
          <p className="text-black text-xs leading-relaxed whitespace-pre-wrap font-medium font-sans">
            {review ? review : "No additional comments provided by the coach."}
          </p>
        </div>
      </section>

      {/* Signature Section - Pushes itself to bottom of content, ensuring it's the last element */}
      <section className="mt-auto flex justify-end mb-4">
        <div className="text-center min-w-[150px]">
          {/* Signature Image or Placeholder Space */}
          <div className="h-16 flex items-end justify-center mb-2">
            {signature ? (
              <img src={signature} alt="Coach Signature" className="max-h-16 max-w-full object-contain" />
            ) : (
               <div className="h-10"></div> // Empty spacer
            )}
          </div>
          <div className="border-t border-black pt-1 font-sans">
             <p className="text-sm font-bold text-black uppercase">{studentData.coachName || "Coach"}</p>
             <p className="text-[10px] text-gray-500 uppercase">Authorized Signatory</p>
          </div>
        </div>
      </section>

      {/* Footer -> Slab Serif (Emphasis) */}
      <div className="border-t border-gray-100 pt-2 flex justify-between items-center text-[8px] text-gray-400 uppercase tracking-widest mb-0 font-slab">
        <span>Archer Chess Academy Pvt. Ltd.</span>
        <span>Generated via Official Dashboard</span>
      </div>
    </div>
  );
};

export default ReportPreview;