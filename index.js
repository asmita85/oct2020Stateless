import { Header, Nav, Main, Footer } from "./components";
import * as state from "./store";
import axios from "axios";
import Navigo from "navigo";
import capitalize from "lodash";

const router = new Navigo(window.location.origin);

router
  .on({
    "/": () => {
      fetchDataByView(state.Home);
    },
    ":page": params => {
      let page = capitalize(params.page);
      fetchDataByView(state[page]);
    }
  })
  .resolve();

function render(st = state.Home) {
  document.querySelector("#root").innerHTML = `
    ${Header(st)}
    ${Nav(state.Links)}
    ${Main(st)}
    ${Footer()}
  `;

  router.updatePageLinks();

  addNavEventListeners();
  addPicOnFormSubmit(st);
}

function addNavEventListeners() {
  // add event listeners to Nav items for navigation
  document.querySelectorAll("nav a").forEach(navLink =>
    navLink.addEventListener("click", event => {
      event.preventDefault();
      render(state[event.target.title]);
    })
  );
  // add menu toggle to bars icon in nav bar
  document
    .querySelector(".fa-bars")
    .addEventListener("click", () =>
      document.querySelector("nav > ul").classList.toggle("hidden--mobile")
    );
}
function addPicOnFormSubmit(st) {
  if (st.view === "Form") {
    document.querySelector("form").addEventListener("submit", event => {
      event.preventDefault();
      // convert HTML elements to Array
      let inputList = Array.from(event.target.elements);
      // remove submit button from list
      inputList.pop();
      // construct new picture object
      let newPic = inputList.reduce((pictureObject, input) => {
        pictureObject[input.name] = input.value;
        return pictureObject;
      }, {});
      // add new picture to state.Gallery.pictures
      state.Gallery.pictures.push(newPic);
      render(state.Gallery);
    });
  }
}

function fetchDataByView(st = state.Home) {
  console.log("matsinet-st:", st);
  switch (st.view) {
    case "Pizza":
      axios
        .get("http://localhost:4040/pizzas")
        .then(response => {
          state[st.view].pizzas = response.data;
          render(st);
        })
        .catch(error => {
          console.log("It puked", error);
        });
      break;
    case "Bio":
      break;
    case "Gallery":
      break;
  }

  render(st);
}
