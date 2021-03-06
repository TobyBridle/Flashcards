var cardNum = 0; 
var cards;

var jCard;

var undoCache = {}

function FitToContent(id, maxHeight)
{
   var text = id && id.style ? id : document.getElementById(id);
   if ( !text )
      return;

   var adjustedHeight = text.clientHeight;
   if ( !maxHeight || maxHeight > adjustedHeight )
   {
      adjustedHeight = Math.max(text.scrollHeight, adjustedHeight);
      if ( maxHeight )
         adjustedHeight = Math.min(maxHeight, adjustedHeight);
      if ( adjustedHeight > text.clientHeight )
         text.style.height = adjustedHeight + "px";
   }
}

// alert(Object.keys(undoCache).length)

function handleFlipFront(e)
{
  e.path[0].classList.toggle("hide");
  e.path[1].children[1].classList.toggle("show");
}

function handleFlipBack(e)
{
  e.path[0].classList.toggle("show");
  e.path[1].children[0].classList.toggle("hide")
    
}

function handleDelete()
{
  let el = undoCache[Object.keys(undoCache).length]
  if(cards.length > 0)
  {
    el.classList.add("hide");
  } else {
    document.querySelector(".none").classList.add("hide");
    el.classList.remove("hide");

  }
  document.querySelector(".flashcards").appendChild(el);
  delete undoCache[Object.keys(undoCache).length]
  document.querySelector(".delete-popup").classList.add("hide");
  
  refreshData();
  
}

function handleLeft()
{
  if(cardNum <= 0)
      {
        cardNum = cards.length-1;
        cards.forEach(c => {
          c.classList.add("hide");
        });
        
        cards[cards.length-1].classList.remove("hide");
        document.querySelector(".counter").innerHTML = `${cards.length} / ${cards.length}`
        return 1;
      } else {
        cardNum-=1;
      }
      cards[cardNum+1].classList.add("hide");
      cards[cardNum].classList.remove("hide");
    
      cards[cards.length-1].children[0].classList.remove("hide");
      cards[cards.length-1].children[1].classList.add("hide");
    
      document.querySelector(".counter").innerHTML = `${cardNum+1} / ${cards.length}`
    
}

function handleRight()
{
  if(cardNum+1 >= cards.length)
      {
        cardNum=0;
        cards.forEach(c => {
          c.classList.add("hide");
        })
        cards[0].classList.remove("hide");
        
      document.querySelector(".counter").innerHTML = cardNum+1 + " / " + cards.length;
        return 1;
      } else {
        cardNum+=1;
      }
      document.querySelector(".counter").innerHTML = cardNum+1 + " / " + cards.length;
      
      cards[cardNum-1].classList.add("hide");
      cards[cardNum].classList.remove("hide");
    
}

function refreshData()
{
  cards = document.querySelectorAll(".card");
  cardNum = 0;
  
  document.querySelectorAll(".front").forEach(frontCard => {
    
    frontCard.removeEventListener("click", handleFlipFront)
    frontCard.addEventListener("click", handleFlipFront)
  
  });
  document.querySelectorAll(".back").forEach(backCard => {
    backCard.removeEventListener("click", handleFlipBack);
    backCard.addEventListener("click", handleFlipBack);
  })
  
  document.querySelector(".counter").innerHTML = cardNum+1 + " / " + (cards.length);
  if(cards.length == 0)
    {
      document.querySelector(".none").classList.remove("hide");
    }

  if(document.querySelector(".undo-delete")){
    document.querySelectorAll(".undo-delete").forEach(undoBtn => {
      undoBtn.removeEventListener("click", handleDelete);
      undoBtn.addEventListener("click", handleDelete);
  });
  
  }
}

async function deleteCard(e)
{
  if(confirm("Are you Sure you want to delete the Flashcard?"))
  {
    document.querySelector(".delete-container").classList.remove("hide")
    let el = document.getElementById(e.dataTransfer.getData("text"))
    el.parentNode.removeChild(el);

    // Add to Undo Storage

    undoCache[Object.keys(undoCache).length+1] = el;
    if(document.querySelector(".card")) document.querySelector(".card").classList.remove("hide");
    refreshData();

    // Show Popup
    let deletePopup = `<div class=\"delete-popup\">
    <span><i class=\"fas fa-exclamation\"></i>Flashcard Deleted</span>
    <button class=\"undo-delete\">
      <i class=\"fas fa-undo\"></i>
      <p>UNDO</p>
    </button>
    </div>
    <br/><br/><br/>`
    document.querySelector(".delete-container").innerHTML += deletePopup
    console.log(document)
    refreshData()
    setTimeout(() => {
      document.querySelector(".delete-container").classList.add("hide")
      document.querySelector(".delete-container").remove(document.querySelector(".delete-container").lastChild);
    }, 5000)
  }
}

window.onload = (e) => {
  refreshData();
  
  // Arrow Keypress to Change Card
  window.onkeydown = (e) => {
    if(e.path[0].tagName == "BODY")
      {
      switch(e.code)
        {
          case "ArrowLeft":
            handleLeft();
            break;
          case "ArrowRight":
            handleRight();
            break;
        }
      }
  }
  
  [...document.getElementsByTagName("textarea")].forEach(txtAr => {
    txtAr.onkeypress = function() {
      FitToContent( this, 150 )
    };
  })
  
  // Mobile Hamburger Menu
  
  document.querySelector(".mobile-toggle").addEventListener("click", () => {
    document.querySelector(".mobile-toggle").classList.toggle("move-hamburger")
    document.getElementsByTagName("main")[0].classList.toggle("move")
    document.querySelector(".nav").classList.toggle("move")
    
  })
  
  // Save File Event Listener
  
  document.querySelector(".save").addEventListener("click", () => {
    let cardsEl = []
    cards.forEach(card => {
      cardsEl.push(card.outerHTML);
    })
    
    jCard = JSON.stringify({cardsEl});
    
  })
  
  document.querySelector(".open").addEventListener("click", () => {
    
    alert(jCard)
    let jToHTML = JSON.parse(jCard);
    jToHTML['cardsEl'].forEach(card => {

      let card1 = document.createElement("div");
      card1.innerHTML = card;
      console.log(card)
      document.querySelector(".none").classList.add("hide");
      document.querySelector(".flashcards").appendChild(card1);
      refreshData();      
    })
    
  })
  
  if(cards.length == 0) {
    document.querySelectorAll(".create-card")[0].classList.add("hide");
    document.querySelector(".card__nav").classList.add("hide");
  }
  
  document.querySelectorAll(".card").forEach(card => {
    
    card.ondragstart = (e) => {
      e.dataTransfer.setData("text/plain", e.target.id);
    }
    
    card.ondrag = (e) => {
      document.querySelector(".rubbish").classList.add("display-show")
      card.classList.add("card-rotate")
    }
    
    document.querySelector(".rubbish").ondragover = (e) => {
      e.preventDefault();
      document.querySelector(".rubbish").classList.add("rubbish-hover")
    }
    
    card.ondragend = (e) => {
      e.preventDefault();
      document.querySelector(".rubbish").classList.remove("display-show");
      document.querySelector(".rubbish").classList.remove("rubbish-hover");
      
      card.classList.remove("card-rotate")
    }
    
    document.ondrop = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      if(e.target.classList[1] == "fa-trash" || e.target.classList[0] == "rubbish")
        {
          deleteCard(e); 
        } else {
              document.querySelector(".rubbish").classList.remove("display-show");
              document.querySelector(".rubbish").classList.remove("rubbish-hover");

              card.classList.remove("card-rotate")
            }
    }
    
  })
  
  if(cards.length == 0)
    {
      document.querySelector(".none").classList.remove("hide");
    }
  
  document.querySelector(".cancelCard").addEventListener("click", () => {
    
    document.getElementsByTagName("textarea")[0].value = ""
    document.getElementsByTagName("textarea")[1].value = ""
    
    document.querySelector(".create-card__screen").classList.add("hide");
    document.querySelector(".create-card__screen").classList.remove("create-anim");
    
    document.querySelectorAll(".create-card")[1].classList.remove("hide");
    
    refreshData();
    document.querySelector(".card__nav").classList.remove("hide");
    document.querySelector(".card").classList.remove("hide");
  })
  
  document.querySelectorAll(".createCard")[0].addEventListener("click", () => {
    if(document.getElementsByTagName('textarea')[0].value.length > 0 && document.getElementsByTagName('textarea')[1].value.length > 0)
      {
        document.querySelector(".create-card__screen").classList.add("hide");
        document.querySelector(".create-card__screen").classList.remove("create-anim");
        
        // Create the Element
        let p = document.createElement("div");
        p.draggable = "true";
        p.classList.add("card");
        p.id = cards.length + 1;
        
        let f = document.createElement("div");
        f.classList.add("front");
        
        let fContent = document.createElement("div");
        fContent.classList.add("front__content");
        fContent.innerText = document.querySelector(".front__create").value;
        f.appendChild(fContent);
        
        p.appendChild(f);
        
        let b = document.createElement("div");
        b.classList.add("back");
        
        let bContent = document.createElement("div");
        bContent.classList.add("back__content");
        bContent.innerText = document.querySelector(".back__create").value;
        
        b.appendChild(bContent);
        
        p.appendChild(b);
        
        if(cards.length !== 0)
          {
            p.classList.add("hide")
          }
        
        
        document.querySelectorAll(".card").forEach(card => {
          card.classList.add("hide");
        });
        
        document.querySelectorAll(".create-card")[1].classList.remove("hide");
        
        document.querySelector(".flashcards").appendChild(p);
        
        document.querySelector(".rubbish").ondragover = (e) => {
          e.preventDefault();
          document.querySelector(".rubbish").classList.add("rubbish-hover")
        }
        
        p.ondragstart = (e) => {
          e.dataTransfer.setData("text/plain", e.target.id);
        }
    
        p.ondrag = (e) => {
          document.querySelector(".rubbish").classList.add("display-show")
          p.classList.add("card-rotate")
        }

        p.ondragend = (e) => {
          e.preventDefault();
          document.querySelector(".rubbish").classList.remove("display-show");
          document.querySelector(".rubbish").classList.remove("rubbish-hover");
          p.classList.remove("card-rotate")
        }
        
        document.querySelector(".rubbish").ondrop = (e) => {
          e.preventDefault();
          deleteCard(e);
        }
        
        refreshData();
        document.querySelector(".card__nav").classList.remove("hide");
        document.querySelector(".card").classList.remove("hide");
      }
  })
  document.querySelectorAll(".create-card")[0].addEventListener("click", () => {

    document.querySelector(".none").classList.add("hide")
    document.querySelector(".create-card__screen").classList.add("create-anim");
    document.querySelector(".create-card__screen").classList.remove("hide");

    document.querySelector(".card__nav").classList.add("hide")
     
  })
  
  document.querySelectorAll(".create-card")[1].addEventListener("click", () => {

    document.querySelector(".none").classList.add("hide")
    document.querySelector(".card__nav").classList.add("hide")
    
    document.getElementsByTagName("textarea")[0].value = "";
    document.getElementsByTagName("textarea")[1].value = "";
    
    document.querySelectorAll(".card").forEach(card => {
      card.classList.add("hide");
    });
    document.querySelectorAll(".create-card")[1].classList.add("hide");
    document.querySelector(".create-card__screen").classList.add("create-anim");
    document.querySelector(".create-card__screen").classList.remove("hide");   
     
  })
  
  document.querySelector(".fa-arrow-left").addEventListener("click", handleLeft);
  
  document.querySelector(".fa-arrow-right").addEventListener("click", handleRight);
  
  
  
}
