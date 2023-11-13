export default {
  methods: {
    init: function (num, id) {
      this.apiGet('app:project/project-issue/show', {
        num: num + '-' + id,
      }).then((res) => {
        switch (res.project_type_id) {
          case 6:
            this.$router.replace('/content/'+num+'-'+id+'/edit-process')
            break;
          case 10:
              this.$router.replace('/content/'+num+'-'+id+'/edit-mind-map')
              break;
          default:
            this.$router.replace('/content/'+num+'-'+id+'/edit-content')
            break;
        }
      })
    },
  },
  created: function () {
    this.init(this.$route.params.num, this.$route.params.id)
  },
}
