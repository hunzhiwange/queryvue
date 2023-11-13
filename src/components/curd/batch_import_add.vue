<template>
  <Menu mode="horizontal" theme="light" active-name="1">
    <Row>
      <Col span="12">
        <MenuItem
          v-for="(menuList, index) in menuLeft"
          :key="index"
          :name="index"
          :to="menuList.path"
        >
          <Icon :type="menuList.icon" />
          {{ menuList.title }}
        </MenuItem>
      </Col>
      <Col span="12">
        <div class="pull-right">
          <MenuItem name="99" v-if="currentStep == 0 || currentStep == 1">
            <Button
              type="text"
              :loading="actionLoading"
              @click="cancelled()"
              icon="md-close"
            >
              {{ __('取消') }}
            </Button>
          </MenuItem>
          <MenuItem name="6" v-if="currentStep == 0">
            <Button
              type="text"
              :loading="actionLoading"
              @click="next()"
              :disabled="file === null"
              icon="ios-fastforward"
            >
              {{ __('下一步') }}
            </Button>
          </MenuItem>
          <MenuItem name="7" v-if="currentStep == 1">
            <Button
              type="text"
              :loading="actionLoading"
              @click="upload()"
              icon="ios-rewind"
            >
              {{ __('确认导入') }}
            </Button>
          </MenuItem>

          <MenuItem name="6" v-if="currentStep == 2">
            <Button
              type="text"
              :loading="actionLoading"
              @click="backList()"
              icon="md-checkmark-circle"
            >
              {{ __('返回%s列表', doc.title) }}
            </Button>
          </MenuItem>

          <MenuItem name="6" v-if="currentStep == 3">
            <Button
              type="text"
              :loading="actionLoading"
              @click="backList()"
              icon="md-checkmark-circle"
            >
              {{ __('返回%s列表', doc.title) }}
            </Button>
          </MenuItem>

          <MenuItem name="6" v-if="currentStep == 3 || currentStep == 2">
            <Button
              type="text"
              :loading="actionLoading"
              @click="continueUpload()"
              :disabled="currentStep == 2"
              icon="md-cloud-upload"
            >
              {{ __('继续上传') }}
            </Button>
          </MenuItem>
        </div>
      </Col>
    </Row>
  </Menu>

  <Card :dis-hover="true" :shadow="false" class="m-t-15">
    <template #title>{{ __('批量导入%s', doc.title) }}</template>
    <div style="text-align: center">
      <Steps :current="currentStep">
        <Step :title="__('上传文件')" :content="__('上传CSV文件')"></Step>
        <Step :title="__('导入预览')" :content="__('预览结果')"></Step>
        <Step :title="__('导入完成')" :content="__('确认导入')"></Step>
        <Step :title="__('查看结果')" :content="__('获取结果')"></Step>
      </Steps>
      <template v-if="currentStep == 0">
        <div
          class="bg-gray-100 px-6 py-3 text-gray-400 text-center font-extrabold rounded-full mt-5 dark:bg-gray-headerbg"
        >
          {{ __('下载') }}
          <a>《{{ __('批量新增%s模板', doc.title) }}》</a>
          ,{{ __('录入更新数据后上传') }}
        </div>

        <Upload :before-upload="handleUpload" class="m-t-15" type="drag">
          <div style="padding: 20px 0">
            <Icon
              type="ios-cloud-upload"
              size="52"
              style="color: #3399ff"
            ></Icon>
            <p>{{ __('点击上传%s数据文件', doc.title) }}</p>
          </div>
        </Upload>
      </template>
    </div>
  </Card>

  <template v-if="currentStep == 1">
    <Card shadow :bordered="false" class="m-t-15" ref="importPreview">
      <template #title>
        <strong>{{ __('导入预览') }}</strong>
      </template>
      <Alert type="warning" v-if="loadingStatus">
        <space>
          <Spin size="large" />
          《{{ this.file.name }}》 {{ __('上传中') }}...
        </space>
      </Alert>

      <i-table
        :loading="loadingImportTable"
        ref="table"
        :columns="importColumns"
        :data="importData"
      ></i-table>
    </Card>
  </template>

  <template v-if="currentStep == 2">
    <Card shadow :bordered="false" class="m-t-15">
      <template #title>
        <strong>{{ __('任务进度') }}</strong>
      </template>

      <Result type="warning" title="导入处理中...">
        <template #desc>
          {{ __('您的导入任务已收到，系统正在处理中。') }}
        </template>
      </Result>

      <Progress
        :percent="currentPercent"
        :stroke-width="20"
        status="active"
        text-inside
      />

      <Alert type="success" show-icon class="m-t-20">
        {{ __('温馨提示：') }}
        <template #icon>
          <Icon type="ios-bulb-outline"></Icon>
        </template>
        <template #desc>
          <p>
            1、{{
              __(
                '如果导入时间过长，您可以点击右上角“返回%s列表”隐藏此页面进行其他操作；',
                doc.title,
              )
            }}
          </p>
          <p>2、{{ __('导入成功后您可在系统右上角“任务”查看导入结果。') }}</p>
        </template>
      </Alert>
    </Card>
  </template>

  <template v-if="currentStep == 3">
    <Card shadow :bordered="false" class="m-t-15">
      <template #title>
        <strong>{{ __('任务结果') }}</strong>
      </template>

      <Result type="success" :title="__('导入成功')" v-if="job.process == 1">
        <template #desc>
          {{ __('共导入 %d 条数据，导入成功 %d 条。', job.total, job.success) }}
        </template>
        <template #actions>
          <Button type="primary" @click="backList">
            {{ __('返回%s列表', doc.title) }}
          </Button>
        </template>
      </Result>

      <Result type="error" :title="__('导入失败')" v-if="job.process == 2">
        <template #desc>
          {{
            __(
              '共导入 %d 条数据，导入成功 %d 条，导入失败 %d 条。',
              job.total,
              job.success,
              job.fail,
            )
          }}
        </template>
        <template #extra>
          <div>{{ __('您导入的数据存在错误：') }}</div>
          <div>
            <Icon type="ios-close-circle-outline" color="#ed4014" />
            {{ __('请下载错误数据，修改后重新导入。') }}
            <a class="ivu-ml-16">
              {{ __('立即下载') }}
              <Icon type="ios-arrow-forward" />
            </a>
          </div>
        </template>
        <template #actions>
          <Button type="primary" @click="continueUpload">
            {{ __('返回重新导入') }}
          </Button>
        </template>
      </Result>
    </Card>
  </template>
</template>
<script>
import Papa from 'papaparse'

export default {
  props: {
    menuLeft: {
      type: Array,
      default: [],
    },
    doc: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      file: null,
      loadingStatus: false,
      headers: [],
      rows: [],
      loadingImportTable: false,
      importColumns: [],
      importData: [],
      currentStep: 0,
      actionLoading: false,
      currentPercent: 0,
      intervalId: null,
      job: {},
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalId) // 在组件销毁之前清除定时器
  },
  methods: {
    cancelled() {
      this.$router.push({ path: this.doc.cancelled_path })
    },
    next() {
      this.$router.push({ path: this.doc.next_path })
    },
    continueUpload() {
      this.currentStep = 0
    },
    backList() {
      this.$router.push({ path: this.doc.back_list_path })
    },
    handleUpload(file) {
      this.file = file
      this.currentStep = 1
      this.loadingImportTable = true
      this.onFileInputChange(file)
      return false
    },
    upload() {
      this.loadingStatus = true
      this.apiPost('apiQL/job', {
        name: this.file.name,
        'relations[job_content][content]': JSON.stringify(this.importData),
        type: this.doc.job_type,
        total: this.importData.length - 2,
      }).then((res) => {
        this.file = null
        this.loadingStatus = false
        this.currentStep = 2

        this.intervalId = setInterval(() => {
          this.fetchJob(res.id)
        }, 2000) // 每2秒钟请求一次数据

        this.apiPatch('apiQL/job', res.id, 'progress').then(
          (jobRes) => {
            this.fetchJob(res.id)
          },
          () => {},
        )
      })
    },
    fetchJob(jobId) {
      this.apiGet('apiQL/job/list-only', {
        id: jobId,
        column: 'success,fail,total,process',
      }).then((jobRes) => {
        const job = jobRes.data[0]
        this.job = job
        this.currentPercent = parseInt(
          ((job.success + job.fail) * 100) / job.total,
        )
        if (job.process != 0) {
          clearInterval(this.intervalId)
          setTimeout(() => {
            this.currentStep = 3
          }, 1000)
          setTimeout(() => {
            this.currentPercent = 0
          }, 2000)
        }
      })
    },
    onFileInputChange(file) {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          const fieldLength = result.meta.fields.length
          const maxWidth = this.$refs.importPreview.$el.clientWidth
          let fieldWidth = 200
          if (fieldLength * fieldWidth < maxWidth) {
            fieldWidth = 0
          }

          this.importColumns = result.meta.fields.map((field) => ({
            title: field,
            key: field,
            width: fieldWidth,
          }))
          const importData = []
          result.data.forEach((item) => {
            if (Object.keys(item).length == fieldLength) {
              importData.push(item)
            }
          })

          this.importData = importData
          this.loadingImportTable = false
        },
      })
    },
  },
}
</script>
