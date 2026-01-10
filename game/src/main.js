import Phaser from "phaser"

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#d36060",

   render: {
    pixelArt: true,
    antialias: false
  },

  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

new Phaser.Game(config)

let player
let cursors

function preload() {
  this.load.spritesheet("player", "player.png", {
    frameWidth: 1024,
    frameHeight: 1024
  })
  console.log("loading sprite")
}


function create() {
  player = this.physics.add.sprite(0, 0, "player", 16)

  this.anims.create({
  key: "walk_left",
  frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
  frameRate: 8,
  repeat: -1
})

this.anims.create({
  key: "walk_right",
  frames: this.anims.generateFrameNumbers("player", { start: 4, end: 7 }),
  frameRate: 8,
  repeat: -1
})

this.anims.create({
  key: "walk_up",
  frames: this.anims.generateFrameNumbers("player", { start: 8, end: 11 }),
  frameRate: 8,
  repeat: -1
})

this.anims.create({
  key: "walk_down",
  frames: this.anims.generateFrameNumbers("player", { start: 12, end: 15 }),
  frameRate: 8,
  repeat: -1
})

this.anims.create({
  key: "idle",
  frames: [{ key: "player", frame: 16 }],
  frameRate: 1
})


  player.play("idle")

  this.cameras.main.startFollow(player)
  this.cameras.main.setZoom(0.15)

  cursors = this.input.keyboard.createCursorKeys()
}


function update() {
  let speed = 200
  let moving = false

  player.setVelocity(0)

  if (cursors.right.isDown) {
    player.setVelocityX(-speed)
    player.play("walk_right", true)
    moving = true
  }
  else if (cursors.left.isDown) {
    player.setVelocityX(speed)
    player.play("walk_left", true)
    moving = true
  }
  else if (cursors.up.isDown) {
    player.setVelocityY(-speed)
    player.play("walk_up", true)
    moving = true
  }
  else if (cursors.down.isDown) {
    player.setVelocityY(speed)
    player.play("walk_down", true)
    moving = true
  }

  if (!moving) {
    player.play("idle", true)
  }
}
