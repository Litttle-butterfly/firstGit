
<template>
    <div>
        444444
    </div>
</template>
<script>
export default {
    data() {
        return {
        }
    },
    created(){
        // debugger
        var qq = this.$route.query.kw
       this.$router.push({ path: '/search',query:{kw:qq}})
    //   this.$router.go(-1)
    },
    mounted(){
      $('.loading-container').addClass('loading-inactive');
    }
}
</script>
<style>
</style>
