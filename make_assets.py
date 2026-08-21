from PIL import Image, ImageDraw, ImageFont
import os

# Paths
base_dir = r"C:\Users\lenovo\Desktop\شغل محمد\منتج الرقمي\nexus-os-landing\public"
logo_path = os.path.join(base_dir, "logo.jpg")
desktop_dir = r"C:\Users\lenovo\Desktop"
out_logo = os.path.join(desktop_dir, "Nexus_Social_Logo.jpg")
out_banner = os.path.join(desktop_dir, "Nexus_Twitter_Banner.jpg")

try:
    # 1. Load Original Logo
    img = Image.open(logo_path).convert("RGB")
    width, height = img.size
    
    # 2. Create Social Media Logo (Square)
    # We want a 1:1 ratio. If it's not 1:1, we crop the center.
    min_dim = min(width, height)
    left = (width - min_dim) / 2
    top = (height - min_dim) / 2
    right = (width + min_dim) / 2
    bottom = (height + min_dim) / 2
    
    sq_logo = img.crop((left, top, right, bottom))
    # Resize to standard 500x500
    sq_logo = sq_logo.resize((500, 500), Image.Resampling.LANCZOS)
    sq_logo.save(out_logo, quality=95)
    print("Social logo created.")

    # 3. Create Twitter Banner (1500 x 500)
    # We'll use the left-most edge color to fill the background
    edge_color = img.getpixel((5, height//2))
    
    banner = Image.new('RGB', (1500, 500), edge_color)
    
    # Resize logo to fit nicely in the center of the banner (e.g. 400x400)
    banner_logo = img.copy()
    banner_logo.thumbnail((400, 400), Image.Resampling.LANCZOS)
    bw, bh = banner_logo.size
    
    # Paste logo in center
    offset_x = (1500 - bw) // 2
    offset_y = (500 - bh) // 2
    banner.paste(banner_logo, (offset_x, offset_y))
    
    banner.save(out_banner, quality=95)
    print("Twitter banner created.")

except Exception as e:
    print(f"Error: {e}")
