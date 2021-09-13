<template>
  <!-- <router-view /> -->
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <h1 class="py-4 text-center primary white--text">Página principal</h1>

        <table-component
          :dataColumns="dataColumnsCharacter"
          :headers="headersCharacters"
          :loading="loadingCharacters"
          :pageCount="numberOfPagesCharacters"
          :page="pageCharacters"
          :tableName="'PERSONAJES'"
          v-on:updateCurrentPage="updateCurrentPageCharacters"
          v-on:hideColumn="hideColumnCharacter($event)"
          v-on:showColumns="showColumnsCharacter"
          :isHideColumn="isHideColumnCharacters"
          :id="'tablaCharacters'"
          :hideFooter="false"
        />
      </v-col>
    </v-row>
  </v-container>
  <!-- {{ movies }}
      {{ quotes }} -->
  <!-- {{ characters }} -->
</template>

<script>
import TableComponent from "../components/TableComponent.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  components: { TableComponent },
  name: "TableDisplay",
  data: function () {
    return {
      dataColumnsCharacter: [],
      originalHeaderCharacters: [],
      headersCharacters: [],
      loadingCharacters: false,
      optionsCharacters: {},
      pageCharacters: 1,
      totalRowsCharacters: 0,
      numberOfPagesCharacters: 0,
      itemsPerPageCharacters: 10,
      isHideColumnCharacters: false,
    };
  },
  async created() {
    // this.processMovies({
    //   listName: "movies",
    //   list: ["a", "b"],
    // });
    await this.init();
  },
  computed: {
    ...mapGetters([
      "movies",
      "quotes",
      "characters",
      "totalCharacters",
      "totalCharacterPages",
      "totalQuotesPages",
      "totalQuotes",
    ]),
  },
  methods: {
    update(number) {
      this.pageCharacters = number;
    },
    ...mapActions(["getDataAndSet", "getTotalQuotes", "getData"]),
    async init() {
      await this.getDataApi("character", "");
      await this.getDataApi("quote", "");
      await this.getDataApi("movie", "");
      this.setHeaderCharacter();
    },
    setHeaderCharacter() {
      let obj = [];
      Object.entries(this.characters.list[0]).forEach(([key]) => {
        obj.push({ text: key, sortable: false, value: key });
      });
      this.headersCharacters = obj;
      this.originalHeaderCharacters = obj;
    },

    async getDataApi(endPoint, paramEndPoint) {
      if (endPoint == "character") {
        this.loadingCharacters = true;
        await this.getDataAndSet({
          url: endPoint + paramEndPoint,
          name: endPoint + "s",
        });
        this.loadingCharacters = false;

        this.numberOfPagesCharacters = this.totalCharacterPages;
        let column = this.getDataColumnCharacter();
        this.dataColumnsCharacter = column;
      }
    },

    async updateCurrentPageCharacters(event) {
      this.loadingCharacters = true;
      this.dataColumnsCharacter = [];
      this.pageCharacters = event;
      await this.getDataApi(
        "character",
        "?offset=" + this.pageCharacters + "&limit=10"
      );
      this.loadingCharacters = false;
    },

    hideColumnCharacter(event) {
      this.isHideColumnCharacters = true;
      this.headersCharacters = this.headersCharacters.filter((row) => {
        return row.value !== event;
      });
      this.isHideColumnCharacters = true;
    },

    showColumnsCharacter() {
      this.isHideColumnCharacters = false;
      this.headersCharacters = this.originalHeaderCharacters;
    },

    getDataColumnCharacter() {
      let column = [];
      this.characters.list.map((character) => {
        column.push(character);
      });
      return column;
    },
  },
};
</script>

