(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/user/address/address"],{"081a":function(t,e,n){"use strict";(function(t){n("e146"),n("921b");s(n("66fd"));var e=s(n("8dce"));function s(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("543d")["createPage"])},"283d":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n={data:function(){return{isSelect:!1,addressList:[],secret:{}}},onShow:function(){var e=this;t.getStorage({key:"user",success:function(t){e.secret=t.data,e.loadData(),e.getDefaultAddress()}})},onLoad:function(t){"select"==t.type&&(this.isSelect=!0)},methods:{getDefaultAddress:function(){var e={xopenid:this.secret.openid,secret:this.secret.secret,timestamp:this.secret.timestamp};this.$xm.post("/Order/getDefAdr",e,function(e){t.setStorage({key:"address",data:e,success:function(t){}})})},edit:function(e){t.navigateTo({url:"edit/edit?type=edit&id="+e.id})},add:function(){t.navigateTo({url:"edit/edit?type=add"})},loadData:function(){var t=this,e={xopenid:this.secret.openid,secret:this.secret.secret,timestamp:this.secret.timestamp};this.$xm.post("/User/shipAdr",e,function(e){e&&(e.forEach(function(t){t.head=t.name.substring(0,1)}),t.addressList=e||[])})},select:function(e){this.isSelect&&t.setStorage({key:"selectAddress",data:e,success:function(){t.navigateBack()}})}}};e.default=n}).call(this,n("543d")["default"])},"8dce":function(t,e,n){"use strict";n.r(e);var s=n("f895"),i=n("dbec");for(var a in i)"default"!==a&&function(t){n.d(e,t,function(){return i[t]})}(a);n("de09");var c,r=n("f0c5"),d=Object(r["a"])(i["default"],s["b"],s["c"],!1,null,null,null,!1,s["a"],c);e["default"]=d.exports},d422:function(t,e,n){},dbec:function(t,e,n){"use strict";n.r(e);var s=n("283d"),i=n.n(s);for(var a in s)"default"!==a&&function(t){n.d(e,t,function(){return s[t]})}(a);e["default"]=i.a},de09:function(t,e,n){"use strict";var s=n("d422"),i=n.n(s);i.a},f895:function(t,e,n){"use strict";var s,i=function(){var t=this,e=t.$createElement;t._self._c},a=[];n.d(e,"b",function(){return i}),n.d(e,"c",function(){return a}),n.d(e,"a",function(){return s})}},[["081a","common/runtime","common/vendor"]]]);