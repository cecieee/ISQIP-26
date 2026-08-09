import { useRef, useEffect, useState } from 'react';

class Grad {
  constructor(x,y,z){ this.x=x; this.y=y; this.z=z; }
  dot2(x,y){ return this.x*x+this.y*y; }
}
class Noise {
  constructor(seed=0){
    this.grad3=[new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];
    this.p=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
    this.perm=new Array(512); this.gradP=new Array(512); this.seed(seed);
  }
  seed(s){
    if(s>0&&s<1)s*=65536; s=Math.floor(s); if(s<256)s|=s<<8;
    for(let i=0;i<256;i++){
      const v=i&1?this.p[i]^(s&255):this.p[i]^((s>>8)&255);
      this.perm[i]=this.perm[i+256]=v;
      this.gradP[i]=this.gradP[i+256]=this.grad3[v%12];
    }
  }
  fade(t){return t*t*t*(t*(t*6-15)+10);}
  lerp(a,b,t){return(1-t)*a+t*b;}
  perlin2(x,y){
    let X=Math.floor(x),Y=Math.floor(y); x-=X; y-=Y; X&=255; Y&=255;
    const n00=this.gradP[X+this.perm[Y]].dot2(x,y);
    const n01=this.gradP[X+this.perm[Y+1]].dot2(x,y-1);
    const n10=this.gradP[X+1+this.perm[Y]].dot2(x-1,y);
    const n11=this.gradP[X+1+this.perm[Y+1]].dot2(x-1,y-1);
    const u=this.fade(x);
    return this.lerp(this.lerp(n00,n10,u),this.lerp(n01,n11,u),this.fade(y));
  }
}

function Waves({ lineColor='rgba(12,230,68,0.18)', backgroundColor='transparent', waveSpeedX=0.0125, waveSpeedY=0.005, waveAmpX=32, waveAmpY=16, xGap=10, yGap=32, friction=0.925, tension=0.005, maxCursorMove=100, style={}, className='' }) {
  const containerRef=useRef(null), canvasRef=useRef(null), ctxRef=useRef(null);
  const boundingRef=useRef({width:0,height:0,left:0,top:0});
  const noiseRef=useRef(new Noise(Math.random())), linesRef=useRef([]);
  const mouseRef=useRef({x:-10,y:0,lx:0,ly:0,sx:0,sy:0,v:0,vs:0,a:0,set:false});
  const cfgRef=useRef({lineColor,waveSpeedX,waveSpeedY,waveAmpX,waveAmpY,friction,tension,maxCursorMove,xGap,yGap});
  const frameRef=useRef(null);
  useEffect(()=>{ cfgRef.current={lineColor,waveSpeedX,waveSpeedY,waveAmpX,waveAmpY,friction,tension,maxCursorMove,xGap,yGap}; },[lineColor,waveSpeedX,waveSpeedY,waveAmpX,waveAmpY,friction,tension,maxCursorMove,xGap,yGap]);
  useEffect(()=>{
    const canvas=canvasRef.current, container=containerRef.current;
    ctxRef.current=canvas.getContext('2d');
    function setSize(){ boundingRef.current=container.getBoundingClientRect(); canvas.width=boundingRef.current.width; canvas.height=boundingRef.current.height; }
    function setLines(){
      const{width,height}=boundingRef.current; linesRef.current=[];
      const{xGap,yGap}=cfgRef.current; const oW=width+200,oH=height+30;
      const tL=Math.ceil(oW/xGap),tP=Math.ceil(oH/yGap);
      const xS=(width-xGap*tL)/2,yS=(height-yGap*tP)/2;
      for(let i=0;i<=tL;i++){ const pts=[]; for(let j=0;j<=tP;j++) pts.push({x:xS+xGap*i,y:yS+yGap*j,wave:{x:0,y:0},cursor:{x:0,y:0,vx:0,vy:0}}); linesRef.current.push(pts); }
    }
    function movePoints(time){
      const lines=linesRef.current,mouse=mouseRef.current,noise=noiseRef.current;
      const{waveSpeedX,waveSpeedY,waveAmpX,waveAmpY,friction,tension,maxCursorMove}=cfgRef.current;
      lines.forEach(pts=>{ pts.forEach(p=>{
        const mv=noise.perlin2((p.x+time*waveSpeedX)*0.002,(p.y+time*waveSpeedY)*0.0015)*12;
        p.wave.x=Math.cos(mv)*waveAmpX; p.wave.y=Math.sin(mv)*waveAmpY;
        const dx=p.x-mouse.sx,dy=p.y-mouse.sy,dist=Math.hypot(dx,dy),l=Math.max(175,mouse.vs);
        if(dist<l){ const s=1-dist/l,f=Math.cos(dist*0.001)*s; p.cursor.vx+=Math.cos(mouse.a)*f*l*mouse.vs*0.00065; p.cursor.vy+=Math.sin(mouse.a)*f*l*mouse.vs*0.00065; }
        p.cursor.vx+=(0-p.cursor.x)*tension; p.cursor.vy+=(0-p.cursor.y)*tension;
        p.cursor.vx*=friction; p.cursor.vy*=friction;
        p.cursor.x+=p.cursor.vx*2; p.cursor.y+=p.cursor.vy*2;
        p.cursor.x=Math.min(maxCursorMove,Math.max(-maxCursorMove,p.cursor.x));
        p.cursor.y=Math.min(maxCursorMove,Math.max(-maxCursorMove,p.cursor.y));
      }); });
    }
    function moved(pt,wc=true){ return{x:Math.round((pt.x+pt.wave.x+(wc?pt.cursor.x:0))*10)/10,y:Math.round((pt.y+pt.wave.y+(wc?pt.cursor.y:0))*10)/10}; }
    function drawLines(){
      const{width,height}=boundingRef.current,ctx=ctxRef.current;
      ctx.clearRect(0,0,width,height); ctx.beginPath(); ctx.strokeStyle=cfgRef.current.lineColor;
      linesRef.current.forEach(points=>{ let p1=moved(points[0],false); ctx.moveTo(p1.x,p1.y);
        points.forEach((p,idx)=>{ const isLast=idx===points.length-1; p1=moved(p,!isLast); const p2=moved(points[idx+1]||points[points.length-1],!isLast); ctx.lineTo(p1.x,p1.y); if(isLast)ctx.moveTo(p2.x,p2.y); }); });
      ctx.stroke();
    }
    function tick(t){
      const m=mouseRef.current; m.sx+=(m.x-m.sx)*0.1; m.sy+=(m.y-m.sy)*0.1;
      const dx=m.x-m.lx,dy=m.y-m.ly,d=Math.hypot(dx,dy);
      m.v=d; m.vs+=(d-m.vs)*0.1; m.vs=Math.min(100,m.vs); m.lx=m.x; m.ly=m.y; m.a=Math.atan2(dy,dx);
      movePoints(t); drawLines(); frameRef.current=requestAnimationFrame(tick);
    }
    function onResize(){ setSize(); setLines(); }
    function updateMouse(x,y){ const m=mouseRef.current,b=boundingRef.current; m.x=x-b.left; m.y=y-b.top; if(!m.set){m.sx=m.x;m.sy=m.y;m.lx=m.x;m.ly=m.y;m.set=true;} }
    setSize(); setLines(); frameRef.current=requestAnimationFrame(tick);
    const onMove=e=>updateMouse(e.clientX,e.clientY);
    const onTouch=e=>updateMouse(e.touches[0].clientX,e.touches[0].clientY);
    window.addEventListener('resize',onResize);
    window.addEventListener('mousemove',onMove);
    window.addEventListener('touchmove',onTouch,{passive:false});
    return()=>{ window.removeEventListener('resize',onResize); window.removeEventListener('mousemove',onMove); window.removeEventListener('touchmove',onTouch); cancelAnimationFrame(frameRef.current); };
  },[]);
  return(
    <div ref={containerRef} className={`waves-wrap ${className}`} style={{position:'absolute',inset:0,overflow:'hidden',backgroundColor,...style}}>
      <canvas ref={canvasRef} style={{display:'block',width:'100%',height:'100%'}}/>
    </div>
  );
}

function Antigravity({
  count=300, magnetRadius=6, ringRadius=7, waveSpeed=0.4,
  waveAmplitude=1, particleSize=1.5, lerpSpeed=0.05,
  color='#0CE644', autoAnimate=true, particleVariance=1,
}) {
  const canvasRef = useRef(null);
  const stateRef  = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    
    const hex2rgb = hex => {
      const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return r ? [parseInt(r[1],16), parseInt(r[2],16), parseInt(r[3],16)] : [12,230,68];
    };
    const [cr,cg,cb] = hex2rgb(color);

    
    const verts4 = [];
    for (let i=0;i<16;i++) {
      verts4.push([
        (i&1)?1:-1, (i&2)?1:-1, (i&4)?1:-1, (i&8)?1:-1
      ]);
    }
    
    const edges = [];
    for (let a=0;a<16;a++) for (let b=a+1;b<16;b++) {
      let diff=0; for(let k=0;k<4;k++) if(verts4[a][k]!==verts4[b][k]) diff++;
      if(diff===1) edges.push([a,b]);
    }

    
    const particles = [];
    for (let i=0;i<count;i++) {
      const ei = Math.floor(Math.random()*edges.length);
      const t  = Math.random();
      const phase = Math.random()*Math.PI*2;
      const variance = (Math.random()-0.5)*particleVariance*0.4;
      particles.push({ ei, t, phase, variance,
        x:0, y:0, tx:0, ty:0, vx:0, vy:0 });
    }

    let rot1=0, rot2=0, rot3=0, rot4=0;
    let mx=-9999, my=-9999;
    let W=0, H=0, cx2=0, cy2=0;
    let raf=0;

    const resize = () => {

      const r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width  = Math.round(r.width);
      H = canvas.height = Math.round(r.height);
      cx2 = W * 0.55; cy2 = H / 2;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    resize();

    const onMove = e => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => { mx=-9999; my=-9999; };
    canvas.addEventListener('mousemove', onMove, {passive:true});
    canvas.addEventListener('mouseleave', onLeave);

    
    const rot4D = (v, a, b, angle) => {
      const c = Math.cos(angle), s = Math.sin(angle);
      const nv = [...v];
      nv[a] = v[a]*c - v[b]*s;
      nv[b] = v[a]*s + v[b]*c;
      return nv;
    };
    const project4to2 = (v4, scale) => {
      let v = [...v4];
      v = rot4D(v,0,1,rot1); v = rot4D(v,0,2,rot2);
      v = rot4D(v,1,2,rot3); v = rot4D(v,2,3,rot4);

      const w3 = 2/(3-v[3]);
      const x3 = v[0]*w3, y3 = v[1]*w3, z3 = v[2]*w3;

      const w2 = 2/(4-z3);
      return [cx2 + x3*w2*scale, cy2 + y3*w2*scale];
    };

    const t0 = performance.now();
    const loop = now => {
      const t = (now - t0)*0.001;
      if (autoAnimate) {
        rot1 = t * waveSpeed * 0.31;
        rot2 = t * waveSpeed * 0.19;
        rot3 = t * waveSpeed * 0.23;
        rot4 = t * waveSpeed * 0.17;
      }

      ctx.clearRect(0,0,W,H);

      const scale = Math.min(W,H) * 0.28 * ringRadius * 0.17;

      
      for (const [a,b] of edges) {
        const [ax,ay] = project4to2(verts4[a], scale);
        const [bx,by] = project4to2(verts4[b], scale);

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.12)`;
        ctx.lineWidth   = 5;
        ctx.moveTo(ax,ay); ctx.lineTo(bx,by);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.65)`;
        ctx.lineWidth   = 1;
        ctx.moveTo(ax,ay); ctx.lineTo(bx,by);
        ctx.stroke();
      }

      
      for (const v of verts4) {
        const [vx2, vy2] = project4to2(v, scale);
        ctx.beginPath();
        ctx.arc(vx2, vy2, 3.5, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},0.9)`;
        ctx.fill();
      }

      
      const repelDist = Math.min(W,H) * magnetRadius * 0.015;

      for (const p of particles) {
        const [va, vb] = edges[p.ei];
        const pa = verts4[va], pb = verts4[vb];
        const lerp = (a,b,t) => a+(b-a)*t;
        const v4 = pa.map((a,i) => lerp(a, pb[i], p.t));

        v4[0] += Math.sin(p.phase + t*waveSpeed*2)*waveAmplitude*0.08*p.variance;
        v4[1] += Math.cos(p.phase + t*waveSpeed*1.7)*waveAmplitude*0.08*p.variance;

        const [px2, py2] = project4to2(v4, scale);

        const dx = px2 - mx, dy = py2 - my;
        const dist = Math.hypot(dx, dy);
        let tx = px2, ty = py2;
        if (dist < repelDist && dist > 0.1) {
          const force = (1 - dist/repelDist) * repelDist * 0.6;
          tx += (dx/dist)*force;
          ty += (dy/dist)*force;
        }

        p.x += (tx - p.x) * lerpSpeed;
        p.y += (ty - p.y) * lerpSpeed;

        const alpha = 0.55 + Math.random()*0.45;
        ctx.beginPath();
        ctx.arc(p.x, p.y, particleSize, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    stateRef.current = { raf };
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [count, magnetRadius, ringRadius, waveSpeed, waveAmplitude,
      particleSize, lerpSpeed, color, autoAnimate, particleVariance]);

  return (
    <div style={{position:'absolute',inset:'-20% -35% -20% -15%',pointerEvents:'auto'}}>
      <canvas ref={canvasRef} style={{display:'block',width:'100%',height:'100%'}}/>
    </div>
  );
}

const EVENT_DATE = new Date('2026-11-01T09:00:00');
function useCountdown(target) {
  function calc(t){ const d=Math.max(0,t-Date.now()); return {days:Math.floor(d/86400000),hours:Math.floor((d%86400000)/3600000),minutes:Math.floor((d%3600000)/60000),seconds:Math.floor((d%60000)/1000)}; }
  const [timeLeft,setTimeLeft]=useState(()=>calc(target));
  useEffect(()=>{ const id=setInterval(()=>setTimeLeft(calc(target)),1000); return()=>clearInterval(id); },[target]);
  return timeLeft;
}

function CountDown() {
  const {days,hours,minutes,seconds}=useCountdown(EVENT_DATE);
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const units=[{label:'DAYS',value:days},{label:'HOURS',value:hours},{label:'MINUTES',value:minutes},{label:'SECONDS',value:seconds}];
  return(
    <div ref={wrapRef} style={{display:'flex',flexDirection:'column',alignItems:'center',transition:'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)',opacity:visible?1:0,transform:visible?'translateY(0)':'translateY(32px)'}}>
      <p style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'0.72rem',color:'rgba(12,230,68,0.5)',letterSpacing:'0.28em',textTransform:'uppercase',marginBottom:'2rem',textAlign:'center'}}>Event Starts In</p>
      <div style={{display:'flex',gap:'clamp(0.8rem,2vw,1.4rem)',flexWrap:'wrap',justifyContent:'center'}}>
        {units.map(({label,value},i)=>(
          <div key={label} style={{background:'rgba(12,230,68,0.05)',border:'1px solid rgba(12,230,68,0.18)',borderRadius:'12px',padding:'clamp(1rem,2.5vw,1.4rem) clamp(1.2rem,3vw,2rem)',display:'flex',flexDirection:'column',alignItems:'center',minWidth:'clamp(80px,12vw,110px)',backdropFilter:'blur(6px)',transition:`opacity 0.6s ease ${i*0.1}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i*0.1}s`,opacity:visible?1:0,transform:visible?'translateY(0)':'translateY(20px)'}}>
            <span style={{fontFamily:"'Bruno Ace',cursive",fontSize:'clamp(2.4rem,5vw,3.8rem)',color:'#0CE644',lineHeight:1,textShadow:'0 0 18px rgba(12,230,68,0.55)',letterSpacing:'0.04em'}}>{String(value).padStart(2,'0')}</span>
            <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'0.62rem',color:'rgba(12,230,68,0.45)',letterSpacing:'0.2em',marginTop:'0.5rem'}}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const HERO_STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@300;400;500;600;700&display=swap");
  @import url('https://fonts.googleapis.com/css2?family=Bruno+Ace&display=swap');
  .hero-section{background-image:radial-gradient(circle,rgba(12,230,68,0.055) 1px,transparent 1px);background-size:28px 28px;}
  .hero-section::before{content:"";pointer-events:none;position:absolute;inset:0;z-index:3;background:repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,0.12) 3px,rgba(0,0,0,0.12) 4px);mix-blend-mode:multiply;}
  .hero-headline{font-family:'Mechsuit',sans-serif;color:rgba(12,230,68,0.72);text-shadow:0 0 8px rgba(12,230,68,0.4),0 0 28px rgba(12,230,68,.28),0 0 60px rgba(12,230,68,.12);line-height:0.9;letter-spacing:-0.01em;margin:0 0 0.2rem;}
  @keyframes h-glitch{0%{clip-path:inset(0 0 96% 0);transform:translate(-2px,0)}20%{clip-path:inset(35% 0 45% 0);transform:translate(2px,0)}45%{clip-path:inset(65% 0 15% 0);transform:translate(-1px,0)}65%{clip-path:inset(0 0 0 0);transform:translate(0,0)}100%{clip-path:inset(0 0 0 0);transform:translate(0,0)}}
  @keyframes h-glitch-2{0%{clip-path:inset(75% 0 8% 0);transform:translate(3px,0);opacity:.55}30%{clip-path:inset(15% 0 65% 0);transform:translate(-2px,0);opacity:.35}55%{opacity:0}100%{opacity:0}}
  .hero-hl-wrap{position:relative;display:inline-block;}
  .hero-hl-wrap::before,.hero-hl-wrap::after{content:attr(data-text);position:absolute;inset:0;font-family:'Mechsuit',sans-serif;line-height:0.9;pointer-events:none;opacity:0;}
  .hero-hl-wrap:hover::before{color:rgba(12,230,68,0.72);text-shadow:0 0 8px rgba(12,230,68,0.4);animation:h-glitch .4s steps(1) forwards;opacity:1;}
  .hero-hl-wrap:hover::after{color:#FFAA33;animation:h-glitch-2 .4s steps(1) forwards;opacity:1;}
  @keyframes btn-flicker{0%{opacity:.6}20%{opacity:1}40%{opacity:.7}60%{opacity:1}100%{opacity:1}}
  .hero-btn-primary{display:inline-flex;align-items:center;gap:8px;text-decoration:none;padding:14px 34px;border-radius:4px;font-size:.88rem;letter-spacing:.1em;text-transform:uppercase;font-weight:700;font-family:'Inter',sans-serif;color:#0A0D0A;background:#0CE644;border:none;cursor:pointer;transition:box-shadow .2s,transform .1s;white-space:nowrap;}
  .hero-btn-primary:hover{animation:btn-flicker .3s ease forwards;box-shadow:0 0 20px rgba(12,230,68,.65),0 0 44px rgba(12,230,68,.28);transform:translateY(-2px);}
  .hero-btn-outline{display:inline-flex;align-items:center;gap:8px;text-decoration:none;padding:13px 30px;border-radius:4px;font-size:.88rem;letter-spacing:.1em;text-transform:uppercase;font-weight:500;font-family:'Inter',sans-serif;color:#0CE644;background:transparent;border:1px solid rgba(12,230,68,.55);cursor:pointer;transition:background .2s,box-shadow .2s,border-color .2s,transform .1s;white-space:nowrap;}
  .hero-btn-outline:hover{background:rgba(12,230,68,.08);border-color:#0CE644;box-shadow:0 0 14px rgba(12,230,68,.3);transform:translateY(-2px);}
  @keyframes scroll-line{0%{transform:scaleY(0);transform-origin:top;opacity:1}50%{transform:scaleY(1);transform-origin:top;opacity:1}100%{transform:scaleY(1);transform-origin:bottom;opacity:0}}
  .hero-scroll-line{width:1px;height:36px;background:linear-gradient(to bottom,#0CE644,transparent);animation:scroll-line 1.8s ease-in-out infinite;}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes hero-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
  .hero-inner{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:2rem;width:100%;max-width:1280px;margin:0 auto;padding:clamp(4rem,10vh,7rem) clamp(1.5rem,5vw,4rem);}
  @media(max-width:768px){.hero-inner{grid-template-columns:1fr;}.hero-ag-wrap{height:320px!important;}}
`;

export default function Hero() {
  return (
    <>
      <style>{HERO_STYLES}</style>

      {}
      <section id="home" className="hero-section" style={{position:'relative',height:'100vh',overflow:'hidden',background:'#0A0D0A',display:'flex',alignItems:'center'}}>
        <Waves lineColor="rgba(12,230,68,0.18)" backgroundColor="transparent" waveSpeedX={0.018} waveSpeedY={0.008} waveAmpX={44} waveAmpY={22} xGap={14} yGap={40} friction={0.93} tension={0.006} maxCursorMove={120}/>
        <div aria-hidden="true" style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 70% 60% at 30% 50%,rgba(12,230,68,0.04) 0%,transparent 70%)',pointerEvents:'none',zIndex:1}}/>
        <div aria-hidden="true" style={{position:'absolute',bottom:0,left:0,right:0,height:'38%',background:'linear-gradient(to top,rgba(10,13,10,0.96) 15%,transparent)',pointerEvents:'none',zIndex:2}}/>
        <div aria-hidden="true" style={{position:'absolute',top:0,left:0,right:0,height:'18%',background:'linear-gradient(to bottom,rgba(10,13,10,0.7),transparent)',pointerEvents:'none',zIndex:2}}/>
        <div className="hero-inner" style={{position:'relative',zIndex:4}}>

          {}
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
            <h1 className="hero-headline" style={{fontSize:'clamp(4.5rem,10vw,8.5rem)'}}>ISQIP</h1>
            <p style={{fontFamily:"'Bruno Ace',cursive",fontSize:'clamp(0.9rem,1.8vw,1.1rem)',color:'#8FAE95',lineHeight:1.75,maxWidth:'420px',marginBottom:'2.4rem',marginTop:'3rem',letterSpacing:'0.02em'}}>
              IEEE Student Quality Improvement Programme
            </p>
            <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',alignItems:'center'}}>
              <a href="#register" className="hero-btn-primary">
                Register Now
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <a href="#tracks" className="hero-btn-outline">
                Learn More
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><polygon points="3,2 9,6 3,10" fill="currentColor"/></svg>
              </a>
            </div>
          </div>

          {}
          <div className="hero-ag-wrap" style={{position:'relative',height:'600px',width:'100%',overflow:'visible'}}>
            <Antigravity
              count={500}
              magnetRadius={8}
              ringRadius={8}
              waveSpeed={0.4}
              waveAmplitude={1.2}
              particleSize={2}
              lerpSpeed={0.06}
              color="#0CE644"
              autoAnimate={true}
              particleVariance={1.2}
            />
          </div>
        </div>
      </section>

      {}
      <section style={{position:'relative',minHeight:'100vh',background:'#0A0D0A',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
        <div aria-hidden="true" style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle,rgba(12,230,68,0.045) 1px,transparent 1px)',backgroundSize:'28px 28px',pointerEvents:'none'}}/>
        <div aria-hidden="true" style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 50% at 50% 50%,rgba(12,230,68,0.04) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:2}}>
          <CountDown />
        </div>
      </section>
    </>
  );
}
