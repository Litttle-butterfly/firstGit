
<template>
  <div class="register-container animated fadeInDown">
    <div class="logoBox">
      <div class="logo">
        <img src="../static/img/logo.png" />
      </div>
      <div class="logoName">
        <img src="../static/img/logoname.png" />
      </div>
    </div>
    <div class="registerbox bg-white">
        <div class="registerbox-title">申请试用</div>

        <div class="registerbox-caption ">Please fill in your information</div>
        <div class="registerbox-textbox">
            <input type="text" class="form-control" placeholder="请输入你的姓名" v-on:blur="checkData(2)" v-model="resuser" v-focus-next-on-enter="'input2'" ref="input1"/>
        </div>
        <div class="registerbox-textbox">
            <input  type="text" class="form-control" placeholder="请输入公司名称" v-model="rescompany" v-focus-next-on-enter="'input3'" ref="input2"/>
        </div>
        <div class="registerbox-textbox">
            <input type="text" class="form-control" placeholder="请输入联系邮箱" v-on:blur="checkData(1)" v-model="reseamil" v-focus-next-on-enter="'input4'" ref="input3"/>
        </div>
        <div class="registerbox-textbox">
            <input type="text" class="form-control" placeholder="请输入手机号" v-on:blur="checkData(3)" v-model="resphone" @keyup.13="register" ref="input4"/>
        </div>
        <hr />
        <div class="registerbox-submit">
            <input @click="register" type="button" class="btn btn-primary pull-right" value="申请试用">
        </div>
    </div>
  </div>
</template>
<script>
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
          resuser:'',
          companyName:'',
          rescompany:'',
          reseamil:'',
          resphone:'',
        }
    },
    created(){

    },
    mounted(){

    },
    methods:{
      checkData(v){
        var t=this,url='';
        v==1?function(){
          url='/admin/apply/check_email',
          t.enter(url,{params:{email:t.reseamil}},function(d){
            d.code!=1?t.openMsg(d.msg,"warning"):''
          })
        }():v==2?function(){
          url='/admin/apply/check_name',
          t.enter(url,{params:{name:t.resuser}},function(d){
            d.code!=1?t.openMsg(d.msg,"warning"):''
          })
        }():v==3?function(){
          url='/admin/apply/check_phone',
          t.enter(url,{params:{phone:t.resphone}},function(d){
              d.code!=1?t.openMsg(d.msg,"warning"):''
          })
        }():''
      },
      register(){
        var t=this,d={params:{
          name:this.resuser,
          email:this.reseamil,
          phone:this.resphone,
          company:this.rescompany
        }}
        t.enter('/admin/apply/save',d,function(d){
          if(d.code==1){
            t.openMsg('申请已提交，请等待客服联系',"success");
            t.$router.replace({ path: '/login'})
          }else{
            t.$message.error(d.msg);
          }
        })
      },
    }
}
</script>
<style scoped>
.register-container .registerbox .registerbox-title{
  font-size: 24px;
  color: #333;
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
.register-container .registerbox{
  height: 400px!important;
}
.register-container .registerbox .registerbox-textbox .form-control{
  border: none;
  background-color: #fff;
  border-bottom: 1px solid #999;
}
</style>
