// SERVICE WORKER REGISTRATION
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/public/service-worker.js")
      .then((reg) => {
        console.log("Service Worker registered with scope:", reg.scope);
      })
      .catch((err) => console.error(err));
  });
}

// PWA INSTALLATION PROMPT
let deferredPrompt;
const installBtn = document.getElementById("install");
const notNowBtn = document.getElementById("notNow");
const installPrompt = document.getElementById("installPrompt");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  setTimeout(() => {
    installPrompt.classList.add("show");
  }, 3000);
});

// FUNCTION TO CHECK IF IOS DEVICE
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

// INSTALL BUTTON CLICK EVENT
installBtn.addEventListener("click", () => {
  if (deferredPrompt) {
    console.log("Install");
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      }
      deferredPrompt = null;
      installPrompt.style.display = "none";
    });
  } 
  else if (isIos()) {
    alert(
      "To install on iOS:\n1. Tap the 'Share' button (square with arrow)\n2. Scroll down and select 'Add to Home Screen'"
    );
  } else {
    alert(
      "To install: Look for the 'Add to Home Screen' option in your browser menu."
    );
  }
});

notNowBtn.addEventListener("click", () => {
  installPrompt.style.display = "none";
});