export default {
  name: 'breadcrumbNav',
  props: {
    currentPath: Array,
  },
  methods: {
    itemTitle(item) {
      return item.meta ? __(item.meta.title) : ''
    },
    itemIcon(item) {
      return item.icon
    },
  },
}
