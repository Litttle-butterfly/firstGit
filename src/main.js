import Vue from "vue";
import Axios from "axios";
import store from './components/store/index'
import qs from 'qs';
Vue.prototype.dataurl='http://101.200.126.90:8080';
Vue.prototype.$ajax = Axios; //挂到原型
Axios.defaults.baseURL = "http://101.200.126.90:8080";
Axios.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
Axios.defaults.transformRequest = [data => {
    data.token=getCookie('user')
    return qs.stringify(data)
}];

//引入组件
import App from "./app.vue";
import Main from './components/main.vue'; //主体
import login from './components/login.vue'; //登陆
import dark from './components/dark.vue'; //暗黑登陆
import register from './components/register.vue'; //注册
import home from './components/home.vue'; //首页
import blank from './components/blank.vue'; //空白页
import Monitor from './components/monitor/monitor.vue';//监测
import Mdetail from './components/monitor/mdetail.vue';//监测详情
import similar from './components/commons/similar.vue';//相似文章
import Analysis from "./components/analysis/analysis.vue";//分析
import Explore from './components/explore/explore.vue';//探索
import ExploreInit from './components/explore/face.vue';//用户画像
import HotExplore from './components/explore/hotword.vue';//热词探索
import ExploreRobot from './components/explore/exrobot.vue';//探索的智能观点

 //搜索
import search from './components/search/search.vue';
import sdetail from './components/search/sdetail.vue';
//预警
import Waring from './components/waring/waring.vue';
import profileW from './components/waring/profileW.vue';
import analysisW from './components/waring/analysisW.vue';
import settingW from './components/waring/settingW.vue';
import addw from './components/waring/addw.vue';
import wdetail from './components/waring/wdetail.vue';
 //设置
import SetUp from "./components/setup/setup.vue";
import ThemeSet from './components/setup/themeset.vue';
import DimensionSet from './components/setup/dimensionset.vue';
import NewDimension from './components/setup/newdimension.vue';
import ChildAccount from './components/setup/account/childaccount.vue';
import Message from './components/setup/account/message.vue';
import Account from './components/setup/account/account.vue';
import Collection from './components/setup/account/collection.vue';
import Stars from './components/setup/account/stars.vue';
import ComeOut from './components/setup/account/comeout.vue';
import Blank from './components/setup/blank.vue';
import RobotSet from './components/setup/robot/robotset.vue';
import robotana from './components/setup/robot/robotana.vue';
import RobotList from './components/setup/robot/robotlist.vue';
import rdetail from './components/setup/robot/rdetail.vue';
import NewTheme from './components/setup/newtheme.vue';
import ChartsNews from './components/commons/chartsnews.vue';
import InitRobot from './components/commons/initrobot.vue';
import DetailRobot from './components/commons/detailrobot.vue';
//分析
import trend from './components/analysis/trend.vue';
import sourceD from './components/analysis/sourceD.vue';
import channel from './components/analysis/channel.vue';
import contrast from './components/analysis/contrast.vue';
import dimension from './components/analysis/dimension.vue';
import emotion from './components/analysis/emotion.vue';
import spread from './components/analysis/spread.vue';
//报告
import Report from "./components/report/report.vue"; //报告
import autoR from "./components/report/autoR.vue";
import newR2 from "./components/report/newR2.vue";
import reportset from "./components/report/reportset.vue";
import article from "./components/report/article.vue";

// 全局组件
import MyCrumb from './components/commons/mycrumb.vue'


import VueRouter from "vue-router";
Vue.use(VueRouter);
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
Vue.use(ElementUI);

import './static/js/validate.js'

import echarts from 'echarts'
Vue.prototype.$echarts = echarts ;

import $ from "jquery";
import jQuery from "jquery";
import  '../node_modules/echarts/map/js/china.js';
import  '../node_modules/echarts/theme/macarons.js';
import  '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import  '../node_modules/bootstrap-slider/dist/bootstrap-slider.min.js';
import  "./static/js/jquery.echarts-init.js";
import  "./static/js/jquery.range-min.js"
import  "./static/js/jquery.liMarquee.js"
// import  "./static/js/swiper-3.4.2.jquery.min.js"
import  '../node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css';
import  '../node_modules/bootstrap/dist/css/bootstrap.css';
import  '../node_modules/font-awesome/css/font-awesome.css';
import  './static/css/beyond.css';
import  './static/css/jquery.range.css';
import  './static/css/globle.css';




import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(NProgress);
//全局ajax调用入口
import {getCookie} from './static/js/globle.js';
import {delCookie} from './static/js/globle.js';
Vue.prototype.ajaxEnter = function (url,d,_fn){
  var t=this;
  url=this.dataurl+url,d=d.params;
  d.token=getCookie('user');
  var ajaxEnter=$.ajax({
    type:'post',
    url:url,
    data:d,
    // timeout:1000,
    dataType:'json',
    beforeSend:function(){
      // NProgress.start();
    },
    complete:function(XMLHttpRequest,status){
      if(status=='timeout'){//超时,status还有success,error等值的情况
 　　　　　 ajaxEnter.abort();
          t.$message({message: '请求超时,请稍后。。。',type: 'warning'});
　　　　}
    },
    success:function (d) {
      // NProgress.done();
      d.code=='-100'?(function(){
        delCookie('user');
        t.$router.replace({ path: '/login'})
      }()):_fn(d)
    },
    error:function(d){
      //NProgress.done();
      // d.status==500?
      _fn(d)
    }
  })
}

let router = new VueRouter({
    //mode:'history',
    routes: [//默认进入(重定向)到home首页
        { name: "app", path: '/app', component: App,
        children:[
          { name: "login", path: "/login",  component: login },
          { name: "bingtuan", path: "/bingtuan",  component: dark },
          { name: "register", path: "/register",  component: register },
          { name: "main", path: '/main', component: Main,
          children:[
            { path: "/home", redirect: { name: 'home' }},
            { name: "home", path: "/home",  component: home },
            { name: "blank", path: "/blank",  component: blank },
            { name: "similar", path: "/similar",  component: similar },
            { name: "search", path: "/search",  component: search},
            { name: "monitor", path: "/monitor",  component: Monitor },
            { name: "Mdetail", path: "/Mdetail",  component: Mdetail },
            { name: "sdetail", path: "/sdetail",  component: sdetail },
            { name: "analysis", path: "/analysis",  component: Analysis ,
              children:[
                { path: "/analysis", redirect: { name: 'trend' }},
                {name:'trend',path:'/analysis/trend', component:trend},
                {name:'sourceD',path:'/analysis/sourceD', component:sourceD},
                {name:'channel',path:'/analysis/channel', component:channel},
                {name:'contrast',path:'/analysis/contrast', component:contrast},
                {name:'dimension',path:'/analysis/dimension', component:dimension},
                {name:'emotion',path:'/analysis/emotion', component:emotion},
                {name:'spread',path:'/analysis/spread', component:spread}
              ]
          },

            { name: "InitRobot", path: "/InitRobot",  component: InitRobot },
            {name: "explore", path: "/explore",  component: Explore,
                children: [
                  { path: "/explore", redirect: { name: 'exporerobot' },  },
                  { name: "exploreinit", path: "/explore/faceinit",  component: ExploreInit },
                  { name: "hotexplore", path: "/explore/hot",  component: HotExplore },
                  { name: 'robotana', path: '/explore/robotana', component: robotana },
                  { name: "exporerobot", path: "/explore/robot",  component: ExploreRobot },
              ]
            },
            { name: "wdetail", path: "/waring/wdetail",  component: wdetail },
            { name: "waring", path: "/waring/", component: Waring,
              children:[
                { path: "/waring", redirect: { name: 'profileW' } , },
                { name: "profileW", path: "/waring/profileW",  component: profileW },
                { name: "analysisW", path: "/waring/analysisW",  component: analysisW },
                { name: "settingW", path: "/waring/settingW",  component: settingW },
                { name: "addw", path: "/waring/addw",  component: addw },
              ]
           },
            { name: "report", path: '/report', component: Report,
              children:[
                { path: "/report", redirect: { name: 'autoR' } },
                {name:'autoR',path:'/report/autoR', component:autoR},
                // {name:'newR',path:'/report/newR', component:newR},
                {name:'newR2',path:'/report/newR2', component:newR2},
                {name:'reportset',path:'/report/reportset', component:reportset},
                {name:'article',path:'/report/article', component:article}

              ]
           },
          { name: 'robotlist', path: '/setup/robotlist',  component: RobotList },
          { name: 'rdetail', path: '/setup/rdetail',  component: rdetail },
          {name: "setup", path: "/setup", component: SetUp,
                children: [
                    { path: "/setup", redirect: { name: 'themeSet' } , },
                    { name: 'themeSet', path: '/setup/themeset',  component: ThemeSet },
                    { name: 'blank2', path: '/setup/blank',  component: Blank },
                    { name: 'dimensionSet', path: '/setup/dimensionset',  component: DimensionSet },
                    { name: 'newdimension', path: '/setup/newdimension',  component: NewDimension },
                    { name: 'childaccount', path: '/setup/childaccount',  component: ChildAccount },
                    { name: 'collection', path: '/setup/collection',  component: Collection },
                    { name: 'stars', path: '/setup/stars',  component: Stars },
                    { name: 'comeout', path: '/setup/out',  component: ComeOut },
                    { name: 'message', path: '/setup/message',  component: Message },
                    { name: 'account', path: '/setup/account',  component: Account },
                    { name: 'robotSet', path: '/setup/robotset',  component: RobotSet },
                    { name: "detailrobot", path: '/setup/detail',  component: DetailRobot },
                    { name: 'newtheme', path: '/setup/themeset/newtheme',  component: NewTheme,}
                ]
            }
          ]
        }]
      }
    ]
})


// import Moment from "moment";
// Vue.use(Moment);
// 全局过滤器
Vue.filter("format_date",function(v){
    // 用moment.js过滤一下时间
    return Moment(v).format("YYYY-MM-DD");
})
Vue.filter("tolocal",function(nS){
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
})

router.beforeEach((to, from, next) => {
     // 判断该路由是否需要登录权限
     if (to.meta.requireAuth) {
         // 通过vuex state获取当前的token是否存在
         // console.log(isEmptyObject(store.state.user))
         if(!isEmptyObject(store.state.user.token)) {
             next();
         }
         else {
             next({
                 path: 'home',
                 //query: {redirect: 'App'}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
         }
     }
     else {
         next();
     }
 })

 Vue.component('MyCrumb', MyCrumb)
 Vue.directive('focusNextOnEnter', {
  bind: function(el, {value}, vnode) {
    el.addEventListener('keyup', (ev) => {
      if (ev.keyCode === 13) {
        let nextInput = vnode.context.$refs[value]
        if (nextInput && typeof nextInput.focus === 'function') {
          nextInput.focus()
          nextInput.select()
        }
      }
    })
  }
})

new Vue({
    router,
    store,
    el: document.getElementById("app"),
    render: function (create) {
        return create(App);
    }
})
