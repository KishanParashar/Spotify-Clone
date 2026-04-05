let currentsong=new Audio();
let songs;
let currentfolder;
async function getsongs(folder) {
    currentfolder=folder;
    let a = await fetch(`${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let links = div.querySelectorAll("#files a");

    songs = [];

    links.forEach(link => {
        let href = link.getAttribute("href");

        if (href.endsWith(".mp3")) {
             songs.push(href.split(`/${folder}/`)[1]);
        }
    })

    let songurl=document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songurl.innerHTML=""
    for (const song of songs) {
        songurl.innerHTML=songurl.innerHTML+`<li>
                            <img src="img/music.svg" alt="">
                            <div class="info">
                            
                            
                            
                            
                                <div>${song.replaceAll("%20"," ")}</div>
                            
                            </div>
                            
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="img/play.svg" alt="">
                            </div>
                        </li>`;
    }
    
    //console.log(songs);
    // var audio = new Audio(songs[0]);
    // audio.play();
    
    // audio.addEventListener("loadeddata",()=>
    // {
    //     let duration=audio.duration;
    //     console.log(duration);
    // })

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
       // console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
       // console.log(e);
    }
   )
    })
    return songs;
}

const playmusic=(track,pause=false)=>{
currentsong.src=`${currentfolder}/`+track
if(!pause)
{
currentsong.play()
play.src="img/pause.svg"
}
document.querySelector(".songinfo").innerHTML=track
document.querySelector(".songtime").innerHTML="00:00/00:00"
}

function formatTime(seconds) {
    if(isNaN(seconds) || seconds<0)
        return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    // Add leading zero if needed
    const formattedSecs = secs < 10 ? '0' + secs : secs;

    return `${mins}:${formattedSecs}`;
}



async function displayalbums(){
    
let a = await fetch(`songs/`);
let response = await a.text();

let div = document.createElement("div");
div.innerHTML = response;
let anchors=div.getElementsByTagName("a")
let cardcontainer=document.querySelector(".cardcontainer")
let array=Array.from(anchors);
for(let index=0;index<array.length;index++)
{
    const e=array[index];
    if(e.href.includes("/songs/"))
    {
       
        let folder=e.href.split("/").slice(-1)
        let a = await fetch(`songs/${folder}/info.json`)
        let response = await a.json();
        console.log(response)
        cardcontainer.innerHTML=cardcontainer.innerHTML+`<div data-folder="${folder}" class="card">
                        <div class="play">
                            <button>
                                <svg width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" fill="black" />
                                </svg>
                            </button>
                        </div>
                        <img src="songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>

                    </div>`
    }
}
Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
        songs=await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        playmusic(songs[0])
    })
})

}

async function main() {
   
    await getsongs(`songs/ncs`);
    playmusic(songs[0],true);
    
    //display all the albums
    displayalbums();

    play.addEventListener("click",()=>{
        if(currentsong.paused)
        {
            currentsong.play();
            play.src="img/pause.svg";
        }
        else{
            currentsong.pause();
            play.src="img/play.svg";
        }
    })

    currentsong.addEventListener("timeupdate",()=>
    {
        document.querySelector(".songtime").innerHTML=`${formatTime(currentsong.currentTime)}:${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%"
    })

    document.querySelector(".seekbar").addEventListener("click",e=>
    {
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect().width)*100 + "%";
        currentsong.currentTime=percent*(currentsong.duration)/100;
    }
    )
   

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0
    });

    document.querySelector(".close1").addEventListener("click", () => {
        console.log("clicked");
        document.querySelector(".left").style.left = "-100%";
    });

  next.addEventListener("click",()=>
  {
    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if((index+1)<songs.length)
    {
      playmusic(songs[index+1].replaceAll("%20"," "))
    }
  })

 prev.addEventListener("click",()=>
  {
    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if((index-1)>=0)
    {
      playmusic(songs[index-1].replaceAll("%20"," "))
    }
  })


}
main();