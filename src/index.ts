import express, { Request, Response } from "express";
import * as QueryString from "qs";
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
/**
 * @openapi
 * openapi: 3.0.0
 * info:
 *   title: Management Report Dashboard API
 *   description: API para obtener datos de consumo energético en diferentes períodos
 *   version: 1.0.0
 *
 * servers:
 *   - url: https://backend-dev-eta.vercel.app
 *     description: Production server
 *   - url: http://localhost:3000
 *     description: Development server
 *
 * paths:
 *   /management/report/dashboard/data:
 *     get:
 *       summary: Obtener datos del dashboard de consumo energético
 *       description: Devuelve los datos de consumo energético para un sitio específico y período determinado.
 *       parameters:
 *         - name: period
 *           in: query
 *           description: Período de tiempo para el que se solicita la información.
 *           required: true
 *           schema:
 *             type: string
 *             enum: [this-year, past-year, last-year, this-month, past-month, last-month]
 *         - name: siteId
 *           in: query
 *           description: Identificador del sitio.
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Datos de consumo energético obtenidos exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   siteId:
 *                     type: string
 *                     description: Identificador del sitio.
 *                   period:
 *                     type: string
 *                     description: Período de tiempo solicitado.
 *                   status:
 *                     type: string
 *                     description: Estado de la respuesta.
 *                     example: success
 *                   energyData:
 *                     type: array
 *                     description: Datos de consumo energético.
 *                     items:
 *                       type: object
 *                       properties:
 *                         month:
 *                           type: string
 *                           description: Mes en formato abreviado (presente si el período es anual).
 *                           example: Jan
 *                         day:
 *                           type: integer
 *                           description: Día del mes (presente si el período es mensual).
 *                           example: 15
 *                         consumption:
 *                           type: number
 *                           format: float
 *                           description: Consumo energético en kWh.
 *                           example: 500.25
 *                         demand:
 *                           type: number
 *                           format: float
 *                           description: Demanda energética en kW.
 *                           example: 200.75
 *                         cost:
 *                           type: number
 *                           format: float
 *                           description: Costo asociado al consumo energético.
 *                           example: 150.50
 *                         totalCost:
 *                           type: number
 *                           format: float
 *                           description: Costo total del consumo energético.
 *                           example: 1000.00
 *         400:
 *           description: Parámetros inválidos o faltantes.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "Missing required parameters: period or siteId"
 *         500:
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "Internal server error"
 */
const app = express();
const port = process.env.PORT || 3000;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Building Management API",
      version: "1.0.0",
      description:
        "Building Management API for fetching data for a building management system",
      contact: {
        name: "Luis Rivera",
        email: "rluis747@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/**/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.send("Hello from TypeScript with Express!");
});

app.get(
  "/efficiency/data",
  (
    req: Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>,
    res: Response
  ) => {
    try {
      const { query } = req;
      const { siteId, equipmentType, date } = query;

      if (!siteId || !equipmentType || !date) {
        throw res.status(400).send("Missing required parameters");
      }

      if (equipmentType === "chiller") {
        const baseDate = new Date(date as string); // Use the provided date as the base
        baseDate.setHours(0, 0, 0, 0); // Reset to the start of the day (00:00)

        const response = Array.from({ length: 70 }, (_, i) => {
          const currentDate = new Date(baseDate);
          currentDate.setMinutes(currentDate.getMinutes() + i * 15); // Increment by 15-minute intervals

          // Custom formatting to "MM-DD-YYYY HH:mm"
          const month = (currentDate.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const day = currentDate.getDate().toString().padStart(2, "0");
          const year = currentDate.getFullYear();
          const hours = currentDate.getHours().toString().padStart(2, "0");
          const minutes = currentDate.getMinutes().toString().padStart(2, "0");
          const formattedDate = `${month}-${day}-${year} ${hours}:${minutes}`;

          return {
            chiller_2_actual_eff: (Math.random() * (0.6 - 0.4) + 0.4).toFixed(
              2
            ),
            chiller_1_actual_eff: (
              Math.random() * (0.61 - 0.41) +
              0.41
            ).toFixed(2),
            chiller_3_actual_eff: (
              Math.random() * (0.63 - 0.43) +
              0.43
            ).toFixed(2),
            date: formattedDate, // Use the custom formatted date
            chiller_2_target_eff: (
              Math.random() * (0.62 - 0.42) +
              0.42
            ).toFixed(2),
            chiller_1_target_eff: (
              Math.random() * (0.63 - 0.43) +
              0.43
            ).toFixed(2),
            chiller_3_target_eff: (
              Math.random() * (0.64 - 0.44) +
              0.44
            ).toFixed(2),
          };
        });

        res.status(200).json({
          rows: response,
          siteId,
          status: "success",
          messages: "Data fetched successfully",
        });
      }

      if (equipmentType === "cwPump") {
        const baseDate = new Date(date as string); // Use the provided date as the base
        baseDate.setHours(0, 0, 0, 0); // Reset to the start of the day (00:00)

        const response = Array.from({ length: 70 }, (_, i) => {
          const currentDate = new Date(baseDate);
          currentDate.setMinutes(currentDate.getMinutes() + i * 15); // Increment by 15-minute intervals

          // Custom formatting to "MM-DD-YYYY HH:mm"
          const month = (currentDate.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const day = currentDate.getDate().toString().padStart(2, "0");
          const year = currentDate.getFullYear();
          const hours = currentDate.getHours().toString().padStart(2, "0");
          const minutes = currentDate.getMinutes().toString().padStart(2, "0");
          const formattedDate = `${month}-${day}-${year} ${hours}:${minutes}`;

          return {
            cwPump_1_actual_eff: (Math.random() * (0.6 - 0.4) + 0.4).toFixed(2),
            cwPump_2_actual_eff: (Math.random() * (0.61 - 0.41) + 0.41).toFixed(
              2
            ),
            cwPump_3_actual_eff: (Math.random() * (0.63 - 0.43) + 0.43).toFixed(
              2
            ),
            date: formattedDate, // Use the custom formatted date
            cwPump_1_target_eff: (Math.random() * (0.62 - 0.42) + 0.42).toFixed(
              2
            ),
            cwPump_2_target_eff: (Math.random() * (0.63 - 0.43) + 0.43).toFixed(
              2
            ),
            cwPump_3_target_eff: (Math.random() * (0.64 - 0.44) + 0.44).toFixed(
              2
            ),
          };
        });

        res.status(200).json({
          rows: response,
          siteId,
          status: "success",
          messages: "Data fetched successfully",
        });
      }

      if (equipmentType === "chwPump") {
        const baseDate = new Date(date as string); // Use the provided date as the base
        baseDate.setHours(0, 0, 0, 0); // Reset to the start of the day (00:00)

        const response = Array.from({ length: 70 }, (_, i) => {
          const currentDate = new Date(baseDate);
          currentDate.setMinutes(currentDate.getMinutes() + i * 15); // Increment by 15-minute intervals

          // Custom formatting to "MM-DD-YYYY HH:mm"
          const month = (currentDate.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const day = currentDate.getDate().toString().padStart(2, "0");
          const year = currentDate.getFullYear();
          const hours = currentDate.getHours().toString().padStart(2, "0");
          const minutes = currentDate.getMinutes().toString().padStart(2, "0");
          const formattedDate = `${month}-${day}-${year} ${hours}:${minutes}`;

          return {
            chwPump_1_actual_eff: (Math.random() * (0.6 - 0.4) + 0.4).toFixed(
              2
            ),
            chwPump_2_actual_eff: (
              Math.random() * (0.61 - 0.41) +
              0.41
            ).toFixed(2),
            chwPump_3_actual_eff: (
              Math.random() * (0.63 - 0.43) +
              0.43
            ).toFixed(2),
            date: formattedDate, // Use the custom formatted date
            chwPump_1_target_eff: (
              Math.random() * (0.62 - 0.42) +
              0.42
            ).toFixed(2),
            chwPump_2_target_eff: (
              Math.random() * (0.63 - 0.43) +
              0.43
            ).toFixed(2),
            chwPump_3_target_eff: (
              Math.random() * (0.64 - 0.44) +
              0.44
            ).toFixed(2),
          };
        });

        res.status(200).json({
          rows: response,
          siteId,
          status: "success",
          messages: "Data fetched successfully",
        });
      }
    } catch (error) {
      console.error("Error in /efficiency/data", error);
      res.status(500).send("Internal server error");
    }
  }
);

app.get(
  "/analytics/data",
  (
    req: Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>,
    res: any
  ) => {
    try {
      const { query } = req;
      const { equipments, date } = query;

      if (!equipments || !date) {
        return res.status(400).send("Missing required parameters");
      }

      const equipmentList =
        typeof equipments === "string"
          ? equipments.split(",").map((equipment) => equipment.toLowerCase())
          : [];
      const baseDate = new Date(date as string);
      baseDate.setHours(0, 0, 0, 0);

      const response = Array.from({ length: 22 }, (_, i) => {
        const currentDate = new Date(baseDate);
        currentDate.setHours(currentDate.getHours() + i * 2);

        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const day = currentDate.getDate().toString().padStart(2, "0");
        const year = currentDate.getFullYear();
        const hours = currentDate.getHours().toString().padStart(2, "0");
        const minutes = currentDate.getMinutes().toString().padStart(2, "0");
        const formattedDate = `${month}-${day}-${year} ${hours}:${minutes}`;

        const data = equipmentList.reduce((acc: any, equipment: string) => {
          const formattedEquipment = equipment.replace(/(\d+)/, "_$1");
          acc[`${formattedEquipment}_cw_leaving_temp`] = (
            Math.random() * (85 - 75) +
            75
          ).toFixed(2);
          acc[`${formattedEquipment}_cw_entering_temp`] = (
            Math.random() * (80 - 70) +
            70
          ).toFixed(2);
          acc[`${formattedEquipment}_chw_entering_temp`] = (
            Math.random() * (60 - 50) +
            50
          ).toFixed(2);
          acc[`${formattedEquipment}_chw_leaving_temp`] = (
            Math.random() * (55 - 45) +
            45
          ).toFixed(2);
          acc[`${formattedEquipment}_efficiency`] = (
            Math.random() * (0.75 - 0.48) +
            0.48
          ).toFixed(2);
          acc[`${formattedEquipment}_tonnage`] = (
            Math.random() * (600 - 500) +
            500
          ).toFixed(0);
          acc[`${formattedEquipment}_vfd_speed`] = (
            Math.random() * (80 - 60) +
            60
          ).toFixed(0);
          acc[`${formattedEquipment}_running_load`] = (
            Math.random() * (40 - 30) +
            30
          ).toFixed(0);
          acc[`${formattedEquipment}_status`] = Math.floor(Math.random() * 2)
            ? "ON"
            : "OFF";
          acc[`${formattedEquipment}_flow_rate`] = (
            Math.random() * (1400 - 1200) +
            1200
          ).toFixed(0);
          acc["date"] = formattedDate;
          return acc;
        }, {});

        return data;
      });

      res.status(200).json({
        equipments: equipmentList,
        data: response,
        status: "success",
        messages: "Data fetched successfully",
      });
    } catch (error) {
      console.error("Error in /analytics/data", error);
      res.status(500).send("Internal server error");
    }
  }
);

app.get(
  "/notifications/data",
  (
    req: Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>,
    res: any
  ) => {
    try {
      const { query } = req;
      const { siteId } = query;

      if (!siteId) {
        return res.status(400).send("Missing required parameters");
      }
      const icons = ["Settings", "AlertCircle", "Zap", "Droplet"];
      const notificationTypes = [
        {
          cause: "Chiller efficiency range should be between 0.61 and 0.65",
          equipment: "Chiller 2",
          icon: icons[Math.floor(Math.random() * icons.length)],
          location: "Chiller Plant",
          message: "Chiller Efficiency Out of Range",
          notificationType: "Efficiency",
          solution: "Chiller efficiency range should be between 0.61 and 0.65",
        },
        {
          cause: "Chiller efficiency range should be between 0.61 and 0.65",
          equipment: "Chiller 1",
          icon: icons[Math.floor(Math.random() * icons.length)],
          location: "Chiller Plant",
          message: "Chiller Efficiency Out of Range",
          notificationType: "Efficiency",
          solution: "Chiller efficiency range should be between 0.61 and 0.65",
        },
        {
          cause: "High energy consumption detected",
          equipment: "Pump 3",
          icon: icons[Math.floor(Math.random() * icons.length)],
          location: "Basement",
          message: "Pump Overload Detected",
          notificationType: "Energy",
          solution: "Inspect and reduce pump load to normal levels.",
        },
        {
          cause: "Cooling tower fan speed out of range",
          equipment: "Cooling Tower 1",
          icon: icons[Math.floor(Math.random() * icons.length)],
          location: "Roof",
          message: "Fan Speed Out of Range",
          notificationType: "Maintenance",
          solution: "Adjust fan speed to stay within optimal range.",
        },
        {
          cause: "Temperature sensor malfunction detected",
          equipment: "Sensor 5",
          icon: icons[Math.floor(Math.random() * icons.length)],
          location: "Main Hall",
          message: "Sensor Reading Error",
          notificationType: "Sensor",
          solution: "Replace or recalibrate the temperature sensor.",
        },
      ];

      const notifications = Array.from({ length: 30 }, () => {
        const baseNotification = {
          cause: "",
          duration: `${(Math.random() * 10 + 1).toFixed(2)}h`,
          equipment: "",
          icon: "",
          location: "",
          message: "",
          notificationType: "",
          priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
          siteId: `p:site:r:${Math.random().toString(36).substring(2, 15)}`,
          solution: "",
          monthlyCost: Math.floor(Math.random() * 300 + 100),
        };

        const randomType =
          notificationTypes[
            Math.floor(Math.random() * notificationTypes.length)
          ];
        return { ...baseNotification, ...randomType };
      });

      res.status(200).json({
        rows: notifications,
        status: "success",
        messages: "Data fetched successfully",
      });
    } catch (error) {
      console.error("Error in /notifications/data", error);
      res.status(500).send("Internal server error");
    }
  }
);

app.get(
  "/management/tonnage/data",
  (
    req: Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>,
    res: any
  ) => {
    try {
      const { query } = req;
      const { siteId, period } = query;

      if (!siteId || !period) {
        return res.status(400).send("Missing required parameters");
      }

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const baseDate = new Date();
      let response;

      switch (period) {
        case "thisMonth":
          response = Array.from({ length: baseDate.getDate() }, (_, i) => {
            const currentDate = new Date(baseDate);
            currentDate.setDate(currentDate.getDate() - i);

            const month = months[currentDate.getMonth()];
            const day = currentDate.getDate().toString().padStart(2, "0");

            return {
              date: `${day} ${month}`,
              currentYearTons: Math.floor(
                Math.random() * (100000 - 20000) + 20000
              ),
              previousYearTons: Math.floor(
                Math.random() * (100000 - 20000) + 20000
              ),
            };
          });
          break;
        case "lastMonth":
          const lastMonthDate = new Date(baseDate);
          lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
          const daysInLastMonth = new Date(
            lastMonthDate.getFullYear(),
            lastMonthDate.getMonth() + 1,
            0
          ).getDate();
          response = Array.from({ length: daysInLastMonth }, (_, i) => {
            const currentDate = new Date(lastMonthDate);
            currentDate.setDate(currentDate.getDate() - i);

            const month = months[currentDate.getMonth()];
            const day = currentDate.getDate().toString().padStart(2, "0");

            return {
              date: `${day} ${month}`,
              currentYearTons: Math.floor(
                Math.random() * (100000 - 20000) + 20000
              ),
              previousYearTons: Math.floor(
                Math.random() * (100000 - 20000) + 20000
              ),
            };
          });
          break;
        case "thisYear":
          response = Array.from({ length: baseDate.getMonth() + 1 }, (_, i) => {
            const currentDate = new Date(baseDate);
            currentDate.setMonth(currentDate.getMonth() - i);

            const month = months[currentDate.getMonth()];

            return {
              date: `${month}`,
              currentYearTons: Math.floor(
                Math.random() * (1000000 - 200000) + 200000
              ),
              previousYearTons: Math.floor(
                Math.random() * (1000000 - 200000) + 200000
              ),
            };
          });
          break;
        default:
          return res.status(400).send("Invalid period value");
      }

      res.status(200).json({
        series: response,
        status: "success",
        messages: "Data fetched successfully",
      });
    } catch (error) {
      console.error("Error in /management/tonnage/data", error);
      res.status(500).send("Internal server error");
    }
  }
);

app.get(
  "/management/energy/cost/data",
  (
    req: Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>,
    res: any
  ) => {
    try {
      const { query } = req;
      const { siteId, type } = query;

      if (!siteId || !type) {
        return res.status(400).send("Missing required parameters");
      }

      const energyConsumptionData = {
        monthToDateEnergyConsumption: {
          label: "Month to Date Energy Consumption",
          value: (Math.random() * 100000).toFixed(0),
          unit: "kWh",
        },
        projectedEnergyConsumption: {
          label: "Projected Energy Consumption This Month",
          value: (Math.random() * 100000).toFixed(0),
          unit: "kWh",
          status: {
            text: `${(Math.random() * 10).toFixed(1)}% Above Target`,
            color: "text-red-500",
          },
        },
        energyUsageLastMonth: {
          label: "Energy Consumption Last Month",
          value: (Math.random() * 100000).toFixed(0),
          unit: "kWh",
        },
        energyUsageYearToDate: {
          label: "Energy Consumption Year to Date",
          value: (Math.random() * 100000).toFixed(0),
          unit: "kWh",
        },
        annualEnergySavingsToDate: {
          label: "Annual Energy Savings to Date",
          value: (Math.random() * 100000).toFixed(0),
          unit: "kWh",
        },
        totalEnergySavingsFromGoLive: {
          label: "Total Energy Savings from Go Live",
          value: (Math.random() * 100000).toFixed(0),
          unit: "kWh",
        },
        chillerPlantPercentage: {
          label: "Chiller Plant % of Total Energy Usage",
          value: (Math.random() * 100).toFixed(0),
          unit: "%",
        },
      };

      const energyCostData = {
        monthToDateEnergyCost: {
          label: "Month to Date Energy Cost",
          value: `$ ${(Math.random() * 100000).toFixed(0)}`,
        },
        projectedEnergyCost: {
          label: "Projected Energy Cost This Month",
          value: `$ ${(Math.random() * 100000).toFixed(0)}`,
          status: {
            text: `${(Math.random() * 10).toFixed(1)}% Lower than Target`,
            color: "text-green-600",
          },
        },
        energyCostLastMonth: {
          label: "Energy Cost Last Month",
          value: `$ ${(Math.random() * 100000).toFixed(0)}`,
        },
        energyCostYearToDate: {
          label: "Energy Cost Year to Date",
          value: `$ ${(Math.random() * 1000000).toFixed(0)}`,
          status: {
            text: `Exceeding budget by ${(Math.random() * 10).toFixed(1)}%`,
            color: "text-red-600",
          },
        },
        annualCostSavingsToDate: {
          label: "Annual Cost Savings to Date",
          value: `$ ${(Math.random() * 100000).toFixed(0)}`,
        },
        totalCostSavingsFromGoLive: {
          label: "Total Cost Savings from Go Live",
          value: `$ ${(Math.random() * 1000000).toFixed(0)}`,
        },
      };

      let responseData;

      if (type === "consumption") {
        responseData = energyConsumptionData;
      } else if (type === "cost") {
        responseData = energyCostData;
      } else {
        return res.status(400).send("Invalid type parameter");
      }

      res.status(200).json({
        data: responseData,
        status: "success",
        messages: "Data fetched successfully",
      });
    } catch (error) {
      console.error("Error in /management/energy/cost/data", error);
      res.status(500).send("Internal server error");
    }
  }
);

const timeOptions = [
  { value: "this-year", label: "This Year" },
  { value: "past-year", label: "Past Year" },
  { value: "last-year", label: "Last Year" },
  { value: "this-month", label: "This Month" },
  { value: "past-month", label: "Past Month" },
  { value: "last-month", label: "Last Month" },
];

app.get(
  "/management/report/dashboard/data",
  (
    req: Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>,
    res: any
  ) => {
    try {
      const { period, siteId } = req.query;

      if (!period || !siteId) {
        return res
          .status(400)
          .json({ error: "Missing required parameters: period or siteId" });
      }

      const validPeriods = timeOptions.map((option) => option.value);

      if (!validPeriods.includes(period as string)) {
        return res.status(400).json({ error: "Invalid period value" });
      }

      const now = new Date();
      let energyData: Array<{
        month?: string;
        day?: number;
        consumption: number;
        demand: number;
        cost: number;
        totalCost?: number;
      }> = [];

      if (period === "this-year") {
        energyData = Array.from({ length: now.getMonth() + 1 }, (_, i) => {
          return {
            month: new Date(0, i).toLocaleString("en-US", { month: "short" }),
            consumption: parseFloat((Math.random() * 1000).toFixed(2)),
            demand: parseFloat((Math.random() * 500).toFixed(2)),
            cost: parseFloat((Math.random() * 1000).toFixed(2)),
            totalCost: parseFloat((Math.random() * 1000).toFixed(2)),
          };
        });
      } else if (period === "past-year") {
        const pastYearStart = new Date(now);
        pastYearStart.setFullYear(now.getFullYear() - 1);
        energyData = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(pastYearStart);
          date.setMonth(pastYearStart.getMonth() + i);
          return {
            month: date.toLocaleString("en-US", { month: "short" }),
            consumption: parseFloat((Math.random() * 1000).toFixed(2)),
            demand: parseFloat((Math.random() * 500).toFixed(2)),
            cost: parseFloat((Math.random() * 1000).toFixed(2)),
            totalCost: parseFloat((Math.random() * 1000).toFixed(2)),
          };
        });
      } else if (period === "last-year") {
        energyData = Array.from({ length: 12 }, (_, i) => {
          return {
            month: new Date(0, i).toLocaleString("en-US", { month: "short" }),
            consumption: parseFloat((Math.random() * 1000).toFixed(2)),
            demand: parseFloat((Math.random() * 500).toFixed(2)),
            cost: parseFloat((Math.random() * 1000).toFixed(2)),
            totalCost: parseFloat((Math.random() * 1000).toFixed(2)),
          };
        });
      } else if (period === "this-month") {
        energyData = Array.from({ length: now.getDate() }, (_, i) => {
          return {
            day: i + 1,
            consumption: parseFloat((Math.random() * 100).toFixed(2)),
            demand: parseFloat((Math.random() * 50).toFixed(2)),
            cost: parseFloat((Math.random() * 100).toFixed(2)),
            totalCost: parseFloat((Math.random() * 1000).toFixed(2)),
          };
        });
      } else if (period === "past-month") {
        const pastMonthStart = new Date(now);
        pastMonthStart.setMonth(now.getMonth() - 1);
        energyData = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(pastMonthStart);
          date.setDate(pastMonthStart.getDate() + i);
          return {
            day: date.getDate(),
            consumption: parseFloat((Math.random() * 100).toFixed(2)),
            demand: parseFloat((Math.random() * 50).toFixed(2)),
            cost: parseFloat((Math.random() * 100).toFixed(2)),
            totalCost: parseFloat((Math.random() * 1000).toFixed(2)),
          };
        });
      } else if (period === "last-month") {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const daysInLastMonth = new Date(
          lastMonth.getFullYear(),
          lastMonth.getMonth() + 1,
          0
        ).getDate();
        energyData = Array.from({ length: daysInLastMonth }, (_, i) => {
          return {
            day: i + 1,
            consumption: parseFloat((Math.random() * 100).toFixed(2)),
            demand: parseFloat((Math.random() * 50).toFixed(2)),
            cost: parseFloat((Math.random() * 100).toFixed(2)),
            totalCost: parseFloat((Math.random() * 1000).toFixed(2)),
          };
        });
      }

      res.status(200).json({
        siteId,
        period,
        status: "success",
        energyData,
      });
    } catch (error) {
      console.error("Error fetching dashboard data", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
