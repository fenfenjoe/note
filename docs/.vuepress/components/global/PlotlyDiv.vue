<!--
插件：
用来显示数学函数图像
-->
<template>
  <div class="chart" style="width:600px;height:250px;">

  </div>
</template>

<script>
import Plotly from 'plotly.js-dist-min';

export default {
  name: "PlotlyDiv",
  data: function() {
    return {
    };
  },
  mounted() {
    this.drawChart();
  },

  destroyed() {
  },

  methods: {
    drawChart(){
      // 使用 Plotly 创建图表
      Plotly.newPlot('chart', [{
        x: [1, 2, 3],
        y: [2, 4, 6],
        type: 'scatter'
      }]);

      // 设置本地化语言
      Plotly.setPlotConfig({
        locale: 'zh-CN'
      });
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>