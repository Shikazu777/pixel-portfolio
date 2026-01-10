import Phaser from "phaser"

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#1d1d1d",
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
  this.load.image("player", "/player.png")
}

function create() {
  player = this.physics.add.sprite(400, 300, "player")
  cursors = this.input.keyboard.createCursorKeys()
}

function update() {
  player.setVelocity(0)

  if (cursors.left.isDown) player.setVelocityX(-200)
  if (cursors.right.isDown) player.setVelocityX(200)
  if (cursors.up.isDown) player.setVelocityY(-200)
  if (cursors.down.isDown) player.setVelocityY(200)
}
