<template>
  <div :class="itemClasses">
    <span v-for="item in data" :key="item.name" :class="ceilClasses">
      {{item}}
    </span>
  </div>
</template>

<script>
  const prefixCls = 'mylist';
  export default {
    name: '',
    props: ['data'],
    data() {
      return {

      }
    },
    computed:{
        itemClasses(){
            return `${prefixCls}-item`;
        },
        ceilClasses(){
            return `${prefixCls}-ceil`;
        }
    }
  }

</script>

<style lang="" scoped>
.mylist-item{
    display: flex;
    justify-content: center;
    align-items: center;
    height: .45rem;
    font-size: .25rem;
}
.mylist-ceil{
    flex:1;
    text-align: center;
}
</style>
