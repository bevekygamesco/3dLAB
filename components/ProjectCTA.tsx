'use client';
import {ArrowUpRight} from 'lucide-react';
import {useStudio} from './StudioProvider';
export default function ProjectCTA(){const {open}=useStudio();return <section className="project-cta"><h2>Your product could be next<em>.</em></h2><p>Bring your ideas to life with a cinematic 3D website or configurator.</p><button className="button coral" onClick={()=>open({kind:'contact'})}>Let’s build it <ArrowUpRight size={20}/></button></section>}
