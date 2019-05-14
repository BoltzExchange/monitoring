const https = require('https');

const handleResponse = (response, resolve) => {
  let data = '';

  response.on('data', chunk => {
    data += chunk;
  });

  response.on('end', () => {
    resolve(data);
  });
};

exports.getRequest = url => {
  return new Promise((resolve, reject) => {
    https
      .get(url, response => {
        handleResponse(response, resolve);
      })
      .on('error', error => {
        reject(error);
      });
  });
};

exports.postRequest = (url, content) => {
  return new Promise((resolve, reject) => {
    const { hostname, pathname } = new URL(url);

    const body = JSON.stringify(content);

    const request = https
      .request(
        {
          port: 443,
          host: hostname,
          path: pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length,
          },
        },
        response => {
          handleResponse(response, resolve);
        }
      )
      .on('error', error => {
        reject(error);
      });

    request.write(body);
    request.end();
  });
};
