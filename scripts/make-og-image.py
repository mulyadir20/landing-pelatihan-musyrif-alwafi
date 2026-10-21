#!/usr/bin/env python3
"""
Pembuat gambar Open Graph untuk landing page Pelatihan Musyrif Profesional.

Menghasilkan: public/images/og-pelatihan-musyrif.jpg  (1200 x 630, JPG)

Komposisi landscape:
  - Panel kiri  : navy + aksen emas, berisi judul kegiatan, identitas lembaga,
                  dan logo resmi STIT Al Wafi.
  - Panel kanan : flyer portrait yang sudah ada di public/images, dipasang
                  dengan object-fit "cover" (dipotong, TIDAK diregangkan),
                  difokuskan pada bagian atas flyer yang memuat judul kegiatan.

Jalankan: python3 scripts/make-og-image.py
Kebutuhan: Python 3 + Pillow
"""

import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_IMAGES = os.path.join(ROOT, "public", "images")

FLYER = os.path.join(PUBLIC_IMAGES, "flyer-musyrif-1280.webp")
LOGO = os.path.join(PUBLIC_IMAGES, "logo-stit-al-wafi.png")
OUT = os.path.join(PUBLIC_IMAGES, "og-pelatihan-musyrif.jpg")

W, H = 1200, 630

# Identitas visual Al Wafi
NAVY = (11, 37, 69)          # #0B2545
NAVY_DEEP = (7, 24, 45)
NAVY_LIGHT = (20, 52, 96)
GOLD = (197, 160, 89)        # #C5A059
GOLD_LIGHT = (223, 196, 141)
WHITE = (255, 255, 255)
CREAM = (243, 238, 229)

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
FONT_SEMI = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"

SPLIT = 700  # lebar panel kiri
GUTTER = 68  # jarak tepi kiri


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def navy_panel():
    """Panel kiri: gradasi navy diagonal + garis diagonal halus + pita emas."""
    panel = Image.new("RGB", (SPLIT, H), NAVY)
    grad = Image.new("RGB", (SPLIT, H))
    gp = grad.load()
    for y in range(H):
        for x in range(0, SPLIT, 3):
            t = (x / SPLIT) * 0.55 + (y / H) * 0.45
            t = min(max(t, 0.0), 1.0)
            c = tuple(round(NAVY[i] + (NAVY_LIGHT[i] - NAVY[i]) * t) for i in range(3))
            for dx in range(3):
                if x + dx < SPLIT:
                    gp[x + dx, y] = c
    panel = grad.filter(ImageFilter.GaussianBlur(2))

    overlay = Image.new("RGBA", (SPLIT, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for i in range(-H, SPLIT, 74):
        od.line([(i, H), (i + H, 0)], fill=(255, 255, 255, 9), width=2)
    # lingkaran emas samar
    od.ellipse([-190, -230, 430, 390], fill=GOLD + (22,))
    overlay = overlay.filter(ImageFilter.GaussianBlur(18))

    return Image.alpha_composite(panel.convert("RGBA"), overlay)


def flyer_panel():
    """Panel kanan: flyer dipotong (cover), fokus ke bagian atas flyer."""
    flyer = Image.open(FLYER).convert("RGB")
    fw, fh = flyer.size
    target_w, target_h = W - SPLIT, H

    # Skala agar lebar penuh; tinggi hasil lebih besar -> dipotong vertikal.
    scale = target_w / fw
    new_h = round(fh * scale)
    resized = flyer.resize((target_w, new_h), Image.LANCZOS)

    # Fokus ke 42% bagian atas flyer (memuat judul & identitas kegiatan).
    max_offset = new_h - target_h
    offset = round(max_offset * 0.42)
    offset = max(0, min(offset, max_offset))
    return resized.crop((0, offset, target_w, offset + target_h))


def draw_text_wrapped(draw, text, xy, fnt, fill, max_width, line_gap=8, spacing=4):
    """Gambar teks dengan pemenggalan kata manual sesuai lebar maksimum."""
    x, y = xy
    words = text.split()
    line = ""
    lines = []
    for word in words:
        trial = f"{line} {word}".strip()
        if draw.textlength(trial, font=fnt) <= max_width:
            line = trial
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)

    for i, ln in enumerate(lines):
        draw.text((x, y), ln, font=fnt, fill=fill)
        y += fnt.size + line_gap + spacing
    return y


def main():
    if not os.path.exists(FLYER):
        raise SystemExit(f"Flyer tidak ditemukan: {FLYER}")

    canvas = Image.new("RGB", (W, H), NAVY_DEEP)
    canvas.paste(flyer_panel(), (SPLIT, 0))
    canvas.paste(navy_panel().convert("RGB"), (0, 0))
    draw = ImageDraw.Draw(canvas)

    # Pita emas vertikal sebagai pemisah panel
    draw.rectangle([SPLIT - 6, 0, SPLIT, H], fill=GOLD)

    # --- Isi panel kiri ---
    f_eyebrow = font(FONT_SEMI, 21)
    f_title = font(FONT_BOLD, 53)
    f_sub = font(FONT_REG, 24)
    f_meta = font(FONT_SEMI, 23)
    f_small = font(FONT_REG, 20)

    y = 54

    # Eyebrow
    draw.text((GUTTER, y), "SEKOLAH TINGGI ILMU TARBIYAH AL WAFI BOGOR", font=f_eyebrow, fill=GOLD_LIGHT)
    y += 40
    draw.line([GUTTER, y, GUTTER + 96, y], fill=GOLD, width=4)
    y += 26

    # Judul utama (3 baris)
    for line in ["PELATIHAN", "MUSYRIF", "PROFESIONAL"]:
        draw.text((GUTTER, y), line, font=f_title, fill=WHITE)
        y += f_title.size + 12

    y += 12

    # Subjudul
    y = draw_text_wrapped(
        draw,
        "Membentuk Murabbi, Pembina, dan Pemimpin Santri yang profesional.",
        (GUTTER, y),
        f_sub,
        CREAM,
        SPLIT - GUTTER - 60,
        line_gap=6,
    )

    y += 20

    # Info kegiatan
    for label, value in [
        ("Waktu", "26 Oktober 2026"),
        ("Tempat", "Aula STIT Al Wafi, Bogor"),
    ]:
        draw.text((GUTTER, y), f"{label}: ", font=f_meta, fill=GOLD_LIGHT)
        lw = draw.textlength(f"{label}: ", font=f_meta)
        draw.text((GUTTER + lw, y), value, font=f_small, fill=CREAM)
        y += 34

    # Logo resmi (ditempel di bagian bawah panel, tetap dengan latar navy)
    if os.path.exists(LOGO):
        logo = Image.open(LOGO).convert("RGBA")
        lw_target = 214
        lh_target = round(logo.height * lw_target / logo.width)
        logo = logo.resize((lw_target, lh_target), Image.LANCZOS)
        canvas.paste(logo, (GUTTER, H - lh_target - 42), logo)

    # Simpan sebagai JPG siap pakai untuk WhatsApp
    canvas.save(OUT, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"[og] {os.path.basename(OUT)} {W}x{H} -> {os.path.getsize(OUT) // 1024} KB")


if __name__ == "__main__":
    main()
