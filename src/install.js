// PWA INSTALLATION PROMPT
let deferredPrompt;
const installBtn = document.getElementById("install");
const notNowBtn = document.getElementById("notNow");
const installPrompt = document.getElementById("installPrompt");

// FUNCTION TO CHECK IF IOS DEVICE
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

// BEFORE INSTALL PROMPT EVENT
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("👍 beforeinstallprompt fired!");
  e.preventDefault();
  deferredPrompt = e;
  installPrompt.classList.add("shown");
});

// INSTALL BUTTON CLICK EVENT
installBtn.addEventListener("click", () => {
  if (deferredPrompt) {
    console.log("Install");
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");

        installPrompt.classList.remove("shown");
      }
      deferredPrompt = null;
      installPrompt.classList.remove("shown");
    });
  } else if (isIos()) {
    alert(
      "To install on iOS:\n1. Tap the 'Share' button (square with arrow)\n2. Scroll down and select 'Add to Home Screen'"
    );
  }
});

notNowBtn.addEventListener("click", () => {
  installPrompt.classList.remove("shown");
  deferredPrompt = null;
});

// APP INSTALLED EVENT
window.addEventListener("appinstalled", (evt) => {
  console.log("👍 App was installed.");
  installPrompt.classList.remove("shown");
  deferredPrompt = null;
});
