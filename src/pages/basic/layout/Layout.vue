<template>
  <div class="app-wrapper" :class="{hideSidebar:!isOpean}">
    <div class="content">
      <level-header></level-header>
      <div class="section">
        <Menu class="sidebar-container menu"></Menu>
        <div class="content" :class="{'close':!isOpean}">
          <div class="main-container" ref="mainContainer">
            <div class="main-nav">
              <TabsNav></TabsNav>
              <div class="main-tips">
                <Prompt :isShow.sync="isPageTips">
                  <div v-html="pageTips"></div>
                </Prompt>
              </div>
            </div>
          </div>
          <div class="main-content">
            <keep-alive>
              <components :is="componentName"></components>
            </keep-alive>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from './Menu';
import Prompt from './Prompt';
import LevelHeader from './LevelHeader';
import TabsNav from './TabsNav.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'layout',
  data() {
    return {
      pageTips: '',
      // componentName: '',
      isPageTips: false
    };
  },
  components: {
    Menu,
    LevelHeader,
    Prompt,
    TabsNav
  },
  methods: {
    getTips() {
      this.pageTips = this.$route.meta.pageTips || '暂无';
    }
  },
  watch: {
    $route() {
      this.getTips();
    }
  },
  created() {
    this.getTips();
  },
  computed: {
    ...mapGetters([
      'isOpean',
      'componentName'
    ]),
    pageCode() {
      return this.$route.meta.componentUrl || this.$route.name;
    },
    funcNo() {
      return this.$route.meta.no || this.$route.query.funcNo;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
html,
body,
.app-wrapper {
  width: 100%;
  height: 100%;
}
.app-wrapper {
  overflow: hidden;
  &.hideSidebar {
    .sidebar-container {
      width: $menu-close-width;
      overflow: inherit;
    }
  }

  .section {
    .menu {
      position: fixed;
      top: $header-height;
      left: 0;
      z-index: 100;
    }
    .content {
      margin-left: $menu-width;
      &.close {
        margin-left: $menu-close-width;
      }
      .main-nav {
        min-height: 50px;
        padding: 0 10px;
        .main-tips {
          position: relative;
          top: -5px;
        }
      }
      .main-content {
        height: calc(100vh - 140px);
        overflow: auto;
        @include scrollBar;
      }
    }
  }
}
</style>
