'use client';
import {useEffect,useRef,useState} from 'react';
import {materials} from '@/data/projects';
export default function ChairModel({finish=0,className=''}:{finish?:number;className?:string}){
 const src=finish?`/assets/chair-finishes/${finish}.webp`:'/assets/chair.webp';const [shown,setShown]=useState(src),[old,setOld]=useState<string|null>(null);const current=useRef(src);
 useEffect(()=>{let dead=false;const image=new Image();image.src=src;image.decode().then(()=>{if(dead||current.current===src)return;setOld(current.current);current.current=src;setShown(src)}).catch(()=>{});return()=>{dead=true}},[src]);
 useEffect(()=>{if(!old)return;const t=setTimeout(()=>setOld(null),400);return()=>clearTimeout(t)},[shown,old]);
 return <span className={`chair-model ${className}`} role="img" aria-label={`Walnut lounge chair in ${materials[finish]?.name}`}>{old&&<img className="chair-model-old" src={old} alt="" aria-hidden="true"/>}<img key={shown} className="chair-model-current" src={shown} width={1400} height={940} decoding="async" alt=""/></span>;
}
