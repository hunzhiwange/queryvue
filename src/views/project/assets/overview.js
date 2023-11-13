import { validateAlphaDash } from '@/utils/validate'
import search from '../../project-issue/search/index'
import projectTemplate from './template'
//see https://github.com/SortableJS/Vue.Draggable
import draggable from 'vuedraggable'
//import VeLine from 'v-charts/lib/line.common'
import board_header from './../board_header'

const jsondata =
  '{"date":["08-24","08-25","08-26","08-27","08-28","08-29","08-30","08-31","09-01","09-02"],"task":[66,60,60,61,61,0,0,54,0,55],"undoneTask":[37,14,16,17,6,0,0,9,0,10],"baseLineList":[37,32.9,28.799999999999997,24.699999999999996,20.599999999999994,16.499999999999993,12.399999999999993,8.299999999999994,4.199999999999994,0]}'
const overdata = JSON.parse(jsondata)

const resetForm = {
  name: '',
  num: '',
  status: 1,
  template: [],
}

const resetFormCommonUser = {
  selectUser: [],
}

const resetUserForm = {
  key: '',
  project_id: null,
  page: 1,
  page_size: 30,
}

const projectTypeIcon = {
  bug: {
    icon: 'ios-bug',
    color: 'red',
  },
  task: {
    icon: 'ios-list-box-outline',
    color: 'blue',
  },
  product: {
    icon: 'md-map',
    color: 'green',
  },
  story: {
    icon: 'md-mail-open',
    color: 'purple',
  },
  doc: {
    icon: 'ios-document-outline',
    color: 'red',
  },
  process: {
    icon: 'ios-document-outline',
    color: 'red',
  },
  mind: {
    icon: 'ios-document-outline',
    color: 'red',
  },
  swagger: {
    icon: 'ios-document-outline',
    color: 'red',
  },
  swagger_url: {
    icon: 'ios-document-outline',
    color: 'red',
  },
  mind_map: {
    icon: 'ios-document-outline',
    color: 'red',
  },
}

const resetFormUser = {}

export default {
  components: {
    search,
    draggable,
    // VeLine,
    board_header,
  },
  data() {
    return {
      projects: [],
      project: {
        id: 0,
        num: '',
        name: this.__('请选择项目'),
      },
      burnoutMap: {
        loading: true,
        chartData: {
          columns: ['日期', '实际剩余任务', '理想剩余任务'],
          rows: [],
        },
        series: [
          {
            type: 'line',
            name: '实际剩余任务',
            smooth: false,
            color: '#1890ff',
            data: [],
          },
          {
            type: 'line',
            name: '理想剩余任务',
            color: '#52C41A',
            smooth: false,
            lineStyle: {
              type: 'dashed',
            },
            data: [],
          },
        ],
        chartSettings: {},
        chartExtend: {
          grid: {
            left: '5',
            right: '20',
            top: '10',
            bottom: '0',
          },
          xAxis: {
            show: true,
            // boundaryGap: false,
            splitLine: {
              show: false,
            },
          },
          yAxis: {
            show: true,
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: ['#e4e4e4'],
              },
            },
          },
          tooltip: {
            backgroundColor: '#fff',
            textStyle: {
              color: '#333',
            },
            borderWidth: 1,
            borderColor: '#e8e8e8',
          },
          axisPointer: {
            lineStyle: {
              width: 0,
            },
          },
        },
      },
      chartData: {
        columns: ['日期', '任务'],
        rows: [],
      },
      chartSettings: {
        area: true,
        itemStyle: {
          color: '#1890ff',
        },
        areaStyle: {
          color: '#e6f7ff',
        },
      },
      chartExtend: {
        grid: {
          left: '-20',
          right: '0',
          top: '10',
          bottom: '0',
        },
        xAxis: {
          show: false,
        },
        yAxis: {
          show: false,
        },
        tooltip: {
          backgroundColor: '#fff',
          textStyle: {
            color: '#333',
          },
          borderWidth: 1,
          borderColor: '#e8e8e8',
        },
        axisPointer: {
          lineStyle: {
            width: 0,
          },
        },
      },
    }
  },
  methods: {
    getProjectReport() {
      let rows = []
      overdata.date.forEach((v) => {
        rows.push({ 日期: v })
      })
      this.burnoutMap.loading = false
      this.burnoutMap.chartData.rows = rows
      this.burnoutMap.series[0].data = overdata.undoneTask
      this.burnoutMap.series[1].data = overdata.baseLineList
    },
    init: function (num) {
      this.getProjectReport()
      this.apiGet('app:project/project/show', { num: num }).then((res) => {
        this.project = res
        document.title =
          '[' +
          this.project.num +
          ']' +
          this.project.name +
          ' - ' +
          document.title
      })
    },
  },
  mounted: function () {
    this.init(this.$route.params.num)
  },
  mixins: [],
}
