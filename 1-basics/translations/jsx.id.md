# JSX

> Ikuti Saya di [Twitter](https://twitter.com/chris_noring), dengan senang hati menerima saran tentang topik dan perbaikan /Chris

Bab ini mencakup beberap topik berikut:

- **Apa itu JSX**. JSX adalah sesuatu yang kamu gunakan setiap waktu di React. Mari kita jelaskan apakah ini.
- **Kenapa menggunakannya?**. Kamu bisa tidak menggunakan JSX tetapi sepertinya tidak ada yang melakukan itu, dan JSX memang membuat hidupmu jauh lebih mudah.

## Apa & Mengapa

JSX adalah tidak lebih dari seperti kamu menulis XML di JavaScript. Ini adalah langkah _pre processor_. Kamu tidak harus memakainya, tetapi benar ini akan membuat hidupmu jauh lebih mudah.

### Contoh Sederhana

Ini adalah contoh sederhana pada satu baris kode:

```js
const Elem = <h1>Some title</h1>;

// dan kamu dapat menggunakannya di React seperti berikut:
<div>
  <Elem />
</div>
```

Deklarasi dari `Elem` diatas kelihatan seperti XML di JavaScript. Lalu apa yang terjadi? Ketika itu sedang di proses, maka akan berubah menjadi kode ES5 seperti berikut:

```js
React.createElement('Elem', null, 'Some title');
```

Ok jadi memanggil `createElement`, parameternya seperti berikut:

- **Parameter pertama, nama elemen**.`Elem` menjadi nama elemen.
- **Parameter kedua, atribut**. Argumen kedua diatas adalah `null` dan mrepresentasikan atribut elemen, yang mana tidak ada.
- **Parameter ketiga, nilai element**. Ketiga dan argumen terakhir adalah nilai elemen.

#### Contoh dengan atribut

Mari kita lihat contoh dibawah dimana kita berikan sebuah atribut:

```js
const Elem = <h1>Some title</h1>;

// penggunaan:
<div>
  <Elem title="a title">
</div>
```

Kode diatas akan menjadi kode berikut:

```js
React.createElement(
  'Elem', 
  { 
    title: 'a title' 
  }, 
  'Some title'
);
```

Diatas sekarang bisa kita lihat bahwa atribut `title` adalah bagian dari argumen kedua.

### Multi Baris

Di sebagian besar waktu, kamu akan mendefinisikan JSX dalam beberapa baris dan memulainya dengan baru, mungkin akan membingungkanmu mengapa hal itu tidak dapat berfungsi.

Solusinya adalah dengan membungkus multi elemen tersebut dengan kurung `()`, seperti ini:

```jsx
const Elem =
(
  <div>
    <h1>Some title</h1>
    <div>Some content</div>
  </div>
)
```

### Satu Induk

JSX mengharuskan satu induk. Berikut ini akan menjadi **salah**:

```html
<!-- menjadi tidak benar, tidak ada elemen induk -->
const Elem =
(
  <h1>Some title</h1>
  <div>Some content</div>
)
```

Kamu bisa memperbaikinya baik dengan:

- **Membungkusnya di sebuah elemen**. Kamu bisa membungkus isi dari elemen dic seperti berikut:

   ```html
    const Elem =
    (
      <div>
        <h1>Some title</h1>
        <div>Some content</div>
      </div>
    )
    ```

- **Memakai `React.Fragment`**. Kamu bisa membungkusnya dengan `React.Fragment`, seperti berikut:

    ```html
    const Elem = (
    <React.Fragment>
      <h1>Some title</h1>
      <div>Some content</div>
    </React.Fragment>
    )
    ```
`React.Fragmen` akan menjadi elemen induk daripada memakai `div`.

## Kesimpulan

Ini kurang lebih yang harus diketahui tentang topik JSX agar kita bisa bekerja dengannya:

- JSX seperti XML yang ditranslasikan dengan memanggil `React.createElement()`.
- Multi baris memerlukan kurung agar bisa bekerja.
- Kamu harus mempunyai satu induk elemen, `React.Fragment` adalah pilihan yang baik untuk itu.
