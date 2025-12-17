
export interface QuestionPaperContent {
  institutionName: string;
  examName: string;
  subject: string;
  classGrade: string;
  totalMarks: string;
  timeAllowed: string;
  showStudentInfo?: boolean; // New: Toggle for Name/Roll No lines
  sections: Section[];
}

export interface Section {
  title: string;
  instructions: string;
  questions: Question[];
}

export interface Question {
  id: string;
  number?: string;
  text: string;
  marks?: string;
}

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';
