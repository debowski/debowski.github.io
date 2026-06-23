// Kalendarz roku szkolnego 2026/2027
(function(){
  // initial academic period (defaults)
  // default start: September of the academic year that contains today
  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth(); // 0..11
  let defaultStartYear = (thisMonth >= 8) ? thisYear : thisYear - 1; // if month >= Sep, start is this year; else previous year
  let start = new Date(defaultStartYear,8,1); // 1 września of defaultStartYear
  let end = new Date(start.getFullYear(), start.getMonth()+12, 0);

  const monthNames = ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'];

  const root = document.getElementById('calendarRoot');
  const monthSelect = document.getElementById('monthSelect');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const showAllBtn = document.getElementById('showAll');
  const exportBtn = document.getElementById('export');
  const importBtn = document.getElementById('import');
  const clearBtn = document.getElementById('clear');
  const printBtn = document.getElementById('print');
  const gotoTodayBtn = document.getElementById('gotoToday');

  const modal = document.getElementById('eventModal');
  const modalDate = document.getElementById('modalDate');
  const eventText = document.getElementById('eventText');
  const saveEvent = document.getElementById('saveEvent');
  const deleteEvent = document.getElementById('deleteEvent');
  const closeModal = document.getElementById('closeModal');

  let storageKey = `school-calendar-${start.getFullYear()}-${end.getFullYear()}-events`;
  let events = JSON.parse(localStorage.getItem(storageKey) || '{}');

  // build months array from start to end (inclusive)
  let months = [];
  function buildMonths(){
    months = [];
    let cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    while(cursor <= end){ months.push(new Date(cursor)); cursor = new Date(cursor.getFullYear(), cursor.getMonth()+1, 1); }
  }

  // Holidays (Poland) - returns true if date is holiday
  function easterDate(year){
    // Anonymous Gregorian algorithm
    const a = year % 19;
    const b = Math.floor(year/100);
    const c = year % 100;
    const d = Math.floor(b/4);
    const e = b % 4;
    const f = Math.floor((b+8)/25);
    const g = Math.floor((b-f+1)/3);
    const h = (19*a + b - d - g + 15) % 30;
    const i = Math.floor(c/4);
    const k = c % 4;
    const l = (32 + 2*e + 2*i - h - k) % 7;
    const m = Math.floor((a + 11*h + 22*l)/451);
    const month = Math.floor((h + l - 7*m + 114)/31) - 1; // 0-based
    const day = ((h + l - 7*m + 114) % 31) + 1;
    return new Date(year, month, day);
  }

  function sameDay(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }

  function isHoliday(d){
    const y = d.getFullYear();
    const fixed = [
      [1,1,'Nowy Rok'],
      [1,6,'Trzech Króli'],
      [5,1,'Święto Pracy'],
      [5,3,'Święto Konstytucji 3 Maja'],
      [8,15,'Wniebowzięcie/Narodowe'],
      [11,1,'Wszystkich Świętych'],
      [11,11,'Święto Niepodległości'],
      [12,25,'Boże Narodzenie'],
      [12,26,'Drugi dzień Bożego Narodzenia']
    ];
    for(const f of fixed){ if(d.getMonth()===f[0]-1 && d.getDate()===f[1]) return true; }
    // Easter-related: Easter Sunday and Monday
    const e = easterDate(y);
    const em1 = new Date(e.getFullYear(), e.getMonth(), e.getDate()+1);
    if(sameDay(d,e) || sameDay(d,em1)) return true;
    return false;
  }

  function holidayName(d){
    const y = d.getFullYear();
    const fixedNames = {
      '1-1':'Nowy Rok', '1-6':'Trzech Króli', '5-1':'Święto Pracy', '5-3':'Święto Konstytucji 3 Maja',
      '8-15':'Wniebowzięcie/Narodowe', '11-1':'Wszystkich Świętych', '11-11':'Święto Niepodległości',
      '12-25':'Boże Narodzenie', '12-26':'Drugi dzień Bożego Narodzenia'
    };
    const key = `${d.getMonth()+1}-${d.getDate()}`;
    if(fixedNames[key]) return fixedNames[key];
    const e = easterDate(y);
    if(sameDay(d,e)) return 'Wielkanoc';
    const em1 = new Date(e.getFullYear(), e.getMonth(), e.getDate()+1);
    if(sameDay(d,em1)) return 'Poniedziałek Wielkanocny';
    return 'Święto';
  }

  let currentIndex = 0;
  let isShowingAll = false;
  let prevIndex = currentIndex;

  function renderMonthOptions(){
    monthSelect.innerHTML = '';
    months.forEach((m,i)=>{
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${monthNames[m.getMonth()]} ${m.getFullYear()}`;
      monthSelect.appendChild(opt);
    });
  }

  // elements for configuring academic year
  const startYearInput = document.getElementById('startYear');

  function renderStartMonthOptions(){
    // month is fixed to September
    startYearInput.value = start.getFullYear();
  }

  function updateAcademicRangeFromInputs(){
    const y = Number(startYearInput.value) || start.getFullYear();
    const m = 8; // wrzesień
    start = new Date(y, m, 1);
    // academic year length: 12 months from start
    end = new Date(start.getFullYear(), start.getMonth()+12, 0);
    // storage key per range
    storageKey = `school-calendar-${start.getFullYear()}-${end.getFullYear()}-events`;
    // reload events for new key
    events = JSON.parse(localStorage.getItem(storageKey) || '{}');
    buildMonths();
    currentIndex = 0;
    prevIndex = 0;
    renderMonthOptions();
    // update title
    const titleEl = document.getElementById('title');
    const titleText = `Kalendarz roku szkolnego ${start.getFullYear()}/${end.getFullYear()}`;
    if(titleEl) titleEl.textContent = titleText;
    document.title = titleText;
    render();
  }

  function createMonthCard(m){
    const monthCard = document.createElement('section');
    monthCard.className = 'month';
    const title = document.createElement('h2');
    title.textContent = `${monthNames[m.getMonth()]} ${m.getFullYear()}`;
    monthCard.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'grid';

    const dayNames = ['Pon','Wt','Śr','Cz','Pt','Sb','Nd'];
    // week number header (empty cell for header row)
    const weekHeader = document.createElement('div'); weekHeader.className='weekNumber'; weekHeader.textContent='Tyg'; grid.appendChild(weekHeader);
    dayNames.forEach(dn=>{ const el = document.createElement('div'); el.className='dayName'; el.textContent=dn; grid.appendChild(el); });

    const first = new Date(m.getFullYear(), m.getMonth(),1);
    const startWeekDay = (first.getDay()+6)%7; // Monday=0
    const daysInMonth = new Date(m.getFullYear(), m.getMonth()+1,0).getDate();

    // We will render rows by week to include a week-number column
    // compute Monday of the week containing the academic start to use as week 1
    function mondayOf(d){ const copy = new Date(d); const wd = (copy.getDay()+6)%7; copy.setDate(copy.getDate() - wd); copy.setHours(0,0,0,0); return copy; }
    const mondayStart = mondayOf(start);
    let dayCursor = 1 - startWeekDay; // may be <=0 to start from previous month's days
    while(dayCursor <= daysInMonth){
      // compute week number relative to start of academic year
      // week starts on Monday
      const firstDayOfWeek = new Date(m.getFullYear(), m.getMonth(), dayCursor + 0);
      // find the Monday date of this row
      const monday = mondayOf(firstDayOfWeek);
      // week index: number of weeks since mondayStart
      const weekIndex = Math.floor((Date.UTC(monday.getFullYear(),monday.getMonth(),monday.getDate()) - Date.UTC(mondayStart.getFullYear(),mondayStart.getMonth(),mondayStart.getDate())) / (7*24*3600*1000)) + 1;
      const weekNumCell = document.createElement('div'); weekNumCell.className='weekNumber'; weekNumCell.textContent = weekIndex > 0 ? weekIndex : ''; grid.appendChild(weekNumCell);

      for(let wd=0; wd<7; wd++){
        const d = dayCursor + wd;
        const cell = document.createElement('div');
        if(d < 1 || d > daysInMonth){ cell.className='cell outside'; grid.appendChild(cell); continue; }
        const date = new Date(m.getFullYear(), m.getMonth(), d);
        const iso = date.toISOString().slice(0,10);
        cell.className='cell';
        // mark holidays
        if(isHoliday(date)){
          cell.classList.add('holiday');
        }
        const weekday = (date.getDay()+6)%7; // 0..6 Monday..Sunday
        if(weekday>=5) cell.classList.add('weekend');
        if(date < start || date > end) cell.classList.add('outside');
        const dateSpan = document.createElement('span'); dateSpan.className='date'; dateSpan.textContent=d; cell.appendChild(dateSpan);
        if(isHoliday(date)){
          const hspan = document.createElement('div'); hspan.className='eventText'; hspan.textContent = holidayName(date); cell.appendChild(hspan);
        }
        if(events[iso]){ const ev = document.createElement('span'); ev.className='eventText'; ev.textContent = events[iso]; cell.appendChild(ev); cell.classList.add('has-event'); }
        cell.addEventListener('click',()=>openModal(iso));
        grid.appendChild(cell);
      }

      dayCursor += 7;
    }

    monthCard.appendChild(grid);
    return monthCard;
  }

  function updateShowAllButton(){
    showAllBtn.textContent = isShowingAll ? 'Pokaż pojedynczy miesiąc' : 'Pokaż cały rok';
  }

  function render(){
    // ensure single-month mode
    isShowingAll = false;
    updateShowAllButton();
    root.innerHTML = '';
    const card = createMonthCard(months[currentIndex]);
    root.appendChild(card);
    monthSelect.value = currentIndex;
  }

  function renderAll(){
    isShowingAll = true;
    updateShowAllButton();
    root.innerHTML = '';
    months.forEach(m=> root.appendChild(createMonthCard(m)));
  }

  function openModal(iso){
    modal.classList.remove('hidden');
    modalDate.textContent = iso;
    eventText.value = events[iso] || '';
    saveEvent.onclick = ()=>{ events[iso]=eventText.value.trim(); if(!events[iso]) delete events[iso]; persist(); close(); render(); };
    deleteEvent.onclick = ()=>{ if(events[iso]){ delete events[iso]; persist(); close(); render(); } };
  }
  function close(){ modal.classList.add('hidden'); }
  closeModal.onclick = close;

  function persist(){ localStorage.setItem(storageKey, JSON.stringify(events)); }

  prevBtn.addEventListener('click', ()=>{ if(currentIndex>0){ currentIndex--; render(); } });
  nextBtn.addEventListener('click', ()=>{ if(currentIndex<months.length-1){ currentIndex++; render(); } });
  monthSelect.addEventListener('change', e=>{ currentIndex = Number(e.target.value); render(); });
  showAllBtn.addEventListener('click', ()=>{
    if(!isShowingAll){
      // switch to all-months mode, remember current
      prevIndex = currentIndex;
      renderAll();
    } else {
      // return to previously selected month
      currentIndex = prevIndex;
      render();
    }
  });

  exportBtn.addEventListener('click', ()=>{
    const data = JSON.stringify(events, null, 2);
    const blob = new Blob([data], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=`events-${start.getFullYear()}-${end.getFullYear()}.json`; a.click(); URL.revokeObjectURL(url);
  });

  // update handlers for academic inputs (month fixed to September)
  startYearInput.addEventListener('change', updateAcademicRangeFromInputs);

  // go to today button
  gotoTodayBtn.addEventListener('click', ()=>{
    const today = new Date();
    // determine academic start that should include today
    const yearForStart = (today.getMonth() >= 8) ? today.getFullYear() : today.getFullYear() - 1;
    const newStart = new Date(yearForStart, 8, 1);
    // if current academic range doesn't include today, switch
    if(!(today >= start && today <= end)){
      start = newStart;
      end = new Date(start.getFullYear(), start.getMonth()+12, 0);
      storageKey = `school-calendar-${start.getFullYear()}-${end.getFullYear()}-events`;
      events = JSON.parse(localStorage.getItem(storageKey) || '{}');
      buildMonths();
      renderMonthOptions();
      // update title and year input
      const titleEl = document.getElementById('title');
      const titleText = `Kalendarz roku szkolnego ${start.getFullYear()}/${end.getFullYear()}`;
      if(titleEl) titleEl.textContent = titleText;
      document.title = titleText;
      startYearInput.value = start.getFullYear();
    }
    // navigate to month containing today
    const targetIndex = months.findIndex(m=> m.getFullYear()===today.getFullYear() && m.getMonth()===today.getMonth());
    if(targetIndex >= 0){ currentIndex = targetIndex; render(); }
  });

  importBtn.addEventListener('click', ()=>{
    const input = document.createElement('input'); input.type='file'; input.accept='application/json';
    input.onchange = ()=>{
      const f = input.files[0]; if(!f) return;
      const r = new FileReader(); r.onload = ()=>{ try{ const obj = JSON.parse(r.result); events = obj || {}; persist(); render(); alert('Import zakończony'); }catch(err){ alert('Błąd importu: ' + err.message); } };
      r.readAsText(f);
    };
    input.click();
  });

  clearBtn.addEventListener('click', ()=>{ if(confirm('Usunąć wszystkie zdarzenia?')){ events={}; persist(); render(); } });
  printBtn.addEventListener('click', ()=>{ window.print(); });

  // close modal on outside click
  modal.addEventListener('click', (e)=>{ if(e.target===modal) close(); });

  // init
  renderStartMonthOptions();
  buildMonths();
  renderMonthOptions();
  // update page title
  const titleEl = document.getElementById('title');
  const titleText = `Kalendarz roku szkolnego ${start.getFullYear()}/${end.getFullYear()}`;
  if(titleEl) titleEl.textContent = titleText;
  document.title = titleText;
  render();
})();
