<template>
  <div>
    <div class="navbar navbar-fixed-top">
        <div class="navbar-inner">
            <div class="navbar-container">
                <!-- Navbar Barnd -->
                <div class="navbar-header pull-left">
                    <a href="#/home" class="navbar-brand">
                        <small>
                            <img v-if="userName!='bingtuan'" src="../static/img/logoall.png" alt="" />
                        </small>
                    </a>
                </div>
                <!-- /Navbar Barnd -->

                <!-- Sidebar Collapse -->
                <div class="sidebar-collapse" id="sidebar-collapse">
                    <i class="collapse-icon fa fa-bars"></i>
                </div>
                <!-- /Sidebar Collapse -->
                <!-- Page Sidebar Header-->
                <div class="sidebar-header-wrapper">
                    <input @keyup.13="show" type="text" v-model="keywords" class="searchinput" />

                    <router-link :to="{name:'search',query:{kw:keywords}}"><i class="searchicon glyphicon glyphicon-search"></i></router-link>
                    <!-- <div class="searchhelper">Global Search</div> -->
                </div>
                <!-- /Page Sidebar Header -->
                <!-- Account Area and Settings -->
                <div class="navbar-header pull-right">
                    <div class="navbar-account">
                        <ul class="account-area">
                            <li>
                                <a class="login-area dropdown-toggle" data-toggle="dropdown">
                                    <section>
                                        <h2><span class="profile"><span>{{userName}}</span></span></h2>
                                    </section>
                                </a>
                            </li>
                            <!-- /Account Area -->
                            <!--Note: notice that setting div must start right after account area list.
                            no space must be between these elements-->
                            <!-- Settings -->
                        </ul>
                        <div class="setting">
                            <a id="btn-setting" title="LogOut" href="javascript:void(0)" @click="loginOut">
                                <i class="icon glyphicon glyphicon-log-out"></i>
                            </a>
                        </div>
                        <!-- Settings -->
                    </div>
                </div>
                <!-- /Account Area and Settings -->
            </div>
        </div>
    </div>
    <!-- /Navbar -->
    <!-- Main Container -->
    <div class="main-container container-fluid">
        <!-- Page Container -->
        <div class="page-container">
            <!-- Page Sidebar -->
            <div class="page-sidebar sidebar-fixed" id="sidebar">
                <!-- Sidebar Menu -->
                <ul class="nav sidebar-menu">
                    <!--概况-->
                    <li>
                      <router-link class="rourl lia su" :to="{name:'home'}">
                        <i class="menu-icon ifa ifa-survey-o"></i>
                        <span class="menu-text">概况</span>
                      </router-link>
                    </li>
                    <!--监测-->
                    <li>
                      <router-link class="rourl lia mo" :to="{name:'monitor'}">
                        <i class="menu-icon ifa ifa-monitor-o"></i>
                        <span class="menu-text">监测</span>
                      </router-link>
                    </li>
                    <!--分析-->
                    <li>
                        <a href="#" class="menu-dropdown">
                            <i class="menu-icon ifa ifa-ana-o"></i>
                            <span class="menu-text">分析</span>
                            <i class="menu-expand"></i>
                        </a>

                        <ul class="submenu">
                            <li>
                              <router-link class="rourl" :to="{name:'trend'}">
                                <span class="menu-text">趋势统计</span>
                              </router-link>
                            </li>
                            <li>
                              <router-link class="rourl" :to="{name:'sourceD'}">
                                <span class="menu-text">来源统计</span>
                              </router-link>
                            </li>
                            <li>
                              <router-link class="rourl" :to="{name:'channel'}">
                                <span class="menu-text">频道统计</span>
                              </router-link>
                            </li>
                            <li>
                              <router-link class="rourl" :to="{name:'emotion'}">
                                <span class="menu-text">情绪分析</span>
                              </router-link>
                            </li>
                            <li>
                              <router-link class="rourl" :to="{name:'dimension'}">
                                <span class="menu-text">维度分析</span>
                              </router-link>
                            </li>
                            <li>
                              <router-link class="rourl" :to="{name:'contrast'}">
                                <span class="menu-text">对比分析</span>
                              </router-link>
                            </li>
                            <li>
                              <router-link class="rourl" :to="{name:'spread'}">
                                <span class="menu-text">传播分析</span>
                              </router-link>
                            </li>
                        </ul>
                    </li>
                    <!--探索-->
                    <li>
                        <a href="#" class="menu-dropdown">
                            <i class="menu-icon ifa ifa-exp-o"></i>
                            <span class="menu-text">探索</span>
                            <i class="menu-expand"></i>
                        </a>
                        <ul class="submenu">
                            <li>
                              <router-link class="rourl" :to="{name:'InitRobot'}">
                                <span class="menu-text">智能观点</span>
                              </router-link>
                            </li>
                            <!-- <li>
                              <router-link :to="{name:'spread'}">
                                <span class="menu-text">用户画像</span>
                              </router-link>
                            </li> -->
                            <li>
                              <router-link class="rourl" :to="{name:'hotexplore'}">
                                <span class="menu-text">热词探索</span>
                              </router-link>
                            </li>
                        </ul>
                    </li>
                    <!--预警-->
                    <li>
                      <a href="#" class="menu-dropdown">
                        <i class="menu-icon ifa ifa-warn-o"></i>
                        <span class="menu-text">预警</span>
                        <i class="menu-expand"></i>
                      </a>
                        <ul class="submenu">
                            <li>
                              <router-link class="rourl" :to="{name:'profileW'}">
                                <span class="menu-text">预警概况</span>
                              </router-link>
                            </li>
                            <li>
                              <router-link class="rourl" :to="{name:'analysisW'}">
                                <span class="menu-text">预警分析</span>
                              </router-link>
                            </li>
                            <li>
                              <router-link class="rourl" :to="{name:'settingW'}">
                                <span class="menu-text">预警设置</span>
                              </router-link>
                            </li>
                        </ul>
                    </li>
                    <!--报告-->
                    <li>
                        <a href="#" class="menu-dropdown">
                            <i class="menu-icon ifa ifa-rep-o"></i>
                            <span class="menu-text">报告</span>
                            <i class="menu-expand"></i>
                        </a>
                        <ul class="submenu">
                            <li>
                              <router-link class="rourl" :to="{name:'autoR'}">
                                <span class="menu-text">自动报告</span>
                              </router-link>
                            </li>
                            <!-- <li>
                              <router-link class="rourl" :to="{name:'article'}">
                                <span class="menu-text">定制报告</span>
                              </router-link>
                            </li> -->
                            <li>
                              <router-link class="rourl" :to="{name:'reportset'}">
                                <span class="menu-text">报告设置</span>
                              </router-link>
                            </li>
                        </ul>
                    </li>
                    <!--设置-->
                    <li>
                        <a href="#" class="menu-dropdown">
                            <i class="menu-icon ifa ifa-stp-o"></i>
                            <span class="menu-text">设置</span>
                            <i class="menu-expand"></i>
                        </a>

                        <ul class="submenu">
                            <li>
                              <router-link class="rourl" :to="{name:'themeSet'}">
                                <span class="menu-text">主题设置</span>
                              </router-link>
                            </li>

                            <li>
                              <router-link class="rourl" :to="{name:'dimensionSet'}">
                                <span class="menu-text">维度定义</span>
                              </router-link>
                            </li>
                            <li>
                              <router-link class="rourl" :to="{name:'InitRobot'}">
                                <span class="menu-text">智能观点</span>
                              </router-link>
                            </li>
                            <li>
                              <router-link class="rourl" :to="{name:'account'}">
                                <span class="menu-text">账户管理</span>
                              </router-link>
                            </li>
                            <li>
                              <router-link class="rourl" :to="{name:'childaccount'}">
                                <span class="menu-text">子账户管理</span>
                              </router-link>
                            </li>
                        <!--    <li>
                              <router-link class="rourl" :to="{name:'message'}">
                                <span class="menu-text">消息通知</span>
                              </router-link>
                            </li>-->
                            <li>
                              <router-link class="rourl" :to="{name:'collection'}">
                                <span class="menu-text">我的收藏</span>
                              </router-link>
                            </li>
                            <li>
                              <router-link class="rourl" :to="{name:'stars'}">
                                <span class="menu-text">媒体关注</span>
                              </router-link>
                            </li>
                            <li>
                              <router-link class="rourl" :to="{name:'comeout'}">
                                <span class="menu-text">我的导出</span>
                              </router-link>
                            </li>
                        </ul>
                    </li>
                </ul>
                <!-- /Sidebar Menu -->
            </div>
            <!-- /Page Sidebar -->
            <!-- Page Content -->
            <div class="page-content">
                <!-- Page Breadcrumb -->
                <div class="page-breadcrumbs breadcrumbs-fixed">

                    <ul id="Crumbs" class="breadcrumb">
                        <li>
                            <i class="fa fa-home"></i>
                            <a href="#/home">Home</a>
                        </li>
                        <li class="active">Dashboard</li>
                    </ul>
                </div>
                <!-- /Page Breadcrumb -->
                <!-- Page Body -->
                <div class="page-body">
                  <router-view></router-view>
                </div>
                <!-- /Page Body -->
            </div>
            <!-- /Page Content -->
        </div>
        <!-- /Page Container -->
        <!-- Main Container -->
    </div>
  </div>
</template>
<script>
import { InitiateSideMenu } from "../static/js/globle.js";
import { getCookie } from "../static/js/globle.js";
import { delCookie } from "../static/js/globle.js";
export default {
    data() {
        return {
          enter:function (url,d,_fn) {
            this.ajaxEnter(url,d,_fn)
          },
          to:[],
          userName:'',
          keywords:'',
        }
    },
    created(){
      this.userName=getCookie('username');
      getCookie('user')==""?this.$router.replace({path: '/login' }):''
      var t=this;
        t.enter('/client/api/meun',{params:{}},function(d){
          d.code!=-1?t.ro=d.data:alert(d.msg)
        })
    },
    mounted() {
      $('body').removeClass('login-body');
      InitiateSideMenu();
      var t = this;
      $(".rourl").on("click", function(e) {
        var i = this.href.indexOf("#") + 1;
        $(document).scrollTop(0)
        // this.href.substr(i,100)==t.$route.path?t.$router.push('/blank'):''
        this.href.substr(i, 100)=="/home"||this.href.substr(i, 100)=="/monitor"?function(){
          $(".sidebar-menu li").removeClass('open');
          $(".submenu").hide();
          $(".sidebar-menu a").removeClass('active');
        }():''
        this.href.substr(i, 100) == "/home"
          ? t.$router.go(0)
          : t.$router.push("/blank");
      });
    },
    methods: {
      loginOut() {
        delCookie("user");
        delCookie("username");
        this.$router.replace({ path: "/login" });
      },
      show() {
        if($.trim(this.keywords)!=''){
          this.$router.replace({
            path: "/setup/blank",
            query: { kw: this.keywords }
          });
        }
      }
    }
};
</script>
<style scoped>

</style>
