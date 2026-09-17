import ScrollExpand from '@/components/ScrollExpand';
import HouseGallery from '@/components/house-gallery';

export default function CreatorHouse() {
  return (
    <section id="creator-house" className="creator-house" aria-label="Creator House">
      <ScrollExpand
        src="/videos/hero.mp4"
        mediaType="video"
        alt="A tour of the creator house"
        title="A place to create."
        scrollHint="Scroll to explore"
        useWindowScroll
        startRadius={0}
        scrollDistance={1.5}
        smoothing={0.15}
      >
        <h2 className="creator-house-statement">Create in Crete. A shared setting for content production, creator collaborations and fresh ideas.</h2>
      </ScrollExpand>
      <HouseGallery />
    </section>
  );
}
