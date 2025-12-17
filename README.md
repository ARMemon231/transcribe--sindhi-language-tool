📝 SindhiPaper AI - Professional Paper Creator

AI-powered OCR tool for digitizing Sindhi language exam papers and handwritten notes

SindhiPaper AI uses Google Gemini's advanced vision capabilities to accurately recognize and transcribe Sindhi script from images, making it easy for educators to create professional digital question papers.
✨ Features

🎯 High-Accuracy Sindhi OCR - Specialized AI model trained on 52 unique Sindhi characters
📄 Smart Document Formatting - Automatically structures question papers with proper headers and sections
✏️ Manual Editing - Fine-tune recognized text with an intuitive editing interface
📥 PDF Export - Save digitized papers as professional A4 PDFs
🔤 Unicode Support - Uses Lateef font with full RTL (Right-to-Left) rendering
📱 Responsive Design - Works seamlessly on desktop and mobile devices

🚀 Quick Start
Prerequisites

Node.js (v16 or higher)
A Google Gemini API key (Get one here)

Installation

Clone the repository:

bashgit clone https://github.com/yourusername/sindh-text-extractor.git
cd sindh-text-extractor

Install dependencies:

bashnpm install

Set up your API key:

Create a .env.local file in the root directory
Add your Gemini API key:



envGEMINI_API_KEY=your_api_key_here

Start the development server:

bashnpm run dev

Open your browser and navigate to http://localhost:5173

💻 Usage

Upload an Image - Click the upload area or drag-and-drop an image of a Sindhi question paper
Wait for Processing - The AI will analyze and transcribe the Sindhi text
Review & Edit - Check the recognized text and make any necessary corrections
Download PDF - Click "Save as PDF" to export your digitized paper

🛠️ Tech Stack

Frontend: React 19 + TypeScript
Build Tool: Vite
AI Engine: Google Gemini 1.5 Pro
Styling: Tailwind CSS
Icons: Lucide React

📦 Project Structure
sindh-text-extractor/
├── components/          # React components
│   ├── Uploader.tsx    # File upload interface
│   └── PaperPreview.tsx # Document preview
├── services/           # API services
│   └── geminiService.ts # Gemini AI integration
├── App.tsx             # Main application
├── types.ts            # TypeScript definitions
└── vite.config.ts      # Vite configuration
🎓 Use Cases

Digitizing handwritten Sindhi exam papers
Converting printed question papers to editable format
Creating digital archives of Sindhi educational materials
Preparing accessible study materials for students

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the project
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
🙏 Acknowledgments

Google Gemini AI for powerful OCR capabilities
Lateef font for beautiful Sindhi typography
The Sindhi education community for inspiration

📧 Contact
Have questions or suggestions? Feel free to open an issue or reach out!

<div align="center">
      Made with ❤️ for Sindhi educators
</div>