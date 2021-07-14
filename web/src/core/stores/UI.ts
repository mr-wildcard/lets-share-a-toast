import { makeObservable, observable } from "mobx";

export const ui = makeObservable(
  {
    currentPageBgColor: "",
  },
  { currentPageBgColor: observable }
);
