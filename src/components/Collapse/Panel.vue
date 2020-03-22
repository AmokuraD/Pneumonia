<template>
  <div :class="panelClasses">
    <div :class="headerClasses" @click="toggle">
      <slot></slot>
    </div>
    <div :class="contentClasses" v-show="isActive">
      <div :class="boxClasses">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  const prefixCls = 'collapse';
  export default {
    name: 'Panel',
    props: {
      name: {
        type: String
      }
    },
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
  .collapse-header {
    font-weight: 600;
    transition: all 0.1s;
    padding: .15rem;
  }

  .collapse-header:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .collapse-header-active {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .collapse-panel {
    transition: all 0.5s;
  }

  .collapse-panel-active {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .collapse-content {
    padding: .1rem .2rem;
  }

</style>
