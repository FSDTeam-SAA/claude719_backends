import config from "../config";

export const invalidHtmlTemplate = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invalid Verification Link</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f9fafb;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .card {
      background: #ffffff;
      padding: 32px;
      border-radius: 10px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    h1 {
      color: #dc2626;
      font-size: 22px;
      margin-bottom: 12px;
    }
    p {
      color: #4b5563;
      font-size: 15px;
      line-height: 1.5;
    }
    a {
      display: inline-block;
      margin-top: 22px;
      padding: 12px 22px;
      background: #25eb46ff;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
    }
    a:hover {
      background: #23d81dff;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Invalid Verification Link</h1>
    <p>
      This verification link is invalid or has already been used.
    </p>
    <p>
      Please register again or request a new verification email.
    </p>

    <a href="${config.frontendUrl}/sign-up">
      Go to Register
    </a>
  </div>
</body>
</html>
`;
