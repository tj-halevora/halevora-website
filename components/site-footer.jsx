import Image from 'next/image';
export default function SiteFooter() {
  return <footer className="h-footer"><div className="h-wrap">
    <div className="h-footer-top"><a className="h-footer-brand" href="#top" aria-label="Halevora home"><Image src="/halevora-logo.svg" width={64} height={60} alt="" unoptimized /></a><a href="#top" className="h-back-top">Back to top <span aria-hidden="true">↑</span></a></div>
    <div className="h-footer-links"><div><p className="h-eyebrow">EXPLORE</p><a href="#about">About</a><a href="#services">Services</a><a href="#distribution">Distribution</a><a href="#creator-house">Creator House</a></div><div><p className="h-eyebrow">WORK WITH US</p><a href="#contact">Creator applications</a><a href="mailto:support@halevora.com">support@halevora.com</a><a href="https://careers.halevorasolutions.com/">Careers ↗</a></div><div className="h-footer-statement">Your talent.<br /><em>Our world.</em></div></div>
    <div className="h-footer-bottom"><span>© {new Date().getFullYear()} Halevora Holdings Ltd.</span><span>Global talent, growth &amp; distribution.</span></div>
  </div></footer>;
}
