(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/divider/divider"],{"16a5":function(t,e,r){"use strict";r.r(e);var a=r("484d"),n=r("a5a4");for(var u in n)"default"!==u&&function(t){r.d(e,t,function(){return n[t]})}(u);r("a639");var o,i=r("f0c5"),l=Object(i["a"])(n["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],o);e["default"]=l.exports},3517:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={name:"tuiDivider",props:{height:{type:Number,default:100},width:{type:String,default:"100%"},dividerColor:{type:String,default:"#e5e5e5"},color:{type:String,default:"#999"},size:{type:Number,default:24},bold:{type:Boolean,default:!1},bgcolor:{type:String,default:"#fafafa"},gradual:{type:Boolean,default:!1},gradualColor:{type:Array,default:function(){return["#eee","#ccc"]}}},methods:{getBgColor:function(t,e,r){var a=r;return t&&(a="linear-gradient(to right,"+e[0]+","+e[1]+","+e[1]+","+e[0]+")"),a}}};e.default=a},"484d":function(t,e,r){"use strict";var a,n=function(){var t=this,e=t.$createElement,r=(t._self._c,t.getBgColor(t.gradual,t.gradualColor,t.dividerColor));t.$mp.data=Object.assign({},{$root:{m0:r}})},u=[];r.d(e,"b",function(){return n}),r.d(e,"c",function(){return u}),r.d(e,"a",function(){return a})},"79fe":function(t,e,r){},a5a4:function(t,e,r){"use strict";r.r(e);var a=r("3517"),n=r.n(a);for(var u in a)"default"!==u&&function(t){r.d(e,t,function(){return a[t]})}(u);e["default"]=n.a},a639:function(t,e,r){"use strict";var a=r("79fe"),n=r.n(a);n.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/divider/divider-create-component',
    {
        'components/divider/divider-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("16a5"))
        })
    },
    [['components/divider/divider-create-component']]
]);
