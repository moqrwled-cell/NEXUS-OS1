import os

file = 'src/pages/ContractCompare.jsx'
with open(file, 'r', encoding='utf-8') as f: content = f.read()

# Remove import
content = content.replace("import * as diffLib from 'diff';", "")

# Replace the diff logic with a simple custom one
old_diff = """      setTimeout(() => {
        let results;
        if (compareMode === 'words') {
          results = diffLib.diffWords(originalText, revisedText);
        } else {
          results = diffLib.diffLines(originalText, revisedText);
        }
        setDiffResults(results);
        setIsProcessing(false);
      }, 400);"""

new_diff = """      setTimeout(() => {
        const originalArray = compareMode === 'words' ? originalText.split(/(\\s+)/) : originalText.split('\\n');
        const revisedArray = compareMode === 'words' ? revisedText.split(/(\\s+)/) : revisedText.split('\\n');
        
        let results = [];
        let i = 0, j = 0;
        
        // Very basic diff (mock/simple) for visual demonstration
        while (i < originalArray.length || j < revisedArray.length) {
          if (i < originalArray.length && j < revisedArray.length && originalArray[i] === revisedArray[j]) {
            results.push({ value: originalArray[i] + (compareMode === 'lines' ? '\\n' : '') });
            i++; j++;
          } else if (j < revisedArray.length && (i >= originalArray.length || !originalArray.includes(revisedArray[j]))) {
            results.push({ added: true, value: revisedArray[j] + (compareMode === 'lines' ? '\\n' : '') });
            j++;
          } else if (i < originalArray.length) {
            results.push({ removed: true, value: originalArray[i] + (compareMode === 'lines' ? '\\n' : '') });
            i++;
          }
        }
        
        setDiffResults(results);
        setIsProcessing(false);
      }, 400);"""

content = content.replace(old_diff, new_diff)

with open(file, 'w', encoding='utf-8') as f: f.write(content)
print('Diff logic replaced')
