const element = {
    selections: document.getElementById('selections'),
    canvas: document.getElementById('canvas'),
    pen: document.getElementById('pen'),
    eraser: document.getElementById('eraser'),
    clear: document.getElementById('clear'),
    download: document.getElementById('download'),
    thinLine: document.getElementById('thinLine'),
    strongLine: document.getElementById('strongLine'),
    black: document.getElementById('black'),
    red: document.getElementById('red'),
    yellow: document.getElementById('yellow'),
    blue: document.getElementById('blue'),
}

const actions = {
    ctx: element.canvas.getContext('2d'),
    drawLine(x1, y1, x2, y2) {
        this.ctx.beginPath()
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        this.ctx.stroke()
    },
    getDivHeight() {
        let str = window.getComputedStyle(element.selections).getPropertyValue('height')
        return parseInt(str.substring(0, str.length - 2))
    },
    myPicture(status) {
        let divHeight = this.getDivHeight()
        let painting = false
        let last
        let isTouchDevice = 'ontouchstart' in document.documentElement;
        if (isTouchDevice) {
            element.canvas.ontouchstart = (e) => {
                last = [e.touches[0].clientX, e.touches[0].clientY]
            }
            element.canvas.ontouchmove = (e) => {
                let x = e.touches[0].clientX
                let y = e.touches[0].clientY
                this.drawLine(last[0], last[1], x, y)
                last = [x, y]
            }
        } else {
            element.canvas.onmousedown = (e) => {
                painting = true
                last = [e.clientX, e.clientY]
            }
            element.canvas.onmouseup = () => {
                painting = false
            }
            element.canvas.onmousemove = (e) => {
                if (painting) {
                    if (status === 'painting') {
                        this.drawLine(last[0], last[1] - divHeight, e.clientX, e.clientY - divHeight)
                        last = [e.clientX, e.clientY]
                    } else if (status === 'erasing') {
                        this.ctx.clearRect(last[0] - 5, last[1] - 5 - divHeight, 10, 10)
                        last = [e.clientX, e.clientY]
                    }
                }
            }
        }
    },
    clearCanvas() {
        this.ctx.clearRect(0, 0, element.canvas.width, element.canvas.height)
        this.myPicture('painting')
    },
    downloadCanvas() {
        let url = element.canvas.toDataURL()
        let a = document.createElement('a')
        a.download = 'myPainting.png'
        a.href = url
        a.click()
    },
    listenToUsers() {
        element.pen.onclick = () => {
            this.myPicture('painting')
        }
        element.eraser.onclick = () => {
            this.myPicture('erasing')
        }
        element.clear.onclick = () => {
            this.clearCanvas()
        }
        element.download.onclick = () => {
            this.downloadCanvas()
        }
        element.thinLine.onclick = () => {
            this.ctx.lineWidth = 5
            this.myPicture('painting')
        }
        element.strongLine.onclick = () => {
            this.ctx.lineWidth = 10
            this.myPicture('painting')
        }
        element.black.onclick = () => {
            this.ctx.strokeStyle = 'black'
            this.myPicture('painting')
        }
        element.red.onclick = () => {
            this.ctx.strokeStyle = "red"
            this.myPicture('painting')
        }
        element.yellow.onclick = () => {
            this.ctx.strokeStyle = "yellow"
            this.myPicture('painting')
        }
        element.blue.onclick = () => {
            this.ctx.strokeStyle = "blue"
            this.myPicture('painting')
        }
    },
    init() {
        element.canvas.width = document.documentElement.clientWidth
        element.canvas.height = document.documentElement.clientHeight - this.getDivHeight()
        this.ctx.strokeStyle = 'black'
        this.ctx.lineWidth = 5
        this.ctx.lineCap = 'round'
        this.myPicture('painting')
        this.listenToUsers()
    }
}

actions.init()
