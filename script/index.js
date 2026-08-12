class Game {
    // data
    words

    // html elements
    elements

    // vars
    currentWord
    canType = false

    currentTry = 0
    types

    resetAndStart(){
        this.canType = false
        this.types = []
        for(let i = 0; i < NUNMBER_OF_TRIES; i++){
            let w = []
            for(let j = 0; j < WORD_LENGTH; j++){
                w.push(" ")
            }
            this.types.push(w)
        }
        this.currentTry = 0
        this.elements = {}
        this.currentWord = null
        this.pickWord()
        this.canType = true;
        this.renderScreen()
    }

    renderScreen(){
        this.elements = {
            gameContent: null,
            rows: {}
        }
        this.elements["gameContent"] = document.getElementsByClassName("game-content")[0]
        this.elements["gameContent"].innerHTML = ""
        for(let i = 0; i < NUNMBER_OF_TRIES; i++){
            const row = document.createElement("div");
            row.id = "game-row-" + (i + 1);
            row.className = `game-row ${this.currentTry == i ? "row-current" : ""}`;

            this.elements["rows"]["r"+i] = row

            for (let j = 0; j < WORD_LENGTH; j++) {
                const input = document.createElement("div");
                input.className = `game-row-input game-row-input-${j + 1}`;
                input.innerHTML += this.types[i][j];
                row.appendChild(input);
            }

            this.elements["gameContent"].appendChild(row);
        }
    }

    async initialize() {
        // load data
        this.words = new Set(data.words);

        this.resetAndStart();
    }

    pickWord(){
        this.currentWord = [...this.words][Math.floor(Math.random() * this.words.size)];
    }

    onType(key){
        key = key.toUpperCase()
        if(!this.canType){
            return;
        }
        if (key === "DELETE" || key === "BACKSPACE") {
            this.undoType()
            return
        }
        if (key.length !== 1 || !/^[a-zA-Z]$/.test(key)) {
            return
        }
        for(let i = 0; i < WORD_LENGTH; i++){
            if(this.types[this.currentTry][i] == " "){
                this.types[this.currentTry][i] = key
                break;
            }
        }
        this.renderScreen();
    }

    undoType() {
        if(!this.canType){
            return;
        }
        for(let i = WORD_LENGTH - 1; i >= 0; i--){
            if(this.types[this.currentTry][i] != " "){
                this.types[this.currentTry][i] = " "
                break;
            }
        }
        this.renderScreen();
    }
}

const game = new Game();
game.initialize();

function onKeyPressed(key) {
    game.onType(key.toUpperCase())
}

document.addEventListener("keydown", (event) => {
    game.onType(event.key);
});
