<template>
<div>
  <div class="login-container animated fadeInDown">
    <div class="logoBox">
      <div class="logo">
        <img src="../static/img/logo.png" />
      </div>
      <div class="logoName">
        <img src="../static/img/logoname.png" />
      </div>
    </div>
    <div class="loginbox bg-white">
        <div class="loginbox-title">登录</div>
        <div class="loginbox-textbox">
            <input type="text" class="form-control" placeholder="企业名称" v-model="companyName" v-focus-next-on-enter="'input2'" ref="input1"/>
        </div>
        <div class="loginbox-textbox">
            <input type="text" class="form-control" placeholder="用户名" v-model="name" v-focus-next-on-enter="'input3'" ref="input2"/>
        </div>
        <div class="loginbox-textbox">
            <input type="password" class="form-control" placeholder="密码" v-model="pwd" ref="input3"  @keyup.13="isLogin"/>
        </div>
        <div class="loginbox-forgot">
            <a href="javascript:void(0)" @click="forget">忘记密码?</a>
        </div>
        <div class="loginbox-submit">
            <router-link class="btn btn-success" :to="{name:'register'}">申请试用</router-link>
            <a @click="isLogin" class="btn btn-sky fl-right">登录</a>
        </div>
    </div>
  </div>
  <!-- <div class="login-footer">
    <p>北京氢元数据信息技术有限公司</p>
  </div> -->
</div>
</template>
<script>
import {getCookie} from './../static/js/globle.js';
import {addCookie} from './../static/js/globle.js';
export default {
    data() {
        return {
          enter:function (url,d,_fn) {
            this.ajaxEnter(url,d,_fn)
          },
          openMsg:function(msg,type){
            this.$message({
              message: msg,
              type: type
            });
          },
          name:'',
          pwd:'',
          companyName:'',
          dark:''
        }
    },
    created(){
      this.dark=this.$route.query.dark;
      getCookie('user')==""?"":this.$router.replace({ path: '/home'})
    },
    mounted(){
      $('body').addClass('login-body');
    },
    methods:{
      isLogin() {
        // console.log("Aa")
        var t=this;
        t.enter('/auth',{params:{username:this.name,password:this.pwd,company:this.companyName}},function(d){
          if(d.code==0){
            t.openMsg('登陆成功',"success");
            addCookie("user",d.data);
            addCookie("username",t.name);
            t.dark!=undefined?addCookie("dark",t.dark):''
            t.$store.state.user.token=d.data;
            $('body').removeClass('login-body');
            t.$router.replace({ path: '/home'})
          }else{
            t.$message.error(d.msg);
          }
        })
      },
      forget(){
        this.openMsg("忘记密码，请联系管理员找回！","warning");
      }
    }
}
</script>
<style scoped>
.login-container{
  max-width: 350px;
}
.login-container .loginbox{
  height: 320px!important;
  width: 350px!important;
}
.login-container .loginbox .loginbox-title{
  text-align: left;
  font-size: 24px;
  color: #333;
  padding: 26px 0 32px 40px;
}
.fl-right{
  position: relative;
  left: 140px;
  top: 0;
}
.logoBox{
  width: 300px;
  height: 60px;
  margin-bottom: 30px;
}
.logoBox .logo{
  width: 60px;
  float: left;
}
.logoBox .logoName{
  width: 200px;
  line-height: 60px;
  float: left;
  margin-left: 30px;
}
.login-container .loginbox .loginbox-textbox .form-control{
  border: none;
  background-color: #fff;
  border-bottom: 1px solid #999;
}
.login-footer{
  position: absolute;
  bottom: 0;
  background: rgba(0,0,0,.1);
  left: 0;
  right: 0;
  color: #fff;
  padding: 10px;
  text-align: center;
}
</style>
