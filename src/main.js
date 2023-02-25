class Entity {
    constructor(x, y) {
        this.collision = 'none'
        this.x = x
        this.y = y
    }

    update() { console.warn(`${this.constructor.name} needs an update() function`) }
    draw() { console.warn(`${this.constructor.name} needs a draw() function`) }
    isDead() { console.warn(`${this.constructor.name} needs an isDead() function`) }

    static testCollision(a, b) {
        if(a.collision === 'none') {
            console.warn(`${a.constructor.name} needs a collision type`)
            return undefined
        }
        if(b.collision === 'none') {
            console.warn(`${b.constructor.name} needs a collision type`)
            return undefined
        }
        if(a.collision === 'circle' && b.collision === 'circle') {
            return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2) < a.radius + b.radius
        }
        if(a.collision === 'circle' && b.collision === 'rect' || a.collision === 'rect' && b.collision === 'circle') {
            let circle = a.collision === 'circle' ? a : b
            let rect = a.collision === 'rect' ? a : b
            // this is a waaaaaay simplified collision that just works in this case (circle always comes from the bottom)
            const topOfBallIsAboveBottomOfRect = circle.y - circle.radius <= rect.y + rect.height / 2
            const bottomOfBallIsBelowTopOfRect = circle.y + circle.radius >= rect.y - rect.height / 2
            const ballIsRightOfRectLeftSide = circle.x + circle.radius >= rect.x - rect.width / 2
            const ballIsLeftOfRectRightSide = circle.x - circle.radius <= rect.x + rect.width / 2
            return topOfBallIsAboveBottomOfRect && bottomOfBallIsBelowTopOfRect && ballIsRightOfRectLeftSide && ballIsLeftOfRectRightSide
        }
        console.warn(`there is no collision function defined for a ${a.collision} and a ${b.collision}`)
        return undefined
    }
}

class Ball extends Entity {
    constructor(x, y) {
        super(x, y)
        this.collision = 'circle'
        this.speed = 300 // px per second
        this.radius = 10 // radius in px
    }

    update({deltaTime}) {
        this.y -= this.speed * deltaTime / 1000 // deltaTime is ms so we divide by 1000
    }

    /** @param {CanvasRenderingContext2D} context */
    draw(context) {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        context.fill()
    }

    isDead(player) {
        const outOfBounds = this.y < 0 - this.radius
        const collidesWithPlayer = Entity.testCollision(player, this)
        return outOfBounds || collidesWithPlayer
    }
}

class Paddle extends Entity {
    constructor() {
        super(150, 50)
        this.collision = 'rect'
        this.speed = 200
        this.width = 50
        this.height = 10
    }

    update({deltaTime, inputs}) {
        this.x += this.speed * deltaTime / 1000 * inputs.direction
    }

    /** @param {CanvasRenderingContext2D} context */
    draw(context) { 
        context.beginPath()
        context.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
        context.fill()
    }

    isDead() { return false }
}

class InputsManager {
    constructor() {
        this.direction = 0
        window.addEventListener('keydown', this.onKeydown.bind(this))
        window.addEventListener('keyup', this.onKeyup.bind(this))
    }

    onKeydown(event) {
        switch (event.key) {
            case 'ArrowLeft':
                this.direction = -1
                break
            case 'ArrowRight':
                this.direction = 1
                break
        }
    }

    onKeyup(event) {
        switch (event.key) {
            case 'ArrowLeft':
                if(this.direction === -1) 
                    this.direction = 0
                break
            case 'ArrowRight':
                this.direction = 1
                if(this.direction === 1)
                    this.direction = 0
                break
        }
    }
}

class Game {
    /** @param {HTMLCanvasElement} canvas */
    constructor(canvas) {
        this.entities = [] // contains all game entities (Balls, Paddles, ...)
        this.context = canvas.getContext('2d')
        this.newBallInterval = 500 // ms between each ball
        this.lastBallCreated = -Infinity // timestamp of last time a ball was launched
    }

    start() {
        this.lastUpdate = performance.now()
        this.player = new Paddle()
        this.entities.push(this.player)
        this.inputsManager = new InputsManager()
        this.loop()
    }

    update() {
        // calculate time elapsed
        const newTime = performance.now()
        const deltaTime = newTime - this.lastUpdate

        // update every entity
        const frameData = {
            deltaTime,
            inputs: this.inputsManager,
        }
        this.entities.forEach(entity => entity.update(frameData))

        // other update logic (here, create new entities)
        if(this.lastBallCreated + this.newBallInterval < newTime) {
            const ball = new Ball(this.player.x, 300)
            this.entities.push(ball)
            this.lastBallCreated = newTime
        }

        // remember current time for next update
        this.lastUpdate = newTime
    }

    draw() {
        this.entities.forEach(entity => entity.draw(this.context))
    }

    cleanup() {
        // to prevent memory leak, don't forget to cleanup dead entities
        this.entities.forEach(entity => {
            if(entity.isDead(this.player)) {
                const index = this.entities.indexOf(entity)
                this.entities.splice(index, 1)
            }
        })
    }

    loop() {
        requestAnimationFrame(() => {
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
            this.update()
            this.draw()
            this.cleanup()
            this.loop()
        })
    }
}

const canvas = document.querySelector('canvas')
const game = new Game(canvas)
game.start()