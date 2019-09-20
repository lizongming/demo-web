export default {
  install: function (Vue) {
    Vue.mixin({
      data() {
        return {
          page: {
            pageNo: 1,
            limit: 10,
            sizes: [10, 50, 100],
            total: 100,
            sortName: '',
            sortOrder: '',
          }
        };
      }
  }
}
