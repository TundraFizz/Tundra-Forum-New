export function post(api, data){
  return new Promise((resolve) => {
    fetch(api, {
      "method":"POST",
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      "body": JSON.stringify(data)
      }).then(res => resolve(res.json()));
  });
}
