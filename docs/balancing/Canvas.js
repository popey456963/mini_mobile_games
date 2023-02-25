function noop() {
  /* nothing to see here */
}

export default class Canvas {
  constructor(canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')

    this.size = {
      y: window.innerHeight,
      x: window.innerWidth,
    }
    this.edge = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight
    this.xOffset = window.innerWidth > window.innerHeight ? (window.innerWidth - window.innerHeight) / 2 : 0
  }

  static init(id, onResize = noop) {
    const element = document.getElementById(id)

    window.addEventListener('resize', resizeCanvas, false)

    const canvas = new Canvas(element)

    function resizeCanvas() {
      element.width = window.innerWidth
      element.height = window.innerHeight

      canvas.size = {
        y: window.innerHeight,
        x: window.innerWidth,
      }

      canvas.edge = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight
      canvas.xOffset = window.innerWidth > window.innerHeight ? (window.innerWidth - window.innerHeight) / 2 : 0

      onResize(canvas)
    }

    resizeCanvas()

    return canvas
  }

  drawArc(center, size, colour, start, end, options = {}) {
    this.context.save()
    Object.assign(this.context, options)

    this.context.beginPath()

    if (options.setLineDashArray) {
      this.context.setLineDash(options.setLineDashArray)
    }

    this.context.strokeStyle = `rgba(${colour.join(',')})`
    this.context.arc(center.pointX(this), center.pointY(this), size.sizeX(this), start, end)
    this.context.stroke()
    this.context.restore()
  }

  drawText(loc, text, options = {}) {
    // console.log('drawing text', loc.pointX(this), loc.pointY(this))
    Object.assign(
      this.context,
      {
        font: '3vmin Arial',
        fillStyle: 'black',
        textBaseline: 'middle',
        textAlign: 'center',
      },
      options
    )

    if (options.fillStyle) {
      // console.log(options.fillStyle)
      this.context.fillStyle = `rgba(${options.fillStyle.join(',')})`
    }

    this.context.fillText(text, loc.pointX(this), loc.pointY(this))

    return this.context.measureText(text)
  }

  drawLine(from, to, options = {}) {
    this.context.save()
    this.context.beginPath()

    Object.assign(
      this.context,
      {
        strokeStyle: 'black',
      },
      options
    )

    if (options.strokeStyle) {
      this.context.strokeStyle = `rgba(${options.strokeStyle.join(',')})`
    }

    this.context.moveTo(from.pointX(this), from.pointY(this))
    this.context.lineTo(to.pointX(this), to.pointY(this))
    this.context.stroke()
    this.context.restore()
  }

  drawRect(from, to, options = {}) {
    Object.assign(this.context, options)
    this.context.fillRect(from.pointX(this), from.pointY(this), to.pointX(this), to.pointY(this))
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}
