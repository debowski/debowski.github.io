(() => {
  const canvas = document.getElementById('board');
  const wrap = document.getElementById('canvas-wrap');
  const ctx = canvas.getContext('2d');
  const hint = document.getElementById('hint');
  const toolbar = document.getElementById('toolbar');

  const paletteBtns = document.querySelectorAll('.color-btn');
  const colorInput = document.getElementById('color-input');
  const sizeRange = document.getElementById('size-range');
  const sizeLabel = document.getElementById('size-label');
  const pressureToggle = document.getElementById('pressure-toggle');
  const bgSelect = document.getElementById('bg-select');
  const btnUndo = document.getElementById('btn-undo');
  const btnRedo = document.getElementById('btn-redo');
  const btnClear = document.getElementById('btn-clear');
  const btnSave = document.getElementById('btn-save');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnTheme = document.getElementById('btn-theme');
  const btnToolbarPos = document.getElementById('btn-toolbar-pos');
  const appEl = document.getElementById('app');
  const clearDialog = document.getElementById('clear-dialog');
  const cursor = document.getElementById('cursor');

  // State – WEKTORY
  let tool = 'pen'; // pen | eraser | pointer | select
  let color = '#0f0f0f';
  let baseWidth = 4;
  let usePressure = true;
  let bg = 'white';
  // widok – zoom / pan
  let scale = 1, panX = 0, panY = 0;
  const MIN_SCALE = 0.25, MAX_SCALE = 4;
  let isPanning = false, panStart = null, panOrig = null;
  let pinchStartDist = null, pinchStartScale = 1;
  let isSpacePressed = false;
  const isFirefox = navigator.userAgent.includes('Firefox');
  let cachedWrapRect=null;
  function updateCachedRect(){ try{ cachedWrapRect=wrap.getBoundingClientRect(); }catch(_){} }
  let lastRedrawTime=0;

  // wektorowe strokes: {id, color, baseWidth, usePressure, points:[{x,y,pressure}]}
  let strokes = [];
  let currentStroke = null;
  let isDrawing = false;
  let lastX = 0, lastY = 0;
  let eraserLast = null; // {x,y} do ciągłego wymazywania
  let lineStart = null;
  let lineStartPressure = 0.5;

  // obrazy: {id, src, x,y,w,h, _img}
  let images = [];
  let lastMouseWorld = null;

  // teksty: {id, x,y, text, color, size}
  let texts = [];
  let editingText = null; // {id, isNew, el, originalText}
  let selectedTextIndices = [];
  let selectedTextOriginals = [];
  // schowek do kopiowania linii
  let clipboard = null; // {strokes, images, texts, pasteCount}

  // Select / move – wektorowo
  let selection = null; // {x,y,w,h} CSS px
  let selectedIndices = []; // indeksy w strokes
  let selectedOriginals = []; // kopie punktów do przesuwania
  let selectedImageIndices = []; // indeksy w images
  let selectedImageOriginals = []; // kopie pozycji obrazów
  let isSelecting = false;
  let isDraggingSel = false;
  let selStart = null;
  let lassoPoints = null;
  let dragStart = null;
  let dragOffset = null;
  let selPos = null; // aktualna pozycja ramki podczas drag
  const selectionBox = document.getElementById('selection-box');
  const selectionGhost = document.getElementById('selection-ghost');
  // duch niepotrzebny w trybie wektorowym – ukryty, zostawiamy dla kompat

  const MAX_HISTORY = 80;
  const undoStack = [];
  const redoStack = [];

  function dpr(){ return Math.max(1, window.devicePixelRatio||1); }
  let pendingRedraw=false;
  function requestRedrawThrottled(){
    const now=performance.now();
    if(now - lastRedrawTime < 16){
      if(!pendingRedraw){
        pendingRedraw=true;
        requestAnimationFrame(()=>{ pendingRedraw=false; lastRedrawTime=performance.now(); redraw(); });
      }
      return;
    }
    lastRedrawTime=now;
    redraw();
  }
  function isToolbarRight(){ return appEl && appEl.classList.contains('toolbar-right'); }
  function applyToolbarPos(right){
    if(!appEl) return;
    appEl.classList.toggle('toolbar-right', right);
    localStorage.setItem('whiteb-toolbar-pos', right ? 'right' : 'top');
    if(btnToolbarPos){
      btnToolbarPos.innerHTML = right ? '<i class="fa-solid fa-angles-left"></i>' : '<i class="fa-solid fa-angles-right"></i>';
      btnToolbarPos.title = right ? 'Przenieś pasek na górę (R)' : 'Przenieś pasek na prawo (R)';
    }
    document.getElementById('more-menu')?.setAttribute('hidden','');
    updateCachedRect();
    setTimeout(()=>{ resizeCanvas(true); }, 50);
  }
  function isDarkMode(){ return document.documentElement.classList.contains('dark'); }
  function applyTheme(dark){
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('whiteb-theme', dark ? 'dark' : 'light');
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content', dark ? '#0b1220' : '#ffffff');
    if(btnTheme) btnTheme.innerHTML = dark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    if(btnTheme) btnTheme.title = dark ? 'Tryb jasny (D)' : 'Tryb ciemny (D)';
    // auto-swap czarny <-> biały dla widoczności na zmianie tła (domyślnie biały w dark mode)
    if(dark && (color==='#0f0f0f' || color==='#000000')){ color='#ffffff'; colorInput.value=color; paletteBtns.forEach(x=>x.classList.remove('active')); document.querySelector('.color-btn[data-color="#ffffff"]')?.classList.add('active'); updateCursor(); }
    else if(!dark && (color==='#ffffff' || color==='#f8fafc')){ color='#0f0f0f'; colorInput.value=color; paletteBtns.forEach(x=>x.classList.remove('active')); document.querySelector('.color-btn[data-color="#0f0f0f"]')?.classList.add('active'); updateCursor(); }
    redraw();
  }

  function applyBackground(){
    wrap.classList.remove('bg-white','bg-grid','bg-lines','bg-dots','bg-cartesian');
    wrap.classList.add('bg-'+bg);
    updateBackgroundZoom();
  }
  function updateBackgroundZoom(){
    const s = scale;
    if(bg==='grid'){
      wrap.style.backgroundSize = `${32*s}px ${32*s}px`;
    } else if(bg==='dots'){
      wrap.style.backgroundSize = `${24*s}px ${24*s}px`;
      wrap.style.backgroundPosition = `${12*s}px ${12*s}px`;
    } else if(bg==='lines'){
      wrap.style.backgroundSize = `100% ${28*s}px, ${72*s}px 100%`;
    } else if(bg==='cartesian'){
      wrap.style.backgroundSize = `100% 100%, 100% 100%`;
      wrap.style.backgroundPosition = `0 0, 0 0`;
    } else {
      wrap.style.backgroundSize = '';
      wrap.style.backgroundPosition = '';
    }
  }
  function screenToWorld(sx,sy){ return {x:(sx-panX)/scale, y:(sy-panY)/scale}; }
  function worldToScreen(wx,wy){ return {x:wx*scale+panX, y:wy*scale+panY}; }
  function setZoom(newScale, cx, cy){
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    if(Math.abs(newScale-scale)<0.001) return;
    const rect = wrap.getBoundingClientRect();
    if(cx==null){ cx=rect.width/2; cy=rect.height/2; }
    const wx = (cx - panX)/scale;
    const wy = (cy - panY)/scale;
    scale = newScale;
    panX = cx - wx*scale;
    panY = cy - wy*scale;
    updateCachedRect();
    updateZoomLabel();
    updateBackgroundZoom();
    updateCursor();
    redraw();
    updateSelectionUI();
  }
  function zoomIn(center){ setZoom(scale*1.22, center?.x, center?.y); }
  function zoomOut(center){ setZoom(scale/1.22, center?.x, center?.y); }
  function resetView(){ scale=1; panX=0; panY=0; updateCachedRect(); updateZoomLabel(); updateBackgroundZoom(); updateCursor(); redraw(); updateSelectionUI(); }
  function updateZoomLabel(){
    const el=document.getElementById('zoom-label');
    if(el) el.textContent = Math.round(scale*100)+'%';
  }
  function drawBackgroundForExport(tctx, cssW, cssH, bgType, ratio){
    const dark=isDarkMode();
    tctx.save();
    tctx.fillStyle= dark ? '#0f172a' : '#ffffff';
    tctx.fillRect(0,0, cssW*ratio, cssH*ratio);
    if(bgType==='grid'){
      tctx.strokeStyle= dark ? '#1e293b' : '#e2e8f0'; tctx.lineWidth=0.6*ratio; const step=32*ratio;
      tctx.beginPath();
      for(let x=0;x<cssW*ratio;x+=step){ tctx.moveTo(x,0); tctx.lineTo(x,cssH*ratio); }
      for(let y=0;y<cssH*ratio;y+=step){ tctx.moveTo(0,y); tctx.lineTo(cssW*ratio,y); }
      tctx.stroke();
    } else if(bgType==='lines'){
      tctx.strokeStyle= dark ? '#1e293b' : '#e2e8f0'; tctx.lineWidth=0.7*ratio; const step=28*ratio;
      tctx.beginPath(); for(let y=step;y<cssH*ratio;y+=step){ tctx.moveTo(0,y); tctx.lineTo(cssW*ratio,y); } tctx.stroke();
      tctx.strokeStyle= dark ? '#7f1d1d' : '#fecaca'; tctx.beginPath(); tctx.moveTo(72*ratio,0); tctx.lineTo(72*ratio,cssH*ratio); tctx.stroke();
    } else if(bgType==='dots'){
      tctx.fillStyle= dark ? '#334155' : '#e2e8f0'; const step=24*ratio, r=1.2*ratio;
      for(let x=16*ratio;x<cssW*ratio;x+=step) for(let y=16*ratio;y<cssH*ratio;y+=step){ tctx.beginPath(); tctx.arc(x,y,r,0,Math.PI*2); tctx.fill(); }
    } else if(bgType==='cartesian'){
      tctx.strokeStyle= dark ? '#3b82f6' : '#2563eb'; tctx.lineWidth=1.2*ratio;
      tctx.beginPath();
      const cx=cssW*ratio/2, cy=cssH*ratio/2;
      tctx.moveTo(cx,0); tctx.lineTo(cx,cssH*ratio);
      tctx.moveTo(0,cy); tctx.lineTo(cssW*ratio,cy);
      tctx.stroke();
      const arrow=8*ratio;
      tctx.fillStyle= dark ? '#3b82f6' : '#2563eb';
      tctx.beginPath(); tctx.moveTo(cssW*ratio,cy); tctx.lineTo(cssW*ratio-arrow,cy-arrow/2); tctx.lineTo(cssW*ratio-arrow,cy+arrow/2); tctx.closePath(); tctx.fill();
      tctx.beginPath(); tctx.moveTo(cx,0); tctx.lineTo(cx-arrow/2,arrow); tctx.lineTo(cx+arrow/2,arrow); tctx.closePath(); tctx.fill();
    }
    tctx.restore();
  }

  function resizeCanvas(preserve=true){
    const rect = wrap.getBoundingClientRect();
    const ratio = dpr();
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    updateCachedRect();
    // transform ustawiany w redraw()
    // wektory są w world px – view transform w redraw
    redraw();
    applyBackground();
    // nie czyść zaznaczenia – współrzędne world pozostają, tylko box musi się przeskalować
    updateSelectionUI();
  }

  function getPos(e){
    const rect = (isFirefox ? canvas.getBoundingClientRect() : (cachedWrapRect || canvas.getBoundingClientRect()));
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const w = screenToWorld(sx, sy);
    const pr = e.pressure ?? e.mozPressure ?? 0.5;
    return {x: w.x, y: w.y, sx, sy, pressure: pr, pointerType: e.pointerType};
  }

  // --- Historia wektorowa ---
  function cloneStrokes(arr){
    try{
      return arr.map(s=> ({...s, points: s.points.map(p=> ({...p})) }));
    }catch(_){
      try{ if(typeof structuredClone==='function') return structuredClone(arr); }catch(_){}
      return JSON.parse(JSON.stringify(arr));
    }
  }
  function getHistorySnapshot(){
    return {
      strokes: cloneStrokes(strokes),
      images: images.map(im=> ({id:im.id, src:im.src, x:im.x, y:im.y, w:im.w, h:im.h})),
      texts: JSON.parse(JSON.stringify(texts))
    };
  }
  function restoreSnapshot(snap){
    if(editingText) cancelTextEdit(false);
    strokes = cloneStrokes(snap.strokes||[]);
    const restored = (snap.images||[]).map(d=>{
      const im={id:d.id, src:d.src, x:d.x, y:d.y, w:d.w, h:d.h, _img:null};
      const img=new Image();
      img.src=d.src;
      img.onload=()=> redraw();
      im._img=img;
      return im;
    });
    images=restored;
    texts = JSON.parse(JSON.stringify(snap.texts||[]));
    redraw();
  }
  function pushHistory(){
    try{
      undoStack.push(getHistorySnapshot());
      if(undoStack.length>MAX_HISTORY) undoStack.shift();
      redoStack.length=0;
      updateUndoRedo();
    }catch(e){ console.warn('pushHistory',e); }
  }
  function restoreStrokes(arr){
    strokes = cloneStrokes(arr);
    redraw();
  }
  function undo(){
    if(!undoStack.length) return;
    clearSelection(false);
    redoStack.push(getHistorySnapshot());
    const prev = undoStack.pop();
    restoreSnapshot(prev);
    updateUndoRedo();
  }
  function redo(){
    if(!redoStack.length) return;
    clearSelection(false);
    undoStack.push(getHistorySnapshot());
    const nxt = redoStack.pop();
    restoreSnapshot(nxt);
    updateUndoRedo();
  }
  function updateUndoRedo(){
    btnUndo.disabled = undoStack.length===0;
    btnRedo.disabled = redoStack.length===0;
    btnUndo.style.opacity = undoStack.length?1:.45;
    btnRedo.style.opacity = redoStack.length?1:.45;
  }
  function clearCanvas(push=true){
    if(push) pushHistory();
    if(editingText) cancelTextEdit(false);
    strokes = [];
    images = [];
    texts = [];
    clearSelection(false);
    redraw();
    applyBackground();
  }

  // --- Rysowanie wektorów ---
  function widthForPressure(pressure, base){
    if(!usePressure) return base;
    let p = pressure;
    if(p==null || p===0.5) p=0.7;
    p=Math.max(0, Math.min(1, p));
    const factor = 0.45 + p*0.95;
    return Math.max(1, base * factor);
  }
  // wykrywa mikro-ruchy 1mm – próg 0.01px, Firefox 0 (brak filtrowania)
  function smoothPoints(points){
    if(!points || points.length < 3) return points;
    const thr = isFirefox ? 0 : 0.01;
    const filtered=[points[0]];
    for(let i=1;i<points.length;i++){
      const dx=points[i].x-filtered[filtered.length-1].x, dy=points[i].y-filtered[filtered.length-1].y;
      if(Math.hypot(dx,dy) >= thr) filtered.push(points[i]);
    }
    if(filtered.length < 3) return filtered;
    const n=filtered.length;
    const out=new Array(n);
    out[0]={...filtered[0]};
    out[n-1]={...filtered[n-1]};
    for(let i=1;i<n-1;i++){
      const p=filtered[i-1], c=filtered[i], nn=filtered[i+1];
      out[i]={
        x: p.x*0.15 + c.x*0.70 + nn.x*0.15,
        y: p.y*0.15 + c.y*0.70 + nn.y*0.15,
        pressure: p.pressure*0.15 + c.pressure*0.70 + nn.pressure*0.15
      };
    }
    return out;
  }
  function drawStroke(st){
    if(!st.points || st.points.length===0) return;
    const pts = smoothPoints(st.points);
    if(pts.length===1){
      const p = pts[0];
      const w = st.usePressure ? widthForPressure(p.pressure, st.baseWidth) : st.baseWidth;
      ctx.fillStyle = st.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, w/2, 0, Math.PI*2); ctx.fill();
      return;
    }
    const rawW = pts.map(p=> st.usePressure ? widthForPressure(p.pressure, st.baseWidth) : st.baseWidth);
    const widths = rawW.slice();
    if(widths.length>=3){
      const tmp=widths.slice();
      for(let i=1;i<widths.length-1;i++) widths[i]=tmp[i-1]*0.15 + tmp[i]*0.70 + tmp[i+1]*0.15;
    }
    ctx.strokeStyle = st.color;
    ctx.lineCap='round'; ctx.lineJoin='round';
    for(let i=1;i<pts.length;i++){
      const a=pts[i-1], b=pts[i];
      const wa=widths[i-1], wb=widths[i];
      const dist=Math.hypot(b.x-a.x, b.y-a.y);
      const steps=Math.max(1, Math.min(6, Math.ceil(dist/4)));
      if(i===1){
        for(let s=0;s<steps;s++){
          const t0=s/steps, t1=(s+1)/steps;
          const x0=a.x+(b.x-a.x)*t0, y0=a.y+(b.y-a.y)*t0;
          const x1=a.x+(b.x-a.x)*t1, y1=a.y+(b.y-a.y)*t1;
          const w=(wa+(wb-wa)*t0 + wa+(wb-wa)*t1)/2;
          ctx.lineWidth=w;
          ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
        }
      } else {
        const p0=pts[i-2];
        const mx0=(p0.x+a.x)/2, my0=(p0.y+a.y)/2;
        const mx1=(a.x+b.x)/2, my1=(a.y+b.y)/2;
        const wStart=(widths[i-2]+wa)/2, wMid=wa, wEnd=(wa+wb)/2;
        for(let s=0;s<steps;s++){
          const t0=s/steps, t1=(s+1)/steps;
          const qx0=(1-t0)*(1-t0)*mx0 + 2*(1-t0)*t0*a.x + t0*t0*mx1;
          const qy0=(1-t0)*(1-t0)*my0 + 2*(1-t0)*t0*a.y + t0*t0*my1;
          const qx1=(1-t1)*(1-t1)*mx0 + 2*(1-t1)*t1*a.x + t1*t1*mx1;
          const qy1=(1-t1)*(1-t1)*my0 + 2*(1-t1)*t1*a.y + t1*t1*my1;
          let w0,w1;
          if(t0<0.5){ const tt=t0*2; w0=wStart+(wMid-wStart)*tt; } else { const tt=(t0-0.5)*2; w0=wMid+(wEnd-wMid)*tt; }
          if(t1<0.5){ const tt=t1*2; w1=wStart+(wMid-wStart)*tt; } else { const tt=(t1-0.5)*2; w1=wMid+(wEnd-wMid)*tt; }
          const w=(w0+w1)/2;
          ctx.lineWidth=w;
          ctx.beginPath(); ctx.moveTo(qx0,qy0); ctx.lineTo(qx1,qy1); ctx.stroke();
        }
        if(i===pts.length-1){
          const d2=Math.hypot(b.x-mx1,b.y-my1);
          const steps2=Math.max(1, Math.ceil(d2/4));
          for(let s2=0;s2<steps2;s2++){
            const t0=s2/steps2, t1=(s2+1)/steps2;
            const x0=mx1+(b.x-mx1)*t0, y0=my1+(b.y-my1)*t0;
            const x1=mx1+(b.x-mx1)*t1, y1=my1+(b.y-my1)*t1;
            const w0=wEnd+(wb-wEnd)*t0, w1=wEnd+(wb-wEnd)*t1;
            const w=(w0+w1)/2;
            ctx.lineWidth=w;
            ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
          }
        }
      }
    }
  }
  function redraw(){
    const ratio = dpr();
    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.setTransform(scale*ratio,0,0,scale*ratio, panX*ratio, panY*ratio);
    // obrazy na spodzie, wektory na wierzchu -> można adnotować obrazek
    for(const im of images){
      if(im._img && im._img.complete && im._img.naturalWidth){
        try{ ctx.drawImage(im._img, im.x, im.y, im.w, im.h); }catch(e){}
      } else if(im._img){
        // placeholder ramka dopóki się ładuje
        ctx.save();
        ctx.fillStyle='#e2e8f0';
        ctx.fillRect(im.x, im.y, im.w, im.h);
        ctx.restore();
      }
    }
    // aktualizuj pozycję edytora tekstu przy zoom/pan
    if(editingText){
      const sp=worldToScreen(editingText.worldX, editingText.worldY);
      editingText.el.style.left=sp.x+'px';
      editingText.el.style.top=sp.y+'px';
      editingText.el.style.fontSize=(editingText.size*scale)+'px';
    }
    // rysuj wszystkie wektory w przestrzeni world
    for(const s of strokes) drawStroke(s);
    // rysuj teksty na wierzchu (ukryj edytowany)
    for(let i=0;i<texts.length;i++){
      if(editingText && !editingText.isNew && editingText.existingIdx===i) continue;
      drawText(texts[i]);
    }
    // podświetl zaznaczone (po wierzchu, przerywane)
    if(tool==='select' && (selectedIndices.length || selectedImageIndices.length || selectedTextIndices.length)){
      ctx.save();
      ctx.strokeStyle='rgba(37,99,235,0.95)';
      ctx.lineWidth=1.2; ctx.setLineDash([6,4]);
      for(const idx of selectedIndices){
        const s = strokes[idx];
        if(!s) continue;
        const bb = getStrokeBBox(s);
        if(!bb) continue;
        ctx.strokeRect(bb.x-3, bb.y-3, bb.w+6, bb.h+6);
      }
      for(const idx of selectedImageIndices){
        const im = images[idx];
        if(!im) continue;
        ctx.strokeRect(im.x-3, im.y-3, im.w+6, im.h+6);
      }
      for(const idx of selectedTextIndices){
        const t = texts[idx];
        if(!t) continue;
        const bb=getTextBBox(t);
        if(!bb) continue;
        ctx.strokeRect(bb.x-3, bb.y-3, bb.w+6, bb.h+6);
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // --- Geometria ---
  function getStrokeBBox(s){
    if(!s.points.length) return null;
    let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    for(const p of s.points){ if(p.x<minX)minX=p.x; if(p.y<minY)minY=p.y; if(p.x>maxX)maxX=p.x; if(p.y>maxY)maxY=p.y; }
    const pad = (s.baseWidth||4)/2 + 2;
    return {x:minX-pad, y:minY-pad, w:(maxX-minX)+pad*2, h:(maxY-minY)+pad*2, minX,minY,maxX,maxY};
  }
  function isImageInRect(im, rect){
    if(!im) return false;
    if(im.x + im.w < rect.x || im.x > rect.x+rect.w || im.y + im.h < rect.y || im.y > rect.y+rect.h) return false;
    return true;
  }
  function currentTextSize(){ return Math.max(14, Math.round(baseWidth*3.2 + 12)); }
  function drawText(t){
    if(!t || !t.text) return;
    ctx.save();
    ctx.font = `${t.size}px Inter, sans-serif`;
    ctx.fillStyle = t.color;
    ctx.textBaseline='top';
    const lines=t.text.split('\n');
    const lh=t.size*1.25;
    for(let i=0;i<lines.length;i++) ctx.fillText(lines[i], t.x, t.y + i*lh);
    ctx.restore();
  }
  function getTextBBox(t){
    if(!t || !t.text) return null;
    ctx.save();
    ctx.font = `${t.size}px Inter, sans-serif`;
    const lines=t.text.split('\n');
    let maxW=0;
    for(const line of lines){ const w=ctx.measureText(line).width; if(w>maxW) maxW=w; }
    ctx.restore();
    const h=lines.length*t.size*1.25;
    const w=maxW||10;
    return {x:t.x, y:t.y, w, h, minX:t.x, minY:t.y, maxX:t.x+w, maxY:t.y+h};
  }
  function isTextInRect(t, rect){
    const bb=getTextBBox(t);
    if(!bb) return false;
    if(bb.maxX < rect.x || bb.minX > rect.x+rect.w || bb.maxY < rect.y || bb.minY > rect.y+rect.h) return false;
    return true;
  }
  function findTextIndicesInRect(rect){
    const idx=[];
    texts.forEach((t,i)=>{ if(isTextInRect(t,rect)) idx.push(i); });
    return idx;
  }
  function hitText(x,y){
    for(let i=texts.length-1;i>=0;i--){
      const bb=getTextBBox(texts[i]);
      if(!bb) continue;
      if(x>=bb.x && x<=bb.x+bb.w && y>=bb.y && y<=bb.y+bb.h) return i;
    }
    return -1;
  }
  function hitStrokeIndex(x,y){
    const tol = 10/scale;
    for(let i=strokes.length-1;i>=0;i--){
      const s=strokes[i];
      const bb=getStrokeBBox(s);
      if(!bb) continue;
      const pad=tol + (s.baseWidth||4)/2;
      if(x < bb.minX - pad || x > bb.maxX + pad || y < bb.minY - pad || y > bb.maxY + pad) continue;
      for(let j=0;j<s.points.length;j++){
        const p=s.points[j];
        if(Math.hypot(p.x-x, p.y-y) <= pad) return i;
        if(j>0){
          const q=s.points[j-1];
          if(distPointToSegment(x,y, q.x,q.y, p.x,p.y) <= pad) return i;
        }
      }
    }
    return -1;
  }
  function hitImageIndex(x,y){
    for(let i=images.length-1;i>=0;i--){
      const im=images[i];
      if(x>=im.x && x<=im.x+im.w && y>=im.y && y<=im.y+im.h) return i;
    }
    return -1;
  }
  function computeSelectionBBox(){
    let minX=Infinity, minY=Infinity, maxX=-Infinity, maxY=-Infinity;
    let has=false;
    for(const idx of selectedIndices){
      const bb=getStrokeBBox(strokes[idx]);
      if(!bb) continue; has=true;
      if(bb.minX<minX)minX=bb.minX; if(bb.minY<minY)minY=bb.minY;
      if(bb.maxX>maxX)maxX=bb.maxX; if(bb.maxY>maxY)maxY=bb.maxY;
    }
    for(const idx of selectedImageIndices){
      const im=images[idx]; if(!im) continue; has=true;
      if(im.x<minX)minX=im.x; if(im.y<minY)minY=im.y;
      if(im.x+im.w>maxX)maxX=im.x+im.w; if(im.y+im.h>maxY)maxY=im.y+im.h;
    }
    for(const idx of selectedTextIndices){
      const bb=getTextBBox(texts[idx]); if(!bb) continue; has=true;
      if(bb.minX<minX)minX=bb.minX; if(bb.minY<minY)minY=bb.minY;
      if(bb.maxX>maxX)maxX=bb.maxX; if(bb.maxY>maxY)maxY=bb.maxY;
    }
    if(!has) return null;
    const pad=4;
    return {x:minX-pad, y:minY-pad, w:(maxX-minX)+pad*2, h:(maxY-minY)+pad*2, minX:minX-pad, minY:minY-pad, maxX:maxX+pad, maxY:maxY+pad};
  }
  function createTextEditor(worldX, worldY, existingIdx){
    if(editingText) commitTextEdit(false);
    const isEdit = existingIdx!=null && existingIdx>=0;
    const existing = isEdit ? texts[existingIdx] : null;
    const size = existing ? existing.size : currentTextSize();
    const col = existing ? existing.color : color;
    const initText = existing ? existing.text : '';
    const screenPos = worldToScreen(worldX, worldY);
    const ta=document.createElement('textarea');
    ta.className='text-input';
    ta.value=initText;
    ta.placeholder='Wpisz tekst… (Ctrl+Enter zatwierdź, Esc anuluj)';
    ta.style.left=screenPos.x+'px';
    ta.style.top=screenPos.y+'px';
    ta.style.fontSize=(size*scale)+'px';
    ta.style.color=col;
    ta.style.minWidth='140px';
    ta.style.minHeight=(size*scale*1.4)+'px';
    wrap.appendChild(ta);
    ta.focus();
    ta.select();
    // autosize
    const autoSize=()=>{
      ta.style.height='auto';
      ta.style.height=Math.max(size*scale*1.4, ta.scrollHeight+4)+'px';
      const screenW=ta.scrollWidth;
      ta.style.width=Math.min(480, Math.max(140, screenW+24))+'px';
    };
    autoSize();
    ta.addEventListener('input', autoSize);
    ta.addEventListener('keydown', (e)=>{
      if(e.key==='Escape'){ e.preventDefault(); e.stopPropagation(); cancelTextEdit(!isEdit); }
      else if(e.key==='Enter' && (e.ctrlKey||e.metaKey)){ e.preventDefault(); commitTextEdit(false); }
    });
    ta.addEventListener('blur', ()=> setTimeout(()=>{ if(editingText && editingText.el===ta) commitTextEdit(false); }, 150));
    // śledź zoom/pan aby przesuwać edytor
    const onViewChange=()=>{
      if(!editingText || editingText.el!==ta) { wrap.removeEventListener('wheel', onViewChange); return; }
      // przelicz pozycję world zachowaną w editingText.worldX/Y
      const sp=worldToScreen(editingText.worldX, editingText.worldY);
      ta.style.left=sp.x+'px'; ta.style.top=sp.y+'px';
      ta.style.fontSize=(editingText.size*scale)+'px';
    };
    // prosty listener na redraw – będziemy wołać ręcznie
    editingText={id: existing ? existing.id : Date.now()+Math.random(), isNew:!isEdit, el:ta, originalText:initText, worldX, worldY, size, color:col, existingIdx, _onViewChange:onViewChange};
    // usuń stary tekst z tablicy jeśli edytujemy (będzie przywrócony przy commit)
    if(isEdit){
      // nie usuwaj jeszcze, tylko ukryj poprzez nie rysowanie? Zostaw, commit nadpisze
    }
  }
  function commitTextEdit(keepEmpty){
    if(!editingText) return;
    const ta=editingText.el;
    const txt=ta.value.trimEnd();
    const {id, isNew, worldX, worldY, size, color:col, existingIdx} = editingText;
    ta.remove();
    const prevEditing=editingText;
    editingText=null;
    if(!txt && !keepEmpty){
      if(isNew){
        // nic nie dodano – nie zapisuj historii
        redraw(); return;
      } else {
        // edycja wyczyszczona – usuń tekst
        pushHistory();
        if(existingIdx>=0) texts.splice(existingIdx,1);
        clearSelection(false); redraw(); return;
      }
    }
    if(!txt && keepEmpty){ redraw(); return; }
    pushHistory();
    if(!isNew && existingIdx>=0){
      texts[existingIdx].text=txt;
      texts[existingIdx].color=col;
      texts[existingIdx].size=size;
    } else {
      texts.push({id, x:worldX, y:worldY, text:txt, color:col, size});
    }
    clearSelection(false); redraw();
  }
  function cancelTextEdit(removeNew){
    if(!editingText) return;
    editingText.el.remove();
    const wasNew=editingText.isNew;
    editingText=null;
    if(wasNew && removeNew!==false) redraw();
    else redraw();
  }
  function distPointToSegment(px,py, x1,y1,x2,y2){
    const l2=(x2-x1)*(x2-x1)+(y2-y1)*(y2-y1);
    if(l2===0) return Math.hypot(px-x1,py-y1);
    let t=((px-x1)*(x2-x1)+(py-y1)*(y2-y1))/l2;
    t=Math.max(0,Math.min(1,t));
    const nx=x1+t*(x2-x1), ny=y1+t*(y2-y1);
    return Math.hypot(px-nx,py-ny);
  }
  function isStrokeHitByEraser(st, x0,y0,x1,y1, radius){
    const r = radius + (st.baseWidth/2);
    // szybki test bbox
    const bb=getStrokeBBox(st);
    const ex0=Math.min(x0,x1)-r, ey0=Math.min(y0,y1)-r, ex1=Math.max(x0,x1)+r, ey1=Math.max(y0,y1)+r;
    if(bb.maxX < ex0 || bb.minX > ex1 || bb.maxY < ey0 || bb.minY > ey1) return false;
    // test punktowy + odcinek gumki
    for(let i=0;i<st.points.length;i++){
      const p=st.points[i];
      const d1=Math.hypot(p.x-x1,p.y-y1);
      if(d1 <= r) return true;
      if(i>0){
        const q=st.points[i-1];
        // odległość segmentu wektora od punktu gumki
        if(distPointToSegment(x1,y1, q.x,q.y, p.x,p.y) <= r) return true;
        // i odległość segmentu wektora od segmentu gumki (x0,y0)-(x1,y1)
        // przybliż: sprawdź odległość środka gumki-segmentu od wektora
        // uproszczenie: sprawdź oba końce
        if(distPointToSegment(q.x,q.y, x0,y0, x1,y1) <= r) return true;
        if(distPointToSegment(p.x,p.y, x0,y0, x1,y1) <= r) return true;
      }
    }
    return false;
  }
  function isStrokeInRect(st, rect){
    const bb=getStrokeBBox(st);
    if(!bb) return false;
    // bbox nie przecina rect -> brak
    if(bb.maxX < rect.x || bb.minX > rect.x+rect.w || bb.maxY < rect.y || bb.minY > rect.y+rect.h) return false;
    // dokładniej: czy jakikolwiek punkt wewnątrz lub przecięcie odcinka
    for(const p of st.points){
      if(p.x>=rect.x && p.x<=rect.x+rect.w && p.y>=rect.y && p.y<=rect.y+rect.h) return true;
    }
    // jeśli bbox przecina, a żaden punkt nie jest w środku, sprawdź czy odcinek przecina prostokąt (np. długa linia przez środek)
    for(let i=1;i<st.points.length;i++){
      const a=st.points[i-1], b=st.points[i];
      if(segmentIntersectsRect(a,b,rect)) return true;
    }
    // sam bbox przecina – uznaj za trafienie (np. cały stroke otacza rect)
    return true;
  }
  function segmentIntersectsRect(a,b,rect){
    // Liang-Barsky uproszczone: sprawdź czy odcinek przecina krawędzie rect
    const rx=rect.x, ry=rect.y, rx2=rx+rect.w, ry2=ry+rect.h;
    // szybki test: oba punkty po jednej stronie
    if((a.x<rx && b.x<rx) || (a.x>rx2 && b.x>rx2) || (a.y<ry && b.y<ry) || (a.y>ry2 && b.y>ry2)) return false;
    // jeśli którykolwiek wewnątrz – już sprawdzone, ale powtórz
    if((a.x>=rx&&a.x<=rx2&&a.y>=ry&&a.y<=ry2) || (b.x>=rx&&b.x<=rx2&&b.y>=ry&&b.y<=ry2)) return true;
    // przecięcie z krawędziami
    const edges=[[[rx,ry],[rx2,ry]],[[rx2,ry],[rx2,ry2]],[[rx2,ry2],[rx,ry2]],[[rx,ry2],[rx,ry]]];
    for(const [[x1,y1],[x2,y2]] of edges){
      if(segmentsIntersect(a.x,a.y,b.x,b.y, x1,y1,x2,y2)) return true;
    }
    return false;
  }
  function segmentsIntersect(x1,y1,x2,y2,x3,y3,x4,y4){
    const d1=(x2-x1)*(y3-y1)-(y2-y1)*(x3-x1);
    const d2=(x2-x1)*(y4-y1)-(y2-y1)*(x4-x1);
    const d3=(x4-x3)*(y1-y3)-(y4-y3)*(x1-x3);
    const d4=(x4-x3)*(y2-y3)-(y4-y3)*(x2-x3);
    if(((d1>0&&d2<0)||(d1<0&&d2>0)) && ((d3>0&&d4<0)||(d3<0&&d4>0))) return true;
    return false;
  }

  // --- Narzędzia ---
  function setTool(t){
    if(editingText) commitTextEdit(true);
    if(tool==='select' && t!=='select') clearSelection(false);
    tool=t;
    document.querySelectorAll('.tool-btn[data-tool]').forEach(b=> b.classList.toggle('active', b.dataset.tool===t));
    canvas.classList.toggle('pen', t==='pen');
    canvas.classList.toggle('eraser', t==='eraser');
    canvas.classList.toggle('select', t==='select');
    canvas.classList.toggle('pointer', t==='pointer');
    canvas.classList.toggle('text', t==='text');
    canvas.classList.remove('select--move');
    updateCursor();
    updateSelectionUI();
    if(t==='select'){
      hint.textContent='Kliknij obiekt lub zakreśl prostokątem (Ctrl dodaje), przeciągnij zaznaczenie aby przesunąć. Delete = usuń, Esc = anuluj.';
      hint.classList.remove('hide');
    } else if(t==='text'){
      hint.textContent='Kliknij aby dodać tekst. Kliknij istniejący tekst aby edytować. Spacja+przeciągnij = przesuwanie.';
      hint.classList.remove('hide');
    } else {
      hint.textContent='Rysuj palcem / myszą / piórkiem. 1-7 kolory, [ ] rozmiar, Spacja+przeciągnij = przesuwanie. V = zaznacz, T = tekst.';
    }
  }
  function updateCursor(){
    if(tool==='pen' || tool==='eraser'){
      cursor.classList.remove('cursor--pen','cursor--eraser');
      if(tool==='pen'){
        cursor.classList.add('cursor--pen');
        const screenW = baseWidth*scale;
        const s=Math.max(10, screenW*1.6+10);
        cursor.style.width=s+'px'; cursor.style.height=s+'px';
        cursor.style.borderColor=color; cursor.style.color=color;
        cursor.style.background='transparent';
      } else {
        cursor.classList.add('cursor--eraser');
        const screenR = baseWidth*3.2+6;
        const s=Math.max(16, screenR+8);
        cursor.style.width=s+'px'; cursor.style.height=s+'px';
        cursor.style.borderColor='#ef4444'; cursor.style.color='#ef4444';
        cursor.style.background='rgba(239,68,68,.14)';
      }
      if(window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches) cursor.style.display='none';
      else cursor.style.display='block';
    } else { cursor.style.display='none'; cursor.classList.remove('cursor--pen','cursor--eraser'); }
  }

  // ---- Selection helpers (wektor) ----
  function normalizeRect(x0,y0,x1,y1){ return {x:Math.min(x0,x1), y:Math.min(y0,y1), w:Math.abs(x1-x0), h:Math.abs(y1-y0)}; }
  function hitSelection(x,y){ if(!selection) return false; return x>=selection.x && x<=selection.x+selection.w && y>=selection.y && y<=selection.y+selection.h; }
  function updateSelectionUI(){
    if(tool!=='select' || !selection){ selectionBox.classList.remove('active','moving'); selectionBox.style.display='none'; return; }
    selectionBox.classList.add('active');
    selectionBox.classList.toggle('moving', isDraggingSel);
    selectionBox.style.display='block';
    const pos = isDraggingSel && selPos ? selPos : selection;
    const sPos = worldToScreen(pos.x, pos.y);
    const sW = selection.w*scale, sH = selection.h*scale;
    selectionBox.style.left=sPos.x+'px'; selectionBox.style.top=sPos.y+'px';
    selectionBox.style.width=sW+'px'; selectionBox.style.height=sH+'px';
  }
  function clearSelection(push=false){
    const had = selection!==null || selectedIndices.length>0 || selectedImageIndices.length>0 || selectedTextIndices.length>0 || isSelecting || isDraggingSel || (lassoPoints && lassoPoints.length>0);
    selection=null; selectedIndices=[]; selectedOriginals=[]; selectedImageIndices=[]; selectedImageOriginals=[]; selectedTextIndices=[]; selectedTextOriginals=[]; isSelecting=false; isDraggingSel=false; selStart=null; lassoPoints=null; dragStart=null; dragOffset=null; selPos=null;
    selectionBox.classList.remove('active','moving'); selectionBox.style.display='none';
    selectionGhost.style.display='none';
    canvas.classList.remove('select--move');
    if(!push && had) redraw();
    else if(!push) updateSelectionUI();
    updateCopyPasteButtons();
  }
  function updateCopyPasteButtons(){
    const hasSel = selectedIndices.length>0 || selectedImageIndices.length>0 || selectedTextIndices.length>0;
    const hasClip = clipboard && (clipboard.strokes.length>0 || clipboard.images.length>0 || clipboard.texts.length>0);
    const bCopy=document.getElementById('btn-copy');
    const bPaste=document.getElementById('btn-paste');
    if(bCopy){ bCopy.disabled=!hasSel; bCopy.style.opacity=hasSel?1:.45; }
    if(bPaste){ bPaste.disabled=!hasClip; bPaste.style.opacity=hasClip?1:.45; }
  }
  function copySelection(){
    if(!selection || (selectedIndices.length===0 && selectedImageIndices.length===0 && selectedTextIndices.length===0)) return false;
    const clipStrokes = selectedIndices.map(i=> {
      const s=strokes[i];
      return {color:s.color, baseWidth:s.baseWidth, usePressure:s.usePressure, points: s.points.map(p=>({...p})) };
    });
    const clipImages = selectedImageIndices.map(i=>{
      const im=images[i];
      return {src:im.src, x:im.x, y:im.y, w:im.w, h:im.h};
    });
    const clipTexts = selectedTextIndices.map(i=>{
      const t=texts[i];
      return {...t};
    });
    clipboard = { strokes:clipStrokes, images:clipImages, texts:clipTexts, pasteCount:0 };
    updateCopyPasteButtons();
    return true;
  }
  function pasteClipboard(){
    if(!clipboard || (clipboard.strokes.length===0 && clipboard.images.length===0 && clipboard.texts.length===0)) return false;
    clipboard.pasteCount = (clipboard.pasteCount||0)+1;
    const off = 22/scale + (clipboard.pasteCount-1)*8/scale;
    pushHistory();
    const newStrokeIndices=[];
    const newImageIndices=[];
    const newTextIndices=[];
    for(const s of clipboard.strokes){
      const ns={id: Date.now()+Math.random(), color:s.color, baseWidth:s.baseWidth, usePressure:s.usePressure, points: s.points.map(p=>({x:p.x+off, y:p.y+off, pressure:p.pressure}))};
      strokes.push(ns);
      newStrokeIndices.push(strokes.length-1);
    }
    for(const im of clipboard.images){
      const nim={id: Date.now()+Math.random(), src:im.src, x:im.x+off, y:im.y+off, w:im.w, h:im.h, _img:null};
      const img=new Image(); img.src=im.src; img.onload=()=>redraw(); nim._img=img;
      images.push(nim);
      newImageIndices.push(images.length-1);
    }
    for(const t of clipboard.texts){
      const nt={id: Date.now()+Math.random(), x:t.x+off, y:t.y+off, text:t.text, color:t.color, size:t.size};
      texts.push(nt);
      newTextIndices.push(texts.length-1);
    }
    selectedIndices=newStrokeIndices;
    selectedImageIndices=newImageIndices;
    selectedTextIndices=newTextIndices;
    const bbox=computeSelectionBBox();
    if(bbox) selection={x:bbox.x, y:bbox.y, w:bbox.w, h:bbox.h}; else selection=null;
    setTool('select');
    updateSelectionUI(); redraw(); updateCopyPasteButtons();
    return true;
  }
  function findIndicesInRect(rect){
    const idx=[];
    strokes.forEach((s,i)=>{ if(isStrokeInRect(s,rect)) idx.push(i); });
    return idx;
  }
  function findImageIndicesInRect(rect){
    const idx=[];
    images.forEach((im,i)=>{ if(isImageInRect(im,rect)) idx.push(i); });
    return idx;
  }
  function isPointInPolygon(pt, poly){
    let inside=false;
    for(let i=0,j=poly.length-1;i<poly.length;j=i++){
      const xi=poly[i].x, yi=poly[i].y, xj=poly[j].x, yj=poly[j].y;
      const intersect = ((yi>pt.y)!==(yj>pt.y)) && (pt.x < (xj-xi)*(pt.y-yi)/(yj-yi)+xi);
      if(intersect) inside=!inside;
    }
    return inside;
  }
  function isStrokeInPolygon(st, poly){
    for(const p of st.points) if(isPointInPolygon(p, poly)) return true;
    for(let i=1;i<st.points.length;i++){
      const a=st.points[i-1], b=st.points[i];
      for(let j=0;j<poly.length;j++){
        const c=poly[j], d=poly[(j+1)%poly.length];
        if(segmentsIntersect(a.x,a.y,b.x,b.y, c.x,c.y,d.x,d.y)) return true;
      }
    }
    const bb=getStrokeBBox(st);
    if(bb && isPointInPolygon({x:bb.minX,y:bb.minY}, poly)) return true;
    return false;
  }
  function isImageInPolygon(im, poly){
    const cx=im.x+im.w/2, cy=im.y+im.h/2;
    if(isPointInPolygon({x:cx,y:cy}, poly)) return true;
    const corners=[{x:im.x,y:im.y},{x:im.x+im.w,y:im.y},{x:im.x+im.w,y:im.y+im.h},{x:im.x,y:im.y+im.h}];
    for(const c of corners) if(isPointInPolygon(c, poly)) return true;
    for(let j=0;j<poly.length;j++){
      const a=poly[j], b=poly[(j+1)%poly.length];
      const edges=[[{x:im.x,y:im.y},{x:im.x+im.w,y:im.y}],[{x:im.x+im.w,y:im.y},{x:im.x+im.w,y:im.y+im.h}],[{x:im.x+im.w,y:im.y+im.h},{x:im.x,y:im.y+im.h}],[{x:im.x,y:im.y+im.h},{x:im.x,y:im.y}]];
      for(const [p,q] of edges) if(segmentsIntersect(a.x,a.y,b.x,b.y, p.x,p.y,q.x,q.y)) return true;
    }
    return false;
  }
  function isTextInPolygon(t, poly){
    const bb=getTextBBox(t);
    if(!bb) return false;
    const cx=bb.x+bb.w/2, cy=bb.y+bb.h/2;
    if(isPointInPolygon({x:cx,y:cy}, poly)) return true;
    const corners=[{x:bb.x,y:bb.y},{x:bb.x+bb.w,y:bb.y},{x:bb.x+bb.w,y:bb.y+bb.h},{x:bb.x,y:bb.y+bb.h}];
    for(const c of corners) if(isPointInPolygon(c, poly)) return true;
    return false;
  }
  function findIndicesInPolygon(poly){
    const idx=[];
    strokes.forEach((s,i)=>{ if(isStrokeInPolygon(s,poly)) idx.push(i); });
    return idx;
  }
  function findImageIndicesInPolygon(poly){
    const idx=[];
    images.forEach((im,i)=>{ if(isImageInPolygon(im,poly)) idx.push(i); });
    return idx;
  }
  function findTextIndicesInPolygon(poly){
    const idx=[];
    texts.forEach((t,i)=>{ if(isTextInPolygon(t,poly)) idx.push(i); });
    return idx;
  }

  // Pointer events
  let activePointerId=null;

  function handleSelectPointerDown(e){
    const {x,y}=getPos(e);
    if(selection && hitSelection(x,y) && (selectedIndices.length || selectedImageIndices.length || selectedTextIndices.length)){
      isDraggingSel=true; dragStart={x,y};
      // zapamiętaj pozycję ramki i oryginalne punkty
      selPos={x:selection.x, y:selection.y};
      dragOffset={x:x-selection.x, y:y-selection.y};
      selectedOriginals = selectedIndices.map(i=> cloneStrokes([strokes[i]])[0].points.map(p=>({...p})));
      selectedImageOriginals = selectedImageIndices.map(i=> ({x:images[i].x, y:images[i].y, w:images[i].w, h:images[i].h}));
      selectedTextOriginals = selectedTextIndices.map(i=> ({x:texts[i].x, y:texts[i].y}));
      pushHistory();
      canvas.setPointerCapture(e.pointerId); activePointerId=e.pointerId;
      canvas.classList.add('select--move'); updateSelectionUI();
      e.preventDefault(); return true;
    }
    // kliknięcie – hit test (tekst > obraz > wektor), Ctrl/Cmd = toggle
    const hitIdxText = hitText(x,y);
    const hitIdxImage = hitIdxText<0 ? hitImageIndex(x,y) : -1;
    const hitIdxStroke = (hitIdxText<0 && hitIdxImage<0) ? hitStrokeIndex(x,y) : -1;
    const isCtrl = e.ctrlKey || e.metaKey || e.shiftKey;
    if(hitIdxText>=0 || hitIdxImage>=0 || hitIdxStroke>=0){
      if(!isCtrl){
        selectedIndices=[]; selectedImageIndices=[]; selectedTextIndices=[];
        if(hitIdxText>=0) selectedTextIndices=[hitIdxText];
        else if(hitIdxImage>=0) selectedImageIndices=[hitIdxImage];
        else if(hitIdxStroke>=0) selectedIndices=[hitIdxStroke];
      } else {
        if(hitIdxText>=0){
          const p=selectedTextIndices.indexOf(hitIdxText);
          if(p>=0) selectedTextIndices.splice(p,1); else { selectedTextIndices.push(hitIdxText); selectedIndices=[]; selectedImageIndices=[]; }
        } else if(hitIdxImage>=0){
          const p=selectedImageIndices.indexOf(hitIdxImage);
          if(p>=0) selectedImageIndices.splice(p,1); else { selectedImageIndices.push(hitIdxImage); selectedIndices=[]; selectedTextIndices=[]; }
        } else if(hitIdxStroke>=0){
          const p=selectedIndices.indexOf(hitIdxStroke);
          if(p>=0) selectedIndices.splice(p,1); else { selectedIndices.push(hitIdxStroke); selectedImageIndices=[]; selectedTextIndices=[]; }
        }
      }
      const bbox=computeSelectionBBox();
      if(bbox){ selection={x:bbox.x, y:bbox.y, w:bbox.w, h:bbox.h}; }
      else selection=null;
      updateSelectionUI(); redraw(); updateCopyPasteButtons();
      canvas.setPointerCapture(e.pointerId); activePointerId=e.pointerId;
      e.preventDefault(); return true;
    }
    // klik w puste – wyczyść i rozpocznij prostokąt
    clearSelection(false);
    isSelecting=true; selStart={x,y}; selection={x,y,w:0,h:0}; lassoPoints=null;
    canvas.setPointerCapture(e.pointerId); activePointerId=e.pointerId;
    hint.classList.add('hide');
    updateSelectionUI(); redraw();
    e.preventDefault(); return true;
  }
  function handleSelectPointerMove(e){
    const {x,y}=getPos(e);
    if(isSelecting && selStart){
      selection=normalizeRect(selStart.x, selStart.y, x,y);
      updateSelectionUI(); redraw();
      e.preventDefault(); return true;
    }
    if(isDraggingSel && dragStart && selPos){
      const dx=x-dragStart.x, dy=y-dragStart.y;
      const nx=selection.x+dx, ny=selection.y+dy;
      selPos={x:nx,y:ny};
      // przesuń wektory
      selectedIndices.forEach((idx,k)=>{
        const orig=selectedOriginals[k];
        const st=strokes[idx];
        st.points = orig.map(p=>({x:p.x+dx, y:p.y+dy, pressure:p.pressure}));
      });
      // przesuń obrazy
      selectedImageIndices.forEach((idx,k)=>{
        const orig=selectedImageOriginals[k];
        const im=images[idx];
        im.x = orig.x + dx;
        im.y = orig.y + dy;
      });
      // przesuń teksty
      selectedTextIndices.forEach((idx,k)=>{
        const orig=selectedTextOriginals[k];
        const t=texts[idx];
        t.x = orig.x + dx;
        t.y = orig.y + dy;
      });
      redraw();
      updateSelectionUI();
      e.preventDefault(); return true;
    }
    if(selection && hitSelection(x,y)) canvas.classList.add('select--move'); else canvas.classList.remove('select--move');
    return false;
  }
  function handleSelectPointerUp(e){
    if(isSelecting){
      isSelecting=false;
      if(!selection || selection.w*scale<8 || selection.h*scale<8){
        clearSelection(false);
      } else {
        const isCtrl = e.ctrlKey || e.metaKey || e.shiftKey;
        const foundStrokes=findIndicesInRect(selection);
        const foundImages=findImageIndicesInRect(selection);
        const foundTexts=findTextIndicesInRect(selection);
        if(isCtrl){
          for(const idx of foundStrokes) if(!selectedIndices.includes(idx)) selectedIndices.push(idx);
          for(const idx of foundImages) if(!selectedImageIndices.includes(idx)) selectedImageIndices.push(idx);
          for(const idx of foundTexts) if(!selectedTextIndices.includes(idx)) selectedTextIndices.push(idx);
        } else {
          selectedIndices=foundStrokes;
          selectedImageIndices=foundImages;
          selectedTextIndices=foundTexts;
        }
        const bbox=computeSelectionBBox();
        if(bbox) selection={x:bbox.x, y:bbox.y, w:bbox.w, h:bbox.h}; else selection=null;
        if(!selection || (!selectedIndices.length && !selectedImageIndices.length && !selectedTextIndices.length)){
          // nic nie trafiono
        }
        updateSelectionUI(); redraw(); updateCopyPasteButtons();
      }
      lassoPoints=null; selStart=null;
      if(activePointerId!==null) try{canvas.releasePointerCapture(activePointerId);}catch(_){}
      activePointerId=null; return true;
    }
    if(isDraggingSel){
      isDraggingSel=false;
      // zatwierdź: zaktualizuj selection na nową pozycję
      if(selPos) selection={x:selPos.x, y:selPos.y, w:selection.w, h:selection.h};
      selPos=null; selectedOriginals=[]; selectedImageOriginals=[]; selectedTextOriginals=[]; dragStart=null;
      canvas.classList.remove('select--move');
      updateSelectionUI(); redraw();
      if(activePointerId!==null) try{canvas.releasePointerCapture(activePointerId);}catch(_){}
      activePointerId=null; return true;
    }
    return false;
  }

  // ---- Pan (przesuwanie widoku) ----
  function startPan(e){
    const rect=canvas.getBoundingClientRect();
    isPanning=true; panStart={x:e.clientX-rect.left, y:e.clientY-rect.top}; panOrig={x:panX, y:panY};
    canvas.setPointerCapture(e.pointerId); activePointerId=e.pointerId;
    canvas.style.cursor='grabbing';
  }
  function doPan(e){
    if(!isPanning || !panStart) return;
    const rect=cachedWrapRect || canvas.getBoundingClientRect();
    const cur={x:e.clientX-rect.left, y:e.clientY-rect.top};
    panX = panOrig.x + (cur.x - panStart.x);
    panY = panOrig.y + (cur.y - panStart.y);
    requestRedrawThrottled(); updateSelectionUI();
  }
  function endPan(e){
    if(!isPanning) return;
    if(e && activePointerId!==null && e.pointerId!==activePointerId) return;
    isPanning=false; panStart=null; panOrig=null;
    if(activePointerId!==null) try{canvas.releasePointerCapture(activePointerId);}catch(_){}
    activePointerId=null;
    canvas.style.cursor= isSpacePressed ? 'grab' : '';
  }

  canvas.addEventListener('pointerdown', (e)=>{
    // pan – narzędzie pointer / środkowy przycisk / Alt / Spacja
    if(tool==='pointer' || e.button===1 || (e.button===0 && e.altKey) || isSpacePressed){
      startPan(e); e.preventDefault(); return;
    }
    if(tool==='select'){ handleSelectPointerDown(e); return; }
    if(tool==='text'){
      const {x,y}=getPos(e);
      const idx=hitText(x,y);
      if(idx>=0){
        const t=texts[idx];
        createTextEditor(t.x, t.y, idx);
      } else {
        if(editingText) commitTextEdit(true);
        createTextEditor(x,y, null);
      }
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId); activePointerId=e.pointerId;
      return;
    }
    if(e.button!==0 && e.button!==5) return;
    let effectiveTool=tool;
    if(e.pointerType==='pen' && e.button===5) effectiveTool='eraser';
    if(e.pointerType==='pen' && e.buttons===32) effectiveTool='eraser';
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId); activePointerId=e.pointerId;
    const {x,y,pressure}=getPos(e);
    isDrawing=true; lastX=x; lastY=y;
    hint.classList.add('hide');

    if(effectiveTool==='eraser'){
      pushHistory();
      eraserLast={x,y};
      const screenR= baseWidth*3.2+6, worldR=screenR/scale;
      const before=strokes.length;
      strokes = strokes.filter(s=> !isStrokeHitByEraser(s, x,y,x,y, worldR/2));
      if(strokes.length!==before) redraw();
      canvas.dataset.effectiveTool='eraser';
      return;
    }
    // pen – nowy wektor
    pushHistory();
    currentStroke={id: Date.now()+Math.random(), color, baseWidth, usePressure, points:[{x,y,pressure}]};
    strokes.push(currentStroke);
    lineStart={x,y}; lineStartPressure=pressure;
    // narysuj kropkę (z uwzględnieniem skali)
    const w=widthForPressure(pressure, baseWidth);
    ctx.save(); ctx.setTransform(scale*dpr(),0,0,scale*dpr(), panX*dpr(), panY*dpr());
    ctx.fillStyle=color;
    ctx.beginPath(); ctx.arc(x,y,w/2,0,Math.PI*2); ctx.fill();
    ctx.restore();
    // pełny redraw zapewni spójność wygładzania
    canvas.dataset.effectiveTool='pen';
  });

  canvas.addEventListener('pointermove', (e)=>{
    const evts = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    const lastE = evts[evts.length-1];
    const {x:lx, y:ly, pressure:lp} = getPos(lastE);
    lastMouseWorld={x:lx, y:ly};
    cursor.style.left=lastE.clientX+'px'; cursor.style.top=lastE.clientY+'px';
    if(isPanning){ doPan(lastE); return; }
    if(tool==='select'){ handleSelectPointerMove(lastE); return; }
    if(!isDrawing || e.pointerId!==activePointerId) return;
    e.preventDefault();
    const eff=canvas.dataset.effectiveTool||tool;
    if(eff==='eraser'){
      let changed=false;
      for(const ce of evts){
        const {x,y}=getPos(ce);
        const screenR= baseWidth*3.2+6, worldR=screenR/scale;
        const x0=eraserLast?eraserLast.x:x, y0=eraserLast?eraserLast.y:y;
        const before=strokes.length;
        strokes = strokes.filter(s=> !isStrokeHitByEraser(s, x0,y0,x,y, worldR/2));
        if(strokes.length!==before) changed=true;
        eraserLast={x,y}; lastX=x; lastY=y;
      }
      if(changed) redraw();
      return;
    }
    if(currentStroke){
      const isShift = evts.some(ce=>ce.shiftKey) || e.shiftKey;
      if(isShift && lineStart){
        let added=false;
        for(const ce of evts){
          const {x,y,pressure}=getPos(ce);
          currentStroke.points=[{x:lineStart.x, y:lineStart.y, pressure:lineStartPressure}, {x,y,pressure}];
          lastX=x; lastY=y; added=true;
        }
        if(added) redraw();
        return;
      }
      let added=false;
      for(const ce of evts){
        const {x,y,pressure}=getPos(ce);
        const last = currentStroke.points[currentStroke.points.length-1];
        if(last && Math.hypot(last.x - x, last.y - y) < (isFirefox ? 0 : 0.01)) continue;
        currentStroke.points.push({x,y,pressure});
        lastX=x; lastY=y; added=true;
      }
      if(added){
        if(currentStroke.points.length <= 4) redraw();
        else requestRedrawThrottled();
      }
    }
  });

  function endDraw(e){
    if(isPanning){ endPan(e); return; }
    if(tool==='select'){ if(e) handleSelectPointerUp(e); return; }
    if(!isDrawing) return;
    if(e && activePointerId!==null && e.pointerId!==activePointerId) return;
    isDrawing=false; activePointerId=null;
    currentStroke=null; eraserLast=null; lineStart=null;
    ctx.globalCompositeOperation='source-over';
    redraw();
    updateCursor();
    if(e) { cursor.style.left=e.clientX+'px'; cursor.style.top=e.clientY+'px'; }
  }
  canvas.addEventListener('pointerup', endDraw);
  canvas.addEventListener('pointercancel', (e)=>{
    if(tool==='select'){
      if(isSelecting){ clearSelection(false); activePointerId=null; return; }
      if(isDraggingSel){
        if(selectedIndices.length && selectedOriginals.length){
          selectedIndices.forEach((idx,k)=>{ strokes[idx].points = selectedOriginals[k].map(p=>({...p})); });
        }
        if(selectedImageIndices.length && selectedImageOriginals.length){
          selectedImageIndices.forEach((idx,k)=>{ const o=selectedImageOriginals[k]; images[idx].x=o.x; images[idx].y=o.y; });
        }
        redraw();
        clearSelection(false); activePointerId=null; return;
      }
    }
    endDraw(e);
  });
  canvas.addEventListener('pointerleave', ()=>{ cursor.style.display='none'; });
  canvas.addEventListener('pointerenter', (e)=>{ updateCursor(); cursor.style.left=e.clientX+'px'; cursor.style.top=e.clientY+'px'; });

  document.querySelectorAll('.tool-btn[data-tool]').forEach(b=> b.addEventListener('click', ()=> setTool(b.dataset.tool)));
  document.querySelectorAll('.mobile-tools .tool-btn[data-tool]').forEach(b=> b.addEventListener('click', ()=> setTool(b.dataset.tool)));

  paletteBtns.forEach(b=> b.addEventListener('click', ()=>{
    paletteBtns.forEach(x=>x.classList.remove('active')); b.classList.add('active');
    color=b.dataset.color; colorInput.value=color;
    if(tool==='eraser') setTool('pen'); updateCursor();
  }));
  colorInput.addEventListener('input', e=>{ color=e.target.value; paletteBtns.forEach(x=>x.classList.remove('active')); if(tool==='eraser') setTool('pen'); updateCursor(); });
  sizeRange.addEventListener('input', e=>{ baseWidth=parseInt(e.target.value,10); sizeLabel.textContent=baseWidth+' px'; updateCursor(); });
  pressureToggle.addEventListener('change', e=> usePressure=e.target.checked);
  bgSelect.addEventListener('change', e=>{ bg=e.target.value; applyBackground(); });
  btnTheme?.addEventListener('click', ()=> applyTheme(!isDarkMode()));
  btnToolbarPos?.addEventListener('click', ()=> applyToolbarPos(!isToolbarRight()));
  document.getElementById('btn-copy')?.addEventListener('click', ()=>{
    if(copySelection()){
      hint.textContent='Skopiowano (Ctrl+V wklej)';
      hint.classList.remove('hide');
      setTimeout(()=>hint.classList.add('hide'),2000);
    }
  });
  document.getElementById('btn-paste')?.addEventListener('click', ()=>{
    if(pasteClipboard()){
      hint.textContent='Wklejono';
      hint.classList.remove('hide');
      setTimeout(()=>hint.classList.add('hide'),1500);
    }
  });
  const btnMore=document.getElementById('btn-more');
  const moreMenu=document.getElementById('more-menu');
  btnMore?.addEventListener('click', (e)=>{
    e.stopPropagation();
    const isHidden = moreMenu.hasAttribute('hidden');
    if(isHidden){
      const r=btnMore.getBoundingClientRect();
      const menuW=200;
      if(isToolbarRight()){
        moreMenu.style.left=(r.left - menuW - 12)+'px';
        moreMenu.style.top=r.top+'px';
        moreMenu.style.right='auto';
      } else {
        moreMenu.style.left=Math.min(window.innerWidth - menuW - 12, r.right - menuW)+'px';
        moreMenu.style.top=(r.bottom + 8)+'px';
        moreMenu.style.right='auto';
      }
      moreMenu.removeAttribute('hidden');
    } else {
      moreMenu.setAttribute('hidden','');
    }
  });
  document.addEventListener('click', (e)=>{
    if(moreMenu && !moreMenu.hasAttribute('hidden') && !moreMenu.contains(e.target) && e.target!==btnMore && !btnMore.contains(e.target)){
      moreMenu.setAttribute('hidden','');
    }
  });
  moreMenu?.querySelectorAll('button').forEach(b=> b.addEventListener('click', ()=> moreMenu.setAttribute('hidden','')));
  // zoom UI
  document.getElementById('zoom-in')?.addEventListener('click', ()=> zoomIn());
  document.getElementById('zoom-out')?.addEventListener('click', ()=> zoomOut());
  document.getElementById('zoom-reset')?.addEventListener('click', ()=> resetView());
  // wheel zoom (Ctrl + kółko lub pinch)
  wrap.addEventListener('wheel', (e)=>{
    if(e.ctrlKey || e.metaKey || e.altKey || true){ // zawsze wspieraj wheel zoom dla wygody
      // jeśli nie ma Ctrl, wymagaj żeby kółko było nad canvas i nie rysujemy
      if(isDrawing || isSelecting || isDraggingSel) return;
      e.preventDefault();
      const rect=wrap.getBoundingClientRect();
      const cx=e.clientX-rect.left, cy=e.clientY-rect.top;
      const delta = e.deltaY < 0 ? 1.12 : 0.89;
      setZoom(scale*delta, cx, cy);
    }
  }, {passive:false});
  // pinch zoom (touch)
  wrap.addEventListener('touchstart', (e)=>{
    if(e.touches.length===2){
      e.preventDefault();
      const dx=e.touches[0].clientX-e.touches[1].clientX;
      const dy=e.touches[0].clientY-e.touches[1].clientY;
      pinchStartDist=Math.hypot(dx,dy);
      pinchStartScale=scale;
    }
  }, {passive:false});
  wrap.addEventListener('touchmove', (e)=>{
    if(e.touches.length===2 && pinchStartDist){
      e.preventDefault();
      const dx=e.touches[0].clientX-e.touches[1].clientX;
      const dy=e.touches[0].clientY-e.touches[1].clientY;
      const dist=Math.hypot(dx,dy);
      const factor=dist/pinchStartDist;
      const rect=wrap.getBoundingClientRect();
      const cx=(e.touches[0].clientX+e.touches[1].clientX)/2 - rect.left;
      const cy=(e.touches[0].clientY+e.touches[1].clientY)/2 - rect.top;
      setZoom(pinchStartScale*factor, cx, cy);
    }
  }, {passive:false});
  wrap.addEventListener('touchend', (e)=>{
    if(e.touches.length<2) pinchStartDist=null;
  });
  // dwuklik – reset
  canvas.addEventListener('dblclick', (e)=>{
    if(tool==='pointer' || e.altKey) { resetView(); e.preventDefault(); }
  });
  canvas.addEventListener('dblclick', (e)=>{
    const {x,y}=getPos(e);
    const idx=hitText(x,y);
    if(idx>=0){
      createTextEditor(texts[idx].x, texts[idx].y, idx);
      setTool('text');
      e.preventDefault();
    }
  });
  btnUndo.addEventListener('click', undo);
  btnRedo.addEventListener('click', redo);
  document.getElementById('m-undo')?.addEventListener('click', undo);
  btnClear.addEventListener('click', ()=>{ if(typeof clearDialog.showModal==='function') clearDialog.showModal(); else if(confirm('Wyczyścić tablicę?')) clearCanvas(true); });
  document.getElementById('m-clear')?.addEventListener('click', ()=>{ if(typeof clearDialog.showModal==='function') clearDialog.showModal(); else if(confirm('Wyczyścić tablicę?')) clearCanvas(true); });
  clearDialog?.addEventListener('close', ()=>{ if(clearDialog.returnValue==='confirm') clearCanvas(true); });
  btnSave.addEventListener('click', savePNG);
  document.getElementById('m-save')?.addEventListener('click', savePNG);
  document.getElementById('btn-export-svg')?.addEventListener('click', exportSVG);
  document.getElementById('btn-import-svg')?.addEventListener('click', ()=> document.getElementById('import-svg-input')?.click());
  document.getElementById('import-svg-input')?.addEventListener('change', async (e)=>{
    const file=e.target.files?.[0]; if(!file) return;
    const text=await file.text();
    const ok=importSVGText(text);
    if(!ok) alert('Nie udało się wczytać SVG – nie znaleziono wektorów.');
    e.target.value='';
  });
  document.getElementById('btn-import-image')?.addEventListener('click', ()=> document.getElementById('import-image-input')?.click());
  document.getElementById('import-image-input')?.addEventListener('change', e=>{
    const file=e.target.files?.[0]; if(!file) return;
    addImageFromFile(file);
    e.target.value='';
  });
  // drag & drop SVG na tablicę
  // --- Obrazy: wklejanie / drag&drop ---
  function addImageFromSrc(src, worldPos){
    const img=new Image();
    img.src=src;
    img.onload=()=>{
      let iw=img.naturalWidth, ih=img.naturalHeight;
      if(!iw||!ih) return;
      const rect=wrap.getBoundingClientRect();
      const viewW=rect.width/scale, viewH=rect.height/scale;
      const maxW=viewW*0.6, maxH=viewH*0.6;
      let fit=Math.min(1, maxW/iw, maxH/ih);
      if(iw*fit>1000) fit=1000/iw;
      if(ih*fit>1000) fit=Math.min(fit,1000/ih);
      const worldW=iw*fit, worldH=ih*fit;
      let cx, cy;
      if(worldPos){ cx=worldPos.x - worldW/2; cy=worldPos.y - worldH/2; }
      else {
        // schowek / przycisk Obraz -> zawsze na dole viewportu, wyśrodkowany poziomo
        const bottomCenter = screenToWorld(rect.width/2, rect.height);
        const pad = 24 / scale;
        cx = bottomCenter.x - worldW/2;
        cy = bottomCenter.y - worldH - pad;
      }
      pushHistory();
      const rec={id:Date.now()+Math.random(), src, x:cx, y:cy, w:worldW, h:worldH, _img:img};
      images.push(rec);
      // auto-select w trybie select
      selection={x:cx, y:cy, w:worldW, h:worldH};
      selectedIndices=[];
      selectedImageIndices=[images.length-1];
      selectedOriginals=[]; selectedImageOriginals=[];
      setTool('select');
      updateSelectionUI(); redraw();
      hint.textContent='Obraz wklejony – zaznacz (V) i przeciągnij aby przesunąć, Delete aby usunąć. Ctrl+V aby wkleić kolejny.';
      hint.classList.remove('hide');
      setTimeout(()=> hint.classList.add('hide'), 4000);
    };
    img.onerror=()=> console.warn('image load failed');
  }
  function addImageFromFile(file, worldPos){
    if(!file.type.startsWith('image/')) return false;
    const reader=new FileReader();
    reader.onload=e=> addImageFromSrc(e.target.result, worldPos);
    reader.readAsDataURL(file);
    return true;
  }
  // Ctrl+V – wklejanie ze schowka (obrazy z systemu mają priorytet, potem linie z wewnętrznego schowka)
  document.addEventListener('paste', e=>{
    const ae=document.activeElement;
    if(ae && (ae.tagName==='INPUT' || ae.tagName==='TEXTAREA' || ae.isContentEditable)) return;
    const items=e.clipboardData?.items;
    if(!items) return;
    let handled=false;
    for(const it of items){
      if(it.type.startsWith('image/')){
        const file=it.getAsFile();
        if(file){ addImageFromFile(file); handled=true; }
      }
    }
    // fallback: files
    if(!handled && e.clipboardData.files && e.clipboardData.files.length){
      for(const f of e.clipboardData.files){
        if(f.type.startsWith('image/')){ addImageFromFile(f); handled=true; }
      }
    }
    if(handled){
      e.preventDefault();
      return;
    }
    // brak obrazu w schowku systemowym – spróbuj wkleić skopiowane linie z wewnętrznego schowka
    if(clipboard && (clipboard.strokes.length>0 || clipboard.images.length>0 || clipboard.texts.length>0)){
      if(pasteClipboard()){
        e.preventDefault();
      }
    }
  });
  // drag & drop obrazów + SVG
  wrap.addEventListener('dragover', e=>{
    const hasImage=[... (e.dataTransfer.types||[])].some(t=> t.includes('image')) || [...(e.dataTransfer.files||[])].some(f=> f.type.startsWith('image/'));
    const hasSvg=e.dataTransfer?.types.includes('image/svg+xml') || e.dataTransfer?.types.includes('text/plain');
    if(hasImage || hasSvg){ e.preventDefault(); wrap.style.outline='2px dashed var(--primary)'; }
  });
  wrap.addEventListener('dragleave', ()=>{ wrap.style.outline=''; });
  wrap.addEventListener('drop', async e=>{
    const rect=wrap.getBoundingClientRect();
    const worldPos=screenToWorld(e.clientX-rect.left, e.clientY-rect.top);
    // obraz?
    const imgFile=[...e.dataTransfer.files].find(f=> f.type.startsWith('image/'));
    if(imgFile){ e.preventDefault(); wrap.style.outline=''; addImageFromFile(imgFile, worldPos); return; }
    // svg plik?
    const svgFile=[...e.dataTransfer.files].find(f=> f.type==='image/svg+xml' || f.name.endsWith('.svg'));
    if(svgFile){ e.preventDefault(); wrap.style.outline=''; const text=await svgFile.text(); importSVGText(text); return; }
    const svgText=e.dataTransfer.getData('text/plain');
    if(svgText && svgText.includes('<svg')){ e.preventDefault(); importSVGText(svgText); }
    wrap.style.outline='';
  });
  function savePNG(){
    const ratio=dpr(), cssW=canvas.width/ratio, cssH=canvas.height/ratio;
    const tmp=document.createElement('canvas'); tmp.width=canvas.width; tmp.height=canvas.height;
    const tctx=tmp.getContext('2d');
    drawBackgroundForExport(tctx, cssW, cssH, bg, ratio);
    tctx.drawImage(canvas,0,0);
    const url=tmp.toDataURL('image/png');
    const a=document.createElement('a'); a.href=url; a.download='whiteboard-'+new Date().toISOString().slice(0,10)+'.png'; a.click();
  }
  // --- SVG export / import ---
  function getStrokesBBox(){
    let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    let has=false;
    strokes.forEach(s=> s.points.forEach(p=>{
      has=true; if(p.x<minX)minX=p.x; if(p.y<minY)minY=p.y; if(p.x>maxX)maxX=p.x; if(p.y>maxY)maxY=p.y;
    }));
    images.forEach(im=>{ has=true; if(im.x<minX)minX=im.x; if(im.y<minY)minY=im.y; if(im.x+im.w>maxX)maxX=im.x+im.w; if(im.y+im.h>maxY)maxY=im.y+im.h; });
    texts.forEach(t=>{ const bb=getTextBBox(t); if(bb){ has=true; if(bb.minX<minX)minX=bb.minX; if(bb.minY<minY)minY=bb.minY; if(bb.maxX>maxX)maxX=bb.maxX; if(bb.maxY>maxY)maxY=bb.maxY; }});
    if(!has) return null;
    const pad = Math.max(12, ...strokes.map(s=>s.baseWidth), ...texts.map(t=>t.size||16)) + 16;
    return {minX: minX-pad, minY: minY-pad, maxX: maxX+pad, maxY: maxY+pad, w: (maxX-minX)+pad*2, h: (maxY-minY)+pad*2};
  }
  function exportSVG(){
    const esc = s => String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
    let vb, vbW, vbH;
    const bbox = getStrokesBBox();
    if(bbox){
      vb = `${bbox.minX} ${bbox.minY} ${bbox.w} ${bbox.h}`;
      vbW = bbox.w; vbH = bbox.h;
    } else {
      const rect=wrap.getBoundingClientRect();
      vb = `0 0 ${rect.width} ${rect.height}`;
      vbW = rect.width; vbH = rect.height;
    }
    let svg = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    svg += `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(vbW)}" height="${Math.round(vbH)}" viewBox="${vb}" version="1.1">\n`;
    svg += `<rect x="${bbox?bbox.minX:0}" y="${bbox?bbox.minY:0}" width="${vbW}" height="${vbH}" fill="#ffffff"/>\n`;
    if(bg==='grid'){
      svg += `<defs><pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="#e2e8f0" stroke-width="0.6"/></pattern></defs>\n`;
      svg += `<rect x="${bbox?bbox.minX:0}" y="${bbox?bbox.minY:0}" width="${vbW}" height="${vbH}" fill="url(#grid)"/>\n`;
    } else if(bg==='lines'){
      svg += `<defs><pattern id="lines" width="32" height="28" patternUnits="userSpaceOnUse"><path d="M 0 28 L 32 28" stroke="#e2e8f0" stroke-width="0.7"/><path d="M 72 0 L 72 28" stroke="#fecaca" stroke-width="1"/></pattern></defs>\n`;
      svg += `<rect x="${bbox?bbox.minX:0}" y="${bbox?bbox.minY:0}" width="${vbW}" height="${vbH}" fill="url(#lines)"/>\n`;
    } else if(bg==='dots'){
      svg += `<defs><pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1.2" fill="#e2e8f0"/></pattern></defs>\n`;
      svg += `<rect x="${bbox?bbox.minX:0}" y="${bbox?bbox.minY:0}" width="${vbW}" height="${vbH}" fill="url(#dots)"/>\n`;
    } else if(bg==='cartesian'){
      const isDark=document.documentElement.classList.contains('dark');
      const axisCol=isDark?'#3b82f6':'#2563eb';
      const cx=(bbox?bbox.minX:0)+vbW/2, cy=(bbox?bbox.minY:0)+vbH/2;
      svg += `<line x1="${cx}" y1="${bbox?bbox.minY:0}" x2="${cx}" y2="${(bbox?bbox.minY:0)+vbH}" stroke="${axisCol}" stroke-width="1.2"/>\n`;
      svg += `<line x1="${bbox?bbox.minX:0}" y1="${cy}" x2="${(bbox?bbox.minX:0)+vbW}" y2="${cy}" stroke="${axisCol}" stroke-width="1.2"/>\n`;
      svg += `<polygon points="${(bbox?bbox.minX:0)+vbW},${cy} ${(bbox?bbox.minX:0)+vbW-8},${cy-4} ${(bbox?bbox.minX:0)+vbW-8},${cy+4}" fill="${axisCol}"/>\n`;
      svg += `<polygon points="${cx},${bbox?bbox.minY:0} ${cx-4},${(bbox?bbox.minY:0)+8} ${cx+4},${(bbox?bbox.minY:0)+8}" fill="${axisCol}"/>\n`;
    }
    // metadata – pełny zapis wektorów do idealnego importu
    try{
      const json = JSON.stringify({strokes, images: images.map(im=>({src:im.src,x:im.x,y:im.y,w:im.w,h:im.h})), texts, bg, version:3});
      const b64 = btoa(unescape(encodeURIComponent(json)));
      svg += `<metadata id="whiteboard-data">${b64}</metadata>\n`;
    }catch(e){}
    svg += `<g id="strokes" stroke-linecap="round" stroke-linejoin="round">\n`;
    strokes.forEach(st=>{
      const pts = smoothPoints(st.points);
      if(!pts.length) return;
      if(pts.length===1){
        const p=pts[0];
        const w = st.usePressure ? widthForPressure(p.pressure, st.baseWidth) : st.baseWidth;
        svg += `  <circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${(w/2).toFixed(2)}" fill="${esc(st.color)}" stroke="none"/>\n`;
      } else {
        for(let i=1;i<pts.length;i++){
          const a=pts[i-1], b=pts[i];
          const w = st.usePressure ? (widthForPressure(a.pressure, st.baseWidth)+widthForPressure(b.pressure, st.baseWidth))/2 : st.baseWidth;
          svg += `  <line x1="${a.x.toFixed(2)}" y1="${a.y.toFixed(2)}" x2="${b.x.toFixed(2)}" y2="${b.y.toFixed(2)}" stroke="${esc(st.color)}" stroke-width="${w.toFixed(2)}"/>\n`;
        }
      }
    });
    svg += `</g>\n`;
    if(images.length){
      svg += `<g id="images">\n`;
      images.forEach(im=>{
        svg += `  <image href="${esc(im.src)}" x="${im.x.toFixed(2)}" y="${im.y.toFixed(2)}" width="${im.w.toFixed(2)}" height="${im.h.toFixed(2)}" preserveAspectRatio="none"/>\n`;
      });
      svg += `</g>\n`;
    }
    if(texts.length){
      svg += `<g id="texts" font-family="Inter, sans-serif">\n`;
      texts.forEach(t=>{
        const lines=t.text.split('\n');
        lines.forEach((line,i)=>{
          const y=t.y + i*t.size*1.25;
          svg += `  <text x="${t.x.toFixed(2)}" y="${y.toFixed(2)}" font-size="${t.size}" fill="${esc(t.color)}" dominant-baseline="hanging">${esc(line).replace(/>/g,'&gt;')}</text>\n`;
        });
      });
      svg += `</g>\n`;
    }
    svg += `</svg>`;
    const blob = new Blob([svg], {type:'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='whiteboard-'+new Date().toISOString().slice(0,10)+'.svg'; a.click();
    setTimeout(()=> URL.revokeObjectURL(url), 2000);
  }
  function importSVGText(text){
    const parser=new DOMParser();
    const doc=parser.parseFromString(text, 'image/svg+xml');
    const meta=doc.querySelector('metadata#whiteboard-data');
    if(meta && meta.textContent.trim()){
      try{
        const json = decodeURIComponent(escape(atob(meta.textContent.trim())));
        const data=JSON.parse(json);
        if(Array.isArray(data.strokes) || Array.isArray(data.texts) || Array.isArray(data.images)){
          pushHistory();
          if(Array.isArray(data.strokes)) strokes = data.strokes; else strokes=[];
          if(Array.isArray(data.texts)) texts = data.texts; else texts=[];
          if(Array.isArray(data.images)){
            images = data.images.map(d=>{ const im={id:d.id||Date.now()+Math.random(), src:d.src, x:d.x, y:d.y, w:d.w, h:d.h, _img:null}; const img=new Image(); img.src=d.src; img.onload=()=>redraw(); im._img=img; return im; });
          } else images=[];
          if(data.bg) { bg=data.bg; const sel=document.getElementById('bg-select'); if(sel) sel.value=bg; applyBackground(); }
          // dopasuj widok do zaimportowanych wektorów
          const bb=getStrokesBBox();
          if(bb){
            const rect=wrap.getBoundingClientRect();
            const pad=40;
            const sx= (rect.width - pad*2)/bb.w;
            const sy= (rect.height - pad*2)/bb.h;
            const s=Math.max(MIN_SCALE, Math.min(MAX_SCALE, Math.min(sx,sy)*0.92));
            const cx=rect.width/2, cy=rect.height/2;
            const wx=(bb.minX+bb.w/2), wy=(bb.minY+bb.h/2);
            scale=s; panX=cx - wx*scale; panY=cy - wy*scale;
            updateZoomLabel(); updateBackgroundZoom();
          }
          redraw(); updateSelectionUI(); return true;
        }
      }catch(e){ console.warn('meta import failed',e); }
    }
    // fallback – parsuj wizualne elementy
    const imported=[];
    const toNum=v=> parseFloat(v)||0;
    doc.querySelectorAll('line').forEach(el=>{
      const x1=toNum(el.getAttribute('x1')), y1=toNum(el.getAttribute('y1')), x2=toNum(el.getAttribute('x2')), y2=toNum(el.getAttribute('y2'));
      const sw=toNum(el.getAttribute('stroke-width'))||baseWidth;
      const col=el.getAttribute('stroke')||'#0f0f0f';
      if(isFinite(x1)&&isFinite(y1)&&isFinite(x2)&&isFinite(y2)){
        imported.push({id:Date.now()+Math.random(), color:col, baseWidth:sw, usePressure:false, points:[{x:x1,y:y1,pressure:0.7},{x:x2,y:y2,pressure:0.7}]});
      }
    });
    doc.querySelectorAll('circle, ellipse').forEach(el=>{
      const cx=toNum(el.getAttribute('cx')||el.getAttribute('x')), cy=toNum(el.getAttribute('cy')||el.getAttribute('y'));
      const r=toNum(el.getAttribute('r')||el.getAttribute('rx'))||4;
      const fill=el.getAttribute('fill');
      const col=(fill&&fill!=='none'?fill:el.getAttribute('stroke'))||'#0f0f0f';
      if(isFinite(cx)&&isFinite(cy)) imported.push({id:Date.now()+Math.random(), color:col, baseWidth:r*2, usePressure:false, points:[{x:cx,y:cy,pressure:0.7}]});
    });
    doc.querySelectorAll('polyline, polygon').forEach(el=>{
      const ptsStr=el.getAttribute('points'); if(!ptsStr) return;
      const nums=ptsStr.trim().split(/[\s,]+/).map(parseFloat).filter(n=>isFinite(n));
      const points=[];
      for(let i=0;i+1<nums.length;i+=2) points.push({x:nums[i], y:nums[i+1], pressure:0.7});
      if(points.length){
        const sw=toNum(el.getAttribute('stroke-width'))||baseWidth;
        const col=el.getAttribute('stroke')||el.getAttribute('fill')||'#0f0f0f';
        imported.push({id:Date.now()+Math.random(), color:col, baseWidth:sw, usePressure:false, points});
      }
    });
    doc.querySelectorAll('path').forEach(el=>{
      const d=el.getAttribute('d'); if(!d) return;
      const sw=toNum(el.getAttribute('stroke-width'))||baseWidth;
      const col=el.getAttribute('stroke')||'#0f0f0f';
      // parsuj M/L/Q/C – uproszczone: wyciągnij wszystkie pary liczb po M/L
      const nums=(d.match(/-?\d*\.?\d+/g)||[]).map(parseFloat);
      if(nums.length>=2){
        const points=[];
        for(let i=0;i+1<nums.length;i+=2) points.push({x:nums[i], y:nums[i+1], pressure:0.7});
        if(points.length) imported.push({id:Date.now()+Math.random(), color:col, baseWidth:sw, usePressure:false, points});
      }
    });
    if(!imported.length) return false;
    pushHistory();
    // dodaj do istniejącej tablicy (przesuń jeśli poza widokiem)
    strokes = strokes.concat(imported);
    const bb=getStrokesBBox();
    if(bb){
      const rect=wrap.getBoundingClientRect();
      const s=Math.max(MIN_SCALE, Math.min(MAX_SCALE, Math.min((rect.width-40)/bb.w, (rect.height-40)/bb.h)*0.9));
      // nie zmieniaj aktualnego zoom – po prostu przerysuj, ale jeśli import jest poza widokiem, wycentruj
      // sprawdź czy bbox poza ekranem world
      const tl=screenToWorld(0,0), br=screenToWorld(rect.width, rect.height);
      if(bb.minX<br.x && bb.maxX>tl.x && bb.minY<br.y && bb.maxY>tl.y){
        // już widoczny
      } else {
        const wx=(bb.minX+bb.w/2), wy=(bb.minY+bb.h/2);
        const cx=rect.width/2, cy=rect.height/2;
        scale=s; panX=cx - wx*scale; panY=cy - wy*scale;
        updateZoomLabel(); updateBackgroundZoom();
      }
    }
    redraw(); updateSelectionUI();
    return true;
  }
  btnFullscreen.addEventListener('click', ()=>{ if(!document.fullscreenElement) document.getElementById('app').requestFullscreen().catch(()=>{}); else document.exitFullscreen(); });
  document.addEventListener('fullscreenchange', ()=>{ setTimeout(()=>{ clearSelection(false); resizeCanvas(true); },200); btnFullscreen.innerHTML=document.fullscreenElement?'<i class="fa-solid fa-compress"></i>':'<i class="fa-solid fa-expand"></i>'; });

  const toggle=document.getElementById('toolbar-toggle');
  if(toggle){
    toggle.style.display='grid';
    toggle.addEventListener('click', ()=>{
      toolbar.classList.toggle('collapsed');
      setTimeout(()=>{ clearSelection(false); resizeCanvas(true); },310);
      const up=!toolbar.classList.contains('collapsed');
      toggle.innerHTML=up?'<i class="fa-solid fa-chevron-up"></i>':'<i class="fa-solid fa-chevron-down"></i>';
    });
  }

  document.addEventListener('keydown', e=>{
    if(editingText){
      if(e.key==='Escape'){ e.preventDefault(); cancelTextEdit(false); }
      return;
    }
    const aeActive=document.activeElement;
    if(aeActive && (aeActive.tagName==='TEXTAREA' || aeActive.tagName==='INPUT' || aeActive.isContentEditable)){
      if(e.key==='Escape'){ e.preventDefault(); if(editingText) cancelTextEdit(false); }
      return;
    }
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){ e.preventDefault(); if(e.shiftKey) redo(); else undo(); }
    else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){ e.preventDefault(); redo(); }
    else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='c'){ if(editingText) return; const ae=document.activeElement; if(ae && (ae.tagName==='TEXTAREA' || ae.tagName==='INPUT' || ae.isContentEditable)) return; if(copySelection()){ e.preventDefault(); hint.textContent='Skopiowano (Ctrl+V wklej)'; hint.classList.remove('hide'); setTimeout(()=>hint.classList.add('hide'),2000); } }
    else if((e.ctrlKey||e.metaKey) && (e.key==='0' || e.key===' ')){ e.preventDefault(); resetView(); }
    else if((e.ctrlKey||e.metaKey) && (e.key==='+' || e.key==='=')){ e.preventDefault(); zoomIn(); }
    else if((e.ctrlKey||e.metaKey) && (e.key==='-' || e.key==='_')){ e.preventDefault(); zoomOut(); }
    else if(e.key==='+'||e.key==='='){ zoomIn(); }
    else if(e.key==='-'||e.key==='_'){ zoomOut(); }
    else if(e.key==='0' && (e.altKey)){ resetView(); }
    else if(e.key==='e'||e.key==='E'){ setTool('eraser'); }
    else if(e.key==='p'||e.key==='P'){ setTool('pen'); }
    else if(e.key==='v'||e.key==='V'){ setTool('select'); }
    else if(e.key==='h'||e.key==='H'){ setTool('pointer'); }
    else if(e.key==='t'||e.key==='T'){ setTool('text'); }
    else if(e.key==='d'||e.key==='D'){ if(!e.ctrlKey && !e.metaKey && !e.altKey){ e.preventDefault(); applyTheme(!isDarkMode()); } }
    else if(e.key==='r'||e.key==='R'){ if(!e.ctrlKey && !e.metaKey && !e.altKey){ e.preventDefault(); applyToolbarPos(!isToolbarRight()); } }
    else if(e.key==='[' || e.key==='{' ){ if(!e.ctrlKey && !e.metaKey){ e.preventDefault(); baseWidth=Math.max(1, baseWidth-1); sizeRange.value=baseWidth; sizeLabel.textContent=baseWidth+' px'; updateCursor(); } }
    else if(e.key===']' || e.key==='}' ){ if(!e.ctrlKey && !e.metaKey){ e.preventDefault(); baseWidth=Math.min(48, baseWidth+1); sizeRange.value=baseWidth; sizeLabel.textContent=baseWidth+' px'; updateCursor(); } }
    else if(e.key>='1' && e.key<='7' && !e.ctrlKey && !e.metaKey && !e.altKey){
      const map={'1':'#0f0f0f','2':'#ef2626','3':'#2563eb','4':'#16a34a','5':'#eab308','6':'#9333ea','7':'#ffffff'};
      const c=map[e.key];
      if(c){ e.preventDefault(); color=c; colorInput.value=c; paletteBtns.forEach(x=>x.classList.remove('active')); document.querySelector(`.color-btn[data-color="${c}"]`)?.classList.add('active'); if(tool==='eraser') setTool('pen'); updateCursor(); }
    }
    else if(e.code==='Space' || e.key===' '){
      const ae=document.activeElement;
      if(ae && (ae.tagName==='INPUT' || ae.tagName==='TEXTAREA' || ae.isContentEditable)) return;
      if(!isSpacePressed){
        isSpacePressed=true;
        if(!isPanning) canvas.style.cursor='grab';
        cursor.style.display='none';
      }
      e.preventDefault();
    }
    else if(e.key==='Escape'){
      if(editingText){ e.preventDefault(); cancelTextEdit(false); return; }
      if(tool==='select' && (selection||isDraggingSel)){
        e.preventDefault();
        // cofnij drag jeśli był
        if(isDraggingSel){
          if(selectedIndices.length && selectedOriginals.length){
            selectedIndices.forEach((idx,k)=>{ strokes[idx].points = selectedOriginals[k].map(p=>({...p})); });
          }
          if(selectedImageIndices.length && selectedImageOriginals.length){
            selectedImageIndices.forEach((idx,k)=>{ const o=selectedImageOriginals[k]; images[idx].x=o.x; images[idx].y=o.y; });
          }
          if(selectedTextIndices.length && selectedTextOriginals.length){
            selectedTextIndices.forEach((idx,k)=>{ const o=selectedTextOriginals[k]; texts[idx].x=o.x; texts[idx].y=o.y; });
          }
          redraw();
        }
        clearSelection(false);
      } else if(tool==='text' && editingText){ e.preventDefault(); cancelTextEdit(false); }
    }
    else if(e.key==='Delete'||e.key==='Backspace'){
      if(editingText) return;
      if(tool==='select' && selection && (selectedIndices.length || selectedImageIndices.length || selectedTextIndices.length)){
        e.preventDefault(); pushHistory();
        // usuń zaznaczone wektory – od końca by indeksy się nie rozjechały
        selectedIndices.sort((a,b)=>b-a).forEach(i=> strokes.splice(i,1));
        selectedImageIndices.sort((a,b)=>b-a).forEach(i=> images.splice(i,1));
        selectedTextIndices.sort((a,b)=>b-a).forEach(i=> texts.splice(i,1));
        clearSelection(false); redraw();
      } else if(e.key==='Delete') { if(confirm('Wyczyścić tablicę?')) clearCanvas(true); }
    }
    else if(e.key==='F'||e.key==='f'){ if(document.activeElement===document.body){ e.preventDefault(); btnFullscreen.click(); } }
  });
  document.addEventListener('keyup', e=>{
    if(e.code==='Space' || e.key===' '){
      isSpacePressed=false;
      if(!isPanning) canvas.style.cursor='';
      updateCursor();
    }
  });
  window.addEventListener('blur', ()=>{
    if(isSpacePressed){ isSpacePressed=false; if(!isPanning) canvas.style.cursor=''; updateCursor(); }
  });

  canvas.addEventListener('contextmenu', e=> e.preventDefault());
  document.addEventListener('touchmove', e=>{ if(e.target.closest('canvas')) e.preventDefault(); }, {passive:false});

  function init(){
    const saved=localStorage.getItem('whiteb-theme');
    if(saved==='dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) applyTheme(true);
    else applyTheme(false);
    const savedPos=localStorage.getItem('whiteb-toolbar-pos');
    applyToolbarPos(savedPos==='right');
    resizeCanvas(false);
    updateCachedRect();
    setTool(tool);
    updateCopyPasteButtons();
    updateUndoRedo();
    updateZoomLabel();
    updateBackgroundZoom();
    sizeLabel.textContent=baseWidth+' px';
  }
  window.addEventListener('resize', ()=>{ clearSelection(false); resizeCanvas(true); });
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
  setTimeout(()=> hint.classList.add('hide'), 5000);
})();
