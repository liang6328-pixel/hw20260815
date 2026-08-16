# Mock Test Generator - Setup Guide

## Prerequisites

Before starting, ensure you have:
- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Optional: git for version control

## Installation Steps

### 1. Clone or Download the Project

```bash
# Using git
git clone <repository-url>
cd 20260815_HW

# Or download and extract the ZIP file
cd 20260815_HW
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- jsPDF & docx for exports

### 3. Start Development Server

```bash
npm run dev
```

You should see output like:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### 4. Open in Browser

Navigate to: `http://localhost:5173/`

You should see the Mock Test Generator interface!

## Testing the Application

### Demo Mode Testing

1. **Enable Demo Mode** (should be enabled by default)
   - Look for the "Demo" checkbox in the top-right navigation

2. **Camera Capture Test**
   - Click "Open Camera"
   - The app will request camera permission
   - Click "Capture" to take a photo
   - Click "Use This Image" to process

3. **File Import Test**
   - Click "Import File"
   - Select an image file (JPG, PNG, WEBP)
   - Click "Use This File" to process

4. **Text Extraction**
   - The mock OCR will extract 5 sample questions
   - Review the extracted text
   - Click "Edit" to manually correct if needed

5. **Question Selection**
   - Click on any question in the right panel
   - It will be highlighted in blue
   - Click "Generate Similar Questions"

6. **Review Generated Questions**
   - A modal opens with 5 generated questions
   - You can:
     - Edit question text
     - Edit answer choices
     - Select correct answers
     - Toggle inclusion/exclusion
     - Regenerate questions

7. **Export Questions**
   - Choose export format:
     - **DOCX** - Professional format for editing
     - **PDF** - Universal format for printing
     - **TXT** - Simple text format
     - **JSON** - For data analysis/import

## Project Structure

```
20260815_HW/
├── src/
│   ├── components/
│   │   ├── UI/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Alert.tsx
│   │   ├── CameraCapture.tsx
│   │   ├── FileImporter.tsx
│   │   ├── QuestionCanvas.tsx
│   │   ├── QuestionSelector.tsx
│   │   ├── QuestionReviewModal.tsx
│   │   ├── QuestionEditor.tsx
│   │   ├── ExportManager.tsx
│   │   └── Navigation.tsx
│   ├── services/
│   │   ├── ocrService.ts
│   │   ├── aiService.ts
│   │   └── exportService.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── helpers.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Key Features to Try

### 1. Camera Capture (Desktop/Mobile)
- Requires HTTPS in production
- Works on devices with camera access
- Supports landscape and portrait orientation

### 2. OCR Processing
- Simulated in demo mode
- Extracts 5 sample questions
- Detects question numbering and answer choices

### 3. AI Question Generation
- Generates 5 similar questions
- Tests same concepts with different wording
- Mock mode randomizes variations

### 4. Question Editing
- Edit question text freely
- Modify answer choices A-D
- Select correct answer from dropdown

### 5. Export Functionality
- **DOCX**: Professional format with table layout
- **PDF**: Formatted document for printing
- **TXT**: Simple text for copying/pasting
- **JSON**: Structured data for import

## Troubleshooting

### Issue: Port 5173 Already in Use

```bash
# Use a different port
npm run dev -- --port 3000
```

### Issue: Camera Permission Denied

- Check browser permissions
- Allow camera access when prompted
- Refresh the page and try again

### Issue: File Import Not Working

- Ensure file is valid image format (JPG, PNG, WEBP)
- Check file size (max 10MB)
- Try a different browser

### Issue: Export Not Working

- Check browser popup blocker settings
- Try a different export format
- Clear browser cache and retry

### Issue: Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

## Production Build

When ready for deployment:

```bash
npm run build
```

This creates an optimized build in the `dist/` folder ready for deployment.

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` to configure:
- Demo mode (default: enabled)
- Feature flags
- API endpoints

### Real API Integration

To use real OCR/AI services:

1. **OCR Service**
   - Tesseract.js (client-side, no key needed)
   - Google Cloud Vision API
   - AWS Textract

2. **AI Question Generation**
   - OpenAI GPT-4
   - Anthropic Claude
   - Google PaLM

3. **Backend Service**
   - Create a backend to handle API keys
   - Call backend from frontend
   - Never expose API keys in frontend code

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check  # (if configured)
```

## Browser DevTools

Enable React Developer Tools:
- [Chrome/Edge](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Firefox](https://addons.mozilla.org/firefox/addon/react-devtools/)

## Performance Tips

1. **Demo Mode**: Keep enabled for development/testing
2. **Build Size**: Currently ~150KB gzipped
3. **Loading**: Initial load ~500ms with cached assets

## Next Steps

1. Test the demo mode workflow completely
2. Try exporting in all formats
3. Review component code in `src/components/`
4. Plan API integration strategy
5. Deploy to production

## Support Resources

- React Documentation: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/
- TypeScript: https://www.typescriptlang.org/
- Vite: https://vitejs.dev/

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

### Docker

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

**Happy testing! 🎓**

For issues or questions, refer to the main README.md.
