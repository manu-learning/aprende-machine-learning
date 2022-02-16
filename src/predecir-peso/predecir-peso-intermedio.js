// TODO: Bugs entre parcel y tensorflow
// import * as tf from "@tensorflow/tfjs";
/*
async function getDatos() {
    // const houseDataReq = await fetch('https://raw.githubusercontent.com/meetnandu05/ml1/master/house.json');
    // const houseData = await houseDataReq.json();
    // const cleaned = houseData.map(house => ({
    //     price: house.Price,
    //     rooms: house.AvgAreaNumberofRooms,
    // }))
    //     .filter(house => (house.price != null && house.rooms != null));

    // return cleaned;
}

function crearModelo1(){
    // usamos un "modelo secuencial" para "regresión lineal" (aprendizaje supervisado)
    const modelo = tf.sequential();

    // agregamos las capas
    modelo.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    return modelo;
}

async function entrenarModelo1(modelo, inputs, labels){
    // seleccionamos la "pérdida" y el "optimizador" para modelo anterior
    modelo.compile({ loss: "meanSquaredError", optimizer: "sgd" });

    // definimos los datos de entrenamiento (altura y peso)
    const altura = tf.tensor2d(inputs, [6, 1]);
    const peso = tf.tensor2d(labels, [6, 1]);

    // const altura = tf.tensor2d([1.82, 1.70, 1.87, 1.54, 1.63, 1.72], [6, 1]);
    // const peso = tf.tensor2d([80, 75, 85, 65, 72, 75], [6, 1]);

    // entrenamos el modelo, con los datos anteriores y 500 iteraciones
    return await modelo.fit(altura, peso, { epochs: 500 });
}

async function testModelo1(modelo){
    // usamos el modelo para inferir/predecir peso para una altura de 1.80
    const prediccion = await modelo.predict(tf.tensor2d([1.80], [1, 1]));

    return prediccion.data();
}

async function iniciar1(){
    // inicializamos el modelo
    const modelo = crearModelo();
    tfvis.show.modelSummary({name: 'Modelo Info'}, modelo);

    await entrenarModelo(modelo, inputs, labels);
    console.log('Ostras, que rápido lo hemos entrenado');

    // le pasamos una altura de 1.80 para predecir
    let resultado = await testModelo(modelo);

    console.log(resultado[0]);
}

iniciar1();
*/
