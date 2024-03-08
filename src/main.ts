import './style.css'

import Alpine from 'alpinejs'
import { loadConfig, AppConfig } from './config.js'
import { Context, Stats } from 'gsots3d'
import { buildWorld } from './builder.js'

let ctx: Context
let config = {} as AppConfig

const RATIO_16_9 = 0.5625
const RATIO_4_3 = 0.75

Alpine.data('app', () => ({
  width: 0,
  height: 0,
  fullWidth: true,
  smooth: true,
  aspectRatio: RATIO_16_9,

  levelName: '',
  showHelp: true,
  stats: '',
  error: '',

  async init() {
    this.width = 800
    this.height = this.width * this.aspectRatio
    this.resizeCanvas()

    ctx = await Context.init()
    ctx.start()
    ctx.camera.far = config.drawDistance
    ctx.camera.fov = config.fov
    ctx.gamma = config.gamma
    ctx.globalLight.ambient = [config.ambient, config.ambient, config.ambient]
    ctx.globalLight.enabled = false
    ctx.resize()

    config.textureFilter = false
    this.loadLevel(window.location.hash ? window.location.hash.slice(1) : 'TR1/01-Caves.PHD')

    this.$watch('levelName', (value) => {
      this.loadLevel(value)
    })

    this.$watch('width', (value) => {
      this.height = value * this.aspectRatio
      this.resizeCanvas()
    })

    setTimeout(() => {
      this.showHelp = false
    }, 3000)

    setInterval(() => {
      this.stats = `FPS:   ${Stats.FPS}
Draws: ${Stats.drawCalls}
Inst:  ${Stats.instances}
Tris:  ${Stats.triangles}
Time:  ${Stats.totalTime.toFixed(2)}`
    }, 1000)
  },

  // Manually resize the canvas, rather than using Alpine
  resizeCanvas() {
    const c = this.$refs.canvas as HTMLCanvasElement
    c.width = this.width
    c.height = this.height
    if (ctx) ctx.resize(true)
  },

  // Load a new level, wraps the buildWorld function
  async loadLevel(levelName: string) {
    config.startPos = undefined
    this.levelName = levelName
    window.location.hash = levelName

    try {
      await buildWorld(config, ctx, levelName)
    } catch (e) {
      this.showHelp = false
      this.error = e as string
    }
  },

  // Change texture filtering, requires a world rebuild
  async texFilter(e: Event) {
    config.startPos = ctx.camera.position
    config.textureFilter = (e.target as HTMLInputElement).checked
    try {
      await buildWorld(config, ctx, this.levelName)
    } catch (e) {
      this.showHelp = false
      this.error = e as string
    }
  },

  // Change brightness, requires us to update all lights
  brightness(e: Event) {
    config.lightBright = parseFloat((e.target as HTMLInputElement).value)
    console.log('Light brightness: ' + config.lightBright)

    for (const light of ctx.lights) {
      const i = light.metadata.intensity as number
      light.colour = [config.lightBright * i, config.lightBright * i, config.lightBright * i]
    }
  },

  // Toggle widescreen aspect ratio
  widescreen(e: Event) {
    this.aspectRatio = (e.target as HTMLInputElement).checked ? RATIO_16_9 : RATIO_4_3
    this.height = this.width * this.aspectRatio

    this.resizeCanvas()
  },
}))

config = await loadConfig() // Can't call inside init() for canvas sizing reasons
Alpine.start()
