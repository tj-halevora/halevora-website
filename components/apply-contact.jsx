'use client';
import LiquidHeading from '@/components/liquid-heading';

import useSlidingHighlight from '@/components/use-sliding-highlight';

function ContactButton({ href, children }) {
  const { highlight, animateHighlight } = useSlidingHighlight();
  const Tag = href ? 'a' : 'button';
  return <Tag href={href} type={href ? undefined : 'submit'} className={`contact-action${href ? ' contact-careers-link' : ''}`} onPointerEnter={event => animateHighlight(event, true)} onPointerLeave={event => animateHighlight(event, false)}>
    <span ref={highlight} className="contact-action-fill" aria-hidden="true" />
    <span className="contact-action-label">{children}</span><span className="contact-action-arrow" aria-hidden="true">↗</span>
  </Tag>;
}

const contactEmail = 'support@halevora.com';

export default function ApplyContact() {
  function apply(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      `Main platform: ${data.get('platform')}`,
      `Profile: ${data.get('profile')}`,
      `Estimated monthly revenue (USD): ${data.get('revenue')}`,
      '',
      `What I am looking for: ${data.get('message') || 'Not specified'}`,
    ].join('\n');
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent('Creator application - ' + data.get('name'))}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section id="contact" className="apply-contact h-wrap h-section motion-zone" aria-label="Apply and contact">
      <header className="h-section-heading h-contact-heading" data-reveal><h2 id="contact-title">Let’s build<br /><LiquidHeading id="next">what’s next.</LiquidHeading></h2><p>Representation, content, paid media or distribution.<br />Tell Halevora what you want to build.</p></header>
      <div className="apply-panel" data-reveal>
        <h3>Introduce yourself.</h3>
        <form className="creator-application" onSubmit={apply}>
          <label>Name<input name="name" autoComplete="name" required maxLength={100} /></label>
          <label>Email<input name="email" type="email" autoComplete="email" required maxLength={200} /></label>
          <label>Main platform<select name="platform" required defaultValue=""><option value="" disabled>Select a platform</option>{['Instagram', 'TikTok', 'YouTube', 'Twitch', 'Snapchat', 'Facebook', 'X', 'Other'].map(platform => <option key={platform}>{platform}</option>)}</select></label>
          <label>Profile link<input name="profile" type="url" placeholder="https://" required maxLength={500} /></label>
          <label>Estimated monthly revenue (USD)<select name="revenue" required defaultValue=""><option value="" disabled>Select a range</option>{['Not earning yet', 'Under $1,000', '$1,000–$5,000', '$5,000–$20,000', '$20,000–$50,000', '$50,000+', 'Prefer to discuss'].map(range => <option key={range}>{range}</option>)}</select></label>
          <label>What are you looking for? (Optional)<textarea name="message" rows={1} maxLength={1000} /></label>
          <div className="application-wide application-submit">
            <ContactButton>Send application</ContactButton>
            <p className="h-form-note">Opens your email app with your application ready to send.</p>
          </div>
        </form>
      </div>
      <div className="contact-panel" data-reveal>
        <p className="h-eyebrow">PREFER A CONVERSATION?</p>
        <h3>We’re listening.</h3>
        <a className="contact-email" href={`mailto:${contactEmail}`}>{contactEmail}</a>
        <div className="contact-careers">
          <p className="h-eyebrow">BUILD WITH US</p><h3>Your next move?</h3><p>Explore opportunities with the Halevora team.</p>
          <ContactButton href="https://careers.halevorasolutions.com/">Work with us</ContactButton>
        </div>
      </div>
    </section>
  );
}
