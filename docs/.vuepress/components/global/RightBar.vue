<!--
插件：
右侧边栏上面，显示个人的微信二维码以及赞赏码
-->
<template>
  <div>
    <nav class="right-bar-wrap" v-show="isRightBar">
      <div class="right-bar-item">
        <img :src="localImgRepo.wxImg" alt="站长wechat"/>
        <div>站长wechat</div>
      </div>
      <div class="right-bar-item">
        <img :src="localImgRepo.zsImg" alt="赞赏码"/>
        <div>赞赏码</div>
      </div>
    </nav>
  </div>
</template>

<script>
import localImgRepo from '../../public/js/localImgRepo';
export default {
  name: "RightBar",
  data() {
    return {
      isRightBar: true,    // 侧边栏默认隐藏
      localImgRepo: localImgRepo
    };
  },
  mounted() {
    window.addEventListener("scroll", this.scroll);   // 绑定监听scroll事件
  },

  destroyed() {
    window.removeEventListener("scroll", this.scroll); // 解绑监听scroll事件
  },

  methods: {
    scroll() {
      const that = this;
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      that.scrollTop = scrollTop;
    }

  },
};
</script>

<style lang="stylus" scoped>
.right-bar-wrap {
    position: fixed;
    right: 0.15rem;
    top: 20%;
    display: flex;
    flex-direction: column;
    z-index: 888;

    img {
      border: 1px solid #3eaf7c;
      border-radius: 4px;
      width: 70px;
      height: 70px;
    }
}

.right-bar-item {
  background-color:#FFFFFF;
  text-align:center;
  border-style:solid;
  width: 100px;
  height: 100px;
}
</style>