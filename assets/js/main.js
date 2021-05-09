// Renvoie un entier aléatoire dans l'intervalle passé en paramètre
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const keybord = document.querySelectorAll('button[data-type="letter"]');
const startBtn = document.querySelector('button[data-type="start"]');
const resetBtn = document.querySelector('button[data-type="reset"]');
const details = document.getElementById("details");
const myWords = [
    "ADMIRER",
    "BOISSON",
    "CABARET",
    "DOMINOS",
    "ECLAIRS",
    "FRAISES",
    "GATERIE",
    "HELICES",
    "INDIENS",
    "JOUEURS",
    "KETCHUP",
    "LOURDER",
    "MARTYRE"
];

const gameMusic = new Audio("./assets/sounds/game_music.mp3");
const bodySound = new Audio("./assets/sounds/body_falling.mp3");
const rockSound = new Audio("./assets/sounds/impact.mp3");
const winSound = new Audio("./assets/sounds/win_sound.mp3");

var nbTry = 7;
var score = 0;

// Le jeu démare au click sur le bouton "Commencer"
startBtn.addEventListener('click', () => {

    gameMusic.play();
    gameMusic.volume = 0.1;

    startBtn.disabled = true;
    resetBtn.disabled = false;

    // Récupère un mot du tableau au hasard
    let gameWord = myWords[getRandomInt(myWords.length - 1)];

    // Transforme le mot en tableau de caractères
    let cutGameWord = gameWord.split('');
    let nbChar = 0;

    // Parcourir le tableau et créer un span pour chaque lettre
    for (let i = 0; i < cutGameWord.length; i++) {
        let mySpan = document.createElement("span");

        mySpan.setAttribute("id", cutGameWord[i]);
        mySpan.innerHTML = " _ ";
        details.append(mySpan);

        nbChar++;
    }

    // Découpe l'écran en autant de parties que de caractères
    let a = 0;
    for (let i = nbChar; i >= 0; i--) {
        let myDiv = document.createElement("div");
        myDiv.setAttribute("id", "div" + a);
        myDiv.setAttribute("class", "cut-div");
        cutScreen.append(myDiv);

        a++;
    }

    // On récupère nos fragments d'écran pour les utiliser
    const myCutDivs = document.querySelectorAll('div[class="cut-div"]');

    myCutDivs.forEach(element => {
        element.style.width = "500px";
        //element.style.border = "1px solid black";
    });

    // Création du compteur de vie, du personnage et du coffre
    let createPerso = document.createElement("div");
    createPerso.setAttribute("id", "perso");
    createPerso.setAttribute("class", "perso");

    let imagePerso = document.createElement("img");
    imagePerso.setAttribute("src", "assets/img/perso.png");
    imagePerso.setAttribute("alt", "Perso");
    imagePerso.setAttribute("class", "perso-img");

    createPerso.appendChild(imagePerso);

    let createHeart = document.createElement("img");
    createHeart.setAttribute("src", "assets/img/heart.png");
    createHeart.setAttribute("alt", "Heart");
    createHeart.setAttribute("class", "heart");

    let createLife = document.createElement("span");
    createLife.setAttribute("id", "tryCount");
    createLife.setAttribute("class", "life");

    let createTrophy = document.createElement("img");
    createTrophy.setAttribute("src", "assets/img/chest.png");
    createTrophy.setAttribute("alt", "Chest");
    createTrophy.setAttribute("id", "chest");
    createTrophy.setAttribute("class", "chest");

    myCutDivs[0].append(createHeart);
    myCutDivs[0].append(createLife);
    myCutDivs[0].append(createPerso);
    myCutDivs[myCutDivs.length - 1].append(createTrophy);

    tryCount.innerHTML = nbTry;

    // A chaque appui sur une lettre :
    keybord.forEach(element => {
        element.addEventListener('click', function () {

            // Récuperer nos span en tableau
            let spanTab = document.querySelectorAll("span");
            let isGood = false;

            // Compare l'entrée clavier à chaque lettre du mot
            for (let i = 0; i < spanTab.length; i++) {

                if (this.dataset.value == spanTab[i].getAttribute("id")) {
                    isGood = true;
                    spanTab[i].innerHTML = this.dataset.value;
                    imagePerso.src = "assets/img/perso.png";
                    score++;
                }
                this.disabled = true;
            }
            if (!isGood) {
                nbTry--;
                tryCount.innerHTML = nbTry;

                let createRock = document.createElement("img");
                createRock.setAttribute("src", "assets/img/rock.png");
                createRock.setAttribute("alt", "Rock");
                createRock.setAttribute("class", "rock");
                myCutDivs[score].append(createRock);

                setTimeout(function() {
                    createRock.remove();
                    rockSound.play();
                    imagePerso.src = "assets/img/fail_perso.png";
                }, 500);
            } else {
                myCutDivs[score].append(createPerso);
            }

            // En cas de victoire
            if (score >= spanTab.length - 1) {

                keybord.forEach(element => {
                    element.disabled = true;
                });
                winSound.play();
                winSound.volume = 0.5;
                chest.src = "assets/img/open_chest.png";
                chest.style.width = "50%";
                chest.style.bottom = "50%";
                chest.style.left = "25%";
                imagePerso.src = "assets/img/win_perso.png";
            }

            // En cas de défaite
            if (nbTry == 0) {
                keybord.forEach(element => {
                    element.disabled = true;
                });
                setTimeout(function() {
                    bodySound.play();
                    imagePerso.src = "assets/img/death_perso.png";
                    imagePerso.style.height = "60px";
                    imagePerso.style.position = "absolute";
                    imagePerso.style.bottom = "0";
                }, 1500);
            }
        });
    });
});

resetBtn.addEventListener("click", () => {
    document.location.reload();
});