# Project Files Reference

## 📂 Complete File Structure

```
20260815_HW/
│
├── 📄 Configuration Files
│   ├── package.json              - NPM dependencies and scripts
│   ├── package-lock.json         - Dependency lock file
│   ├── tsconfig.json             - TypeScript root config
│   ├── tsconfig.app.json         - TypeScript app config
│   ├── tsconfig.node.json        - TypeScript Node config
│   ├── vite.config.ts            - Vite build configuration
│   ├── tailwind.config.js        - Tailwind CSS configuration
│   ├── postcss.config.js         - PostCSS configuration
│   ├── .oxlintrc.json            - ESLint configuration
│   └── .env.example              - Environment variables template
│
├── 📖 Documentation
│   ├── README.md                 - Main project documentation
│   ├── QUICKSTART.md             - Quick start guide (2 minutes)
│   ├── SETUP_GUIDE.md            - Detailed setup instructions
│   ├── ARCHITECTURE.md           - Technical architecture
│   ├── BUILD_SUMMARY.md          - Build summary and status
│   └── PROJECT_FILES.md          - This file
│
├── 📦 Source Code
│   ├── index.html                - HTML entry point
│   │
│   └── src/
│       ├── main.tsx              - React app entry point
│       ├── App.tsx               - Main app component & state
│       ├── index.css             - Global styles (Tailwind)
│       │
│       ├── components/           - React components
│       │   ├── UI/               - Reusable UI components
│       │   │   ├── Button.tsx    - Button component with variants
│       │   │   ├── Modal.tsx     - Modal dialog component
│       │   │   └── Alert.tsx     - Alert/notification component
│       │   │
│       │   ├── Navigation.tsx    - Top navigation bar
│       │   ├── CameraCapture.tsx - Camera input component
│       │   ├── FileImporter.tsx  - File import component
│       │   ├── QuestionCanvas.tsx - Extracted text display/edit
│       │   ├── QuestionSelector.tsx - Question selection panel
│       │   ├── QuestionReviewModal.tsx - Review & edit modal
│       │   ├── QuestionEditor.tsx - Individual question editor
│       │   └── ExportManager.tsx - Export interface
│       │
│       ├── services/             - Business logic
│       │   ├── ocrService.ts     - OCR processing (mock + real)
│       │   ├── aiService.ts      - AI generation (mock + real)
│       │   └── exportService.ts  - Export to DOCX/PDF/TXT/JSON
│       │
│       ├── types/                - TypeScript definitions
│       │   └── index.ts          - All type definitions
│       │
│       └── utils/                - Helper functions
│           └── helpers.ts        - Utility functions
│
└── 📁 Other Files
    └── node_modules/            - Installed dependencies (generated)
    └── dist/                     - Build output (generated)
```

## 📊 File Counts

### Source Files
| Type | Count | Location |
|------|-------|----------|
| React Components | 11 | src/components/ |
| UI Components | 3 | src/components/UI/ |
| Services | 3 | src/services/ |
| Utilities | 1 | src/utils/ |
| TypeScript | 18 total | src/ |

### Configuration Files
| Type | Count |
|------|-------|
| TypeScript | 3 |
| Build | 2 |
| Styling | 2 |
| Linting | 1 |
| Environment | 1 |

### Documentation
| File | Purpose |
|------|---------|
| README.md | Main documentation |
| QUICKSTART.md | 2-minute setup |
| SETUP_GUIDE.md | Detailed guide |
| ARCHITECTURE.md | Technical design |
| BUILD_SUMMARY.md | Completion report |
| PROJECT_FILES.md | This file |

## 🔍 Key Files Explained

### Configuration
- **package.json** - Defines dependencies and build scripts
- **vite.config.ts** - Vite build configuration
- **tailwind.config.js** - Tailwind CSS customization
- **tsconfig.json** - TypeScript compilation rules

### Entry Points
- **index.html** - Static HTML template
- **src/main.tsx** - React application entry
- **src/App.tsx** - Main component & state management

### Components
- **CameraCapture.tsx** - Camera input with preview
- **FileImporter.tsx** - File picker and validation
- **QuestionCanvas.tsx** - Text display/editing area
- **QuestionSelector.tsx** - Question selection interface
- **QuestionReviewModal.tsx** - Edit & review questions
- **ExportManager.tsx** - Export format selection

### Services
- **ocrService.ts** - Image to text extraction
- **aiService.ts** - Question generation engine
- **exportService.ts** - Multi-format export

### Types
- **types/index.ts** - All TypeScript interfaces

## 📋 Component Dependencies

```
App.tsx
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

## 🔗 Service Dependencies

```
ocrService.ts
  ↓
extractQuestionsFromOCRResult() → Question[]

aiService.ts
  ↓
generateSimilarQuestions() → GeneratedQuestion[]

exportService.ts
  ↓
exportQuestions() → File Download
```

## 📦 Dependencies Used

### Production Dependencies
- `react@19.2.8` - UI framework
- `react-dom@19.2.8` - React DOM binding
- `jspdf@4.2.1` - PDF generation
- `docx@9.7.1` - Word document generation
- `axios@1.19.0` - HTTP client (future use)
- `lucide-react@1.31.0` - Icon library (future use)
- `clsx@2.1.1` - Class name utility
- `class-variance-authority@0.7.1` - Component variants

### Development Dependencies
- `typescript@6.0.2` - Type checking
- `vite@8.2.0` - Build tool
- `@vitejs/plugin-react@6.0.4` - React plugin
- `tailwindcss@4.3.3` - Styling framework
- `postcss@8.5.26` - CSS processing
- `autoprefixer@10.5.4` - CSS vendor prefixes
- `@types/react@19.2.17` - React types
- `@types/react-dom@19.2.3` - React-DOM types
- `oxlint@1.75.0` - Linter

## 🎯 Quick File Reference

### To Modify...
| What | File |
|------|------|
| Styling/Colors | `tailwind.config.js` |
| Component Layout | `src/components/` |
| Question Logic | `src/services/ocrService.ts` |
| Generation Logic | `src/services/aiService.ts` |
| Export Formats | `src/services/exportService.ts` |
| Type Definitions | `src/types/index.ts` |
| App Flow | `src/App.tsx` |
| Global Styles | `src/index.css` |

### To Add...
| Feature | Start Here |
|---------|-----------|
| New Component | `src/components/` |
| New Service | `src/services/` |
| New Type | `src/types/index.ts` |
| New Utility | `src/utils/helpers.ts` |
| New Dependency | `package.json` |

## 🚀 Build Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
```

## 📄 File Sizes (Approximate)

| File | Size | Purpose |
|------|------|---------|
| App.tsx | ~9 KB | Main application |
| ocrService.ts | ~3 KB | OCR logic |
| aiService.ts | ~4 KB | AI generation |
| exportService.ts | ~6 KB | Export logic |
| Components | ~20 KB | All UI components |
| Styles | ~5 KB | Tailwind CSS |

**Total TypeScript:** ~50 KB
**Total with Deps:** ~150 KB (gzipped: ~60 KB)

## 🔐 Security Notes

### No Secrets in Files
- API keys should go in `.env.local` (not in repo)
- Backend should handle sensitive operations
- Frontend contains only public logic

### File Permissions
- HTML/CSS/JS: Public
- Package files: Public
- Config files: Public
- .env files: Private (never commit)

## 📝 Naming Conventions

### Files
- Components: PascalCase.tsx
- Services: camelCase.ts
- Types: camelCase.ts
- Utils: camelCase.ts

### Components
- Props interfaces: `{ComponentName}Props`
- State interfaces: `{ComponentName}State`
- Handlers: `handle{Action}`
- Callbacks: `on{Action}`

### Services
- Processing functions: `process{Thing}`
- Export functions: `export{Format}`
- Mock functions: `mock{Service}`
- Validation: `validate{Type}`

## 🎨 Import Paths

```typescript
// Components
import Button from './UI/Button';
import Modal from './UI/Modal';

// Services
import { processImageWithOCR } from '../services/ocrService';

// Types
import { Question, GeneratedQuestion } from '../types';

// Utils
import { cn, generateId } from '../utils/helpers';
```

---

## 📚 For More Information

| Need | See |
|------|-----|
| Getting started | QUICKSTART.md |
| Setup help | SETUP_GUIDE.md |
| Technical details | ARCHITECTURE.md |
| What's included | BUILD_SUMMARY.md |
| File reference | PROJECT_FILES.md (this file) |

---

**Ready to explore? Start with QUICKSTART.md!** 🚀
