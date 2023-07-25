const app = Vue.createApp({
  data: () => ({
    items: [], // APIから取得した検索結果
    keyword: "", // ユーザーが入力した検索キーワード
    message: "", // ユーザーに表示するメッセージ
    PopularClass: {
      "text-red": true,
      "bg-yellow": true,
    },
    styleObject: {
      color: 'blue',
      fontSize: '24px'
    }
  }),
  watch: {
    keyword: function (newKeyword, oldKeyword) {
      this.message = "Typing now...";
      this.deboucedGetAnswer();
    },
  },
  // ビューインスタンスがマウントされた後に呼ばれる
  mounted: function () {
    // 指定時間内に同じイベントが発生すると処理が発生しない
    // ユーティリティライブラリのlodashのdebounce関数
    this.deboucedGetAnswer = _.debounce(this.getAnswer, 1000);
  },
  computed: {
    // いいね数順にソートされた配列を提供する算出プロパティ
    sortedItems: function () {
      // sliceで元の配列をコピー
      // sortメソッド:アロー関数を使用して定義
      // 比較関数が正の値の時はbはaの前に来る
      return this.items.slice().sort((a, b) => b.likes_count - a.likes_count);
    },
  },
  methods: {
    getAnswer: function () {
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
      const params = { page: 1, per_page: 30, query: this.keyword };
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
    },
  },
});
app.mount("#app");
