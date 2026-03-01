import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class InventoryServer {

    public static void main(String[] args) throws IOException {

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        server.createContext("/add-item", new AddHandler());
        server.createContext("/delete-item", new DeleteHandler());

        server.setExecutor(null);
        server.start();

        System.out.println(" Server is running on http://localhost:8080");
        System.out.println(" Waiting for data from Web Page...");
    }

    // ================= ADD HANDLER =================
    static class AddHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {

            setHeaders(exchange);

            // CORS Preflight fix
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {

                String body = new String(
                        exchange.getRequestBody().readAllBytes(),
                        StandardCharsets.UTF_8
                );

                // Show terminal data
                System.out.println("\n📥 Received Data (To Add): " + body);

                saveToFile(body);

                System.out.println("✅ Successfully saved to inventory.txt");

                sendResponse(exchange, "Item Added Successfully!");
            }
        }
    }

    // ================= DELETE HANDLER =================
    static class DeleteHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {

            setHeaders(exchange);

            // CORS Preflight fix
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {

                String body = new String(
                        exchange.getRequestBody().readAllBytes(),
                        StandardCharsets.UTF_8
                );

                // Show terminal data
                System.out.println("\n🗑️ Received Data (To Delete): " + body);

                deleteFromFile(body);

                System.out.println("✅ Successfully removed from inventory.txt");

                sendResponse(exchange, "Item Deleted Successfully!");
            }
        }
    }

    // ================= SAVE TO FILE =================
    private static void saveToFile(String data) throws IOException {
        try (PrintWriter writer = new PrintWriter(new FileWriter("inventory.txt", true))) {
            writer.println(data);
        }
    }

    // ================= DELETE FROM FILE =================
    private static void deleteFromFile(String dataToRemove) throws IOException {

        File inputFile = new File("inventory.txt");
        File tempFile = new File("temp_inventory.txt");

        try (BufferedReader reader = new BufferedReader(new FileReader(inputFile));
             PrintWriter writer = new PrintWriter(new FileWriter(tempFile))) {

            String line;
            while ((line = reader.readLine()) != null) {

                if (!line.trim().equals(dataToRemove.trim())) {
                    writer.println(line);
                }
            }
        }

        if (inputFile.delete()) {
            tempFile.renameTo(inputFile);
        }
    }

    // ================= CORS HEADERS =================
    private static void setHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
    }

    // ================= SEND RESPONSE =================
    private static void sendResponse(HttpExchange exchange, String response) throws IOException {
        exchange.sendResponseHeaders(200, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}