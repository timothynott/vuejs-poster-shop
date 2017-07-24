var PRICE = 9.99
var LOAD_NUM = 10
new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    results: [],
    cart: [],
    newSearch: 'tigers',
    lastSearch: '',
    loading: false,
    price: PRICE
  },
  computed: {
    noMoreItems: function () {
      return this.items.length === this.results.length && this.results.length > 0
    }
  },
  filters: {
    currency: function (price) {
      return '$' + price.toFixed(2)
    }
  },
  mounted: function () {
    var self = this
    // do default search
    self.onSubmit()
    // set up scroll watcher
    var elem = document.getElementById('product-list-bottom')
    var watcher = scrollMonitor.create(elem)
    watcher.enterViewport(function () {
      self.appendItems()
    })
  },
  methods: {
    appendItems: function () {
      console.log('append items');
      if (this.items.length < this.results.length) {
        var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM)
        this.items = this.items.concat(append)
      }
    },
    inc: function (item) {
      item.qty++
      this.total += PRICE
    },
    dec: function (item) {
      item.qty--
      this.total -= PRICE
      if (item.qty <= 0) {
        for (var i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1)
            break
          }
        }
      }
    },
    addItem: function (index) {
      var item = this.items[index];
      var found = false;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          this.cart[i].qty++
          found = true
          break
        }
      }
      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: PRICE
        })
      }
      this.total += PRICE
    },
    onSubmit: function () {
      this.items = this.results = []
      this.lastSearch = this.newSearch
      if (this.newSearch.length) {
        this.loading = true
        this.$http
          .get('/search/'.concat(this.newSearch))
          .then(function (res) {
            this.lastSearch = this.newSearch
            this.results = res.data
            this.items = res.data.slice(0, LOAD_NUM)
            this.loading = false
          })
      }
    }
  }
})
