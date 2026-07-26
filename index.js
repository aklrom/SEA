
const formulaire = document.getElementById("formulaire");
let registrationSection = document.getElementById("registration");
let gameSection = document.getElementById("gamesection");
let ansSection = document.getElementById("answers");
let rejouer = document.getElementById("reset");
let registrationInput = document.getElementById("name");

let questionScreen = document.getElementById("questionscreen");
let ans1 = document.getElementById("answer1");
let ans2 = document.getElementById("answer2");
let ans3 = document.getElementById("answer3");
let ans4 = document.getElementById("answer4");
let playerNameSection = document.getElementById("playernamesection");
let points = document.getElementById("points");

// Les 10 lignes du tableau des scores (tr)
let rank1 = document.getElementById("top1");
let rank2 = document.getElementById("top2");
let rank3 = document.getElementById("top3");
let rank4 = document.getElementById("top4");
let rank5 = document.getElementById("top5");
let rank6 = document.getElementById("top6");
let rank7 = document.getElementById("top7");
let rank8 = document.getElementById("top8");
let rank9 = document.getElementById("top9");
let rank10 = document.getElementById("top10");

// Variables d'état du jeu
let score = 0;
let questionIndex = 0;
let playerName = "";
let questionTable = [];
let jokerDisponible = true; // État initial du Joker

// Récupération permanente des scores sauvegardés
let ranklist = JSON.parse(localStorage.getItem("quizScores")) ?? [];



// Sauvegarde dans le LocalStorage
function sauvegarderScores() {
  localStorage.setItem("quizScores", JSON.stringify(ranklist));
}

// Classement automatique du meilleur au moins bon
function mettreAJourLeClassement() {
  // Tri décroissant basé sur les points
  ranklist.sort((a, b) => b.points - a.points);

  let toutesLesLignes = [rank1, rank2, rank3, rank4, rank5, rank6, rank7, rank8, rank9, rank10];

  toutesLesLignes.forEach((tr, index) => {
    // Si un joueur existe à cette position dans le tableau des scores
    if (ranklist[index]) {
      let joueur = ranklist[index];
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${joueur.nom}</td>
        <td>${joueur.points}</td>
      `;
    }
  });
}

// Algorithme de brassage aléatoire (Shuffle)
function melangerTableau(tableau) {
  for (let i = tableau.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temporaire = tableau[i];
    tableau[i] = tableau[j];
    tableau[j] = temporaire;
  }
}

// Appel direct au démarrage pour afficher les anciens scores sauvegardés
mettreAJourLeClassement();

function afficherquestion(t) {
  // Sécurité anti-crash après la 100e question
  if (questionIndex >= t.length) {
    questionScreen.innerHTML = `<p style="font-weight:bold;font-size:2rem;">Félicitations ! Vous avez fini le quiz !</p>`;
    ansSection.classList.add("hidden");
    return;
  }

  let question = t[questionIndex].question;
  let resp1 = t[questionIndex].choix[0];
  let resp2 = t[questionIndex].choix[1];
  let resp3 = t[questionIndex].choix[2];
  let resp4 = t[questionIndex].choix[3];

  questionScreen.innerHTML = `<p>${question}</p>`;
  ans1.innerHTML = `<p>${resp1}</p>`;
  ans2.innerHTML = `<p>${resp2}</p>`;
  ans3.innerHTML = `<p>${resp3}</p>`;
  ans4.innerHTML = `<p>${resp4}</p>`;
}

function verifierreponse(optionChoisie) {
  let reponseFiche = questionTable[questionIndex].reponseCorrecte;

  if (optionChoisie === reponseFiche) {
    score += 10;
    points.innerHTML = `<p>${score}</p>`;
    questionIndex++;
    afficherquestion(questionTable);
  } else {
    // Écran de défaite et mise à jour immédiate
    questionScreen.innerHTML = `<p style="font-weight:bold;font-size:2rem;">Perdu</p>`;
    
    // Ajout et sauvegarde du nouveau score
    ranklist.push({ nom: playerName, points: score });
    sauvegarderScores();
    mettreAJourLeClassement();

    ansSection.classList.add("hidden");
  }
}


// Récupération initiale du catalogue de 100 questions
fetch("questions.json")
  .then((response) => response.json())
  .then((donnees) => {
    questionTable = donnees;
  });

// Soumission du formulaire de départ
formulaire.addEventListener("submit", (event) => {
  event.preventDefault();

  let donneesForm = new FormData(formulaire);
  playerName = donneesForm.get("name");

  if (playerName.trim() === "") return;

  playerNameSection.textContent = `${playerName}`;
  
  // Reset complet des données pour la nouvelle partie
  score = 0;
  questionIndex = 0;
  jokerDisponible = true;
  let jokerbtn = document.getElementById("joker");
  if (jokerbtn) jokerbtn.classList.remove("hidden");
  points.innerHTML = `<p>${score}</p>`;

  melangerTableau(questionTable);

  // Changement d'écran visuel
  registrationSection.classList.add("hidden");
  gameSection.classList.remove("hidden");
  ansSection.classList.remove("hidden");

  // Début de la partie
  afficherquestion(questionTable);
});

// Bouton Rejouer
rejouer.addEventListener("click", () => {
  registrationSection.classList.remove("hidden");
  gameSection.classList.add("hidden");
  registrationInput.value = "";
});

let jokerbtn = document.getElementById("joker");
if (jokerbtn) {
  jokerbtn.addEventListener("click", () => {
    if (jokerDisponible === false) {
      alert("Vous avez déjà utilisé votre Joker !");
      return;
    }

    score += 10;
    points.innerHTML = `<p>${score}</p>`;
    questionIndex++;
    
    // Désactive et masque le joker pour cette partie
    jokerDisponible = false;
    jokerbtn.classList.add("hidden");

    // Passe au problème suivant
    afficherquestion(questionTable);
  });
}

// Écouteurs des clics sur les réponses
ans1.addEventListener("click", () => verifierreponse(ans1.textContent.trim()));
ans2.addEventListener("click", () => verifierreponse(ans2.textContent.trim()));
ans3.addEventListener("click", () => verifierreponse(ans3.textContent.trim()));
ans4.addEventListener("click", () => verifierreponse(ans4.textContent.trim()));
