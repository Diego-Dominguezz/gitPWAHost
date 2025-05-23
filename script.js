const imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDh42tHL_EFsPoYIfkryodgq_NAxbDkFa9TQ&s";
const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

const image = document.getElementById("dynamic-image");
const video = document.getElementById("dynamic-video");
const button = document.getElementById("animate-btn");

window.onload = () => {
  image.src = imageUrl;
  video.src = videoUrl;
};

button.addEventListener("click", () => {
  image.classList.add("visible");
  video.classList.add("visible");
});