// //Домашнее задание № 16
"use strict";

// "Создать форму - 2 инпута даты и кнопка ""Рассчитать"".
//При нажатии на кнопку получить курс доллара с сайта нацбанка
// на все даты в диапазоне и вывести на интерфейс дату с минимальным
//и максимальным курсами(с указанием курса).
//Кнопку можно нажать только есть обе даты введены и диапазон корректен
// (то есть левая дата меньше правой). Одним запросом можно получать курс
// только на один день(нельзя использовать эндпоинт на получение курсов на диапазон дат)
// ДЗ разместить на GIT скинуть ссылку на репозиторий"

const myform = document.querySelector(".date");
const dateOne = document.querySelector(".min_date");
const dateTwo = document.querySelector(".max_date");
const minDate = document.querySelector(".date_min_value");
const maxDate = document.querySelector(".date_max_value");
const minCourse = document.querySelector(".min_course");
const maxCourse = document.querySelector(".max_course");
const btn = document.querySelector("button");
const hiddenText = document.querySelector(".hidden-text");

myform.addEventListener("submit", (event) => event.preventDefault());

function toNull() {
  minDate.value = "";
  maxDate.value = "";
  minCourse.value = "";
  maxCourse.value = "";
}

dateOne.addEventListener("change", () => {
  if (dateOne.value === "") {
    dateTwo.disabled = true;
  } else {
    dateTwo.disabled = false;
    toNull();
  }
});
dateTwo.addEventListener("change", () => {
  if (dateTwo.value === "") {
    btn.disabled = true;
    dateTwo.disabled = true;
  } else {
    btn.disabled = false;
    dateTwo.disabled = false;
    toNull();
  }
});

btn.addEventListener("click", (event) => {
  if (dateOne.value > dateTwo.value) {
    dateOne.classList.add("error_color");
    hiddenText.hidden = false;
    toNull();
    event.preventDefault();
    return;
  } else {
    dateOne.classList.remove("error_color");
    hiddenText.hidden = true;
    //получаем из даты timestamp// в сутках 86400000 [i++]
    let start = dateOne.valueAsNumber;
    let end = dateTwo.valueAsNumber;
    let oneDay = 86400000;

    //===============================================
    let newAray = [];
    for (let i = start; i <= end; i += oneDay) {
      newAray.push(i);
    }
    // console.log(newAray);

    let arrayOfDate = newAray.map((dateInNumber) => {
      let newDate = new Date(dateInNumber);
      let formatDate = `${newDate.getFullYear()}-${
        newDate.getMonth() + 1
      }-${newDate.getDate()}`;
      return formatDate;
    });
    console.log(arrayOfDate);

    let myUrls = arrayOfDate.map((date) => {
      return `https://www.nbrb.by/api/exrates/rates/usd?parammode=2&ondate=${date}`;
    });
    // console.log(myUrls);

    //===========================================

    let courses = [];
    let dates = [];
    Promise.all(myUrls.map((url) => fetch(url).then((res) => res.json()))).then(
      (cours) => {
        cours.forEach((course) => {
          courses.push(course.Cur_OfficialRate);
          dates.push(course.Date);
        });

        //находим минимальное значение в массиве
        let min = Math.min(...courses);
        let max = Math.max(...courses);
        // let min = Math.min.apply(null, courses);
        // let max = Math.max.apply(null, courses);

        //дата в input принимает формат даты в усеченном виде
        minDate.value = dates[courses.indexOf(min)].slice(0, 10);
        maxDate.value = dates[courses.indexOf(max)].slice(0, 10);
        minCourse.value = min;
        maxCourse.value = max;
      }
    );
  }
});
