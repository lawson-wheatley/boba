window.addEventListener('resize', vs(),  true);
function vs(){
    if ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) && screen.width <768) {
    document.getElementById("nav").classList.remove("navbar");
    document.getElementById("nav").classList.remove("boxshad");
    document.getElementById("nav").style.zindex = "-500";
    if(window.location.pathname === '/search'){
    document.getElementById("nav").innerHTML = `
    <div id="header" class="header">
        <ul class="mob-navul sa">
            <a class = "aa ml5" href = "/">
                <img class="mob-navimg moba" src="/static/logo.svg"/>
            </a>

        </ul>
    </div>
    <div id = "footer" class = "footer">
        <ul class="mob-navul se">
            <a class = "aa" href = "/">
                <img class="mob-navimg" src="/static/home.svg"/>
            </a>
            <a class = "aa" href = "/search">
                <img class="mob-navimg" src="/static/search.svg"/>
            </a>
            <a class = "aa" href = "/post">
                <img class="mob-navimg" src="/static/post.svg">
            </a>
            <a class = "aa" href = "/notifications">
                <img class="mob-navimg" src="/static/notification.svg"/>
            </a>
            <a class = "aa" href = "/profile">
                <img class="mob-navimg" src="/static/profile.svg"/>
            </a>
        </ul>
    </div>`
    document.getElementById("header").style.zindex = "1000";
    document.getElementById("footer").style.zindex = "1000";
} 
else{
    document.getElementById("nav").classList.add("navbar");
    document.getElementById("nav").classList.add("boxshad");
    document.getElementById("nav").innerHTML = `
    <div class="fcnav">
        <div class="c-logo">
            <img class="nav-logo" src="/static/logo.svg">
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
                        <img class="navimg" src="/static/post.svg"></img>
                    </a>
                </li>
                <li class="nlipr25">
                    <a class = "aa" href = "/">
                        <img class="navimg" src="/static/home.svg"></img>
                    </a>
                </li>
                <li class="nlipr25">
                    <a class = "aa" href = "/notifications">
                        <img class="navimg" src="/static/notification.svg"></img>
                    </a>
                </li>
                <li class="nlipl25">
                    <a class = "aa" href = "/profile">
                        <img class="navimg" src="/static/profile.svg"></img>
                    </a>
                </li>

            </ul>
        </div>
    </div>`
    }
    }
}

window.addEventListener('resize', vs,  true);
vs();
}