import http from 'k6/http';

export let options = {
    scenarios: {
        constant_request_rate: {
            executor: 'constant-arrival-rate',
            rate: 1000,
            timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
            duration: '30s',
            preAllocatedVUs: 100, // how large the initial pool of VUs would be
            maxVUs: 200, // if the preAllocatedVUs are not enough, we can initialize more
        }
    }
};

export default function () {
    // GET request
    http.get('http://localhost:3003/api/listing/1');
    // POST request
    let data = { productId: 11111111, name: "testing", photos: ['1.jpg', '2.jpg', '3.png', '4.jpg', '5.jpg']}
    var params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    http.post('http://localhost:3003/api/listing', JSON.stringify(data), params);
}
