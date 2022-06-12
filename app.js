const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: "",
    capsLock: false,
  },

  init() {
    // Create main elements
    this.elements.main = document.querySelector("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys =
      this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.querySelector(".keyboard-cont").appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach((element) => {
      element.addEventListener("focus", () => {
        this.open(element.value, (currentValue) => {
          element.value = currentValue;
        });
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      "q",
      "w",
      "e",
      "r",
      "t",
      "y",
      "u",
      "i",
      "o",
      "p",
      "a",
      "s",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      "z",
      "x",
      "c",
      "v",
      "b",
      "n",
      "m",
    ];

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach((key) => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["p", "l", "m"].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      keyElement.textContent = key.toLowerCase();

      keyElement.addEventListener("click", () => {
        this.properties.value += this.properties.capsLock
          ? key.toUpperCase()
          : key.toLowerCase();
        this._triggerEvent("oninput");
      });

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});

wordCont = document.querySelector(".container");
hearts = document.getElementsByTagName("svg");
document
  .querySelector(".btn")
  .addEventListener("click", () => location.reload());

fetchWord = async () => {
  list = await fetch("https://random-word-api.herokuapp.com/word");
  result = await list.json();
  console.log("Shhh, the right answer is " + result[0]);
  word = result[0].split("");

  var rightLetters = [];
  var wrongLetters = [];

  checkWin = () => {
    flag = true;
    word.forEach((l) => {
      if (!rightLetters.includes(l)) flag = false;
    });

    return flag;
  };

  displayWord = (word) =>
    (wordCont.innerHTML = word
      .map((x) => (rightLetters.indexOf(x) > -1 ? x : "&nbsp;"))
      .reduce(
        (acc, el) =>
          (acc += `<div class="letters">
        ${el}
      </div>`),
        ""
      ));
  displayWord(word);

  livesCheck = (count) => {
    let lives = count.length;
    if (lives > 0) {
      for (i = 0; i < lives; i++) {
        hearts[i].classList.add("dead");
      }
    }
    if (lives >= 5) {
      document.body.classList.add("lost");
      document.querySelector(
        ".keyboard"
      ).innerHTML = `<h2>YOU LOSE!</h2><br><h4>the right word was:</h4><h3>${word.join(
        ""
      )}`;
    }
  };

  let keys = document.querySelectorAll(".keyboard__key");
  keys.forEach((k) =>
    k.addEventListener("click", (e) => {
      let letter = e.target.textContent;
      result[0].includes(letter)
        ? rightLetters.push(letter)
        : wrongLetters.push(letter);
      displayWord(word);
      e.target.classList.add("used");
      livesCheck(wrongLetters);
      if (checkWin()) {
        document.body.classList.add("won");
        document.querySelector(
          ".keyboard"
        ).innerHTML = `<h2>YOU WON!</h2><br><h4>You guessed:</h4><h3>${word.join(
          ""
        )}`;
      }
    })
  );
};

fetchWord();
