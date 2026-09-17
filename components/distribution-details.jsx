import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import world from 'world-atlas/countries-110m.json';
import { Count } from '@/components/design-primitives';

const countries = [
  ['Netherlands', 5.3, 52.1], ['Germany', 10.5, 51.2],
  ['United Kingdom', -2.5, 54], ['UAE', 54, 24],
  ['Poland', 19.1, 52], ['Spain', -3.7, 40.4],
  ['Romania', 25, 46], ['Türkiye', 35.2, 39],
  ['United States', -98, 39], ['Brazil', -51.9, -14.2],
  ['Singapore', 103.8, 1.35], ['Philippines', 122, 12.9],
  ['South Africa', 24, -29], ['India', 79, 22],
];

const networkFigures = [
  ['14', 'Countries'], ['40+', 'Device nodes'],
  ['8K+', 'Managed accounts'], ['400M+', 'Daily reach'],
];
const widerFigures = [
  ['800M+', 'Followers managed'], ['10B+', 'Monthly impressions'], ['120M+', 'Clicks driven'],
];

function NetworkMap() {
  const geography = feature(world, world.objects.countries);
  const land = { ...geography, features: geography.features.filter((country) => String(country.id) !== '010') };
  const projection = geoNaturalEarth1().fitExtent([[28, 24], [972, 446]], land);
  const path = geoPath(projection);
  return (
    <svg className="network-map" viewBox="0 0 1000 470" role="group" aria-labelledby="network-map-title network-map-description">
      <title id="network-map-title">Halevora distribution network</title>
      <desc id="network-map-description">Country-level coverage in {countries.map(([name]) => name).join(', ')}. Markers indicate countries, not individual device locations.</desc>
      <defs>
        <pattern id="network-land-dots" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="0.95" fill="#806894" opacity="0.72" />
        </pattern>
      </defs>
      <path d={path(land)} fill="#eee8f3" stroke="#b6a3c9" strokeWidth="0.45" />
      <path d={path(land)} fill="url(#network-land-dots)" />
      <g className="h-map-routes" aria-hidden="true">{countries.map(([name, longitude, latitude], i) => {
        const [x,y] = projection([longitude, latitude]);
        const [ox,oy] = projection([24,-29]);
        const route = 'M' + ox + ' ' + oy + ' Q' + ((ox+x)/2) + ' ' + (Math.min(y,oy)-70) + ' ' + x + ' ' + y;
        return <g key={name}><path d={route} /><path d={route} className="h-map-stream" style={{ animationDelay: -i * .8 + 's' }} /></g>;
      })}</g>
      {countries.map(([name, longitude, latitude]) => {
        const [x, y] = projection([longitude, latitude]);
        return (
          <g key={name} className="network-marker" tabIndex={0} role="img" aria-label={name} transform={`translate(${x}, ${y})`}>
            <circle r="9" fill="#A995C9" opacity="0.28" />
            <circle r="4" fill="#8052ad" stroke="#f7f5ef" strokeWidth="1.2" />
            <circle r="12" fill="transparent" />
            <g className="network-tooltip" aria-hidden="true">
              <rect x={-(name.length * 9 + 24) / 2} y="-48" width={name.length * 9 + 24} height="30" rx="3" />
              <path d="M-5 -18 L0 -13 L5 -18 Z" />
              <text x="0" y="-28" textAnchor="middle">{name}</text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

export default function DistributionDetails() {
  return (
    <div className="distribution-details" data-reveal>
      <section className="distribution-coverage" aria-label="Network coverage and figures">
        <div className="network-map-visual"><NetworkMap /></div>
        <ul className="network-countries" aria-label="Network countries">
          {countries.map(([name]) => <li key={name}>{name}</li>)}
        </ul>
        <dl className="network-figures">
          {[...networkFigures, ...widerFigures].map(([value, label]) => (
            <div key={label}><dt>{label}</dt><dd><Count value={parseInt(value)} suffix={value.replace(/^\d+/, '')} /></dd></div>
          ))}
        </dl>
      </section>
    </div>
  );
}
