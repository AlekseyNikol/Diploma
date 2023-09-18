// Получение информации о сеансе и конфигурации зала
let selectSeanse = JSON.parse(sessionStorage.selectSeanse);
// Формируем запрос для получения конфигурации зала
let request = `event=get_hallConfig&timestamp=${selectSeanse.seanceTimeStamp}&hallId=${selectSeanse.hallId}&seanceId=${selectSeanse.seanceId}`;

document.addEventListener("DOMContentLoaded", () => {
  // Находим кнопку "Принять" на странице
  let buttonAcceptin = document.querySelector('.acceptin-button');
  // Находим заголовок с названием фильма на странице
  let buyingTitle = document.querySelector('.buying__info-title');
  // Находим информацию о начале сеанса на странице
  let buyingStart = document.querySelector('.buying__info-start');
  // Находим информацию о зале на странице
  let buyingHall = document.querySelector('.buying__info-hall');
  // Находим информацию на странице о стандартной цене
  let priceStandart = document.querySelector('.price-standart');
  // Находим обертку для конфигурации зала на странице
  let confStepWrapper = document.querySelector('.conf-step__wrapper');
  // Заполняем заголовок с названием фильма данными из выбранного сеанса
  buyingTitle.innerHTML = selectSeanse.filmName;
  // Заполняем информацию о начале сеанса данными из выбранного сеанса
  buyingStart.innerHTML = `Начало сеанса ${selectSeanse.seanceTime}`;
  // Заполняем информацию о зале данными из выбранного сеанса
  buyingHall.innerHTML = selectSeanse.hallName;
  // Заполняем информацию о стандартной цене данными из выбранного сеанса
  priceStandart.innerHTML = selectSeanse.priceStandart;

  // Отправляем запрос для получения конфигурации зала
  getRequest(request, (response) => {
    console.log(response)
    if (response) {
      selectSeanse.hallConfig = response;
    }
    confStepWrapper.innerHTML = selectSeanse.hallConfig;
    // Находим все кресла на странице
    let chairs = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair'));
    // Устанавливаем кнопку "Принять" в неактивное состояние
    buttonAcceptin.setAttribute("disabled", true);
    
    chairs.forEach((chair) => {
      chair.addEventListener('click', (event) => {
        if (event.target.classList.contains('conf-step__chair_taken')) {
          return;
        };
        // Переключаем класс "conf-step__chair_selected" при клике на кресло
        event.target.classList.toggle('conf-step__chair_selected');
        // Находим все выбранные кресла
        let chairsSelected = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair_selected'));
        if (chairsSelected.length > 0) {
          // Если есть выбранные кресла, активируем кнопку "Принять"
          buttonAcceptin.removeAttribute("disabled");
        } else {
          // Если нет выбранных кресел, деактивируем кнопку "Принять"
          buttonAcceptin.setAttribute("disabled", true);
        };
      });
    });
  });
  
  
  // Обработчик клика на кнопку "Принять"
  buttonAcceptin.addEventListener("click", (event) => {
    event.preventDefault();
    
    let selectedPlaces = Array();// Создаем пустой массив для выбранных мест
    let rows = Array.from(document.getElementsByClassName("conf-step__row"));
    // Проходим по каждому ряду и каждому месту в ряду с помощью цикла for
    for (let i = 0; i < rows.length; i++) {
      let spanPlaces = Array.from(rows[i].getElementsByClassName("conf-step__chair"));
      for (let j = 0; j < spanPlaces.length; j++) {
        // Если место выбрано
        if (spanPlaces[j].classList.contains("conf-step__chair_selected")) {
          // Определяем тип места
          let typePlace = (spanPlaces[j].classList.contains("conf-step__chair_standart")) ? "standart" : "vip";
          selectedPlaces.push({
            // Записываем номер ряда
            "row": i+1,
            // Записываем номер места
            "place": j+1,
            // Записываем тип места
            "type":  typePlace,
          });
        };
      };
    };
    
    // Получаем конфигурацию зала
    let configurationHall = document.querySelector('.conf-step__wrapper').innerHTML;
    // Сохраняем конфигурацию зала в выбранный сеанс
    selectSeanse.hallConfig = configurationHall;
    // Сохраняем выбранные места в выбранный сеанс
    selectSeanse.salesPlaces = selectedPlaces;
    // Сохраняем выбранный сеанс в sessionStorage
    sessionStorage.setItem('selectSeanse', JSON.stringify(selectSeanse));
    // Переходим на страницу оплаты
    window.location.href = "payment.html";
  });
});