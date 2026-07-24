(function(){
class GeoMap extends HTMLElement {
  connectedCallback(){ this._render(); }
  async _render(){
    let tries=0;
    while(!(window.d3 && window.topojson)){ if(tries++>200) return; await new Promise(r=>setTimeout(r,50)); }
    const accent=this.getAttribute('accent')||'#2f4ee6';
    const ink=this.getAttribute('ink')||'#14161c';
    const W=1064,H=560;
    const cities=[
      {n:'МОСКВА',lon:37.62,lat:55.75,a:'end',dx:-12,dy:4,hq:true,
       tag:'БАНКРОТСТВО',c:'Защита директора от субсидиарной ответственности на 1,2 млрд ₽ — требования сняты полностью.'},
      {n:'САНКТ-ПЕТЕРБУРГ',lon:30.32,lat:59.94,a:'start',dx:12,dy:-6,
       tag:'СДЕЛКИ',c:'Сопровождение покупки производственного актива — сделка на 480 млн ₽ закрыта без отлагательных рисков.'},
      {n:'КАЗАНЬ',lon:49.11,lat:55.79,a:'start',dx:12,dy:4,
       tag:'БАНКРОТСТВО',c:'Оспорены сделки должника на 260 млн ₽ в интересах кредитора — активы возвращены в конкурсную массу.'},
      {n:'РОСТОВ-НА-ДОНУ',lon:39.70,lat:47.22,a:'end',dx:-12,dy:-2,
       tag:'КОРПОРАТИВНЫЙ СПОР',c:'Корпоративный конфликт: восстановлен контроль участника над долей 50% в операционной компании.'},
      {n:'КРАСНОДАР',lon:38.98,lat:45.04,a:'end',dx:-12,dy:4,
       tag:'БАНКРОТСТВО',c:'Банкротство агрохолдинга завершено мировым соглашением — бизнес и рабочие места сохранены.'},
      {n:'СОЧИ',lon:39.72,lat:43.60,a:'end',dx:-12,dy:22,
       tag:'НЕДВИЖИМОСТЬ',c:'Земельный спор по гостиничному комплексу: право собственности клиента подтверждено в трёх инстанциях.'},
      {n:'МАХАЧКАЛА',lon:47.50,lat:42.98,a:'start',dx:12,dy:-6,
       tag:'ВЗЫСКАНИЕ',c:'Взыскание задолженности 140 млн ₽ и включение требований в реестр кредиторов должника.'},
      {n:'МАЙКОП',lon:40.10,lat:44.61,a:'start',dx:12,dy:10,
       tag:'НЕДВИЖИМОСТЬ',c:'Оспорены результаты кадастровой оценки коммерческого объекта — налоговая база снижена на 38%.'},
      {n:'ВОРОНЕЖ',lon:39.20,lat:51.67,a:'start',dx:12,dy:4,
       tag:'СУБСИДИАРКА',c:'Отказ в привлечении к субсидиарной ответственности двух контролирующих лиц строительной группы.'},
      {n:'ОРЁЛ',lon:36.07,lat:52.97,a:'end',dx:-12,dy:2,
       tag:'ВЗЫСКАНИЕ',c:'Реструктуризация долга производственного предприятия — исполнительное производство прекращено.'},
      {n:'ВЛАДИКАВКАЗ',lon:44.68,lat:43.02,a:'start',dx:10,dy:16,
       tag:'КОРПОРАТИВНЫЙ СПОР',c:'Раздел бизнеса между партнёрами: активы распределены во внесудебном порядке.'},
      {n:'КЕМЕРОВО',lon:86.09,lat:55.35,a:'end',dx:-12,dy:4,
       tag:'БАНКРОТСТВО',c:'Защита интересов кредитора в банкротстве угледобывающей компании — требования на 310 млн ₽ включены в реестр.'},
      {n:'АЛМАТЫ',lon:76.95,lat:43.24,a:'end',dx:-12,dy:4,
       tag:'ЗАКЛЮЧЕНИЕ',c:'Правовое заключение по трансграничной сделке РФ — Казахстан: структура одобрена банком-кредитором.'}
    ];
    let topo;
    try{ topo=await (await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json')).json(); }
    catch(e){ this.innerHTML='<div style="padding:40px;font:13px monospace;color:#9a9ea9">Карта недоступна офлайн</div>'; return; }
    const countries=topojson.feature(topo,topo.objects.countries);
    const pts={type:'FeatureCollection',features:cities.map(c=>({type:'Feature',geometry:{type:'Point',coordinates:[c.lon,c.lat]}}))};
    const proj=d3.geoMercator().fitExtent([[130,80],[W-40,H-70]],pts);
    const path=d3.geoPath(proj);
    const svg=d3.create('svg').attr('viewBox',`0 0 ${W} ${H}`).attr('width','100%').style('display','block');
    svg.append('g').selectAll('path').data(countries.features).join('path')
      .attr('d',path).attr('fill','#eceae3').attr('stroke','none');
    const g=svg.append('g');
    // caption bar
    const cap=document.createElement('div');
    cap.style.cssText='display:grid;grid-template-columns:auto 1fr;gap:8px 28px;align-items:baseline;padding:22px 32px 26px;border-top:1px solid #e3e2db;min-height:96px;';
    const capCity=document.createElement('div');
    capCity.style.cssText=`font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.16em;color:${accent};white-space:nowrap;`;
    const capText=document.createElement('div');
    capText.style.cssText=`font-family:'Onest',sans-serif;font-weight:600;font-size:18px;line-height:1.45;color:${ink};transition:opacity .18s ease;`;
    cap.append(capCity,capText);
    const setCap=(c)=>{
      capText.style.opacity='0';
      setTimeout(()=>{
        if(c){ capCity.textContent=c.n+' · '+c.tag; capText.textContent=c.c; }
        else { capCity.textContent='ВЫБЕРИТЕ ГОРОД'; capText.textContent='Наведите курсор на город, чтобы увидеть кейс из практики.'; capText.style.color='#9a9ea9'; }
        if(c) capText.style.color=ink;
        capText.style.opacity='1';
      },120);
    };
    capCity.textContent='ВЫБЕРИТЕ ГОРОД';
    capText.textContent='Наведите курсор на город, чтобы увидеть кейс из практики.';
    capText.style.color='#9a9ea9';
    const groups=[];
    for(const c of cities){
      const [x,y]=proj([c.lon,c.lat]);
      const cg=g.append('g').style('cursor','pointer');
      if(c.hq) cg.append('circle').attr('cx',x).attr('cy',y).attr('r',11).attr('fill','none').attr('stroke',accent).attr('stroke-width',1.2).attr('opacity',.5);
      cg.append('circle').attr('cx',x).attr('cy',y).attr('r',16).attr('fill','transparent');
      const halo=cg.append('circle').attr('cx',x).attr('cy',y).attr('r',4.5).attr('fill','none').attr('stroke',accent).attr('stroke-width',1).attr('opacity',0);
      const dot=cg.append('circle').attr('cx',x).attr('cy',y).attr('r',4.5).attr('fill',accent);
      const label=cg.append('text').attr('x',x+c.dx).attr('y',y+c.dy).attr('text-anchor',c.a)
        .attr('font-family',"'IBM Plex Mono',monospace").attr('font-size',11).attr('letter-spacing','.14em')
        .attr('fill',ink).attr('paint-order','stroke').attr('stroke','#f4f3ee').attr('stroke-width',4).attr('stroke-linejoin','round')
        .text(c.n);
      const on=()=>{
        for(const o of groups){ o.dot.attr('r',4.5); o.halo.attr('opacity',0).attr('r',4.5); o.label.attr('font-weight',400).attr('fill',ink); }
        dot.attr('r',6); halo.attr('opacity',.6).attr('r',12); label.attr('font-weight',600).attr('fill',accent);
        setCap(c);
      };
      cg.on('mouseenter',on).on('click',on);
      groups.push({dot,halo,label});
    }
    svg.on('mouseleave',()=>{
      for(const o of groups){ o.dot.attr('r',4.5); o.halo.attr('opacity',0).attr('r',4.5); o.label.attr('font-weight',400).attr('fill','#14161c'); }
      setCap(null);
    });
    const wrap=document.createElement('div');
    wrap.append(svg.node(),cap);
    this.replaceChildren(wrap);
  }
}
if(!customElements.get('geo-map')) customElements.define('geo-map',GeoMap);
})();
