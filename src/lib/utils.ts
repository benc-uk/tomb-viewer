import { tr_palette, tr_textile8, tr_textile8_size } from "./types";

export function saveTextileAsPNG(tex: tr_textile8, palette: tr_palette) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;

  const ctx = canvas.getContext("2d")!;
  const imgData = ctx.createImageData(256, 256);

  for (let i = 0; i < tr_textile8_size; i++) {
    // Look up colour in the palette but it's 8 bit color so we need to multiply by 3
    const colour = palette[tex[i]];

    imgData.data[i * 4] = colour.r * 3;
    imgData.data[i * 4 + 1] = colour.g * 3;
    imgData.data[i * 4 + 2] = colour.b * 3;
    imgData.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);

  const img = canvas.toDataURL("image/png");
  const imgEl = document.createElement("img");
  imgEl.src = img;
  imgEl.style.border = "2px solid black";
  imgEl.style.margin = "10px";
  // imgEl.style.width = "512px";
  document.body.appendChild(imgEl);
}
