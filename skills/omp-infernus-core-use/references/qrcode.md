# @infernus/qrcode — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

QR code generator that renders QR codes as DynamicObject materials.

```bash
pnpm add @infernus/core @infernus/qrcode
```

## Functions

```typescript
import { generateQRText, createQRObject, setObjectQRMaterial } from "@infernus/qrcode";

// Generate QR text (SVG path data)
const qrText = generateQRText("https://example.com", 0, "M");  // typeNumber 0-40, errorLevel L/M/Q/H

// Create a DynamicObject with QR code material
const obj = createQRObject(qrText, {
    modelId: 19300, x: 0, y: 0, z: 10, rx: 0, ry: 0, rz: 0,
    virtualWorld: -1, interior: -1,
}, {
    charset: "utf8",
    materialIndex: 0,
    materialSize: 140,
    fontSize: 30,
    bold: 0,
    fontColor: "#000",
    backColor: "#fff",
    textAlignment: 2,
});

// Apply QR to an existing DynamicObject
setObjectQRMaterial(existingObj, qrText, material);
```

## Types

```typescript
type TypeNumber = 0 | 1 | 2 | ... | 40;
type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
```
