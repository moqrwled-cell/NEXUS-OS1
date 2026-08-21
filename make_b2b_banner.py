from PIL import Image, ImageDraw, ImageFilter
import os

desktop_dir = r"C:\Users\lenovo\Desktop"
out_banner = os.path.join(desktop_dir, "Nexus_B2B_Banner_Final.png")
logo_path = r"C:\Users\lenovo\.gemini\antigravity\brain\8f15943f-fbf5-4a66-8801-09de08672d63\.user_uploaded\media_1787351670945.png"

try:
    # 1. Base Dark Slate Background (Very Professional B2B)
    width, height = 1500, 500
    banner = Image.new('RGBA', (width, height), (10, 10, 12, 255)) # Almost black with slight blue tint
    draw = ImageDraw.Draw(banner)
    
    # 2. Draw a precise, subtle "Tech Grid" (like Vercel/Next.js designs)
    grid_spacing = 40
    grid_color = (255, 255, 255, 12) # Very subtle white grid
    for x in range(0, width, grid_spacing):
        draw.line([(x, 0), (x, height)], fill=grid_color, width=1)
    for y in range(0, height, grid_spacing):
        draw.line([(0, y), (width, y)], fill=grid_color, width=1)
        
    # 3. Create a glowing cyan/emerald aura in the center
    # We do this by drawing a large colored ellipse on a separate layer and blurring it massively
    glow_layer = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    glow_draw.ellipse([(width//2 - 300, height//2 - 150), (width//2 + 300, height//2 + 150)], fill=(6, 182, 212, 50)) # Cyan glow
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(80)) # Massive blur
    
    # Merge glow
    banner = Image.alpha_composite(banner, glow_layer)
    
    # 4. Add his Logo perfectly
    logo = Image.open(logo_path).convert("RGBA")
    lw, lh = logo.size
    
    # Sizing it perfectly (professional size, not too huge)
    target_height = 90
    ratio = target_height / lh
    target_width = int(lw * ratio)
    logo = logo.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    offset_x = (width - target_width) // 2
    offset_y = (height - target_height) // 2
    banner.paste(logo, (offset_x, offset_y), logo)
    
    # Save
    banner.convert("RGB").save(out_banner, "PNG")
    print("Success")
    
except Exception as e:
    print(f"Error: {e}")
