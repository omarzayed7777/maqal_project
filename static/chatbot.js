const chatbotIcon = document.getElementById("chatbotIcon");
const popup = document.getElementById("popup");
const closeBtn = document.getElementById("closeBtn");

chatbotIcon.addEventListener("click", () => {
  popup.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});
