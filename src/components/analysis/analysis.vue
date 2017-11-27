<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
import {getCookie} from '../../static/js/globle.js';
export default {
    data() {
        return {
        }
    },
    created(){
      getCookie('user')==""?(this.$router.replace({ name: '/app' })):''

    },
    mounted(){

    },
    methods:{

    }
}
</script>
<style scoped>

</style>
