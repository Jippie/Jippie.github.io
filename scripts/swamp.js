const entergrid = document.getElementById("entergrid")
        const enter = document.getElementById("enter")
        const page = document.querySelectorAll(".page")
        const audio = new Audio('https://github.com/polewolf/swamp/raw/refs/heads/main/what-are-you-doing-in-my-swamp.mp3');

        enter.addEventListener("click", () => {
            audio.play();
            entergrid.style.display = "none"
            page.forEach((i) => {
                i.style.display = "block"
            })
            
        })
        