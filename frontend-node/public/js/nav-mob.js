function vs(){
    if ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) && screen.width <768) {
    document.getElementById("nav").classList.remove("navbar");
    document.getElementById("nav").classList.remove("boxshad");
    document.getElementById("nav").style.zindex = "-500";
    if(window.location.pathname === '/search'){
        document.getElementById("nav").innerHTML = `
        <div id="header" class="header">
            <form class="xa">
                <input placeholder="Search..." type="text" class="mob-search"/></input>
                <input type="submit" style="display: none"/>
            </form>
        </div>
        <div id = "footer" class = "footer">
        <ul class="mob-navul se">
            <a class = "aa" href = "/">
                <img class="mob-navimg" src="/img/home.svg"/>
            </a>
            <a class = "aa" href = "/search">
                <img class="mob-navimg" src="/img/search.svg"/>
            </a>
            <a class = "aa" href = "/post">
                <img class="mob-navimg" src="/img/post.svg">
            </a>
            <a class = "aa" href = "/notifications">
                <img class="mob-navimg" src="/img/notification.svg"/>
            </a>
            <a class = "aa" href = "/profile">
                <img class="mob-navimg" src="/img/profile.svg"/>
            </a>
        </ul>
        </div>
    </div>`
    }
    else{
    document.getElementById("nav").innerHTML = `
    <div id="header" class="header">
        <ul class="mob-navul sa">
            <a class = "aa ml5" href = "/">
                <img class="mob-navimg moba" src="/img/logo.svg"/>
            </a>

        </ul>
    </div>
    <div id = "footer" class = "footer">
        <ul class="mob-navul se">
            <a class = "aa" href = "/">
                <img class="mob-navimg" src="/img/home.svg"/>
            </a>
            <a class = "aa" href = "/search">
                <img class="mob-navimg" src="/img/search.svg"/>
            </a>
            <a class = "aa" href = "/post">
                <img class="mob-navimg" src="/img/post.svg">
            </a>
            <a class = "aa" href = "/notifications">
                <img class="mob-navimg" src="/img/notification.svg"/>
            </a>
            <a class = "aa" href = "/profile">
                <img class="mob-navimg" src="/img/profile.svg"/>
            </a>
        </ul>
    </div>`
    }
    document.getElementById("header").style.zindex = "1000";
    document.getElementById("footer").style.zindex = "1000";
} 
else{
    //Dev only
    document.getElementById("nav").classList.add("navbar");
    document.getElementById("nav").classList.add("boxshad");
    document.getElementById("nav").innerHTML = `
    <div class="fcnav">
        <div class="c-logo">
            <img class="nav-logo" src="/img/logo.svg">
            </img>
        </div>
            <form class="rs">
                <input placeholder="Search..." type="text" class="search"></input>
                <input type="submit" style="display: none" />
            </form>
        <div class = "realnav">
            <ul class="navul">
                <li class="">
                    <a class = "aa" href = "/post">
                        <img class="navimg" src="/img/post.svg"></img>
                    </a>
                </li>
                <li class="nlipr25">
                    <a class = "aa" href = "/">
                        <img class="navimg" src="/img/home.svg"></img>
                    </a>
                </li>
                <li class="nlipr25">
                    <a class = "aa" href = "/notifications">
                        <img class="navimg" src="/img/notification.svg"></img>
                    </a>
                </li>
                <li class="nlipl25">
                    <a class = "aa" href = "/profile">
                        <img class="navimg" src="/img/profile.svg"></img>
                    </a>
                </li>

            </ul>
        </div>
    </div>`
}
}
if(window.location.pathname !== '/login' || window.location.pathname !=='/register' || window.location.pathname !=='/password-reset'){
window.addEventListener('resize', vs,  true);
vs();
}