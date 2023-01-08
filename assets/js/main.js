const urlApi = "https://mindicador.cl/api";
const filterCurrencies = ["uf", "dolar", "euro", "bitcoin", "utm"];
const selectWithCurrencies = document.querySelector("#currency");
const divResult = document.querySelector("#result");

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const calcResult = (amount) =>
  `$ ${(amount / selectWithCurrencies.value).toFixed(2)}`;

//obtener las monedas de la API
const getCurrencies = async () => {
  try {
    const reqCurrencies = await fetch(urlApi);
    const resData = await reqCurrencies.json();

    //obtener el codigo de las monedas
    const currencyList = filterCurrencies.map((currency) => {
      return {
        code: resData[currency].codigo,
        value: resData[currency].valor,
      };
    });
    //agregar las monedas al select
    currencyList.forEach((localCurrency) => {
      const selectOption = document.createElement("option");
      selectOption.value = localCurrency.value;
      selectOption.text = `${localCurrency.code}`;
      selectWithCurrencies.appendChild(selectOption);
    });
  } catch (error) {
    console.log(error);
    alert("Error al obtener listado de monedas");
  }
};

//dibujar grafico
let chart; 
const drawChart = async () => {
  try {
    const currency =
      selectWithCurrencies.options[
        selectWithCurrencies.selectedIndex
      ].text.toLowerCase();

    const reqChart = await fetch(`${urlApi}/${currency}`);
    const dataChart = await reqChart.json();

 
    const serieToChart = dataChart.serie.slice(0, 10).reverse();

    //Crear el grafico
    const data = {
      labels: serieToChart.map((item) => item.fecha.substring(0, 10)),
      datasets: [
        {
          label: currency,
          data: serieToChart.map((item) => item.valor),
          
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          
        },
      ],
    };
    const config = {
        type: "line",
        data: data,
    };


    const chartDOM = document.querySelector('#chart');
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(chartDOM, config);
    chartDOM.classList.remove('d-none');
  } catch (error) {
    console.log(error);
    alert("Error al obtener datos del grafico");
    console.log(error);
  }
};

//llamar a la funcion al hacer click en el boton
document.querySelector("#btnConvert").addEventListener("click", () => {
    const amountPesos = document.querySelector("#pesos").value;
   if (amountPesos === "") {
     alert("Ingrese la cantidad de pesos a convertir");
    return;
    }
    divResult.innerHTML = calcResult(amountPesos);
    drawChart();
});
getCurrencies();