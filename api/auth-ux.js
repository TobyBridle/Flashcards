window.onload = () => {
  document.querySelectorAll(".no-account").forEach(swapBtn => {
    swapBtn.addEventListener("click", (e) => {
      if(e.path[1].classList == "no-account tosign-in")
        {
          document.querySelectorAll(".container")[0].style.display="none";
          document.querySelectorAll(".container")[1].style.display="block";
          
        } else {
          document.querySelectorAll(".container")[1].style.display = "none";
          document.querySelectorAll(".container")[0].style.display = "block";
          
        }
    })
  })
}
