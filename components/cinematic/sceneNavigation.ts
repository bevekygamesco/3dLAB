export function jumpToChapter(root:HTMLElement|null,index:number,count:number){
 if(!root)return;
 if(root.dataset.chapterDriven==='true'){root.dispatchEvent(new CustomEvent('experience-chapter-request',{detail:index}));return}
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced){root.querySelectorAll<HTMLElement>('[data-chapter-content]')[index]?.scrollIntoView({behavior:'auto',block:'center'});return}
 const distance=Math.max(0,root.offsetHeight-window.innerHeight);
 const target=(index+.5)/count;
 window.scrollTo({top:window.scrollY+root.getBoundingClientRect().top+distance*target,behavior:'smooth'});
}

/** Same-page navigation is covered before the destination is changed. */
export function navigateToSection(id:string){window.dispatchEvent(new CustomEvent('studio-navigate',{detail:id}))}
