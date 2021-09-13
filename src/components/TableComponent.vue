<template>
  <div>
    <v-card elevation="10">
      <v-data-table
        :headers="headers"
        :items="dataColumns"
        class="elevation-1"
        :loading="loading"
        :server-items-length="totalRows"
        :hide-default-footer="hideFooter"
        :id="id"
      >
        <template v-slot:top>
          <v-toolbar
            flat
            style="border-bottom: solid 2px rgba(0, 0, 0, 0.12)"
            class="primary"
          >
            <v-toolbar-title class="px-5 white--text">{{
              tableName
            }}</v-toolbar-title>
            <v-divider
              class="mx-4"
              style="border-width: 2px !important"
              inset
              vertical
            ></v-divider>

            <export-excel
              :data="dataColumns"
              :worksheet="tableName"
              :name="tableName + '.xls'"
              style="cursor: pointer"
            >
              <v-icon big color="white"> mdi-file-excel </v-icon>
            </export-excel>
            <v-spacer></v-spacer>
            <v-icon
              v-show="isHideColumn"
              class="mr-3"
              @click="showColumns()"
              color="teal lighten-2"
            >
              mdi-eye
            </v-icon>
            <v-btn @click="resizeColumn">Activar columnas resizables</v-btn>
          </v-toolbar></template
        >
        <!-- /* eslint-disable vue/no-unused-vars */ -->

        <template
          v-for="(header, index) in headers"
          v-slot:[`header.${header.value}`]
        >
          <span :key="index"
            >{{ header.text }}
            <v-icon @click="hideColumn(header)" color="red lighten-3">
              mdi-eye-off
            </v-icon></span
          >
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-vars */
/* eslint-disable vue/require-v-for-key */

export default {
  name: "TableComponent",
  props: {
    pageCount: Number,
    page: Number,
    totalRows: Number,
    loading: Boolean,
    dataColumns: Array,
    headers: Array,
    tableName: String,
    isHideColumn: Boolean,
    id: String,
    hideFooter: Boolean,
  },
  data: function () {
    return {
      resized: false,
    };
  },

  methods: {
    hideColumn(column) {
      this.$emit("hideColumn", column.value);
    },
    showColumns() {
      this.resized = false;
      this.$emit("showColumns", false);
    },
    resizeColumn() {
      if (!this.resized) {
        var thElm;
        var startOffset;
        var container = document.querySelector("#" + this.id);
        Array.prototype.forEach.call(
          container.querySelectorAll("table th:not(:last-child)"),
          function (th) {
            th.style.position = "relative";

            var grip = document.createElement("div");
            grip.innerHTML = "&nbsp;";
            grip.style.top = 0;
            grip.style.right = 0;
            grip.style.bottom = 0;
            grip.style.width = "2px";
            grip.style.background = "grey";
            grip.style.position = "absolute";
            grip.style.cursor = "col-resize";
            grip.addEventListener("mousedown", function (e) {
              thElm = th;
              startOffset = th.offsetWidth - e.pageX;
            });

            th.appendChild(grip);
          }
        );

        document.addEventListener("mousemove", function (e) {
          if (thElm) {
            thElm.style.width = startOffset + e.pageX + "px";
          }
        });

        document.addEventListener("mouseup", function () {
          thElm = undefined;
        });
        this.resized = true;
      }
    },
  },
  mounted: function () {},
};
</script>

<style>
tr td:not(:last-child) {
  border-right: 2px solid grey !important;
}
</style>
