const database = [
  { title: "Playa", image: "http://4.bp.blogspot.com/-uVaD4a4UMlw/V3EjAw_NzGI/AAAAAAAAGB8/LfjFTMHFQD0am8rkCp2YQB2V8Yg2KETkwCK4B/s1600/1449789343-620d343f58f5e93c9de1d5b3f5b966de.jpeg", description: "Imagen de una hermosa playa con palmeras", phone: "3046234592" },
  { title: "Montañas", image: "https://i.pinimg.com/236x/0d/03/0b/0d030bccc849ba15fe764b8ec244f4d9.jpg", description: "Imagen de unas impresionantes montañas nevadas", phone: "3046234592" },
  { title: "Ciudad", image: "https://w0.peakpx.com/wallpaper/805/457/HD-wallpaper-animals-hot-anime-girl-sexy-anime-girl-anime-girl-anime.jpg", description: "Imagen de una animada ciudad de noche", phone: "3046234592" },
  { title: "Bosque", image: "https://i.pinimg.com/736x/02/0f/50/020f50c861604df0f0556b7f7335e22a.jpg", description: "Imagen de un frondoso bosque con un arroyo", phone: "3046234592" },
];

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const modal = document.getElementById("modal");

searchInput.addEventListener("input", search);

function search() {
  const searchValue = searchInput.value.toLowerCase();

  if (searchValue === "") {
    searchResults.innerHTML = "";
    return;
  }

  let resultsHtml = "";

  database.forEach(item => {
    if (item.title.toLowerCase().includes(searchValue)) {
      resultsHtml += `
        <div class="searchResult" data-title="${item.title}" data-description="${item.description}" data-image="${item.image}" data-phone="${item.phone}">
          <img src="${item.image}">
          <div>
            <span>${item.title}</span>
            <span class="description">${item.description}</span>
          </div>
        </div>
      `;
    }
  });

  if (resultsHtml === "") {
    resultsHtml = "<div class='noResults'>No se encontraron resultados.</div>";
  }

  searchResults.innerHTML = resultsHtml;

  const searchResultElements = document.querySelectorAll(".searchResult");
  searchResultElements.forEach(element => {
    element.addEventListener("click", showDetails);
  });
}

function showDetails() {
  const title = this.getAttribute("data-title");
  const description = this.getAttribute("data-description");
  const image = this.getAttribute("data-image");
  const phone = this.getAttribute("data-phone");

  const modalHtml = `
    <div class="modalContent">
      <img src="${image}">
      <div>
        <h2>${title}</h2>
        <p>${description}</p>
        <button onclick="callNumber('${phone}')">Llamar</button>
      </div>
      <span class="closeButton">&times;</span>
    </div>
  `;

  modal.innerHTML = modalHtml;

  const closeButton = modal.querySelector(".closeButton");
  closeButton.addEventListener("click", hideModal);

  modal.style.display = "block";
}

function hideModal() {
  modal.style.display = "none";
  modal.innerHTML = "";
}

function callNumber(phone) {
  window.location.href = `tel:${phone}`;
}