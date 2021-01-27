# Estilos en linea

> Sígueme en [Twitter](https://twitter.com/chris_noring), feliz de tomar sus sugerencias sobre temas o mejoras /Chris

React tiene una visión diferente a la forma de hacer estilos. Podemos establecer una etiqueta de estilo con contenido. Sin embargo, lo que establezca debe ser un objeto con propiedades y las propiedades deben tener nomenclatura Pascal Case. Vamos a mostrar cómo puede verse esto:

```js
import image from "./image.jpg";

const styles = {
  color: "red",
  backgroundImage: `url(${url})`,
};

class TestComponent extends React.Component {
  render() {
    return <div style={styles}>style this</div>;
  }
}
```

Tenga en cuenta el uso de `backgroundImage`, tenemos que escribirlo así en lugar de` background-image`. Todos los atributos que sean compuestos se deben manejar con pascal case:

> padding-left -> paddingLeft

> margin-top -> marginTop

## Trabajando con archivos CSS

Por supuesto, podemos trabajar con archivos CSS normales. Podemos definir nuestros estilos allí y simplemente importar el archivo, así:

```css
// App.css

.container {
  font-size: 16px;
  border: solid 1px black;
}
```

Para usar los estilos del archivo simplemente usamos `import`, con la ruta del archivo de esta manera:

```js
import "./App.css";

class TestComponent {
  render() {
    return <div className={container}></div>;
  }
}
```

Tenga en cuenta en el código anterior que estamos usando el atributo `className` para establecer una clase CSS. Al usar el `import`, nuestro componente ahora puede usar libremente el CSS especificado en` App.css`.
