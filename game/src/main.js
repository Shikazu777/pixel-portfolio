import Phaser from "phaser"

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#d36060",

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
    frameWidth: 32,
    frameHeight: 32
  })
  console.log("loading sprite")
}


function create() {
  player = this.physics.add.sprite(400, 300, "player", 0)
  this.cameras.main.startFollow(player)
  this.cameras.main.setZoom(4)


  this.anims.create({
    key: "walk",
    frames: this.anims.generateFrameNumbers("player", {
      start: 0,
      end: 3
    }),
    frameRate: 8,
    repeat: -1
  })

  player.play("walk")

  cursors = this.input.keyboard.createCursorKeys()
  console.log("sprite created")
}


function update() {
  player.setVelocity(0)

  if (cursors.left.isDown) player.setVelocityX(-200)
  if (cursors.right.isDown) player.setVelocityX(200)
  if (cursors.up.isDown) player.setVelocityY(-200)
  if (cursors.down.isDown) player.setVelocityY(200)
}
