import config from '../config';

export const expiredHtmlTemplate = () => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification Expired</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #f3f4f6;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }
      .card {
        background: #ffffff;
        padding: 30px;
        border-radius: 8px;
        max-width: 420px;
        width: 100%;
        text-align: center;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      }
      h1 {
        color: #dc2626;
        margin-bottom: 10px;
      }
      p {
        color: #374151;
        font-size: 15px;
      }
      a {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 20px;
        background: #22c55e;
        color: #fff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
      }
      a:hover {
        background: #16a34a;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Verification Link Expired</h1>
      <p>
        Your email verification link has expired.<br/>
        Your account has been removed for security reasons.
      </p>
      <p>Please register again to continue.</p>

      <a href="${config.frontendUrl}/register">
        Register Again
      </a>
    </div>
  </body>
  </html>
  `;
};
