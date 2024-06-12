import { Point } from 'pixi.js'

export function randomVector(): Point {
    const X: number = Math.random() * 2 - 1
    const Y: number = Math.random() * 2 - 1

    return new Point(X, Y).multiply(new Point(0.6, 0.6))
}

export function rotatePoint(point: Point, center: Point, angle: number): Point {
    const COS_THETA = Math.cos(angle)
    const SIN_THETA = Math.sin(angle)

    const TRANSLATED_X = point.x - center.x
    const TRANSLATED_Y = point.y - center.y

    const ROTATED_X = TRANSLATED_X * COS_THETA - TRANSLATED_Y * SIN_THETA
    const ROTATED_Y = TRANSLATED_X * SIN_THETA + TRANSLATED_Y * COS_THETA

    return new Point(ROTATED_X + center.x, ROTATED_Y + center.y)
}

export function randomColor() {
    // Generate random RGB values
    const R = Math.floor(Math.random() * 256)
    const G = Math.floor(Math.random() * 256)
    const B = Math.floor(Math.random() * 256)

    // Convert RGB to hexadecimal string
    const HEX = '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)

    return HEX
}

export function pointDistance(pointA: Point, pointB: Point) {
    return Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2))
}

export function randomIndex(length: number): number {
    return Math.floor(Math.random() * length)
}

export function computePathPoints(pointA: Point, pointB: Point, interval: number = 1): Point[] {
    const DIFF_X = pointB.x - pointA.x
    const DIFF_Y = pointB.y - pointA.y
    const DISTANCE = pointDistance(pointA, pointB)
    const POINT_NUM = Math.floor(DISTANCE / interval)

    const INTERVAL_X = DIFF_X / (POINT_NUM + 1)
    const INTERVAL_Y = DIFF_Y / (POINT_NUM + 1)

    if (POINT_NUM === 0) {
        return []
    }

    const POINTS = new Array(POINT_NUM)
    for (let i = 0; i < POINT_NUM; i++) {
        POINTS[i] = new Point(pointA.x + INTERVAL_X * (i + 1), pointA.y + INTERVAL_Y * (i + 1))
    }
    return POINTS
}
