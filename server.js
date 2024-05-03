const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Перевірка методу запиту
  if (req.method === 'GET') {
    let filePath = '.' + req.url; // Отримання шляху до запитуваного файлу
    if (filePath === './') {
      filePath = 'index.html'; // Якщо кореневий шлях, використовуємо index.html
    } else {
      // Перевірка, чи шлях вказує на файл
      if (!fs.existsSync(filePath)) {
        // Якщо шлях не вказує на файл, додаємо '.html' і перевіряємо, чи існує файл
        filePath = `./public/${req.url}.html`;
        if (!fs.existsSync(filePath)) {
          // Якщо файл не знайдено, повертаємо 404 Not Found
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('404 Not Found');
        }
      }
    }
    
    // Читання файлу
    fs.readFile(filePath, (err, data) => {
      if (err) {
        // Обробка помилки, якщо файл не знайдено
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        // Встановлення MIME-типу відповідно до розширення файлу
        const contentType = getContentType(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data); // Надсилання вмісту файлу як відповідь
      }
    });
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      console.log('Received data:', body);
      res.end(`POST request processed successfully\nData: ${body}`);
    });
  } else {
    // Обробка інших методів запиту, наприклад PUT, DELETE
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('405 Method Not Allowed');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Функція для визначення MIME-типу на основі розширення файлу
function getContentType(filePath) {
  const extname = path.extname(filePath).toLowerCase();
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    case '.json':
      return 'application/json';
    default:
      return 'text/plain';
  }
}
