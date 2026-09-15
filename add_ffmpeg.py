import json
import sys

with open('package.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

data['dependencies']['@ffmpeg/ffmpeg'] = '^0.12.7'
data['dependencies']['@ffmpeg/core'] = '^0.12.4'
data['dependencies']['@ffmpeg/util'] = '^0.12.1'

with open('package.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Added FFmpeg dependencies.")
