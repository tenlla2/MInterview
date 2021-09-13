<template>
  <div>
    <v-row v-if="activeFilterCharacter" align="center">
      <v-col cols="12" md="3">
        <v-combobox
          v-model="valFilterRace"
          :items="listRace"
          label="Filtro multiselección por raza"
          multiple
          chips
        >
          <template v-slot:selection="data">
            <v-chip
              :key="JSON.stringify(data.item)"
              v-bind="data.attrs"
              :input-value="data.selected"
              :disabled="data.disabled"
              @click:close="data.parent.selectItem(data.item)"
            >
              <v-avatar
                class="accent white--text"
                left
                v-text="data.item.slice(0, 1).toUpperCase()"
              ></v-avatar>
              {{ data.item }}
            </v-chip>
          </template>
        </v-combobox>
      </v-col>
      <v-col cols="12" md="3">
        <!-- <v-select
        class="px-3"
      label="Filtro de raza" 
      :items="['Dwarf','Human']"
      v-model="gender"
      @change="updateFilterRace"
    ></v-select> -->
        <v-combobox
          v-model="valFilterGender"
          :items="listGender"
          label="Filtrar por género"
          chips
        >
          <template v-slot:selection="data">
            <v-chip
              :key="JSON.stringify(data.item)"
              v-bind="data.attrs"
              :input-value="data.selected"
              :disabled="data.disabled"
              @click:close="data.parent.selectItem(data.item)"
            >
              <v-avatar
                class="accent white--text"
                left
                v-text="data.item.slice(0, 1).toUpperCase()"
              ></v-avatar>
              {{ data.item }}
            </v-chip>
          </template>
        </v-combobox>
      </v-col>
      <v-col cols="12" md="4" class="mb-5 mb-md-0">
        <v-btn block @click="resetFilters()"> Resetear </v-btn>
      </v-col>
    </v-row>
    <v-row align="center" v-if="activeFilterQuote">
      <v-col cols="12" md="3">
        <v-combobox
          v-model="valFilterMovie"
          :items="listMovies"
          label="Filtrar por película"
          chips
        >
          <template v-slot:selection="data">
            <v-chip
              :key="JSON.stringify(data.item)"
              v-bind="data.attrs"
              :input-value="data.selected"
              :disabled="data.disabled"
              @click:close="data.parent.selectItem(data.item)"
            >
              <v-avatar
                class="accent white--text"
                left
                v-text="data.item.slice(0, 1).toUpperCase()"
              ></v-avatar>
              {{ data.item }}
            </v-chip>
          </template>
        </v-combobox>
      </v-col>
      <v-col cols="12" class="mb-5 mb-md-0" md="4">
        <v-btn block @click="resetFilterMovie()"> Resetear </v-btn>
      </v-col>
    </v-row>
    <v-card elevation="10">
      <v-data-table
        @click:row="clickRow"
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
            <v-btn class="d-none d-lg-inline-block" @click="resizeColumn">Activar columnas resizables</v-btn>
          </v-toolbar></template
        >
        <template v-for="header in headers" v-slot:[`header.${header.value}`]>
          <span :key="header._id"
            >{{ header.text }}
            <v-icon @click="hideColumn(header)" color="red lighten-3">
              mdi-eye-off
            </v-icon></span
          >
        </template>
        <template v-if="actions" v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon class="mr-2" small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
          <v-icon small @click="copyItem(item)"> mdi-content-copy </v-icon>
        </template>
      </v-data-table>
      <v-pagination
        v-show="pagination"
        class="my-5 pb-5"
        v-on:input="updateCurrentPage"
        v-model="currentPage"
        :length="pageCount"
        :total-visible="10"
      ></v-pagination>
      <v-dialog v-model="myDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Editor de frases</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-form @submit.prevent="submit">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.dialog"
                      label="Nombre"
                      :rules="[(v) => !!v || 'La frase no puede estar vacía']"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red" text @click="close"> Cancelar </v-btn>
                  <v-btn color="primary" text @click="save(editedItem)">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
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
    activeFilterCharacter: Boolean,
    listRace: Array,
    raceFilter: Array,
    listGender: Array,
    genderFilter: String,
    hideFooter: Boolean,
    activeFilterQuote: Boolean,
    movieFilter: String,
    listMovies: Array,
    pagination: Boolean,
    actions: Boolean,
  },
  data: function () {
    return {
      currentPage: this.page,
      resized: false,
      editedItem: {},
      myDialog: false,
    };
  },
  computed: {
    valFilterRace: {
      get() {
        return this.raceFilter;
      },
      set(val) {
        this.$emit("updateFilterRace", val);
      },
    },
    valFilterGender: {
      get() {
        return this.genderFilter;
      },
      set(val) {
        this.$emit("updateFilterGender", val);
      },
    },
    valFilterMovie: {
      get() {
        return this.movieFilter;
      },
      set(val) {
        this.$emit("updateFilterMovie", val);
      },
    },
  },
  methods: {
    updateCurrentPage() {
      this.$emit("updateCurrentPage", this.currentPage);
    },
    clickRow(value) {
      this.$emit("clickRow", value);
    },
    hideColumn(column) {
      this.$emit("hideColumn", column.value);
    },
    showColumns() {
      this.resized = false;
      this.$emit("showColumns", false);
    },
    // updateFilterRace() {
    //   this.$emit("updateFilterRace", this.raceFilter);
    // },
    resetFilters() {
      this.$emit("resetFilters");
    },
    resetFilterMovie() {
      this.$emit("resetFilterMovie");
    },
    copyItem(item) {
      item.action = "copy";
      this.updateChanges(item);

      item = JSON.stringify(item);
      alert("axiosInstance.post(urlBack/copyItem,{" + item + "})");
    },
    deleteItem(item) {
      item.action = "delete";
      this.updateChanges(item);
      item = JSON.stringify(item);
      alert("axiosInstance.post(urlBack/deleteItem,{" + item + "})");
    },
    editItem(item) {
      this.myDialog = true;
      item.lastValue = item.dialog;
      this.editedItem = item;
    },
    close() {
      this.editedItem.dialog = this.editedItem.lastValue;
      this.myDialog = false;
    },
    save(item) {
      item.action = "modify";
      this.updateChanges(item);
      this.myDialog = false;
    },
    updateChanges(item) {
      item.date = new Date();
      item.table = "Quotes";

      if (localStorage.getItem("changes") == null) {
        let newArray = [];
        newArray.push(item);
        localStorage.setItem("changes", JSON.stringify(newArray));
      } else {
        var old_changes = JSON.parse(localStorage.getItem("changes"));
        old_changes.push(item);
        localStorage.setItem("changes", JSON.stringify(old_changes));
      }
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
