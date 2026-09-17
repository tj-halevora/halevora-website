import LiquidServiceIcon from '@/components/liquid-service-icon';

export default function ServiceIllustration({ index }) {
  const drawings = [
    <g key="representation">
      <circle cx="120" cy="78" r="34"/><path data-part="fade" d="M40 78H86M154 78H200M120 22V44M120 112V140"/>
      <g data-part="left"><circle cx="30" cy="78" r="10"/></g><g data-part="right"><circle cx="210" cy="78" r="10"/></g><g data-part="top"><circle cx="120" cy="16" r="6"/></g>
      <path data-part="check" d="m106 78 10 10 20-22"/>
    </g>,
    <g key="schedule">
      <g data-part="frame"><rect x="49" y="28" width="142" height="108" rx="12"/><path d="M49 58H191M80 18V39M160 18V39"/></g>
      {[0,1,2,3,4,5].map(i=><circle key={i} data-part="date" style={{'--part-delay': `${.35+i*.12}s`}} cx={80+(i%3)*40} cy={i<3?81:111} r="5"/>)}
    </g>,
    <g key="production">
      <rect x="44" y="57" width="152" height="80" rx="9"/>
      <g data-part="clapper"><path d="M44 37H196V57H44ZM60 37l18 20M98 37l18 20M136 37l18 20M174 37l18 20"/></g>
      <path data-part="play" d="m105 72 35 23-35 23Z"/>
    </g>,
    <g key="audience">
      <circle data-part="ring" style={{'--part-delay':'.25s'}} cx="120" cy="78" r="54"/><circle data-part="ring" cx="120" cy="78" r="32"/>
      <g data-part="fade"><circle cx="120" cy="70" r="7"/><path d="M107 91c0-17 26-17 26 0"/><circle cx="66" cy="78" r="7"/><circle cx="174" cy="78" r="7"/><circle cx="120" cy="24" r="7"/></g>
    </g>,
    <g key="funnel">
      <path d="M38 30H202L149 85V122L120 142V85ZM70 55H170M94 78H146"/>
      {[71,120,169].map((x,i)=><g key={x} data-part="flow" style={{'--flow-x':`${(132-x)*.85}px`,'--part-delay':`${i*.16}s`}}><circle cx={x} cy="17" r="4" fill="currentColor"/></g>)}
      <circle data-part="outcome" cx="134" cy="114" r="4" fill="currentColor"/>
    </g>,
    <g key="partners">
      <g data-part="left"><rect x="34" y="48" width="104" height="65" rx="32" transform="rotate(-25 86 80)"/></g>
      <g data-part="right"><rect x="102" y="48" width="104" height="65" rx="32" transform="rotate(-25 154 80)"/></g>
      <path data-part="check" d="M112 24l8-12 8 12M112 140l8 12 8-12"/>
    </g>,
  ];
  return <LiquidServiceIcon index={index}><svg className="service-icon-fallback" viewBox="0 0 240 160" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{drawings[index]}</svg></LiquidServiceIcon>;
}
