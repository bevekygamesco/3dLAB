'use client';
import {useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {projects} from '@/data/projects';
import {useStudio} from './StudioProvider';
const paints=[{name:'Pearl silver',color:'#b9bdbe',filter:'none'},{name:'Warm titanium',color:'#a49279',filter:'sepia(.32) saturate(.75)'},{name:'Graphite',color:'#45484c',filter:'brightness(.65) saturate(.35)'}];
export default function CarProcessPreview(){const [paint,setPaint]=useState(0);const {open}=useStudio();return <div className="car-process-app"><div className="car-app-render"><img src="/assets/process-car-finished.webp" alt="Fully rendered silver sports car configurator preview" loading="lazy" style={{filter:paints[paint].filter}}/><span>GT / ELECTRIC</span></div><aside className="car-app-options"><small>YOUR CONFIGURATION</small><strong>Make it yours.</strong><label>PAINT FINISH</label><span>{paints[paint].name}</span><div className="car-app-swatches">{paints.map((p,i)=><button key={p.name} aria-label={`Car preview: ${p.name}`} aria-pressed={paint===i} style={{backgroundColor:p.color}} onClick={()=>setPaint(i)}/>)}</div><label>WHEELS</label><span>21″ / Forged alloy</span><label>INTERIOR</label><span>Premium / Charcoal</span><button className="car-app-open" onClick={()=>open({kind:'demo',project:projects[5]})}>Explore demo <ArrowUpRight size={12}/></button></aside></div>}
