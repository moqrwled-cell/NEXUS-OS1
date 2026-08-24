from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

# Paths
desktop_dir = r"C:\Users\lenovo\Desktop"
out_whop = os.path.join(desktop_dir, "Nexus_Whop_Product.png")
logo_path = r"C:\Users\lenovo\.gemini\antigravity\brain\8f15943f-fbf5-4a66-8801-09de08672d63\.user_uploaded\media_1787351670945.png"

try:
    # 1. Base Dark Slate Background (1200 x 630 - standard product card size)
    width, height = 1200, 630
    img = Image.new('RGBA', (width, height), (10, 10, 15, 255))
    draw = ImageDraw.Draw(img)
    
    # 2. Draw a precise, subtle "Tech Grid"
    grid_spacing = 40
    grid_color = (255, 255, 255, 10)
    for x in range(0, width, grid_spacing):
        draw.line([(x, 0), (x, height)], fill=grid_color, width=1)
    for y in range(0, height, grid_spacing):
        draw.line([(0, y), (width, y)], fill=grid_color, width=1)
        
    # 3. Create a glowing cyan/emerald aura in the center
    glow_layer = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    glow_draw.ellipse([(width//2 - 400, height//2 - 200), (width//2 + 400, height//2 + 200)], fill=(6, 182, 212, 60))
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(100))
    
    img = Image.alpha_composite(img, glow_layer)
    draw = ImageDraw.Draw(img) # Re-init draw after composite
    
    # 4. Draw a "Glass" Card in the center
    card_w, card_h = 800, 400
    card_x, card_y = (width - card_w) // 2, (height - card_h) // 2
    
    # Draw card background (semi-transparent black)
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=30, fill=(0, 0, 0, 180), outline=(6, 182, 212, 100), width=2)
    
    # 5. Add his Logo inside the card (top centered)
    logo = Image.open(logo_path).convert("RGBA")
    lw, lh = logo.size
    
    target_logo_height = 80
    ratio = target_logo_height / lh
    target_logo_width = int(lw * ratio)
    logo = logo.resize((target_logo_width, target_logo_height), Image.Resampling.LANCZOS)
    
    logo_x = (width - target_logo_width) // 2
    logo_y = card_y + 50
    img.paste(logo, (logo_x, logo_y), logo)
    
    # 6. Add Text
    try:
        font_large = ImageFont.truetype("arialbd.ttf", 60)
        font_small = ImageFont.truetype("arial.ttf", 30)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
        
    text_main = "NEXUS LEADSCRUB"
    text_sub = "100% PRIVATE • ZERO CLOUD UPLOADS"
    text_price = "$49 / MO"
    
    # We will center text manually by approximating width if truetype fails, 
    # but ImageDraw textbbox is safer
    def draw_centered_text(y_pos, text, font, fill):
        left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
        tw = right - left
        draw.text(((width - tw) // 2, y_pos), text, font=font, fill=fill)
        
    draw_centered_text(logo_y + target_logo_height + 50, text_main, font_large, (255, 255, 255, 255))
    draw_centered_text(logo_y + target_logo_height + 130, text_sub, font_small, (16, 185, 129, 255)) # Emerald
    
    # Draw a price pill
    pill_w, pill_h = 200, 60
    pill_x = (width - pill_w) // 2
    pill_y = card_y + card_h - pill_h - 40
    draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=30, fill=(6, 182, 212, 40), outline=(6, 182, 212, 200), width=2)
    draw_centered_text(pill_y + 12, text_price, font_small, (255, 255, 255, 255))
    
    # Save
    img.convert("RGB").save(out_whop, "PNG")
    print("Success")
    
except Exception as e:
    print(f"Error: {e}")
