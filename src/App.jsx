import { useState, useEffect, useRef } from 'react'
import { projects, categories, services, CONTACT as C } from './data.js'
import { ui } from './i18n.js'

const ids = ['home','about','services','projects','experience','partners','contact']
const wa = (n) => `https://wa.me/${n.replace('+','')}`

function Lightbox({ src, t, onClose }) {
  const [z, setZ] = useState(1)
  useEffect(() => { const k = (e) => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [onClose])
  return (<div className="lb" role="dialog" aria-modal="true">
    <div className="lb-bar"><button onClick={() => setZ(Math.max(1, z - .5))} aria-label="zoom out">−</button><span>{Math.round(z * 100)}%</span><button onClick={() => setZ(Math.min(4, z + .5))} aria-label="zoom in">+</button><button onClick={onClose}>{t.close}</button></div>
    <div className="lb-view"><img src={src} alt="Project drawing or render" style={{ width: `${z * 100}%`, maxWidth: 'none' }} /></div></div>)
}

function Project({ p, lang, t, onClose, zoom }) {
  const L = (o) => o[lang]
  return (<div className="modal" role="dialog" aria-modal="true" aria-label={L(p.title)}>
    <div className="modal-in">
      <button className="x" onClick={onClose} aria-label={t.close}>×</button>
      <p className="eyebrow">{t.cat[p.cat]}</p><h2>{L(p.title)}</h2>
      <dl className="meta"><div><dt>{t.role}</dt><dd>{L(p.role)}</dd></div></dl>
      <div className="two"><div><h3>{t.over}</h3><p>{L(p.overview)}</p></div><div><h3>{t.appr}</h3><p>{L(p.approach)}</p></div></div>
      <h3>{t.scope}</h3><p className="chips">{p.technical.map((x) => <span key={x}>{x}</span>)}</p>
      {p.images.length > 0 && <><h3>{t.imgs}</h3><div className="gal">{p.images.map((s) => <button key={s} onClick={() => zoom(s)}><img loading="lazy" src={s} alt={L(p.title)} /></button>)}</div></>}
      {p.drawings.length > 0 && <><h3>{t.drw}</h3><p className="hint">{t.zoomHint}</p><div className="gal">{p.drawings.map((s) => <button key={s} onClick={() => zoom(s)}><img loading="lazy" src={s} alt={L(p.title)} /></button>)}</div></>}
    </div></div>)
}

export default function App() {
  const [lang, setLang] = useState('en'), [menu, setMenu] = useState(false), [cat, setCat] = useState('all'), [open, setOpen] = useState(null), [lb, setLb] = useState(null)
  const t = ui[lang], rtl = lang === 'ar'
  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = rtl ? 'rtl' : 'ltr' }, [lang, rtl])
  useEffect(() => { document.body.style.overflow = open || lb ? 'hidden' : '' }, [open, lb])
  useEffect(() => { const els = document.querySelectorAll('.rv'); const io = new IntersectionObserver((e) => e.forEach((x) => x.isIntersecting && x.target.classList.add('in')), { threshold: .12 }); els.forEach((e) => io.observe(e)); return () => io.disconnect() }, [cat, lang])
  const list = projects.filter((p) => cat === 'all' || p.cat === cat)
  const go = () => setMenu(false)
  return (<>
    <header className="top"><a href="#home" className="brand"><img src="./assets/img/logo.png" alt="SM — Eng. Saber Mustafa" /><span>Eng. Saber Mustafa</span></a>
      <nav className={menu ? 'open' : ''} aria-label="Main">{ids.map((id, i) => <a key={id} href={`#${id}`} onClick={go}>{t.nav[i]}</a>)}</nav>
      <div className="tools"><div className="lang" role="group" aria-label="Language"><button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button><span>|</span><button className={lang === 'ar' ? 'on' : ''} onClick={() => setLang('ar')}>AR</button></div>
        <button className={`burger ${menu ? 'open' : ''}`} onClick={() => setMenu(!menu)} aria-label="Menu"><i /><i /></button></div></header>
    <main>
      <section id="home" className="hero"><img className="hero-img" src="./assets/img/hero.webp" alt="Contemporary residential building at sunset" fetchpriority="high" />
        <svg className="lines" viewBox="0 0 400 400" aria-hidden="true"><path d="M0 330 C120 330 140 120 400 90" /><path d="M0 380 C160 380 200 160 400 150" /><circle cx="300" cy="120" r="80" /></svg>
        <div className="hero-txt"><p className="eyebrow">{t.tag}</p><h1>Eng. Saber Mustafa</h1><h2>{t.role}</h2><p className="lead">{t.stmt}</p>
          <div className="btns"><a className="btn gold" href="#projects">{t.view}</a><a className="btn" href="#contact">{t.talk}</a></div></div></section>

      <section id="about" className="sec rv"><div className="grid-a"><div><p className="eyebrow">01</p><h2>{t.aboutT}</h2><p className="big">{t.aboutS}</p></div>
        <div className="stack"><div className="card"><h3>{t.simple}</h3><p>{t.simpleT}</p></div><div className="card dark"><h3>{t.proT}</h3><p>{t.proP}</p></div></div></div>
        <div className="phil">{t.phil.map(([a, b]) => <div key={a}><h3>{a}</h3><p>{b}</p></div>)}</div></section>

      <section id="services" className="sec alt"><p className="eyebrow rv">02</p><h2 className="rv">{t.servT}</h2>
        <div className="serv">{services.map((s) => <details key={s.k} className="rv"><summary><span className="ic">{s.icon}</span>{s[lang][0]}</summary><p>{s[lang][1]}</p>{s.tech && <p className="tech">{s.tech[lang]}</p>}</details>)}</div></section>

      <section id="projects" className="sec"><p className="eyebrow rv">03</p><h2 className="rv">{t.projT}</h2>
        <div className="filters">{categories.map((c) => <button key={c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{t.cat[c]}</button>)}</div>
        <div className="cards">{list.map((p, i) => <button key={p.id} className={`pc rv ${i % 3 === 0 ? 'wide' : ''}`} onClick={() => setOpen(p)}>
          <img loading="lazy" src={(p.images[0] || p.drawings[0]).replace('.webp', '-sm.webp')} alt={p.title[lang]} /><span className="cap"><small>{t.cat[p.cat]}</small><b>{p.title[lang]}</b><em>{p.short[lang]}</em></span></button>)}</div></section>

      <section id="experience" className="sec dark"><p className="eyebrow rv">04</p><h2 className="rv">{t.expT}</h2>
        <div className="steps">{t.exp.map(([a, b]) => <div key={a} className="rv"><b>{a}</b><span>{b}</span></div>)}</div>
        <p className="tools-l rv"><strong>{t.toolsT}:</strong> AutoCAD • 3ds Max • ArchiCAD • Lumion • Photoshop</p></section>

      <section id="partners" className="sec"><p className="eyebrow rv">05</p><h2 className="rv">{t.partT}</h2><p className="big rv">{t.partP}</p>
        <div className="partners rv"><div><b>Eng. Saber Mustafa</b><span>{t.role}</span></div><i aria-hidden="true">+</i><div><b>م. مواثق عربي</b><span>Arch. Mawathig Arabi</span></div></div></section>

      <section id="contact" className="sec dark contact"><p className="eyebrow rv">06</p><h2 className="rv">{t.conT}</h2><p className="big rv">{t.conP}</p>
        <div className="cgrid rv"><div><small>{t.uae}</small><a href={`tel:${C.uae}`}>{C.uaeShow}</a><div className="btns"><a className="btn gold" href={wa(C.uae)} target="_blank" rel="noopener">{t.wa}</a><a className="btn" href={`tel:${C.uae}`}>{t.call}</a></div></div>
          <div><small>{t.sudan}</small><a href={`tel:${C.sudan}`}>{C.sudanShow}</a><div className="btns"><a className="btn gold" href={wa(C.sudan)} target="_blank" rel="noopener">{t.wa}</a><a className="btn" href={`tel:${C.sudan}`}>{t.call}</a></div></div>
          <div><small>Email</small><a href={`mailto:${C.email}`}>{C.email}</a><div className="btns"><a className="btn gold" href={`mailto:${C.email}`}>{t.mail}</a></div></div></div></section>
    </main>
    <footer><img src="./assets/img/logo.png" alt="SM logo" /><p>© {new Date().getFullYear()} Eng. Saber Mustafa. {t.rights}</p></footer>
    {open && <Project p={open} lang={lang} t={t} onClose={() => setOpen(null)} zoom={setLb} />}
    {lb && <Lightbox src={lb} t={t} onClose={() => setLb(null)} />}
  </>)
}
