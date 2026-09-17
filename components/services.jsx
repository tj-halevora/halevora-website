import ServiceShowcase from '@/components/service-showcase';
import LiquidHeading from '@/components/liquid-heading';
import ServiceIllustration from '@/components/service-illustration';
import ServiceCardMotion from '@/components/service-card-motion';
import { liquidIconPalette } from '@/components/liquid-icon-palette';

const services = [
  {
    title: 'Talent Management & Representation',
    description: 'We handle the commercial side of a creator’s work, from negotiating deals to managing brand relationships and rights.',
    details: ['Commercial representation', 'Deal negotiation', 'Brand strategy', 'Rights management'],
  },
  {
    title: 'Account Management & Scheduling',
    description: 'We look after the day-to-day running of social accounts and keep content organised, scheduled and published across platforms.',
    details: ['Account management', 'Publishing schedules', 'Content calendars', 'Platform coordination'],
  },
  {
    title: 'Content Strategy & Production',
    description: 'We plan and produce content around the creator and the platform, developing formats, series and a workable production schedule.',
    details: ['Content planning', 'Formats and series', 'Production', 'Platform-specific content'],
  },
  {
    title: 'Audience Engagement',
    description: 'We manage comments, messages and community activity, helping creators stay in touch with the people following their work.',
    details: ['Community management', 'Comments and replies', 'Direct messages', 'Audience feedback'],
  },
  {
    title: 'Funnel Optimization',
    description: 'We review the steps people take from seeing a post to following or taking action, then improve how those steps connect.',
    details: ['Profile journeys', 'Calls to action', 'Conversion tracking', 'Testing and refinement'],
  },
  {
    title: 'Brand Partnership Coordination',
    description: 'We find suitable brand opportunities, negotiate the terms and coordinate delivery, keeping creators and partners on the same page.',
    details: ['Brand opportunities', 'Contract negotiation', 'Campaign coordination', 'Partnership delivery'],
  },
];

export default function Services() {
  return (
    <section id="services" className="services-section h-section h-wrap motion-zone" aria-labelledby="services-title">
      <header className="h-section-heading" data-reveal>
        
        <h2 id="services-title">We handle the <LiquidHeading id="business">business.</LiquidHeading></h2>
        <p>Representation, account operations, content and partnerships managed together for your creator business.</p>
      </header>
      <ServiceShowcase />
      <div className="services-overview" id="core-services">
        <ServiceCardMotion>
          {services.map((service, index) => (
            <article key={service.title} className="core-service-card" style={{ '--service-color': liquidIconPalette[index].color }}>
              <ServiceIllustration index={index} />
              <div className="core-service-card-top">
                <h3>{service.title}</h3>
                <span className="core-service-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <p>{service.description}</p>
            </article>
          ))}
        </ServiceCardMotion>
      </div>
    </section>
  );
}
