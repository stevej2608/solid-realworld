import{z as f,y as u,i as s,j as d,h as g,t as v}from"./vendor-26062862.js";const b=v('<button class="btn btn-sm action-btn"><i class="ion-plus-round"></i> <!> '),$=r=>{const[n]=f(r,["profile","onClick"]);return(()=>{const l=b(),c=l.firstChild,a=c.nextSibling,t=a.nextSibling;return t.nextSibling,u(l,"click",n.onClick,!0),s(l,()=>n.profile?.following?"Unfollow":"Follow",t),s(l,()=>n.profile?.username,null),d(e=>{const o=!!n.profile?.following,i=!n.profile?.following;return o!==e._v$&&l.classList.toggle("btn-secondary",e._v$=o),i!==e._v$2&&l.classList.toggle("btn-outline-secondary",e._v$2=i),e},{_v$:void 0,_v$2:void 0}),l})()};g(["click"]);export{$ as F};
//# sourceMappingURL=FollowingButton-ddd8bec3.js.map
