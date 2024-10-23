const scrollButton=document.getElementById("scroll")

scrollButton.addEventListener("click",scrollToTop)
function scrollToTop(){
window.scroll({
    top:0,
    behavior:"smooth"
})
}
function hideOrShowScrollButton(){
    
    if(window.scrollY*3>window.innerHeight){
        scrollButton.classList.remove('hidden')
    }else{
        scrollButton.classList.add("hidden")
    }
    
}
window.addEventListener("scroll",hideOrShowScrollButton)