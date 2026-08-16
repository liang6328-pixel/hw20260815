# Mock Test Generator - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                  Browser Client                         │
│  ┌─────────────────────────────────────────────────────┐
│  │              React Application (19.2)               │
│  │                                                     │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │  │ Components   │  │ Services     │  │ Types    │  │
│  │  │              │  │              │  │          │  │
│  │  │ - Camera     │  │ - OCR        │  │ - Q&A    │  │
│  │  │ - FileImp    │  │ - AI Gen     │  │ - Export │  │
│  │  │ - Canvas     │  │ - Export     │  │ - Session│  │
│  │  │ - Selector   │  │              │  │          │  │
│  │  │ - Modal      │  │              │  │          │  │
│  │  │ - Export     │  │              │  │          │  │
│  │  └──────────────┘  └──────────────┘  └──────────┘  │
│  │                                                     │
│  └─────────────────────────────────────────────────────┘
│                         ↓
│  ┌─────────────────────────────────────────────────────┐
│  │            Tailwind CSS + TypeScript                │
│  └─────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────┘
           ↓
    (Optional APIs)
    ┌────────────────────────────────────────┐
    │  External Services (When Configured)   │
    │  - Google Vision (OCR)                 │
    │  - OpenAI / Claude (AI)                │
    │  - Backend Server (Key Management)     │
    └────────────────────────────────────────┘
```

## Component Hierarchy

```
App.tsx (Main State Manager)
├── Navigation.tsx
├── CameraCapture.tsx
├── FileImporter.tsx
├── QuestionCanvas.tsx
├── QuestionSelector.tsx
├── QuestionReviewModal.tsx
│   └── QuestionEditor.tsx
├── ExportManager.tsx
└── UI Components
    ├── Button.tsx
    ├── Modal.tsx
    └── Alert.tsx
```

## Data Flow

### 1. Input Phase
```
User Action (Camera/File)
    ↓
File/Image Data
    ↓
Base64 Encoding
    ↓
ocrService.processImageWithOCR()
```

### 2. Processing Phase
```
OCR Result (text)
    ↓
extractQuestionsFromOCRResult()
    ↓
Question[] Array
    ↓
Displayed in Canvas & Selector
```

### 3. Generation Phase
```
Selected Question
    ↓
generateSimilarQuestions()
    ↓
GeneratedQuestion[]
    ↓
QuestionReviewModal (Edit/Review)
```

### 4. Export Phase
```
Selected Questions
    ↓
exportQuestions()
    ↓
Format Selection (DOCX/PDF/TXT/JSON)
    ↓
File Download
```

## Service Layer

### ocrService.ts
**Purpose:** Text extraction from images

**Functions:**
- `processImageWithOCR()` - Main entry point
- `mockOCRProcess()` - Demo mode (returns mock data)
- `realOCRProcess()` - Real OCR (Tesseract.js fallback)
- `extractQuestionsFromOCRResult()` - Parse text to questions
- `validateOCRResult()` - Quality check

**Demo Mode:**
Returns pre-formatted sample questions for testing

### aiService.ts
**Purpose:** Generate similar questions using AI

**Functions:**
- `generateSimilarQuestions()` - Generate N variations
- `mockAIGeneration()` - Demo mode (randomized variations)
- `realAIGeneration()` - Real API call
- `regenerateSingleQuestion()` - Regenerate one question
- `validateGeneratedQuestions()` - Quality check

**Demo Mode:**
Generates plausible but randomized question variations

### exportService.ts
**Purpose:** Export questions in multiple formats

**Functions:**
- `exportQuestions()` - Main export dispatcher
- `exportAsText()` - TXT format
- `exportAsJSON()` - JSON format
- `exportAsPDF()` - PDF format (jsPDF)
- `exportAsDOCX()` - Word format (docx)
- `formatQuestionsAsText()` - Text formatter
- `downloadFile()` - Trigger download

**Supported Formats:**
- **DOCX** - Professional table layout (uses docx library)
- **PDF** - Formatted document (uses jsPDF)
- **TXT** - Plain text
- **JSON** - Structured data

## Type System

### Core Types (types/index.ts)

```typescript
Question
├── id: string
├── text: string
├── type: 'multiple-choice' | 'short-answer' | 'essay'
├── choices?: { a, b, c, d }
├── correctAnswer?: string
└── difficulty?: 'easy' | 'medium' | 'hard'

GeneratedQuestion extends Question
├── sourceQuestionId: string
└── edited: boolean

TestSession
├── id: string
├── title: string
├── extractedText: string
├── originalQuestions: Question[]
├── generatedQuestions: GeneratedQuestion[]
└── sourceImage?: string

OCRResult
├── text: string
├── confidence: number
└── detected_questions: Array

GenerationResult
├── questions: GeneratedQuestion[]
└── modelUsed: string

ExportFormat = 'txt' | 'docx' | 'pdf' | 'json'
```

## State Management

### App.tsx (Central State)

```typescript
interface AppState {
  step: 'input' | 'extraction' | 'selection' | 'review' | 'export'
  extractedText: string
  extractedQuestions: Question[]
  selectedQuestion?: Question
  generatedQuestions: GeneratedQuestion[]
  sourceImage?: string
}
```

**State Transitions:**
```
input → extraction → selection → review → export
  ↑                                           ↓
  └───────────────────────────────────────────┘
                 (New Test)
```

## UI Component Architecture

### Button.tsx
Variants: primary, secondary, danger, success
Sizes: sm, md, lg
Features: Loading state, disabled state

### Modal.tsx
Props: isOpen, title, onClose, size (sm/md/lg/xl), closeButton
Full-screen overlay with centered content

### Alert.tsx
Types: info, success, warning, error
Features: Title, message, dismissible

### CameraCapture.tsx
States: initial, capturing, preview
Features: Permission handling, retake, use image

### FileImporter.tsx
Features: File picker, validation, size check
Supported: JPG, PNG, WEBP (max 10MB)

### QuestionCanvas.tsx
Features: Display extracted text, inline editing
Mode: View or Edit

### QuestionSelector.tsx
Features: List with selection, highlightable
Actions: Select question, generate

### QuestionEditor.tsx
Features: Edit question text and choices
Used in: QuestionReviewModal

### QuestionReviewModal.tsx
Features: Multi-question editor, checkbox selection
Actions: Edit, regenerate, save

### ExportManager.tsx
Features: Format selection, title input, summary
Actions: Export with chosen format

## Key Design Decisions

### 1. Demo Mode First
- Application starts with demo mode enabled
- All services have mock implementations
- Real APIs are optional integrations
- **Benefit:** Full testing without external dependencies

### 2. Client-Side Processing
- OCR runs in browser (when implemented)
- Export happens client-side
- No server required for basic functionality
- **Benefit:** Privacy and offline capability

### 3. Modular Services
- Service layer separated from components
- Easy to swap real implementations
- Mock and real versions coexist
- **Benefit:** Flexible architecture

### 4. TypeScript Throughout
- Full type safety
- Better IDE support
- Compile-time error detection
- **Benefit:** Fewer runtime errors

### 5. Tailwind CSS
- No CSS files to maintain
- Responsive by default
- Dark mode capable (future)
- **Benefit:** Faster development

## Performance Optimizations

1. **Component Memoization**
   - useCallback for event handlers
   - Avoid unnecessary re-renders

2. **Lazy Loading**
   - Code splitting ready (Vite)
   - Components load on demand

3. **OCR Processing**
   - Simulated in demo (~1.5s)
   - Throttled in real implementation

4. **Export Generation**
   - Synchronous for TXT/JSON
   - Async for DOCX/PDF

5. **Bundle Size**
   - ~150KB gzipped
   - Tree-shakable dependencies
   - Production build minified

## Error Handling Strategy

```
Error → Alert Component → User Message
                       ↓
                   State Updated
                       ↓
                   Can Retry
```

## Security Considerations

1. **No API Keys in Frontend**
   - Keys stored in backend only
   - Environment variables for configuration

2. **File Validation**
   - Type checking (image/pdf)
   - Size limits (10MB)
   - Extension validation

3. **Input Sanitization**
   - Question text validated
   - Export data is plain text
   - No HTML injection risk

4. **CORS Handling**
   - Backend proxies external APIs
   - No direct cross-origin calls

## Scalability Path

### Phase 1 (Current)
- Demo mode for testing
- Single-question processing
- Client-side only

### Phase 2 (Backend)
- Backend API server
- Real API integrations
- Session management

### Phase 3 (Multi-user)
- User authentication
- Cloud storage
- Collaborative editing

### Phase 4 (Advanced)
- Batch question processing
- Custom AI models
- Analytics dashboard

## Testing Strategy

### Unit Tests (Future)
- Service functions
- Type validation
- Helper utilities

### Integration Tests (Future)
- Component interactions
- State management
- Export generation

### E2E Tests (Future)
- Full workflow
- Error scenarios
- Different browsers

## Deployment Architecture

```
Source Code (GitHub)
    ↓
    CI/CD Pipeline
    ↓
Build (npm run build)
    ↓
Dist Folder
    ↓
Deploy to CDN/Server
    ↓
Public URL
```

**Deployment Options:**
- Vercel (Recommended)
- Netlify
- GitHub Pages
- Docker Container

---

## Future Enhancements

- [ ] PDF import support
- [ ] Real OCR integration
- [ ] OpenAI/Claude integration
- [ ] User authentication
- [ ] Cloud sync
- [ ] Batch operations
- [ ] Custom branding
- [ ] Analytics
- [ ] Collaboration features
- [ ] Mobile app

---

**Architecture designed for extensibility and ease of integration with external services.**
