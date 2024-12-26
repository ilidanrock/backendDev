import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from TypeScript with Express!');
});

app.get('/efficiency/data', (req, res) => {
  try {
    const { query } = req;
    const { siteId, equipmentType, date } = query;

    if (!siteId || !equipmentType || !date) {
      throw res.status(400).send('Missing required parameters');
    }

    if (equipmentType === "chillers") {
      const baseDate = new Date(date as string); // Use the provided date as the base
      baseDate.setHours(0, 0, 0, 0); // Reset to the start of the day (00:00)

      const response = Array.from({ length: 70 }, (_, i) => {
        const currentDate = new Date(baseDate);
        currentDate.setMinutes(currentDate.getMinutes() + i * 15); // Increment by 15-minute intervals

        // Custom formatting to "MM-DD-YYYY HH:mm"
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${month}-${day}-${year} ${hours}:${minutes}`;

        return {
          chiller_2_actual_eff: (Math.random() * (0.60 - 0.40) + 0.40).toFixed(2),
          chiller_1_actual_eff: (Math.random() * (0.61 - 0.41) + 0.41).toFixed(2),
          chiller_3_actual_eff: (Math.random() * (0.63 - 0.43) + 0.43).toFixed(2),
          date: formattedDate, // Use the custom formatted date
          chiller_2_target_eff: (Math.random() * (0.62 - 0.42) + 0.42).toFixed(2),
          chiller_1_target_eff: (Math.random() * (0.63 - 0.43) + 0.43).toFixed(2),
          chiller_3_target_eff: (Math.random() * (0.64 - 0.44) + 0.44).toFixed(2),
        };
      });

      res.status(200).json({
        rows: response,
        siteId,
        status: "success",
        messages: "Data fetched successfully"
      });
    }

    if (equipmentType === "cwPump" || equipmentType === "chwPump") {
      const baseDate = new Date(date as string); // Use the provided date as the base
      baseDate.setHours(0, 0, 0, 0); // Reset to the start of the day (00:00)

      const response = Array.from({ length: 70 }, (_, i) => {
        const currentDate = new Date(baseDate);
        currentDate.setMinutes(currentDate.getMinutes() + i * 15); // Increment by 15-minute intervals

        // Custom formatting to "MM-DD-YYYY HH:mm"
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${month}-${day}-${year} ${hours}:${minutes}`;

        return {
          cwPump_1_actual_eff: (Math.random() * (0.60 - 0.40) + 0.40).toFixed(2),
          cwPump_2_actual_eff: (Math.random() * (0.61 - 0.41) + 0.41).toFixed(2),
          cwPump_3_actual_eff: (Math.random() * (0.63 - 0.43) + 0.43).toFixed(2),
          date: formattedDate, // Use the custom formatted date
          cwPump_1_target_eff: (Math.random() * (0.62 - 0.42) + 0.42).toFixed(2),
          cwPump_2_target_eff: (Math.random() * (0.63 - 0.43) + 0.43).toFixed(2),
          cwPump_3_target_eff: (Math.random() * (0.64 - 0.44) + 0.44).toFixed(2),
        };
      });

      res.status(200).json({
        rows: response,
        siteId,
        status: "success",
        messages: "Data fetched successfully"
      });
    }
  } catch (error) {
    console.error('Error in /efficiency/data', error);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
