
<template>
<div>
 <router-view></router-view>
</div>
</template>
<script>
import {getCookie} from '../../static/js/globle.js';
    export default {
        data(){
            return {

            }
        },
        methods:{

        },
        created(){//组件被创建的时候
          getCookie('user')==""?(this.$router.replace({ name: '/app' })):''
        },
        mounted(){
          $('.nav-tabs li a').on('click',function(){
              $('.nav-tabs li a').removeClass('cur'),$(this).addClass('cur');
          })
        }
    }


</script>
<style scoped>
.setLeft{
  width: 100px;
  flex-grow: 0;
  float:left;
  text-align: center;
  flex-flow: row nowrap;
  background: #cdcdcd;
}
.setLeft ul li{
  border-bottom: 1px solid #fff;
}
.setleft h3{
  border-bottom: 1px solid #000;
}
a.cur{
  border: 1px solid #199ed8;
}
</style>
