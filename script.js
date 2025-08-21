const imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDh42tHL_EFsPoYIfkryodgq_NAxbDkFa9TQ&s";
const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

const image = document.getElementById("dynamic-image");
const video = document.getElementById("dynamic-video");
const button = document.getElementById("animate-btn");

window.onload = () => {
  // Set image source with error handling
  image.src = imageUrl;
  image.onerror = () => {
    console.log("External image failed to load, but PWA is working offline");
    image.alt = "Image not available offline";
  };
  
  // Set video source with error handling
  video.src = videoUrl;
  video.onerror = () => {
    console.log("External video failed to load, but PWA is working offline");
    video.style.display = "none";
  };
};

button.addEventListener("click", () => {
  image.classList.add("visible");
  video.classList.add("visible");
});