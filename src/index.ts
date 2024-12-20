import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from TypeScript with Express!');
});

app.get('/efficiency/data', (req, res) => {
  try {
    const { query } = req
    const { siteId , equipmentType ,  date } = query
    console.log(siteId, equipmentType, date);
  } catch (error) {
    console.log(error);
    
  }
}
)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
