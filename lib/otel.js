const { NodeSDK } = require("@opentelemetry/sdk-node");
// This is a helper function that will automatically enable instrumentations for you
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");

const logsAPI = require("@opentelemetry/api-logs");
const { LoggerProvider, BatchLogRecordProcessor } = require("@opentelemetry/sdk-logs");
const { WinstonInstrumentation } = require("@opentelemetry/instrumentation-winston");

const { PeriodicExportingMetricReader } = require("@opentelemetry/sdk-metrics");

// Exporters are used to send telemetry data to the backend (or the collector)
const { OTLPLogExporter } = require("@opentelemetry/exporter-logs-otlp-http");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-proto");
const { OTLPMetricExporter } = require("@opentelemetry/exporter-metrics-otlp-proto");

// Set up the logger provider to work with winston
const loggerProvider = new LoggerProvider();
loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(new OTLPLogExporter()));
logsAPI.logs.setGlobalLoggerProvider(loggerProvider);
registerInstrumentations({ instrumentations: [new WinstonInstrumentation({})] });

const otelCollectorURL = process.env.OTEL_COLLECTOR_URL || "http://localhost:4318/v1";

// Setup OTel SDK
const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: otelCollectorURL + "/traces",
  }),

  logsExporter: new OTLPLogExporter({
    url: otelCollectorURL + "/logs",
  }),

  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: otelCollectorURL + "/metrics",
    }),
  }),

  instrumentations: [getNodeAutoInstrumentations()], // 🪄 The magic...
});

sdk.start();
