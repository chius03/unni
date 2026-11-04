'use strict';
const albums=[{id:'cute',name:'Cute',cover:6,photos:[{id:7,name:'Một chút dễ thương'},{id:4,name:'Ngày vui'},{id:2,name:'Khoảnh khắc nhỏ'},{id:10,name:'Tự do một chút'},{id:5,name:'Một ngày đặc biệt'},{id:6,name:'Hoa dành cho UNNI'}]},{id:'elegance',name:'Elegance',cover:9,photos:[{id:9,name:'Blue rose'}]},{id:'fierce',name:'Fierce',cover:1,photos:[{id:3,name:'Red mood'},{id:8,name:'Monochrome'},{id:1,name:'Dark silhouette'},{id:12,name:'Soft light'}]}];
const src=id=>`assets/photo-${String(id).padStart(2,'0')}.webp`;
const grid=document.querySelector('#photos'),panel=document.querySelector('#album-panel'),albumGrid=document.querySelector('#albums'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let activeAlbum=null,albumTrigger=null;
albums.forEach((album,i)=>{const b=document.createElement('button');b.className='album-card reveal';b.setAttribute('aria-label',`Mở album ${album.name}, ${album.photos.length} ảnh`);b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','album-panel');b.dataset.album=album.id;b.innerHTML=`<div class="album-stack"><span class="album-back second"></span><span class="album-back"></span><div class="album-cover"><img src="${src(album.cover)}" alt="Ảnh bìa album ${album.name} của UNNI" loading="lazy"><span class="album-number">ALBUM / 0${i+1}</span><span class="album-open" aria-hidden="true">↗</span><span class="album-name">${album.name}</span></div></div>`;b.addEventListener('click',()=>openAlbum(album,b));b.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType!=='mouse')return;const rect=b.getBoundingClientRect();b.style.setProperty('--rx',`${-(e.clientY-rect.top-rect.height/2)/rect.height*9}deg`);b.style.setProperty('--ry',`${(e.clientX-rect.left-rect.width/2)/rect.width*12}deg`)});b.addEventListener('pointerleave',()=>{b.style.setProperty('--rx','0deg');b.style.setProperty('--ry','0deg')});albumGrid.appendChild(b)});
function openAlbum(album,trigger){activeAlbum=album;albumTrigger=trigger;document.querySelectorAll('.album-card').forEach(b=>b.setAttribute('aria-expanded',String(b===trigger)));document.querySelector('#album-title').textContent=album.name;grid.replaceChildren();album.photos.forEach((p,i)=>{const b=document.createElement('button');b.className='photo';b.setAttribute('aria-label',`Xem ảnh ${i+1} trong album ${album.name}`);b.innerHTML=`<div class="picture"><img src="${src(p.id)}" alt="UNNI — ${p.name}" loading="lazy"><span class="plus" aria-hidden="true">↗</span></div>`;b.addEventListener('click',()=>openPhoto(i,b));grid.appendChild(b)});panel.showModal();panel.scrollTop=0;document.body.classList.add('modal-open');document.querySelector('#album-title').focus({preventScroll:true})}
document.querySelector('#close-album').onclick=()=>panel.close();
panel.addEventListener('click',e=>{if(e.target===panel)panel.close()});
panel.addEventListener('close',()=>{activeAlbum=null;document.querySelectorAll('.album-card').forEach(b=>b.setAttribute('aria-expanded','false'));document.body.classList.toggle('modal-open',box.open);albumTrigger?.focus({preventScroll:true})});
let current=0,returnFocus=null,qrMode=false;const box=document.querySelector('#lightbox'),big=box.querySelector('img'),figure=box.querySelector('figure');
function display(direction=1){const p=activeAlbum.photos[current];big.src=src(p.id);big.alt=`UNNI — ${p.name}`;figure.classList.remove('turn-next','turn-prev');void figure.offsetWidth;figure.classList.add(direction>0?'turn-next':'turn-prev')}
function openPhoto(index,trigger){returnFocus=trigger;qrMode=false;current=index;display();box.querySelectorAll('.prev,.next').forEach(b=>b.hidden=false);box.showModal();document.body.classList.add('modal-open')}
function step(n){if(!qrMode&&activeAlbum){current=(current+n+activeAlbum.photos.length)%activeAlbum.photos.length;display(n)}}
box.querySelector('.close').onclick=()=>box.close();box.querySelector('.prev').onclick=()=>step(-1);box.querySelector('.next').onclick=()=>step(1);box.addEventListener('click',e=>{if(e.target===box)box.close()});box.addEventListener('close',()=>{document.body.classList.toggle('modal-open',panel.open);returnFocus?.focus({preventScroll:true})});box.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1)}if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}});
let touchX=0;box.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true});box.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-touchX;if(Math.abs(d)>60)step(d<0?1:-1)},{passive:true});
document.querySelectorAll('[data-qr]').forEach(b=>b.addEventListener('click',()=>{returnFocus=b;qrMode=true;figure.classList.remove('turn-next','turn-prev');big.src=src(Number(b.dataset.qr));big.alt=b.getAttribute('aria-label');box.querySelectorAll('.prev,.next').forEach(x=>x.hidden=true);box.showModal();document.body.classList.add('modal-open')}));
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{e.target.classList.toggle('visible',e.isIntersecting)}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));document.documentElement.classList.add('js')}
let scheduled=false;function progress(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.width=`${max>0?scrollY/max*100:0}%`;scheduled=false}addEventListener('scroll',()=>{if(!scheduled){requestAnimationFrame(progress);scheduled=true}},{passive:true});progress();
document.addEventListener('pointerdown',e=>{if(reduced.matches||e.target.closest('video,dialog'))return;const r=document.createElement('span');r.className='ripple';r.style.left=e.clientX+'px';r.style.top=e.clientY+'px';document.body.appendChild(r);r.addEventListener('animationend',()=>r.remove())});
const hero=document.querySelector('.hero'),heroImage=document.querySelector('.hero-image');let tiltFrame=0;hero.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType!=='mouse'||innerWidth<601)return;cancelAnimationFrame(tiltFrame);tiltFrame=requestAnimationFrame(()=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)/r.width,y=(e.clientY-r.top-r.height/2)/r.height;heroImage.style.transform=`rotateY(${x*4}deg) rotateX(${-y*3}deg) scale(1.012)`})});hero.addEventListener('pointerleave',()=>{cancelAnimationFrame(tiltFrame);heroImage.style.transform='none'});
const wipe=document.querySelector('.scene-wipe');let navigating=false;document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const destination=document.querySelector(a.getAttribute('href'));if(!destination||reduced.matches)return;e.preventDefault();if(navigating)return;navigating=true;wipe.classList.add('active');setTimeout(()=>{destination.scrollIntoView({behavior:'instant',block:'start'});history.replaceState(null,'',a.getAttribute('href'));progress()},340);setTimeout(()=>{wipe.classList.remove('active');navigating=false},720)}));
const siteMusic=new Audio('assets/site-music.mp3');
siteMusic.id='site-music';
siteMusic.setAttribute('aria-hidden','true');
siteMusic.loop=true;
siteMusic.preload='none';
siteMusic.volume=.18;
document.body.appendChild(siteMusic);
const musicButton=document.createElement('button');
musicButton.type='button';
musicButton.className='music-control';
musicButton.hidden=true;
musicButton.setAttribute('aria-label','Phát nhạc nền');
musicButton.setAttribute('aria-pressed','false');
musicButton.innerHTML='<span class="music-control-icon" aria-hidden="true">♫</span><span class="music-control-label">Nhạc nền</span>';
document.body.appendChild(musicButton);
let resumeMusicAfterVideo=false;
let musicAutoplayAttempted=false;
function updateMusicControl(){
  const playing=!siteMusic.paused;
  musicButton.setAttribute('aria-pressed',String(playing));
  const failed=Boolean(musicButton.dataset.error);
  musicButton.setAttribute('aria-label',failed?'Thử phát nhạc nền lại':playing?'Tạm dừng nhạc nền':'Phát nhạc nền');
  musicButton.querySelector('.music-control-label').textContent=failed?'Lỗi âm thanh':playing?'Đang phát':'Nhạc nền';
  musicButton.classList.toggle('is-playing',playing);
}
async function playSiteMusic(){
  try{
    await siteMusic.play();
    musicButton.removeAttribute('data-error');
  }catch(error){
    siteMusic.pause();
    musicButton.dataset.error='true';
    musicButton.title='Không thể phát nhạc nền. Nhấn để thử lại.';
    updateMusicControl();
    console.error('Không thể phát nhạc nền.',error);
  }
}
musicButton.addEventListener('click',()=>{
  if(!siteMusic.paused){resumeMusicAfterVideo=false;siteMusic.pause();return}
  if([...document.querySelectorAll('video')].some(video=>!video.paused&&!video.ended))return;
  musicButton.removeAttribute('data-error');
  musicButton.removeAttribute('title');
  playSiteMusic();
});
siteMusic.addEventListener('play',updateMusicControl);
siteMusic.addEventListener('pause',updateMusicControl);
siteMusic.addEventListener('error',()=>{
  siteMusic.pause();
  musicButton.dataset.error='true';
  musicButton.title='Không tải được nhạc nền.';
  updateMusicControl();
  console.error('Không tải được tệp assets/site-music.mp3.',siteMusic.error);
});
function syncMusicWithVideos(){
  const videoPlaying=[...document.querySelectorAll('video')].some(video=>!video.paused&&!video.ended);
  musicButton.disabled=videoPlaying;
  if(videoPlaying){
    if(!siteMusic.paused)resumeMusicAfterVideo=true;
    siteMusic.pause();
  }else if(resumeMusicAfterVideo){
    resumeMusicAfterVideo=false;
    playSiteMusic();
  }
}
document.querySelectorAll('video').forEach(v=>{
  v.addEventListener('play',()=>{
    document.querySelectorAll('video').forEach(other=>{if(other!==v)other.pause()});
    syncMusicWithVideos();
  });
  v.addEventListener('pause',syncMusicWithVideos);
  v.addEventListener('ended',syncMusicWithVideos);
});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden&& !siteMusic.paused){resumeMusicAfterVideo=false;siteMusic.pause()}
});

// Floating ash particles across two depth planes; decorative and non-interactive.
if(!reduced.matches){
  document.querySelectorAll('.ember-layer').forEach((layer,depth)=>{
    for(let i=0;i<(depth?10:18);i++){
      const particle=document.createElement('i');
      particle.style.cssText=`--left:${(i*37+depth*19)%101}%;--size:${depth?3+(i%3):1+(i%3)*.5}px;--duration:${14+(i*7%15)}s;--delay:-${i*1.73}s;--drift:${(i%2?-1:1)*(30+i*7)}px;--turn:${180+i*31}deg`;
      layer.appendChild(particle);
    }
  });
}
// Pause decorative particles while the page is hidden.
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('motion-paused',document.hidden));
document.body.classList.toggle('motion-paused',document.hidden);
// Scroll inertia adds a small directional lean to the stacked album covers.
let lastScroll=scrollY,scrollTick=0,settleTimer=0;
addEventListener('scroll',()=>{if(reduced.matches)return;const delta=scrollY-lastScroll;lastScroll=scrollY;if(scrollTick)return;scrollTick=requestAnimationFrame(()=>{const lean=Math.max(-2.5,Math.min(2.5,delta*.055));albumGrid.style.setProperty('--scroll-lean',lean+'deg');albumGrid.style.setProperty('--scroll-shift',Math.max(-6,Math.min(6,delta*.1))+'px');scrollTick=0;clearTimeout(settleTimer);settleTimer=setTimeout(()=>{albumGrid.style.setProperty('--scroll-lean','0deg');albumGrid.style.setProperty('--scroll-shift','0px')},150)})},{passive:true});
// Intro runs on opening/reloading the link, never on internal navigation.
const entryIntro=document.querySelector('#entry-intro');
let introTimer=0,introCleanupTimer=0,introFinished=false;
const AudioContextConstructor=window.AudioContext||window.webkitAudioContext;
let introAudioContext=null,introSoundGain=null,introSoundNodes=[],introSoundStopTimer=0,introSoundStarting=false;
function stopIntroSound(){
  if(!introSoundGain)return;
  const now=introAudioContext.currentTime;
  introSoundGain.gain.cancelScheduledValues(now);
  introSoundGain.gain.setTargetAtTime(0.0001,now,.08);
  introSoundNodes.forEach(node=>{try{node.stop(now+.45)}catch(error){if(error.name!=='InvalidStateError')throw error}});
  introSoundNodes=[];
  introSoundGain=null;
  clearTimeout(introSoundStopTimer);
  introSoundStopTimer=setTimeout(()=>introAudioContext.suspend().catch(error=>console.error('Không thể tạm dừng âm thanh intro.',error)),600);
}
async function startIntroSound(){
  if(!AudioContextConstructor){console.warn('Trình duyệt này không hỗ trợ Web Audio cho intro.');return}
  if(introSoundGain||introSoundStarting||introFinished)return;
  introSoundStarting=true;
  introAudioContext??=new AudioContextConstructor();
  try{await introAudioContext.resume()}catch(error){introSoundStarting=false;throw error}
  if(introFinished){introSoundStarting=false;return}
  const context=introAudioContext,now=context.currentTime;
  const master=context.createGain();
  master.gain.setValueAtTime(.0001,now);
  master.gain.exponentialRampToValueAtTime(.65,now+1.1);
  master.connect(context.destination);
  const buffer=context.createBuffer(1,context.sampleRate*2,context.sampleRate);
  const samples=buffer.getChannelData(0);
  for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*.45;
  const noise=context.createBufferSource();
  noise.buffer=buffer;
  noise.loop=true;
  const filter=context.createBiquadFilter();
  filter.type='lowpass';
  filter.frequency.value=720;
  filter.Q.value=.7;
  const noiseGain=context.createGain();
  noiseGain.gain.value=.16;
  noise.connect(filter).connect(noiseGain).connect(master);
  const low=context.createOscillator();
  low.type='sine';
  low.frequency.value=48;
  const lowGain=context.createGain();
  lowGain.gain.value=.12;
  low.connect(lowGain).connect(master);
  const ignition=context.createBufferSource();
  ignition.buffer=buffer;
  const ignitionFilter=context.createBiquadFilter();
  ignitionFilter.type='bandpass';
  ignitionFilter.frequency.setValueAtTime(1900,now);
  ignitionFilter.frequency.exponentialRampToValueAtTime(260,now+.7);
  const ignitionGain=context.createGain();
  ignitionGain.gain.setValueAtTime(.0001,now);
  ignitionGain.gain.exponentialRampToValueAtTime(.24,now+.035);
  ignitionGain.gain.exponentialRampToValueAtTime(.0001,now+.8);
  ignition.connect(ignitionFilter).connect(ignitionGain).connect(master);
  const lfo=context.createOscillator();
  lfo.frequency.value=.13;
  const lfoDepth=context.createGain();
  lfoDepth.gain.value=260;
  lfo.connect(lfoDepth).connect(filter.frequency);
  noise.start(now);
  low.start(now);
  ignition.start(now);
  ignition.stop(now+.82);
  lfo.start(now);
  introSoundGain=master;
  introSoundNodes=[noise,low,ignition,lfo];
  clearTimeout(introSoundStopTimer);
  introSoundStarting=false;
}
entryIntro.addEventListener('click',e=>{
  if(introFinished||e.target.closest('.intro-skip'))return;
  startIntroSound().catch(error=>console.error('Không thể phát âm thanh intro.',error));
});
const introBlocked=[...document.body.children].filter(el=>el!==entryIntro&&el.tagName!=='SCRIPT'&&!el.inert);
function cleanupIntro(){stopIntroSound();musicButton.hidden=false;document.documentElement.classList.remove('intro-pending','intro-revealing');entryIntro.hidden=true;introBlocked.forEach(el=>{if(el.hasAttribute('data-intro-inert')){el.inert=false;el.removeAttribute('data-intro-inert')}});document.removeEventListener('keydown',introEscape);progress();if(!musicAutoplayAttempted){musicAutoplayAttempted=true;playSiteMusic()}}
function introEscape(e){if(e.key==='Escape'){e.preventDefault();window.finishUnniIntro(true)}}
window.finishUnniIntro=function(immediate=false){if(introFinished){if(immediate)cleanupIntro();return}introFinished=true;clearTimeout(introTimer);if(immediate||reduced.matches){cleanupIntro();return}document.documentElement.classList.add('intro-revealing');entryIntro.classList.add('intro-leaving');introCleanupTimer=setTimeout(cleanupIntro,900)};
if(document.documentElement.classList.contains('intro-pending')&&!reduced.matches){introBlocked.forEach(el=>{el.inert=true;el.setAttribute('data-intro-inert','')});entryIntro.querySelector('.intro-skip').focus({preventScroll:true});document.addEventListener('keydown',introEscape);entryIntro.querySelector('.intro-skip').onclick=()=>{window.finishUnniIntro(true);document.querySelector('.brand').focus({preventScroll:true})};introTimer=setTimeout(()=>window.finishUnniIntro(),3100);reduced.addEventListener('change',()=>{if(reduced.matches)window.finishUnniIntro(true)})}else{cleanupIntro()}
