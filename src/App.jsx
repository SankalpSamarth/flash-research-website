import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BracketsCurly,
  Check,
  Copy,
  Database,
  FilePdf,
  FileText,
  GithubLogo,
  List,
  PresentationChart,
  X,
} from "@phosphor-icons/react";

const navItems = [
  ["Home", "/"],
  ["Method", "/method"],
  ["Results", "/results"],
  ["Visuals", "/visuals"],
  ["Resources", "/resources"],
];

const cx = (...classes) => classes.filter(Boolean).join(" ");

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const sync = () => {
      setPath(window.location.pathname);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const navigate = (next) => {
    if (next === path) window.scrollTo({ top: 0, behavior: "smooth" });
    else {
      window.history.pushState({}, "", next);
      setPath(next);
      window.scrollTo({ top: 0 });
    }
  };
  return [path, navigate];
}

function Header({ path, navigate }) {
  const [open, setOpen] = useState(false);
  const go = (event, href) => {
    event.preventDefault();
    setOpen(false);
    navigate(href);
  };
  return (
    <header className="site-header">
      <div className="nav-shell">
        <a className="wordmark" href="/" onClick={(e) => go(e, "/")} aria-label="FLASH home">
          FLASH
        </a>
        <nav className={cx("nav-links", open && "is-open")} aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className={path === href ? "active" : ""} onClick={(e) => go(e, href)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a className="button button-dark button-compact" href="/FLASH-research-paper.pdf" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            Paper <ArrowUpRight size={15} weight="bold" />
          </a>
          <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>
            {open ? <X size={21} /> : <List size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Button({ children, href = "#", variant = "dark", icon = true, onClick, target }) {
  return (
    <a className={`button button-${variant}`} href={href} onClick={onClick} target={target} rel={target ? "noreferrer" : undefined}>
      {children}{icon && <ArrowUpRight size={16} weight="bold" />}
    </a>
  );
}

function SectionHeading({ index, eyebrow, title, description, action }) {
  return (
    <div className="section-heading">
      <div className="section-index">{index}</div>
      <div className="section-heading-copy">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="section-action">{action}</div>}
    </div>
  );
}

function FigureArt({ variant = "pipeline" }) {
  if (variant === "heatmap") {
    return <div className="heatmap-art" aria-hidden="true">{Array.from({ length: 48 }, (_, i) => <i key={i} style={{ "--tone": (i * 7) % 10 }} />)}</div>;
  }
  if (variant === "image") {
    return (
      <div className="image-art" aria-hidden="true">
        <span className="image-plane plane-a" /><span className="image-plane plane-b" />
        <span className="image-plane plane-c" /><span className="focus-box" />
      </div>
    );
  }
  if (variant === "chart") {
    return (
      <div className="chart-art" aria-hidden="true">
        {[38, 52, 47, 72, 61, 86].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}
      </div>
    );
  }
  if (variant === "matrix") {
    return <div className="matrix-art" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i} className={i % 5 === 0 || i % 7 === 0 ? "filled" : ""} />)}</div>;
  }
  return (
    <div className="pipeline-art" aria-hidden="true">
      <div className="stack-shape"><i /><i /><i /></div>
      <span className="connector"><b /></span>
      <div className="node-shape"><i /><i /><i /><i /></div>
      <span className="connector"><b /></span>
      <div className="grid-shape">{Array.from({ length: 16 }, (_, i) => <i key={i} className={i % 3 === 0 ? "filled" : ""} />)}</div>
      <span className="connector"><b /></span>
      <div className="output-shape"><i /><i /><i /></div>
    </div>
  );
}

function FigurePlaceholder({ number = "01", title = "System overview", variant = "pipeline", ratio = "wide", onOpen, src, alt, caption }) {
  return (
    <button className={cx("figure", `figure-${ratio}`)} onClick={onOpen} aria-label={`Open Figure ${number}: ${title}`}>
      <div className="figure-topline">
        <span>FIG. {number}</span><span>{title}</span><span>WACV 2027</span>
      </div>
      <div className={cx("figure-canvas", src && "has-image")}>
        {src ? <img className="paper-figure-image" src={src} alt={alt || title} /> : <FigureArt variant={variant} />}
        {!src && <div className="figure-label"><strong>FIGURE PLACEHOLDER</strong><span>REPLACE WITH RESEARCH FIGURE</span></div>}
      </div>
      <div className="figure-bottomline"><span className="figure-caption-short">{caption || "RESEARCH VISUAL"}</span><span>SELECT TO ENLARGE ↗</span></div>
    </button>
  );
}

function FigureModal({ figure, onClose }) {
  useEffect(() => {
    if (!figure) return;
    const key = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [figure, onClose]);
  if (!figure) return null;
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`Figure ${figure.number}`} onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"><span>FIG. {figure.number} · {figure.title}</span><button onClick={onClose} aria-label="Close figure"><X size={20} /></button></div>
        <div className={cx("modal-canvas", figure.src && "has-image")}>{figure.src ? <img src={figure.src} alt={figure.title} /> : <FigureArt variant={figure.variant} />}</div>
        <p>{figure.caption || "RESEARCH FIGURE · WACV 2027 SUBMISSION #2035"}</p>
      </div>
    </div>
  );
}

function Metric({ value, label, note }) {
  return <div className="metric"><strong>{value}</strong><span>{label}</span>{note && <small>{note}</small>}</div>;
}

function PageIntro({ label, title, description }) {
  return (
    <section className="page-intro shell">
      <span className="eyebrow dot-label">{label}</span>
      <div className="page-title-grid"><h1>{title}</h1><p>{description}</p></div>
    </section>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-main shell">
        <div><span className="wordmark footer-wordmark">FLASH</span><p>Generate once, synthesize many.<br />Synthetic anomaly generation for industrial anomaly detection.</p></div>
        <div className="footer-links">
          <div><span>EXPLORE</span>{navItems.slice(1).map(([label, href]) => <a href={href} key={href} onClick={(e) => { e.preventDefault(); navigate(href); }}>{label}</a>)}</div>
          <div><span>MATERIALS</span><a href="/FLASH-research-paper.pdf" target="_blank" rel="noreferrer">Paper</a><a href="https://anonymous.4open.science/r/flash-1178" target="_blank" rel="noreferrer">Code</a><a href="/FLASH-research-paper.pdf#page=11" target="_blank" rel="noreferrer">Supplementary</a></div>
        </div>
      </div>
      <div className="footer-meta shell"><span>WACV 2027 · APPLICATIONS TRACK</span><span>CONFIDENTIAL REVIEW COPY · DO NOT DISTRIBUTE</span><span>PAPER #2035</span></div>
    </footer>
  );
}

function HomePage({ navigate, openFigure }) {
  const architectureCaption = "Five-stage FLASH architecture: generate, extract, validate, bank, localize, and synthesize reusable defects.";
  return (
    <>
      <section className="hero shell">
        <div className="hero-content">
          <span className="eyebrow dot-label">WACV 2027 · APPLICATIONS TRACK / PAPER #2035</span>
          <h1>FLASH: Generate Once, Synthesize Many</h1>
          <h2>Synthetic anomaly generation for industrial anomaly detection.</h2>
          <p>FLASH decouples defect generation from anomaly synthesis. From normal images alone, it generates a small set of defects, extracts and validates reusable patches, then composes diverse synthetic anomalies without repeated image-generation calls.</p>
          <div className="button-row"><Button href="/FLASH-research-paper.pdf" target="_blank">Paper</Button><Button href="https://anonymous.4open.science/r/flash-1178" target="_blank" variant="outline">Code</Button><Button href="/FLASH-research-paper.pdf#page=11" target="_blank" variant="ghost">Supplementary</Button></div>
        </div>
        <aside className="contents-rail">
          <span>CONTENTS</span>
          {["Problem", "Core idea", "Pipeline", "Results", "Visuals", "Resources"].map((item, i) => <a href={`#${item.toLowerCase().replace(" ", "-")}`} key={item}><b>0{i + 1}</b>{item}</a>)}
          <div className="rail-meta">WACV 2027<br />ANONYMOUS<br />REVIEW COPY</div>
        </aside>
        <div className="hero-figure"><FigurePlaceholder number="01" title="Five-stage FLASH architecture" ratio="hero" src="/figures/flash-architecture.png" caption={architectureCaption} onOpen={() => openFigure("01", "Five-stage FLASH architecture", null, "/figures/flash-architecture.png", architectureCaption)} /></div>
      </section>

      <section className="metric-strip" aria-label="Key metrics"><div className="shell metric-grid"><div className="metric-label"><span>AT A GLANCE</span><b>04</b></div><Metric value="78.13%" label="Image-level F1" note="SuperADD · FLASH calibration" /><Metric value="83.64%" label="Real oracle" note="upper-bound reference" /><Metric value="11.95×" label="Generation speedup" note="vs. AnoStyler" /><Metric value="8" label="MVTec AD 2 categories" note="three random seeds" /></div></section>

      <section id="problem" className="section shell">
        <SectionHeading index="01" eyebrow="Problem" title="Fast or faithful should not be the trade-off." description="Real industrial defects are rare, diverse, and expensive to collect and annotate. Existing synthetic approaches sit at two opposing extremes." />
        <div className="comparison-layout">
          <article className="comparison-panel"><span className="micro-label">PROCEDURAL METHODS</span><h3>Fast, but restricted.</h3><p>Patch relocation, texture blending, and Perlin-noise methods scale efficiently, but remain tied to predefined perturbations and borrowed textures, limiting complex context-dependent defects.</p><div className="evidence-note"><strong>14.4 ms</strong><span>Perlin synthesis per image</span></div></article>
          <article className="comparison-panel"><span className="micro-label">GENERATIVE METHODS</span><h3>Diverse, but expensive.</h3><p>Diffusion and style-transfer approaches broaden defect diversity, but generative inference is typically repeated for every sample and may drift beyond prescribed masks.</p><div className="evidence-note"><strong>14,982.1 ms</strong><span>AnoStyler synthesis per image</span></div></article>
        </div>
        <div className="proposed-line"><span>FLASH</span><h3>Generate once.<br />Synthesize many.</h3><p>A limited set of semantically generated defects is extracted, validated, and banked once, then replayed across normal host images with object-aware, size-controllable placement.</p></div>
      </section>

      <section id="core-idea" className="section section-tinted">
        <div className="shell"><SectionHeading index="02" eyebrow="Core idea" title="Defect generation and anomaly synthesis become separate operations." description="Stages 1-3 run once per category to construct the defect bank. Stages 4-5 run for every output image using lightweight placement, harmonization, and blending." />
          <div className="core-grid"><blockquote>“The defect bank carries what to synthesize. MRSP determines where and at what scale.”</blockquote><FigurePlaceholder number="S.03" title="Object-aware placement mask construction" ratio="medium" src="/figures/mrsp-construction.png" caption="MRSP field, object restriction, thresholded response, and seed-dependent placement regions." onOpen={() => openFigure("S.03", "Object-aware placement mask construction", null, "/figures/mrsp-construction.png", "MRSP construction across MVTec AD 2 categories.")} /></div>
        </div>
      </section>

      <section id="pipeline" className="section shell">
        <SectionHeading index="03" eyebrow="Overview" title="End-to-end synthesis" description="A category-wise view from host image and object-aware region to placement mask, retrieved defect, ground-truth mask, and final synthetic anomaly." />
        <FigurePlaceholder number="03" title="Qualitative results across MVTec AD 2" ratio="panoramic" src="/figures/qualitative-overview.png" caption="The complete FLASH pipeline across all eight MVTec AD 2 categories." onOpen={() => openFigure("03", "Qualitative results across MVTec AD 2", null, "/figures/qualitative-overview.png", "Host image, OBS region, placement mask, defect crop, ground-truth mask, and synthetic anomaly.")} />
        <div className="stage-row five">{["Semantic generation", "DiffMask extraction", "Validation & banking", "OBS + MRSP localization", "Adaptive synthesis"].map((stage, i) => <div key={stage}><span>0{i + 1}</span><h4>{stage}</h4><p>{["VLM-guided defect creation.", "Recover the actual defect mask.", "Store semantically valid crops.", "Find a coherent object-aware region.", "Place, harmonize, and blend."][i]}</p></div>)}</div>
      </section>

      <section id="results" className="section section-dark">
        <div className="shell"><SectionHeading index="04" eyebrow="Results" title="Near-oracle calibration, at a fraction of the generation cost." description="Across five anomaly detectors, FLASH retains 91-98% of the corresponding real-oracle image-level performance and delivers the best synthetic result for four detectors." action={<button className="text-link light" onClick={() => navigate("/results")}>View results <ArrowRight size={18} /></button>} />
          <div className="result-grid"><Metric value="78.13" label="SuperADD image F1" note="83.64 real oracle" /><Metric value="38.38" label="Mean pixel F1" note="best synthetic source" /><Metric value="112.8 s" label="Per category" note="vs. 1,348.1 s AnoStyler" /><Metric value="91.6%" label="Time reduction" note="11.95× speedup" /></div>
        </div>
      </section>

      <section id="visuals" className="section shell">
        <SectionHeading index="05" eyebrow="Featured visuals" title="Evidence, seen clearly." description="DiffMask extraction, generator comparisons, and MRSP placement behavior from the paper and supplementary material." action={<button className="text-link" onClick={() => navigate("/visuals")}>Explore visuals <ArrowRight size={18} /></button>} />
        <div className="featured-grid"><FigurePlaceholder number="02" title="DiffMask extraction" ratio="tall" src="/figures/diffmask.png" caption="Registered normal and generated anomaly images." onOpen={() => openFigure("02", "DiffMask extraction", null, "/figures/diffmask.png", "DiffMask-based defect extraction.")} /><FigurePlaceholder number="S.05" title="Generator comparison" ratio="tall" src="/figures/generator-comparison.png" caption="DRAEM, NSA, GLASS, AnoStyler, and FLASH." onOpen={() => openFigure("S.05", "Generator comparison", null, "/figures/generator-comparison.png", "Visual comparison across eight MVTec AD 2 categories.")} /><FigurePlaceholder number="S.02" title="MRSP ablation" ratio="tall" src="/figures/mrsp-ablation.png" caption="Spectral exponent and pyramid-level ablation." onOpen={() => openFigure("S.02", "MRSP ablation", null, "/figures/mrsp-ablation.png", "MRSP ablation at the MVTec AD 2 operating point.")} /></div>
      </section>

      <section id="resources" className="section cta-section"><div className="shell cta-grid"><span className="eyebrow">06 · RESOURCES</span><h2>Read the full submission.</h2><p>The supplied review PDF includes the ten-page main paper and ten-page supplementary material.</p><div className="button-row"><Button href="/FLASH-research-paper.pdf" target="_blank">Paper</Button><Button href="https://anonymous.4open.science/r/flash-1178" target="_blank" variant="outline">Code</Button><Button href="/FLASH-research-paper.pdf#page=11" target="_blank" variant="ghost">Supplementary</Button></div></div></section>
    </>
  );
}

const methodStages = [
  {
    number: "01",
    title: "Semantic-guided anomaly generation",
    description: "VLM-1 reasons globally over a normal image to identify a plausible, category-specific defect. Its anomaly prompt is combined with a configuration file that preserves lighting, shadows, reflections, exposure, contrast, and white balance before the image-generation model produces the anomalous image.",
    callout: "VLM-1 / QWEN2.5-VL-7B-INSTRUCT",
    note: "Stages 1-3 execute once per category. The generated image becomes a donor for reusable defect construction.",
    src: "/figures/flash-architecture.png",
    figure: "Architecture overview",
  },
  {
    number: "02",
    title: "Defect extraction with DiffMask",
    description: "DiffMask registers normal and generated images, compensates geometric and photometric drift, and fuses luminance, chromaticity, gradient, low-frequency, and fine-detail residuals. A local z-score and hysteresis thresholding isolate the introduced defect and recover its true mask.",
    callout: "ALGORITHM 1 / DIFFMASK",
    note: "The mask is recovered after generation, avoiding mask-drift between the visible anomaly and its supervision.",
    src: "/figures/diffmask.png",
    figure: "DiffMask-based defect extraction",
  },
  {
    number: "03",
    title: "Defect validation and banking",
    description: "VLM-2 evaluates each extracted crop with its surrounding substrate and accepts it only when it represents a plausible category-specific defect. A contrast gate rejects weak candidates; accepted crops are indexed by category and defect type in the semantic defect bank.",
    callout: "VLM-2 / SEMANTIC VALIDITY CHECK",
    note: "Once a crop enters the bank, its generative cost is incurred only once and the defect can be reused across hosts, locations, and spatial extents.",
    src: "/figures/flash-architecture.png",
    figure: "Category-wise semantic defect bank",
  },
  {
    number: "04",
    title: "Object-aware localization",
    description: "Object Boundary Suppression combines CIELAB border-color distance with local texture variation to estimate the foreground region. Multi-Resolution Spectral Pyramid noise then constructs a coherent placement field inside that region using multi-scale spectral and bilinear components.",
    callout: "ALGORITHMS 2-3 / OBS + MRSP",
    note: "An object-conditioned quantile sets target coverage, and the largest connected component becomes the placement mask.",
    src: "/figures/mrsp-construction.png",
    figure: "Object-aware placement mask construction",
  },
  {
    number: "05",
    title: "Adaptive synthesis",
    description: "The retrieved defect is translated, rotated, isotropically scaled, and constrained by the intersection of the MRSP mask and object region. CIELAB harmonization adapts the crop to the host; small defects use feathered alpha blending while larger defects use Poisson blending with a substrate collar.",
    callout: "ALGORITHM 4 / HYBRID BLENDING",
    note: "The final synthetic anomaly and its pixel-accurate ground-truth mask are returned together.",
    src: "/figures/qualitative-overview.png",
    figure: "Adaptive placement and hybrid blending",
  },
];

function MethodPage({ openFigure }) {
  return (
    <>
      <PageIntro label="01 · METHODOLOGY" title="Method" description="Given only normal images from a category, FLASH generates anomalous images with pixel-accurate segmentation labels without using real defect images, real masks, or human annotation." />
      <section className="section shell page-first-section"><FigurePlaceholder number="01" title="Five-stage FLASH architecture" ratio="hero" src="/figures/flash-architecture.png" caption="Stages 1-3 build a reusable defect bank; Stages 4-5 synthesize each output image." onOpen={() => openFigure("01", "Five-stage FLASH architecture", null, "/figures/flash-architecture.png", "Stages 1-3 generate, extract, validate, and bank defects; Stages 4-5 localize and synthesize them.")} /></section>
      <section className="method-list shell">
        {methodStages.map((stage, i) => (
          <article className={cx("method-stage", i % 2 && "reverse")} key={stage.number}>
            <div className="method-copy"><span className="method-number">{stage.number}</span><span className="micro-label">{stage.callout}</span><h2>{stage.title}</h2><p>{stage.description}</p><div className="technical-callout"><span>TECHNICAL NOTE</span><p>{stage.note}</p></div></div>
            <FigurePlaceholder number={`M.${stage.number}`} title={stage.figure} src={stage.src} ratio="medium" caption={stage.note} onOpen={() => openFigure(`M.${stage.number}`, stage.figure, null, stage.src, stage.note)} />
          </article>
        ))}
      </section>
      <section className="section section-tinted"><div className="shell"><SectionHeading index="06" eyebrow="Complete system" title="Generate once, synthesize many" description="The image-generation model is not invoked for every synthetic sample. Per-image generation instead uses lightweight placement, harmonization, and blending while the defect bank is amortized across outputs." /><FigurePlaceholder number="03" title="End-to-end FLASH synthesis" ratio="panoramic" src="/figures/qualitative-overview.png" caption="Qualitative results across all eight MVTec AD 2 categories." onOpen={() => openFigure("03", "End-to-end FLASH synthesis", null, "/figures/qualitative-overview.png", "Host image, OBS region, placement mask, defect crop, ground-truth mask, and final synthetic anomaly.")} /></div></section>
    </>
  );
}

function ResearchTable() {
  const rows = [
    ["PaDiM", "80.37", "69.41", "62.37", "79.11", "7.63", "3.05", "5.37", "3.89"],
    ["PatchCore", "82.46", "67.50", "43.02", "74.64", "26.09", "14.90", "16.08", "18.14"],
    ["AnomalyDINO", "81.47", "62.19", "49.85", "77.05", "33.55", "17.47", "13.99", "26.11"],
    ["Dinomaly", "81.81", "60.42", "55.37", "77.51", "31.90", "15.45", "3.35", "22.53"],
    ["SuperADD", "83.64", "79.12", "64.36", "78.13", "51.53", "19.44", "36.99", "38.38"],
  ];
  return (
    <div className="table-wrap"><table className="wide-research-table"><caption>TABLE 1 · IMAGE-LEVEL AND PIXEL-LEVEL F1 (%) AVERAGED ACROSS MVTec AD 2 CATEGORIES</caption><thead><tr><th rowSpan="2">Detector</th><th colSpan="4">Image-level F1</th><th colSpan="4">Pixel-level F1</th></tr><tr><th>Real</th><th>Perlin</th><th>AnoStyler</th><th>FLASH</th><th>Real</th><th>Perlin</th><th>AnoStyler</th><th>FLASH</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell, c) => <td key={c} className={c === 4 || c === 8 ? "flash-value" : ""}>{cell}</td>)}</tr>)}</tbody></table></div>
  );
}

function BarChart() {
  const rows = [["Perlin", 9, "14.4 ms"], ["GLASS", 14, "52 ms"], ["NSA", 17, "80 ms"], ["FLASH", 48, "586.2 ms"], ["DRAEM", 58, "1.2 s"], ["AnoStyler", 100, "14,982.1 ms"]];
  return <div className="bar-chart">{rows.map(([name, width, value]) => <div key={name}><span>{name}</span><i><b className={name === "FLASH" ? "accent-bar" : ""} style={{ width: `${width}%` }} /></i><strong>{value}</strong></div>)}</div>;
}

function Heatmap({ compact = false }) {
  return <div className={cx("heatmap", compact && "compact")}>{Array.from({ length: compact ? 30 : 60 }, (_, i) => <i key={i} style={{ opacity: 0.12 + (((i * 13) % 9) / 10) }} />)}</div>;
}

function ResultsPage({ openFigure }) {
  const categories = [
    ["Can", "0.00", "Real oracle: 0.02"], ["Fabric", "69.06", "Best synthetic"],
    ["Fruit Jelly", "55.57", "AnoStyler: 55.93"], ["Rice", "51.90", "Perlin: 6.21"],
    ["Sheet Metal", "7.39", "Challenging regime"], ["Vial", "39.41", "Perlin: 56.46"],
    ["Wallplugs", "17.41", "AnoStyler: 50.79"], ["Walnuts", "66.28", "Best synthetic"],
  ];
  return (
    <>
      <PageIntro label="02 · EVALUATION" title="Results" description="FLASH is evaluated as a substitute for real defects in decision-threshold calibration across five anomaly detectors and eight MVTec AD 2 categories, with real-defect calibration as the oracle." />
      <section className="section shell page-first-section"><SectionHeading index="01" eyebrow="Main result" title="FLASH nearly closes the calibration gap to real defects." description="For SuperADD, FLASH reaches 78.13% image-level F1 against an 83.64% real-anomaly oracle while producing the strongest synthetic mean pixel-level calibration." /><div className="hero-result"><Metric value="78.13%" label="Image-level F1 · SuperADD" note="93.4% of the real-oracle score" /><div className="hero-result-note"><span>PROTOCOL</span><p>Detectors and memory banks are fitted once on normal training data. Only the calibration source changes; all evaluations use the same real test set and are averaged across three random seeds.</p></div></div></section>
      <section className="section section-tinted"><div className="shell"><SectionHeading index="02" eyebrow="Cross-model comparison" title="Consistent calibration transfer" description="FLASH achieves the best synthetic image-level result for four of five detectors and the best synthetic pixel-level result for four of five detectors." /><ResearchTable /></div></section>
      <section className="section shell"><SectionHeading index="03" eyebrow="Generation cost" title="Replay is orders faster than per-sample generation." description="Single-image synthesis cost from the main paper and supplementary comparison. Bar lengths use a compressed visual scale for readability; labels show exact reported values." /><div className="chart-panel"><BarChart /><div className="chart-note"><span>EFFICIENCY</span><p>FLASH incurs a one-time 15 s anomalous-image generation step, then synthesizes at 586.2 ms per image. Estimated total time is 112.8 s per category versus 1,348.1 s for AnoStyler.</p></div></div></section>
      <section className="section section-tinted"><div className="shell"><SectionHeading index="04" eyebrow="Category analysis" title="Pixel-level F1 across MVTec AD 2" description="SuperADD calibrated with FLASH-generated anomalies. Values are percentages; real calibration is an oracle reference rather than a competing method." /><div className="category-results eight">{categories.map(([name, value, note], i) => <article key={name}><span>{String(i + 1).padStart(2, "0")}</span><h3>{name}</h3><strong>{value}</strong><small>{note}</small></article>)}</div></div></section>
      <section className="section shell"><SectionHeading index="05" eyebrow="Efficiency" title="Generate-once timing" description="Per-image timing at 1024 × 1024 on a single NVIDIA RTX 3090; stage times are means over fresh, non-cached images." /><div className="efficiency-grid"><Metric value="586 ms" label="Measured total" note="per output image" /><Metric value="212 ms" label="Poisson blending" note="36.2% of total" /><Metric value="154 ms" label="OBS extraction" note="26.3% of total" /><Metric value="139 ms" label="CIELAB harmonization" note="23.7% of total" /></div><div className="result-figure"><FigurePlaceholder number="S.04" title="Per-stage timing breakdown" src="/figures/pipeline-timing.png" ratio="compact" caption="OBS, MRSP, placement, CIELAB harmonization, and blending costs." onOpen={() => openFigure("S.04", "Per-stage timing breakdown", null, "/figures/pipeline-timing.png", "Per-image timing breakdown of FLASH synthesis at 1024 × 1024.")} /></div></section>
      <section className="section section-dark"><div className="shell"><SectionHeading index="06" eyebrow="Key findings" title="What the evidence supports" /><ol className="finding-list"><li><span>01</span><p>FLASH retains 91-98% of real-oracle image-level performance across PaDiM, PatchCore, AnomalyDINO, and Dinomaly.</p></li><li><span>02</span><p>Its strongest category gains appear on textured and particulate materials such as fabric, rice, fruit jelly, and walnuts.</p></li><li><span>03</span><p>Reusable defect banks reduce generation time by 91.6%, an estimated 11.95× speedup over per-sample generative synthesis.</p></li></ol></div></section>
    </>
  );
}

function CategoryCard({ index, name, src, openFigure }) {
  const caption = `Host, object region, MRSP mask, defect patch, ground-truth mask, and alpha/Poisson composites for ${name}.`;
  return <article className="category-card"><FigurePlaceholder number={`S.${index + 5}`} title={name} src={src} ratio="category" caption={caption} onOpen={() => openFigure(`S.${index + 5}`, name, null, src, caption)} /><div><span>{String(index).padStart(2, "0")}</span><h3>{name}</h3><ArrowUpRight size={18} /></div></article>;
}

function VisualsPage({ openFigure }) {
  const cats = [
    ["Can", "/figures/category-can.png"],
    ["Fabric", "/figures/category-fabric.png"],
    ["Fruit Jelly", "/figures/category-fruit-jelly.png"],
    ["Rice", "/figures/category-rice.png"],
    ["Sheet Metal", "/figures/category-sheet-metal.png"],
    ["Vial", "/figures/category-vial.png"],
    ["Wallplugs", "/figures/category-wallplugs.png"],
    ["Walnuts", "/figures/category-walnuts.png"],
  ];
  return (
    <>
      <PageIntro label="03 · VISUAL EVIDENCE" title="Visuals" description="Qualitative synthesis results, baseline comparisons, and component analysis from the WACV 2027 submission and supplementary material." />
      <section className="section shell page-first-section"><SectionHeading index="01" eyebrow="Qualitative results" title="The full pipeline, across eight categories" description="Each row shows a host image, object-aware region, MRSP placement mask, retrieved defect, ground-truth mask, and final synthetic anomaly." /><div className="qualitative-grid"><FigurePlaceholder number="03" title="End-to-end qualitative overview" src="/figures/qualitative-overview.png" ratio="hero" caption="All eight MVTec AD 2 categories." onOpen={() => openFigure("03", "End-to-end qualitative overview", null, "/figures/qualitative-overview.png", "Qualitative results across all eight MVTec AD 2 categories.")} /><FigurePlaceholder number="02" title="DiffMask extraction" src="/figures/diffmask.png" ratio="medium" caption="Normal, generated, registered, z-score, overlay, and mask." onOpen={() => openFigure("02", "DiffMask extraction", null, "/figures/diffmask.png", "DiffMask-based defect extraction from registered images.")} /></div></section>
      <section className="section section-tinted"><div className="shell"><SectionHeading index="02" eyebrow="Category gallery" title="Per-category synthesis sheets" description="Three random seeds per category expose spatial variation while keeping the category configuration fixed." /><div className="category-gallery">{cats.map(([name, src], i) => <CategoryCard key={name} index={i + 1} name={name} src={src} openFigure={openFigure} />)}</div></div></section>
      <section className="section shell"><SectionHeading index="03" eyebrow="Pipeline visualizations" title="Object-aware placement and synthesis" description="The detailed sheets distinguish the admissible MRSP region from the final transformed defect footprint and compare alpha and Poisson composites." /><div className="pipeline-gallery"><FigurePlaceholder number="S.06" title="Can, Fabric, Fruit Jelly, and Rice" src="/figures/category-sheet-a.png" ratio="panoramic" caption="Per-category synthesis results, three seeds each." onOpen={() => openFigure("S.06", "Can, Fabric, Fruit Jelly, and Rice", null, "/figures/category-sheet-a.png", "Host, object region, placement mask, defect, ground truth, composites, zooms, and differences.")} /><FigurePlaceholder number="S.07" title="Sheet Metal, Vial, Wallplugs, and Walnuts" src="/figures/category-sheet-b.png" ratio="panoramic" caption="Constrained supports: specular strip, transparent vial, and multi-object scenes." onOpen={() => openFigure("S.07", "Sheet Metal, Vial, Wallplugs, and Walnuts", null, "/figures/category-sheet-b.png", "Host, object region, placement mask, defect, ground truth, composites, zooms, and differences.")} /></div></section>
      <section className="section section-dark"><div className="shell"><SectionHeading index="04" eyebrow="Baseline comparison" title="Procedural, patch-transfer, and generative alternatives" description="The same host image is shown across DRAEM, NSA, GLASS, AnoStyler, and FLASH without result selection." /><FigurePlaceholder number="S.05" title="Synthetic anomaly generator comparison" src="/figures/generator-comparison.png" ratio="hero" caption="Normal host followed by DRAEM, NSA, GLASS, AnoStyler, and FLASH." onOpen={() => openFigure("S.05", "Synthetic anomaly generator comparison", null, "/figures/generator-comparison.png", "Visual comparison across all eight MVTec AD 2 categories.")} /></div></section>
      <section className="section shell"><SectionHeading index="05" eyebrow="Technical visualizations" title="MRSP analysis" description="The supplementary study compares noise primitives, selects the operating point, and visualizes placement-field construction." /><div className="technical-grid"><FigurePlaceholder number="S.01" title="Noise primitive trade-off" src="/figures/mrsp-tradeoff.png" ratio="compact" caption="Generation time, EMD, and calibrated F1." onOpen={() => openFigure("S.01", "Noise primitive trade-off", null, "/figures/mrsp-tradeoff.png", "Joint comparison of noise primitives.")} /><FigurePlaceholder number="S.02" title="MRSP ablation" src="/figures/mrsp-ablation.png" ratio="compact" caption="Spectral exponent and pyramid levels." onOpen={() => openFigure("S.02", "MRSP ablation", null, "/figures/mrsp-ablation.png", "Ablation at the MVTec AD 2 operating point.")} /><FigurePlaceholder number="S.03" title="Placement mask construction" src="/figures/mrsp-construction.png" ratio="compact" caption="MRSP field to retained placement region." onOpen={() => openFigure("S.03", "Placement mask construction", null, "/figures/mrsp-construction.png", "Object restriction, thresholding, and seed-dependent masks.")} /><FigurePlaceholder number="S.04" title="Per-stage timing" src="/figures/pipeline-timing.png" ratio="compact" caption="Measured synthesis cost at 1024 × 1024." onOpen={() => openFigure("S.04", "Per-stage timing", null, "/figures/pipeline-timing.png", "Per-image timing on a single NVIDIA RTX 3090.")} /></div></section>
    </>
  );
}

const resources = [
  { icon: FilePdf, title: "Paper", description: "The supplied 20-page review PDF: ten-page main paper plus ten-page supplementary material.", meta: "PDF / 20 PAGES", href: "/FLASH-research-paper.pdf", label: "Open paper" },
  { icon: GithubLogo, title: "Code", description: "Anonymous repository with implementation details and reproducibility materials referenced by the supplement.", meta: "ANONYMOUS REPOSITORY", href: "https://anonymous.4open.science/r/flash-1178", label: "Open repository" },
  { icon: FileText, title: "Supplementary", description: "Hyperparameters, MRSP ablations, timing analysis, per-detector tables, and per-category synthesis sheets.", meta: "PAGES 11-20", href: "/FLASH-research-paper.pdf#page=11", label: "Open supplement" },
  { icon: Database, title: "MVTec AD 2", description: "The eight-category industrial anomaly-detection benchmark used for calibration-transfer evaluation.", meta: "DATASET / REFERENCE [20]", href: "https://arxiv.org/abs/2503.21622", label: "Dataset paper" },
  { icon: BracketsCurly, title: "BibTeX", description: "Anonymous review-stage citation for the WACV 2027 Applications Track submission.", meta: "CITATION / PAPER #2035", href: "#citation", label: "View citation" },
  { icon: PresentationChart, title: "Presentation", description: "A presentation was not included in the supplied review materials.", meta: "NOT PROVIDED", href: null, label: "Unavailable" },
];

function ResourceCard({ item }) {
  const Icon = item.icon;
  return <article className="resource-card"><div className="resource-icon"><Icon size={26} weight="regular" /></div><span className="micro-label">{item.meta}</span><h2>{item.title}</h2><p>{item.description}</p>{item.href ? <Button href={item.href} target={item.href.startsWith("#") ? undefined : "_blank"} variant="outline">{item.label}</Button> : <span className="resource-unavailable">{item.label}</span>}</article>;
}

function ResourcesPage() {
  const [copied, setCopied] = useState(false);
  const citation = `@inproceedings{anonymous2027flash,\n  title     = {FLASH: A “Generate Once, Synthesize Many” Framework for Synthetic Anomaly Generation in Industrial Anomaly Detection},\n  author    = {Anonymous},\n  booktitle = {IEEE/CVF Winter Conference on Applications of Computer Vision},\n  year      = {2027},\n  note      = {Applications Track submission, Paper ID 2035}\n}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(citation); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { setCopied(false); }
  };
  return (
    <>
      <PageIntro label="04 · MATERIALS" title="Resources" description="Paper, anonymous code repository, supplementary experiments, dataset reference, and review-stage citation for WACV 2027 submission #2035." />
      <section className="section shell page-first-section"><div className="resource-grid">{resources.map(item => <ResourceCard item={item} key={item.title} />)}</div></section>
      <section id="citation" className="section section-tinted"><div className="shell"><SectionHeading index="01" eyebrow="Citation" title="Cite this work" description="This entry preserves the anonymous review status of the supplied paper. Replace the author field and final venue metadata after acceptance." /><div className="citation-block"><pre>{citation}</pre><button onClick={copy}>{copied ? <Check size={18} /> : <Copy size={18} />}{copied ? "Copied" : "Copy BibTeX"}</button></div></div></section>
      <section className="section shell"><div className="resource-note"><BookOpen size={30} /><div><span className="eyebrow">REVIEW STATUS</span><h2>Confidential review copy</h2><p>The supplied PDF is labeled “WACV 2027 Submission #2035 · Applications Track · Confidential Review Copy · Do Not Distribute.” This local site preserves that status and has not been published.</p></div></div></section>
    </>
  );
}

export function App() {
  const [path, navigate] = useRoute();
  const [figure, setFigure] = useState(null);
  const openFigure = (number, title, variant, src, caption) => setFigure({ number, title, variant, src, caption });
  const page = useMemo(() => {
    if (path === "/method") return <MethodPage openFigure={openFigure} />;
    if (path === "/results") return <ResultsPage openFigure={openFigure} />;
    if (path === "/visuals") return <VisualsPage openFigure={openFigure} />;
    if (path === "/resources") return <ResourcesPage />;
    return <HomePage navigate={navigate} openFigure={openFigure} />;
  }, [path]);
  return (
    <div className="app-shell">
      <Header path={path} navigate={navigate} />
      <main>{page}</main>
      <Footer navigate={navigate} />
      <FigureModal figure={figure} onClose={() => setFigure(null)} />
    </div>
  );
}
