<script>
import { Upload } from 'view-ui-plus'

export default {
  extends: Upload,
  methods: {
    post(file) {
      // check format
      if (this.format.length) {
        const _file_format = file.name.split('.').pop().toLocaleLowerCase()
        const checked = this.format.some(
          (item) => item.toLocaleLowerCase() === _file_format,
        )
        if (!checked) {
          this.onFormatError(file, this.fileList)
          return false
        }
      }

      // check maxSize
      if (this.maxSize) {
        if (file.size > this.maxSize * 1024) {
          this.onExceededSize(file, this.fileList)
          return false
        }
      }

      this.handleStart(file)

      this.$emit('upload', {
        headers: this.headers,
        withCredentials: this.withCredentials,
        file,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: (e) => {
          this.handleProgress(e, file)
        },
        onSuccess: (res) => {
          this.handleSuccess(res, file)
        },
        onError: (err, response) => {
          this.handleError(err, response, file)
        },
      })
    },
  },
}
</script>
