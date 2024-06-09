import { Graphics, Point, Rectangle } from 'pixi.js'
import { darkMode } from '../globals'

const COLOR_LIGHT = 0xa5d8ff
const COLOR_DARK = 0x154163

export class QuadTree {
    public points: Point[] = []
    public boundary: Rectangle
    public capacity: number
    public divided: boolean = false
    public topLeft: QuadTree | null = null
    public topRight: QuadTree | null = null
    public bottomLeft: QuadTree | null = null
    public bottomRight: QuadTree | null = null

    constructor(boundary: Rectangle, capacity: number) {
        this.boundary = boundary
        this.capacity = capacity
    }

    insert(point: Point) {
        if (!this.boundary.contains(point.x, point.y)) return

        if (this.points.length < this.capacity && !this.divided) {
            this.points.push(point)
        } else {
            if (!this.divided) {
                this.subdivide()
            }
            const POINTS = [...this.points, point]

            POINTS.forEach((point) => {
                this.topLeft?.insert(point)
                this.topRight?.insert(point)
                this.bottomLeft?.insert(point)
                this.bottomRight?.insert(point)
            })
            this.points = []
        }
    }

    subdivide() {
        const { x: X, y: Y, width: WIDTH, height: HEIGHT } = this.boundary

        const TL = new Rectangle(X, Y, WIDTH / 2, HEIGHT / 2)
        const TR = new Rectangle(X + WIDTH / 2, Y, WIDTH / 2, HEIGHT / 2)
        const BL = new Rectangle(X, Y + HEIGHT / 2, WIDTH / 2, HEIGHT / 2)
        const BR = new Rectangle(X + WIDTH / 2, Y + HEIGHT / 2, WIDTH / 2, HEIGHT / 2)

        this.topLeft = new QuadTree(TL, this.capacity)
        this.topRight = new QuadTree(TR, this.capacity)
        this.bottomLeft = new QuadTree(BL, this.capacity)
        this.bottomRight = new QuadTree(BR, this.capacity)

        this.divided = true
    }

    show(graphics: Graphics) {
        const { x: X, y: Y, width: WIDTH, height: HEIGHT } = this.boundary
        graphics.rect(X, Y, WIDTH, HEIGHT)
        graphics.stroke({ width: 1, color: darkMode.value ? COLOR_DARK : COLOR_LIGHT })

        if (this.divided) {
            this.topLeft?.show(graphics)
            this.topRight?.show(graphics)
            this.bottomLeft?.show(graphics)
            this.bottomRight?.show(graphics)
        }
    }
}
