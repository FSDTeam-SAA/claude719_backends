import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notFoundError from './app/error/notFoundError';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes/routes';
import webHookHandlers from './app/helper/webhookHandler';
// import './app/helper/cronjobHandler';
const app = express();

// Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(cookieParser());
// app.post(
//   '/api/stripe/webhook',
//   express.raw({ type: 'application/json' }),
//   webHookHandlers,
// );

// app.ts - Webhook রিকোয়েস্ট লগ করার জন্য
app.post(
  '/api/paypal/webhook',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    console.log('🔄 PayPal Webhook Received');
    console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
    console.log('📦 Raw Body:', req.body.toString('utf8').substring(0, 500));

    // Parse the raw body to JSON for logging
    try {
      const bodyJson = JSON.parse(req.body.toString('utf8'));
      console.log('🔍 Event Type:', bodyJson.event_type);
      console.log('💰 Resource Type:', bodyJson.resource_type);
      console.log('📝 Resource:', JSON.stringify(bodyJson.resource, null, 2));
    } catch (error) {
      console.log('❌ Could not parse webhook body');
    }

    next();
  },
  webHookHandlers,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application routes (Centralized router)
app.use('/api/v1', router);

// Root router
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the server' });
});

// Not found route
app.use(notFoundError);

// Global error handler
app.use(globalErrorHandler);

export default app;
