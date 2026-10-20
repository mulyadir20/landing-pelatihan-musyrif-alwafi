#!/usr/bin/env python3
"""
Skrip penghasil aset statis untuk landing page Pelatihan Musyrif Profesional.

Skrip ini HANYA dibutuhkan oleh developer saat ingin memperbarui aset.
Situs tetap bisa dibangun (npm run build) tanpa menjalankan skrip ini.

Kebutuhan: Python 3 + Pillow (`pip install Pillow`)

Yang dihasilkan:
  public/images/flyer-musyrif-640.webp      -> flyer untuk layar kecil (srcset)
  public/images/flyer-musyrif-1280.webp     -> flyer untuk layar besar (srcset)
  public/images/flyer-musyrif.webp          -> flyer ukuran penuh (lightbox)
  public/images/foto-pembicara-placeholder.jpg -> foto representatif placeholder
  public/images/qr-pendaftaran.png          -> placeholder QR pendaftaran
  public/images/qr-informasi.png            -> placeholder QR informasi

Sumber flyer: brosur.png di root proyek (bisa juga dijalankan dari folder lain
dengan argumen: python3 scripts/optimize-assets.py /path/brosur.png)
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_IMAGES = os.path.join(ROOT, "public", "images")
SRC_FLYER = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "brosur.png")

NAVY = (11, 37, 69)       # #0B2545
NAVY_LIGHT = (19, 49, 92) # #13315C
GOLD = (197, 160, 89)     # #C5A059
GOLD_DEEP = (158, 122, 39)  # #9E7A27
GREY = (120, 116, 110)

FONT_DIR = "/usr/share/fonts/truetype/dejavu"


def font(name, size):
    path = os.path.join(FONT_DIR, name)
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def flatten_on_white(im):
    im = im.convert("RGBA")
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    return Image.alpha_composite(bg, im).convert("RGB")


def make_flyer():
    if not os.path.exists(SRC_FLYER):
        print(f"[skip] flyer tidak ditemukan: {SRC_FLYER}")
        return
    im = flatten_on_white(Image.open(SRC_FLYER))
    w, h = im.size
    print(f"[flyer] sumber {w}x{h}")
    for target_w, name, save_kwargs in [
        (640, "flyer-musyrif-640.webp", {"quality": 86, "method": 6}),
        (1280, "flyer-musyrif-1280.webp", {"quality": 88, "method": 6}),
        (1440, "flyer-musyrif.webp", {"quality": 90, "method": 6}),
    ]:
        target_h = round(h * target_w / w)
        out = im.resize((target_w, target_h), Image.LANCZOS)
        path = os.path.join(PUBLIC_IMAGES, name)
        out.save(path, "WEBP", **save_kwargs)
        print(f"[flyer] {name} {target_w}x{target_h} -> {os.path.getsize(path)//1024} KB")


def make_speaker_placeholder():
    """Placeholder foto representatif: siluet netral di atas gradasi navy."""
    w, h = 1200, 1500
    base = Image.new("RGB", (w, h), NAVY)
    # gradasi diagonal
    grad = Image.new("RGB", (w, h))
    gpx = grad.load()
    for y in range(h):
        for x in range(0, w, 4):
            t = (x / w) * 0.45 + (y / h) * 0.55
            t = min(max(t, 0.0), 1.0)
            r = round(NAVY[0] + (NAVY_LIGHT[0] - NAVY[0]) * t)
            g = round(NAVY[1] + (NAVY_LIGHT[1] - NAVY[1]) * t)
            b = round(NAVY[2] + (NAVY_LIGHT[2] - NAVY[2]) * t)
            for dx in range(4):
                if x + dx < w:
                    gpx[x + dx, y] = (r, g, b)
    base = grad.filter(ImageFilter.GaussianBlur(6))

    # garis diagonal halus
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for i in range(-h, w, 90):
        od.line([(i, h), (i + h, 0)], fill=(255, 255, 255, 10), width=2)
    base = Image.alpha_composite(base.convert("RGBA"), overlay)

    # lingkaran emas samar di belakang siluet
    halo = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    hd = ImageDraw.Draw(halo)
    cx, cy, rad = w // 2, int(h * 0.44), int(w * 0.30)
    hd.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=GOLD + (52,))
    halo = halo.filter(ImageFilter.GaussianBlur(28))
    base = Image.alpha_composite(base, halo)

    # siluet pundak + kepala (netral, bukan foto orang nyata)
    sil = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sil)
    head_r = int(w * 0.115)
    head_cy = int(h * 0.40)
    sd.ellipse(
        [cx - head_r, head_cy - head_r, cx + head_r, head_cy + head_r],
        fill=(255, 255, 255, 34),
    )
    body_top = head_cy + head_r + int(w * 0.035)
    body_w = int(w * 0.62)
    sd.ellipse(
        [cx - body_w // 2, body_top, cx + body_w // 2, body_top + int(h * 0.42)],
        fill=(255, 255, 255, 34),
    )
    base = Image.alpha_composite(base, sil)

    # bingkai emas tipis
    frame = ImageDraw.Draw(base)
    m = 40
    frame.rectangle([m, m, w - m, h - m], outline=GOLD + (110,), width=3)

    out = base.convert("RGB")
    path = os.path.join(PUBLIC_IMAGES, "foto-pembicara-placeholder.jpg")
    out.save(path, "JPEG", quality=86, optimize=True, progressive=True)
    print(f"[foto]  foto-pembicara-placeholder.jpg {w}x{h} -> {os.path.getsize(path)//1024} KB")


def make_qr_placeholder(filename, label):
    """Placeholder QR: putih, border putus-putus, teks jelas 'belum tersedia'."""
    s = 640
    img = Image.new("RGB", (s, s), (255, 255, 255))
    d = ImageDraw.Draw(img)

    pad = 48
    dash, gap = 26, 18
    color = (*GOLD_DEEP, )
    # border putus-putus
    def dashed_rect(x0, y0, x1, y1):
        x = x0
        while x < x1:
            d.line([(x, y0), (min(x + dash, x1), y0)], fill=color, width=5)
            d.line([(x, y1), (min(x + dash, x1), y1)], fill=color, width=5)
            x += dash + gap
        y = y0
        while y < y1:
            d.line([(x0, y), (x0, min(y + dash, y1))], fill=color, width=5)
            d.line([(x1, y), (x1, min(y + dash, y1))], fill=color, width=5)
            y += dash + gap

    dashed_rect(pad, pad, s - pad, s - pad)

    # ikon "gambar" sederhana (bukan QR sungguhan)
    ix0, iy0, ix1, iy1 = s // 2 - 78, 150, s // 2 + 78, 150 + 120
    d.rectangle([ix0, iy0, ix1, iy1], outline=GREY, width=6)
    d.ellipse([ix0 + 34, iy0 + 26, ix0 + 74, iy0 + 66], fill=(*GOLD,))
    d.polygon(
        [(ix0 + 16, iy1 - 16), (ix0 + 62, iy0 + 74), (ix0 + 104, iy1 - 16)],
        fill=(*NAVY_LIGHT,),
    )

    f_big = font("DejaVuSans-Bold.ttf", 46)
    f_small = font("DejaVuSans.ttf", 27)
    f_tiny = font("DejaVuSans.ttf", 23)

    def center_text(y, text, f, fill):
        tw = d.textlength(text, font=f)
        d.text(((s - tw) / 2, y), text, font=f, fill=fill)

    center_text(318, label, f_big, NAVY)
    center_text(386, "QR belum tersedia", f_small, GOLD_DEEP)
    center_text(432, "Ganti file ini dengan", f_tiny, GREY)
    center_text(466, "gambar QR asli", f_tiny, GREY)

    path = os.path.join(PUBLIC_IMAGES, filename)
    img.save(path, "PNG", optimize=True)
    print(f"[qr]    {filename} {s}x{s} -> {os.path.getsize(path)//1024} KB")


if __name__ == "__main__":
    os.makedirs(PUBLIC_IMAGES, exist_ok=True)
    make_flyer()
    make_speaker_placeholder()
    make_qr_placeholder("qr-pendaftaran.png", "QR PENDAFTARAN")
    make_qr_placeholder("qr-informasi.png", "QR INFORMASI")
    print("Selesai.")
