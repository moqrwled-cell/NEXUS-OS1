from PIL import Image

def crop_icon():
    img = Image.open('public/favicon.png').convert("RGBA")
    w, h = img.size
    
    # Let's crop a square from the left side of the image
    # Assuming the icon is roughly on the left.
    # We will grab an area of h x h (72x72) from the left
    # But just in case there's padding, let's take a 100x72 area and find the bounding box.
    left_part = img.crop((0, 0, min(100, w), h))
    
    # Get bounding box of the left part
    bbox = left_part.getbbox()
    if bbox:
        icon = left_part.crop(bbox)
        # Create a perfect square
        max_dim = max(icon.size)
        square = Image.new("RGBA", (max_dim + 20, max_dim + 20), (0, 0, 0, 0))
        offset = ((max_dim + 20 - icon.size[0]) // 2, (max_dim + 20 - icon.size[1]) // 2)
        square.paste(icon, offset)
        
        # Save it
        square.resize((64, 64), Image.Resampling.LANCZOS).save('public/favicon.png')
        print("Success")
    else:
        print("Failed to find icon")

crop_icon()
