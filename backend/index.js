// backend/index.js
import express from 'express';
import sequelize from './config/database.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRouter from './routes/auth/index.js';
import titlesRouter from './routes/titles/index.js';
import userActivitiesRouter from './routes/userActivities.js';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import 'dotenv/config';

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cinema Guru API',
      version: '1.0.0',
      description: 'API documentation for the Holberton Cinema Guru project',
    },
    servers: [{ url: 'http://localhost:8000' }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./routes/**/*.js', './index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRouter);
app.use('/api/titles', titlesRouter);
app.use('/api/activity', userActivitiesRouter);

app.get('/', (req, res) => {
  res.send('Cinema Guru backend is running ');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is healthy' });
});

//  Initialize database and seed
sequelize.sync({ force: false })
  .then(async () => {
    console.log('Database & tables created!');
    console.log('Postgres Connected');
    fs.readFile('dump.sql', 'utf8', async (err, data) => {
      if (err) {
        console.error('Error reading dump.sql:', err);
        return;
      }
      await sequelize.query(data);
      console.log('DB Seeded');
    });
  })
  .catch(err => console.log(err));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}...`));
