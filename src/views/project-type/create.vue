<script>
import baseForm from './base-form'
import columns from './create-column'

export default {
  extends: baseForm,
  data() {
    return {
      columns,
      data: {
        status: 1,
      },
    }
  },
  methods: {
    handleSubmitCreateBefore(formData) {
      formData.type = 1
    },
  },
}
</script>
