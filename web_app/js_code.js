const canvas = document.getElementById('number-drawing');
const ctx = canvas.getContext('2d');

let isPainting = false;
let lineWidth = 15;
let startX;
let startY;

/* offset for the canvas
height: 60px;
margin-left:10px;
*/
let offsetY = 60;
let offsetX = 10;

addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (e.target.id === 'detect') {
        console.log("clicked");

        // Creating new canvas, scale to 28x28px imge
        const scaled_canvas = document.createElement("canvas");
        const scaled_ctx = scaled_canvas.getContext("2d");

        scaled_canvas.width = 28;
        scaled_canvas.height = 28;

        scaled_ctx.drawImage(canvas, 0, 0, 28, 28);

        // Output the scaled down image
        var scaled_url = scaled_canvas.toDataURL();

        // query to inference model (Kserve)
        /*
        fetch('https://api.chucknorris.io/jokes/random')
        .then(response => response.json())
        .then(data => console.log(data));
        */
        document.getElementById("results").innerHTML = "Clicked! "+scaled_url;
    }
});

const draw = (e) => {
    if(!isPainting) {
        return;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.lineTo(e.clientX - offsetX, e.clientY - offsetY);
    ctx.stroke();
}

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);