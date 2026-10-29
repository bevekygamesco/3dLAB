'use client';
import type {CSSProperties} from 'react';
import {materials} from '@/data/projects';
/** Stationary button hit areas; only the inner decorative sphere animates. */
export default function MaterialSpheres({finish,onSelect,product}:{finish:number;onSelect:(i:number)=>void;product:string}){return <div className="coded-spheres" role="group" aria-label={`${product} material details`}>{[0,1,2,3,4].map((m,i)=><button key={m} type="button" className={`coded-sphere sphere-detail-${i}`} aria-label={`${product}: ${materials[m].name}`} aria-pressed={finish===m} onClick={()=>onSelect(m)}><span aria-hidden="true" style={{backgroundImage:`url(/assets/${materials[m].swatch})`,backgroundSize:'cover'}}/></button>)}</div>}