import React, { useState } from 'react';
import { Grade, SkillEvaluation, StudentData, CoachData, Batch } from '../types';
import { SKILL_LIST, MAX_REVIEW_CHARS, LEVELS } from '../constants';

interface EditorPanelProps {
  studentData: StudentData;
  setStudentData: React.Dispatch<React.SetStateAction<StudentData>>;
  skills: SkillEvaluation[];
  setSkills: React.Dispatch<React.SetStateAction<SkillEvaluation[]>>;
  review: string;
  setReview: (val: string) => void;
  setSignature: (val: string | null) => void;
  coachesData: CoachData[];
  onAddCoach: (name: string) => void;
  onAddBatch: (coachName: string, batch: Batch) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  studentData,
  setStudentData,
  skills,
  setSkills,
  review,
  setReview,
  setSignature,
  coachesData,
  onAddCoach,
  onAddBatch,
}) => {
  const [showAddCoach, setShowAddCoach] = useState(false);
  const [newCoachName, setNewCoachName] = useState('');
  
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [newBatchCoach, setNewBatchCoach] = useState('');
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchLevel, setNewBatchLevel] = useState(LEVELS[0]);

  // Common input class for Black Background / White Text consistency
  const inputClass = "w-full bg-black text-white placeholder-[#cccccc] border border-[#333333] rounded px-3 py-2 focus:outline-none focus:border-orange-500 transition-colors text-sm";
  const disabledInputClass = "w-full bg-[#111111] text-gray-400 border border-[#333333] rounded px-3 py-2 cursor-not-allowed font-medium text-sm";

  const handleSkillChange = (id: string, newGrade: Grade) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, grade: newGrade } : s))
    );
  };

  const handleCoachSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setStudentData({ 
      ...studentData, 
      coachName: name,
      batchName: '', // Reset batch when coach changes
      level: '' 
    });
  };

  const handleBatchSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const batchName = e.target.value;
    const selectedCoach = coachesData.find(c => c.name === studentData.coachName);
    const batch = selectedCoach?.batches.find(b => b.name === batchName);
    
    setStudentData({
      ...studentData,
      batchName: batchName,
      level: batch ? batch.level : ''
    });
  };

  const handleAddNewCoach = () => {
    if (newCoachName.trim()) {
      onAddCoach(newCoachName.trim());
      setNewCoachName('');
      setShowAddCoach(false);
    }
  };

  const handleAddNewBatch = () => {
    if (newBatchCoach && newBatchName.trim()) {
      onAddBatch(newBatchCoach, { name: newBatchName.trim(), level: newBatchLevel });
      setNewBatchName('');
      setNewBatchCoach('');
      setShowAddBatch(false);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSignature(null);
    }
  };

  // Get batches for selected coach
  const currentCoachBatches = coachesData.find(c => c.name === studentData.coachName)?.batches || [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8 lg:mb-0 lg:sticky lg:top-8 h-fit">
      
      {/* 1. Student & Batch Assignment Section */}
      <div className="bg-white border-t-4 border-orange-500 rounded shadow-sm p-4 mb-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
           Student & Batch Assignment
        </h2>
        
        <div className="space-y-4">
           {/* Student Name */}
           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Student Name</label>
              <input
                type="text"
                className={inputClass}
                value={studentData.name}
                onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                placeholder="Enter Student Name"
              />
           </div>

           {/* Coach Name Selection */}
           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Coach Name</label>
              <select
                className={inputClass}
                value={studentData.coachName}
                onChange={handleCoachSelect}
              >
                <option value="">-- Select Coach --</option>
                {coachesData.map((coach) => (
                  <option key={coach.name} value={coach.name}>
                    {coach.name}
                  </option>
                ))}
              </select>
           </div>

           {/* Batch Name Selection */}
           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Batch Name</label>
              <select
                className={studentData.coachName ? inputClass : disabledInputClass}
                value={studentData.batchName}
                onChange={handleBatchSelect}
                disabled={!studentData.coachName}
              >
                <option value="">-- Select Batch --</option>
                {currentCoachBatches.map((batch, idx) => (
                  <option key={`${batch.name}-${idx}`} value={batch.name}>
                    {batch.name}
                  </option>
                ))}
              </select>
              {!studentData.coachName && (
                <p className="text-[10px] text-red-400 mt-1">* Select a coach first</p>
              )}
           </div>

           {/* Level (Auto-filled) */}
           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Level</label>
              <input
                type="text"
                className={disabledInputClass}
                value={studentData.level}
                readOnly
                placeholder="Auto-set based on batch"
              />
           </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
           <span>Skill Evaluation</span>
           <span className="text-xs font-normal text-gray-500">Rate A+ to E</span>
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 border-t border-b border-gray-100 py-2 custom-scrollbar">
          {skills.map((skill) => (
            <div key={skill.id} className="flex justify-between items-center text-sm p-1 hover:bg-gray-50 rounded">
              <span className="text-gray-700 font-medium">{skill.name}</span>
              <select
                value={skill.grade}
                onChange={(e) => handleSkillChange(skill.id, e.target.value as Grade)}
                className="bg-black text-white border border-[#333333] rounded px-2 py-1 focus:border-orange-500 outline-none text-sm w-20"
              >
                {Object.values(Grade).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Review & Signature */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">Final Observation</h3>
        <textarea
          className={`${inputClass} h-32 resize-none mb-4`}
          placeholder="Enter coach observation (optional)..."
          maxLength={MAX_REVIEW_CHARS}
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        
        <div className="bg-gray-100 p-3 rounded border border-gray-300">
           <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Coach Signature (Optional)</label>
           <input 
             type="file" 
             accept="image/*"
             onChange={handleSignatureUpload}
             className="block w-full text-xs text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-xs file:font-semibold
                file:bg-orange-50 file:text-orange-700
                hover:file:bg-orange-100"
           />
           <p className="text-[10px] text-gray-500 mt-1">Upload transparent PNG for best results.</p>
        </div>
      </div>

      {/* Admin Actions: Add Coach/Batch */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Admin / Coach Controls
        </h4>
        
        <div className="flex flex-col gap-2">
          {/* Add Coach Toggle */}
          <button 
            onClick={() => { setShowAddCoach(!showAddCoach); setShowAddBatch(false); }}
            className="text-left text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
          >
            {showAddCoach ? '− Cancel Add Coach' : '+ Add New Coach'}
          </button>

          {showAddCoach && (
            <div className="bg-gray-50 p-3 rounded border border-orange-200 mt-1">
              <input 
                className={`${inputClass} mb-2`}
                placeholder="Coach Name"
                value={newCoachName}
                onChange={(e) => setNewCoachName(e.target.value)}
              />
              <button 
                onClick={handleAddNewCoach}
                className="bg-orange-500 text-black text-xs font-bold px-3 py-2 rounded w-full hover:bg-orange-600"
              >
                Save Coach
              </button>
            </div>
          )}

          {/* Add Batch Toggle */}
          <button 
            onClick={() => { setShowAddBatch(!showAddBatch); setShowAddCoach(false); }}
            className="text-left text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
          >
             {showAddBatch ? '− Cancel Add Batch' : '+ Add New Batch'}
          </button>

          {showAddBatch && (
            <div className="bg-gray-50 p-3 rounded border border-orange-200 mt-1 space-y-2">
              <select 
                className={inputClass}
                value={newBatchCoach}
                onChange={(e) => setNewBatchCoach(e.target.value)}
              >
                <option value="">Select Coach</option>
                {coachesData.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
              <input 
                className={inputClass}
                placeholder="Batch Name (e.g. TF 5 PM IST)"
                value={newBatchName}
                onChange={(e) => setNewBatchName(e.target.value)}
              />
              <select
                className={inputClass}
                value={newBatchLevel}
                onChange={(e) => setNewBatchLevel(e.target.value)}
              >
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <button 
                onClick={handleAddNewBatch}
                className="bg-orange-500 text-black text-xs font-bold px-3 py-2 rounded w-full hover:bg-orange-600"
              >
                Save Batch
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default EditorPanel;