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
    if (!siteId || !equipmentType || !date) {
      throw res.status(400).send('Missing required parameters')
    }

    if (equipmentType === "chillers") {
      const response = Array.from({ length: 100 }, (_, i) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setHours(date.getHours() + (i % 12)); // Increment hours from 12 AM to 12 PM

      return {
        chiller_2_actual_eff: (Math.random() * (0.60 - 0.40) + 0.40).toFixed(2),
        chiller_1_actual_eff: (Math.random() * (0.61 - 0.41) + 0.41).toFixed(2),
        chiller_3_actual_eff: (Math.random() * (0.63 - 0.43) + 0.43).toFixed(2),
        date: date.toISOString(),
        chiller_2_target_eff: (Math.random() * (0.62 - 0.42) + 0.42).toFixed(2),
        chiller_1_target_eff: (Math.random() * (0.63 - 0.43) + 0.43).toFixed(2),
        chiller_3_target_eff: (Math.random() * (0.64 - 0.44) + 0.44).toFixed(2),
      }
      });
      res.status(200).json({
      rows: response,
      siteId,
      status: "success",
      messages: "Data fetched successfully"
      });
    }

  } catch (error) {
    console.error('Error in /efficiency/data', error)
    res.status(500).send('Internal server error')
  }
}
)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
