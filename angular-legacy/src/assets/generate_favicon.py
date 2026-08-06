from PIL import Image, ImageDraw
import math

def create_favicon():
    sizes = [16, 32, 48, 64, 128, 256]
    images = []

    for size in sizes:
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        # Background circle
        padding = size * 0.05
        draw.ellipse([padding, padding, size - padding, size - padding],
                     fill=(10, 31, 68, 255))  # --navy #0A1F44

        # Draw the double-chevron >> mark (Krestkore brand mark)
        # Left chevron (teal)
        sw = max(1, size * 0.08)  # stroke width
        cx = size * 0.35
        cy = size * 0.5
        half = size * 0.28

        # Left chevron - teal #14B8A6
        teal = (20, 184, 166, 255)
        white70 = (255, 255, 255, 178)

        # First chevron (teal) - left side
        pts1 = [
            (cx - size*0.06, cy - half),
            (cx + size*0.12, cy),
            (cx - size*0.06, cy + half),
        ]
        for i in range(len(pts1) - 1):
            x0, y0 = pts1[i]
            x1, y1 = pts1[i+1]
            for t in range(100):
                lx = x0 + (x1-x0)*t/100
                ly = y0 + (y1-y0)*t/100
                r = int(sw/2)
                draw.ellipse([lx-r, ly-r, lx+r, ly+r], fill=teal)

        # Second chevron (white 70%) - right side
        offset = size * 0.16
        pts2 = [
            (cx - size*0.06 + offset, cy - half),
            (cx + size*0.12 + offset, cy),
            (cx - size*0.06 + offset, cy + half),
        ]
        for i in range(len(pts2) - 1):
            x0, y0 = pts2[i]
            x1, y1 = pts2[i+1]
            for t in range(100):
                lx = x0 + (x1-x0)*t/100
                ly = y0 + (y1-y0)*t/100
                r = int(sw/2)
                draw.ellipse([lx-r, ly-r, lx+r, ly+r], fill=white70)

        images.append(img)

    # Save as ICO with multiple sizes
    images[0].save(
        '/home/claude/krestkore-ng/src/favicon.ico',
        format='ICO',
        sizes=[(s, s) for s in sizes[:4]],
        append_images=images[1:]
    )
    print("favicon.ico created")

    # Also save 192 and 512 PNGs for PWA/Apple touch
    for sz in [192, 512]:
        img = Image.new('RGBA', (sz, sz), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        padding = sz * 0.05
        draw.ellipse([padding, padding, sz - padding, sz - padding],
                     fill=(10, 31, 68, 255))
        sw = sz * 0.08
        cx = sz * 0.35
        cy = sz * 0.5
        half = sz * 0.28
        teal = (20, 184, 166, 255)
        white70 = (255, 255, 255, 178)
        pts1 = [(cx - sz*0.06, cy - half), (cx + sz*0.12, cy), (cx - sz*0.06, cy + half)]
        for i in range(len(pts1)-1):
            x0,y0=pts1[i]; x1,y1=pts1[i+1]
            for t in range(200):
                lx=x0+(x1-x0)*t/200; ly=y0+(y1-y0)*t/200
                r=int(sw/2)
                draw.ellipse([lx-r,ly-r,lx+r,ly+r],fill=teal)
        offset = sz * 0.16
        pts2 = [(cx-sz*0.06+offset,cy-half),(cx+sz*0.12+offset,cy),(cx-sz*0.06+offset,cy+half)]
        for i in range(len(pts2)-1):
            x0,y0=pts2[i]; x1,y1=pts2[i+1]
            for t in range(200):
                lx=x0+(x1-x0)*t/200; ly=y0+(y1-y0)*t/200
                r=int(sw/2)
                draw.ellipse([lx-r,ly-r,lx+r,ly+r],fill=white70)
        img.save(f'/home/claude/krestkore-ng/src/assets/favicon-{sz}.png')
        print(f"favicon-{sz}.png created")

create_favicon()
