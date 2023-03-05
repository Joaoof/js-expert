export default class Controller {
  #view
  #camera  
  #worker
  #blinkCounter = 0
  constructor({view, worker, camera}) {
    this.#view = view
    this.#camera = camera
    this.#worker = this.#configureWorker(worker)

    this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
  }

  static async initialize(deps) {
    const controller = new Controller(deps)
    controller.log('not yet detecting eye blink! click in thw button to start')
    return controller.init()
  }
  #configureWorker(worker) {
    worker.onmessage = ({ data }) => {
      if('READY' === data) {
        console.log('worker is ready')
        let ready = false
        this.#view.enableButton()
        ready = true
        return
      }

      const blinked = data.blinked
      this.#blinkCounter += blinked
      console.log('blinked', blinked)
    }

    return {
      send (msg) {
        if(!ready) return; 
        worker.postMessage(msg)
      }
    }
  }

  async init() {
    console.log('init')
  }

  loop() {
    const video = this.#camera.video
    const img = this.#view.getVideoFrame(video)
    this.#worker.send(img)
    this.log(`detecting eye blink`)

    setTimeout(() => this.loop, 100);
  }
  log(text) {
    this.#view.log(`logger: ${text}`)
  }  
  onBtnStart() {
    this.log('Initializing detection...')
    this.#blinkCounter = 0
    this.loop()
  }
}