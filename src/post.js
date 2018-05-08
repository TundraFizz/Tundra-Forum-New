export function post(api, data){
  return new Promise((resolve) => {
    fetch(api, {
      "method" : "POST",
      "body"   : JSON.stringify(data),
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
      }).then(res => resolve(res.json()));
  });
}

export function get(api, data){
  return new Promise((resolve) => {
    fetch(api, {
      "method": "GET"
    }).then(res => resolve(res.json()));
  });
}
