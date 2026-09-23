# Derick's QA Strategy Report

## 1. Shift-Left Analysis & Architectural Flaws
Before writing a single test, I have reviewed the core business logic in `app/src/utils/calculateLayout.js`, `services/exportLayout.js`, and `App.jsx`. I have identified several critical ambiguities and architectural risks that need addressing:

> [!WARNING] Potential Performance Bottleneck (Greedy Fit Algorithm)
> The `fitPhotoQuantitiesToPaper` algorithm increments photo quantities in a greedy `while` loop per photo type, invoking `calculateLayout()` on every iteration. For large quantities, this could lead to $O(N^2)$ layout recalculations and freeze the UI thread.
> **Recommendation:** Optimize this to use a binary search or batch increment approach.

> [!WARNING] Greedy Proportion Bias
> The `fitPhotoQuantitiesToPaper` prioritizes earlier photos in the array. If Photo A and Photo B both request a quantity of 100, but only 100 fit in total, Photo A will get 100 and Photo B will get 0. This should ideally reduce quantities proportionally.

> [!CAUTION] PDF Export Quality
> The `exportPdf` function in `services/exportLayout.js` first creates a raster sheet (JPEG) and embeds it into the PDF (`pdf.addImage`). This defeats the purpose of vector scaling for printing and may result in bloated file sizes or blurred edges. 
> **Recommendation:** Draw rectangles and images natively using jsPDF's vector and clipping capabilities.

## 2. Boundary Value Analysis (BVA) & Equivalence Partitions

### **Raster Image Dimension Limit (`exportLayout.js`)**
The application enforces a maximum raster pixel limit (`MAX_RASTER_PIXELS = 80,000,000`).
*   **Partition 1 (Valid):** `width * height <= 80,000,000`
*   **Partition 2 (Invalid):** `width * height > 80,000,000`
*   **BVA Test Points:** `79,999,999` (Valid), `80,000,000` (Valid), `80,000,001` (Invalid - must throw Error)

### **Paper Margin Validation**
*   **Partition 1 (Valid):** `0 <= margin < min(paper.width/2, paper.height/2)`
*   **Partition 2 (Invalid):** `margin >= min(paper.width/2, paper.height/2)` (Printable area becomes 0 or negative)
*   **BVA Test Points:** `0`, `max valid margin - 1`, `max valid margin`, `max valid margin + 1`.

### **Photo Quantities**
*   **Partition 1 (Valid - Zero):** `0`
*   **Partition 2 (Valid - Typical):** `1 to Max Capacity`
*   **Partition 3 (Invalid - Exceeds Paper):** `> Max Capacity`

---

## 3. The 360-Degree Test Matrix

### **Happy Paths (Golden Flows)**
| Test Case | Description | Expected Outcome |
| :--- | :--- | :--- |
| **Apply Standard Template** | User applies a standard template (e.g. 2x2 passport) and a valid photo. | Layout fits perfectly, all placements mapped correctly. |
| **Manual Layout Calculation** | User adds 3 custom sized photos on a standard A4 paper. | Layout efficiently packs rectangles using Guillotine logic. |
| **Export to PDF** | User exports a populated layout to PDF at 300 DPI. | PDF file downloads successfully with correct orientation and sizes. |
| **Export to PNG/JPEG** | User exports a populated layout to raster image. | Image downloads successfully. |

### **Sad Paths (Expected Errors)**
| Test Case | Description | Expected Outcome |
| :--- | :--- | :--- |
| **Photo Doesn't Fit Paper** | Add a single photo whose width/height exceeds the printable area. | UI notification: "That photo size does not fit on the selected paper." |
| **Exceed Printable Area Margin** | User sets margin so large that printable area becomes negative. | UI notification: "Those margin and spacing settings make the current layout exceed the printable area." |
| **Export with Unassigned Images**| Try exporting when a photo placement has no assigned image source. | Error thrown: "Assign an image to every photo size before exporting." |
| **Over-capacity Fit adjustment** | Add quantities exceeding paper capacity. | Application truncates quantity using `fitPhotoQuantitiesToPaper`. |

### **Extreme Edge Cases**
| Test Case | Description | Expected Outcome |
| :--- | :--- | :--- |
| **Massive DPI Raster Export** | Set export DPI to an extreme value (e.g., 2400) pushing dimensions beyond 80M pixels. | Triggers raster exception: "This paper size is too large for a raster export..." |
| **Missing Image Source URL** | The URL of the image source object is revoked or invalid before export. | `loadImage` promise rejects, triggering export failure handler. |
| **Zero/Negative Dimensions** | Inject zero or negative dimensions for paper or photo size. | `calculateLayout` safely returns `{ fits: false, placements: [] }`. |

---

## 4. Testing Pyramid Enforcement

I recommend strict adherence to the Testing Pyramid to keep the build fast:

*   **Unit Tests (70%):** 
    *   Target `utils/calculateLayout.js`, `utils/createTemplateLayout.js`.
    *   Write highly parameterized tests to validate the rectangle bin-packing algorithm. It needs to be lightning-fast.
*   **Integration Tests (20%):** 
    *   Target `services/exportLayout.js`.
    *   Mock Canvas API and jsPDF to verify that `drawRasterPhoto` and `drawCutMarks` are called with the correct translated/scaled coordinates without actually rendering heavy images.
*   **E2E Tests (10%):** 
    *   Use Playwright to cover critical user journeys (Upload -> Assign -> Settings -> Export).
    *   Avoid E2E for checking every permutation of layout combinations.

---

## 5. Architecture Guidelines for Automation (Marvin)

When Marvin (the Test Engineer) writes the Playwright automation, he must implement the **Page Object Model (POM)** to ensure tests are DRY:

```javascript
// Suggested POM Structure
class PictureProjectApp {
  constructor(page) {
    this.page = page;
    this.sidebar = new SidebarComponent(page);
    this.mainStage = new MainStageComponent(page);
    this.uploadModal = new UploadModalComponent(page);
  }
  
  async openApp() {
    await this.page.goto('/');
  }
}

class SidebarComponent {
  // Elements
  get btnExportPdf() { return this.page.locator('[data-testid="export-pdf-btn"]'); }
  get inputPaperSize() { return this.page.locator('[data-testid="paper-size-select"]'); }
  
  // Actions
  async setMargin(value) { /* ... */ }
  async clickExportPdf() { /* ... */ }
}
```

Use `data-testid` attributes on elements in `Sidebar.jsx` and `MainStage.jsx` to detach DOM changes from test locators.
