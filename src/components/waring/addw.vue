<template>
    <div class="childbox">
      <div class="well with-header">
          <div class="header bordered-sky">基本设置</div>
          <table class="table table-striped table-bordered table-hover">
            <tbody>
              <tr><td class="text-align-center">预警名称<span class="color-input">*</span></td><td><input type="text" v-model="sh.name" v-on:blur="dupremove" /></td></tr>
              <tr><td class="text-align-center">主题<span class="color-input">*</span></td><td><label><input type="checkbox" value="" data-model="wid" v-model="wcheck" class="chk_all" @click="checkedwAll" />全选</label><label v-for="it in words"><input  class="chk_list" type="checkbox" :value="it.id" name="words"  v-model="sh.wid" />{{it.name}}</label></td></tr>
              <tr><td class="text-align-center">属性<span class="color-input">*</span></td><td><label><input type="checkbox" value="" data-model="side" v-model="scheck" class="chk_all" @click="checkedsAll" />全选</label><label v-for="it in side"><input  class="chk_list" type="checkbox" :value="it.id" name="side" v-model="sh.side" />{{it.name}}</label></td></tr>
              <tr><td class="text-align-center">维度<span class="color-input">*</span></td><td><label><input type="radio" value="" name="dimension" v-model="sh.dimension" />不限定</label><label v-for="it in dimension"><input type="radio" :value="it.id" name="dimension" v-model="sh.dimension" />{{it.name}}</label></td></tr>
              <tr><td class="text-align-center">来源<span class="color-input">*</span></td><td><label><input type="checkbox" value="" data-model="media_type" v-model="mcheck" class="chk_all" @click="checkedmAll" />全选</label><label v-for="it in mediaType"><input  class="chk_list" type="checkbox" :value="it.id" name="mediaType" v-model="sh.media_type" />{{it.name}}</label></td></tr>
              <tr><td class="text-align-center">文章权重<span class="color-input">*</span></td><td><label>权重><input type="number" max="12" min="1" v-model="sh.weight"  /><span>权重范围 1-12</span></label></td></tr>
              <tr><td class="text-align-center">文章过滤</td><td><label><input type="radio" name="filter" value="0" v-model="sh.filter" />相似文章预警</label><label><input type="radio" name="filter" value="-1" v-model="sh.filter" />相似文章不预警</label></td></tr>
            </tbody>
          </table>
      </div>
      <div class="well with-header with-footer">
          <div class="header bordered-sky">发送选项</div>
          <table class="table table-striped table-bordered table-hover">
            <tbody>
              <tr><td class="text-align-center">预警时间</td><td>
                <select v-model="sh.stime"><option v-for="it in Htime" :value="it">{{it}}</option></select>至<select v-model="sh.etime"><option v-for="it in Htime" :value="it">{{it}}</option></select>
                <label><input type="radio" name="timetype" value="0" @click="wdatetype(1)" />工作日</label>
                <label><input type="radio" name="timetype" value="1" @click="wdatetype(2)" checked />全天候</label></td></tr>
              <tr><td class="text-align-center">预警频次</td><td><select v-model="sh.frequency"><option v-for="it in frequency" :value="it.id" >{{it.name}}</option></select></td></tr>
              <tr><td class="text-align-center">周末预警</td><td><label><input type="radio" name="weekon" :value="0" v-model="sh.weekon" />开启</label><label><input type="radio" name="weekon" :value="-1" v-model="sh.weekon" />关闭</label></td></tr>
              <tr>
                <td class="text-align-center">收件人</td>
                <td>
                  <label v-for="it in receive">
                  <input type="checkbox" :value="it.email" v-model="sh.receive" name="receive" checked='checked' />{{it.name}}</label>

                      <input type="email" name = 'email' v-validate="'email'"
                          class="input-new-tag"
                          v-if="inputVisible"
                          v-model="inputValue"
                          ref="saveTagInput"
                          size="mini"
                          @keyup.13="handleInputConfirm"
                          @blur="handleInputConfirm">
                      </input>
                      <button v-else class="btn btn-xft btn-sm btn-sky" size="small" @click="showInput">+ 新增收件人</button>
                      <span class="red" v-show="errors.has('email')">{{ errors.first('email') }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="footer">
            <a class="btn  xftbluebtn btn-sky" @click="savew">提交</a>
        </div>
      </div>
    </div>
</template>
<script>
import { getCookie } from "../../static/js/globle.js";
import { delCookie } from "../../static/js/globle.js";
export default {
  data() {
    return {
              inputValue:'',
      inputVisible: false,
      enter: function(url, d, _fn) {
        this.ajaxEnter(url, d, _fn);
      },
      openMsg: function(msg, type) {
        this.$message({
          message: msg,
          type: type
        });
      },
      idx: "",
      wdetail: [],
      words: [],
      mediaType: [],
      side: [],
      dimension: [],
      wcheck: true,
      scheck: true,
      mcheck: true,
      Htime: [],
      receive: [],
      frequency: [
        { id: "5", name: "5分钟/次" },
        { id: "10", name: "10分钟/次" },
        { id: "15", name: "15分钟/次" },
        { id: "30", name: "30分钟/次" },
        { id: "60", name: "1小时/次" },
        { id: "180", name: "2小时/次" },
        { id: "360", name: "6小时/次" },
        { id: "720", name: "12小时/次" },
        { id: "1440", name: "24小时/次" }
      ],
      sh: {
        name: "",
        wid: [],
        media_type: [],
        side: [],
        dimension: "",
        weight: "7",
        filter: "-1",
        frequency: "5",
        weekon: "0",
        receive: [],
        stime: "00:00",
        etime: "23:00"
      }
    };
  },
  created() {
    getCookie("user") == "" ? this.$router.replace({ name: "/app" }) : "";
    var t = this;
    t.idx = this.$route.query.id ? this.$route.query.id : "";
    for (var i = 0; i < 24; i++) {
      i < 10 ? t.Htime.push("0" + i + ":00") : t.Htime.push(i + ":00");
    }
    var url = "/client/api/get_lists";
    t.idx = this.$route.query.id;
    this.enter(url, { params: {} }, function(d) {
      t.words = d.data.words;
      t.side = d.data.side;
      t.mediaType = d.data.media_type;
      t.dimension = d.data.dimension;
      t.idx
        ? ""
        : (function() {
            d.data.words.map(function(it) {
              t.sh.wid.push(it.id);
            });
            d.data.side.map(function(it) {
              t.sh.side.push(it.id);
            });
            d.data.media_type.map(function(it) {
              t.sh.media_type.push(it.id);
            });
          })();
    });
    (url = "/admin/user"),
      this.enter(url, { params: {} }, function(d) {
        t.receive = d.data;
        d.data.map(function(item) {
          t.idx ? "" : t.sh.receive.push(item.email);
        });
      });
    t.idx
      ? (function() {
          var url = "/client/warning/setting/";
          t.enter(url, { params: { id: t.idx } }, function(d) {
            d = d.data.data[0];
            var cdion = d.condition;
            t.sh.receive = d.receive;
            t.sh.name = d.name;
            t.sh.filter = cdion.filter;
            t.sh.wid = cdion.wid;
            t.sh.weight = cdion.weight;
            t.sh.media_type = cdion.media_type;
            t.sh.side = cdion.side;
            t.sh.dimension = cdion.dimension;
            t.sh.stime = d.warn_stime;
            t.sh.etime = d.warn_etime;
            t.sh.frequency = d.frequency;
            t.sh.weekon = d.warn_week;
            var re=[],hs=[];
            t.receive.map(function(i){
              d.receive.indexOf(i.email)!=-1?hs.push(i.email):''
            })
            d.receive.map(function(i){
              hs.indexOf(i)!=-1?'':re.push({name:i,email:i})
            })
            t.receive=t.receive.concat(re);
          });
        })()
      : "";
  },
  mounted() {
    var html = '<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
    html += '<li>预警</li><li><a href="#/waring/settingW">预警设置</a></li>';
    this.idx
      ? (html += '<li class="active">预警修改</li>')
      : (html += '<li class="active">新增预警</li>');
    $("#Crumbs").html(html);
  },
  watch: {
    "sh.wid": {
      handler: function() {
        if (this.words.length == 0) {
        } else if (this.sh.wid.length === this.words.length) {
          this.wcheck = true;
        } else {
          this.wcheck = false;
        }
      }
    },
    "sh.side": {
      handler: function() {
        if (this.side.length == 0) {
        } else if (this.sh.side.length === this.side.length) {
          this.scheck = true;
        } else {
          this.scheck = false;
        }
      }
    },
    "sh.media_type": {
      handler: function() {
        if (this.mediaType.length == 0) {
        } else if (this.sh.media_type.length === this.mediaType.length) {
          this.mcheck = true;
        } else {
          this.mcheck = false;
        }
      }
    }
  },
  methods: {
     handleInputConfirm() {
      let inputValue = $.trim(this.inputValue);
      if (inputValue  && this.errors.items.length == 0) {
          this.receive.push({
              name:inputValue,
              email:inputValue
          })
                this.inputVisible = false;
      this.inputValue = "";
      }

    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus();
      });
    },
    checkedwAll() {
      var _this = this;
      if (this.wcheck == false) {
        //实现反选
        _this.sh.wid = [];
      } else {
        //实现全选
        _this.sh.wid = [];
        _this.words.forEach(function(item) {
          _this.sh.wid.push(item.id);
        });
      }
    },
    checkedsAll() {
      var _this = this;
      if (this.scheck == false) {
        //实现反选
        _this.sh.side = [];
      } else {
        //实现全选
        _this.sh.side = [];
        _this.side.forEach(function(item) {
          _this.sh.side.push(item.id);
        });
      }
    },
    checkedmAll() {
      var _this = this;
      if (this.mcheck == false) {
        //实现反选
        _this.sh.media_type = [];
      } else {
        //实现全选
        _this.sh.media_type = [];
        _this.mediaType.forEach(function(item) {
          _this.sh.media_type.push(item.id);
        });
      }
    },
    dupremove() {
      var url = "/client/warning/check_name",
        t = this,
        d = { params: { id: t.idx, name: this.sh.name } };
      t.enter(url, d, function(d) {
        d.code == "1"
          ? ""
          : (function() {
              t.sh.name = "";
              t.openMsg(d.msg, "warning");
            })();
      });
    },
    wdatetype(v) {
      v == 1
        ? ((this.sh.stime = "09:00"), (this.sh.etime = "18:00"))
        : ((this.sh.stime = "00:00"), (this.sh.etime = "23:00"));
    },
    savew() {
      var t = this;
      var url = "",
        d = {};
      if (t.idx) {
        url = "/client/warning/update/";
        d = {
          params: {
            id: t.idx,
            name: t.sh.name,
            side: t.sh.side,
            media_type: t.sh.media_type,
            wid: t.sh.wid,
            weight: t.sh.weight,
            filter: t.sh.filter,
            dimension: t.sh.dimension,
            frequency: t.sh.frequency,
            warn_stime: t.sh.stime,
            warn_etime: t.sh.etime,
            receive: t.sh.receive,
            warn_week: t.sh.weekon
          }
        };
      } else {
        url = "/client/warning/add_setting/";
        d = {
          params: {
            name: t.sh.name,
            side: t.sh.side,
            media_type: t.sh.media_type,
            wid: t.sh.wid,
            weight: t.sh.weight,
            filter: t.sh.filter,
            dimension: t.sh.dimension,
            frequency: t.sh.frequency,
            warn_stime: t.sh.stime,
            warn_etime: t.sh.etime,
            receive: t.sh.receive,
            warn_week: t.sh.weekon
          }
        };
      }
      t.enter(url, d, function(d) {
        d.code != 1
          ? (function() {
              t.openMsg(d.msg, "success");
            })()
          : (function() {
              t.$router.replace({ path: "/waring/settingW" });
            })();
      });
    }
  }
};
</script>
<style scoped>
.text-align-center {
  width: 150px;
}
.view-box {
  width: 100%;
}
.view-w {
  width: 100%;
  height: 100%;
}
h4 {
  padding: 3px 6px;
  background-color: #cdcdcd;
}
.ptitle a {
  display: inline-block;
  cursor: pointer;
  float: right;
  border-radius: 5px;
  border: 1px solid #cf00fc;
}
.bs-tabs {
  width: 200px;
  float: left;
}
.line-view {
  width: 100%;
  height: 200px;
}
.wrank {
  width: 44%;
  height: 200px;
  float: left;
}
.wpie {
  width: 44%;
  height: 200px;
  float: right;
}
.wdetail {
  width: 100%;
  height: auto;
}
.color-input {
  color: #ff0000;
}
</style>
