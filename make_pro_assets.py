from PIL import Image, ImageDraw, ImageFont
import os
import math

# Paths
upload_path = r"C:\Users\lenovo\.gemini\antigravity\brain\8f15943f-fbf5-4a66-8801-09de08672d63\.user_uploaded\media_1787351670945.png"
desktop_dir = r"C:\Users\lenovo\Desktop"
out_logo = os.path.join(desktop_dir, "Nexus_Final_Profile.png")
out_banner = os.path.join(desktop_dir, "Nexus_Final_Banner.png")

try:
    # Load user's exact logo
    user_logo = Image.open(upload_path).convert("RGBA")
    
    # 1. PROFILE PICTURE (500x500)
    profile = Image.new('RGBA', (500, 500), (10, 10, 10, 255)) # Dark background
    
    # Resize user logo to fit inside 400x400
    logo_w, logo_h = user_logo.size
    ratio = min(400 / logo_w, 400 / logo_h)
    new_w = int(logo_w * ratio)
    new_h = int(logo_h * ratio)
    resized_logo = user_logo.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Center it
    offset_x = (500 - new_w) // 2
    offset_y = (500 - new_h) // 2
    
    profile.paste(resized_logo, (offset_x, offset_y), resized_logo)
    profile.convert("RGB").save(out_logo, "PNG")
    
    # 2. TWITTER BANNER (1500x500)
    banner = Image.new('RGBA', (1500, 500), (15, 23, 42, 255)) # Slate dark blue
    draw = ImageDraw.Draw(banner)
    
    # Draw futuristic grid
    for x in range(0, 1500, 50):
        draw.line([(x, 0), (x, 500)], fill=(255, 255, 255, 10), width=1)
    for y in range(0, 500, 50):
        draw.line([(0, y), (1500, y)], fill=(255, 255, 255, 10), width=1)
        
    # Draw some glowing tech lines (Cyan / Emerald)
    draw.line([(0, 480), (1500, 480)], fill=(6, 182, 212, 255), width=4) # Cyan line bottom
    draw.line([(0, 20), (1500, 20)], fill=(16, 185, 129, 100), width=2) # Emerald line top
    
    # Add an angled design element on the right
    draw.polygon([(1100, 500), (1300, 0), (1500, 0), (1500, 500)], fill=(6, 182, 212, 20))
    
    # Resize logo for banner
    b_ratio = min(600 / logo_w, 200 / logo_h)
    b_new_w = int(logo_w * b_ratio)
    b_new_h = int(logo_h * b_ratio)
    b_logo = user_logo.resize((b_new_w, b_new_h), Image.Resampling.LANCZOS)
    
    # Paste logo in the center-left
    b_offset_x = (1500 - b_new_w) // 2
    b_offset_y = (500 - b_new_h) // 2 - 30 # Slightly above center
    banner.paste(b_logo, (b_offset_x, b_offset_y), b_logo)
    
    # Try to add text below it (fallback to default font if needed)
    try:
        font = ImageFont.truetype("arialbd.ttf", 36)
    except:
        font = ImageFont.load_default()
        
    text = "ZERO-COST B2B ARCHITECTURE"
    # Get text bbox to center it
    left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
    tw = right - left
    draw.text(((1500 - tw) // 2, b_offset_y + b_new_h + 30), text, font=font, fill=(148, 163, 184, 255))
    
    banner.convert("RGB").save(out_banner, "PNG")
    print("Success")

except Exception as e:
    print(f"Error: {e}")
