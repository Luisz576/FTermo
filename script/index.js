class Game {
    // data
    words

    // html elements
    elements

    // vars
    wordLength
    currentWord
    canType = false

    currentTry = 0
    types

    resetAndStart() {
        this.canType = false
        this.types = []
        this.currentWord = null
        this.wordLength = 0
        this.pickWord()
        for (let i = 0; i < NUNMBER_OF_TRIES; i++) {
            let w = []
            for (let j = 0; j < this.wordLength; j++) {
                w.push({
                    "key": " ",
                    "clue": ""
                })
            }
            this.types.push(w)
        }
        this.currentTry = 0
        this.elements = {}
        this.canType = true;
        this.renderScreen()
    }

    // TODO: should have a setup elements and render just set values
    renderScreen() {
        this.elements = {
            gameContent: null,
            rows: {}
        }
        this.elements["gameContent"] = document.getElementsByClassName("game-content")[0]
        this.elements["gameContent"].innerHTML = ""
        for (let i = 0; i < NUNMBER_OF_TRIES; i++) {
            const row = document.createElement("div");
            row.id = "game-row-" + (i + 1);
            row.className = `game-row ${this.currentTry == i ? "row-current" : ""}`;

            this.elements["rows"]["r" + i] = row

            for (let j = 0; j < this.wordLength; j++) {
                const input = document.createElement("div");
                const keyData = this.types[i][j]
                input.className = `game-row-input game-row-input-${j + 1} ${keyData["clue"]}`;
                input.innerHTML += keyData["key"];
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

    pickWord() {
        this.currentWord = [...this.words][Math.floor(Math.random() * this.words.size)];
        this.wordLength = this.currentWord.length
    }

    onType(key) {
        key = key.toUpperCase()
        if (!this.canType) {
            return;
        }
        if (key === "DELETE" || key === "BACKSPACE") {
            this.undoType()
            return
        }
        if (key === "ENTER") {
            this.doTry()
            return
        }
        if (key.length !== 1 || !/^[a-zA-Z]$/.test(key)) {
            return
        }
        for (let i = 0; i < this.wordLength; i++) {
            if (this.types[this.currentTry][i]["key"] == " ") {
                this.types[this.currentTry][i]["key"] = key
                break;
            }
        }
        this.renderScreen();
    }

    undoType() {
        if (!this.canType) {
            return;
        }
        for (let i = this.wordLength - 1; i >= 0; i--) {
            if (this.types[this.currentTry][i]["key"] != " ") {
                this.types[this.currentTry][i]["key"] = " "
                break;
            }
        }
        this.renderScreen();
    }

    doTry() {
        if (!this.canType) {
            return;
        }
        let wordTry = ""
        for (let i = 0; i < this.wordLength; i++) {
            if (this.types[this.currentTry][i]["key"] == " ") {
                return
            }
            wordTry = wordTry + this.types[this.currentTry][i]["key"]
        }
        if (this.currentWord.toUpperCase() === wordTry.toUpperCase()) {
            // TODO: WIN
            alert("Ganhou :)");
        } else if(this.currentTry+1 < NUNMBER_OF_TRIES) {
            this.setupClueToCurrentTry();
            this.currentTry++
        } else {
            // Lose
            alert("Perdeu :)");
        }
    }

    setupClueToCurrentTry() {

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
