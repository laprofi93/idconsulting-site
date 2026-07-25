(function(){
var CITIES=[
 {n:'МОСКВА',lon:37.62,lat:55.75,a:'end',dx:-13,dy:4,hq:true,key:true,tag:'БАНКРОТСТВО',c:'Защита директора от субсидиарной ответственности на 1,2 млрд ₽.',href:'cases.html#case-developer'},
 {n:'САНКТ-ПЕТЕРБУРГ',lon:30.32,lat:59.94,a:'end',dx:-13,dy:-6,key:true,tag:'СДЕЛКИ',c:'Сопровождение покупки производственного актива — сделка закрыта.',href:'cases.html#case-developer'},
 {n:'КАЗАНЬ',lon:49.11,lat:55.79,a:'start',dx:11,dy:-6,tag:'БАНКРОТСТВО',c:'Оспорены сделки должника на 260 млн ₽ в интересах кредитора.'},
 {n:'РОСТОВ-НА-ДОНУ',lon:39.70,lat:47.22,a:'end',dx:-12,dy:3,tag:'МЕДИЦИНА · СДЕЛКА',c:'Приобретение медицинской клиники: аудит, сделка, запуск под новым собственником.',href:'cases.html#case-rostov-clinic'},
 {n:'КРАСНОДАР',lon:38.98,lat:45.04,a:'end',dx:-12,dy:2,tag:'МЕДИЦИНА · СОПРОВОЖДЕНИЕ',c:'Сопровождение сети стоматологических клиник и абонентское обслуживание бизнеса.',href:'cases.html#case-dental-network'},
 {n:'СОЧИ',lon:39.72,lat:43.60,a:'end',dx:-12,dy:12,tag:'КОРПОРАТИВНЫЙ СПОР',c:'Корпоративный спор вокруг торгового объекта: контроль над обществом восстановлен.',href:'cases.html#case-sochi'},
 {n:'МАЙКОП',lon:40.10,lat:44.61,a:'start',dx:11,dy:8,tag:'НЕДВИЖИМОСТЬ',c:'Оспорены результаты кадастровой оценки коммерческого объекта.'},
 {n:'ВЛАДИКАВКАЗ',lon:44.68,lat:43.02,a:'start',dx:11,dy:10,tag:'КОРПОРАТИВНЫЙ СПОР',c:'Раздел бизнеса между партнёрами: активы распределены без суда.'},
 {n:'МАХАЧКАЛА',lon:47.50,lat:42.98,a:'start',dx:11,dy:-4,tag:'МЕДИЦИНА',c:'Открытие стоматологической клиники под ключ: лицензия, помещение, кадры.',href:'cases.html#case-mahachkala-clinic'},
 {n:'ВОРОНЕЖ',lon:39.20,lat:51.67,a:'start',dx:11,dy:4,tag:'СУБСИДИАРКА',c:'Отказ в привлечении к субсидиарной ответственности двух руководителей.'},
 {n:'ОРЁЛ',lon:36.07,lat:52.97,a:'end',dx:-12,dy:-5,tag:'ВЗЫСКАНИЕ',c:'Реструктуризация долга производственного предприятия — исполнение по графику.'},
 {n:'ИЖЕВСК',lon:53.21,lat:56.85,a:'start',dx:11,dy:5,tag:'СОПРОВОЖДЕНИЕ',c:'Клиент на постоянном сопровождении.'},
 {n:'КЕМЕРОВО',lon:86.09,lat:55.35,a:'end',dx:-11,dy:-8,key:true,tag:'БАНКРОТСТВО',c:'Защита интересов кредитора в банкротстве угледобывающей компании.'},
 {n:'АЛМАТЫ',lon:76.95,lat:43.24,a:'start',dx:11,dy:16,key:true,tag:'МЕДИЦИНА',c:'Открытие стоматологической клиники и сопровождение сети в Казахстане.',href:'cases.html#case-almaty-clinic'},
 {n:'ТАШКЕНТ',lon:69.24,lat:41.30,a:'end',dx:-11,dy:-7,key:true,tag:'УЗБЕКИСТАН',c:'Клиент на постоянном сопровождении.'},
 {n:'ЕРЕВАН',lon:44.51,lat:40.18,a:'end',dx:-12,dy:11,key:true,tag:'АРМЕНИЯ',c:'Клиент на постоянном сопровождении.'},
 {n:'ДУБАЙ',lon:55.27,lat:25.20,a:'start',dx:11,dy:5,key:true,tag:'ОАЭ',c:'Полное сопровождение российского бизнеса для собственников за рубежом.',href:'cases.html#case-abroad'},
 {n:'МАЙАМИ',lon:-80.19,lat:25.76,a:'start',dx:11,dy:5,key:true,tag:'США',c:'Полное сопровождение российского бизнеса для собственников за рубежом.',href:'cases.html#case-abroad'},
 {n:'ГЕЛЕНДЖИК',lon:38.08,lat:44.56,a:'end',dx:-12,dy:-6,tag:'СОПРОВОЖДЕНИЕ',c:'Клиент на постоянном сопровождении.'},
 {n:'ТУАПСЕ',lon:39.08,lat:44.10,a:'end',dx:-12,dy:8,tag:'СОПРОВОЖДЕНИЕ',c:'Клиент на постоянном сопровождении.'},
 {n:'АНАПА',lon:37.32,lat:44.89,a:'end',dx:-12,dy:4,tag:'СОПРОВОЖДЕНИЕ',c:'Клиент на постоянном сопровождении.'},
 {n:'ТЕМРЮК',lon:37.38,lat:45.25,a:'end',dx:-12,dy:-4,tag:'СОПРОВОЖДЕНИЕ',c:'Клиент на постоянном сопровождении.'},
 {n:'ТБИЛИСИ',lon:44.79,lat:41.72,a:'start',dx:11,dy:8,key:true,tag:'ГРУЗИЯ',c:'Клиент на постоянном сопровождении.'},
 {n:'КАБУЛ',lon:69.17,lat:34.53,a:'start',dx:11,dy:6,key:true,tag:'АФГАНИСТАН',c:'Взыскание крупной задолженности за непоставленный товар.',href:'cases.html#case-afghanistan'},
 {n:'УСТЬ-ЛАБИНСК',lon:39.68,lat:45.21,a:'start',dx:11,dy:14,tag:'СОПРОВОЖДЕНИЕ',c:'Сопровождение группы компаний по транспортировке газа.',href:'cases.html#case-gas'},
 {n:'НОВОРОССИЙСК',lon:37.77,lat:44.72,a:'end',dx:-12,dy:1,tag:'СОПРОВОЖДЕНИЕ',c:'Клиент на постоянном сопровождении.'}
];
var NS='http://www.w3.org/2000/svg';
function el(t,at){var e=document.createElementNS(NS,t);for(var k in at)e.setAttribute(k,at[k]);return e;}

var LAND=null, landPromise=null;
function loadLand(){
  if(landPromise) return landPromise;
  landPromise=fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json')
    .then(function(r){return r.json();})
    .then(function(topo){ LAND=topojson.feature(topo,topo.objects.countries); return LAND; })
    .catch(function(){ return null; });
  return landPromise;
}

class GeoMap extends HTMLElement{
  connectedCallback(){ if(this._done) return; this._done=true; this.build(); }
  rebuild(){ this.build(); }
  build(){
    var self=this;
    var accent=this.getAttribute('accent')||'#2c3e6b';
    var ink=this.getAttribute('ink')||'#14161c';
    var line=this.getAttribute('line')||'#e5e2d9';
    var halo=this.getAttribute('halo')||'#fffefb';
    var mist=this.getAttribute('mist')||'#8b8f9c';
    var W=1080,H=560,PAD=54;

    var pts={type:'FeatureCollection',features:CITIES.map(function(c){
      return {type:'Feature',geometry:{type:'Point',coordinates:[c.lon,c.lat]}};
    })};
    var proj=d3.geoMercator().fitExtent([[PAD,PAD],[W-PAD,H-PAD]],pts);
    var path=d3.geoPath(proj);
    var X=function(lon,lat){return proj([lon,lat])[0];};
    var Y=function(lon,lat){return proj([lon,lat])[1];};

    var svg=el('svg',{viewBox:'0 0 '+W+' '+H,width:'100%',role:'img','aria-label':'Карта городов, где находятся наши клиенты'});
    svg.style.display='block';

    var grat=d3.geoGraticule10();
    svg.appendChild(el('path',{d:path(grat)||'',fill:'none',stroke:line,'stroke-width':1,opacity:.85}));

    var landG=el('g',{});
    svg.appendChild(landG);

    loadLand().then(function(land){
      if(!land) return;
      landG.appendChild(el('path',{d:path(land)||'',fill:line,'fill-opacity':.55,stroke:mist,'stroke-width':.6,'stroke-opacity':.5,'stroke-linejoin':'round'}));
      landG.parentNode.insertBefore(landG,landG.parentNode.firstChild);
    });

    var cap=document.createElement('div');
    cap.style.cssText='display:grid;grid-template-columns:auto 1fr;gap:6px 26px;align-items:baseline;padding:22px 30px 24px;border-top:1px solid '+line+';min-height:92px;';
    var capCity=document.createElement('div');
    capCity.style.cssText="font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.14em;color:"+accent+";white-space:nowrap;";
    var capText=document.createElement('div');
    capText.style.cssText="font-family:'Onest',sans-serif;font-weight:600;font-size:18px;line-height:1.45;letter-spacing:-.01em;transition:opacity .18s ease;";
    var capLink=document.createElement('a');
    capLink.style.cssText="font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:"+accent+";text-decoration:none;margin-top:10px;display:none;";
    capText.appendChild(document.createElement('span'));
    cap.appendChild(capCity);
    var capCol=document.createElement('div');
    capCol.appendChild(capText); capCol.appendChild(capLink);
    cap.appendChild(capCol);
    function idle(){ capCity.textContent='ВЫБЕРИТЕ ГОРОД'; capText.textContent='Наведите курсор или нажмите на город, чтобы увидеть клиента и дело.'; capText.style.color=mist; capLink.style.display='none'; }
    function setCap(c){
      if(!c){ idle(); return; }
      capText.style.opacity='0';
      setTimeout(function(){
        capCity.textContent=c.n+' · '+c.tag; capText.textContent=c.c; capText.style.color=ink; capText.style.opacity='1';
        if(c.href){ capLink.textContent='Смотреть кейс →'; capLink.href=c.href; capLink.style.display='inline-block'; }
        else capLink.style.display='none';
      },110);
    }
    idle();

    function showTip(c){
      var t=self._tip; if(!t) return;
      self._tipCity.textContent=c.n+' · '+c.tag;
      self._tipText.textContent=c.c;
      var px=X(c.lon,c.lat)/W*100, py=Y(c.lon,c.lat)/H*100;
      var right=px>62;
      t.style.left=px+'%'; t.style.top=py+'%';
      t.style.transform='translate('+(right?'calc(-100% - 16px)':'16px')+', -50%)';
      t.style.opacity='1';
    }
    function hideTip(){ if(self._tip) self._tip.style.opacity='0'; }

    var marks=[];
    CITIES.forEach(function(c){
      var x=X(c.lon,c.lat),y=Y(c.lon,c.lat);
      var g=el('g',{tabindex:'0',role:'button','aria-label':c.n+': '+c.c});
      g.style.cursor='pointer'; g.style.outline='none';
      if(c.hq) g.appendChild(el('circle',{cx:x,cy:y,r:11,fill:'none',stroke:accent,'stroke-width':1,opacity:.45}));
      g.appendChild(el('circle',{cx:x,cy:y,r:9,fill:'transparent'}));
      var ring=el('circle',{cx:x,cy:y,r:4.5,fill:'none',stroke:accent,'stroke-width':1,opacity:0});
      var dot=el('circle',{cx:x,cy:y,r:3.6,fill:accent});
      /* dense clusters would collide, so only anchor cities keep a standing label */
      var lab=el('text',{x:x+c.dx,y:y+c.dy,'text-anchor':c.a,'font-family':"'IBM Plex Sans',sans-serif",'font-size':11,'font-weight':500,'letter-spacing':'.1em',fill:ink,'paint-order':'stroke',stroke:halo,'stroke-width':4,'stroke-linejoin':'round'});
      lab.textContent=c.n;
      lab.style.transition='opacity .14s ease';
      lab.style.opacity=c.key?1:0;
      g.appendChild(ring); g.appendChild(dot); g.appendChild(lab);
      function on(){
        marks.forEach(function(m){
          m.dot.setAttribute('r',3.6); m.ring.setAttribute('opacity',0); m.ring.setAttribute('r',4.5);
          m.lab.setAttribute('fill',ink); m.lab.style.opacity=m.key?1:0;
        });
        dot.setAttribute('r',5.5); ring.setAttribute('opacity',.55); ring.setAttribute('r',12);
        lab.setAttribute('fill',accent); lab.style.opacity=1;
        svg.appendChild(g);
        setCap(c);
        showTip(c);
      }
      g.addEventListener('mouseenter',on);
      g.addEventListener('click',on);
      g.addEventListener('focus',on);
      g.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); on(); } });
      marks.push({dot:dot,ring:ring,lab:lab,key:c.key});
      svg.appendChild(g);
    });

    svg.addEventListener('mouseleave',function(){
      marks.forEach(function(m){
        m.dot.setAttribute('r',3.6); m.ring.setAttribute('opacity',0); m.ring.setAttribute('r',4.5);
        m.lab.setAttribute('fill',ink); m.lab.style.opacity=m.key?1:0;
      });
      idle();
      hideTip();
    });

    var wrap=document.createElement('div');
    wrap.style.position='relative';
    var tip=document.createElement('div');
    tip.style.cssText='position:absolute;z-index:3;pointer-events:none;opacity:0;transition:opacity .16s ease;max-width:300px;background:'+halo+';border:1px solid '+accent+';box-shadow:0 14px 34px rgba(20,22,28,.14);padding:14px 16px;';
    var tipCity=document.createElement('div');
    tipCity.style.cssText="font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.14em;color:"+accent+";margin-bottom:7px;";
    var tipText=document.createElement('div');
    tipText.style.cssText="font-family:'IBM Plex Sans',sans-serif;font-size:13px;line-height:1.5;color:"+ink+";";
    tip.appendChild(tipCity); tip.appendChild(tipText);
    this._tip=tip; this._tipCity=tipCity; this._tipText=tipText;
    wrap.appendChild(svg); wrap.appendChild(tip);

    this.innerHTML='';
    this.appendChild(wrap);
    this.appendChild(cap);
  }
}
if(!customElements.get('geo-map')) customElements.define('geo-map',GeoMap);
})();
