import mqtt from "mqtt";
import { db } from "./firebase.js";

const client = mqtt.connect("mqtt://127.0.0.1");

client.on("connect", () => {
  console.log("Conectado a MQTT");
  client.subscribe("application/1/device/+/event/up");
});

client.on("message", async (topic, message) => {
  try {
    const msg = JSON.parse(message.toString());
    console.log("Mensaje recibido:", topic, msg);

    // Guardar en Firebase
    await db.collection("messages").add({
      topic: topic,
      devEUI: msg.devEUI || "unknown",
      data: msg.object || {},
      timestamp: new Date()
    });

    console.log("💾 Mensaje guardado en Firebase Firestore");
  } catch (error) {
    console.error("Error al procesar mensaje:", error);
  }
});
