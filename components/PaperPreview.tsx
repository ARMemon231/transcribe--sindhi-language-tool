
import React from 'react';
import { QuestionPaperContent } from '../types';

interface PaperPreviewProps {
  content: QuestionPaperContent;
}

export const PaperPreview: React.FC<PaperPreviewProps> = ({ content }) => {
  // Helper to determine if a string has actual useful content
  const isValid = (val: string | undefined | null) => {
    if (!val) return false;
    const lower = val.trim().toLowerCase();
    return lower !== '' && lower !== 'n/a' && lower !== 'unspecified' && lower !== 'null';
  };

  const hasInstitution = isValid(content.institutionName);
  const hasExam = isValid(content.examName);
  const hasSubject = isValid(content.subject);
  const hasClass = isValid(content.classGrade);
  const hasMarks = isValid(content.totalMarks);
  const hasTime = isValid(content.timeAllowed);

  const hasAnyHeaderInfo = hasInstitution || hasExam || hasSubject || hasClass || hasMarks || hasTime || content.showStudentInfo;

  return (
    <div 
      id="printable-area" 
      className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] p-[20mm] border border-gray-100 print:shadow-none print:border-none flex flex-col overflow-hidden text-black" 
      dir="rtl"
    >
      {/* Header Section */}
      {hasAnyHeaderInfo && (
        <div className="text-center border-b-4 border-double border-black pb-6 mb-8">
          {hasInstitution && (
            <h1 className="text-3xl font-extrabold mb-1 sindhi-text leading-tight tracking-wide text-black">
              {content.institutionName}
            </h1>
          )}
          {hasExam && (
            <h2 className="text-xl font-semibold mb-4 sindhi-text text-black/80">
              {content.examName}
            </h2>
          )}
          
          {(hasSubject || hasClass || hasMarks || hasTime) && (
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-lg font-bold mt-4 border-t border-slate-100 pt-6">
              {hasSubject && (
                <div className="flex gap-2 pr-2">
                  <span className="sindhi-text text-slate-500 font-medium print:text-black shrink-0">مضمون:</span>
                  <span className="sindhi-text underline underline-offset-8 decoration-slate-200 print:decoration-black/20 text-black">{content.subject}</span>
                </div>
              )}
              {hasClass && (
                <div className="flex gap-2 justify-end pl-2">
                  <span className="sindhi-text text-slate-500 font-medium print:text-black shrink-0">ڪلاس:</span>
                  <span className="sindhi-text underline underline-offset-8 decoration-slate-200 print:decoration-black/20 text-black">{content.classGrade}</span>
                </div>
              )}
              {hasMarks && (
                <div className="flex gap-2 pr-2">
                  <span className="sindhi-text text-slate-500 font-medium print:text-black shrink-0">ڪل مارڪون:</span>
                  <span className="sindhi-text text-black">{content.totalMarks}</span>
                </div>
              )}
              {hasTime && (
                <div className="flex gap-2 justify-end pl-2">
                  <span className="sindhi-text text-slate-500 font-medium print:text-black shrink-0">وقت:</span>
                  <span className="sindhi-text text-black">{content.timeAllowed}</span>
                </div>
              )}
            </div>
          )}

          {/* Student Info Lines */}
          {content.showStudentInfo && (
            <div className="mt-8 grid grid-cols-2 gap-x-12 gap-y-6 text-right">
              <div className="flex gap-2 items-end border-b border-dotted border-black/40 flex-1">
                 <span className="sindhi-text text-sm font-bold shrink-0">نالو:</span>
                 <div className="flex-1 h-6"></div>
              </div>
              <div className="flex gap-2 items-end border-b border-dotted border-black/40 flex-1">
                 <span className="sindhi-text text-sm font-bold shrink-0">رول نمبر:</span>
                 <div className="flex-1 h-6"></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Sections */}
      <div className="space-y-10 flex-1">
        {content.sections && content.sections.length > 0 ? (
          content.sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-4">
              {isValid(section.title) && (
                <div className="flex justify-between items-baseline border-b border-black/10 pb-2">
                  <h3 className="text-2xl font-black sindhi-text text-black">
                    {section.title}
                  </h3>
                  {isValid(section.instructions) && (
                    <span className="text-lg italic sindhi-text text-black/60 font-medium bg-slate-50 print:bg-transparent px-3 py-1 rounded-lg">
                      ({section.instructions})
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-6 pr-4">
                {section.questions && section.questions.map((q, qIdx) => (
                  <div key={q.id || qIdx} className="flex justify-between items-start gap-8 group">
                    <div className="flex-1 flex gap-4">
                      {isValid(q.number) && (
                        <span className="font-black text-2xl text-slate-400 print:text-black/30 group-hover:text-blue-300 transition-colors shrink-0">
                          {q.number}
                        </span>
                      )}
                      <p className="sindhi-text text-3xl leading-[1.6] text-justify flex-1 whitespace-pre-wrap text-black">
                        {q.text}
                      </p>
                    </div>
                    {isValid(q.marks) && (
                      <span className="text-lg font-black bg-slate-100 print:bg-transparent text-black px-3 py-1 rounded border border-slate-200 print:border-black/10 whitespace-nowrap mt-2">
                        ({q.marks})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-200 border-4 border-dashed border-slate-100 rounded-[3rem]">
            <p className="sindhi-text text-3xl font-bold opacity-30">ڪو به مواد نه مليو</p>
            <p className="text-xs uppercase tracking-widest mt-4">Empty Scan Content</p>
          </div>
        )}
      </div>

      {/* Official Watermark / Footer */}
      <div className="mt-12 pt-8 text-center print:border-t-2 print:border-black/5">
        <div className="inline-block px-6 py-3 bg-slate-50 print:bg-transparent rounded-2xl border border-slate-100 print:border-none">
          <p className="text-[10px] font-black text-slate-400 print:text-black/30 uppercase tracking-[0.2em] mb-1">
            Made By AR-Memon • Sindhiwriting AI
          </p>
          <div className="flex justify-center gap-4 text-[9px] text-slate-300 print:text-black/20">
            <span>Standard A4 Output</span>
            <span>Unicode Transformation</span>
            <span>Lateef Pro Web Font</span>
          </div>
        </div>
      </div>
    </div>
  );
};
