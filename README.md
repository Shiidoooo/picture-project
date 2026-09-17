<p align="center">
  <img src="image.png" alt="Print Layout editor preview" width="100%" />
</p>

# Print Layout

Print Layout is a browser-based photo sheet designer for building print-ready ID-photo and mixed-size image layouts. Upload one or more images, assign each image to a photo size, arrange copies on a chosen paper size, and export the completed sheet as PDF, PNG, or JPEG.

All image processing, layout calculation, and export generation happen locally in the browser. No image is uploaded to a server.

## Features

- Upload multiple JPG, PNG, and WebP source images.
- Assign a different source image to each photo size, or apply one source to every size.
- Crop each source image with:
  - Fill or Fit mode
  - Zoom control
  - Horizontal and vertical position controls
  - Direct drag positioning in the crop preview
- Add predefined or custom photo dimensions in millimetres.
- Use built-in 1 x 1 inch, 1.5 x 1.5 inch, 2 x 2 inch, passport, and wallet templates.
- Switch paper size and portrait/landscape orientation.
- Use a best-fit rectangle packing algorithm to arrange mixed photo sizes efficiently.
- Configure printable margins and spacing between photos.
- Validate quantity, margin, and spacing changes before a photo can fall outside the printable area.
- Show optional cut marks and printable-margin guides in both preview and exports.
- Check the available DPI for each assigned source image and target photo size.
- Export print sheets as PDF, PNG, or JPEG.
- Undo and redo layout changes.
- Save and restore layout settings in the current browser.

## Supported Paper Sizes

| Group       | Sizes                  |
| ----------- | ---------------------- |
| ISO A       | A1, A2, A3, A4, A5, A6 |
| Bond paper  | Short Bond, Long Bond  |
| US          | Letter, Legal, Tabloid |
| Photo paper | 3R, 4R, 5R, 6R, 8R     |

Paper and photo dimensions are stored in millimetres. The current built-in photo presets include 1 x 1 inch, 1.5 x 1.5 inch, 2 x 2 inch, passport (35 x 45 mm), wallet, 3R, 4R, and custom dimensions.

## How It Works

1. Add one or more source images.
2. Select the paper size, orientation, printable margin, and spacing.
3. Assign a source image to each photo size.
4. Choose a template or adjust quantities and custom sizes.
5. Crop and reposition each source image when needed.
6. Optionally enable cut marks or the printable-margin guide.
7. Export a PDF, PNG, or JPEG print sheet.

The layout engine keeps photo cells inside the selected printable area. It rejects quantity, margin, and spacing changes that would make the existing layout overflow, so a setting change never silently removes requested photos.

## Print and Export Notes

- **PDF, PNG, and JPEG use the same canvas renderer**, so crop position, margins, spacing, and optional guides are consistent across formats.
- PDFs are image-based and are placed at the selected physical paper dimensions.
- PNG and JPEG use the configured raster export quality: 150 DPI or 300 DPI.
- Very large paper sizes can exceed the browser raster limit at 300 DPI. Use 150 DPI or PDF if the app warns that a raster sheet is too large.
- Disable cut marks and printable-margin guides for a clean photo sheet. Enable them when the sheet will be manually trimmed.
- For accurate physical output, print the exported PDF at **Actual Size** or **100%**, with browser/printer scaling disabled.

## Technology Stack

| Area            | Technology      |
| --------------- | --------------- |
| UI              | React 19        |
| Build tool      | Vite 8          |
| PDF export      | jsPDF           |
| Image rendering | HTML Canvas API |
| Icons           | Lucide React    |
| Styling         | CSS             |
| Quality checks  | ESLint          |

## Project Structure

```text
picture-project/
|- image.png                 # README header screenshot
|- plan.md                   # Original product plan
|- README.md
`- app/
   |- public/
   |- src/
   |  |- components/         # Focused editor UI components
   |  |- data/               # Paper sizes, templates, defaults
   |  |- hooks/              # Layout undo/redo history
   |  |- services/           # PDF, PNG, JPEG export service
   |  |- utils/              # Packing, crop, quality, storage helpers
   |  |- App.jsx             # Application orchestration
   |  `- index.css           # Application styles
   |- package.json
   `- vite.config.js
```

## Local Development

### Requirements

- Node.js 20 or later
- npm

### Install and Run

```bash
cd app
npm install
npm run dev
```

Vite prints the local development URL, usually `http://localhost:5173`.

### Available Commands

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build in app/dist
npm run lint     # Run ESLint checks
npm run preview  # Preview the production build locally
```

## Deployment

Build the application before deployment:

```bash
cd app
npm run build
```

Deploy the generated `app/dist` directory to any static hosting provider. Because the editor is client-side only, no server runtime or database is required for the current version.

The project `.gitignore` excludes dependencies, generated build output, logs, coverage, and local environment files. A `.env.example` file can be committed if future deployment settings need documented environment variable names.

## Data and Privacy

Source images remain in browser memory through object URLs while the editor is open. Saved layouts retain paper, orientation, margins, spacing, template state, and photo sizes, but do not retain local image files. After restoring a layout, assign images again before exporting.

## Current Scope

This version is a local, client-side print-layout tool. User accounts, cloud projects, shared layouts, server-side image storage, and database-backed custom presets are not included.

## License

Add a license appropriate to this project before public distribution.
