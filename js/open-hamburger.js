function openHamburger() {
    let navs = document.getElementsByTagName('nav');

    /* 
        By design, every HTML file should exactly have one nav, located in the header. 
        For that reason, we will always toggle the first nav we find.
    */
    navs[0].classList.toggle('open');
} 