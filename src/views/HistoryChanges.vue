<template>
  <v-container>
    <v-row jutify="center">
      <v-col cols="12">
        <h1 class="py-4 mb-3 text-center primary white--text">
          Historial de peticiones
        </h1>
        <table-component
          v-if="showIf()"
          :loading="loading"
          :tableName="'Historial'"
          :dataColumns="items"
          :headers="headers"
          :isHideColumn="isHideColumn"
          v-on:hideColumn="hideColumn($event)"
          v-on:showColumns="showColumns"
          :id="'tableHisoty'"
        />
        <v-card></v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import TableComponent from "../components/TableComponent.vue";

export default {
  name: "HistoryChanges",
  components: { TableComponent },
  data: function () {
    return {
      headers: [
        { text: "Fecha", sortable: true, value: "date" },
        { text: "Diálogo", sortable: false, value: "dialog" },
        { text: "Acción", sortable: false, value: "action" },
        { text: "Personaje", sortable: false, value: "character" },
        { text: "Película ID", sortable: false, value: "movie" },
        { text: "Tabla", sortable: false, value: "table" },
        { text: "ID", sortable: false, value: "_id" },
      ],
      originalHeaders: [
        { text: "Fecha", sortable: true, value: "date" },
        { text: "Diálogo", sortable: false, value: "dialog" },
        { text: "Acción", sortable: false, value: "action" },
        { text: "Personaje", sortable: false, value: "character" },
        { text: "Película ID", sortable: false, value: "movie" },
        { text: "Tabla", sortable: false, value: "table" },
        { text: "ID", sortable: false, value: "_id" },
      ],
      items: [],
      loading: false,
      isHideColumn: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.loading = true;
      this.items = JSON.parse(localStorage.getItem("changes"));
      this.loading = false;
    },
    hideColumn(event) {
      this.isHideColumn = true;
      this.headers = this.headers.filter((row) => {
        return row.value !== event;
      });
      this.isHideColumn = true;
    },
    showIf() {
      if ( this.items != null) {
        return true;
      } else {
        return false;
      }
    },
    showColumns() {
      this.isHideColumn = false;
      this.headers = this.originalHeaders;
    },
  },
};
</script>