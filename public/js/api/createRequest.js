/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = ({url, data, method, callback}) => {
  // console.log({url, data, method, callback})
  let options = null;
  let urlPart = '';
  if (method === "GET") {
    urlPart = data ? '?' + Object.entries(data)
        .map(item => item.join('=')).join('&')
    : '';
  } else {
    const formData = new FormData();
    if (data) {
      for (const [key, val] of Object.entries(data)) {
        formData.append(key, val);
      }
    }
    options = {
      method: method,
      body: formData,
    }
  }

  fetch(url + urlPart, options)
      .then(res => res.json())
      .then(res => {
        console.log(res)
        if (res.success) {
          callback(null, res)
        } else {
          throw Error
        }
      })
      .catch(error => callback(error))
};
