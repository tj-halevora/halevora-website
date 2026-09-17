'use client';
import LiquidHeading from '@/components/liquid-heading';
import { useState } from 'react';
const channels = [
  ['Meta Ads', 'Instagram, Facebook', 'Creative and audience testing across Instagram and Facebook. We manage campaigns and refine the approach around clicks, follows and conversions.', ['Audience strategy', 'Creative testing', 'Campaign optimisation']],
  ['Google Ads', 'Search, Display, YouTube', 'Reach people as they search, browse and watch. We coordinate search, display and YouTube campaigns around the action you want people to take.', ['Search intent', 'Display placement', 'YouTube campaigns']],
  ['TikTok Ads', 'In-feed, Spark', 'Bring paid reach to short-form content. We plan in-feed and Spark campaigns with creative that belongs on TikTok.', ['Platform-native creative', 'In-feed campaigns', 'Spark campaigns']],
  ['Snapchat Ads', 'Story, Spotlight', 'Paid campaigns shaped around Snapchat’s viewing habits, with creative and distribution planned together.', ['Story creative', 'Audience targeting', 'Campaign management']],
  ['Reddit Ads', 'Community targeting', 'Reach relevant communities with a considered message. We build campaigns around audience interests and the context in which people discover your content.', ['Community research', 'Contextual creative', 'Performance review']],
  ['Web Placement', 'Sponsored across sites', 'Extend your reach beyond social feeds. We buy paid placements across external websites and review spend against the results they deliver.', ['Placement planning', 'CPC buying', 'Click & conversion review']],
];
export default function PaidMedia() {
  const [active, setActive] = useState(0);
  return <section id="paid-media" className="h-section h-paid-media motion-zone" aria-labelledby="paid-title"><div className="h-wrap">
    <header className="h-section-heading h-heading-center" data-reveal><h2 id="paid-title">Make attention<br /><LiquidHeading id="further">go further.</LiquidHeading></h2><p>A dedicated CPC buying operation across social platforms and the open web. Strategy, creative, placement and optimisation in one place.</p></header>
    <div className="h-paid-dashboard" data-reveal data-spotlight>
      <div className="h-dashboard-top"><span>HALEVORA PAID MEDIA</span><span>STRATEGY, EXECUTION, REFINEMENT</span></div>
      <div className="h-paid-dashboard-grid"><div className="h-cpc-visual" aria-hidden="true"><svg viewBox="0 0 240 240"><circle cx="120" cy="120" r="105" /><circle className="h-cpc-ring" cx="120" cy="120" r="105" /><circle cx="120" cy="120" r="82" /></svg><div><strong>CPC</strong><span>COST PER CLICK</span></div></div>
        <div className="h-paid-channel-grid" aria-label="Paid media channels">{channels.map(([name,caption],i) => <button key={name} type="button" aria-pressed={active === i} aria-controls="paid-channel-detail" onClick={() => setActive(i)}><span><strong>{name}</strong><small>{caption}</small></span><span aria-hidden="true">{active === i ? '↗' : '+'}</span></button>)}</div>
      </div>
      <div className="h-paid-detail" id="paid-channel-detail" aria-live="polite"><div><p className="h-eyebrow">{channels[active][0]}</p><p>{channels[active][2]}</p></div><ul>{channels[active][3].map(item => <li key={item}>{item}</li>)}</ul></div>
    </div>
    <div className="h-paid-footer" data-reveal><p>From the first click to the next opportunity.<br /><span>We connect the whole journey.</span></p><a href="#contact" className="h-text-link">Discuss your campaign <span aria-hidden="true">↗</span></a></div>
  </div></section>;
}
