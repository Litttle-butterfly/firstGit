
<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>
import {getCookie} from './static/js/globle.js';
export default {
    data() {
        return {
          enter:function (url,d,_fn) {
            this.ajaxEnter(url,d,_fn)
          },
        }
    },
    created(){
      var t=this;
      if(t.$route.path=="/bingtuan"){
        this.$router.replace({path: '/bingtuan'})
        getCookie('dark')!=undefined?this.$router.replace({path: '/bingtuan'}):''
      }else {
        getCookie('user')==""?this.$router.replace({ path: '/login' }):
        t.$route.path=="/"?this.$router.replace({ path: '/login' }):''
      }
    },
    mounted(){

    },
    methods:{

    }
}
</script>
<style scoped>

</style>
