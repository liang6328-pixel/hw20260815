# Mock Test Generator 📝

A powerful web application for generating mock test questions using AI. Capture images of questions, extract text using OCR, and generate similar questions automatically.

## Features

- 📷 **Camera Capture** - Take photos of question papers directly from your device
- 📁 **File Import** - Upload JPG, PNG, WEBP images
- 🔍 **OCR Processing** - Extract text from images with high accuracy
- ✏️ **Text Editing** - Manual corrections for OCR errors
- 🤖 **AI Question Generation** - Generate 5 similar questions for any selected question
- 📝 **Question Review & Editing** - Edit and refine generated questions
- 💾 **Multiple Export Formats** - Save as DOCX, PDF, TXT, or JSON
- 🎨 **Modern UI** - Clean, responsive, educational-focused design
- 🧪 **Demo Mode** - Built-in mock mode for testing without external APIs

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── UI/             # Basic UI components (Button, Modal, Alert)
│   ├── CameraCapture.tsx
│   ├── FileImporter.tsx
│   ├── QuestionCanvas.tsx
│   ├── QuestionSelector.tsx
│   ├── QuestionReviewModal.tsx
│   ├── QuestionEditor.tsx
│   ├── ExportManager.tsx
│   └── Navigation.tsx
├── services/           # Business logic
│   ├── ocrService.ts   # OCR processing (mock + real)
│   ├── aiService.ts    # AI question generation (mock + real)
│   └── exportService.ts # File export functionality
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
├── App.tsx             # Main app component
└── index.css           # Tailwind CSS styles
```

## How to Use

### Workflow

1. **Capture or Import**
   - Click "Open Camera" to take a photo or "Import File" to upload an image

2. **Extract Text**
   - OCR automatically extracts text
   - Edit if needed to fix errors

3. **Select Question**
   - Choose a question from the detected list

4. **Generate**
   - Click "Generate Similar Questions"
   - AI generates 5 new variations

5. **Review**
   - Edit questions in the modal
   - Toggle inclusion/exclusion
   - Regenerate if needed

6. **Export**
   - Choose format (DOCX, PDF, TXT, JSON)
   - Download your questions

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **jsPDF** - PDF export
- **docx** - Word document export

## Demo Mode

Demo mode (enabled by default) allows you to test the entire workflow without external APIs:
- Mock OCR processing
- Mock question generation
- Full export functionality

Toggle with the checkbox in the top navigation.

## Real API Integration

To use real services:

1. **OCR**: Configure Tesseract.js, Google Cloud Vision, or AWS Textract
2. **AI**: Connect OpenAI, Claude, or similar APIs
3. **Backend**: Create backend service for API keys

Edit the mock functions in `src/services/` to call your real APIs.

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Limitations

- PDF import support coming soon
- Real API integration requires configuration
- Mobile camera support depends on browser capabilities

## License

MIT License - Open source and free to use

---

**Built for educators and test creators** 🎓
