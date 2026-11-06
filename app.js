
(()=>{
 const root=document.getElementById('subin-kit');
 const labels={event:'행사',profile:'프로필',timer:'타이머',seats:'테이블',like:'받은 호감',concierge:'1:1 매칭'};
 const presets={home:['event','concierge'],live:['timer','seats','profile'],likes:['like'],my:[]};
 let state={selected:['event','concierge'],preset:'home',view:'home'};
 let interactions={heart:'idle',hearts:{},accept:'idle',table:'3',later:false};
 const participants=[
  {id:'seoyeon',name:'서연',age:28,job:'약사',region:'서울',mbti:'INFJ',intro:'익숙한 길을 걷다가도 새로운 카페를 발견하면 기분이 좋아져요.'},
  {id:'junho',name:'준호',age:32,job:'변호사',region:'서울',mbti:'ENTJ',intro:'주말에는 테니스를 치거나 전시를 보러 가요. 서로의 일상을 응원하는 관계를 좋아해요.'},
  {id:'jieun',name:'지은',age:29,job:'대기업 마케터',region:'성남',mbti:'ENFJ',intro:'맛있는 식당을 발견하면 함께 갈 사람부터 떠올려요. 여행과 사진 찍는 걸 좋아해요.'},
  {id:'doyun',name:'도윤',age:31,job:'치과의사',region:'서울',mbti:'ISFJ',intro:'아침 러닝과 직접 내린 커피로 하루를 시작해요. 편안한 대화 속에서 천천히 알아가고 싶어요.'},
  {id:'yujin',name:'유진',age:27,job:'대기업 디자이너',region:'서울',mbti:'INFP',intro:'영화와 작은 서점을 좋아해요. 취향이 달라도 서로 궁금해하는 사람이면 좋겠어요.'},
  {id:'jihun',name:'지훈',age:33,job:'회계사',region:'수원',mbti:'ESTP',intro:'쉬는 날에는 등산이나 드라이브를 즐겨요. 잘 웃고 솔직하게 이야기하는 편이에요.'}
 ];
 const read=s=>{if(s&&Object.hasOwn(presets,s.preset)){state.preset=s.preset;state.view=['home','live','likes','my','event','premium','register'].includes(s.view)?s.view:s.preset;state.selected=[...presets[state.preset]];}};
 const restore=s=>{read(s?.modelContent);const saved=s?.privateContent?.interactions;if(saved){if(['idle','confirm','sent'].includes(saved.heart))interactions.heart=saved.heart;if(['idle','confirm','connected','rejected'].includes(saved.accept))interactions.accept=saved.accept;if(['1','2','3','4','5','6'].includes(saved.table))interactions.table=saved.table;interactions.later=!!saved.later;if(saved.hearts&&typeof saved.hearts==='object'){for(const [id,value] of Object.entries(saved.hearts)){if(participants.some(p=>p.id===id)&&['idle','confirm','sent'].includes(value))interactions.hearts[id]=value;}}}};
 try{restore(JSON.parse(localStorage.getItem('subin-mobile-demo-v1')||'null'));}catch{}
 const create=k=>root.querySelector('template[data-component="'+k+'"]').content.cloneNode(true);
 const createParticipant=person=>{const fragment=create('profile');const card=fragment.querySelector('.profile');card.dataset.person=person.id;card.setAttribute('aria-label',person.name+'님 예시 프로필');card.querySelector('.name').firstChild.textContent=person.name+' ';card.querySelector('.name .sub').textContent=person.age;card.querySelector('.profile-meta').textContent=person.job+' · '+person.region+' · '+person.mbti;card.querySelector('.profile-intro').textContent=person.intro;card.querySelector('summary').setAttribute('aria-label',person.name+'님 프로필 펼치기');card.querySelector('[data-action]').setAttribute('aria-label',person.name+'님에게 호감 보내기');return fragment;};
 
 const controls=document.createElement('div');
 const sceneObserver=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.dataset.visible=String(entry.isIntersecting)),{threshold:.1}):null;
 const observeScenes=()=>{if(sceneObserver){sceneObserver.disconnect();root.querySelectorAll('.concierge').forEach(card=>sceneObserver.observe(card));}};
 document.addEventListener('visibilitychange',()=>root.querySelectorAll('.concierge').forEach(card=>card.dataset.pageHidden=String(document.hidden)));
 Object.entries(labels).forEach(([key,label])=>{const button=document.createElement('button');button.type='button';button.className='btn';button.dataset.toggle=key;button.textContent=label;controls.append(button);});
 function applyInteractions(){
  root.querySelectorAll('.profile').forEach(card=>{const id=card.dataset.person||'seoyeon';const person=participants.find(p=>p.id===id);const heart=interactions.hearts[id]||(id==='seoyeon'?interactions.heart:'idle');const b=card.querySelector('[data-action]');const msg=card.querySelector('.feedback');if(heart==='confirm'){b.textContent='확인';b.setAttribute('aria-label','확인하고 '+person.name+'님에게 호감 보내기');b.dataset.action='heart-confirm';msg.textContent='상대가 수락하면 연락처가 공개돼요. 확인을 누르면 전송돼요.';}if(heart==='sent'){b.textContent='완료';b.setAttribute('aria-label',person.name+'님에게 호감 전송 완료');b.disabled=true;msg.textContent='호감을 보냈어요. (시연)';}});
  root.querySelectorAll('.like').forEach(card=>{const b=card.querySelector('.action');const reject=card.querySelector('.ghost');const msg=card.querySelector('.feedback');if(interactions.accept==='confirm'){b.textContent='동의하고 연결하기';b.dataset.action='accept-confirm';msg.textContent='서로의 연락처가 공개되는 데 동의하시나요?';}if(interactions.accept==='connected'){b.textContent='마음이 연결됐어요';b.disabled=true;reject.hidden=true;msg.textContent='연결됐어요. 실제 서비스에서는 연락처가 표시돼요. (시연)';}if(interactions.accept==='rejected'){b.hidden=true;reject.textContent='거절했어요';reject.disabled=true;msg.textContent='호감을 거절했어요. (시연)';}});
  root.querySelectorAll('.seats').forEach(card=>{const n=interactions.table;card.querySelectorAll('[data-table]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.table===n)));card.querySelector('.table-details').innerHTML='<div class="row"><span>'+n+'번 테이블</span><span class="sub">'+(n==='3'?'현재 내 자리':n==='4'?'다음 이동 자리':'배치 확인')+'</span></div><p class="sub" style="margin-top:6px">'+(n==='3'?'다음 라운드에는 4번으로 이동해요.':n==='4'?'라운드 종료 알림 후 이동해 주세요.':'다른 테이블의 프로필 공개 범위는 운영 설정을 따라요.')+'</p>';});
 }
 function render(){
  const target=root.querySelector('[data-composition]');target.replaceChildren();target.style.display='block';
  const titles={home:'좋은 만남을,<br>수빈에서.',live:'오늘의 소셜링',likes:'나에게 온 호감',my:'마이페이지',event:'성수 프리미엄 소셜링',premium:'1:1 프리미엄 매칭',register:'나를 소개해 주세요'};
  const descriptions={home:'신중하게 고른 만남, 자연스러운 시작.',live:'성수 · 11.14(토) · 행사 진행 예시',likes:'마음이 닿은 사람과 대화를 이어가세요.',my:'내 정보와 만남의 기록을 한곳에서.'};
  const title=root.querySelector('.phone-title');title.replaceChildren();
  if(['event','premium','register'].includes(state.view)){const back=document.createElement('button');back.type='button';back.className='app-back cursor-interaction';back.dataset.route=state.preset;back.innerHTML='<i data-lucide="chevron-left" aria-hidden="true"></i>뒤로';title.append(back);}
  const h=document.createElement('h2');h.innerHTML=titles[state.view];title.append(h);
  if(descriptions[state.view]){const p=document.createElement('p');p.className='screen-desc';p.textContent=descriptions[state.view];title.append(p);}
  const section=(label,key)=>{const el=document.createElement('section');el.className='screen-section';if(label){const heading=document.createElement('h3');heading.className='section-title';heading.textContent=label;el.append(heading);}el.append(create(key));target.append(el);return el;};
  const extra=key=>target.append(root.querySelector('template[data-app-template="'+key+'"]').content.cloneNode(true));
  if(state.view==='home'){section('다가오는 소셜링','event');section('1:1 프리미엄 매칭','concierge');}
  if(state.view==='live'){section('','timer');section('','seats');const list=document.createElement('section');list.className='screen-section';const heading=document.createElement('h3');heading.className='section-title';heading.textContent='같은 테이블 참가자 · 6명';list.append(heading);const note=document.createElement('p');note.className='detail-note';note.style.margin='0 0 12px';note.textContent='모두 디자인 확인용 예시 프로필이에요.';list.append(note);participants.forEach(person=>{const row=document.createElement('div');row.style.marginTop='8px';row.append(createParticipant(person));list.append(row);});target.append(list);}
  if(state.view==='likes')section('','like');
  if(state.view==='my')extra('my');
  if(state.view==='event'){const el=section('','event');el.querySelector('.event').disabled=true;extra('eventDetails');}
  if(state.view==='premium'){const el=section('','concierge');el.querySelector('[data-action="consult"]').hidden=true;extra('premiumDetails');}
  if(state.view==='register')extra('register');
  root.querySelector('[data-likes-notice]').hidden=state.view!=='likes';
  root.querySelectorAll('.phone-nav [data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.preset===state.preset)));
  applyInteractions();observeScenes();if(globalThis.lucide)lucide.createIcons();
 }
 const save=()=>{try{localStorage.setItem('subin-mobile-demo-v1',JSON.stringify({modelContent:state,privateContent:{interactions}}));}catch{}};
 root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-motion-toggle')){const card=b.closest('.concierge');const paused=card.dataset.motion!=='paused';card.dataset.motion=paused?'paused':'playing';b.setAttribute('aria-pressed',String(paused));b.setAttribute('aria-label',paused?'매칭 애니메이션 재생':'매칭 애니메이션 일시정지');b.innerHTML=paused?'<i data-lucide="play" aria-hidden="true"></i>':'<i data-lucide="pause" aria-hidden="true"></i>';if(globalThis.lucide)lucide.createIcons();}
 if(b.dataset.toggle){const k=b.dataset.toggle;state.selected=state.selected.includes(k)?state.selected.filter(x=>x!==k):[...state.selected,k];render();save();}
 if(b.dataset.preset){window.scrollTo(0,0);state.preset=b.dataset.preset;state.view=state.preset;state.selected=[...presets[state.preset]];render();save();}
 if(b.dataset.route){window.scrollTo(0,0);state.view=b.dataset.route;if(Object.hasOwn(presets,state.view))state.preset=state.view;render();save();}
 if(b.dataset.table){interactions.table=b.dataset.table;applyInteractions();save();}
 if(b.dataset.action){const card=b.closest('.piece');const msg=card.querySelector('.feedback');const action=b.dataset.action;if(action==='heart'){interactions.hearts[card.dataset.person||'seoyeon']='confirm';}else if(action==='heart-confirm'){interactions.hearts[card.dataset.person||'seoyeon']='sent';}else if(action==='accept'){interactions.accept='confirm';interactions.later=false;}else if(action==='accept-confirm'){interactions.accept='connected';}else if(action==='reject'){interactions.accept='rejected';interactions.later=false;}else if(action==='event'||action==='consult'){state.view=action==='event'?'event':'premium';window.scrollTo(0,0);render();}applyInteractions();save();}
 });
 root.addEventListener('submit',e=>{if(!e.target.matches('[data-demo-form]'))return;e.preventDefault();const result=e.target.querySelector('[data-form-status]');result.className='inline-status';result.textContent='프로필 저장 화면 시연이 완료됐어요. 실제 회원 정보는 변경되지 않았어요.';});
 render();
 const design={radius:16,rose:'#e8a0ac'};
 if(globalThis.Tweak){const tweak=new Tweak({container:root,onChange:()=>{root.style.setProperty('--s-radius',design.radius+'px');root.style.setProperty('--s-rose',design.rose);}});tweak.addSlider(design,'radius',{label:'카드 모서리',min:8,max:20,unit:'px'});tweak.addColorPicker(design,'rose',{label:'호감 포인트 색'});}
})();
