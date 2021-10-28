/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = ({url, data, method, callback}) => {
  if (method === "GET") {
    const urlPart = data ? '?' + Object.entries(data)
        .map(item => item.join("=")).join('&')
    : '';
    fetch(`${url}${urlPart}`)
      .then(res => res.json())
      .then(res => callback(err = null, res))
      .catch(error => callback(error))
  } else {
    const formData = new FormData(data);
    fetch(url, {
      method: method,
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        return callback(err = null, res)
      })
      .catch(error => {
        return callback(error)
      })
  }
};
