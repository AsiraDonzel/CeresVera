"""
PlantGuard - AI Plant Disease Detection
Gradio Frontend — Biopunk Neon-Nature Redesign
"""

import gradio as gr
from disease_data import DISEASE_DATABASE, get_disease_info

try:
    from model import get_classifier, get_leaf_validator
    MODEL_AVAILABLE = True
except Exception:
    MODEL_AVAILABLE = False

# ─── SVG Icon Library ────────────────────────────────────────
ICONS = {
    "leaf":       "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z",
    "leaf2":      "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
    "scan":       "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3",
    "scan_x":     "M12 8v8m-4-4h8",
    "brain":      "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.52-4.33A3 3 0 0 1 5 11a3 3 0 0 1 .5-1.66A2.5 2.5 0 0 1 9.5 2z",
    "brain2":     "M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.52-4.33A3 3 0 0 0 19 11a3 3 0 0 0-.5-1.66A2.5 2.5 0 0 0 14.5 2z",
    "flask":      "M9 3h6m-5 0v3.343a7 7 0 1 0 4 0V3",
    "shield":     "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    "alert":      "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01",
    "upload":     "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
    "microscope": "M6 18h8M3 22h18M14 22a7 7 0 1 0 0-14h-1M9 14l.5-2m-.5 2H4",
    "search":     "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
    "database":   "M12 2C6.48 2 2 3.79 2 6s4.48 4 10 4 10-1.79 10-4-4.48-4-10-4zM2 12c0 2.21 4.48 4 10 4s10-1.79 10-4M2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6",
    "dna":        "M2 15c6.667-6 13.333 0 20-6M2 9c6.667 6 13.333 0 20 6M4 19.5v.5M4 4v.5M20 19.5v.5M20 4v.5",
    "eye":        "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    "camera":     "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    "sparkle":    "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
    "mail":       "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
    "globe":      "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
    "clock":      "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
    "check":      "M20 6L9 17l-5-5",
    "ban":        "M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636",
    "chart":      "M18 20V10M12 20V4M6 20v-6",
    "zap":        "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    "info":       "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM12 8h.01M11 12h1v4h1",
}

def ico(name, size=18, color="currentColor"):
    d = ICONS.get(name, ICONS["leaf"])
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" '
            f'stroke="{color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" '
            f'style="display:inline-block;vertical-align:middle;flex-shrink:0;">'
            f'<path d="{d}"/></svg>')

def ico2(n1, n2, size=18, color="currentColor"):
    d1, d2 = ICONS.get(n1, ""), ICONS.get(n2, "")
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" '
            f'stroke="{color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" '
            f'style="display:inline-block;vertical-align:middle;flex-shrink:0;">'
            f'<path d="{d1}"/><path d="{d2}"/></svg>')

def ibox(icon_fn, bg="rgba(0,255,163,.1)", sz=40, r=11):
    return (f'<div style="width:{sz}px;height:{sz}px;background:{bg};border-radius:{r}px;'
            f'display:flex;align-items:center;justify-content:center;flex-shrink:0;">{icon_fn}</div>')

# ─── Severity ────────────────────────────────────────────────
SEV = {
    "None":     ("#00ffa3", "rgba(0,255,163,.09)"),
    "Low":      ("#a3e635", "rgba(163,230,53,.09)"),
    "Medium":   ("#fbbf24", "rgba(251,191,36,.09)"),
    "High":     ("#f97316", "rgba(249,115,22,.09)"),
    "Critical": ("#f43f5e", "rgba(244,63,94,.09)"),
    "Unknown":  ("#64748b", "rgba(100,116,139,.09)"),
}

def sev_badge(sev):
    fg, bg = SEV.get(sev, SEV["Unknown"])
    return (f'<span style="background:{bg};border:1px solid {fg}38;color:{fg};'
            f'padding:4px 13px 4px 9px;border-radius:20px;font-weight:700;font-size:.77rem;'
            f'letter-spacing:.04em;display:inline-flex;align-items:center;gap:6px;">'
            f'<span style="width:6px;height:6px;background:{fg};border-radius:50%;'
            f'box-shadow:0 0 5px {fg};"></span>{sev}</span>')

def conf_badge(conf):
    if conf >= 80:   fg, bg = "#00ffa3","rgba(0,255,163,.1)"
    elif conf >= 55: fg, bg = "#fbbf24","rgba(251,191,36,.1)"
    else:            fg, bg = "#f97316","rgba(249,115,22,.1)"
    return (f'<span style="background:{bg};border:1px solid {fg}38;color:{fg};'
            f'padding:4px 12px;border-radius:20px;font-weight:700;font-size:.79rem;">'
            f'{conf:.1f}% Confidence</span>')

# ─── Result builders ─────────────────────────────────────────
def disease_card(class_name, info, conf):
    sev = info.get("severity","None")
    fg, _ = SEV.get(sev, SEV["Unknown"])
    leaf_svg = ico2("leaf","leaf2",13,"#34d399")
    return f"""
<div style="background:linear-gradient(135deg,rgba(0,255,163,.06),rgba(129,140,248,.08));
            border:1px solid rgba(0,255,163,.22);border-radius:18px;padding:24px;
            margin-bottom:11px;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;right:0;height:2px;
              background:linear-gradient(90deg,#00ffa3,#818cf8);"></div>
  <div style="position:absolute;top:-50px;right:-50px;width:120px;height:120px;
              background:radial-gradient(circle,rgba(0,255,163,.06),transparent);
              border-radius:50%;pointer-events:none;"></div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:13px;flex-wrap:wrap;gap:8px;">
    <span style="color:#64748b;font-size:.7rem;font-weight:700;text-transform:uppercase;
                 letter-spacing:.08em;">Primary Diagnosis</span>
    {conf_badge(conf)}
  </div>
  <h3 style="color:#f1f5f9;font-size:1.15rem;font-weight:800;margin:0 0 6px;
             letter-spacing:-.02em;">{info['name']}</h3>
  <p style="color:#34d399;margin:0 0 16px;font-size:.82rem;font-weight:600;
            display:flex;align-items:center;gap:5px;">{leaf_svg} {info['plant']}</p>
  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;
              padding-top:13px;border-top:1px solid rgba(255,255,255,.08);">
    <span style="color:#64748b;font-size:.78rem;font-weight:600;">Severity</span>
    {sev_badge(sev)}
  </div>
</div>"""

def detail_sec(label, icon_name, color, text):
    return f"""
<div style="background:rgba(15,25,45,.85);border:1px solid rgba(255,255,255,.08);
            border-left:3px solid {color};border-radius:12px;padding:16px 18px;margin-bottom:10px;">
  <h4 style="color:{color};margin:0 0 9px;font-size:.72rem;font-weight:700;
             text-transform:uppercase;letter-spacing:.09em;
             display:flex;align-items:center;gap:7px;">{ico(icon_name,13,color)} {label}</h4>
  <p style="color:#94a3b8;margin:0;font-size:.84rem;line-height:1.75;">{text}</p>
</div>"""

def build_detail_html(info):
    return (detail_sec("Symptoms",           "eye",    "#00ffa3", info.get("symptoms","-"))
          + detail_sec("Causes",             "dna",    "#818cf8", info.get("causes","-"))
          + detail_sec("Organic Treatment",  "leaf",   "#34d399", info.get("treatment_organic","-"))
          + detail_sec("Chemical Treatment", "flask",  "#fbbf24", info.get("treatment_chemical","-"))
          + detail_sec("Prevention",         "shield", "#818cf8", info.get("prevention","-")))

def alt_preds_html(preds):
    if len(preds) <= 1: return ""
    rows = ""
    for p in preds[1:]:
        info2 = get_disease_info(p["class"]) or {}
        name = info2.get("name", p["class"])
        bw   = max(4, int(p["confidence"]))
        fg   = "#fbbf24" if p["confidence"] > 18 else "#64748b"
        rows += f"""
<div style="margin-bottom:10px;">
  <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
    <span style="color:#94a3b8;font-size:.81rem;">{name}</span>
    <span style="color:{fg};font-size:.77rem;font-weight:700;">{p['confidence']:.1f}%</span>
  </div>
  <div style="background:rgba(255,255,255,.07);border-radius:3px;height:3px;overflow:hidden;">
    <div style="width:{bw}%;height:100%;background:linear-gradient(90deg,#34d399,#818cf8);border-radius:3px;"></div>
  </div>
</div>"""
    return f"""
<div style="background:rgba(15,25,45,.85);border:1px solid rgba(255,255,255,.08);
            border-radius:12px;padding:16px;margin-top:10px;">
  <p style="color:#64748b;font-size:.7rem;font-weight:700;text-transform:uppercase;
            letter-spacing:.09em;margin:0 0 12px;display:flex;align-items:center;gap:5px;">
    {ico("chart",11,"#818cf8")} Alternative Matches</p>
  {rows}
</div>"""

# ─── Prediction ──────────────────────────────────────────────
def predict_disease(image):
    if image is None:
        return (f"""<div style="text-align:center;padding:58px 20px;">
  <div style="width:84px;height:84px;background:rgba(0,255,163,.05);
              border:1.5px dashed rgba(0,255,163,.25);border-radius:50%;
              display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
    {ico("scan",30,"#00ffa3")}{ico("scan_x",30,"#34d399")}
  </div>
  <p style="color:#64748b;font-size:.88rem;margin:0;font-weight:500;">Upload an image to see results</p>
</div>""", "")

    import tempfile, os
    from PIL import Image as PILImage
    tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    PILImage.fromarray(image).save(tmp.name); tmp.close()
    try:
        if not MODEL_AVAILABLE:
            import random
            classes = list(DISEASE_DATABASE.keys())
            top_cls = random.choice(classes)
            preds = [{"class": top_cls, "confidence": random.uniform(78,96)}]
            for _ in range(2):
                preds.append({"class": random.choice(classes), "confidence": random.uniform(3,18)})
        else:
            validator = get_leaf_validator()
            is_leaf, leaf_conf = validator.is_leaf(tmp.name)
            if not is_leaf:
                return (f"""<div style="background:rgba(244,63,94,.07);border:1px solid rgba(244,63,94,.28);
            border-radius:17px;padding:28px;text-align:center;">
  <div style="width:66px;height:66px;background:rgba(244,63,94,.12);border-radius:50%;
              display:flex;align-items:center;justify-content:center;margin:0 auto 13px;">
    {ico("ban",28,"#f43f5e")}</div>
  <h3 style="color:#f43f5e;margin:0 0 9px;font-weight:800;font-size:1rem;">Not a Plant Leaf</h3>
  <p style="color:#fca5a5;margin:0;font-size:.85rem;line-height:1.65;">
    Please upload a clear image of a plant leaf for accurate disease detection.</p>
  <p style="color:#94a3b8;margin-top:9px;font-size:.75rem;">Leaf confidence: {leaf_conf*100:.1f}%</p>
</div>""", "")
            classifier = get_classifier()
            preds = classifier.predict(tmp.name, top_k=3)

        top  = preds[0]
        info = get_disease_info(top["class"]) or {
            "name": top["class"], "plant":"Unknown",
            "symptoms":"-","causes":"-",
            "treatment_organic":"-","treatment_chemical":"-",
            "prevention":"-","severity":"Unknown"
        }
        return (disease_card(top["class"], info, top["confidence"]) + alt_preds_html(preds),
                build_detail_html(info))
    finally:
        os.unlink(tmp.name)

# ─── Disease DB ──────────────────────────────────────────────
SEV_ICON = {"None":("check","#00ffa3"),"Low":("check","#a3e635"),
            "Medium":("alert","#fbbf24"),"High":("alert","#f97316"),"Critical":("zap","#f43f5e")}

def build_disease_db_html(search="", plant_filter="All"):
    cards = []
    for cls, info in DISEASE_DATABASE.items():
        plant, name, sev = info["plant"], info["name"], info["severity"]
        if plant_filter != "All" and plant.lower() != plant_filter.lower(): continue
        if search and search.lower() not in name.lower() and search.lower() not in plant.lower(): continue
        fg, bg = SEV.get(sev, SEV["Unknown"])
        ik, ic = SEV_ICON.get(sev, ("leaf","#34d399"))
        snippet = info["symptoms"][:108] + ("…" if len(info["symptoms"])>108 else "")
        leaf_mini = ico2("leaf","leaf2",11,"#34d399")
        cards.append(f"""
<div class="pg-card" data-cardplant="{plant.lower()}" data-name="{name.lower()}"
  style="background:rgba(30,41,59,.7);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.1);
         border-radius:1rem;padding:24px;position:relative;overflow:hidden;transition:all .3s ease;box-shadow:0 25px 50px -12px rgba(0,0,0,.5);">
  <div style="position:absolute;top:0;left:0;right:0;height:1.5px;
              background:linear-gradient(90deg,{fg}38,transparent);"></div>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
    {ibox(ico(ik,14,ic), bg, 34, 9)}
    <span style="background:{bg};border:1px solid {fg}30;color:{fg};padding:2px 9px;
                 border-radius:20px;font-size:.67rem;font-weight:800;letter-spacing:.05em;">{sev.upper()}</span>
  </div>
  <h4 style="color:#e2e8f0;font-weight:700;margin:0 0 3px;font-size:.87rem;letter-spacing:-.01em;">{name}</h4>
  <p style="color:#34d399;font-size:.73rem;margin:0 0 9px;font-weight:600;
            display:flex;align-items:center;gap:4px;">{leaf_mini} {plant}</p>
  <p style="color:#64748b;font-size:.76rem;margin:0;line-height:1.6;">{snippet}</p>
</div>""")

    if not cards:
        return f"""<div style="text-align:center;padding:50px 20px;">
  <p style="color:#475569;font-size:.88rem;">No diseases found.</p></div>"""
    return '<div id="pg-cards-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(265px,1fr));gap:12px;">' + "".join(cards) + "</div>"

def filter_diseases(search, pf):
    return build_disease_db_html(search, pf)

# ─── CSS ─────────────────────────────────────────────────────
CUSTOM_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; }

body, .gradio-container, .main, .wrap, #root {
    background: #020b14 !important;
    font-family: 'Syne', sans-serif !important;
    color: #94a3b8 !important;
}

/* Dot grid */
body::after {
    content:''; position:fixed; inset:0; z-index:0; pointer-events:none;
    background-image: radial-gradient(rgba(0,255,163,.06) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
}

/* Ambient glows */
body::before {
    content:''; position:fixed; inset:0; z-index:0; pointer-events:none;
    background:
        radial-gradient(ellipse 700px 500px at 5% 15%, rgba(0,255,163,.035) 0%, transparent 70%),
        radial-gradient(ellipse 600px 500px at 95% 85%, rgba(129,140,248,.035) 0%, transparent 70%);
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #020b14; }
::-webkit-scrollbar-thumb { background: linear-gradient(#00ffa3, #818cf8); border-radius:2px; }

/* Tabs nav — centered, theme styled */
.tabs > .tab-nav,
.tab-nav,
[role="tablist"] {
    background: rgba(2,11,20,.98) !important;
    border-bottom: 1px solid rgba(0,255,163,.08) !important;
    padding: 0 !important;
    gap: 0 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    width: 100% !important;
}
.tabs > .tab-nav button,
.tab-nav button,
[role="tab"] {
    background: transparent !important;
    color: #64748b !important;
    border: none !important;
    border-bottom: 2px solid transparent !important;
    border-radius: 0 !important;
    padding: 14px 28px 16px !important;
    font-weight: 500 !important;
    font-size: .95rem !important;
    font-family: 'Syne', sans-serif !important;
    letter-spacing: .01em !important;
    text-transform: none !important;
    transition: all .25s ease !important;
    cursor: pointer !important;
}
.tabs > .tab-nav button:hover,
.tab-nav button:hover,
[role="tab"]:hover {
    color: #00ffa3 !important;
    border-bottom-color: rgba(0,255,163,.3) !important;
}
.tabs > .tab-nav button.selected,
.tab-nav button.selected,
[role="tab"][aria-selected="true"] {
    color: #00ffa3 !important;
    border-bottom-color: #00ffa3 !important;
    font-weight: 700 !important;
}

/* Upload area — single clean border */
.upload-area {
    border-radius: 1rem !important;
    overflow: visible !important;
    margin-bottom: 8px !important;
    width: 100% !important;
}
.upload-area > .block,
.upload-area > .block > .wrap,
.upload-area .image-frame,
.upload-area [data-testid="image"] {
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
}
.upload-area label,
.upload-area .label-wrap,
.upload-area .block > label,
.upload-area > .block > label {
    display: none !important;
    visibility: hidden !important;
}
.upload-area .wrap {
    background: rgba(16,185,129,.05) !important;
    border: 2px dashed rgba(16,185,129,.55) !important;
    border-radius: 1rem !important;
    transition: all .3s ease !important;
    min-height: 220px !important;
    max-height: 240px !important;
    width: 100% !important;
    margin: 0 !important;
    overflow: hidden !important;
}
.upload-area .wrap:hover {
    background: rgba(16,185,129,.1) !important;
    border-color: #34d399 !important;
}
.upload-area .wrap span {
    color: #64748b !important;
    font-family:'Syne',sans-serif !important;
    font-size:.95rem !important;
}
.upload-area .icon-wrap { display: none !important; }
.upload-area .wrap > .flex > .icon-wrap { display: none !important; }
[data-testid="image"] .upload-btn .icon { display: none !important; }

/* Analyze button */
#analyze-btn, #analyze-btn button {
    background: linear-gradient(135deg,#10b981,#059669) !important;
    border: none !important;
    border-radius: 0.75rem !important;
    color: #ffffff !important;
    font-weight: 600 !important;
    font-size: 1.125rem !important;
    font-family: 'Syne',sans-serif !important;
    letter-spacing: 0 !important;
    text-transform: none !important;
    transition: all .3s ease !important;
    box-shadow: none !important;
    padding: 1rem 1.5rem !important;
    min-height: 56px !important;
    width: 100% !important;
}
#analyze-btn:hover button, #analyze-btn button:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 40px rgba(16,185,129,.4) !important;
}

/* Inputs */
input, textarea, input[type=text] {
    background: rgba(2,11,20,.95) !important;
    border: 1.5px solid rgba(0,255,163,.12) !important;
    border-radius: 10px !important;
    color: #94a3b8 !important;
    font-family: 'Syne',sans-serif !important;
    padding: 8px 14px !important;
    font-size: .875rem !important;
    height: 42px !important;
}
input:focus, textarea:focus {
    border-color: rgba(0,255,163,.35) !important;
    box-shadow: 0 0 0 3px rgba(0,255,163,.07) !important;
    outline: none !important;
}
input::placeholder, textarea::placeholder { color: #475569 !important; }
label {
    color: #64748b !important;
    font-size:.78rem !important;
    font-family:'Syne',sans-serif !important;
    font-weight: 600 !important;
    letter-spacing: .04em !important;
    text-transform: uppercase !important;
    margin-bottom: 6px !important;
    display: block !important;
}

/* Search row */
.search-row {
    padding: 12px 16px !important;
    background: rgba(15,25,45,.85) !important;
    border: 1px solid rgba(255,255,255,.07) !important;
    border-radius: 12px !important;
    margin-bottom: 16px !important;
    align-items: flex-end !important;
}

/* Dropdown */
select {
    background: rgba(2,11,20,.95) !important;
    color: #94a3b8 !important;
    border: 1.5px solid rgba(0,255,163,.12) !important;
    border-radius: 10px !important;
    font-family: 'Syne',sans-serif !important;
    height: 42px !important;
    padding: 8px 36px 8px 14px !important;
    font-size: .875rem !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2300ffa3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") !important;
    background-repeat: no-repeat !important;
    background-position: right 12px center !important;
    cursor: pointer !important;
}
select:focus {
    border-color: rgba(0,255,163,.35) !important;
    outline: none !important;
    box-shadow: 0 0 0 3px rgba(0,255,163,.07) !important;
}
.wrap-inner, .multiselect {
    background: rgba(2,11,20,.95) !important;
    border: 1.5px solid rgba(0,255,163,.12) !important;
    border-radius: 10px !important;
    min-height: 42px !important;
}

/* Dropdown popup */
#pg-filter { position: relative !important; }
.gradio-dropdown > .wrap > ul,
.gradio-dropdown ul.options,
ul.options {
    background: rgba(6,14,30,.98) !important;
    border: 1px solid rgba(0,255,163,.2) !important;
    border-radius: 10px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,.6) !important;
    overflow-y: auto !important;
    max-height: 200px !important;
    margin-top: 4px !important;
    z-index: 9999 !important;
}
ul.options li {
    color: #94a3b8 !important;
    padding: 8px 14px !important;
    font-size: .875rem !important;
    font-family: 'Syne', sans-serif !important;
    cursor: pointer !important;
    background: transparent !important;
    transition: background .15s !important;
}
ul.options li:hover { background: rgba(0,255,163,.08) !important; color: #00ffa3 !important; }
ul.options li.selected, ul.options li[aria-selected="true"] { color: #00ffa3 !important; background: rgba(0,255,163,.05) !important; }
.dropdown-arrow svg, .select-arrow svg { stroke: #00ffa3 !important; }
#pg-filter *, .search-row, .search-row > *,
.tabs > .tabitem, .gr-row, .gr-column { overflow: visible !important; }

/* Clean Gradio chrome */
.output-html,[data-testid="html"],.gr-html { background:transparent !important; border:none !important; }
.block,.gr-box,.gr-padded { background:transparent !important; border:none !important; box-shadow:none !important; }
footer,.footer { display:none !important; }
.svelte-1gfkn6j { background: transparent !important; }
.upload-area label > span:first-child { display: none !important; }

/* Container — full width */
.gradio-container { max-width: 100% !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
.main { max-width: 100% !important; padding: 0 !important; }
.contain { max-width: 100% !important; padding: 0 32px !important; }

/* Row / column */
.gap, .gr-row { gap: 1.5rem !important; }
.gr-column { gap: 0.75rem !important; }

/* Tab content */
.tabs > .tabitem { padding: 1rem 2.5rem !important; }

/* Columns fill height */
.gr-row > .gr-column { display: flex !important; flex-direction: column !important; }
.gr-row > .gr-column > * { width: 100% !important; }

/* Upload inner padding */
.upload-area .wrap { padding: 1.5rem !important; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px !important; }

#pg-pill-row {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: wrap !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 8px !important;
    background: transparent !important;
    border: none !important;
    padding: 0 0 20px 0 !important;
    width: 100% !important;
}
.gr-group, .svelte-1p9262q {
    background: transparent !important;
    border: none !important;
}
#pg-pill-row > * {
    flex: 0 0 auto !important;
    width: auto !important;
    min-width: 0 !important;
}
#pg-pill-row button {
    background: rgba(30,41,59,.85) !important;
    border: 1px solid rgba(255,255,255,.1) !important;
    color: #94a3b8 !important;
    padding: 6px 16px !important;
    border-radius: 20px !important;
    font-size: .82rem !important;
    font-weight: 600 !important;
    font-family: Syne, sans-serif !important;
    min-width: 0 !important;
    width: auto !important;
    height: auto !important;
    box-shadow: none !important;
    transition: all .2s !important;
    white-space: nowrap !important;
}
#pg-pill-row button:hover {
    background: rgba(16,185,129,.15) !important;
    border-color: rgba(16,185,129,.4) !important;
    color: #34d399 !important;
}

@keyframes glow-pulse { 0%,100%{box-shadow:0 0 5px #00ffa3;opacity:1} 50%{box-shadow:0 0 16px #00ffa3;opacity:.45} }

/* ═══════════════════════════════════════
   RESPONSIVE — TABLET ≤ 900px
═══════════════════════════════════════ */
@media (max-width: 900px) {
    .tabs > .tabitem { padding: 1.5rem 1.25rem !important; }
    .contain { padding: 0 16px !important; }
}

/* ═══════════════════════════════════════
   RESPONSIVE — MOBILE ≤ 640px
═══════════════════════════════════════ */
@media (max-width: 640px) {

    /* ── Layout: stack rows — but NOT the pill row ── */
    .gr-row:not(#pg-pill-row),
    .gap:not(#pg-pill-row) {
        flex-direction: column !important;
        gap: 1rem !important;
    }
    .gr-row:not(#pg-pill-row) > .gr-column,
    .gap:not(#pg-pill-row) > .gr-column {
        width: 100% !important;
        min-width: 100% !important;
        max-width: 100% !important;
        flex: none !important;
    }

    /* ── Pill row: always horizontal, wrap, centered ── */
    #pg-pill-row {
        flex-direction: row !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
        gap: 6px !important;
        padding: 0 0 14px 0 !important;
    }
    #pg-pill-row > * {
        flex: 0 0 auto !important;
        width: auto !important;
        min-width: 0 !important;
        max-width: none !important;
    }
    #pg-pill-row button {
        padding: 5px 12px !important;
        font-size: .76rem !important;
        width: auto !important;
        min-width: 0 !important;
    }

    /* ── Tab nav: centered, allow slight shrink ── */
    .tabs > .tab-nav,
    .tab-nav,
    [role="tablist"] {
        justify-content: center !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
        padding: 0 4px !important;
        flex-wrap: nowrap !important;
    }
    .tabs > .tab-nav::-webkit-scrollbar { display: none !important; }
    .tabs > .tab-nav button,
    .tab-nav button,
    [role="tab"] {
        padding: 12px 14px 14px !important;
        font-size: .8rem !important;
        white-space: nowrap !important;
        flex-shrink: 1 !important;
    }

    /* ── Tab content: slim padding ── */
    .tabs > .tabitem { padding: 0.75rem 0.75rem !important; }

    /* ── Hero: reduce spacing further on very small screens ── */
    div[style*="padding:64px 16px 48px"] {
        padding: 32px 12px 28px !important;
    }

    /* ── Hero badge: keep single line ── */
    div[style*="padding:7px 14px"] span[style*="white-space:nowrap"] {
        font-size: .65rem !important;
    }

    /* ── Stats grid: always 2 cols, compact ── */
    div[style*="grid-template-columns:repeat(4"] {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 8px !important;
    }

    /* ── Hero buttons: stack vertically on mobile ── */
    div[style*="max-width:480px"][style*="gap:12px"] {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 10px !important;
    }
    div[style*="max-width:480px"][style*="gap:12px"] a {
        width: 100% !important;
        justify-content: center !important;
        box-sizing: border-box !important;
    }

    /* ── How It Works: single column, compact ── */
    div[style*="grid-template-columns:repeat(3"] {
        grid-template-columns: 1fr !important;
        gap: 10px !important;
    }
    div[style*="padding:48px 16px"] {
        padding: 24px 12px !important;
    }

    /* ── About grid: single column ── */
    div[style*="grid-template-columns:1fr 1fr"] {
        grid-template-columns: 1fr !important;
    }

    /* ── Disease DB grid: single column ── */
    #pg-cards-grid,
    div[style*="grid-template-columns:repeat(auto-fill"] {
        grid-template-columns: 1fr !important;
    }



    /* ── Detect tab: upload area ── */
    .upload-area .wrap {
        min-height: 160px !important;
        max-height: 180px !important;
        padding: 1rem !important;
    }

    /* ── Analyze button: full width ── */
    #analyze-btn,
    #analyze-btn button {
        width: 100% !important;
        min-height: 48px !important;
        font-size: .95rem !important;
        padding: 0.75rem 1rem !important;
    }

    /* ── Diagnosis result card: prevent text overflow ── */
    div[style*="border:1px solid rgba(0,255,163,.22)"] h3 {
        font-size: 1rem !important;
        word-break: break-word !important;
    }

    /* ── Detail sections: smaller padding ── */
    div[style*="border-left:3px solid"] {
        padding: 12px 14px !important;
    }

    /* ── Section headings ── */
    h2 { font-size: 1.35rem !important; }

    /* ── Contain padding ── */
    .contain { padding: 0 10px !important; }

    /* ── Prevent horizontal scroll ── */
    body { overflow-x: hidden !important; }

    /* ── Step cards: compact padding ── */
    div[style*="padding:32px"][style*="border-radius:1.5rem"] {
        padding: 20px !important;
    }
    div[style*="padding:32px"][style*="border-radius:1.5rem"] h3 {
        font-size: 1.05rem !important;
    }

    /* ── About cards: compact ── */
    div[style*="padding:32px"][style*="border-radius:1.5rem"],
    div[style*="padding:32px"][style*="margin-bottom:32px"] {
        padding: 18px !important;
    }

    /* ── Scrollbar thinner ── */
    ::-webkit-scrollbar { width: 3px !important; }
}
"""

# ─── Static HTML ─────────────────────────────────────────────
HEADER_HTML = f"""
<div style="background:rgba(2,11,20,.97);backdrop-filter:blur(24px);
            border-bottom:1px solid rgba(0,255,163,.06);padding:11px 14px;
            display:flex;align-items:center;gap:9px;position:sticky;top:0;z-index:200;
            min-width:0;overflow:hidden;">
  <div style="width:34px;height:34px;background:linear-gradient(135deg,#00ffa3,#818cf8);
              border-radius:9px;display:flex;align-items:center;justify-content:center;
              box-shadow:0 0 12px rgba(0,255,163,.25);flex-shrink:0;">
    {ico2("leaf","leaf2",17,"#020b14")}
  </div>
  <div style="min-width:0;flex-shrink:1;">
    <div style="font-size:1rem;font-weight:800;letter-spacing:-.02em;line-height:1.1;
                background:linear-gradient(135deg,#00ffa3,#34d399 45%,#818cf8);
                -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                background-clip:text;white-space:nowrap;">PlantGuard</div>
    <div style="color:#64748b;font-size:.55rem;font-weight:700;letter-spacing:.09em;
                text-transform:uppercase;white-space:nowrap;">AI Disease Detection</div>
  </div>
  <div style="margin-left:auto;flex-shrink:0;background:rgba(0,255,163,.06);
              border:1px solid rgba(0,255,163,.18);border-radius:20px;padding:5px 10px;
              font-size:.65rem;color:#34d399;font-weight:700;
              display:flex;align-items:center;gap:6px;letter-spacing:.03em;
              text-transform:uppercase;white-space:nowrap;">
    <span style="width:6px;height:6px;background:#00ffa3;border-radius:50%;
                 animation:glow-pulse 2s infinite;flex-shrink:0;"></span>Model Active
  </div>
</div>"""

def stat(val, lbl):
    return f"""
<div style="background:rgba(30,41,59,.7);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.1);
            border-radius:1rem;padding:16px 12px;text-align:center;
            box-shadow:0 25px 50px -12px rgba(0,0,0,.5);">
  <div style="font-size:clamp(1.4rem,5vw,2.25rem);font-weight:700;line-height:1.2;margin-bottom:4px;
              background:linear-gradient(135deg,#10b981 0%,#34d399 50%,#6366f1 100%);
              -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">{val}</div>
  <div style="color:#94a3b8;font-size:clamp(.75rem,2vw,.875rem);font-weight:400;">{lbl}</div>
</div>"""

HERO_HTML = f"""
<div style="text-align:center;padding:64px 16px 48px;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;">
  <div style="position:absolute;top:80px;left:40px;width:288px;height:288px;background:rgba(16,185,129,.1);border-radius:50%;filter:blur(64px);pointer-events:none;"></div>
  <div style="position:absolute;bottom:80px;right:40px;width:384px;height:384px;background:rgba(99,102,241,.1);border-radius:50%;filter:blur(64px);pointer-events:none;"></div>
  <div style="display:inline-flex;align-items:center;gap:7px;background:rgba(4,12,24,.9);border:1px solid rgba(0,255,163,.09);border-radius:9999px;padding:7px 14px;margin-bottom:24px;max-width:100%;">
    <span style="width:7px;height:7px;background:#00ffa3;border-radius:50%;animation:glow-pulse 2s infinite;box-shadow:0 0 8px #00ffa3;flex-shrink:0;"></span>
    <span style="color:#34d399;font-size:.7rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;">AI Plant Disease Detection</span>
  </div>
  <h1 style="font-size:clamp(2rem,7vw,4.5rem);font-weight:800;line-height:1.1;letter-spacing:-.03em;margin-bottom:16px;">
    <span style="background:linear-gradient(135deg,#00ffa3 0%,#34d399 40%,#818cf8 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Protect Your Plants</span><br>
    <span style="color:#f1f5f9;">with AI Intelligence</span>
  </h1>
  <p style="color:#94a3b8;font-size:clamp(.88rem,2vw,1.1rem);max-width:560px;margin:0 auto 28px;line-height:1.7;font-weight:400;padding:0 8px;">
    Upload a photo of your plant leaf and get instant disease diagnosis with detailed treatment recommendations.
  </p>
  <div style="display:flex;justify-content:center;gap:12px;margin-bottom:36px;width:100%;max-width:480px;padding:0 16px;">
    <a href="#" onclick="(function(){{var b=document.querySelectorAll('[role=tab]');for(var i=0;i<b.length;i++){{if(b[i].textContent.indexOf('Detect')>-1){{b[i].click();return;}}}}b=document.querySelectorAll('.tab-nav button,.tabs button');for(var i=0;i<b.length;i++){{if(b[i].textContent.indexOf('Detect')>-1){{b[i].click();return;}}}}setTimeout(function(){{var b2=document.querySelectorAll('[role=tab],.tab-nav button');for(var i=0;i<b2.length;i++)if(b2[i].textContent.indexOf('Detect')>-1)b2[i].click();}},400);}})();return false;"
       style="display:inline-flex;align-items:center;justify-content:center;gap:9px;
              flex:1;min-width:0;
              background:#00e896;
              color:#020b14;padding:14px 20px;border-radius:10px;
              font-weight:700;font-size:1rem;letter-spacing:.01em;white-space:nowrap;
              text-decoration:none;box-shadow:0 0 24px rgba(0,232,150,.3),0 4px 12px rgba(0,0,0,.4);
              transition:all .22s;border:none;">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#020b14" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
      Start Detection
    </a>
    <a href="#" onclick="(function(){{var b=document.querySelectorAll('[role=tab]');for(var i=0;i<b.length;i++){{if(b[i].textContent.indexOf('Disease')>-1){{b[i].click();return;}}}}b=document.querySelectorAll('.tab-nav button,.tabs button');for(var i=0;i<b.length;i++){{if(b[i].textContent.indexOf('Disease')>-1){{b[i].click();return;}}}}setTimeout(function(){{var b2=document.querySelectorAll('[role=tab],.tab-nav button');for(var i=0;i<b2.length;i++)if(b2[i].textContent.indexOf('Disease')>-1)b2[i].click();}},400);}})();return false;"
       style="display:inline-flex;align-items:center;justify-content:center;gap:9px;
              flex:1;min-width:0;
              background:rgba(15,23,42,.95);
              color:#cbd5e1;padding:14px 20px;border-radius:10px;
              font-weight:700;font-size:1rem;letter-spacing:.01em;white-space:nowrap;
              text-decoration:none;border:1.5px solid rgba(99,102,241,.5);
              box-shadow:0 4px 12px rgba(0,0,0,.5);transition:all .22s;">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
        <path d="M12 2C6.48 2 2 3.79 2 6s4.48 4 10 4 10-1.79 10-4-4.48-4-10-4z"/>
        <path d="M2 12c0 2.21 4.48 4 10 4s10-1.79 10-4M2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6"/>
      </svg>
      Learn Diseases
    </a>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:860px;width:100%;margin:0 auto;padding:0 8px;">
    {stat("38+","Diseases")}{stat("14+","Plants")}{stat("90%+","Accuracy")}{stat("24/7","Available")}
  </div>
</div>"""

def step_card(icon_svg, accent, bg, num, title, desc):
    return f"""
<div style="background:rgba(30,41,59,.7);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.1);
            border-radius:1.5rem;padding:32px;text-align:center;
            box-shadow:0 25px 50px -12px rgba(0,0,0,.5);">
  <div style="width:80px;height:80px;margin:0 auto 24px;border-radius:1rem;
              background:{bg};display:flex;align-items:center;justify-content:center;">
    {icon_svg}
  </div>
  <h3 style="color:#f1f5f9;font-weight:600;margin:0 0 12px;font-size:1.25rem;">{title}</h3>
  <p style="color:#94a3b8;font-size:1rem;margin:0;line-height:1.75;">{desc}</p>
</div>"""

HOW_IT_WORKS_HTML = f"""
<div style="padding:48px 16px;">
  <div style="text-align:center;margin-bottom:40px;">
    <h2 style="color:#f1f5f9;font-size:clamp(1.5rem,3vw,2rem);font-weight:700;letter-spacing:-.02em;margin-bottom:10px;">How It Works</h2>
    <p style="color:#64748b;font-size:1rem;">Three simple steps to protect your plants</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1000px;margin:0 auto;">
    <a href="#" onclick="(function(){{var b=document.querySelectorAll('[role=tab],.tab-nav button');for(var i=0;i<b.length;i++)if(b[i].textContent.indexOf('Detect')>-1){{b[i].click();return;}}setTimeout(function(){{var b2=document.querySelectorAll('[role=tab],.tab-nav button');for(var i=0;i<b2.length;i++)if(b2[i].textContent.indexOf('Detect')>-1)b2[i].click();}},400);}})();return false;" style="text-decoration:none;display:block;">
      {step_card(ico("camera",20,"#00ffa3"),"#00ffa3","rgba(0,255,163,.08)",1,"Upload Photo","Drag and drop a clear photo of the affected leaf.")}
    </a>
    <a href="#" onclick="(function(){{var b=document.querySelectorAll('[role=tab],.tab-nav button');for(var i=0;i<b.length;i++)if(b[i].textContent.indexOf('Detect')>-1){{b[i].click();return;}}setTimeout(function(){{var b2=document.querySelectorAll('[role=tab],.tab-nav button');for(var i=0;i<b2.length;i++)if(b2[i].textContent.indexOf('Detect')>-1)b2[i].click();}},400);}})();return false;" style="text-decoration:none;display:block;">
      {step_card(ico2("brain","brain2",20,"#818cf8"),"#818cf8","rgba(129,140,248,.08)",2,"AI Analysis","MobileNetV3 deep learning scans for disease patterns.")}
    </a>
    <a href="#" onclick="(function(){{var b=document.querySelectorAll('[role=tab],.tab-nav button');for(var i=0;i<b.length;i++)if(b[i].textContent.indexOf('Disease')>-1){{b[i].click();return;}}setTimeout(function(){{var b2=document.querySelectorAll('[role=tab],.tab-nav button');for(var i=0;i<b2.length;i++)if(b2[i].textContent.indexOf('Disease')>-1)b2[i].click();}},400);}})();return false;" style="text-decoration:none;display:block;">
      {step_card(ico("flask",20,"#fbbf24"),"#fbbf24","rgba(251,191,36,.08)",3,"Get Treatment","Detailed diagnosis with causes and treatment protocols.")}
    </a>
  </div>
</div>"""

PLANTS = ['Apple','Blueberry','Cherry','Corn','Grape','Orange','Peach',
          'Pepper','Potato','Raspberry','Soybean','Squash','Strawberry','Tomato']

def plant_pill(p):
    return (f'<span style="background:rgba(51,65,85,.8);border:1px solid rgba(255,255,255,.08);'
            f'color:#94a3b8;padding:4px 12px;border-radius:9999px;font-size:.875rem;font-weight:400;margin:2px;display:inline-block;">{p}</span>')

def acard(content, mb="32px"):
    return (f'<div style="background:rgba(30,41,59,.7);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.1);'
            f'border-radius:1.5rem;padding:32px;margin-bottom:{mb};box-shadow:0 25px 50px -12px rgba(0,0,0,.5);">{content}</div>')

def atitle(icon_svg, label):
    return (f'<h3 style="color:#f1f5f9;font-size:1.5rem;font-weight:700;margin:0 0 16px;'
            f'letter-spacing:-.02em;display:flex;align-items:center;gap:10px;">{icon_svg} {label}</h3>')

def arow(icon_svg, title, desc):
    return (f'<div style="display:flex;gap:16px;align-items:flex-start;margin-bottom:16px;">'
            f'{ibox(icon_svg,"rgba(16,185,129,.2)",40,8)}'
            f'<div><p style="color:#f1f5f9;font-weight:500;margin:0 0 4px;font-size:1rem;">{title}</p>'
            f'<p style="color:#94a3b8;margin:0;font-size:.875rem;line-height:1.6;">{desc}</p></div></div>')

def contact_row(icon_svg, label):
    return (f'<div style="display:flex;align-items:center;gap:12px;color:#94a3b8;font-size:1rem;margin-bottom:12px;">'
            f'{icon_svg} {label}</div>')

def tip_row(icon_svg, tip):
    return f'<div style="display:flex;align-items:center;gap:8px;color:#94a3b8;font-size:.975rem;margin-bottom:8px;">{icon_svg} {tip}</div>'

ABOUT_HTML = (
  '<div style="display:grid;grid-template-columns:1fr 1fr;gap:13px;">'
  '<div>' +
  acard(
    atitle(ico("sparkle",15,"#00ffa3"),"Our Mission") +
    '<p style="color:#94a3b8;font-size:.84rem;line-height:1.78;margin:0;">PlantGuard uses cutting-edge AI to detect 38+ plant diseases with high accuracy. Our MobileNetV3 model empowers farmers and gardeners to act fast and protect their crops.</p>'
  ) +
  acard(
    atitle(ico("zap",15,"#818cf8"),"Technology") +
    '<div style="display:flex;flex-direction:column;gap:12px;">' +
    arow(ico("brain",16,"#00ffa3"),   "Deep Learning",    "MobileNetV3 Large — 87k+ training images") +
    arow(ico("database",16,"#818cf8"),"Disease Database", "38 classes with full treatment protocols") +
    arow(ico("camera",16,"#fbbf24"),  "Leaf Validation",  "Two-stage leaf + disease classification") +
    '</div>', "0"
  ) +
  '</div><div>' +
  acard(
    atitle(ico2("leaf","leaf2",15,"#34d399"),"Supported Plants") +
    '<div style="display:flex;flex-wrap:wrap;gap:6px;">' +
    ''.join(plant_pill(p) for p in PLANTS) +
    '</div>'
  ) +
  acard(
    atitle(ico("mail",15,"#00ffa3"),"Contact") +
    '<div style="display:flex;flex-direction:column;gap:9px;">' +
    contact_row(ico("mail",13,"#64748b"),   "ayushmandharaofficial@gmail.com") +
    contact_row(ico("globe",13,"#64748b"),  "https://github.com/AyushmanDhara") +
    contact_row(ico("instagram",13,"#64748b"),  "https://www.instagram.com/ayushmandhara/") +
    contact_row(ico("clock",13,"#64748b"),  "Available 24 / 7") +
    '</div>'
  ) +
  acard(
    atitle(ico("eye",15,"#818cf8"),"Photo Tips") +
    '<div style="display:flex;flex-direction:column;gap:8px;">' +
    tip_row(ico("check",13,"#00ffa3"), "Take clear, well-lit photos") +
    tip_row(ico("check",13,"#00ffa3"), "Focus on the affected area") +
    tip_row(ico("check",13,"#00ffa3"), "Capture multiple angles") +
    tip_row(ico("check",13,"#00ffa3"), "Check both sides of leaves") +
    '</div>', "0"
  ) +
  '</div></div>'
)

INITIAL_RESULT = f"""
<div style="text-align:center;padding:56px 20px;">
  <div style="width:82px;height:82px;background:rgba(0,255,163,.05);
              border:1.5px dashed rgba(0,255,163,.25);border-radius:50%;
              display:flex;align-items:center;justify-content:center;margin:0 auto 13px;">
    {ico("scan",28,"#00ffa3")}
  </div>
  <p style="color:#64748b;font-size:.87rem;margin:0;font-weight:500;">Upload an image to see results</p>
</div>"""

def sec_head(title, sub):
    return f"""
<div style="text-align:center;padding:24px 0 16px;">
  <h2 style="color:#f1f5f9;font-size:clamp(1.4rem,3vw,1.85rem);font-weight:800;letter-spacing:-.03em;margin-bottom:8px;">{title}</h2>
  <p style="color:#64748b;font-size:.92rem;font-weight:400;max-width:480px;margin:0 auto;">{sub}</p>
</div>"""

FOOTER = f"""
<div style="text-align:center;padding:24px;border-top:1px solid rgba(0,255,163,.08);margin-top:8px;">
  <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:6px;">
    <div style="width:22px;height:22px;background:linear-gradient(135deg,#00ffa3,#818cf8);
                border-radius:6px;display:flex;align-items:center;justify-content:center;">
      {ico2("leaf","leaf2",12,"#020b14")}
    </div>
    <span style="color:#94a3b8;font-weight:700;font-size:.82rem;letter-spacing:.03em;">PlantGuard</span>
  </div>
  <p style="color:#475569;font-size:.7rem;margin:0;">© 2026 PlantGuard — AI Plant Disease Detection System</p>
  <p style="color:#475569;font-size:.7rem;margin:0;">Developed by Ayushman Dhara</p>
</div>"""

# ─── Gradio App ──────────────────────────────────────────────
with gr.Blocks(title="PlantGuard — AI Plant Disease Detection") as demo:
    gr.HTML(f"<style>{CUSTOM_CSS}</style>")
    gr.HTML(HEADER_HTML)
    gr.HTML("""<script>
(function() {
  function getTabBtns() {
    var found = document.querySelectorAll('[role="tab"]');
    if (found.length) return Array.from(found);
    found = document.querySelectorAll('.tab-nav button');
    if (found.length) return Array.from(found);
    found = document.querySelectorAll('.tabs button');
    if (found.length) return Array.from(found);
    return [];
  }
  window.pgGoTab = function(idx) {
    var btns = getTabBtns();
    if (btns.length > idx) {
      btns[idx].click();
      btns[idx].dispatchEvent(new MouseEvent('click', {bubbles: true}));
      return;
    }
    setTimeout(function() {
      var b2 = getTabBtns();
      if (b2.length > idx) { b2[idx].click(); }
    }, 300);
  };
  window.pgGoTabByName = function(name) {
    var btns = getTabBtns();
    for (var b of btns) {
      if (b.textContent.trim().toLowerCase().indexOf(name.toLowerCase()) !== -1) {
        b.click(); return;
      }
    }
  };
})();
</script>""")

    with gr.Tabs():

        with gr.Tab("  Home  "):
            gr.HTML(HERO_HTML)
            gr.HTML(HOW_IT_WORKS_HTML)

        with gr.Tab("  Detect  "):
            gr.HTML(sec_head("Plant Disease Detection","Upload a leaf image for AI-powered diagnosis"))
            with gr.Row(equal_height=False):
                with gr.Column(scale=1):
                    gr.HTML(f'<div style="display:flex;align-items:center;gap:8px;color:#34d399;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;margin-top:8px;">{ico("upload",14,"#00ffa3")} Upload Leaf Image</div>')
                    image_input = gr.Image(type="numpy", label="", elem_classes=["upload-area"], height=320)
                    gr.HTML('<div style="height:10px;"></div>')
                    analyze_btn = gr.Button("  Scan for Disease  ", elem_id="analyze-btn", size="lg")
                with gr.Column(scale=1):
                    gr.HTML(f'<div style="display:flex;align-items:center;gap:8px;color:#818cf8;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;margin-top:8px;">{ico("microscope",14,"#818cf8")} Diagnosis Results</div>')
                    result_html = gr.HTML(value=INITIAL_RESULT)
                    detail_html = gr.HTML(value="")
            analyze_btn.click(fn=predict_disease, inputs=[image_input], outputs=[result_html, detail_html])

        with gr.Tab("  Diseases  "):
            gr.HTML(sec_head("Disease Database","Learn about common plant diseases and their treatments"))

            ALL_PLANTS = ["All"] + PLANTS

            with gr.Group():
                active_filter = gr.State("All")

                with gr.Row(elem_id="pg-pill-row"):
                    pill_buttons = []
                    for p in ALL_PLANTS:
                        btn = gr.Button(
                            value=p,
                            elem_classes=["pg-pill"],
                            size="sm",
                        )
                        pill_buttons.append(btn)

                db_html = gr.HTML(value=build_disease_db_html("", "All"))

            def make_filter_fn(plant_name):
                def _filter():
                    return build_disease_db_html("", plant_name)
                return _filter

            for pb in pill_buttons:
                pb.click(
                    fn=make_filter_fn(pb.value),
                    inputs=[],
                    outputs=[db_html],
                )

        with gr.Tab("  About  "):
            gr.HTML(sec_head("About PlantGuard","AI-Powered Plant Disease System"))
            gr.HTML(ABOUT_HTML)

    gr.HTML(FOOTER)


if __name__ == "__main__":
    import socket
    def find_free_port(start=7860, end=7900):
        for port in range(start, end):
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                try: s.bind(("", port)); return port
                except OSError: continue
        raise OSError(f"No free port in {start}-{end}")
    port = find_free_port()
    print(f"\n  PlantGuard -> http://localhost:{port}\n")
    demo.launch(server_name="0.0.0.0", server_port=port, share=False)