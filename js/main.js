const app = Vue.createApp({
  data: () => ({
    items: null, // APIから取得した検索結果
    keyword: '', // ユーザーが入力した検索キーワード
    message: ''  // ユーザーに表示するメッセージ
  }),
  watch: {
    keyword: function(newKeyword, oldKeyword) {
      this.message = 'Typing now...'
      this.deboucedGetAnswer()
    }
  },
  // ビューインスタンスがマウントされた後に呼ばれる
  mounted: function() {
    // 指定時間内に同じイベントが発生すると処理が発生しない
    // ユーティリティライブラリのlodashのdebounce関数
    this.deboucedGetAnswer = _.debounce(this.getAnswer, 1000);
  },
  methods: {
    getAnswer: function() {
      //
      if (this.keyword === "") {
        this.items = null;
        return;
      }
      this.message = "Loading...";
      const vm = this;
      // page: 検索ページ何ページ目か、
      // per_page: 1ページあたりの件数
      // query: 検索クエリ(https://help.qiita.com/ja/articles/qiita-search-options)
      const params = { page: 1, per_page: 20, query: this.keyword };
      // axiosを使ってAPIを叩く (axiosのルールに則った記述)
      axios
        .get("https://qiita.com/api/v2/items", { params })
        // then method:APIからデータが帰ってくると呼ばれる、取得した値はresponse
        .then(function (response) {
          console.log(response);
          vm.items = response.data;
        })
        // エラー処置
        .catch(function (error) {
          vm.message = "Errror" + error;
        })
        // 最後に行う処理
        .finally(function () {
          vm.message = "";
        });
    }
  }
});
app.mount("#app");
