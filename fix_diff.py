with open('src/pages/ContractCompare.jsx', 'r', encoding='utf-8') as f: content = f.read()

# Let's just find the start of handleCompare and end of it.
import re

content = re.sub(r'const handleCompare = \(\) => \{[\s\S]*?\n  \};', '''const handleCompare = () => {
    if (!originalText || !revisedText) return;
    setIsProcessing(true);

    setTimeout(() => {
      const originalArray = compareMode === 'words' ? originalText.split(/(\\s+)/) : originalText.split('\\n');
      const revisedArray = compareMode === 'words' ? revisedText.split(/(\\s+)/) : revisedText.split('\\n');
      
      let results = [];
      let i = 0, j = 0;
      
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
    }, 400);
  };''', content)

with open('src/pages/ContractCompare.jsx', 'w', encoding='utf-8') as f: f.write(content)
print('Fixed ContractCompare properly!')
