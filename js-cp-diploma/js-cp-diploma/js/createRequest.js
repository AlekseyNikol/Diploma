//Создаем функцию getRequest, которая принимает два аргумента: body  и callback 
function getRequest(body, callback) { 
  return new Promise((resolve, reject) => {
    //Создаем новый объект XMLHttpRequest
    let xhr = new XMLHttpRequest();

    //Открываем соединение с сервером
    xhr.open("POST", "https://jscp-diplom.netoserver.ru/", true);
    xhr.responseType = "json";
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);

    //Определяем  onload, который вызывается при успешном завершении запроса
    xhr.onload = () => {
      //Проверяем статус запроса
      if (xhr.status >= 200 && xhr.status < 300) {
        //Получаем ответ от сервера
        const response = xhr.response;
        //Если срабатывае колбэк, вызываем его с полученным ответом
        if (callback) {
          callback(response);
        }
        //Разрешаем Promise с полученным ответом
        resolve(response);
      } else {
         //Отклоняем Promise с текстом статуса запроса
        reject(xhr.statusText);
      }
    };

    //Определяем обработчик события onerror, который вызывается при ошибке 
    xhr.onerror = () => {
      reject(xhr.statusText);
    };
  });
}