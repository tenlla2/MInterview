import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    "Access-Control-Allow-Origin": "*",
    Authorization: "Bearer _IvjLIFpI4EJrEtXUhho",
  },
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    movies: [],
    characters: [],
    quotes: [],
    totalQuotes: [],
    charactersTotalPages: 0,
    quotesTotalPages: 0,
  },
  mutations: {
    setProperty(state, obj) {
      state[obj.listName] = obj;
    },
    setTotal(state, obj) {
      state[obj.name] = obj.totalPages;
    },
    setTotalQuotes(state, totalQuotes) {
      state.totalQuotes = totalQuotes;
    },
  },
  actions: {
    async getTotalQuotes({ dispatch, commit }) {
      let firstPage = await dispatch("getData", { url: "quote" });
      let secondPage = await dispatch("getData", { url: "quote?page=2" });
      let thirdPage = await dispatch("getData", { url: "quote?page=3" });
      let firstConcat = firstPage.data.docs.concat(secondPage.data.docs);
      let secondConcat = firstConcat.concat(thirdPage.data.docs);
      commit("setTotalQuotes", secondConcat);
    },
    async getData({}, endPoint) {
      return await axiosInstance
        .get("/api/" + endPoint.url)
        .then((response) => {
          return response;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // Obtenemos los datos de la petición GET a la api y los asignamos mediante una mutación a una propiedad deñ state.
    async getDataAndSet({ commit, dispatch }, endPoint) {
      let response = await dispatch("getData", endPoint);
      const listObj = {
        list: response.data.docs,
        listName: endPoint.name,
        totalRows: response.data.total,
      };
      if (response.data.pages) {
        commit("setTotal", {
          name: endPoint.name + "TotalPages",
          totalPages: response.data.pages,
        });
      }
      commit("setProperty", listObj);
    },
  },
  getters: {
    movies: (state) => state.movies,
    characters: (state) => state.characters,
    quotes: (state) => state.quotes,
    totalCharacters: (state) => state.characters.totalRows,
    totalCharacterPages: (state) => state.charactersTotalPages,
    totalQuotes: (state) => state.totalQuotes,
    totalQuotesPages: (state) => state.quotesTotalPages,
  },
  modules: {},
});
