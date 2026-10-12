import { useState, useEffect } from 'react'
import { projects, categories, services, heroSlides, TG, CONTACT as C } from './data.js'
import { ui } from './i18n.js'

const ids = ['home', 'about', 'services', 'projects', 'experience', 'partners', 'contact']
const wa = (n) => `https://wa.me/${n.replace('+', '')}`
const byId = Object.fromEntries(projects.map((p) => [p.id, p]))
const sm = (s) => s.replace('.webp', '-sm.webp')

// Parametric "flow lines": a family of curves sweeping across a surface (original, fluid-architecture interpretation)
function FlowLines({ cls }) {
  const d = Array.from({ length: 14 }, (_, i) => `M0 ${330 + i * 7} C 220 ${90 + i * 13}, 520 ${450 - i * 11}, 1000 ${40 + i * 5}`)
  return (<svg className={cls} viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">{d.map((p, i) => <path key={i} d={p} style={{ animationDelay: `${i * 0.1}s` }} />)}</svg>)
}

function Lightbox({ src, alt, t, onClose }) {
  const [z, setZ] = useState(1)
  useEffect(() => { const k = (e) => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [onClose])
  return (<div className="lb" role="dialog" aria-modal="true" aria-label={alt}>
    <div className="lb-bar"><button onClick={() => setZ(Math.max(1, z - .5))} aria-label="−">−</button><span>{Math.round(z * 100)}%</span><button onClick={() => setZ(Math.min(4, z + .5))} aria-label="+">+</button><button onClick={onClose}>{t.close}</button></div>
    <div className="lb-view"><img src={src} alt={alt} style={{ width: `${z * 100}%`, maxWidth: 'none' }} /></div></div>)
}

function Project({ p, lang, t, onClose, zoom }) {
  const L = (o) => o[lang]
  useEffect(() => { const k = (e) => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [onClose])
  const gal = (list) => <div className="gal">{list.map((s) => <button key={s} onClick={() => zoom({ src: s, alt: L(p.title) })}><img loading="lazy" src={s} alt={L(p.title)} /></button>)}</div>
  return (<div className="modal" role="dialog" aria-modal="true" aria-label={L(p.title)} onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal-in">
      <button className="x" onClick={onClose} aria-label={t.close}>×</button>
      <p className="eyebrow">{t.cat[p.cat]}</p><h2>{L(p.title)}</h2>
      <p className="role"><b>{t.role2}:</b> {L(p.role)}</p>
      {p.images.length > 0 && gal(p.images.slice(0, 1))}
      <div className="two"><div><h3>{t.over}</h3><p>{L(p.overview)}</p></div><div><h3>{t.appr}</h3><p>{L(p.approach)}</p></div></div>
      <h3>{t.facts}</h3>
      <dl className="specs">{p.specs.map((s) => <div key={s.k.en}><dt>{L(s.k)}</dt><dd>{L(s.v)}</dd></div>)}</dl>
      <h3>{t.scope}</h3><p className="chips">{p.technical.map((x) => <span key={x}>{TG[x][lang]}</span>)}</p>
      {p.images.length > 1 && <><h3>{t.imgs}</h3>{gal(p.images.slice(1))}</>}
      {p.drawings.length > 0 && <><h3>{t.drw}</h3><p className="hint">{t.zoomHint}</p>{gal(p.drawings)}</>}
    </div></div>)
}

export default function App() {
  const [lang, setLang] = useState('en'), [menu, setMenu] = useState(false), [cat, setCat] = useState('all'), [open, setOpen] = useState(null), [lb, setLb] = useState(null)
  const [idx, setIdx] = useState(0), [auto, setAuto] = useState(true)
  const t = ui[lang], rtl = lang === 'ar'
  useEffect(() => {
    document.documentElement.lang = lang; document.documentElement.dir = t.dir; document.title = t.docTitle
    const m = document.querySelector('meta[name=description]'); if (m) m.setAttribute('content', t.metaDesc)
  }, [lang, t])
  useEffect(() => { document.body.style.overflow = open || lb || menu ? 'hidden' : '' }, [open, lb, menu])
  useEffect(() => { const els = document.querySelectorAll('.rv'); const io = new IntersectionObserver((e) => e.forEach((x) => x.isIntersecting && x.target.classList.add('in')), { threshold: .1 }); els.forEach((e) => io.observe(e)); return () => io.disconnect() }, [cat, lang])
  useEffect(() => {
    if (!auto || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIdx((i) => (i + 1) % heroSlides.length), 5500); return () => clearInterval(id)
  }, [auto])
  const list = projects.filter((p) => cat === 'all' || p.cat === cat)
  const go = () => setMenu(false)
  const [img, pid] = heroSlides[idx], hp = byId[pid]
  return (<>
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true"><defs>
      <clipPath id="flow" clipPathUnits="objectBoundingBox"><path d="M0.12,0 H0.97 Q1,0 1,0.04 V0.96 Q1,1 0.97,1 H0.04 C0.17,0.7 0,0.3 0.12,0 Z" /></clipPath>
      <clipPath id="flowR" clipPathUnits="objectBoundingBox"><path d="M0.88,0 H0.03 Q0,0 0,0.04 V0.96 Q0,1 0.03,1 H0.96 C0.83,0.7 1,0.3 0.88,0 Z" /></clipPath></defs></svg>
    <header className="top"><div className="wrap bar">
      <a href="#home" className="brand" onClick={go}><img src="./assets/img/logo.png" alt={t.logoAlt} /><span>{t.name}</span></a>
      <nav className={menu ? 'open' : ''} aria-label="Main">{ids.map((id, i) => <a key={id} href={`#${id}`} onClick={go}>{t.nav[i]}</a>)}</nav>
      <div className="tools"><div className="lang" role="group" aria-label="Language"><button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button><span>|</span><button className={lang === 'ar' ? 'on' : ''} onClick={() => setLang('ar')}>AR</button></div>
        <button className={`burger ${menu ? 'open' : ''}`} onClick={() => setMenu(!menu)} aria-label="Menu" aria-expanded={menu}><i /><i /></button></div></div></header>
    <main>
      <section id="home" className="hero"><FlowLines cls="lines" />
        <div className="wrap hero-grid">
          <div className="hero-head"><p className="eyebrow">{t.tag}</p><h1>{t.name}</h1><h2>{t.role}</h2></div>
          <div className="thumbs" role="group" aria-label={t.thumbs}>{heroSlides.map(([f, id], i) =>
            <button key={f} className={i === idx ? 'on' : ''} aria-pressed={i === idx} aria-label={byId[id].title[lang]} onClick={() => { setIdx(i); setAuto(false) }}><img src={`./assets/img/${f}-sm.webp`} alt="" loading={i < 4 ? 'eager' : 'lazy'} /></button>)}</div>
          <div className="wrapm"><figure className="hero-media"><img key={img} className="hero-img" src={`./assets/img/${img}.webp`} alt={hp.title[lang]} fetchPriority="high" />
            <figcaption><button onClick={() => setOpen(hp)}><small>{t.featured}</small><b>{hp.title[lang]} <span aria-hidden="true">{t.arrow}</span></b></button></figcaption></figure></div>
          <div className="hero-cta"><p className="lead">{t.stmt}</p><div className="btns"><a className="btn gold" href="#projects">{t.view}</a><a className="btn" href="#contact">{t.talk}</a></div></div>
        </div></section>

      <section id="about" className="sec"><div className="wrap"><div className="grid-a rv"><div><p className="eyebrow">01</p><h2>{t.aboutT}</h2><p className="big">{t.aboutS}</p>
        <img className="blob" loading="lazy" src="./assets/img/villa-night-sm.webp" alt={byId['modern-villa'].title[lang]} /></div>
        <div className="stack"><div className="card"><h3>{t.simple}</h3><p>{t.simpleT}</p></div><div className="card dark"><h3>{t.proT}</h3><p>{t.proP}</p></div></div></div>
        <div className="phil rv">{t.phil.map(([a, b]) => <div key={a}><h3>{a}</h3><p>{b}</p></div>)}</div></div></section>

      <section id="services" className="sec alt"><div className="wrap"><p className="eyebrow rv">02</p><h2 className="rv">{t.servT}</h2>
        <div className="serv">{services.map((s) => <details key={s.k} className="rv"><summary><span className="ic">{s.icon}</span>{s[lang][0]}</summary><p>{s[lang][1]}</p>{s.tech && <p className="tech">{s.tech[lang]}</p>}</details>)}</div></div></section>

      <section id="projects" className="sec"><div className="wrap"><p className="eyebrow rv">03</p><h2 className="rv">{t.projT}</h2><p className="sub rv">{t.projS}</p>
        <div className="filters">{categories.map((c) => <button key={c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{t.cat[c]}</button>)}</div>
        <div className="cards">{list.map((p) => <button key={p.id} className="pc rv" onClick={() => setOpen(p)}>
          <span className="ph"><img loading="lazy" src={sm(p.cover ? `./assets/img/${p.cover}.webp` : p.images[0])} alt={p.title[lang]} style={{ objectPosition: p.pos || '50% 50%' }} /></span>
          <span className="cap"><small>{t.cat[p.cat]}</small><b>{p.title[lang]}</b><em>{p.short[lang]}</em><i>{t.open} {t.arrow}</i></span></button>)}</div></div></section>

      <section id="experience" className="sec dark"><div className="wrap"><p className="eyebrow rv">04</p><h2 className="rv">{t.expT}</h2>
        <div className="steps">{t.exp.map(([a, b]) => <div key={a} className="rv"><b>{a}</b><span>{b}</span></div>)}</div>
        <p className="tools-l rv"><strong>{t.toolsT}:</strong> {t.tools}</p></div></section>

      <section id="partners" className="sec"><div className="wrap"><p className="eyebrow rv">05</p><h2 className="rv">{t.partT}</h2><p className="big rv">{t.partP}</p>
        <div className="partners rv"><div><b>{t.p1}</b><span>{t.role}</span></div><i aria-hidden="true">+</i><div><b>{t.p2}</b><span>{t.p2s}</span></div></div></div></section>

      <section id="contact" className="sec dark contact"><FlowLines cls="lines bg" /><div className="wrap"><p className="eyebrow rv">06</p><h2 className="rv">{t.conT}</h2><p className="big rv">{t.conP}</p>
        <div className="cgrid rv"><div><small>{t.uae}</small><a href={`tel:${C.uae}`}>{C.uaeShow}</a><div className="btns"><a className="btn gold" href={wa(C.uae)} target="_blank" rel="noopener">{t.wa}</a><a className="btn" href={`tel:${C.uae}`}>{t.call}</a></div></div>
          <div><small>{t.sudan}</small><a href={`tel:${C.sudan}`}>{C.sudanShow}</a><div className="btns"><a className="btn gold" href={wa(C.sudan)} target="_blank" rel="noopener">{t.wa}</a><a className="btn" href={`tel:${C.sudan}`}>{t.call}</a></div></div>
          <div><small>{t.mailL}</small><a href={`mailto:${C.email}`}>{C.email}</a><div className="btns"><a className="btn gold" href={`mailto:${C.email}`}>{t.mail}</a></div></div></div></div></section>
    </main>
    <footer><div className="wrap"><img src="./assets/img/logo.png" alt={t.logoAlt} /><p>© {new Date().getFullYear()} {t.name}. {t.rights}</p></div></footer>
    {open && <Project p={open} lang={lang} t={t} onClose={() => setOpen(null)} zoom={setLb} />}
    {lb && <Lightbox src={lb.src} alt={lb.alt} t={t} onClose={() => setLb(null)} />}
  </>)
}
