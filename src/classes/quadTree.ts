import { Graphics, Point, Rectangle } from 'pixi.js'

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

        if (this.points.length < this.capacity) {
            this.points.push(point)
        } else {
            if (!this.divided) {
                this.subdivide()
            }

            this.topLeft?.insert(point)
            this.topRight?.insert(point)
            this.bottomLeft?.insert(point)
            this.bottomRight?.insert(point)
        }
    }

    subdivide() {
        const { x, y, width, height } = this.boundary

        const TL = new Rectangle(x, y, width / 2, height / 2)
        const TR = new Rectangle(x + width / 2, y, width / 2, height / 2)
        const BL = new Rectangle(x, y + height / 2, width / 2, height / 2)
        const BR = new Rectangle(x + width / 2, y + height / 2, width / 2, height / 2)

        this.topLeft = new QuadTree(TL, this.capacity)
        this.topRight = new QuadTree(TR, this.capacity)
        this.bottomLeft = new QuadTree(BL, this.capacity)
        this.bottomRight = new QuadTree(BR, this.capacity)

        this.divided = true
    }

    show(graphics: Graphics) {
        const { x, y, width, height } = this.boundary
        graphics.rect(x, y, width, height)
        graphics.stroke({ width: 1, color: 0xfeeb77 })

        if (this.divided) {
            this.topLeft?.show(graphics)
            this.topRight?.show(graphics)
            this.bottomLeft?.show(graphics)
            this.bottomRight?.show(graphics)
        }
    }
}
