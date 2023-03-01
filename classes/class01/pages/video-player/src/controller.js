export default class Controller {
  construtor({}) {

  }

  static async initialize(deps) {
    const controller = new Controller(deps)
    return controller.init()
  }

  async init() {
    console.log('init')
  }
}