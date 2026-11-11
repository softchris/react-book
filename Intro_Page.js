const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Blackwood Manor</title>
  <link rel="preconnect" href="https://cdn.jsdelivr.net">
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 24px;
      background: #0b0b0f;
      font-family: Georgia, serif;
    }
    img {
      max-width: 90%;
      max-height: 75vh;
      border-radius: 8px;
      box-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
    }
    a {
      color: #e8d9b5;
      font-size: 1.5rem;
      text-decoration: none;
      padding: 12px 28px;
      border: 1px solid #e8d9b5;
      border-radius: 4px;
    }
    a:hover {
      background: #e8d9b5;
      color: #0b0b0f;
    }
  </style>
</head>
<body>
  <img src="https://cdn.jsdelivr.net/gh/softchris/blackwood-manor@main/large/manor.png" alt="Blackwood Manor" fetchpriority="high">
  <a href="https://mystery-house.app.n8n.cloud/webhook/mansion">Step into the manor</a>
</body>
</html>`;

return [{ json: { html } }];
