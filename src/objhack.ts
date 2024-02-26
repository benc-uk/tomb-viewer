import fs from 'fs'

const vertices = [
  [0.0, 0.0, 0.0], // Vertex 1
  [10.0, 0.0, 0.0], // Vertex 2
  [0.0, 20.0, 0.0], // Vertex 3
]

const faces = [
  [1, 2, 3], // Face with vertices 1, 2, and 3
]

const normals = [
  [0.0, 0.0, 1.0], // Normal 1
]

let objContent = ''
for (const vertex of vertices) {
  objContent += `v ${vertex.join(' ')}\n`
}
for (const normal of normals) {
  objContent += `vn ${normal.join(' ')}\n`
}
for (const face of faces) {
  objContent += `f ${face.map((v) => `${v}//1`).join(' ')}\n`
}

fs.writeFileSync('./public/hack/fake.obj', objContent)
