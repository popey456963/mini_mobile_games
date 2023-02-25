import Canvas from './Canvas.js'
import Loc from './Loc.js'

export default class Render {
  constructor() {
    this.canvas = Canvas.init('canvas', this.render.bind(this))
    this.interval = setInterval(this.tick.bind(this), 1000 / 60)

    this.reset()
    this.render()
  }

  reset() {
    this.state = {
      a: 0,
      a_speed: (Math.random() - 0.5) / 100,
      a_points: [],
      b: 0,
      b_speed: (Math.random() - 0.5) / 100,
      b_points: [],
      gravity: 1,
      time: 0,
      ended: false,
      pause: 60,
    }
  }

  onClick(event) {
    const loc = Loc.fromAbsolute(this.canvas, event.x, event.y)

    if (Math.sqrt((loc.x - 50) * (loc.x - 50) + (loc.y - 15) * (loc.y - 15)) < 10) {
      this.reset()
    }

    const team = loc.x < 50
    const direction = loc.y < 50

    let strength = 0.001

    //console.log(team, direction)

    if (team) {
      this.state.a_speed += (direction * 2 - 1) * strength
    } else {
      this.state.b_speed += (direction * 2 - 1) * strength
    }
  }

  render() {
    if (!this.canvas) return

    this.canvas.clear()

    this.canvas.drawRect(new Loc(0, 0), new Loc(100, 100), {
      fillStyle: '#1F1B2E',
    })

    let lineOptions = {
      strokeStyle: [255, 200, 200, 200],
      shadowBlur: 40,
      shadowColor: '#aaaaaa',
      lineWidth: 4,
      lineCap: 'round',
    }

    this.canvas.drawLine(new Loc(5, 50), new Loc(this.state.a_points[0], this.state.a_points[1]), {
      ...lineOptions,
    })
    this.canvas.drawLine(new Loc(5, 50), new Loc(this.state.a_points[2], this.state.a_points[3]), {
      ...lineOptions,
    })
    this.canvas.drawLine(
      new Loc(this.state.a_points[0], this.state.a_points[1]),
      new Loc(this.state.a_points[2], this.state.a_points[3]),
      {
        ...lineOptions,
      }
    )

    lineOptions = {
      strokeStyle: [200, 255, 200, 200],
      shadowBlur: 40,
      shadowColor: '#aaaaaa',
      lineWidth: 4,
      lineCap: 'round',
    }

    this.canvas.drawLine(new Loc(95, 50), new Loc(this.state.b_points[0], this.state.b_points[1]), {
      ...lineOptions,
    })
    this.canvas.drawLine(new Loc(95, 50), new Loc(this.state.b_points[2], this.state.b_points[3]), {
      ...lineOptions,
    })
    this.canvas.drawLine(
      new Loc(this.state.b_points[0], this.state.b_points[1]),
      new Loc(this.state.b_points[2], this.state.b_points[3]),
      {
        ...lineOptions,
      }
    )

    this.renderClock()

    if (this.state.ended) {
      this.canvas.drawText(new Loc(50, 15), '⟳', {
        font: "15vmin 'Tilt Neon'",
        fillStyle: [85, 80, 255, 255],
      })
    }
  }

  renderClock() {
    this.canvas.drawArc(new Loc(50, 50), new Loc(10, 10), [50, 44, 97, 255], 0, 2 * Math.PI, {
      lineWidth: 10,
    })

    this.canvas.drawArc(
      new Loc(50, 50),
      new Loc(10, 10),
      [85, 80, 255, 255],
      1.5 * Math.PI,
      1.5 * Math.PI + (2 * Math.PI * (this.state.time % 60000)) / 60000,
      {
        lineWidth: 10,
        shadowBlur: 30,
        shadowColor: '#5550FF',
        shadowOffsetX: 0,
        adowOffsetY: 0,
        lineCap: 'round',
      }
    )

    this.canvas.drawText(new Loc(50, 50), String(parseInt(this.state.time)), {
      font: "20vmin 'Tilt Neon'",
      fillStyle: [85, 80, 255, 255],
    })
  }

  calculate_points() {
    const triangle_width = 0.05 + 0.02 * this.state.gravity
    const length = 20
    this.state.a_points[0] = 5 + length * Math.cos(this.state.a + triangle_width)
    this.state.a_points[1] =
      50 + (length * Math.sin(this.state.a + triangle_width) * this.canvas.size.x) / this.canvas.size.y
    this.state.a_points[2] = 5 + length * Math.cos(this.state.a - triangle_width)
    this.state.a_points[3] =
      50 + (length * Math.sin(this.state.a - triangle_width) * this.canvas.size.x) / this.canvas.size.y

    this.state.b_points[0] = 95 - length * Math.cos(this.state.b + triangle_width)
    this.state.b_points[1] =
      50 + (length * Math.sin(this.state.b + triangle_width) * this.canvas.size.x) / this.canvas.size.y
    this.state.b_points[2] = 95 - length * Math.cos(this.state.b - triangle_width)
    this.state.b_points[3] =
      50 + (length * Math.sin(this.state.b - triangle_width) * this.canvas.size.x) / this.canvas.size.y
  }

  tick() {
    this.render()

    if (
      this.state.a_points[0] <= 5 ||
      this.state.a_points[2] <= 5 ||
      this.state.b_points[0] >= 95 ||
      this.state.b_points[2] >= 95 ||
      this.state.ended
    ) {
      //this.state.a -= this.state.a % (Math.PI / 2)
      //this.calculate_points()
      this.state.ended = true
      return
    }

    this.calculate_points()

    if (this.state.pause > 0) {
      this.state.pause -= 1
      return
    }

    this.state.a += this.state.a_speed
    this.state.b += this.state.b_speed
    //this.state.a %= 2 * Math.PI
    //console.log('speed change', Math.sin(this.state.a) * 0.0002)
    this.state.a_speed += Math.sin(this.state.a) * 0.0002 * this.state.gravity
    this.state.b_speed += Math.sin(this.state.b) * 0.0002 * this.state.gravity
    this.state.gravity += 0.01
    this.calculate_points()
    this.state.time += 1000 / 60
  }
}
