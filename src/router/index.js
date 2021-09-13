import Vue from "vue";
import VueRouter from "vue-router";
import TableDisplay from "../views/TableDisplay.vue";
import HistoryChanges from "../views/HistoryChanges.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "TableDisplay",
    component: TableDisplay,
  },
  {
    path: "/history-changes",
    name: "HistoryChanges",
    component: HistoryChanges,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
