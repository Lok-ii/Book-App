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
  let j = 0;
  dataStored.forEach((e) => {
    for (let i = 0; i < e.books.length; i++) {
      let newBookDiv = document.createElement("div");
      newBookDiv.classList.add("book");
      newBookDiv.innerHTML = `<div class="book-image">
      <img src="${e.books[i].book_image}" alt="${e.books[i].title}">
      <p class="quick-view animate__animated animate__slideInUp animate__faster">QUICK VIEW</p>
  </div>
        <p class="book-name">${e.books[i].title}</p>
        <span class="author">${e.books[i].author}</span>`;

      bookLists[j].appendChild(newBookDiv);
    }
    j++;
  });
};

window.onload = () => {
  onLoad();
};
