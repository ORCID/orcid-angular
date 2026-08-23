#!/usr/bin/env python3
"""
Build blinded evaluation packets for the ORCID translation experiment.

For every language x feature this produces ONE composite PNG containing the
English source screen plus the three candidate translations (human, and two
Claude models) cropped to the translated feature and labelled A / B / C in a
randomised, seeded order.  The letter -> source mapping is written to a
separate answers/ folder that must NOT be shared with the reviewers.

Usage:
    .venv/bin/python build_evaluation_packets.py           # build everything
    .venv/bin/python build_evaluation_packets.py --probe   # print crop bounds only
"""

import csv
import json
import os
import random
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFont

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = os.path.join(BASE, "screenshots")
OUT = os.path.join(BASE, "evaluation")

SEED = "orcid-translation-experiment-2026-08-20"

LANGS = ["de", "es", "fr", "it", "ja", "pt", "ru", "zh_CN"]
FEATURES = ["register", "two-factor", "developer-tools"]
SOURCES = ["human", "claude-sonnet-5", "claude-opus-4-8"]
LETTERS = ["A", "B", "C"]

LANG_NAMES = {
    "de": "German",
    "es": "Spanish",
    "fr": "French",
    "it": "Italian",
    "ja": "Japanese",
    "pt": "Portuguese",
    "ru": "Russian",
    "zh_CN": "Chinese (Simplified)",
}

FEATURE_NAMES = {
    "register": "Registration - Step 1 (names and emails)",
    "two-factor": "Two-factor authentication setup - Step 1",
    "developer-tools": "Developer tools (Public API)",
}

# Fixed-width left sidebar on the developer-tools page (320 CSS px @ 2x DPR).
# None of the 31 in-scope developer-tools strings live there, so it is cropped
# away to keep the remaining content legible when four panels sit side by side.
DEVTOOLS_SIDEBAR_PX = 640

MAX_COMPOSITE_WIDTH = 4000
PANEL_GAP = 28
PANEL_BORDER = 3
HEADER_H = 132
TITLE_H = 190
MARGIN = 36

C_BG = (255, 255, 255)
C_TITLE = (26, 26, 26)
C_SUBTITLE = (95, 95, 95)
C_BORDER = (200, 200, 200)
C_CAND_BAND = (46, 92, 110)
C_REF_BAND = (122, 122, 122)
C_BAND_TEXT = (255, 255, 255)
C_REDACT = (236, 236, 236)

F_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
F_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"

# --- cost model (see the experiment README for how these were derived) ------
# Human: Transifex/e2f, $0.198 per source word across 14 languages, i.e.
# $0.0141 per word per language. A real order would also hit the $340 minimum
# order charge, which for a job this small dominates everything - so the
# per-screen figure below is the marginal per-word rate, not an invoice.
HUMAN_RATE_PER_WORD_PER_LANG = 0.0141
HUMAN_MIN_ORDER = 340.0
# AI: GitHub AI credits at the $0.04 standard overage rate, for the whole run
# of 87 strings x 8 languages. Apportioned per screen by word share.
CREDIT_RATE = 0.04
MODEL_CREDITS = {"claude-sonnet-5": 147, "claude-opus-4-8": 164}
MODEL_LABEL = {
    "human": "HUMAN  (professional translator)",
    "claude-sonnet-5": "AI  -  Claude Sonnet 5",
    "claude-opus-4-8": "AI  -  Claude Opus 4.8",
}
C_SOURCE_BAND = {
    "human": (150, 82, 40),
    "claude-sonnet-5": (46, 92, 110),
    "claude-opus-4-8": (92, 62, 124),
}


def feature_words():
    """English source words per feature, counted the same way for every source."""
    import html
    import re

    out = {}
    for feat in FEATURES:
        with open(os.path.join(BASE, "english", f"{feat}.json")) as fh:
            data = json.load(fh)
        out[feat] = sum(
            len(re.findall(r"[A-Za-z0-9']+", html.unescape(v))) for v in data.values()
        )
    return out


WORDS = feature_words()
TOTAL_WORDS = sum(WORDS.values())


def screen_cost(source, feature):
    """Cost to translate this one screen into one language, in USD."""
    if source == "human":
        return WORDS[feature] * HUMAN_RATE_PER_WORD_PER_LANG
    run_cost = MODEL_CREDITS[source] * CREDIT_RATE
    return run_cost * (WORDS[feature] / TOTAL_WORDS) / len(LANGS)


def cost_line(source, feature):
    c = screen_cost(source, feature)
    if source == "human":
        return f"${c:,.2f} this screen, per language  (before the ${HUMAN_MIN_ORDER:,.0f} minimum order)"
    credits = MODEL_CREDITS[source] * WORDS[feature] / TOTAL_WORDS / len(LANGS)
    return f"${c:,.2f} this screen, per language  ({credits:.1f} credits)"


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


# --------------------------------------------------------------------------
# crop detection
# --------------------------------------------------------------------------


FOOTER_GREY = (245, 245, 245)
# The dev-tools sidebar background is (252,253,249); a tight tolerance keeps it
# from being mistaken for the (245,245,245) footer band.
GREY_TOL = 2
PAD = 18


def header_bottom(px, w):
    """y of the first row below the full-width rule that closes the site header."""

    def is_yellow(y):
        p = px[10, y]
        return p[0] > 200 and p[1] > 150 and p[2] < 120

    banner_end = 0
    for y in range(0, 400):
        if is_yellow(y):
            banner_end = y

    for y in range(banner_end + 1, 900):
        dark = tot = 0
        for x in range(0, w, 16):
            p = px[x, y]
            tot += 1
            if p[0] < 245 or p[1] < 245 or p[2] < 245:
                dark += 1
        if dark / tot > 0.95:
            return y + 3
    return banner_end + 300


def footer_top(px, h):
    """y where the grey site footer begins.

    Walks up the far-left column, which is pure background everywhere: white in
    the page body, (252,253,249) beside the dev-tools sidebar, (245,245,245)
    once the footer starts.  Cropping here also removes the extra cookie banner
    present only in the live-QA `human` captures, which would otherwise make
    that panel identifiable.
    """

    def is_grey(y):
        p = px[4, y]
        return all(abs(p[i] - FOOTER_GREY[i]) <= GREY_TOL for i in range(3))

    if not is_grey(h - 1):
        return h
    y = h - 1
    while y > int(h * 0.4) and is_grey(y - 1):
        y -= 1
    return y


# The floating support-chat bubble is (32,70,155): blue-red 123, blue-green 85.
# ORCID's own teal links and buttons are (40,91,116): blue-red 76, blue-green 25.
# Thresholds sit in the gap so only the widget matches.
HELP_BLUE_MIN_BR = 95
HELP_BLUE_MIN_BG = 55
HELP_MARGIN = 48

# The bubble is always masked before the content bbox is measured, so it cannot
# inflate the crop window. This only controls whether it is also painted out of
# the finished panels. On: the bubble is a tell - it is in 40 of the 48 AI
# captures and none of the 24 human ones.
REDACT_HELP_WIDGET = True


def help_widget_boxes(im):
    """Every occurrence of the floating blue support-chat bubble.

    The widget is position:fixed, so a stitched full-page capture repeats it
    once per scroll segment at unpredictable heights - hence a list, not a
    single box, and a search over the whole image rather than one corner.

    It appears in 40 of the 48 AI captures and in none of the 24 human ones, so
    leaving it in would let a reviewer identify the human panel without reading
    a word.  Masked out before the content bbox is measured, then asserted
    absent from every finished crop.
    """
    w, h = im.size
    r, g, b = im.split()
    mask = ImageChops.multiply(
        ImageChops.subtract(b, r).point(lambda v: 255 if v > HELP_BLUE_MIN_BR else 0),
        ImageChops.subtract(b, g).point(lambda v: 255 if v > HELP_BLUE_MIN_BG else 0),
    )
    data = mask.tobytes()

    runs = []
    start = None
    for y in range(h):
        hit = 255 in data[y * w : (y + 1) * w]
        if hit and start is None:
            start = y
        elif not hit and start is not None:
            runs.append((start, y))
            start = None
    if start is not None:
        runs.append((start, h))

    boxes = []
    for y0, y1 in runs:
        if y1 - y0 < 6:
            continue
        bb = mask.crop((0, y0, w, y1)).getbbox()
        if bb is None or bb[2] - bb[0] < 12:
            continue
        boxes.append(
            (
                max(0, bb[0] - HELP_MARGIN),
                max(0, y0 - HELP_MARGIN),
                min(w, bb[2] + HELP_MARGIN),
                min(h, y1 + HELP_MARGIN),
            )
        )
    return boxes


def detect_bounds(path, feature):
    """Return (left, top, right, bottom) isolating the translated feature.

    Uses an exact whole-region bbox rather than strided sampling, so thin rules
    and antialiased glyph edges cannot be missed or double-counted.
    """
    im = Image.open(path).convert("RGB")
    w, h = im.size
    px = im.load()

    top = header_bottom(px, w)
    bot = footer_top(px, h)

    # None of the in-scope developer-tools strings live in the fixed-width left
    # sidebar, so it is dropped to keep the text legible across four panels.
    x_min = DEVTOOLS_SIDEBAR_PX if feature == "developer-tools" else 0

    region = im.crop((x_min, top, w, bot))
    draw = ImageDraw.Draw(region)
    for hb in help_widget_boxes(im):
        draw.rectangle(
            [hb[0] - x_min, hb[1] - top, hb[2] - x_min, hb[3] - top], fill=C_BG
        )
    bbox = ImageChops.invert(region).getbbox()
    if bbox is None:
        return x_min, top, w, bot

    left = x_min + bbox[0]
    right = x_min + bbox[2]
    new_top = top + bbox[1]
    new_bot = top + bbox[3]

    if feature == "developer-tools":
        left = x_min

    return (
        max(0, left - PAD),
        max(top, new_top - PAD),
        min(w, right + PAD),
        min(bot, new_bot + PAD),
    )


def group_boxes(lang, feature, sources):
    """One shared crop window for every panel in a language x feature group.

    All four panels are the same screen, so they must be cropped identically:
    a per-panel window would vary with text length and could hint at which
    translation a panel came from.
    """
    boxes = []
    for source in sources:
        name = f"en-{feature}.png" if source == "english" else f"{lang}-{feature}.png"
        boxes.append(detect_bounds(os.path.join(SHOTS, source, name), feature))
    left = min(b[0] for b in boxes)
    right = max(b[2] for b in boxes)
    return left, right, boxes


# The 2FA QR image occupies a fixed 424px square, but it is only fully painted
# in the live-QA `human` captures - the local-build AI captures caught it
# mid-load, showing an 80-190px sliver. That makes the human panel obvious in 6
# of the 8 languages, so the whole square is blanked in every panel. The QR
# encodes a per-session TOTP secret and carries no translated text
# (`account.qrCodeAltText` is alt text), so nothing under review is lost.
QR_SIDE = 424
QR_MARGIN = 16


def qr_block_rect(crop):
    """Rect of the dense QR raster inside a two-factor crop, or None.

    Selected by width, not by density alone: the QR is a centred 424px-wide
    block, whereas a dense line of text (CJK especially) spans most of the
    card. Anything not roughly QR-width is ignored, so a miss leaves the panel
    untouched rather than blanking real text.
    """
    g = crop.convert("L").point(lambda v: 0 if v < 100 else 255)
    w, h = g.size
    d = g.resize((w // 8, h // 8), Image.BOX)
    dw, dh = d.size
    px = d.load()

    spans = {}
    for y in range(dh):
        xs = [x for x in range(dw) if px[x, y] < 130]
        if len(xs) >= 15:
            spans[y] = (min(xs), max(xs))

    runs = []
    cur = []
    for y in range(dh):
        if y in spans:
            cur.append(y)
        elif cur:
            runs.append(cur)
            cur = []
    if cur:
        runs.append(cur)

    best = None
    for run in runs:
        x0 = min(spans[y][0] for y in run) * 8
        x1 = (max(spans[y][1] for y in run) + 1) * 8
        if not (QR_SIDE - 64 <= x1 - x0 <= QR_SIDE + 76):
            continue
        rect = (x0, run[0] * 8, x1, (run[-1] + 1) * 8)
        if best is None or (rect[3] - rect[1]) > (best[3] - best[1]):
            best = rect
    return best


def qr_redaction(crops):
    """One rect covering the QR square in every panel of a two-factor packet.

    Every panel reserves the same 424px square at the same place, so the single
    most complete detection (the tallest, i.e. the least partly-painted) fixes
    the position for all of them. Anchoring on one clean detection rather than
    unioning four avoids inheriting the extra width of a detection that merged
    with a neighbouring line of text.
    """
    rects = [r for r in (qr_block_rect(c) for c in crops) if r is not None]
    if not rects:
        return None
    x0, y0, _, _ = max(rects, key=lambda r: r[3] - r[1])
    cw, ch = crops[0].size
    return (
        max(0, x0 - QR_MARGIN),
        max(0, y0 - QR_MARGIN),
        min(cw, x0 + QR_SIDE + QR_MARGIN),
        min(ch, y0 + QR_SIDE + QR_MARGIN),
    )


def load_crop(source, lang, feature, left, right, box):
    name = f"en-{feature}.png" if source == "english" else f"{lang}-{feature}.png"
    path = os.path.join(SHOTS, source, name)
    im = Image.open(path).convert("RGB")
    return im.crop((left, box[1], right, box[3]))


def union_widget_rect(sources, lang, feature, left, right, boxes):
    """Smallest rectangle, in crop coordinates, covering every support-chat
    bubble that falls inside the shared crop window, or None."""
    rect = None
    for source, box in zip(sources, boxes):
        name = f"en-{feature}.png" if source == "english" else f"{lang}-{feature}.png"
        im = Image.open(os.path.join(SHOTS, source, name)).convert("RGB")
        for hb in help_widget_boxes(im):
            if hb[0] >= right or hb[2] <= left or hb[1] >= box[3] or hb[3] <= box[1]:
                continue
            r = (
                max(0, hb[0] - left),
                max(0, hb[1] - box[1]),
                min(right - left, hb[2] - left),
                min(box[3] - box[1], hb[3] - box[1]),
            )
            rect = (
                r
                if rect is None
                else (
                    min(rect[0], r[0]),
                    min(rect[1], r[1]),
                    max(rect[2], r[2]),
                    max(rect[3], r[3]),
                )
            )
    return rect


# --------------------------------------------------------------------------
# blinding
# --------------------------------------------------------------------------


def _perm(lang, feature, salt=0):
    rng = random.Random(f"{SEED}|{lang}|{feature}|{salt}")
    perm = list(SOURCES)
    rng.shuffle(perm)
    return perm


def assignments_for(lang):
    """Deterministic shuffle per language x feature.

    Independent draws, with one constraint: a language never gets the same
    permutation for all three features, so a reviewer who works out one screen
    does not automatically know the other two.
    """
    perms = {f: _perm(lang, f) for f in FEATURES}
    salt = 0
    while len({tuple(p) for p in perms.values()}) == 1:
        salt += 1
        perms[FEATURES[-1]] = _perm(lang, FEATURES[-1], salt)
    return {
        f: {LETTERS[i]: perms[f][i] for i in range(3)} for f in FEATURES
    }


# --------------------------------------------------------------------------
# composite
# --------------------------------------------------------------------------


def make_panel(
    img, label, band_color, panel_w, panel_h, f_letter, f_small,
    header_h=HEADER_H, sublabel=None,
):
    """One bordered panel: coloured header band + top-aligned screenshot."""
    panel = Image.new("RGB", (panel_w, panel_h), C_BG)
    d = ImageDraw.Draw(panel)
    d.rectangle([0, 0, panel_w - 1, header_h - 1], fill=band_color)

    def centre(text, fnt, y):
        bb = d.textbbox((0, 0), text, font=fnt)
        d.text(
            ((panel_w - (bb[2] - bb[0])) / 2, y - bb[1]),
            text,
            font=fnt,
            fill=C_BAND_TEXT,
        )
        return bb[3] - bb[1]

    if sublabel is None:
        bbox = d.textbbox((0, 0), label, font=f_letter)
        centre(label, f_letter, (header_h - (bbox[3] - bbox[1])) / 2)
    else:
        lh = d.textbbox((0, 0), label, font=f_letter)
        sh = d.textbbox((0, 0), sublabel, font=f_small)
        block = (lh[3] - lh[1]) + 22 + (sh[3] - sh[1])
        y = (header_h - block) / 2
        centre(label, f_letter, y)
        centre(sublabel, f_small, y + (lh[3] - lh[1]) + 22)

    inner_w = panel_w - 2 * PANEL_BORDER
    scale = min(1.0, inner_w / img.width)
    if scale < 1.0:
        img = img.resize((int(img.width * scale), int(img.height * scale)), Image.LANCZOS)
    x = PANEL_BORDER + (inner_w - img.width) // 2
    panel.paste(img, (x, header_h))

    d.rectangle(
        [0, 0, panel_w - 1, panel_h - 1], outline=C_BORDER, width=PANEL_BORDER
    )
    d.line([0, header_h, panel_w - 1, header_h], fill=C_BORDER, width=PANEL_BORDER)
    return panel


def build_composite(lang, feature, mapping, answer_key=False):
    """The blind packet, or - with answer_key - the same image with each panel
    named and priced."""
    panels_src = [("english", "ENGLISH  (source text)", C_REF_BAND)]
    for letter in LETTERS:
        src = mapping[letter]
        if answer_key:
            panels_src.append((src, f"{letter}  -  {MODEL_LABEL[src]}", C_SOURCE_BAND[src]))
        else:
            panels_src.append((src, letter, C_CAND_BAND))

    sources = [p[0] for p in panels_src]
    left, right, boxes = group_boxes(lang, feature, sources)
    crops = [
        load_crop(source, lang, feature, left, right, box)
        for source, box in zip(sources, boxes)
    ]

    # Left visible by request. Note the trade-off this reinstates: the bubble is
    # in 40 of the 48 AI captures and none of the 24 human ones, and on
    # developer-tools it falls inside the crop - so on that screen the human
    # panel is the one without a blue bubble. register and two-factor are
    # unaffected either way, since there the bubble sits outside the cropped
    # card. Set this True to blank it in the three candidate panels instead.
    if REDACT_HELP_WIDGET:
        redaction = union_widget_rect(sources, lang, feature, left, right, boxes)
        if redaction is not None:
            for crop in crops[1:]:
                d = ImageDraw.Draw(crop)
                d.rectangle(redaction, fill=C_REDACT, outline=C_BORDER, width=2)

    # All four panels here: the QR is decorative for this review, and blanking
    # it everywhere keeps the row uniform.
    if feature == "two-factor":
        qr = qr_redaction(crops)
        if qr is not None:
            for crop in crops:
                ImageDraw.Draw(crop).rectangle(
                    qr, fill=C_REDACT, outline=C_BORDER, width=2
                )

    if REDACT_HELP_WIDGET:
        for source, crop in zip(sources, crops):
            if help_widget_boxes(crop):
                raise SystemExit(
                    f"BLINDING FAILURE: support-chat widget still visible in "
                    f"{source} {lang}-{feature}; adjust the crop before sharing."
                )

    cw = max(c.width for c in crops)
    ch = max(c.height for c in crops)

    # tall narrow crops (the centred cards) read best in a single row;
    # the wide developer-tools crop needs a 2x2 grid to stay legible.
    cols = 4 if ch / cw >= 1.15 else 2
    rows = (4 + cols - 1) // cols

    header_h = 214 if answer_key else HEADER_H
    panel_w = cw + 2 * PANEL_BORDER
    panel_h = ch + header_h + PANEL_BORDER

    f_letter = font(F_BOLD, 46 if answer_key else 74)
    f_small = font(F_REG, 34)
    f_title = font(F_BOLD, 62)
    f_sub = font(F_REG, 38)

    title_h = TITLE_H + (46 if answer_key else 0)
    total_w = MARGIN * 2 + cols * panel_w + (cols - 1) * PANEL_GAP
    total_h = title_h + MARGIN + rows * panel_h + (rows - 1) * PANEL_GAP + MARGIN

    canvas = Image.new("RGB", (total_w, total_h), C_BG)
    d = ImageDraw.Draw(canvas)

    if answer_key:
        title = (
            f"ANSWER KEY  -  {LANG_NAMES[lang]} ({lang})  -  "
            f"{FEATURE_NAMES[feature]}"
        )
        sub = (
            f"{WORDS[feature]} English source words on this screen. Costs are for "
            f"translating this one screen into one language."
        )
        sub2 = (
            f"Human rate ${HUMAN_RATE_PER_WORD_PER_LANG}/word/language; a real order "
            f"would bill the ${HUMAN_MIN_ORDER:,.0f} minimum. AI = GitHub AI credits "
            f"at ${CREDIT_RATE}/request, apportioned from the full "
            f"{sum(MODEL_CREDITS.values())}-credit run."
        )
    else:
        title = f"{LANG_NAMES[lang]} ({lang})  -  {FEATURE_NAMES[feature]}"
        sub = (
            "Panels A, B and C show the same screen with three different translations. "
            "English on the left is the source text."
        )
        sub2 = None

    d.text((MARGIN, 44), title, font=f_title, fill=C_TITLE)
    d.text((MARGIN, 122), sub, font=f_sub, fill=C_SUBTITLE)
    if sub2:
        d.text((MARGIN, 174), sub2, font=f_sub, fill=C_SUBTITLE)

    for i, ((src, label, band), crop) in enumerate(zip(panels_src, crops)):
        sublabel = None
        if answer_key:
            sublabel = (
                cost_line(src, feature)
                if src != "english"
                else f"{WORDS[feature]} words  -  not a contender"
            )
        panel = make_panel(
            crop, label, band, panel_w, panel_h, f_letter, f_small,
            header_h=header_h, sublabel=sublabel,
        )
        r, c = divmod(i, cols)
        x = MARGIN + c * (panel_w + PANEL_GAP)
        y = title_h + MARGIN + r * (panel_h + PANEL_GAP)
        canvas.paste(panel, (x, y))

    if canvas.width > MAX_COMPOSITE_WIDTH:
        s = MAX_COMPOSITE_WIDTH / canvas.width
        canvas = canvas.resize(
            (MAX_COMPOSITE_WIDTH, int(canvas.height * s)), Image.LANCZOS
        )

    return canvas, cols


# --------------------------------------------------------------------------
# answer sheets
# --------------------------------------------------------------------------

PRETTY = {
    "human": "HUMAN (professional translator)",
    "claude-sonnet-5": "AI - Claude Sonnet 5",
    "claude-opus-4-8": "AI - Claude Opus 4.8",
}


def write_answers(manifest):
    ans_dir = os.path.join(OUT, "answers")
    os.makedirs(ans_dir, exist_ok=True)

    with open(os.path.join(ans_dir, "answers.csv"), "w", newline="") as fh:
        wr = csv.writer(fh)
        wr.writerow(["lang", "language", "feature", "letter", "source"])
        for lang in LANGS:
            for feature in FEATURES:
                for letter in LETTERS:
                    wr.writerow(
                        [
                            lang,
                            LANG_NAMES[lang],
                            feature,
                            letter,
                            manifest[lang][feature][letter],
                        ]
                    )

    for lang in LANGS:
        per_lang = {
            s: sum(screen_cost(s, f) for f in FEATURES) for s in SOURCES
        }
        lines = [
            f"# Answer sheet - {LANG_NAMES[lang]} (`{lang}`)",
            "",
            "**Do not share this file with reviewers.**",
            "",
            f"Packet images: `evaluation/packets/{lang}/`",
            "",
            f"All three screens in {LANG_NAMES[lang]} "
            f"({TOTAL_WORDS} source words) cost:",
            "",
            "| Source | Cost for this language |",
            "| ------ | ---------------------- |",
        ]
        for s in SOURCES:
            lines.append(f"| {PRETTY[s]} | ${per_lang[s]:,.2f} |")
        lines += [
            "",
            f"Human is the ${HUMAN_RATE_PER_WORD_PER_LANG}/word/language rate; the "
            f"real invoice would be the ${HUMAN_MIN_ORDER:,.0f} minimum order for the "
            f"whole job. AI is that model's share of its "
            f"{sum(MODEL_CREDITS.values())}-credit run at ${CREDIT_RATE}/request.",
            "",
        ]
        for feature in FEATURES:
            m = manifest[lang][feature]
            lines += [
                f"## {feature} - {FEATURE_NAMES[feature]}",
                "",
                f"Blind image: `packets/{lang}/{lang}-{feature}.png`  ",
                f"Answer image: `answers/images/{lang}/{lang}-{feature}-ANSWER.png`  ",
                f"{WORDS[feature]} English source words.",
                "",
                "| Letter | Actually is | Cost for this screen, this language |",
                "| ------ | ----------- | ----------------------------------- |",
            ]
            for letter in LETTERS:
                src = m[letter]
                lines.append(
                    f"| **{letter}** | {PRETTY[src]} | ${screen_cost(src, feature):,.2f} |"
                )
            lines += [
                "",
                "Reviewer verdict (fill in):",
                "",
                "- Believed to be the human translation: `___`",
                "- Ranked best overall: `___`",
                "- Notes:",
                "",
            ]
        with open(os.path.join(ans_dir, f"{lang}.md"), "w") as fh:
            fh.write("\n".join(lines) + "\n")


REVIEWER_MESSAGE = """Hi! Thanks for helping with this.

We're doing a blind check of the ORCID interface translations in {language},
and we'd really value your eye on it.

I'm sending 3 images, one per screen: the registration form, the two-factor
authentication setup, and the developer tools page. Each image shows the same
screen four times - the English source on the left, then three different
{language} translations labelled A, B and C.

For each image, just two questions:

1. Which one reads the most natural and correct? Pick one, or two if you
   can't separate them - or none, if none of them feel right.
2. Which one feels wrong? Same again: one, two, or none.

That's the whole task. No scoring, no rubric.

Beyond that, please add any comment you want - a word that's off, a term that
doesn't match how we normally say it, tone, formatting, anything at all.
Everything you mention goes into the final report we're putting together, with
your name on it.

Two small notes: the grey square is just a placeholder where a QR code was, so
there's nothing to review there; and the A/B/C labels are shuffled differently
on every image, so A on one image is not the same as A on another.

Thanks so much!
"""


README = """# Translation experiment - reviewer packets

Blinded comparison images for the ORCID translation experiment.

## What to send

Send **only** the images in `packets/`. One image per language and feature:

```
packets/es/es-register.png
packets/es/es-two-factor.png
packets/es/es-developer-tools.png
...
```

Each image shows the same screen four times: the English source on the left,
then three translations labelled **A**, **B** and **C**. One of A/B/C is the
current professional human translation; the other two are AI translations
(Claude Sonnet 5 and Claude Opus 4.8). The letters are shuffled independently
for every language and every feature, so `A` does not mean the same thing on
two different images.

## Message to send with them

`messages/{lang}.txt` is a ready-to-paste note for the reviewer of that
language, already filled in with the language name. `messages/_template.txt`
is the same text with a `{LANGUAGE}` placeholder.

It asks each reviewer, per image, to pick whichever reads most natural and
correct (one, two, or none) and whichever feels wrong (one, two, or none), and
invites free-form comments - noting that everything they say goes into the
final report, credited to them.

## The grey square on the two-factor images

That is where the QR code was. It rendered fully in the human captures but only
partly in the AI ones, which made the human panel the obvious odd one out. The
QR encodes a throwaway one-time-password secret and contains no translated
words, so it is blanked in all four panels and nothing under review is lost.
Details in `verification/spot-check-report.md`.

## The grey rectangle on the developer-tools images

That is where a floating blue "Help" support bubble sat. It appears in 40 of
the 48 AI screenshots and in **none** of the 24 human ones, so left in it would
have marked the human panel as the one without a bubble. It also covered a few
words of one paragraph, which cannot be recovered from the capture - so the
same rectangle is blanked in all three candidate panels, an identical loss for
each. The English reference panel is left intact, and `register` is unaffected
(there the bubble falls outside the cropped card).

To remove both grey boxes properly, re-capture the screenshots with the support
widget suppressed and the QR image fully loaded, then re-run this script.

## What NOT to send

- `answers/` - the letter to source mapping, plus a per-language sheet for
  recording each reviewer's verdict.
- `answers/images/` - the **answer-key images**: the same four panels, but with
  each one named (human / Sonnet / Opus) and priced. Useful for the write-up
  once voting is finished; do not let a reviewer see one first.
- `manifest.json` - the same mapping in machine-readable form.
- `verification/` - internal QA of the screenshots.

## Tallying results

`answers/answers.csv` has one row per language/feature/letter. Record verdicts
in the per-language markdown sheets, then count how often each source was
picked as "best" and how often the human translation was correctly identified.
If reviewers cannot reliably pick out the human translation, the AI output is
at parity for these screens.

## Regenerating

```
scripts/.venv/bin/python scripts/build_evaluation_packets.py
```

The shuffle is seeded, so re-running reproduces exactly the same letters.
"""


# --------------------------------------------------------------------------


def main():
    probe = "--probe" in sys.argv

    if probe:
        sources = ["english"] + SOURCES
        for lang in LANGS:
            for feature in FEATURES:
                left, right, boxes = group_boxes(lang, feature, sources)
                dims = " ".join(
                    f"{s[:4]}:{b[3]-b[1]}" for s, b in zip(sources, boxes)
                )
                print(
                    f"{lang:6s} {feature:16s} x={left:5d}..{right:5d} "
                    f"({right-left:5d})  heights[{dims}]"
                )
        return

    manifest = {lang: assignments_for(lang) for lang in LANGS}

    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, "manifest.json"), "w") as fh:
        json.dump(
            {"seed": SEED, "sources": SOURCES, "assignments": manifest}, fh, indent=2
        )

    write_answers(manifest)
    with open(os.path.join(OUT, "README.md"), "w") as fh:
        fh.write(README)

    msg_dir = os.path.join(OUT, "messages")
    os.makedirs(msg_dir, exist_ok=True)
    with open(os.path.join(msg_dir, "_template.txt"), "w") as fh:
        fh.write(REVIEWER_MESSAGE.replace("{language}", "{LANGUAGE}"))
    for lang in LANGS:
        with open(os.path.join(msg_dir, f"{lang}.txt"), "w") as fh:
            fh.write(REVIEWER_MESSAGE.format(language=LANG_NAMES[lang]))

    for lang in LANGS:
        out_dir = os.path.join(OUT, "packets", lang)
        ans_dir = os.path.join(OUT, "answers", "images", lang)
        os.makedirs(out_dir, exist_ok=True)
        os.makedirs(ans_dir, exist_ok=True)
        for feature in FEATURES:
            canvas, cols = build_composite(lang, feature, manifest[lang][feature])
            path = os.path.join(out_dir, f"{lang}-{feature}.png")
            canvas.save(path, optimize=True)

            key, _ = build_composite(
                lang, feature, manifest[lang][feature], answer_key=True
            )
            key_path = os.path.join(ans_dir, f"{lang}-{feature}-ANSWER.png")
            key.save(key_path, optimize=True)

            print(
                f"{lang:6s} {feature:16s} {canvas.width}x{canvas.height} {cols}col "
                f"{os.path.getsize(path)//1024}KB  "
                f"+answer {os.path.getsize(key_path)//1024}KB"
            )

    print("\nDone. Share evaluation/packets/ only.")


if __name__ == "__main__":
    main()
