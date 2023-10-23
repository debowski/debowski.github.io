const l1 = document.querySelector('#liczba1');
const l2 = document.querySelector('#liczba2');
const dodawanie = document.querySelector('#dodawanie');
const odejmowanie = document.querySelector('#odejmowanie');
const mnozenie = document.querySelector('#mnozenie');
const dzielenie = document.querySelector('#dzielenie');
const result = document.querySelector('#result');

  dodawanie.addEventListener('click', () => {
    if(!l1.value || !l2.value) {
      result.innerHTML=('Proszę uzupełnić obie liczby');
      return;
    }
    else {
      const wynik = parseFloat(l1.value) + parseFloat(l2.value);
      console.log(wynik);
      result.innerHTML = l1.value +" + "+l2.value+" = "+wynik;}
  });

  odejmowanie.addEventListener('click', () => {
    if(!l1.value || !l2.value) {
      result.innerHTML=('Proszę uzupełnić obie liczby');
      return;
    }
    else {
      const wynik = parseFloat(l1.value) - parseFloat(l2.value);
      console.log(wynik);
      result.innerHTML = l1.value +" - "+l2.value+" = "+wynik.toFixed(2);}
  });

  mnozenie.addEventListener('click', () => {
    if(!l1.value || !l2.value) {
      result.innerHTML=('Proszę uzupełnić obie liczby');
      return;
    }
    else {
      const wynik = parseFloat(l1.value) * parseFloat(l2.value);
      console.log(wynik);
      result.innerHTML = l1.value +" * "+l2.value+" = "+wynik;}
  });


  dzielenie.addEventListener('click', () => {
    if(!l1.value || !l2.value) {
      result.innerHTML=('Proszę uzupełnić obie liczby');
      return;
    }

    else if(l2.value == 0) {
      result.innerHTML=('Nie można dzielić przez 0');
      return;
    }

    else {
      const wynik = parseFloat(l1.value) / parseFloat(l2.value);
      console.log(wynik);
      result.innerHTML = l1.value +" - "+l2.value+" = "+wynik;}
  });

