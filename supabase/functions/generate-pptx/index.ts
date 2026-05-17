import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// PPTX file format constants
const CONTENT_TYPES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout2.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout3.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout4.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout5.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout6.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
  <Override PartName="/ppt/slideLists/slideList1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideList+xml"/>
  __SLIDE_CONTENT_TYPES__
</Types>`;

const RELS_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`;

const PRESENTATION_RELS_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>
  __SLIDE_RELS__
</Relationships>`;

const PRESENTATION_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" saveSubsetFonts="1">
  <p:sldMasterIdLst>
    <p:sldMasterId id="2147483648" r:id="rId1"/>
  </p:sldMasterIdLst>
  <p:sldIdLst>
    __SLIDE_IDS__
  </p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000" type="screen4x3"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`;

const SLIDE_MASTER_RELS_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout2.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout3.xml"/>
  <Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout4.xml"/>
  <Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout5.xml"/>
  <Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout6.xml"/>
</Relationships>`;

const SLIDE_MASTER_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:bg><p:bgPr><a:solidFill><a:schemeClr val="bg1"/></a:solidFill><a:effectLst/></p:bgPr></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst>
    <p:sldLayoutId id="2147483649" r:id="rId2"/>
    <p:sldLayoutId id="2147483650" r:id="rId3"/>
    <p:sldLayoutId id="2147483651" r:id="rId4"/>
    <p:sldLayoutId id="2147483652" r:id="rId5"/>
    <p:sldLayoutId id="2147483653" r:id="rId6"/>
    <p:sldLayoutId id="2147483654" r:id="rId7"/>
  </p:sldLayoutIdLst>
</p:sldMaster>`;

function makeSlideLayoutXml(placeholderCount: number): string {
  const phTypes = [
    { idx: 0, type: "title", sz: "half" },
    { idx: 1, type: "body", sz: "quarter" },
    { idx: 2, type: "ctrTitle", sz: "half" },
    { idx: 3, type: "subTitle", sz: "quarter" },
  ];
  let spXml = '';
  for (let i = 0; i < Math.min(placeholderCount, 4); i++) {
    const ph = phTypes[i];
    spXml += `<p:sp><p:nvSpPr><p:cNvPr id="${i+2}" name=""/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="${ph.type}" idx="${ph.idx}"/></p:nvPr></p:nvSpPr><p:spPr/></p:sp>`;
  }
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1">
  <p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>${spXml}</p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
</p:sldLayout>`;
}

const THEME_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="WattGo">
  <a:themeElements>
    <a:clrScheme name="WattGo">
      <a:dk1><a:srgbClr val="0f172a"/></a:dk1>
      <a:lt1><a:srgbClr val="f8fafc"/></a:lt1>
      <a:dk2><a:srgbClr val="1e293b"/></a:dk2>
      <a:lt2><a:srgbClr val="e2e8f0"/></a:lt2>
      <a:accent1><a:srgbClr val="10b981"/></a:accent1>
      <a:accent2><a:srgbClr val="f97316"/></a:accent2>
      <a:accent3><a:srgbClr val="3b82f6"/></a:accent3>
      <a:accent4><a:srgbClr val="ef4444"/></a:accent4>
      <a:accent5><a:srgbClr val="059669"/></a:accent5>
      <a:accent6><a:srgbClr val="0ea5e9"/></a:accent6>
      <a:hlink><a:srgbClr val="10b981"/></a:hlink>
      <a:folHlink><a:srgbClr val="059669"/></a:folHlink>
    </a:clrScheme>
    <a:fontScheme name="WattGo">
      <a:majorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont>
      <a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont>
    </a:fontScheme>
    <a:fmtScheme name="WattGo">
      <a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst>
      <a:lnStyleLst><a:ln w="0"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="0"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="0"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst>
      <a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst>
      <a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst>
    </a:fmtScheme>
  </a:themeElements>
  <a:objectDefaults/>
  <a:extraClrSchemeLst/>
</a:theme>`;

// EMU (English Metric Units) helpers
const EMU = 914400; // 1 inch in EMU
const SLIDE_W = 12192000;
const SLIDE_H = 6858000;

function emu(inches: number): number {
  return Math.round(inches * EMU);
}

function makeRect(x: number, y: number, w: number, h: number, fill: string): string {
  return `<p:sp><p:nvSpPr><p:cNvPr id="0" name="rect"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(w)}" cy="${emu(h)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${fill}"/></a:solidFill><a:ln><a:noFill/></a:ln></p:spPr></p:sp>`;
}

function makeTextBox(x: number, y: number, w: number, h: number, text: string, fontSize: number, color: string, bold: boolean = false, align: string = "l"): string {
  const boldAttr = bold ? ' b="1"' : '';
  const algnAttr = align === "ctr" ? ' algn="ctr"' : align === "r" ? ' algn="r"' : '';
  const runs = text.split('\n').map((line, i) => {
    const lineBreak = i > 0 ? '<a:br/>' : '';
    return `${lineBreak}<a:r><a:rPr lang="fr-FR" sz="${fontSize * 100}"${boldAttr} dirty="0"><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="Calibri"/></a:rPr><a:t>${escapeXml(line)}</a:t></a:r>`;
  }).join('');

  return `<p:sp><p:nvSpPr><p:cNvPr id="0" name="text"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(w)}" cy="${emu(h)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></p:spPr><p:txBody><a:bodyPr wrap="square" anchor="t"/><a:lstStyle/><a:p${algnAttr}>${runs}</a:p></p:txBody></p:sp>`;
}

function makeBulletList(x: number, y: number, w: number, h: number, items: string[], fontSize: number, color: string): string {
  const paragraphs = items.map(item => {
    return `<a:p marL="${emu(0.4)}" indent="${emu(-0.25)}"><a:r><a:rPr lang="fr-FR" sz="${fontSize * 100}" dirty="0"><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="Calibri"/></a:rPr><a:t>${escapeXml(item)}</a:t></a:r></a:p>`;
  }).join('');

  return `<p:sp><p:nvSpPr><p:cNvPr id="0" name="list"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(w)}" cy="${emu(h)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></p:spPr><p:txBody><a:bodyPr wrap="square" anchor="t"/><a:lstStyle/>${paragraphs}</p:txBody></p:sp>`;
}

function makeAccentBar(x: number, y: number, w: number, h: number, color: string): string {
  return `<p:sp><p:nvSpPr><p:cNvPr id="0" name="bar"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(w)}" cy="${emu(h)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:ln><a:noFill/></a:ln></p:spPr></p:sp>`;
}

function makeCircle(x: number, y: number, size: number, fill: string): string {
  return `<p:sp><p:nvSpPr><p:cNvPr id="0" name="circle"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(size)}" cy="${emu(size)}"/></a:xfrm><a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${fill}"/></a:solidFill><a:ln><a:noFill/></a:ln></p:spPr></p:sp>`;
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

interface SlideData {
  shapes: string[];
}

function makeSlideXml(slide: SlideData, slideNum: number): string {
  const shapes = slide.shapes.join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="0f172a"/></a:solidFill><a:effectLst/></p:bgPr></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>${shapes}</p:spTree></p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>`;
}

// Slide definitions
function buildSlides(): SlideData[] {
  const slides: SlideData[] = [];

  // Slide 1: Title
  slides.push({
    shapes: [
      makeCircle(4.1, 0.8, 1.2, "10b981"),
      makeTextBox(3.5, 2.2, 6, 1.2, "WattGo", 54, "ffffff", true, "ctr"),
      makeAccentBar(4.8, 3.5, 2.4, 0.06, "10b981"),
      makeTextBox(2.5, 3.8, 8, 0.8, "Scooters Electriques Partages pour Etudiants", 20, "94a3b8", false, "ctr"),
      makeTextBox(3.5, 4.8, 5, 0.5, "Oujda, Maroc", 16, "64748b", false, "ctr"),
    ]
  });

  // Slide 2: Problem
  slides.push({
    shapes: [
      makeAccentBar(0, 0, 0.15, 7.5, "f97316"),
      makeTextBox(0.8, 0.4, 8, 0.8, "Le Probleme", 36, "ffffff", true),
      makeTextBox(0.8, 1.2, 8, 0.5, "La mobilite etudiante a Oujda", 18, "94a3b8"),
      makeBulletList(0.8, 2.2, 8.5, 4, [
        "Transport public limite dans la ville d'Oujda",
        "Longues distances entre les campus universitaires et le centre ville",
        "Cout eleve des taxis pour le budget etudiant",
        "Absence de solutions de mobilite ecologique",
        "Aucun service de mobilite partagee existant",
      ], 16, "cbd5e1"),
    ]
  });

  // Slide 3: Solution
  slides.push({
    shapes: [
      makeAccentBar(0, 0, 0.15, 7.5, "10b981"),
      makeTextBox(0.8, 0.4, 8, 0.8, "Notre Solution", 36, "ffffff", true),
      makeTextBox(0.8, 1.2, 8, 0.5, "WattGo - Scooters electriques en libre-service", 18, "94a3b8"),
      makeBulletList(0.8, 2.2, 8.5, 4, [
        "Scooters 100% electriques - zero emission",
        "8 stations strategiquement placees a Oujda",
        "Application mobile intuitive et reactive",
        "Caution securisee de 100-200 DH",
        "Paiement flexible: carte, virement, cash",
        "Tarif etudiant abordable: 2 DH/min",
      ], 16, "cbd5e1"),
    ]
  });

  // Slide 4: How it works
  slides.push({
    shapes: [
      makeAccentBar(0, 0, 0.15, 7.5, "3b82f6"),
      makeTextBox(0.8, 0.4, 8, 0.8, "Comment ca marche", 36, "ffffff", true),
      makeTextBox(0.8, 1.2, 8, 0.5, "4 etapes simples", 18, "94a3b8"),
      // Step 1
      makeCircle(0.8, 2.2, 0.6, "10b981"),
      makeTextBox(1.0, 2.3, 0.4, 0.4, "1", 18, "ffffff", true, "ctr"),
      makeTextBox(1.7, 2.2, 3.5, 0.4, "Inscrivez-vous", 18, "ffffff", true),
      makeTextBox(1.7, 2.7, 3.5, 0.4, "Carte etudiant + telephone + caution", 13, "94a3b8"),
      // Step 2
      makeCircle(0.8, 3.4, 0.6, "3b82f6"),
      makeTextBox(1.0, 3.5, 0.4, 0.4, "2", 18, "ffffff", true, "ctr"),
      makeTextBox(1.7, 3.4, 3.5, 0.4, "Trouvez un scooter", 18, "ffffff", true),
      makeTextBox(1.7, 3.9, 3.5, 0.4, "Carte interactive en temps reel", 13, "94a3b8"),
      // Step 3
      makeCircle(0.8, 4.6, 0.6, "f97316"),
      makeTextBox(1.0, 4.7, 0.4, 0.4, "3", 18, "ffffff", true, "ctr"),
      makeTextBox(1.7, 4.6, 3.5, 0.4, "Reservez & deverrouillez", 18, "ffffff", true),
      makeTextBox(1.7, 5.1, 3.5, 0.4, "Code PIN ou QR code", 13, "94a3b8"),
      // Step 4
      makeCircle(0.8, 5.8, 0.6, "ef4444"),
      makeTextBox(1.0, 5.9, 0.4, 0.4, "4", 18, "ffffff", true, "ctr"),
      makeTextBox(1.7, 5.8, 3.5, 0.4, "Roulez & payez", 18, "ffffff", true),
      makeTextBox(1.7, 6.3, 3.5, 0.4, "2 DH/min, paiement flexible", 13, "94a3b8"),
      // Right side: screenshot placeholder
      makeRect(6.2, 2.0, 4.0, 5.0, "1e293b"),
      makeTextBox(6.4, 4.0, 3.6, 1.0, "[Screenshot - Carte Interactive]", 14, "64748b", false, "ctr"),
    ]
  });

  // Slide 5: App Screens
  slides.push({
    shapes: [
      makeAccentBar(0, 0, 0.15, 7.5, "10b981"),
      makeTextBox(0.8, 0.4, 8, 0.8, "Application Mobile", 36, "ffffff", true),
      makeTextBox(0.8, 1.2, 8, 0.5, "8 ecrans pour une experience complete", 18, "94a3b8"),
      // Screen grid
      ...[
        { name: "Splash Screen", x: 0.8, y: 2.0 },
        { name: "Connexion", x: 3.5, y: 2.0 },
        { name: "Inscription", x: 6.2, y: 2.0 },
        { name: "Carte Interactive", x: 0.8, y: 4.2 },
        { name: "Reservation", x: 3.5, y: 4.2 },
        { name: "Course en cours", x: 6.2, y: 4.2 },
        { name: "Paiement", x: 0.8, y: 6.4 },
        { name: "Profil Etudiant", x: 3.5, y: 6.4 },
      ].map(s => [
        makeRect(s.x, s.y, 2.2, 1.8, "1e293b"),
        makeTextBox(s.x + 0.1, s.y + 0.3, 2.0, 0.5, s.name, 12, "ffffff", true, "ctr"),
        makeTextBox(s.x + 0.1, s.y + 0.9, 2.0, 0.5, "[Screenshot]", 10, "64748b", false, "ctr"),
      ].join('')).flat ? [] : [],
    ]
  });

  // Fix: rebuild slide 5 properly
  const appScreenShapes: string[] = [
    makeAccentBar(0, 0, 0.15, 7.5, "10b981"),
    makeTextBox(0.8, 0.4, 8, 0.8, "Application Mobile", 36, "ffffff", true),
    makeTextBox(0.8, 1.2, 8, 0.5, "8 ecrans pour une experience complete", 18, "94a3b8"),
  ];
  const screens = [
    { name: "Splash Screen", x: 0.8, y: 2.0 },
    { name: "Connexion", x: 3.5, y: 2.0 },
    { name: "Inscription", x: 6.2, y: 2.0 },
    { name: "Carte Interactive", x: 0.8, y: 4.2 },
    { name: "Reservation", x: 3.5, y: 4.2 },
    { name: "Course en cours", x: 6.2, y: 4.2 },
    { name: "Paiement", x: 0.8, y: 6.4 },
    { name: "Profil Etudiant", x: 3.5, y: 6.4 },
  ];
  for (const s of screens) {
    appScreenShapes.push(makeRect(s.x, s.y, 2.2, 1.8, "1e293b"));
    appScreenShapes.push(makeTextBox(s.x + 0.1, s.y + 0.3, 2.0, 0.5, s.name, 12, "ffffff", true, "ctr"));
    appScreenShapes.push(makeTextBox(s.x + 0.1, s.y + 0.9, 2.0, 0.5, "[Screenshot]", 10, "64748b", false, "ctr"));
  }
  slides[4] = { shapes: appScreenShapes };

  // Slide 6: Interactive Map
  slides.push({
    shapes: [
      makeAccentBar(0, 0, 0.15, 7.5, "10b981"),
      makeTextBox(0.8, 0.4, 8, 0.8, "Carte Interactive", 36, "ffffff", true),
      makeTextBox(0.8, 1.2, 8, 0.5, "Trouvez un scooter en temps reel", 18, "94a3b8"),
      makeBulletList(0.8, 2.0, 4.5, 3, [
        "8 stations a travers Oujda",
        "20 scooters en temps reel",
        "Niveau de batterie visible",
        "Geolocalisation GPS integree",
        "Bottom sheet avec details",
      ], 15, "cbd5e1"),
      makeTextBox(0.8, 5.2, 4.5, 1.5, "Stations:\nUniversite Mohammed I  |  Place 9 Avril\nGare Routiere  |  Hay Al Amal\nFaculte de Droit  |  Centre Ville\nSidi Yahia  |  ENCG Oujda", 11, "64748b"),
      makeRect(6.0, 1.8, 4.0, 5.2, "1e293b"),
      makeTextBox(6.2, 3.8, 3.6, 1.0, "[Screenshot - Carte Oujda]", 14, "64748b", false, "ctr"),
    ]
  });

  // Slide 7: Booking & Unlock
  slides.push({
    shapes: [
      makeAccentBar(0, 0, 0.15, 7.5, "3b82f6"),
      makeTextBox(0.8, 0.4, 8, 0.8, "Reservation & Deverrouillage", 36, "ffffff", true),
      makeTextBox(0.8, 1.2, 8, 0.5, "Simple et rapide en 3 etapes", 18, "94a3b8"),
      // 3 columns
      makeRect(0.8, 2.2, 3.0, 4.5, "1e293b"),
      makeCircle(1.8, 2.5, 0.5, "10b981"),
      makeTextBox(1.0, 3.3, 2.6, 0.5, "1. Confirmer", 16, "ffffff", true, "ctr"),
      makeTextBox(1.0, 3.9, 2.6, 1.5, "Voir le scooter\nBatterie disponible\nConfirmer le tarif\n2 DH / minute", 12, "94a3b8", false, "ctr"),

      makeRect(4.2, 2.2, 3.0, 4.5, "1e293b"),
      makeCircle(5.2, 2.5, 0.5, "f97316"),
      makeTextBox(4.4, 3.3, 2.6, 0.5, "2. Timer 5 min", 16, "ffffff", true, "ctr"),
      makeTextBox(4.4, 3.9, 2.6, 1.5, "Allez a la station\nCompte a rebours\nCode PIN affiche\nAnnulation auto", 12, "94a3b8", false, "ctr"),

      makeRect(7.6, 2.2, 3.0, 4.5, "1e293b"),
      makeCircle(8.6, 2.5, 0.5, "3b82f6"),
      makeTextBox(7.8, 3.3, 2.6, 0.5, "3. Deverrouiller", 16, "ffffff", true, "ctr"),
      makeTextBox(7.8, 3.9, 2.6, 1.5, "Code PIN ou QR\nScooter deverrouille\nCourse demarree\nGPS actif", 12, "94a3b8", false, "ctr"),
    ]
  });

  // Slide 8: Active Ride
  slides.push({
    shapes: [
      makeAccentBar(0, 0, 0.15, 7.5, "10b981"),
      makeTextBox(0.8, 0.4, 8, 0.8, "Course en Cours", 36, "ffffff", true),
      makeTextBox(0.8, 1.2, 8, 0.5, "Suivi en temps reel", 18, "94a3b8"),
      makeBulletList(0.8, 2.2, 4.5, 3, [
        "Chronometre actif en temps reel",
        "Prix calcule automatiquement",
        "GPS tracking visible",
        "Suivi du niveau de batterie",
        "Bouton Terminer le trajet",
      ], 16, "cbd5e1"),
      makeRect(6.0, 1.8, 4.0, 5.2, "1e293b"),
      makeTextBox(6.2, 3.8, 3.6, 1.0, "[Screenshot - Ride en cours]", 14, "64748b", false, "ctr"),
    ]
  });

  // Slide 9: Payment
  slides.push({
    shapes: [
      makeAccentBar(0, 0, 0.15, 7.5, "f97316"),
      makeTextBox(0.8, 0.4, 8, 0.8, "Paiement & Tarification", 36, "ffffff", true),
      makeTextBox(0.8, 1.2, 8, 0.5, "Transparent et abordable", 18, "94a3b8"),
      // Pricing table
      makeRect(0.8, 2.2, 4.5, 1.2, "1e293b"),
      makeTextBox(1.0, 2.3, 4.0, 0.4, "Tarif standard", 14, "94a3b8"),
      makeTextBox(1.0, 2.8, 4.0, 0.5, "2 DH / minute", 24, "10b981", true),
      makeRect(0.8, 3.6, 4.5, 1.2, "1e293b"),
      makeTextBox(1.0, 3.7, 4.0, 0.4, "Abonnement mensuel", 14, "94a3b8"),
      makeTextBox(1.0, 4.2, 4.0, 0.5, "1 DH / minute", 24, "10b981", true),
      makeRect(0.8, 5.0, 4.5, 1.2, "1e293b"),
      makeTextBox(1.0, 5.1, 4.0, 0.4, "Abonnement semestriel", 14, "94a3b8"),
      makeTextBox(1.0, 5.6, 4.0, 0.5, "0.80 DH / minute", 24, "10b981", true),
      // Payment methods
      makeTextBox(6.0, 2.2, 4.0, 0.5, "Modes de paiement", 18, "ffffff", true),
      makeBulletList(6.0, 2.9, 4.0, 3, [
        "Carte bancaire (Visa, Mastercard)",
        "Virement bancaire",
        "Cash en agence",
      ], 15, "cbd5e1"),
    ]
  });

  // Slide 10: Subscriptions
  slides.push({
    shapes: [
      makeAccentBar(0, 0, 0.15, 7.5, "10b981"),
      makeTextBox(0.8, 0.4, 8, 0.8, "Abonnements", 36, "ffffff", true),
      makeTextBox(0.8, 1.2, 8, 0.5, "Des prix pour les etudiants", 18, "94a3b8"),
      // Monthly
      makeRect(0.8, 2.2, 4.5, 4.8, "1e293b"),
      makeTextBox(1.0, 2.4, 4.0, 0.5, "Mensuel", 24, "ffffff", true, "ctr"),
      makeTextBox(1.0, 3.0, 4.0, 0.8, "120 DH", 36, "10b981", true, "ctr"),
      makeBulletList(1.2, 3.8, 3.8, 3, [
        "Courses illimitees",
        "1 DH/min",
        "Priorite reservation",
        "Support 24/7",
      ], 13, "cbd5e1"),
      // Semester
      makeRect(5.8, 2.2, 4.5, 4.8, "0d3d2e"),
      makeAccentBar(5.8, 2.2, 4.5, 0.08, "10b981"),
      makeTextBox(6.0, 2.4, 4.0, 0.5, "Semestriel", 24, "ffffff", true, "ctr"),
      makeTextBox(6.0, 3.0, 4.0, 0.8, "600 DH", 36, "10b981", true, "ctr"),
      makeTextBox(6.0, 3.7, 4.0, 0.4, "Economie de 120 DH", 12, "f97316", true, "ctr"),
      makeBulletList(6.2, 4.1, 3.8, 3, [
        "0.80 DH/min",
        "Courses illimitees",
        "Priorite reservation",
        "Support 24/7",
        "Badge exclusif",
      ], 13, "cbd5e1"),
    ]
  });

  // Slide 11: Student Profile
  slides.push({
    shapes: [
      makeAccentBar(0, 0, 0.15, 7.5, "3b82f6"),
      makeTextBox(0.8, 0.4, 8, 0.8, "Profil Etudiant", 36, "ffffff", true),
      makeTextBox(0.8, 1.2, 8, 0.5, "Badges, historique et caution", 18, "94a3b8"),
      makeBulletList(0.8, 2.2, 4.5, 3, [
        "Informations personnelles",
        "Numero de carte etudiant",
        "Statut de caution (100-200 DH)",
        "Historique des courses",
        "Historique des paiements",
      ], 16, "cbd5e1"),
      makeTextBox(0.8, 5.4, 4.5, 0.5, "Badges de fidelite:", 16, "ffffff", true),
      makeBulletList(0.8, 5.9, 4.5, 1.5, [
        "Premier trajet - 1ere course terminee",
        "5 courses - 5 courses completees",
        "Eco Rider - 10 courses ecologiques",
        "Fidelite - Abonnement actif",
      ], 12, "94a3b8"),
      makeRect(6.0, 1.8, 4.0, 5.2, "1e293b"),
      makeTextBox(6.2, 3.8, 3.6, 1.0, "[Screenshot - Profil]", 14, "64748b", false, "ctr"),
    ]
  });

  // Slide 12: Admin Dashboard
  slides.push({
    shapes: [
      makeAccentBar(0, 0, 0.15, 7.5, "64748b"),
      makeTextBox(0.8, 0.4, 8, 0.8, "Dashboard Admin", 36, "ffffff", true),
      makeTextBox(0.8, 1.2, 8, 0.5, "Gestion en temps reel", 18, "94a3b8"),
      makeBulletList(0.8, 2.2, 4.5, 4, [
        "Carte de tous les scooters en temps reel",
        "Statistiques: scooters, utilisateurs, alertes",
        "Alertes GPS si scooter sorti de zone",
        "Gestion des utilisateurs et paiements",
        "Indicateurs de statut en direct",
        "Gestion de la maintenance",
      ], 16, "cbd5e1"),
      // Status legend
      makeTextBox(0.8, 6.0, 4.5, 0.5, "Statuts scooter:", 14, "ffffff", true),
      makeCircle(0.8, 6.5, 0.25, "10b981"),
      makeTextBox(1.2, 6.5, 1.0, 0.3, "Disponible", 11, "cbd5e1"),
      makeCircle(2.5, 6.5, 0.25, "f97316"),
      makeTextBox(2.9, 6.5, 1.0, 0.3, "Reserve", 11, "cbd5e1"),
      makeCircle(4.2, 6.5, 0.25, "3b82f6"),
      makeTextBox(4.6, 6.5, 1.0, 0.3, "En cours", 11, "cbd5e1"),
      makeCircle(6.0, 6.5, 0.25, "ef4444"),
      makeTextBox(6.4, 6.5, 1.2, 0.3, "Maintenance", 11, "cbd5e1"),
    ]
  });

  // Slide 13: Tech Stack
  slides.push({
    shapes: [
      makeAccentBar(0, 0, 0.15, 7.5, "10b981"),
      makeTextBox(0.8, 0.4, 8, 0.8, "Stack Technique", 36, "ffffff", true),
      makeTextBox(0.8, 1.2, 8, 0.5, "Technologies modernes", 18, "94a3b8"),
      // Frontend
      makeRect(0.8, 2.2, 4.5, 2.2, "1e293b"),
      makeTextBox(1.0, 2.3, 4.0, 0.4, "Frontend", 16, "10b981", true),
      makeBulletList(1.0, 2.8, 4.0, 1.5, [
        "React 19 + TypeScript",
        "Tailwind CSS v4",
        "Vite 8",
        "React Router v7",
      ], 13, "cbd5e1"),
      // Map
      makeRect(5.8, 2.2, 4.5, 2.2, "1e293b"),
      makeTextBox(6.0, 2.3, 4.0, 0.4, "Carte", 16, "3b82f6", true),
      makeBulletList(6.0, 2.8, 4.0, 1.5, [
        "Leaflet + React-Leaflet",
        "CARTO Dark Tiles",
        "Custom markers",
      ], 13, "cbd5e1"),
      // Backend
      makeRect(0.8, 4.8, 4.5, 2.2, "1e293b"),
      makeTextBox(1.0, 4.9, 4.0, 0.4, "Backend", 16, "f97316", true),
      makeBulletList(1.0, 5.4, 4.0, 1.5, [
        "Supabase Auth",
        "PostgreSQL + RLS",
        "Edge Functions",
        "Real-time subscriptions",
      ], 13, "cbd5e1"),
      // Security
      makeRect(5.8, 4.8, 4.5, 2.2, "1e293b"),
      makeTextBox(6.0, 4.9, 4.0, 0.4, "Securite", 16, "ef4444", true),
      makeBulletList(6.0, 5.4, 4.0, 1.5, [
        "Row Level Security",
        "JWT Authentication",
        "Auto profile triggers",
        "Indexed queries",
      ], 13, "cbd5e1"),
    ]
  });

  // Slide 14: Closing
  slides.push({
    shapes: [
      makeCircle(4.1, 1.0, 1.2, "10b981"),
      makeTextBox(3.5, 2.5, 6, 1.0, "WattGo", 54, "ffffff", true, "ctr"),
      makeAccentBar(4.8, 3.6, 2.4, 0.06, "10b981"),
      makeTextBox(2.0, 3.9, 8, 0.8, "La mobilite etudiante reimaginee a Oujda", 22, "94a3b8", false, "ctr"),
      makeTextBox(3.0, 5.2, 6, 0.5, "Electrique  |  Oujda  |  Etudiants  |  Securise", 14, "64748b", false, "ctr"),
      makeTextBox(3.5, 6.2, 5, 0.5, "Merci pour votre attention", 18, "cbd5e1", false, "ctr"),
    ]
  });

  return slides;
}

// Minimal ZIP file builder (no external deps)
function crc32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

interface ZipEntry {
  name: string;
  data: Uint8Array;
}

function buildZip(entries: ZipEntry[]): Uint8Array {
  const encoder = new TextEncoder();
  const localHeaders: Uint8Array[] = [];
  const centralHeaders: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name);
    const crc = crc32(entry.data);
    const size = entry.data.length;

    // Local file header
    const local = new Uint8Array(30 + nameBytes.length + size);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true); // signature
    lv.setUint16(4, 20, true); // version needed
    lv.setUint16(6, 0, true); // flags
    lv.setUint16(8, 0, true); // compression (store)
    lv.setUint16(10, 0, true); // mod time
    lv.setUint16(12, 0, true); // mod date
    lv.setUint32(14, crc, true); // crc32
    lv.setUint32(18, size, true); // compressed size
    lv.setUint32(22, size, true); // uncompressed size
    lv.setUint16(26, nameBytes.length, true); // name length
    lv.setUint16(28, 0, true); // extra length
    local.set(nameBytes, 30);
    local.set(entry.data, 30 + nameBytes.length);
    localHeaders.push(local);

    // Central directory header
    const central = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true); // signature
    cv.setUint16(4, 20, true); // version made by
    cv.setUint16(6, 20, true); // version needed
    cv.setUint16(8, 0, true); // flags
    cv.setUint16(10, 0, true); // compression
    cv.setUint16(12, 0, true); // mod time
    cv.setUint16(14, 0, true); // mod date
    cv.setUint32(16, crc, true); // crc32
    cv.setUint32(20, size, true); // compressed size
    cv.setUint32(24, size, true); // uncompressed size
    cv.setUint16(28, nameBytes.length, true); // name length
    cv.setUint16(30, 0, true); // extra length
    cv.setUint16(32, 0, true); // comment length
    cv.setUint16(34, 0, true); // disk number
    cv.setUint16(36, 0, true); // internal attr
    cv.setUint32(38, 0, true); // external attr
    cv.setUint32(42, offset, true); // local header offset
    central.set(nameBytes, 46);
    centralHeaders.push(central);

    offset += local.length;
  }

  const centralOffset = offset;
  let centralSize = 0;
  for (const c of centralHeaders) centralSize += c.length;

  // End of central directory
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, centralOffset, true);
  ev.setUint16(20, 0, true);

  const totalSize = offset + centralSize + 22;
  const result = new Uint8Array(totalSize);
  let pos = 0;
  for (const l of localHeaders) { result.set(l, pos); pos += l.length; }
  for (const c of centralHeaders) { result.set(c, pos); pos += c.length; }
  result.set(end, pos);

  return result;
}

function buildPptx(): Uint8Array {
  const encoder = new TextEncoder();
  const slides = buildSlides();
  const entries: ZipEntry[] = [];

  // [Content_Types].xml
  let slideContentTypes = '';
  let slideIds = '';
  let slideRels = '';

  for (let i = 0; i < slides.length; i++) {
    const num = i + 1;
    slideContentTypes += `<Override PartName="/ppt/slides/slide${num}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`;
    slideIds += `<p:sldId id="${256 + i}" r:id="rId${num + 2}"/>`;
    slideRels += `<Relationship Id="rId${num + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${num}.xml"/>`;
  }

  entries.push({ name: '[Content_Types].xml', data: encoder.encode(CONTENT_TYPES_XML.replace('__SLIDE_CONTENT_TYPES__', slideContentTypes)) });
  entries.push({ name: '_rels/.rels', data: encoder.encode(RELS_XML) });
  entries.push({ name: 'ppt/presentation.xml', data: encoder.encode(PRESENTATION_XML.replace('__SLIDE_IDS__', slideIds)) });
  entries.push({ name: 'ppt/_rels/presentation.xml.rels', data: encoder.encode(PRESENTATION_RELS_XML.replace('__SLIDE_RELS__', slideRels)) });
  entries.push({ name: 'ppt/slideMasters/slideMaster1.xml', data: encoder.encode(SLIDE_MASTER_XML) });
  entries.push({ name: 'ppt/slideMasters/_rels/slideMaster1.xml.rels', data: encoder.encode(SLIDE_MASTER_RELS_XML) });
  entries.push({ name: 'ppt/theme/theme1.xml', data: encoder.encode(THEME_XML) });

  for (let i = 1; i <= 6; i++) {
    entries.push({ name: `ppt/slideLayouts/slideLayout${i}.xml`, data: encoder.encode(makeSlideLayoutXml(i)) });
  }

  for (let i = 0; i < slides.length; i++) {
    const num = i + 1;
    entries.push({ name: `ppt/slides/slide${num}.xml`, data: encoder.encode(makeSlideXml(slides[i], num)) });
    entries.push({
      name: `ppt/slides/_rels/slide${num}.xml.rels`,
      data: encoder.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>`)
    });
  }

  return buildZip(entries);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const pptxData = buildPptx();

    return new Response(pptxData, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": 'attachment; filename="WattGo-Presentation.pptx"',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
