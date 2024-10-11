import WebSocket, { WebSocketServer } from "ws";
import queryString from "query-string";

function websocketSetup(expressServer) {
  let allActiveConnections = new Map();
  let globalCounter = 0;
  const websocketServer = new WebSocketServer({
    noServer: true,
    path: "/ws",
  });
  expressServer.on("upgrade", (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit("connection", websocket, request);
    });
  });
  websocketServer
    .on(
      "connection",
      function connection(websocketConnection, connectionRequest) {
        const [_path, params] = connectionRequest?.url?.split("?");
        const connectionParams = queryString.parse(params);
        let id = globalCounter++;
        allActiveConnections[id] = websocketConnection;
        websocketConnection.id = id;
        websocketConnection.on("message", (message) => {
          const parsedMessage = JSON.parse(message);
          for (let conn in allActiveConnections) {
            allActiveConnections[conn].send(JSON.stringify(parsedMessage));
          }
        });
      }
    )
    .on("close", function (websocketConnection) {
      console.log("closing connection");
      delete allActiveConnections[websocketConnection.id];
    });
  return websocketServer;
}

export default websocketSetup;
