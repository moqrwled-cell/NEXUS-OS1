import { isImageFile } from '../src/utils/ocrEngine.js';
import assert from 'assert';

console.log('Testing OCR Engine utilities...');

assert.strictEqual(isImageFile('contract_scan.png'), true);
assert.strictEqual(isImageFile('evidence.jpg'), true);
assert.strictEqual(isImageFile('page_1.jpeg'), true);
assert.strictEqual(isImageFile('document.webp'), true);
assert.strictEqual(isImageFile('contract.pdf'), false);
assert.strictEqual(isImageFile('agreement.docx'), false);

console.log('✅ OCR file type detector passed all assertions!');
