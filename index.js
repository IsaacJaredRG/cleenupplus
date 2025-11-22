import mqtt from "mqtt";
import mongoose from "mongoose";

// =========================
//  CONFIGURACIONES
// =========================

// Dirección de tu ChirpStack MQTT
const MQTT_BROKER = "mqtt://192.168.18.62";

// ID de tu aplicación en ChirpStack v4
const APPLICATION_ID = "3759e78a-a663-4a08-bf0b-f0fbbabd2104";

// DevEUI de tu dispositivo
const DEV_EUI = "fa143f41e5a38b92";

// Topic MQTT del dispositivo
const TOPIC = `chirpstack/application/${APPLICATION_ID}/device/${DEV_EUI}/event/up`;

// =========================
//  CONEXIÓN A MONGODB
// =========================

mongoose.connect("mongodb://127.0.0.1:27017/cleenup", {
})
.then(() => console.log("🟢 MongoDB conectado"))
.catch(err => console.error("🔴 Error MongoDB:", err));

// Modelo para guardar los datos
const MessageSchema = new mongoose.Schema({
    devEUI: String,
    data: Object,
    ts: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", MessageSchema);

// =========================
//  CONEXIÓN A MQTT
// =========================

const client = mqtt.connect(MQTT_BROKER);

client.on("connect", () => {
    console.log("🟢 Conectado a MQTT");

    client.subscribe(TOPIC, (err) => {
        if (err) {
            console.error("Error al suscribir:", err);
        } else {
            console.log(`📡 Escuchando: ${TOPIC}`);
        }
    });
});

// =========================
//  PROCESO DE MENSAJES
// =========================

client.on("message", async (topic, msg) => {
    try {
        const json = JSON.parse(msg.toString());

        console.log("📥 Mensaje recibido:");
        console.log(JSON.stringify(json, null, 2));

        // ChirpStack envía payload en base64, decodifiquemos si existe
        let decoded = {};
        if (json.data) {
            const buffer = Buffer.from(json.data, "base64");
            try {
                decoded = JSON.parse(buffer.toString());
                console.log("📤 Payload decodificado:", decoded);
            } catch {
                console.log("⚠ Payload no es JSON, contenido bruto:", buffer.toString());
            }
        }

        // Guardar en MongoDB
        await Message.create({
            devEUI: json.deviceInfo.devEui,
            data: decoded
        });

        console.log("💾 Guardado en MongoDB\n");

    } catch (err) {
        console.error("❌ Error al procesar mensaje:", err);
    }
});
