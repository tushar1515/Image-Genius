async function queryHuggingFaceAPI(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
    {
      headers: { Authorization: "Bearer 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" },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.blob();
  return result;
}

const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");
let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
  // Clear previous images
  imageGallery.innerHTML = '';

  imgDataArray.forEach((imgData, index) => {
    const imgCard = document.createElement("div");
    imgCard.classList.add("img-card");
    const imgElement = document.createElement("img");
    imgElement.src = URL.createObjectURL(imgData);
    imgCard.appendChild(imgElement);
    const downloadBtn = document.createElement("a");
    downloadBtn.classList.add("download-btn");
    downloadBtn.href = imgElement.src;
    downloadBtn.download = `${new Date().getTime()}.jpg`;
    const downloadIcon = document.createElement("img");
    downloadIcon.src ="Images.icon.png";
    downloadBtn.appendChild(downloadIcon);
    imgCard.appendChild(downloadBtn);
    imageGallery.appendChild(imgCard);
  });
};

const handleImageGeneration = async (e) => {
  e.preventDefault();
  if (isImageGenerating) return;

  const userPrompt = e.srcElement[0].value;
  const userImgQuantity = parseInt(e.srcElement[1].value);

  generateBtn.setAttribute("disabled", true);
  generateBtn.innerText = "Generating";
  isImageGenerating = true;

  try {
    const imgDataArray = [];
    for (let i = 0; i < userImgQuantity; i++) {
      const randomString = Math.floor(Math.random() * 1000000);
      const modifiedPrompt = `${userPrompt} ${randomString}`;
      const response = await queryHuggingFaceAPI({ "inputs": modifiedPrompt });
      imgDataArray.push(response);
    }
    updateImageCard(imgDataArray);
  } catch (error) {
    alert("Failed to generate images. Please try again later.");
  } finally {
    generateBtn.removeAttribute("disabled");
    generateBtn.innerText = "Generate";
    isImageGenerating = false;
  }
};

var startButton = document.getElementById('mic-btn');
var stopButton = document.getElementById('stop-btn');
var promptInput = document.querySelector('.prompt-input');

var recognition = new webkitSpeechRecognition();

recognition.lang = window.navigator.language;
recognition.interimResults = true;

startButton.addEventListener('click', () => {recognition.start();});
stopButton.addEventListener('click', () => {recognition.stop();});

recognition.addEventListener('result', (event) => {
    const result = event.results[event.results.length - 1][0].transcript;
    promptInput.value = result;
});

generateForm.addEventListener("submit", handleImageGeneration);
