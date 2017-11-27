<template>
     <div class="right_">
        <div class="xftrgba">
          <!-- <div class="xft-book-left-g"></div>
          <div class="xft-book-left-w"></div>
           <div class="xft-book-right-w"></div> -->
            <h4>基本信息</h4> <hr/>
            <form class="form-horizontal">
                <div class="form-group">
                    <label class="col-sm-2 control-label">手机</label>
                    <div class="col-sm-7">
                        <p class="form-control-static">{{user_info.phone}}  </p>
                      <!-- 膜太狂 -->
                        <div class="modal fade bs-example-modal-sm" tabindex="-1" id="myModal">
                            <div class="modal-dialog modal-sm" role="document">
                                <div class="modal-content">
                                    <input type="number"  class="form-control" style="margin-bottom: 10px;" placeholder="手机号" v-model="head.phone">
                                    <input type="text" class="form-control" style="width: 150px;float: left;"  placeholder="输入验证码" v-model="head.yzm">
                                    <a :class="yzmload==false?'btn btn-sm btn-default':'btn btn-sm btn-default disabled'" style="padding: 8px 14px;" @click="yzm" id="getCode">获取验证码</a><!--@click="yzm"-->
                                    <div class="modal-footer">
                                        <button  class="btn btn-sm btn-default" data-dismiss="modal">关闭</button>
                                        <button  class="btn btn-sm btn-info" @click="phonesave">保存</button>
                                    </div>

                                </div>

                            </div>
                        </div>
                        <!-- 结束 -->
                    </div>
                    <div class="col-sm-2">
                        <a type="button" class="xftbtn" @click="gophone"><i class="ifa ifa-edit-b"></i> 修改</a>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">邮箱</label>
                    <div class="col-sm-7">
                        <p class="form-control-static">{{user_info.email}}   </p>

                        <div class="modal fade bs-example-modal-sm" tabindex="-1" id="emailModal">
                            <div class="modal-dialog modal-sm" role="document">
                                <div class="modal-content">
                                     <input type="phone" class="form-control" placeholder="新邮箱" @blur="checkemail" v-model="head.newemail" name="email" >

                                 <span class="red" v-show="validata.isemail">请输入正确的邮箱格式</span>
                                        <span class="red" v-show="validata.emailexist">邮箱已占用！</span>
                                     <div style="font-size:10px">*完成后请登录您的邮箱完成邮箱验证</div>
                                    <div class="modal-footer">
                                    <button type="button" class="btn btn-sm btn-default" data-dismiss="modal">关闭</button>
                                    <button type="button" class="btn btn-sm btn-info" @click="emailsave">提交</button>
                                </div>

                                </div>

                            </div>
                        </div>

                    </div>
                      <div class="col-sm-2">
                           <a type="button" class="xftbtn" @click="goemail"><i class="ifa ifa-edit-b"></i> 修改</a>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">密码</label>
                    <div class="col-sm-7">
                        <p class="form-control-static">********* </p>
                        <div class="modal fade bs-example-modal-sm" tabindex="-1" id="pwdModal">
                            <div class="modal-dialog modal-sm" role="document">
                                <div class="modal-content">
                                    <div><label >更改密码：</label><input type="password" class="form-control" placeholder="密码" v-model="head.pwd1"></div>
                                    <br/>
                                    <div><label>再次输入：</label><input type="password" class="form-control"  placeholder="再次输入密码" v-model="head.pwd2"></div>
                                      <span class="red" v-show="validata.samepwd">两次输入的密码不一致！</span>
                                    <div class="modal-footer">
                                        <button type="button" class="btn  btn-sm btn-default" data-dismiss="modal">关闭</button>
                                        <button type="button" class="btn btn-sm btn-info" @click="pwdsave">提交</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-2">
                         <a type="button" class="xftbtn" @click="gopwd"><i class="ifa ifa-edit-b"></i> 修改</a>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">账号类型</label>
                    <div class="col-sm-7">
                    <p class="form-control-static">{{client_info.role=='1'?'正式用户':client_info.role=='2'?'演示用户':client_info.role=='3'?'测试用户':"未知用户"}}</p>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">到期时间</label>
                    <div class="col-sm-7">
                    <p class="form-control-static">{{user_info.expiretime | tolocal}}</p>
                    </div>
                </div>
            </form>
            <h4>完善信息</h4>     <hr/>
            <form class="form-horizontal">
                <div class="form-group">
                    <label class="col-sm-2 control-label">公司</label>
                    <div class="col-sm-7">
                    <p class="form-control-static">{{client_info.company}}</p>
                    </div>
                      <div class="col-sm-2">
                           <a type="button" class="xftbtn" @click="gorich"><i class="ifa ifa-edit-b"></i> 修改</a>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">行业</label>
                    <div class="col-sm-8">
                    <p class="form-control-static">{{ind}}</p>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">联系人</label>
                    <div class="col-sm-8">
                    <p class="form-control-static">{{client_info.phone}}</p>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">固定电话</label>
                    <div class="col-sm-8">
                    <p class="form-control-static">{{client_info.tel}}</p>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">QQ</label>
                    <div class="col-sm-8">
                    <p class="form-control-static">{{client_info.qq}}</p>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">通讯地址</label>
                    <div class="col-sm-8">
                    <p class="form-control-static">{{client_info.address}}</p>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">邮编</label>
                    <div class="col-sm-8">
                    <p class="form-control-static">{{client_info.code}}</p>
                    </div>
                </div>


            </form>

            <div class="modal fade bs-example-modal" tabindex="-1" id="richModal">
                <div class="modal-dialog " role="document">
                    <div class="modal-content">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label for="" class="col-sm-2 control-label">公司名称</label>
                            <div class="col-sm-10">
                             <input type="text" class="form-control"   v-focus-next-on-enter="'phone'" ref="company"
                             placeholder="公司名称" name="company" v-validate="'company'" v-model="rich.company">
                             <span class="red" v-show="errors.has('company')">{{ errors.first('company') }}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-2 control-label">行业</label>
                            <div class="col-sm-10">
                                <label v-for="item in industry_type" >
                                        <input type="checkbox" :key="item.id" :value="item.id" name="industry_type" v-model="rich.industry_type" />
                                {{item.name}} </label>


                                <!--             <a v-for="it in industry_type" @click="changeWid(it$event)"
                                 :class="rich.industry_type.indexOf(it)!=-1?'btn btn-sm btn-sky':'btn btn-sm'">{{it.name}}</a>

                            <select  v-model="rich.industry_type">
                                <option  v-for="item in industry_type" :value="item.id">{{item.name}}</option>
                            </select>-->
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputEmail3" class="col-sm-2 control-label">联系人</label>
                            <div class="col-sm-10">
                            <!-- <input type="text" class="form-control" id="" placeholder="联系人"  v-model="rich.phone"> -->
                            <input type="text" class="form-control" name = 'phone'  v-validate="'required|phone'" v-model="rich.phone" placeholder="联系人"  v-focus-next-on-enter="'rockphone'" ref="phone">
                            <span class="red" v-show="errors.has('phone')">{{ errors.first('phone') }}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-2 control-label">固定电话</label>
                            <div class="col-sm-10">
                            <input type="text" class="form-control"  placeholder="固定电话"  v-model="rich.tel"  v-focus-next-on-enter="'qqemail'" ref="rockphone">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-2 control-label">QQ</label>
                            <div class="col-sm-10">
                            <!-- <input type="text" class="form-control" id="" placeholder="QQ"  v-model="rich.qq"> -->
                              <input type="text" class="form-control"  name = 'qqemail'  v-validate="'qqemail'" v-model="rich.qq" placeholder="QQ"  v-focus-next-on-enter="'address'" ref="qqemail">
                            <span class="red" v-show="errors.has('qqemail')">{{ errors.first('qqemail') }}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-2 control-label">通讯地址</label>
                            <div class="col-sm-10">
                            <input type="text" class="form-control"  placeholder="通讯地址" name="address" v-validate="'address'"  v-model="rich.address"  v-focus-next-on-enter="'postcode'" ref="address">
                             <span class="red" v-show="errors.has('address')">{{ errors.first('address') }}</span>
                            </div>
                        </div>
                            <div class="form-group">
                            <label for="" class="col-sm-2 control-label">邮编</label>
                            <div class="col-sm-10">
                            <input type="number" max="999999" min="1"class="form-control" placeholder="邮编" name="postcode" v-validate="'postcode'" v-model="rich.code" @keyup.13="richsave"  ref="postcode">
                            <span class="red" v-show="errors.has('postcode')">{{ errors.first('postcode') }}</span>
                            </div>
                        </div>
                        </form>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-sm btn-default" data-dismiss="modal">关闭</button>
                        <button type="button" class="btn btn-sm btn-info" @click="richsave">提交</button>
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
export default {
  data() {
    return {
      yzmload: false,
      enter: function(url, d, _fn) {
        this.ajaxEnter(url, d, _fn);
      },
      openMsg: function(msg, type) {
        this.$message({
          message: msg,
          type: type
        });
      },
      validata: {
        isemail: false,
        emailexist: false,
        samepwd: false
      },
      ind: "",
      industry_type: [],
      client_info: [],
      user_info: [],
      head: {
        phone: "",
        yzm: "",
        newemail: "",
        loginaccount: "",
        email: "",
        pwd1: "",
        pwd2: ""
      },
      rich: {
        code: "",
        address: "",
        qq: "",
        tel: "",
        phone: "",
        industry_type: ["1"],
        token: getCookie("user")
      }
    };
  },
  mounted() {
    var html = '<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
    html += '<li>设置</li><li class="active">账户管理</li>';
    $("#Crumbs").html(html);
    np.done();
  },
  methods: {
    gophone() {
      // debugger;
      $("#myModal").modal("show");
    },
    goemail() {
      $("#emailModal").modal("show");
    },
    gopwd() {
      $("#pwdModal").modal("show");
    },
    gorich() {
      // 把用户信息放到模态框里面
      var tp = this.client_info.industry_type;
      //   this.industry_type.forEach(function(item) {
      //     if (item.name == tp) {
      //       tp = item.id;
      //     }
      //   });
      this.rich = {
        company: this.client_info.company,
        code: this.client_info.code,
        address: this.client_info.address,
        qq: this.client_info.qq,
        tel: this.client_info.tel,
        phone: this.client_info.phone,
        industry_type: tp,
        id: this.client_info.id,
        token: getCookie("user")
      };

      $("#richModal").modal("show");

      // this.$ajax.get('client/api/get_lists')
      // .then(res=>{
      //     console.log(res.data)
      //     this.industry_type= res.data.data.industry_type
      // })
      // .catch(err=>{
      //     console.log(err)
      // })
    },
    getindustry() {
      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/client/api/get_lists",
        data: {
          token: getCookie("user")
        },
        dataType: "json",
        success: function(res) {
          // console.log(res);
          t.industry_type = res.data.industry_type;
        }
      });
    },
    phonesave() {
      if (/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.head.phone)) {
        var t = this;

        $.ajax({
          type: "post",
          url: this.dataurl + "/admin/user/update_phone",
          data: {
            phone: this.head.phone,
            id: this.user_info.id,
            token: getCookie("user")
          },
          dataType: "json",
          success: function(res) {
            // console.log(res);
            if (res.code == 1) {
              t.getmessage();
              t.$message({
                message: "修改成功！",
                type: "success"
              });

              $("#myModal").modal("hide");
            } else {
              t.$message.error("修改失败！");
            }
          }
        });
      } else {
        this.$message({
          message: "请检查您的手机号是否准确无误！",
          type: "warning"
        });
      }

      // 你大爷没绑验证码 不要删
      // if(!this.head.yzm){
      //    alert("请输入验证码")
      // }else if(!this.head.phone){
      //     alert("请输入手机号")

      // }else{

      // var  t = this;
      // $.ajax({
      //     type:'post',
      //     url:this.dataurl+'/admin/user/save',
      //     data:{
      //         code:this.head.yzm,
      //           token: getCookie("user")
      //     },
      //     dataType:'json',
      //     success:function (res) {
      //         console.log(res)
      //     }
      // })
      //   this.$ajax.get('/admin/client/update',{params:{code:this.head.yzm}})
      // .then(res=>{
      //     console.log(res);
      //     // 保存主题后跳转到主题列表页
      //     // this.$router.replace("/setup/dimensionSet")
      // })
      // .catch(err=>{
      //     alert(err)
      // })
      // }
    },
    countDown(second) {
      // 如果秒数还是大于0，则表示倒计时还没结束
      if (second > 0) {
        this.yzmload = true;
        $("#getCode").text("再次发送("+second+")");
        $("#getCode").css("background", "#ccc");
        // 按钮里的内容呈现倒计时状态
        $("#getCode").attr("disabled", true);
        // 时间减一
        second--;
        // 一秒后重复执行
        let t = this;
        setTimeout(function() {
          t.countDown(second);
        }, 1000);
        // 否则，按钮重置为初始状态
      } else {
        this.yzmload = false;
        // 按钮里的内容恢复初始状态
        $("#getCode").text("获取验证码");
        $("#getCode").css("background", "");
        // 按钮置未可点击状态
        $("#getCode").attr("disabled", false);
      }
    },
    yzm(event) {
      debugger;
      var contactsPhone = $.trim(this.head.phone);
      var _this = this;
      // 获取验证码
      $("#getCode").click(function() {

        if (contactsPhone == null || contactsPhone == "") {
          _this.$message.error("请填写手机号");
          return;
        }
        if (contactsPhone.length != 11) {
          _this.$message.error("请填写正确的手机号");
          return;
        }

          // 给手机号发送验证码
          var url = "/admin/client/send_tel_validate";
          var t = _this;
          _this.enter(url, { params: { phone: _this.head.phone } }, function(d) {
            t.yzmload = false;
            if(d.code==1){
              t.$message({
                type:'success',
                message:'发送成功'
              })

            }else{
              t.$message.error("发送失败");
            }
          });
        _this.countDown(30);
      });



    },
    emailsave() {
      if (this.validata.isemail == false && this.validata.emailexist == false) {
        var t = this;
        $.ajax({
          type: "post",
          url: this.dataurl + "/admin/user/update_email",
          data: {
            email: this.head.newemail,
            id: this.user_info.id,
            token: getCookie("user")
          },
          dataType: "json",
          success: function(res) {
            if (res.code == 1) {
              t.getmessage();
              $("#emailModal").modal("hide");
            }
          }
        });
      }
    },
    checkemail() {
      // debugger
      if (
        !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(
          $.trim(this.head.newemail)
        )
      ) {
        this.validata.isemail = true;
      } else {
        this.validata.isemail = false;
      }
      if ($.trim(this.head.newemail) != "") {
        var t = this;
        $.ajax({
          type: "post",
          url: this.dataurl + "/admin/user/check_email",
          data: {
            token: getCookie("user"),
            id: this.user_info.id,
            email: $.trim(this.head.newemail)
          },
          dataType: "json",
          success: function(res) {
            // console.log(res)
            if (res.code == "1") {
              // 表示可以用
              t.validata.emailexist = false;
            } else if (res.code == "-2") {
            } else {
              t.validata.emailexist = true;
              // 已存在
            }
          }
        });
      }
    },

    pwdsave() {
      if (this.head.pwd1 !== this.head.pwd2) {
        // this.validata.samepwd == true //直接alert算了
        this.openMsg("两次输入不一致", "warning");
      } else if (!this.head.pwd1 || !this.head.pwd1) {
        this.openMsg("您还未输入密码，请重试", "warning");
      } else {
        var t = this;
        $.ajax({
          type: "post",
          url: this.dataurl + "/admin/user/update_password",
          data: {
            password: this.head.pwd1,
            id: this.user_info.id,
            token: getCookie("user")
          },
          dataType: "json",
          success: function(res) {
            if (res.code == 1) {
              t.openMsg("密码修改成功！", "success");
              $("#pwdModal").modal("hide");
            } else if (res.code == -3) {
              t.openMsg("请输入6-12位字符！", "warning");
            } else {
              t.$message.error("密码修改失败！");
            }
            // else if(res.code == )
          }
        });
        // this.$ajax.get('/admin/client/update',{params:{password:this.head.pwd1,newpassword:this.head.pwd2}})
        //     .then(res=>{
        //         console.log(res);

        //     })
        //     .catch(err=>{
        //         console.log(err)
        //     })
      }
    },
    richsave() {
      // console.log(this.errors)

      if (this.errors.items.length == 0) {
        var t = this;
        $.ajax({
          type: "post",
          url: this.dataurl + "/admin/client/update",
          data: this.rich,
          dataType: "json",
          success: function(res) {
            // console.log(res);
            if (res.code == 1) {
              $("#richModal").modal("hide");
              t.getmessage();
              t.$message({
                type: "success",
                message: "修改成功！"
              });
            } else {
              t.$message.error("系统繁忙，请重试");
            }
          }
        });
      } else {
        this.$message({
          type: "warning",
          message: "请确认您的填写信息!"
        });
      }
    },
    getmessage() {
      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/admin/client/index",
        data: {
          token: getCookie("user")
        },
        dataType: "json",
        success: function(res) {
          // console.log(res);
          t.client_info = res.data.client_info;
          t.user_info = res.data.user_info;
          t.rich.industry_type = t.client_info.industry_type;
          t.toind();
        }
      });
    },
    toind() {
      var t = this;
      var timer = setInterval(function() {
        if (t.industry_type.length > 0) {
          let ind = "";
          t.industry_type.map(function(item, index) {
            t.client_info.industry_type.map(function(it, i) {
              if (it == item.id) {
                ind += item.name + ";";
              }
            });
          });
          t.ind = ind;
          //  t.industry_type.forEach(function(item) {
          //    if (item.id == t.client_info.industry_type) {
          //      t.client_info.industry_type = item.name;
          //    }
          //  });
          clearInterval(timer);
        }
      }, 100);
    }
  },
  created() {
    np.start();
    this.getmessage();

    this.getindustry();
    this.toind();

    // this.$ajax.get('/admin/client/index')
    //     .then(res=>{
    //         console.log(res);
    //         this.client_info = res.data.data.client_info
    //         this.user_info = res.data.data.user_info
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //     })
  }
};
</script>
<style scoped>
h4 {
  font-weight: 400 !important;
}
.xftbtn {
  box-shadow: none;
  color: black;
  /* border: none; */
}
.ifa-edit-b {
  width: 22px;
  height: 22px;
}
.gk {
  width: 600px;
}
.modal-content {
  padding: 30px;
}
.xft-book-left-g {
  position: absolute;
  width: 10px;
  height: 774px;
  left: 35px;
  background-color: rgba(204, 204, 204, 0.33);
}
.xft-book-left-w {
  position: absolute;
  width: 10px;
  height: 752px;
  left: 25px;
  top: 63px;
  background-color: white;
}
.xft-book-right-w {
  position: absolute;
  width: 10px;
  height: 784px;
  right: 24px;
  top: 30px;
  background-color: white;
}
.right_ {
  position: relative;
}
.xftrgba {
  /*width: 95%;*/
  margin: 0 auto;
  background-color: white;
  /* background-color: rgba(215, 216, 218, 0.5); */
  /*padding: 40px;*/
  /* border-radius: 15px; */
}
hr{
  border-top: 1px solid #11a9cc;
}
</style>
