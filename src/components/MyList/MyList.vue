<template>
  <div :class="classes">
    <div class="list-header">
      <div class="header-item">地区</div>
      <div class="header-item">新增确诊</div>
      <div class="header-item">累计确诊</div>
      <div class="header-item">治愈</div>
      <div class="header-item">死亡</div>
    </div>
    <div class="panel-box">
      <Panel v-for="item in data.data.areaTree[0].children" :key="item.name" :data="item" :name="item.name"></Panel>
    </div>
  </div>
</template>

<script>
  import Panel from '@/components/MyList/Panel';
  const prefixCls = 'mylist';
  export default {
    name: 'MyList',
    components: {
      Panel
    },
    props: {
      accordion: {
        type: Boolean,
        default: false
      },
      value: {
        type: String,
      },
      data: {}
    },
    data() {
      return {
        currentValue: this.value
      }
    },
    computed: {
      classes() {
        return `${prefixCls}`;
      }
    },
    watch: {
      currentValue() {
        this.setActive();
      }
    },
    methods: {
      getActiveKey() {
        let activeKey = this.currentValue || [];
        const accordion = this.accordion;
        if (!Array.isArray(activeKey)) {
          activeKey = [activeKey];
        }
        if (accordion && activeKey.length > 1) {
          activeKey = [activeKey[0]];
        }
        for (let i = 0; i < activeKey.length; i++) {
          activeKey[i] = activeKey[i].toString();
        }
        return activeKey;
      },
      setActive() {
        const activeKey = this.getActiveKey();
        this.$children.forEach((child, index) => {
          const name = child.name || index.toString();
          let isActive = false;
          if (self.accordion) {
            isActive = activeKey === name;
          } else {
            isActive = activeKey.indexOf(name) > -1;
          }
          child.isActive = isActive;
          child.index = index;
        });
      },
      toggle(data) {
        const name = data.name.toString();
        let newActiveKey = [];
        if (this.accordion) {
          if (!data.isActive) {
            newActiveKey.push(name);
          }
        } else {
          let activeKey = this.getActiveKey();
          const nameIndex = activeKey.indexOf(name);
          if (data.isActive) {
            if (nameIndex > -1) {
              activeKey.splice(nameIndex, 1);
            }
          } else {
            if (nameIndex < 0) {
              activeKey.push(name);
            }
          }
          newActiveKey = activeKey;
        }
        this.currentValue = newActiveKey;
        // this.$emit('input', newActiveKey);
        // this.$emit('on-change', newActiveKey);
      }
    },
    mounted() {
      this.setActive();
    }
  }

</script>

<style lang="" scoped>
  * {
    color: white;
  }

  .list-header {
    display: flex;
    justify-content: center;
    height: .45rem;
    font-size: .25rem;
  }

  .header-item {
    flex: 1;
    text-align: center;
  }

  .panel-box {
    height: 6.75rem;
    overflow: scroll;
  }

  .panel-box::-webkit-scrollbar {
    display: none;
  }

  .mylist {
    height: 100%;
  }

</style>
