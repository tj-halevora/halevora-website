import { Count } from '@/components/design-primitives';
import PlatformMarquee from '@/components/platform-marquee';

export default function Reach() {
  return <section id="impact" className="h-section h-impact motion-zone" aria-labelledby="impact-title">
    <div className="h-wrap">
      <div className="h-impact-top" data-reveal><h2 id="impact-title"><Count value={10} suffix="B+" /></h2><h3>Monthly impressions.<br /><span>Across Halevora’s operations.</span></h3><p>The scale behind our creator operations.<br />Publishing, paid campaigns and a managed distribution network.</p></div>
      <div className="h-flow-chart" data-reveal data-spotlight>
        <div className="h-chart-caption"><span>THE DISTRIBUTION CYCLE</span><span>One connected system <i className="h-status-dot" /></span></div>
        <svg viewBox="0 0 1000 230" aria-hidden="true" preserveAspectRatio="none">
          <defs><linearGradient id="h-chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#A995C9" stopOpacity=".28" /><stop offset="1" stopColor="#A995C9" stopOpacity="0" /></linearGradient></defs>
          <path className="h-chart-area" d="M0 200C80 200 80 150 170 160S260 65 330 110S390 180 460 135S530 55 600 80S700 100 770 50S910 40 1000 8V230H0Z" fill="url(#h-chart-fill)" />
          <path className="h-chart-line" pathLength="1" d="M0 200C80 200 80 150 170 160S260 65 330 110S390 180 460 135S530 55 600 80S700 100 770 50S910 40 1000 8" />
          <path className="h-chart-signal" d="M0 200C80 200 80 150 170 160S260 65 330 110S390 180 460 135S530 55 600 80S700 100 770 50S910 40 1000 8" />
        </svg>
        <div className="h-chart-stages"><span>01 CREATE</span><span>02 PUBLISH</span><span>03 DISTRIBUTE</span><span>04 GROW</span></div>
      </div>
      <div className="h-reach-grid">
        <div className="h-reach-visual" data-reveal aria-hidden="true">
          
          <div className="h-reach-bars">{[28,46,38,62,51,77,68,95].map((height,i) => <div key={i} style={{ '--bar-height': height + '%', '--delay': i * -.4 + 's' }}><i /></div>)}</div>
          <span className="h-reach-visual-caption">CONTENT, CONNECTION, POSSIBILITY</span>
        </div>
        <div className="h-reach-copy" data-reveal><Count value={400} suffix="M+" className="h-reach-number" /><h3>Daily reach.<br />Through Halevora’s distribution network.</h3><PlatformMarquee showControls={false} />
          <div className="h-reach-stat-grid"><div><Count value={800} suffix="M+" /><span>Followers managed</span></div><div><Count value={8} suffix="K+" /><span>Managed accounts</span></div><div><Count value={120} suffix="M+" /><span>Clicks driven</span></div></div>
        </div>
      </div>
    </div>
  </section>;
}
