jsearch.prototype.show = function() {
  this.get("loading").style.display = "none";
  this.get('wrapper').style.display = "block";
  this.get('found').style.display = "block";
  this.get('paginator').style.display = "block";
  setTimeout(function() {
    that.addClass(that.get("wrapper"), "initWeb");
    that.listeners();
    setTimeout(function() {
      that.blockScreen = false;
      withSlopeFinite(that.get('found'));
    }, 1000);
  }, 500);

  // Agrega la imagen a cada resultado
  for (var i = 0; i < this.itemsFound.length; i++) {
    var result = this.itemsFound[i];
    var resultElement = document.createElement("div");
    resultElement.className = "result";

    // Agrega la imagen
    var imageElement = document.createElement("img");
    imageElement.src = result.image;
    resultElement.appendChild(imageElement);

    // Agrega el título, descripción y enlace
    var titleElement = document.createElement("h3");
    titleElement.innerHTML = result.title;
    resultElement.appendChild(titleElement);

    var descriptionElement = document.createElement("p");
    descriptionElement.innerHTML = result.description;
    resultElement.appendChild(descriptionElement);

    var linkElement = document.createElement("a");
    linkElement.href = result.link;
    linkElement.innerHTML = "Ver más";
    resultElement.appendChild(linkElement);

    this.get('found').appendChild(resultElement);
  }
};
