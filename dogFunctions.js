async function loadRandomDogs() {
    try {
      const res = await fetch("https://dog.ceo/api/breeds/image/random/10");
      const data = await res.json();
      const container = document.getElementById("carousel-container");
      container.innerHTML = '';
  
      data.message.forEach(img => {
        const slide = document.createElement("img");
        slide.src = img;
        slide.style.width = "300px";
        slide.style.margin = "10px";
        container.appendChild(slide);
      });
    } catch (err) {
      console.error("Failed to load dog images", err);
    }
  }
  
  async function loadBreedButtons() {
    try {
      const res = await fetch("https://dogapi.dog/api/v2/breeds");
      const data = await res.json();
      const buttonContainer = document.getElementById("breed-buttons");
  
      data.data.forEach(breed => {
        const btn = document.createElement("button");
        btn.textContent = breed.attributes.name;
        btn.classList.add("custom-btn");
        btn.onclick = () => showBreedInfo(breed);
        buttonContainer.appendChild(btn);
      });
    } catch (err) {
      console.error("Failed to load dog breeds", err);
    }
  }
  
  function showBreedInfo(breed) {
    document.getElementById("breed-info").style.display = "block";
    document.getElementById("breed-name").textContent = breed.attributes.name;
    document.getElementById("breed-desc").textContent = breed.attributes.description;
    document.getElementById("breed-life").textContent = `${breed.attributes.min_life} - ${breed.attributes.max_life} years`;
  }
  
  if (annyang) {
    annyang.addCommands({
      'load dog breed *breed': name => {
        const buttons = document.querySelectorAll("#breed-buttons button");
        for (let btn of buttons) {
          if (btn.textContent.toLowerCase() === name.toLowerCase()) {
            btn.click();
            break;
          }
        }
      }
    });
  }
  
  loadRandomDogs();
  loadBreedButtons();
  