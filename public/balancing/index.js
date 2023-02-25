import Render from './Render.js'

document.addEventListener('DOMContentLoaded', async () => {
  const render = new Render()

  render.canvas.canvas.addEventListener('click', (event) => {
    // if (!document.fullscreenElement) {
    //   document.body.requestFullscreen()
    // }

    render.onClick.bind(render)(event)
  })
})
