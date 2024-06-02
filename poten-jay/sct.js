function scracth(_id, option = {}) {
    const canvas = document.getElementById(_id);
    let ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let size = option.size || 20;

    let row = height / size / 1.65;
    let column = width / size / 1.65;
    let maxSize = row * column;

    let inSideArray = [];
    let dataArray = [];

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.rect(0, 0, width, height);
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    let stopDrawing = false;
    let inter = null;

    function _isInside(x1, y1) {
        if (inSideArray.length >= maxSize) {
            stopDrawing = true;

            let i = 1;
            inter = setInterval(() => {
                ctx.save();
                ctx.beginPath();
                ctx.clearRect(0, 0, width, height);
                ctx.rect(0, 0, width, height);
                ctx.fillStyle = `rgba(0,0,0,${i})`;
                ctx.fill();
                ctx.closePath();
                ctx.restore();

                if (i <= 0) {
                    clearInterval(inter);
                    inter = null;
                }

                dataArray.forEach(item => {
                    ctx.save();
                    ctx.beginPath();
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.arc(item.x, item.y, size, 0, Math.PI * 2, false);
                    ctx.fill();
                    ctx.closePath();
                    ctx.restore();
                });
                i -= 0.1;
            }, 50);
        }

        if (stopDrawing) return;

        let check = inSideArray.filter(arg => {
            let x = arg.x - x1;
            let y = arg.y - y1;
            let my_len = Math.sqrt(Math.abs(x * x) + Math.abs(y * y));
            return my_len < size;
        });

        let json = { x: x1, y: y1, target: false };
        if (!check || check.length == 0) {
            json.target = true;
            inSideArray.push(json);
        }
        dataArray.push(json);
    }

    function _drawding(_x, _y) {
        ctx.save();
        ctx.beginPath();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.arc(_x, _y, size, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    canvas.addEventListener('mousemove', (event) => {
        if (!ctx || stopDrawing) return;
        let x1 = event.clientX - canvas.getBoundingClientRect().left;
        let y1 = event.clientY - canvas.getBoundingClientRect().top;
        _isInside(x1, y1);
        _drawding(x1, y1);
    });

    canvas.addEventListener('mousedown', (event) => {
        let x1 = event.clientX - canvas.getBoundingClientRect().left;
        let y1 = event.clientY - canvas.getBoundingClientRect().top;
        _isInside(x1, y1);
        _drawding(x1, y1);
    });

    canvas.addEventListener('touchmove', (event) => {
        event.preventDefault();
        let x1 = event.touches[0].clientX - canvas.getBoundingClientRect().left;
        let y1 = event.touches[0].clientY - canvas.getBoundingClientRect().top;
        _isInside(x1, y1);
        _drawding(x1, y1);
    });

    canvas.addEventListener('touchstart', (event) => {
        event.preventDefault();
        let x1 = event.touches[0].clientX - canvas.getBoundingClientRect().left;
        let y1 = event.touches[0].clientY - canvas.getBoundingClientRect().top;
        _isInside(x1, y1);
        _drawding(x1, y1);
    });

    return {
        reDraw: (arg) => {
            if (!inter) {
                ctx.save();
                ctx.beginPath();
                ctx.clearRect(0, 0, width, height);
                ctx.rect(0, 0, width, height);
                ctx.fillStyle = `rgba(0,0,0,1)`;
                ctx.fill();
                ctx.closePath();
                ctx.restore();
                stopDrawing = false;
                inter = null;
                inSideArray = inSideArray.filter((arg) => false);
                dataArray = dataArray.filter((arg) => false);
            }

            if (arg && arg instanceof Function) {
                arg(stopDrawing);
                console.log(inter);
            }
        }
    }
}

let sct = scracth('canvas');

let btn = document.getElementById('btn');
btn.addEventListener('click', (event) => {
    sct.reDraw(result => {
        console.log(result);
    });
});
