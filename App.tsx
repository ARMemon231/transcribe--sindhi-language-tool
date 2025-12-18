
import React, { useState } from 'react';
import { Download, FileText, RotateCcw, PenTool, Layout, CheckCircle, AlertCircle, Edit3, Save, Info, HelpCircle, Eye, EyeOff, PlusCircle, Settings } from 'lucide-react';
import { Uploader } from './components/Uploader';
import { PaperPreview } from './components/PaperPreview';
import { geminiService } from './services/geminiService';
import { QuestionPaperContent, ProcessingStatus, Section } from './types';

export default function App() {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [content, setContent] = useState<QuestionPaperContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpload = async (file: File) => {
    setStatus('processing');
    setError(null);
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const result = await geminiService.processImage(base64);
          setContent(result);
          setStatus('success');
        } catch (err: any) {
          console.error(err);
          setError(err.message || 'Error occurred during Sindhi OCR. Handwriting might be too faint.');
          setStatus('error');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Processing failed.');
      setStatus('error');
    }
  };

  const updateHeader = (field: keyof QuestionPaperContent, value: any) => {
    if (!content) return;
    setContent({ ...content, [field]: value });
  };

  const updateSection = (index: number, field: keyof Section, value: any) => {
    if (!content) return;
    const newSections = [...content.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setContent({ ...content, sections: newSections });
  };

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleReset = () => {
    setStatus('idle');
    setContent(null);
    setError(null);
    setIsEditing(false);
  };

  const isValid = (val: string | undefined | null) => {
    if (!val) return false;
    const lower = val.trim().toLowerCase();
    return lower !== '' && lower !== 'n/a' && lower !== 'unspecified' && lower !== 'null';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-30 print:hidden shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-blue-100 shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-none">SindhiPaper AI</h1>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-black">Teacher's Pro Tool</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {status === 'success' && content && (
              <>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all ${isEditing ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {isEditing ? <><Save className="w-4 h-4" /> Finish Editing</> : <><Edit3 className="w-4 h-4" /> Edit Paper Details</>}
                </button>
                <div className="h-6 w-px bg-slate-200"></div>
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  Save as PDF
                </button>
                <button onClick={handleReset} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {!content && (status === 'idle' || status === 'error') && (
          <div className="max-w-3xl mx-auto mt-8 space-y-10">
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Digitize <span className="text-blue-600">Sindhi Scripts</span> with AI
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Upload images of handwritten notes or printed exams. Our AI specializes in high-accuracy Sindhi character recognition.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 flex gap-4 animate-in fade-in zoom-in duration-300 shadow-sm">
                <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                <div className="space-y-3">
                  <h4 className="font-bold text-red-900">Script Detection Issue</h4>
                  <p className="text-red-700 text-sm leading-relaxed">{error}</p>
                  <button onClick={handleReset} className="text-sm font-black text-red-900 hover:underline">RETRY SCAN</button>
                </div>
              </div>
            )}
            
            <Uploader onUpload={handleUpload} isLoading={false} />
          </div>
        )}

        {status === 'processing' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in">
            <div className="relative">
              <div className="w-32 h-32 border-8 border-blue-100 rounded-full"></div>
              <div className="absolute inset-0 w-32 h-32 border-8 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-10 h-10 text-blue-600 animate-pulse" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-slate-800">Transcribing Sindhi Script...</h3>
              <p className="text-slate-500 max-w-md mx-auto italic font-medium">
                Our advanced AI is mapping 52 unique Sindhi characters. Please wait...
              </p>
            </div>
          </div>
        )}

        {content && status === 'success' && (
          <div className={`grid lg:grid-cols-[1fr_${isEditing ? '500px' : '380px'}] gap-8 mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700`}>
            {/* Paper Preview */}
            <div className="bg-slate-200/50 p-4 md:p-12 rounded-[2.5rem] border border-slate-300 shadow-inner overflow-auto flex justify-center">
              <PaperPreview content={content} />
            </div>

            {/* Sidebar Control Panel */}
            <div className="space-y-6 print:hidden">
              {isEditing ? (
                <div className="bg-white p-6 rounded-3xl border-2 border-slate-300 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
                  <h3 className="text-xl font-bold text-slate-900 border-b pb-4 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-blue-600" /> Manual Edit Mode
                  </h3>
                  
                  {/* Global Configuration Section */}
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-3">
                    <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                      <Settings className="w-3 h-3" /> Document Settings
                    </h4>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-10 h-6 rounded-full transition-colors relative ${content.showStudentInfo ? 'bg-blue-600' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${content.showStudentInfo ? 'left-5' : 'left-1'}`}></div>
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={content.showStudentInfo} 
                        onChange={(e) => updateHeader('showStudentInfo', e.target.checked)}
                      />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Show Name / Roll No lines</span>
                    </label>
                  </div>

                  <div className="space-y-5" dir="rtl">
                    {/* Identification Fields */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] border-b pb-1 pr-1">Header Metadata</h4>
                      
                      {[
                        { key: 'institutionName', label: 'Institution / School', icon: true },
                        { key: 'examName', label: 'Exam / Paper Title', icon: true },
                        { key: 'subject', label: 'Subject Name', icon: true },
                        { key: 'classGrade', label: 'Class / Grade', icon: true },
                        { key: 'totalMarks', label: 'Total Marks', icon: false },
                        { key: 'timeAllowed', label: 'Time Allowed', icon: false },
                      ].map((field) => (
                        <div key={field.key} className="space-y-1">
                          <label className="flex justify-between items-center mb-1">
                             <span className="text-[10px] font-bold text-slate-600 uppercase pr-1">{field.label}</span>
                             {isValid((content as any)[field.key]) ? 
                               <span className="text-[9px] text-green-600 font-bold bg-green-50 px-1.5 rounded uppercase">Detected</span> :
                               <span className="text-[9px] text-slate-400 font-bold bg-slate-100 px-1.5 rounded uppercase">Empty</span>
                             }
                          </label>
                          <input 
                            className={`w-full p-3 bg-white border-2 rounded-xl text-lg text-black focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-sm ${field.icon ? 'sindhi-text' : ''} ${isValid((content as any)[field.key]) ? 'border-slate-300' : 'border-dashed border-slate-200 opacity-60 focus:opacity-100'}`}
                            value={(content as any)[field.key]} 
                            onChange={(e) => updateHeader(field.key as any, e.target.value)}
                            placeholder={`Enter ${field.label}...`}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Questions Section */}
                    {content.sections.map((sec, sIdx) => (
                      <div key={sIdx} className="pt-6 border-t-2 border-slate-100 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Section {sIdx + 1} Questions</h4>
                        </div>
                        <input 
                          className="w-full p-3 bg-white border-2 border-blue-200 rounded-xl sindhi-text font-bold text-xl text-black focus:ring-2 focus:ring-blue-500 shadow-sm"
                          value={sec.title} 
                          onChange={(e) => updateSection(sIdx, 'title', e.target.value)}
                        />
                        {sec.questions.map((q, qIdx) => (
                          <div key={q.id || qIdx} className="space-y-2 pl-4 border-r-4 border-slate-300 bg-slate-50 p-2 rounded-xl">
                             <div className="flex gap-2 items-center">
                                <div className="w-20 space-y-1">
                                  <label className="text-[9px] font-black text-slate-500 uppercase">Numbering</label>
                                  <input 
                                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm text-black text-center font-bold"
                                    value={q.number || ''}
                                    onChange={(e) => {
                                      const newQs = [...sec.questions];
                                      newQs[qIdx] = { ...newQs[qIdx], number: e.target.value };
                                      updateSection(sIdx, 'questions', newQs);
                                    }}
                                    placeholder="e.g. 1."
                                  />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <label className="text-[9px] font-black text-slate-500 uppercase">Question Text</label>
                                </div>
                             </div>
                             <textarea 
                              className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl sindhi-text text-xl text-black focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[120px] shadow-sm"
                              value={q.text} 
                              onChange={(e) => {
                                const newQs = [...sec.questions];
                                newQs[qIdx] = { ...newQs[qIdx], text: e.target.value };
                                updateSection(sIdx, 'questions', newQs);
                              }}
                             />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setIsEditing(false)}
                    className="w-full py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 sticky bottom-0 z-10"
                  >
                    <CheckCircle className="w-5 h-5" />
                    APPLY CHANGES
                  </button>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xl space-y-6">
                  <div className="bg-green-50 p-4 rounded-2xl flex items-center gap-3 text-green-700">
                    <CheckCircle className="w-6 h-6 shrink-0" />
                    <span className="font-black text-lg">OCR Transcription Success</span>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      Paper is ready. Click the blue button to save it as a PDF file on your computer.
                    </p>
                    
                    <button 
                      onClick={handlePrint}
                      className="w-full py-4 bg-blue-600 text-white rounded-[1.25rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-blue-700 shadow-2xl shadow-blue-300 transition-all hover:-translate-y-1 active:scale-95"
                    >
                      <Download className="w-6 h-6" />
                      DOWNLOAD PDF
                    </button>



                    <button 
                      onClick={() => setIsEditing(true)}
                      className="w-full py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit3 className="w-4 h-4 text-blue-500" />
                      Correct Mistakes Manually
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-2xl space-y-4">
                <h4 className="font-bold flex items-center gap-2 text-blue-400">
                  <Layout className="w-4 h-4" />
                  Technical Details
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Output Size</span>
                    <span className="font-bold">A4 (210x297mm)</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Sindhi Font</span>
                    <span className="font-bold">Lateef Unicode</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Script Logic</span>
                    <span className="font-bold">Complex RTL Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

     
    </div>
  );
}
