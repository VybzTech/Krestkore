from PIL import Image, ImageDraw, ImageFilter
import math

def draw_chevron_icon(size):
    """Draw the Krestkore double-chevron on a navy circle, AA quality."""
    scale = 4  # supersample factor
    S = size * scale
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Navy circle background
    pad = S * 0.04
    draw.ellipse([pad, pad, S - pad, S - pad], fill=(10, 31, 68, 255))

    # Subtle teal inner glow ring
    ring_pad = S * 0.06
    draw.ellipse([ring_pad, ring_pad, S - ring_pad, S - ring_pad],
                 outline=(20, 184, 166, 60), width=max(1, int(S * 0.015)))

    # Chevron parameters
    sw       = max(2, S * 0.09)   # stroke width (half = radius of dots)
    half_h   = S * 0.30           # half-height of chevron
    tip_x    = S * 0.57           # tip x of LEFT chevron
    base_x   = S * 0.35           # back x of LEFT chevron
    cy       = S * 0.50           # vertical centre
    gap      = S * 0.165          # horizontal gap between chevrons

    teal     = (20, 184, 166, 255)
    white    = (255, 255, 255, 200)

    def stroke_line(x0, y0, x1, y1, color, steps=300):
        r = sw / 2
        for t in range(steps + 1):
            f  = t / steps
            lx = x0 + (x1 - x0) * f
            ly = y0 + (y1 - y0) * f
            draw.ellipse([lx-r, ly-r, lx+r, ly+r], fill=color)

    def draw_chevron(bx, color):
        # top arm: base → tip
        stroke_line(bx,         cy - half_h,
                    bx + (tip_x - base_x), cy,
                    color)
        # bottom arm: tip → base
        stroke_line(bx + (tip_x - base_x), cy,
                    bx,         cy + half_h,
                    color)

    draw_chevron(base_x,       teal)   # left chevron – teal
    draw_chevron(base_x + gap, white)  # right chevron – white

    # Downsample with LANCZOS for clean anti-aliasing
    return img.resize((size, size), Image.LANCZOS)

# --- ICO (16, 32, 48, 64) ---
ico_sizes  = [16, 32, 48, 64]
ico_images = [draw_chevron_icon(s) for s in ico_sizes]
ico_images[0].save(
    '/home/claude/krestkore-ng/src/favicon.ico',
    format='ICO',
    sizes=[(s, s) for s in ico_sizes],
    append_images=ico_images[1:],
)
print("✓ favicon.ico")

# --- PNG assets ---
for sz in [32, 192, 512]:
    img = draw_chevron_icon(sz)
    path = f'/home/claude/krestkore-ng/src/assets/favicon-{sz}.png'
    img.save(path, 'PNG')
    print(f"✓ favicon-{sz}.png")

# --- apple-touch-icon (180×180) ---
touch = draw_chevron_icon(180)
touch.save('/home/claude/krestkore-ng/src/assets/apple-touch-icon.png', 'PNG')
print("✓ apple-touch-icon.png (180×180)")

print("\nAll favicons generated successfully.")
