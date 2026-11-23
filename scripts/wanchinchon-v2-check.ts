import { parseV2, runV2 } from '../src/lib/wanchinchon-v2';

const source = `mundo Familia
  ser Persona
    rasgo nombre: texto = "Sin nombre"
    rasgo edad: numero = 0
    nace(nombre: texto, edad: numero)
      yo.nombre = nombre
      yo.edad = edad
    fin
    hacer saluda() -> texto
      devuelve "Hola, soy " + yo.nombre
    fin
  fin
  hacer doble(n: numero) -> numero
    devuelve n * 2
  fin
  chon hijo = crea Persona("Luna", 8)
  dice hijo.saluda()
  dice doble(hijo.edad)
  si hijo.edad >= 8
    dice "Edad suficiente"
  sino
    dice "Edad menor"
  fin
fin`;

const result = runV2(parseV2(source));
if (result.messages.join('|') !== 'Hola, soy Luna|16|Edad suficiente') {
    throw new Error(`Resultado inesperado: ${JSON.stringify(result.messages)}`);
}
console.log(JSON.stringify(result.messages));
