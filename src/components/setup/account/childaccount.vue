<template>
    <div class='right_'>
            <div class="xftup text-right">
                <button class="btn btn-sm disabled" v-show="childcount<=0">新增子账户</button>
                <button class="btn btn-sm" @click="modelform" v-show="childcount>0">新增子账户</button>
            </div>
            <div class="table-responsive">
                <table class="table table-striped table-hover table-responsive">
                    <thead>
                        <tr>
                            <th>账号</th><th>邮箱</th><th>手机号</th><th>状态</th><th>创建时间</th>
                            <th>   操作   </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in tableData3 "  :key="item.id" >
                            <td>{{item.name}}</td> <td>{{item.email}}</td>  <td>{{item.phone}}</td>
                            <td>{{item.status==-1?'停用':'启用'}}</td> <td>{{item.created | tolocal}}</td>
                            <td>
                                    <button class="btn btn-default btn-sm "  @click="modelform(index,item.id)"> <i class="fa fa-edit"></i>编辑</button>
                        <!--            <input class="btn btn-default" type="button" value="编辑"     @click="modelform(index,item.id)">

                                <input class="btn btn-default" type="button" :value= "item.status==-1?'启用':'停用'"  @click="handleStatus(item.id,item.status)">
                                <input class="btn btn-default" type="button" value="删除"  @click="handleDelete(item.id,item.status)">-->
                                <button  class="btn btn-default btn-sm "  v-show="item.status==0" @click="handleStatus(item.id,item.status)"><i class="fa fa-check-square-o"></i>停用</button>
                                <button  class="btn btn-default btn-sm "  v-show="item.status!=0" @click="handleStatus(item.id,item.status)"><i  class="fa fa-square-o"></i>启用</button>
                                    <button class="btn btn-default btn-sm "  @click="handleDelete(item.id,item.status)"><i class="fa fa-trash-o"></i>删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
                        <div class="modal fade bs-example-modal" tabindex="-1" id="accountModel">
                            <div class="modal-dialog modal-xs" role="document">
                                <div class="modal-content">

                                <form class="form-horizontal">
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">用户名</label>
                                        <div class="col-sm-8">
                                        <input type="text" class="form-control" id="itstname"   v-model="ruleForm2.name" @blur="nameexist" placeholder="用户名" v-focus-next-on-enter="'phone'" ref="itstname">
                                        <span class="red" v-show="validata.isname">用户名不能为空或已占用！</span>
                                         <span class="red" v-show="validata.nametype">最长12个字，仅限中文、英文大小写、数字、基本符号</span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">手机号</label>
                                        <div class="col-sm-8">
                                            <input type="text" class="form-control" id="" name = 'phone'  v-validate="'required|phone'"
                                            v-model="ruleForm2.phone" placeholder="手机号" @blur="tophone($event)" v-focus-next-on-enter="'touchname'" ref="phone">
                                            <span class="red" v-show="errors.has('phone')">{{ errors.first('phone') }}</span>
                                          <!--  <span class="red" v-show="validata.isphone">请输入正确手机号！</span> -->
                                        </div>

                                    </div>
                                    <div class="form-group">
                                        <label for="inputEmail3" class="col-sm-3 control-label">联系人</label>
                                        <div class="col-sm-8">
                                        <input type="text" class="form-control" name="touchname" id="" placeholder="联系人"
                                        v-model="ruleForm2.touch_name" v-validate="'required|touchname'" v-focus-next-on-enter="'email'" ref="touchname">
                                         <span class="red" v-show="errors.has('touchname')">{{ errors.first('touchname') }}</span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">邮箱</label>
                                        <div class="col-sm-8">
                                            <input type="email" name = 'email' class="form-control"  v-validate="'required|email'"
                                            placeholder="邮箱" @blur="toemail" v-model="ruleForm2.email" v-focus-next-on-enter="'password'" ref="email">
                                        <span class="red" v-show="errors.has('email')">{{ errors.first('email') }}</span>

                                      <!--  <span class="red" v-show="validata.isemail">请输入正确的邮箱！</span> -->
                                        <span class="red" v-show="validata.emailexist">邮箱已被注册或占用！</span>
                                        </div>

                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">密码</label>
                                        <div class="col-sm-8">
                                        <input type="password" class="form-control"  id="" placeholder="密码" @blur="topwd" v-model="ruleForm2.password" v-focus-next-on-enter="'checkPass'" ref="password">

                                    </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">验证密码</label>
                                        <div class="col-sm-8">
                                            <input type="password" class="form-control" id="" placeholder="验证密码"  @blur="topwd" v-model="checkPass" @keyup.13="childsave" ref="checkPass">
                                            <span class="red" v-show="validata.ispwd">请验证您的两次密码是否一致</span>
                                        </div>

                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">权限</label>
                                        <div class="col-sm-8">
                                        <lable v-for="item in clientmodel" >
                                            <input type="checkbox" v-model="ruleForm2.authority" name ="authority" :value ="item.id" :key="item.id"/>
                                            {{item.name}}
                                        </lable>
                                        </div>
                                    </div>

                                    </form>

                                    <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                                    <button type="button" class="btn btn-primary" @click="childsave">提交</button>
                                </div>

                                </div>

                            </div>
                        </div>
    </div>
    </div>




    </div>
</template>
<script>
import { getCookie } from "../../../static/js/globle.js";
let np = require("NProgress");
let bootbox = require("bootbox");
export default {
  data() {
    return {
      openMsg: function(msg, type) {
        this.$message({
          message: msg,
          type: type
        });
      },
      childcount: "",
      validata: {
        isphone: false,
        isemail: false,
        ispwd: true,
        emailexist: false,
        isname: false,
        nametype: true
      },
      accountid: "",
      tableData3: [],
      msg: "",
      msg1: "",
      msg2: "",
      msg3: "",
      checkPass: "",
      clientmodel: [{}],
      ruleForm2: {
        token: getCookie("user"),
        name: "",
        psaaword: "",
        touch_name: "",
        phone: "",
        authority: ["1000", "1001", "1002", "1003", "1004", "1005", "1006"],
        email: ""
      }
    };
  },
  created() {
    np.start();
    this.getchildcount();
    this.getlist();
    var t = this;
    $.ajax({
      type: "post",
      url: this.dataurl + "/client/api/meun",
      data: {
        token: getCookie("user")
      },
      dataType: "json",
      success: function(res) {
        // console.log(res)
        t.clientmodel = res.data;
      },
      error: function() {
        // alert("internet error")
      }
    });

    //   this.$ajax.get('/admin/user')
    //             .then(res=>{
    //                 console.log(res);
    //             })
    //             .catch(err=>{

    //                 console.log(err)
    //             })
  },
  mounted() {
    var html = '<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
    html += '<li>设置</li><li class="active">子账户管理</li>';
    $("#Crumbs").html(html);
    np.done();
  },
  methods: {
    getchildcount() {
      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/admin/user/get_total",
        data: {
          token: getCookie("user")
        },
        dataType: "json",
        success: function(res) {
          console.log(res);
          t.childcount = 10 - res.data;
          console.log();
        },
        error: function() {}
      });
    },
    nameexist() {
      var t = this;
      var re = /^[A-Za-z\d_\-\u4e00-\u9fa5]{1,12}$/;
      // /^[a-zA-Z0-9_\.]+$/
      if (!re.test(this.ruleForm2.name)) {
        this.validata.nametype = true;
      } else {
        this.validata.nametype = false;
      }

      $.ajax({
        type: "post",
        url: this.dataurl + "/admin/user/check_name",
        data: {
          token: getCookie("user"),
          id: this.accountid,
          name: this.ruleForm2.name
        },
        dataType: "json",
        success: function(res) {
          // console.log(res)
          if (res.code == "1") {
            // 表示可以用
            t.validata.isname = false;
          } else {
            t.validata.isname = true;
            // 已存在
          }
        },
        error: function(err) {
          // alert("INTERNET ERROR!!")
        }
      });
    },
    tophone(e) {
      console.log(e);

      if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.ruleForm2.phone)) {
        // debugger
        this.validata.isphone = true;
        // e.path[2].append("<span>请输入正确手机号！</span>")
        // e.path[2].append('<span class="col-sm-2">请输入正确手机号！</span>')
        // alert("请输入正确的电话号码！")
      } else {
        this.validata.isphone = false;
      }
    },
    toemail() {
      console.log(this.errors);

      // if(! /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(this.ruleForm2.email)){
      //     this.validata.isemail =true;
      // }else{
      //     this.validata.isemail =false
      // }

      var t = this;

      if (this.accountid) {
        $.ajax({
          type: "post",
          url: this.dataurl + "/admin/user/check_email",
          data: {
            token: getCookie("user"),
            id: this.accountid,
            email: this.ruleForm2.email
          },
          dataType: "json",
          success: function(res) {
            // console.log(res)
            if (res.code == "1") {
              // 表示可以用
              t.validata.emailexist = false;
            } else {
              t.validata.emailexist = true;
              // 已存在
            }
          },
          error: function(err) {
            // alert("INTERNET ERROR!!")
          }
        });
      } else {
        $.ajax({
          type: "post",
          url: this.dataurl + "/admin/user/check_email",
          data: {
            token: getCookie("user"),
            email: this.ruleForm2.email
          },
          dataType: "json",
          success: function(res) {
            // console.log(res)
            if (res.code == "1") {
              // 表示可以用
              t.validata.emailexist = false;
            } else {
              t.validata.emailexist = true;
              // 已存在
            }
          },
          error: function(err) {
            // alert("INTERNET ERROR!!")
          }
        });
      }
    },
    topwd() {
      if (this.ruleForm2.password !== this.checkPass) {
        this.validata.ispwd = true;
      } else {
        this.validata.ispwd = false;
      }
    },
    getlist() {
      // debugger
      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/admin/user/get_user_list",
        data: {
          token: getCookie("user")
        },
        dataType: "json",
        success: function(res) {
          console.log(res);
          t.tableData3 = res.data;
        }
      });
    },
    changestatus(ids, stu) {
      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/admin/user/update",
        data: {
          status: stu,
          id: ids,
          token: getCookie("user")
        },
        dataType: "json",
        success: function(res) {
          // console.log(res)
          if (res.code == "1") {
            t.getlist();
          }
        },
        error: function(err) {
          // alert("INTERNET ERROR!!")
        }
      });
    },
    modelform(ids, accountid) {

      if (accountid) {
        this.accountid = accountid;
      } else {
        this.accountid = "";
      }

      // debugger
      if (ids >= 0) {
        this.getlist();
        this.ruleForm2 = this.tableData3[ids];
        this.checkPass ='';
        // this.checkPass = this.ruleForm2.password;
        // -1是后台传给我的表示全选
        if (this.tableData3[ids].authority == "-1") {
          this.ruleForm2.authority = [
            "1000",
            "1001",
            "1002",
            "1003",
            "1004",
            "1005",
            "1006"
          ];
        } else {
          this.ruleForm2.authority = this.tableData3[ids].authority.split("|");
        }

        // $("#accountModel input[type='password']").attr("disabled",'disabled');
      } else {
        this.ruleForm2 = { token: getCookie("user") };
        // this.checkPass = this.ruleForm2.password;
        this.ruleForm2.authority = [
          "1000",
          "1001",
          "1002",
          "1003",
          "1004",
          "1005",
          "1006"
        ];
        //    $("#accountModel input[type='password']").attr("disabled",false);
      }

      $("#accountModel").modal("show");
       this.ruleForm2.password='';
      this.validata.isphone = false;
      this.validata.isemail = false;
      this.validata.ispwd = false;
      this.validata.emailexist = false;
      this.validata.isname = false;
      this.validata.nametyp = false;

      setTimeout(function() {
        $("#itstname").focus();
      }, 1000);

      // 如果没有id值就不要把值给表单了好哇老
      // handleEdit(ids){
      //     debugger
      //     // 拿到需要编辑的ID了，然后要把该ID的信息丢给form表单显示出来

      //       $("#accountModel").modal('show')

      // },
      // this.$ajax.get('/client/api/meun')
      //             .then(res=>{
      //                 console.log(res);
      //             })
      //             .catch(err=>{

      //                 console.log(err)
      //             })
    },
    handleStatus(ids, stu) {
      if (stu == "0") {
        this.changestatus(ids, "-1");
      } else if (stu == "-1") {
        this.changestatus(ids, "0");
      }
    },
    handleDelete(ids, stu) {
      var $t = this;
      bootbox.confirm({
        message: "您确定要删除吗？",
        size: "small",
        buttons: {
          confirm: {
            label: "确定",
            className: "btn-sky"
          },
          cancel: {
            label: "取消",
            className: "btn-default"
          }
        },
        callback: function(result) {
          if (result) {
            $t.changestatus(ids, "-2");
            $t.getchildcount();
          }
        }
      });

      // let isSure = confirm("确定删除吗？")
      // if(isSure){
      //     this.changestatus(ids,'-2')
      //     this.getchildcount()
      // }
    },
    childsave() {
      // 编辑状态的保存子账户信息用update
      // var str = JSON.stringify(this.ruleForm2)
      this.ruleForm2.token = getCookie("user");
      // if(this.validata.isemail ==false && this.validata.isphone ==false &&this.validata.ispwd ==false ){新注释
      // if(this.accountid){//这里的注释很重要：不能删！防止后台反复修改接口
      //     var t = this;
      //     $.ajax({
      //         type:'post',
      //         url:this.dataurl+'/admin/user/update',
      //         data:this.ruleForm2,
      //         dataType:'json',
      //         success:function (res) {
      //             // console.log(res)
      //             if(res.code =='1'){
      //             $("#accountModel").modal('hide')
      //                     t.accountid='';
      //                     t.getlist();
      //             }else{
      //                 alert(res.msg)
      //             }

      //         },
      //         error:function(err){
      //             alert("INTERNET ERROR!!")
      //         }
      //     })
      // }else{

      if (
        this.errors.items.length == 0 &&
        this.validata.emailexist == false &&
        this.validata.ispwd == false &&
        this.validata.isname == false &&
        this.validata.nametype == false
      ) {
        var t = this;
        $.ajax({
          type: "post",
          url: this.dataurl + "/admin/user/save",
          data: this.ruleForm2,
          dataType: "json",
          success: function(res) {
            // console.log(res)
            if (res.code == "1") {
              $("#accountModel").modal("hide");
              t.getlist();
              t.getchildcount();
                t.$message({
                    type:'success',
                    message:'保存成功！'
                })
            } else {
              t.$message.error('系统繁忙，请重试');
            }
          },
          error: function(err) {
            // alert("INTERNET ERROR!!")
          }
        });
        // }
      } else {
        this.openMsg("请确认您的填写!", "warning");
      }

      // this.$ajax.get('/admin/user/add',{params:this.ruleForm2})
      //     .then(res=>{
      //         console.log(res);
      //     })
      //     .catch(err=>{
      //         console.log(err)
      //     })
    }
    // submitForm(formName) {
    //     this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //         alert('submit!');
    //     } else {
    //         console.log('error submit!!');
    //         return false;
    //     }
    //     });
    // },
    // resetForm(formName) {
    //     this.$refs[formName].resetFields();
    // },
    // nametest(){
    //     console.log(this.msg.length)
    //     if(this.msg.length>3){
    //         console.log("请输入15位一下英文或数字")
    //     }
    // },
    //  phonetest(){
    //     if(this.msg1.length<11){
    //         console.log("请输入11位手机号")
    //     }
    // },
    // passtruetest(){
    //        if(this.msg3!==this.msg2){
    //         console.log("两次密码输入不同！")
    //     }
    // }
  }
};
</script>
<style scoped>
.modal-content {
  padding: 30px;
}
.red {
  color: red;
}
table tr td:last-child{
  width: 210px;
}
</style>
