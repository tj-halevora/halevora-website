'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './liquid-icon-lab.module.css';
import { liquidIconPalette } from './liquid-icon-palette';

const icons = liquidIconPalette.map(icon=>[icon.id,icon.label]);

export default function LiquidIconLab() {
  const host = useRef(null);
  const viewer = useRef(null);
  const desired = useRef('partnerships');
  const [selected, setSelected] = useState('partnerships');
  const [status, setStatus] = useState('Preparing the sculpture…');
  const [melt, setMelt] = useState(0);
  const [ready, setReady] = useState(false);
  const [allowMotion, setAllowMotion] = useState(false);
  useEffect(() => {
    const query = matchMedia('(min-width: 1280px) and (prefers-reduced-motion: no-preference)');
    const change = () => setAllowMotion(query.matches);
    change(); query.addEventListener('change', change);
    let cancelled = false;
    import('./liquid-icon-viewer').then(({ createIconViewer }) => {
      if (cancelled) return;
      viewer.current = createIconViewer(host.current, {
        onProgress: setMelt,
        onStatus: (text, loaded) => { setStatus(text); setReady(loaded); },
      });
      viewer.current.load(desired.current);
    }).catch(() => setStatus('The 3D preview could not start. Try a browser with WebGL enabled.'));
    return () => { cancelled = true; query.removeEventListener('change', change); viewer.current?.dispose(); viewer.current = null; };
  }, []);
  function choose(id) {
    desired.current = id;
    setSelected(id); setMelt(0); setReady(false); viewer.current?.load(id);
  }
  return <main className={styles.lab}>
    <header className={styles.header}>
      <Link href="/" className={styles.wordmark}>Halevora</Link>
      <span>Material study · 02</span>
    </header>
    <section className={styles.intro}>
      <p className={styles.eyebrow}>THE SERVICE COLLECTION</p>
      <h1>Cast in <em>colour.</em></h1>
      <p>Six sculpted forms. Six metallic finishes.</p>
    </section>
    <div className={styles.stage} ref={host} role="img" aria-label={`Interactive 3D ${selected} sculpture. Drag to rotate; use the melt slider to inspect its shape.`} />
    <div className={styles.status} aria-live="polite">{status}</div>
    <nav className={styles.choices} aria-label="Select a service sculpture">
      {icons.map(([id, label], i) => <button key={id} onClick={() => choose(id)} aria-pressed={selected === id}>
        <span>0{i + 1}</span>{label}
      </button>)}
    </nav>
    <div className={styles.controls}>
      <label htmlFor="melt-progress">Solid</label>
      <input id="melt-progress" aria-label="Amount of melting" type="range" min="0" max="1" step="0.001" value={melt} disabled={!ready}
        onChange={event => { const value = Number(event.target.value); setMelt(value); viewer.current?.setMelt(value); }} />
      <span>Liquid</span>
      <button disabled={!ready || !allowMotion} onClick={() => viewer.current?.play()}>Melt & reform ↗</button>
      <button disabled={!ready} onClick={() => viewer.current?.reset()}>Reset view</button>
    </div>
    <p className={styles.note}>Drag to inspect the depth · {allowMotion ? 'Play the transformation or explore it with the slider' : 'Explore the melt poses with the slider'}</p>
    <footer className={styles.footer}><span>Halevora / Design development</span><a href={`/models/liquid-icons/${selected}.glb`} download>Download 3D model ↓</a></footer>
  </main>;
}
