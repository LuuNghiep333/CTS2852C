function displayColor(colorPick) {
  colorPick = document.getElementById("colorPick").value;
  let colorList = document.getElementById("pallete"),
    addColor = document.createElement("option");
  addColor.value = colorPick;
  colorList.insertBefore(addColor, colorList.options[0]);
  colorList.options[colorList.options.length - 1].remove();
}

const canvas = document.querySelector("canvas"),
  ctx = canvas.getContext("2d", { willReadFrequently: true }),
  tools = document.getElementById("tools"),
  fillSolid = document.getElementById("fillSolid"),
  clear = document.getElementById("clear"),
  save = document.getElementById("save"),
  upload = document.getElementById("upload"),
  shapes = document.getElementById("shapes");
let pixelSize = document.getElementById("pixelSize").value,
  preMouseX, preMouseY, snapshot;

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
})

let isDrawing = false;
const startDrawing = (pixel) => {
  isDrawing = true;
  preMouseX = pixel.offsetX;
  preMouseY = pixel.offsetY;
  ctx.beginPath();
  ctx.lineWidth = pixelSize;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}
const createShape = (pixel) => {
  if (shapes.selectedIndex === 1) {
    if (fillSolid.checked) {
      return ctx.fillRect(pixel.offsetX, pixel.offsetY, preMouseX - pixel.offsetX, preMouseY - pixel.offsetY);
    }
    ctx.strokeRect(pixel.offsetX, pixel.offsetY, preMouseX - pixel.offsetX, preMouseY - pixel.offsetY);
  } else if (shapes.selectedIndex === 2) {
    ctx.beginPath();
    ctx.moveTo(preMouseX, preMouseY);
    ctx.lineTo(pixel.offsetX, pixel.offsetY);
    ctx.lineTo(preMouseX * 2 - pixel.offsetX, pixel.offsetY);
    ctx.closePath();
    if (fillSolid.checked) {
      return ctx.fill();
    }
    ctx.stroke();
  } else if (shapes.selectedIndex === 3) {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow(preMouseX - pixel.offsetX, 2) + Math.pow(preMouseY - pixel.offsetY, 2));
    ctx.arc(preMouseX, preMouseY, radius, 0, 2 * Math.PI);
    if (fillSolid.checked) {
      return ctx.fill();
    }
    ctx.stroke();
  } else {
    ctx.lineTo(pixel.offsetX, pixel.offsetY);
    ctx.stroke();
  }
}

const draw = (pixel) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);
  ctx.strokeStyle = document.getElementById("colorPick").value;
  ctx.fillStyle = document.getElementById("colorPick").value;
  if (tools.selectedIndex === 0) {
    createShape(pixel);
  }
  if (tools.selectedIndex === 1) {
    ctx.strokeStyle = "#FFFFFF";
    ctx.fillStyle = "#FFFFFF";
    createShape(pixel);
  }
}

clear.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

save.addEventListener("click", () => {
  let link = document.createElement("a"),
    dateModified = new Date().toLocaleDateString('en-GB');
  link.download = dateModified + ".png";
  link.href = canvas.toDataURL();
  link.click();
  link.remove();
});

upload.addEventListener("change", () => {
  let imgFile = upload.files[0];
  if(!imgFile) return;
  let imgResult = new Image();
  imgResult.src = URL.createObjectURL(imgFile);
  console.log(imgFile.name);
  imgResult.onload = function() {
    canvas.width = imgResult.width;
    canvas.height = imgResult.height;
    ctx.drawImage(imgResult, 0, 0);
  }
});

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mouseleave", () => isDrawing = false);
