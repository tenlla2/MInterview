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
          :activeFilterCharacter="true"
          v-on:updateFilterRace="updateFilterRace"
          v-on:updateFilterGender="updateFilterGender"
          v-on:resetFilters="resetFiltersCharacters"
          v-on:clickRow="clickRow"
          :listRace="listRace"
          :raceFilter="raceFilterStr"
          :listGender="listGender"
          :genderFilter="genderFilterStr"
          :pagination="true"
        />
      </v-col>
      <v-col cols="12">
        <table-component
          :dataColumns="dataColumnsQuote"
          :headers="headersQuotes"
          :loading="loadingQuotes"
          :pageCount="numberOfPagesQuotes"
          :tableName="'FRASES'"
          :page="pageQuotes"
          v-on:updateCurrentPage="updateCurrentPageQuotes"
          v-on:hideColumn="hideColumnQuotes($event)"
          v-on:showColumns="showColumnsQuote"
          :isHideColumn="isHideColumnQuotes"
          :id="'tableQuotes'"
          :activeFilterQuote="true"
          v-on:updateFilterMovie="updateFilterMovie"
          :movieFilter="movieFilterStr"
          :listMovies="listMovies"
          :pagination="pagination"
          v-on:resetFilterMovie="resetFilterMovie"
          :actions="true"
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
      dataColumnsQuote: [],
      headersQuotes: [],
      originalHeaderQuotes: [],
      loadingQuotes: false,
      optionsQuotes: {},
      pageQuotes: 1,
      totalRowsQuotes: 0,
      numberOfPagesQuotes: 0,
      itemsPerPageQuotes: 10,
      isHideColumnCharacters: false,
      isHideColumnQuotes: false,
      raceFilterStr: null,
      listRace: [],
      listGender: [],
      listMovies: [],
      movieFilterStr: null,
      genderFilterStr: null,
      selectedRow: null,
      idMovie: null,
      axuDataColumnQuote: [],
      pagination: true,
      preload: [],
      isPreload: false,
      preloadPageNumber: 1,
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
    filteredByRaceAndGender() {
      return this.characters.list.filter((i) => {
        if (this.raceFilterStr == null && this.genderFilterStr) {
          if (this.genderFilterStr == "Todos") {
            return i;
          } else {
            if (i.gender == this.genderFilterStr) {
              return i;
            }
          }
        } else if (this.raceFilterStr != null && this.genderFilterStr == null) {
          if (this.raceFilterStr.includes(i.race)) {
            return i;
          }
        } else if (this.raceFilterStr != null && this.genderFilterStr != null) {
          if (this.genderFilterStr == "Todos") {
            if (this.raceFilterStr.includes(i.race)) {
              return i;
            }
          } else {
            if (
              this.raceFilterStr.includes(i.race) &&
              i.gender == this.genderFilterStr
            ) {
              return i;
            }
          }
        }
      });
    },
    filterQuoteCharacter() {
      return this.totalQuotes.filter((quote) => {
        if (quote.character == this.selectedRow._id) {
          return quote;
        }
      });
    },
    filterByFilm() {
      return this.axuDataColumnQuote.filter((row) => {
        if (this.movieFilterStr == "Todos") {
          return row;
        } else {
          if (row.movie == this.idMovie) {
            return row;
          }
        }
      });
    },
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
      this.getListRace();
      this.getListGender();

      this.setHeaderQuotes();
      this.getTotalQuotes();
      this.getListMovies();
    },
    setHeaderCharacter() {
      let obj = [];
      Object.entries(this.characters.list[0]).forEach(([key]) => {
        obj.push({ text: key, sortable: false, value: key });
      });
      this.headersCharacters = obj;
      this.originalHeaderCharacters = obj;
    },

    async getListRace() {
      var aux = ["Todos"];
      await this.characters.list.map((map) => {
        if (!aux.includes(map.race)) {
          aux.push(map.race);
        }
      });
      this.listRace = aux;
    },
    async getListGender() {
      var aux = ["Todos"];
      await this.characters.list.map((map) => {
        if (!aux.includes(map.gender) && map.gender != null) {
          aux.push(map.gender);
        }
      });
      this.listGender = aux;
    },
    async getListMovies() {
      var aux = ["Todos"];
      await this.movies.list.map((map) => {
        if (!aux.includes(map.name) && map.name != null) {
          aux.push(map.name);
        }
      });
      this.listMovies = aux;
    },
    setHeaderQuotes() {
      let obj = [];
      Object.entries(this.quotes.list[0]).forEach(([key]) => {
        if (key == "dialog") {
          obj.push({ text: key, sortable: true, value: key });
        } else {
          obj.push({ text: key, sortable: false, value: key });
        }
      });
      obj.push({ text: "Acciones", value: "actions", sortable: false });
      this.headersQuotes = obj;
      this.originalHeaderQuotes = obj;
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
      } else if (endPoint == "quote") {
        this.loadingQuotes = true;
        await this.getDataAndSet({
          url: endPoint + paramEndPoint,
          name: endPoint + "s",
        });
        this.loadingQuotes = false;
        this.numberOfPagesQuotes = this.totalQuotesPages;
        let column = this.getDataColumnQuote();
        this.dataColumnsQuote = column;
        this.axuDataColumnQuote = column;
        await this.preloadPage();
      } else {
        await this.getDataAndSet({
          url: endPoint + paramEndPoint,
          name: endPoint + "s",
        });
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
      this.listRace = [];
      this.getListRace();
      this.raceFilterStr = null;
      this.genderFilterStr = null;
    },
    async updateCurrentPageQuotes(event) {
      this.pageQuotes = event;
      if (this.pageQuotes == this.preloadPageNumber) {
        this.dataColumnsQuote = this.preload;
        await this.preloadPage();
      } else if (this.pageQuotes < this.preloadPageNumber || this.pageQuotes > this.preloadPageNumber) {
        this.loadingQuotes = true;
        this.dataColumnsQuote = [];
        await this.getDataApi("quote", "?page=" + this.pageQuotes);
        this.loadingQuotes = false;
        this.movieFilterStr = null;
      }
    },
    updateFilterRace(event) {
      if (event.length > 0) {
        if (event.includes("Todos")) {
          this.raceFilterStr = event;
          this.dataColumnsCharacter = this.getDataColumnCharacter();
        } else {
          this.raceFilterStr = event;
          this.dataColumnsCharacter = this.filteredByRaceAndGender;
        }
      } else {
        this.raceFilterStr = event;
        this.dataColumnsCharacter = this.getDataColumnCharacter();
      }
    },
    async preloadPage() {
      if (this.pageQuotes < this.numberOfPagesQuotes) {
        var response = await this.getData({
          url: "quote?page=" + (parseInt(this.pageQuotes) + 1),
        });
        this.preload = response.data.docs;
        this.isPreload = true;
        this.preloadPageNumber = response.data.page;
      }

      // this.preload =
    },
    updateFilterGender(event) {
      this.genderFilterStr = event;
      this.dataColumnsCharacter = this.filteredByRaceAndGender;
    },
    updateFilterMovie(event) {
      if (event == "Todos") {
        this.movieFilterStr = event;
      } else {
        let idMovie = this.movies.list.filter((row) => {
          if (row.name == event) {
            return row;
          }
        });
        this.pagination = false;
        this.idMovie = idMovie[0]._id;
        this.movieFilterStr = idMovie[0].name;
      }
      this.dataColumnsQuote = this.filterByFilm;
    },
    filterColumnQuote(event) {
      this.dataColumnsQuote = this.dataColumnsQuote.map((column) => {
        delete column[event];
        return column;
      });
    },
    resetFiltersCharacters() {
      this.raceFilterStr = null;
      this.genderFilterStr = null;
      this.dataColumnsCharacter = this.getDataColumnCharacter();
    },
    resetFilterMovie() {
      this.movieFilterStr = null;
      this.dataColumnsQuote = this.getDataColumnQuote();
      this.pagination = true;
    },
    filterColumnCharacters() {},
    hideColumnCharacter(event) {
      this.isHideColumnCharacters = true;
      this.headersCharacters = this.headersCharacters.filter((row) => {
        return row.value !== event;
      });
      this.isHideColumnCharacters = true;
    },
    hideColumnQuotes(event) {
      this.isHideColumnQuotes = true;
      this.headersQuotes = this.headersQuotes.filter((row) => {
        return row.value !== event;
      });
    },
    clickRow(value) {
      this.selectedRow = value;
      let filtro = this.filterQuoteCharacter;
      this.axuDataColumnQuote = filtro;
      this.dataColumnsQuote = filtro;
      if (this.movieFilterStr != null) {
        this.dataColumnsQuote = this.filterByFilm;
      }
      this.pagination = false;
    },
    showColumnsCharacter() {
      this.isHideColumnCharacters = false;
      this.headersCharacters = this.originalHeaderCharacters;
    },
    showColumnsQuote() {
      this.isHideColumnQuotes = false;
      this.headersQuotes = this.originalHeaderQuotes;
    },
    getDataColumnQuote() {
      let column = [];
      this.quotes.list.map((quote) => {
        column.push(quote);
      });
      return column;
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

