
function getSchoolWeekNumber() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    // Sprawdzenie, do którego roku szkolnego należy data
    let schoolYearStart;
    if (month >= 9) {
        schoolYearStart = new Date(year, 8, 1);  // 1 września bieżącego roku
    } else {
        schoolYearStart = new Date(year - 1, 8, 1);  // 1 września poprzedniego roku
    }

    // Oblicz różnicę dni od początku roku szkolnego
    const diffTime = today.getTime() - schoolYearStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Obliczenie numeru tygodnia
    const weekNumber = Math.floor(diffDays / 7) + 1;

    return weekNumber;
}

// Wyświetlenie wyniku na stronie
document.getElementById("result").textContent =
    `Dziś jest tydzień numer: ${getSchoolWeekNumber()} roku szkolnego.`;


const nowadata = document.getElementById("nowadata");
const result2 = document.getElementById("result2");


nowadata.addEventListener("change", function () {
    console.log(nowadata.value);
    const data = new Date(nowadata.value);
    const year = data.getFullYear();
    const month = data.getMonth() + 1;
    const day = data.getDate();
    const weekNumber = getSchoolWeekNumber2(data);
    document.getElementById("result2").textContent =
        `Data ${day}.${month}.${year} to tydzień numer: ${weekNumber} roku szkolnego.`;
});

// function getSchoolWeekNumber2(data) {
//     // Sprawdzenie, do którego roku szkolnego należy data
//     let schoolYearStart;
//     if (data.getMonth() >= 8) {
//         schoolYearStart = new Date(data.getFullYear(), 8, 1);  // 1 września bieżącego roku
//     } else {
//         schoolYearStart = new Date(data.getFullYear() - 1, 8, 1);  // 1 września poprzedniego roku
//     }

//     // Oblicz różnicę dni od początku roku szkolnego
//     const diffTime = data.getTime() - schoolYearStart.getTime();
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//     // Obliczenie numeru tygodnia
//     const weekNumber = Math.floor(diffDays / 7) + 1;

//     return weekNumber;
// }



function getSchoolWeekNumber2(data) {
    // Sprawdzenie, do którego roku szkolnego należy data
    let schoolYearStart;
    if (data.getMonth() >= 8) {
        schoolYearStart = new Date(data.getFullYear(), 8, 1);  // 1 września bieżącego roku
    } else {
        schoolYearStart = new Date(data.getFullYear() - 1, 8, 1);  // 1 września poprzedniego roku
    }

    // Znalezienie pierwszego poniedziałku września
    while (schoolYearStart.getDay() !== 1) {  // 1 to poniedziałek w JS
        schoolYearStart.setDate(schoolYearStart.getDate() + 1);
    }

    // Oblicz różnicę dni od pierwszego poniedziałku września
    const diffTime = data.getTime() - schoolYearStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Obliczenie numeru tygodnia
    const weekNumber = Math.floor(diffDays / 7) + 1;

    return weekNumber;
}

