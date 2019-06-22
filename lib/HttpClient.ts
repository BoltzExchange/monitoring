import https from 'https';
import { IncomingMessage } from 'http';

const handleResponse = (response: IncomingMessage, resolve: (data: string) => void) => {
  let data = '';

  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    resolve(data);
  });
};

export const getRequest = (url: string) => {
  return new Promise<string>((resolve, reject) => {
    https
      .get(url, (response) => {
        handleResponse(response, resolve);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

export const postRequest = (url, content) => {
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
        (response) => {
          handleResponse(response, resolve);
        },
      )
      .on('error', (error) => {
        reject(error);
      });

    request.write(body);
    request.end();
  });
};
