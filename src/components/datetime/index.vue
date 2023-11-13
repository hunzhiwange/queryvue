<template>
  <DatePicker
    :model-value="[createAtMin, createAtMax]"
    @on-change="updateCreateAt"
    clearable
    :type="type"
    :options="options"
    placement="bottom-end"
    :placeholder="placeholder"
    style="width: 100%"
    :transfer="true"
  />
</template>

<script>
import moment from 'moment'

export default {
  name: 'Datetime',
  props: {
    type: {
      type: String,
      default: 'datetimerange',
    },
    placeholder: {
      type: String,
    },
    createAtMin: {
      type: String,
    },
    createAtMax: {
      type: String,
    },
    currentField: {
      type: String,
    },
  },
  data() {
    return {
      options: {
        shortcuts: [
          {
            text: '今天',
            value() {
              const start = moment().startOf('day').toDate()
              const end = moment().endOf('day').toDate()
              return [start, end]
            },
          },
          {
            text: '昨天',
            value() {
              const start = moment().subtract(1, 'days').startOf('day').toDate()
              const end = moment().subtract(1, 'days').endOf('day').toDate()
              return [start, end]
            },
          },
          {
            text: '本周',
            value() {
              const start = moment().startOf('weeks').add(1, 'days').toDate()
              const end = moment().endOf('weeks').add(1, 'days').toDate()

              return [start, end]
            },
          },
          {
            text: '本月',
            value() {
              const start = moment().startOf('month').toDate()
              const end = moment().endOf('month').toDate()

              return [start, end]
            },
          },
          {
            text: '上月',
            value() {
              const start = moment()
                .startOf('month')
                .subtract(1, 'month')
                .toDate()
              const end = moment().endOf('month').subtract(1, 'month').toDate()

              return [start, end]
            },
          },
          {
            text: '本季',
            value() {
              const start = moment().startOf('quarters').toDate()
              const end = moment().endOf('quarters').toDate()
              return [start, end]
            },
          },
          {
            text: '上季',
            value() {
              const start = moment()
                .startOf('quarters')
                .subtract(1, 'quarters')
                .toDate()
              const end = moment()
                .endOf('quarters')
                .subtract(1, 'quarters')
                .toDate()
              return [start, end]
            },
          },
          {
            text: '本年',
            value() {
              const start = moment().startOf('year').toDate()
              const end = moment().endOf('year').toDate()
              return [start, end]
            },
          },
          {
            text: '近一周',
            value() {
              const start = moment().subtract(1, 'week').startOf('day').toDate()
              const end = moment().endOf('day').toDate()
              return [start, end]
            },
          },
          {
            text: '近一月',
            value() {
              const start = moment()
                .subtract(1, 'month')
                .startOf('day')
                .toDate()
              const end = moment().endOf('day').toDate()
              return [start, end]
            },
          },
          {
            text: '近三月',
            value() {
              const start = moment()
                .subtract(3, 'month')
                .startOf('day')
                .toDate()
              const end = moment().endOf('day').toDate()
              return [start, end]
            },
          },
          {
            text: '近半年',
            value() {
              const start = moment()
                .subtract(0.5, 'year')
                .startOf('day')
                .toDate()
              const end = moment().endOf('day').toDate()
              return [start, end]
            },
          },
          {
            text: '近一年',
            value() {
              const start = moment().subtract(1, 'year').startOf('day').toDate()
              const end = moment().endOf('day').toDate()
              return [start, end]
            },
          },
        ],
      },
    }
  },
  methods: {
    updateCreateAt(res) {
      this.$emit('updateCreateAt', res, this.currentField)
    },
  },
}
</script>
