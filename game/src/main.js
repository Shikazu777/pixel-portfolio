import Phaser from "phaser"

let map
let player
let cursors
let keys
let mobile = { left:false, right:false, up:false, down:false }

const SCALE = 4
const PLAYER_SCALE = 0.15

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#000000",
  render: { pixelArt: true, antialias: false },
  physics: { default: "arcade", arcade: { debug: false } },
  scene: { preload, create, update }
}

new Phaser.Game(config)

function preload() {
  this.load.spritesheet("player", "player.png", { frameWidth: 1024, frameHeight: 1024 })
  this.load.tilemapTiledJSON("map", "map.json")
  this.load.image("tiles", "tiles.png")
}

function create() {
  // MAP
  map = this.make.tilemap({ key: "map" })
  const tileset = map.addTilesetImage("Overworld", "tiles")

  const worldWidth = map.widthInPixels * SCALE
  const worldHeight = map.heightInPixels * SCALE

  // PLAYER
  player = this.physics.add.sprite(worldWidth / 2, worldHeight / 2, "player", 16)
  player.setScale(PLAYER_SCALE)
  player.setDepth(10)
  player.setCollideWorldBounds(true)

  // LAYERS + COLLISION
  map.layers.forEach((_, i) => {
    const layer = map.createLayer(i, tileset, 0, 0)
    layer.setScale(SCALE)
    layer.setCollisionByProperty({ collides: true })
    this.physics.add.collider(player, layer)
  })

  // 🎥 CINEMATIC CAMERA
  this.physics.world.setBounds(0, 0, worldWidth, worldHeight)
  this.cameras.main.setBounds(0, 0, worldWidth, worldHeight)
  this.cameras.main.startFollow(player, true, 0.08, 0.08)
  this.cameras.main.setZoom(1.15)

  // ANIMS
  this.anims.create({ key: "walk_right", frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }), frameRate: 8, repeat: -1 })
  this.anims.create({ key: "walk_left", frames: this.anims.generateFrameNumbers("player", { start: 4, end: 7 }), frameRate: 8, repeat: -1 })
  this.anims.create({ key: "walk_up", frames: this.anims.generateFrameNumbers("player", { start: 8, end: 11 }), frameRate: 8, repeat: -1 })
  this.anims.create({ key: "walk_down", frames: this.anims.generateFrameNumbers("player", { start: 12, end: 15 }), frameRate: 8, repeat: -1 })
  this.anims.create({ key: "idle", frames: [{ key: "player", frame: 16 }], frameRate: 1 })
  player.play("idle")

  // HOUSE ZONES
  const houseLayer = map.getObjectLayer("Houses")
  if (houseLayer) {
    houseLayer.objects.forEach(house => {
      const zone = this.add.zone(house.x * SCALE, house.y * SCALE, house.width * SCALE, house.height * SCALE)
      this.physics.world.enable(zone)
      zone.body.setAllowGravity(false)
      zone.body.setImmovable(true)
      zone.url = house.properties?.find(p => p.name === "url")?.value
      zone.inside = false

      const label = this.add.text(zone.x, zone.y - 20, house.name.toUpperCase(),
        { font:"16px Arial", fill:"#fff", backgroundColor:"#000", padding:{x:6,y:3} })
      label.setDepth(20)

      this.physics.add.overlap(player, zone, () => {
        if (!zone.inside && zone.url) {
          zone.inside = true
          window.open(zone.url, "_blank")
        }
      })

      zone.update = () => {
        if (!Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), zone.getBounds())) {
          zone.inside = false
        }
      }
      this.events.on("update", zone.update)
    })
  }

  // KEYBOARD
  cursors = this.input.keyboard.createCursorKeys()
  keys = this.input.keyboard.addKeys("W,A,S,D")

  // 📱 MOBILE D-PAD (FIXED POSITION)
  const style = { font:"32px Arial", fill:"#fff", backgroundColor:"#000", padding:{x:14,y:10} }

  const margin = 90
  const baseX = margin
  const baseY = this.scale.height - margin

  const up = this.add.text(baseX+100, baseY-150, "▲", style).setScrollFactor(0).setInteractive()
  const down = this.add.text(baseX+100, baseY-50, "▼", style).setScrollFactor(0).setInteractive()
  const left = this.add.text(baseX+50,baseY-100, "◀", style).setScrollFactor(0).setInteractive()
  const right = this.add.text(baseX+150, baseY-100, "▶", style).setScrollFactor(0).setInteractive()

  up.on("pointerdown",()=>mobile.up=true)
  up.on("pointerup",()=>mobile.up=false)
  down.on("pointerdown",()=>mobile.down=true)
  down.on("pointerup",()=>mobile.down=false)
  left.on("pointerdown",()=>mobile.left=true)
  left.on("pointerup",()=>mobile.left=false)
  right.on("pointerdown",()=>mobile.right=true)
  right.on("pointerup",()=>mobile.right=false)
}

function update() {
  const speed = 450
  let moving = false

  player.setVelocity(0)

  const left = cursors.left.isDown || keys.A.isDown || mobile.left
  const right = cursors.right.isDown || keys.D.isDown || mobile.right
  const up = cursors.up.isDown || keys.W.isDown || mobile.up
  const down = cursors.down.isDown || keys.S.isDown || mobile.down

  if (left) {
    player.setVelocityX(-speed)
    player.play("walk_right", true)
    moving = true
  }
  else if (right) {
    player.setVelocityX(speed)
    player.play("walk_left", true)
    moving = true
  }
  else if (up) {
    player.setVelocityY(-speed)
    player.play("walk_up", true)
    moving = true
  }
  else if (down) {
    player.setVelocityY(speed)
    player.play("walk_down", true)
    moving = true
  }

  if (!moving) player.play("idle", true)
}
