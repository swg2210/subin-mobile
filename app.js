
(()=>{
 const root=document.getElementById('subin-kit');
 const labels={event:'행사',profile:'프로필',timer:'타이머',seats:'테이블',like:'받은 호감',concierge:'1:1 매칭'};
 const presets={home:['event','concierge'],live:['timer','seats','profile'],likes:['like'],my:[]};
 let state={selected:['event','concierge'],preset:'home',view:'home',likeTab:'received'};
 let interactions={heart:'idle',hearts:{},accept:'idle',table:'3',later:false,received:{}};
 const currentParticipants=[
  {id:'seoyeon',name:'서연',age:28,job:'약사',region:'서울',mbti:'INFJ',intro:'익숙한 길을 걷다가도 새로운 카페를 발견하면 기분이 좋아져요.'},
  {id:'junho',name:'준호',age:32,job:'변호사',region:'서울',mbti:'ENTJ',intro:'주말에는 테니스를 치거나 전시를 보러 가요. 서로의 일상을 응원하는 관계를 좋아해요.'},
  {id:'jieun',name:'지은',age:29,job:'대기업 마케터',region:'성남',mbti:'ENFJ',intro:'맛있는 식당을 발견하면 함께 갈 사람부터 떠올려요. 여행과 사진 찍는 걸 좋아해요.'},
  {id:'doyun',name:'도윤',age:31,job:'치과의사',region:'서울',mbti:'ISFJ',intro:'아침 러닝과 직접 내린 커피로 하루를 시작해요. 편안한 대화 속에서 천천히 알아가고 싶어요.'},
  {id:'yujin',name:'유진',age:27,job:'대기업 디자이너',region:'서울',mbti:'INFP',intro:'영화와 작은 서점을 좋아해요. 취향이 달라도 서로 궁금해하는 사람이면 좋겠어요.'},
  {id:'jihun',name:'지훈',age:33,job:'회계사',region:'수원',mbti:'ESTP',intro:'쉬는 날에는 등산이나 드라이브를 즐겨요. 잘 웃고 솔직하게 이야기하는 편이에요.'}
 ];
 const tableMembers={
  '1':[
   {id:'haeun',name:'하은',age:28,job:'변리사',region:'서울',mbti:'ENFP',intro:'주말마다 새로운 동네를 걸어요. 편하게 웃으며 이야기 나눌 수 있는 분이면 좋겠어요.'},
   {id:'seojun',name:'서준',age:32,job:'의사',region:'서울',mbti:'INTJ',intro:'러닝과 재즈를 좋아해요. 바쁜 일상에서도 서로의 시간을 소중히 여기고 싶어요.'},
   {id:'nayeon',name:'나연',age:29,job:'대기업 연구원',region:'수원',mbti:'ISFJ',intro:'조용한 카페와 책을 좋아해요. 사소한 일도 함께 나눌 수 있는 관계를 기대해요.'},
   {id:'geonwoo',name:'건우',age:31,job:'회계사',region:'서울',mbti:'ENTP',intro:'맛집 탐방과 자전거 타기가 취미예요. 호기심 많은 사람과 이야기하는 게 즐거워요.'},
   {id:'sumin',name:'수민',age:27,job:'대기업 기획자',region:'서울',mbti:'ESFJ',intro:'좋아하는 사람들과 맛있는 음식을 나누는 시간을 좋아해요.'},
   {id:'taeyoon',name:'태윤',age:33,job:'변호사',region:'성남',mbti:'ISTJ',intro:'주말에는 등산을 하거나 요리를 해요. 차분하고 꾸준하게 알아가고 싶어요.'}
  ],
  '2':[
   {id:'chaewon',name:'채원',age:28,job:'치과의사',region:'서울',mbti:'INFJ',intro:'전시와 사진을 좋아해요. 서로의 취향을 함께 발견해 가면 좋겠어요.'},
   {id:'minseok',name:'민석',age:32,job:'대기업 개발자',region:'성남',mbti:'INTP',intro:'커피와 캠핑을 즐겨요. 편안하고 솔직한 대화를 좋아해요.'},
   {id:'soyeon',name:'소연',age:30,job:'약사',region:'서울',mbti:'ENFJ',intro:'필라테스와 여행이 일상의 활력이에요. 새로운 경험을 함께하고 싶어요.'},
   {id:'woojin',name:'우진',age:31,job:'변리사',region:'서울',mbti:'ENTJ',intro:'테니스와 영화 감상을 좋아해요. 서로 응원하며 성장하는 관계를 기대해요.'},
   {id:'dahyun',name:'다현',age:27,job:'대기업 마케터',region:'서울',mbti:'ENFP',intro:'여행을 준비하는 순간부터 설레는 편이에요. 밝게 웃는 사람에게 끌려요.'},
   {id:'seungho',name:'승호',age:34,job:'의사',region:'수원',mbti:'ISFP',intro:'산책과 음악을 좋아해요. 함께 있을 때 편안한 사람이 되고 싶어요.'}
  ],'3':currentParticipants
 };
 const participants=Object.values(tableMembers).flat();
 const receivedIds=['haeun','chaewon','seoyeon'];
 const personTable=id=>Object.keys(tableMembers).find(n=>tableMembers[n].some(p=>p.id===id));
 const read=s=>{if(s&&Object.hasOwn(presets,s.preset)){state.preset=s.preset;state.view=['home','live','likes','my','event','premium','register'].includes(s.view)?s.view:s.preset;state.selected=[...presets[state.preset]];}};
 const restore=s=>{read(s?.modelContent);const saved=s?.privateContent?.interactions;if(saved){if(['idle','confirm','sent'].includes(saved.heart))interactions.heart=saved.heart;if(['idle','confirm','connected','rejected'].includes(saved.accept))interactions.accept=saved.accept;if(['1','2','3','4','5','6'].includes(saved.table))interactions.table=saved.table;interactions.later=!!saved.later;if(saved.hearts&&typeof saved.hearts==='object'){for(const [id,value] of Object.entries(saved.hearts)){if(participants.some(p=>p.id===id)&&['idle','confirm','sent'].includes(value))interactions.hearts[id]=value;}}}};
 try{const stored=JSON.parse(localStorage.getItem('subin-mobile-demo-v1')||'null');restore(stored);if(['received','sent','connected'].includes(stored?.modelContent?.likeTab))state.likeTab=stored.modelContent.likeTab;for(const id of receivedIds){const saved=stored?.privateContent?.interactions?.received?.[id];interactions.received[id]=['pending','confirm','connected','rejected'].includes(saved)?saved:'pending';}if(!stored?.privateContent?.interactions?.received&&['connected','rejected'].includes(interactions.accept))interactions.received.seoyeon=interactions.accept;}catch{} 
 for(const id of receivedIds)if(!interactions.received[id])interactions.received[id]='pending';
 const create=k=>root.querySelector('template[data-component="'+k+'"]').content.cloneNode(true);
 const createParticipant=person=>{const fragment=create('profile');const card=fragment.querySelector('.profile');card.dataset.person=person.id;card.setAttribute('aria-label',person.name+'님 프로필');card.querySelector('.name').firstChild.textContent=person.name+' ';card.querySelector('.name .sub').textContent=person.age;card.querySelector('.profile-meta').textContent=person.job+' · '+person.region+' · '+person.mbti;card.querySelector('.profile-intro').textContent=person.intro;card.querySelector('summary').setAttribute('aria-label',person.name+'님 프로필 펼치기');card.querySelector('[data-action]').setAttribute('aria-label',person.name+'님에게 호감 보내기');return fragment;};
 
 const controls=document.createElement('div');
 let roundEndsAt=null;
 const tickTimer=()=>{
  const card=root.querySelector('[data-composition] .timer');if(!card)return;
  if(roundEndsAt===null){try{const saved=Number(localStorage.getItem('subin-round-deadline'));roundEndsAt=Number.isFinite(saved)&&saved>0?saved:Date.now()+768000;localStorage.setItem('subin-round-deadline',String(roundEndsAt));}catch{roundEndsAt=Date.now()+768000;}}
  const remaining=Math.max(0,Math.ceil((roundEndsAt-Date.now())/1000));
  const minutes=Math.floor(remaining/60),seconds=remaining%60;
  const display=card.querySelector('.time');display.textContent=String(minutes).padStart(2,'0')+':'+String(seconds).padStart(2,'0');display.setAttribute('aria-label','남은 시간 '+minutes+'분 '+seconds+'초');
  card.querySelector('.track div').style.width=Math.min(100,remaining/1200*100)+'%';
  if(remaining===0){card.querySelector('h3').textContent='다음 테이블로 이동해 주세요';card.querySelector('.chip').textContent='이동 시간';}
 };
 setInterval(tickTimer,1000);
 document.addEventListener('visibilitychange',tickTimer);
 const sceneObserver=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.dataset.visible=String(entry.isIntersecting)),{threshold:.1}):null;
 const observeScenes=()=>{if(sceneObserver){sceneObserver.disconnect();root.querySelectorAll('.concierge').forEach(card=>sceneObserver.observe(card));}};
 document.addEventListener('visibilitychange',()=>root.querySelectorAll('.concierge').forEach(card=>card.dataset.pageHidden=String(document.hidden)));
 Object.entries(labels).forEach(([key,label])=>{const button=document.createElement('button');button.type='button';button.className='btn';button.dataset.toggle=key;button.textContent=label;controls.append(button);});
 function applyInteractions(){
  root.querySelectorAll('.profile').forEach(card=>{const id=card.dataset.person||'seoyeon';const person=participants.find(p=>p.id===id);const heart=interactions.hearts[id]||(id==='seoyeon'?interactions.heart:'idle');const b=card.querySelector('[data-action]');const msg=card.querySelector('.feedback');if(heart==='confirm'){b.textContent='확인';b.setAttribute('aria-label','확인하고 '+person.name+'님에게 호감 보내기');b.dataset.action='heart-confirm';msg.textContent='상대가 수락하면 연락처가 공개돼요. 확인을 누르면 전송돼요.';}if(heart==='sent'){b.textContent='완료';b.setAttribute('aria-label',person.name+'님에게 호감 전송 완료');b.disabled=true;msg.textContent='호감을 보냈어요.';}});
  root.querySelectorAll('.like').forEach(card=>{const b=card.querySelector('.action');const reject=card.querySelector('.ghost');const msg=card.querySelector('.feedback');if(interactions.accept==='confirm'){b.textContent='동의하고 연결하기';b.dataset.action='accept-confirm';msg.textContent='서로의 연락처가 공개되는 데 동의하시나요?';}if(interactions.accept==='connected'){b.textContent='마음이 연결됐어요';b.disabled=true;reject.hidden=true;msg.textContent='마음이 연결됐어요.';}if(interactions.accept==='rejected'){b.hidden=true;reject.textContent='거절했어요';reject.disabled=true;msg.textContent='호감을 거절했어요.';}});
  root.querySelectorAll('.seats').forEach(card=>{const n=interactions.table;card.querySelectorAll('[data-table]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.table===n));if(Number(b.dataset.table)<3){b.classList.add('visited');b.setAttribute('aria-label',b.dataset.table+'번 테이블 확인, 지난 자리');}});card.querySelector('.table-details').innerHTML='<div class="row"><span>'+n+'번 테이블</span><span class="sub">'+(n==='3'?'현재 내 자리':Number(n)<3?'지난 자리':n==='4'?'다음 이동 자리':'이동 예정')+'</span></div><p class="sub" style="margin-top:6px">'+(Number(n)<3?'함께 대화했던 분들에게 호감을 보낼 수 있어요.':n==='3'?'다음 라운드에는 4번으로 이동해요.':'아직 만나지 않은 테이블이에요.')+'</p>';});
 }
 function renderTablePeople(target){
  const n=interactions.table,list=document.createElement('section');list.className='screen-section';
  const heading=document.createElement('h3');heading.className='section-title';const members=tableMembers[n]||[];heading.textContent=(n==='3'?'같은 테이블 참가자':n+'번 테이블 참가자')+(members.length?' · '+members.length+'명':'');list.append(heading);
  if(!members.length){const p=document.createElement('p');p.className='app-empty';p.textContent='이 테이블에서 만난 뒤 프로필을 확인할 수 있어요.';list.append(p);}
  members.forEach(person=>{const row=document.createElement('div');row.style.marginTop='8px';row.append(createParticipant(person));list.append(row);});target.append(list);
 }
 function renderLikes(target){
  const sent=Object.keys(interactions.hearts).filter(id=>interactions.hearts[id]==='sent');
  const connected=receivedIds.filter(id=>interactions.received[id]==='connected');
  const received=receivedIds.filter(id=>['pending','confirm'].includes(interactions.received[id]));
  const groups={received,sent,connected},names={received:'받은 호감',sent:'보낸 호감',connected:'연결된 인연'};
  const tabs=document.createElement('div');tabs.className='app-tabs';tabs.setAttribute('aria-label','호감 내역');
  for(const key of Object.keys(groups)){const b=document.createElement('button');b.type='button';b.dataset.likeTab=key;b.setAttribute('aria-pressed',String(state.likeTab===key));b.textContent=names[key]+' '+groups[key].length;tabs.append(b);}target.append(tabs);
  const ids=groups[state.likeTab];if(!ids.length){const p=document.createElement('p');p.className='app-empty';p.textContent={received:'새로운 호감이 도착하면 여기서 확인할 수 있어요.',sent:'테이블 참가자에게 하트를 보내면 여기에 표시돼요.',connected:'서로의 마음이 연결되면 여기에 모아드려요.'}[state.likeTab];target.append(p);}
  for(const id of ids){const person=participants.find(p=>p.id===id);if(!person)continue;
   const card=document.createElement('article');card.className='piece affinity-card';
   const details=document.createElement('details');const summary=document.createElement('summary');summary.className='cursor-interaction';
   const name=document.createElement('strong');name.textContent=person.name+' · '+person.age;summary.append(name);
   const meta=document.createElement('p');meta.className='sub';meta.textContent=person.job+' · '+person.mbti+' · '+personTable(id)+'번 테이블';summary.append(meta);details.append(summary);
   const intro=document.createElement('p');intro.className='affinity-intro';intro.textContent=person.intro;details.append(intro);card.append(details);
   if(state.likeTab==='received'){const actions=document.createElement('div');actions.className='affinity-actions';for(const [action,label] of [['accept',interactions.received[id]==='confirm'?'동의하고 연결하기':'수락하기'],['reject','거절하기']]){const b=document.createElement('button');b.type='button';b.className=action==='accept'?'action cursor-interaction':'reject-button cursor-interaction';b.dataset.receivedAction=action;b.dataset.person=id;b.textContent=label;actions.append(b);}card.append(actions);if(interactions.received[id]==='confirm'){const p=document.createElement('p');p.className='feedback';p.textContent='서로의 연락처가 공개되는 데 동의하시나요?';card.append(p);}}
   else{const status=document.createElement('p');status.className='affinity-status';status.textContent=connected.includes(id)?'마음이 연결됐어요':'상대의 수락을 기다리고 있어요';card.append(status);}
   target.append(card);
  }
 }
 function render(){
  const target=root.querySelector('[data-composition]');target.replaceChildren();target.style.display='block';
  const titles={home:'좋은 만남을,<br>수빈에서.',live:'오늘의 소셜링',likes:'호감',my:'마이페이지',event:'성수 프리미엄 소셜링',premium:'1:1 프리미엄 매칭',register:'나를 소개해 주세요'};
  const descriptions={home:'신중하게 고른 만남, 자연스러운 시작.',live:'성수 · 11.14(토)',likes:'마음이 닿은 사람과 대화를 이어가세요.',my:'내 정보와 만남의 기록을 한곳에서.'};
  const title=root.querySelector('.phone-title');title.replaceChildren();
  if(['event','premium','register'].includes(state.view)){const back=document.createElement('button');back.type='button';back.className='app-back cursor-interaction';back.dataset.route=state.preset;back.innerHTML='<i data-lucide="chevron-left" aria-hidden="true"></i>뒤로';title.append(back);}
  const h=document.createElement('h2');h.innerHTML=titles[state.view];title.append(h);
  if(descriptions[state.view]){const p=document.createElement('p');p.className='screen-desc';p.textContent=descriptions[state.view];title.append(p);}
  const section=(label,key)=>{const el=document.createElement('section');el.className='screen-section';if(label){const heading=document.createElement('h3');heading.className='section-title';heading.textContent=label;el.append(heading);}el.append(create(key));target.append(el);return el;};
  const extra=key=>target.append(root.querySelector('template[data-app-template="'+key+'"]').content.cloneNode(true));
  if(state.view==='home'){section('다가오는 소셜링','event');section('1:1 프리미엄 매칭','concierge');}
  if(state.view==='live'){section('','timer');section('','seats');renderTablePeople(target);}
  if(state.view==='likes')renderLikes(target);
  if(state.view==='my')extra('my');
  if(state.view==='event'){const el=section('','event');el.querySelector('.event').disabled=true;el.querySelector('.event-apply').hidden=true;extra('eventDetails');}
  if(state.view==='premium'){const el=section('','concierge');el.querySelector('[data-action="consult"]').hidden=true;extra('premiumDetails');}
  if(state.view==='register'){extra('register');try{const profile=JSON.parse(localStorage.getItem('subin-profile')||'null');if(profile)for(const [key,value] of Object.entries(profile)){const field=target.querySelector('[name="'+key+'"]');if(field)field.value=value;}}catch{}}
  root.querySelector('[data-likes-notice]').hidden=state.view!=='likes';
  root.querySelectorAll('.phone-nav [data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.preset===state.preset)));
  applyInteractions();tickTimer();observeScenes();if(globalThis.lucide)lucide.createIcons();
 }
 const save=()=>{try{localStorage.setItem('subin-mobile-demo-v1',JSON.stringify({modelContent:state,privateContent:{interactions}}));}catch{}};
 root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.likeTab){state.likeTab=b.dataset.likeTab;render();save();}
 if(b.dataset.receivedAction){const id=b.dataset.person;if(b.dataset.receivedAction==='reject')interactions.received[id]='rejected';else if(interactions.received[id]==='confirm'){interactions.received[id]='connected';state.likeTab='connected';}else interactions.received[id]='confirm';render();save();}
 if(b.dataset.toggle){const k=b.dataset.toggle;state.selected=state.selected.includes(k)?state.selected.filter(x=>x!==k):[...state.selected,k];render();save();}
 if(b.dataset.preset){window.scrollTo(0,0);state.preset=b.dataset.preset;state.view=state.preset;state.selected=[...presets[state.preset]];render();save();}
 if(b.dataset.route){window.scrollTo(0,0);state.view=b.dataset.route;if(Object.hasOwn(presets,state.view))state.preset=state.view;render();save();}
 if(b.dataset.table){interactions.table=b.dataset.table;render();save();}
 if(b.dataset.action){const card=b.closest('.piece');const msg=card.querySelector('.feedback');const action=b.dataset.action;if(action==='heart'){interactions.hearts[card.dataset.person||'seoyeon']='confirm';}else if(action==='heart-confirm'){const id=card.dataset.person||'seoyeon';interactions.hearts[id]='sent';if(['pending','confirm'].includes(interactions.received[id]))interactions.received[id]='connected';}else if(action==='accept'){interactions.accept='confirm';interactions.later=false;}else if(action==='accept-confirm'){interactions.accept='connected';}else if(action==='reject'){interactions.accept='rejected';interactions.later=false;}else if(action==='event'||action==='consult'){state.view=action==='event'?'event':'premium';window.scrollTo(0,0);render();}applyInteractions();save();}
 });
 root.addEventListener('submit',e=>{if(!e.target.matches('[data-demo-form]'))return;e.preventDefault();const result=e.target.querySelector('[data-form-status]');result.className='inline-status';try{localStorage.setItem('subin-profile',JSON.stringify(Object.fromEntries(new FormData(e.target))));result.textContent='프로필을 저장했어요.';}catch{result.textContent='저장하지 못했어요. 브라우저 저장 공간을 확인해 주세요.';}});
 render();
 const design={radius:16,rose:'#e8a0ac'};
 if(globalThis.Tweak){const tweak=new Tweak({container:root,onChange:()=>{root.style.setProperty('--s-radius',design.radius+'px');root.style.setProperty('--s-rose',design.rose);}});tweak.addSlider(design,'radius',{label:'카드 모서리',min:8,max:20,unit:'px'});tweak.addColorPicker(design,'rose',{label:'호감 포인트 색'});}
})();
