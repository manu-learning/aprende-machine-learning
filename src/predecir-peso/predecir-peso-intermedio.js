// TODO: Bugs entre parcel y tensorflow
// import * as tf from "@tensorflow/tfjs";

async function getPersonas() {
    const personasRequest = await fetch('http://localhost:8080/assets/personas.json');
    const personasData = await personasRequest.json();
    const personasAlturaPeso = personasData
          .map(persona => ({
              // mapeamos cada persona object, para obtener sólo dos atributos
              altura: persona.altura, peso: persona.peso
          }))
          .filter(persona =>
              // filtramos los object que no tengan datos
              (persona.altura != null && persona.peso != null)
          );

    return personasAlturaPeso;
}

function crearModelo(){
    // usamos un "modelo secuencial" para "regresión lineal"
    const modelo = tf.sequential();

    // agregamos capa
    modelo.add(tf.layers.dense({
        units: 1, // indicamos la altura que tendrá cada entrada, cambiará el tamaño de la matriz
        inputShape: [1], // tenemos un número como entrada la altura de la persona
        useBias:true
    }));

    // capa de salida
    modelo.add(tf.layers.dense({
        units: 1, // queremos un número como output
        useBias: true
    }));

    return modelo;
}

async function entrenarModelo(modelo, entradas, labels){
    // sgd:
    // - algoritmo que no requiere configuración (existen varios más en tensorflow)
    //
    // loss
    // - indicamos que función de pérdida usaremos
    // - la función de pérdida, le indíca al modelo que tan alejadas son sus predicciones de los "datos etiquetados/clasificados" (labels)
    // - usamos la función "meanSquaredError" por usar un "modelo de regresión lineal" (aprendizaje supervisado),
    // ésta compara las predicciones hechas por el modelo con los valores verdaderos (los datos etiquetados, labels)
    modelo.compile({
        optimizer: "sgd",
        loss: "meanSquaredError",
        metrics: ['mse']
    });

    // fit:
    // - es la función que inicia el entrenamiento del modelo
    // - es una función asincrónica, por tanto el retorno será una promesa (promise)
    // que nos dirá cuando terminó la tarea (entrenar al modelo)
    //
    // fitCallBacks:
    // - para controlar el entrenamiento del modelo
    return await modelo.fit(entradas, labels,{
        batchSize: 20, // el tamaño de los lotes de datos que usará el modelo durante el entrenamiento en cada iteración al dividir el dataset
        epochs: 500, // cantidad de iteraciones ó número de veces con el que el modelo leerá los datos del dataset
        shuffle: true,
        callbacks: tfvis.show.fitCallbacks(
            { name: 'Training Performance' },
            ['loss', 'mse'],
            { height: 200, callbacks: ['onEpochEnd'] }
        )
    });
}

// TODO:
async function testModelo(modelo, data, tensorData){
}

// - un tensor es una estructura de datos, es la más eficiente para entrenar modelos en TensorFlow
// - son estructuras de datos de una dimension N (Ej. vectores, matrices)
// - pueden contener constantes numéricas de enteros, constantes númericas de reales (punto flotante) y literales cadena (string)
function convertirEnTensor(data){
    return tf.tidy(()=>{
        // 1. Mezclamos el "dataset" (conjunto de datos)
        //
        // - durante el entrenamiento del modelo, el dataset se divide en pequeños "Lotes de datos" (batches ó data subset) para alimentar al modelo con esos lotes
        // - mezclar el dataset implíca mezclar los lotes de datos que lo forman, y evita que el modelo utilice siempre los mismos datos
        // - mejoramos el entrenamiento del modelo, éste recibe como entrada más variedad de datos
        tf.util.shuffle(data);

        // 2. Convertimos los vectores en Tensor (estructuras de datos específicas para TensorFlow)
        //
        // Inputs ó Entradas:
        // - dataset ó conjunto de datos, que usará el modelo en base a los labels
        //
        // Labels ó Datos etiquetados/clasificados:
        // - son los datos que queremos que el modelo aprenda
        // - datos que usaremos para entrenar al modelo, y éste nos diga el peso de la persona (etiqueta a predecir)
        const entradas = data.map(persona => persona.altura);
        const labels = data.map(persona => persona.peso);

        const entradaTensor = tf.tensor2d(entradas, [entradas.length, 1]);
        const labelTensor = tf.tensor2d(labels, [labels.length, 1]);


        // 3. Normalizamos los datos en un rango de entre 0 y 1
        //
        // - transformamos los valores grandes del dataset a una escala estandar que usan los modelos TensorFlow (soportan valores no muy grandes)
        // - cambiamos la Escala, a una más chica (0 y 1) de los valores del dataset usando "Normalización min-max" con la ecuación: x'=(x - x_min) / (x_max - x_min)
        //
        // - sub: es la operación arimética básica para restar numeros
        // - div: es la operación arimética básica para dividir numeros
        const entradaMax = entradaTensor.max();
        const entradaMin = entradaTensor.min();
        const labelMax = labelTensor.max();
        const labelMin = labelTensor.min();

        // por cada entrada hará.. entradaNormalizada = (entrada - entradaMin) / (entrada_max - entrada_min)
        const entradasNormalizadas = entradaTensor.sub(entradaMin).div(entradaMax.sub(entradaMin));
        // por cada label hará la misma ecuación que con las entradas, para cambiar a una escala menor (entre 0 y 1)
        const labelsNormalizados = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

        return {
            // datos normalizados, transformados a una escala pequeña para que tensorFlow los use para entrenar al modelo
            entradas: entradasNormalizadas,
            labels: labelsNormalizados,
            // los usaremos luego para desnormalizar los datos, y llevarlos a la escala original
            entradaMax, entradaMin, labelMax, labelMin
        };
    });
}

async function iniciar(){
    const data = await getPersonas();
    const valores = data.map(persona => ({
        x: persona.altura,
        y: persona.peso,
    }));

    // tfvis.render.scatterplot(container, data, opts?)
    tfvis.render.scatterplot(
        { name: 'Altura y Peso' },
        { values: valores },
        {
            xLabel: 'Altura',
            yLabel: 'Peso',
            height: 300
        }
    );

    // inicializamos el modelo
    const modelo = crearModelo();
    tfvis.show.modelSummary({name: 'Modelo Info'}, modelo);

    // convertimos los datos del dataset en estructuras de datos "Tensor"
    const tensorData = convertirEnTensor(data);
    const {entradas, labels} = tensorData;

    await entrenarModelo(modelo, entradas, labels);
    console.log('Ostras, que rápido lo hemos entrenado');

    // TODO: debemos testear el modelo, que éste pueda predecir
}

document.addEventListener('DOMContentLoaded', iniciar);
