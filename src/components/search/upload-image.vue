<template>
  <div>
    <Text type="secondary">
      {{
        (isMultiple ? __('附件最多%d个，', option.maxNumber) : '') +
        __(
          '附件最大为%sM，支持格式：%s',
          divideNumber(this.option.maxSize, 1024),
          option.format.join(','),
        )
      }}
    </Text>
  </div>

  <Space wrap :style="uploadList.length > 1 ? 'margin-right: 8px;' : ''">
    <draggable
      v-model="uploadList"
      tag="transition-group"
      :component-data="{ name: 'fade' }"
      @update="updateListData"
    >
      <template #item="{ element, index }">
        <div class="i-curd-upload-list-item">
          <template v-if="element.status === 'finished'">
            <Image
              :src="element.file_url"
              fit="contain"
              :width="option.size"
              :height="option.size"
            >
              <template #error>
                <Icon type="md-images" :size="option.size" color="#e5e6eb" />
              </template>
            </Image>
            <div class="i-curd-upload-list-item-cover">
              <Tooltip
                placement="bottom-start"
                theme="light"
                :transfer="true"
                :disabled="!element.file_url"
                :max-width="500"
              >
                <template #content>
                  <Image :src="element.file_url" fit="contain" />
                </template>
                <Icon type="ios-eye-outline"></Icon>
              </Tooltip>
              <Icon
                type="ios-trash-outline"
                @click="handleRemove(element)"
                v-if="!displayOnly"
              ></Icon>
            </div>
          </template>
          <template v-else>
            <Progress
              v-if="element.showProgress"
              :percent="element.percentage"
              hide-info
            ></Progress>
          </template>
        </div>
      </template>
    </draggable>
  </Space>

  <BaseUpload
    v-if="!displayOnly"
    ref="upload"
    :show-upload-list="false"
    :format="option.format"
    :accept="option.accept"
    :max-size="option.maxSize"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-format-error="handleFormatError"
    :on-exceeded-size="handleMaxSize"
    :before-upload="handleBeforeUpload"
    @upload="upload"
    type="drag"
    :multiple="isMultiple"
    :style="`display: inline-block; width: ${option.size}px; height: ${option.size}px;`"
  >
    <div
      :style="`width: ${option.size}px; height: ${
        option.size - 2
      }px; line-height: ${option.size}px`"
    >
      <Icon type="ios-camera" :size="option.size" color="#e5e6eb" />
    </div>
  </BaseUpload>
</template>

<script>
import { divide } from 'lodash'
import draggable from 'vuedraggable'
import utils from '@/utils'
import BaseUpload from '@/components/upload'

export default {
  name: 'UploadImage',
  components: {
    BaseUpload,
    draggable,
  },
  props: {
    currentField: {
      type: String,
    },
    currentValue: null,
    currentAllValue: {},
    placeholder: {
      type: String,
      default: __('请选择项目'),
    },
    displayOnly: {
      type: Boolean,
      default: false,
    },
    isMultiple: {
      type: Boolean,
      default: true,
    },
    apiSource: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      file: null,
      fileUrl: null,
      option: {
        namespace: null,
        category: '',
        format: ['jpg', 'jpeg', 'png'],
        accept: 'image/*',
        maxSize: 2048,
        virtualColumn: '',
        size: 60,
        maxNumber: 10,
      },
      initSearch: false,
      uploadList: [],
    }
  },
  methods: {
    divideNumber(dividendm, divisor) {
      return divide(dividendm, divisor)
    },
    updateListData() {
      const data = []
      this.uploadList.forEach((item) => {
        data.push(item.file)
      })
      this.updateData(data.join(','))
    },
    handleRemove(file) {
      const { fileList } = this.$refs.upload
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      utils.once(() => {
        this.updateListData()
      }, 300)
    },
    handleSuccess(res, file) {
      file.file_url = res.file_url
      file.file = res.file
      utils.once(() => {
        this.updateListData()
      }, 300)
    },
    handleError(error, file, fileList) {},
    handleFormatError(file) {
      utils.warning(
        __(
          '文件 %s 格式不正确，只允许 %s.',
          file.name,
          this.option.format.join(','),
        ),
      )
    },
    handleMaxSize(file) {
      utils.warning(
        __(
          '文件 %s 大小超过限制，不能超过 %sM.',
          file.name,
          divide(this.option.maxSize, 1024),
        ),
      )
    },
    handleBeforeUpload(file) {
      this.file = file

      const check = this.uploadList.length < this.option.maxNumber
      if (!check) {
        utils.warning(
          __(
            '文件 %s 数量超过限制，不能超过 %d 个.',
            file.name,
            this.option.maxNumber,
          ),
        )
      }

      if (!this.isMultiple) {
        this.uploadList.shift()
      }

      return check
    },
    upload(params) {
      const uuid = utils.uuid(this.option.namespace)
      const companyId = '100100'
      const name = `${
        (this.option.category ? `${this.option.category}/` : '') + companyId
      }/${uuid}`
      const formData = new FormData()
      formData.append('file', this.file)
      formData.append('name', name)

      this.apiPost(
        'app:attachment/attachment/upload',
        formData,
        {},
        {
          'Content-Type': 'multipart/form-data',
        },
        {
          onUploadProgress(progressEvent) {
            params.onProgress(progressEvent)
          },
        },
      ).then(
        (res) => {
          params.onSuccess(res)
        },
        (errorRes) => {
          params.onError(errorRes, errorRes.response)
        },
      )
    },
    updateData(res) {
      this.initSearch = true
      this.$emit('updateData', res, this.currentField)
    },
    prepareValueSelected() {
      const { currentValue } = this

      if (!this.initSearch && currentValue !== undefined) {
        this.initSearch = true

        if (currentValue) {
          // 虚拟字段才是真正的原始图片地址
          let files = []
          if (
            this.option.virtualColumn
            && Object.prototype.hasOwnProperty.call(
              this.currentAllValue,
              this.option.virtualColumn,
            )
          ) {
            files = this.currentAllValue[this.option.virtualColumn]
            files = files.split(',')
          }

          currentValue.split(',').forEach((item, index) => {
            this.uploadList.push({
              file_url: item,
              file: files[index],
              status: 'finished',
            })
          })
        }

        this.updateListData()
      }

      return currentValue
    },
  },
  watch: {
    currentValue() {
      this.prepareValueSelected()
    },
  },
  beforeMount() {
    Object.assign(this.option, this.apiSource)
  },
  mounted() {
    this.prepareValueSelected()
    if (!this.displayOnly) {
      this.uploadList = this.$refs.upload.fileList
    }
  },
}
</script>

<style scoped>
.i-curd-upload-list-item {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
  margin-right: 4px;
}

.i-curd-upload-list-item img {
  width: 100%;
}
.i-curd-upload-list-item-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
}
.i-curd-upload-list-item:hover .i-curd-upload-list-item-cover {
  display: block;
}
.i-curd-upload-list-item .ivu-tooltip {
  width: auto !important;
}
.i-curd-upload-list-item-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
