<script>
import baseForm from './base-form'
import columns from './design-column'
import utils from '../../utils'

export default {
  extends: baseForm,
  data() {
    return {
      pageType: 'design',
      columns,
      data: {
        content: '',
      },
    }
  },
  methods: {
    handleSubmitDesign(formData, toList) {
      formData.template_id = this.$route.params.id
      this.apiPut(
        'print:print_template_content',
        this.$route.params.id,
        formData,
      ).then((res) => {
        if (toList) {
          this.$router.push(this.service.path)
        }
      })
    },
    getData() {
      this.apiGet('print:print_template_content/list-only', {
        template_id: this.$route.params.id,
        column: 'content',
      }).then((res) => {
        if (!res.data[0]) {
          utils.errorNotFound()
          return
        }

        this.data.content = res.data[0].content
      })
    },
  },
  mounted() {
    this.getData()
  },
}
</script>
