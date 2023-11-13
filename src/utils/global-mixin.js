import utils from './index'

export default {
  methods: {
    toProductDetail(productId) {
      utils.toProductDetail(productId)
    },
    toDocDetail(orderNo) {
      utils.toDocDetail(orderNo)
    },
  },
}
