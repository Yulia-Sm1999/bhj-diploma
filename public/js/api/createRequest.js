/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest;
  xhr.responseType = 'json';

  if (options.method === 'GET') {
    let urlAddress;
    if (options.data) {
      let urlData;
      if (typeof options.data != 'string') {
        urlData = Object.entries(options.data).map(arr => `${arr[0]}=${arr[1]}`).join('&');
        urlAddress = `${options.url}?${urlData}`;
      } else {
        urlData = options.data;
        urlAddress = `${options.url}/${urlData}`;
      }
      
    } else {
      urlAddress = options.url;
    }
    
    try {
      xhr.open(options.method, urlAddress);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          if (options.callback) {
            options.callback(xhr.response);
          }
        };
      };
      xhr.send();
    } catch (e) {
      alert(e);
    }
  };

  if (options.method !== 'GET') {
    let formData = new FormData();
    Object.entries(options.data).forEach(pair => {
      formData.append(pair[0], pair[1]);
    });
    
    try {
      xhr.open(options.method, options.url);
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
          options.callback(xhr.response);
        };
      };
      xhr.send(formData);
    } catch (e) {
      alert(e);
    }
  };
}
