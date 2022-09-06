/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest;
  xhr.responseType = 'json';

  if (options.method === 'GET') {
    try {
      xhr.open(options.method, `${options.url}?mail=${options.data.mail}&password=${options.data.password}`);
      xhr.send();
      options.callback();
    } catch (e) {
      console.log(e);
    } 
  };

  if (options.method !== 'GET') {
    formData = new FormData;
    formData.append('mail', `${options.data.mail}`);
    formData.append('password', `${options.data.password}`);
    
    try {
      xhr.open(options.method, `${options.url}`);
      xhr.send(formData);
      options.callback();
    } catch (e) {
      console.log(e);
    }
  };
}
