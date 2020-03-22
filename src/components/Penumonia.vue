<template>
  <div class="main-box">
    <div class="column">
      <div class="panel">
        <div class="chart" id="chart1"></div>
        <div class="panel-footer"></div>
      </div>
      <div class="panel">
        <div class="chart" id="chart2"></div>
        <div class="panel-footer"></div>
      </div>
      <div class="panel">
        <div class="chart" id="chart3"></div>
        <div class="panel-footer"></div>
      </div>
    </div>
    <div class="column">
      <div class="panel">
        <h1>新型冠状病毒实时数据</h1>
        <div class="main-row-box">
          <div class="main-row-box-item">
            <p>累计确诊</p>
            <p>{{info.data.chinaTotal.confirm}}</p>
          </div>
          <div class="main-row-box-item">
            <p>累计治愈</p>
            <p>{{info.data.chinaTotal.heal}}</p>
          </div>
          <div class="main-row-box-item">
            <p>累计死亡</p>
            <p>{{info.data.chinaTotal.dead}}</p>
          </div>
        </div>
        <div class="main-row-box">
          <div class="main-row-box-item">
            <p>现有确诊</p>
            <p>{{info.data.chinaTotal.nowConfirm}}</p>
          </div>
          <div class="main-row-box-item">
            <p>现有疑似</p>
            <p>{{info.data.chinaTotal.suspect}}</p>
          </div>
          <div class="main-row-box-item">
            <p>现有重症</p>
            <p>{{info.data.chinaTotal.nowSevere}}</p>
          </div>
        </div>
        <div class="panel-footer"></div>
      </div>
      <div class="panel">
        <div class="chart" id="chart5"></div>
        <div class="panel-footer"></div>
      </div>
    </div>
    <div class="column">
      <div class="panel">
        <div class="collapse-box">
          <Collapse>
            <Panel v-for="(item,index) in othInfo.data.articleList" :key="item.cmsId" :name="index.toString()">
              {{item.title}}
              <p slot="content">{{item.desc}}</p>
            </Panel>
          </Collapse>
        </div>
        <div class="panel-footer"></div>
      </div>
      <div class="panel">
        <div class="list-box">
          <MyList :data="info"></MyList>
        </div>
        <div class="panel-footer"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import MyList from '@/components/MyList/MyList';
  import Collapse from '@/components/Collapse/Collapse';
  import Panel from '@/components/Collapse/Panel';
  import 'echarts/map/js/china.js';
  export default {
    name: 'Penumonia',
    components: {
      MyList,
      Collapse,
      Panel
    },
    data() {
      return {
        info: {
          data: {
            lastUpdateTime: '',
            chinaTotal: {
              confirm: '',
              heal: '',
              dead: '',
              nowConfirm: '',
              suspect: '',
              nowSevere: ''
            },
            areaTree: [{
              children: []
            }]
          }
        },
        othInfo: {
          data: {
            articleList: []
          }
        },
        collapseValue: '0'
      }
    },
    computed: {},
    methods: {
      chart1Init(data) {
        const _echart1 = document.getElementById('chart1');
        const echart1 = this.$echarts.init(_echart1);
        window.addEventListener('resize', function () {
          echart1.resize();
        });

        function convertData(data) {
          const rs = [];
          const foreignList = data.data.foreignList.slice(0, 10);
          for (let i = 0; i < foreignList.length; i++) {
            rs.push([foreignList[i].confirm, foreignList[i].confirmAdd, foreignList[i].name]);
          }
          return rs;
        }
        echart1.setOption({
          title: {
            text: '各国新冠疫情数据',
            left: 'center',
            textStyle: {
              color: '#fff',
              fontSize: '14',
              fontWeight: 'normal'
            }
          },
          grid: {
            top: '15%',
            bottom: '10%'
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              return '国家: ' + params.value[2] + '<br/>' +
                '累计确诊: ' + params.value[0] + '<br/>' +
                '新增确诊: ' + params.value[1];
            }
          },
          xAxis: {
            splitLine: {
              show: false
            },
            axisLabel: {
              color: '#fff',
              interval: 0,
              formatter: function (value) {
                return value / 1000 + 'k';
              }
            }
          },
          yAxis: {
            splitLine: {
              show: false
            },
            scale: true,
            axisLabel: {
              color: '#fff',
              interval: 0,
              formatter: function (value) {
                return value / 1000 + 'k';
              }
            }
          },
          series: [{
            name: '累计确诊',
            type: 'scatter',
            data: convertData(data),
            symbolSize: function (data) {
              return Math.sqrt(data[0]) / 10;
            },
            itemStyle: {
              opacity: 0.8,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: 'rgba(120, 36, 50, 0.5)',
              color: new this.$echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                offset: 0,
                color: 'rgb(204, 46, 72)'
              }])
            }
          }]
        });
      },
      chart2Init(data) {
        const _echart2 = document.getElementById('chart2');
        const echart2 = this.$echarts.init(_echart2);
        window.addEventListener('resize', function () {
          echart2.resize();
        });

        function convertData(data) {
          const rs = [];
          const provinceList = data.data.areaTree[0].children;
          for (let i = 0; i < provinceList.length; i++) {
            let total = provinceList[i].today.confirm,
              local = 0,
              input = 0;
            if (total != 0) {
              const cityList = provinceList[i].children;
              if (cityList[0].name == '境外输入') {
                input = cityList[0].today.confirm;
                local = total - input;
              } else {
                local = total;
              }
              rs.push({
                'name': provinceList[i].name,
                '境外输入': input,
                '本地新增': local
              });
            }
          }
          rs.sort((a, b) => (b.境外输入 + b.本地新增) - (a.境外输入 + a.本地新增));
          return rs;
        }

        echart2.setOption({
          title: {
            text: '今日各省份新增',
            left: 'center',
            textStyle: {
              color: '#fff',
              fontSize: '14',
              fontWeight: 'normal'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: ['境外输入', '本地新增'],
            textStyle: {
              color: '#fff'
            },
            top: '10%'
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              color: '#fff',
              interval: 0,
              formatter: function (value) {
                return value.split("").join("\n");
              }
            }
          },
          yAxis: {
            axisLabel: {
              color: '#fff'
            }
          },
          dataZoom: [{
            y: '90%',
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter',
            minValueSpan: 2,
            textStyle: {
              color: '#fff'
            }
          }],
          dataset: {
            dimensions: ['name', '境外输入', '本地新增'],
            source: convertData(data)
          },
          series: [{
            type: 'bar',
            stack: '新增',
          }, {
            type: 'bar',
            stack: '新增'
          }]
        })
      },
      chart3Init(data) {
        const _echart3 = document.getElementById('chart3');
        const echart3 = this.$echarts.init(_echart3);
        window.addEventListener('resize', function () {
          echart3.resize();
        });

        function getData(data) {
          const res = [{
            name: '新增确诊(本国)',
            type: 'line',
            smooth: true,
            data: []
          }, {
            name: '新增确诊(输入)',
            type: 'line',
            smooth: true,
            data: []
          }, {
            name: '新增疑似',
            type: 'line',
            smooth: true,
            data: []
          }, {
            name: '新增治愈',
            type: 'line',
            smooth: true,
            data: []
          }, {
            name: '新增死亡',
            type: 'line',
            smooth: true,
            data: []
          }];
          const _data = data.data.chinaDayAddList.slice(-7);
          for (let i = 0; i < 7; i++) {
            res[0].data.push(Number(_data[i].confirm) - Number(_data[i].importedCase));
            res[1].data.push(_data[i].importedCase);
            res[2].data.push(_data[i].suspect);
            res[3].data.push(_data[i].heal);
            res[4].data.push(_data[i].dead);
          }
          return res;
        }

        function getDate(data) {
          const res = [];
          const _data = data.data.chinaDayAddList.slice(-7);
          for (let i = 0; i < 7; i++) {
            res.push(_data[i].date);
          }
          return res;
        }
        echart3.setOption({
          title: {
            text: '近七日国内变化趋势',
            left: 'center',
            textStyle: {
              color: '#fff',
              fontSize: '14',
              fontWeight: 'normal'
            }
          },
          grid: {
            top: '30%',
            bottom: '10%'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: ['新增确诊(本国)', '新增确诊(输入)', '新增疑似', '新增治愈', '新增死亡'],
            textStyle: {
              color: '#fff'
            },
            top: '10%'
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: getDate(data),
            axisLabel: {
              color: '#fff'
            }
          }],
          yAxis: [{
            type: 'value'
          }],
          series: getData(data),
          axisLabel: {
            color: '#fff'
          }
        });
      },
      chart5Init(data) {
        const geoCoordMap = {
          '新疆': [86.61, 40.79],
          '西藏': [89.13, 30.66],
          '黑龙江': [128.34, 47.05],
          '吉林': [126.32, 43.38],
          '辽宁': [123.42, 41.29],
          '内蒙古': [112.17, 42.81],
          '北京': [116.40, 40.40],
          '宁夏': [106.27, 36.76],
          '山西': [111.95, 37.65],
          '河北': [115.21, 38.44],
          '天津': [117.04, 39.52],
          '青海': [97.07, 35.62],
          '甘肃': [103.82, 36.05],
          '山东': [118.01, 36.37],
          '陕西': [108.94, 34.46],
          '河南': [113.46, 34.25],
          '安徽': [117.28, 31.86],
          '江苏': [120.26, 32.54],
          '上海': [121.46, 31.28],
          '四川': [103.36, 30.65],
          '湖北': [112.29, 30.98],
          '浙江': [120.15, 29.28],
          '重庆': [107.51, 29.63],
          '湖南': [112.08, 27.79],
          '江西': [115.89, 27.97],
          '贵州': [106.91, 26.67],
          '福建': [118.31, 26.07],
          '云南': [101.71, 24.84],
          '台湾': [121.01, 23.54],
          '广西': [108.67, 23.68],
          '广东': [113.98, 22.82],
          '海南': [110.03, 19.33],
          '澳门': [113.54, 22.19],
          '香港': [114.17, 22.32]
        }
        const _echart5 = document.getElementById('chart5');
        const echart5 = this.$echarts.init(_echart5);

        function convertData() {
          const res = [];
          const _data = data.data.areaTree[0].children;
          for (let i = 0; i < _data.length; i++) {
            let geoCoord = geoCoordMap[_data[i].name];
            if (geoCoord) {
              res.push({
                'name': _data[i].name,
                'value': [...geoCoord, _data[i].today.confirm]
              })
            }
          }
          return res;
        }

        function caclMax() {
          const confirmList = [];
          const _data = data.data.areaTree[0].children;
          for (let i = 0; i < _data.length; i++) {
            if (_data[i].today.confirm != 0)
              confirmList.push(_data[i].today.confirm);
          }
          confirmList.sort((a, b) => b - a);
          return Math.ceil(confirmList[0] / 7) * 7;
        }

        window.addEventListener('resize', function () {
          echart5.resize();
        });
        echart5.setOption({
          // backgroundColor: '#404a59',
          title: {
            text: '全国各省新增病例',
            left: 'center',
            textStyle: {
              color: '#fff'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              return '新增确诊<br/>' + params.data.name + ':' + params.data.value[2];
            },
            show: true
          },
          visualMap: {
            min: 0,
            max: caclMax(),
            splitNumber: 7,
            color: ['#d94e5d', '#eac736', '#50a3ba'],
            textStyle: {
              color: '#fff'
            }
          },
          geo: {
            map: 'china',
            label: {
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                areaColor: '#323c48',
                borderColor: '#111'
              },
              emphasis: {
                areaColor: '#2a333d'
              }
            }
          },
          series: [{
            name: '新增确诊',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(),
            symbolSize: function (val) {
              return Math.sqrt(val[2] * 20);
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              emphasis: {
                borderColor: '#fff',
                borderWidth: 1
              }
            },
          }]
        });
      }
    },
    mounted() {
      this.$axios
        .get('/qq_api/g2/getOnsInfo?name=disease_h5&callback=&_=' + Date.now(), {
          withCredentials: true
        })
        .then(response => {
          this.info = JSON.parse(JSON.stringify(response.data).toString().replace(new RegExp('\\\\"', 'gm'), '"')
            .replace(new RegExp('"{', 'gm'), '{').replace(new RegExp('}"', 'gm'), '}'));
          this.chart2Init(this.info);
          this.chart5Init(this.info);
        });
      this.$axios
        .get('/qq_api/g2/getOnsInfo?name=disease_other&callback=&_=' + Date.now(), {
          withCredentials: true
        })
        .then(response => {
          this.othInfo = JSON.parse(JSON.stringify(response.data).toString().replace(new RegExp('\\\\"', 'gm'), '"')
            .replace(new RegExp('"{', 'gm'), '{').replace(new RegExp('}"', 'gm'), '}'));
          this.chart1Init(this.othInfo);
          this.chart3Init(this.othInfo);
        });
    }
  }

</script>

<style lang="less" scoped>
  * {
    margin: 0;
    padding: 0;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
  }

  .main-box {
    display: flex;
    padding: .125rem .125rem;

    .panel {
      position: relative;
      height: 3.75rem;
      padding: .1875rem;
      margin-bottom: .125rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.03);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 10px;
        height: 10px;
        border-left: 2px solid #02a6b5;
        border-top: 2px solid #02a6b5;
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 10px;
        height: 10px;
        border-right: 2px solid #02a6b5;
        border-top: 2px solid #02a6b5;
      }

      .panel-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;

        &::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 10px;
          height: 10px;
          border-left: 2px solid #02a6b5;
          border-bottom: 2px solid #02a6b5;
        }

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 10px;
          height: 10px;
          border-right: 2px solid #02a6b5;
          border-bottom: 2px solid #02a6b5;
        }
      }

      h2 {
        height: .6rem;
        color: #fff;
        line-height: .6rem;
        text-align: center;
        font-size: .25rem;
        font-weight: 400;
      }
    }

    .chart {
      width: 100%;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .column {
      flex: 3;

      .panel:last-child {
        margin-bottom: 0;
      }
    }

    .column:nth-child(2) {
      margin: 0 .125rem;
      flex: 5;

      .panel:first-child {
        height: 2.625rem;
        color: #FFF;

        h1 {
          font-size: .5rem;
          font-weight: 400;
        }

        .main-row-box {
          display: flex;
          width: 100%;
          font-size: .25rem;
          margin: 5px;

          .main-row-box-item {
            flex: 1;
          }

          p {
            text-align: center;
          }
        }
      }

      .panel:last-child {
        height: 8.75rem;
      }
    }

    .column:nth-child(3) {
      flex: 4;

      .panel:first-child {
        .collapse-box {
          height: 100%;
          width: 100%;
        }
      }

      .panel:last-child {
        height: 7.625rem;

        .list-box {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

</style>
