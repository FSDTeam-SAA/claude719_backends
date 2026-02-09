import config from '../config';

export const alreadyVerifiedHtmlTemplate = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Email Already Verified</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #ecfeff;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .card {
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
      max-width: 420px;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    h1 {
      color: #34f105ff;
    }
    p {
      color: #374151;
      margin-top: 10px;
    }
    a {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 20px;
      background: #25eb25ff;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Email Already Verified</h1>
    <p>Your email has already been verified.</p>
    <p>You can login to your account.</p>
    <a href="${config.frontendUrl}/login">Go to Login</a>
  </div>
</body>
</html>
`;
