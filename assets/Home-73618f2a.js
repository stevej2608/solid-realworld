import{l as w,i as e,a as t,N as v,S as f,g as x,F as P,s as A,h as F,t as n}from"./index-24d74da4.js";import{A as L}from"./ArticleList-37ad0997.js";import"./FavoriteButton-c9fc9ec6.js";const H=n('<li class="nav-item">'),N=n('<li class="nav-item"><a href="" class="nav-link active"><i class="ion-pound"></i> '),j=n('<div class="tag-list">'),y=n('<div class="home-page"><div class="banner"><div class="container"><h1 class="logo-font"></h1><p>A place to share your knowledge.</p></div></div><div class="container page"><div class="row"><div class="col-md-9"><div class="feed-toggle"><ul class="nav nav-pills outline-active"><li class="nav-item"></li></ul></div></div><div class="col-md-3"><div class="sidebar"><p>Popular Tags'),G=n('<a class="tag-pill tag-default" data-testid="tag-link">'),q=({appName:$,token:M,handleSetPage:p,tab:i,state:s})=>(w.info("************** page=[Home] ******************"),(()=>{const d=y(),g=d.firstChild,_=g.firstChild,m=_.firstChild,C=g.nextSibling,k=C.firstChild,c=k.firstChild,b=c.firstChild,o=b.firstChild,u=o.firstChild,S=c.nextSibling,h=S.firstChild;return h.firstChild,m.textContent=$,e(o,t(f,{get when(){return s.token},get children(){const l=H();return e(l,t(v,{class:"nav-link",href:"?tab=feed",get active(){return i()==="feed"},children:"Your Feed"})),l}}),u),e(u,t(v,{class:"nav-link",href:"?tab=all",get active(){return i()==="all"},children:"Global Feed"})),e(o,t(f,{get when(){return x(()=>i()!=="all")()&&i()!=="feed"},get children(){const l=N(),a=l.firstChild;return a.firstChild.nextSibling,e(a,i,null),l}}),null),e(c,t(L,{get articles(){return Object.values(s.articles)},get totalPagesCount(){return s.totalPagesCount},get currentPage(){return s.page},onSetPage:p}),null),e(h,t(F,{fallback:"Loading tags...",get children(){const l=j();return e(l,t(P,{get each(){return s.tags},children:a=>(()=>{const r=G();return A(r,"href",`#/?tab=${a}`),e(r,a),r})()})),l}}),null),d})());export{q as default};
//# sourceMappingURL=Home-73618f2a.js.map
