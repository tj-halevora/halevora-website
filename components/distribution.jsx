import DistributionDetails from '@/components/distribution-details';
import LiquidHeading from '@/components/liquid-heading';

export default function Distribution() {
  return (
    <section id="distribution" className="distribution-section h-section h-wrap motion-zone" aria-labelledby="distribution-title">
      <header className="h-section-heading" data-reveal>
        
        <h2 id="distribution-title">Built to reach<br /><LiquidHeading id="borders">beyond borders.</LiquidHeading></h2>
        <p>Halevora operates a proprietary device network across 14 countries. Managed devices and accounts support coordinated content distribution when a release goes live.</p>
      </header>
      <DistributionDetails />
      <p className="h-map-note">Country-level network coverage. Routes illustrate connections between markets.</p>
    </section>
  );
}
