<template>
  <div :class="panelClasses">
    <div :class="headerClasses" @click="toggle">
      <ListItem class="list-item"
        :data="[data.name,data.today.confirm,data.total.confirm,data.total.heal,data.total.dead]"></ListItem>
    </div>
    <div :class="contentClasses" v-show="isActive">
      <div :class="boxClasses">
        <ListItem class="list-item" v-for="item in data.children" :key="item.name"
          :data="[item.name,item.today.confirm,item.total.confirm,item.total.heal,item.total.dead]"></ListItem>
      </div>
    </div>
  </div>
</template>

<script>
  import ListItem from '@/components/MyList/ListItem';
  const prefixCls = 'mylist';
  export default {
    name: 'Panel',
    components: {
      ListItem
    },
    props: ['name', 'data'],
    data() {
      return {
        index: 0,
        isActive: false
      }
    },
    methods: {
      toggle() {
        this.$parent.toggle({
          name: this.name || this.index,
          isActive: this.isActive
        });
      }
    },
    computed: {
      panelClasses() {
        return [
          `${prefixCls}-panel`,
          {
            [`${prefixCls}-panel-active`]: this.isActive
          }
        ];
      },
      headerClasses() {
        return [`${prefixCls}-header`,
          {
            [`${prefixCls}-header-active`]: this.isActive
          }
        ];
      },
      contentClasses() {
        return `${prefixCls}-content`;
      },
      boxClasses() {
        return `${prefixCls}-content-box`;
      }
    }
  }

</script>

<style lang="" scoped>
  .list-item {
    transition: all 0.1s;
  }

  .list-item:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }

  .mylist-header {
    transition: all 0.5s;
  }

  .mylist-header-active {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .mylist-panel {
    transition: all 0.5s;
  }

  .mylist-panel-active {
    background-color: rgba(255, 255, 255, 0.1);
  }

</style>
