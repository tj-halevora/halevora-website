import AboutImageTrail from '@/components/about-image-trail';
import LiquidHeading from '@/components/liquid-heading';
const pillars = [
  ['01', 'Represent.', 'Your talent. Our full support.', 'From your next brand partnership to the day-to-day running of your accounts, we look after the business behind your work.'],
  ['02', 'Engineer.', 'A plan built around you.', 'Content strategy, production and paid media work together, shaped around your audience and the platforms they use.'],
  ['03', 'Distribute.', 'Give your content room to travel.', 'Our managed device network connects accounts and markets, taking your work beyond a single profile or country.'],
];
export default function About() {
  return <section id="about" className="about-section h-section motion-zone" aria-labelledby="about-title">
    <AboutImageTrail /><div className="h-wrap h-about-inner">
      <div className="h-section-heading h-heading-center" data-reveal><h2 id="about-title">Your content.<br /><LiquidHeading id="possibilities">More possibilities.</LiquidHeading></h2><p>Halevora is a holding company focused on creator businesses. We combine commercial representation with content production, paid campaigns and our own device infrastructure.</p></div>
      <div className="h-pillar-grid">{pillars.map(([n,title,line,copy]) => <article className={'h-pillar h-pillar-' + n} key={n} data-reveal data-spotlight>
        <span className="h-small-number">{n}</span><h3>{title}</h3>
        <div className="h-pillar-visual" aria-hidden="true">{n === '01' ? <><i/><i/><i/></> : n === '02' ? <svg viewBox="0 0 240 80"><path d="M0 68H30L50 50H80L110 60L145 25H170L200 10H240" pathLength="1" /></svg> : <><b/><b/><b/></>}</div>
        <h4>{line}</h4><p>{copy}</p>
      </article>)}</div>
    </div>
  </section>;
}
