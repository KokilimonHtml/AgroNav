const RegBut = document.querySelector("#RegistrationBut")
const RegMenu = document.querySelector(".RegistrationMenu")
const Hero = document.querySelector(".hero")
const CardOne = document.querySelector(".card-one")
const MyGardenMenu = document.querySelector(".MyGardenMenu")
const MyGarden= document.querySelector("#MyGarden")
const CardTwo = document.querySelector(".card-two")
const NewsMenu= document.querySelector(".NewsMenu")
const NewsBut= document.querySelector("#news-button")
const BackBtn= document.querySelector("#back-btn")
function OpenMenu(){

}

RegBut.addEventListener("click", function() {
    RegMenu.style.display="flex"
    CardOne.style.display="none"
    CardTwo.style.display="none"
    BackBtn.style.display="block"
    RegBut.style.display="none"
    Hero.style.display="none"
    document.body.classList.add("menu-open")
})

BackBtn.addEventListener("click", function() {
    const isGardenOpen= document.querySelector(".MyGardenMenu").style.display==="flex"
    const isNewsOpen= document.querySelector(".NewsMenu").style.display==="flex"
    RegMenu.style.display="none"
    CardOne.style.display="flex"
    CardTwo.style.display="flex"
    BackBtn.style.display="none"
    RegBut.style.display="block"
    Hero.style.display="flex"
    MyGardenMenu.style.display="none"
    NewsMenu.style.display="none"
    document.body.classList.remove("menu-open")

    if(isGardenOpen){
        CardOne.scrollIntoView({behavior:"instant", block:"center"})
    }

    else if(isNewsOpen){
        CardTwo.scrollIntoView({behavior:"instant", block:"center"})
    }
})

MyGarden.addEventListener("click", function(){
    RegMenu.style.display="none"
    CardOne.style.display="none"
    CardTwo.style.display="none"
    BackBtn.style.display="block"
    RegBut.style.display="none"
    Hero.style.display="none"
    MyGardenMenu.style.display="flex"
    document.body.classList.add("menu-open")
})

NewsBut.addEventListener("click", function(){
    RegMenu.style.display="none"
    CardOne.style.display="none"
    CardTwo.style.display="none"
    BackBtn.style.display="block"
    RegBut.style.display="none"
    Hero.style.display="none"
    NewsMenu.style.display="flex"
    document.body.classList.add("menu-open")
})
