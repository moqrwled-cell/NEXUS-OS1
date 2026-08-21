import urllib.request
from PIL import Image, ImageEnhance, ImageDraw
import os

# Paths
desktop_dir = r"C:\Users\lenovo\Desktop"
out_banner = os.path.join(desktop_dir, "Nexus_2026_Premium_Banner.png")
logo_path = r"C:\Users\lenovo\.gemini\antigravity\brain\8f15943f-fbf5-4a66-8801-09de08672d63\.user_uploaded\media_1787351670945.png"

# Download a world-class premium dark abstract background from Unsplash
url = "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1500&auto=format&fit=crop"
bg_path = os.path.join(desktop_dir, "temp_bg.jpg")

try:
    urllib.request.urlretrieve(url, bg_path)
    
    # Open the background
    bg = Image.open(bg_path).convert("RGBA")
    
    # Make it 1500x500 (Crop center)
    w, h = bg.size
    left = (w - 1500) // 2
    top = (h - 500) // 2
    bg = bg.crop((left, top, left + 1500, top + 500))
    
    # Darken the background significantly for the "SaaS Dark Mode" feel
    enhancer = ImageEnhance.Brightness(bg)
    bg = enhancer.enhance(0.3)  # 30% brightness
    
    # Add a slight cyan/emerald tint overlay
    overlay = Image.new('RGBA', bg.size, (6, 182, 212, 40)) # Cyan with 40/255 opacity
    bg = Image.alpha_composite(bg, overlay)
    
    # Load his logo
    logo = Image.open(logo_path).convert("RGBA")
    lw, lh = logo.size
    
    # Premium aesthetic: Logo shouldn't be huge. Minimalist sizing.
    target_height = 80
    ratio = target_height / lh
    target_width = int(lw * ratio)
    logo = logo.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Paste logo exactly in the center
    offset_x = (1500 - target_width) // 2
    offset_y = (500 - target_height) // 2
    bg.paste(logo, (offset_x, offset_y), logo)
    
    # Save final
    bg.convert("RGB").save(out_banner, "PNG")
    
    # Cleanup temp
    os.remove(bg_path)
    print("Success")
except Exception as e:
    print(f"Error: {e}")
