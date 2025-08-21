const imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDh42tHL_EFsPoYIfkryodgq_NAxbDkFa9TQ&s";
const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

const image = document.getElementById("dynamic-image");
const video = document.getElementById("dynamic-video");
const button = document.getElementById("animate-btn");

// Check if app is running as PWA
function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
}

window.onload = () => {
  // Show PWA status
  if (isPWA()) {
    console.log("App is running as PWA");
    document.title = "PWA: " + document.title;
  }
  
  // Set image source with error handling
  image.src = imageUrl;
  image.onerror = () => {
    console.log("External image failed to load, but PWA is working offline");
    image.alt = "Image not available offline";
    image.style.display = "none";
  };
  
  // Set video source with error handling
  video.src = videoUrl;
  video.onerror = () => {
    console.log("External video failed to load, but PWA is working offline");
    video.style.display = "none";
  };
  
  // Check network status
  updateOnlineStatus();
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
};

function updateOnlineStatus() {
  const status = navigator.onLine ? "online" : "offline";
  console.log(`App is ${status}`);
  
  if (!navigator.onLine) {
    // Show offline indicator
    document.body.classList.add('offline');
  } else {
    document.body.classList.remove('offline');
  }
}

button.addEventListener("click", () => {
  image.classList.add("visible");
  video.classList.add("visible");
});