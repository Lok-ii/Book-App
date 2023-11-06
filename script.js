let addTopBook = (dataStored, list) => {
  let j = 0;
  dataStored.forEach((e) => {
    for (let i = 0; i < 5; i++) {
      let newBookDiv = document.createElement("div");
      newBookDiv.classList.add("book");
      newBookDiv.innerHTML = `<div class="book-image">
      <img src="${e.books[i].book_image}" alt="${e.books[i]._id}">
      <p class="quick-view animate__animated animate__slideInUp animate__faster">QUICK VIEW</p>
  </div>
        <p class="book-name">${e.books[i].title}</p>
        <span class="author">${e.books[i].author}</span>`;

      let loading = document.querySelector(".loading");
      let main = document.querySelector("main");

      loading.style.display = "none";
      main.style.display = "flex";
      list[j].appendChild(newBookDiv);
    }
    j++;
  });
};

let addCategoryBooks = (list, data) => {
  let loading = document.querySelector(".loading");
  let mainContainer = document.querySelector(".main-container");

  loading.style.display = "none";
  mainContainer.style.display = "flex";
  data.forEach((e) => {
    let newBookDiv = document.createElement("div");
    newBookDiv.classList.add("book");
    newBookDiv.innerHTML = `<div class="book-image">
      <img src="${e.book_image}" alt="${e._id}">
      <p class="quick-view animate__animated animate__slideInUp animate__faster">QUICK VIEW</p>
  </div>
        <p class="book-name">${e.title}</p>
        <span class="author">${e.author}</span>`;
    list.appendChild(newBookDiv);
  });
};

let quickView = () => {
  // Showing the detailed section of the book

  let books = document.querySelectorAll(".book");
  books.forEach((element) => {
    element.addEventListener("click", () => {
      let key = element.firstElementChild.firstElementChild.alt;
      let url = `https://books-backend.p.goit.global/books/${key}`;

      // let main = document.querySelector("main");
      // main.style.display = "none";

      let loading = document.querySelector("#load");
      loading.style.display = "flex";
      fetch(url)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          let detailsSection = document.createElement("section");
          detailsSection.classList.add("details");
          detailsSection.classList.add("animate__animated");
          detailsSection.classList.add("animate__zoomIn");

          let description = data.description;
          if (description === "") {
            description = "There is no description of this book.";
          }
          detailsSection.innerHTML = `<div class="book-info">
          <img src="${data.book_image}" alt="">
          <div class="info">
              <p class="title">${data.title}</p>
              <span class="author">${data.author}</span>
              <p class="description">${description}</p>
              <div class="icons">
                  <a href="${data.buy_links[0].url}"><img src="./Assets/amazon-shop-1x.d33dc585.png" alt=""></a>
                  <a href="${data.buy_links[1].url}"><img src="./Assets/apple-shop-1x.aeb5cfd2.png" alt=""></a>
                  <a href="${data.buy_links[3].url}"><img src="./Assets/bookshop-1x.d3877644.png" alt=""></a>
              </div>
          </div>
      </div>
      <button class="cart">Add to Shopping Cart</button>
      <button class="close">Close</button>`;

          // main.style.display = "flex";
          loading.style.display = "none";

          let container = document.querySelector("main");
          container.appendChild(detailsSection);
          detailsSection.style.display = "flex";

          detailsSection.addEventListener("click", (e) => {
            if (e.target.classList.contains("close")) {
              detailsSection.style.display = "none";
            }
          });
        });
    });
  });
};

let fetchCategories = (e, catName) => {
  let categoryName = catName.split(" ");
  let lastWord = categoryName[categoryName.length - 1];
  let lastWordLength = categoryName[categoryName.length - 1].length;
  let category = categoryName.join("+");

  let nameOfCategory = categoryName.join(" ");

  let otherWords = nameOfCategory.substring(
    0,
    nameOfCategory.length - lastWordLength - 1
  );

  let url = `https://books-backend.p.goit.global/books/category?category=${category}`;
  console.log(url);

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let loading = document.querySelector("#load");
      loading.style.display = "flex";
      if (
        e.target.classList.contains("category-item") ||
        e.target.classList.contains("see-more")
      ) {
        setTimeout(() => {
          let mainContainer = document.querySelector(".main-container");
          mainContainer.innerHTML = "";
          let bookList = document.createElement("div");
          bookList.className = "book-list";

          mainContainer.innerHTML = `<h1>${otherWords} <span class="last-word">${lastWord}</span></h1>
      `;
          mainContainer.appendChild(bookList);
          mainContainer.style.display = "none";
          addCategoryBooks(bookList, data);
          quickView();
        }, 500);
      }
    });
};

let onLoad = async () => {
  let catContainer = document.querySelector(".cat-container");

  // Create a new div element for the category list on side bar

  let listItems = await fetch(
    "https://books-backend.p.goit.global/books/category-list"
  );
  let storedList = await listItems.json();

  storedList.sort((a, b) => {
    return a.list_name > b.list_name ? 1 : b.list_name > a.list_name ? -1 : 0;
  });
  storedList.forEach((element) => {
    let newItem = document.createElement("li");
    newItem.classList.add("category-item");
    newItem.innerText = element.list_name;
    catContainer.appendChild(newItem);
  });

  //   create top sellers sections for different categories

  let mainContainer = document.querySelector(".main-container");
  mainContainer.innerHTML = `<h1>Best Sellers <span class="last-word">Books</span></h1>`;

  let topSellersData = await fetch(
    "https://books-backend.p.goit.global/books/top-books"
  );
  let dataStored = await topSellersData.json();

  dataStored.forEach((e) => {
    let newCategory = document.createElement("div");
    newCategory.classList.add("category-container");

    newCategory.innerHTML = `<h3 class="cat-name">${e.list_name}</h3>
    <div class="book-list">
        
    </div>
    <button class="see-more">SEE MORE</button>`;

    mainContainer.appendChild(newCategory);
  });
  let bookLists = document.querySelectorAll(".book-list");
  addTopBook(dataStored, bookLists);

  quickView();
};

window.onload = () => {
  let main = document.querySelector("main");
  main.style.display = "none";
  let loading = document.querySelector("#load");
  loading.style.display = "flex";
  setTimeout(onLoad, 1000);

  // displaying different category pages

  let catContainer = document.querySelector(".cat-container");

  catContainer.addEventListener("click", (e) => {
    let selected = document.querySelector(".selected");

    if (e.target.classList.contains("category-item")) {
      selected.classList.remove("selected");
      e.target.classList.add("selected");
      let catName = e.target.innerText;
      fetchCategories(e, catName);
    }
  });

  let seeMore = document.querySelector(".main-container");
  seeMore.addEventListener("click", (e) => {
    if (e.target.classList.contains("see-more")) {
      let selected = document.querySelector(".selected");
      selected.classList.remove("selected");
      let catName = e.target.parentElement.firstElementChild.innerText;
      fetchCategories(e, catName);

      let allCat = document.querySelectorAll(".category-item");

      allCat.forEach((ele) => {
        if (ele.innerText === catName) {
          ele.classList.add("selected");
        }
      });
    }
  });
};

let allCategories = document.querySelector(".all-categories");

allCategories.addEventListener("click", () => {
  window.location.reload();
});

let light = document.querySelector(".light");
let dark = document.querySelector(".dark");
let body = document.querySelector("body");
let header = document.querySelector("header");
let selected = document.querySelector(".selected");
let categories = document.querySelectorAll(".category-items");

light.addEventListener("click", () => {
  dark.style.display = "block";
  light.style.display = "none";

  body.style.backgroundColor = "var(--background-color)";
  body.style.color = "black";
  header.style.backgroundColor = "var(--background-color)";
});

dark.addEventListener("click", () => {
  dark.style.display = "none";
  light.style.display = "block";

  body.style.backgroundColor = "var(--dark-background)";
  body.style.color = "white";
  header.style.backgroundColor = "var(--dark-background)";
});
